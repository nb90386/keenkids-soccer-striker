# Soccer Striker! Teacher Guide (FINAL)

KeenKids Scratch Coding Club · Grades 3–4 · 67 slides · 25 steps + 4 bonus challenges

Every coding slide shows 1–3 new Scratch 3 blocks, the sprite they belong to and exactly where they go. The slide notes in the PowerPoint contain the same script as this guide.

## Before class

- Test the room: open scratch.mit.edu on one student device and check that the arrow keys and Space reach the Scratch Stage (click the Stage once first).
- Keep `KeenKids_Soccer_Striker_Teacher_Reference.sb3` open on your machine. It is the finished base game the slides teach (File › Load from your computer).
- Do **not** hand out `Soccer_Striker!.sb3` as the answer key. It has the dribble bug described below.
- Fonts: the slides use Literata and Figtree (free Google Fonts, included in `fonts/`). Install them before presenting the .pptx, or PowerPoint will substitute other fonts. The PDF already has them embedded.
- Suggested pacing (not tested with a class): Chapters 1–3 in session 1 (about 45 min), Chapters 4–7 in session 2 (about 50 min), and bonus challenges as extension time.

## Big ideas to say out loud

- **Sprites have their own scripts.** Check the sprite chip on every slide. A gold **SWITCH TO …** chip means click a different sprite first.
- **Inside vs. under.** The grey line at the top of each code card says exactly where the blocks go.
- **Scratch directions:** 0 = up, 90 = right, 180 = down, -90 = left.
- **Test after every feature.** Checkpoint slides come after movement, dribbling, kicking, scoring and the full game.

## Help at three levels

| Student needs | Try this |
|---|---|
| More support | Pair programming: one “driver” on the mouse, one “navigator” reading the slide. Point to the sprite chip, then the breadcrumb, then the blocks. For the four arrow keys, build the first if together, then have students right-click › duplicate and change only the key and the number. |
| On track | Ask a prediction before running: “What will happen if you press ← now?” |
| Early finishers | Bonus challenges C1–C4 (slides 54–66). C1 and C3 are the easiest; C2 is the biggest. Or: change the Goalie’s speed (glide seconds) and size, and explain how each change affects difficulty. |

## Fix-it table (most common bugs)

| What students see | Likely cause | Fix |
|---|---|---|
| Arrow keys do nothing | Code is on the wrong sprite, or the ifs are not inside forever | Select Player; drag the ifs into forever |
| One arrow only works while holding another | An if is nested inside another if | Drag it out and snap it below |
| Ball zooms away whenever it is touched | A `repeat 16` ended up inside the dribble if (this is the bug in the original project) | Only `point in direction (direction of Player)` and `move 6 steps` belong there |
| Ball turns the wrong way | The Ball’s own blue `direction` reporter was used | Use Sensing `(direction) of (Player)`; change Stage › Player first |
| Space never kicks while standing next to the Ball | Normal. The dribble code pushed the Ball 6 steps away first (tested) | Press Space while still walking into the Ball |
| Space (or F) never kicks, even while walking into the Ball | The Player is drawn in front of the Ball. Dragging a sprite on the Stage, or duplicating Player into Player2, puts that sprite in front. Tested: 0 of 12 kicks | Drag the Ball a little on the Stage (a quick click is not enough), then click the green flag again. Tested: 10 of 12 kicks |
| A good kick sometimes does nothing | When the sprites only just touch, about 1 kick in 6 misses (tested) | Normal. Try again while walking into the Ball |
| Score jumps by more than 1 | The Ball does not reset inside the Goal if | `go to x: 0 y: 0` must be inside `if touching Goal` |
| Player does not reset after a goal | Message names differ | `broadcast ResetPlayer` and `when I receive ResetPlayer` must match exactly |
| Clock never moves | Timer blocks are under the forever loop | Make the timer its own green flag script |
| “Golden Goal” game ends on the first goal | `set GoldenGoal to 0` is missing (tested) | Add it at the top of the clock script |

## Tested behavior worth knowing

These come from running the Teacher Reference project in the real Scratch 3 engine (scratch-vm + scratch-render, 30 fps). Details: `QA_REPORT.md`.

