const fs = require('fs');
const path = require('path');

const specsDir = path.join(__dirname, 'specs', 'Sprint-1');
const files = fs.readdirSync(specsDir).filter(f => f.endsWith('-v1.spec.md'));

files.forEach(f => {
    const filePath = path.join(specsDir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace('estado: BORRADOR (v1)', 'estado: APROBADO (v1)');
    content = content.replace('aprobado_por: Pendiente', 'aprobado_por: PM (aprobación en bloque)');
    fs.writeFileSync(filePath, content, 'utf8');
});

console.log(`${files.length} specs marcados como APROBADOS.`);
