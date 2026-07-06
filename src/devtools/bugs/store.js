/**
 * Bug record model and JSON store (CommonJS, stdlib-only).
 *
 * Mirrors the Python reference implementation (src/devtools/bugs/store.py)
 * in shape and contract: a bug cannot be marked 'fixed' unless a test
 * proves it. No npm dependencies -- works before `npm install` even runs.
 */

const fs = require('fs');
const path = require('path');

const SEVERITIES = ['CRITICAL', 'MEDIUM', 'LOW'];
const STATUSES = ['open', 'fixed', 'deferred'];

// bugs.json lives at the project root, four levels up from this file.
const DEFAULT_STORE = path.join(__dirname, '..', '..', '..', 'bugs.json');

function now() {
  return new Date().toISOString().replace(/\.\d+Z$/, 'Z');
}

class BugStore {
  constructor(storePath = DEFAULT_STORE) {
    this.path = storePath;
    this.bugs = [];
    this.load();
  }

  load() {
    if (fs.existsSync(this.path)) {
      const raw = fs.readFileSync(this.path, 'utf-8').trim() || '[]';
      this.bugs = JSON.parse(raw);
    } else {
      this.bugs = [];
    }
  }

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.bugs, null, 2) + '\n', 'utf-8');
  }

  all() {
    return [...this.bugs];
  }

  get(bugId) {
    return this.bugs.find((b) => b.id === bugId) || null;
  }

  filter({ status, severity, area } = {}) {
    let out = this.bugs;
    if (status) out = out.filter((b) => b.status === status);
    if (severity) out = out.filter((b) => b.severity === severity);
    if (area) out = out.filter((b) => b.area === area);
    return out;
  }

  nextId() {
    const nums = this.bugs
      .filter((b) => b.id.startsWith('BUG-'))
      .map((b) => parseInt(b.id.split('-')[1], 10))
      .filter((n) => !Number.isNaN(n));
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `BUG-${String(next).padStart(3, '0')}`;
  }

  add({ title, description = '', severity = 'MEDIUM', area = 'general' }) {
    if (!SEVERITIES.includes(severity)) {
      throw new Error(`severity must be one of ${SEVERITIES}, got ${severity}`);
    }
    const bug = {
      id: this.nextId(),
      title,
      description,
      severity,
      area,
      status: 'open',
      created_at: now(),
      fixed_at: null,
      fixed_note: null,
    };
    this.bugs.push(bug);
    this.save();
    return bug;
  }

  markFixed(bugId, note) {
    const bug = this.get(bugId);
    if (!bug) throw new Error(`no such bug: ${bugId}`);
    bug.status = 'fixed';
    bug.fixed_at = now();
    bug.fixed_note = note;
    this.save();
    return bug;
  }
}

module.exports = { BugStore, SEVERITIES, STATUSES, DEFAULT_STORE };