- A kick covers about 252 steps (60 + 16 × 12), so students must dribble past the middle line before shooting.
- If the Ball touches the Goal and the Goalie at the same moment, it counts as a **goal** (the Goal if runs first).
- On a save, the rest of the kick can carry the Ball into the net while “Saved!” is showing. No goal is counted.
- The “60-second” clock really lasts about 63 seconds (each tick is about 1.06 s).
- On a slow computer, a kick can still be moving for a moment after the Ball resets to the middle. Rare; a fresh kick fixes it.

## Differences from the original project (`Soccer_Striker!.sb3`)

The original file is preserved unchanged. The lesson and the Teacher Reference project differ from it here:

| Where | Original | Lesson / Teacher Reference |
|---|---|---|
| Ball dribble `if touching Player` | Also contains `repeat 16 { move 12, wait 0.03 }`. Tested: the Ball shoots 198 steps every touch | Removed: only `point in direction (direction of Player)` + `move 6 steps` |
| Win message | `say You won for 2 seconds` | `say GOAL! YOU WIN! for 2 seconds` |
| Save message | `say Saved! for 3 seconds` | `say Saved! for 1 seconds` |
| Goalie patrol | `glide 2 secs` to y: 50 / y: -50 | `glide 2.5 secs` to y: 80 / y: -80 |
| Full-time message | `FULL TIME! 🏁` | Slides say `FULL TIME!`; the reference keeps the 🏁. Either is fine |
| Player scripts | Setup and forever loop are two separate green-flag scripts | Slides use one script (setup, then forever). Both behave the same |

## Changes to the lesson plan (marked in slide notes)

- **C1 Speed Boots uses Z, not Shift.** Scratch 3’s `key pressed?` menu has no Shift option (checked in the scratch-blocks source: space, arrows, any, a–z, 0–9).
- **C2 dribble uses a second if, not OR.** With `touching Player or touching Player2` plus `direction of Player`, the Ball follows Player 1’s direction even when Player 2 dribbles (tested). The slide now teaches a separate `if touching Player2` branch with `direction of Player2`.
- **C4 shows the reset to 0 as a block.** Without `set GoldenGoal to 0`, the next match ends at the first goal (tested). `set GoldenGoal to 1` moved to the following slide with `say GOLDEN GOAL!`.
- **Slide 21 wording:** the Sensing block starts as `backdrop # of Stage` in Scratch 3 (not `x position of Stage`).
- **Kicking tip added:** kick while walking into the Ball (tested behavior).

## Two-player and overtime: what these extensions really are

- **C2 is a team game.** One Score and one Goal means both players add to the same score. A real match between two players needs a second Goal on the left and two score variables (for example Score1 and Score2). That is a larger project.
- **C4 is single-player overtime, not a tie-breaker.** With one Score there is no tie. If time runs out before 3 goals, the next goal wins. A true two-player golden goal needs two scores and two goals.

## Slide-by-slide script

**Slide 1: Soccer Striker!**

- Say: “Today you will build a real soccer game: a Player you control, a Ball you can dribble and kick, a Goal, a Goalie who blocks shots, a Score and a 60-second clock.”
- Do: Open scratch.mit.edu and click Create to start a new, blank project. Students who are not logged in can still build; they save with File › Save to your computer.

**Slide 2: Your mission today**

- Say: “Before we code, predict: which Scratch tools do we need? Keys need sensing, repeating needs loops, the score needs a variable.”
- Do: No code on this slide. Take 2–3 predictions, then move on.

### Chapter 01: Build your soccer field

**Slide 3: Build your soccer field**

- Say: “The Stage is the background of the game. Sprites are the characters and objects that move on it.”

**Slide 4: Wave goodbye to the Cat** · Step 01

- Say: “Every new project starts with the Scratch Cat, named Sprite1. We need an empty field.”
- Do: Students start from a blank project. If you open the finished reference project instead, do NOT delete its sprites.
- Watch for: Deleted the wrong thing? Use Edit › Restore Sprite right away.

**Slide 5: Paint your pitch** · Step 02

