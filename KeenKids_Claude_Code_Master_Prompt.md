# KEENKIDS — SOCCER STRIKER — CLAUDE CODE MASTER BUILD PROMPT

You are the lead instructional designer, Scratch game-debugging instructor, and presentation engineer for **KeenKids Enrichment**. Execute this task end to end, with no vague proposals or placeholder deliverables.

## Mission

Finish, improve, and verify an actual classroom-ready slide deck that teaches **grades 3–4** to build **Soccer Striker** in Scratch. The reading level is roughly grade 5–6, with short, clear explanations. Every student-facing coding slide must show **only 1–3 new Scratch blocks or code lines**, each large enough to read from the back of the classroom, with one short explanation of **what that block does**. Follow the teacher's exact 25-step sequence, then include all four optional challenges. Do not omit steps or rewrite mechanics silently.

A complete 67-slide editable deck already exists in this handoff. **Treat it as the working baseline, not something you can throw away.** Your mission is to verify it, carefully polish it when that materially improves teaching, and produce a presentation-ready Canva version. Existing working Canva draft:
https://www.canva.com/d/G41PEYbF30NpdcW

## Input and output files

Read every relevant file inside this folder before editing:
- `KeenKids_Soccer_Striker_Scratch_Lesson.pptx` — editable 67-slide initial presentation.
- `KeenKids_Soccer_Striker_Scratch_Lesson.pdf` — rendered baseline and visual review reference.
- `KeenKids_Soccer_Striker_Slide_Notes.json` — exact 67-slide ordered specification and teaching notes.
- `KeenKids_Soccer_Striker_Teacher_Guide.md` — detailed speaker instructions.
- `KeenKids_Soccer_Striker_Teacher_Reference.sb3` — repaired Scratch project matching the lesson.
- `Soccer_Striker!.sb3` — user's original project; preserve it unchanged.
- `soccer_pitch_preview.png` — composed artwork from actual sprites.

Deliver into `output/`:
1. `KeenKids_Soccer_Striker_FINAL.pptx`, with slide layout elements as editable as practical.
2. `KeenKids_Soccer_Striker_FINAL.pdf`, same slides and order.
3. `Teacher_Guide_FINAL.md`, short scripts/teacher cues, differentiated assistance and bug fixes.
4. `QA_REPORT.md`, evidence of tests, visual inspection, and exact differences from the baseline.
5. A Canva presentation link **only if you actually verify a successful import or authorized edit**. Otherwise provide clear import steps and do not invent a link.

## Design direction — KeenKids, not an AI pitch deck

Study `https://keenkids-storybook-preview.vercel.app/` for visual direction. It is a premium educational storybook style, **Literata serif headings and Figtree sans text**, warm off-white paper, restrained forest green, soft muted green, warm gold, subtle borders, generous margins and human copy. Editorial, friendly, readable — not corporate, neon, gradient-heavy, glossy, or overloaded.

Use 16:9 slides. Design from the classroom projector backward. Title 34–52 pt, block text roughly 26–32 pt, explanation 24–28 pt, small meta text only in unobtrusive supporting positions. Code is the hero. One simple teaching idea per slide. All essential teaching content should be on slides; extra explanations go in real speaker notes, not tiny slide text. Show actual Soccer Striker gameplay art from the supplied `.sb3` rather than random stock images. Do not use photographs of identifiable children.

Prefer real **Scratch 3-shaped syntax** with correct official category colors, not inaccurate generic bars. If workable, use `scratchblocks` to render SVG of exact Scratch syntax, crop or separate into one-to-three-block views and place large on the slide. Always confirm that rendered blocks match Scratch's menu labels, dropdown values and connection order; do not allow Scratch text syntax to substitute for validation. Keep prior context via small labels like `BALL SPRITE > inside forever`, without showing nine tiny blocks.

For non-code setup slides, display one clear action and relevant actual stage/sprite reference. Chapter slides may be cinematic, but every coding slide should be calm and consistent. Present checkpoints after movement, dribbling, kicking, scoring and full gameplay. Keep challenge slides visibly distinguished but on brand.

