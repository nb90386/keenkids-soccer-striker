// Verifies every coding slide against a Scratch project.json:
//  - parses the slide's scratchblocks code into opcodes (scratchblocks' own parser),
//  - checks each block is a known Scratch 3 block (no red "obsolete" blocks),
//  - counts NEW command blocks (must be 1–3),
//  - finds the slide's script in the named sprite of the project: same opcodes, same nesting, same literal values,
//    in order (an ordered subsequence; C-block mouths shown empty on a slide match anything).
// Usage: node verify_code.mjs <project.json> [variantsDir]
import fs from 'fs';
import { createRequire } from 'module';
import { parse } from './node_modules/scratchblocks/syntax/index.js';
const require = createRequire(import.meta.url);
const S = require('./content.js');

const OP = (id) => ({ CONTROL_REPEATUNTIL: 'control_repeat_until', SENSING_KEYPRESSED: 'sensing_keypressed' })[id]
  || id.toLowerCase().replace(/^operators_/, 'operator_');

// ---------- slide side ----------
function fromSB(block) {
  if (!block.info.id) return { op: 'data_variable', name: block.children.map((c) => c.value).join(' ').trim(), vals: [], sub: [] };
  const node = { op: OP(block.info.id), vals: [], sub: [], shape: block.info.shape };
  for (const c of block.children) {
    if (c.constructor.name === 'Input') {
      if (c.value !== undefined && c.value !== '') node.vals.push(String(c.value));
    } else if (c.constructor.name === 'Block') {
      const r = fromSB(c); node.vals.push(...r.vals.map((v) => v)); node.reporters = [...(node.reporters || []), r.op, ...(r.reporters || [])];
      if (r.op === 'data_variable' || !r.op) node.vals.push(r.name);
    } else if (c.isScript) {
      node.sub.push(...c.blocks.filter((b) => b.info).map(fromSB));
    }
  }
  // variable reporters: scratchblocks marks them with id undefined / category variables
  if (block.info.category === 'variables' && block.info.shape === 'reporter' && !block.info.id) node.name = block.children.map((c) => c.value).join('');
  return node;
}
function slideScript(code) {
  const doc = parse(code, { languages: ['en'] });
  const scripts = doc.scripts.map((s) => s.blocks.filter((b) => b.info));
  return scripts.flat().map(fromSB);
}

// ---------- project side ----------
function projectScripts(pj) {
  const out = {};
  for (const t of pj.targets) {
    const B = t.blocks; const scripts = [];
    const lit = (inp) => {
      if (!inp) return []; const v = inp[1];
      if (typeof v === 'string') return node(v, true).vals.concat(node(v, true).name ? [node(v, true).name] : []);
      if (Array.isArray(v)) { if (v[0] === 12) return [v[1]]; return [String(v[1])]; }
      return [];
    };
    const node = (id, asReporter = false) => {
      const b = B[id];
      if (Array.isArray(b)) return { op: 'data_variable', vals: [], name: b[1], sub: [] };
      const n = { op: b.opcode, vals: [], sub: [], reporters: [] };
      for (const [k, inp] of Object.entries(b.inputs)) {
        if (k === 'SUBSTACK' || k === 'SUBSTACK2') continue;
        const v = inp[1];
        if (typeof v === 'string' && B[v] && !B[v].shadow) { const r = node(v, true); n.vals.push(...r.vals); if (r.name) n.vals.push(r.name); n.reporters.push(r.op, ...(r.reporters || [])); }
        else if (typeof v === 'string' && B[v]) { const r = node(v, true); n.vals.push(...r.vals); }
        else if (Array.isArray(v)) n.vals.push(v[0] === 12 ? v[1] : String(v[1]));
      }
      for (const [k, f] of Object.entries(b.fields)) {
        if (b.opcode === 'data_variable') { n.name = f[0]; continue; }
        n.vals.push(String(f[0]));
      }
      const subId = b.inputs.SUBSTACK && b.inputs.SUBSTACK[1];
      if (subId) n.sub = chain(subId);
      return n;
    };
    const chain = (id) => { const arr = []; while (id) { arr.push(node(id)); id = B[id].next; } return arr; };
    for (const [id, b] of Object.entries(B)) if (b && b.topLevel && !Array.isArray(b)) scripts.push(chain(id));
    out[t.name] = scripts;
  }
  return out;
}

// ---------- matching ----------
const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, ' ');
const sameVals = (a, b) => { const x = a.map(norm).sort().join('|'), y = b.map(norm).sort().join('|'); return x === y; };
function nodeMatch(sn, pn, why) {
  if (sn.op !== pn.op) return false;
  if (!sameVals(sn.vals, pn.vals)) { why.push(`${sn.op}: slide values [${sn.vals}] vs project [${pn.vals}]`); return false; }
  if (sn.sub.length && !seqMatch(sn.sub, pn.sub, why)) return false;
  return true;
}
// ordered subsequence match of slide blocks within project blocks
function seqMatch(ss, ps, why) {
  let j = 0;
  for (const sn of ss) { while (j < ps.length && !nodeMatch(sn, ps[j], why)) j++; if (j >= ps.length) return false; j++; }
  return true;
}
function findInSprite(slideBlocks, scripts) {
  const why = [];
  // search every script and every nested substack
  const lists = [];
  const collect = (list) => { lists.push(list); list.forEach((n) => n.sub.length && collect(n.sub)); };
  scripts.forEach(collect);
  for (const l of lists) if (seqMatch(slideBlocks, l, why)) return { ok: true };
  return { ok: false, why: [...new Set(why)].slice(0, 3) };
}

const pj = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const PS = projectScripts(pj);
const manifest = JSON.parse(fs.readFileSync('./blocks/manifest.json', 'utf8'));
const results = [];
S.forEach((s, i) => {
  if (!s.code) return;
  const id = 's' + String(i + 1).padStart(2, '0');
  const blocks = slideScript(s.code);
  const count = (list) => list.reduce((a, n) => a + 1 + count(n.sub), 0);
  const newCount = count(blocks);
  const r = { slide: i + 1, step: s.step, title: s.title, sprite: s.sprite, newCommandBlocks: newCount, renderedOK: manifest[id] && manifest[id].bad === 0 };
  const isBase = /^\d/.test(s.step);
  if (isBase) {
    const m = findInSprite(blocks, PS[s.sprite] || []);
    r.matchesReference = m.ok; if (!m.ok) r.why = m.why;
  } else r.matchesReference = 'n/a (bonus challenge, not in reference project)';
  r.pass = r.renderedOK && newCount >= 1 && newCount <= 3 && (r.matchesReference === true || !isBase);
  results.push(r);
});
fs.writeFileSync('./render/code_verification.json', JSON.stringify(results, null, 1));
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  slide ${String(r.slide).padStart(2)}  ${String(r.step).padEnd(3)} ${r.sprite.padEnd(8)} new=${r.newCommandBlocks} ref=${r.matchesReference}${r.why ? '  ' + r.why.join(' ; ') : ''}  ${r.title}`);
console.log('TOTAL', results.length, 'PASS', results.filter((r) => r.pass).length);
