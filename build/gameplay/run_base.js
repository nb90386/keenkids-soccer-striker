// Base-game tests on the reference sb3 (plus dribble/goalie comparison on the original).
// Usage: NODE_PATH=../node_modules node run_base.js [testName ...]
const fs = require('fs'), path = require('path');
const { setup } = require('./harness');
const REF = 'KeenKids_Soccer_Striker_Teacher_Reference.sb3';
const ORIG = 'Soccer_Striker!.sb3';
const OUT = path.join(__dirname, 'results_base.json');
const r2 = n => Math.round(n * 100) / 100;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const tests = {
  // 1. Initial state after green flag
  async t1_initial(h) {
    const p = await h.open(REF);
    const s = await p.evaluate(async () => { H.start(); await H.frames(3); return H.snap(); });
    await h.saveShot(p, 'start');
    const P = s.s.Player, B = s.s.Ball, G = s.s.Goalie;
    const pass = P.x === -170 && P.y === 0 && P.dir === 90 && P.size === 60 && B.x === -120 && B.y === 0 &&
      G.x === 195 && G.size === 70 && +s.vars.Score === 0 && +s.vars.Time === 60;
    return { pass, snapshotAtFrame3: s, errors: p.consoleErrors };
  },

  // 2. Arrow keys: 5 steps/frame, direction, edge bounce
  async t2_arrows(h) {
    const p = await h.open(REF);
    await p.evaluate(async () => { H.start(); await H.frames(3); H.set('Ball', -200, 140); });
    const keys = { ArrowRight: [90, 1, 0], ArrowLeft: [-90, -1, 0], ArrowUp: [0, 0, 1], ArrowDown: [180, 0, -1] };
    const out = {}; let pass = true;
    for (const [key, [dir, ux, uy]] of Object.entries(keys)) {
      const log = await p.evaluate(async (key) => {
        H.set('Player', 0, -20, 90); await H.frames(2);
        const start = H.snap().s.Player; const rows = [];
        H.key(key, true);
        for (let i = 0; i < 12; i++) { await H.frames(1); rows.push(H.snap().s.Player); }
        H.key(key, false); await H.frames(2);
        return { start, rows };
      }, key);
      const seq = [log.start, ...log.rows];
      const deltas = seq.slice(1).map((s, i) => r2(Math.hypot(s.x - seq[i].x, s.y - seq[i].y)));
      const signs = seq.slice(1).map((s, i) => [Math.sign(r2(s.x - seq[i].x)), Math.sign(r2(s.y - seq[i].y))]);
      const ok = log.rows.every(r => r.dir === dir) && deltas.every(d => d === 5) && signs.every(([sx, sy]) => sx === ux && sy === uy);
      pass = pass && ok;
      out[key] = { ok, expectedDir: dir, dirs: [...new Set(log.rows.map(r => r.dir))], perFrameDistance: deltas, end: log.rows.at(-1) };
    }
    // edge bounce: start near each edge, hold the key toward that edge for 20 frames
    const edges = { ArrowRight: [215, 0], ArrowLeft: [-215, 0], ArrowUp: [0, 150], ArrowDown: [0, -150] };
    out.edge = {};
    for (const [key, [x, y]] of Object.entries(edges)) {
      const e = await p.evaluate(async ({ key, x, y }) => {
        H.set('Player', x, y, 90); await H.frames(2);
        const rows = []; H.key(key, true);
        for (let i = 0; i < 20; i++) { await H.frames(1); rows.push({ ...H.snap().s.Player, b: H.bounds('Player') }); }
        H.key(key, false); await H.frames(2);
        return rows;
      }, { key, x, y });
      const b = e.map(r => r.b);
      const ext = { maxRight: Math.max(...b.map(q => q.right)), minLeft: Math.min(...b.map(q => q.left)), maxTop: Math.max(...b.map(q => q.top)), minBottom: Math.min(...b.map(q => q.bottom)) };
      const onStage = ext.maxRight <= 241 && ext.minLeft >= -241 && ext.maxTop <= 181 && ext.minBottom >= -181; // 1 px tolerance for bounds rounding
      out.edge[key] = { onStage, extentsOfPlayerBounds: ext, last5: e.slice(-5).map(r => ({ x: r.x, y: r.y, dir: r.dir })) };
      pass = pass && onStage;
    }
    out.note = 'Ball teleported to (-200,140) to keep it out of the way; Player teleported to start points.';
    return { pass, ...out, errors: p.consoleErrors };
  },

  // 3. Dribble on reference and original: hold right from the start position for 45 frames.
  async t3_dribble(h) {
    const res = {};
    for (const [label, file] of [['reference', REF], ['original', ORIG]]) {
      const p = await h.open(file);
      const rows = await p.evaluate(async () => {
        H.start(); await H.frames(3);
        const rows = [H.snap()]; H.key('ArrowRight', true);
        for (let i = 0; i < 45; i++) { await H.frames(1); const s = H.snap(); s.touch = H.touching('Ball', 'Player'); rows.push(s); }
        H.key('ArrowRight', false); return rows;
      });
      if (label === 'reference') await (async () => {
        // dribble screenshot: replay a short dribble on a fresh page and capture mid-dribble
        const q = await h.open(REF);
        await q.evaluate(async () => { H.start(); await H.frames(3); H.key('ArrowRight', true); await H.frames(28); H.key('ArrowRight', false); });
        await h.saveShot(q, 'dribble');
      })();
      const bd = rows.slice(1).map((s, i) => r2(s.s.Ball.x - rows[i].s.Ball.x));
      const by = rows.slice(1).map((s, i) => r2(s.s.Ball.y - rows[i].s.Ball.y));
      const moved = rows.slice(1).filter((s, i) => bd[i] !== 0 || by[i] !== 0);
      res[label] = {
        ballPerFrameDx: bd,
        maxBallStepPerFrame: Math.max(...bd.map(Math.abs)),
        ballDirsWhenMoving: [...new Set(moved.map(s => s.s.Ball.dir))],
        playerDir: [...new Set(rows.slice(1).map(s => s.s.Player.dir))],
        ballStart: rows[0].s.Ball, ballEnd: rows.at(-1).s.Ball, playerEnd: rows.at(-1).s.Player,
        maxGapBallMinusPlayerX: Math.max(...rows.map(s => r2(s.s.Ball.x - s.s.Player.x))),
        framesBallMoved: moved.length,
        says: await p.evaluate(() => H.says),
      };
    }
    // jump analysis for original: first contact frame -> displacement over the next 20 frames
    const o = res.original.ballPerFrameDx; const first = o.findIndex(d => d !== 0);
    res.original.firstContactFrameIndex = first;
    res.original.displacementFromFirstContact20Frames = r2(o.slice(first, first + 20).reduce((a, b) => a + b, 0));
    const f = res.reference.ballPerFrameDx; const firstR = f.findIndex(d => d !== 0);
    res.reference.displacementFromFirstContact20Frames = r2(f.slice(firstR, firstR + 20).reduce((a, b) => a + b, 0));
    const pass = res.reference.maxBallStepPerFrame <= 6.01 && res.reference.ballDirsWhenMoving.every(d => d === 90);
    return { pass, ...res };
  },

  // 4. Space kick
  async t4_kick(h) {
    const p = await h.open(REF);
    const notTouching = await p.evaluate(async () => {
      H.start(); await H.frames(3);
      const touch = H.touching('Ball', 'Player'); const before = H.snap().s.Ball;
      H.key(' ', true); await H.frames(1); H.key(' ', false); await H.frames(30);
      return { touch, before, after: H.snap().s.Ball };
    });
    // (b) space while standing still right after contact (documents the frame-order quirk)
    const standing = await p.evaluate(async () => {
      H.set('Player', -170, 0, 90); H.set('Ball', -132, 0);
      H.key('ArrowRight', true); await H.until(() => H.touching('Ball', 'Player'), 30); H.key('ArrowRight', false);
      const before = H.snap().s.Ball;
      H.key(' ', true); await H.frames(1); H.key(' ', false); await H.frames(30);
      return { touchingWhenSpacePressed: true, before, after: H.snap().s.Ball };
    });
    // (c) realistic kicks: running into the ball (right arrow held) and pressing space
    const kicks = [];
    for (const [px, py] of [[-170, 0], [-190, 120]]) {
      const k = await p.evaluate(async ([px, py]) => {
        await H.frames(2);
        const pre = await H.kickFrom(px, py);
        const goal = H.T('Goal'); const b0 = pre.pre.s.Ball;
        const rows = [pre.post1];
        for (let i = 0; i < 30; i++) { await H.frames(1); rows.push(H.snap()); }
        return { pre, rows };
      }, [px, py]);
      const b0 = k.pre.pre.s.Ball; const traj = k.rows.map(r => r.s.Ball);
      const expectedDir = 90 - Math.atan2(0 - b0.y, 222 - b0.x) * 180 / Math.PI;
      const steps = traj.map((b, i) => r2(dist(b, i ? traj[i - 1] : b0)));
      const end = traj.at(-1);
      // direction toward goal measured from the ball's position after the dribble push (first frame)
      const kt = { setup: `Player teleported to (${px},${py}) dir 90, Ball 38 px ahead; right arrow held; space pressed on the frame contact is detected`,
        ballAtSpacePress: b0, ballDirAfterKick: traj[0].dir, expectedDirFromBallAtPress: r2(expectedDir),
        perFrameStepDistances: steps, totalDistance: r2(dist(end, b0)), framesMoving: steps.filter(x => x > 0).length, end };
      kt.pass = Math.abs(kt.ballDirAfterKick - kt.expectedDirFromBallAtPress) < 1.5 && Math.abs(kt.totalDistance - 252) <= 7;
      kicks.push(kt);
    }
    // kick screenshot: fresh page, capture ball in flight (5 frames into kick)
    const q = await h.open(REF);
    const kickShot = await q.evaluate(async () => { H.start(); await H.frames(3); H.key('ArrowRight', true); await H.frames(6); const b0 = H.snap().s.Ball.x; H.key(' ', true); await H.frames(1); H.key(' ', false); H.key('ArrowRight', false); await H.frames(7); return { ballXBefore: b0, ballXAtShot: H.snap().s.Ball.x }; });
    if (!(kickShot.ballXAtShot - kickShot.ballXBefore > 60)) throw new Error('kick screenshot: kick did not happen ' + JSON.stringify(kickShot));
    await h.saveShot(q, 'kick');
    const nt = { pass: !notTouching.touch && notTouching.before.x === notTouching.after.x && notTouching.before.y === notTouching.after.y, ...notTouching };
    const st = { ...standing, ballMoved: r2(dist(standing.before, standing.after)) };
    const kt = { kicks, says: await p.evaluate(() => H.says) };
    return { pass: nt.pass && kicks.every(k => k.pass), spaceNotTouching: nt, spaceWhileStandingAfterContact: st, spaceTouchingWhileRunning: kt };
  },

  // 5+6. Goals: three kicked goals from a teleported setup; check score, says, resets, stop all.
  async t5_t6_goals(h) {
    const p = await h.open(REF);
    await p.evaluate(async () => { H.start(); await H.frames(3); });
    const goals = [];
    for (let g = 1; g <= 3; g++) {
      const r = await p.evaluate(async (g) => {
        // wait for goalie to be high (y>50) so the low-right kick path is clear
        await H.until(() => H.T('Goalie').y > 50, 200);
        const scoreBefore = +H.v('Score'); const saysBefore = H.says.length;
        const k = await H.kickFrom(90, -60); const touch = k.touchedAtFrame !== null;
        await H.frames(2); H.set('Player', 100, -60, 180); // turn player away so ResetPlayer's "point in direction 90" is observable
        const rows = [];
        let shotFrame = null;
        for (let i = 0; i < 130; i++) { await H.frames(1); const s = H.snap(); rows.push(s); if (H.rt.threads.length === 0) break; }
        let afterStop = null;
        if (H.rt.threads.length === 0) {
          const a = H.snap(); H.key('ArrowUp', true); await H.frames(30); H.key('ArrowUp', false); const b = H.snap();
          afterStop = { before: a, after1s: b };
        }
        return { touch, scoreBefore, rows, says: H.says.slice(saysBefore), events: H.events.filter(e => e.frame > 5), afterStop };
      }, g);
      const scores = [...new Set(r.rows.map(s => +s.vars.Score))];
      const last = r.rows.at(-1);
      const firstGoalFrame = r.rows.findIndex(s => s.s.Ball.bubble === 'GOAL!');
      const resetIdx = r.rows.findIndex(s => s.s.Player.x === -170 && s.s.Player.y === 0);
      const ballAfterReset = resetIdx >= 0 ? r.rows.slice(resetIdx, resetIdx + 8).map(s => [s.s.Ball.x, s.s.Ball.y]) : null;
      goals.push({ goal: g, framesKickToReset: resetIdx, ballTrailFromResetFrame: ballAfterReset, afterStop: r.afterStop && { threadsAfter: r.afterStop.after1s.threads, timeBefore: r.afterStop.before.vars.Time, timeAfter1s: r.afterStop.after1s.vars.Time, goalieYBefore: r.afterStop.before.s.Goalie.y, goalieYAfter1s: r.afterStop.after1s.s.Goalie.y, playerBeforeUpKey: r.afterStop.before.s.Player, playerAfterUpKey1s: r.afterStop.after1s.s.Player, bubbleAfterStop: r.afterStop.after1s.s.Ball.bubble }, ballTouchingPlayerAtKick: r.touch, scoreBefore: r.scoreBefore, scoreValuesSeen: scores, says: r.says.map(s => s.text), firstGoalBubbleFrameAfterKick: firstGoalFrame, end: { ball: last.s.Ball, player: last.s.Player, score: last.vars.Score, threads: last.threads }, events: r.events });
    }
    return { goals };
  },

  // separate run for goal.png + win.png so screenshots show bubbles cleanly
  async shots_goal(h) {
    const p = await h.open(REF);
    const info = await p.evaluate(async () => {
      H.start(); await H.frames(3);
      await H.until(() => H.T('Goalie').y > 50, 200);
      await H.kickFrom(90, -60);
      await H.until(() => H.T('Ball').getCustomState('Scratch.looks')?.text === 'GOAL!', 60);
      await H.frames(4);
      return H.snap();
    });
    await h.saveShot(p, 'goal');
    return { goalShotState: info };
  },

  // 7. Goalie oscillation (reference + original), ~11 s each
  async t7_goalie(h) {
    const res = {};
    for (const [label, file] of [['reference', REF], ['original', ORIG]]) {
      const p = await h.open(file);
      const rows = await p.evaluate(async () => {
        H.start(); await H.frames(1); const rows = [];
        for (let i = 0; i < 340; i++) { await H.frames(1); rows.push([Math.round(performance.now() - H.t0), +H.T('Goalie').y.toFixed(2), +H.T('Goalie').x.toFixed(2)]); }
        return rows;
      });
      const ys = rows.map(r => r[1]);
      const turns = [];
      for (let i = 1; i < rows.length - 1; i++) {
        if ((ys[i] >= ys[i - 1] && ys[i] > ys[i + 1]) || (ys[i] <= ys[i - 1] && ys[i] < ys[i + 1])) turns.push({ ms: rows[i][0], y: ys[i] });
      }
      const legs = turns.slice(1).map((t, i) => (t.ms - turns[i].ms) / 1000);
      res[label] = { minY: Math.min(...ys), maxY: Math.max(...ys), xValues: [...new Set(rows.map(r => r[2]))], turningPoints: turns, legDurationsSec: legs };
    }
    const R = res.reference;
    R.pass = R.minY === -80 && R.maxY === 80 && R.legDurationsSec.length >= 2 && R.legDurationsSec.every(l => Math.abs(l - 2.5) < 0.15);
    return { pass: R.pass, ...res };
  },

  // 8. Save: kick straight into the goalie
  async t8_save(h) {
    const p = await h.open(REF);
    const r = await p.evaluate(async () => {
      H.start(); await H.frames(3);
      await H.until(() => Math.abs(H.T('Goalie').y) < 8, 200);
      const k = await H.kickFrom(30, 0); const touch = k.touchedAtFrame !== null;
      const before = k.pre;
      const rows = []; let savedAt = null, savedTouch = null;
      for (let i = 0; i < 60; i++) {
        await H.frames(1); const s = H.snap(); rows.push(s);
        if (savedAt === null && s.s.Ball.bubble === 'Saved!') { savedAt = i; savedTouch = { goal: H.touching('Ball', 'Goal'), goalie: H.touching('Ball', 'Goalie') }; }
      }
      return { touch, before, rows, savedAt, savedTouch, says: H.says };
    });
    const ballTrail = r.rows.map(s => [s.s.Ball.x, s.s.Ball.y, s.s.Ball.bubble]);
    const last = r.rows.at(-1);
    const out = {
      setup: 'Waited until |Goalie y|<8; Player teleported to (30,0) dir 90, Ball to (68,0); right arrow held until contact, then space.',
      ballTouchingPlayerAtKick: r.touch, says: r.says.map(s => s.text), savedBubbleFrame: r.savedAt,
      touchingAtSavedFrame: r.savedTouch,
      ballTrailFirst20: ballTrail.slice(0, 20),
      ballEnd: last.s.Ball, playerBefore: r.before.s.Player, playerEnd: last.s.Player,
      scoreBefore: r.before.vars.Score, scoreEnd: last.vars.Score,
      maxBallXDuringSavedBubble: Math.max(...r.rows.filter(s => s.s.Ball.bubble === 'Saved!').map(s => s.s.Ball.x)),
    };
    out.pass = out.says.includes('Saved!') && out.ballEnd.x === 0 && out.ballEnd.y === 0 && Math.abs(out.playerEnd.x - out.playerBefore.x) <= 5 && out.playerEnd.y === 0 && out.scoreBefore === out.scoreEnd && !out.says.includes('GOAL!');
    // saved.png: fresh run, capture the frame Saved! appears
    const q = await h.open(REF);
    await q.evaluate(async () => {
      H.start(); await H.frames(3);
      await H.until(() => Math.abs(H.T('Goalie').y) < 8, 200);
      await H.kickFrom(30, 0);
      await H.until(() => H.T('Ball').getCustomState('Scratch.looks')?.text === 'Saved!', 60);
    });
    await h.saveShot(q, 'saved');
    return out;
  },

  // 9. Ball touching Goal and Goalie in the same frame
  async t9_both(h) {
    const trials = [];
    for (const xOff of [10, 12, 15]) {
      const p = await h.open(REF);
      const r = await p.evaluate(async (xOff) => {
        H.start(); await H.frames(3);
        await H.until(() => Math.abs(H.T('Goalie').y) < 30, 200);
        const g = H.T('Goalie'); H.set('Ball', g.x + xOff, g.y);
        const both = { goal: H.touching('Ball', 'Goal'), goalie: H.touching('Ball', 'Goalie'), ball: H.snap().s.Ball, goalieY: g.y };
        const score0 = +H.v('Score');
        await H.frames(1);
        const nextFrame = { goal: H.touching('Ball', 'Goal'), goalie: H.touching('Ball', 'Goalie'), bubble: H.snap().s.Ball.bubble };
        await H.frames(60);
        return { both, nextFrame, score0, score1: +H.v('Score'), says: H.says.map(s => s.text), ballEnd: H.snap().s.Ball, playerEnd: H.snap().s.Player };
      }, xOff);
      trials.push({ ballTeleportedTo: `goalie.x+${xOff}, goalie.y`, ...r });
    }
    return { trials };
  },

  // 10. Clock: real-time 62+ s
  async t10_clock(h) {
    const p = await h.open(REF);
    const r = await p.evaluate(async () => {
      H.start(); const changes = []; let last = H.v('Time');
      changes.push({ ms: 0, frame: H.frame, Time: last });
      H.onFrame.push(() => { const t = H.v('Time'); if (t !== last) { changes.push({ ms: Math.round(performance.now() - H.t0), frame: H.frame, Time: t }); last = t; } });
      await H.until(() => H.says.some(s => s.text.startsWith('FULL TIME')), 30 * 70);
      await H.frames(3);
      return { changes, says: H.says, frameAtFull: H.frame };
    });
    await h.saveShot(p, 'fulltime');
    const after = await p.evaluate(async () => {
      await H.until(() => H.events.some(e => e.ev === 'STOP_ALL' && e.frame > 5), 120);
      await H.frames(2); const g1 = H.T('Goalie').y; await H.frames(45); const snapA = H.snap();
      const g2 = H.T('Goalie').y; H.key('ArrowUp', true); await H.frames(10); H.key('ArrowUp', false);
      return { goalieAtStop: g1, goalie1_5sAfterStop: g2, snapAfterStop: snapA, playerAfterKeys: H.snap().s.Player, events: H.events, threads: H.rt.threads.length };
    });
    // changes[0] = value in file (0); changes[1] = "set Time to 60"; changes[2..] = decrements
    const ch = r.changes.slice(1);
    const dec = ch.slice(1);
    const intervals = dec.slice(1).map((c, i) => c.ms - dec[i].ms);
    const full = r.says.find(s => s.text.startsWith('FULL TIME'));
    const out = {
      timeChanges: r.changes, setTo60AtMs: ch[0].ms, firstDecrementMs: dec[0].ms, firstDecrementAfterSetMs: dec[0].ms - ch[0].ms, setTo60ToZeroSec: (dec.at(-1).ms - ch[0].ms) / 1000,
      decrementIntervalsMs: { min: Math.min(...intervals), max: Math.max(...intervals), mean: Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) },
      timeHitZeroMs: ch.at(-1).ms, fullTimeSay: full, fullTimeTextCodepoints: full ? [...full.text].map(c => c.codePointAt(0).toString(16)) : null,
      says: r.says, ...after,
    };
    out.pass = !!full && full.text === 'FULL TIME! 🏁' && after.threads === 0 && after.events.some(e => e.ev === 'STOP_ALL') && after.goalieAtStop === after.goalie1_5sAfterStop && out.decrementIntervalsMs.max < 1100;
    return out;
  },
};

(async () => {
  const want = process.argv.slice(2);
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT)) : {};
  const h = await setup();
  try {
    for (const [name, fn] of Object.entries(tests)) {
      if (want.length && !want.includes(name)) continue;
      const t = Date.now();
      try { prev[name] = await fn(h); } catch (e) { prev[name] = { error: String(e.stack || e) }; }
      await h.closeAll();
      console.log(name, 'done in', ((Date.now() - t) / 1000).toFixed(1), 's', 'pass' in prev[name] ? 'pass=' + prev[name].pass : '', prev[name].error || '');
      fs.writeFileSync(OUT, JSON.stringify(prev, null, 1));
    }
  } finally { await h.close(); }
})();
