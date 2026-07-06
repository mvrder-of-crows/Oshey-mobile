/**
 * Heartbeat snapshot model and store (CommonJS, stdlib-only).
 *
 * A single overwritten state snapshot for crash/interrupt recovery. Not a
 * log (last-write-wins); records what was just done and what is pending so
 * the next session resumes cleanly. Mirrors the Python reference
 * implementation (src/devtools/heartbeat/state.py).
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_STORE = path.join(__dirname, '..', '..', '..', 'heartbeat.json');

function now() {
  return new Date().toISOString().replace(/\.\d+Z$/, 'Z');
}

class HeartbeatStore {
  constructor(storePath = DEFAULT_STORE) {
    this.path = storePath;
  }

  read() {
    if (!fs.existsSync(this.path)) return null;
    const raw = fs.readFileSync(this.path, 'utf-8').trim();
    if (!raw) return null;
    return JSON.parse(raw);
  }

  beat({ action, pending = [], currentFile = '', currentLine = -1, context = {} }) {
    const hb = {
      action,
      pending,
      current_file: currentFile,
      current_line: currentLine,
      context,
      updated_at: now(),
    };
    fs.writeFileSync(this.path, JSON.stringify(hb, null, 2) + '\n', 'utf-8');
    return hb;
  }

  clear() {
    if (fs.existsSync(this.path)) fs.unlinkSync(this.path);
  }
}

module.exports = { HeartbeatStore, DEFAULT_STORE };
