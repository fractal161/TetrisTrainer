http = require("socket.http")
os = require("os")
socket = require "socket"
colors = require "colors"

TIMELINE_2_HZ = "X............................."
TIMELINE_6_HZ = "X........"
TIMELINE_7_HZ = "X......."
TIMELINE_8_HZ = "X......"
TIMELINE_10_HZ = "X....."
TIMELINE_11_HZ = "X.....X....X...."
TIMELINE_12_HZ = "X...."
TIMELINE_13_HZ = "X....X..."
TIMELINE_13_5_HZ = "X....X...X..."
TIMEILNE_14_HZ = "X....X...X...X..."
TIMELINE_15_HZ = "X..."
TIMELINE_20_HZ = "X.."
TIMELINE_30_HZ = "X."
TIMELINE_KYROS = "...X.X.X.X.X.X.X.X.X"

-- Config constants
SHOULD_ADJUST = true
DEBUG = false
REACTION_TIME_FRAMES = 20
INPUT_TIMELINE = TIMELINE_15_HZ
SHOULD_RECORD_GAMES = false
MOVIE_PATH = "C:\\Users\\Greg\\Desktop\\VODs\\" -- Where to store the fm2 VODS (absolute path)

function resetGameScopedVariables()
  isFirstPiece = true
  metaGameState = 0
  gamePhase = 0
  numLines = 0
  waitingOnAsyncRequest = false
  gameOver = false
  pcur = 0
  pnext = 0
end
resetGameScopedVariables()

-- Reset all variables whose values are tied to one piece
function resetPieceScopedVars()
  adjustmentLookup = {}
  frameIndex = 0
  arrFrameIndex = 0
  inputSequence = ""
  baseSequence = ""
  shiftsExecuted = 0
  rotationsExecuted = 0
  stateForNextPiece = {board=nil, level=nil, lines=nil}
end

--[[---------------------------------------
------------ Helper Functions -------------
---------------------------------------]]--

-- Translate internal Piece IDs to actual piece types (T: 2 J: 7 Z: 9 O: 10 S: 11 L: 15 I: 18)
orientToPiece = {[0]="none", [2]="T", [7]="J", [8]="Z", [10]="O", [11]="S", [14]="L", [18]="I"}
orientToNum = {[0]="none", [2]=1, [7]=2, [8]=3, [10]=4, [11]=5, [14]=6, [18]=7}

 -- This is where the board memory is accessed. Unfortunately lua is dumb so this table is 1 indexed (but stuff kept in memory is still 0 indexed :/)
function getBoard()
  local levelMap = {}
  for i=1,20 do
    levelMap[i] = {}
    for j=1,10 do
      levelMap[i][j] = memory.readbyte(4 * 256 + 10 * (i - 1) + (j - 1))
    end
  end
  return levelMap
end

function getEncodedBoard()
  local encodedStr = ""

  if isFirstPiece then
    for i=1,200 do
      encodedStr = encodedStr .. "0"
    end
    return encodedStr
  end

  local board = getBoard()
  for _, row in ipairs(board) do
    for _, value in ipairs(row) do
      if value == 239 then
        encodedStr = encodedStr .. "0"
      else
        encodedStr = encodedStr .. "1"
      end
    end
  end
  return encodedStr
end

-- Query into the input sequence based on (0-indexed) arrFrameIndex
function getInputForFrame(index)
  return string.sub(inputSequence, index + 1, index + 1)
end

--[[------------------------------------
----------- HTTP Requests --------------
------------------------------------]]--

function parsePrecompute(precomputeResult)
  local rows = splitString(precomputeResult, "\n")

  -- Parse the initial placement and queue up those inputs
  if REACTION_TIME_FRAMES > 0 then
    local defaultPlacement = splitString(rows[1], ":")[2]
    if defaultPlacement == null then
      print("GAME OVER - no default placement")
      gameOver = true
      return
    end
    print("Initial placement: " .. defaultPlacement)
    calculateInputs(defaultPlacement, false)
    baseSequence = inputSequence
    parseGameStateFromResponse(defaultPlacement)
  end

  -- Store all the adjustments in a lookup table
  for i = 2,8 do
    local resultSplit = splitString(rows[i], ":")
    local pieceStr = resultSplit[1]
    adjustmentLookup[pieceStr] = resultSplit[2]
  end
end



