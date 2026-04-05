# Requirement Refinator

**Herramienta de refinamiento de historias de usuario para Product Managers.**

Un sistema de agentes IA analiza las HUs del sprint y genera automáticamente:
- ✅ Validación INVEST + ISO/IEC/IEEE 29148:2018
- ✅ Criterios de aceptación en Gherkin (BDD)
- ✅ Tareas técnicas con estimaciones PERT (O/P/Pe)
- ✅ Análisis de riesgos RISICAR (DAFP Colombia)
- ✅ Análisis de dependencias
- ✅ Calificación de calidad ISO/IEC 25010
- ✅ Dashboard EVM (Valor Ganado) con Gantt y Bitácora PMO

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

---

## Estructura del proyecto

```
requirement-refinator/
├── .claude/
│   ├── agents/          ← Agentes IA especializados
│   └── skills/          ← Comandos /refinar-sprint, /refinar-hu, etc.
├── docs/
│   ├── HUs/             ← Aquí van tus HUs (una carpeta por sprint)
│   └── contexto/        ← contexto-funcional.md + contexto-tecnico.md
├── output/              ← Generado automáticamente (en .gitignore)
├── templates/
│   ├── sprint-dashboard.html   ← Template del dashboard (no modificar)
│   └── hu-calidad.schema.json  ← Contrato JSON de los agentes
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
| PMI-PMBOK 7 | Métricas EVM (Valor Ganado) |

---

## Créditos

Creado por **Mauricio Sepúlveda Henao**
Con Claude Code, Antigravity, Gemini y NotebookLM · [MetodologIA](https://metodologia.info)