- Say: “The Stage is 480 steps wide and 360 steps tall. The middle is x: 0, y: 0.”
- Do: Use the Fill tool for green and a thick white line or circle tool for the markings. Keep the right edge clear: the Goal will be its own sprite.
- Watch for: Do not paint the goal on the backdrop. Ball code can only “touch” a sprite.

**Slide 6: Choose your Player** · Step 03

- Say: “Names matter in code. The Ball will look for a sprite called Player, spelled exactly like that.”
- Do: Point to the Sprite name box under the Stage. Capital P, no spaces.
- Watch for: A sprite named “player” or “Player1” will not appear the same way in the Ball’s menus. Rename it.

**Slide 7: Start on the left** · Step 04

- Sprite: **Player** · Where: Start a new script
- Blocks: `when green flag clicked  →  go to x: -170 y: 0`
- Say: “The green flag is the game’s start button. Negative x means left of the middle.”
- Do: Select Player. Drag “when green flag clicked” from Events. Snap the blue “go to x: y:” under it and type -170 and 0.

**Slide 8: Face the goal** · Step 05

- Sprite: **Player** · Where: Under go to x: -170 y: 0
- Blocks: `point in direction 90  →  set size to 60 %`
- Say: “In Scratch, 90 means right. We shrink the Player so the field feels bigger.”
- Do: Snap both blocks under “go to x: -170 y: 0”. Optional: add “set rotation style [left-right]” so the Player never turns upside down. The reference project includes it.

**Slide 9: Keep checking!** · Step 06

- Sprite: **Player** · Where: At the bottom of the script
- Blocks: `forever`
- Say: “A game has to keep checking the keys all the time. That is what forever is for.”
- Do: Snap forever under the setup blocks. Every arrow-key “if” goes INSIDE this forever. Only one forever in this script.
- ⚑ Teacher note: The reference project keeps Player setup and the forever loop in two separate green-flag scripts. Either way works; the slides use one script because it is easier to follow.

### Chapter 02: Control your player

**Slide 10: Control your player**

- Say: “You already have a Player script with a forever loop. The next blocks all go inside that loop.”

**Slide 11: Right arrow → right** · Step 07

- Sprite: **Player** · Where: Inside forever
- Blocks: `if <key [right arrow] pressed?> then  →  point in direction 90  →  move 5 steps`
- Say: “An “if” asks a yes-or-no question. Only when the answer is yes do the blocks inside run.”
- Do: Drag “if then” into forever. Drop the light-blue Sensing “key space pressed?” into the hexagon slot and pick right arrow. Put point in direction 90 and move 5 steps inside.
- Watch for: Nothing happens? Make sure the code is on Player and the if is inside forever.

**Slide 12: Left arrow → left** · Step 08

- Sprite: **Player** · Where: Inside forever, under the first if
- Blocks: `if <key [left arrow] pressed?> then  →  point in direction -90  →  move 5 steps`
- Say: “Tip: right-click the first if and choose duplicate, then change the key and the direction.”
- Do: The new if goes BELOW the right-arrow if, still inside forever. It must not go inside the first if.
- Watch for: Left only works while holding right? The second if is inside the first one. Drag it out and below.

**Slide 13: Up arrow → up** · Step 09

- Sprite: **Player** · Where: Inside forever, under the left-arrow if
- Blocks: `if <key [up arrow] pressed?> then  →  point in direction 0  →  move 5 steps`
- Say: “Scratch directions: 0 is up, 90 is right, 180 is down, -90 is left.”
- Do: Students can draw this compass on paper or a sticky note.

**Slide 14: Down arrow → down** · Step 10

- Sprite: **Player** · Where: Inside forever, under the up-arrow if
- Blocks: `if <key [down arrow] pressed?> then  →  point in direction 180  →  move 5 steps`
- Say: “Four keys, four separate ifs, all inside one forever.”
- Do: Run the game and press each arrow to check the directions.

**Slide 15: Stay on the field** · Step 11

- Sprite: **Player** · Where: Inside forever, under all four ifs
- Blocks: `if on edge, bounce`
- Say: “Without this, the Player can walk right off the screen.”
- Do: This block goes at the very bottom INSIDE forever, after the four arrow-key ifs.