## Technical correctness — NON-NEGOTIABLE

1. **Different sprite scripts:** Player, Ball, Goalie, and Goal are distinct Scratch sprites. At each switch, identify which sprite must be selected. The variable Score/Time is global.
2. **Movement:** Player starts at x=-170, y=0; direction=90; size=60%. Player's main `forever` contains four independent `if key pressed` conditions: right (90), left (-90), up (0), down (180), each moving 5 steps. `if on edge, bounce` is inside that forever, below the four conditions.
3. **Dribble:** Ball starts x=-120, y=0. Its own forever contains `if touching Player` → `point in direction (direction of Player)` → `move 6 steps`. The nested direction reporter must be **Sensing → `(direction) of [Player]`**, not Ball's own direction bubble. **The user's original `.sb3` accidentally has a `repeat 16 / move 12 / wait` inside the dribble condition. That is WRONG; do not carry it forward.** The repaired reference file removes it.
4. **Goal:** a thick Goal *sprite*, at roughly x=222, y=0; touching a backdrop-only painting won't work with `touching [Goal]`.
5. **Shooting:** on the Ball, a SEPARATE `when [space] key pressed` stack → `if touching Player` → `point towards Goal` → `move 60 steps` → `repeat 16` containing `move 12 steps` and `wait 0.03 seconds`. Move 60 frees the Ball from the Player. The kick distance is 60 + (16×12)=252 Scratch steps. The repeat belongs in the KICK stack, not dribble.
6. **Score:** make variable Score → on Ball flag stack `set Score to 0`. In Ball forever, a separate `if touching Goal` → `change Score by 1` → `say GOAL! for 1 seconds` → if Score=3 then say win and stop all; otherwise `go to x 0 y 0` and `broadcast ResetPlayer`. On Player: `when I receive ResetPlayer` → go x=-170, y=0; point 90. Test two scored goals: Score 2 and resets both times.
7. **Goalie:** start x=195, y=0; size 70%. Goalie forever glides **2.5 sec** up to y=80 and down to y=-80. Original `.sb3` uses ±50 in 2 seconds — treat repaired reference and written lesson as the target. Ball adds `if touching Goalie` → `say Saved! for 1 seconds` → `go to x=0 y=0`. Player stays put on saves. Note if Goal and Goalie touch simultaneously, condition order may matter; investigate by testing, do not fabricate behavior.
8. **Clock:** new global Time, its own completely SEPARATE Ball green flag stack: `set Time to 60` → `repeat until Time < 1` containing `wait 1 second` and `change Time by -1`, followed by `say FULL TIME! for 2 seconds` and `stop all`. A loop placed after an eternal `forever` in the same stack never runs.
9. **Challenge C1:** shift adds 4 steps on Player; it may outrun ball's 6 step dribble, so experiment with Ball move 10. Point out always-boosted ball tradeoff.
10. **Challenge C2:** duplicate Player, Player2 starts x=120 y=0 facing -90 and moves WASD. `touching Player OR touching Player2` alone is NOT sufficient to follow the correct facing; choose correct direction based on WHICH sprite touched. Add F kick for Player2 including the same initial 60 step separation. **A single Score and Goal is not a genuine scored two-player match; for two competing teams use a second goal and separate score variables.** Be explicit about this extra work.
11. **Challenge C3:** use Ball-local KickSpeed, set to 12; in kick code loop until KickSpeed<1, move KickSpeed, decrease it by 1, wait 0.03. This is a simple model of friction. Preserve the kick separation if needed.
12. **Challenge C4:** initialize GoldenGoal=0 at start. When Time expires, if using the overtime rule, set it to 1 and show GOLDEN GOAL; no immediate stop. In the next successful Goal branch, if GoldenGoal=1, show win and stop. A one-player Score<3 is NOT a tie — it is **single-player overtime**. A two-player tie requires separate team scores. Explain this in teacher notes, not falsely as a tie.

