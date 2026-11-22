// KeenKids Soccer Striker — single source of truth for all 67 slides.
// Every coding slide: `code` is scratchblocks syntax (Scratch 3, English), `newBlocks` lists the
// 1–3 NEW blocks taught (QA checks the count and that each label appears in the rendered SVG).
// `sprite` = which sprite must be selected. `where` = placement. `what` = what the block(s) do.
// Teacher notes: say (script), do (classroom cue), fix (likely bug), change (documented change vs. baseline/original).

const S = []; const add = (o) => S.push(o);

add({ type: 'cover', title: 'Soccer Striker!', sub: 'Build your own soccer game in Scratch',
  say: 'Today you will build a real soccer game: a Player you control, a Ball you can dribble and kick, a Goal, a Goalie who blocks shots, a Score and a 60-second clock.',
  do: 'Open scratch.mit.edu and click Create to start a new, blank project. Students who are not logged in can still build; they save with File › Save to your computer.' });

add({ type: 'mission', title: 'Your mission today', sub: 'Move. Dribble. Shoot. Score.',
  items: [['keys', 'Arrow keys move your Player'], ['space', 'Space kicks the Ball at the goal'], ['clock', 'Score 3 goals in 60 seconds']],
  say: 'Before we code, predict: which Scratch tools do we need? Keys need sensing, repeating needs loops, the score needs a variable.',
  do: 'No code on this slide. Take 2–3 predictions, then move on.' });

add({ type: 'chapter', n: '01', title: 'Build your soccer field', sub: 'First, set the stage.', art: 'pitch',
  say: 'The Stage is the background of the game. Sprites are the characters and objects that move on it.' });

add({ type: 'setup', step: '01', title: 'Wave goodbye to the Cat', sprite: null, visual: 'deleteCat',
  action: 'Right-click the Cat sprite (Sprite1). Choose delete.', tip: 'We are building a soccer game, not a cat adventure.',
  say: 'Every new project starts with the Scratch Cat, named Sprite1. We need an empty field.',
  do: 'Students start from a blank project. If you open the finished reference project instead, do NOT delete its sprites.',
  fix: 'Deleted the wrong thing? Use Edit › Restore Sprite right away.' });

add({ type: 'setup', step: '02', title: 'Paint your pitch', sprite: 'Stage', visual: 'pitch',
  action: 'Hover over Choose a Backdrop. Click Paint. Fill it green.', tip: 'Add one white middle line and one big circle.',
  say: 'The Stage is 480 steps wide and 360 steps tall. The middle is x: 0, y: 0.',
  do: 'Use the Fill tool for green and a thick white line or circle tool for the markings. Keep the right edge clear: the Goal will be its own sprite.',
  fix: 'Do not paint the goal on the backdrop. Ball code can only “touch” a sprite.' });

add({ type: 'setup', step: '03', title: 'Choose your Player', sprite: 'Player', visual: 'nameField', nameValue: 'Player',
  action: 'Choose a Sprite, or paint your own.', tip: 'Rename it exactly Player.',
  say: 'Names matter in code. The Ball will look for a sprite called Player, spelled exactly like that.',
  do: 'Point to the Sprite name box under the Stage. Capital P, no spaces.',
  fix: 'A sprite named “player” or “Player1” will not appear the same way in the Ball’s menus. Rename it.' });

add({ type: 'lesson', step: '04', title: 'Start on the left', sprite: 'Player', where: 'Start a new script',
  code: 'when green flag clicked\ngo to x: (-170) y: (0)', newBlocks: ['when clicked', 'go to x: y:'],
  what: 'Click the green flag, and the Player jumps to the left side of the field.',
  say: 'The green flag is the game’s start button. Negative x means left of the middle.',
  do: 'Select Player. Drag “when green flag clicked” from Events. Snap the blue “go to x: y:” under it and type -170 and 0.' });

add({ type: 'lesson', step: '05', title: 'Face the goal', sprite: 'Player', where: 'Under go to x: -170 y: 0',
  code: 'point in direction (90)\nset size to (60) %', newBlocks: ['point in direction', 'set size to'],
  what: 'Direction 90 faces right, toward the goal. Size 60% helps the Player fit.',
  say: 'In Scratch, 90 means right. We shrink the Player so the field feels bigger.',
  do: 'Snap both blocks under “go to x: -170 y: 0”. Optional: add “set rotation style [left-right]” so the Player never turns upside down. The reference project includes it.' });

add({ type: 'lesson', step: '06', title: 'Keep checking!', sprite: 'Player', where: 'At the bottom of the script',
  code: 'forever\nend', newBlocks: ['forever'],
  what: 'Forever runs the blocks inside it again and again until the game stops.',
  say: 'A game has to keep checking the keys all the time. That is what forever is for.',
  do: 'Snap forever under the setup blocks. Every arrow-key “if” goes INSIDE this forever. Only one forever in this script.',
  change: 'The reference project keeps Player setup and the forever loop in two separate green-flag scripts. Either way works; the slides use one script because it is easier to follow.' });

