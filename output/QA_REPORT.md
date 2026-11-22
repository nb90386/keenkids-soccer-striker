# QA Report: KeenKids Soccer Striker FINAL

Date: 2026-11-16. Scope: the 67-slide deck (25 steps + C1–C4), its PDF, teacher guide and the Scratch projects it teaches.

## Summary

| Check | Result | Evidence |
|---|---|---|
| 67 slides, same order, every step 1–25 and C1–C4 present | **PASS** | Baseline vs FINAL diff: same slide types and step numbers on all 67 slides; 2 titles changed (see “Differences”) |
| Every coding slide shows 1–3 new command blocks | **PASS** (43 of 43) | `verify_code.mjs` counts the blocks parsed by scratchblocks |
| Blocks render as real Scratch 3 blocks (no unknown/red blocks) | **PASS** (43 of 43) | scratchblocks 3.7.1, `scratch3` style; label strings checked against scratch-blocks `msg/en.json` |
| Each base-game slide matches the Teacher Reference project (sprite, opcode, nesting, order, values) | **PASS** 30 of 31, plus 1 documented difference | Slide 52 says `FULL TIME!`; the project says `FULL TIME! 🏁` (noted on the slide) |
| Verifier catches real errors (control run on the *original* project) | **PASS** | Correctly fails slides 37, 44, 46, 52: win text, Goalie glide, Saved! timing, emoji |
| Dribble branch contains only `point in direction (direction of Player)` + `move 6` | **PASS** (reference) / bug confirmed (original) | Original: `[pointindirection, movesteps, repeat]`; reference: `[pointindirection, movesteps]` |
| Game actually runs: base game in the real Scratch engine | **PASS**, with quirks below | scratch-vm 5.0.300 + scratch-render 2.2.84 in headless Chromium, 30 fps. `QA_Gameplay_Test_Results.md` |
| Challenge extensions C1–C4 run as taught | **PASS**, with fixes added to slides | Variant .sb3 files built from the reference and run in the same engine |
| Layout: no text overflow, clipping, off-slide or overlapping content | **PASS** (67 of 67, 0 issues) | Automated DOM check on the shared layout, also at 95% box width to leave room for wrapping differences |
| PPTX: 67 slides, 67 speaker-notes pages, 16:9, only Literata + Figtree | **PASS** | `output_checks.json` |
| PDF: 67 pages, 13.333 × 7.5 in, fonts embedded | **PASS** | 6 TrueType subsets embedded (Literata Regular/Bold/Italic, Figtree Regular/Bold/Italic) |
| Original `Soccer_Striker!.sb3` unchanged | **PASS** | SHA-1 `010de5b4b72f3cd60d4a422528fdbe8ccb6faa52` before and after |
| PPTX opened in PowerPoint, Keynote or Canva | **NOT VERIFIED** | See “What was not verified” |
| Canva import of FINAL | **NOT DONE** | Canva access works, but no available tool can import a local .pptx faithfully (see “Canva”) |

## How rendering was done

LibreOffice is not installed, and installing it was blocked by the permission system. So each slide is built once as positioned elements in `build/layout.js`, and that one geometry feeds:
1. `build_pptx.js`: the editable PowerPoint (PptxGenJS 4.0.1). Text, shapes, chips, monitors and mock-ups are native, editable PowerPoint objects. Scratch blocks and sprite art are high-resolution PNGs (5× density).
2. `render_html.js`: a Chromium render of the same elements with the same static fonts and exact point-based line spacing. It produces the slide PNGs, the contact sheet, the FINAL PDF and the automated layout QA.

The PDF is therefore the **Chromium render of the shared layout**, not a PowerPoint export. Positions, sizes, colours and fonts are identical by construction. Line breaks can differ slightly in PowerPoint, so every text box was also checked at 95% of its width and none overflowed.

## Inputs inventory

| File | Check |
|---|---|
| `KeenKids_Soccer_Striker_Scratch_Lesson.pptx` (baseline) | 67 slides; SHA-1 `de28fbab…`; left unchanged |
| `KeenKids_Soccer_Striker_Slide_Notes.json` | 67 entries; titles, steps and blocks diffed against FINAL |
| `KeenKids_Soccer_Striker_Teacher_Reference.sb3` | Valid project.json; sprites Stage, Player, Ball, Goalie, Goal; globals Score, Time; broadcast ResetPlayer. SHA-1 `dee04600…`, unchanged |
| `Soccer_Striker!.sb3` | Valid; unchanged |
| KeenKids site (keenkids-storybook-preview.vercel.app) | Tokens read from live CSS: paper #F7F3E9, card #FFFCF5, forest #254638, accent #D8DFD2, border #DDD7CB, gold #C9A05A, Figtree body. **Note:** the live site’s heading font is now *Brygada 1918*, not Literata. The deck follows the brief (Literata); swapping the serif is a one-line change in `layout.js`. |