Do not silently “fix” the student's instructions without marking a teacher note. Keep the current visual flow and explain teaching-critical differences.

## Tools / verified repositories / security

Use only what improves the result:
- `https://github.com/gitbrent/PptxGenJS` — programmatic editable PowerPoint generation; install `pptxgenjs` from npm if needed.
- `https://github.com/scratchblocks/scratchblocks` — render actual Scratch 3 script blocks to SVG; install `scratchblocks` from npm if needed. Render carefully and visually verify every label.
- `https://github.com/microsoft/playwright` — browser screenshots and visual regression QA if building HTML previews or testing Canva/slide preview access.
- `https://github.com/anthropics/skills` — read a relevant presentation skill if available; do not clone entire huge repositories blindly.

Before installing, inspect package/repository provenance and versions. Pin reasonable versions and use a local project directory. Don't run unreviewed remote install scripts. Do not request arbitrary admin access, expose login tokens, bypass authentication, or modify live KeenKids website. Use Canva only with already-authorized access; do not pretend successful upload.

If the baseline deck is already correct and polished, preserve it rather than changing things to show activity. You MAY further improve Scratch fidelity or small hierarchy/layout issues, but must audit the final presentation.

## QA and acceptance checks

- Read all 67 entries in the slide specification. Match each title and intended block order to the output.
- No student-facing coding slide may show more than 3 **new** Scratch code blocks. No omitted step 1–25, and C1–C4 all included.
- All exact numbers, positions, conditions, sprite names, variables, broadcast messages, and directions must match the written plan and repaired game.
- Render **every** slide to an image; inspect cover, every chapter, setup slides, all slides with 3 code blocks, long code labels, checkpoints and bonus slides. Check text doesn't clip and category colors aren't swapped. Inspect at projector distance.
- Use automated checks on all slides for missing/overlapping content and export correctness, then a human-style visual pass. Include a contact sheet in the QA report if possible.
- Verify full flow by loading the repaired `.sb3` into Scratch or a compatible editor/test harness if practical. Do not say gameplay passed without actually running it.
- Verify Canva design opens as a **presentation** with 67 pages and can be edited. The baseline was already imported to Canva at the URL above; avoid overwriting it unless authorized, prefer import a new FINAL version.
- Distinguish actual tested facts from theoretical expectations and untested extensions.

## Execute without stopping early

1. Inventory source files; validate project JSON and slide counts.
2. Check visual theme against the KeenKids website.
3. Make focused edits to a copy of the baseline, and render to PDF.
4. Run full visual and educational QA; correct any findings.
5. Save final PPTX/PDF/teacher guide/report.
6. Import the final deck to Canva if connected, or produce an import-ready PPTX and instructions.
7. Give a concise final handoff including actual files, actual Canva URL if imported, and what was tested.

## Complete lesson map

Below is the exact slide-by-slide content and teacher note specification extracted from the already built deck. Preserve the order; if a slide is split into two or combined, document why, and keep 1–3 newly taught blocks per slide.

### Slide 1: Soccer Striker!
Teacher guidance: Open Scratch at scratch.mit.edu and start a new blank project. Tell students that today they will make a game with a player, a soccer ball, a goalie, goals, a score, and a countdown timer.

### Slide 2: Your mission today
Teacher guidance: Ask students to predict which Scratch features each action needs: key sensing, loops, and variables. No code on this slide.

### Slide 3: Build your soccer field
Teacher guidance: The stage is the background. Sprites are game characters or objects that can move.

### Slide 4: Wave goodbye to the Cat
Step/Challenge: 01
Teacher guidance: Students should start with a blank Scratch project. The uploaded reference project already has custom sprites; do not delete those if opening the finished file.

### Slide 5: Paint your pitch
Step/Challenge: 02
Teacher guidance: Use a thick white brush. The stage in Scratch is 480 by 360 pixels. Keep the right edge clear enough for the Goal sprite.

### Slide 6: Choose your Player
Step/Challenge: 03
Teacher guidance: Point out the sprite name text box below the stage. The name Player is important because Ball scripts will look for that exact sprite.

