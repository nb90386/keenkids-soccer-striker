// Pretty-print scripts of a project.json as indented pseudo-blocks.
const fs=require('fs');const p=JSON.parse(fs.readFileSync(process.argv[2]));
function inp(b,blocks,name){const i=b.inputs[name];if(!i)return '';const v=i[1];
 if(Array.isArray(v)){return v[0]===12?`(var ${v[1]})`:v[0]===11?`[${v[1]}]`:`(${v[1]})`;}
 if(typeof v==='string'){const s=blocks[v];return s?expr(s,blocks):'';}return '';}
function expr(b,blocks){let s=b.opcode;const parts=[];for(const k in b.inputs){if(k.startsWith('SUBSTACK'))continue;parts.push(k+'='+inp(b,blocks,k));}
 for(const k in b.fields)parts.push(k+':'+b.fields[k][0]);return `<${s} ${parts.join(' ')}>`;}
function stack(id,blocks,ind){while(id){const b=blocks[id];console.log(' '.repeat(ind)+expr(b,blocks));
 for(const k of ['SUBSTACK','SUBSTACK2'])if(b.inputs[k]&&b.inputs[k][1]){console.log(' '.repeat(ind+2)+'{'+k);stack(b.inputs[k][1],blocks,ind+4);console.log(' '.repeat(ind+2)+'}');}
 id=b.next;}}
for(const t of p.targets){console.log(`=== ${t.name} x=${t.x} y=${t.y} dir=${t.direction} size=${t.size} vars=${JSON.stringify(t.variables)} bc=${JSON.stringify(t.broadcasts)} rot=${t.rotationStyle} costumes=${t.costumes.map(c=>c.name+':'+c.rotationCenterX+','+c.rotationCenterY).join('|')}`);
 for(const id in t.blocks){const b=t.blocks[id];if(b.topLevel)stack(id,t.blocks,2),console.log('');}}