**Slide 16: First play test** · Checkpoint

- Say: “One-minute test. Programmers test after every new feature.”
- Do: Circulate. Most bugs here are an if nested inside another if, or code on the wrong sprite.

### Chapter 03: Make the ball move

**Slide 17: Make the ball move**

- Say: “Now we switch from the Player to the Ball. Each sprite has its own scripts.”

**Slide 18: Add the soccer ball** · Step 12

- Say: “The Ball needs its own name too: Ball, with a capital B.”
- Do: The Scratch library has a Soccer Ball sprite. Painting a simple circle works too.

**Slide 19: Set up the Ball** · Step 13

- Sprite: **Ball** (switch sprites!) · Where: New script on the Ball
- Blocks: `when green flag clicked  →  go to x: -120 y: 0  →  forever`
- Say: “Click the Ball in the sprite list first. Its code area should be empty.”
- Do: Select Ball, not Player. Later we will add the score reset to this same script.
- Watch for: Ball code built on the Player? Drag the script onto the Ball sprite tile to copy it, then delete it from Player.

**Slide 20: Only dribble when close** · Step 14

- Sprite: **Ball** · Where: Inside the Ball’s forever
- Blocks: `if <touching [Player]?> then`
- Say: “This if asks: is the Ball touching the Player right now?”
- Do: Use the light-blue Sensing block “touching mouse-pointer?” and change it to Player.

**Slide 21: Copy the Player’s direction** · Step 14

- Sprite: **Ball** · Where: Inside if touching Player
- Blocks: `point in direction [direction] of [Player]`
- Say: “The Ball copies the Player’s direction, so it rolls where the Player is going.”
- Do: Drop the Sensing “of” reporter into the round slot of point in direction. Change the Stage menu to Player FIRST, then the left menu to direction. Do not use the Ball’s own blue direction reporter.
- ⚑ Teacher note: Baseline note said the Sensing block starts as “x position of Stage”. In Scratch 3 it starts as “backdrop # of Stage”; the slide now says so.

**Slide 22: Give the Ball a push** · Step 15

- Sprite: **Ball** · Where: Under point in direction
- Blocks: `move 6 steps`
- Say: “The Ball has to be a little faster than the Player, or the Player walks over it.”
- Do: move 6 steps goes inside the touching Player if, right under point in direction. Nothing else goes in this if.
- ⚑ Teacher note: The original Soccer_Striker!.sb3 has an extra “repeat 16 / move 12 / wait 0.03” inside this dribble if. That is a bug: the Ball shoots away every time it is touched. It is removed in the Teacher Reference project. Do not teach it.

**Slide 23: Dribble test** · Checkpoint

- Say: “The Ball should roll smoothly in front of you, in the direction you are walking.”
- Do: Check: only “point in direction (direction of Player)” and “move 6 steps” inside the dribble if.

### Chapter 04: Shoot and score

**Slide 24: Shoot and score**

- Say: “Pressing Space is an event. Touching the Player is the condition that allows a kick.”

**Slide 25: Paint the Goal** · Step 16

- Say: “The Goal must be a sprite, so the Ball can check “touching Goal?”.”
- Do: Hover over Choose a Sprite and click Paint. Draw thick lines so the Ball cannot slip through. Type 222 and 0 in the x and y boxes.
- Watch for: A goal painted only on the backdrop cannot be touched by code.

**Slide 26: Space begins a kick** · Step 17

- Sprite: **Ball** (switch sprites!) · Where: New script on the Ball
- Blocks: `when [space] key pressed`
- Say: “This is a brand-new script, separate from the Ball’s forever loop.”
- Do: Select Ball. Drag “when space key pressed” from Events into an empty spot.

**Slide 27: You must reach the Ball** · Step 17

- Sprite: **Ball** · Where: Under when space key pressed
- Blocks: `if <touching [Player]?> then`
- Say: “Pressing Space from far away should do nothing. Kick while you are still walking into the Ball.”
- Do: Snap this if under the Space event. All kick blocks go INSIDE it.
- Watch for: Tested in the Scratch engine: standing still next to the Ball, Space never kicks, because the dribble code has already pushed the Ball 6 steps away. Kicking while walking into the Ball works.

