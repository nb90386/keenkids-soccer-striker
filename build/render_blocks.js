// Renders Scratch 3 block scripts with scratchblocks (official renderer) in headless Chromium.
// Input: blocks.json [{id, code}] ; Output: blocks/<id>.svg, blocks/<id>.png (transparent, high-res), blocks/manifest.json (px sizes at scale 1)
const fs = require('fs'), path = require('path');
const { launch } = require('./browser.js');
const SCALE = 1;          // scratchblocks zoom in the SVG (we scale when placing)
const DPR = 5;            // PNG pixel density
(async () => {
  const items = JSON.parse(fs.readFileSync(process.argv[2] || 'blocks.json', 'utf8'));
  const outDir = path.resolve(process.argv[3] || 'blocks');
  fs.mkdirSync(outDir, { recursive: true });
  const b = await launch();
  const page = await b.newPage({ deviceScaleFactor: DPR, viewport: { width: 1600, height: 1200 } });
  await page.setContent('<!doctype html><html><body style="margin:0;background:transparent"><div id="host"></div></body></html>');
  await page.addScriptTag({ path: require.resolve('scratchblocks/build/scratchblocks.min.js') });
  const manifest = {};
  for (const it of items) {
    const info = await page.evaluate(({ code, scale }) => {
      const host = document.getElementById('host');
      host.innerHTML = '';
      const doc = scratchblocks.parse(code, { languages: ['en'] });
      const view = scratchblocks.newView(doc, { style: 'scratch3', scale });
      const svg = view.render();
      svg.id = 'out';
      host.appendChild(svg);
      const w = parseFloat(svg.getAttribute('width')), h = parseFloat(svg.getAttribute('height'));
      // collect unknown/obsolete blocks (red) to catch syntax mistakes
      const bad = [...svg.querySelectorAll('.sb3-obsolete, .sb3-extension, .sb-obsolete')].length;
      const texts = [...svg.querySelectorAll('text')].map(t => t.textContent);
      const ser = new XMLSerializer().serializeToString(svg);
      return { w, h, bad, texts, ser };
    }, { code: it.code, scale: SCALE });
    fs.writeFileSync(path.join(outDir, it.id + '.svg'), info.ser);
    const el = await page.$('#out');
    await el.screenshot({ path: path.join(outDir, it.id + '.png'), omitBackground: true });
    manifest[it.id] = { code: it.code, w: info.w, h: info.h, bad: info.bad, texts: info.texts };
    if (info.bad) console.warn('WARNING obsolete/unknown block in', it.id, it.code);
  }
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1));
  await b.close();
  console.log('rendered', items.length);
})().catch(e => { console.error(e); process.exit(1); });
