# Plantilla: Riesgos y Dependencias

> **Uso:** Esta plantilla documenta el registro de riesgos e interdependencias del sprint de refinamiento. Se genera automáticamente por la skill `user-story-refiner` y se muestra en el dashboard HTML por cada Historia de Usuario. El PM debe revisar y validar cada ítem.

---

## 1. Registro de Riesgos del Sprint

### Escala de Clasificación

| Severidad | Criterio | Color RAG |
|---|---|---|
| **Alta** | Puede bloquear el sprint, comprometer entrega o impactar al cliente | 🔴 Rojo |
| **Media** | Requiere decisión o esfuerzo adicional, pero no bloquea el sprint | 🟡 Ámbar |
| **Baja** | Manejable sin escalar; impacto menor en tiempo o calidad | 🟢 Verde |

| Probabilidad | Criterio |
|---|---|
| **Alta** | Es probable que ocurra si no se actúa (>60%) |
| **Media** | Puede ocurrir bajo ciertas condiciones (30-60%) |
| **Baja** | Poco probable pero posible (<30%) |

---

### Tabla de Riesgos

| ID Riesgo | US Asociada | Descripción | Tipo | Severidad | Probabilidad | Índice de Riesgo | Mitigación | Responsable | Estado |
|---|---|---|---|---|---|---|---|---|---|
| R-01-01 | US-01 | [Descripción del riesgo] | Técnico / Funcional / Negocio / Externo | Alta | Media | **Alto** | [Acción concreta de mitigación] | [Persona/Squad] | Abierto |
| R-02-01 | US-02 | [Descripción] | [Tipo] | Media | Media | **Medio** | [Mitigación] | [Responsable] | Abierto |
| R-03-01 | US-03 | [Descripción] | [Tipo] | Baja | Baja | **Bajo** | [Mitigación] | [Responsable] | Abierto |

**Índice de Riesgo = Severidad × Probabilidad:**
- Alta×Alta = **Crítico** (escalar al PM inmediatamente)
- Alta×Media o Media×Alta = **Alto** (plan de mitigación inmediato)
- Media×Media = **Medio** (monitorear)
- Baja×cualquier = **Bajo** (aceptar o mitigar en próximo sprint)

---

### Tipos de Riesgo

- **Técnico:** Deuda técnica, tecnología nueva, integración compleja, performance
- **Funcional:** Requisito ambiguo, cambio de alcance, falta de información del negocio
- **Negocio:** Dependencia de decisión del cliente, cambio de prioridades, restricciones regulatorias
- **Externo:** Servicios de terceros, APIs externas, disponibilidad de entornos

---

## 2. Registro de Dependencias del Sprint

### Tipos de Dependencia

| Tipo | Descripción | Símbolo |
|---|---|---|
| **Historia→Historia** | Esta US requiere que otra US esté completada primero | → |
| **Historia→Servicio** | Esta US requiere disponibilidad de un servicio externo | ⬡ |
| **Historia→Técnica** | Esta US requiere configuración técnica previa | ⚙️ |
| **Historia→Decisión** | Esta US está bloqueada por una decisión pendiente (negocio/técnica) | ❓ |

---

### Tabla de Dependencias

| ID Dep. | US Dependiente | Tipo | Bloqueada Por | Descripción | Criticidad | Estado | Fecha Esperada Resolución |
|---|---|---|---|---|---|---|---|
| DEP-01 | US-01 | Historia→Historia | US-00 | [Qué debe estar listo antes] | Bloqueante / No bloqueante | Pendiente / Resuelta | [DD/MM/YYYY] |
| DEP-02 | US-02 | Historia→Servicio | Auth Service v2.0 | [Descripción] | Bloqueante | Pendiente | [DD/MM/YYYY] |
| DEP-03 | US-03 | Historia→Decisión | Decisión arquitectura de caché | [Descripción] | No bloqueante | Pendiente | [DD/MM/YYYY] |

---

### Mapa Visual de Dependencias (texto)

```
Sprint N — Mapa de Dependencias

US-00 (Config Entorno)
  └──→ US-01 (Autenticación)
          └──→ US-02 (Panel Usuario)
                  └──→ US-03 (Exportar Reportes)
                  
US-04 (Catálogo Productos) — Sin dependencias internas
US-05 (Pagos) ──→ US-01 (requiere auth) + Servicio PSE ⬡
```

---

## 3. Análisis de Impacto del Sprint

### Resumen de Riesgos del Sprint

| Nivel | Cantidad | Historias Afectadas |
|---|---|---|
| 🔴 Crítico / Alto | [N] | US-XX, US-YY |
| 🟡 Medio | [N] | US-ZZ |
| 🟢 Bajo | [N] | — |

### Resumen de Dependencias

| Tipo | Bloqueantes | No Bloqueantes | Resueltas |
|---|---|---|---|
| Historia→Historia | [N] | [N] | [N] |
| Historia→Servicio | [N] | [N] | [N] |
| Historia→Decisión | [N] | [N] | [N] |

---

## 4. Plan de Acción de Riesgos Críticos

> Completar para cada riesgo de nivel **Crítico** o **Alto**:

### Riesgo: [ID] — [Nombre corto]
- **Plan de mitigación:** [Acciones específicas con fechas]
- **Plan de contingencia:** [Qué hacer si el riesgo se materializa]
- **Dueño del plan:** [Persona responsable]
- **Fecha de revisión:** [DD/MM/YYYY]
- **Criterio de cierre:** [Condición verificable para cerrar el riesgo]

---

## 5. HITL — Validación del PM

> ⚠️ **El PM debe revisar y validar este registro antes de dar inicio al sprint.**

| Acción | Responsable | Estado |
|---|---|---|
| Revisar todos los riesgos identificados | PM | ⏳ Pendiente |
| Confirmar que las dependencias son correctas | PM + Tech Lead | ⏳ Pendiente |
| Asignar responsables para riesgos críticos | PM | ⏳ Pendiente |
| Aprobar el inicio del sprint con riesgos documentados | PM | ⏳ Pendiente |

**Comentarios del PM:**
> _[El PM completa este campo en el dashboard HTML interactivo]_

**Fecha de validación:** _______________
**Firma PM:** ___________________________

---

*Generado por: Requirement Refinator V1 — Sofka BU1*
*Skill: user-story-refiner v1.0 — Módulo de Riesgos y Dependencias*
