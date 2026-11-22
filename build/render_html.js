// Renders the shared layout to HTML → per-slide PNGs, a PDF, a contact sheet, and automated layout QA.
// Usage: node render_html.js <outDir>
const fs = require('fs'), path = require('path');
const { launch } = require('./browser.js');
const { build, W, H } = require('./layout.js');
const PX = 144; // px per inch → 1920 × 1080 slides
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'render'));
fs.mkdirSync(path.join(OUT, 'png'), { recursive: true });

const F = (f) => `url('file://${__dirname}/fonts/static/${f}.ttf') format('truetype')`;
// Static instances (same files teachers install for the .pptx) so the preview matches PowerPoint's font metrics.
const fontCSS = `
@font-face{font-family:'Literata';src:${F('Literata-Regular')};font-weight:400;font-style:normal}
@font-face{font-family:'Literata';src:${F('Literata-Bold')};font-weight:700;font-style:normal}
@font-face{font-family:'Literata';src:${F('Literata-Italic')};font-weight:400;font-style:italic}
@font-face{font-family:'Figtree';src:${F('Figtree-Regular')};font-weight:400;font-style:normal}
@font-face{font-family:'Figtree';src:${F('Figtree-Bold')};font-weight:700;font-style:normal}
@font-face{font-family:'Figtree';src:${F('Figtree-Italic')};font-weight:400;font-style:italic}`;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function slideHTML(sl) {
  const els = sl.E.map((e, n) => {
    const box = `left:${e.x * PX}px;top:${e.y * PX}px;width:${e.w * PX}px;height:${e.h * PX}px;`;
    if (e.k === 'rect' || e.k === 'ellipse') {
      const br = e.k === 'ellipse' ? '50%' : `${(e.r || 0) * PX}px`;
      const bd = e.line ? `border:${(e.lw || 1) * 2}px solid #${e.line};` : '';
      return `<div class="el" style="${box}background:#${e.fill};border-radius:${br};${bd}box-sizing:border-box"></div>`;
    }
    if (e.k === 'line') {
      return `<div class="el" style="left:${e.x * PX}px;top:${e.y * PX - e.lw}px;width:${e.w * PX}px;height:0;border-top:${e.lw * 2}px solid #${e.color}"></div>`;
    }
    if (e.k === 'img') {
      const fl = e.flipH ? 'transform:scaleX(-1);' : '';
      return `<img class="el" data-role="${e.role || ''}" src="file://${e.src}" style="${box}${fl}" alt="${esc(e.alt || '')}">`;
    }
    if (e.k === 'text') {
      const base = { f: e.f || 'Figtree', sz: e.sz || 20, c: e.color || '282C26', b: e.b, i: e.i, cs: e.cs };
      const spans = e.runs.map((r) => {
        const o = { ...base, ...r };
        return `<span style="font-family:'${o.f}';font-size:${o.sz * 2}px;color:#${o.c};font-weight:${o.b ? 700 : 400};font-style:${o.i ? 'italic' : 'normal'};letter-spacing:${(o.cs || 0) * 2}px">${esc(o.t)}</span>`;
      }).join('');
      const lh = e.ls ? `${e.ls * 2}px` : `${(e.sz || 20) * 2 * 1.2}px`;
      const va = e.valign === 'middle' ? 'display:flex;align-items:center;' : '';
      return `<div class="el tx" data-n="${n}" data-role="${e.role || ''}" style="${box}font-family:'${base.f}';font-size:${base.sz * 2}px;line-height:${lh};text-align:${e.align || 'left'};${va}white-space:pre-wrap;overflow:visible">${spans}</div>`;
    }
  }).join('\n');
  return `<section class="slide" id="slide${sl.i + 1}" style="background:#${sl.bg}">${els}</section>`;
}

