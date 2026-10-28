export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type CellColor = PieceType | 'G' | null; // 'G' = garbage / gray preset block

export type RotationState = 0 | 1 | 2 | 3; // 0: Spawn(N), 1: CW(E), 2: 180(S), 3: CCW(W)

export interface ActivePiece {
  type: PieceType;
  rotation: RotationState;
  x: number; // bottom-left of bounding box (0..9 left-to-right)
  y: number; // bottom-left of bounding box (0 = floor, increases upwards)
}

export type ClearKind =
  | 'NONE'
  | 'SINGLE'
  | 'DOUBLE'
  | 'TRIPLE'
  | 'TETRIS'
  | 'TSM0'
  | 'TSMS'
  | 'TSMD'
  | 'TS0'
  | 'TSS'
  | 'TSD'
  | 'TST';

export interface LockResult {
  piece: ActivePiece;
  linesCleared: number;
  clearedRows: number[];
  clearKind: ClearKind;
  isTSpin: boolean;
  isMini: boolean;
  isPerfectClear: boolean;
  isBackToBack: boolean; // whether this clear got the B2B bonus
  b2bChain: number;
  combo: number;
  attackSent: number;
  scoreAdded: number;
  kickIndexUsed: number;
  finesseFaults: number;
  optimalKeypresses: number;
  actualKeypresses: number;
}

export interface HandlingSettings {
  das: number; // Delayed Auto Shift in ms (default 115ms)
  arr: number; // Auto Repeat Rate in ms (default 15ms, 0 = instant)
  sdf: number; // Soft Drop Factor (default 20, 41 = instant sonic soft drop)
  enableGhost: boolean;
  enableGrid: boolean;
  enableSound: boolean;
}

export type GameMode = 'lesson' | 'sprint' | 'marathon' | 'ultra' | 'zen' | 'editor';

export type LessonPracticeMode = 'execute' | 'guided';

export type FourLolCategory =
  | 'openers'
  | 'methods'
  | 'midgame'
  | 'stacking'
  | 'pc'
  | 'srs'
  | 'misc'
  | 'custom';

export interface LessonStep {
  piece: PieceType;
  rotation: RotationState;
  x: number;
  y: number;
  role: 'build' | 'attack';
  expectedClear?: ClearKind | 'PC' | 'ANY_LINE';
  hint?: string;
  /** Optional explicit SRS manoeuvre instructions for spin steps: move from spawn or drop+rotate */
  spinInstruction?: string;
}

export interface LessonGoal {
  /** Required clear events in sequence or any order */
  requiredClears?: Array<ClearKind | 'PC' | 'TSPIN_ANY' | 'COMBO_4'>;
  /** Or simply completing all steps */
  requirePerfectClear?: boolean;
  minCombo?: number;
  maxFinesseFaults?: number;
  linesTarget?: number;
}

export interface LessonDefinition {
  id: string;
  title: string;
  jpTitle?: string;
  category: FourLolCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  fourLolUrl: string;
  summary: string;
  theory: string;
  whenToUse: string;
  keyTip: string;
  /**
   * Bottom-to-top rows (row 0 = floor) OR top-to-bottom ASCII strings converted by helper.
   * Stored here as 10-char strings from TOP row to BOTTOM row (floor last) for human readability!
   */
  initialBoardTopDown: string[];
  /**
   * Ordered steps from initialBoard.
   * In 'guided' mode, player executes steps[0..end].
   * In 'execute' mode, steps[0..preloadCount-1] are pre-applied to the board automatically,
   * and player immediately receives pieces from steps[preloadCount..end]!
   */
  steps: LessonStep[];
  preloadCount: number;
  /** Extra pieces appended after the scripted steps so board doesn't run dry */
  extraQueue?: PieceType[];
  initialHold?: PieceType | null;
  goalDescription: string;
  goal: LessonGoal;
}
