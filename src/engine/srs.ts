import type { ActivePiece, CellColor, PieceType, RotationState } from './types.ts';

export const BOARD_WIDTH = 10;
export const VISIBLE_HEIGHT = 20;
export const BUFFER_HEIGHT = 20;
export const TOTAL_HEIGHT = VISIBLE_HEIGHT + BUFFER_HEIGHT; // 40 rows (0 = floor .. 39 = top buffer)

export const ALL_PIECES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export const PIECE_COLORS: Record<PieceType | 'G', { fill: string; glow: string; light: string; dark: string }> = {
  I: { fill: '#00e5ff', glow: 'rgba(0, 229, 255, 0.45)', light: '#80f2ff', dark: '#0097a7' },
  O: { fill: '#ffd600', glow: 'rgba(255, 214, 0, 0.45)', light: '#ffea80', dark: '#c7a500' },
  T: { fill: '#b347ff', glow: 'rgba(179, 71, 255, 0.45)', light: '#d9a3ff', dark: '#7b1fa2' },
  S: { fill: '#00e676', glow: 'rgba(0, 230, 118, 0.45)', light: '#80f3bb', dark: '#00a152' },
  Z: { fill: '#ff3d57', glow: 'rgba(255, 61, 87, 0.45)', light: '#ff9eab', dark: '#c62828' },
  J: { fill: '#2979ff', glow: 'rgba(41, 121, 255, 0.45)', light: '#94bcff', dark: '#1565c0' },
  L: { fill: '#ff9100', glow: 'rgba(255, 145, 0, 0.45)', light: '#ffc880', dark: '#e65100' },
  G: { fill: '#64748b', glow: 'rgba(100, 116, 139, 0.25)', light: '#94a3b8', dark: '#475569' },
};

/**
 * Piece cells relative to bottom-left bounding box anchor (x, y)
 * where +x = right (0..size-1), +y = UP (0..size-1).
 * Matches Official SRS True Rotation Centers 100%.
 */
export const PIECE_SHAPES: Record<PieceType, Record<RotationState, ReadonlyArray<readonly [number, number]>>> = {
  T: {
    0: [[0, 1], [1, 1], [2, 1], [1, 2]],
    1: [[1, 2], [1, 1], [1, 0], [2, 1]],
    2: [[2, 1], [1, 1], [0, 1], [1, 0]],
    3: [[1, 0], [1, 1], [1, 2], [0, 1]],
  },
  J: {
    0: [[0, 2], [0, 1], [1, 1], [2, 1]],
    1: [[2, 2], [1, 2], [1, 1], [1, 0]],
    2: [[2, 0], [2, 1], [1, 1], [0, 1]],
    3: [[0, 0], [1, 0], [1, 1], [1, 2]],
  },
  L: {
    0: [[0, 1], [1, 1], [2, 1], [2, 2]],
    1: [[1, 2], [1, 1], [1, 0], [2, 0]],
    2: [[2, 1], [1, 1], [0, 1], [0, 0]],
    3: [[1, 0], [1, 1], [1, 2], [0, 2]],
  },
  S: {
    0: [[0, 1], [1, 1], [1, 2], [2, 2]],
    1: [[1, 2], [1, 1], [2, 1], [2, 0]],
    2: [[2, 1], [1, 1], [1, 0], [0, 0]],
    3: [[1, 0], [1, 1], [0, 1], [0, 2]],
  },
  Z: {
    0: [[0, 2], [1, 2], [1, 1], [2, 1]],
    1: [[2, 2], [2, 1], [1, 1], [1, 0]],
    2: [[2, 0], [1, 0], [1, 1], [0, 1]],
    3: [[0, 0], [0, 1], [1, 1], [1, 2]],
  },
  I: {
    0: [[0, 2], [1, 2], [2, 2], [3, 2]],
    1: [[2, 3], [2, 2], [2, 1], [2, 0]],
    2: [[3, 1], [2, 1], [1, 1], [0, 1]],
    3: [[1, 0], [1, 1], [1, 2], [1, 3]],
  },
  O: {
    0: [[1, 1], [2, 1], [1, 2], [2, 2]],
    1: [[1, 1], [2, 1], [1, 2], [2, 2]],
    2: [[1, 1], [2, 1], [1, 2], [2, 2]],
    3: [[1, 1], [2, 1], [1, 2], [2, 2]],
  },
};

/**
 * Official SRS Wall Kick tables (+x right, +y UP).
 * Key format: `${from}->${to}`
 */
const JLSTZ_KICKS: Record<string, ReadonlyArray<readonly [number, number]>> = {
  '0->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '1->0': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '1->2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '2->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '2->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '3->2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '3->0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '0->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  // SRS+ 180-degree kicks (TETR.IO / Jstris standard)
  '0->2': [[0, 0], [0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]],
  '2->0': [[0, 0], [0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0]],
  '1->3': [[0, 0], [1, 0], [1, 2], [1, 1], [0, 2], [0, 1]],
  '3->1': [[0, 0], [-1, 0], [-1, 2], [-1, 1], [0, 2], [0, 1]],
};

