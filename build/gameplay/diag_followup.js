// Follow-up layer-order tests (A) and (B). Realistic kick: teleport kicker + Ball 38 px ahead, hold the move key n frames,
// press the kick key while still moving. 12 attempts (n = 1..12), fresh page each.
const { setup } = require('./harness');
const fs = require('fs');
const REF = 'KeenKids_Soccer_Striker_Teacher_Reference.sb3';
const V = n => `build/gameplay/variants/${n}.sb3`;
const P1 = { kickKey: ' ', kicker: 'Player', moveKey: 'ArrowRight', place: ['Player', -170, 0, 90, -132, 0] };
const P2 = { kickKey: 'f', kicker: 'Player2', moveKey: 'a', place: ['Player2', -60, 120, -90, -98, 120] };
(async () => {
  const h = await setup(); const out = {};
  async function sweep(label, file, preFront, who, { secondFlag = false, waitFrames = 30 } = {}) {
    const rows = [];
    for (let n = 1; n <= 12; n++) {
      const p = await h.open(file);
      const r = await p.evaluate(async ({ n, preFront, who, secondFlag, waitFrames }) => {
        for (const s of preFront) H.T(s).goToFront(); // emulate dragging on the stage before the green flag
        H.start(); await H.frames(waitFrames);
        if (secondFlag) { H.greenFlag(); await H.frames(waitFrames); }
        const layers = H.rt.executableTargets.map(t => t.getName()).join('>');
        const threads = H.rt.threads.map(t => t.target.getName()).join(',');
        const [k, x, y, d, bx, by] = who.place;
        H.set(k, x, y, d); H.set('Ball', bx, by); await H.frames(1);
        H.key(who.moveKey, true); await H.frames(n);
        const b0 = H.snap().s.Ball;
        H.key(who.kickKey, true); await H.frames(1); H.key(who.kickKey, false); H.key(who.moveKey, false);
        await H.frames(12); const b1 = H.snap().s.Ball;
        return { n, layers, threads, moved12f: +Math.hypot(b1.x - b0.x, b1.y - b0.y).toFixed(1) };
      }, { n, preFront, who, secondFlag, waitFrames });
      r.kicked = r.moved12f > 40; rows.push(r); await h.closeAll();
    }
    const res = { file, preFrontBeforeFlag: preFront, secondFlag, kicker: who.kicker, layersBottomToTop: rows[0].layers, threadOrder: rows[0].threads, kicked: rows.filter(r => r.kicked).length, attempts: rows.length, rows: rows.map(({ layers, threads, ...x }) => x) };
    out[label] = res;
    console.log(label.padEnd(34), `${res.kicked}/${res.attempts}`, '| layers', res.layersBottomToTop, '| threads', res.threadOrder);
  }
  // (A) C2b with Ball dragged to the top layer before the flag
  await sweep('A_c2b_ballFront_P2_F', V('c2b_two_players_branch'), ['Ball'], P2);
  await sweep('A_c2b_ballFront_P1_space', V('c2b_two_players_branch'), ['Ball'], P1);
  // (B) reference with Player dragged to front; Ball has `go to front layer` under its first flag hat
  await sweep('B_ref_goto_playerFront', V('x_ref_ball_gotofront'), ['Player'], P1);
  await sweep('B_ref_goto_playerFront_2ndFlag', V('x_ref_ball_gotofront'), ['Player'], P1, { secondFlag: true });
  // controls without the block, same timing (1 s wait)
  await sweep('ctrl_ref_playerFront', REF, ['Player'], P1);
  await sweep('ctrl_ref_default', REF, [], P1);
  // same block in C2b (default layers: Player2 on top)
  await sweep('B_c2b_goto_P2_F', V('x_c2b_ball_gotofront'), [], P2);
  await sweep('B_c2b_goto_P2_F_2ndFlag', V('x_c2b_ball_gotofront'), [], P2, { secondFlag: true });
  await sweep('B_c2b_goto_P1_space', V('x_c2b_ball_gotofront'), [], P1);
  fs.writeFileSync(__dirname + '/results_followup.json', JSON.stringify(out, null, 1));
  await h.close();
})();
