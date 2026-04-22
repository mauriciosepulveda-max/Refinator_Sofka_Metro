#!/usr/bin/env node
/**
 * preflight-check.js — Requirement Refinator V3
 *
 * Port 1:1 de preflight-check.sh a Node. Motivación: elimina dependencia
 * de bash/POSIX para que el framework corra en Windows (PowerShell/cmd/Git
 * Bash), macOS, Linux y runners CI sin shell personalizado.
 *
 * Chequeos que detectan fallos del framework antes de ejecutar /refinar-sprint:
 *   1. Sin merge markers (<<<<<<<, =======, >>>>>>>) en archivos tracked.
 *   2. Skills del proyecto registradas en .claude/skills/<name>/SKILL.md.
 *   3. Agentes del proyecto registrados en .claude/agents/<name>.md
 *      (excluyendo .claude/agents/_legacy/).
 *   4. El <script> del template sprint-dashboard.html compila como JS válido.
 *
 * Uso:
 *   node scripts/preflight-check.js
 *
 * Contextos de ejecución:
 *   - Primer paso de Fase -1 del orchestrator (defensa runtime).
 *   - Pre-commit hook local (defensa desarrollador).
 *   - Verificación manual.
 *
 * Exit codes: 0=OK, 1=fallos encontrados, 2=error de ejecución.
 *
 * Sin dependencias externas (solo builtins de Node ≥ 18).
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

function walk(dir, skip) {
  // Recorre dir recursivamente y devuelve rutas a archivos (no directorios).
  // `skip` es una función (relPath) → bool; si true, no desciende ni incluye.
  const out = [];
  const root = dir;
  (function recur(current) {
    let entries;
    try { entries = fs.readdirSync(current, { withFileTypes: true }); }
    catch (_) { return; }
    for (const e of entries) {
      const full = path.join(current, e.name);
      const rel = path.relative(root, full).split(path.sep).join('/');
      if (skip && skip(rel, e)) continue;
      if (e.isDirectory()) recur(full);
      else if (e.isFile()) out.push(full);
    }
  })(root);
  return out;
}

function hasMergeMarkers(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch (_) { return false; }
  // Solo flagear markers a inicio de línea (patrón clásico de git).
  return /^(?:<<<<<<<|=======|>>>>>>>)/m.test(content);
}

function check1MergeMarkers(root) {
  console.log('[preflight] 1/4 · Merge markers en archivos críticos...');
  const scanTargets = [
    'CLAUDE.md',
    'templates/core',
    '.claude/agents',
    '.claude/skills',
  ];
  const offenders = [];
  for (const t of scanTargets) {
    const abs = path.join(root, t);
    if (!fs.existsSync(abs)) continue;
    const stat = fs.statSync(abs);
    if (stat.isFile()) {
      if (hasMergeMarkers(abs)) offenders.push(t);
      continue;
    }
    // Directorio: walk recursivo, excluyendo _legacy/.
    const files = walk(abs, (rel) => rel === '_legacy' || rel.startsWith('_legacy/'));
    for (const f of files) {
      if (hasMergeMarkers(f)) {
        offenders.push(path.relative(root, f).split(path.sep).join('/'));
      }
    }
  }
  if (offenders.length > 0) {
    console.log('  ✗ Merge markers sin resolver en:');
    for (const o of offenders) console.log('    ' + o);
    return offenders.length;
  }
  console.log('  ✓ sin merge markers');
  return 0;
}

function check2Skills(root) {
  console.log('[preflight] 2/4 · Skills del proyecto registrados...');
  const required = [
    'refinar-sprint',
    'refinar-hu',
    'iterar-refinamiento',
    'generar-informe',
    'generar-specs',
  ];
  let missing = 0;
  for (const s of required) {
    const p = path.join(root, '.claude', 'skills', s, 'SKILL.md');
    if (!fs.existsSync(p)) {
      console.log(`  ✗ skill faltante: .claude/skills/${s}/SKILL.md`);
      missing++;
    }
  }
  if (missing === 0) {
    console.log(`  ✓ ${required.length}/${required.length} skills registradas en .claude/skills/<name>/`);
  } else {
    console.log('  ℹ El runtime de Claude Code descubre skills en .claude/skills/<name>/ (no en subnamespaces).');
  }
  return missing;
}

function check3Agents(root) {
  console.log('[preflight] 3/4 · Agentes del proyecto registrados...');
  const required = [
    'orchestrator',
    'hu-full-analyzer',
    'report-builder',
    'client-report-generator',
    'spec-writer',
  ];
  let missing = 0;
  for (const a of required) {
    const p = path.join(root, '.claude', 'agents', `${a}.md`);
    if (!fs.existsSync(p)) {
      console.log(`  ✗ agente faltante: .claude/agents/${a}.md`);
      missing++;
    }
  }
  if (missing === 0) {
    console.log(`  ✓ ${required.length}/${required.length} agentes registrados en .claude/agents/`);
  }
  return missing;
}

function check4TemplateJs(root) {
  console.log('[preflight] 4/4 · Template JS syntax...');
  const tplPath = path.join(root, 'templates', 'core', 'sprint-dashboard.html');
  if (!fs.existsSync(tplPath)) {
    console.log('  ✗ templates/core/sprint-dashboard.html ausente');
    return 1;
  }
  const html = fs.readFileSync(tplPath, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => m[1]).join(';\n');
  try {
    // eslint-disable-next-line no-new-func
    new Function(scripts);
    console.log('  ✓ template JS válido — todos los <script> compilan');
    return 0;
  } catch (e) {
    console.log(`  ✗ template JS rompe: FAIL:${e.message}`);
    return 1;
  }
}

function main() {
  let root;
  try { root = repoRoot(); }
  catch (e) {
    console.error(`[preflight] error de ejecución: ${e.message}`);
    process.exit(2);
  }
  try { process.chdir(root); }
  catch (e) {
    console.error(`[preflight] error de ejecución: ${e.message}`);
    process.exit(2);
  }

  let errors = 0;
  errors += check1MergeMarkers(root);
  errors += check2Skills(root);
  errors += check3Agents(root);
  errors += check4TemplateJs(root);

  console.log('');
  if (errors > 0) {
    console.log(`[preflight] ✗ FALLÓ · ${errors} fallo(s)`);
    console.log('           Corrige antes de commit o antes de ejecutar /refinar-sprint.');
    process.exit(1);
  }
  console.log('[preflight] ✓ TODOS los chequeos pasaron');
  process.exit(0);
}

try { main(); }
catch (e) {
  console.error(`[preflight] excepción no esperada: ${e.message}`);
  process.exit(2);
}
