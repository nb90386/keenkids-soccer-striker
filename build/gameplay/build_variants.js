// Builds challenge-variant .sb3 files from the reference project.json (ref/ is an unzipped copy).
// Output: variants/<name>/project.json (+ costume SVGs) and variants/<name>.sb3
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REF_DIR = path.join(__dirname, 'ref');
const OUT = path.join(__dirname, 'variants');
const load = () => JSON.parse(fs.readFileSync(path.join(REF_DIR, 'project.json'), 'utf8'));
const T = (p, name) => p.targets.find(t => t.name === name);

let uid = 0;
// --- tiny block builder -------------------------------------------------------
function B(blocks, opcode, inputs = {}, fields = {}, extra = {}) {
  const id = `zz${++uid}`;
  blocks[id] = { opcode, next: null, parent: null, inputs, fields, shadow: false, topLevel: false, ...extra };
  return id;
}
const num = v => [1, [4, String(v)]];
const pos = v => [1, [5, String(v)]];
const whole = v => [1, [6, String(v)]];
const txt = v => [1, [10, String(v)]];
const varIn = (name, id) => [3, [12, name, id], [10, '']];
const varNum = (name, id) => [3, [12, name, id], [4, '0']];
const boolIn = id => [2, id];
const sub = id => [2, id];
function chain(blocks, ...ids) { for (let i = 0; i < ids.length - 1; i++) blocks[ids[i]].next = ids[i + 1]; return ids[0]; }
function touching(blocks, sprite) {
  const m = B(blocks, 'sensing_touchingobjectmenu', {}, { TOUCHINGOBJECTMENU: [sprite, null] }, { shadow: true });
  return B(blocks, 'sensing_touchingobject', { TOUCHINGOBJECTMENU: [1, m] });
}
function keyPressed(blocks, key) {
  const m = B(blocks, 'sensing_keyoptions', {}, { KEY_OPTION: [key, null] }, { shadow: true });
  return B(blocks, 'sensing_keypressed', { KEY_OPTION: [1, m] });
}
function dirOf(blocks, sprite) {
  const m = B(blocks, 'sensing_of_object_menu', {}, { OBJECT: [sprite, null] }, { shadow: true });
  return B(blocks, 'sensing_of', { OBJECT: [1, m] }, { PROPERTY: ['direction', null] });
}
const stopAll = blocks => B(blocks, 'control_stop', {}, { STOP_OPTION: ['all', null] }, { mutation: { tagName: 'mutation', children: [], hasnext: 'false' } });
function kickStack(blocks, keyName, sprite, x, y) {
  // when <key> pressed: if touching <sprite>: point towards Goal, move 60, repeat 16 { move 12, wait 0.03 }
  const hat = B(blocks, 'event_whenkeypressed', {}, { KEY_OPTION: [keyName, null] }, { topLevel: true, x, y });
  const tm = B(blocks, 'motion_pointtowards_menu', {}, { TOWARDS: ['Goal', null] }, { shadow: true });
  const pt = B(blocks, 'motion_pointtowards', { TOWARDS: [1, tm] });
  const m60 = B(blocks, 'motion_movesteps', { STEPS: num(60) });
  const m12 = B(blocks, 'motion_movesteps', { STEPS: num(12) });
  const w = B(blocks, 'control_wait', { DURATION: pos(0.03) });
  chain(blocks, m12, w);
  const rep = B(blocks, 'control_repeat', { TIMES: whole(16), SUBSTACK: sub(m12) });
  chain(blocks, pt, m60, rep);
  const iff = B(blocks, 'control_if', { CONDITION: boolIn(touching(blocks, sprite)), SUBSTACK: sub(pt) });
  chain(blocks, hat, iff);
  return hat;
}
// Recompute every parent pointer from next/inputs (keeps the JSON consistent after edits).
function relink(blocks) {
  for (const b of Object.values(blocks)) if (!b.topLevel) b.parent = null;
  for (const [id, b] of Object.entries(blocks)) {
    if (b.next) blocks[b.next].parent = id;
    for (const inp of Object.values(b.inputs)) {
      for (const v of inp.slice(1)) if (typeof v === 'string' && blocks[v]) blocks[v].parent = id;
    }
  }
}
// --- locate reference blocks ----------------------------------------------------
const findOp = (blocks, pred) => Object.entries(blocks).find(([id, b]) => pred(b, id));
function touchIfId(blocks, sprite) {
  return findOp(blocks, b => b.opcode === 'control_if' && (() => { const c = blocks[b.inputs.CONDITION[1]]; return c.opcode === 'sensing_touchingobject' && blocks[c.inputs.TOUCHINGOBJECTMENU[1]].fields.TOUCHINGOBJECTMENU[0] === sprite; })())[0];
}
function ballDribbleIf(p) { const bl = T(p, 'Ball').blocks; return findOp(bl, (b, id) => b.opcode === 'control_if' && blocks_parentOp(bl, id) === 'control_forever' && bl[bl[b.inputs.CONDITION[1]].inputs.TOUCHINGOBJECTMENU[1]].fields.TOUCHINGOBJECTMENU[0] === 'Player')[0]; }
function blocks_parentOp(bl, id) { const par = bl[id].parent; return par ? bl[par].opcode : null; }

