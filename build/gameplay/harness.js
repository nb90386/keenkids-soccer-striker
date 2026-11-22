// Node-side harness: static server + headless Chromium page running real scratch-vm/scratch-render.
const http = require('http'), fs = require('fs'), path = require('path');
const { launch } = require('../browser.js');
const ROOT = path.resolve(__dirname, '../..'); // project root (read-only use)
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.sb3': 'application/octet-stream', '.json': 'application/json', '.svg': 'image/svg+xml' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
async function setup() {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const contexts = [];
  async function open(sb3Rel) {
    const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 520, height: 400 } });
    contexts.push(ctx);
    const page = await ctx.newPage();
    page.consoleErrors = [];
    page.on('console', m => { if (m.type() === 'error') page.consoleErrors.push(m.text()); });
    page.on('pageerror', e => page.consoleErrors.push('pageerror: ' + e.message));
    await page.goto(base + '/build/gameplay/harness.html');
    const names = await page.evaluate(u => H.load(u), '/' + sb3Rel.split('/').map(encodeURIComponent).join('/'));
    page.names = names;
    return page;
  }
  async function saveShot(page, name) {
    const out = await page.evaluate(() => H.capture());
    const dir = path.join(__dirname, 'shots');
    fs.writeFileSync(path.join(dir, name + '.png'), Buffer.from(out.x1.split(',')[1], 'base64'));
    fs.writeFileSync(path.join(dir, name + '@2x.png'), Buffer.from(out.x2.split(',')[1], 'base64'));
  }
  async function closeAll() { while (contexts.length) await contexts.pop().close(); }
  async function close() { await browser.close(); srv.close(); }
  return { open, saveShot, close, closeAll, base };
}
module.exports = { setup };
