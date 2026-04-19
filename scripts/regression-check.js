#!/usr/bin/env node
/**
 * regression-check.js — Valida un output del hu-full-analyzer contra un golden.
 *
 * Uso:  node scripts/regression-check.js <expectations.json> <output.json>
 *
 * Exit codes:
 *   0  → todas las reglas 'critical' pasan (las 'warning' se reportan sin bloquear)
 *   1  → al menos una regla 'critical' falla
 *   2  → error de entrada (archivos no legibles, JSON inválido, uso incorrecto)
 *
 * Salida (stdout): JSON con { ok, fixture_id, summary, results }.
 */
'use strict';

const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers

function loadJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (_e) { return null; }
}

function resolvePath(obj, path) {
  if (!path) return obj;
  const parts = path.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur === null || cur === undefined) return undefined;
    cur = cur[part];
  }
  return cur;
}

function splitArrayPath(path) {
  // "tareas[*].dod" → { arrayPath: "tareas", subPath: "dod" }
  // "tareas[*]"     → { arrayPath: "tareas", subPath: null }
  const idx = path.indexOf('[*]');
  if (idx === -1) return null;
  const arrayPath = path.slice(0, idx);
  let subPath = path.slice(idx + 3);
  if (subPath.startsWith('.')) subPath = subPath.slice(1);
  return { arrayPath, subPath: subPath || null };
}

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v;
}

// ─────────────────────────────────────────────────────────────────────────────
// Evaluadores por regla