-- Make a request that will kick off a longer calculation. Subsequent frames will ping the server again for the result.
function requestAdjustmentAsync()
  -- Format URL arguments
  local requestStr = "http://localhost:3000/async-nb/" .. getEncodedBoard()
  requestStr = requestStr .. "/" .. orientToPiece[pcur] .. "/" .. orientToPiece[pnext] .. "/" .. level .. "/" .. numLines
  requestStr = requestStr .. "/" .. offsetXAtAdjustmentTime .. "/" .. offsetYAtAdjustmentTime .. "/" .. rotationAtAdjustmentTime
  requestStr = requestStr .. "/" .. REACTION_TIME_FRAMES .. "/" .. INPUT_TIMELINE .. "/" .. tostring(canFirstFrameShiftAtAdjustmentTime)

  local response = makeHttpRequest(requestStr)
  if response.code ~= 200 then
    error("Request not acknowledged by backend")
  end
  waitingOnAsyncRequest = true
  return response.data
end

function requestPrecompute()
  -- print("requestprecompute")
  -- Format URL arguments
  if stateForNextPiece == nil or stateForNextPiece.board == nil
        or stateForNextPiece.lines == nil or stateForNextPiece.level == nil then
    print("GAME OVER - unknown state")
    gameOver = true
    return
  end
  local requestStr = "http://localhost:3000/precompute/" .. stateForNextPiece.board
  local requestStr = requestStr .. "/" .. orientToPiece[pnext] .. "/null/" .. stateForNextPiece.level
  local requestStr = requestStr .. "/" .. stateForNextPiece.lines .. "/0/0/0/"
  local requestStr = requestStr .. REACTION_TIME_FRAMES .. "/" .. INPUT_TIMELINE .. "/false" -- use the 'framesAlreadyElapsed' param to communicate reaction time

  local response = makeHttpRequest(requestStr)
  if response.code ~= 200 then
    error("Request not acknowledged by backend")
  end
  waitingOnAsyncRequest = true
  return response.data
end

-- Check if the async computation has finished, and if so make the adjustment based on it
function fetchAsyncResult()
  local response = makeHttpRequest("http://localhost:3000/async-result")

  -- Only use the response if the server indicated that it sent the async result
  if response.code ~= 200 then
    error("RECEIVED BAD RESPONSE CODE:" .. response.code)
    return nil
  end
  waitingOnAsyncRequest = false
  return response.data
end

function makeHttpRequest(requestUrl)
  print(requestUrl)
  -- Helper function to compile the body of the web response
  local data = ""
  local function collect(chunk)
    if chunk ~= nil then
      data = data .. chunk
    end
    return true
  end

  local ok, statusCode, headers, statusText = http.request {
    method = "GET",
    url = requestUrl,
    sink = collect
  }
  return {data=data, code=statusCode}
end

function parseGameStateFromResponse(apiResult)
  if apiResult == "No legal moves" or apiResult == nil then
    return
  end

  local split = splitString(apiResult, ",|\|")

  if split[4] ~= nil and split[5] ~= nil and split[6] ~= nil then
    stateForNextPiece = {
      board=split[4],
      level=split[5],
      lines=split[6]
    }
  end
end

-- Implementation of string split that I definitely didn't find on stack overflow
function splitString (inputstr, sep)
  if sep == nil then
          sep = "%s"
  end
  local t={}
  for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
          table.insert(t, str)
  end
  return t
end

--[[------------------------------------
---------- Handling Input --------------
------------------------------------]]--

function calculateInputs(apiResult, isAdjustment)
  if apiResult == "No legal moves" or apiResult == nil then
    if REACTION_TIME_FRAMES == 0 then
      -- Game is over when there is no placement for a new piece
      print("GAME OVER: No adjustment")
      gameOver = true
    end
    return
  end

  -- Parse the shifts and rotations from the API result
  local split = splitString(apiResult, ",|\|")
  inputSequence = split[3]
  if inputSequence == nil or inputSequence == "none" then
    inputSequence = ""
  end

  -- Reset ARR counter if is an adjustment and can first-frame shift
  if isAdjustment then
    arrFrameIndex = 0
  end
end


