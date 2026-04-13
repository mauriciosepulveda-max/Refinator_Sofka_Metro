# Tutorial: Requirement Refinator — Guía paso a paso

**Para:** Líderes técnicos y Product Managers en fábricas de software o contratos T&M  
**Requisito previo:** Nada instalado todavía. Esta guía arranca desde cero.

---

## Índice

1. [Instalar los prerrequisitos](#1-instalar-los-prerrequisitos)
2. [Clonar el proyecto](#2-clonar-el-proyecto)
3. [Documentar el contexto del proyecto](#3-documentar-el-contexto-del-proyecto)
4. [Crear las historias de usuario del sprint](#4-crear-las-historias-de-usuario-del-sprint)
5. [Ejecutar el análisis](#5-ejecutar-el-análisis)
6. [Usar el dashboard — Vista principal](#6-usar-el-dashboard--vista-principal)
7. [Revisar cada HU en Focus Mode](#7-revisar-cada-hu-en-focus-mode)
8. [Medir el avance con EVM](#8-medir-el-avance-con-evm)
9. [Exportar el respaldo y no perder trabajo](#9-exportar-el-respaldo-y-no-perder-trabajo)
10. [Generar la Bitácora PMO al cierre del sprint](#10-generar-la-bitácora-pmo-al-cierre-del-sprint)
11. [Iterar sobre HUs rechazadas](#11-iterar-sobre-hus-rechazadas)
12. [Cierre del sprint y retrospectiva](#12-cierre-del-sprint-y-retrospectiva)
13. [Referencia rápida de comandos](#13-referencia-rápida-de-comandos)
14. [Glosario de conceptos clave](#14-glosario-de-conceptos-clave)

---

## 1. Instalar los prerrequisitos

### 1.1 Git

Verifica si ya lo tienes:

```bash
git --version
# Resultado esperado: git version 2.x.x
```

Si el comando no existe, descárgalo desde https://git-scm.com/downloads e instálalo con las opciones por defecto.

### 1.2 IDE con Claude Code

Elige **uno** de los siguientes:

**Opción A — Visual Studio Code + extensión Claude Code**

1. Descarga VSC desde https://code.visualstudio.com/
2. Abre VSC → panel lateral izquierdo → ícono de extensiones (Ctrl+Shift+X / Cmd+Shift+X)
3. Busca `Claude Code` → instala la extensión de Anthropic
4. Inicia sesión con tu cuenta de Anthropic cuando lo solicite

**Opción B — Antigravity**

1. Descarga desde https://antigravity.dev
2. Instala y abre la aplicación
3. Inicia sesión con tu cuenta de Anthropic

### 1.3 Navegador moderno

Chrome, Edge o Firefox. El dashboard es un archivo HTML y se abre directamente en el navegador.

---

## 2. Clonar el proyecto

### 2.1 Desde la terminal (forma más directa)

Abre una terminal. Navega a la carpeta donde quieras guardar el proyecto y ejecuta:

```bash
git clone https://github.com/mauriciosepulveda-max/PM-refinador.git
cd PM-refinador
```

Resultado esperado en la terminal:
```
Cloning into 'PM-refinador'...
remote: Enumerating objects: 399, done.
...
Resolving deltas: done.
```

Luego abre la carpeta en tu IDE:

```bash
# Si usas VSC:
code .

# Si usas Antigravity:
# Arrastra la carpeta PM-refinador a la ventana de Antigravity
```

### 2.2 Desde Visual Studio Code (sin terminal)

1. Abre VSC
2. Presiona `Cmd+Shift+P` (Mac) o `Ctrl+Shift+P` (Windows/Linux)
3. Escribe `Git: Clone` y presiona Enter
4. Pega esta URL: `https://github.com/mauriciosepulveda-max/PM-refinador.git`
5. Elige una carpeta destino (ej: `~/Proyectos/`)
6. Cuando VSC pregunte `Open repository?`, haz clic en **Open**

### 2.3 Verificar que el clone fue exitoso

En la terminal integrada del IDE (menú Terminal → New Terminal):

```bash
ls
```

Deberías ver:
```
CLAUDE.md   README.md   docs/   templates/   .claude/   .gitignore
```

Si no ves esos archivos, algo falló. Repite el paso 2.1.

---

## 3. Documentar el contexto del proyecto

> **Por qué es obligatorio:** El agente de IA no sabe nada de tu proyecto. Sin contexto, los análisis son genéricos e imprecisos. Con contexto, detecta riesgos reales, genera tareas técnicas específicas y hace preguntas pertinentes.

### 3.1 Crear el archivo de contexto funcional

En la terminal del IDE:

```bash
cp docs/contexto/contexto-funcional.template.md docs/contexto/contexto-funcional.md
```

Abre `docs/contexto/contexto-funcional.md` y rellena cada sección. Guía de cada campo:

**Sección 1 — Descripción del Proyecto**

Escribe el nombre del proyecto, el cliente, el dominio de negocio y el objetivo principal. Ejemplo:

```markdown
## 1. Descripción del Proyecto

**Nombre:** Portal de Autogestión de Pólizas
**Cliente / empresa:** Seguros Bolívar
**Dominio de negocio:** Emisión y recaudo de pólizas de seguro de vida
**Objetivo del producto:** Permitir a los asegurados consultar, renovar y cancelar pólizas sin llamar al call center
```

**Sección 2 — Actores Principales**

Lista quién usa el sistema. Sé específico: no pongas "usuario" sino "asegurado persona natural" o "agente de servicio en sede".

**Sección 3 — Reglas de Negocio Clave**

Pon las reglas que el equipo de desarrollo necesita conocer para no cometer errores. Máximo 10. Ejemplos:
- "Un asegurado solo puede cancelar pólizas con más de 30 días de vigencia"
- "El sistema no puede emitir pólizas retroactivas"

**Sección 4 — Procesos de Negocio Relevantes**

Describe los flujos principales relacionados con las HUs de este sprint. No copies toda la documentación del sistema, solo lo relevante al sprint actual.

**Sección 5 — Restricciones y Consideraciones**

Restricciones legales, regulatorias o de negocio que el equipo debe respetar.

### 3.2 Crear el archivo de contexto técnico

```bash
cp docs/contexto/contexto-tecnico.template.md docs/contexto/contexto-tecnico.md
```

Abre `docs/contexto/contexto-tecnico.md` y rellena:

**Sección 1 — Stack Tecnológico**

Lista el lenguaje, framework, base de datos, mensajería, contenedores y CI/CD con sus versiones exactas.

**Sección 2 — Arquitectura**

Indica el patrón (microservicios, monolito, serverless) y lista los módulos/servicios principales con su responsabilidad en una oración.

**Sección 3 — Integraciones Externas**

Cada API o sistema externo con el que interactúa el producto. Indica si es REST, evento Kafka, webhook, etc.

**Sección 4 — Entornos**

URLs de los entornos: local, QA, staging, producción. Aunque sean locales o placeholders, ponlos.

**Sección 5 — Equipo del Sprint**

Tabla con nombre, rol (DEV, QA, FE, DB, DEVOPS) y horas efectivas por día. Las horas efectivas son las que trabaja un desarrollador típico después de descontar reuniones y ceremonias (normalmente 5–6 horas en sprints con scrum).

**Sección 6 — Restricciones Técnicas**

Reglas de arquitectura que el equipo debe cumplir. Ejemplos: "solo comunicación asíncrona entre servicios", "no acceso directo a la BD de producción desde código de negocio".

### 3.3 Verificar que los archivos están en su lugar

```bash
ls docs/contexto/
```

Debes ver:
```
README.md
contexto-funcional.md
contexto-funcional.template.md
contexto-tecnico.md
contexto-tecnico.template.md
```

Si falta alguno de los dos `.md` (sin `.template`), vuelve al paso 3.1 o 3.2.

---

## 4. Crear las historias de usuario del sprint

### 4.1 Crear la carpeta del sprint

```bash
mkdir docs/HUs/Sprint-1
```

Convención de nombres: `Sprint-1`, `Sprint-2`, etc. Siempre empieza desde 1.

### 4.2 Crear un archivo por historia de usuario

Crea un archivo `.md` por cada HU. El nombre del archivo debe ser descriptivo y en kebab-case:

```bash
touch docs/HUs/Sprint-1/HU-001-login-usuario.md
touch docs/HUs/Sprint-1/HU-002-dashboard-principal.md
touch docs/HUs/Sprint-1/HU-003-listado-polizas.md
```

### 4.3 Formato obligatorio de cada HU

Abre cada archivo y escribe usando esta estructura exacta:

```markdown
# [Título breve de la HU]

## Narrativa

Como [rol específico del usuario]
Quiero [acción o funcionalidad concreta]
Para que [beneficio de negocio medible]

## Detalle del Desarrollo

[Descripción de 2 a 10 párrafos explicando qué se necesita implementar.
Incluye: comportamiento esperado, flujos alternativos, datos involucrados,
reglas de negocio específicas de esta HU, restricciones.]

## Criterios de Aceptación

- [ ] CA1: [Condición verificable que el QA puede comprobar]
- [ ] CA2: [Otro criterio]
- [ ] CA3: [Otro criterio]

## Notas Técnicas (opcional)

[Dependencias con otras HUs, APIs involucradas, tablas de BD afectadas,
consideraciones de performance o seguridad.]
```

**Ejemplo real mínimo:**

```markdown
# Login de usuario con correo y contraseña

## Narrativa

Como asegurado registrado en el portal
Quiero iniciar sesión con mi correo electrónico y contraseña
Para que pueda acceder a mi portafolio de pólizas y gestionar mis coberturas

## Detalle del Desarrollo

El formulario de login debe tener dos campos: correo electrónico y contraseña.
Al enviar, el sistema valida contra el directorio de asegurados en el servicio de autenticación.
Si las credenciales son correctas, redirige al dashboard principal.
Si son incorrectas, muestra el mensaje "Correo o contraseña incorrectos" sin indicar cuál de los dos falló (seguridad).
Después de 5 intentos fallidos consecutivos, bloquea la cuenta por 30 minutos y envía un correo de aviso al asegurado.

## Criterios de Aceptación

- [ ] CA1: Un asegurado con credenciales válidas inicia sesión y ve el dashboard en menos de 3 segundos
- [ ] CA2: Un asegurado con contraseña incorrecta ve el mensaje de error genérico y el contador de intentos aumenta
- [ ] CA3: Al llegar a 5 intentos fallidos, la cuenta queda bloqueada y llega un correo de aviso
- [ ] CA4: El token de sesión expira después de 8 horas de inactividad

## Notas Técnicas

- Depende de HU-002 (dashboard principal, destino del redirect exitoso)
- El servicio de autenticación es auth-service (Java Spring Security + JWT)
- El correo de aviso usa el servicio de notificaciones (notification-service)
```

### 4.4 Cuántas HUs por sprint

El agente puede analizar entre 1 y 15 HUs por sprint. Para sprints de 2 semanas, entre 8 y 12 HUs es lo habitual.

### 4.5 Verificar antes de continuar

```bash
ls docs/HUs/Sprint-1/
```

Debes ver al menos un archivo `.md`. Si la carpeta está vacía, el análisis no puede ejecutarse.

---

## 5. Ejecutar el análisis

### 5.1 Abrir el chat del agente en tu IDE

**En VSC:** Haz clic en el ícono de Claude Code en la barra lateral izquierda. Se abre el panel de chat.

**En Antigravity:** El chat del agente aparece en el panel derecho o central según la configuración.

Asegúrate de que el directorio de trabajo del chat sea la carpeta raíz del proyecto (donde está `CLAUDE.md`). Normalmente lo detecta automáticamente al abrir la carpeta.

### 5.2 Ejecutar el comando de análisis

En el chat del agente, escribe exactamente:

```
/refinar-sprint Sprint-1
```

Presiona Enter. El agente responderá con un mensaje de inicio y comenzará el proceso. No interrumpas ni escribas nada más hasta que termine.

### 5.3 Qué sucede durante el análisis (5 fases)

**Fase 0 — Lectura (30–60 segundos)**  
El agente lee los archivos de contexto y todas las HUs. En el chat verás mensajes como:
```
Leyendo contexto del proyecto...
Encontradas 3 HUs en Sprint-1
```

**Fase 1 — Análisis en paralelo (2–5 minutos)**  
Se lanza un agente especializado por cada HU, todos al mismo tiempo. Verás actividad paralela en el IDE. A mayor número de HUs, mayor tiempo pero no proporcional (son paralelos).

**Fase 2 — Quality Gates (30 segundos)**  
El orquestador valida que cada análisis cumple los requisitos mínimos. Si alguno falla, lo reintenta una vez automáticamente.

**Fase 3–4 — Consolidación y generación del HTML (30 segundos)**  
Se consolida el `data.json` y se genera el `output/Sprint-1/index.html`.

### 5.4 Qué hacer si el agente pide información

Si en el chat aparece una pregunta como:
```
No encontré docs/contexto/contexto-funcional.md. ¿Quieres crearlo ahora?
```
Es que olvidaste el paso 3. Responde al agente con instrucciones o vuelve al paso 3.

### 5.5 Resultado exitoso

Al terminar, el agente muestra en el chat:

```
══════════════════════════════════════════════════
  ANÁLISIS DE Sprint-1 COMPLETADO
══════════════════════════════════════════════════
  3 historias analizadas
  Calificación ISO promedio: 3.8 / 5.0
  ...
  Dashboard: output/Sprint-1/index.html
══════════════════════════════════════════════════
➡ SIGUIENTE PASO: Abrir el dashboard y revisar cada HU
```

Verifica que el archivo existe:

```bash
ls output/Sprint-1/
# Debe mostrar: data.json  index.html
```

### 5.6 Abrir el dashboard

Abre el archivo `output/Sprint-1/index.html` en el navegador. Puedes:

- Doble clic en el archivo desde el explorador de archivos del SO
- En la terminal: `open output/Sprint-1/index.html` (Mac) o `start output/Sprint-1/index.html` (Windows)
- Arrastrar el archivo al navegador

Verás el dashboard cargado con los resultados. Si el archivo no existe o el dashboard muestra un mensaje de "No hay datos", vuelve al paso 5.2.

---

## 6. Usar el dashboard — Vista principal

El dashboard tiene 4 tabs en la parte superior:

| Tab | Qué contiene |
|-----|-------------|
| 📋 Dashboard | Calificación del sprint, tabla de HUs, KPIs |
| 📈 Avance del Sprint | EVM, gráfico, Gantt, historial de mediciones |
| Informe Cliente | Informe ejecutivo (se genera con `/generar-informe`) |
| 📥 Respaldo ▾ | Exportar / importar el estado del dashboard |

### 6.1 Entender la calificación ISO

En la parte superior del Dashboard verás tres gauges:

- **ISO 29148** — qué tan bien definida está la HU (9 atributos: necesario, inequívoco, verificable, etc.)
- **INVEST** — criterios de buenas historias de usuario (independiente, estimable, etc.)
- **ISO 25010** — cobertura de características de calidad del producto (seguridad, rendimiento, usabilidad, etc.)

El número más grande es la **Calificación ISO** de 0 a 5, calculada como:

```
Calificación = (ISO29148 × 50% + INVEST × 30% + ISO25010 × 20%) × 5
```

Rangos:
- **4.5–5.0** → Excelente — lista para desarrollo sin cambios
- **3.5–4.4** → Buena — ajustes menores antes de desarrollar
- **2.5–3.4** → Aceptable — requiere refinamiento
- **< 2.5**   → Deficiente — no debe entrar al sprint sin reescribirse

### 6.2 Leer la tabla de HUs

Cada fila de la tabla muestra una HU con:
- Su calificación individual
- Estado PM: Pendiente / Aprobada / Rechazada
- Horas estimadas totales
- Botón **Revisar** que abre el Focus Mode

---

## 7. Revisar cada HU en Focus Mode

Haz clic en **Revisar** en cualquier fila de la tabla de HUs. Se abre un panel completo con 7 secciones colapsables.

### 7.1 Sección: Narrativa y diagnóstico

Muestra:
- La narrativa original que escribiste
- La narrativa refinada por el agente (formato Como/Quiero/Para corregido)
- El diagnóstico detallado de cada criterio INVEST e ISO 29148 con la nota del agente

Si la narrativa refinada es mejor que la original, actualiza tu archivo `.md` de la HU para mantener consistencia.

### 7.2 Sección: Criterios de Aceptación (Gherkin)

Muestra los criterios de aceptación expandidos en formato Gherkin. Cada escenario tiene:
- **Nombre** del escenario (qué flujo representa)
- **Tipo**: happy_path, unhappy_path, edge_case, etc.
- **Gherkin** en español:
  ```gherkin
  Dado que el asegurado tiene credenciales válidas
  Cuando ingresa su correo y contraseña correctos
  Entonces el sistema lo redirige al dashboard en menos de 3 segundos
  ```

**Qué revisar aquí:**
- Que los escenarios cubran todos tus CAs originales
- Que el lenguaje sea comprensible para el negocio (sin rutas de API ni IDs técnicos)
- Que los "Entonces" sean verificables (tienen un resultado concreto y medible)

Si falta un escenario importante, escríbelo en el campo de **Feedback** (sección 7.6) y rechaza la HU para que el agente la mejore.

### 7.3 Sección: Tareas Técnicas con estimación PERT

Lista de tareas de desarrollo con sus estimaciones. Cada tarea tiene:
- **Descripción** en formato `[VERBO] [ARTEFACTO] en [UBICACIÓN]`  
  Ejemplo: `Implementar endpoint POST /auth/login en auth-service`
- **DoD** (Definition of Done): criterio concreto de cuándo está terminada  
  Ejemplo: `DoD: endpoint responde en <500ms en ambiente QA con carga de 100 req/seg`
- **Rol**: DEV, QA, FE, DB
- **Estimación PERT**: tres campos editables

**Editar las estimaciones PERT:**

Los tres campos son editables directamente en pantalla:
- **O** (Optimista): horas si todo sale perfecto, sin interrupciones ni dependencias
- **P** (Probable): horas en condiciones normales de trabajo
- **Pe** (Pesimista): horas si hay problemas, dependencias bloqueantes o complejidad oculta

Al escribir un número en cualquiera de los tres campos y hacer clic afuera, el campo **E** se recalcula automáticamente:

```
E = (O + 4×P + Pe) / 6
```

El total de horas de la HU y el EVM también se actualizan. Los cambios se guardan automáticamente en el navegador.

**Criterio práctico para las estimaciones:**
- Si O y Pe difieren por más de 3× (ej: O=2h, Pe=8h), hay incertidumbre alta — busca más información antes de comprometerte
- Las tareas de QA suelen ser 30–50% del tiempo de DEV en cada HU

### 7.4 Sección: Riesgos (Matriz RISICAR)

Lista de riesgos identificados por el agente. Cada riesgo tiene:
- Nivel: **Tolerable** (verde), **Grave** (ámbar), **Crítico** (rojo), **Inaceptable** (rojo oscuro)
- Causa raíz específica al dominio de tu proyecto
- Estrategia de respuesta
- Responsable y fecha de mitigación

**Qué hacer con los riesgos:**
1. Lee cada riesgo crítico o inaceptable
2. Si el riesgo ya existe y tiene un plan, marca el toggle de "Cerrado"
3. Si falta un riesgo importante, anótalo en el Feedback
4. Los riesgos se agregan en la tab "Avance del Sprint" para el seguimiento del sprint

### 7.5 Sección: Dependencias

Muestra qué otras HUs del sprint dependen de esta, y de cuáles depende esta HU. Los marcados como `bloqueante: true` son críticos — si no se desarrollan primero, bloquean otras HUs.

**Acción recomendada:** Ordena el backlog del sprint para que las HUs bloqueantes entren primero al desarrollo.

### 7.6 Sección: Preguntas de Clarificación

El agente generó preguntas sobre información faltante o ambigua. Hay un campo de texto por cada pregunta para que respondas directamente en el dashboard.

**Cuándo responder aquí vs. en el archivo de HU:**
- Responde en el dashboard si la respuesta es contextual o temporal
- Actualiza el archivo `.md` de la HU si la respuesta es una aclaración permanente que el equipo debe conocer

### 7.7 Sección: Feedback al agente

Campo de texto libre para instrucciones al agente cuando rechaces la HU.

**Cómo escribir feedback efectivo:**

Malo (vago):
```
Mejorar los criterios de aceptación
```

Bueno (específico):
```
CA3 sobre el bloqueo de cuenta debe especificar que el conteo se reinicia
si el usuario inicia sesión exitosamente antes de llegar a 5 intentos.
Agregar escenario Gherkin para ese flujo alternativo.
```

### 7.8 Aprobar o rechazar la HU

En la barra inferior del Focus Mode:

**✓ Aprobar HU** — La HU queda marcada como aprobada. En el modo `--iteracion`, no se re-analiza.

**✗ Rechazar / Iterar** — La HU queda marcada para re-análisis. El feedback que escribiste en 7.6 se enviará al agente en la siguiente iteración.

Cuando **todas** las HUs estén aprobadas, el tab "Avance del Sprint" se activa completamente.

---

## 8. Medir el avance con EVM

### 8.1 Qué es EVM y para qué sirve

Earned Value Management (Valor Ganado) es la metodología del PMI para medir el desempeño real de un proyecto versus su línea base. Te responde dos preguntas en todo momento:

- **¿Vamos según el cronograma?** (SPI — Schedule Performance Index)
- **¿Estamos dentro del presupuesto?** (CPI — Cost Performance Index)

### 8.2 Configurar el sprint antes de medir

Ve a la tab **Avance del Sprint**. Verás una barra naranja con los campos de configuración:

**1. Fechas del sprint:**
- **Inicio**: primer día hábil del sprint (formato YYYY-MM-DD, ej: `2026-04-07`)
- **Fin**: último día hábil del sprint. O haz clic en **Auto** para calcularlo desde el inicio + capacidad del equipo

**2. BAC (Budget at Completion):**  
Es el presupuesto total del sprint. Puedes dejarlo en blanco para que se calcule automáticamente desde las estimaciones PERT, o escribir un valor manual si el contrato fija un número diferente.

**3. Unidad de medición:**  
Haz clic en los botones `COP` o `Horas` para seleccionar la unidad en que medirás. La tabla de HUs mostrará los campos en la unidad elegida.

### 8.3 Registrar la primera medición (inicio del sprint)

Al inicio del sprint, todos los valores son 0. El primer día hábil:

1. En la tabla de HUs, para cada HU registra en la columna **PV** el valor planificado para ese día
   - PV del día 1 = (capacidad del día / total días hábiles del sprint) × horas estimadas de la HU
   - Ejemplo: sprint de 10 días, HU de 16h → PV día 1 ≈ 1.6h
2. Deja **EV** y **AC** en 0 (no has completado nada ni consumido recursos aún)
3. Haz clic en **Registrar medición**
4. En el campo **Notas** escribe la fecha o lo que corresponda
5. Haz clic en **Guardar snapshot**

El gráfico mostrará el punto inicial en la línea de PV.

### 8.4 Medir durante el sprint (cada 2–3 días)

Para cada medición:

1. Para cada HU en la tabla, actualiza:
   - **PV**: valor planificado acumulado hasta hoy (proporcional al calendario)
   - **EV**: valor del trabajo realmente completado hasta hoy (en las mismas unidades que el BAC). EV = % completado × horas estimadas de la HU
   - **AC**: costo real incurrido hasta hoy (horas consumidas o COP gastados)

2. Haz clic en **Registrar medición** y guarda el snapshot.

El gráfico se actualiza mostrando:
- Línea gris punteada: PV (línea base planificada)
- Línea verde: EV (avance real ganado)
- Línea naranja: AC (costo real)
- Línea verde punteada: tendencia proyectada de EV

### 8.5 Interpretar los indicadores

| Indicador | Cálculo | Resultado > 1 | Resultado < 1 |
|-----------|---------|---------------|---------------|
| **CPI** | EV / AC | Bajo presupuesto ✅ | Sobre presupuesto ⚠️ |
| **SPI** | EV / PV | Adelantado ✅ | Retrasado ⚠️ |
| **EAC** | BAC / CPI | — | Si < BAC: terminarás con ahorro |
| **TCPI** | (BAC−EV)/(BAC−AC) | Necesitas ser más eficiente | Puedes ir más lento |

**CPI y SPI > 1** = el sprint va bien.  
**CPI < 0.8 o SPI < 0.8** = alerta amarilla — revisa el equipo.  
**CPI < 0.6 o SPI < 0.6** = alerta roja — escala al cliente.

### 8.6 Entender el Gantt

En la misma tab "Avance del Sprint", debajo del gráfico EVM, verás el Gantt del sprint. El Gantt es un SVG generado automáticamente que muestra:

- **Barras naranjas**: tareas en la ruta crítica (determinan la duración mínima del sprint)
- **Barras grises**: tareas con holgura (pueden retrasarse sin afectar la entrega)
- **Línea roja vertical**: fecha actual

Si las barras naranjas superan la fecha de fin del sprint, la capacidad del equipo es insuficiente para las estimaciones actuales. Debes renegociar el alcance o agregar capacidad.

---

## 9. Exportar el respaldo y no perder trabajo

> **Advertencia crítica:** Todo el trabajo del dashboard (aprobaciones, feedback, estimaciones editadas, mediciones EVM) vive en el `localStorage` del navegador. Si limpias la caché del navegador, formateas el computador, o abres el archivo en otro browser, lo pierdes todo. El respaldo es el mecanismo de recuperación.

### 9.1 Exportar el respaldo

Cuando haya cambios sin exportar, verás un **banner naranja** en la parte superior del dashboard.

Para exportar:
1. Haz clic en el tab **📥 Respaldo ▾**
2. Selecciona **⬇ Exportar respaldo (Markdown)**
3. El navegador descarga un archivo `.md` con nombre como `Sprint-1-respaldo-2026-04-15.md`
4. Guarda ese archivo en tu repositorio Git o en Google Drive

**¿Qué contiene el respaldo?**

El archivo `.md` contiene texto legible (resumen de HUs, mediciones EVM) y un bloque JSON al final entre comentarios HTML. Ese bloque JSON es el que se usa para restaurar el estado exacto del dashboard.

### 9.2 Importar un respaldo

Si cambiaste de computador, limpiaste la caché, o quieres compartir el estado con alguien:

1. Haz clic en el tab **📥 Respaldo ▾**
2. Selecciona **⬆ Importar respaldo (Markdown)**
3. Selecciona el archivo `.md` descargado anteriormente
4. El dashboard restaura exactamente el estado en que estaba cuando exportaste: aprobaciones, feedback, estimaciones PERT editadas, mediciones EVM, fechas del sprint, unidad y BAC

**Qué restaura el respaldo:**
- Estado de aprobación de cada HU (aprobada / rechazada / pendiente)
- Feedback escrito en cada HU
- Respuestas a preguntas de clarificación
- Estimaciones PERT editadas manualmente
- Historial de mediciones EVM (todos los snapshots)
- Fechas de inicio y fin del sprint
- Unidad de medición (COP o Horas)
- BAC personalizado si lo configuraste

**Frecuencia recomendada de exportación:**
- Al terminar cada sesión de revisión de HUs
- Cada vez que registres una medición EVM
- Antes de cerrar el navegador si el banner naranja está visible

---

## 10. Generar la Bitácora PMO al cierre del sprint

### 10.1 Qué es la Bitácora PMO

Es el informe de cierre del sprint para la PMO (Project Management Office). Contiene los KPIs EVM finales, el historial de mediciones, una imagen del gráfico, y los 5 riesgos más graves del sprint.

### 10.2 Generarla

En la tab **Avance del Sprint**, haz clic en el botón:

```
📋 Generar Bitácora PMO (PDF)
```

El navegador abre el diálogo de impresión del sistema operativo. Selecciona **"Guardar como PDF"** (o "Microsoft Print to PDF" en Windows). Elige la carpeta de destino y guarda.

**Configuración de impresión recomendada:**
- Papel: Carta (Letter) o A4
- Orientación: Vertical
- Márgenes: Mínimos o Ninguno
- Gráficos de fondo: activados (para que se vea el gráfico EVM)

### 10.3 Descargar la bitácora como Markdown

Para archivar o enviar por correo sin un PDF:

En la tab **Avance del Sprint**, haz clic en el botón **⬇ Descargar .md**. Se descarga el archivo `Sprint-1-bitacora-pmo-2026-04-15.md` con la misma información en texto plano.

---

## 11. Iterar sobre HUs rechazadas

Si rechazaste una o más HUs con feedback, el agente puede re-analizarlas sin tocar las aprobadas.

### 11.1 Exportar el estado antes de iterar

Antes de ejecutar la iteración, exporta el respaldo para que el agente pueda leer el feedback y los estados actuales:

1. Haz clic en **📥 Respaldo ▾ → Exportar respaldo (Markdown)**
2. El archivo `.md` se descarga en la carpeta de descargas del sistema

No necesitas moverlo; el agente lo buscará en las carpetas estándar, o puedes pasarle la ruta explícitamente.

### 11.2 Ejecutar la iteración

En el chat del agente:

```
/refinar-sprint Sprint-1 --iteracion
```

El agente:
1. Lee el `output/Sprint-1/data.json` existente
2. Identifica las HUs con estado rechazado o con feedback no vacío
3. Re-analiza solo esas HUs, incorporando el feedback
4. Las HUs aprobadas quedan intactas
5. Regenera `output/Sprint-1/index.html` con los resultados mezclados

### 11.3 Revisar los cambios

Recarga el dashboard en el navegador (F5 o Cmd+R). Las HUs re-analizadas muestran el análisis actualizado. Revisa que el feedback fue incorporado y aprueba o vuelve a rechazar según corresponda.

---

## 12. Cierre del sprint y retrospectiva

### 12.1 Checklist de cierre

Antes de dar el sprint por cerrado:

- [ ] Todas las HUs están aprobadas (estado verde en la tabla)
- [ ] La última medición EVM del sprint está registrada (con el EV y AC finales)
- [ ] Se generó y guardó la Bitácora PMO (PDF)
- [ ] Se exportó el respaldo Markdown final y se guardó en el repositorio o Drive

### 12.2 Actualizar el contexto para el siguiente sprint

Esta es la acción más importante de la retrospectiva. Abre `docs/contexto/contexto-funcional.md` y actualiza:

- Agrega reglas de negocio descubiertas durante el sprint
- Actualiza actores si apareció alguno nuevo
- Corrige cualquier regla que resultó ser incorrecta o incompleta

Abre `docs/contexto/contexto-tecnico.md` y actualiza:

- Servicios o módulos descubiertos que no estaban documentados
- Restricciones técnicas que surgieron durante el desarrollo
- Cambios en el equipo (nuevos integrantes, cambios de rol, capacidad diferente)

**Por qué esto importa:** El contexto se lee en cada análisis. Un contexto más rico en el Sprint 2 genera análisis más precisos, riesgos más relevantes y estimaciones más ajustadas.

### 12.3 Crear la carpeta del siguiente sprint

```bash
mkdir docs/HUs/Sprint-2
```

Y repetir desde el paso 4.

---

## 13. Referencia rápida de comandos

| Comando | Cuándo usarlo |
|---------|---------------|
| `/refinar-sprint Sprint-X` | Primera vez — analiza todas las HUs del sprint en paralelo |
| `/refinar-sprint Sprint-X --iteracion` | Re-analiza solo las HUs rechazadas o con feedback |
| `/refinar-sprint Sprint-X --consolidar` | Regenera el HTML sin re-analizar (ej: cambió el template) |
| `/refinar-hu Sprint-X "HU-001-nombre.md"` | Analiza una sola HU (útil para probar o para HUs nuevas mid-sprint) |
| `/generar-informe Sprint-X` | Genera el informe ejecutivo para el cliente en la tab "Informe Cliente" |
| `/generar-specs Sprint-X` | Genera especificaciones técnicas SDD detalladas |

---

## 14. Glosario de conceptos clave

### INVEST

Marco de evaluación de historias de usuario. Una buena HU debe ser:

| Letra | Criterio | Qué significa |
|-------|----------|---------------|
| **I** | Independiente | No depende de otra HU activa para poder desarrollarse |
| **N** | Negociable | Define el QUÉ, no el CÓMO. El equipo puede proponer la solución técnica |
| **V** | Valiosa | Tiene valor de negocio claro para el usuario final o el cliente |
| **E** | Estimable | Se puede estimar con la información disponible |
| **S** | Small (pequeña) | Cabe en un sprint. Si no cabe, debe dividirse |
| **T** | Testeable | Se puede verificar con criterios objetivos y medibles |

### ISO/IEC/IEEE 29148:2018

Standard de ingeniería de sistemas para la definición de requisitos. Define 9 atributos que debe tener un requisito de calidad:

| # | Atributo | Pregunta que responde |
|---|----------|-----------------------|
| 1 | Necesario | ¿Sin esto hay deficiencia en el sistema? |
| 2 | Apropiado | ¿El nivel de detalle es el correcto para una HU? |
| 3 | Inequívoco | ¿Tiene una sola interpretación posible? |
| 4 | Completo | ¿Describe exhaustivamente la capacidad? |
| 5 | Singular | ¿Expresa una sola capacidad (no dos con "y")? |
| 6 | Factible | ¿Es realizable con el equipo y tiempo disponibles? |
| 7 | Verificable | ¿Se puede probar objetivamente con umbrales medibles? |
| 8 | Correcto | ¿Representa fielmente la necesidad del negocio? |
| 9 | Conforme | ¿Sigue el formato Como / Quiero / Para que? |

### PERT (Program Evaluation and Review Technique)

Técnica de estimación probabilística. Para cada tarea se definen tres escenarios:

- **O (Optimista):** horas si absolutamente todo sale bien, sin interrupciones ni sorpresas
- **P (Probable):** horas en condiciones normales de trabajo del equipo
- **Pe (Pesimista):** horas si aparecen problemas típicos: dependencias bloqueadas, requisitos incompletos, bugs en componentes base

La estimación esperada:
```
E = (O + 4×P + Pe) / 6
```

El factor 4 en `P` refleja que el escenario probable es el más informativo. La fórmula pondera más el centro de la distribución que los extremos.

La desviación estándar `σ = (Pe − O) / 6` mide la incertidumbre: cuanto mayor la diferencia entre Pe y O, mayor el riesgo de la estimación.

### Gherkin (BDD — Behavior Driven Development)

Formato de escritura de criterios de aceptación en lenguaje de negocio comprensible por todos:

```gherkin
Escenario: [nombre del flujo]
  Dado que [contexto inicial / precondición]
  Cuando [acción que ejecuta el usuario]
  Entonces [resultado esperado y verificable]
  Y [condición adicional si aplica]
```

Regla: el "Entonces" debe ser siempre verificable. No sirve "el sistema funciona correctamente". Sí sirve "el sistema muestra el mensaje 'Sesión iniciada' y redirige al dashboard en menos de 3 segundos".

### RISICAR (DAFP Colombia)

Metodología de gestión de riesgos del Departamento Administrativo de la Función Pública de Colombia. Califica cada riesgo por:

- **Probabilidad** (1–5): desde "Rara vez ocurre" hasta "Casi seguro que ocurre"
- **Gravedad** (1–5): desde "Impacto insignificante" hasta "Impacto catastrófico"

```
Nivel = Probabilidad × Gravedad
```

| Nivel | Rango | Color | Acción |
|-------|-------|-------|--------|
| Tolerable | 1–4 | 🟢 Verde | Monitorear periódicamente |
| Grave | 5–9 | 🟡 Ámbar | Definir plan de mitigación |
| Crítico | 10–14 | 🔴 Rojo | Acción inmediata del líder del proyecto |
| Inaceptable | 15–25 | 🔴 Rojo oscuro | Escalar a dirección. No iniciar sin mitigación |

### Métricas EVM

| Sigla | Nombre | Fórmula | Qué indica |
|-------|--------|---------|------------|
| **BAC** | Budget at Completion | — | Presupuesto total del sprint |
| **PV** | Planned Value | — | Trabajo planificado hasta hoy |
| **EV** | Earned Value | — | Valor del trabajo completado hasta hoy |
| **AC** | Actual Cost | — | Costo real incurrido hasta hoy |
| **CPI** | Cost Performance Index | EV / AC | Eficiencia de costo (>1 = bajo presupuesto) |
| **SPI** | Schedule Performance Index | EV / PV | Eficiencia de cronograma (>1 = adelantado) |
| **CV** | Cost Variance | EV − AC | Variación de costo (negativo = desviación) |
| **SV** | Schedule Variance | EV − PV | Variación de cronograma (negativo = retraso) |
| **EAC** | Estimate at Completion | BAC / CPI | Costo proyectado al cierre del sprint |
| **ETC** | Estimate to Complete | EAC − AC | Costo restante para terminar |
| **VAC** | Variance at Completion | BAC − EAC | Si negativo: terminarás sobre presupuesto |
| **TCPI** | To Complete Performance Index | (BAC−EV)/(BAC−AC) | CPI que necesitas mantener para terminar en presupuesto |

---

*Requirement Refinator · Creado por Mauricio Sepúlveda Henao con Claude Code y Antigravity · MetodologIA 2026*