## Technical correctness (the 12 non-negotiables)

| # | Requirement | Where | Status |
|---|---|---|---|
| 1 | Sprite named on every switch; Score/Time global | Every coding slide has a sprite breadcrumb; a gold “SWITCH TO …” chip appears on all 9 sprite changes (slides 19, 26, 39, 43, 45, 55, 56, 57, 59). Score/Time setup slides show “For all sprites” | PASS |
| 2 | Player start (-170, 0), dir 90, size 60%; four separate ifs in forever; bounce below them | Slides 7–15; verified against the reference; gameplay: 5 px/frame in each direction | PASS (tested) |
| 3 | Ball (-120, 0); dribble = touching Player › direction **of Player** › move 6; no repeat | Slides 19–22; the repeat bug is flagged in the notes; gameplay: 6 px/frame vs original 198 px per touch | PASS (tested) |
| 4 | Goal is a sprite at about (222, 0) | Slide 25 + sprite-info mock-up with x 222, y 0 | PASS |
| 5 | Separate Space stack: if touching Player › point towards Goal › move 60 › repeat 16 {move 12, wait 0.03} = 252 | Slides 26–30 | PASS (tested: 258 px including the 6 px dribble push) |
| 6 | Score set 0; Goal branch +1, GOAL!, win at 3 + stop all, else reset + broadcast ResetPlayer; Player receive script | Slides 33–39 | PASS (tested: two goals → Score 2, both resets; third goal wins and stops) |
| 7 | Goalie (195, 0) 70%; glide 2.5 s to y 80 / -80; save says Saved! 1 s, Ball → (0, 0), Player stays | Slides 42–46 | PASS (tested: legs 2.51–2.54 s; Score unchanged on a save) |
| 7b | Goal and Goalie touched in the same frame | Tested, not assumed | **Goal branch runs first → counts as a goal** (3 of 3 trials); now stated on slide 45 |
| 8 | Separate clock stack: Time 60, repeat until Time < 1 {wait 1, change -1}, FULL TIME!, stop all | Slides 47–52; slide 49 warns about placing it after forever | PASS (tested; a tick is about 1.056 s, so a match lasts about 63 s) |
| 9 | C1 sprint + dribble 6 vs 10 trade-off | Slides 55–56 | PASS (tested: speed 9 with Z; move 6 gets outrun, move 10 keeps up). **Key changed Shift → Z** (Shift is not in Scratch 3’s menu) |
| 10 | C2 Player2 (120, 0) dir -90, WASD, correct dribble direction, F kick with move 60, single Score = shared | Slides 57–60 | PASS with fix: the OR version was **replaced** by a separate `touching Player2` branch (the OR version tested wrong). The F kick needs the Ball in front (see findings) |
| 11 | C3 KickSpeed 12, repeat until < 1, move KickSpeed, change -1, wait 0.03 | Slides 61–63 | PASS (tested: 138 px kick vs 252; noted with the arithmetic) |
| 12 | C4 GoldenGoal init 0; on timeout set 1 + GOLDEN GOAL!, no stop; next goal wins; single-player overtime, not a tie | Slides 64–66 + notes + guide | PASS (tested; the missing reset makes the next match end on its first goal, so the reset is now a visible block) |

## Code verification per slide (against the Teacher Reference project)

“New” = command blocks taught on the slide (reporters/booleans inside them are not counted separately, matching the lesson plan).

