# Soccer Striker: Gameplay Test Results

Every result below comes from running the projects in the real Scratch engine: scratch-vm 5.0.300 with scratch-render 2.2.84 and scratch-storage 6.2.1, inside headless Chromium (WebGL via SwiftShader). The VM was set to compatibility mode, which gives 30 fps like the Scratch 3 editor; measured rate was 30.3 fps. Keys were sent with `vm.postIOData('keyboard', …)`. Raw data is in `results.json`.

Where a test set up a scenario by teleporting sprites, the method column says so. A "realistic kick" means: teleport Player with the Ball 38 px ahead, hold the right arrow until they touch, press space while the arrow is still held, then release both keys. Kicking while standing still does not work (see finding 1).

`Soccer_Striker!.sb3` is unchanged. `shasum` gives `010de5b4b72f3cd60d4a422528fdbe8ccb6faa52` before and after the tests. The reference file is also unchanged (`dee0460019c5f481ca3e2b6769bce607cb52ff89`).

## Base game (reference sb3)

| # | Test | Method | Measured result | Status |
|---|---|---|---|---|
| 1 | Initial state | Green flag, read state at frame 3 | Player (-170,0), dir 90, size 60. Ball (-120,0). Goalie x=195, size 70. Score 0, Time 60. | PASS |
| 2 | Arrow keys | Ball moved to (-200,140) and Player to (0,-20); each key held 12 frames | Right, left, up and down each moved exactly 5.00 px every frame. Directions were 90, -90, 0 and 180. | PASS |
| 2b | Edge bounce | Player teleported near each edge; key held 20 frames | Player jitters at the edge (e.g. x 223–223.5) and stays on stage. Its outer edge reached at most 240.5 / -240.5 / 180.3 / -180.7, which is within 1 px. | PASS |
| 3 | Dribble (reference) | Hold right from the start position for 45 frames | Ball moved 6 px on 35 of 42 frames (pattern 6,6,6,6,6,0) and never more than 6 in one frame. Ball dir = Player dir = 90. | PASS |
| 3b | Dribble (original) | Same scenario on `Soccer_Striker!.sb3` | First touch moved the Ball 18 px (6 + 12) in one frame. Then +12 every other frame. Total 198 px per touch over about 31 frames (about 1 s), with the Ball running up to 78 px ahead of the Player. Repeats on the next touch. | Bug confirmed |
| 4a | Space, not touching | Start position (edges 15 px apart), press space | Ball did not move: (-120,0) before and after. | PASS |
| 4b | Space, touching (realistic kick) | From (-170,0) and from (-190,120) | Ball pointed at the Goal: measured 108.06° vs computed 107.79° from the off-axis start. Distance was 258 and 257.7 px: a 6 px dribble push in the same frame, then 60 + 16×12 = 252. The 12 px steps land every other frame, so the kick lasts about 31 frames (about 1.05 s). | PASS |
| 5 | Goals 1 and 2 | Realistic kick from (90,-60), waiting until Goalie y > 50. Player turned to dir 180 after the kick so the reset is visible. | Each goal said "GOAL!", and Score went 0→1→2 with no double counts over 130 frames. After about 1 s the Player went to (-170,0) dir 90 and the Ball to (0,0). In goal 1 the Ball then drifted to (39.7,27.0); see finding 3. | PASS (with quirk) |
| 6 | Goal 3 = win | Same kick a third time | Said "GOAL!", then "GOAL! YOU WIN!". Stop all came about 3 s after the kick, leaving 0 threads. Time froze at 45, the Goalie froze, and the up arrow did nothing. The bubble cleared when everything stopped. | PASS |
| 7 | Goalie patrol | Logged Goalie y for 340 frames | y ranged from -80 to 80 with x always 195. Legs took 2.541, 2.508 and 2.540 s. For comparison, the original went ±50 with legs of 2.01–2.05 s. | PASS |
| 8 | Save | Waited until \|Goalie y\| < 8, then a realistic kick from (30,0) | "Saved!" appeared while the Ball touched the Goalie but not the Goal. Score stayed 0, Player stayed put (35→40, only its own movement), and the Ball went to (0,0). While "Saved!" was showing, the leftover kick carried the Ball on into the net (x=243); no goal was counted. | PASS (with quirk) |
| 9 | Goal and Goalie touched in the same frame | Ball teleported to (goalie.x + 10/12/15, goalie.y); confirmed touching both | All 3 trials ran the goal branch: "GOAL!", Score +1, Player reset. "Saved!" never appeared. The Goal `if` comes first, and its 1 s say plus go-to (0,0) means the Goalie check later finds nothing. | Observed: goal wins |
| 10 | Clock / full time | Real time, 66 s run | Time dropped by 1 every 1054–1058 ms (32 frames), not every 1000 ms. 60→0 took 62.6 s, and "FULL TIME! 🏁" showed at 63.4 s. The text ends with U+1F3C1 🏁. Stop all came 2 s later: 0 threads, Goalie frozen, keys ignored. | PASS (with timing note) |

