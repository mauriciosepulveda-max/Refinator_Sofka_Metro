const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'output', 'Sprint-1');
const files = fs.readdirSync(dir).filter(f => f.startsWith('US-') && f.endsWith('.html'));

const cssDarkVars = `
  --sofka-bg:#0F0F11;--sofka-surface:#16161A;--sofka-surface-2:#202124;--sofka-border:#303136;
  --sofka-text:#E2E8F0;--sofka-text-s:#94A3B8;--sofka-text-xs:#64748B;
`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // 1. Dark Mode Background Root
    content = content.replace(/--sofka-bg:#FAF8F6;\s*--sofka-surface:#FFFFFF;\s*--sofka-surface-2:#F5F2EF;\s*--sofka-border:#E8E2DA;\s*--sofka-text:#111110;\s*--sofka-text-s:#6B6560;\s*--sofka-text-xs:#A09890;/g, cssDarkVars);

    // 2. Gherkin Textareas
    // We try to safely replace </div> after gherkin-iso or gherkin-code (if iso doesn't exist) inside a gherkin-card.
    // A safer way is to replace the closing </div> of <div class="gherkin-card">.
    // Wait, regex might fail across newlines. Let's do string splitting since HTML is somewhat predictable.
    let cards = content.split('<div class="gherkin-card">');
    for (let i = 1; i < cards.length; i++) {
        const lastDivIndex = cards[i].lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
            cards[i] = cards[i].substring(0, lastDivIndex) + `\n<div style="margin-top:0.75rem"><textarea class="ac-feedback" placeholder="Añadir Observación a este Criterio de Aceptación (opcional)..." style="width:100%;min-height:50px;background:var(--sofka-bg);border:1px solid var(--sofka-border);color:var(--sofka-text);padding:6px;border-radius:4px;font-size:0.8rem;resize:vertical;"></textarea></div>\n` + cards[i].substring(lastDivIndex);
        }
    }
    content = cards.join('<div class="gherkin-card">');

    // 3. Questions
    let questions = content.split('<div class="q-item">');
    for (let i = 1; i < questions.length; i++) {
        const nextDiv = questions[i].indexOf('</div>');
        if (nextDiv !== -1) {
            questions[i] = questions[i].substring(0, nextDiv) + `<textarea class="q-feedback" placeholder="Respuesta del usuario..." style="width:100%;margin-top:6px;min-height:40px;background:var(--sofka-bg);border:1px solid var(--sofka-border);color:var(--sofka-text);padding:6px;border-radius:4px;font-size:0.8rem;resize:vertical;"></textarea>` + questions[i].substring(nextDiv);
        }
    }
    content = questions.join('<div class="q-item">');

    // 4. Tasks (Replacing td for hours with inputs). The original lines look like:
    // <td>1h</td><td>2h</td><td>4h</td><td><strong>2.2h</strong></td>
    // Regex to match "<td>Xh</td><td>Yh</td><td>Zh</td><td><strong>Wh</strong></td>"
    // Note: Table headers also need changing!
    content = content.replace(/<th>O<\/th><th>P<\/th><th>Pe<\/th><th>PERT<\/th>/g, '<th>O</th><th>M</th><th>P</th><th>PERT</th>');
    
    // Replace task times with PERT inputs
    // The previous names were "O, P, Pe" where P was Most likely, Pe was pessimistic. We will use M, P.
    content = content.replace(/<td>([\d.]+)h<\/td><td>([\d.]+)h<\/td><td>([\d.]+)h<\/td><td><strong>([\d.]+)h<\/strong><\/td>/g, 
        (match, o, m, p, pert) => {
            return `<td><input type="number" class="pert-o" value="${o}" step="0.5" style="width:55px;background:var(--sofka-bg);color:var(--sofka-text);border:1px solid var(--sofka-border);padding:2px 4px;border-radius:4px" onchange="calcPert()"></td><td><input type="number" class="pert-m" value="${m}" step="0.5" style="width:55px;background:var(--sofka-bg);color:var(--sofka-text);border:1px solid var(--sofka-border);padding:2px 4px;border-radius:4px" onchange="calcPert()"></td><td><input type="number" class="pert-p" value="${p}" step="0.5" style="width:55px;background:var(--sofka-bg);color:var(--sofka-text);border:1px solid var(--sofka-border);padding:2px 4px;border-radius:4px" onchange="calcPert()"></td><td class="pert-res" style="font-weight:700;color:var(--sofka-orange)">${pert}h</td>`;
        }
    );

    // Add PERT JS and Feedback replacement Logic
    const scriptTagIndex = content.lastIndexOf('<script>');
    if (scriptTagIndex !== -1) {
        const replacementScript = `
function calcPert() {
    let total = 0;
    const body = document.querySelector('.tbl tbody');
    if(!body) return;
    const rows = body.querySelectorAll('tr');
    rows.forEach(tr => {
        const os = tr.querySelector('.pert-o'), ms = tr.querySelector('.pert-m'), ps = tr.querySelector('.pert-p');
        if(os && ms && ps) {
            const o = parseFloat(os.value)||0, m = parseFloat(ms.value)||0, p = parseFloat(ps.value)||0;
            const pert = (o + 4*m + p) / 6;
            const resEl = tr.querySelector('.pert-res');
            if(resEl) resEl.innerText = pert.toFixed(1) + 'h';
            total += pert;
        }
    });
    const totalEl = document.querySelector('.task-total');
    if(totalEl) totalEl.innerHTML = '📊 Total Recalculado: ' + total.toFixed(1) + ' horas (E='+total.toFixed(1)+'h)';
}

function exportFeedbackMarkdown(statusFlag) {
    const title = document.title.split('—')[0].trim();
    let md = "# SYSTEM INSTRUCTION PARA CLAUDE\\n\\n";
    md += "Ejecuta una Segunda Iteración de Refinamiento sobre la historia de usuario abajo listada, aplicando el feedback provisto con rigurosidad matemática y lógica.\\n";
    md += "RESTRICCIÓN: PROHIBIDO alucinar. Ajusta estrictamente lo mencionado. Puedes generar nuevas preguntas de ser absolutamente necesario.\\n\\n";
    
    md += "## Historia de Usuario Destino\\n";
    md += "**" + title + "**\\n";
    md += "**Estado Forzado por PM:** " + statusFlag + "\\n\\n";

    md += "## 1. Ajustes en Tareas y PERT\\n";
    let pertAdjusted = false;
    document.querySelectorAll('.tbl tbody tr').forEach(tr => {
        const nameCell = tr.querySelector('td:nth-child(2) strong');
        if(!nameCell) return;
        const os = tr.querySelector('.pert-o'), ms = tr.querySelector('.pert-m'), ps = tr.querySelector('.pert-p');
        if(os) { // Si es de tipo tarea estimable
           const originalPert = os.getAttribute('value'); // The initial HTML value, well we don't have original pert stored in attribute, but we can just pass the current one
           md += "- [TAREA: " + nameCell.innerText + "] Nuevos valores PERT -> O: " + os.value + ", M: " + ms.value + ", P: " + ps.value + ". Ajustar horas basado en esto.\\n";
           pertAdjusted = true;
        }
    });
    if(!pertAdjusted) md += "Ningún ajuste de horas registrado.\\n\\n";
    else md += "\\n";

    md += "## 2. Objeciones en Criterios de Aceptación (Gherkin)\\n";
    let acAdjusted = false;
    document.querySelectorAll('.gherkin-card').forEach(card => {
        const titleBadge = card.querySelector('.badge-blue');
        const fb = card.querySelector('.ac-feedback');
        if(fb && fb.value.trim().length > 0) {
            md += "- [CRITERIO " + (titleBadge ? titleBadge.innerText : '') + "]: " + fb.value.trim() + "\\n";
            acAdjusted = true;
        }
    });
    if(!acAdjusted) md += "No hay correcciones en los CA.\\n\\n";
    else md += "\\n";

    md += "## 3. Respuestas a Preguntas de la IA\\n";
    let qAdjusted = false;
    document.querySelectorAll('.q-item').forEach(q => {
        const qTitle = q.querySelector('strong');
        const fb = q.querySelector('.q-feedback');
        if(fb && fb.value.trim().length > 0) {
            md += "- [" + (qTitle ? qTitle.innerText : '') + "]: " + fb.value.trim() + "\\n";
            qAdjusted = true;
        }
    });
    if(!qAdjusted) md += "No hay respuestas pendientes diligenciadas.\\n\\n";
    else md += "\\n";

    md += "## 4. Instrucción Global del Arquitecto / PM\\n";
    const pmFb = document.getElementById('pm-feedback');
    if(pmFb && pmFb.value.trim().length > 0) {
        md += pmFb.value.trim() + "\\n";
    } else {
        md += "Ningún comentario global.\\n";
    }

    // Generate Blob Download
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`FEEDBACK_\${title}_Iteracion2.md\`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Alerta update
    saveState(statusFlag === '[ APROBADA ]' ? 'approved' : 'rejected');
    showStatus(statusFlag === '[ APROBADA ]' ? 'approved' : 'rejected');
}

        `;
        
        let newHitlActions = `
    <div class="hitl-actions" style="border-top:1px solid var(--sofka-border); padding-top:var(--space-4);">
      <button class="btn btn-approve" onclick="exportFeedbackMarkdown('[ APROBADA ]')">📥 Exportar Feedback & Aprobar HU</button>
      <button class="btn btn-reject" onclick="exportFeedbackMarkdown('[ ITERACIÓN PENDIENTE ]')">📥 Exportar Feedback (NO APROBADO)</button>
    </div>
        `;
        
        // Remove old hitl-actions 
        const hitlStart = content.indexOf('<div class="hitl-actions">');
        const hitlEnd = content.indexOf('</div>', hitlStart) + 6;
        if(hitlStart !== -1) {
           content = content.substring(0, hitlStart) + newHitlActions + content.substring(hitlEnd);
        }

        // Insert new script functions
        content = content.substring(0, scriptTagIndex + 8) + replacementScript + content.substring(scriptTagIndex + 8);
    }
    
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

console.log('✓ Modificados exitosamente ' + files.length + ' archivos HU para inyectar PERT y Blob Markdown.');