**Slide 28: Aim at the Goal** · Step 18

- Sprite: **Ball** · Where: Inside if touching Player
- Blocks: `point towards [Goal]`
- Say: “Now every kick aims straight at the goal.”
- Do: Goal only appears in the menu if the Goal sprite is named exactly Goal.

**Slide 29: Pop the Ball forward** · Step 19

- Sprite: **Ball** · Where: Under point towards Goal
- Blocks: `move 60 steps`
- Say: “If the Ball stays touching the Player, the dribble code grabs it back.”
- Do: This must come before the repeat on the next slide.

**Slide 30: Make a powerful shot** · Step 19

- Sprite: **Ball** · Where: Under move 60 steps
- Blocks: `repeat 16  →  move 12 steps  →  wait 0.03 seconds`
- Say: “Lots of small moves with tiny waits look smooth, like a rolling ball.”
- Do: move 12 and wait 0.03 go INSIDE repeat 16. The repeat is inside the Space script’s if, after move 60. It never goes in the dribble if.

**Slide 31: First shot test** · Checkpoint

- Say: “A kick travels 252 steps, so dribble closer before you shoot. Press Space while you are still walking into the Ball.”
- Do: If the Ball leaps while walking, delete any repeat that ended up in the dribble if.
- Watch for: If Space NEVER kicks, even while walking into the Ball: the Player is probably drawn in front of the Ball (dragging the Player on the Stage brings it to the front). Drag the Ball a little on the Stage to bring it to the front (a quick click is not enough), then click the green flag again. Tested in the Scratch engine: Player in front, 0 of 12 kicks; Ball in front, 10 of 12. Even done right, about 1 kick in 6 misses when the sprites only just touch, so “try again” is normal.

### Chapter 05: Keep score

**Slide 32: Keep score**

- Say: “A variable is a labeled box that holds a number. The number can change during the game.”

**Slide 33: Make a Score variable** · Step 20

- Say: “The checkbox shows the Score on the Stage.”
- Do: Score must be For all sprites. In the reference project, Score already exists on the Stage.

**Slide 34: Start at zero** · Step 20

- Sprite: **Ball** · Where: Ball’s green flag script, right under the hat
- Blocks: `set [Score] to 0`
- Say: “Variables remember their number, even after the game ends. So we reset it at the start.”
- Do: Put it in the Ball’s FIRST green flag script, above the forever. Before or after “go to x: -120 y: 0” both work.

**Slide 35: Did it touch the Goal?** · Step 21

- Sprite: **Ball** · Where: Inside forever, under the dribble if
- Blocks: `if <touching [Goal]?> then`
- Say: “This is the second if in the Ball’s forever loop.”
- Do: Goal detection lives on the Ball, not the Goal. Put it below the dribble if, not inside it.

**Slide 36: Give the Player a point** · Step 21

- Sprite: **Ball** · Where: Inside if touching Goal
- Blocks: `change [Score] by 1  →  say [GOAL!] for 1 seconds`
- Say: “Change adds to the number. Say shows a speech bubble.”
- Do: Both blocks go inside the touching Goal if. The say block makes this script pause for 1 second.

**Slide 37: First to 3 wins!** · Step 21

- Sprite: **Ball** · Where: Inside if touching Goal, under say GOAL!
- Blocks: `if <Score = 3> then  →  say [GOAL! YOU WIN!] for 2 seconds  →  stop [all]`
- Say: “An if inside an if: it only checks the score right after a goal.”
- Do: Use the green Operators “=” block and the orange Score reporter. Type 3 on the right.
- ⚑ Teacher note: The original project says “You won”. The lesson and the Teacher Reference use “GOAL! YOU WIN!”.

**Slide 38: Reset the Ball** · Step 22

- Sprite: **Ball** · Where: Inside if touching Goal, under the Score = 3 if
- Blocks: `go to x: 0 y: 0  →  broadcast [ResetPlayer]`
- Say: “A broadcast is like a walkie-talkie message between sprites.”
- Do: These go below the Score = 3 if, not inside it. In the broadcast menu choose New message and type ResetPlayer exactly.