### Slide 7: Start on the left
Step/Challenge: 04
- `Events: when green flag clicked`
- `Motion: go to x: -170  y: 0`
Teacher guidance: Select Player. Snap the blue go-to block under the yellow event block. Show that negative x means left of center.

### Slide 8: Face the goal
Step/Challenge: 05
- `Motion: point in direction 90`
- `Looks: set size to 60 %`
Teacher guidance: Add both blocks under the Player flag stack. The Player looks right and fits on the pitch. Optional: set rotation style to left-right so the sprite does not flip upside down.

### Slide 9: Keep checking!
Step/Challenge: 06
- `Control: forever`
Teacher guidance: Snap forever underneath Player setup. Every arrow-key if block goes INSIDE forever. Do not put the forever beneath another forever.

### Slide 10: Control your player
Teacher guidance: Students already have a Player flag stack with a forever loop. These slides insert code inside that loop.

### Slide 11: Right arrow → right
Step/Challenge: 07
- `Control: if <key [right arrow] pressed?> then`
- `Motion: point in direction 90`
- `Motion: move 5 steps`
Teacher guidance: Place an if block inside Player forever. Insert a Sensing key-pressed hexagon into the if. Put point direction 90 and move 5 inside.

### Slide 12: Left arrow → left
Step/Challenge: 08
- `Control: if <key [left arrow] pressed?> then`
- `Motion: point in direction -90`
- `Motion: move 5 steps`
Teacher guidance: Add a NEW if below the right-arrow if inside forever, not inside the right-arrow if.

### Slide 13: Up arrow → up
Step/Challenge: 09
- `Control: if <key [up arrow] pressed?> then`
- `Motion: point in direction 0`
- `Motion: move 5 steps`
Teacher guidance: Scratch directions are unusual: 0 = up, 90 = right, 180 = down, -90 = left. Students can write a compass on paper.

### Slide 14: Down arrow → down
Step/Challenge: 10
- `Control: if <key [down arrow] pressed?> then`
- `Motion: point in direction 180`
- `Motion: move 5 steps`
Teacher guidance: Add the fourth separate if. Run game and press each arrow to debug directions.

### Slide 15: Stay on the field
Step/Challenge: 11
- `Motion: if on edge, bounce`
Teacher guidance: Place this block at the bottom INSIDE Player forever, after the four arrow-key if blocks.

### Slide 16: First play test
Teacher guidance: Pause for one-minute student test. If controls do not work, confirm each if is inside forever and the code is on Player.

### Slide 17: Make the ball move
Teacher guidance: Students switch from Player to Ball. Different sprites have different scripts.

### Slide 18: Add the soccer ball
Step/Challenge: 12
Teacher guidance: Exact sprite name must be Ball. In some versions, a Soccer Ball sprite may be available or students can paint a circle.

### Slide 19: Set up the Ball
Step/Challenge: 13
- `Events: when green flag clicked`
- `Motion: go to x: -120  y: 0`
- `Control: forever`
Teacher guidance: Select Ball, not Player. Make a new green flag stack. Keep the score reset in this same flag stack later.

### Slide 20: Only dribble when close
Step/Challenge: 14
- `Control: if <touching [Player]?> then`
Teacher guidance: Inside Ball forever, put if touching Player. Use light-blue Sensing block touching [Player]? (not touching mouse-pointer).

### Slide 21: Copy the Player’s direction
Step/Challenge: 14
- `Motion: point in direction (direction of [Player])`
Teacher guidance: Critical: use Sensing reporter (x position of [Stage]) and change both dropdowns to direction of Player. Do not use Ball’s own direction bubble. This blue point block belongs inside the Ball touching Player if.

### Slide 22: Give the Ball a push
Step/Challenge: 15
- `Motion: move 6 steps`
Teacher guidance: Add move 6 inside the Ball touching Player if, directly below point in direction of Player. Do NOT add repeat 16 here; the uploaded example file accidentally has an extra repeat and it should be removed.

