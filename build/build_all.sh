#!/bin/zsh
# Full rebuild: blocks → assets → HTML/PNG/PDF render + layout QA → PPTX → code verification → teacher guide → output/
# Chromium steps need to run outside the macOS sandbox (mach-port restriction).
set -e
cd "$(dirname "$0")"
OUT=../output
mkdir -p $OUT render
node gen_blocks.js
node render_blocks.js blocks.json blocks
node assets.js
node render_html.js render
node build_pptx.js $OUT/KeenKids_Soccer_Striker_FINAL.pptx
unzip -p ../KeenKids_Soccer_Striker_Teacher_Reference.sb3 project.json > render/ref_project.json
node verify_code.mjs render/ref_project.json > render/code_verification.txt
node gen_guide.js $OUT/Teacher_Guide_FINAL.md
cp render/deck.pdf $OUT/KeenKids_Soccer_Striker_FINAL.pdf
cp render/contact_sheet.png $OUT/KeenKids_FINAL_Contact_Sheet.png
rm -rf $OUT/fonts && mkdir -p $OUT/fonts && cp fonts/static/*.ttf fonts/OFL-*.txt $OUT/fonts/
node check_outputs.js $OUT
