import {
  ALL_PIECES,
  BOARD_WIDTH,
  TOTAL_HEIGHT,
  createSpawnPiece,
  detectTSpin,
  evaluateFinesse,
  getGhostPiece,
  getPieceCells,
  isValidPosition,
  tryRotate,
} from './srs.ts';
import type {
  ActivePiece,
  CellColor,
  ClearKind,
  GameMode,
  LessonDefinition,
  LessonPracticeMode,
  LockResult,
  PieceType,
} from './types.ts';

export function createEmptyBoard(): CellColor[][] {
  return Array.from({ length: TOTAL_HEIGHT }, () =>
    Array<CellColor>(BOARD_WIDTH).fill(null)
  );
}

export function cloneBoard(board: CellColor[][]): CellColor[][] {
  return board.map((row) => [...row]);
}

/**
 * Parse top-to-bottom ASCII strings into bottom-up board (row 0 = floor).
 * Characters: '.', ' ', '_' = empty; 'I','O','T','S','Z','J','L','G' = minos; '#'/'X' = 'G' gray block.
 */
export function parseTopDownBoard(rowsTopDown: string[]): CellColor[][] {
  const board = createEmptyBoard();
  const count = rowsTopDown.length;
  for (let i = 0; i < count; i++) {
    const y = count - 1 - i; // last string is row 0 (floor)
    if (y < 0 || y >= TOTAL_HEIGHT) continue;
    const line = rowsTopDown[i];
    for (let x = 0; x < Math.min(BOARD_WIDTH, line.length); x++) {
      const ch = line[x].toUpperCase();
      if (ch === '.' || ch === ' ' || ch === '_') {
        board[y][x] = null;
      } else if (
        ch === 'I' ||
        ch === 'O' ||
        ch === 'T' ||
        ch === 'S' ||
        ch === 'Z' ||
        ch === 'J' ||
        ch === 'L'
      ) {
        board[y][x] = ch;
      } else {
        board[y][x] = 'G';
      }
    }
  }
  return board;
}

export function serializeBoardTopDown(board: CellColor[][], maxRows = 20): string[] {
  let highest = -1;
  for (let y = maxRows - 1; y >= 0; y--) {
    if (board[y].some((c) => c !== null)) {
      highest = y;
      break;
    }
  }
  if (highest < 0) return [];
  const lines: string[] = [];
  for (let y = highest; y >= 0; y--) {
    lines.push(board[y].map((c) => c ?? '.').join(''));
  }
  return lines;
}