add({ type: 'chapter', n: '02', title: 'Control your player', sub: 'Four directions, one keyboard.', art: 'Player',
  say: 'You already have a Player script with a forever loop. The next blocks all go inside that loop.' });

add({ type: 'lesson', step: '07', title: 'Right arrow → right', sprite: 'Player', where: 'Inside forever',
  code: 'if <key (right arrow v) pressed?> then\npoint in direction (90)\nmove (5) steps\nend', newBlocks: ['if then', 'key pressed?', 'point in direction', 'move steps'], newCount: 3,
  what: 'If the right arrow key is down, face right and take 5 steps.',
  say: 'An “if” asks a yes-or-no question. Only when the answer is yes do the blocks inside run.',
  do: 'Drag “if then” into forever. Drop the light-blue Sensing “key space pressed?” into the hexagon slot and pick right arrow. Put point in direction 90 and move 5 steps inside.',
  fix: 'Nothing happens? Make sure the code is on Player and the if is inside forever.' });

add({ type: 'lesson', step: '08', title: 'Left arrow → left', sprite: 'Player', where: 'Inside forever, under the first if',
  code: 'if <key (left arrow v) pressed?> then\npoint in direction (-90)\nmove (5) steps\nend', newBlocks: ['if then', 'key pressed?', 'point in direction', 'move steps'], newCount: 3,
  what: 'Direction -90 faces left. Move 5 steps that way.',
  say: 'Tip: right-click the first if and choose duplicate, then change the key and the direction.',
  do: 'The new if goes BELOW the right-arrow if, still inside forever. It must not go inside the first if.',
  fix: 'Left only works while holding right? The second if is inside the first one. Drag it out and below.' });

add({ type: 'lesson', step: '09', title: 'Up arrow → up', sprite: 'Player', where: 'Inside forever, under the left-arrow if',
  code: 'if <key (up arrow v) pressed?> then\npoint in direction (0)\nmove (5) steps\nend', newBlocks: ['if then', 'key pressed?', 'point in direction', 'move steps'], newCount: 3,
  what: 'Direction 0 points straight up.',
  say: 'Scratch directions: 0 is up, 90 is right, 180 is down, -90 is left.',
  do: 'Students can draw this compass on paper or a sticky note.' });

add({ type: 'lesson', step: '10', title: 'Down arrow → down', sprite: 'Player', where: 'Inside forever, under the up-arrow if',
  code: 'if <key (down arrow v) pressed?> then\npoint in direction (180)\nmove (5) steps\nend', newBlocks: ['if then', 'key pressed?', 'point in direction', 'move steps'], newCount: 3,
  what: 'Direction 180 points down. That makes four separate ifs.',
  say: 'Four keys, four separate ifs, all inside one forever.',
  do: 'Run the game and press each arrow to check the directions.' });

add({ type: 'lesson', step: '11', title: 'Stay on the field', sprite: 'Player', where: 'Inside forever, under all four ifs',
  code: 'if on edge, bounce', newBlocks: ['if on edge, bounce'],
  what: 'If the Player touches the edge of the Stage, it turns back onto the field.',
  say: 'Without this, the Player can walk right off the screen.',
  do: 'This block goes at the very bottom INSIDE forever, after the four arrow-key ifs.' });

add({ type: 'check', title: 'First play test', q: 'Can you move in all four directions?', shot: 'start',
  tries: ['Click the green flag', 'Press ↑ ↓ ← →', 'Walk into every edge'],
  bug: 'Stuck? Check that all four ifs are inside forever, on the Player.',
  say: 'One-minute test. Programmers test after every new feature.',
  do: 'Circulate. Most bugs here are an if nested inside another if, or code on the wrong sprite.' });

add({ type: 'chapter', n: '03', title: 'Make the ball move', sub: 'Now you can dribble.', art: 'Ball',
  say: 'Now we switch from the Player to the Ball. Each sprite has its own scripts.' });

add({ type: 'setup', step: '12', title: 'Add the soccer ball', sprite: 'Ball', visual: 'nameField', nameValue: 'Ball', sizeValue: '45',
  action: 'Choose the Soccer Ball sprite, or paint a circle.', tip: 'Rename it exactly Ball. Set Size to 45.',
  say: 'The Ball needs its own name too: Ball, with a capital B.',
  do: 'The Scratch library has a Soccer Ball sprite. Painting a simple circle works too.' });

