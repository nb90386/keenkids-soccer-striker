const pptxgen = require('pptxgenjs');
const fs = require('fs');
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'KeenKids Enrichment';
pptx.subject = 'Soccer Striker in Scratch | Grades 3–4';
pptx.title = 'Soccer Striker! — KeenKids Scratch Coding Club';
pptx.company = 'KeenKids Enrichment';
pptx.lang = 'en-US';
pptx.theme = {headFontFace: 'Georgia', bodyFontFace: 'Aptos', lang:'en-US'};
const W=13.3333,H=7.5;
const C={paper:'F9F6EB',cream:'FFFDF7',ink:'243C30',forest:'254E38',leaf:'6F9572',mint:'DCE8D8',sun:'ECC46A',gold:'D29B31',coral:'E27F67',brown:'8B7158',line:'D9D1BF',warm:'F4E5C6',white:'FFFFFF',faint:'EDE8DA',peach:'F8E5D9'};
const K={Events:'FFBF00',Motion:'4C97FF',Looks:'9966FF',Control:'FFAB19',Sensing:'5CB1D6',Variables:'FF8C1A',Operators:'59C059'};
const pics='/mnt/data/soccer_pitch_preview.png';
const steps=[];
const push=(o)=>steps.push(o);
push({type:'cover',title:'Soccer Striker!',sub:'Build your own soccer game in Scratch',notes:'Open Scratch at scratch.mit.edu and start a new blank project. Tell students that today they will make a game with a player, a soccer ball, a goalie, goals, a score, and a countdown timer.'});
push({type:'mission',title:'Your mission today',sub:'Move • Dribble • Shoot • Score',items:['Arrow keys move your player','Space bar kicks toward the goal','Score 3 goals before time runs out'],notes:'Ask students to predict which Scratch features each action needs: key sensing, loops, and variables. No code on this slide.'});
push({type:'chapter',n:'01',title:'Build your soccer field',sub:'First, set the stage.',notes:'The stage is the background. Sprites are game characters or objects that can move.'});
push({type:'setup',step:'01',title:'Wave goodbye to the Cat',verb:'Right-click the Cat sprite and choose Delete.',tip:'We are building a soccer game, not a cat adventure.',illustration:'field',notes:'Students should start with a blank Scratch project. The uploaded reference project already has custom sprites; do not delete those if opening the finished file.'});
push({type:'setup',step:'02',title:'Paint your pitch',verb:'Choose Backdrops → Paint. Fill it green.',tip:'Add one white center line and one big center circle.',illustration:'field',notes:'Use a thick white brush. The stage in Scratch is 480 by 360 pixels. Keep the right edge clear enough for the Goal sprite.'});
push({type:'setup',step:'03',title:'Choose your Player',verb:'Choose a Sprite or draw your own.',tip:'Rename the sprite exactly Player.',illustration:'player',notes:'Point out the sprite name text box below the stage. The name Player is important because Ball scripts will look for that exact sprite.'});
push({type:'lesson',step:'04',title:'Start on the left',why:'The green flag is the game’s START button.',blocks:[['Events','when green flag clicked'],['Motion','go to x: -170  y: 0']],notes:'Select Player. Snap the blue go-to block under the yellow event block. Show that negative x means left of center.'});
push({type:'lesson',step:'05',title:'Face the goal',why:'Direction 90 points right, toward the goal.',blocks:[['Motion','point in direction 90'],['Looks','set size to 60 %']],notes:'Add both blocks under the Player flag stack. The Player looks right and fits on the pitch. Optional: set rotation style to left-right so the sprite does not flip upside down.'});
push({type:'lesson',step:'06',title:'Keep checking!',why:'Forever means “do this again and again.”',blocks:[['Control','forever']],notes:'Snap forever underneath Player setup. Every arrow-key if block goes INSIDE forever. Do not put the forever beneath another forever.'});
push({type:'chapter',n:'02',title:'Control your player',sub:'Four directions, one keyboard.',notes:'Students already have a Player flag stack with a forever loop. These slides insert code inside that loop.'});
push({type:'lesson',step:'07',title:'Right arrow → right',why:'If the right key is pressed, move toward the goal.',blocks:[['Control','if <key [right arrow] pressed?> then'],['Motion','point in direction 90'],['Motion','move 5 steps']],notes:'Place an if block inside Player forever. Insert a Sensing key-pressed hexagon into the if. Put point direction 90 and move 5 inside.'});
push({type:'lesson',step:'08',title:'Left arrow → left',why:'Negative 90 is the direction for left.',blocks:[['Control','if <key [left arrow] pressed?> then'],['Motion','point in direction -90'],['Motion','move 5 steps']],notes:'Add a NEW if below the right-arrow if inside forever, not inside the right-arrow if.'});
push({type:'lesson',step:'09',title:'Up arrow → up',why:'Direction 0 points straight up.',blocks:[['Control','if <key [up arrow] pressed?> then'],['Motion','point in direction 0'],['Motion','move 5 steps']],notes:'Scratch directions are unusual: 0 = up, 90 = right, 180 = down, -90 = left. Students can write a compass on paper.'});
push({type:'lesson',step:'10',title:'Down arrow → down',why:'Direction 180 points down.',blocks:[['Control','if <key [down arrow] pressed?> then'],['Motion','point in direction 180'],['Motion','move 5 steps']],notes:'Add the fourth separate if. Run game and press each arrow to debug directions.'});
push({type:'lesson',step:'11',title:'Stay on the field',why:'The player bounces instead of moving offscreen.',blocks:[['Motion','if on edge, bounce']],notes:'Place this block at the bottom INSIDE Player forever, after the four arrow-key if blocks.'});
push({type:'check',title:'First play test',sub:'Can you move in all four directions?',cue:'Press the green flag. Try ↑ ↓ ← →.',notes:'Pause for one-minute student test. If controls do not work, confirm each if is inside forever and the code is on Player.'});
push({type:'chapter',n:'03',title:'Make the ball move',sub:'Now you can dribble.',notes:'Students switch from Player to Ball. Different sprites have different scripts.'});
push({type:'setup',step:'12',title:'Add the soccer ball',verb:'Choose a soccer ball sprite and rename it Ball.',tip:'Set the Ball’s size to 45%.',illustration:'ball',notes:'Exact sprite name must be Ball. In some versions, a Soccer Ball sprite may be available or students can paint a circle.'});
push({type:'lesson',step:'13',title:'Set up the Ball',why:'Every new game begins with the Ball near the middle.',blocks:[['Events','when green flag clicked'],['Motion','go to x: -120  y: 0'],['Control','forever']],notes:'Select Ball, not Player. Make a new green flag stack. Keep the score reset in this same flag stack later.'});
push({type:'lesson',step:'14',title:'Only dribble when close',why:'The Ball should move only when your Player touches it.',blocks:[['Control','if <touching [Player]?> then']],notes:'Inside Ball forever, put if touching Player. Use light-blue Sensing block touching [Player]? (not touching mouse-pointer).'});
push({type:'lesson',step:'14',title:'Copy the Player’s direction',why:'The Ball travels where the Player is facing.',blocks:[['Motion','point in direction (direction of [Player])']],notes:'Critical: use Sensing reporter (x position of [Stage]) and change both dropdowns to direction of Player. Do not use Ball’s own direction bubble. This blue point block belongs inside the Ball touching Player if.'});
push({type:'lesson',step:'15',title:'Give the Ball a push',why:'The Ball moves 6 steps while the Player moves 5.',blocks:[['Motion','move 6 steps']],notes:'Add move 6 inside the Ball touching Player if, directly below point in direction of Player. Do NOT add repeat 16 here; the uploaded example file accidentally has an extra repeat and it should be removed.'});
push({type:'check',title:'Dribble test',sub:'Does the ball move when you bump into it?',cue:'Try dribbling all the way right.',notes:'If ball teleports or flies: check there is no repeat 16 inside Ball dribble if; make sure direction of Player and move 6 are the only movement blocks in that branch.'});
push({type:'chapter',n:'04',title:'Shoot and score',sub:'Turn your dribble into a real game.',notes:'Explain events and conditions: Space is an event; touching Player is the condition that allows a kick.'});
push({type:'setup',step:'16',title:'Paint the Goal',verb:'Paint a tall, thick white goal frame.',tip:'Name it Goal. Place it near x: 222, y: 0.',illustration:'goal',notes:'Sprite must be Goal (capital G). Make its frame thick enough for collision detection. Make sure it is a sprite, not only painted on the backdrop, so touching Goal can work.'});
push({type:'lesson',step:'17',title:'Space begins a kick',why:'This event listens for the Space bar.',blocks:[['Events','when [space] key pressed']],notes:'On Ball, start a NEW stack, separate from the Ball green-flag forever stack.'});
push({type:'lesson',step:'17',title:'You must reach the Ball',why:'Pressing Space far away should do nothing.',blocks:[['Control','if <touching [Player]?> then']],notes:'Snap this condition under the space key event. Everything needed to kick goes INSIDE this if.'});
push({type:'lesson',step:'18',title:'Aim at the Goal',why:'The Ball turns to face the Goal before moving.',blocks:[['Motion','point towards [Goal]']],notes:'This Motion block appears inside the Space key touching Player condition. Confirm the Goal sprite is named Goal to appear in the dropdown.'});
push({type:'lesson',step:'19',title:'Pop the Ball forward',why:'Moving 60 steps frees it from the Player.',blocks:[['Motion','move 60 steps']],notes:'This is important. A small push might leave the Ball still touching Player, causing dribble code to interfere with the kick.'});
push({type:'lesson',step:'19',title:'Make a powerful shot',why:'Repeat sends the Ball toward the goal in small jumps.',blocks:[['Control','repeat 16'],['Motion','move 12 steps'],['Control','wait 0.03 seconds']],notes:'Put move 12 and wait 0.03 INSIDE repeat 16, which is inside the Space touching Player if, after move 60. A total possible shot distance is 60 + 16*12 = 252 Scratch steps.'});
push({type:'check',title:'First shot test',sub:'Dribble closer, then kick!',cue:'Touch the ball and press Space.',notes:'Students may need to dribble past the halfway line first; the kick distance is intentional. If the ball leaps unexpectedly when walking, delete any repeat that was mistakenly placed in the dribble if.'});
push({type:'chapter',n:'05',title:'Keep score',sub:'Make every goal count.',notes:'A variable is a labeled number that can change during the game.'});
push({type:'setup',step:'20',title:'Make a Score variable',verb:'Open Variables → Make a Variable.',tip:'Name it Score. Keep its display checked.',illustration:'score',notes:'Make Score available to all sprites. On the Stage in the supplied project, Score already exists.'});
push({type:'lesson',step:'20',title:'Start at zero',why:'Every new match starts at 0 goals.',blocks:[['Variables','set [Score] to 0']],notes:'Insert this at the beginning of Ball’s green flag stack, before or after the starting Ball position.'});
push({type:'lesson',step:'21',title:'Did it touch the Goal?',why:'This checks if the Ball reaches the net.',blocks:[['Control','if <touching [Goal]?> then']],notes:'Inside Ball forever add a SECOND if after the dribble if. The goal detection belongs in the Ball sprite, not Goal.'});
push({type:'lesson',step:'21',title:'Give the Player a point',why:'Add 1 every time the Ball touches the Goal.',blocks:[['Variables','change [Score] by 1'],['Looks','say [GOAL!] for 1 seconds']],notes:'Put both INSIDE the touching Goal if. The say block pauses that stack briefly.'});
push({type:'lesson',step:'21',title:'First to 3 wins!',why:'When Score equals 3, the Player wins.',blocks:[['Control','if <(Score) = (3)> then'],['Looks','say [GOAL! YOU WIN!] for 2 seconds'],['Control','stop [all]']],notes:'Use green Operators = and orange Score variable bubble inside the smaller if. Put it below the Score+1 and GOAL announcement, inside the Goal touching branch.'});
push({type:'lesson',step:'22',title:'Reset the Ball',why:'A new kickoff begins in the center.',blocks:[['Motion','go to x: 0  y: 0'],['Events','broadcast [ResetPlayer]']],notes:'In the Ball touching Goal if, BELOW the win check, reset Ball and send a new ResetPlayer message. Students must choose New Message and name it ResetPlayer exactly.'});
push({type:'lesson',step:'22',title:'Reset the Player',why:'The Player hears the message and returns to the left.',blocks:[['Events','when I receive [ResetPlayer]'],['Motion','go to x: -170  y: 0'],['Motion','point in direction 90']],notes:'Switch to Player to create this separate new stack. Test scoring twice and verify Score remains 2 and sprites reset after each goal.'});
push({type:'check',title:'Scoreboard check',sub:'Can you score twice and see Score = 2?',cue:'A good game is tested after each new feature.',notes:'If score never changes, check touching Goal on Ball. If score increments multiple times, ensure Ball resets inside goal if. If the Player does not reset, check broadcast and receive spellings.'});
push({type:'chapter',n:'06',title:'Add a goalkeeper',sub:'A real challenge is coming.',notes:'Goalie uses an independent script, separate from Ball and Player.'});
push({type:'setup',step:'23',title:'Choose a Goalie',verb:'Add or draw a new sprite named Goalie.',tip:'Place it in front of the goal.',illustration:'goalie',notes:'Use position x=195, y=0, size 70%. Keep Goal behind Goalie. The provided sample project uses x 195.'});
push({type:'lesson',step:'23',title:'Place your Goalie',why:'The goalkeeper starts in front of the net.',blocks:[['Events','when green flag clicked'],['Motion','go to x: 195  y: 0'],['Looks','set size to 70 %']],notes:'Select Goalie and create this setup. Size affects difficulty. You can also add show block to ensure the sprite appears after resets.'});
push({type:'lesson',step:'23',title:'Patrol up and down',why:'The Goalie glides, giving you tiny chances to shoot.',blocks:[['Control','forever'],['Motion','glide 2.5 secs to x: 195 y: 80'],['Motion','glide 2.5 secs to x: 195 y: -80']],notes:'Both glide blocks must be INSIDE Goalie forever. Uploaded project differs: it uses y ±50 and 2 sec; adjust for this lesson to y ±80 and 2.5 sec.'});
push({type:'lesson',step:'24',title:'Check for a save',why:'The Goalie can block the Ball.',blocks:[['Control','if <touching [Goalie]?> then']],notes:'Switch back to Ball. Add another if inside the Ball forever loop. The written lesson calls it the third if, after dribble and goal detection. If goal/save happen at exactly the same time, detection order may matter.'});
push({type:'lesson',step:'24',title:'Saved!',why:'When the Goalie blocks, the Ball returns to center.',blocks:[['Looks','say [Saved!] for 1 seconds'],['Motion','go to x: 0  y: 0']],notes:'Put these two inside Ball touching Goalie if. The Player stays where they are on a save; only a GOAL broadcasts ResetPlayer.'});
push({type:'chapter',n:'07',title:'Beat the clock',sub:'Sixty seconds. Three goals.',notes:'This is a NEW flag-clicked stack on Ball. If students place this after forever in the same stack, the timer never starts.'});
push({type:'setup',step:'25',title:'Add the match clock',verb:'Open Variables → Make a Variable.',tip:'Name it Time. Check that it appears on the stage.',illustration:'clock',notes:'Use a second all-sprites variable, Time. It should be separate from Score.'});
push({type:'lesson',step:'25',title:'Start with 60 seconds',why:'The Time variable counts down from 60.',blocks:[['Events','when green flag clicked'],['Variables','set [Time] to 60']],notes:'Start a new Ball green flag stack for the clock. This is NOT below the Ball forever loop.'});
push({type:'lesson',step:'25',title:'Keep going until zero',why:'Repeat until stops when the timer is below 1.',blocks:[['Control','repeat until <(Time) < (1)>']],notes:'Use Control repeat until, Operators <, and the Time variable bubble. The blocks on the next slide go INSIDE it.'});
push({type:'lesson',step:'25',title:'Tick... tock...',why:'Wait one second, then subtract one from Time.',blocks:[['Control','wait 1 seconds'],['Variables','change [Time] by -1']],notes:'Place wait then change Time by -1 INSIDE repeat until. Students should be able to watch the number fall once per second.'});
push({type:'lesson',step:'25',title:'Full time!',why:'When the timer ends, stop the match.',blocks:[['Looks','say [FULL TIME!] for 2 seconds'],['Control','stop [all]']],notes:'These two blocks go AFTER repeat until, still in the new timer flag stack. If Score reaches 3 first, the win branch stops all scripts.'});
push({type:'check',title:'Kickoff! Play the game',sub:'3 goals or 60 seconds. Can you win?',cue:'Test movement, dribbling, shots, saves, and the clock.',notes:'Ask each student to test a full match. Make sure pressing Space from far away does nothing, saved shots do not score, and Score resets when the green flag is clicked.'});
push({type:'chapter',n:'08',title:'Bonus challenges',sub:'Choose your own upgrade.',notes:'All four challenges are optional extensions. They require more experimentation and are not needed for the base game.'});
push({type:'bonus',step:'C1',title:'Speed Boots',why:'Hold Shift to sprint in the direction you face.',blocks:[['Control','if <key [shift] pressed?> then'],['Motion','move 4 steps']],notes:'Add a fifth if INSIDE Player forever. Extra move 4 steps is in addition to movement from the arrow key. Ask: why does the player sometimes outrun the ball?'});
push({type:'bonus',step:'C1',title:'Fix the fast dribble',why:'Increase the Ball’s push speed to match your sprint.',blocks:[['Motion','move 10 steps']],notes:'In the Ball touching Player branch, change move 6 to move 10. Compare 6 and 10 for how smooth the dribble feels. This changes normal dribbling too; a conditional speed boost is a more advanced fix.'});
push({type:'bonus',step:'C2',title:'Meet Player 2',why:'A second player begins on the right.',blocks:[['Motion','go to x: 120  y: 0'],['Motion','point in direction -90']],notes:'Duplicate Player, rename Player2, and give it a different costume color. Modify Player2 green flag starting position. Be sure reset code for Player2 is updated too.'});
push({type:'bonus',step:'C2',title:'WASD controls',why:'Player 2 uses W, A, S, and D instead of arrows.',blocks:[['Control','if <key [w] pressed?> then'],['Motion','point in direction 0'],['Motion','move 5 steps']],notes:'Duplicate the Player movement logic to Player2 and replace four arrows with W=up, A=left, S=down, D=right. Show this W example, then ask kids to make the other three.'});
push({type:'bonus',step:'C2',title:'Either player can dribble',why:'An OR block means “Player 1 or Player 2.”',blocks:[['Control','if <touching [Player]?> or <touching [Player2]?> then']],notes:'In Ball forever replace the touching Player condition with an Operators OR containing two Sensing touching blocks. The Ball needs extra logic to pick WHICH player’s direction; a simple direction-of-Player still follows Player1 even when Player2 touches. For the extension, add two separate dribble branches for each player or a direction selection if/else. Explain limitation clearly.'});
push({type:'bonus',step:'C2',title:'Player 2 can shoot',why:'The F key becomes Player 2’s kick button.',blocks:[['Events','when [f] key pressed'],['Control','if <touching [Player2]?> then'],['Motion','point towards [Goal]']],notes:'Make a SECOND key stack on Ball for F. Continue by adding the same move 60 and repeat 16 → move 12 → wait 0.03 kick travel from Player 1, or the kick may fight dribbling. For truly competitive 2-player scoring, build a second Goal and separate scores; one Score variable only counts shared goals.'});
push({type:'bonus',step:'C3',title:'Slippery Ball',why:'KickSpeed is a variable that holds the Ball’s speed.',blocks:[['Variables','set [KickSpeed] to 12']],notes:'Make a variable KickSpeed for Ball only. In the Space kick stack, replace the fixed repeat kick with a fading-speed loop. Note that preserving move 60 may be necessary to free the Ball from the Player.'});
push({type:'bonus',step:'C3',title:'Make the Ball slow down',why:'The Ball rolls while KickSpeed is at least 1.',blocks:[['Control','repeat until <(KickSpeed) < (1)>'],['Motion','move (KickSpeed) steps']],notes:'The move block uses the orange KickSpeed variable bubble instead of the number 12. It belongs inside repeat until.'});
push({type:'bonus',step:'C3',title:'Add friction',why:'Subtracting 1 every time makes the Ball slow down.',blocks:[['Variables','change [KickSpeed] by -1'],['Control','wait 0.03 seconds']],notes:'Both blocks belong inside the same repeat until loop, after move KickSpeed steps. Ask children: how would changing -1 to -2 affect stopping distance?'});
push({type:'bonus',step:'C4',title:'Golden Goal',why:'When time runs out, let the next goal win.',blocks:[['Variables','set [GoldenGoal] to 1']],notes:'Create a GoldenGoal variable; initialize to 0 at match start. On timeout, set it to 1 instead of immediately stopping. In a one-player game this is an overtime rule, not a true tie. A real two-player tie needs two scores.'});
push({type:'bonus',step:'C4',title:'Overtime begins',why:'The match keeps going after the clock reaches zero.',blocks:[['Looks','say [GOLDEN GOAL!] for 2 seconds']],notes:'In the time-up stack, remove stop all and display the Golden Goal message after setting GoldenGoal to 1. The existing win-at-3 code remains unless teacher chooses a different rule.'});
push({type:'bonus',step:'C4',title:'The next goal wins',why:'If GoldenGoal is 1, end the game on the next goal.',blocks:[['Control','if <(GoldenGoal) = (1)> then'],['Looks','say [YOU WIN!] for 2 seconds'],['Control','stop [all]']],notes:'Put this inside Ball touching Goal branch after score updates. GoldenGoal must have been reset to 0 at the start of every match. This implements single-player overtime; two-player golden goal additionally needs team identification and separate scores.'});
push({type:'finish',title:'You built a real game!',sub:'Play it. Test it. Make it your own.',notes:'Ask students to showcase one feature they built and one bug they fixed. Remind them to save the project with a memorable name and share it if their classroom settings permit.'});

