# Contexto Técnico — [Nombre del Proyecto]

> **Instrucciones:** copia este archivo como `contexto-tecnico.md`, rellena cada sección
> y borra estas instrucciones.

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | [ej: Java Spring Boot] | [ej: 3.2] |
| Frontend | [ej: Angular] | [ej: 17] |
| Base de datos | [ej: PostgreSQL] | [ej: 15] |
| Mensajería | [ej: Apache Kafka] | [ej: 3.6] |
| Contenedores | [ej: Docker / Kubernetes] | — |
| CI/CD | [ej: GitHub Actions] | — |

---

## 2. Arquitectura

**Patrón:** [ej: Microservicios / Monolito / Serverless]

### Microservicios / Módulos Principales

| Servicio | Responsabilidad |
|---------|----------------|
| [ej: sbs-api-emisión] | [ej: orquesta el flujo de creación de pólizas] |
| [ej: sbs-api-recaudo] | [ej: gestiona cobros automáticos vía PSE/débito] |
| [ej: tp-sponsor] | [ej: catálogo maestro de sponsors y carátulas] |

---

## 3. Integraciones Externas

| Sistema | Tipo | Descripción |
|---------|------|-------------|
| [ej: DIAN e-factura] | REST API | [ej: emisión de facturas electrónicas] |
| [ej: Pasarela de pagos] | REST API | [ej: procesamiento de recaudos automáticos] |
| [ej: Notificaciones SMS/Email] | Evento Kafka | [ej: alertas a asegurados] |

---

## 4. Entornos

| Entorno | URL / Descripción |
|---------|------------------|
| Desarrollo | [ej: local con Docker Compose] |
| QA | [ej: sbs-qa.miempresa.com] |
| Staging | [ej: sbs-staging.miempresa.com] |
| Producción | [ej: sbs.miempresa.com] |

---

## 5. Equipo del Sprint

| Nombre | Rol |
|--------|-----|
| [ej: Ana García] | DEV |
| [ej: Luis Torres] | DEV |
| [ej: María Pinto] | QA |
| [ej: Juan Díaz] | FE |

**Horas efectivas por persona/día:** [ej: 6h (descontando ceremonias)]

---

## 6. Restricciones Técnicas

- [ej: Los microservicios se comunican únicamente vía Kafka (no llamadas síncronas directas)]
- [ej: Base de datos compartida entre sbs-api-emisión y sbs-api-recaudo (migrar con Flyway)]
- [ej: El frontend consume exclusivamente el BFF, nunca los microservicios directamente]