| Slide | Step | Sprite | New | Matches reference | Result |
|---|---|---|---|---|---|
| 7 | 04 | Player | 2 | ✓ | PASS |
| 8 | 05 | Player | 2 | ✓ | PASS |
| 9 | 06 | Player | 1 | ✓ | PASS |
| 11 | 07 | Player | 3 | ✓ | PASS |
| 12 | 08 | Player | 3 | ✓ | PASS |
| 13 | 09 | Player | 3 | ✓ | PASS |
| 14 | 10 | Player | 3 | ✓ | PASS |
| 15 | 11 | Player | 1 | ✓ | PASS |
| 19 | 13 | Ball | 3 | ✓ | PASS |
| 20 | 14 | Ball | 1 | ✓ | PASS |
| 21 | 14 | Ball | 1 | ✓ | PASS |
| 22 | 15 | Ball | 1 | ✓ | PASS |
| 26 | 17 | Ball | 1 | ✓ | PASS |
| 27 | 17 | Ball | 1 | ✓ | PASS |
| 28 | 18 | Ball | 1 | ✓ | PASS |
| 29 | 19 | Ball | 1 | ✓ | PASS |
| 30 | 19 | Ball | 3 | ✓ | PASS |
| 34 | 20 | Ball | 1 | ✓ | PASS |
| 35 | 21 | Ball | 1 | ✓ | PASS |
| 36 | 21 | Ball | 2 | ✓ | PASS |
| 37 | 21 | Ball | 3 | ✓ | PASS |
| 38 | 22 | Ball | 2 | ✓ | PASS |
| 39 | 22 | Player | 3 | ✓ | PASS |
| 43 | 23 | Goalie | 3 | ✓ | PASS |
| 44 | 23 | Goalie | 3 | ✓ | PASS |
| 45 | 24 | Ball | 1 | ✓ | PASS |
| 46 | 24 | Ball | 2 | ✓ | PASS |
| 49 | 25 | Ball | 2 | ✓ | PASS |
| 50 | 25 | Ball | 1 | ✓ | PASS |
| 51 | 25 | Ball | 2 | ✓ | PASS |
| 52 | 25 | Ball | 2 | ✗ | PASS (documented) |
| 55 | C1 | Player | 2 | n/a (bonus) | PASS |
| 56 | C1 | Ball | 1 | n/a (bonus) | PASS |
| 57 | C2 | Player2 | 2 | n/a (bonus) | PASS |
| 58 | C2 | Player2 | 3 | n/a (bonus) | PASS |
| 59 | C2 | Ball | 3 | n/a (bonus) | PASS |
| 60 | C2 | Ball | 3 | n/a (bonus) | PASS |
| 61 | C3 | Ball | 1 | n/a (bonus) | PASS |
| 62 | C3 | Ball | 2 | n/a (bonus) | PASS |
| 63 | C3 | Ball | 2 | n/a (bonus) | PASS |
| 64 | C4 | Ball | 1 | n/a (bonus) | PASS |
| 65 | C4 | Ball | 2 | n/a (bonus) | PASS |
| 66 | C4 | Ball | 3 | n/a (bonus) | PASS |

## Gameplay findings that changed the slides

All measured in the real Scratch engine. Full tables: `QA_Gameplay_Test_Results.md`.

1. **Standing still never kicks.** The dribble code pushes the Ball 6 steps away before the kick checks `touching Player`. Kicks work while walking into the Ball. *Added:* tip on slide 27, checkpoint item and bug fix on slide 31, guide fix-it row.
2. **Layer order decides whether kicks work.** With the Ball in front (project default) about 10 of 12 kicks work. With the Player in front (after dragging the Player on the Stage, or after duplicating it into Player2) **0 of 12** work. Dragging the Ball on the Stage restores 10 of 12, including Player2’s F-kick in C2. A `go to front layer` block only takes effect from the second green flag, so it is not taught. A quick click does not change layers; a drag or a 400 ms hold does (scratch-gui 15.3.0 `stage.jsx`). *Added:* slide 31 and 57/60 notes, guide.
3. **About 1 kick in 6 misses** even when done right, when the sprites only just touch. *Added:* guide (“try again is normal”).
4. **Goal beats Goalie** when both are touched in the same frame. *Added:* slide 45 note.
5. **The clock runs about 5% slow** (a 60 s match lasts about 63 s). *Added:* slide 52 note.
6. On a save, the rest of the kick can carry the Ball into the net while “Saved!” shows (no goal is counted). In one run on a slow frame, leftover kick steps moved the Ball 48 px after a reset. *Added:* guide.

## Differences from the baseline deck

**Whole deck.** Each slide was rebuilt on the same 67-slide plan:
- Generic coloured bars with typed syntax (e.g. `if <key [right arrow] pressed?> then`) are replaced by real Scratch 3 block renders with correct shapes, category colours, dropdowns and nesting.
- Code text projects at 21.6–31.2 pt (median 31.2 pt): 31 slides at ≥ 26 pt, 8 at 24–26 pt, 4 at 21.6–23.7 pt (slides 14, 19, 59, 60, the widest or tallest 3-block scripts).
- Every coding slide gained a sprite + placement breadcrumb, a “SWITCH TO” chip on sprite changes, and a 27–28 pt “What it does” explanation.
- Typography switched from Georgia/Aptos to Literata/Figtree, with tokens taken from the live KeenKids site.
- Setup slides got real sprite art and Scratch UI mock-ups (sprite info, New Variable dialog, variable monitor, sprite right-click menu).
- Checkpoints use real gameplay captures from the engine instead of the same static image.
- Progress (“Step 7 of 25 · 11 / 67”) moved top-right; footer removed to give code more height.
- Speaker notes are now structured: SPRITE / WHERE / BLOCKS / SAY / DO / WATCH FOR / TEACHER NOTE.

**Content changes** (each one is marked as a TEACHER NOTE in that slide’s speaker notes):

