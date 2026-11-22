const { setup } = require('./harness');
(async () => {
  const h = await setup();
  const p = await h.open('KeenKids_Soccer_Striker_Teacher_Reference.sb3');
  const r = await p.evaluate(async () => { H.start(); await H.frames(5); const a = performance.now(), f = H.frame; await H.frames(90); return { fps: (H.frame - f) / ((performance.now() - a) / 1000) }; });
  console.log(r); await h.close();
})();