### Slide 23: Dribble test
Teacher guidance: If ball teleports or flies: check there is no repeat 16 inside Ball dribble if; make sure direction of Player and move 6 are the only movement blocks in that branch.

### Slide 24: Shoot and score
Teacher guidance: Explain events and conditions: Space is an event; touching Player is the condition that allows a kick.

### Slide 25: Paint the Goal
Step/Challenge: 16
Teacher guidance: Sprite must be Goal (capital G). Make its frame thick enough for collision detection. Make sure it is a sprite, not only painted on the backdrop, so touching Goal can work.

### Slide 26: Space begins a kick
Step/Challenge: 17
- `Events: when [space] key pressed`
Teacher guidance: On Ball, start a NEW stack, separate from the Ball green-flag forever stack.

### Slide 27: You must reach the Ball
Step/Challenge: 17
- `Control: if <touching [Player]?> then`
Teacher guidance: Snap this condition under the space key event. Everything needed to kick goes INSIDE this if.

### Slide 28: Aim at the Goal
Step/Challenge: 18
- `Motion: point towards [Goal]`
Teacher guidance: This Motion block appears inside the Space key touching Player condition. Confirm the Goal sprite is named Goal to appear in the dropdown.

### Slide 29: Pop the Ball forward
Step/Challenge: 19
- `Motion: move 60 steps`
Teacher guidance: This is important. A small push might leave the Ball still touching Player, causing dribble code to interfere with the kick.

### Slide 30: Make a powerful shot
Step/Challenge: 19
- `Control: repeat 16`
- `Motion: move 12 steps`
- `Control: wait 0.03 seconds`
Teacher guidance: Put move 12 and wait 0.03 INSIDE repeat 16, which is inside the Space touching Player if, after move 60. A total possible shot distance is 60 + 16*12 = 252 Scratch steps.

### Slide 31: First shot test
Teacher guidance: Students may need to dribble past the halfway line first; the kick distance is intentional. If the ball leaps unexpectedly when walking, delete any repeat that was mistakenly placed in the dribble if.

### Slide 32: Keep score
Teacher guidance: A variable is a labeled number that can change during the game.

### Slide 33: Make a Score variable
Step/Challenge: 20
Teacher guidance: Make Score available to all sprites. On the Stage in the supplied project, Score already exists.

### Slide 34: Start at zero
Step/Challenge: 20
- `Variables: set [Score] to 0`
Teacher guidance: Insert this at the beginning of Ball’s green flag stack, before or after the starting Ball position.

### Slide 35: Did it touch the Goal?
Step/Challenge: 21
- `Control: if <touching [Goal]?> then`
Teacher guidance: Inside Ball forever add a SECOND if after the dribble if. The goal detection belongs in the Ball sprite, not Goal.

### Slide 36: Give the Player a point
Step/Challenge: 21
- `Variables: change [Score] by 1`
- `Looks: say [GOAL!] for 1 seconds`
Teacher guidance: Put both INSIDE the touching Goal if. The say block pauses that stack briefly.

### Slide 37: First to 3 wins!
Step/Challenge: 21
- `Control: if <(Score) = (3)> then`
- `Looks: say [GOAL! YOU WIN!] for 2 seconds`
- `Control: stop [all]`
Teacher guidance: Use green Operators = and orange Score variable bubble inside the smaller if. Put it below the Score+1 and GOAL announcement, inside the Goal touching branch.

### Slide 38: Reset the Ball
Step/Challenge: 22
- `Motion: go to x: 0  y: 0`
- `Events: broadcast [ResetPlayer]`
Teacher guidance: In the Ball touching Goal if, BELOW the win check, reset Ball and send a new ResetPlayer message. Students must choose New Message and name it ResetPlayer exactly.

### Slide 39: Reset the Player
Step/Challenge: 22
- `Events: when I receive [ResetPlayer]`
- `Motion: go to x: -170  y: 0`
- `Motion: point in direction 90`
Teacher guidance: Switch to Player to create this separate new stack. Test scoring twice and verify Score remains 2 and sprites reset after each goal.

