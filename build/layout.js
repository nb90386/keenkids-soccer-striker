// Layout engine: turns content.js into a list of positioned elements per slide (inches, 13.333 × 7.5).
// The same element list feeds build_pptx.js (editable PowerPoint) and render_html.js (PNG/PDF + QA),
// so the preview and the PowerPoint share one geometry.
const fs = require('fs'), path = require('path');
const SLIDES = require('./content.js');
const A = (f) => path.join(__dirname, 'assets', f);
const BLOCKS = path.join(__dirname, 'blocks');
const SHOTS = path.join(__dirname, 'gameplay', 'shots');

const W = 13.333, H = 7.5, MX = 0.7;
// KeenKids storybook tokens (measured from keenkids-storybook-preview.vercel.app CSS variables)
const C = { paper: 'F7F3E9', card: 'FFFCF5', second: 'EFE9DA', accent: 'D8DFD2', border: 'DDD7CB', forest: '254638',
  deep: '1C3A2E', ink: '282C26', muted: '5A6156', gold: 'C9A05A', goldLight: 'F1E2BF', goldInk: '7A5A1E', terra: '97462F',
  terraLight: 'F6E3DA', cream: 'FFFDF8', bonus: 'F4ECDA', bonusCard: 'FFFBF2', sage: 'B9C8B5', onDark: 'D7E0D3' };
// Scratch 3 category colours (scratch-blocks colours) used for small swatches only
const CAT = { motion: '4C97FF', looks: '9966FF', events: 'FFBF00', control: 'FFAB19', sensing: '5CB1D6', operators: '59C059', variables: 'FF8C1A' };
const SERIF = 'Literata', SANS = 'Figtree';

const STEP_TOTAL = 25;
const isDark = (t) => ['cover', 'chapter', 'finish'].includes(t);

function blockInfo(i) {
  const man = JSON.parse(fs.readFileSync(path.join(BLOCKS, 'manifest.json'), 'utf8'));
  return man['s' + String(i + 1).padStart(2, '0')];
}
function shotPath(name) {
  const p = path.join(SHOTS, name + '@2x.png');
  return fs.existsSync(p) ? p : A('scene_kickoff.png');
}