add({ type: 'lesson', step: '13', title: 'Set up the Ball', sprite: 'Ball', switchTo: true, where: 'New script on the Ball',
  code: 'when green flag clicked\ngo to x: (-120) y: (0)\nforever\nend', newBlocks: ['when clicked', 'go to x: y:', 'forever'],
  what: 'Each game, the Ball starts just in front of the Player and keeps checking forever.',
  say: 'Click the Ball in the sprite list first. Its code area should be empty.',
  do: 'Select Ball, not Player. Later we will add the score reset to this same script.',
  fix: 'Ball code built on the Player? Drag the script onto the Ball sprite tile to copy it, then delete it from Player.' });

add({ type: 'lesson', step: '14', title: 'Only dribble when close', sprite: 'Ball', where: 'Inside the Ball’s forever',
  code: 'if <touching (Player v)?> then\nend', newBlocks: ['if then', 'touching ?'], newCount: 1,
  what: 'The Ball only moves when the Player is touching it.',
  say: 'This if asks: is the Ball touching the Player right now?',
  do: 'Use the light-blue Sensing block “touching mouse-pointer?” and change it to Player.' });

add({ type: 'lesson', step: '14', title: 'Copy the Player’s direction', sprite: 'Ball', where: 'Inside if touching Player',
  code: 'point in direction ([direction v] of (Player v))', newBlocks: ['point in direction', 'of'], newCount: 1,
  what: 'The Ball turns to face the same way the Player is facing.',
  hint: 'In Sensing, find “backdrop # of Stage”. Change Stage to Player first, then choose direction.',
  say: 'The Ball copies the Player’s direction, so it rolls where the Player is going.',
  do: 'Drop the Sensing “of” reporter into the round slot of point in direction. Change the Stage menu to Player FIRST, then the left menu to direction. Do not use the Ball’s own blue direction reporter.',
  change: 'Baseline note said the Sensing block starts as “x position of Stage”. In Scratch 3 it starts as “backdrop # of Stage”; the slide now says so.' });

add({ type: 'lesson', step: '15', title: 'Give the Ball a push', sprite: 'Ball', where: 'Under point in direction',
  code: 'move (6) steps', newBlocks: ['move steps'],
  what: 'The Ball moves 6 steps. The Player moves 5, so the Ball rolls just ahead.',
  say: 'The Ball has to be a little faster than the Player, or the Player walks over it.',
  do: 'move 6 steps goes inside the touching Player if, right under point in direction. Nothing else goes in this if.',
  change: 'The original Soccer_Striker!.sb3 has an extra “repeat 16 / move 12 / wait 0.03” inside this dribble if. That is a bug: the Ball shoots away every time it is touched. It is removed in the Teacher Reference project. Do not teach it.' });

add({ type: 'check', title: 'Dribble test', q: 'Does the Ball roll when you bump it?', shot: 'dribble',
  tries: ['Walk into the Ball', 'Dribble it all the way right', 'Turn and dribble back'],
  bug: 'Ball flies away? Remove any repeat from the dribble if.',
  say: 'The Ball should roll smoothly in front of you, in the direction you are walking.',
  do: 'Check: only “point in direction (direction of Player)” and “move 6 steps” inside the dribble if.' });

add({ type: 'chapter', n: '04', title: 'Shoot and score', sub: 'Turn your dribble into a real game.', art: 'Goal',
  say: 'Pressing Space is an event. Touching the Player is the condition that allows a kick.' });

add({ type: 'setup', step: '16', title: 'Paint the Goal', sprite: 'Goal', visual: 'nameField', nameValue: 'Goal', xValue: '222', yValue: '0',
  action: 'Paint a new sprite: a tall, thick goal frame.', tip: 'Name it Goal. Put it at x: 222, y: 0.',
  say: 'The Goal must be a sprite, so the Ball can check “touching Goal?”.',
  do: 'Hover over Choose a Sprite and click Paint. Draw thick lines so the Ball cannot slip through. Type 222 and 0 in the x and y boxes.',
  fix: 'A goal painted only on the backdrop cannot be touched by code.' });

add({ type: 'lesson', step: '17', title: 'Space begins a kick', sprite: 'Ball', switchTo: true, where: 'New script on the Ball',
  code: 'when [space v] key pressed', newBlocks: ['when key pressed'],
  what: 'This script starts every time the Space bar is pressed.',
  say: 'This is a brand-new script, separate from the Ball’s forever loop.',
  do: 'Select Ball. Drag “when space key pressed” from Events into an empty spot.' });