function addGlobalVar(p, id, name, value = 0) { T(p, 'Stage').variables[id] = [name, value]; }

function write(name, p, note) {
  for (const t of p.targets) relink(t.blocks);
  const dir = path.join(OUT, name);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify(p));
  for (const f of fs.readdirSync(REF_DIR)) if (f.endsWith('.svg')) fs.copyFileSync(path.join(REF_DIR, f), path.join(dir, f));
  const sb3 = path.join(OUT, name + '.sb3'); fs.rmSync(sb3, { force: true });
  execFileSync('zip', ['-X', '-j', '-q', sb3, ...fs.readdirSync(dir).map(f => path.join(dir, f))]);
  console.log('built', name, '-', note);
}

// --- C1 Speed Boots ---------------------------------------------------------------
function c1(dribbleSteps) {
  const p = load(); const bl = T(p, 'Player').blocks;
  const [bounceId] = findOp(bl, b => b.opcode === 'motion_ifonedgebounce');
  const [lastIfId] = findOp(bl, b => b.next === bounceId);
  const mv = B(bl, 'motion_movesteps', { STEPS: num(4) });
  const iff = B(bl, 'control_if', { CONDITION: boolIn(keyPressed(bl, 'z')), SUBSTACK: sub(mv) });
  bl[lastIfId].next = iff; bl[iff].next = bounceId;
  if (dribbleSteps !== 6) {
    const ball = T(p, 'Ball').blocks; const ifId = ballDribbleIf(p);
    const pointId = ball[ifId].inputs.SUBSTACK[1]; const moveId = ball[pointId].next;
    ball[moveId].inputs.STEPS = num(dribbleSteps);
  }
  return p;
}
write('c1_speed_boots', c1(6), 'Player forever: 5th if <key z pressed> then move 4 (before bounce); dribble move 6');
write('c1_speed_boots_dribble10', c1(10), 'same as c1 + Ball dribble move 10');