function executeInputs()
  if not gameOver then

    local inputsThisFrame = {A=false, B=false, left=false, right=false, up=false, down=false, select=false, start=false}

    if inputSequence == null or arrFrameIndex + 1 > string.len(inputSequence) then
      -- print("Input sequence null or frame index out of bounds" .. arrFrameIndex)
      -- print(inputSequence)
      joypad.set(1, inputsThisFrame)
      return
    end

    local thisFrameStr = getInputForFrame(arrFrameIndex)
    print(arrFrameIndex .. "  " .. thisFrameStr)

    inputsThisFrame.A = (thisFrameStr == "A" or thisFrameStr == "E" or thisFrameStr == "I")
    inputsThisFrame.B = (thisFrameStr == "B" or thisFrameStr == "F" or thisFrameStr == "G")
    inputsThisFrame.left = (thisFrameStr == "L" or thisFrameStr == "E" or thisFrameStr == "F")
    inputsThisFrame.right = (thisFrameStr == "R" or thisFrameStr == "I" or thisFrameStr == "G")

    if inputsThisFrame.left then
      shiftsExecuted = shiftsExecuted - 1
    elseif inputsThisFrame.right then
      shiftsExecuted = shiftsExecuted + 1
    end

    -- Debug logs
    if inputsThisFrame.left or inputsThisFrame.right then
      print("SHIFT " .. emu.framecount())
    end

    -- Send our computed inputs to the controller
    joypad.set(1, inputsThisFrame)
  end
end

--[[------------------------------------
------- Performance Monitoring  --------
------------------------------------]]--

-- Monitors the number of frames run per real clock second
function getMs()
  return socket.gettime()*1000
end

framesElapsed = 0
secsElapsed = 0
startTime = getMs()

function trackAndLogFps()
  framesElapsed = framesElapsed + 1
  local msElapsed = getMs() - startTime
  if msElapsed > (secsElapsed + 1) * 1000 then
    secsElapsed = secsElapsed + 1
    if secsElapsed % 30 == 0 then
      print("Average FPS: " .. framesElapsed / secsElapsed)
    end
  end
end

--[[------------------------------------
------------ Game Events  --------------
------------------------------------]]--

function onFirstFrameOfNewPiece()
  -- Read values from memory
  local function bcdToDecimal(a)
    return 10 * (a - (a % 16)) / 16 + (a % 16)
  end
  pcur = memory.readbyte(0x0042) -- Stores current/next pieces before they even appear onscreen
  pnext = memory.readbyte(0x0019)
  numLines = bcdToDecimal(memory.readbyte(0x0051)) * 100 + bcdToDecimal(memory.readbyte(0x0050))
  level = memory.readbyte(0x0044)

  resetPieceScopedVars()

  print("--------------------")
  print(orientToPiece[pcur])

  -- If it's the first piece, make an 'adjustment' to do the initial placement
  if isFirstPiece then
    offsetXAtAdjustmentTime = 0
    rotationAtAdjustmentTime = 0
    canFirstFrameShiftAtAdjustmentTime = true
    offsetYAtAdjustmentTime = 0
    requestAdjustmentAsync()

  elseif not gameOver and waitingOnAsyncRequest then
    -- Check in on the result of the previous async request for the inital placement
    local apiResult = fetchAsyncResult()
    parsePrecompute(apiResult)
  end
end


-- Called when the piece is locked.
--   NOTE: THE BOARD/LEVEL/LINES ARE NOT UPDATED.  That's why there's the whole
--   shenanigans of tracking the state from the last API request
function asPieceLocks()
  print("Piece locked" .. emu.framecount() .. "  " .. frameIndex)

  -- Once the first piece locks, it's not the first piece anymore
  isFirstPiece = false

  -- If it hasn't already, queue up the next precompute
  if not waitingOnAsyncRequest then
    requestPrecompute()
  end
end


-- Called when reaction time has passed and it's time to perform the adjustment
function processAdjustment()
  if (adjustmentLookup == {}) then
    error("No adjustment lookup found")
  end
  print("Time for adjustment " .. frameIndex .. ", " .. arrFrameIndex)

  if isFirstPiece then
    local adjustmentApiResult = fetchAsyncResult()
    calculateInputs(adjustmentApiResult, true)
    baseSequence = inputSequence
    parseGameStateFromResponse(adjustmentApiResult)
  else
    local adjustmentApiResult = adjustmentLookup[orientToPiece[pnext]]
    calculateInputs(adjustmentApiResult, true)
    parseGameStateFromResponse(adjustmentApiResult)
  end
end

--[[-----------------------------------
---------- Drawing Logic  -------------
-----------------------------------]]--

-- Colors are r,g,b,alpha for some reason???

