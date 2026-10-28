import { cellsSignature, type TetrisEngine } from './gameEngine.ts';
import {
  createSpawnPiece,
  detectTSpin,
  getGhostPiece,
  getPieceCells,
  isValidPosition,
  tryRotate,
} from './srs.ts';
import type { ActivePiece, CellColor, LessonStep, PieceType } from './types.ts';

export type AtomicAction =
  | 'left'
  | 'right'
  | 'dasLeft'
  | 'dasRight'
  | 'cw'
  | 'ccw'
  | 'rot180'
  | 'softDrop'
  | 'sonicDrop'
  | 'hardDrop';

export const ACTION_LABELS_ES: Record<AtomicAction, string> = {
  left: '← Izq',
  right: '→ Der',
  dasLeft: '⇐ DAS Izq',
  dasRight: '⇒ DAS Der',
  cw: '↻ Giro Horario (↑/X)',
  ccw: '↺ Giro Antihorario (Z)',
  rot180: '⟳ Giro 180° (A)',
  softDrop: '↓ Bajar 1',
  sonicDrop: '⇓ Bajar hasta tocar suelo (↓)',
  hardDrop: '⤓ Hard Drop (Espacio)',
};

export interface SRSPathResult {
  reachable: boolean;
  actions: AtomicAction[];
  finalPiece: ActivePiece;
  isTSpin: boolean;
  isMini: boolean;
  kickIndex: number;
}

/**
 * Finds a clean, human-like sequence of Guideline SRS inputs from spawn to lock
 * at the exact target 4 cells of `step`.
 */
