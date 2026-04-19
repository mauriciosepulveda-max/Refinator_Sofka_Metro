# Fixtures de regresión del `hu-full-analyzer`

Este directorio contiene HUs sintéticas y sus **expectations doradas** para detectar regresiones del agente sin correr sobre HUs reales de clientes.

## Qué hay aquí

| Archivo | Rol |
|---|---|
| `Sprint-dryrun/HU-dryrun.md` | HU **bien formada** — narrativa clara, CAs verificables, contexto suficiente. |
| `Sprint-dryrun/HU-malformada.md` | HU **deliberadamente pobre** — narrativa vaga, CAs ambiguos, fluff words. |
| `Sprint-dryrun/HU-dryrun.expectations.json` | 22 assertions sobre el output esperado para la HU bien formada. |
| `Sprint-dryrun/HU-malformada.expectations.json` | 13 assertions sobre el output esperado para la HU pobre (scores bajos, ambigüedades detectadas, HITL ≥ 3). |

## Por qué existen

1. **Detectar regresiones del agente sin riesgo.** Podemos cambiar el schema, el prompt del agente o el consolidador, y saber si el comportamiento degrada, sin tener que correr sobre HUs reales del cliente.
2. **Aislar la validación estructural** (schema) de la validación de **comportamiento** (scores, cobertura, preguntas HITL). El schema responde *"¿el JSON es válido?"*; las expectations responden *"¿el análisis es el esperado para este tipo de HU?"*.
3. **Ejercitar el edge case `tareas = []`** — ambos expectations incluyen `tareas.length ≥ 1` como critical, porque un analyzer que entrega cero tareas es una regresión silenciosa que el schema por sí solo no detecta.

## Flujo de uso

1. **Producir un output real del agente**:
   ```bash
   /refinar-sprint Sprint-dryrun --dry-run
   ```
   Genera `output/Sprint-dryrun/tmp/<HU>.json` sin escribir el HTML final.

2. **Validar contra schema + expectations**:
   ```bash
   node scripts/validate-hu-json.js output/Sprint-dryrun/tmp/HU-dryrun.json
   node scripts/regression-check.js \
     docs/HUs/_fixtures/Sprint-dryrun/HU-dryrun.expectations.json \
     output/Sprint-dryrun/tmp/HU-dryrun.json
   ```

   > **Importante**: la validación se hace sobre el **output real** del agente (el JSON producido), no sobre el `.md` de la fixture. El `.md` es el *input* al agente.

3. **Repite con la fixture malformada** para confirmar que el agente sigue detectando las degradaciones esperadas.

4. Si ambas fixtures pasan → el cambio es compatible en comportamiento y estructura.

## Exit codes de `regression-check.js`

- `0` → todas las reglas `critical` pasan (las `warning` se reportan sin bloquear)
- `1` → al menos una regla `critical` falla
- `2` → error de entrada (archivos no legibles, JSON inválido, uso incorrecto)

## Contrato de las expectations

```json
{
  "fixture_id": "HU-dryrun",
  "descripcion": "explicación humana del propósito",
  "expectations": [
    { "rule": "<nombre>", "path": "<path>", "value": <...>, "severity": "critical" | "warning" }
  ]
}
```

Paths soportados:

- **Dot notation simple**: `"narrativa_refinada.rol"` navega `data.narrativa_refinada.rol`.
- **Iteración en array**: `"tareas[*].dod"` itera `data.tareas` y aplica `.dod` a cada elemento.
- **Array completo**: `"tareas[*]"` itera `data.tareas` sin sub-path (útil para `each_pert_coherent`).

## Reglas disponibles (13)

| Regla | Qué valida | Campos del rule |
|---|---|---|
| `equals` | Igualdad estricta (`===`). | `path`, `value` |
| `matches` | Regex sobre string. | `path`, `value` (string con regex) |
| `type` | `typeof` (incluyendo `array` y `null` como tipos distinguibles). | `path`, `value` |
| `minLength` | Longitud mínima de string. | `path`, `value` (int) |
| `min` | Valor numérico `≥`. | `path`, `value` (num) |
| `max` | Valor numérico `≤`. | `path`, `value` (num) |
| `between` | Valor numérico en rango inclusivo `[min, max]`. | `path`, `min`, `max` |
| `in` | Valor dentro de un enum. | `path`, `value` (array) |
| `contains_any` | String contiene al menos 1 substring de la lista. | `path`, `value` (array de strings) |
| `minArrayLength` | Longitud mínima de array. | `path`, `value` (int) |
| `each_minLength` | Cada elemento (string) tiene longitud `≥`. Requiere path con `[*]`. | `path`, `value` (int) |
| `each_min` | Cada elemento (num) `≥`. Requiere path con `[*]`. | `path`, `value` (num) |
| `each_pert_coherent` | Cada elemento tiene `estimacion_o ≤ estimacion_p ≤ estimacion_pe`. Requiere path con `[*]`. | `path` |

## Severidad

- `critical` → falla bloquea el exit code (retorna 1). El output no cumple el contrato mínimo.
- `warning` → se reporta pero no bloquea. Útil para tracking de variance esperable (p. ej. "dependencias debería ser array").

## Política de ajuste de expectations

Las expectations son **golden**: retocarlas es un cambio consciente, no una forma de "hacer pasar" una regresión.

| Situación | Acción |
|---|---|
| El modelo mejora y entrega mejores scores en la fixture buena. | ✅ Subir el `min` del rango, documentar en el PR. |
| El modelo degrada y falla assertions que antes pasaba. | ❌ **No** bajar el `min`. Investigar la regresión primero. |
| Se añade un campo nuevo al schema y las fixtures no lo tienen. | ✅ Añadir assertion nueva si es critical; ignorar si es opcional. |
| Un rango falla de forma intermitente (variance del modelo). | ⚠ Ampliar `between` **solo si** la variance es inherente. Documentar en PR. |

## Referencias

- Script: [`scripts/regression-check.js`](../../../scripts/regression-check.js)
- Schema: [`templates/core/hu-calidad.schema.json`](../../../templates/core/hu-calidad.schema.json)
- Agente: [`.claude/agents/hu-full-analyzer.md`](../../../.claude/agents/hu-full-analyzer.md)
- Política de migración del schema: [`docs/referencia/schema-migration-policy.md`](../../referencia/schema-migration-policy.md)
