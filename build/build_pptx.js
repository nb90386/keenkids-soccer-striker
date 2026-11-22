// Writes the editable PowerPoint from the shared layout (layout.js) with real speaker notes.
// Usage: node build_pptx.js <out.pptx>
const path = require('path');
const pptxgen = require('pptxgenjs');
const { build } = require('./layout.js');
const notesFor = require('./notes.js');

const out = path.resolve(process.argv[2] || path.join(__dirname, 'render', 'deck.pptx'));
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.333 × 7.5 in
pptx.author = 'KeenKids Enrichment';
pptx.company = 'KeenKids Enrichment';
pptx.subject = 'Soccer Striker in Scratch · Grades 3–4';
pptx.title = 'Soccer Striker! KeenKids Scratch Coding Club (FINAL)';
pptx.lang = 'en-US';
pptx.theme = { headFontFace: 'Literata', bodyFontFace: 'Figtree', lang: 'en-US' };

const slides = build();
slides.forEach((sl) => {
  const slide = pptx.addSlide();
  slide.background = { color: sl.bg };
  sl.E.forEach((e, n) => {
    if (e.k === 'rect' || e.k === 'ellipse') {
      const type = e.k === 'ellipse' ? pptx.ShapeType.ellipse : e.r ? pptx.ShapeType.roundRect : pptx.ShapeType.rect;
      slide.addShape(type, {
        x: e.x, y: e.y, w: e.w, h: e.h, fill: { color: e.fill },
        line: e.line ? { color: e.line, width: e.lw || 1 } : { type: 'none' },
        ...(e.r && e.k === 'rect' ? { rectRadius: Math.min(e.r, Math.min(e.w, e.h) / 2) } : {}),
        objectName: `shape-${n}`,
      });
    } else if (e.k === 'line') {
      slide.addShape(pptx.ShapeType.line, { x: e.x, y: e.y, w: e.w, h: e.h || 0, line: { color: e.color, width: e.lw } });
    } else if (e.k === 'img') {
      slide.addImage({ path: e.src, x: e.x, y: e.y, w: e.w, h: e.h, altText: e.alt || '', flipH: !!e.flipH, objectName: e.role === 'code' ? 'Scratch blocks' : `image-${n}` });
    } else if (e.k === 'text') {
      const base = { f: e.f || 'Figtree', sz: e.sz || 20, c: e.color || '282C26', b: e.b, i: e.i, cs: e.cs };
      const runs = e.runs.filter((r) => r.t !== '').map((r) => {
        const o = { ...base, ...r };
        return { text: o.t, options: { fontFace: o.f, fontSize: o.sz, color: o.c, bold: !!o.b, italic: !!o.i, ...(o.cs ? { charSpacing: o.cs } : {}) } };
      });
      slide.addText(runs, {
        x: e.x, y: e.y, w: e.w, h: e.h, margin: 0, valign: e.valign === 'middle' ? 'middle' : 'top', align: e.align || 'left',
        lineSpacing: e.ls || Math.round((e.sz || 20) * 1.2 * 10) / 10, fit: 'none', wrap: true,
        objectName: e.role === 'title' ? 'Title' : `text-${n}`,
      });
    }
  });
  slide.addNotes(notesFor(sl.s, sl.i));
});

pptx.writeFile({ fileName: out }).then(() => console.log('wrote', out, slides.length, 'slides'))
  .catch((e) => { console.error(e); process.exit(1); });
