// Diagnostic: kick reliability depends on sprite layer order (Scratch runs top-layer sprites' scripts first each frame).
// Scenario A: reference project, Player brought to the front (what dragging it on the stage in the editor does: scratch-gui
//             stage.jsx calls target.goToFront()). Sweep: hold right n frames from the start, press space.
// Scenario B: c2b variant (Player2 is top layer as a duplicated sprite), then Ball brought to front. Sweep F kicks.
const { setup } = require('./harness');
const fs = require('fs');
(async () => {
  const h = await setup(); const out = {};
  const sweep = async (file, pre, kickerKey, kicker, moveKey, place, ns) => {
    const rows = [];
    for (const n of ns) {
      const p = await h.open(file);
      const r = await p.evaluate(async ({ n, pre, kickerKey, kicker, moveKey, place }) => {
        // bring sprite to front BEFORE the green flag (as if dragged on stage in the editor beforehand);
        // thread order is fixed when the green-flag hats start, top layer first.
        if (pre) H.T(pre).goToFront();
        H.start(); await H.frames(3);
        const order = H.rt.executableTargets.map(t => t.getName());
        const threadOrder = H.rt.threads.map(th => th.target.getName());
        if (place) { H.set(place[0], place[1], place[2], place[3]); H.set('Ball', place[4], place[5]); await H.frames(1); }
        H.key(moveKey, true); await H.frames(n);
        const t = H.touching('Ball', kicker); const b0 = H.snap().s.Ball;
        H.key(kickerKey, true); await H.frames(1); H.key(kickerKey, false); H.key(moveKey, false);
        await H.frames(12); const b1 = H.snap().s.Ball;
        return { n, executionOrderBottomToTop: order, threadOrder, touchingAtPress: t, moved12f: +Math.hypot(b1.x - b0.x, b1.y - b0.y).toFixed(1) };
      }, { n, pre, kickerKey, kicker, moveKey, place });
      r.kicked = r.moved12f > 40; rows.push(r); await h.closeAll();
    }
    return { order: rows[0].executionOrderBottomToTop, threadOrder: rows[0].threadOrder, kicked: rows.filter(r => r.kicked).length, trials: rows.length, rows: rows.map(({ executionOrderBottomToTop, threadOrder, ...x }) => x) };
  };
  const ns = Array.from({ length: 12 }, (_, i) => i + 4);
  const REF = 'KeenKids_Soccer_Striker_Teacher_Reference.sb3', C2B = 'build/gameplay/variants/c2b_two_players_branch.sb3';
  out.ref_default = await sweep(REF, null, ' ', 'Player', 'ArrowRight', null, ns);
  out.ref_playerDraggedToFront = await sweep(REF, 'Player', ' ', 'Player', 'ArrowRight', null, ns);
  const p2place = ['Player2', -60, 120, -90, -98, 120];
  out.c2b_default_F = await sweep(C2B, null, 'f', 'Player2', 'a', p2place, ns.map(n => n - 3));
  out.c2b_ballToFront_F = await sweep(C2B, 'Ball', 'f', 'Player2', 'a', p2place, ns.map(n => n - 3));
  const FIX = 'build/gameplay/variants/x_fix_kick_distance50.sb3';
  out.fix_default = await sweep(FIX, null, ' ', 'Player', 'ArrowRight', null, ns);
  out.fix_playerDraggedToFront = await sweep(FIX, 'Player', ' ', 'Player', 'ArrowRight', null, ns);
  out.fix_playerToFront_fromAbove = await sweep(FIX, 'Player', ' ', 'Player', 'ArrowDown', ['Player', 0, 100, 180, 0, 50], ns.map(n => n - 3));
  out.ref_default_fromAbove = await sweep(REF, null, ' ', 'Player', 'ArrowDown', ['Player', 0, 100, 180, 0, 50], ns.map(n => n - 3));
  for (const [k, v] of Object.entries(out)) console.log(k, 'layers(bottom->top)=', v.order.join('>'), 'threads=', v.threadOrder.join(','), 'kicked', v.kicked, '/', v.trials);
  fs.writeFileSync(__dirname + '/results_layer_order.json', JSON.stringify(out, null, 1));
  await h.close();
})();