const shapes=pptx.ShapeType;
function rect(sl,x,y,w,h,fill,line=fill,r=.18){sl.addShape(r?shapes.roundRect:shapes.rect,{x,y,w,h,rectRadius:r,fill:{color:fill},line:{color:line,transparency:line===fill?100:0,width:1}})}
function txt(sl,text,x,y,w,h,opt={}){sl.addText(String(text),{x,y,w,h,fontFace:'Aptos',fontSize:23,color:C.ink,margin:0,breakLine:false,fit:'shrink',...opt});}
function thin(sl,x1,y1,x2,y2,color=C.line,width=1){sl.addShape(shapes.line,{x:x1,y:y1,w:x2-x1,h:y2-y1,line:{color,width}})}
function addMark(sl,dark=false){txt(sl,'KeenKids',.66,.30,2,.30,{fontFace:'Georgia',bold:true,fontSize:18,color:dark?C.cream:C.forest});txt(sl,'CODING CLUB',2.20,.35,1.9,.22,{charSpacing:2,fontSize:10,bold:true,color:dark?'BBD1BF':C.brown});}
function page(sl,i,total,kind){let d=kind==='chapter'||kind==='cover'||kind==='finish';thin(sl,.68,7.1,12.63,7.1,d?'70927B':C.line,.7);txt(sl,`SOCCER STRIKER  /  GRADES 3–4`,.72,7.17,6,.17,{fontSize:9.5,bold:true,charSpacing:1.6,color:d?'C9D7CB':C.brown});txt(sl,`${String(i+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`,11.63,7.17,1,.17,{fontSize:10,bold:true,color:d?'C9D7CB':C.brown,align:'right'});}
function label(sl,t,x,y,bg=C.mint,color=C.forest){rect(sl,x,y,Math.max(1.08,.11*t.length+.5),.39,bg,bg,.18);txt(sl,t,x+.17,y+.10,Math.max(.8,.11*t.length+.15),.18,{fontSize:10.5,bold:true,charSpacing:1,color});}
function heading(sl,title,eyebrow='BUILD IT'){label(sl,eyebrow,.70,1.05);txt(sl,title,.70,1.62,11.75,.79,{fontFace:'Georgia',fontSize:33.5,bold:true,color:C.ink});}
function paperBG(sl,bonus=false){sl.background={color:bonus?C.warm:C.paper};rect(sl,0,0,W,.14,bonus?C.sun:C.leaf,bonus?C.sun:C.leaf,0);addMark(sl,false);}
function rightFeature(sl,title,body,bonus=false){rect(sl,8.9,2.42,3.66,3.33,bonus?'FFF7E6':C.cream,bonus?'E8C98F':C.line,.16);txt(sl,title,9.20,2.78,2.95,.25,{fontSize:12,color:bonus?C.brown:C.leaf,bold:true,charSpacing:1.5});thin(sl,9.20,3.18,12.12,3.18,bonus?'E6C77E':C.line,1);txt(sl,body,9.20,3.48,2.97,1.62,{fontSize:25,bold:true,color:C.forest,breakLine:false,valign:'top'});}
function codeBlock(sl,cat,code,x,y,w,h=0.9){let col=K[cat]||C.forest;let textcol=(['Events','Control','Variables'].includes(cat)?C.ink:C.white);rect(sl,x+.06,y+.06,w,h,'DBD7C9','DBD7C9',.14);rect(sl,x,y,w,h,col,col,.14);txt(sl,code,x+.30,y+.14,w-.55,h-.22,{fontFace:'Aptos',fontSize:code.length>46?21.5:code.length>35?23.5:27.5,bold:true,color:textcol,valign:'mid',fit:'shrink'});txt(sl,cat.toUpperCase(),x+.17,y-.22,3,.17,{fontSize:9.6,bold:true,charSpacing:1.2,color:C.brown});}
function addPitch(sl,x,y,w,h){rect(sl,x-.05,y-.05,w+.10,h+.10,C.cream,C.line,.09);sl.addImage({path:pics,x,y,w,h});}
function visualShape(sl,kind){if(kind==='field'){addPitch(sl,7.35,2.05,5.0,3.75);} else if(kind==='player'){addPitch(sl,7.35,2.05,5.0,3.75);} else if(kind==='ball'){addPitch(sl,7.35,2.05,5.0,3.75);} else if(kind==='goal'){addPitch(sl,7.35,2.05,5.0,3.75);}else if(kind==='goalie'){addPitch(sl,7.35,2.05,5.0,3.75);}else if(kind==='score'){addPitch(sl,7.35,2.05,5.0,3.75);} else if(kind==='clock'){addPitch(sl,7.35,2.05,5.0,3.75);}}
const notes=[];
steps.forEach((s,i)=>{
 const sl=pptx.addSlide();
 let bonus=s.type==='bonus';
 let dark=['cover','chapter','finish'].includes(s.type);
 if(dark)sl.background={color:C.forest};else paperBG(sl,bonus);
 if(s.type==='cover'){
  addMark(sl,true);label(sl,'THE SCRATCH SOCCER LAB',.7,1.02,C.sun,C.forest);
  txt(sl,s.title,.67,1.87,6.8,1.02,{fontFace:'Georgia',fontSize:54,bold:true,color:C.cream});
  txt(sl,s.sub,.72,3.19,5.3,1.0,{fontSize:27,color:'E8E9DC'});
  rect(sl,7.24,1.48,5.34,4.37,C.cream,C.cream,.2);addPitch(sl,7.44,1.72,4.92,3.69);
  txt(sl,'BUILD • TEST • PLAY',.72,5.63,5,.40,{fontSize:17.2,bold:true,color:C.sun,charSpacing:1.3});
 } else if(s.type==='mission'){
  heading(sl,s.title,'TODAY’S MISSION');txt(sl,s.sub,.75,2.51,10,.46,{fontSize:28,bold:true,color:C.forest});
  const icons=['01','02','03'];s.items.forEach((it,k)=>{rect(sl,.78,3.19+k*.94,11.8,.69,k%2?'F3F0E4':C.cream,C.line,.10);txt(sl,icons[k],1.06,3.35+k*.94,.52,.26,{fontFace:'Georgia',fontSize:20,bold:true,color:C.coral});txt(sl,it,2.0,3.34+k*.94,9.7,.30,{fontSize:22,color:C.ink});});
 } else if(s.type==='chapter'){
  addMark(sl,true);txt(sl,'CHAPTER',.72,1.45,5,.36,{fontSize:15,color:C.sun,bold:true,charSpacing:2});txt(sl,s.n,.65,1.85,3.45,2.25,{fontFace:'Georgia',fontSize:114,color:C.sun,bold:true});
  txt(sl,s.title,4.26,2.07,8.3,1.46,{fontFace:'Georgia',fontSize:43,bold:true,color:C.cream});txt(sl,s.sub,4.32,4.11,7.2,.66,{fontSize:26,color:'D9E2D8'});
  sl.addShape(shapes.arc,{x:9.96,y:5.18,w:2.5,h:1.38,rotate:18,adjustPoint:.2,line:{color:C.leaf,width:3},fill:{color:C.forest,transparency:100}});
 } else if(s.type==='setup'){
  heading(sl,s.title,`STEP ${s.step}  /  SETUP`);
  txt(sl,s.verb,.82,2.79,6.0,1.14,{fontSize:28.5,bold:true,color:C.forest,breakLine:false,valign:'top'});
  rect(sl,.8,4.42,5.8,1.12,C.cream,C.line,.1);txt(sl,s.tip,1.11,4.67,5.21,.66,{fontSize:22,color:C.brown,bold:true});
  visualShape(sl,s.illustration);
 } else if(s.type==='lesson'||s.type==='bonus'){
  heading(sl,s.title,bonus?`BONUS ${s.step}`:`STEP ${s.step}`);
  let y=2.62;
  s.blocks.forEach((b,k)=>codeBlock(sl,b[0],b[1],.78,y+k*1.1,7.64,.82));
  rightFeature(sl,'WHY IT WORKS',s.why,bonus);
  if(s.blocks.length<3){txt(sl,'Build these blocks in Scratch, then test them.',.83,6.53,7.55,.31,{fontSize:17.5,color:C.brown,italic:true});}
 } else if(s.type==='check'){
  heading(sl,s.title,'CHECKPOINT');
  txt(sl,s.sub,.82,2.56,6.45,1.28,{fontFace:'Georgia',fontSize:30,bold:true,color:C.forest});
  label(sl,'TRY IT',.8,4.46,C.sun,C.forest);txt(sl,s.cue,.83,5.07,6.2,.79,{fontSize:23,color:C.ink});addPitch(sl,7.50,2.15,4.62,3.47);
 } else if(s.type==='finish'){
  addMark(sl,true);txt(sl,'FULL TIME!',.73,1.25,6,.28,{fontSize:17,bold:true,color:C.sun,charSpacing:1.8});
  txt(sl,s.title,.70,2.05,11.9,1.43,{fontFace:'Georgia',fontSize:47,bold:true,color:C.cream});
  txt(sl,s.sub,.73,4.05,10.5,.8,{fontSize:28,color:'DDE6DC'});
  rect(sl,.73,5.33,10.95,.81,C.sun,C.sun,.1);txt(sl,'Save your project. Show a friend. Keep inventing.',1.0,5.59,10.4,.35,{fontSize:22,color:C.ink,bold:true});
 }
 page(sl,i,steps.length,s.type);
 try {sl.addNotes(s.notes||'');} catch(e) {}
 notes.push({slide:i+1,type:s.type,step:s.step||null,title:s.title,code_blocks:s.blocks||[],notes:s.notes||''});
});
let allBlockSlides=steps.filter(s=>s.blocks);if(allBlockSlides.some(s=>s.blocks.length>3))throw new Error('More than three Scratch blocks on a slide');
const output='/mnt/data/KeenKids_Soccer_Striker_Scratch_Lesson.pptx';
pptx.writeFile({fileName:output}).then(()=>{
fs.writeFileSync('/mnt/data/KeenKids_Soccer_Striker_Slide_Notes.json',JSON.stringify(notes,null,2));
let guide=['# KeenKids Soccer Striker — Teacher Guide','',`${steps.length} slides. Each coding slide shows 1–3 Scratch blocks.`,`Source: lesson plan supplied by the user; art from supplied Soccer_Striker!.sb3.`,`Design reference: KeenKids storybook preview (Literata/Figtree editorial style).`,''];
for(let n of notes){guide.push(`## Slide ${n.slide}: ${n.title}`,`**Teacher note:** ${n.notes}`,'');}
fs.writeFileSync('/mnt/data/KeenKids_Soccer_Striker_Teacher_Guide.md',guide.join('\n'));
console.log('DONE',output,steps.length,'slides',fs.statSync(output).size,'bytes');
}).catch(e=>{console.error(e);process.exit(1)});
