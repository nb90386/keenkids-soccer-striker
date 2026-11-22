// Structural checks on the final files: slide/page counts, notes, fonts, embedded fonts in PDF, sizes.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const { PDFDocument, PDFName } = require('pdf-lib');
const OUT = path.resolve(process.argv[2]);
(async () => {
  const r = {};
  const pptx = path.join(OUT, 'KeenKids_Soccer_Striker_FINAL.pptx');
  const list = execSync(`unzip -Z1 "${pptx}"`).toString().split('\n');
  r.pptxSlides = list.filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).length;
  r.pptxNotes = list.filter((f) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(f)).length;
  r.pptxMedia = list.filter((f) => f.startsWith('ppt/media/')).length;
  const pres = execSync(`unzip -p "${pptx}" ppt/presentation.xml`).toString();
  r.pptxSlideSizeEMU = (pres.match(/<p:sldSz[^>]*>/) || [''])[0];
  let fonts = new Set(), emptyNotes = 0, titles = [];
  for (let i = 1; i <= r.pptxSlides; i++) {
    const x = execSync(`unzip -p "${pptx}" ppt/slides/slide${i}.xml`).toString();
    (x.match(/typeface="([^"]+)"/g) || []).forEach((m) => fonts.add(m.slice(10, -1)));
    const n = execSync(`unzip -p "${pptx}" ppt/notesSlides/notesSlide${i}.xml`).toString();
    const txt = (n.match(/<a:t>([^<]*)<\/a:t>/g) || []).join('');
    if (txt.replace(/<[^>]+>/g, '').trim().length < 20) emptyNotes++;
  }
  r.pptxFonts = [...fonts]; r.pptxSlidesWithoutNotes = emptyNotes;
  const pdfBytes = fs.readFileSync(path.join(OUT, 'KeenKids_Soccer_Striker_FINAL.pdf'));
  const pdf = await PDFDocument.load(pdfBytes);
  r.pdfPages = pdf.getPageCount();
  const p0 = pdf.getPage(0); r.pdfPageSizeIn = [p0.getWidth() / 72, p0.getHeight() / 72].map((v) => +v.toFixed(3));
  const fontNames = new Set();
  const { PDFDict } = require('pdf-lib');
  pdf.context.enumerateIndirectObjects().forEach(([, obj]) => { if (obj instanceof PDFDict) { const fn = obj.get(PDFName.of('FontName')); if (fn && (obj.get(PDFName.of('FontFile2')) || obj.get(PDFName.of('FontFile3')))) fontNames.add(fn.toString().replace(/^\/[A-Z]{6}\+/, '').replace(/_.*/, '')); } });
  r.pdfFonts = [...fontNames];
  r.sizesMB = Object.fromEntries(fs.readdirSync(OUT).filter((f) => /\.(pptx|pdf|png|md)$/.test(f)).map((f) => [f, +(fs.statSync(path.join(OUT, f)).size / 1e6).toFixed(2)]));
  fs.writeFileSync(path.join(__dirname, 'render', 'output_checks.json'), JSON.stringify(r, null, 1));
  console.log(JSON.stringify(r, null, 1));
})();