// --- C2 Two players -----------------------------------------------------------------
function c2(mode) {
  const p = load();
  const src = T(p, 'Player');
  const p2 = JSON.parse(JSON.stringify(src));
  p2.name = 'Player2'; p2.x = 120; p2.y = 0; p2.direction = -90; p2.layerOrder = Math.max(...p.targets.map(t => t.layerOrder || 0)) + 1;
  // re-id blocks
  const map = {}; for (const id of Object.keys(p2.blocks)) map[id] = 'p2_' + id;
  const nb = {};
  for (const [id, b] of Object.entries(p2.blocks)) {
    const c = JSON.parse(JSON.stringify(b));
    if (c.next) c.next = map[c.next]; if (c.parent) c.parent = map[c.parent];
    for (const k of Object.keys(c.inputs)) c.inputs[k] = c.inputs[k].map((v, i) => (i > 0 && typeof v === 'string' && map[v]) ? map[v] : v);
    nb[map[id]] = c;
  }
  p2.blocks = nb;
  const keyMap = { 'right arrow': 'd', 'left arrow': 'a', 'up arrow': 'w', 'down arrow': 's' };
  for (const b of Object.values(nb)) {
    if (b.opcode === 'sensing_keyoptions') b.fields.KEY_OPTION[0] = keyMap[b.fields.KEY_OPTION[0]];
    if (b.opcode === 'motion_gotoxy' && +b.inputs.X[1][1] === -170) b.inputs.X = num(120);
    // start/reset direction 90 -> -90 (only in the flag-start and ResetPlayer scripts, not in the d-key if)
    if (b.opcode === 'motion_pointindirection' && nb[b.parent] && nb[b.parent].opcode !== 'control_if' && +b.inputs.DIRECTION[1][1] === 90) b.inputs.DIRECTION = [1, [8, '-90']];
  }
  p.targets.push(p2);
  const ball = T(p, 'Ball').blocks; const ifId = ballDribbleIf(p);
  if (mode === 'or') {
    const cond = ball[ifId].inputs.CONDITION[1];
    const or = B(ball, 'operator_or', { OPERAND1: boolIn(cond), OPERAND2: boolIn(touching(ball, 'Player2')) });
    ball[ifId].inputs.CONDITION = boolIn(or);
  } else {
    const pt = B(ball, 'motion_pointindirection', { DIRECTION: [3, dirOf(ball, 'Player2'), [8, '90']] });
    const mv = B(ball, 'motion_movesteps', { STEPS: num(6) }); chain(ball, pt, mv);
    const iff = B(ball, 'control_if', { CONDITION: boolIn(touching(ball, 'Player2')), SUBSTACK: sub(pt) });
    ball[iff].next = ball[ifId].next; ball[ifId].next = iff;
  }
  kickStack(ball, 'f', 'Player2', 713, 800);
  return p;
}
write('c2a_two_players_or', c2('or'), 'Player2 (WASD, start 120,0 dir -90); Ball dribble if <touching Player or touching Player2> -> direction of Player; F kick');
write('c2b_two_players_branch', c2('branch'), 'Player2; separate Ball branch if touching Player2 -> direction of Player2, move 6; F kick');

// --- C3 Friction kick ---------------------------------------------------------------
{
  const p = load(); const ball = T(p, 'Ball').blocks;
  addGlobalVar(p, 'var_kickspeed', 'KickSpeed', 0);
  const [repId] = findOp(ball, b => b.opcode === 'control_repeat');
  const m60 = ball[repId].parent;
  // remove repeat 16 + its substack
  const rm = id => { while (id) { const b = ball[id]; for (const inp of Object.values(b.inputs)) for (const v of inp.slice(1)) if (typeof v === 'string' && ball[v]) rm(v); const n = b.next; delete ball[id]; id = n; } };
  const subId = ball[repId].inputs.SUBSTACK[1]; ball[repId].next = null; rm(subId); delete ball[repId];
  const set = B(ball, 'data_setvariableto', { VALUE: txt(12) }, { VARIABLE: ['KickSpeed', 'var_kickspeed'] });
  const mv = B(ball, 'motion_movesteps', { STEPS: varNum('KickSpeed', 'var_kickspeed') });
  const ch = B(ball, 'data_changevariableby', { VALUE: num(-1) }, { VARIABLE: ['KickSpeed', 'var_kickspeed'] });
  const w = B(ball, 'control_wait', { DURATION: pos(0.03) });
  chain(ball, mv, ch, w);
  const lt = B(ball, 'operator_lt', { OPERAND1: varIn('KickSpeed', 'var_kickspeed'), OPERAND2: txt(1) });
  const ru = B(ball, 'control_repeat_until', { CONDITION: boolIn(lt), SUBSTACK: sub(mv) });
  chain(ball, set, ru); ball[m60].next = set;
  write('c3_friction_kick', p, 'space kick: move 60, set KickSpeed 12, repeat until KickSpeed<1 {move KickSpeed, change by -1, wait 0.03}');
}

