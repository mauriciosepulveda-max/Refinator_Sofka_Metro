# Requirement Refinator

**Herramienta de refinamiento de historias de usuario para Product Managers.**

Un sistema de agentes IA analiza las HUs del sprint y genera automáticamente:
- Validación INVEST + ISO/IEC/IEEE 29148:2018
- Criterios de aceptación en Gherkin (BDD)
- Tareas técnicas con estimaciones PERT (O/P/Pe)
- Análisis de riesgos RISICAR (DAFP Colombia)
- Análisis de dependencias
- Calificación de calidad ISO/IEC 25010
- Enriquecimiento especializado por tipo de HU (seguridad, integración, datos, split)
- Dashboard EVM (Valor Ganado) con Gantt y Bitácora PMO

Todo en **un solo archivo HTML** interactivo con HITL (Human-in-the-Loop).

---

## Requisitos

- [Claude Code](https://claude.ai/code) o [Antigravity](https://antigravity.dev)
- Git (para clonar el proyecto)
- Navegador moderno (Chrome / Edge / Firefox)

---

## Inicio rápido

### 1. Clonar el proyecto

```bash
git clone https://github.com/[tu-usuario]/requirement-refinator.git
cd requirement-refinator
```

### 2. Preparar el contexto de tu proyecto

```bash
cp docs/contexto/contexto-funcional.template.md docs/contexto/contexto-funcional.md
cp docs/contexto/contexto-tecnico.template.md   docs/contexto/contexto-tecnico.md
```

Edita ambos archivos con la información de tu proyecto.

### 3. Agregar las HUs del sprint

```bash
mkdir docs/HUs/Sprint-1
# Crea un .md por HU dentro de esa carpeta
```

Formato mínimo de cada HU:

```markdown
# Título de la HU

## Narrativa
Como [rol] quiero [acción] para que [beneficio]

## Criterios de Aceptación
- CA1: ...
- CA2: ...
```

### 4. Ejecutar el análisis

Abre Claude Code o Antigravity en la carpeta del proyecto y ejecuta:

```
/refinar-sprint Sprint-1
```

El agente te pedirá los parámetros del sprint (fechas, equipo, capacidad) y luego analizará todas las HUs en paralelo.

### 5. Revisar el dashboard

Abre `output/Sprint-1/index.html` en el navegador. Desde ahí puedes:

- Ver el diagnóstico ISO de cada HU
- Revisar y editar los CAs Gherkin
- Ajustar las estimaciones PERT
- Gestionar los riesgos RISICAR
- Registrar mediciones EVM
- Aprobar o rechazar HUs (HITL)
- Generar la Bitácora PMO (PDF)
- Exportar respaldo Markdown

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `/refinar-sprint Sprint-X` | Analiza todas las HUs → genera 1 dashboard HTML |
| `/refinar-sprint Sprint-X --iteracion` | Re-analiza solo las HUs rechazadas o con feedback |
| `/refinar-sprint Sprint-X --consolidar` | Regenera el HTML sin re-analizar |
| `/refinar-hu Sprint-X "nombre.md"` | Analiza una sola HU |
| `/generar-informe Sprint-X` | Genera informe ejecutivo para el cliente |
| `/generar-specs Sprint-X` | Genera especificaciones SDD para HUs aprobadas |

---

## Arquitectura de agentes

El sistema usa un pipeline de dos pasadas:

### Primera pasada — Análisis base (siempre corre)

```
orchestrator
└── hu-full-analyzer × N (1 por HU, todos en paralelo)
    └── Produce: INVEST + ISO 29148 + ISO 25010 + Gherkin + PERT + Riesgos + Dependencias
```

### Segunda pasada — Enriquecimiento selectivo (solo cuando aplica)

El orchestrator evalúa el output de cada `hu-full-analyzer` y decide si alguna HU necesita profundidad adicional:

| Agente enricher | Se activa cuando... | Agrega al análisis... |
|----------------|--------------------|-----------------------|
| `hu-security-enricher` | La HU toca autenticación, autorización o datos sensibles | STRIDE threat model, OWASP Top 10 relevante, CAs de seguridad, tareas de hardening |
| `hu-integration-enricher` | La HU tiene 2+ dependencias externas o involucra APIs/webhooks | Contratos de API preliminares, análisis de resiliencia, CAs de fallos de integración |
| `hu-data-enricher` | La HU involucra migraciones, esquemas o estructuras de datos complejas | Borrador de modelo de datos, análisis de consistencia, CAs de integridad |
| `hu-split-advisor` | La HU es muy grande (≥13 story points) o tiene calidad insuficiente | 2-3 HUs derivadas listas para el backlog, con narrativa y CAs mínimos |

Los enrichers corren en paralelo entre sí cuando una misma HU activa múltiples señales. Su output se integra directamente a los arrays `criteriosAceptacion[]`, `tareas[]` y `preguntas_clarificacion[]` del análisis base, y queda almacenado en el campo `enriquecimiento.<tipo>` del JSON.

### Agentes de entrega

```
report-builder          → inyecta data.json en el template HTML → output/Sprint-X/index.html
client-report-generator → enriquece data.json con informe_cliente → tab "Informe Cliente"
spec-writer             → genera specs SDD versionadas → specs/Sprint-X/<hu-id>-v<N>.spec.md
```

### Flujo completo

```
/refinar-sprint Sprint-X
        │
        ▼
[Fase 0] orchestrator lee contexto + HUs + templates (UNA VEZ)
        │
        ▼
[Fase 1] hu-full-analyzer × N en paralelo → N JSONs base
        │
        ▼
[Fase 2] Quality Gates G1-G4 (orchestrator valida, reintenta si falla)
        │
        ▼
[Fase 2.5] Evaluación de señales → enrichers en paralelo (solo HUs que lo necesitan)
        │
        ▼
[Fase 3] Merge de enriquecimientos + consolidación → data.json
        │
        ▼
[Fase 4] Inyección en template → output/Sprint-X/index.html
        │
        ▼
[Fase 5] Reporte al PM con resumen + siguiente paso sugerido
```

---

## Estructura del proyecto

```
requirement-refinator/
├── .claude/
│   ├── agents/
│   │   ├── _project/              ← Agentes del Requirement Refinator
│   │   │   ├── orchestrator.md
│   │   │   ├── hu-full-analyzer.md
│   │   │   ├── hu-security-enricher.md
│   │   │   ├── hu-integration-enricher.md
│   │   │   ├── hu-data-enricher.md
│   │   │   ├── hu-split-advisor.md
│   │   │   ├── report-builder.md
│   │   │   ├── client-report-generator.md
│   │   │   ├── spec-writer.md
│   │   │   └── _legacy/           ← Agentes anteriores (no usados en flujo principal)
│   │   └── _kit-base/             ← 101 agentes del JM Kit (READ-ONLY)
│   └── skills/                    ← Comandos /refinar-sprint, /refinar-hu, etc.
├── docs/
│   ├── HUs/                       ← Aquí van tus HUs (una carpeta por sprint)
│   └── contexto/                  ← contexto-funcional.md + contexto-tecnico.md
├── output/                        ← Generado automáticamente (en .gitignore)
│   └── Sprint-X/
│       ├── index.html             ← Dashboard único (todo incluido)
│       └── data.json              ← Fuente única de verdad del sprint
├── templates/
│   └── core/
│       ├── sprint-dashboard.html  ← Template del dashboard (no modificar)
│       └── hu-calidad.schema.json ← Contrato JSON de los agentes
└── README.md
```

---

## Estándares aplicados

| Estándar | Uso |
|----------|-----|
| ISO/IEC/IEEE 29148:2018 | 9 atributos de calidad del requisito |
| ISO/IEC 25010 | Cobertura de calidad del producto |
| INVEST | Criterios de buenas historias de usuario |
| RISICAR (DAFP Colombia) | Metodología de gestión de riesgos |
| STRIDE | Threat modeling para HUs de seguridad |
| PMI-PMBOK 7 | Métricas EVM (Valor Ganado) |

---

## Créditos

Creado por **Mauricio Sepúlveda Henao**
Con Claude Code, Antigravity, Gemini y NotebookLM
