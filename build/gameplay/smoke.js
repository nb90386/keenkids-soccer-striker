const { setup } = require('./harness');
(async () => {
  const h = await setup();
  const p = await h.open('KeenKids_Soccer_Striker_Teacher_Reference.sb3');
  console.log('targets', p.names);
  await p.evaluate(() => { H.start(); return H.frames(10); });
  console.log(JSON.stringify(await p.evaluate(() => H.snap())));
  console.log(await p.evaluate(() => [H.touching('Ball','Player'), H.bounds('Player'), H.bounds('Ball'), H.bounds('Goal'), H.bounds('Goalie')]));
  await h.saveShot(p, '_smoke');
  console.log('errors', p.consoleErrors);
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
