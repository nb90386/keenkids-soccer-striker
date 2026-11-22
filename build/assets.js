// Renders raster assets from the real Soccer Striker sprites (extracted from the Teacher Reference .sb3).
// Outputs to build/assets/: sprite PNGs, stage scenes composed at true Scratch coordinates, cover arch.
const fs = require('fs'), path = require('path');
const { launch } = require('./browser.js');
const A = path.join(__dirname, 'assets');
const svg = (n) => fs.readFileSync(path.join(A, 'sprites', n + '.svg'), 'utf8');
const dataUri = (n) => 'data:image/svg+xml;base64,' + Buffer.from(svg(n)).toString('base64');

// costume rotation centers from project.json (Scratch draws a sprite with its rotation center at (x, y))
const COSTUME = { Player: { w: 100, h: 120, cx: 50, cy: 60 }, Ball: { w: 80, h: 80, cx: 40, cy: 40 },
  Goalie: { w: 100, h: 120, cx: 50, cy: 60 }, Goal: { w: 44, h: 170, cx: 22, cy: 85 } };
// layer order from project.json: Goal 1, Goalie 2, Player 3, Ball 4
const LAYER = { Goal: 1, Goalie: 2, Player: 3, Player2: 3, Ball: 4 };

function stageHTML(sprites, scale) {
  const els = sprites.slice().sort((a, b) => LAYER[a.name] - LAYER[b.name]).map((s) => {
    const c = COSTUME[s.costume || s.name]; const k = (s.size || 100) / 100;
    const left = 240 + s.x - c.cx * k, top = 180 - s.y - c.cy * k;
    const flip = s.flip ? 'transform:scaleX(-1);' : '';
    const filt = s.filter ? `filter:${s.filter};` : '';
    return `<img src="${dataUri(s.costume || s.name)}" style="position:absolute;left:${left}px;top:${top}px;width:${c.w * k}px;height:${c.h * k}px;${flip}${filt}">`;
  }).join('');
  return `<div id="stage" style="position:relative;width:480px;height:360px;overflow:hidden;transform:scale(${scale});transform-origin:0 0">
    <img src="${dataUri('Pitch')}" style="position:absolute;left:0;top:0;width:480px;height:360px">${els}</div>`;
}

const KICKOFF = [{ name: 'Goal', x: 222, y: 0 }, { name: 'Goalie', x: 195, y: 0, size: 70 },
  { name: 'Player', x: -170, y: 0, size: 60 }, { name: 'Ball', x: -120, y: 0, size: 45 }];

if (require.main === module) (async () => {
  const b = await launch();
  const page = await b.newPage({ deviceScaleFactor: 1, viewport: { width: 2400, height: 1800 } });
  const shot = async (html, out, sel = '#root', transparent = true) => {
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${html}</body></html>`);
    await page.waitForTimeout(50);
    await (await page.$(sel)).screenshot({ path: path.join(A, out), omitBackground: transparent });
  };
  // 1) sprite PNGs at 8x
  for (const n of ['Player', 'Ball', 'Goalie', 'Goal']) {
    const c = COSTUME[n];
    await shot(`<img id="root" src="${dataUri(n)}" style="width:${c.w * 8}px;height:${c.h * 8}px;display:block">`, `sprite_${n}.png`);
  }
  // Player2: same costume, recoloured shirt (hue-rotate) as students are told to do
  await shot(`<img id="root" src="${dataUri('Player')}" style="width:800px;height:960px;display:block;filter:hue-rotate(150deg) saturate(1.2)">`, 'sprite_Player2.png');
  // 2) Pitch backdrop alone (3x)
  await shot(`<div id="root" style="width:1440px;height:1080px"><img src="${dataUri('Pitch')}" style="width:1440px;height:1080px;display:block"></div>`, 'pitch.png', '#root', false);
  // 3) Kickoff scene (3x) — real start positions from the lesson / reference project
  await shot(`<div id="root" style="width:1440px;height:1080px;overflow:hidden">${stageHTML(KICKOFF, 3)}</div>`, 'scene_kickoff.png', '#root', false);
  // 4) Cover arch: kickoff scene in a storybook arch frame (echoes the arch photo on the KeenKids site hero)
  const kick = 'data:image/png;base64,' + fs.readFileSync(path.join(A, 'scene_kickoff.png')).toString('base64');
  await shot(`<div id="root" style="width:1440px;height:1080px;border-radius:50% 50% 18px 18px / 34% 34% 18px 18px;overflow:hidden;background:url(${kick}) center/cover"></div>`, 'cover_arch.png');
  await b.close();
  console.log('assets done:', fs.readdirSync(A).filter((f) => f.endsWith('.png')).join(', '));
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { stageHTML, KICKOFF };
