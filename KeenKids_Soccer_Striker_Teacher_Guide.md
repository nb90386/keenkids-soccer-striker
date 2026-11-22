# KeenKids Soccer Striker — Teacher Guide

67 slides. Each coding slide shows 1–3 Scratch blocks.
Source: lesson plan supplied by the user; art from supplied Soccer_Striker!.sb3.
Design reference: KeenKids storybook preview (Literata/Figtree editorial style).

## Slide 1: Soccer Striker!
**Teacher note:** Open Scratch at scratch.mit.edu and start a new blank project. Tell students that today they will make a game with a player, a soccer ball, a goalie, goals, a score, and a countdown timer.

## Slide 2: Your mission today
**Teacher note:** Ask students to predict which Scratch features each action needs: key sensing, loops, and variables. No code on this slide.

## Slide 3: Build your soccer field
**Teacher note:** The stage is the background. Sprites are game characters or objects that can move.

## Slide 4: Wave goodbye to the Cat
**Teacher note:** Students should start with a blank Scratch project. The uploaded reference project already has custom sprites; do not delete those if opening the finished file.

## Slide 5: Paint your pitch
**Teacher note:** Use a thick white brush. The stage in Scratch is 480 by 360 pixels. Keep the right edge clear enough for the Goal sprite.

## Slide 6: Choose your Player
**Teacher note:** Point out the sprite name text box below the stage. The name Player is important because Ball scripts will look for that exact sprite.

## Slide 7: Start on the left
**Teacher note:** Select Player. Snap the blue go-to block under the yellow event block. Show that negative x means left of center.

## Slide 8: Face the goal
**Teacher note:** Add both blocks under the Player flag stack. The Player looks right and fits on the pitch. Optional: set rotation style to left-right so the sprite does not flip upside down.

## Slide 9: Keep checking!
**Teacher note:** Snap forever underneath Player setup. Every arrow-key if block goes INSIDE forever. Do not put the forever beneath another forever.

## Slide 10: Control your player
**Teacher note:** Students already have a Player flag stack with a forever loop. These slides insert code inside that loop.

## Slide 11: Right arrow → right
**Teacher note:** Place an if block inside Player forever. Insert a Sensing key-pressed hexagon into the if. Put point direction 90 and move 5 inside.

## Slide 12: Left arrow → left
**Teacher note:** Add a NEW if below the right-arrow if inside forever, not inside the right-arrow if.

## Slide 13: Up arrow → up
**Teacher note:** Scratch directions are unusual: 0 = up, 90 = right, 180 = down, -90 = left. Students can write a compass on paper.

## Slide 14: Down arrow → down
**Teacher note:** Add the fourth separate if. Run game and press each arrow to debug directions.

## Slide 15: Stay on the field
**Teacher note:** Place this block at the bottom INSIDE Player forever, after the four arrow-key if blocks.

## Slide 16: First play test
**Teacher note:** Pause for one-minute student test. If controls do not work, confirm each if is inside forever and the code is on Player.

## Slide 17: Make the ball move
**Teacher note:** Students switch from Player to Ball. Different sprites have different scripts.

## Slide 18: Add the soccer ball
**Teacher note:** Exact sprite name must be Ball. In some versions, a Soccer Ball sprite may be available or students can paint a circle.

## Slide 19: Set up the Ball
**Teacher note:** Select Ball, not Player. Make a new green flag stack. Keep the score reset in this same flag stack later.

## Slide 20: Only dribble when close
**Teacher note:** Inside Ball forever, put if touching Player. Use light-blue Sensing block touching [Player]? (not touching mouse-pointer).

## Slide 21: Copy the Player’s direction
**Teacher note:** Critical: use Sensing reporter (x position of [Stage]) and change both dropdowns to direction of Player. Do not use Ball’s own direction bubble. This blue point block belongs inside the Ball touching Player if.

## Slide 22: Give the Ball a push
**Teacher note:** Add move 6 inside the Ball touching Player if, directly below point in direction of Player. Do NOT add repeat 16 here; the uploaded example file accidentally has an extra repeat and it should be removed.