## Challenge variants (`variants/*.sb3`, built from the reference project.json)

| Variant | Method | Measured result | Status |
|---|---|---|---|
| C1 Speed Boots (`if key z pressed then move 4` added as a 5th `if`) | Ball moved out of the way; keys held 10 frames | z + right = 9 px/frame. z + up = 9. Right only = 5. z alone also moves 4 px/frame in the current facing direction. | PASS |
| C1 outrun, dribble move 6 | z + right held from the start for 40 frames | Player passes the Ball (Ball behind the Player's centre from frame 12). The Ball is pushed 6/frame while they overlap, then left behind: Ball at x=18, Player at 190. | Player outruns the Ball |
| C1 outrun, dribble move 10 | Same | Ball stays 27–36 px ahead, then stops at x=170 when the Goalie saves it ("Saved!" at frame 36). | Ball keeps up |
| C2a OR version (`touching Player or Player2`, `direction of Player`) | Ball moved to (60,0); Player2 walks left (A) | Ball moved at dir **90** (Player 1's direction), +6/frame, *into* Player2. It ended behind Player2 (Ball 96, Player2 -30). | Bug shown |
| C2b separate branch (`direction of Player2`) | Same | Ball moved at dir -90, -6/frame, and stayed ahead of Player2 (Ball -66, Player2 -30). Player 1's dribble still worked (+132 px at dir 90). | PASS |
| C2 F kick for Player2 (`move 60 + repeat 16`) | Player2 at (-60,120) facing left, Ball 38 px ahead. Hold A for n = 1..9 frames, then press F. | **C2b: 0 of 9 kicks.** The Ball was never touching Player2 by the time the kick script checked; see finding 1. C2a: 5 of 9 (n = 1–5), 257.6 px toward the Goal. F with no contact: no movement. Space with only Player2 in contact: no kick. | **FAIL in C2b** |
| C3 Friction kick | Realistic kick from 2 positions | Steps of 60 then 11, 10 … 1 (78 px); the first 12 is folded into the frame with the 60 and the 6 px push. Total 144 = 6 push + 60 + 78 = 6 + **138**. The reference kick was 258 = 6 + 252. KickSpeed ends at 0. Lasts about 23 frames vs 31. | PASS |
| C4 Golden Goal (Time shortened to **3** s for testing) | Run 1: wait out the clock, then score | "GOLDEN GOAL!" at 3.2 s. The game kept running: 3 threads, Goalie moving, Player moved 50 px with up arrow. The next goal said "GOAL!", then "YOU WIN!", then stopped (0 threads). | PASS |
| C4 second green flag, with `set GoldenGoal to 0` | Green flag again; score at Time = 2 | GoldenGoal went back to 0. The goal said only "GOAL!" and the game kept going. | PASS |
| C4 second green flag, *without* the reset line | Same | GoldenGoal was still **1**. The first goal said "GOAL!", then "YOU WIN!", then stopped with 2 s still on the clock. | Bug shown |

## Screenshots (`shots/`, 480×360 plus `@2x` 960×720, rendered by scratch-render)

`start`, `dribble`, `kick` (Ball in flight, 7 frames after the kick), `goal` (GOAL! bubble), `saved` (Saved! bubble, the frame it appears) and `fulltime`. In `goal.png` the Player is at the teleported kick spot (100,-60), not the start. In headless Chromium the 🏁 draws as a monochrome checkered-flag glyph. Whether it draws in colour on classroom devices was not tested.

## Surprising findings

1. **Whether a kick works depends on script order, and dragging a sprite on the stage can break kicking completely.** Each frame, Scratch runs the green-flag scripts top layer first. The order is fixed when the green flag is clicked.
   - **Default layer order (Ball above Player):** the Ball's dribble check runs first, then the Player moves into the Ball, then the space script sees "touching". Kicks while running worked 10/12 and 16/19 in two sweeps. They fail about 1 frame in 6, when the edges are about 0.1 px apart.
   - **Standing still:** pressing space after stopping never kicks. The dribble loop pushes the Ball 6 px out of contact before the kick script checks.
   - **Player brought to the front (Ball below Player):** kicks worked **0/12**. Dragging the Player on the stage in the editor does this; scratch-gui `stage.jsx` calls `target.goToFront()`. Same cause for Player2 in C2b (0/12), since a duplicated sprite lands on the top layer. Moving the Ball to the front before the green flag brought it back to 10/12.
   - **Candidate fix, partly tested (`variants/x_fix_kick_distance50.sb3`):** `if (distance to Player) < 50` instead of `touching Player`. It worked 12/12 with either layer order when approaching from the side. Approaching from above it worked only 4/12, so the threshold or condition needs more work.
2. **The clock runs slow.** `wait 1` plus the loop's yield makes each tick 32 frames (about 1.056 s). A "60-second" game lasts about 63.4 s before FULL TIME.
3. **The kick outlasts the 1 s GOAL!/Saved! bubble.** `wait 0.03` takes 2 frames per repeat, so a kick lasts about 1.05 s and ends right at the 1 s say. In one goal run, a single 325 ms frame hitch (the first speech bubble being created) let 4 leftover kick steps move the Ball 48 px *after* it had reset to (0,0). With steady frames (2 more trials) there was no drift. On slow devices this is likely to show up.
4. **During "Saved!" the Ball keeps flying into the net** until the 1 s bubble ends, because the kick script is still running. No goal is counted, but it looks like one.
5. **Original bug, size:** the extra `repeat 16` turns each touch into a 198 px burst lasting about 1 s. While the burst runs, the Ball's forever loop is stuck inside it, so it cannot check the Goal or Goalie (inferred from the script; **not tested**).
6. **C4 bubble overlap (side effect of the 3-second clock):** in the no-reset run, "GOLDEN GOAL!" replaced the "YOU WIN!" bubble because the clock ran out during it.

## Harness limitations and untested items

- Only headless Chromium with the npm UMD builds was used, not the Scratch website or editor. Keyboard input is VM-level (`postIOData`), so OS key-repeat is not simulated. A held key fires the "when key pressed" script once.
- Timings come from one machine at about 30 fps. One startup frame took about 780 ms and one bubble-creation frame about 325 ms.
- Not tested: how the emoji looks on classroom devices; whether GoldenGoal persists if the project is saved after a run; the original's burst passing through the Goalie (finding 5); OS key-repeat on the kick.

## Files

- Harness: `harness.html` (page-side API `H`), `harness.js` (static server and Chromium), `lib/` (UMD builds)
- Tests: `run_base.js`, `run_variants.js`, `diag_kick_phase.js`, `diag_layer_order.js`, `diag_goal_creep.js`, `fps.js`, `smoke.js`
- Variant builder: `build_variants.js`; script dumper: `dump.js`; merge: `combine_results.js`
- Raw data: `results.json` (merged), plus `results_base.json`, `results_variants.json`, `results_kick_phase.json`, `results_layer_order.json`

## Follow-up: layer-order tests (`diag_followup.js`, raw data in `results_followup.json` and under `followUp_layerOrder` in `results.json`)

Method: realistic kick, 12 attempts each (hold the move key n = 1..12 frames, then press the kick key while still moving), on a fresh page each time. Each attempt waits 30 frames (1 s) after the green flag. "Dragged to front" means `target.goToFront()` was called before the green flag, which is what a stage drag does. The variants with `go to [front] layer` placed right under the hat of the Ball's first green-flag script (the clock script) are `variants/x_ref_ball_gotofront.sb3` and `variants/x_c2b_ball_gotofront.sb3`.

| Case | Layers, bottom→top (at test time) | Thread order each frame | Kicks |
|---|---|---|---|
| A: C2b, Ball dragged to front; Player2 F kick | …Player>Player2>Ball | Ball, Ball, Player2, Player, Goalie | **10/12** |
| A: C2b, Ball dragged to front; Player1 space kick | same | same | **10/12** |
| Control: reference, default layers | …Player>Ball | Ball, Ball, Player, Goalie | 10/12 |
| Control: reference, Player dragged to front | …Ball>Player | Player, Ball, Ball, Goalie | 0/12 |
| B: reference + `go to front` block, Player dragged to front, **first** green flag | …Player>Ball (the block did move the Ball up) | Player, Ball, Ball, Goalie (unchanged) | **0/12** |
| B: same, after a **second** green flag | …Player>Ball | Ball, Ball, Player, Goalie | **10/12** |
| B in C2b: `go to front` block; Player2 F kick, first flag | …Player>Player2>Ball | Player2, Ball, Ball, Player, Goalie | **0/12** |
| B in C2b: same, after a second green flag | same | Ball, Ball, Player2, Player, Goalie | **10/12** |
| B in C2b: Player1 space kick, first flag | same | Player2, Ball, Ball, Player, Goalie | 10/12 (Player1's script already ran after the Ball's) |

The 2 misses in every 10/12 row fall on the known 1-in-6 phase, when the edges are about 0.1 px apart. Thread order is fixed when the green flag starts the scripts, top layer first. A `go to front layer` block running inside a green-flag script changes the drawing layer straight away, but the order scripts run in only changes on the *next* green flag. So the block does not fix the first run.

**Click vs drag (verified in source):** in `@scratch/scratch-gui` 15.3.0, `src/containers/stage.jsx` (from unpkg), `target.goToFront()` appears only in `onStartDrag`. That runs when the mouse moves more than 3 px while held (`dragThreshold = 3`), or when the mouse is held for 400 ms (`setTimeout(onStartDrag, 400)` in `onMouseDown`, cleared in `onMouseUp`). A quick click (under 400 ms and under 3 px) does not change layer order. A press-and-hold of 400 ms or more without moving *does* bring the sprite to the front. Not checked: whether the scratch.mit.edu deployment matches the npm 15.3.0 source exactly. The sprite-list thumbnails are not covered: that UI is not in stage.jsx, but scratch-vm 5.0.300 has no other layer-changing path apart from the looks layer blocks.
