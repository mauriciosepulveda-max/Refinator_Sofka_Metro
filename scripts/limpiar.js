#!/usr/bin/env node
/**
 * limpiar.js — Deja tu repo en estado "listo para empezar".
 *
 * Port de limpiar.sh a Node con un fix crítico: el .sh hardcodeaba
 * ~/Documents/PM-refinador como ruta al main repo. Aquí se detecta
 * leyendo `git worktree list --porcelain` y tomando la PRIMERA entrada
 * (el runtime de git siempre reporta el main worktree primero), de modo
 * que funciona para cualquier clon en cualquier ubicación.
 *
 * NO se usa `git rev-parse --show-toplevel` como alternativa porque,
 * ejecutado dentro de un worktree, devuelve la ruta del worktree, no
 * la del main.
 *
 * Uso:
 *   node scripts/limpiar.js
 *
 * Qué hace:
 *   1. Te lleva al directorio del repo principal.
 *   2. Borra cualquier worktree/rama de sesión anterior (claude/*, feature/*).
 *   3. Te deja parado en `main`.
 *   4. Baja los últimos cambios de GitHub.
 *   5. Reporta el estado final.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function run(cmd, args, opts) {
  return spawnSync(cmd, args, { encoding: 'utf8', shell: false, ...(opts || {}) });
}

function findMainRepoRoot() {
  const probe = run('git', ['worktree', 'list', '--porcelain']);
  if (probe.status !== 0 || !probe.stdout) {
    return null;
  }
  // El formato de --porcelain agrupa cada worktree en bloques separados por
  // línea en blanco. La PRIMERA entrada es SIEMPRE el main worktree.
  const mainEntry = probe.stdout.split(/\r?\n\r?\n/)[0] || '';
  const mainLine = mainEntry.split(/\r?\n/)
    .find(l => l.startsWith('worktree '));
  if (!mainLine) return null;
  return mainLine.slice('worktree '.length).trim();
}

function parseWorktrees(stdout) {
  // Devuelve [{path, branch}]. `branch` puede ser null (detached) o refs/heads/...
  const blocks = stdout.split(/\r?\n\r?\n/).filter(b => b.trim());
  return blocks.map(block => {
    const lines = block.split(/\r?\n/);
    let wt = null, branch = null;
    for (const l of lines) {
      if (l.startsWith('worktree ')) wt = l.slice('worktree '.length).trim();
      else if (l.startsWith('branch ')) branch = l.slice('branch '.length).trim();
    }
    return { path: wt, branch };
  }).filter(e => e.path);
}

function main() {
  const repoRoot = findMainRepoRoot();
  if (!repoRoot || !fs.existsSync(path.join(repoRoot, '.git'))) {
    console.log(`✗ No encuentro el repo principal${repoRoot ? ': ' + repoRoot : ''}`);
    process.exit(1);
  }
  process.chdir(repoRoot);

  console.log('🧹 Limpiando tu espacio de trabajo...');
  console.log('');

  // 2. Si estamos dentro de un worktree, salir a main primero.
  const currentBranchR = run('git', ['branch', '--show-current']);
  const currentBranch = (currentBranchR.stdout || '').trim();
  if (currentBranch !== 'main') {
    run('git', ['checkout', 'main']);
  }

  // 3. Remover worktrees de sesiones anteriores (excepto el principal).
  const wtList = run('git', ['worktree', 'list', '--porcelain']);
  if (wtList.status === 0 && wtList.stdout) {
    const entries = parseWorktrees(wtList.stdout);
    for (const e of entries) {
      if (!e.branch) continue; // main workdir puede no tener branch line explícita en algunos casos
      if (!/^refs\/heads\/(claude|feature)\//.test(e.branch)) continue;
      // Nunca tocar el main repo.
      if (path.resolve(e.path) === path.resolve(repoRoot)) continue;
      console.log(`  · Quitando worktree viejo: ${path.basename(e.path)}`);
      run('git', ['worktree', 'remove', '--force', e.path]);
    }
    run('git', ['worktree', 'prune']);
  }

  // 4. Borrar ramas locales de sesiones (claude/* y feature/*).
  const branchesR = run('git', ['branch']);
  let deleted = 0;
  if (branchesR.status === 0 && branchesR.stdout) {
    const lines = branchesR.stdout.split(/\r?\n/).map(l => l.replace(/^[\s*]+/, '').trim());
    for (const name of lines) {
      if (!name) continue;
      if (!/^(claude|feature)\//.test(name)) continue;
      const r = run('git', ['branch', '-D', name]);
      if (r.status === 0) deleted++;
    }
  }
  if (deleted > 0) console.log(`  · ${deleted} rama(s) de sesión borrada(s)`);

  // 5. Sincronizar con GitHub.
  console.log('  · Bajando últimos cambios de GitHub...');
  run('git', ['fetch', '--prune'], { stdio: ['ignore', 'ignore', 'ignore'] });
  run('git', ['pull', '--ff-only'], { stdio: ['ignore', 'ignore', 'ignore'] });

  // 6. Reporte final.
  console.log('');
  const finalBranchR = run('git', ['branch', '--show-current']);
  const finalBranch = (finalBranchR.stdout || '').trim();
  const totalBranchesR = run('git', ['branch']);
  const branchLines = (totalBranchesR.stdout || '').split(/\r?\n/).filter(l => l.trim());
  const total = branchLines.length;
  const lastCommitR = run('git', ['log', '-1', '--oneline']);
  const lastCommit = (lastCommitR.stdout || '').trim();

  if (finalBranch === 'main' && total === 1) {
    console.log('✅ LISTO. Tu espacio está limpio.');
    console.log('');
    console.log('   📍 Estás en: main');
    console.log(`   📝 Último cambio: ${lastCommit}`);
    console.log('');
    console.log('   Ya puedes abrir Claude Code y empezar a trabajar tranquilo.');
  } else {
    console.log('⚠ Casi listo, pero hay algo raro. Muestra esto si pides ayuda:');
    console.log('');
    console.log(`   Rama actual: ${finalBranch}`);
    console.log(`   Ramas totales: ${total}`);
    process.stdout.write((totalBranchesR.stdout || ''));
  }
}

try { main(); }
catch (e) {
  console.error(`✗ excepción: ${e.message}`);
  process.exit(1);
}
