#!/usr/bin/env node
/**
 * Heartbeat CLI (CommonJS, stdlib-only).
 *
 *   node src/devtools/heartbeat/cli.js beat "what I just did" [--pending a --pending b]
 *                                                              [--file path] [--line N]
 *   node src/devtools/heartbeat/cli.js show
 *   node src/devtools/heartbeat/cli.js clear
 */

const { HeartbeatStore } = require('./state');

function parseFlags(args) {
  const flags = { pending: [] };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--pending') {
      flags.pending.push(args[i + 1]);
      i++;
    } else if (a.startsWith('--')) {
      flags[a.slice(2)] = args[i + 1];
      i++;
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function main(argv) {
  const [command, ...rest] = argv;
  const store = new HeartbeatStore();

  if (command === 'beat') {
    const { flags, positional } = parseFlags(rest);
    const hb = store.beat({
      action: positional[0],
      pending: flags.pending,
      currentFile: flags.file || '',
      currentLine: flags.line ? parseInt(flags.line, 10) : -1,
    });
    console.log(`Heartbeat @ ${hb.updated_at}: ${hb.action}`);
    hb.pending.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
    return 0;
  }

  if (command === 'show') {
    const hb = store.read();
    if (!hb) {
      console.log('No heartbeat recorded.');
      return 0;
    }
    console.log(`Last beat : ${hb.updated_at}`);
    console.log(`Action    : ${hb.action}`);
    if (hb.current_file) {
      const loc = hb.current_file + (hb.current_line >= 0 ? `:${hb.current_line}` : '');
      console.log(`At        : ${loc}`);
    }
    if (hb.pending && hb.pending.length) {
      console.log('Pending:');
      hb.pending.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
    }
    return 0;
  }

  if (command === 'clear') {
    store.clear();
    console.log('Heartbeat cleared.');
    return 0;
  }

  console.log('Usage: cli.js <beat|show|clear> ...');
  return 1;
}

process.exitCode = main(process.argv.slice(2));
