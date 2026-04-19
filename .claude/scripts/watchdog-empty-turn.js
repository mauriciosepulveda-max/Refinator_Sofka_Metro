#!/usr/bin/env node
/**
 * watchdog-empty-turn.js — Hook Stop. Detecta turnos vacíos leyendo transcript_path.
 * Exit 0 = turno válido o no inspeccionable; Exit 2 = turno vacío → stderr + notificación al PM.
 */
'use strict';
const fs = require('fs');

let input = '';
process.stdin.on('data', (c) => { input += c; });
process.stdin.on('end', () => {
  let parsed = null;
  try { parsed = JSON.parse(input); } catch (_e) { process.exit(0); }
  if (!parsed || typeof parsed !== 'object') process.exit(0);
  if (parsed.stop_hook_active === true) process.exit(0);

  const transcriptPath = parsed.transcript_path;
  if (typeof transcriptPath !== 'string' || !transcriptPath) process.exit(0);

  let raw;
  try { raw = fs.readFileSync(transcriptPath, 'utf8'); } catch (_e) { process.exit(0); }

  const lines = raw.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) process.exit(0);

  let lastAssistant = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    let entry;
    try { entry = JSON.parse(lines[i]); } catch { continue; }
    if (!entry || typeof entry !== 'object') continue;
    const isAssistant = entry.type === 'assistant' || entry.role === 'assistant' || (entry.message && entry.message.role === 'assistant');
    if (isAssistant) { lastAssistant = entry; break; }
  }
  if (!lastAssistant) process.exit(0);

  const content = (lastAssistant.message && lastAssistant.message.content) || lastAssistant.content || null;
  let textLen = 0, toolUseCount = 0;
  const countBlock = (b) => {
    if (!b) return;
    if (typeof b === 'string') { textLen += b.length; return; }
    if (b.type === 'text' && typeof b.text === 'string') { textLen += b.text.length; return; }
    if (b.type === 'tool_use' || b.type === 'tool_call') { toolUseCount += 1; }
  };
  if (typeof content === 'string') textLen += content.length;
  else if (Array.isArray(content)) for (const b of content) countBlock(b);
  else if (content && typeof content === 'object') countBlock(content);
  else process.exit(0);

  if (toolUseCount === 0 && textLen < 10) {
    process.stderr.write('[RR·WATCHDOG] ⚠ turno vacío detectado (0 tool calls, <10 chars de texto). El asistente DEBE emitir [RR·PAUSE] con la causa antes de cerrar turnos sin acción.\n');
    process.exit(2);
  }
  process.exit(0);
});
setTimeout(() => { process.exit(0); }, 2000).unref();