function build() {
  return SLIDES.map((s, i) => {
    const E = []; const notes = [];
    const R = (x, y, w, h, fill, o = {}) => E.push({ k: 'rect', x, y, w, h, fill, ...o });
    const T = (x, y, w, h, runs, o = {}) => E.push({ k: 'text', x, y, w, h, runs: typeof runs === 'string' ? [{ t: runs }] : runs, ...o });
    const I = (x, y, w, h, src, o = {}) => E.push({ k: 'img', x, y, w, h, src, ...o });
    const L = (x, y, w, h, color, lw = 1) => E.push({ k: 'line', x, y, w, h, color, lw });
    const bonus = s.type === 'bonus';
    const bg = isDark(s.type) ? C.forest : bonus ? C.bonus : C.paper;

    // ---------- shared chrome ----------
    const footer = () => {
      // progress lives top-right (no footer) so code gets the full slide height
      const dark = isDark(s.type);
      const col = dark ? '9DB5A4' : C.muted;
      let right = `${i + 1} / ${SLIDES.length}`;
      if (s.step && /^\d/.test(s.step)) right = `Step ${+s.step} of ${STEP_TOTAL}   ·   ${right}`;
      else if (s.step) right = `Bonus ${s.step}   ·   ${right}`;
      if (dark) right = `${i + 1} / ${SLIDES.length}`;
      T(W - MX - 5.2, dark ? 0.66 : 0.5, 5.2, 0.26, [{ t: dark ? '' : 'Soccer Striker   ·   ' }, { t: right }], { sz: 12, color: col, align: 'right', ls: 14 });
    };
    const chip = (x, y, text, fill, color, o = {}) => {
      const w = o.w || (0.42 + text.length * 0.128 + (o.icon ? 0.4 : 0));
      R(x, y, w, 0.38, fill, { r: 0.19, line: o.line });
      if (o.icon) I(x + 0.14, y + 0.03, 0.32 * (o.iconAR || 1), 0.32, o.icon);
      T(x + (o.icon ? 0.4 : 0), y + 0.085, w - (o.icon ? 0.4 : 0), 0.22, text, { sz: 12.5, b: true, color, cs: 1.2, align: 'center', ls: 15 });
      return x + w + 0.14;
    };
    const spriteIcon = (name) => name && name !== 'Stage' ? A(`sprite_${name}.png`) : null;
    const spriteAR = (name) => ({ Ball: 1, Goal: 44 / 170, Player: 100 / 120, Player2: 100 / 120, Goalie: 100 / 120 })[name] || 1;
    const title = (y, text, sz = 38) => T(MX, y, W - 2 * MX, 0.75, text, { f: SERIF, sz, color: C.ink, ls: sz * 1.12, valign: 'top', role: 'title' });

    // ---------- slide types ----------
    if (s.type === 'cover') {
      T(MX, 0.6, 7, 0.4, [{ t: 'KeenKids', f: SERIF, b: true, sz: 17, c: C.cream }, { t: '    SCRATCH CODING CLUB', sz: 12, b: true, c: C.gold, cs: 2 }], { ls: 22 });
      T(MX, 1.85, 6.5, 1.25, s.title, { f: SERIF, sz: 60, color: C.cream, ls: 66, role: 'title' });
      T(MX, 3.15, 6.3, 1.0, s.sub, { sz: 28, color: C.onDark, ls: 34 });
      L(MX, 4.55, 1.1, 0, C.gold, 2.5);
      T(MX, 4.8, 6, 0.9, [{ t: 'Grades 3–4', b: true }, { t: '   ·   25 steps   ·   4 bonus challenges' }], { sz: 18, color: C.goldLight });
      I(7.55, 1.35, 5.08, 3.81, A('cover_arch.png'), { alt: 'Soccer Striker stage: Player, Ball, Goalie and Goal at their starting positions' });
      T(7.55, 5.35, 5.08, 0.3, 'The real game you will build today', { sz: 13, i: true, color: '9DB5A4', align: 'center' });
    }
    else if (s.type === 'mission') {
      chip(MX, 0.42, "TODAY’S MISSION", C.forest, C.cream);
      title(1.0, s.title, 44);
      T(MX, 1.92, 7, 0.6, s.sub, { f: SERIF, i: true, sz: 28, color: C.goldInk });
      const rowY = [2.85, 4.05, 5.25];
      s.items.forEach(([icon, text], k) => {
        const y = rowY[k];
        R(MX, y, 7.85, 1.0, C.card, { line: C.border, r: 0.08 });
        // keycap icons (editable shapes)
        const cap = (x, yy, w, label) => { R(x, yy, w, 0.5, 'FFFFFF', { line: 'B8B0A0', lw: 1.25, r: 0.08 }); T(x, yy + 0.08, w, 0.34, label, { sz: label.length > 2 ? 12 : 17, b: true, color: C.ink, align: 'center', ls: 20 }); };
        if (icon === 'keys') ['←', '↑', '↓', '→'].forEach((k, n) => cap(0.98 + n * 0.42, y + 0.25, 0.38, k));
        if (icon === 'space') cap(1.0, y + 0.25, 1.62, 'SPACE');
        if (icon === 'clock') { R(1.0, y + 0.25, 1.62, 0.5, 'E6F0FF', { line: 'C1CCDD', r: 0.08 }); T(1.08, y + 0.33, 0.8, 0.34, 'Time', { sz: 15, b: true, color: '575E75', ls: 18 }); R(1.78, y + 0.31, 0.72, 0.38, CAT.variables, { r: 0.12 }); T(1.78, y + 0.355, 0.72, 0.3, '60', { sz: 15, b: true, color: 'FFFFFF', align: 'center', ls: 18 }); }
        T(2.95, y + 0.29, 5.45, 0.45, text, { sz: 24, color: C.ink, b: true, role: 'body' });
      });
      R(8.85, 2.85, 3.78, 3.4, C.card, { line: C.border, r: 0.08 });
      I(9.0, 3.25, 3.48, 2.61, A('scene_kickoff.png'), { alt: 'The finished Soccer Striker field at kickoff' });
      T(9.0, 5.9, 3.48, 0.25, 'Player · Ball · Goalie · Goal', { sz: 12, color: C.muted, align: 'center' });
    }
    else if (s.type === 'chapter') {
      T(MX, 0.6, 7, 0.4, [{ t: 'KeenKids', f: SERIF, b: true, sz: 17, c: C.cream }, { t: '    SCRATCH CODING CLUB', sz: 12, b: true, c: C.gold, cs: 2 }], { ls: 22 });
      T(MX, 1.7, 4, 0.3, 'CHAPTER', { sz: 15, b: true, color: C.gold, cs: 3 });
      T(MX - 0.05, 2.05, 3.4, 1.9, s.n, { f: SERIF, sz: 120, color: C.gold, ls: 130 });
      T(MX, 4.05, 7.55, 1.4, s.title, { f: SERIF, sz: 48, color: C.cream, ls: 54, role: 'title' });
      T(MX, 5.42, 7.3, 0.6, s.sub, { sz: 26, color: C.onDark });
      // art: cream disc with real sprite art / Scratch-style monitor
      E.push({ k: 'ellipse', x: 8.35, y: 1.25, w: 4.4, h: 4.4, fill: '2E5545' });
      E.push({ k: 'ellipse', x: 8.65, y: 1.55, w: 3.8, h: 3.8, fill: 'F2EEDF' });
      const cx = 10.55, cy = 3.45;
      if (s.art === 'pitch') I(cx - 1.55, cy - 1.16, 3.1, 2.325, A('pitch.png'), { alt: 'Green pitch backdrop' });
      else if (['Player', 'Ball', 'Goalie'].includes(s.art)) { const h = s.art === 'Ball' ? 2.0 : 2.6; I(cx - h * spriteAR(s.art) / 2, cy - h / 2, h * spriteAR(s.art), h, A(`sprite_${s.art}.png`), { alt: s.art + ' sprite' }); }
      else if (s.art === 'Goal') { I(cx - 0.35, cy - 1.35, 2.7 * 44 / 170, 2.7, A('sprite_Goal.png'), { alt: 'Goal sprite' }); I(cx - 1.2, cy + 0.35, 0.7, 0.7, A('sprite_Ball.png'), { alt: 'Ball sprite' }); }
      else if (s.art === 'score' || s.art === 'clock') {
        const [lab, val] = s.art === 'score' ? ['Score', '3'] : ['Time', '60'];
        R(cx - 1.4, cy - 0.45, 2.8, 0.9, 'E6F0FF', { line: 'C1CCDD', r: 0.12, lw: 1.5 });
        T(cx - 1.25, cy - 0.24, 1.3, 0.5, lab, { sz: 28, b: true, color: '575E75' });
        R(cx + 0.1, cy - 0.31, 1.15, 0.62, CAT.variables, { r: 0.2 });
        T(cx + 0.1, cy - 0.22, 1.15, 0.45, val, { sz: 28, b: true, color: 'FFFFFF', align: 'center' });
      }
      else if (s.art === 'bonus') { I(cx - 1.25, cy - 1.05, 1.75, 2.1, A('sprite_Player.png'), { alt: 'Player' }); I(cx - 0.15, cy - 1.05, 1.75, 2.1, A('sprite_Player2.png'), { alt: 'Player 2', flipH: true }); }
    }
    else if (s.type === 'setup') {
      chip(MX, 0.42, `STEP ${s.step}  ·  SETUP`, C.forest, C.cream);
      title(0.97, s.title);
      T(MX, 2.05, 5.9, 1.6, s.action, { sz: 31, b: true, color: C.forest, ls: 38, role: 'body' });
      R(MX, 4.05, 5.9, 1.25, C.card, { line: C.border, r: 0.08 });
      R(MX, 4.05, 0.09, 1.25, C.gold, {});
      T(MX + 0.35, 4.22, 5.35, 0.95, s.tip, { sz: 24, color: C.ink, ls: 30, role: 'body' });
      if (s.sprite && s.sprite !== 'Stage') chip(MX, 5.6, `${s.sprite.toUpperCase()} SPRITE`, C.accent, C.forest, { icon: spriteIcon(s.sprite), iconAR: spriteAR(s.sprite) });
      if (s.sprite === 'Stage') chip(MX, 5.6, 'STAGE', C.accent, C.forest);
      visual(s, E, R, T, I, L);
    }
    else if (s.type === 'lesson' || s.type === 'bonus') {
      let nx = chip(MX, 0.42, bonus ? `BONUS ${s.step}` : `STEP ${s.step}`, bonus ? C.gold : C.forest, bonus ? C.deep : C.cream);
      if (s.switchTo) nx = chip(nx, 0.42, `SWITCH TO ${s.sprite.toUpperCase()}`, C.goldLight, C.goldInk, { icon: spriteIcon(s.sprite), iconAR: spriteAR(s.sprite), line: C.gold });
      title(0.97, s.title);
      const bi = blockInfo(i);
      const px2in = (px, sc) => px * sc / 96;
      const CAP = 2.6;
      // candidate layouts
      const side = { cx: MX, cy: 1.75, cw: 8.42, ch: 5.3 };
      const stack = { cx: MX, cy: 2.78, cw: W - 2 * MX, ch: 4.27 };
      const hintH = s.hint ? 1.2 : 0;
      const fit = (L0, extraH = 0) => Math.min(CAP, (L0.cw - 0.6) * 96 / bi.w, (L0.ch - 1.0 - 0.2 - extraH) * 96 / bi.h);
      const sSide = fit(side), sStack = fit(stack, hintH);
      const useStack = sStack > sSide * 1.08;
      const Lo = useStack ? stack : side;
      const sc = useStack ? sStack : sSide;
      const cardFill = bonus ? C.bonusCard : C.cream;
      R(Lo.cx, Lo.cy, Lo.cw, Lo.ch, cardFill, { line: C.border, r: 0.08 });
      // breadcrumb: which sprite + where the blocks go
      const icon = spriteIcon(s.sprite);
      let bx = Lo.cx + 0.3;
      if (icon) { I(bx, Lo.cy + 0.2, 0.42 * spriteAR(s.sprite), 0.42, icon, { alt: s.sprite }); bx += 0.42 * spriteAR(s.sprite) + 0.14; }
      T(bx, Lo.cy + 0.27, Lo.cw - (bx - Lo.cx) - 0.3, 0.3, [{ t: `${s.sprite.toUpperCase()} SPRITE`, b: true, c: C.forest, cs: 1.2 }, { t: '   ›   ', c: C.gold, b: true }, { t: s.where, c: C.muted }], { sz: 16, role: 'meta' });
      L(Lo.cx + 0.3, Lo.cy + 0.78, Lo.cw - 0.6, 0, C.border, 0.75);
      const bw = px2in(bi.w, sc), bh = px2in(bi.h, sc);
      I(Lo.cx + 0.3, Lo.cy + 1.0, bw, bh, path.join(BLOCKS, `s${String(i + 1).padStart(2, '0')}.png`), { alt: 'Scratch blocks: ' + s.code.replace(/\n/g, ' / '), role: 'code', scale: sc });
      const fontPt = 12 * sc; // scratchblocks scratch3 label text is 12pt (16px) at scale 1
      if (useStack) {
        T(MX, 1.74, W - 2 * MX, 0.95, s.what, { sz: 28, b: true, color: C.forest, ls: 34, role: 'body' });
        if (s.hint) hintBox(Lo.cx + 0.3, Lo.cy + Lo.ch - 0.25 - 1.0, Lo.cw - 0.6, 1.0, s.hint);
      } else {
        const px = side.cx + side.cw + 0.3, pw = W - MX - px;
        T(px, 1.85, pw, 0.3, 'WHAT IT DOES', { sz: 13, b: true, color: bonus ? C.goldInk : C.muted, cs: 2 });
        L(px, 2.25, pw, 0, bonus ? C.gold : C.sage, 1.5);
        T(px, 2.45, pw, 2.75, s.what, { sz: 27, b: true, color: C.forest, ls: 33, role: 'body' });
        if (s.hint) { const lines = Math.ceil((s.hint.length + 5) / 20); const hh = 0.42 + lines * 0.335; hintBox(px, 7.05 - hh, pw, hh, s.hint); }
      }
      function hintBox(x, y, w, h, text) {
        R(x, y, w, h, bonus ? 'FFF4DC' : C.goldLight, { r: 0.08 });
        T(x + 0.22, y + 0.15, w - 0.4, h - 0.25, [{ t: 'Tip  ', b: true, c: C.goldInk }, { t: text, c: C.ink }], { sz: 19, ls: 24, role: 'body' });
      }
      E.meta = { scale: sc, fontPt, layout: useStack ? 'stacked' : 'side' };
    }
    else if (s.type === 'check') {
      chip(MX, 0.42, 'CHECKPOINT', C.terra, C.cream);
      title(0.97, s.title);
      T(MX, 1.92, 6.4, 1.0, s.q, { f: SERIF, sz: 30, color: C.forest, ls: 36, role: 'body' });
      T(MX, 3.05, 3, 0.3, 'TRY IT', { sz: 13, b: true, color: C.muted, cs: 2 });
      s.tries.forEach((t, k) => {
        const y = 3.45 + k * 0.62;
        R(MX, y + 0.05, 0.36, 0.36, 'FFFFFF', { line: C.forest, lw: 1.75, r: 0.06 });
        T(MX + 0.58, y, 5.9, 0.5, t, { sz: 25, color: C.ink, role: 'body' });
      });
      R(MX, 5.45, 6.4, 1.35, C.terraLight, { r: 0.08 });
      T(MX + 0.25, 5.6, 6.0, 1.1, [{ t: 'Bug fix  ', b: true, c: C.terra }, { t: s.bug, c: C.ink }], { sz: 21, ls: 27, role: 'body' });
      R(7.45, 1.9, 5.18, 4.1, C.card, { line: C.border, r: 0.08 });
      I(7.6, 2.05, 4.88, 3.66, shotPath(s.shot), { alt: 'Soccer Striker gameplay', role: 'shot' });
      T(7.6, 6.08, 4.88, 0.3, captionFor(s.shot), { sz: 13, i: true, color: C.muted, align: 'center' });
    }
    else if (s.type === 'finish') {
      T(MX, 0.6, 7, 0.4, [{ t: 'KeenKids', f: SERIF, b: true, sz: 17, c: C.cream }, { t: '    SCRATCH CODING CLUB', sz: 12, b: true, c: C.gold, cs: 2 }], { ls: 22 });
      T(MX, 1.55, 6, 0.35, 'FULL TIME!', { sz: 17, b: true, color: C.gold, cs: 3 });
      T(MX, 2.0, 7.75, 1.0, s.title, { f: SERIF, sz: 50, color: C.cream, ls: 56, role: 'title' });
      T(MX, 3.15, 7.4, 0.6, s.sub, { sz: 27, color: C.onDark });
      s.items.forEach((t, k) => {
        const y = 4.15 + k * 0.85;
        R(MX, y, 7.2, 0.68, '2E5545', { r: 0.08 });
        T(MX + 0.25, y + 0.15, 0.5, 0.4, String(k + 1), { f: SERIF, sz: 22, b: true, color: C.gold });
        T(MX + 0.75, y + 0.16, 6.3, 0.4, t, { sz: 22, color: C.cream, b: true });
      });
      E.push({ k: 'ellipse', x: 8.6, y: 1.45, w: 4.1, h: 4.1, fill: '2E5545' });
      I(9.05, 2.25, 1.75, 2.1, A('sprite_Player.png'), { alt: 'Player' });
      I(10.55, 3.6, 0.75, 0.75, A('sprite_Ball.png'), { alt: 'Ball' });
      I(11.45, 2.3, 2.1 * 44 / 170 * 1.1, 2.3, A('sprite_Goal.png'), { alt: 'Goal' });
    }
    footer();
    return { i, s, bg, E, meta: E.meta || {} };
  });
}