-- TODO: MAKE PREADJUST FLOAT
function drawHUD()
  if gamePhase == 1 and baseSequence ~= nil and baseSequence ~= "" then
    -- gui.text(8,8, baseSequence)
    startSequence = string.sub(baseSequence, 1, REACTION_TIME_FRAMES)
    local shift, rot, drop = getRestingPos(startSequence)
    if(isFirstPiece) then drop = drop + 1 end
    drawPiece(shift,drop,orientToNum[pcur],rot)
    drawTrajectory(startSequence, isFirstPiece)
    -- local test = 16

    -- Sort each suffix
    if adjustmentLookup ~= {} then
      local suffixCounts = {}
      for piece,adjust in pairs(adjustmentLookup) do
        if adjust ~= nil and adjust ~= "No legal moves" then
          local suffix = splitString(adjust, ",|\|")[3]
          if suffixCounts[suffix] == nil then
            suffixCounts[suffix] = 0
          else
            suffixCounts[suffix] = suffixCounts[suffix] + 1
          end
        end
      end

      local colors = {0x0000FFBF, 0x007FFFBF, 0x00FFFFBF, 0x00FF7FBF, 0x7F00FFBF, 0x003FFFBF, 0x5E00FFBF}
      local inc = 1
      for suffix, count in pairs(suffixCounts) do
        shift, rot, drop = getRestingPos(changeSuffix(baseSequence, suffix))
        drawPiece(shift,drop,orientToNum[pcur],rot, colors[inc], OR(colors[inc], 0xFF))
        drawTrajectory(changeSuffix(baseSequence, suffix), isFirstPiece, OR(colors[inc],0xFF))
        inc = inc + 1
      end
      -- shift, rot, drop = getRestingPos(changeSuffix(baseSequence, suffix))
      -- drawPiece(shift,drop,orientToNum[pcur],rot)
    end
    drawTrajectory(string.sub(baseSequence, 1, REACTION_TIME_FRAMES), isFirstPiece, 0x808080FF)
  end
end

function drawCell(x, y, fill, outline)
  if fill == nil then fill = 0xFFFFFFBF end
  if outline == nil then outline = 0xFFFFFFFF end
  gui.drawrect(96 + 8*(x-1)-1, 48+8*(y-1)-1, 96+8*x-1, 48+8*y-1, fill, 0x00000000)
end

coords = {
  {
    {{0, 1}, {0, 0}, {1, 0}, {-1, 0}},
    {{0, 1}, {0, 0}, {1, 0}, {0, -1}},
    {{-1, 0}, {0, 0}, {1, 0}, {0, -1}},
    {{0, 1}, {0, 0}, {0, -1}, {-1, 0}}
  },
  {
    {{-1, 0}, {0, 0}, {1, 0}, {1, 1}},
    {{0, -1}, {1, -1}, {0, 0}, {0, 1}},
    {{-1, -1}, {-1, 0}, {0, 0}, {1, 0}},
    {{0, -1}, {0, 0}, {-1, 1}, {0, 1}}
  },
  {
    {{-1, 0}, {0, 0}, {0, 1}, {1, 1}},
    {{1, -1}, {0, 0}, {1, 0}, {0, 1}}
  },
  {
    {{-1, 0}, {0, 0}, {-1, 1}, {0, 1}}
  },
  {
    {{0, 0}, {1, 0}, {-1, 1}, {0, 1}},
    {{0, -1}, {0, 0}, {1, 0}, {1, 1}}
  },
  {
  {
    {-1, 0}, {0, 0}, {1, 0}, {-1, 1}},
    {{0, -1}, {0, 0}, {0, 1}, {1, 1}},
    {{1, -1}, {-1, 0}, {0, 0}, {1, 0}},
    {{-1, -1}, {0, -1}, {0, 0}, {0, 1}}
  },
  {
    {{-2, 0}, {-1, 0}, {0, 0}, {1, 0}},
    {{0, -2}, {0, -1}, {0, 0}, {0, 1}}
  }
}

function drawPiece(x, y, type, orient, fill, outline)
  -- print(coords[type][orient])
  if coords[type] == nil then return end
  for _,coord in ipairs(coords[type][orient]) do
    drawCell(x+coord[1], y+coord[2], fill, outline)
  end
end

function changeSuffix(inputs, adjustment)
  return string.sub(inputs,1,REACTION_TIME_FRAMES) .. adjustment
end

gravity = {48,43,38,33,28,23,18,13,8,6,5,5,5,4,4,4,3,3,3,2,2,2,2,2,2,2,2,2,2}

function getRestingPos(inputSequence)
  local shift = 6
  local rot = 1
  local drop = 0
  for i = 1,#inputSequence do
    local char = string.sub(inputSequence,i,i)
    if char == "A" then
      rot = rot - 1
    elseif char == "B" then
      rot = rot + 1
    elseif char == "L" then
      shift = shift - 1
    elseif char == "R" then
      shift = shift + 1
    -- Combo cases
    elseif char == "E" then
      shift = shift - 1
      rot = rot - 1
    elseif char == "F" then
      shift = shift - 1
      rot = rot + 1
    elseif char == "I" then
      shift = shift + 1
      rot = rot - 1
    elseif char == "G" then
      shift = shift + 1
      rot = rot + 1
    elseif char == "*" or char == "^" then
      drop = drop - 1
    elseif char == "." then
      -- Do nothing
    else
      error("Unknown character in input sequence" .. char)
    end
    drop = drop + 1
  end
  rot = rot % #coords[orientToNum[pcur]]
  if rot == 0 then rot = #coords[orientToNum[pcur]] end
  local fall = 1
  if level < 29 then fall = gravity[level + 1] end

  -- if drop % fall ~= 0 then print("INCORRECT DROP THING") end
  return shift, rot, math.floor(drop / fall)
