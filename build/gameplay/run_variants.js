// Challenge-variant tests. Usage: NODE_PATH=../node_modules node run_variants.js [testName ...]
const fs = require('fs'), path = require('path');
const { setup } = require('./harness');
const V = n => `build/gameplay/variants/${n}.sb3`;
const OUT = path.join(__dirname, 'results_variants.json');
const r2 = n => Math.round(n * 100) / 100;

const tests = {
  async c1_speed_boots(h) {
    const out = {};
    // speed measurement on c1 (dribble 6)
    const p = await h.open(V('c1_speed_boots'));
    out.speed = await p.evaluate(async () => {
      H.start(); await H.frames(3); H.set('Ball', -200, 140);
      const meas = async (keys, n = 10) => {
        H.set('Player', -100, -60, 90); await H.frames(2);
        const xs = [H.snap().s.Player]; keys.forEach(k => H.key(k, true));
        for (let i = 0; i < n; i++) { await H.frames(1); xs.push(H.snap().s.Player); }
        keys.forEach(k => H.key(k, false)); await H.frames(2);
        return { keys, perFrame: [...new Set(xs.slice(1).map((s, i) => +Math.hypot(s.x - xs[i].x, s.y - xs[i].y).toFixed(2)))], end: xs.at(-1) };
      };
      return { zPlusRight: await meas(['z', 'ArrowRight']), rightOnly: await meas(['ArrowRight']), zOnlyFacingRight: await meas(['z']), zPlusUp: await meas(['z', 'ArrowUp']) };
    });
    // outrun test: dribble from start with z+right held, 40 frames, both dribble speeds
    for (const v of ['c1_speed_boots', 'c1_speed_boots_dribble10']) {
      const q = await h.open(V(v));
      let rows = await q.evaluate(async () => {
        H.start(); await H.frames(3); H.key('z', true); H.key('ArrowRight', true);
        const rows = [];
        for (let i = 0; i < 40; i++) { await H.frames(1); const s = H.snap(); rows.push([s.s.Player.x, s.s.Ball.x, H.touching('Ball', 'Player')]); }
        H.key('z', false); H.key('ArrowRight', false); return { rows, says: H.says.map(x => x.text + '@frame' + x.frame) };
      });
      const says = rows.says; rows = rows.rows;
      const gaps = rows.map(r => r2(r[1] - r[0]));
      const ballSteps = rows.slice(1).map((r, i) => r2(r[1] - rows[i][1]));
      const passed = rows.findIndex(r => r[1] < r[0]);
      out[v] = { says, ballMinusPlayerX: gaps, ballStepsPerFrame: ballSteps, firstFrameBallBehindPlayer: passed, end: { playerX: rows.at(-1)[0], ballX: rows.at(-1)[1], touching: rows.at(-1)[2] }, lostContactFramesAfterFirstTouch: rows.slice(rows.findIndex(r => r[2])).filter(r => !r[2]).length };
    }
    out.pass = out.speed.zPlusRight.perFrame.length === 1 && out.speed.zPlusRight.perFrame[0] === 9;
    return out;
  },

  async c2_two_players(h) {
    const out = {};
    for (const v of ['c2a_two_players_or', 'c2b_two_players_branch']) {
      const res = {};
      const p = await h.open(V(v));
      // P2 dribble: Ball teleported to (60,0) in front of Player2 (120,0, facing -90); hold A.
      res.p2Dribble = await p.evaluate(async () => {
        H.start(); await H.frames(3); H.set('Ball', 60, 0); await H.frames(1);
        H.key('a', true); const rows = [];
        for (let i = 0; i < 30; i++) { await H.frames(1); const s = H.snap(); rows.push({ p1dir: s.s.Player.dir, p2x: s.s.Player2.x, p2dir: s.s.Player2.dir, bx: s.s.Ball.x, bdir: s.s.Ball.dir, t: H.touching('Ball', 'Player2') }); }
        H.key('a', false); return rows;
      });
      const d = res.p2Dribble;
      res.p2DribbleSummary = {
        ballDirsWhileMoving: [...new Set(d.filter((r, i) => i && r.bx !== d[i - 1].bx).map(r => r.bdir))],
        ballStepValues: [...new Set(d.slice(1).map((r, i) => r2(r.bx - d[i].bx)))],
        player1Dir: d[0].p1dir, player2Dir: d[0].p2dir,
        start: { ballX: 60, p2X: 120 }, end: { ballX: d.at(-1).bx, p2X: d.at(-1).p2x },
        ballEndsBehindP2: d.at(-1).bx > d.at(-1).p2x,
      };
      delete res.p2Dribble;
      // P1 dribble still OK? fresh game, hold right 30 frames
      const q = await h.open(V(v));
      res.p1Dribble = await q.evaluate(async () => {
        H.start(); await H.frames(3); const b0 = H.snap().s.Ball.x; H.key('ArrowRight', true); await H.frames(30); H.key('ArrowRight', false);
        return { ballDx: H.snap().s.Ball.x - b0, ballDir: H.snap().s.Ball.dir };
      });
      // F kick when not touching Player2 (start positions)
      const r = await h.open(V(v));
      res.fNotTouching = await r.evaluate(async () => {
        H.start(); await H.frames(3); const b = H.snap().s.Ball; H.key('f', true); await H.frames(1); H.key('f', false); await H.frames(20);
        return { touchingP2: H.touching('Ball', 'Player2'), before: [b.x, b.y], after: [H.snap().s.Ball.x, H.snap().s.Ball.y] };
      });
      // F kick sweep: Player2 at (-60,120) facing -90, Ball 38px to its left; hold A for n frames then press F.
      res.fKickSweep = [];
      for (let n = 1; n <= 9; n++) {
        const s = await h.open(V(v));
        const k = await s.evaluate(async (n) => {
          H.start(); await H.frames(3);
          H.set('Player2', -60, 120, -90); H.set('Ball', -98, 120); await H.frames(1);
          H.key('a', true); await H.frames(n);
          const pre = H.snap(); const touch = H.touching('Ball', 'Player2');
          H.key('f', true); await H.frames(1); H.key('f', false); H.key('a', false);
          await H.frames(40);
          const post = H.snap();
          const b0 = pre.s.Ball;
          return { n, touchingAtPress: touch, ballAtPress: [b0.x, b0.y], ballEnd: [post.s.Ball.x, post.s.Ball.y], ballDirEnd: post.s.Ball.dir,
            dist: +Math.hypot(post.s.Ball.x - b0.x, post.s.Ball.y - b0.y).toFixed(2), expectedDirFromBallAtPress: +(90 - Math.atan2(0 - b0.y, 222 - b0.x) * 180 / Math.PI).toFixed(2), says: H.says.map(x => x.text) };
        }, n);
        k.kicked = k.dist > 100; res.fKickSweep.push(k);
        await h.closeAll();
      }
      // space while only Player2 is touching (Player1 far away) -> should not kick
      const u = await h.open(V(v));
      res.spaceWithOnlyP2 = await u.evaluate(async () => {
        H.start(); await H.frames(3); H.set('Player2', -60, 120, -90); H.set('Ball', -98, 120); await H.frames(1);
        H.key('a', true); await H.frames(4); const b0 = H.snap().s.Ball; const t = H.touching('Ball', 'Player2');
        H.key(' ', true); await H.frames(1); H.key(' ', false); H.key('a', false); await H.frames(30);
        const b1 = H.snap().s.Ball; return { touchingP2AtPress: t, moved: +Math.hypot(b1.x - b0.x, b1.y - b0.y).toFixed(2) };
      });
      out[v] = res;
      await h.closeAll();
    }
    return out;
  },

  async c3_friction(h) {
    const out = { kicks: [] };
    for (const [file, label] of [[V('c3_friction_kick'), 'c3'], ['KeenKids_Soccer_Striker_Teacher_Reference.sb3', 'reference']]) {
      for (const [px, py] of [[-170, 0], [-190, 120]]) {
        const p = await h.open(file);
        const k = await p.evaluate(async ([px, py]) => {
          H.start(); await H.frames(3);
          const pre = await H.kickFrom(px, py);
          const traj = [pre.post1.s.Ball]; const ks = [H.v('KickSpeed')];
          for (let i = 0; i < 45; i++) { await H.frames(1); traj.push(H.snap().s.Ball); ks.push(H.v('KickSpeed')); }
          return { b0: pre.pre.s.Ball, traj, ks };
        }, [px, py]);
        const steps = k.traj.map((b, i) => r2(Math.hypot(b.x - (i ? k.traj[i - 1].x : k.b0.x), b.y - (i ? k.traj[i - 1].y : k.b0.y))));
        const end = k.traj.at(-1);
        out.kicks.push({ project: label, from: [px, py], totalDistance: r2(Math.hypot(end.x - k.b0.x, end.y - k.b0.y)), perFrameSteps: steps.filter(s => s > 0), framesUntilStill: steps.findLastIndex(s => s > 0) + 1, kickSpeedFinal: k.ks.at(-1) });
        await h.closeAll();
      }
    }
    return out;
  },

  async c4_golden(h) {
    const out = {};
    for (const v of ['c4_golden_goal', 'c4_golden_goal_no_reset']) {
      const p = await h.open(V(v));
      const run1 = await p.evaluate(async () => {
        H.start(); await H.frames(2);
        const gg0 = H.v('GoldenGoal');
        await H.until(() => H.says.some(s => s.text === 'GOLDEN GOAL!'), 200);
        const atGolden = H.snap(); const ggAt = H.v('GoldenGoal');
        await H.frames(75); // 2.5 s later: is the game still running?
        const g1 = H.T('Goalie').y; await H.frames(15); const g2 = H.T('Goalie').y;
        H.set('Ball', -200, 140); const p0 = H.snap().s.Player; H.key('ArrowUp', true); await H.frames(10); H.key('ArrowUp', false); const p1 = H.snap().s.Player;
        const running = { threads: H.rt.threads.length, goalieMoved: g1 !== g2, playerMovedWithKey: +(p1.y - p0.y).toFixed(2), time: H.v('Time') };
        // score the next goal
        await H.until(() => H.T('Goalie').y > 50, 200);
        const n0 = H.says.length;
        await H.kickFrom(90, -60);
        await H.until(() => H.events.some(e => e.ev === 'STOP_ALL' && e.frame > 5), 200);
        await H.frames(2);
        return { gg0, atGoldenMs: atGolden.ms, timeAtGolden: atGolden.vars.Time, ggAt, running, saysAfterGoal: H.says.slice(n0).map(s => s.text), scoreEnd: H.v('Score'), threadsEnd: H.rt.threads.length, ggEnd: H.v('GoldenGoal') };
      });
      // second green-flag run on the same page
      const run2 = await p.evaluate(async () => {
        const n0 = H.says.length; const ev0 = H.events.length; const f0 = H.frame;
        H.greenFlag(); await H.frames(2);
        const ggAfterFlag = H.v('GoldenGoal');
        await H.until(() => H.T('Goalie').y > 40, 200);
        const timeAtKick = H.v('Time');
        await H.kickFrom(90, -60);
        await H.frames(110); // > GOAL! 1s + YOU WIN! 2s
        return { ggAfterFlag, timeAtKick, says: H.says.slice(n0).map(s => s.text), score: H.v('Score'), stoppedAfterGoal: H.events.slice(ev0).filter(e => e.ev === 'STOP_ALL' && e.frame > f0 + 5).length > 0, threads: H.rt.threads.length, time: H.v('Time') };
      });
      out[v] = { run1, run2 };
      await h.closeAll();
    }
    out.note = 'Time shortened to 3 s in both variants (set Time to 3).';
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
      console.log(name, 'done in', ((Date.now() - t) / 1000).toFixed(1), 's', prev[name].error || '');
      fs.writeFileSync(OUT, JSON.stringify(prev, null, 1));
    }
  } finally { await h.close(); }
})();