**Slide 39: Reset the Player** · Step 22

- Sprite: **Player** (switch sprites!) · Where: New script on the Player
- Blocks: `when I receive [ResetPlayer]  →  go to x: -170 y: 0  →  point in direction 90`
- Say: “The Ball sends the message; the Player listens for it.”
- Do: Switch to Player and build this as a separate script. Then score twice: Score should show 2, and both sprites reset each time.

**Slide 40: Scoreboard check** · Checkpoint

- Say: “Test after every feature. Can you score twice?”
- Do: Score never changes: check touching Goal is on the Ball. Score jumps by more than 1: the go to x: 0 y: 0 must be inside the Goal if. Player stays put: compare broadcast and when I receive spellings.

### Chapter 06: Add a goalkeeper

**Slide 41: Add a goalkeeper**

- Say: “The Goalie gets its own script. It does not need to know about the Ball.”

**Slide 42: Choose a Goalie** · Step 23

- Say: “The Goalie will patrol up and down in front of the Goal.”
- Do: Keep the Goalie in front of the Goal (the reference uses x: 195). If the Goal covers the Goalie, drag the Goalie on the Stage to bring it to the front.

**Slide 43: Place your Goalie** · Step 23

- Sprite: **Goalie** (switch sprites!) · Where: New script on the Goalie
- Blocks: `when green flag clicked  →  go to x: 195 y: 0  →  set size to 70 %`
- Say: “A bigger Goalie makes the game harder. A smaller one makes it easier.”
- Do: Select Goalie. Optional: add a purple “show” block so the Goalie is always visible (the reference project has one).

**Slide 44: Patrol up and down** · Step 23

- Sprite: **Goalie** · Where: Under set size to 70 %
- Blocks: `forever  →  glide 2.5 secs to x: 195 y: 80  →  glide 2.5 secs to x: 195 y: -80`
- Say: “Watch for the gap. That is your chance to shoot.”
- Do: Both glide blocks go INSIDE forever.
- ⚑ Teacher note: The original project glides 2 seconds to y: 50 and y: -50. The lesson and the Teacher Reference use 2.5 seconds and y: 80 / -80.

**Slide 45: Check for a save** · Step 24

- Sprite: **Ball** (switch sprites!) · Where: Ball’s forever, under the Goal if
- Blocks: `if <touching [Goalie]?> then`
- Say: “Back to the Ball! This is the third if in its forever loop.”
- Do: Order inside forever: dribble if, Goal if, Goalie if.
- Watch for: Tested: if the Ball touches the Goal and the Goalie in the same moment, the Goal if runs first, so it counts as a goal.

**Slide 46: Saved!** · Step 24

- Sprite: **Ball** · Where: Inside if touching Goalie
- Blocks: `say [Saved!] for 1 seconds  →  go to x: 0 y: 0`
- Say: “On a save only the Ball resets. The Player stays where they are.”
- Do: Do NOT broadcast ResetPlayer here; only a goal resets the Player.
- ⚑ Teacher note: The original project says Saved! for 3 seconds. The lesson and the Teacher Reference use 1 second.

### Chapter 07: Beat the clock

**Slide 47: Beat the clock**

- Say: “The clock is a NEW green flag script on the Ball. Code placed after a forever never runs.”

**Slide 48: Add the match clock** · Step 25

- Say: “Score counts goals. Time counts seconds. Two different variables.”
- Do: Time must be a second variable, For all sprites, separate from Score.

**Slide 49: Start with 60 seconds** · Step 25

- Sprite: **Ball** · Where: A second, new script on the Ball
- Blocks: `when green flag clicked  →  set [Time] to 60`
- Say: “The Ball can have two green flag scripts. Both start at the same time.”
- Do: Start a NEW script. Do not snap it under the Ball’s forever loop: nothing below a forever ever runs.
- Watch for: Clock never moves? The timer is stuck under a forever. Make it its own script.

**Slide 50: Keep going until zero** · Step 25

