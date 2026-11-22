// Generates Teacher_Guide_FINAL.md from content.js (same source as slides and speaker notes).
const fs = require('fs'), path = require('path');
const S = require('./content.js');
const { plainCode } = require('./notes.js');
const out = path.resolve(process.argv[2] || path.join(__dirname, 'render', 'Teacher_Guide_FINAL.md'));

const L = [];
L.push('# Soccer Striker! Teacher Guide (FINAL)', '');
L.push('KeenKids Scratch Coding Club · Grades 3–4 · 67 slides · 25 steps + 4 bonus challenges', '');
L.push('Every coding slide shows 1–3 new Scratch 3 blocks, the sprite they belong to and exactly where they go. The slide notes in the PowerPoint contain the same script as this guide.', '');

L.push('## Before class', '');
L.push('- Test the room: open scratch.mit.edu on one student device and check that the arrow keys and Space reach the Scratch Stage (click the Stage once first).');
L.push('- Keep `KeenKids_Soccer_Striker_Teacher_Reference.sb3` open on your machine. It is the finished base game the slides teach (File › Load from your computer).');
L.push('- Do **not** hand out `Soccer_Striker!.sb3` as the answer key. It has the dribble bug described below.');
L.push('- Fonts: the slides use Literata and Figtree (free Google Fonts, included in `fonts/`). Install them before presenting the .pptx, or PowerPoint will substitute other fonts. The PDF already has them embedded.');
L.push('- Suggested pacing (not tested with a class): Chapters 1–3 in session 1 (about 45 min), Chapters 4–7 in session 2 (about 50 min), and bonus challenges as extension time.', '');

L.push('## Big ideas to say out loud', '');
L.push('- **Sprites have their own scripts.** Check the sprite chip on every slide. A gold **SWITCH TO …** chip means click a different sprite first.');
L.push('- **Inside vs. under.** The grey line at the top of each code card says exactly where the blocks go.');
L.push('- **Scratch directions:** 0 = up, 90 = right, 180 = down, -90 = left.');
L.push('- **Test after every feature.** Checkpoint slides come after movement, dribbling, kicking, scoring and the full game.', '');

L.push('## Help at three levels', '');
L.push('| Student needs | Try this |');
L.push('|---|---|');
L.push('| More support | Pair programming: one “driver” on the mouse, one “navigator” reading the slide. Point to the sprite chip, then the breadcrumb, then the blocks. For the four arrow keys, build the first if together, then have students right-click › duplicate and change only the key and the number. |');
L.push('| On track | Ask a prediction before running: “What will happen if you press ← now?” |');
L.push('| Early finishers | Bonus challenges C1–C4 (slides 54–66). C1 and C3 are the easiest; C2 is the biggest. Or: change the Goalie’s speed (glide seconds) and size, and explain how each change affects difficulty. |');
L.push('');

L.push('## Fix-it table (most common bugs)', '');
L.push('| What students see | Likely cause | Fix |');
L.push('|---|---|---|');
L.push('| Arrow keys do nothing | Code is on the wrong sprite, or the ifs are not inside forever | Select Player; drag the ifs into forever |');
L.push('| One arrow only works while holding another | An if is nested inside another if | Drag it out and snap it below |');
L.push('| Ball zooms away whenever it is touched | A `repeat 16` ended up inside the dribble if (this is the bug in the original project) | Only `point in direction (direction of Player)` and `move 6 steps` belong there |');
L.push('| Ball turns the wrong way | The Ball’s own blue `direction` reporter was used | Use Sensing `(direction) of (Player)`; change Stage › Player first |');
L.push('| Space never kicks while standing next to the Ball | Normal. The dribble code pushed the Ball 6 steps away first (tested) | Press Space while still walking into the Ball |');
L.push('| Space (or F) never kicks, even while walking into the Ball | The Player is drawn in front of the Ball. Dragging a sprite on the Stage, or duplicating Player into Player2, puts that sprite in front. Tested: 0 of 12 kicks | Drag the Ball a little on the Stage (a quick click is not enough), then click the green flag again. Tested: 10 of 12 kicks |');
L.push('| A good kick sometimes does nothing | When the sprites only just touch, about 1 kick in 6 misses (tested) | Normal. Try again while walking into the Ball |');
L.push('| Score jumps by more than 1 | The Ball does not reset inside the Goal if | `go to x: 0 y: 0` must be inside `if touching Goal` |');
L.push('| Player does not reset after a goal | Message names differ | `broadcast ResetPlayer` and `when I receive ResetPlayer` must match exactly |');
L.push('| Clock never moves | Timer blocks are under the forever loop | Make the timer its own green flag script |');
L.push('| “Golden Goal” game ends on the first goal | `set GoldenGoal to 0` is missing (tested) | Add it at the top of the clock script |');
L.push('');

