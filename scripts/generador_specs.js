const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'output', 'Sprint-1', 'data.json');
const outDir = path.join(__dirname, 'specs', 'Sprint-1');

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

data.userStories.forEach(us => {
    let safeId = us.id.replace(/[^a-zA-Z0-9-]/g, '');
    let fileName = `${safeId}-v1.spec.md`;
    
    let mermaid = `\`\`\`mermaid
sequenceDiagram
    participant U as Actor/API
    participant S as SIPA Banca (BE)
    participant DB as PostgreSQL (syli)
    participant ST as Subsistema (Stratio/Everest)
    
    U->>S: Invoca evento para ${safeId}
    activate S
    S->>S: Valida reglas de negocio (CAs)
    S->>DB: Lee/Escribe estado en la DB
    DB-->>S: Operación Exitosa
    opt Comunicación Externa
        S->>ST: Petición API/Cola
        ST-->>S: Ack / Respuesta
    end
    S-->>U: Finaliza proceso e inyecta log
    deactivate S
\`\`\``;

    let content = `---
estado: BORRADOR (v1)
aprobado_por: Pendiente
historia_usuario: ${us.id}
sprint: ${data.sprint}
---

# Especificación Técnica SDD: ${us.titulo}

## 1. Contexto y Propósito
**Narrativa:**
${us.historiaUsuario}

## 2. Criterios de Aceptación (Gherkin)
\`\`\`gherkin
${us.criteriosAceptacion.join('\n\n')}
\`\`\`

## 3. Arquitectura y Flujo Trazable (Mermaid)
${mermaid}

## 4. Contrato de Integración y Datos
- **Control de Versiones BD:** Las modificaciones usarán scripts DML/DDL para Flyway (\`producto_plan\`, \`tp_sponsor\`, etc. según corresponda).
- **Control API:** Si hay payload (p.ej. hacia Stratio o desde Lulo Bank), se deberá extender el respectivo DTO manteniendo la retrocompatibilidad.

## 5. Desglose de Tareas de Ingeniería
${us.tareasTerminadas.map(t => `- [ ] [${t.perfil}] ${t.nombre} (*${t.estimacionHoras} hrs*)`).join('\n')}

## 6. Riesgos y Dependencias
**Vigilia Técnica (Riesgos):**
${us.riesgos && us.riesgos.length > 0 ? us.riesgos.map(r => `- **[${r.nivel}]** ${r.descripcion}`).join('\n') : "- Ningún riesgo bloqueante advertido."}

**Dependencias (Bloqueantes Previos):**
${us.dependencias && us.dependencias.length > 0 ? us.dependencias.map(d => `- ${d}`).join('\n') : "- Ninguna particular detectada."}

---
*Para aprobar este documento de Especificación (Spec-Driven Development), responda con: **"Apruebo el spec"**. En caso contrario, deje sus comentarios para generar la iteración v2.*
`;

    fs.writeFileSync(path.join(outDir, fileName), content, 'utf8');
});

console.log('Specs generados exitosamente en specs/Sprint-1/');
