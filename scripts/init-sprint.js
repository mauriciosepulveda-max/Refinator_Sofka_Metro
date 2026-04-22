#!/usr/bin/env node
/**
 * init-sprint.js — Requirement Refinator V3
 *
 * Port 1:1 de init-sprint.sh a Node. Onboarding asistido para crear un
 * sprint nuevo o ingerir HUs desde una ruta externa.
 *
 * Uso:
 *   node scripts/init-sprint.js <sprint-id> --init
 *       Crea docs/HUs/<sprint-id>/ (vacío) y copia los templates de contexto
 *       si no existen los archivos reales.
 *
 *   node scripts/init-sprint.js <sprint-id> --ingest <ruta-externa>
 *       Copia todos los archivos .md de <ruta-externa> (no recursivo) a
 *       docs/HUs/<sprint-id>/. Busca contextos dentro de <ruta-externa>
 *       hasta 3 niveles y, si los encuentra, los copia a docs/contexto/
 *       (sin sobrescribir archivos existentes). Valida narrativa y CAs.
 *
 * Exit codes: 0 = OK · 1 = error de uso · 2 = fallo operativo.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function repoRoot() {
  const r = spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  if (r.status === 0) return r.stdout.trim();
  return process.cwd();
}

function usage(code) {
  process.stdout.write([
    'Uso:',
    '  node scripts/init-sprint.js <sprint-id> --init',
    '  node scripts/init-sprint.js <sprint-id> --ingest <ruta-externa>',
    '',
    'Ejemplos:',
    '  node scripts/init-sprint.js Sprint-145 --init',
    '  node scripts/init-sprint.js Sprint-145 --ingest /Users/me/Documents/otroCliente/HUs/',
    '',
  ].join('\n'));
  process.exit(typeof code === 'number' ? code : 1);
}

function findRecursive(dir, pattern, maxDepth) {
  // Recorre dir hasta maxDepth (1 = solo el mismo dir) y devuelve rutas
  // absolutas que hacen match con el regex `pattern`. Reemplaza find -maxdepth.
  const out = [];
  (function recur(current, depth) {
    if (depth > maxDepth) return;
    let entries;
    try { entries = fs.readdirSync(current, { withFileTypes: true }); }
    catch (_) { return; }
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        if (depth < maxDepth) recur(full, depth + 1);
      } else if (e.isFile()) {
        if (pattern.test(e.name)) out.push(full);
      }
    }
  })(dir, 1);
  return out;
}

function validateSprintId(id) {
  return /^[A-Za-z0-9][A-Za-z0-9_-]+$/.test(id);
}

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (_) { return ''; }
}

function initSprint(sprintId) {
  const target = path.join('docs', 'HUs', sprintId);
  if (fs.existsSync(target)) {
    const n = findRecursive(target, /\.md$/, 1).length;
    console.log(`⚠ docs/HUs/${sprintId} ya existe con ${n} archivo(s) .md`);
    console.log(`  Agrega tus HUs o ejecuta: /refinar-sprint ${sprintId}`);
    return 0;
  }
  fs.mkdirSync(target, { recursive: true });
  console.log(`✓ Creado docs/HUs/${sprintId}/`);

  // Copiar templates de contexto si el archivo real no existe.
  for (const n of ['contexto-funcional', 'contexto-tecnico']) {
    const real = path.join('docs', 'contexto', `${n}.md`);
    const tmpl = path.join('docs', 'contexto', `${n}_template.md`);
    if (fs.existsSync(real)) continue;
    if (fs.existsSync(tmpl)) {
      fs.copyFileSync(tmpl, real);
      console.log(`✓ Creado docs/contexto/${n}.md (desde template)`);
    } else {
      console.log(`⚠ No encontré docs/contexto/${n}_template.md — crea docs/contexto/${n}.md manualmente`);
    }
  }

  process.stdout.write([
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `  ✅ Sprint ${sprintId} inicializado`,
    '',
    '  ➡ SIGUIENTES PASOS:',
    `    1. Agrega tus HUs (.md) en docs/HUs/${sprintId}/`,
    '    2. Edita docs/contexto/contexto-{funcional,tecnico}.md con info real',
    `    3. Ejecuta: /refinar-sprint ${sprintId}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
  ].join('\n'));
  return 0;
}

function ingestSprint(sprintId, src) {
  if (!src) { console.log('✗ --ingest requiere <ruta-externa>'); process.exit(1); }
  let st;
  try { st = fs.statSync(src); }
  catch (_) { console.log(`✗ ruta externa no existe o no es directorio: ${src}`); process.exit(2); }
  if (!st.isDirectory()) { console.log(`✗ ruta externa no existe o no es directorio: ${src}`); process.exit(2); }

  const target = path.join('docs', 'HUs', sprintId);
  fs.mkdirSync(target, { recursive: true });

  // 1) Copiar archivos .md del directorio raíz (no recursivo, depth=1).
  const mdFiles = findRecursive(src, /\.md$/, 1).filter(p => path.dirname(p) === path.resolve(src));
  let count = 0;
  for (const f of mdFiles) {
    const base = path.basename(f);
    fs.copyFileSync(f, path.join(target, base));
    count++;
  }
  console.log(`✓ ${count} archivo(s) .md copiados a docs/HUs/${sprintId}/`);

  // 2) Buscar contextos en la ruta externa (recursivo, hasta 3 niveles).
  const ctxFuncMatches = findRecursive(src, /.*contexto.*funcional.*\.md$/i, 3);
  const ctxTecMatches = findRecursive(src, /.*contexto.*(tecnico|técnico).*\.md$/i, 3);
  const ctxFunc = ctxFuncMatches[0] || null;
  const ctxTec = ctxTecMatches[0] || null;
  if (ctxFunc && !fs.existsSync(path.join('docs', 'contexto', 'contexto-funcional.md'))) {
    fs.mkdirSync(path.join('docs', 'contexto'), { recursive: true });
    fs.copyFileSync(ctxFunc, path.join('docs', 'contexto', 'contexto-funcional.md'));
    console.log(`✓ contexto-funcional.md importado desde: ${ctxFunc}`);
  }
  if (ctxTec && !fs.existsSync(path.join('docs', 'contexto', 'contexto-tecnico.md'))) {
    fs.mkdirSync(path.join('docs', 'contexto'), { recursive: true });
    fs.copyFileSync(ctxTec, path.join('docs', 'contexto', 'contexto-tecnico.md'));
    console.log(`✓ contexto-tecnico.md importado desde: ${ctxTec}`);
  }

  // 3) Validación mínima de las HUs copiadas.
  // Heurísticas equivalentes a los grep -qiE del .sh original.
  const reNarrativa = /quiero|requerimiento|como .* quiero/i;
  const reCriterios = /criteri[oa] de aceptaci|acceptance criteri/i;
  let warnings = 0;
  for (const f of findRecursive(target, /\.md$/, 1)) {
    const content = readFileSafe(f);
    const missing = [];
    if (!reNarrativa.test(content)) missing.push('narrativa');
    if (!reCriterios.test(content)) missing.push('criterios-aceptacion');
    if (missing.length > 0) {
      console.log(`  ⚠ ${path.basename(f)} — parece incompleto (falta: ${missing.join(' ')})`);
      warnings++;
    }
  }

  if (warnings > 0) {
    console.log('');
    console.log(`ℹ ${warnings} HU(s) con formato incompleto. El análisis las procesará pero generará más preguntas de clarificación.`);
  }

  process.stdout.write([
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `  ✅ Sprint ${sprintId} ingerido · ${count} HU(s)`,
    '',
    '  ➡ SIGUIENTE PASO:',
    `     /refinar-sprint ${sprintId}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
  ].join('\n'));
  return 0;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 2) usage(1);

  const [sprintId, mode, ...rest] = argv;
  if (!sprintId || !mode) usage(1);

  if (!validateSprintId(sprintId)) {
    console.log(`✗ sprint-id inválido: ${sprintId} (solo alfanumérico, '-' y '_')`);
    process.exit(1);
  }

  try { process.chdir(repoRoot()); }
  catch (e) {
    console.error(`✗ no pude posicionarme en la raíz del repo: ${e.message}`);
    process.exit(2);
  }

  switch (mode) {
    case '--init':
      process.exit(initSprint(sprintId));
      break;
    case '--ingest':
      process.exit(ingestSprint(sprintId, rest[0] || null));
      break;
    default:
      console.log(`✗ modo desconocido: ${mode}`);
      usage(1);
  }
}

try { main(); }
catch (e) {
  console.error(`✗ excepción no esperada: ${e.message}`);
  process.exit(2);
}
