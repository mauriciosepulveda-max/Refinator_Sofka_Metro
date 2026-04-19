# Política de migración del schema `hu-calidad.schema.json`

Este documento define cómo versionamos el contrato de output del agente `hu-full-analyzer` y qué pasos seguir cuando el schema cambia.

El objetivo es que cambios al schema **no rompan silenciosamente** al dashboard, al consolidador ni a los outputs que ya existen en `output/**/data.json` o en los fixtures de regresión.

---

## 1. Dos conceptos que NO son lo mismo

| Campo | Dónde vive | Qué significa |
|---|---|---|
| `schemaVersion` | Meta del schema — propiedad top-level en `templates/core/hu-calidad.schema.json` | Versión del **contrato**. Se actualiza cuando se modifica el schema. |
| `schema_version` | Property dentro del output de cada HU — valor en el JSON que produce `hu-full-analyzer` | Versión con la que fue producido **ese output específico**. Se declara en cada JSON nuevo. |

Ejemplo:

```json
// templates/core/hu-calidad.schema.json (meta)
{
  "schemaVersion": "1.0.0",
  "changelog": [ { "version": "1.0.0", "fecha": "2026-04-18", "resumen": "Versión inicial formalizada..." } ],
  ...
}

// output/Sprint-X/data.json · historias[n] (instancia)
{
  "schema_version": "1.0.0",
  "hu_id": "US-01",
  ...
}
```

Cuando el schema pasa a 1.1.0, **los outputs previos siguen en 1.0.0**. No se reescriben. El dashboard debe saber leer ambas.

---

## 2. Regla de compatibilidad con outputs legacy

- Outputs **sin** `schema_version` → se asumen `1.0.0` para compatibilidad retroactiva. No fallan la validación.
- Outputs **nuevos** (producidos por `hu-full-analyzer` tras la v1.0.0) **DEBEN** declarar `schema_version`. Esto lo refuerza la instrucción del agente en [`.claude/agents/hu-full-analyzer.md`](../../.claude/agents/hu-full-analyzer.md).
- Cuando un output declara una versión `> schemaVersion`, el consolidador DEBE fallar con mensaje claro: *"output producido por schema vX.Y.Z; el runtime solo soporta hasta vA.B.C"*.

---

## 3. Semver aplicado al schema

| Bump | Cuándo | Ejemplo |
|---|---|---|
| **PATCH** (x.y.**Z**) | Cambios que no afectan al consumidor: correcciones de typos en `description`, nuevos `examples`, ajustes de regex equivalentes. | 1.0.0 → 1.0.1 al corregir un typo en la descripción de `hu_id`. |
| **MINOR** (x.**Y**.0) | Campos **opcionales** nuevos, nuevos enum values permitidos (que no bloquean los existentes), nuevas propiedades aditivas. Outputs v1.0.0 siguen siendo válidos bajo v1.1.0. | 1.0.0 → 1.1.0 al añadir `tareas[].ux_notes` opcional. |
| **MAJOR** (**X**.0.0) | Cambios **rompientes**: campos requeridos nuevos, renombrar campos, cambiar tipos, quitar enum values, endurecer `minLength`/`pattern` sobre campos existentes. Outputs v1.y.z dejan de ser válidos. | 1.3.2 → 2.0.0 al cambiar `calificacion_iso` de number a string `"4.5"`. |

Si hay duda, considera: *"¿un output válido bajo vX.0.0 seguirá pasando la validación bajo vY.0.0?"* Si la respuesta es no → es MAJOR.

---

## 4. Flujo al cambiar el schema (checklist por tipo)

### PATCH
1. Editar `templates/core/hu-calidad.schema.json` (solo descripciones/examples).
2. Bump `schemaVersion` → `1.0.0` → `1.0.1`.
3. Añadir entrada al `changelog` con fecha y resumen.
4. Correr `node -e "JSON.parse(...)"` para confirmar JSON válido.
5. Correr `bash scripts/preflight-check.sh`.

### MINOR
Lo anterior, más:
6. Actualizar [`.claude/agents/hu-full-analyzer.md`](../../.claude/agents/hu-full-analyzer.md) si el campo nuevo debe ser emitido por el agente.
7. Validar fixtures de regresión siguen pasando (`scripts/regression-check.js`).
8. Actualizar `schema_version` esperado en fixtures de regresión si aplica.

