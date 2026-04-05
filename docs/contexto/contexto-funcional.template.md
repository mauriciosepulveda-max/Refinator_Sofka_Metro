# Contexto Funcional — [Nombre del Proyecto]

> **Instrucciones:** copia este archivo como `contexto-funcional.md`, rellena cada sección
> y borra estas instrucciones. Entre más detalle, mejor análisis.

---

## 1. Descripción del Proyecto

**Nombre:** [ej: SBS – Sistema de Beneficios Seguros]
**Cliente / empresa:** [ej: Seguros Bolívar]
**Dominio de negocio:** [ej: emisión y recaudo de pólizas de seguro de vida]
**Objetivo del producto:** [ej: automatizar la emisión masiva de pólizas desde plataformas de sponsors bancarios]

---

## 2. Actores Principales

| Actor | Rol | Descripción |
|-------|-----|-------------|
| [ej: Sponsor] | Externo | [ej: entidad financiera que origina la venta de pólizas] |
| [ej: Asegurado] | Externo | [ej: cliente del sponsor que adquiere el seguro] |
| [ej: Agente PMO] | Interno | [ej: opera y monitorea el sistema de emisión] |

---

## 3. Reglas de Negocio Clave

- [ej: Todo sponsor debe estar activo en TP_Sponsor antes de emitir una póliza]
- [ej: La emisión sin recaudo automático requiere confirmación manual en 48h]
- [ej: Las carátulas definen los parámetros del producto: tasa, cobertura, vigencia]

---

## 4. Procesos de Negocio Relevantes

### [ej: Proceso de Emisión]
1. [ej: El sponsor envía solicitud de emisión vía API]
2. [ej: El sistema valida la carátula activa para ese sponsor]
3. [ej: Se genera la póliza y se notifica al asegurado]

### [ej: Proceso de Recaudo]
1. [ej: ...]

---

## 5. Restricciones y Consideraciones de Negocio

- [ej: No se pueden emitir pólizas retroactivas]
- [ej: Los sponsors tienen SLA de respuesta de 2 segundos]
- [ej: Cumplimiento regulatorio con la Superintendencia Financiera de Colombia]
