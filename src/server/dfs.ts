import {
  pieceCollision,
  _modulus,
  _validateIntParam,
} from "./board_helper";
import { getPossibilityFromSimState } from "./move_search";
import { logBoard } from "./utils";

// Determine the x increment to apply based on the encoded input
const X_INCREMENT_LOOKUP = {
  L: -1,
  E: -1, // L + A
  F: -1, // L + B
  R: 1,
  I: 1, // R + A
  G: 1, // R + B
};
// Determine the rotation to apply based on the encoded input
const ROTATION_LOOKUP = {
  A: 1,
  E: 1, // A + L
  I: 1, // A + R
  B: -1,
  F: -1, // B + L
  G: -1, // B + R
};

export function searchForTucksOrSpins(
  potentialTuckSpinStates: Array<DFSState>,
  simParams: SimParams,
  lockHeightLookup: Map<string, number>
): Array<PossibilityChain> {
  const novelPossibilities = [];
  for (const simState of potentialTuckSpinStates) {
    for (const inputChar of "eifgLRab") {
      const xDelta = X_INCREMENT_LOOKUP[inputChar] || 0;
      const rotDelta = ROTATION_LOOKUP[inputChar] || 0;
      const newRot = _modulus(
        simState.rotationIndex + rotDelta,
        simParams.rotationsList.length
      );
      const newX = simState.x + xDelta;

      if (
        !hasBeenVisited(newX, newRot, simState, lockHeightLookup)
      ) {
        // Potential new state! (If it's legal)
        tryInput(inputChar, newX, newRot, simState, simParams, lockHeightLookup, novelPossibilities);
      }
    }
  }
  return novelPossibilities;
}

/** A custom visited check that avoids creating an expensive set object with all the states */
function hasBeenVisited(
  newX,
  newRot,
  simState: SimState,
  lockHeightLookup
): boolean {
  
  const highestYSeen = lockHeightLookup.get(newRot + "," + newX);
  // If we've already reached this Y value by just placing it in this column normally (or with another tuck), it's been visited
  return simState.y <= highestYSeen;
}

/**
 * Tries out an input from a given state, and if it's valid, adds it to the active list.
 * If the piece locks in after the input, it will also add that finished state to the final list.
 */
function tryInput(
  inputChar: string,
  newX: number,
  newRotationIndex: number,
  parentSimState: DFSState,
  simParams: SimParams,
  lockHeightLookup: Map<string, number>,
  novelPossibilities: Array<Possibility>
): void {
  let hasDoneInput = false;
  let simState = {...parentSimState}

  while (true) {
    // Run a simulated 'frame' of gravity, shifting, and collision checking
    const isGravityFrame =
      simState.frameIndex % simParams.gravity === simParams.gravity - 1; // Returns true every Nth frame, where N = gravity

    if (!hasDoneInput) {
      // Try shifting if needed
      if (
        newX !== simState.x &&
        pieceCollision(
          simParams.board,
          newX,
          simState.y,
          simParams.rotationsList[simState.rotationIndex]
        )
      ) {
        debugLog(simState, simParams, "SHIFT COLLISION");

        // Failed to perform input, don't add this state
        return;
      }

      // Try rotating if needed
      if (
        newRotationIndex !== simState.rotationIndex &&
        pieceCollision(
          simParams.board,
          simState.x,
          simState.y,
          simParams.rotationsList[newRotationIndex]
        )
      ) {
        debugLog(simState, simParams, "ROTATION COLLISION");

        // Failed to perform input, don't add this state
        return;
      }

      // It worked!
      simState.inputSequence += inputChar;
      simState.x = newX;
      simState.rotationIndex = newRotationIndex;
      hasDoneInput = true;
    }

    // Apply gravity on gravity frames, regardless of what inputChar is
    if (isGravityFrame) {
      if (
        pieceCollision(
          simParams.board,
          simState.x,
          simState.y + 1,
          simParams.rotationsList[simState.rotationIndex]
        )
      ) {
        debugLog(simState, simParams, "GRAVITY");

        // Piece locked into the stack, so register the new highest Y and make a possibility for it!
        lockHeightLookup.set(
          simState.rotationIndex + "," + simState.x,
          simState.y
        );
        const newposs=  getPossibilityFromSimState(simState, simParams, simState.inputSequence);
        novelPossibilities.push(
          getPossibilityFromSimState(simState, simParams, simState.inputSequence)
        );
        logBoard(newposs.boardAfter);
        return;
      }
      // Otherwise it shifts down and we keep searching
      simState.y++;
    }
    simState.frameIndex += 1;
  }
}

function debugLog(simState: SimState, simParams: SimParams, reason: string) {
  // console.log("DEBUG: " + reason);
  // logBoard(
  //   getBoardAndLinesClearedAfterPlacement(
  //     simParams.board,
  //     simParams.rotationsList[simState.rotationIndex],
  //     simState.x,
  //     simState.y
  //   )[0]
  // );
}


// function speedTest(x) {
//   // console.time("\nspeedtest");
//   for (let i = 0; i < 1; i++) {
//     getPossibleMovesBfs(
//       getTestBoardWithHeight(x),
//       "L",
//       18,
//       0,
//       0,
//       0,
//       "X...",
//       0,
//       false
//     );
//   }
//   // console.timeEnd("\nspeedtest");
// }
// for (let i = 0; i < 30; i++) {
//   speedTest(0);
// }
