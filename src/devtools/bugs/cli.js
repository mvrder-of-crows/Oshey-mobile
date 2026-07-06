#!/usr/bin/env node
/**
 * Bug tracker CLI (CommonJS, stdlib-only).
 *
 *   node src/devtools/bugs/cli.js add "title" [--desc ...] [--severity ...] [--area ...]
 *   node src/devtools/bugs/cli.js list [--status ...] [--severity ...] [--area ...]
 *   node src/devtools/bugs/cli.js show BUG-001
 *   node src/devtools/bugs/cli.js fix BUG-001 --note "what fixed it"
 *
 * `fix` enforces the rule at fix-time: it runs Node's built-in test runner
 * filtered to this bug id and refuses unless at least one test exists and
 * passes. Tests prove a bug fixed by including the bug id in the test name,
 * e.g. test('BUG-001: handles empty input', () => { ... }).
 */

const { spawnSync } = require('child_process');
const { BugStore } = require('./store');

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      flags[a.slice(2)] = args[i + 1];
      i++;
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function markedTestsPass(bugId) {
  const result = spawnSync(
    process.execPath,
    ['--test', `--test-name-pattern=${bugId}`, '--test-reporter=tap'],
    { encoding: 'utf-8', cwd: process.cwd() }
  );
  const out = (result.stdout || '') + (result.stderr || '');
  const ranNone = /# tests 0/.test(out) || /no test files found/i.test(out);
  if (ranNone) {
    return { ok: false, detail: `no test matching '${bugId}' was found` };
  }
  if (result.status !== 0) {
    return { ok: false, detail: `marked test(s) did not pass:\n${out}` };
  }
  return { ok: true, detail: 'marked test(s) passed' };
}

function main(argv) {
  const [command, ...rest] = argv;
  const store = new BugStore();

  if (command === 'add') {
    const { flags, positional } = parseFlags(rest);
    const bug = store.add({
      title: positional[0],
      description: flags.desc || '',
      severity: flags.severity || 'MEDIUM',
      area: flags.area || 'general',
    });
    console.log(`Added ${bug.id}: ${bug.title} [${bug.severity}/${bug.area}]`);
    return 0;
  }

  if (command === 'list') {
    const { flags } = parseFlags(rest);
    const bugs = store.filter({ status: flags.status, severity: flags.severity, area: flags.area });
    if (!bugs.length) {
      console.log('No bugs match.');
      return 0;
    }
    for (const b of bugs) {
      console.log(`  ${b.id}  [${b.severity.padEnd(8)}] [${b.area.padEnd(12)}] (${b.status.padEnd(9)}) ${b.title}`);
    }
    return 0;
  }

  if (command === 'show') {
    const bugId = rest[0];
    const bug = store.get(bugId);
    if (!bug) {
      console.log(`No such bug: ${bugId}`);
      return 1;
    }
    console.log(`${bug.id}: ${bug.title}`);
    console.log(`  severity : ${bug.severity}`);
    console.log(`  area     : ${bug.area}`);
    console.log(`  status   : ${bug.status}`);
    console.log(`  created  : ${bug.created_at}`);
    if (bug.description) console.log(`  description:\n    ${bug.description}`);
    if (bug.status === 'fixed') {
      console.log(`  fixed_at : ${bug.fixed_at}`);
      console.log(`  fixed_note: ${bug.fixed_note}`);
    }
    return 0;
  }

  if (command === 'fix') {
    const { flags, positional } = parseFlags(rest);
    const bugId = positional[0];
    const bug = store.get(bugId);
    if (!bug) {
      console.log(`No such bug: ${bugId}`);
      return 1;
    }
    if (bug.status === 'fixed') {
      console.log(`${bug.id} is already fixed.`);
      return 0;
    }
    if (!flags.note) {
      console.log('REFUSED: --note is required');
      return 1;
    }
    console.log(`Verifying ${bug.id} via its marked test(s)...`);
    const { ok, detail } = markedTestsPass(bug.id);
    if (!ok) {
      console.log(`REFUSED: cannot mark ${bug.id} fixed -- ${detail}`);
      return 1;
    }
    store.markFixed(bug.id, flags.note);
    console.log(`${bug.id} marked fixed (${detail}).`);
    return 0;
  }

  console.log('Usage: cli.js <add|list|show|fix> ...');
  return 1;
}

process.exitCode = main(process.argv.slice(2));