export function findSRSPath(
  board: CellColor[][],
  step: LessonStep,
  requireTSpinIfTAttack = false
): SRSPathResult | null {
  const spawn = createSpawnPiece(step.piece, board);
  if (!isValidPosition(board, spawn)) return null;

  const targetPiece: ActivePiece = {
    type: step.piece,
    rotation: step.rotation,
    x: step.x,
    y: step.y,
  };
  if (!isValidPosition(board, targetPiece)) return null;

  // Target must be grounded when locked!
  const targetGrounded = !isValidPosition(board, { ...targetPiece, y: targetPiece.y - 1 });
  if (!targetGrounded) return null;

  const targetSig = cellsSignature(getPieceCells(targetPiece));

  interface Node {
    piece: ActivePiece;
    lastRot: boolean;
    kickIdx: number;
    actions: AtomicAction[];
  }

  // Fast check: can we reach horizontally at top and simply hardDrop?
  // (Only if we don't specifically need a T-Spin / overhang tuck)
  const visited = new Set<string>();
  const queue: Node[] = [
    { piece: spawn, lastRot: false, kickIdx: 0, actions: [] },
  ];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const { piece, lastRot, kickIdx, actions } = cur;

    const stateKey = `${piece.x},${piece.y},${piece.rotation},${lastRot ? 1 : 0}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    const grounded = !isValidPosition(board, { ...piece, y: piece.y - 1 });
    if (grounded && cellsSignature(getPieceCells(piece)) === targetSig) {
      const tspin = detectTSpin(board, piece, lastRot, kickIdx);
      if (!requireTSpinIfTAttack || tspin.isTSpin) {
        return {
          reachable: true,
          actions: [...actions, 'hardDrop'],
          finalPiece: piece,
          isTSpin: tspin.isTSpin,
          isMini: tspin.isMini,
          kickIndex: kickIdx,
        };
      }
    }

    // Also check if hard dropping right now from above lands on targetSig (when T-spin not required)
    if (!requireTSpinIfTAttack) {
      const ghost = getGhostPiece(board, piece);
      if (ghost.y < piece.y && cellsSignature(getPieceCells(ghost)) === targetSig) {
        return {
          reachable: true,
          actions: [...actions, 'hardDrop'],
          finalPiece: ghost,
          isTSpin: false,
          isMini: false,
          kickIndex: 0,
        };
      }
    }

    if (actions.length >= 26) continue;

    // Generate neighbor actions in clean human order:
    // 1. Horizontal moves
    const leftP = { ...piece, x: piece.x - 1 };
    if (isValidPosition(board, leftP)) {
      queue.push({ piece: leftP, lastRot: false, kickIdx: 0, actions: [...actions, 'left'] });
    }
    const rightP = { ...piece, x: piece.x + 1 };
    if (isValidPosition(board, rightP)) {
      queue.push({ piece: rightP, lastRot: false, kickIdx: 0, actions: [...actions, 'right'] });
    }

    // DAS Left / Right (only when high up or useful to keep action list concise)
    let dasL = { ...piece };
    while (isValidPosition(board, { ...dasL, x: dasL.x - 1 })) dasL.x -= 1;
    if (dasL.x < piece.x - 1) {
      queue.push({ piece: dasL, lastRot: false, kickIdx: 0, actions: [...actions, 'dasLeft'] });
    }
    let dasR = { ...piece };
    while (isValidPosition(board, { ...dasR, x: dasR.x + 1 })) dasR.x += 1;
    if (dasR.x > piece.x + 1) {
      queue.push({ piece: dasR, lastRot: false, kickIdx: 0, actions: [...actions, 'dasRight'] });
    }

    // 2. Rotations (CW, CCW, 180)
    const cwRes = tryRotate(board, piece, 1);
    if (cwRes) {
      queue.push({
        piece: cwRes.piece,
        lastRot: true,
        kickIdx: cwRes.kickIndex,
        actions: [...actions, 'cw'],
      });
    }
    const ccwRes = tryRotate(board, piece, -1);
    if (ccwRes) {
      queue.push({
        piece: ccwRes.piece,
        lastRot: true,
        kickIdx: ccwRes.kickIndex,
        actions: [...actions, 'ccw'],
      });
    }
    const r180Res = tryRotate(board, piece, 2);
    if (r180Res) {
      queue.push({
        piece: r180Res.piece,
        lastRot: true,
        kickIdx: r180Res.kickIndex,
        actions: [...actions, 'rot180'],
      });
    }

    // 3. Sonic Drop (drop all the way to current surface before tucking/rotating!)
    const sonic = getGhostPiece(board, piece);
    if (sonic.y < piece.y - 1) {
      queue.push({
        piece: sonic,
        lastRot: false,
        kickIdx: 0,
        actions: [...actions, 'sonicDrop'],
      });
    }

    // 4. Single Soft Drop (essential for mid-air overhangs / TST kicks where you drop partially or step down!)
    const downP = { ...piece, y: piece.y - 1 };
    if (isValidPosition(board, downP)) {
      queue.push({
        piece: downP,
        lastRot: false,
        kickIdx: 0,
        actions: [...actions, 'softDrop'],
      });
    }
  }

  return null;
}

export function findSRSPathForPieceType(
  board: CellColor[][],
  pieceType: PieceType,
  targetCells: Array<[number, number]>,
  requireTSpin = false
): SRSPathResult | null {
  // Check all 4 rotations and bounding box anchors that match targetCells
  const targetSig = cellsSignature(targetCells);
  const minX = Math.min(...targetCells.map(([x]) => x)) - 3;
  const maxX = Math.max(...targetCells.map(([x]) => x));
  const minY = Math.min(...targetCells.map(([, y]) => y)) - 3;
  const maxY = Math.max(...targetCells.map(([, y]) => y));

  for (const rot of [0, 1, 2, 3] as const) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const p: ActivePiece = { type: pieceType, rotation: rot, x, y };
        if (cellsSignature(getPieceCells(p)) === targetSig) {
          const res = findSRSPath(
            board,
            { piece: pieceType, rotation: rot, x, y, role: 'attack' },
            requireTSpin
          );
          if (res) return res;
        }
      }
    }
  }
  return null;
}

export function executeAtomicAction(engine: TetrisEngine, action: AtomicAction): void {
  switch (action) {
    case 'left':
      engine.moveHorizontal(-1);
      break;
    case 'right':
      engine.moveHorizontal(1);
      break;
    case 'dasLeft':
      engine.dasHorizontal(-1);
      break;
    case 'dasRight':
      engine.dasHorizontal(1);
      break;
    case 'cw':
      engine.rotate(1);
      break;
    case 'ccw':
      engine.rotate(-1);
      break;
    case 'rot180':
      engine.rotate(2);
      break;
    case 'softDrop':
      engine.softDropOne();
      break;
    case 'sonicDrop':
      engine.sonicDrop();
      break;
    case 'hardDrop':
      engine.hardDrop();
      break;
  }
}