// --- C4 Golden Goal -------------------------------------------------------------------
function c4(withReset) {
  const p = load(); const ball = T(p, 'Ball').blocks;
  addGlobalVar(p, 'var_golden', 'GoldenGoal', 0);
  const [setTimeId] = findOp(ball, b => b.opcode === 'data_setvariableto' && b.fields.VARIABLE[0] === 'Time');
  ball[setTimeId].inputs.VALUE = txt(3); // shortened clock for testing
  const hat = ball[setTimeId].parent;
  if (withReset) { const s0 = B(ball, 'data_setvariableto', { VALUE: txt(0) }, { VARIABLE: ['GoldenGoal', 'var_golden'] }); ball[hat].next = s0; ball[s0].next = setTimeId; }
  const [ruId] = findOp(ball, b => b.opcode === 'control_repeat_until');
  // drop say FULL TIME + stop all
  let id = ball[ruId].next; while (id) { const n = ball[id].next; delete ball[id]; id = n; }
  const s1 = B(ball, 'data_setvariableto', { VALUE: txt(1) }, { VARIABLE: ['GoldenGoal', 'var_golden'] });
  const say = B(ball, 'looks_sayforsecs', { MESSAGE: txt('GOLDEN GOAL!'), SECS: num(2) });
  chain(ball, s1, say); ball[ruId].next = s1;
  // goal branch: after the Score=3 if
  const [score3If] = findOp(ball, b => b.opcode === 'control_if' && ball[b.inputs.CONDITION[1]].opcode === 'operator_equals');
  const eq = B(ball, 'operator_equals', { OPERAND1: varIn('GoldenGoal', 'var_golden'), OPERAND2: txt(1) });
  const sayWin = B(ball, 'looks_sayforsecs', { MESSAGE: txt('YOU WIN!'), SECS: num(2) });
  chain(ball, sayWin, stopAll(ball));
  const gIf = B(ball, 'control_if', { CONDITION: boolIn(eq), SUBSTACK: sub(sayWin) });
  ball[gIf].next = ball[score3If].next; ball[score3If].next = gIf;
  return p;
}
write('c4_golden_goal', c4(true), 'Time=3 (shortened); set GoldenGoal 0 at top of clock stack; GOLDEN GOAL! instead of FULL TIME/stop; goal branch: if GoldenGoal=1 say YOU WIN! 2s, stop all');
write('c4_golden_goal_no_reset', c4(false), 'same as c4 but WITHOUT set GoldenGoal to 0');

// --- Diagnostic fix candidate (not a lesson challenge): space kick uses distance instead of touching ----------
{
  const p = load(); const ball = T(p, 'Ball').blocks;
  const [hat] = findOp(ball, b => b.opcode === 'event_whenkeypressed');
  const ifId = ball[hat].next;
  const dm = B(ball, 'sensing_distancetomenu', {}, { DISTANCETOMENU: ['Player', null] }, { shadow: true });
  const d = B(ball, 'sensing_distanceto', { DISTANCETOMENU: [1, dm] });
  const lt = B(ball, 'operator_lt', { OPERAND1: [3, d, [10, '']], OPERAND2: txt(50) });
  const old = ball[ifId].inputs.CONDITION[1]; const oldMenu = ball[old].inputs.TOUCHINGOBJECTMENU[1];
  delete ball[old]; delete ball[oldMenu];
  ball[ifId].inputs.CONDITION = boolIn(lt);
  write('x_fix_kick_distance50', p, 'DIAGNOSTIC: space kick condition <(distance to Player) < 50> instead of <touching Player>');
}

// --- Follow-up diagnostics: `go to [front] layer` right under the hat of the Ball's first green-flag script ---
function addBallGoToFront(p) {
  const ball = T(p, 'Ball').blocks;
  const [hat] = findOp(ball, b => b.opcode === 'event_whenflagclicked'); // first flag hat in JSON order (the clock script)
  const g = B(ball, 'looks_gotofrontback', {}, { FRONT_BACK: ['front', null] });
  ball[g].next = ball[hat].next; ball[hat].next = g;
  return p;
}
write('x_ref_ball_gotofront', addBallGoToFront(load()), 'DIAGNOSTIC: reference + go to front layer at top of Ball clock flag script');
write('x_c2b_ball_gotofront', addBallGoToFront(c2('branch')), 'DIAGNOSTIC: c2b + go to front layer at top of Ball clock flag script');
