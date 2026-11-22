// Diagnostic: does space kick the ball at every moment of a normal dribble?
// Fresh game each trial: hold right arrow from the start, press space after N frames (right still held), check if a kick happened.
const { setup } = require('./harness');
const file = process.argv[2] || 'KeenKids_Soccer_Striker_Teacher_Reference.sb3';
(async () => {
  const h = await setup(); const out = [];
  for (let n = 2; n <= 20; n++) {
    const p = await h.open(file);
    const r = await p.evaluate(async (n) => {
      H.start(); await H.frames(3);
      H.key('ArrowRight', true); await H.frames(n);
      const touchingAtPress = H.touching('Ball', 'Player');
      const gap = +(H.bounds('Ball').left - H.bounds('Player').right).toFixed(2);
      const b0 = H.snap().s.Ball.x;
      H.key(' ', true); await H.frames(1); H.key(' ', false); H.key('ArrowRight', false);
      await H.frames(12);
      return { n, touchingAtPress, edgeGapAtPress: gap, ballMoved12f: +(H.snap().s.Ball.x - b0).toFixed(1) };
    }, n);
    r.kicked = r.ballMoved12f > 40; out.push(r); await h.closeAll();
  }
  console.log(JSON.stringify(out));
  const touching = out.filter(o => o.touchingAtPress);
  console.log(`pressed while touching: ${touching.length}, kicked: ${touching.filter(o => o.kicked).length}`);
  require('fs').writeFileSync(__dirname + '/results_kick_phase' + (file.includes('Reference') ? '' : '_orig') + '.json', JSON.stringify(out, null, 1));
  await h.close();
})();