add({ type: 'lesson', step: '17', title: 'You must reach the Ball', sprite: 'Ball', where: 'Under when space key pressed',
  code: 'if <touching (Player v)?> then\nend', newBlocks: ['if then', 'touching ?'], newCount: 1,
  what: 'Space only kicks while the Player is touching the Ball.',
  hint: 'Kick while you walk into the Ball.',
  say: 'Pressing Space from far away should do nothing. Kick while you are still walking into the Ball.',
  do: 'Snap this if under the Space event. All kick blocks go INSIDE it.',
  fix: 'Tested in the Scratch engine: standing still next to the Ball, Space never kicks, because the dribble code has already pushed the Ball 6 steps away. Kicking while walking into the Ball works.' });

add({ type: 'lesson', step: '18', title: 'Aim at the Goal', sprite: 'Ball', where: 'Inside if touching Player',
  code: 'point towards (Goal v)', newBlocks: ['point towards'],
  what: 'The Ball turns to face the Goal before it moves.',
  say: 'Now every kick aims straight at the goal.',
  do: 'Goal only appears in the menu if the Goal sprite is named exactly Goal.' });

add({ type: 'lesson', step: '19', title: 'Pop the Ball forward', sprite: 'Ball', where: 'Under point towards Goal',
  code: 'move (60) steps', newBlocks: ['move steps'],
  what: 'One big jump moves the Ball away from the Player.',
  say: 'If the Ball stays touching the Player, the dribble code grabs it back.',
  do: 'This must come before the repeat on the next slide.' });

add({ type: 'lesson', step: '19', title: 'Make a powerful shot', sprite: 'Ball', where: 'Under move 60 steps',
  code: 'repeat (16)\nmove (12) steps\nwait (0.03) seconds\nend', newBlocks: ['repeat', 'move steps', 'wait seconds'],
  what: 'Sixteen small moves make the Ball zoom to the goal: 60 + 16 × 12 = 252 steps.',
  say: 'Lots of small moves with tiny waits look smooth, like a rolling ball.',
  do: 'move 12 and wait 0.03 go INSIDE repeat 16. The repeat is inside the Space script’s if, after move 60. It never goes in the dribble if.' });

add({ type: 'check', title: 'First shot test', q: 'Dribble close, then kick!', shot: 'kick',
  tries: ['Dribble past the middle line', 'Keep walking + press Space', 'Press Space far away: nothing'],
  bug: 'No kick? Keep walking into the Ball as you press Space.',
  say: 'A kick travels 252 steps, so dribble closer before you shoot. Press Space while you are still walking into the Ball.',
  do: 'If the Ball leaps while walking, delete any repeat that ended up in the dribble if.',
  fix: 'If Space NEVER kicks, even while walking into the Ball: the Player is probably drawn in front of the Ball (dragging the Player on the Stage brings it to the front). Drag the Ball a little on the Stage to bring it to the front (a quick click is not enough), then click the green flag again. Tested in the Scratch engine: Player in front, 0 of 12 kicks; Ball in front, 10 of 12. Even done right, about 1 kick in 6 misses when the sprites only just touch, so “try again” is normal.' });

add({ type: 'chapter', n: '05', title: 'Keep score', sub: 'Make every goal count.', art: 'score',
  say: 'A variable is a labeled box that holds a number. The number can change during the game.' });

add({ type: 'setup', step: '20', title: 'Make a Score variable', sprite: null, visual: 'newVar', varName: 'Score', monitor: ['Score', '0'],
  action: 'Variables › Make a Variable. Name it Score.', tip: 'Choose For all sprites. Keep its box checked.',
  say: 'The checkbox shows the Score on the Stage.',
  do: 'Score must be For all sprites. In the reference project, Score already exists on the Stage.' });

add({ type: 'lesson', step: '20', title: 'Start at zero', sprite: 'Ball', where: 'Ball’s green flag script, right under the hat',
  code: 'set [Score v] to (0)', newBlocks: ['set to'],
  what: 'Every new game starts with 0 goals.',
  say: 'Variables remember their number, even after the game ends. So we reset it at the start.',
  do: 'Put it in the Ball’s FIRST green flag script, above the forever. Before or after “go to x: -120 y: 0” both work.' });

add({ type: 'lesson', step: '21', title: 'Did it touch the Goal?', sprite: 'Ball', where: 'Inside forever, under the dribble if',
  code: 'if <touching (Goal v)?> then\nend', newBlocks: ['if then', 'touching ?'], newCount: 1,
  what: 'This checks if the Ball has reached the Goal.',
  say: 'This is the second if in the Ball’s forever loop.',
  do: 'Goal detection lives on the Ball, not the Goal. Put it below the dribble if, not inside it.' });

add({ type: 'lesson', step: '21', title: 'Give the Player a point', sprite: 'Ball', where: 'Inside if touching Goal',
  code: 'change [Score v] by (1)\nsay [GOAL!] for (1) seconds', newBlocks: ['change by', 'say for seconds'],
  what: 'Add 1 to Score, then the Ball shouts GOAL! for 1 second.',
  say: 'Change adds to the number. Say shows a speech bubble.',
  do: 'Both blocks go inside the touching Goal if. The say block makes this script pause for 1 second.' });