### MAJOR
Lo anterior, más:
9. Decidir estrategia de migración de outputs existentes (re-generar, dejar como legacy, o migrador ad-hoc).
10. Documentar el break en el `changelog` con sección `## BREAKING` explicando qué se rompe y cómo migrar.
11. Actualizar `scripts/consolidate-sprint.js` si lee campos que cambian.
12. Actualizar `templates/core/sprint-dashboard.html` si el dashboard lee campos que cambian.
13. Re-correr el análisis de un sprint de prueba end-to-end.

---

## 5. Detección de outputs legacy (pendiente de implementar)

> **Estado: aspiracional.** `scripts/consolidate-sprint.js` **no lee `schema_version` todavía**. Esta sección documenta el comportamiento objetivo, no el actual.

Cuando se implemente:
- El consolidador leerá `schema_version` de cada HU en `data.json`.
- Si falta → log `[RR·MIGRATE] HU <id> sin schema_version → asumiendo 1.0.0` y continuar.
- Si es mayor que el `schemaVersion` soportado → error claro con sugerencia de upgrade del framework.
- Si es menor y requiere migración → aplicar migrador correspondiente (a definir por MAJOR).

---

## 6. Validación con fixtures (flujo recomendado antes de mergear)

1. Corre `/refinar-sprint Sprint-dryrun --dry-run` — produce un output real del agente sobre la fixture bien formada.
2. Sobre ese output real (**no** sobre el .md de la fixture), corre:
   ```bash
   node scripts/validate-hu-json.js output/Sprint-dryrun/tmp/HU-dryrun.json
   node scripts/regression-check.js docs/HUs/_fixtures/Sprint-dryrun/HU-dryrun.expectations.json output/Sprint-dryrun/tmp/HU-dryrun.json
   ```
3. Repite con la fixture malformada (`HU-malformada.md`) para confirmar que el agente sigue detectando las degradaciones esperadas.
4. Si ambas fixtures pasan → el cambio es compatible en comportamiento y estructura.

Ver [`docs/HUs/_fixtures/README.md`](../HUs/_fixtures/README.md) para el contrato de las expectations y las reglas disponibles en `regression-check.js`.

---

## 7. Checklist antes de mergear cambios de schema

- [ ] `schemaVersion` bumped según la regla de Semver de la sección 3.
- [ ] `changelog` actualizado con fecha (ISO 8601) y resumen del cambio.
- [ ] Si es MAJOR: nota `## BREAKING` con guía de migración.
- [ ] `node -e "JSON.parse(require('fs').readFileSync('templates/core/hu-calidad.schema.json','utf8'))"` pasa.
- [ ] `bash scripts/preflight-check.sh` pasa 4/4.
- [ ] Si afecta al output del agente: `.claude/agents/hu-full-analyzer.md` actualizado.
- [ ] Si afecta al consolidador: `scripts/consolidate-sprint.js` actualizado y tests manuales OK.
- [ ] Si afecta al dashboard: `templates/core/sprint-dashboard.html` actualizado y probado abriendo el HTML generado.
- [ ] Fixtures de regresión pasan o se han ajustado conscientemente (con justificación en el PR).
- [ ] El PR menciona el bump de `schemaVersion` en el título o body.

---

## 8. Ajuste de fixtures: cuándo sí, cuándo no

Las expectations en `docs/HUs/_fixtures/Sprint-dryrun/*.expectations.json` son **golden**: las retocamos solo cuando el cambio es intencional y documentable.

| Situación | Acción |
|---|---|
| El modelo mejora y entrega mejores scores ISO en la fixture buena | ✅ Subir el `min` del rango, nota en el PR. |
| El modelo degrada y falla assertions que antes pasaba | ❌ **No** bajar el `min`. Investigar la regresión. |
| Se añade un campo nuevo al schema y las fixtures no lo tienen | ✅ Añadir assertion nueva si es critical, o ignorar si es opcional. |
| Un rango falla de forma intermitente (variance del modelo) | ⚠ Ampliar `between` **solo si** la variance es inherente al modelo y no es un bug. Documentar en el PR. |

---

## Referencias

- Schema: [`templates/core/hu-calidad.schema.json`](../../templates/core/hu-calidad.schema.json)
- Agente que produce: [`.claude/agents/hu-full-analyzer.md`](../../.claude/agents/hu-full-analyzer.md)
- Validación runtime: [`scripts/validate-hu-json.js`](../../scripts/validate-hu-json.js)
- Regression testing: [`scripts/regression-check.js`](../../scripts/regression-check.js)
- Fixtures: [`docs/HUs/_fixtures/README.md`](../HUs/_fixtures/README.md)
