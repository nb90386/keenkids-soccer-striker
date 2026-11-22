// Writes blocks.json (one scratchblocks script per coding slide) for render_blocks.js
const fs = require('fs');
const S = require('./content.js');
const out = [];
S.forEach((s, i) => { if (s.code) out.push({ id: 's' + String(i + 1).padStart(2, '0'), code: s.code }); });
fs.writeFileSync(__dirname + '/blocks.json', JSON.stringify(out, null, 1));
console.log('coding slides:', out.length);