add({ type: 'lesson', step: '21', title: 'First to 3 wins!', sprite: 'Ball', where: 'Inside if touching Goal, under say GOAL!',
  code: 'if <(Score) = (3)> then\nsay [GOAL! YOU WIN!] for (2) seconds\nstop [all v]\nend', newBlocks: ['if then', '=', 'say for seconds', 'stop'], newCount: 3,
  what: 'When Score equals 3, show the win message and stop the game.',
  say: 'An if inside an if: it only checks the score right after a goal.',
  do: 'Use the green Operators “=” block and the orange Score reporter. Type 3 on the right.',
  change: 'The original project says “You won”. The lesson and the Teacher Reference use “GOAL! YOU WIN!”.' });

add({ type: 'lesson', step: '22', title: 'Reset the Ball', sprite: 'Ball', where: 'Inside if touching Goal, under the Score = 3 if',
  code: 'go to x: (0) y: (0)\nbroadcast (ResetPlayer v)', newBlocks: ['go to x: y:', 'broadcast'],
  what: 'The Ball goes back to the middle, and a message tells the Player to reset.',
  say: 'A broadcast is like a walkie-talkie message between sprites.',
  do: 'These go below the Score = 3 if, not inside it. In the broadcast menu choose New message and type ResetPlayer exactly.' });

add({ type: 'lesson', step: '22', title: 'Reset the Player', sprite: 'Player', switchTo: true, where: 'New script on the Player',
  code: 'when I receive [ResetPlayer v]\ngo to x: (-170) y: (0)\npoint in direction (90)', newBlocks: ['when I receive', 'go to x: y:', 'point in direction'],
  what: 'When the Player hears ResetPlayer, it runs back to the left and faces the goal.',
  say: 'The Ball sends the message; the Player listens for it.',
  do: 'Switch to Player and build this as a separate script. Then score twice: Score should show 2, and both sprites reset each time.' });

add({ type: 'check', title: 'Scoreboard check', q: 'Can you score twice and see Score: 2?', shot: 'goal',
  tries: ['Score one goal', 'Watch both sprites reset', 'Score again: Score = 2'],
  bug: 'Player doesn’t reset? Check the spelling: ResetPlayer.',
  say: 'Test after every feature. Can you score twice?',
  do: 'Score never changes: check touching Goal is on the Ball. Score jumps by more than 1: the go to x: 0 y: 0 must be inside the Goal if. Player stays put: compare broadcast and when I receive spellings.' });

add({ type: 'chapter', n: '06', title: 'Add a goalkeeper', sub: 'A real challenge is coming.', art: 'Goalie',
  say: 'The Goalie gets its own script. It does not need to know about the Ball.' });

add({ type: 'setup', step: '23', title: 'Choose a Goalie', sprite: 'Goalie', visual: 'nameField', nameValue: 'Goalie', xValue: '195', yValue: '0', sizeValue: '70',
  action: 'Choose or paint a new sprite. Name it Goalie.', tip: 'It stands in front of the Goal.',
  say: 'The Goalie will patrol up and down in front of the Goal.',
  do: 'Keep the Goalie in front of the Goal (the reference uses x: 195). If the Goal covers the Goalie, drag the Goalie on the Stage to bring it to the front.' });

add({ type: 'lesson', step: '23', title: 'Place your Goalie', sprite: 'Goalie', switchTo: true, where: 'New script on the Goalie',
  code: 'when green flag clicked\ngo to x: (195) y: (0)\nset size to (70) %', newBlocks: ['when clicked', 'go to x: y:', 'set size to'],
  what: 'The Goalie starts in front of the net at 70% size.',
  say: 'A bigger Goalie makes the game harder. A smaller one makes it easier.',
  do: 'Select Goalie. Optional: add a purple “show” block so the Goalie is always visible (the reference project has one).' });

add({ type: 'lesson', step: '23', title: 'Patrol up and down', sprite: 'Goalie', where: 'Under set size to 70 %',
  code: 'forever\nglide (2.5) secs to x: (195) y: (80)\nglide (2.5) secs to x: (195) y: (-80)\nend', newBlocks: ['forever', 'glide secs to x: y:'], newCount: 3,
  what: 'The Goalie glides up, then down, again and again.',
  say: 'Watch for the gap. That is your chance to shoot.',
  do: 'Both glide blocks go INSIDE forever.',
  change: 'The original project glides 2 seconds to y: 50 and y: -50. The lesson and the Teacher Reference use 2.5 seconds and y: 80 / -80.' });

