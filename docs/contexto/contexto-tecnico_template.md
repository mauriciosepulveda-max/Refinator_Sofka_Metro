# Contexto Técnico — [Nombre del Proyecto]

> **Instrucciones:** copia este archivo como `contexto-tecnico.md`, rellena cada sección
> y borra estas instrucciones.

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | [ej: Java Spring Boot · Node.js · Python FastAPI · AWS Lambda] | [ej: 3.2] |
| Frontend | [ej: Angular · React · Vue · Blazor] | [ej: 17] |
| Base de datos | [ej: PostgreSQL · Aurora · MongoDB · Oracle · Firestore] | [ej: 15] |
| Mensajería | [ej: Apache Kafka · SQS · RabbitMQ · Pub/Sub] | [ej: 3.6] |
| Contenedores | [ej: Docker / Kubernetes · ECS · Cloud Run · ninguno] | — |
| CI/CD | [ej: GitHub Actions · GitLab CI · CodePipeline] | — |

---

## 2. Arquitectura

**Patrón:** [ej: Microservicios · Monolito · Serverless · Event-Driven · Hexagonal]

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

> **Las sub-secciones 6.1 a 6.4 son el contrato que `spec-writer` y `hu-full-analyzer` aplican al generar specs, CAs y tareas para este sprint.** Todo lo no declarado aquí se considera fuera del alcance técnico del sprint. El framework es agnóstico a tecnologías: **no heredamos reglas globales** — cada proyecto define su propio stack y sus propias restricciones.

### 6.1 Tecnologías permitidas

| Categoría | Tecnología permitida | Versión / Notas |
|---|---|---|
| [ej: Runtime backend] | [ej: Node.js 20 LTS, Python 3.12, JDK 21] | [ej: mandatorio LTS] |
| [ej: DB relacional] | [ej: PostgreSQL 15+, Aurora PostgreSQL] | [ej: con extensión `uuid-ossp`] |
| [ej: DB documental] | [ej: MongoDB 7.x] | [ej: con validadores JSON Schema] |
| [ej: Cache] | [ej: Redis 7.x] | [ej: cluster en prod] |
| [ej: Mensajería] | [ej: SQS, Kafka 3.6+] | — |
| [ej: IaC] | [ej: Terraform 1.8+] | [ej: state en S3 + DynamoDB lock] |

### 6.2 Tecnologías / librerías PROHIBIDAS

Lista las tecnologías que NO deben aparecer en specs, CAs ni tareas. Cuando el `spec-writer` detecte una tecnología listada aquí, **Gate 0 falla** y debe sustituirla por el equivalente declarado en la columna "Alternativa permitida".

| Prohibido | Motivo | Alternativa permitida |
|---|---|---|
| [ej: MongoDB Atlas] | [ej: data residency Colombia; usar on-prem o región us-east-1] | [ej: MongoDB autogestionado en VPC o DocumentDB] |
| [ej: LocalStorage para datos sensibles] | [ej: política de seguridad del cliente] | [ej: backend session + httpOnly cookie] |
| [ej: callbacks anidados en lógica de negocio] | [ej: legibilidad + manejo de errores] | [ej: async/await + try/catch] |

*(Si no hay tecnologías prohibidas, deja la tabla con una fila: `— | — | —` para explicitar la ausencia.)*

### 6.3 Convenciones de código obligatorias

- **Lenguaje base:** [ej: TypeScript strict, sin `any` implícito]
- **Módulos:** [ej: ES Modules (`import`/`export`), prohibido CommonJS en código nuevo]
- **Naming:** [ej: archivos `kebab-case.ts`, componentes `PascalCase`, funciones/vars `camelCase`, constantes `UPPER_SNAKE_CASE`]
- **Error handling:** [ej: nunca atrapar y silenciar; siempre log estructurado con contexto]
- **Cobertura mínima:** [ej: 80% en lógica nueva, 60% en módulos legacy]
- **Formato:** [ej: Prettier con config del repo + ESLint bloqueante en CI]

### 6.4 Herramientas obligatorias

| Área | Herramienta | Uso |
|---|---|---|
| [ej: Control de versiones] | [ej: Git + convenciones Conventional Commits] | [ej: PR con squash merge, rebase a main] |
| [ej: Testing unitario] | [ej: Jest · Vitest · pytest] | [ej: ejecutado en pre-commit y CI] |
| [ej: Testing E2E] | [ej: Playwright] | [ej: suite completa en staging antes de release] |
| [ej: Observabilidad] | [ej: OpenTelemetry + Grafana] | [ej: traces + métricas + logs estructurados] |
| [ej: Secret management] | [ej: AWS Secrets Manager · Vault · GCP Secret Manager] | [ej: nunca `.env` committeado] |
| [ej: Análisis estático] | [ej: SonarQube · CodeQL] | [ej: bloqueante en CI si hay `Critical`/`Blocker`] |

---

## 7. Otras restricciones de arquitectura

Invariantes que no encajan en 6.1–6.4. Formato libre.

- [ej: Los microservicios se comunican exclusivamente vía eventos (no llamadas síncronas directas)]
- [ej: Base de datos compartida entre servicios X e Y — migraciones con Flyway, nunca ad-hoc]
- [ej: El frontend consume exclusivamente el BFF, nunca los microservicios directamente]
- [ej: Tope de negocio: saldo máximo por cuenta = X unidades, validado en capa de aplicación]
- [ej: Modelo contable: `insert-on-confirm` en tabla `TRANSACTION`; campos contables inmutables; correcciones vía reversión]
