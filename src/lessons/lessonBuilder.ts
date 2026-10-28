import {
  applyDirectPlacement,
  cellsSignature,
  cloneBoard,
  parseTopDownBoard,
} from '../engine/gameEngine.ts';
import { BOARD_WIDTH, getPieceCells } from '../engine/srs.ts';
import { findSRSPath } from '../engine/srsPathfinder.ts';
import type {
  ActivePiece,
  CellColor,
  ClearKind,
  LessonStep,
  PieceType,
  RotationState,
} from '../engine/types.ts';

export interface StageTokenSpec {
  token: string;
  piece: PieceType;
  role?: 'build' | 'attack';
  expectedClear?: ClearKind | 'PC' | 'ANY_LINE';
  hint?: string;
  spinInstruction?: string;
  requireTSpin?: boolean;
}

/**
 * Given 4 board coordinates (x, y) and a PieceType, returns all (rotation, x, y) ActivePieces
 * whose 4 cells match those exact coordinates.
 */
export function resolvePiecePlacements(
  piece: PieceType,
  cells: Array<[number, number]>
): ActivePiece[] {
  if (cells.length !== 4) {
    throw new Error(`Piece ${piece} must have 4 cells, got ${cells.length}: ${JSON.stringify(cells)}`);
  }
  const targetSig = cellsSignature(cells);
  const minX = Math.min(...cells.map(([x]) => x)) - 3;
  const maxX = Math.max(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y)) - 3;
  const maxY = Math.max(...cells.map(([, y]) => y));

  const matches: ActivePiece[] = [];
  for (const rot of [0, 1, 2, 3] as RotationState[]) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const candidate: ActivePiece = { type: piece, rotation: rot, x, y };
        if (cellsSignature(getPieceCells(candidate)) === targetSig) {
          matches.push(candidate);
        }
      }
    }
  }
  if (matches.length === 0) {
    throw new Error(
      `Invalid shape for piece ${piece} at cells ${JSON.stringify(cells)}`
    );
  }
  return matches;
}

/**
 * Compiles one stage of placements drawn on `diagramTopDown` (on top of `currentBoard`).
 * - Characters in `diagramTopDown` that match a token in `specs` (or default 'I','O','T','S','Z','J','L')
 *   are extracted as 4-cell pieces.
 * - Characters '#' or 'G' or existing board blocks are ignored (assumed already on `currentBoard`).
 * - Automatically finds a valid topological SRS-reachable placement order (respecting the order of `specs`
 *   whenever multiple pieces are simultaneously placeable!).
 */
export function compileStage(
  currentBoard: CellColor[][],
  diagramTopDown: string[],
  specs: StageTokenSpec[]
): { steps: LessonStep[]; nextBoard: CellColor[][] } {
  const height = diagramTopDown.length;
  const tokenCells = new Map<string, Array<[number, number]>>();

  for (const spec of specs) {
    tokenCells.set(spec.token, []);
  }

  for (let rowIdx = 0; rowIdx < height; rowIdx++) {
    const y = height - 1 - rowIdx;
    const line = diagramTopDown[rowIdx];
    if (line.length !== BOARD_WIDTH) {
      throw new Error(`Row "${line}" has length ${line.length}, expected ${BOARD_WIDTH}`);
    }
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const ch = line[x];
      if (tokenCells.has(ch)) {
        tokenCells.get(ch)!.push([x, y]);
      }
    }
  }

  // Verify every spec has 4 cells
  for (const spec of specs) {
    const cells = tokenCells.get(spec.token)!;
    if (cells.length !== 4) {
      throw new Error(
        `Token '${spec.token}' (${spec.piece}) has ${cells.length} cells in diagram, expected 4.`
      );
    }
  }

  let board = cloneBoard(currentBoard);
  const remaining = [...specs];
  const compiledSteps: LessonStep[] = [];

  while (remaining.length > 0) {
    let placedIdx = -1;
    let chosenStep: LessonStep | null = null;

    for (let i = 0; i < remaining.length; i++) {
      const spec = remaining[i];
      const cells = tokenCells.get(spec.token)!;

      // Do not allow an earlier non-clearing piece to accidentally trigger a line clear if later build pieces occupy that row,
      // UNLESS spec.expectedClear is set or it's the last piece in the stage!
      const candidates = resolvePiecePlacements(spec.piece, cells);
      const needTSpin =
        spec.requireTSpin ??
        (spec.piece === 'T' &&
          (spec.expectedClear === 'TSS' ||
            spec.expectedClear === 'TSD' ||
            spec.expectedClear === 'TST' ||
            spec.expectedClear === 'TSMS' ||
            spec.expectedClear === 'TSMD'));

      for (const cand of candidates) {
        const stepCandidate: LessonStep = {
          piece: spec.piece,
          rotation: cand.rotation,
          x: cand.x,
          y: cand.y,
          role: spec.role ?? 'build',
          expectedClear: spec.expectedClear,
          hint: spec.hint,
          spinInstruction: spec.spinInstruction,
        };
        const path = findSRSPath(board, stepCandidate, needTSpin);
        if (path && path.reachable) {
          // Check if placing this piece prematurely clears a line that still has unplaced stage tokens on/above it!
          const sim = applyDirectPlacement(board, path.finalPiece);
          const prematureClear = sim.linesCleared > 0 && !spec.expectedClear && remaining.length > 1;
          if (!prematureClear) {
            placedIdx = i;
            chosenStep = {
              ...stepCandidate,
              rotation: path.finalPiece.rotation,
              x: path.finalPiece.x,
              y: path.finalPiece.y,
            };
            break;
          }
        }
      }
      if (chosenStep) break;
    }

    if (!chosenStep || placedIdx === -1) {
      const remTokens = remaining.map((r) => `${r.token}(${r.piece})`).join(', ');
      throw new Error(
        `Could not find grounded SRS-reachable placement order for remaining tokens: [${remTokens}]`
      );
    }

    compiledSteps.push(chosenStep);
    board = applyDirectPlacement(board, {
      type: chosenStep.piece,
      rotation: chosenStep.rotation,
      x: chosenStep.x,
      y: chosenStep.y,
    }).board;
    remaining.splice(placedIdx, 1);
  }

  return { steps: compiledSteps, nextBoard: board };
}

/**
 * Multi-stage lesson compiler: takes an initial ASCII board and an array of stages,
 * returning the complete verified `steps` array!
 */
export function compileMultiStageSteps(
  initialBoardTopDown: string[],
  stages: Array<{
    diagramTopDown: string[];
    specs: StageTokenSpec[];
  }>
): LessonStep[] {
  let board = parseTopDownBoard(initialBoardTopDown);
  const allSteps: LessonStep[] = [];
  for (let sIdx = 0; sIdx < stages.length; sIdx++) {
    const res = compileStage(board, stages[sIdx].diagramTopDown, stages[sIdx].specs);
    allSteps.push(...res.steps);
    board = res.nextBoard;
  }
  return allSteps;
}