add({ type: 'lesson', step: '24', title: 'Check for a save', sprite: 'Ball', switchTo: true, where: 'Ball’s forever, under the Goal if',
  code: 'if <touching (Goalie v)?> then\nend', newBlocks: ['if then', 'touching ?'], newCount: 1,
  what: 'This checks if the Goalie has blocked the Ball.',
  say: 'Back to the Ball! This is the third if in its forever loop.',
  do: 'Order inside forever: dribble if, Goal if, Goalie if.',
  fix: 'Tested: if the Ball touches the Goal and the Goalie in the same moment, the Goal if runs first, so it counts as a goal.' });

add({ type: 'lesson', step: '24', title: 'Saved!', sprite: 'Ball', where: 'Inside if touching Goalie',
  code: 'say [Saved!] for (1) seconds\ngo to x: (0) y: (0)', newBlocks: ['say for seconds', 'go to x: y:'],
  what: 'The Ball says Saved! and goes back to the middle. No point.',
  say: 'On a save only the Ball resets. The Player stays where they are.',
  do: 'Do NOT broadcast ResetPlayer here; only a goal resets the Player.',
  change: 'The original project says Saved! for 3 seconds. The lesson and the Teacher Reference use 1 second.' });

add({ type: 'chapter', n: '07', title: 'Beat the clock', sub: 'Sixty seconds. Three goals.', art: 'clock',
  say: 'The clock is a NEW green flag script on the Ball. Code placed after a forever never runs.' });

add({ type: 'setup', step: '25', title: 'Add the match clock', sprite: null, visual: 'newVar', varName: 'Time', monitor: ['Time', '60'],
  action: 'Variables › Make a Variable. Name it Time.', tip: 'Choose For all sprites. Keep its box checked.',
  say: 'Score counts goals. Time counts seconds. Two different variables.',
  do: 'Time must be a second variable, For all sprites, separate from Score.' });

add({ type: 'lesson', step: '25', title: 'Start with 60 seconds', sprite: 'Ball', where: 'A second, new script on the Ball',
  code: 'when green flag clicked\nset [Time v] to (60)', newBlocks: ['when clicked', 'set to'],
  what: 'When the game starts, the clock is set to 60 seconds.',
  say: 'The Ball can have two green flag scripts. Both start at the same time.',
  do: 'Start a NEW script. Do not snap it under the Ball’s forever loop: nothing below a forever ever runs.',
  fix: 'Clock never moves? The timer is stuck under a forever. Make it its own script.' });

add({ type: 'lesson', step: '25', title: 'Keep going until zero', sprite: 'Ball', where: 'Under set Time to 60',
  code: 'repeat until <(Time) < (1)>\nend', newBlocks: ['repeat until', '<'], newCount: 1,
  what: 'Keep repeating until Time is less than 1.',
  say: 'Repeat until is a loop that stops by itself when the answer becomes yes.',
  do: 'Use Control “repeat until”, the green Operators “<” and the orange Time reporter. The next blocks go INSIDE.' });

add({ type: 'lesson', step: '25', title: 'Tick… tock…', sprite: 'Ball', where: 'Inside repeat until',
  code: 'wait (1) seconds\nchange [Time v] by (-1)', newBlocks: ['wait seconds', 'change by'],
  what: 'Wait 1 second, then take 1 away from Time.',
  say: 'Watch the Time number on the Stage count down once every second.',
  do: 'Wait first, then change Time by -1. Both inside repeat until.' });

add({ type: 'lesson', step: '25', title: 'Full time!', sprite: 'Ball', where: 'Under the repeat until loop',
  code: 'say [FULL TIME!] for (2) seconds\nstop [all v]', newBlocks: ['say for seconds', 'stop'],
  what: 'When time runs out, announce FULL TIME! and stop the game.',
  say: 'These run once, after the loop has finished.',
  do: 'Both go AFTER repeat until, not inside it. If someone reaches 3 goals first, the win code stops everything.',
  fix: 'Tested: each tick takes a little over 1 second (wait 1 plus the loop), so a 60-second match really lasts about 63 seconds. That is normal.',
  change: 'The Teacher Reference project’s message is “FULL TIME! 🏁” (with a flag emoji). Students may type it either way.' });

add({ type: 'check', title: 'Kickoff! Play the game', q: '3 goals or 60 seconds. Can you win?', shot: 'saved',
  tries: ['Kick from far away: nothing', 'A save gives no point', 'Green flag resets Score'],
  bug: 'Clock stuck at 60? Make the timer its own script.',
  say: 'Play a full match. Then trade seats and test a friend’s game.',
  do: 'Check: Space far away does nothing, saves do not score, Score goes back to 0 and Time to 60 on the green flag.' });

