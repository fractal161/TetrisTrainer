const NUM_ROW = 20;
const NUM_COLUMN = 10;
const SquareState = Object.freeze({
  EMPTY: 0,
  FULL: 1,
});

function _getSurfaceArrayAndHoleCount(board) {
  const heights = [];
  let numHoles = 0;
  for (let col = 0; col < NUM_COLUMN; col++) {
    let row = 0;
    while (row < NUM_ROW && board[row][col] == 0) {
      row++;
    }
    heights.push(20 - row);
    while (row < NUM_ROW - 1) {
      row++;
      if (board[row][col] == 0 && col < NUM_COLUMN - 1) {
        // Add a hole if it's anywhere other than column 10
        numHoles++;
      }
    }
  }
  return [heights, numHoles];
}

/**
 * Gets a list of the heights of columns 0-9.
 * Used for rating the goodness of boards only, will not be used to reconstruct
 * boards (since it omits holes and the state of column 10).
 * @param {Array<Array<number>>} board
 */
function getSurfaceArray(board) {
  return _getSurfaceArrayAndHoleCount(board)[0].slice(0, 9);
}

function hasInvalidHeightDifferences(surfaceArray) {
  for (let i = 1; i < surfaceArray.length; i++) {
    if (Math.abs(surfaceArray[i] - surfaceArray[i - 1]) > 4) {
      return true;
    }
  }
  return false;
}

/**
 * Makes a copy of a surface that's corrected for height gaps that are to high.
 * e.g. an increase of 7 between two columns would be treated as an increase of 4
 * (for surface rating purposes only)
 * @param {*} surfaceArray
 */
function correctSurfaceForExtremeGaps(initialArray) {
  const newArray = JSON.parse(JSON.stringify(initialArray));
  let totalExcessHeight = 0; // Accumulator for the excess height trimmed away. Used for evaluation purposes.

  for (let i = 1; i < newArray.length; i++) {
    const diffFromPrev = newArray[i] - newArray[i - 1];
    if (Math.abs(diffFromPrev) > 4) {
      const correctionFactor = Math.abs(diffFromPrev) - 4; // The amount that it overshot by (always positive)
      for (let j = i; j < newArray.length; j++) {
        newArray[j] +=
          diffFromPrev > 0 ? -1 * correctionFactor : correctionFactor;
      }
      totalExcessHeight += correctionFactor;
    }
  }
  return [newArray, totalExcessHeight];
}

function getHoleCount(board) {
  return _getSurfaceArrayAndHoleCount(board)[1];
}

function getMaxColumnHeight(board) {
  const heights = _getSurfaceArrayAndHoleCount(board)[0];
  return Math.max(...heights.slice(1));
}

function getAverageColumnHeight(board) {
  const heights = _getSurfaceArrayAndHoleCount(board)[0].slice(1, 9);
  let totalHeight = 0;
  for (let height of heights) {
    totalHeight += height;
  }
  return totalHeight / 8;
}

function logBoard(board) {
  console.log(" -- Board start -- ");
  for (let r = 0; r < NUM_ROW; r++) {
    let rowStr = "";
    for (let c = 0; c < NUM_COLUMN; c++) {
      rowStr += board[r][c];
    }
    console.log(rowStr.replace(/0/g, "."));
  }
}

module.exports = {
  NUM_ROW,
  NUM_COLUMN,
  SquareState,
  getSurfaceArray,
  getHoleCount: getHoleCount,
  hasValidHeightDifferences: hasInvalidHeightDifferences,
  getMaxColumnHeight,
  getAverageColumnHeight,
  logBoard,
  correctSurfaceForExtremeGaps,
};