(async () => {
  const slides = build();
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fontCSS}
  @page{size:${W}in ${H}in;margin:0}
  html,body{margin:0;padding:0}
  .slide{position:relative;width:${W * PX}px;height:${H * PX}px;overflow:hidden;page-break-after:always;break-after:page}
  .el{position:absolute;margin:0;padding:0}
  </style></head><body>${slides.map(slideHTML).join('\n')}</body></html>`;
  fs.writeFileSync(path.join(OUT, 'deck.html'), html);
  const b = await launch();
  const page = await b.newPage({ viewport: { width: Math.round(W * PX), height: Math.round(H * PX) }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(OUT, 'deck.html'));
  await page.evaluate(() => document.fonts.ready);
  const fontsOK = await page.evaluate(() => ['Literata', 'Figtree'].map((f) => [f, document.fonts.check(`20px ${f}`)]));

  // ---- automated layout QA ----
  const qa = await page.evaluate(({ PX, W, H }) => {
    const res = [];
    document.querySelectorAll('.slide').forEach((sec, si) => {
      const issues = [];
      const sr = sec.getBoundingClientRect();
      const texts = [...sec.querySelectorAll('.tx')];
      texts.forEach((t) => {
        // measure natural text height/width vs. its box (also at 95% width to leave slack for PowerPoint/Canva wrapping)
        const r = t.getBoundingClientRect();
        const meas = (wf) => { const c = t.cloneNode(true); c.style.height = 'auto'; c.style.width = (r.width * wf) + 'px'; c.style.visibility = 'hidden'; c.style.display = 'block'; sec.appendChild(c); const h = c.getBoundingClientRect().height, sw = c.scrollWidth; c.remove(); return [h, sw]; };
        const [h100] = meas(1), [h95, sw] = meas(0.95);
        const range = document.createRange(); range.selectNodeContents(t); const rr = range.getBoundingClientRect();
        if (h100 > r.height + 3) issues.push({ type: 'text-overflow', text: t.textContent.slice(0, 60), boxH: r.height, needH: h100 });
        else if (h95 > r.height + 3) issues.push({ type: 'text-tight', text: t.textContent.slice(0, 60), boxH: r.height, needH95: h95 });
        if (sw > r.width * 0.95 + 2) issues.push({ type: 'word-too-wide', text: t.textContent.slice(0, 60) });
        if (rr.right > sr.right - 2 || rr.bottom > sr.bottom - 2 || rr.left < sr.left) issues.push({ type: 'off-slide', text: t.textContent.slice(0, 60) });
      });
      sec.querySelectorAll('img').forEach((im) => {
        const r = im.getBoundingClientRect();
        if (!im.complete || im.naturalWidth === 0) issues.push({ type: 'image-missing', src: im.src });
        if (r.right > sr.right + 1 || r.bottom > sr.bottom + 1) issues.push({ type: 'image-off-slide', src: im.src.split('/').pop() });
      });
      // content collisions: code image vs. text with role body/title; text vs text
      const boxes = [...sec.querySelectorAll('[data-role]')].filter((e) => e.dataset.role).map((e) => {
        let r;
        if (e.classList.contains('tx')) { const range = document.createRange(); range.selectNodeContents(e); r = range.getBoundingClientRect(); }
        else r = e.getBoundingClientRect();
        return { role: e.dataset.role, r, label: (e.textContent || e.alt || '').slice(0, 40) };
      });
      for (let a = 0; a < boxes.length; a++) for (let c = a + 1; c < boxes.length; c++) {
        const A = boxes[a].r, B = boxes[c].r;
        const ox = Math.min(A.right, B.right) - Math.max(A.left, B.left), oy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
        if (ox > 2 && oy > 2) issues.push({ type: 'overlap', a: boxes[a].label, b: boxes[c].label });
      }
      // code-image placement inside its card + minimum projected font size is computed in node from meta
      const code = sec.querySelector('img[data-role="code"]');
      const codeBox = code ? (() => { const r = code.getBoundingClientRect(); return { x: (r.left - sr.left) / PX, y: (r.top - sr.top) / PX, w: r.width / PX, h: r.height / PX }; })() : null;
      res.push({ slide: si + 1, issues, codeBox });
    });
    return res;
  }, { PX, W, H });

  // ---- per-slide PNG ----
  for (const sl of slides) {
    const el = await page.$(`#slide${sl.i + 1}`);
    await el.screenshot({ path: path.join(OUT, 'png', `slide-${String(sl.i + 1).padStart(2, '0')}.png`) });
  }
  // ---- PDF ----
  await page.pdf({ path: path.join(OUT, 'deck.pdf'), width: `${W}in`, height: `${H}in`, printBackground: true, preferCSSPageSize: true });
  // ---- contact sheet ----
  const thumbs = slides.map((sl) => `<figure><img src="file://${path.join(OUT, 'png', `slide-${String(sl.i + 1).padStart(2, '0')}.png`)}"><figcaption>${sl.i + 1} · ${esc(sl.s.title)}</figcaption></figure>`).join('');
  const sheet = `<!doctype html><html><head><style>${fontCSS} body{margin:0;background:#EFE9DA;font-family:Figtree} .g{display:grid;grid-template-columns:repeat(6,1fr);gap:18px;padding:24px;width:2600px}
   figure{margin:0} img{width:100%;display:block;border:1px solid #DDD7CB} figcaption{font-size:15px;color:#4F554C;padding:5px 2px}</style></head><body><div class="g" id="g">${thumbs}</div></body></html>`;
  fs.writeFileSync(path.join(OUT, 'contact.html'), sheet);
  const p2 = await b.newPage({ viewport: { width: 2648, height: 1000 } });
  await p2.goto('file://' + path.join(OUT, 'contact.html'));
  await p2.waitForTimeout(300);
  await (await p2.$('#g')).screenshot({ path: path.join(OUT, 'contact_sheet.png') });
  await b.close();

  const meta = slides.map((sl) => ({ slide: sl.i + 1, type: sl.s.type, title: sl.s.title, ...sl.meta }));
  const report = { fontsOK, qa, meta };
  fs.writeFileSync(path.join(OUT, 'layout_qa.json'), JSON.stringify(report, null, 1));
  const flagged = qa.filter((q) => q.issues.length);
  console.log('fonts', JSON.stringify(fontsOK));
  console.log('slides', slides.length, 'with issues', flagged.length);
  flagged.forEach((q) => console.log(' slide', q.slide, JSON.stringify(q.issues)));
  const fp = meta.filter((m) => m.fontPt).map((m) => m.fontPt);
  console.log('code text pt: min', Math.min(...fp).toFixed(1), 'max', Math.max(...fp).toFixed(1));
  meta.filter((m) => m.fontPt && m.fontPt < 24).forEach((m) => console.log('  small code text', m.slide, m.title, m.fontPt.toFixed(1), m.layout));
})().catch((e) => { console.error(e); process.exit(1); });