add({ type: 'chapter', n: '08', title: 'Bonus challenges', sub: 'Choose your own upgrade.', art: 'bonus',
  say: 'All four challenges are optional. Pick one. They need more testing and are not part of the base game.' });

add({ type: 'bonus', step: 'C1', title: 'Speed Boots', sprite: 'Player', switchTo: true, where: 'Player’s forever, under the down-arrow if',
  code: 'if <key (z v) pressed?> then\nmove (4) steps\nend', newBlocks: ['if then', 'key pressed?', 'move steps'], newCount: 2,
  what: 'Hold Z with an arrow key to sprint: 5 + 4 = 9 steps.',
  say: 'Why might a sprinting Player run past the Ball?',
  do: 'A fifth if inside the Player’s forever. The extra 4 steps add to the arrow-key move. Tested: Z + arrow = 9 steps per frame; Z alone creeps 4 steps in the direction the Player faces.',
  change: 'The written plan said Shift. Scratch 3’s “key pressed?” menu has no Shift option (only space, the arrows, any, a–z and 0–9), so the slide uses Z. Any free letter works; avoid W, A, S, D and F if a class also does Challenge C2.' });

add({ type: 'bonus', step: 'C1', title: 'Fix the fast dribble', sprite: 'Ball', switchTo: true, where: 'Ball’s dribble if: change 6 to 10',
  code: 'move (10) steps', newBlocks: ['move steps'],
  what: 'A faster Ball stays ahead of a sprinting Player.',
  say: 'Try 6, then 10. Which feels better?',
  do: 'Change the number in the existing move 6 steps; do not add a new block.',
  fix: 'Trade-off: normal dribbling is now faster too. A speed boost only while Z is held is a harder extra challenge.' });

add({ type: 'bonus', step: 'C2', title: 'Meet Player 2', sprite: 'Player2', switchTo: true, where: 'Player2’s green flag script: new numbers',
  code: 'go to x: (120) y: (0)\npoint in direction (-90)', newBlocks: ['go to x: y:', 'point in direction'],
  what: 'Player 2 starts on the right side, facing left.',
  hint: 'Right-click Player › duplicate. Scratch names the copy Player2.',
  say: 'Duplicating copies all of Player’s scripts. We only change the numbers.',
  do: 'Give Player2 a different costume color. ALSO change Player2’s “when I receive ResetPlayer” script to x: 120, y: 0 and direction -90, or Player2 will reset to the left side.',
  fix: 'A duplicated sprite is placed in front of the others. Before testing, drag the Ball a little on the Stage so the Ball is in front again; otherwise kicks fail (tested: 0 of 12 F-kicks with Player2 in front, 10 of 12 after dragging the Ball).' });

add({ type: 'bonus', step: 'C2', title: 'WASD controls', sprite: 'Player2', where: 'Player2’s forever: change the keys',
  code: 'if <key (w v) pressed?> then\npoint in direction (0)\nmove (5) steps\nend', newBlocks: ['if then', 'key pressed?', 'point in direction', 'move steps'], newCount: 3,
  what: 'Player 2 uses W, A, S and D instead of the arrow keys.',
  say: 'W is up. Can you set A, S and D yourself?',
  do: 'In Player2’s copied ifs change the keys: up arrow › w, left arrow › a, down arrow › s, right arrow › d. Show W, then let students do the other three.' });

add({ type: 'bonus', step: 'C2', title: 'Player 2 can dribble too', sprite: 'Ball', switchTo: true, where: 'Ball’s forever, under the first dribble if',
  code: 'if <touching (Player2 v)?> then\npoint in direction ([direction v] of (Player2 v))\nmove (6) steps\nend', newBlocks: ['if then', 'touching ?', 'point in direction', 'of', 'move steps'], newCount: 3,
  what: 'A second dribble if, so the Ball follows Player 2’s direction.',
  hint: 'Duplicate the first dribble if, then change both menus to Player2.',
  say: 'The Ball needs to know WHICH player touched it, so each player gets their own if.',
  do: 'Add this as a separate if below the Player dribble if.',
  change: 'Baseline slide used “touching Player or touching Player2” with “direction of Player”. That makes the Ball follow Player 1’s direction even when Player 2 dribbles. Replaced with a second, separate dribble branch (still 3 new blocks).' });

add({ type: 'bonus', step: 'C2', title: 'Player 2 can shoot', sprite: 'Ball', where: 'New script on the Ball',
  code: 'when [f v] key pressed\nif <touching (Player2 v)?> then\npoint towards (Goal v)\nend', newBlocks: ['when key pressed', 'if then', 'touching ?', 'point towards'], newCount: 3,
  what: 'F is Player 2’s kick button.',
  hint: 'Then add move 60 steps and the repeat 16 kick from Step 19.',
  say: 'Same kick, different key and different player.',
  do: 'Duplicate the Space script and change space › f and Player › Player2. Keep move 60, or the kick fights the dribble code.',
  fix: 'If F never kicks, drag the Ball on the Stage to bring it in front of Player2, then green flag (tested 0/12 → 10/12). One Goal and one Score means the players share points: this is a team game. For a real match against each other, add a second Goal on the left and separate scores (for example Score1 and Score2). That is a bigger project.' });