| Slide | Baseline | FINAL | Why |
|---|---|---|---|
| 2 | “Score 3 goals before time runs out” | “Score 3 goals in 60 seconds” | Fits one line at 24 pt |
| 19 | Why: “Ball near the middle” | “Ball starts just in front of the Player” | x: -120 is not the middle |
| 21 | Note: Sensing block starts as “x position of Stage” | “backdrop # of Stage” | Checked in scratch-gui source |
| 27, 31 | — | Kick while walking into the Ball; Ball-in-front fix | Tested behavior |
| 45 | “detection order may matter” | Goal wins (tested) | Tested, not assumed |
| 51 | “Tick... tock...” | “Tick… tock…” | Typography only |
| 55 | `key [shift] pressed?` | `key (z) pressed?` | No Shift in Scratch 3’s key menu |
| 59 | “Either player can dribble”: `touching Player or touching Player2` | “Player 2 can dribble too”: separate if with `direction of Player2` | OR version follows Player 1’s direction (tested) |
| 60 | Kick blocks listed | + reminder to add move 60 / repeat on slide; Ball-in-front fix in notes | F kick failed 0/9 without it |
| 63 | — | Note: kick is 138 steps, try KickSpeed 18 for 231 | Tested distance |
| 64 | `set GoldenGoal to 1` | `set GoldenGoal to 0` (start of match) | Missing reset broke the next match (tested) |
| 65 | `say GOLDEN GOAL!` | `set GoldenGoal to 1` + `say GOLDEN GOAL!` | Moved from 64; still 2 new blocks |
| 33, 48 | — | No sprite chip (variables are global) | Accuracy |

## Visual QA

- **Automated (all 67 slides):** text overflow at 100% and 95% width, words wider than their box, text or images off-slide, missing images, overlap between title/body/code/screenshot elements, embedded font load. Final run: **0 issues**.
- **Human-style pass:** I looked at the full contact sheet and these slides at full 1920×1080: cover (1), mission (2), chapters (3, 24), setup (4, 6, 33), lesson single block (21, 27), 3-block (11, 59), checkpoints (31) and finish (67). Fixes made from that pass:
  - cover title collided with the arch art;
  - tip box overflowed (21);
  - doubled “Tip” label (59);
  - chip text wrapped;
  - title sat too close to its chip;
  - mission row wrapped;
  - missing ↓ key (2);
  - repeated caption (4);
  - misleading sprite chip on global-variable slides (33, 48);
  - tip boxes left empty space.
- Category colours come straight from scratchblocks’ Scratch 3 palette (Motion #4C97FF, Looks #9966FF, Events #FFBF00, Control #FFAB19, Sensing #5CB1D6, Operators #59C059, Variables #FF8C1A). No swaps are possible by construction.
- Contact sheet: `KeenKids_FINAL_Contact_Sheet.png`.

## Canva

- Access is authenticated. A read-only search found the existing baseline “KeenKids — Soccer Striker! Scratch Coding Lesson (Grades 3–4)”, a 67-page presentation. It was **not modified**.
- The FINAL deck was **not imported**. The agent upload endpoint rejected the .pptx (“Unsupported file format ZIP”). The URL importer requires a public URL, and the deck was not put on third-party hosting to get one. The design generator would redesign the slides rather than import them.
- **To import:** in Canva choose Create a design › Import file (or drag the .pptx onto the Canva home page) and select `KeenKids_Soccer_Striker_FINAL.pptx`. Then check it opens as a presentation with 67 pages, that Literata/Figtree are applied (both are in Canva’s font library), and that the speaker notes came across.

## What was not verified

- **PowerPoint / Keynote / Canva rendering of the .pptx.**
  - The Keynote 15.1.1 AppleScript export did not finish: the first attempt hit the 2-minute AppleEvent timeout, and the second (15-minute timeout) was still waiting. Keynote may be showing an import dialog.
  - No PowerPoint is installed.
  - Open the .pptx once on the presenting computer and page through it.
- **Fonts on the presenting computer.** Literata and Figtree are not installed on this Mac. Without them PowerPoint substitutes fonts and line breaks change. Static TTFs are in `output/fonts/`; install them first, or present from the PDF.
- **Classroom timing and student comprehension** (no class run).
- **Real keyboards / OS key-repeat, scratch.mit.edu’s live editor and Chromebooks.** Gameplay used VM-level key events on one machine.
- How the 🏁 emoji in the reference project’s “FULL TIME!” looks on classroom devices.
- The `distance to Player < 50` kick alternative was only partly tested (12/12 from the side, 4/12 from above), so it is not taught.

## Rebuild

`build/build_all.sh` regenerates everything from `build/content.js` (single source for slides, notes and guide). Pinned tools: pptxgenjs 4.0.1, scratchblocks 3.7.1, playwright-core 1.65.1, pdf-lib 1.17.1, installed with `--ignore-scripts`. Chromium steps must run outside the macOS sandbox.