### Slide 40: Scoreboard check
Teacher guidance: If score never changes, check touching Goal on Ball. If score increments multiple times, ensure Ball resets inside goal if. If the Player does not reset, check broadcast and receive spellings.

### Slide 41: Add a goalkeeper
Teacher guidance: Goalie uses an independent script, separate from Ball and Player.

### Slide 42: Choose a Goalie
Step/Challenge: 23
Teacher guidance: Use position x=195, y=0, size 70%. Keep Goal behind Goalie. The provided sample project uses x 195.

### Slide 43: Place your Goalie
Step/Challenge: 23
- `Events: when green flag clicked`
- `Motion: go to x: 195  y: 0`
- `Looks: set size to 70 %`
Teacher guidance: Select Goalie and create this setup. Size affects difficulty. You can also add show block to ensure the sprite appears after resets.

### Slide 44: Patrol up and down
Step/Challenge: 23
- `Control: forever`
- `Motion: glide 2.5 secs to x: 195 y: 80`
- `Motion: glide 2.5 secs to x: 195 y: -80`
Teacher guidance: Both glide blocks must be INSIDE Goalie forever. Uploaded project differs: it uses y ±50 and 2 sec; adjust for this lesson to y ±80 and 2.5 sec.

### Slide 45: Check for a save
Step/Challenge: 24
- `Control: if <touching [Goalie]?> then`
Teacher guidance: Switch back to Ball. Add another if inside the Ball forever loop. The written lesson calls it the third if, after dribble and goal detection. If goal/save happen at exactly the same time, detection order may matter.

### Slide 46: Saved!
Step/Challenge: 24
- `Looks: say [Saved!] for 1 seconds`
- `Motion: go to x: 0  y: 0`
Teacher guidance: Put these two inside Ball touching Goalie if. The Player stays where they are on a save; only a GOAL broadcasts ResetPlayer.

### Slide 47: Beat the clock
Teacher guidance: This is a NEW flag-clicked stack on Ball. If students place this after forever in the same stack, the timer never starts.

### Slide 48: Add the match clock
Step/Challenge: 25
Teacher guidance: Use a second all-sprites variable, Time. It should be separate from Score.

### Slide 49: Start with 60 seconds
Step/Challenge: 25
- `Events: when green flag clicked`
- `Variables: set [Time] to 60`
Teacher guidance: Start a new Ball green flag stack for the clock. This is NOT below the Ball forever loop.

### Slide 50: Keep going until zero
Step/Challenge: 25
- `Control: repeat until <(Time) < (1)>`
Teacher guidance: Use Control repeat until, Operators <, and the Time variable bubble. The blocks on the next slide go INSIDE it.

### Slide 51: Tick... tock...
Step/Challenge: 25
- `Control: wait 1 seconds`
- `Variables: change [Time] by -1`
Teacher guidance: Place wait then change Time by -1 INSIDE repeat until. Students should be able to watch the number fall once per second.

### Slide 52: Full time!
Step/Challenge: 25
- `Looks: say [FULL TIME!] for 2 seconds`
- `Control: stop [all]`
Teacher guidance: These two blocks go AFTER repeat until, still in the new timer flag stack. If Score reaches 3 first, the win branch stops all scripts.

### Slide 53: Kickoff! Play the game
Teacher guidance: Ask each student to test a full match. Make sure pressing Space from far away does nothing, saved shots do not score, and Score resets when the green flag is clicked.

### Slide 54: Bonus challenges
Teacher guidance: All four challenges are optional extensions. They require more experimentation and are not needed for the base game.

### Slide 55: Speed Boots
Step/Challenge: C1
- `Control: if <key [shift] pressed?> then`
- `Motion: move 4 steps`
Teacher guidance: Add a fifth if INSIDE Player forever. Extra move 4 steps is in addition to movement from the arrow key. Ask: why does the player sometimes outrun the ball?