add({ type: 'bonus', step: 'C3', title: 'Slippery Ball', sprite: 'Ball', switchTo: false, where: 'Space script: under move 60 steps',
  code: 'set [KickSpeed v] to (12)', newBlocks: ['set to'],
  what: 'KickSpeed holds how fast the Ball is rolling.',
  hint: 'Make a Variable: KickSpeed, For this sprite only.',
  say: 'Real balls slow down. We will make our kick slow down too.',
  do: 'Remove the repeat 16 kick loop. Keep point towards Goal and move 60 steps, then add this block.' });

add({ type: 'bonus', step: 'C3', title: 'Make the Ball slow down', sprite: 'Ball', where: 'Under set KickSpeed to 12',
  code: 'repeat until <(KickSpeed) < (1)>\nmove (KickSpeed) steps\nend', newBlocks: ['repeat until', '<', 'move steps'], newCount: 2,
  what: 'The Ball keeps rolling, KickSpeed steps at a time, until KickSpeed is under 1.',
  say: 'The move block uses the orange KickSpeed reporter instead of a number.',
  do: 'move KickSpeed steps goes INSIDE repeat until.' });

add({ type: 'bonus', step: 'C3', title: 'Add friction', sprite: 'Ball', where: 'Inside repeat until, under move',
  code: 'change [KickSpeed v] by (-1)\nwait (0.03) seconds', newBlocks: ['change by', 'wait seconds'],
  what: 'Take 1 away each time, so the Ball slows down and stops.',
  say: 'What would -2 do to how far the Ball rolls?',
  do: 'Both blocks go inside the same repeat until, after move KickSpeed steps.',
  fix: 'This kick is shorter: 60 + 12 + 11 + … + 1 = 138 steps (the old kick was 252). Shoot from closer, or try a bigger starting KickSpeed such as 18 (60 + 171 = 231 steps).' });

add({ type: 'bonus', step: 'C4', title: 'Golden Goal', sprite: 'Ball', switchTo: false, where: 'Clock script: right under the green flag',
  code: 'set [GoldenGoal v] to (0)', newBlocks: ['set to'],
  what: 'A new variable remembers if it is overtime. 0 means “not yet”.',
  hint: 'Make a Variable: GoldenGoal. Start every match at 0.',
  say: 'Variables keep their number between games, so we always start GoldenGoal at 0.',
  do: 'Make the variable GoldenGoal. Put this block at the top of the Ball’s clock script.',
  change: 'Baseline slide 64 showed only “set GoldenGoal to 1”. The reset to 0 is now shown as a block, because without it the first goal of the NEXT match would instantly win. “set GoldenGoal to 1” moves to the next slide.' });

add({ type: 'bonus', step: 'C4', title: 'Overtime begins', sprite: 'Ball', where: 'Clock script: after repeat until',
  code: 'set [GoldenGoal v] to (1)\nsay [GOLDEN GOAL!] for (2) seconds', newBlocks: ['set to', 'say for seconds'],
  what: 'When time runs out, overtime begins. The game keeps going.',
  hint: 'First drag away say FULL TIME! and stop all.',
  say: 'No stop all here, so the game keeps playing in overtime.',
  do: 'Replace “say FULL TIME!” and “stop all” after the repeat until with these two blocks.' });

add({ type: 'bonus', step: 'C4', title: 'The next goal wins', sprite: 'Ball', where: 'Inside if touching Goal, under the Score = 3 if',
  code: 'if <(GoldenGoal) = (1)> then\nsay [YOU WIN!] for (2) seconds\nstop [all v]\nend', newBlocks: ['if then', '=', 'say for seconds', 'stop'], newCount: 3,
  what: 'In overtime, the very next goal wins the game.',
  say: 'Score one goal in overtime to win!',
  do: 'Put it inside the touching Goal if, after the Score updates and below the Score = 3 if.',
  fix: 'This is single-player overtime, not a tie-breaker: with one Score there is no tie. A true two-player golden goal needs two Goals and two scores.' });

add({ type: 'finish', title: 'You built a real game!', sub: 'Play it. Test it. Make it your own.',
  items: ['Save it: File › Save to your computer', 'Show a friend one feature you built', 'Tell them one bug you fixed'],
  say: 'Share one feature you built and one bug you fixed.',
  do: 'Remind students to save with a name they will remember. Share online only if your class settings allow it.' });

module.exports = S;