- Sprite: **Ball** · Where: Under set Time to 60
- Blocks: `repeat until <Time < 1>`
- Say: “Repeat until is a loop that stops by itself when the answer becomes yes.”
- Do: Use Control “repeat until”, the green Operators “<” and the orange Time reporter. The next blocks go INSIDE.

**Slide 51: Tick… tock…** · Step 25

- Sprite: **Ball** · Where: Inside repeat until
- Blocks: `wait 1 seconds  →  change [Time] by -1`
- Say: “Watch the Time number on the Stage count down once every second.”
- Do: Wait first, then change Time by -1. Both inside repeat until.

**Slide 52: Full time!** · Step 25

- Sprite: **Ball** · Where: Under the repeat until loop
- Blocks: `say [FULL TIME!] for 2 seconds  →  stop [all]`
- Say: “These run once, after the loop has finished.”
- Do: Both go AFTER repeat until, not inside it. If someone reaches 3 goals first, the win code stops everything.
- Watch for: Tested: each tick takes a little over 1 second (wait 1 plus the loop), so a 60-second match really lasts about 63 seconds. That is normal.
- ⚑ Teacher note: The Teacher Reference project’s message is “FULL TIME! 🏁” (with a flag emoji). Students may type it either way.

**Slide 53: Kickoff! Play the game** · Checkpoint

- Say: “Play a full match. Then trade seats and test a friend’s game.”
- Do: Check: Space far away does nothing, saves do not score, Score goes back to 0 and Time to 60 on the green flag.

### Chapter 08: Bonus challenges

**Slide 54: Bonus challenges**

- Say: “All four challenges are optional. Pick one. They need more testing and are not part of the base game.”

**Slide 55: Speed Boots** · Bonus C1

- Sprite: **Player** (switch sprites!) · Where: Player’s forever, under the down-arrow if
- Blocks: `if <key [z] pressed?> then  →  move 4 steps`
- Say: “Why might a sprinting Player run past the Ball?”
- Do: A fifth if inside the Player’s forever. The extra 4 steps add to the arrow-key move. Tested: Z + arrow = 9 steps per frame; Z alone creeps 4 steps in the direction the Player faces.
- ⚑ Teacher note: The written plan said Shift. Scratch 3’s “key pressed?” menu has no Shift option (only space, the arrows, any, a–z and 0–9), so the slide uses Z. Any free letter works; avoid W, A, S, D and F if a class also does Challenge C2.

**Slide 56: Fix the fast dribble** · Bonus C1

- Sprite: **Ball** (switch sprites!) · Where: Ball’s dribble if: change 6 to 10
- Blocks: `move 10 steps`
- Say: “Try 6, then 10. Which feels better?”
- Do: Change the number in the existing move 6 steps; do not add a new block.
- Watch for: Trade-off: normal dribbling is now faster too. A speed boost only while Z is held is a harder extra challenge.

**Slide 57: Meet Player 2** · Bonus C2

- Sprite: **Player2** (switch sprites!) · Where: Player2’s green flag script: new numbers
- Blocks: `go to x: 120 y: 0  →  point in direction -90`
- Say: “Duplicating copies all of Player’s scripts. We only change the numbers.”
- Do: Give Player2 a different costume color. ALSO change Player2’s “when I receive ResetPlayer” script to x: 120, y: 0 and direction -90, or Player2 will reset to the left side.
- Watch for: A duplicated sprite is placed in front of the others. Before testing, drag the Ball a little on the Stage so the Ball is in front again; otherwise kicks fail (tested: 0 of 12 F-kicks with Player2 in front, 10 of 12 after dragging the Ball).

**Slide 58: WASD controls** · Bonus C2

- Sprite: **Player2** · Where: Player2’s forever: change the keys
- Blocks: `if <key [w] pressed?> then  →  point in direction 0  →  move 5 steps`
- Say: “W is up. Can you set A, S and D yourself?”
- Do: In Player2’s copied ifs change the keys: up arrow › w, left arrow › a, down arrow › s, right arrow › d. Show W, then let students do the other three.

**Slide 59: Player 2 can dribble too** · Bonus C2