const I_KICKS: Record<string, ReadonlyArray<readonly [number, number]>> = {
  '0->1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '1->0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '1->2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  '2->1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '2->3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '3->2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '3->0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '0->3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  // SRS+ 180 kicks for I
  '0->2': [[0, 0], [0, 1]],
  '2->0': [[0, 0], [0, -1]],
  '1->3': [[0, 0], [1, 0]],
  '3->1': [[0, 0], [-1, 0]],
};

const O_KICKS: ReadonlyArray<readonly [number, number]> = [[0, 0]];

export function getKickTable(
  piece: PieceType,
  from: RotationState,
  to: RotationState
): ReadonlyArray<readonly [number, number]> {
  if (piece === 'O') return O_KICKS;
  const key = `${from}->${to}`;
  if (piece === 'I') return I_KICKS[key] ?? O_KICKS;
  return JLSTZ_KICKS[key] ?? O_KICKS;
}

export function getPieceCells(piece: ActivePiece): Array<[number, number]> {
  const offsets = PIECE_SHAPES[piece.type][piece.rotation];
  return offsets.map(([dx, dy]) => [piece.x + dx, piece.y + dy]);
}

export function isValidPosition(board: CellColor[][], piece: ActivePiece): boolean {
  const offsets = PIECE_SHAPES[piece.type][piece.rotation];
  for (let i = 0; i < offsets.length; i++) {
    const cx = piece.x + offsets[i][0];
    const cy = piece.y + offsets[i][1];
    if (cx < 0 || cx >= BOARD_WIDTH || cy < 0 || cy >= TOTAL_HEIGHT) {
      return false;
    }
    if (board[cy][cx] !== null) {
      return false;
    }
  }
  return true;
}

export function createSpawnPiece(type: PieceType, board?: CellColor[][]): ActivePiece {
  // Spawn at x = 3, y = 19 (so dy=1 is row 20, dy=2 is row 21, right at top of 20-high field)
  const p: ActivePiece = { type, rotation: 0, x: 3, y: 18 };
  // In Guideline, pieces spawn in rows 19-20 (0-indexed: row 19 is top visible row).
  // With y=18: dy=1 -> row 19, dy=2 -> row 20. If blocked, try y=19.
  if (board && !isValidPosition(board, p)) {
    const higher = { ...p, y: 19 };
    if (isValidPosition(board, higher)) return higher;
  }
  return p;
}

export function tryRotate(
  board: CellColor[][],
  piece: ActivePiece,
  delta: 1 | -1 | 2
): { piece: ActivePiece; kickIndex: number } | null {
  const to = (((piece.rotation + delta) % 4 + 4) % 4) as RotationState;
  const kicks = getKickTable(piece.type, piece.rotation, to);
  for (let i = 0; i < kicks.length; i++) {
    const [dx, dy] = kicks[i];
    const candidate: ActivePiece = {
      type: piece.type,
      rotation: to,
      x: piece.x + dx,
      y: piece.y + dy,
    };
    if (isValidPosition(board, candidate)) {
      return { piece: candidate, kickIndex: i };
    }
  }
  return null;
}

export function getGhostPiece(board: CellColor[][], piece: ActivePiece): ActivePiece {
  let ghost = { ...piece };
  while (isValidPosition(board, { ...ghost, y: ghost.y - 1 })) {
    ghost.y -= 1;
  }
  return ghost;
}

/**
 * Official Guideline 3-Corner T-Spin + Mini vs Proper Detection
 */
export function detectTSpin(
  board: CellColor[][],
  piece: ActivePiece,
  lastActionWasRotation: boolean,
  kickIndexUsed: number
): { isTSpin: boolean; isMini: boolean } {
  if (piece.type !== 'T' || !lastActionWasRotation) {
    return { isTSpin: false, isMini: false };
  }

  const isOccupied = (cx: number, cy: number): boolean => {
    if (cx < 0 || cx >= BOARD_WIDTH || cy < 0) return true; // Walls & floor count as solid corners
    if (cy >= TOTAL_HEIGHT) return false;
    return board[cy][cx] !== null;
  };

  // 4 corners of the 3x3 T bounding box
  const bl = isOccupied(piece.x, piece.y);
  const br = isOccupied(piece.x + 2, piece.y);
  const tl = isOccupied(piece.x, piece.y + 2);
  const tr = isOccupied(piece.x + 2, piece.y + 2);

  const cornerCount = (bl ? 1 : 0) + (br ? 1 : 0) + (tl ? 1 : 0) + (tr ? 1 : 0);
  if (cornerCount < 3) {
    return { isTSpin: false, isMini: false };
  }

  // Front corners based on T stem direction
  let frontCount = 0;
  switch (piece.rotation) {
    case 0: // North: top-left & top-right
      frontCount = (tl ? 1 : 0) + (tr ? 1 : 0);
      break;
    case 1: // East: top-right & bottom-right
      frontCount = (tr ? 1 : 0) + (br ? 1 : 0);
      break;
    case 2: // South: bottom-left & bottom-right
      frontCount = (bl ? 1 : 0) + (br ? 1 : 0);
      break;
    case 3: // West: top-left & bottom-left
      frontCount = (tl ? 1 : 0) + (bl ? 1 : 0);
      break;
  }

  // Kick index 4 (5th test: TST / Fin kick (±1, -2)) upgrades Mini -> Proper T-Spin!
  const isProper = frontCount === 2 || kickIndexUsed === 4;
  return { isTSpin: true, isMini: !isProper };
}