### Slide 56: Fix the fast dribble
Step/Challenge: C1
- `Motion: move 10 steps`
Teacher guidance: In the Ball touching Player branch, change move 6 to move 10. Compare 6 and 10 for how smooth the dribble feels. This changes normal dribbling too; a conditional speed boost is a more advanced fix.

### Slide 57: Meet Player 2
Step/Challenge: C2
- `Motion: go to x: 120  y: 0`
- `Motion: point in direction -90`
Teacher guidance: Duplicate Player, rename Player2, and give it a different costume color. Modify Player2 green flag starting position. Be sure reset code for Player2 is updated too.

### Slide 58: WASD controls
Step/Challenge: C2
- `Control: if <key [w] pressed?> then`
- `Motion: point in direction 0`
- `Motion: move 5 steps`
Teacher guidance: Duplicate the Player movement logic to Player2 and replace four arrows with W=up, A=left, S=down, D=right. Show this W example, then ask kids to make the other three.

### Slide 59: Either player can dribble
Step/Challenge: C2
- `Control: if <touching [Player]?> or <touching [Player2]?> then`
Teacher guidance: In Ball forever replace the touching Player condition with an Operators OR containing two Sensing touching blocks. The Ball needs extra logic to pick WHICH player’s direction; a simple direction-of-Player still follows Player1 even when Player2 touches. For the extension, add two separate dribble branches for each player or a direction selection if/else. Explain limitation clearly.

### Slide 60: Player 2 can shoot
Step/Challenge: C2
- `Events: when [f] key pressed`
- `Control: if <touching [Player2]?> then`
- `Motion: point towards [Goal]`
Teacher guidance: Make a SECOND key stack on Ball for F. Continue by adding the same move 60 and repeat 16 → move 12 → wait 0.03 kick travel from Player 1, or the kick may fight dribbling. For truly competitive 2-player scoring, build a second Goal and separate scores; one Score variable only counts shared goals.

### Slide 61: Slippery Ball
Step/Challenge: C3
- `Variables: set [KickSpeed] to 12`
Teacher guidance: Make a variable KickSpeed for Ball only. In the Space kick stack, replace the fixed repeat kick with a fading-speed loop. Note that preserving move 60 may be necessary to free the Ball from the Player.

### Slide 62: Make the Ball slow down
Step/Challenge: C3
- `Control: repeat until <(KickSpeed) < (1)>`
- `Motion: move (KickSpeed) steps`
Teacher guidance: The move block uses the orange KickSpeed variable bubble instead of the number 12. It belongs inside repeat until.

### Slide 63: Add friction
Step/Challenge: C3
- `Variables: change [KickSpeed] by -1`
- `Control: wait 0.03 seconds`
Teacher guidance: Both blocks belong inside the same repeat until loop, after move KickSpeed steps. Ask children: how would changing -1 to -2 affect stopping distance?

### Slide 64: Golden Goal
Step/Challenge: C4
- `Variables: set [GoldenGoal] to 1`
Teacher guidance: Create a GoldenGoal variable; initialize to 0 at match start. On timeout, set it to 1 instead of immediately stopping. In a one-player game this is an overtime rule, not a true tie. A real two-player tie needs two scores.

### Slide 65: Overtime begins
Step/Challenge: C4
- `Looks: say [GOLDEN GOAL!] for 2 seconds`
Teacher guidance: In the time-up stack, remove stop all and display the Golden Goal message after setting GoldenGoal to 1. The existing win-at-3 code remains unless teacher chooses a different rule.

### Slide 66: The next goal wins
Step/Challenge: C4
- `Control: if <(GoldenGoal) = (1)> then`
- `Looks: say [YOU WIN!] for 2 seconds`
- `Control: stop [all]`
Teacher guidance: Put this inside Ball touching Goal branch after score updates. GoldenGoal must have been reset to 0 at the start of every match. This implements single-player overtime; two-player golden goal additionally needs team identification and separate scores.

### Slide 67: You built a real game!
Teacher guidance: Ask students to showcase one feature they built and one bug they fixed. Remind them to save the project with a memorable name and share it if their classroom settings permit.
