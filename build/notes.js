// Speaker-notes text for one slide (used in the PPTX notes and the teacher guide).
const plainCode = (code) => code.split('\n').filter((l) => l !== 'end')
  .map((l) => l.replace(/\(([^()]*?) v\)/g, '[$1]').replace(/\[([^\]]*?) v\]/g, '[$1]').replace(/[()]/g, '').replace(/\s+/g, ' ').trim())
  .join('  →  ');

module.exports = function notesFor(s, i) {
  const L = [];
  if (s.sprite && s.code) L.push(`SPRITE: ${s.sprite}${s.switchTo ? ' (switch sprites now!)' : ''}. WHERE: ${s.where}.`);
  if (s.code) L.push(`BLOCKS: ${plainCode(s.code)}`);
  if (s.say) L.push(`SAY: ${s.say}`);
  if (s.do) L.push(`DO: ${s.do}`);
  if (s.fix) L.push(`WATCH FOR: ${s.fix}`);
  if (s.change) L.push(`TEACHER NOTE (differs from baseline/original): ${s.change}`);
  return L.join('\n\n');
};
module.exports.plainCode = plainCode;
