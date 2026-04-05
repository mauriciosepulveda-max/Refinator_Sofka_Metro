---
name: req-compliance-mapper
description: Vincula automáticamente los requerimientos Funcionales y No Funcionales (NFRs) con normativas (ej. GDPR, OWASP Top 10) garantizando trazabilidad de cumplimiento desde el día 0.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [security, analysis, compliance, gdpr, owasp, requirements]
---
# req-compliance-mapper {Security} (v1.0)

> **"La seguridad funcional y el cumplimiento legal no se añaden al final, nacen en el requerimiento."**

## Purpose
Escanear especificaciones o historias de usuario y mapearlas contra marcos de cumplimiento normativo (GDPR/CCPA) y de seguridad (OWASP Top 10, Firebase Security Rules constraints). Anexa automáticamente criterios de aceptación no funcionales a la historia.

**When to use:** Antes de aprobar un requerimiento para desarrollo, especialmente si involucra PII (Datos de Identificación Personal), pagos, o control de acceso.

## 1. The Physics
1. **Law of Immutability:** Los requerimientos de compliance no son negociables ni repriorizables frente a features de usuario.
2. **Law of Traceability:** Toda regla de negocio generada por compliance debe tener un ID de política normativa como referencia.
3. **Law of the Standard Stack:** Evalúa todo bajo la óptica de Google Cloud y Firebase (ej. GDPR se suple con Data Deletion Rules/Extensions, Oauth con Firebase Auth).

## 2. The Protocol
### Phase 1: Ingestion & Scan
1. Recibe la historia de usuario o Epic.
2. Escanea buscando triggers de compliance: captura de emails, direcciones, tarjetas, auth, roles, logs de auditoría.

### Phase 2: Mapping
1. Para cada trigger detectado, asigna el riesgo (Ej: OWASP A01: Broken Access Control).
2. Mapea la mitigación requerida dentro del stack Firebase (ej. "Añadir Custom Claim check en Firestore Rules").

### Phase 3: Augmentation
1. Append (anexa) una sección de "Non-Functional Acceptance Criteria (NFRs)" a la historia original.
2. Redacta escenarios Gherkin para la mitigación (ej. `Given user does not have admin claim...`).

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| User Story | Text | Yes | Historia a auditar |
| Framework Target | String | No | Default: OWASP+GDPR |
| Output | Type | Description |
|--------|------|-------------|
| Compliance Matrix | Markdown | NFRs y Gherkins de seguridad anexables |

## 4. Quality Gates
- [ ] Toda historia con PII tiene adherida NFR de Data Deletion/Anonymization.
- [ ] Toda historia con permisos tiene NFR de validación de Custom Claims o JWT en Reglas/Funciones.

## 5. Self-Correction Triggers
> [!WARNING]
> IF la mitigación sugiere una herramienta fuera del ecosistema Google/Firebase (ej. AWS Macie), THEN fallar y re-buscar soluciones nativas en GCP/Firebase Security Rules.