end

function drawTrajectory(inputSequence, firstPiece, color)
  if color == nil then color = 0xFFFFFFFF end
  local curX, curY = 6,1
  local fall = 1
  if level < 29 then fall = gravity[level + 1] end
  for i = 1,#inputSequence do
    local oldX,oldY = curX,curY
    local char = string.sub(inputSequence,i,i)
    if char == "L" or char == "E" or char == "F" then
      curX = curX - 1
    elseif char == "R" or char == "I" or char == "G" then
      curX = curX + 1
    elseif char == "*" or char == "^" then
      break
    elseif char == "." or char == "A" or char == "B" then
      -- Do nothing
    else
      error("Unknown character in input sequence" .. char)
    end
    if i % fall == 0 and not firstPiece and string.sub(inputSequence,i+1,i+1) ~= "*" and string.sub(inputSequence,i+1,i+1) ~= "^" then
      curY = curY + 1
    end
    gui.drawline(92 + 8*oldX, 44+8*oldY, 92+8*curX, 44+8*curY, color)
  end
  if firstPiece then
    gui.drawline(92 + 8*curX, 44+8*curY, 92+8*curX, 44+8*20, color)
  end
end

--[[------------------------------------
---------- Main Game Loop  -------------
------------------------------------]]--

function runGameFrame()
  local gamePhaseLastFrame = gamePhase
  gamePhase = memory.readbyte(0x0048)
  if(gamePhase == 1) then
    if(gamePhaseLastFrame ~= 1) then
      -- First active frame for piece. This is where board state/input sequence is calculated
      onFirstFrameOfNewPiece()
    end
    if frameIndex == REACTION_TIME_FRAMES and (SHOULD_ADJUST or isFirstPiece)  then
      -- Once reaction time is over, handle adjustment
      processAdjustment()
    elseif frameIndex == REACTION_TIME_FRAMES + 1 then
      -- Precompute the next placement
      requestPrecompute()
    end

    -- Execute input sequence
    executeInputs()
    frameIndex = frameIndex + 1
    arrFrameIndex = arrFrameIndex + 1

  -- Do stuff right when the piece locks.
  elseif gamePhase >= 2 and gamePhase <= 8 then
    if gamePhaseLastFrame == 1 then
      if not isFirstPiece and not gameOver and getInputForFrame(arrFrameIndex + 1) ~= "*" then
        print(inputSequence)
        error("Server mistimed lock delay")
      end
      asPieceLocks()
      return
    end
    -- If the agent is mistaken about the board state, crash immediately so I can debug it
    if gamePhase == 8 and not gameOver and getEncodedBoard() ~= stateForNextPiece.board then
      error("Divergence")
    end

  -- Resets the index for the next piece. Disables user input when the game is not over.
  elseif not gameOver or recording then
    joypad.set(1, {A=false,B=false,left=false,right=false,up=false,down=false,select=false,start=false})
  end
end




--[[--------------------------------------------------------
--------------------- Main Frame Loop-----------------------
--------------------------------------------------------]]--


function eachFrame()
  --Update metaGameState
  local metaGameStateLastFrame = metaGameState
  metaGameState = memory.readbyte(0x00C0)

  --Game starts
  if(metaGameStateLastFrame == 3 and metaGameState == 4) then
    if(SHOULD_RECORD_GAMES) then
      local dateStr = os.date("%m-%d %H %M")
      print(dateStr)
      movieName = "StackRabbit" .. dateStr
      print(movieName)
      movie.record(MOVIE_PATH .. movieName .. ".fm2", 1, "gregcannon")
    end
  end

  --Game ends, clean up data
  if(metaGameStateLastFrame == 4 and metaGameState == 3) then
  resetGameScopedVariables()
  if movie.active() then
      movie.stop()
      end
  end

  if(metaGameState < 4) then
    -- Currently on menu
  end

  if(metaGameState == 4) then
    runGameFrame()
  end
  drawHUD()
  trackAndLogFps()
end

emu.registerafter(eachFrame)