function captionFor(shot) {
  return ({ start: 'Kickoff: every sprite in its starting spot', dribble: 'Dribbling: the Ball rolls ahead of the Player',
    kick: 'A kick in flight toward the Goal', goal: 'GOAL! Score goes up by 1', saved: 'Saved! The Goalie blocks the shot',
    fulltime: 'FULL TIME!' })[shot] || '';
}

// Setup-slide visuals: real sprite art plus simple, editable mock-ups of the Scratch 3 UI piece the step uses.
function visual(s, E, R, T, I, L) {
  const X = 7.15, Y = 1.9, VW = 5.48, VH = 4.9;
  R(X, Y, VW, VH, C.card, { line: C.border, r: 0.08 });
  if (s.visual === 'pitch') {
    I(X + 0.25, Y + 0.25, VW - 0.5, (VW - 0.5) * 0.75, A('pitch.png'), { alt: 'Painted soccer pitch backdrop' });
    T(X + 0.25, Y + 0.4 + (VW - 0.5) * 0.75, VW - 0.5, 0.4, [{ t: 'Stage', b: true }, { t: '  480 × 360 steps  ·  middle is x: 0, y: 0' }], { sz: 15, color: C.muted, align: 'center' });
  }
  if (s.visual === 'deleteCat') {
    T(X + 0.3, Y + 0.25, 4, 0.3, 'SPRITE LIST', { sz: 12, b: true, color: C.muted, cs: 2 });
    // sprite tile (selected) — Scratch 3 style: blue outline
    R(X + 0.4, Y + 0.75, 1.55, 1.7, 'FFFFFF', { line: '4C97FF', lw: 2.5, r: 0.1 });
    E.push({ k: 'ellipse', x: X + 0.82, y: Y + 0.95, w: 0.72, h: 0.72, fill: 'F4B868' });
    T(X + 0.4, Y + 1.88, 1.55, 0.35, 'Sprite1', { sz: 15, b: true, color: '575E75', align: 'center' });
    T(X + 0.4, Y + 2.55, 1.55, 0.3, '(the Cat)', { sz: 13, i: true, color: C.muted, align: 'center' });
    // context menu
    const mx = X + 2.35, my = Y + 1.05;
    R(mx, my, 2.6, 1.95, 'FFFFFF', { line: 'C1CCDD', lw: 1.25, r: 0.06 });
    ['duplicate', 'export', 'delete'].forEach((t, k) => {
      if (t === 'delete') R(mx + 0.06, my + 0.12 + k * 0.6, 2.48, 0.52, C.goldLight, { line: C.gold, lw: 2, r: 0.06 });
      T(mx + 0.3, my + 0.22 + k * 0.6, 2.1, 0.36, t, { sz: 21, b: t === 'delete', color: t === 'delete' ? C.terra : '575E75' });
    });
    T(X + 0.3, Y + 3.45, VW - 0.6, 1.2, 'On a tablet? Press and hold the Cat instead of right-clicking.', { sz: 20, color: C.ink, ls: 26 });
  }
  if (s.visual === 'nameField') {
    // sprite art on a small stage tile
    R(X + 0.3, Y + 0.3, 2.1, 2.6, '3D9E46', { r: 0.08 });
    const ar = ({ Ball: 1, Goal: 44 / 170 })[s.sprite] || 100 / 120;
    const h = s.sprite === 'Ball' ? 1.3 : s.sprite === 'Goal' ? 2.2 : 2.1;
    I(X + 1.35 - h * ar / 2, Y + 1.6 - h / 2, h * ar, h, A(`sprite_${s.sprite}.png`), { alt: s.sprite + ' sprite art from the project' });
    T(X + 2.65, Y + 0.35, 2.6, 0.3, 'SPRITE INFO', { sz: 12, b: true, color: C.muted, cs: 2 });
    const fields = [['Sprite', s.nameValue, true]];
    if (s.xValue) fields.push(['x', s.xValue], ['y', s.yValue]);
    if (s.sizeValue) fields.push(['Size', s.sizeValue]);
    fields.forEach(([lab, val, hi], k) => {
      const y = Y + 0.8 + k * 0.62;
      T(X + 2.65, y + 0.1, 0.8, 0.35, lab, { sz: 16, color: '575E75', b: true });
      R(X + 3.45, y, 1.75, 0.5, 'FFFFFF', { line: hi ? C.gold : 'C1CCDD', lw: hi ? 2.5 : 1.25, r: 0.25 });
      T(X + 3.6, y + 0.09, 1.5, 0.35, val, { sz: 18, color: '575E75', b: hi });
    });
    T(X + 0.3, Y + 3.2, VW - 0.6, 1.4, ({ Player: 'The name box is under the Stage. Type Player: capital P, no spaces.',
      Ball: 'Type Ball in the name box. Type 45 in the Size box.', Goal: 'Name it Goal. Type 222 in x and 0 in y.',
      Goalie: 'Name it Goalie. The x, y and Size boxes match the code you will write.' })[s.sprite], { sz: 20, color: C.ink, ls: 26 });
  }
  if (s.visual === 'newVar') {
    // Scratch 3 "New Variable" prompt (simplified, editable)
    const dx = X + 0.3, dy = Y + 0.3, dw = VW - 0.6;
    R(dx, dy, dw, 3.05, 'FFFFFF', { line: 'C1CCDD', lw: 1.25, r: 0.1 });
    R(dx, dy, dw, 0.6, '855CD6', { r: 0.1 });
    R(dx, dy + 0.4, dw, 0.2, '855CD6', {});
    T(dx, dy + 0.14, dw, 0.35, 'New Variable', { sz: 17, b: true, color: 'FFFFFF', align: 'center' });
    R(dx + 0.3, dy + 0.85, dw - 0.6, 0.55, 'FFFFFF', { line: C.gold, lw: 2.5, r: 0.12 });
    T(dx + 0.48, dy + 0.95, dw - 1, 0.38, s.varName, { sz: 19, b: true, color: '575E75' });
    E.push({ k: 'ellipse', x: dx + 0.32, y: dy + 1.65, w: 0.28, h: 0.28, fill: '855CD6' });
    T(dx + 0.7, dy + 1.62, 2.2, 0.34, 'For all sprites', { sz: 16, b: true, color: '575E75' });
    E.push({ k: 'ellipse', x: dx + 0.32, y: dy + 2.1, w: 0.28, h: 0.28, fill: 'FFFFFF', line: 'C1CCDD' });
    T(dx + 0.7, dy + 2.07, 3, 0.34, 'For this sprite only', { sz: 16, color: '575E75' });
    R(dx + dw - 2.2, dy + 2.48, 0.95, 0.42, 'FFFFFF', { line: 'C1CCDD', r: 0.2 });
    T(dx + dw - 2.2, dy + 2.55, 0.95, 0.3, 'Cancel', { sz: 14, b: true, color: '575E75', align: 'center' });
    R(dx + dw - 1.15, dy + 2.48, 0.85, 0.42, '855CD6', { r: 0.2 });
    T(dx + dw - 1.15, dy + 2.55, 0.85, 0.3, 'OK', { sz: 14, b: true, color: 'FFFFFF', align: 'center' });
    // the monitor that appears on the Stage
    T(dx, Y + 3.6, 2.5, 0.3, 'ON THE STAGE', { sz: 12, b: true, color: C.muted, cs: 2 });
    const [lab, val] = s.monitor;
    R(dx, Y + 3.98, 2.3, 0.62, 'E6F0FF', { line: 'C1CCDD', r: 0.1 });
    T(dx + 0.14, Y + 4.1, 1.2, 0.4, lab, { sz: 19, b: true, color: '575E75' });
    R(dx + 1.3, Y + 4.06, 0.85, 0.46, CAT.variables, { r: 0.16 });
    T(dx + 1.3, Y + 4.12, 0.85, 0.36, val, { sz: 19, b: true, color: 'FFFFFF', align: 'center' });
  }
}

module.exports = { build, W, H, C, SLIDES };
