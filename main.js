!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="docs",n(n.s=2)}([function(t,e,n){"use strict";n.r(e),n.d(e,"NUM_ROW",(function(){return r})),n.d(e,"NUM_COLUMN",(function(){return o})),n.d(e,"PIXEL_SIZE",(function(){return i})),n.d(e,"SQUARE_SIZE",(function(){return a})),n.d(e,"BOARD_HEIGHT",(function(){return s})),n.d(e,"BOARD_WIDTH",(function(){return c})),n.d(e,"DISPLAY_FULL_WIDTH",(function(){return u})),n.d(e,"BOARD_TOP_MARGIN",(function(){return l})),n.d(e,"NEXT_BOX_WIDTH",(function(){return d})),n.d(e,"VACANT",(function(){return f})),n.d(e,"RED_COLOR",(function(){return h})),n.d(e,"BLUE_COLOR",(function(){return S})),n.d(e,"WHITE_COLOR",(function(){return E})),n.d(e,"SquareState",(function(){return g})),n.d(e,"COLOR_1",(function(){return p})),n.d(e,"COLOR_2",(function(){return I})),n.d(e,"COLOR_3",(function(){return m})),n.d(e,"COLOR_PALETTE",(function(){return _})),n.d(e,"Direction",(function(){return A})),n.d(e,"REWARDS",(function(){return R})),n.d(e,"CalculatePushdownPoints",(function(){return D})),n.d(e,"GetGravity",(function(){return y})),n.d(e,"GameState",(function(){return T})),n.d(e,"LINE_CLEAR_DELAY",(function(){return M}));const r=20,o=10,i=3,a=8*i,s=a*r,c=a*o,u=a*(o+6),l=2*a,d=5*a,f="black",h="red",S="#2105f2",E="white",g={EMPTY:0,COLOR1:1,COLOR2:2,COLOR3:3},p={0:"rgb(0,88,248)",1:"rgb(0,168,0)",2:"rgb(216,0,204)",3:"rgb(0,88,248)",4:"rgb(228,0,88",5:"rgb(88,248,152)",6:"rgb(248,56,0)",7:"rgb(104,68,252)",8:"rgb(0,88,248)",9:"rgb(248,56,0)"},I={0:"rgb(60,188,252)",1:"rgb(148,248,24)",2:"rgb(248,120,248)",3:"rgb(88,216,84)",4:"rgb(88,248,152)",5:"rgb(104,136,252)",6:"rgb(124,124,124)",7:"rgb(168,0,32)",8:"rgb(248,56,0)",9:"rgb(252,160,68)"},m=Object.assign(p),_={1:p,2:I,3:m},A=Object.freeze({LEFT:1,RIGHT:2,DOWN:3,UP:4}),R={1:40,2:100,3:300,4:1200},L={0:48,1:43,2:38,3:33,4:28,5:23,6:18,7:13,8:8,9:6,10:5,11:5,12:5,13:4,14:4,15:4,16:3,17:3,18:3,19:2,29:1};function D(t){return t>=16?t-6:t}function y(t){return t<=18?L[t]:t<29?2:1}const T={FIRST_PIECE:"first piece",RUNNING:"running",PAUSED:"paused",GAME_OVER:"game over",START_SCREEN:"start screen",ARE:"are",LINE_CLEAR:"line clear"},M=18},function(t,e,n){"use strict";n.r(e),n.d(e,"DASSpeed",(function(){return c})),n.d(e,"DASBehavior",(function(){return l})),n.d(e,"ShouldTransitionEvery10Lines",(function(){return f})),n.d(e,"ShouldTransitionEveryLine",(function(){return h})),n.d(e,"ShouldShowDiggingHints",(function(){return S})),n.d(e,"GetGameSpeedMultiplier",(function(){return E})),n.d(e,"ShouldSetDASChargeOnPieceStart",(function(){return I})),n.d(e,"IsDASAlwaysCharged",(function(){return m})),n.d(e,"GetDASChargeAfterTap",(function(){return _})),n.d(e,"GetDASWallChargeAmount",(function(){return A})),n.d(e,"GetDASChargedFloor",(function(){return R})),n.d(e,"GetDASUnchargedFloor",(function(){return L})),n.d(e,"GetDASTriggerThreshold",(function(){return D}));const r=document.getElementById("das-speed-dropdown"),o=document.getElementById("das-behavior-dropdown"),i=document.getElementById("game-speed-dropdown"),a=document.getElementById("digging-hints-checkbox"),s=document.getElementById("transition-10-checkbox"),c=Object.freeze({STANDARD:"standard",SLOW_MEDIUM:"slow_medium",MEDIUM:"medium",FAST:"fast",FASTDAS:"Fast DAS"}),u=[c.STANDARD,c.SLOW_MEDIUM,c.MEDIUM,c.FAST,c.FASTDAS],l=Object.freeze({STANDARD:"standard",ALWAYS_CHARGED:"always_charged",CHARGE_ON_PIECE_SPAWN:"charge_on_piece_spawn"}),d=[l.STANDARD,l.ALWAYS_CHARGED,l.CHARGE_ON_PIECE_SPAWN];function f(){return s.checked}function h(){return!1}function S(){return a.checked}function E(){return i.value}function g(){const t=parseInt(r.value);return u[t]}function p(){const t=parseInt(o.value);return d[t]}function I(){const t=p();return t==l.ALWAYS_CHARGED||t==l.CHARGE_ON_PIECE_SPAWN}function m(){return p()==l.ALWAYS_CHARGED}function _(){return p()==l.ALWAYS_CHARGED?10:0}function A(){if(!I())throw new Error("Requested DASChargeOnPieceStart when ShouldSetDASChargeOnPieceStart evaluated to 'false'.");switch(g()){case c.SLOW_MEDIUM:return 12;case c.FAST:return 10;default:return D()}}function R(){return 10}function L(){return 0}function D(){let t;const e=g();switch(e){case c.STANDARD:t=6;break;case c.FAST:case c.FASTDAS:t=4;break;case c.SLOW_MEDIUM:case c.MEDIUM:t=5;break;default:throw new Error("Unknown DAS speed: "+e)}return 10+t}},function(t,e,n){"use strict";n.r(e),n.d(e,"GetCurrentPiece",(function(){return pt})),n.d(e,"GetLevel",(function(){return It}));const r={Z:[[[[0,0,0,0],[0,1,1,0],[0,0,1,1]],[[0,0,0,1],[0,0,1,1],[0,0,1,0]]],2,"Z"],S:[[[[0,0,0,0],[0,0,1,1],[0,1,1,0]],[[0,0,1,0],[0,0,1,1],[0,0,0,1]]],3,"S"],T:[[[[0,0,0,0],[0,1,1,1],[0,0,1,0]],[[0,0,1,0],[0,1,1,0],[0,0,1,0]],[[0,0,1,0],[0,1,1,1],[0,0,0,0]],[[0,0,1,0],[0,0,1,1],[0,0,1,0]]],1,"T"],O:[[[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]],1,"O"],L:[[[[0,0,0,0],[0,1,1,1],[0,1,0,0]],[[0,1,1,0],[0,0,1,0],[0,0,1,0]],[[0,0,0,1],[0,1,1,1],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,1]]],2,"L"],I:[[[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]]],1,"I"],J:[[[[0,0,0,0],[0,1,1,1],[0,0,0,1]],[[0,0,1,0],[0,0,1,0],[0,1,1,0]],[[0,1,0,0],[0,1,1,1],[0,0,0,0]],[[0,0,1,1],[0,0,1,0],[0,0,1,0]]],3,"J"]},o=Object.values(r),i=document.getElementById("piece-sequence");let a="",s=0,c=!1;function u(){}u.prototype.startReadingPieceSequence=function(){a=i.value.replace(/ /g,""),a.length>0&&(c=!0,s=0)},u.prototype.chooseNextPiece=function(t){return c?this.getPresetPiece():(c=!1,this.getRandomPiece(t))},u.prototype.getStatusDisplay=function(){return c?["Piece ",s+1+"/"+a.length]:["Random","Piece"]},u.prototype.getPresetPiece=function(){const t=a[s],e=r[t];return s+=1,s>=a.length&&(c=!1,s=0),e},u.prototype.getRandomPiece=function(t){let e=Math.floor(Math.random()*(o.length+1));e!=o.length&&t!==o[e][2]||(e=Math.floor(Math.random()*o.length));return o[e]};var l=n(0);const d=document.getElementById("paste-area"),f=document.getElementById("pasted-image");let h=!1,S=[];function E(t,e){var n;this.board=t,this.canvas=e,n=this,d.onpaste=function(t){for(var e=(t.clipboardData||t.originalEvent.clipboardData).items,r=null,o=0;o<e.length;o++)0===e[o].type.indexOf("image")&&(r=e[o].getAsFile());if(null!==r){var i=new FileReader;i.onload=function(t){f.onload=function(){n.getBoardStateFromImage(f)},f.src=t.target.result},i.readAsDataURL(r)}}}E.prototype.resetBoard=function(){for(let t=0;t<l.NUM_ROW;t++)for(let e=0;e<l.NUM_COLUMN;e++)this.board[t][e]=h?S[t][e]:l.SquareState.EMPTY},E.prototype.didLoadBoardStateFromImage=function(){return h},E.prototype.getBoardStateFromImage=function(t){var e=document.getElementById("dummy-canvas"),n=e.getContext("2d");e.width=t.width,e.height=t.height,n.drawImage(t,0,0),this.resetBoard();const r=(t.height/20+t.width/10)/2-.1;for(let t=0;t<l.NUM_COLUMN;t++)for(let e=0;e<l.NUM_ROW;e++){const o=Math.round((t+.5)*r),i=Math.round((e+.5)*r),a=n.getImageData(o,i,1,1).data;Math.max(a[0],a[1],a[2])>30?(e>=7&&e<=9&&console.log(e,t,a,"FULL"),n.fillStyle="RED",this.board[e][t]=l.SquareState.COLOR2):(e>=7&&e<=9&&console.log(e,t,a,"EMPTY"),n.fillStyle="GREEN",this.board[e][t]=l.SquareState.EMPTY),n.fillRect(o,i,3,3)}!function(t,e,n){let r=!1;for(let o=l.NUM_ROW-1;o>=0;o--)if(r)for(let e=0;e<l.NUM_COLUMN;e++)t[o][e]=l.SquareState.EMPTY;else{let i=!0;for(let e=0;e<l.NUM_COLUMN;e++)if(t[o][e]!=l.SquareState.EMPTY){i=!1;break}i&&(r=!0,e.fillStyle="BLACK",e.fillRect(0,0,n*l.NUM_COLUMN,o*n))}}(this.board,n,r),S=JSON.parse(JSON.stringify(this.board)),this.canvas.drawBoard(),h=!0,setTimeout(()=>{e.style.display="none"},3e3)};const g=document.getElementById("main-canvas"),p=g.getContext("2d"),I=n(1);function m(t){this.board=t}function _(t,e,n){return e<0||e>=l.NUM_COLUMN||t<0||t>=l.NUM_ROW||n[t][e]!=l.SquareState.EMPTY}function A(t,e,n){for(let r=0;r<l.NUM_COLUMN;r++)n[t][r]==l.SquareState.EMPTY&&(p.fillStyle=e,p.fillRect(r*l.SQUARE_SIZE+l.PIXEL_SIZE,t*l.SQUARE_SIZE+l.PIXEL_SIZE,l.SQUARE_SIZE-3*l.PIXEL_SIZE,l.SQUARE_SIZE-3*l.PIXEL_SIZE))}function R(t,e){this.rotationList=t[0],this.colorId=t[1],this.id=t[2],this.board=e,this.rotationIndex=0,this.activeTetromino=this.rotationList[this.rotationIndex],this.x=3,this.y="I"==this.id?-2:-1}g.setAttribute("height",l.SQUARE_SIZE*l.NUM_ROW),g.setAttribute("width",l.SQUARE_SIZE*(l.NUM_COLUMN+7)),m.prototype.drawLineClears=function(t,e){if(e>=15)return;const n=5+Math.floor(e/3),r=9-n;for(const e of t)p.fillStyle="black",p.fillRect(r*l.SQUARE_SIZE,e*l.SQUARE_SIZE,l.SQUARE_SIZE,l.SQUARE_SIZE),p.fillRect(n*l.SQUARE_SIZE,e*l.SQUARE_SIZE,l.SQUARE_SIZE,l.SQUARE_SIZE)},m.prototype.drawSquare=function(t,e,n,r=!1){if(n==l.VACANT)return p.fillStyle="black",void p.fillRect(t*l.SQUARE_SIZE,e*l.SQUARE_SIZE,l.SQUARE_SIZE,l.SQUARE_SIZE);p.fillStyle=n,p.fillRect(t*l.SQUARE_SIZE,e*l.SQUARE_SIZE,7*l.PIXEL_SIZE,7*l.PIXEL_SIZE),r&&n!==l.VACANT&&(p.fillStyle="white",p.fillRect(t*l.SQUARE_SIZE+l.PIXEL_SIZE,e*l.SQUARE_SIZE+l.PIXEL_SIZE,5*l.PIXEL_SIZE,5*l.PIXEL_SIZE)),n!==l.VACANT&&(p.fillStyle="white",p.fillRect(t*l.SQUARE_SIZE,e*l.SQUARE_SIZE,l.PIXEL_SIZE,l.PIXEL_SIZE),p.fillRect(t*l.SQUARE_SIZE+l.PIXEL_SIZE,e*l.SQUARE_SIZE+l.PIXEL_SIZE,l.PIXEL_SIZE,l.PIXEL_SIZE),p.fillRect(t*l.SQUARE_SIZE+l.PIXEL_SIZE+l.PIXEL_SIZE,e*l.SQUARE_SIZE+l.PIXEL_SIZE,l.PIXEL_SIZE,l.PIXEL_SIZE),p.fillRect(t*l.SQUARE_SIZE+l.PIXEL_SIZE,e*l.SQUARE_SIZE+l.PIXEL_SIZE+l.PIXEL_SIZE,l.PIXEL_SIZE,l.PIXEL_SIZE))},m.prototype.drawNextBox=function(t){const e=l.NUM_COLUMN+1;if(p.fillStyle="BLACK",p.fillRect(e*l.SQUARE_SIZE,8*l.SQUARE_SIZE,5*l.SQUARE_SIZE,4.5*l.SQUARE_SIZE),null!=t){const n="I"===t.id||"O"===t.id?e+.5:e,r="I"===t.id?7.75:8.25,o=l.COLOR_PALETTE[t.colorId][It()%10];for(let e=0;e<t.activeTetromino.length;e++)for(let i=0;i<t.activeTetromino[e].length;i++)t.activeTetromino[e][i]&&this.drawSquare(n+i,r+e,o,1===t.colorId)}},m.prototype.drawScoreDisplay=function(t){const e=l.NEXT_BOX_WIDTH,n=l.BOARD_WIDTH+l.SQUARE_SIZE,r=.5*l.SQUARE_SIZE,o=("0".repeat(6)+t).slice(-6);this.drawMultiLineText(["SCORE",o],n,r,e,"center")},m.prototype.drawLinesDisplay=function(t){const e=l.NEXT_BOX_WIDTH,n=l.BOARD_WIDTH+l.SQUARE_SIZE,r=3*l.SQUARE_SIZE,o=("0".repeat(3)+t).slice(-3);this.drawMultiLineText(["LINES",o],n,r,e,"center")},m.prototype.drawLevelDisplay=function(t){const e=l.NEXT_BOX_WIDTH,n=l.BOARD_WIDTH+l.SQUARE_SIZE,r=14*l.SQUARE_SIZE,o=("0".repeat(2)+t).slice(-2);this.drawMultiLineText(["LEVEL",o],n,r,e,"center")},m.prototype.drawTetrisRateDisplay=function(t,e){const n=l.NEXT_BOX_WIDTH,r=l.BOARD_WIDTH+l.SQUARE_SIZE,o=17*l.SQUARE_SIZE;let i=0;e>0&&(i=4*t/e);const a=parseInt(100*i);this.drawMultiLineText(["TRT",a+"%"],r,o,n,"center")},m.prototype.drawPieceStatusDisplay=function(t){const e=l.NEXT_BOX_WIDTH,n=l.BOARD_WIDTH+l.SQUARE_SIZE,r=6*l.SQUARE_SIZE;this.drawMultiLineText(t,n,r,e,"center")},m.prototype.drawMultiLineText=function(t,e,n,r,o){p.clearRect(e,n,r,20*t.length),p.textAlign="center",p.font="18px 'Press Start 2P'",p.fillStyle="BLACK";const i="center"==o?r/2:0;let a=0;for(let r of t)p.fillText(r.toUpperCase(),e+i,n+20*(a+1)),a++},m.prototype.drawPiece=function(t){if(null==t)return;const e=It(),n="T"===t.id||"O"===t.id||"I"===t.id;for(let r=0;r<t.activeTetromino.length;r++)for(let o=0;o<t.activeTetromino[r].length;o++)t.activeTetromino[r][o]&&(0!==t.colorId?this.drawSquare(t.x+o,t.y+r,l.COLOR_PALETTE[t.colorId][e%10],n):this.drawSquare(t.x+o,t.y+r,l.VACANT,n))},m.prototype.unDrawPiece=function(t){if(null!=t)for(let e=0;e<t.activeTetromino.length;e++)for(let n=0;n<t.activeTetromino[e].length;n++)t.activeTetromino[e][n]&&this.drawSquare(t.x+n,t.y+e,l.VACANT,!1)},m.prototype.drawCurrentPiece=function(){this.drawPiece(pt())},m.prototype.unDrawCurrentPiece=function(){this.unDrawPiece(pt())},m.prototype.drawBoard=function(){const t=It();for(let e=0;e<l.NUM_ROW;e++)for(let n=0;n<l.NUM_COLUMN;n++){let r=this.board[e][n];0!==r?this.drawSquare(n,e,l.COLOR_PALETTE[r][t%10],1===r):this.drawSquare(n,e,l.VACANT,1===r)}I.ShouldShowDiggingHints()&&this.drawDiggingHints()},m.prototype.drawDiggingHints=function(){const t=function(t){for(let e=0;e<l.NUM_ROW;e++)for(let n=0;n<l.NUM_COLUMN;n++)if(t[e][n]==l.SquareState.EMPTY&&_(e-1,n,t)&&_(e+1,n,t)&&_(e,n-1,t)&&_(e,n+1,t))return[e,n];return[]}(this.board),e=function(t){let e=l.NUM_ROW-1,n=[];for(;!_(e,l.NUM_COLUMN-1,t);)e--;for(;e>=0&&_(e,l.NUM_COLUMN-1,t);)n.push(e),e--;return n}(this.board);if(t.length>0){const e=t[0],n=t[1];let r=[],o=e-1;for(;o>=0&&_(o,n,this.board);)r.push(o),o-=1;const i=(e+.45)*l.SQUARE_SIZE,a=(n+.45)*l.SQUARE_SIZE,s=l.SQUARE_SIZE/4;p.fillStyle="yellow",p.beginPath(),p.arc(a,i,s,0,2*Math.PI,!1),p.fill();for(let t of r)A(t,"#842424",this.board)}else if(e.length>0)for(let t of e)A(t,"#215E30",this.board)},R.prototype.equals=function(t){return this.id===t.id},R.prototype.getHeightFromBottom=function(){let t=0;for(let e=0;e<this.activeTetromino.length;e++)for(let n=0;n<this.activeTetromino[e].length;n++)this.activeTetromino[e][n]&&(t=Math.max(t,this.y+e));return l.NUM_ROW-t},R.prototype.shouldLock=function(){return this.collision(0,1,this.activeTetromino)},R.prototype.moveDown=function(){this.y++},R.prototype.moveRight=function(){return!this.collision(1,0,this.activeTetromino)&&(this.x++,!0)},R.prototype.moveLeft=function(){return!this.collision(-1,0,this.activeTetromino)&&(this.x--,!0)},R.prototype.rotate=function(t){const e=t?1:-1,n=(this.rotationIndex+e+this.rotationList.length)%this.rotationList.length,r=this.rotationList[n];this.collision(0,0,r)||(this.rotationIndex=n,this.activeTetromino=this.rotationList[this.rotationIndex])},R.prototype.lock=function(){for(let t=0;t<this.activeTetromino.length;t++)for(let e=0;e<this.activeTetromino[t].length;e++){if(!this.activeTetromino[t][e])continue;const n=this.y+t,r=this.x+e;n>=0&&n<l.NUM_ROW&&r>=0&&r<l.NUM_COLUMN&&(this.board[this.y+t][this.x+e]=this.colorId)}},R.prototype.collision=function(t,e,n){for(let r=0;r<n.length;r++)for(let o=0;o<n[r].length;o++){if(!n[r][o])continue;let i=this.x+o+t,a=this.y+r+e;if(i<0||i>=l.NUM_COLUMN||a>=l.NUM_ROW)return!0;if(!(a<0)&&0!=this.board[a][i])return!0}return!1};const L=n(1),D=document.getElementById("das-stats");function y(t,e,n,r,o,i,a,s){this.resetLocalVariables(),this.togglePauseFunc=i,this.moveDownFunc=t,this.moveLeftFunc=e,this.moveRightFunc=n,this.rotateLeftFunc=r,this.rotateRightFunc=o,this.getGameStateFunc=a,this.getAREFunc=s}function T(t){return t==l.GameState.RUNNING||t==l.GameState.FIRST_PIECE}y.prototype.getIsSoftDropping=function(){return this.isSoftDropping},y.prototype.getCellsSoftDropped=function(){return this.cellSoftDropped},y.prototype.onPieceLock=function(){L.ShouldSetDASChargeOnPieceStart()&&this.setDASCharge(L.GetDASWallChargeAmount())},y.prototype.resetLocalVariables=function(){this.leftHeld=!1,this.rightHeld=!1,this.downHeld=!1,this.isSoftDropping=!1,this.cellSoftDropped=0,this.dasCharge=L.GetDASTriggerThreshold(),this.softDroppedLastFrame=!1},y.prototype.handleInputsThisFrame=function(){if(this.downHeld+this.leftHeld+this.rightHeld>1)return this.isSoftDropping=!1,void(this.cellSoftDropped=0);if(this.isSoftDropping&&!this.softDroppedLastFrame){return this.moveDownFunc()?this.cellSoftDropped+=1:(this.isSoftDropping=!1,this.cellSoftDropped=0),void(this.softDroppedLastFrame=!0)}this.softDroppedLastFrame=!1,this.leftHeld?this.handleHeldDirection(l.Direction.LEFT):this.rightHeld&&this.handleHeldDirection(l.Direction.RIGHT)},y.prototype.keyDownListener=function(t){if(t.repeat)return;switch(t.keyCode){case 37:this.leftHeld=!0,t.preventDefault();break;case 39:this.rightHeld=!0,t.preventDefault();break;case 40:this.downHeld=!0}const e=this.getGameStateFunc();if(T(e))switch(t.keyCode){case 37:this.handleTappedDirection(l.Direction.LEFT);break;case 39:this.handleTappedDirection(l.Direction.RIGHT);break;case 90:this.rotateLeftFunc();break;case 88:this.rotateRightFunc()}if(function(t){return t==l.GameState.RUNNING}(e))switch(t.keyCode){case 40:this.isSoftDropping=!0}else switch(t.keyCode){case 90:case 88:console.log("rotate rejected, state: ",this.getGameStateFunc())}80==t.keyCode&&this.togglePauseFunc()},y.prototype.keyUpListener=function(t){37==t.keyCode?this.leftHeld=!1:39==t.keyCode?this.rightHeld=!1:40==t.keyCode&&(this.downHeld=!1,this.isSoftDropping=!1,this.cellSoftDropped=0)},y.prototype.tryShiftPiece=function(t){const e=t==l.Direction.LEFT?this.moveLeftFunc():this.moveRightFunc();return e||this.setDASCharge(L.GetDASTriggerThreshold()),e},y.prototype.handleHeldDirection=function(t){const e=L.GetDASTriggerThreshold();if(this.setDASCharge(Math.min(e,this.dasCharge+1)),this.dasCharge==e){this.tryShiftPiece(t)&&this.setDASCharge(L.GetDASChargedFloor())}},y.prototype.handleTappedDirection=function(t){T(this.getGameStateFunc())&&(this.setDASCharge(L.GetDASChargeAfterTap()),this.tryShiftPiece(t))},y.prototype.setDASCharge=function(t){this.dasCharge=t,this.refreshDebugText()},y.prototype.refreshDebugText=function(){let t="",e="";for(let t=0;t<this.dasCharge;t++)e+="|";0==this.dasCharge&&(e="."),t+=this.dasCharge+"/"+L.GetDASTriggerThreshold()+"\n"+e,D.innerText=t};const M=document.getElementById("main-canvas");function C(t,e){this.board=t,this.canvas=e,this.mouseIsDown=!1,this.squaresToggled=new Set,this.dragMode=U.NONE}const U=Object.freeze({ADDING:"adding",REMOVING:"removing",NONE:"none"});function N(t){const e=M.getBoundingClientRect(),n=t.clientX-e.left,r=t.clientY-e.top;return[Math.floor(r/l.SQUARE_SIZE),Math.floor(n/l.SQUARE_SIZE)]}function O(t,e){return t+","+e}C.prototype.toggleCell=function(t,e){this.squaresToggled.add(O(t,e)),this.board[t][e]=this.board[t][e]==l.SquareState.EMPTY?l.SquareState.COLOR1:l.SquareState.EMPTY,this.canvas.drawBoard(),this.canvas.drawCurrentPiece()},C.prototype.onMouseDown=function(t){let e,n;[e,n]=N(t),this.mouseIsDown=!0,this.dragMode=this.board[e][n]==l.SquareState.EMPTY?U.ADDING:U.REMOVING,this.toggleCell(e,n)},C.prototype.onMouseDrag=function(t){if(!this.mouseIsDown)return;let e,n;[e,n]=N(t);(this.dragMode==U.ADDING?this.board[e][n]==l.SquareState.EMPTY:this.board[e][n]!=l.SquareState.EMPTY)&&!this.squaresToggled.has(O(e,n))&&this.toggleCell(e,n)},C.prototype.onMouseUp=function(t){this.mouseIsDown=!1,this.squaresToggled=new Set};const{NUM_COLUMN:w,NUM_ROW:P,SquareState:b}=n(0);function v(t,e){this.board=t}function B(t,e){return t=Math.ceil(t),e=Math.floor(e),Math.floor(Math.random()*(e-t+1))+t}v.prototype.loadEmptyBoard=function(){for(let t=0;t<P;t++)for(let e=0;e<w;e++)this.board[t][e]=b.EMPTY},v.prototype.loadStandardBoard=function(){this.loadEmptyBoard();let t=B(6,10);for(let e=0;e<w-1;e++){const n=Math.min(12,Math.max(0,t));for(let t=P-n-1;t<P;t++){const n=t%3,r=[b.COLOR1,b.COLOR2,b.COLOR3][n];this.board[t][e]=r}t+=B(-2,1)}};const G=.5,Z=.4;v.prototype.loadDigBoard=function(){this.loadStandardBoard();for(let t=0;t<P;t++){let e;const n=Math.random();e=n<G?0:n<G+Z?1:2;for(let n=0;n<e;n++)this.board[t][B(0,w)]=b.EMPTY}};const x=document.getElementById("main-canvas"),H=document.getElementById("left-panel-toggle-button"),F=document.getElementById("left-panel");document.getElementById("right-panel");let Q=!0;F.style.minHeight=l.BOARD_HEIGHT+60,x.setAttribute("height",l.BOARD_HEIGHT),x.setAttribute("width",l.DISPLAY_FULL_WIDTH),H.innerText="<",H.addEventListener("click",(function(t){Q=!Q,Q?(F.style.marginLeft=0,H.innerText="<"):(F.style.marginLeft=-290,H.innerText=">")}));const k=document.getElementById("level-select");[0,8,15,18,19,29].forEach(t=>{document.getElementById("level-"+t).addEventListener("click",e=>{k.value=t})});const W=n(1),X=(document.getElementById("score-display"),document.getElementById("lines-display"),document.getElementById("level-display"),document.getElementById("header-text")),q=document.getElementById("parity-stats"),Y=(document.getElementById("game-options-form"),document.getElementById("start-game"),document.getElementById("restart-game"),document.getElementById("level-select")),j=document.getElementById("main-canvas"),V=document.getElementById("right-panel");let z,J=[];for(let t=0;t<l.NUM_ROW;t++){J[t]=[];for(let e=0;e<l.NUM_COLUMN;e++)J[t][e]=l.SquareState.EMPTY}let K,$,tt,et,nt,rt,ot,it,at,st,ct,ut,lt,dt,ft,ht=new m(J),St=new C(J,ht),Et=new v(J),gt=new u;new E(J,ht);const pt=()=>K,It=()=>tt;function mt(){let t="";if(at)t="Paused";else switch(rt){case l.GameState.START_SCREEN:t="Welcome to Tetris Trainer!";break;case l.GameState.GAME_OVER:t="Game over!"}X.innerText=t}function _t(t,e){let n=0;for(let r=0;r<l.NUM_ROW;r++)for(let o=t;o<e;o++)if(J[r][o]!=l.SquareState.EMPTY){n+=(r+o)%2==0?1:-1}return Math.abs(n)}function At(){const t=_t(0,5),e=_t(3,7),n=_t(5,10);q.innerText=`Left: ${t} \nMiddle: ${e} \nRight: ${n}`}function Rt(){K=$,ht.drawPieceStatusDisplay(gt.getStatusDisplay()),$=new R(gt.chooseNextPiece(K.id),J),ht.drawNextBox($)}function Lt(){at=!1,ot=0,it=0,st=0,ct=0,ut=0,dt=[],ft=0,et=0,tt=0,rt=l.GameState.START_SCREEN,z.resetLocalVariables()}function Dt(){Lt(),lt=90,gt.startReadingPieceSequence(),rt=l.GameState.FIRST_PIECE;const t=parseInt(Y.value);var e;tt=Number.isInteger(t)&&t>0?t:0,nt=W.ShouldTransitionEvery10Lines()?10:(e=tt)<10?10*(e+1):e<=15?100:10*(e-5),$=new R(gt.chooseNextPiece(""),J),Rt(),ht.drawBoard(),ht.drawCurrentPiece(),mt(),Tt(),At()}function yt(){rt==l.GameState.FIRST_PIECE&&0==lt?rt=l.GameState.RUNNING:rt==l.GameState.LINE_CLEAR&&0==ut?rt=l.GameState.ARE:rt==l.GameState.ARE&&0==ct?(ot+=ft,ft=0,Tt(),ht.drawCurrentPiece(),!function(){const t=K.activeTetromino;for(let e=0;e<t.length;e++)for(let n=0;n<t[e].length;n++)if(t[e][n]&&J[K.y+e][K.x+n])return!0;return!1}()?rt=l.GameState.RUNNING:(rt=l.GameState.GAME_OVER,mt())):rt==l.GameState.RUNNING&&(ut>0?rt=l.GameState.LINE_CLEAR:ct>0&&(rt=l.GameState.ARE))}function Tt(){ht.drawLevelDisplay(tt),ht.drawScoreDisplay(ot),ht.drawLinesDisplay(et),ht.drawTetrisRateDisplay(it,et)}function Mt(){if(K.shouldLock()){const t=K.getHeightFromBottom();return K.lock(),z.onPieceLock(),ht.drawBoard(),At(),Rt(),dt=function(){let t=[];for(let e=0;e<l.NUM_ROW;e++){let n=!0;for(let t=0;t<l.NUM_COLUMN;t++)if(J[e][t]==l.SquareState.EMPTY){n=!1;break}n&&t.push(e)}return t}(),dt.length>0&&(ut=l.LINE_CLEAR_DELAY),ft+=Object(l.CalculatePushdownPoints)(z.getCellsSoftDropped()),ct=10+2*Math.floor((t+2)/4),!1}return ht.unDrawCurrentPiece(),K.moveDown(),ht.drawCurrentPiece(),!0}z=new y(Mt,(function(){ht.unDrawCurrentPiece();const t=K.moveLeft();return ht.drawCurrentPiece(),t}),(function(){ht.unDrawCurrentPiece();const t=K.moveRight();return ht.drawCurrentPiece(),t}),(function(){ht.unDrawCurrentPiece(),K.rotate(!1),ht.drawCurrentPiece()}),(function(){ht.unDrawCurrentPiece(),K.rotate(!0),ht.drawCurrentPiece()}),(function(){at=!at,mt()}),(function(){return rt}),(function(){return ct})),j.addEventListener("mousedown",(function(t){St.onMouseDown(t)})),j.addEventListener("mousemove",(function(t){St.onMouseDrag(t)})),j.addEventListener("mouseup",(function(t){St.onMouseUp(t)})),V.addEventListener("mouseleave",(function(t){St.onMouseUp(t)})),document.addEventListener("keydown",t=>{z.keyDownListener(t)}),document.addEventListener("keyup",t=>{z.keyUpListener(t)}),document.getElementById("preset-standard").addEventListener("click",t=>{Et.loadEmptyBoard(),ht.drawBoard(),Dt()}),document.getElementById("preset-standard-tap").addEventListener("click",t=>{Et.loadEmptyBoard(),ht.drawBoard(),Dt()}),document.getElementById("preset-random-board").addEventListener("click",t=>{Et.loadStandardBoard(),ht.drawBoard(),Dt()}),document.getElementById("preset-dig-practice").addEventListener("click",t=>{Et.loadDigBoard(),ht.drawBoard(),Dt()}),document.getElementById("start-button").addEventListener("click",t=>{t.preventDefault(),j.focus(),Et.loadEmptyBoard(),ht.drawBoard(),Dt()}),Lt(),ht.drawBoard(),ht.drawNextBox(null),z.refreshDebugText(),mt(),At(),Tt(),function t(){const e=Date.now();if(!at){switch(rt){case l.GameState.FIRST_PIECE:lt-=1,z.handleInputsThisFrame();break;case l.GameState.LINE_CLEAR:ut-=1,ht.drawLineClears(dt,l.LINE_CLEAR_DELAY-ut),0==ut&&function(){const t=dt.length;for(const t of dt){for(let e=t;e>1;e--)for(let t=0;t<l.NUM_COLUMN;t++)J[e][t]=J[e-1][t];for(let t=0;t<l.NUM_COLUMN;t++)J[0][t]=l.SquareState.EMPTY}dt=[],t>0&&(et+=t,4==t&&(it+=1),(W.ShouldTransitionEveryLine()||et>=nt)&&(tt+=1,nt+=10),ft+=l.REWARDS[t]*(tt+1),ht.drawBoard(),ht.drawNextBox($))}();break;case l.GameState.ARE:ct-=1;break;case l.GameState.RUNNING:z.handleInputsThisFrame(),z.getIsSoftDropping()?st=0:(st+=1,st>=Object(l.GetGravity)(tt)&&(Mt(),st=0))}yt()}const n=Date.now()-e,r=60*W.GetGameSpeedMultiplier();window.setTimeout(t,1e3/r-n)}()}]);