export function shuffle7Bag(rng: () => number = Math.random): PieceType[] {
  const bag = [...ALL_PIECES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export function cellsSignature(cells: Array<[number, number]>): string {
  return [...cells]
    .sort((a, b) => (a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0]))
    .map(([x, y]) => `${x},${y}`)
    .join(';');
}

/**
 * Apply a placement directly onto a board copy and clear full lines, returning cleared count & new board.
 * Used for preloading 'build' steps of lessons cleanly!
 */
export function applyDirectPlacement(
  board: CellColor[][],
  piece: ActivePiece
): { board: CellColor[][]; linesCleared: number } {
  const next = cloneBoard(board);
  for (const [cx, cy] of getPieceCells(piece)) {
    if (cy >= 0 && cy < TOTAL_HEIGHT && cx >= 0 && cx < BOARD_WIDTH) {
      next[cy][cx] = piece.type;
    }
  }
  let cleared = 0;
  for (let y = TOTAL_HEIGHT - 1; y >= 0; y--) {
    if (next[y].every((cell) => cell !== null)) {
      next.splice(y, 1);
      next.push(Array<CellColor>(BOARD_WIDTH).fill(null));
      cleared++;
    }
  }
  return { board: next, linesCleared: cleared };
}

export interface EngineSnapshot {
  board: CellColor[][];
  activePiece: ActivePiece | null;
  holdPiece: PieceType | null;
  canHold: boolean;
  queue: PieceType[];
  useRandomBagRefill: boolean;
  score: number;
  lines: number;
  level: number;
  piecesPlaced: number;
  attackSent: number;
  b2bChain: number;
  combo: number;
  finesseFaultsTotal: number;
  completedStepIndices: number[];
  achievedClears: Array<ClearKind | 'PC'>;
  lessonCompleted: boolean;
  gameOver: boolean;
}

export interface BannerEvent {
  id: number;
  title: string;
  subtitle?: string;
  color: string;
}

export class TetrisEngine {
  public board: CellColor[][] = createEmptyBoard();
  public activePiece: ActivePiece | null = null;
  public holdPiece: PieceType | null = null;
  public canHold = true;
  public queue: PieceType[] = [];
  public useRandomBagRefill = true;

  public mode: GameMode = 'lesson';
  public lesson: LessonDefinition | null = null;
  public lessonPracticeMode: LessonPracticeMode = 'execute';
  public completedStepIndices: Set<number> = new Set();
  public achievedClears: Array<ClearKind | 'PC'> = [];
  public lessonCompleted = false;

  public score = 0;
  public lines = 0;
  public level = 1;
  public piecesPlaced = 0;
  public attackSent = 0;
  public b2bChain = -1; // -1 = inactive, >= 0 = active B2B chain count
  public combo = -1;
  public finesseFaultsTotal = 0;
  public lastFinesseHint: string | null = null;
  public lastLockResult: LockResult | null = null;

  public gameOver = false;
  public victory = false;
  public startTimeMs = 0;
  public elapsedMs = 0;

  // Active piece tracking for SRS T-Spin, Lock Delay, and Finesse
  public lastActionWasRotation = false;
  public lastKickIndex = 0;
  public manipulationsCount = 0;
  public lockTimerMs = 0;
  public lockResetsUsed = 0;
  public lowestYReached = TOTAL_HEIGHT;
  public gravityAccumulatorMs = 0;

  public history: EngineSnapshot[] = [];
  public redoStack: EngineSnapshot[] = [];

  public startFreeMode(mode: Exclude<GameMode, 'lesson' | 'editor'>): void {
    this.mode = mode;
    this.lesson = null;
    this.board = createEmptyBoard();
    this.holdPiece = null;
    this.canHold = true;
    this.useRandomBagRefill = true;
    this.queue = [...shuffle7Bag(), ...shuffle7Bag()];
    this.resetStats();
    this.spawnNext();
    this.history = [];
    this.redoStack = [];
  }

  public startLesson(lesson: LessonDefinition, practiceMode: LessonPracticeMode): void {
    this.mode = 'lesson';
    this.lesson = lesson;
    this.lessonPracticeMode = practiceMode;
    this.resetStats();

    let board = parseTopDownBoard(lesson.initialBoardTopDown);
    const completed = new Set<number>();

    const startIdx = practiceMode === 'execute' ? lesson.preloadCount : 0;
    for (let i = 0; i < startIdx && i < lesson.steps.length; i++) {
      const s = lesson.steps[i];
      const res = applyDirectPlacement(board, {
        type: s.piece,
        rotation: s.rotation,
        x: s.x,
        y: s.y,
      });
      board = res.board;
      completed.add(i);
    }

    this.board = board;
    this.completedStepIndices = completed;
    this.achievedClears = [];
    this.lessonCompleted = false;

    const remainingPieces = lesson.steps.slice(startIdx).map((s) => s.piece);
    const extras = lesson.extraQueue ?? [...shuffle7Bag(), ...shuffle7Bag()];
    this.queue = [...remainingPieces, ...extras];
    this.holdPiece = practiceMode === 'execute' ? (lesson.initialHold ?? null) : null;
    this.canHold = true;
    this.useRandomBagRefill = true;

    this.spawnNext();
    this.history = [];
    this.redoStack = [];
  }

  public startCustomTemplate(
    boardTopDown: string[],
    queuePieces: PieceType[],
    hold: PieceType | null
  ): void {
    this.mode = 'zen';
    this.lesson = null;
    this.resetStats();
    this.board = parseTopDownBoard(boardTopDown);
    this.holdPiece = hold;
    this.canHold = true;
    this.useRandomBagRefill = true;
    this.queue = [...queuePieces, ...shuffle7Bag(), ...shuffle7Bag()];
    this.spawnNext();
    this.history = [];
    this.redoStack = [];
  }

  private resetStats(): void {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.piecesPlaced = 0;
    this.attackSent = 0;
    this.b2bChain = -1;
    this.combo = -1;
    this.finesseFaultsTotal = 0;
    this.lastFinesseHint = null;
    this.lastLockResult = null;
    this.gameOver = false;
    this.victory = false;
    this.startTimeMs = performance.now();
    this.elapsedMs = 0;
  }

  public createSnapshot(): EngineSnapshot {
    return {
      board: cloneBoard(this.board),
      activePiece: this.activePiece ? { ...this.activePiece } : null,
      holdPiece: this.holdPiece,
      canHold: this.canHold,
      queue: [...this.queue],
      useRandomBagRefill: this.useRandomBagRefill,
      score: this.score,
      lines: this.lines,
      level: this.level,
      piecesPlaced: this.piecesPlaced,
      attackSent: this.attackSent,
      b2bChain: this.b2bChain,
      combo: this.combo,
      finesseFaultsTotal: this.finesseFaultsTotal,
      completedStepIndices: [...this.completedStepIndices],
      achievedClears: [...this.achievedClears],
      lessonCompleted: this.lessonCompleted,
      gameOver: this.gameOver,
    };
  }

  public restoreSnapshot(snap: EngineSnapshot): void {
    this.board = cloneBoard(snap.board);
    this.activePiece = snap.activePiece ? { ...snap.activePiece } : null;
    this.holdPiece = snap.holdPiece;
    this.canHold = snap.canHold;
    this.queue = [...snap.queue];
    this.useRandomBagRefill = snap.useRandomBagRefill;
    this.score = snap.score;
    this.lines = snap.lines;
    this.level = snap.level;
    this.piecesPlaced = snap.piecesPlaced;
    this.attackSent = snap.attackSent;
    this.b2bChain = snap.b2bChain;
    this.combo = snap.combo;
    this.finesseFaultsTotal = snap.finesseFaultsTotal;
    this.completedStepIndices = new Set(snap.completedStepIndices);
    this.achievedClears = [...snap.achievedClears];
    this.lessonCompleted = snap.lessonCompleted;
    this.gameOver = snap.gameOver;
    this.resetActivePieceTracking();
  }

  public undo(): boolean {
    if (this.history.length === 0) return false;
    this.redoStack.push(this.createSnapshot());
    const prev = this.history.pop()!;
    this.restoreSnapshot(prev);
    return true;
  }

  public redo(): boolean {
    if (this.redoStack.length === 0) return false;
    this.history.push(this.createSnapshot());
    const next = this.redoStack.pop()!;
    this.restoreSnapshot(next);
    return true;
  }

  private refillQueueIfNeeded(): void {
    if (this.useRandomBagRefill && this.queue.length < 7) {
      this.queue.push(...shuffle7Bag());
    }
  }

  private resetActivePieceTracking(): void {
    this.lastActionWasRotation = false;
    this.lastKickIndex = 0;
    this.manipulationsCount = 0;
    this.lockTimerMs = 0;
    this.lockResetsUsed = 0;
    this.gravityAccumulatorMs = 0;
    this.lowestYReached = this.activePiece ? this.activePiece.y : TOTAL_HEIGHT;
  }

  public spawnNext(): boolean {
    this.refillQueueIfNeeded();
    const nextType = this.queue.shift();
    if (!nextType) {
      this.activePiece = null;
      return false;
    }
    const piece = createSpawnPiece(nextType, this.board);
    if (!isValidPosition(this.board, piece)) {
      this.activePiece = piece;
      if (this.mode === 'zen' || this.mode === 'lesson') {
        // Clear board or mark gameOver so player can undo/reset
        this.gameOver = true;
      } else {
        this.gameOver = true;
      }
      return false;
    }
    this.activePiece = piece;
    this.canHold = true;
    this.resetActivePieceTracking();
    return true;
  }

  public isGrounded(): boolean {
    if (!this.activePiece) return false;
    return !isValidPosition(this.board, {
      ...this.activePiece,
      y: this.activePiece.y - 1,
    });
  }

  private registerLockReset(): void {
    if (!this.activePiece) return;
    if (this.activePiece.y < this.lowestYReached) {
      this.lowestYReached = this.activePiece.y;
      this.lockResetsUsed = 0;
      this.lockTimerMs = 0;
    } else if (this.lockResetsUsed < 15) {
      this.lockResetsUsed += 1;
      this.lockTimerMs = 0;
    }
  }

  public moveHorizontal(dx: -1 | 1, countManipulation = true): boolean {
    if (!this.activePiece || this.gameOver || this.victory) return false;
    const candidate = { ...this.activePiece, x: this.activePiece.x + dx };
    if (!isValidPosition(this.board, candidate)) return false;
    this.activePiece = candidate;
    this.lastActionWasRotation = false;
    if (countManipulation) this.manipulationsCount += 1;
    this.registerLockReset();
    return true;
  }

  public dasHorizontal(dx: -1 | 1): boolean {
    if (!this.activePiece || this.gameOver || this.victory) return false;
    let moved = false;
    while (this.moveHorizontal(dx, false)) {
      moved = true;
    }
    if (moved) {
      this.manipulationsCount += 1;
    }
    return moved;
  }

  public rotate(delta: 1 | -1 | 2): { ok: boolean; isSpinReady: boolean; kickIndex: number } {
    if (!this.activePiece || this.gameOver || this.victory) {
      return { ok: false, isSpinReady: false, kickIndex: -1 };
    }
    const res = tryRotate(this.board, this.activePiece, delta);
    if (!res) return { ok: false, isSpinReady: false, kickIndex: -1 };

    this.activePiece = res.piece;
    this.lastActionWasRotation = true;
    this.lastKickIndex = res.kickIndex;
    this.manipulationsCount += 1;
    this.registerLockReset();

    const tspin = detectTSpin(this.board, this.activePiece, true, this.lastKickIndex);
    return { ok: true, isSpinReady: tspin.isTSpin, kickIndex: res.kickIndex };
  }

  public softDropOne(): boolean {
    if (!this.activePiece || this.gameOver || this.victory) return false;
    const candidate = { ...this.activePiece, y: this.activePiece.y - 1 };
    if (!isValidPosition(this.board, candidate)) return false;
    this.activePiece = candidate;
    this.lastActionWasRotation = false;
    this.score += 1;
    if (this.activePiece.y < this.lowestYReached) {
      this.lowestYReached = this.activePiece.y;
      this.lockResetsUsed = 0;
      this.lockTimerMs = 0;
    }
    return true;
  }

  public sonicDrop(): number {
    let dropped = 0;
    while (this.softDropOne()) {
      dropped++;
    }
    return dropped;
  }

  public hold(): boolean {
    if (!this.activePiece || !this.canHold || this.gameOver || this.victory) return false;
    const currentType = this.activePiece.type;
    if (this.holdPiece === null) {
      this.holdPiece = currentType;
      this.spawnNext();
    } else {
      const swapType = this.holdPiece;
      this.holdPiece = currentType;
      const spawned = createSpawnPiece(swapType, this.board);
      if (!isValidPosition(this.board, spawned)) {
        this.gameOver = true;
        return false;
      }
      this.activePiece = spawned;
      this.resetActivePieceTracking();
    }
    this.canHold = false;
    return true;
  }

  public hardDrop(): LockResult | null {
    if (!this.activePiece || this.gameOver || this.victory) return null;
    this.history.push(this.createSnapshot());
    if (this.history.length > 120) this.history.shift();
    this.redoStack = [];

    const ghost = getGhostPiece(this.board, this.activePiece);
    const dropDist = this.activePiece.y - ghost.y;
    if (dropDist > 0) {
      this.lastActionWasRotation = false;
      this.score += dropDist * 2;
    }
    this.activePiece = ghost;
    return this.lockActivePiece(false);
  }

  public lockFromGravity(): LockResult | null {
    if (!this.activePiece || this.gameOver || this.victory) return null;
    this.history.push(this.createSnapshot());
    if (this.history.length > 120) this.history.shift();
    this.redoStack = [];
    return this.lockActivePiece(true);
  }

  private lockActivePiece(_fromGravity: boolean): LockResult {
    const piece = this.activePiece!;
    const tspin = detectTSpin(
      this.board,
      piece,
      this.lastActionWasRotation,
      this.lastKickIndex
    );

    const finesse = evaluateFinesse(
      piece,
      this.manipulationsCount,
      this.lastActionWasRotation || tspin.isTSpin
    );
    this.finesseFaultsTotal += finesse.faults;
    if (finesse.faults > 0 && finesse.optimalSequence.length > 0) {
      this.lastFinesseHint = `Óptimo (${finesse.optimal}): ${finesse.optimalSequence.join(' → ')}`;
    } else if (finesse.faults === 0) {
      this.lastFinesseHint = null;
    }

    const lockedCells = getPieceCells(piece);
    for (const [cx, cy] of lockedCells) {
      if (cy >= 0 && cy < TOTAL_HEIGHT && cx >= 0 && cx < BOARD_WIDTH) {
        this.board[cy][cx] = piece.type;
      }
    }

    const clearedRows: number[] = [];
    for (let y = TOTAL_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every((c) => c !== null)) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.push(Array<CellColor>(BOARD_WIDTH).fill(null));
      }
    }

    const linesCleared = clearedRows.length;
    const isPerfectClear =
      linesCleared > 0 &&
      this.board.every((row) => row.every((cell) => cell === null));

    const clearKind = this.determineClearKind(linesCleared, tspin.isTSpin, tspin.isMini);
    const isDifficult =
      linesCleared === 4 || (tspin.isTSpin && linesCleared > 0);

    let gotB2BBonus = false;
    if (linesCleared > 0) {
      this.combo += 1;
      if (isDifficult) {
        this.b2bChain += 1;
        gotB2BBonus = this.b2bChain > 0;
      } else {
        this.b2bChain = -1;
      }
    } else {
      this.combo = -1;
    }

    const attackSent = this.calculateAttack(
      clearKind,
      gotB2BBonus,
      this.combo,
      isPerfectClear
    );
    const scoreAdded = this.calculateScore(clearKind, gotB2BBonus, this.combo, isPerfectClear);

    this.lines += linesCleared;
    this.level = Math.max(1, Math.floor(this.lines / 10) + 1);
    this.piecesPlaced += 1;
    this.attackSent += attackSent;
    this.score += scoreAdded;

    const result: LockResult = {
      piece,
      linesCleared,
      clearedRows,
      clearKind,
      isTSpin: tspin.isTSpin,
      isMini: tspin.isMini,
      isPerfectClear,
      isBackToBack: gotB2BBonus,
      b2bChain: Math.max(0, this.b2bChain),
      combo: Math.max(0, this.combo),
      attackSent,
      scoreAdded,
      kickIndexUsed: this.lastKickIndex,
      finesseFaults: finesse.faults,
      optimalKeypresses: finesse.optimal,
      actualKeypresses: this.manipulationsCount,
    };

    this.lastLockResult = result;
    this.evaluateLessonProgress(lockedCells, result);
    this.evaluateModeVictory();
    this.spawnNext();

    return result;
  }

  private determineClearKind(lines: number, isTSpin: boolean, isMini: boolean): ClearKind {
    if (isTSpin) {
      if (isMini) {
        if (lines === 0) return 'TSM0';
        if (lines === 1) return 'TSMS';
        return 'TSMD';
      }
      if (lines === 0) return 'TS0';
      if (lines === 1) return 'TSS';
      if (lines === 2) return 'TSD';
      return 'TST';
    }
    if (lines === 0) return 'NONE';
    if (lines === 1) return 'SINGLE';
    if (lines === 2) return 'DOUBLE';
    if (lines === 3) return 'TRIPLE';
    return 'TETRIS';
  }

  private calculateAttack(
    kind: ClearKind,
    b2b: boolean,
    combo: number,
    isPC: boolean
  ): number {
    let base = 0;
    switch (kind) {
      case 'DOUBLE':
        base = 1;
        break;
      case 'TRIPLE':
        base = 2;
        break;
      case 'TETRIS':
        base = 4;
        break;
      case 'TSMS':
        base = 0;
        break;
      case 'TSMD':
        base = 1;
        break;
      case 'TSS':
        base = 2;
        break;
      case 'TSD':
        base = 4;
        break;
      case 'TST':
        base = 6;
        break;
      default:
        base = 0;
    }
    if (b2b && base > 0) base += 1;
    if (kind === 'TSMS' && b2b) base += 1;
    if (combo >= 1) {
      const comboTable = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5];
      base += comboTable[Math.min(combo, comboTable.length - 1)];
    }
    if (isPC) base += 10;
    return base;
  }

  private calculateScore(
    kind: ClearKind,
    b2b: boolean,
    combo: number,
    isPC: boolean
  ): number {
    const table: Record<ClearKind, number> = {
      NONE: 0,
      SINGLE: 100,
      DOUBLE: 300,
      TRIPLE: 500,
      TETRIS: 800,
      TSM0: 100,
      TSMS: 200,
      TSMD: 400,
      TS0: 400,
      TSS: 800,
      TSD: 1200,
      TST: 1600,
    };
    let pts = table[kind] * this.level;
    if (b2b) pts = Math.floor(pts * 1.5);
    if (combo > 0) pts += 50 * combo * this.level;
    if (isPC) pts += 3500 * this.level;
    return pts;
  }

  public getCurrentGuidedStepIndex(): number | null {
    if (!this.lesson) return null;
    for (let i = 0; i < this.lesson.steps.length; i++) {
      if (!this.completedStepIndices.has(i)) return i;
    }
    return null;
  }

  private evaluateLessonProgress(lockedCells: Array<[number, number]>, result: LockResult): void {
    if (this.mode !== 'lesson' || !this.lesson) return;

    if (result.clearKind !== 'NONE') {
      this.achievedClears.push(result.clearKind);
    }
    if (result.isPerfectClear) {
      this.achievedClears.push('PC');
    }

    // Match locked cells against next uncompleted step (or any uncompleted step of the same piece type)
    const sig = cellsSignature(lockedCells);
    const nextIdx = this.getCurrentGuidedStepIndex();

    if (nextIdx !== null) {
      const targetStep = this.lesson.steps[nextIdx];
      const targetSig = cellsSignature(
        getPieceCells({
          type: targetStep.piece,
          rotation: targetStep.rotation,
          x: targetStep.x,
          y: targetStep.y,
        })
      );
      if (sig === targetSig && result.piece.type === targetStep.piece) {
        this.completedStepIndices.add(nextIdx);
      } else {
        // Also check if player used Hold to place a subsequent build step of the same piece!
        for (let i = nextIdx + 1; i < this.lesson.steps.length; i++) {
          if (this.completedStepIndices.has(i)) continue;
          const st = this.lesson.steps[i];
          if (st.piece !== result.piece.type) continue;
          const stSig = cellsSignature(
            getPieceCells({ type: st.piece, rotation: st.rotation, x: st.x, y: st.y })
          );
          if (sig === stSig) {
            this.completedStepIndices.add(i);
            break;
          }
        }
      }
    }

    // Check Goal Completion!
    const goal = this.lesson.goal;
    let goalMet = true;

    if (goal.requiredClears && goal.requiredClears.length > 0) {
      // Check ordered subsequence match of requiredClears in achievedClears
      let cursor = 0;
      for (const ev of this.achievedClears) {
        const req = goal.requiredClears[cursor];
        if (!req) break;
        const matches =
          ev === req ||
          (req === 'TSD' && ev === 'TSMD') ||
          (req === 'TSPIN_ANY' &&
            (ev === 'TSS' || ev === 'TSD' || ev === 'TST' || ev === 'TSMS' || ev === 'TSMD'));
        if (matches) {
          cursor++;
        }
      }
      if (cursor < goal.requiredClears.length) goalMet = false;
    }

    if (goal.requirePerfectClear && !this.achievedClears.includes('PC')) {
      goalMet = false;
    }

    if (goal.minCombo !== undefined && result.combo < goal.minCombo) {
      goalMet = false;
    }

    if (goal.linesTarget !== undefined && this.lines < goal.linesTarget) {
      goalMet = false;
    }

    if (
      goal.maxFinesseFaults !== undefined &&
      this.finesseFaultsTotal > goal.maxFinesseFaults
    ) {
      goalMet = false;
    }

    // If no explicit clear/combo/lines requirement was set, require all steps completed
    const hasExplicitOutcome =
      (goal.requiredClears && goal.requiredClears.length > 0) ||
      goal.requirePerfectClear ||
      goal.minCombo !== undefined ||
      goal.linesTarget !== undefined;

    if (!hasExplicitOutcome) {
      goalMet = this.completedStepIndices.size >= this.lesson.steps.length;
    }

    if (goalMet) {
      this.lessonCompleted = true;
    }
  }

  private evaluateModeVictory(): void {
    if (this.mode === 'sprint' && this.lines >= 40) {
      this.victory = true;
    } else if (this.mode === 'marathon' && this.lines >= 150) {
      this.victory = true;
    }
  }

  public tick(dtMs: number): LockResult | null {
    if (this.gameOver || this.victory || !this.activePiece) return null;
    this.elapsedMs += dtMs;

    if (this.mode === 'ultra' && this.elapsedMs >= 120_000) {
      this.victory = true;
      return null;
    }

    // In Lesson & Zen modes, use very gentle gravity (or no forced lock pressure) so player can study silhouettes & kicks!
    const gravityIntervalMs =
      this.mode === 'lesson' || this.mode === 'zen'
        ? 1800
        : Math.max(50, Math.pow(0.8 - (this.level - 1) * 0.007, this.level - 1) * 1000);

    if (!this.isGrounded()) {
      this.gravityAccumulatorMs += dtMs;
      while (this.gravityAccumulatorMs >= gravityIntervalMs && !this.isGrounded()) {
        this.gravityAccumulatorMs -= gravityIntervalMs;
        this.activePiece = { ...this.activePiece, y: this.activePiece.y - 1 };
        if (this.activePiece.y < this.lowestYReached) {
          this.lowestYReached = this.activePiece.y;
          this.lockResetsUsed = 0;
          this.lockTimerMs = 0;
        }
      }
      return null;
    } else {
      const lockDelayLimit = this.mode === 'lesson' || this.mode === 'zen' ? 1200 : 500;
      this.lockTimerMs += dtMs;
      if (this.lockTimerMs >= lockDelayLimit) {
        return this.lockFromGravity();
      }
      return null;
    }
  }
}