function evalRule(rule, data) {
  const { rule: kind, path, value, min, max } = rule;

  switch (kind) {
    case 'equals': {
      const v = resolvePath(data, path);
      return v === value
        ? { ok: true }
        : { ok: false, details: `expected ${JSON.stringify(value)}, got ${JSON.stringify(v)}` };
    }

    case 'matches': {
      const v = resolvePath(data, path);
      if (typeof v !== 'string') return { ok: false, details: `expected string for regex, got ${typeOf(v)}` };
      let re;
      try { re = new RegExp(value); }
      catch (_e) { return { ok: false, details: `invalid regex: /${value}/` }; }
      return re.test(v)
        ? { ok: true }
        : { ok: false, details: `${JSON.stringify(v)} does not match /${value}/` };
    }

    case 'type': {
      const actual = typeOf(resolvePath(data, path));
      return actual === value
        ? { ok: true }
        : { ok: false, details: `expected type "${value}", got "${actual}"` };
    }

    case 'minLength': {
      const v = resolvePath(data, path);
      if (typeof v !== 'string') return { ok: false, details: `expected string, got ${typeOf(v)}` };
      return v.length >= value
        ? { ok: true }
        : { ok: false, details: `length ${v.length} < ${value}` };
    }

    case 'min': {
      const v = resolvePath(data, path);
      if (typeof v !== 'number') return { ok: false, details: `expected number, got ${typeOf(v)}` };
      return v >= value
        ? { ok: true }
        : { ok: false, details: `${v} < ${value}` };
    }

    case 'max': {
      const v = resolvePath(data, path);
      if (typeof v !== 'number') return { ok: false, details: `expected number, got ${typeOf(v)}` };
      return v <= value
        ? { ok: true }
        : { ok: false, details: `${v} > ${value}` };
    }

    case 'between': {
      const v = resolvePath(data, path);
      if (typeof v !== 'number') return { ok: false, details: `expected number, got ${typeOf(v)}` };
      return (v >= min && v <= max)
        ? { ok: true }
        : { ok: false, details: `${v} not in [${min}, ${max}]` };
    }

    case 'in': {
      const v = resolvePath(data, path);
      if (!Array.isArray(value)) return { ok: false, details: 'rule.value must be an array' };
      return value.includes(v)
        ? { ok: true }
        : { ok: false, details: `${JSON.stringify(v)} not in ${JSON.stringify(value)}` };
    }

    case 'contains_any': {
      const v = resolvePath(data, path);
      if (typeof v !== 'string') return { ok: false, details: `expected string, got ${typeOf(v)}` };
      if (!Array.isArray(value)) return { ok: false, details: 'rule.value must be an array of substrings' };
      return value.some((s) => v.includes(s))
        ? { ok: true }
        : { ok: false, details: `none of ${JSON.stringify(value)} found` };
    }

    case 'minArrayLength': {
      const v = resolvePath(data, path);
      if (!Array.isArray(v)) return { ok: false, details: `expected array, got ${typeOf(v)}` };
      return v.length >= value
        ? { ok: true }
        : { ok: false, details: `length ${v.length} < ${value}` };
    }

    case 'each_minLength': {
      const parts = splitArrayPath(path);
      if (!parts) return { ok: false, details: `invalid path for each_*: ${path}` };
      const arr = resolvePath(data, parts.arrayPath);
      if (!Array.isArray(arr)) return { ok: false, details: `expected array at ${parts.arrayPath}, got ${typeOf(arr)}` };
      for (let i = 0; i < arr.length; i++) {
        const el = parts.subPath ? resolvePath(arr[i], parts.subPath) : arr[i];
        if (typeof el !== 'string') return { ok: false, details: `[${i}] expected string, got ${typeOf(el)}` };
        if (el.length < value) return { ok: false, details: `[${i}] length ${el.length} < ${value}` };
      }
      return { ok: true };
    }

    case 'each_min': {
      const parts = splitArrayPath(path);
      if (!parts) return { ok: false, details: `invalid path for each_*: ${path}` };
      const arr = resolvePath(data, parts.arrayPath);
      if (!Array.isArray(arr)) return { ok: false, details: `expected array at ${parts.arrayPath}, got ${typeOf(arr)}` };
      for (let i = 0; i < arr.length; i++) {
        const el = parts.subPath ? resolvePath(arr[i], parts.subPath) : arr[i];
        if (typeof el !== 'number') return { ok: false, details: `[${i}] expected number, got ${typeOf(el)}` };
        if (el < value) return { ok: false, details: `[${i}] ${el} < ${value}` };
      }
      return { ok: true };
    }

    case 'each_pert_coherent': {
      const parts = splitArrayPath(path);
      if (!parts) return { ok: false, details: `invalid path for each_*: ${path}` };
      const arr = resolvePath(data, parts.arrayPath);
      if (!Array.isArray(arr)) return { ok: false, details: `expected array at ${parts.arrayPath}, got ${typeOf(arr)}` };
      for (let i = 0; i < arr.length; i++) {
        const el = parts.subPath ? resolvePath(arr[i], parts.subPath) : arr[i];
        if (!el || typeof el !== 'object') return { ok: false, details: `[${i}] expected object, got ${typeOf(el)}` };
        const o = el.estimacion_o, p = el.estimacion_p, pe = el.estimacion_pe;
        if (typeof o !== 'number' || typeof p !== 'number' || typeof pe !== 'number') {
          return { ok: false, details: `[${i}] missing O/P/Pe numeric fields` };
        }
        if (!(o <= p && p <= pe)) {
          return { ok: false, details: `[${i}] PERT incoherente: O=${o}, P=${p}, Pe=${pe}` };
        }
      }
      return { ok: true };
    }

    default:
      return { ok: false, details: `unknown rule: ${kind}` };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    process.stderr.write('Usage: node scripts/regression-check.js <expectations.json> <output.json>\n');
    process.exit(2);
  }
  const [expPath, outPath] = args;

  const expectations = loadJSON(expPath);
  if (!expectations || typeof expectations !== 'object') {
    process.stderr.write(`[regression-check] invalid expectations file: ${expPath}\n`);
    process.exit(2);
  }
  const output = loadJSON(outPath);
  if (!output || typeof output !== 'object') {
    process.stderr.write(`[regression-check] invalid output file: ${outPath}\n`);
    process.exit(2);
  }

  const rules = Array.isArray(expectations.expectations) ? expectations.expectations : [];
  if (rules.length === 0) {
    process.stderr.write(`[regression-check] no expectations[] in ${expPath}\n`);
    process.exit(2);
  }

  const results = [];
  let passed = 0, failedCritical = 0, failedWarning = 0;

  for (const r of rules) {
    const severity = r.severity || 'critical';
    const res = evalRule(r, output);
    const entry = {
      rule: r.rule,
      path: r.path || null,
      severity,
      ok: res.ok
    };
    if (!res.ok) entry.details = res.details;
    results.push(entry);
    if (res.ok) passed++;
    else if (severity === 'critical') failedCritical++;
    else failedWarning++;
  }

  const report = {
    ok: failedCritical === 0,
    fixture_id: expectations.fixture_id || null,
    summary: {
      total: rules.length,
      passed,
      failed_critical: failedCritical,
      failed_warning: failedWarning
    },
    results
  };

  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(failedCritical === 0 ? 0 : 1);
}

main();
