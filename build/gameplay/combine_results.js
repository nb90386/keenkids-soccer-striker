// Merge raw result files into results.json
const fs = require('fs'); const r = f => JSON.parse(fs.readFileSync(__dirname + '/' + f));
const out = {
  generated: new Date().toISOString(),
  environment: { scratchVm: '5.0.300 (dist/web UMD)', scratchRender: '2.2.84', scratchStorage: '6.2.1', browser: 'chrome-headless-shell 1254 via playwright-core, WebGL via SwiftShader', frameRate: 'vm.setCompatibilityMode(true) => 30 fps (measured 30.3 fps)' },
  base: r('results_base.json'), variants: r('results_variants.json'),
  followUp_layerOrder: { note: 'diag_followup.js: realistic kick, n=1..12 frames of movement before the kick key, fresh page each; 30-frame (1 s) wait after green flag; goToFront() applied before the green flag emulates a stage drag', results: r('results_followup.json'), guiClickVsDrag: 'Verified in @scratch/scratch-gui 15.3.0 src/containers/stage.jsx: goToFront() is only called in onStartDrag, which runs when the mouse moves > 3 px (dragThreshold) while down, or after the mouse is held 400 ms (mouseDownTimeoutId); onMouseUp cancels the timeout. A quick click does not change layers. scratch-vm 5.0.300 changes layers only via looks_gotofrontback / goforwardbackwardlayers blocks.' },
  diagnostics: { kickPhaseSweepReference: r('results_kick_phase.json'), layerOrder: r('results_layer_order.json'),
    goalCreep_consoleOutputOf_diag_goal_creep_js: { note: 'copied from console output of diag_goal_creep.js (frame index, ms since kick)', trials: [
      { trial: 0, goalBubbleAt: [1, 325], resetAt: [25, 1056], ballAtEnd: [39.7, 27], meanFrameMs: 38 },
      { trial: 1, goalBubbleAt: [1, 43], resetAt: [32, 1054], ballAtEnd: [0, 0], meanFrameMs: 33 },
      { trial: 2, goalBubbleAt: [1, 41], resetAt: [32, 1056], ballAtEnd: [0, 0], meanFrameMs: 33 }] } },
};
fs.writeFileSync(__dirname + '/results.json', JSON.stringify(out, null, 1));
console.log('results.json', fs.statSync(__dirname + '/results.json').size, 'bytes');
