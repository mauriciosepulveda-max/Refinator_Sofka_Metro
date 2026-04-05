# Historias de Usuario

Aquí debes agregar las historias de usuario de tu sprint para ser refinadas.

## Estructura esperada

Crea una carpeta por sprint: `Sprint-X/` (ejemplo: `Sprint-1/`, `Sprint-2/`, etc.)

Dentro de cada carpeta, agrega archivos Markdown (`.md`) con una historia de usuario por archivo.

```
docs/HUs/
├── Sprint-1/
│   ├── hu-login.md
│   ├── hu-dashboard.md
│   └── hu-reportes.md
├── Sprint-2/
│   ├── hu-integracion-api.md
│   └── hu-notificaciones.md
```

## Formato esperado de cada HU

Cada archivo Markdown debe contener:

```markdown
# [Título de la Historia de Usuario]

## Narrativa

Como [rol/perfil]
Quiero [funcionalidad/capacidad]
Para que [beneficio/valor de negocio]

## Detalle del Desarrollo

[Descripción detallada de qué se necesita implementar]

## Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

[Opcional: Notas técnicas, dependencias, contexto adicional]
```

## Cómo usar

1. Crea la estructura de directorios (`Sprint-X/`)
2. Agrega tus historias de usuario en Markdown
3. Ejecuta `/refinar-sprint Sprint-X` para analizar todas las HUs del sprint
4. O `/refinar-hu Sprint-X "nombre-archivo.md"` para una HU individual

Los agentes analizarán cada HU y generarán:
- Validación INVEST
- Criterios de aceptación en Gherkin (BDD)
- Tareas técnicas con estimaciones PERT
- Análisis de riesgos
- Análisis de dependencias
- Calificación ISO/IEC 29148 e ISO/IEC 25010

El resultado será un dashboard interactivo en `output/Sprint-X/index.html`.