/**
 * Precompute exact Guideline Finesse (minimum keypresses & optimal sequence)
 * for reaching any horizontal column footprint from spawn (x=3, rot=0) on an open board.
 */
export interface FinesseEntry {
  steps: number;
  sequence: string[];
}

const finesseCache = new Map<string, FinesseEntry>();

function canonicalHorizontalSignature(piece: PieceType, x: number, rot: RotationState): string {
  // Normalize horizontal + relative vertical shape so symmetrical states (e.g. I rot 0 vs rot 2) match!
  const cells = PIECE_SHAPES[piece][rot].map(([dx, dy]) => [x + dx, dy] as const);
  const minY = Math.min(...cells.map(([, y]) => y));
  const normalized = cells
    .map(([cx, cy]) => `${cx},${cy - minY}`)
    .sort()
    .join('|');
  return `${piece}:${normalized}`;
}

function buildFinesseTable(): void {
  const emptyBoard: CellColor[][] = Array.from({ length: TOTAL_HEIGHT }, () =>
    Array<CellColor>(BOARD_WIDTH).fill(null)
  );

  for (const type of ALL_PIECES) {
    const start: ActivePiece = { type, rotation: 0, x: 3, y: 18 };
    const visitedState = new Set<string>();
    const queue: Array<{ piece: ActivePiece; seq: string[] }> = [{ piece: start, seq: [] }];

    while (queue.length > 0) {
      const { piece, seq } = queue.shift()!;
      const stateKey = `${piece.x},${piece.rotation}`;
      if (visitedState.has(stateKey)) continue;
      visitedState.add(stateKey);

      const sig = canonicalHorizontalSignature(type, piece.x, piece.rotation);
      if (!finesseCache.has(sig)) {
        finesseCache.set(sig, { steps: seq.length, sequence: seq });
      }

      // Atomic 1-keypress finesse moves
      const actions: Array<{ label: string; next: () => ActivePiece | null }> = [
        {
          label: '←',
          next: () => {
            const p = { ...piece, x: piece.x - 1 };
            return isValidPosition(emptyBoard, p) ? p : null;
          },
        },
        {
          label: '→',
          next: () => {
            const p = { ...piece, x: piece.x + 1 };
            return isValidPosition(emptyBoard, p) ? p : null;
          },
        },
        {
          label: 'DAS ←',
          next: () => {
            let p = { ...piece };
            while (isValidPosition(emptyBoard, { ...p, x: p.x - 1 })) p.x -= 1;
            return p.x !== piece.x ? p : null;
          },
        },
        {
          label: 'DAS →',
          next: () => {
            let p = { ...piece };
            while (isValidPosition(emptyBoard, { ...p, x: p.x + 1 })) p.x += 1;
            return p.x !== piece.x ? p : null;
          },
        },
        {
          label: '↻ (CW)',
          next: () => tryRotate(emptyBoard, piece, 1)?.piece ?? null,
        },
        {
          label: '↺ (CCW)',
          next: () => tryRotate(emptyBoard, piece, -1)?.piece ?? null,
        },
        {
          label: '180°',
          next: () => tryRotate(emptyBoard, piece, 2)?.piece ?? null,
        },
      ];

      for (const act of actions) {
        const np = act.next();
        if (np) {
          // Keep y at 18 so horizontal BFS stays clean
          const normalizedPiece: ActivePiece = { ...np, y: 18 };
          if (isValidPosition(emptyBoard, normalizedPiece)) {
            const nk = `${normalizedPiece.x},${normalizedPiece.rotation}`;
            if (!visitedState.has(nk)) {
              queue.push({ piece: normalizedPiece, seq: [...seq, act.label] });
            }
          }
        }
      }
    }
  }
}

buildFinesseTable();

export function evaluateFinesse(
  piece: ActivePiece,
  actualManipulations: number,
  wasSpinPlacement: boolean
): { faults: number; optimal: number; optimalSequence: string[] } {
  // Soft-drop spins / overhangs intentionally require extra rotations after soft drop; don't penalize T-Spins/spins!
  if (wasSpinPlacement) {
    return { faults: 0, optimal: actualManipulations, optimalSequence: [] };
  }
  const sig = canonicalHorizontalSignature(piece.type, piece.x, piece.rotation);
  const entry = finesseCache.get(sig);
  if (!entry) {
    return { faults: 0, optimal: actualManipulations, optimalSequence: [] };
  }
  const faults = Math.max(0, actualManipulations - entry.steps);
  return { faults, optimal: entry.steps, optimalSequence: entry.sequence };
}