L.push('## Tested behavior worth knowing', '');
L.push('These come from running the Teacher Reference project in the real Scratch 3 engine (scratch-vm + scratch-render, 30 fps). Details: `QA_REPORT.md`.', '');
L.push('- A kick covers about 252 steps (60 + 16 × 12), so students must dribble past the middle line before shooting.');
L.push('- If the Ball touches the Goal and the Goalie at the same moment, it counts as a **goal** (the Goal if runs first).');
L.push('- On a save, the rest of the kick can carry the Ball into the net while “Saved!” is showing. No goal is counted.');
L.push('- The “60-second” clock really lasts about 63 seconds (each tick is about 1.06 s).');
L.push('- On a slow computer, a kick can still be moving for a moment after the Ball resets to the middle. Rare; a fresh kick fixes it.', '');
L.push('## Differences from the original project (`Soccer_Striker!.sb3`)', '');
L.push('The original file is preserved unchanged. The lesson and the Teacher Reference project differ from it here:', '');
L.push('| Where | Original | Lesson / Teacher Reference |');
L.push('|---|---|---|');
L.push('| Ball dribble `if touching Player` | Also contains `repeat 16 { move 12, wait 0.03 }`. Tested: the Ball shoots 198 steps every touch | Removed: only `point in direction (direction of Player)` + `move 6 steps` |');
L.push('| Win message | `say You won for 2 seconds` | `say GOAL! YOU WIN! for 2 seconds` |');
L.push('| Save message | `say Saved! for 3 seconds` | `say Saved! for 1 seconds` |');
L.push('| Goalie patrol | `glide 2 secs` to y: 50 / y: -50 | `glide 2.5 secs` to y: 80 / y: -80 |');
L.push('| Full-time message | `FULL TIME! 🏁` | Slides say `FULL TIME!`; the reference keeps the 🏁. Either is fine |');
L.push('| Player scripts | Setup and forever loop are two separate green-flag scripts | Slides use one script (setup, then forever). Both behave the same |');
L.push('');

L.push('## Changes to the lesson plan (marked in slide notes)', '');
L.push('- **C1 Speed Boots uses Z, not Shift.** Scratch 3’s `key pressed?` menu has no Shift option (checked in the scratch-blocks source: space, arrows, any, a–z, 0–9).');
L.push('- **C2 dribble uses a second if, not OR.** With `touching Player or touching Player2` plus `direction of Player`, the Ball follows Player 1’s direction even when Player 2 dribbles (tested). The slide now teaches a separate `if touching Player2` branch with `direction of Player2`.');
L.push('- **C4 shows the reset to 0 as a block.** Without `set GoldenGoal to 0`, the next match ends at the first goal (tested). `set GoldenGoal to 1` moved to the following slide with `say GOLDEN GOAL!`.');
L.push('- **Slide 21 wording:** the Sensing block starts as `backdrop # of Stage` in Scratch 3 (not `x position of Stage`).');
L.push('- **Kicking tip added:** kick while walking into the Ball (tested behavior).', '');

L.push('## Two-player and overtime: what these extensions really are', '');
L.push('- **C2 is a team game.** One Score and one Goal means both players add to the same score. A real match between two players needs a second Goal on the left and two score variables (for example Score1 and Score2). That is a larger project.');
L.push('- **C4 is single-player overtime, not a tie-breaker.** With one Score there is no tie. If time runs out before 3 goals, the next goal wins. A true two-player golden goal needs two scores and two goals.', '');

L.push('## Slide-by-slide script', '');
let chapter = '';
S.forEach((s, i) => {
  if (s.type === 'chapter') { chapter = `Chapter ${s.n}: ${s.title}`; L.push(`### ${chapter}`, ''); }
  const tag = s.step ? (/^\d/.test(s.step) ? `Step ${s.step}` : `Bonus ${s.step}`) : s.type === 'check' ? 'Checkpoint' : '';
  L.push(`**Slide ${i + 1}: ${s.title}**${tag ? ` · ${tag}` : ''}`, '');
  if (s.code) L.push(`- Sprite: **${s.sprite}**${s.switchTo ? ' (switch sprites!)' : ''} · Where: ${s.where}`, `- Blocks: \`${plainCode(s.code)}\``);
  if (s.say) L.push(`- Say: “${s.say}”`);
  if (s.do) L.push(`- Do: ${s.do}`);
  if (s.fix) L.push(`- Watch for: ${s.fix}`);
  if (s.change) L.push(`- ⚑ Teacher note: ${s.change}`);
  L.push('');
});
fs.writeFileSync(out, L.join('\n'));
console.log('wrote', out);