## Slide 23: Dribble test
**Teacher note:** If ball teleports or flies: check there is no repeat 16 inside Ball dribble if; make sure direction of Player and move 6 are the only movement blocks in that branch.

## Slide 24: Shoot and score
**Teacher note:** Explain events and conditions: Space is an event; touching Player is the condition that allows a kick.

## Slide 25: Paint the Goal
**Teacher note:** Sprite must be Goal (capital G). Make its frame thick enough for collision detection. Make sure it is a sprite, not only painted on the backdrop, so touching Goal can work.

## Slide 26: Space begins a kick
**Teacher note:** On Ball, start a NEW stack, separate from the Ball green-flag forever stack.

## Slide 27: You must reach the Ball
**Teacher note:** Snap this condition under the space key event. Everything needed to kick goes INSIDE this if.

## Slide 28: Aim at the Goal
**Teacher note:** This Motion block appears inside the Space key touching Player condition. Confirm the Goal sprite is named Goal to appear in the dropdown.

## Slide 29: Pop the Ball forward
**Teacher note:** This is important. A small push might leave the Ball still touching Player, causing dribble code to interfere with the kick.

## Slide 30: Make a powerful shot
**Teacher note:** Put move 12 and wait 0.03 INSIDE repeat 16, which is inside the Space touching Player if, after move 60. A total possible shot distance is 60 + 16*12 = 252 Scratch steps.

## Slide 31: First shot test
**Teacher note:** Students may need to dribble past the halfway line first; the kick distance is intentional. If the ball leaps unexpectedly when walking, delete any repeat that was mistakenly placed in the dribble if.

## Slide 32: Keep score
**Teacher note:** A variable is a labeled number that can change during the game.

## Slide 33: Make a Score variable
**Teacher note:** Make Score available to all sprites. On the Stage in the supplied project, Score already exists.

## Slide 34: Start at zero
**Teacher note:** Insert this at the beginning of Ball’s green flag stack, before or after the starting Ball position.

## Slide 35: Did it touch the Goal?
**Teacher note:** Inside Ball forever add a SECOND if after the dribble if. The goal detection belongs in the Ball sprite, not Goal.

## Slide 36: Give the Player a point
**Teacher note:** Put both INSIDE the touching Goal if. The say block pauses that stack briefly.

## Slide 37: First to 3 wins!
**Teacher note:** Use green Operators = and orange Score variable bubble inside the smaller if. Put it below the Score+1 and GOAL announcement, inside the Goal touching branch.

## Slide 38: Reset the Ball
**Teacher note:** In the Ball touching Goal if, BELOW the win check, reset Ball and send a new ResetPlayer message. Students must choose New Message and name it ResetPlayer exactly.

## Slide 39: Reset the Player
**Teacher note:** Switch to Player to create this separate new stack. Test scoring twice and verify Score remains 2 and sprites reset after each goal.

## Slide 40: Scoreboard check
**Teacher note:** If score never changes, check touching Goal on Ball. If score increments multiple times, ensure Ball resets inside goal if. If the Player does not reset, check broadcast and receive spellings.

## Slide 41: Add a goalkeeper
**Teacher note:** Goalie uses an independent script, separate from Ball and Player.

## Slide 42: Choose a Goalie
**Teacher note:** Use position x=195, y=0, size 70%. Keep Goal behind Goalie. The provided sample project uses x 195.

## Slide 43: Place your Goalie
**Teacher note:** Select Goalie and create this setup. Size affects difficulty. You can also add show block to ensure the sprite appears after resets.

## Slide 44: Patrol up and down
**Teacher note:** Both glide blocks must be INSIDE Goalie forever. Uploaded project differs: it uses y ±50 and 2 sec; adjust for this lesson to y ±80 and 2.5 sec.

## Slide 45: Check for a save
**Teacher note:** Switch back to Ball. Add another if inside the Ball forever loop. The written lesson calls it the third if, after dribble and goal detection. If goal/save happen at exactly the same time, detection order may matter.

## Slide 46: Saved!
**Teacher note:** Put these two inside Ball touching Goalie if. The Player stays where they are on a save; only a GOAL broadcasts ResetPlayer.

## Slide 47: Beat the clock
**Teacher note:** This is a NEW flag-clicked stack on Ball. If students place this after forever in the same stack, the timer never starts.

