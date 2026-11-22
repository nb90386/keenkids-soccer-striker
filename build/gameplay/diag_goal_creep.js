// Diagnostic: per-frame timing of a kicked goal, to explain the ball drifting after the GOAL! reset.
const { setup } = require('./harness');
(async () => {
  const h = await setup(); const out = [];
  for (let trial = 0; trial < 3; trial++) {
    const p = await h.open('KeenKids_Soccer_Striker_Teacher_Reference.sb3');
    const r = await p.evaluate(async () => {
      H.start(); await H.frames(3);
      await H.until(() => H.T('Goalie').y > 50, 200);
      const k = await H.kickFrom(90, -60); const f0 = H.frame, t0 = performance.now();
      const rows = [];
      for (let i = 0; i < 45; i++) { await H.frames(1); const s = H.snap(); rows.push([H.frame - f0, Math.round(performance.now() - t0), +s.s.Ball.x.toFixed(1), +s.s.Ball.y.toFixed(1), s.s.Ball.bubble, s.s.Player.x]); }
      return rows;
    });
    const goalF = r.find(x => x[4] === 'GOAL!'); const reset = r.find(x => x[5] === -170);
    const last = r.at(-1);
    out.push({ trial, goalBubbleAt: goalF && goalF.slice(0, 2), resetAt: reset && reset.slice(0, 2), ballAtEnd: last.slice(2, 4), meanFrameMs: Math.round(last[1] / last[0]) });
    await h.closeAll();
  }
  console.log(JSON.stringify(out, null, 1)); await h.close();
})();