- Sprite: **Ball** (switch sprites!) · Where: Ball’s forever, under the first dribble if
- Blocks: `if <touching [Player2]?> then  →  point in direction [direction] of [Player2]  →  move 6 steps`
- Say: “The Ball needs to know WHICH player touched it, so each player gets their own if.”
- Do: Add this as a separate if below the Player dribble if.
- ⚑ Teacher note: Baseline slide used “touching Player or touching Player2” with “direction of Player”. That makes the Ball follow Player 1’s direction even when Player 2 dribbles. Replaced with a second, separate dribble branch (still 3 new blocks).

**Slide 60: Player 2 can shoot** · Bonus C2

- Sprite: **Ball** · Where: New script on the Ball
- Blocks: `when [f] key pressed  →  if <touching [Player2]?> then  →  point towards [Goal]`
- Say: “Same kick, different key and different player.”
- Do: Duplicate the Space script and change space › f and Player › Player2. Keep move 60, or the kick fights the dribble code.
- Watch for: If F never kicks, drag the Ball on the Stage to bring it in front of Player2, then green flag (tested 0/12 → 10/12). One Goal and one Score means the players share points: this is a team game. For a real match against each other, add a second Goal on the left and separate scores (for example Score1 and Score2). That is a bigger project.

**Slide 61: Slippery Ball** · Bonus C3

- Sprite: **Ball** · Where: Space script: under move 60 steps
- Blocks: `set [KickSpeed] to 12`
- Say: “Real balls slow down. We will make our kick slow down too.”
- Do: Remove the repeat 16 kick loop. Keep point towards Goal and move 60 steps, then add this block.

**Slide 62: Make the Ball slow down** · Bonus C3

- Sprite: **Ball** · Where: Under set KickSpeed to 12
- Blocks: `repeat until <KickSpeed < 1>  →  move KickSpeed steps`
- Say: “The move block uses the orange KickSpeed reporter instead of a number.”
- Do: move KickSpeed steps goes INSIDE repeat until.

**Slide 63: Add friction** · Bonus C3

- Sprite: **Ball** · Where: Inside repeat until, under move
- Blocks: `change [KickSpeed] by -1  →  wait 0.03 seconds`
- Say: “What would -2 do to how far the Ball rolls?”
- Do: Both blocks go inside the same repeat until, after move KickSpeed steps.
- Watch for: This kick is shorter: 60 + 12 + 11 + … + 1 = 138 steps (the old kick was 252). Shoot from closer, or try a bigger starting KickSpeed such as 18 (60 + 171 = 231 steps).

**Slide 64: Golden Goal** · Bonus C4

- Sprite: **Ball** · Where: Clock script: right under the green flag
- Blocks: `set [GoldenGoal] to 0`
- Say: “Variables keep their number between games, so we always start GoldenGoal at 0.”
- Do: Make the variable GoldenGoal. Put this block at the top of the Ball’s clock script.
- ⚑ Teacher note: Baseline slide 64 showed only “set GoldenGoal to 1”. The reset to 0 is now shown as a block, because without it the first goal of the NEXT match would instantly win. “set GoldenGoal to 1” moves to the next slide.

**Slide 65: Overtime begins** · Bonus C4

- Sprite: **Ball** · Where: Clock script: after repeat until
- Blocks: `set [GoldenGoal] to 1  →  say [GOLDEN GOAL!] for 2 seconds`
- Say: “No stop all here, so the game keeps playing in overtime.”
- Do: Replace “say FULL TIME!” and “stop all” after the repeat until with these two blocks.

**Slide 66: The next goal wins** · Bonus C4

- Sprite: **Ball** · Where: Inside if touching Goal, under the Score = 3 if
- Blocks: `if <GoldenGoal = 1> then  →  say [YOU WIN!] for 2 seconds  →  stop [all]`
- Say: “Score one goal in overtime to win!”
- Do: Put it inside the touching Goal if, after the Score updates and below the Score = 3 if.
- Watch for: This is single-player overtime, not a tie-breaker: with one Score there is no tie. A true two-player golden goal needs two Goals and two scores.

**Slide 67: You built a real game!**

- Say: “Share one feature you built and one bug you fixed.”
- Do: Remind students to save with a name they will remember. Share online only if your class settings allow it.