## Slide 48: Add the match clock
**Teacher note:** Use a second all-sprites variable, Time. It should be separate from Score.

## Slide 49: Start with 60 seconds
**Teacher note:** Start a new Ball green flag stack for the clock. This is NOT below the Ball forever loop.

## Slide 50: Keep going until zero
**Teacher note:** Use Control repeat until, Operators <, and the Time variable bubble. The blocks on the next slide go INSIDE it.

## Slide 51: Tick... tock...
**Teacher note:** Place wait then change Time by -1 INSIDE repeat until. Students should be able to watch the number fall once per second.

## Slide 52: Full time!
**Teacher note:** These two blocks go AFTER repeat until, still in the new timer flag stack. If Score reaches 3 first, the win branch stops all scripts.

## Slide 53: Kickoff! Play the game
**Teacher note:** Ask each student to test a full match. Make sure pressing Space from far away does nothing, saved shots do not score, and Score resets when the green flag is clicked.

## Slide 54: Bonus challenges
**Teacher note:** All four challenges are optional extensions. They require more experimentation and are not needed for the base game.

## Slide 55: Speed Boots
**Teacher note:** Add a fifth if INSIDE Player forever. Extra move 4 steps is in addition to movement from the arrow key. Ask: why does the player sometimes outrun the ball?

## Slide 56: Fix the fast dribble
**Teacher note:** In the Ball touching Player branch, change move 6 to move 10. Compare 6 and 10 for how smooth the dribble feels. This changes normal dribbling too; a conditional speed boost is a more advanced fix.

## Slide 57: Meet Player 2
**Teacher note:** Duplicate Player, rename Player2, and give it a different costume color. Modify Player2 green flag starting position. Be sure reset code for Player2 is updated too.

## Slide 58: WASD controls
**Teacher note:** Duplicate the Player movement logic to Player2 and replace four arrows with W=up, A=left, S=down, D=right. Show this W example, then ask kids to make the other three.

## Slide 59: Either player can dribble
**Teacher note:** In Ball forever replace the touching Player condition with an Operators OR containing two Sensing touching blocks. The Ball needs extra logic to pick WHICH player’s direction; a simple direction-of-Player still follows Player1 even when Player2 touches. For the extension, add two separate dribble branches for each player or a direction selection if/else. Explain limitation clearly.

## Slide 60: Player 2 can shoot
**Teacher note:** Make a SECOND key stack on Ball for F. Continue by adding the same move 60 and repeat 16 → move 12 → wait 0.03 kick travel from Player 1, or the kick may fight dribbling. For truly competitive 2-player scoring, build a second Goal and separate scores; one Score variable only counts shared goals.

## Slide 61: Slippery Ball
**Teacher note:** Make a variable KickSpeed for Ball only. In the Space kick stack, replace the fixed repeat kick with a fading-speed loop. Note that preserving move 60 may be necessary to free the Ball from the Player.

## Slide 62: Make the Ball slow down
**Teacher note:** The move block uses the orange KickSpeed variable bubble instead of the number 12. It belongs inside repeat until.

## Slide 63: Add friction
**Teacher note:** Both blocks belong inside the same repeat until loop, after move KickSpeed steps. Ask children: how would changing -1 to -2 affect stopping distance?

## Slide 64: Golden Goal
**Teacher note:** Create a GoldenGoal variable; initialize to 0 at match start. On timeout, set it to 1 instead of immediately stopping. In a one-player game this is an overtime rule, not a true tie. A real two-player tie needs two scores.

## Slide 65: Overtime begins
**Teacher note:** In the time-up stack, remove stop all and display the Golden Goal message after setting GoldenGoal to 1. The existing win-at-3 code remains unless teacher chooses a different rule.

## Slide 66: The next goal wins
**Teacher note:** Put this inside Ball touching Goal branch after score updates. GoldenGoal must have been reset to 0 at the start of every match. This implements single-player overtime; two-player golden goal additionally needs team identification and separate scores.

## Slide 67: You built a real game!
**Teacher note:** Ask students to showcase one feature they built and one bug they fixed. Remind them to save the project with a memorable name and share it if their classroom settings permit.
