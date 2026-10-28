import {
  Award,
  BookOpen,
  Flame,
  Gamepad2,
  Paintbrush,
  Redo2,
  RotateCcw,
  Settings,
  Timer,
  Undo2,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoardCanvas } from './components/BoardCanvas.tsx';
import { LessonSidebar } from './components/LessonSidebar.tsx';
import { MiniPieceCanvas } from './components/MiniPieceCanvas.tsx';
import { DEFAULT_HANDLING, SettingsModal } from './components/SettingsModal.tsx';
import { TemplateEditor } from './components/TemplateEditor.tsx';
import { TheoryPanel } from './components/TheoryPanel.tsx';
import {
  TetrisEngine,
  cloneBoard,
  createEmptyBoard,
  parseTopDownBoard,
  serializeBoardTopDown,
  type BannerEvent,
} from './engine/gameEngine.ts';
import { sound } from './engine/sound.ts';
import { ALL_PIECES, detectTSpin } from './engine/srs.ts';
import {
  executeAtomicAction,
  findSRSPath,
  type AtomicAction,
} from './engine/srsPathfinder.ts';
import type {
  CellColor,
  ClearKind,
  GameMode,
  HandlingSettings,
  LessonDefinition,
  LessonPracticeMode,
  LockResult,
  PieceType,
} from './engine/types.ts';
import { ALL_LESSONS, getLessonById } from './lessons/catalog.ts';
import {
  loadCustomTemplates,
  saveCustomTemplates,
  type CustomTemplateItem,
} from './lessons/customTemplates.ts';

const COMPLETED_STORAGE_KEY = 'fourlol_dojo_completed_v1';
const SETTINGS_STORAGE_KEY = 'fourlol_dojo_settings_v1';
const HIDE_COMPLETED_STORAGE_KEY = 'fourlol_dojo_hide_completed_v1';

const CLEAR_TITLES_ES: Record<ClearKind, { label: string; color: string }> = {
  NONE: { label: '', color: '#94a3b8' },
  SINGLE: { label: 'SINGLE', color: '#cbd5e1' },
  DOUBLE: { label: 'DOUBLE', color: '#38bdf8' },
  TRIPLE: { label: 'TRIPLE!', color: '#fbbf24' },
  TETRIS: { label: 'TETRIS!!', color: '#22d3ee' },
  TSM0: { label: 'T-SPIN MINI', color: '#c084fc' },
  TSMS: { label: 'T-SPIN MINI SINGLE', color: '#d8b4fe' },
  TSMD: { label: 'T-SPIN MINI DOUBLE', color: '#e879f9' },
  TS0: { label: 'T-SPIN', color: '#d946ef' },
  TSS: { label: 'T-SPIN SINGLE!', color: '#e879f9' },
  TSD: { label: 'T-SPIN DOUBLE!!', color: '#f472b6' },
  TST: { label: 'T-SPIN TRIPLE!!!', color: '#f43f5e' },
};

function parseQueueString(str: string): PieceType[] {
  const out: PieceType[] = [];
  for (const ch of str.toUpperCase()) {
    if ((ALL_PIECES as string[]).includes(ch)) {
      out.push(ch as PieceType);
    }
  }
  return out.length > 0 ? out : ['T', 'T', 'I', 'O', 'S', 'Z', 'J', 'L'];
}

function formatTime(ms: number): string {
  const totalSec = Math.max(0, ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  const centis = Math.floor((ms % 1000) / 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(
    centis
  ).padStart(2, '0')}`;
}

export default function App() {
  const engineRef = useRef<TetrisEngine>(new TetrisEngine());
  const defaultLesson =
    getLessonById('c-spin-midgame') ?? getLessonById('c-spin-opener') ?? ALL_LESSONS[0];

  const [uiTick, setUiTick] = useState(0);
  const bumpUi = useCallback(() => setUiTick((n) => n + 1), []);

  const [activeMode, setActiveMode] = useState<GameMode>('lesson');
  const [selectedLesson, setSelectedLesson] = useState<LessonDefinition>(defaultLesson);
  const [practiceMode, setPracticeMode] = useState<LessonPracticeMode>('execute');
  const [showGuide, setShowGuide] = useState(true);
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<HandlingSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_HANDLING, ...JSON.parse(saved) } : DEFAULT_HANDLING;
    } catch {
      return DEFAULT_HANDLING;
    }
  });

  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [hideCompleted, setHideCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HIDE_COMPLETED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [customTemplates, setCustomTemplates] = useState<CustomTemplateItem[]>(() =>
    loadCustomTemplates()
  );

  // Editor state
  const [editorBoard, setEditorBoard] = useState<CellColor[][]>(() => createEmptyBoard());
  const [activeBrush, setActiveBrush] = useState<Exclude<CellColor, null>>('G');
  const [eraseMode, setEraseMode] = useState(false);
  const [queueInput, setQueueInput] = useState('T, T, I, J, L, S, Z');
  const [holdInput, setHoldInput] = useState<PieceType | ''>('I');

  // Visual feedback state
  const [banner, setBanner] = useState<BannerEvent | null>(null);
  const [flashAlpha, setFlashAlpha] = useState(0);
  const bannerIdRef = useRef(1);
  const autoPlayTimersRef = useRef<number[]>([]);

  useEffect(() => {
    sound.enabled = settings.enableSound;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const clearAutoPlayTimers = useCallback(() => {
    for (const id of autoPlayTimersRef.current) {
      window.clearTimeout(id);
    }
    autoPlayTimersRef.current = [];
    setIsAutoPlaying(false);
  }, []);

  const handleLockResult = useCallback(
    (res: LockResult | null) => {
      if (!res) return;
      const eng = engineRef.current;

      if (res.finesseFaults > 0 && eng.lesson?.id === 'finesse-drill') {
        sound.finesseFault();
      }

      if (res.linesCleared > 0 || res.isTSpin) {
        sound.clear(
          res.linesCleared,
          res.isTSpin,
          res.isPerfectClear,
          res.combo,
          res.isBackToBack
        );
        if (res.linesCleared > 0) {
          setFlashAlpha(res.isPerfectClear ? 0.35 : 0.18);
        }

        const meta = CLEAR_TITLES_ES[res.clearKind];
        const parts: string[] = [];
        if (res.isBackToBack) parts.push(`B2B ×${res.b2bChain}`);
        if (res.combo > 0) parts.push(`${res.combo} COMBO`);
        if (res.attackSent > 0) parts.push(`+${res.attackSent} ATAQUE`);

        setBanner({
          id: bannerIdRef.current++,
          title: res.isPerfectClear ? `✨ PERFECT CLEAR! (${meta.label})` : meta.label,
          subtitle: parts.join('  •  '),
          color: res.isPerfectClear ? '#34d399' : meta.color,
        });
      } else {
        sound.hardDrop();
      }

      if (eng.mode === 'lesson' && eng.lesson && eng.lessonCompleted) {
        sound.lessonSuccess();
        const doneId = eng.lesson.id;
        setCompletedIds((prev) => {
          if (prev.has(doneId)) return prev;
          const next = new Set(prev);
          next.add(doneId);
          try {
            localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify([...next]));
          } catch {
            // ignore
          }
          return next;
        });

        if (autoRepeat) {
          const timer = window.setTimeout(() => {
            if (engineRef.current.lesson?.id === doneId) {
              engineRef.current.startLesson(eng.lesson!, eng.lessonPracticeMode);
              bumpUi();
            }
          }, 1150);
          autoPlayTimersRef.current.push(timer);
        }
      }
    },
    [autoRepeat, bumpUi]
  );

  // Initialize default C-Spin lesson on first mount
  useEffect(() => {
    engineRef.current.startLesson(defaultLesson, 'execute');
    bumpUi();
  }, [defaultLesson, bumpUi]);

  const startLessonSession = useCallback(
    (lesson: LessonDefinition, pMode: LessonPracticeMode) => {
      clearAutoPlayTimers();
      setActiveMode('lesson');
      setSelectedLesson(lesson);
      setPracticeMode(pMode);
      setBanner(null);
      engineRef.current.startLesson(lesson, pMode);
      bumpUi();
    },
    [bumpUi, clearAutoPlayTimers]
  );

  const startFreePlayMode = useCallback(
    (mode: Exclude<GameMode, 'lesson' | 'editor'>) => {
      clearAutoPlayTimers();
      setActiveMode(mode);
      setBanner(null);
      engineRef.current.startFreeMode(mode);
      bumpUi();
    },
    [bumpUi, clearAutoPlayTimers]
  );

  const handleResetCurrent = useCallback(() => {
    clearAutoPlayTimers();
    setBanner(null);
    const eng = engineRef.current;
    if (activeMode === 'lesson') {
      eng.startLesson(selectedLesson, practiceMode);
    } else if (activeMode === 'editor') {
      return;
    } else {
      eng.startFreeMode(activeMode);
    }
    bumpUi();
  }, [activeMode, bumpUi, clearAutoPlayTimers, practiceMode, selectedLesson]);

  const toggleHideCompleted = useCallback(() => {
    setHideCompleted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(HIDE_COMPLETED_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleNextLesson = useCallback(() => {
    const idx = ALL_LESSONS.findIndex((l) => l.id === selectedLesson.id);
    if (hideCompleted) {
      for (let offset = 1; offset <= ALL_LESSONS.length; offset++) {
        const cand = ALL_LESSONS[(idx + offset) % ALL_LESSONS.length];
        if (!completedIds.has(cand.id) && cand.id !== selectedLesson.id) {
          startLessonSession(cand, practiceMode);
          return;
        }
      }
    }
    const next = ALL_LESSONS[(idx + 1) % ALL_LESSONS.length];
    startLessonSession(next, practiceMode);
  }, [completedIds, hideCompleted, practiceMode, selectedLesson.id, startLessonSession]);

  // Input & Game Loop Refs (frame-accurate DAS / ARR / SDF)
  const heldDirsRef = useRef<{
    left: boolean;
    right: boolean;
    down: boolean;
    activeDir: -1 | 1 | 0;
    dasTimer: number;
    arrTimer: number;
    softDropTimer: number;
  }>({
    left: false,
    right: false,
    down: false,
    activeDir: 0,
    dasTimer: 0,
    arrTimer: 0,
    softDropTimer: 0,
  });

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const activeModeRef = useRef(activeMode);
  activeModeRef.current = activeMode;
  const isAutoPlayingRef = useRef(isAutoPlaying);
  isAutoPlayingRef.current = isAutoPlaying;

  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || settingsOpen) return;
      if (activeModeRef.current === 'editor') return;

      const code = e.code;
      const eng = engineRef.current;

      // Prevent browser scrolling on gameplay keys
      if (
        code === 'ArrowLeft' ||
        code === 'ArrowRight' ||
        code === 'ArrowDown' ||
        code === 'ArrowUp' ||
        code === 'Space'
      ) {
        e.preventDefault();
      }

      if (code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
        if (!e.repeat) handleResetCurrent();
        return;
      }

      if (
        (code === 'Backspace' || (code === 'KeyZ' && (e.ctrlKey || e.metaKey))) &&
        !e.repeat
      ) {
        e.preventDefault();
        if (eng.undo()) bumpUi();
        return;
      }

      if (code === 'KeyY' && (e.ctrlKey || e.metaKey) && !e.repeat) {
        e.preventDefault();
        if (eng.redo()) bumpUi();
        return;
      }

      if (isAutoPlayingRef.current) return;

      if (code === 'ArrowLeft') {
        if (!e.repeat) {
          heldDirsRef.current.left = true;
          heldDirsRef.current.activeDir = -1;
          heldDirsRef.current.dasTimer = 0;
          heldDirsRef.current.arrTimer = 0;
          if (eng.moveHorizontal(-1)) {
            sound.move();
            bumpUi();
          }
        }
      } else if (code === 'ArrowRight') {
        if (!e.repeat) {
          heldDirsRef.current.right = true;
          heldDirsRef.current.activeDir = 1;
          heldDirsRef.current.dasTimer = 0;
          heldDirsRef.current.arrTimer = 0;
          if (eng.moveHorizontal(1)) {
            sound.move();
            bumpUi();
          }
        }
      } else if (code === 'ArrowDown') {
        if (!e.repeat) {
          heldDirsRef.current.down = true;
          heldDirsRef.current.softDropTimer = 0;
          if (settingsRef.current.sdf >= 41) {
            if (eng.sonicDrop() > 0) {
              sound.softDrop();
              bumpUi();
            }
          } else if (eng.softDropOne()) {
            sound.softDrop();
            bumpUi();
          }
        }
      } else if ((code === 'ArrowUp' || code === 'KeyX') && !e.repeat) {
        const res = eng.rotate(1);
        if (res.ok) {
          sound.rotate(res.isSpinReady);
          bumpUi();
        }
      } else if (
        (code === 'KeyZ' || code === 'ControlLeft' || code === 'ControlRight') &&
        !e.metaKey &&
        !e.repeat
      ) {
        const res = eng.rotate(-1);
        if (res.ok) {
          sound.rotate(res.isSpinReady);
          bumpUi();
        }
      } else if (code === 'KeyA' && !e.repeat) {
        const res = eng.rotate(2);
        if (res.ok) {
          sound.rotate(res.isSpinReady);
          bumpUi();
        }
      } else if (
        (code === 'KeyC' || code === 'ShiftLeft' || code === 'ShiftRight') &&
        !e.repeat
      ) {
        if (eng.hold()) {
          sound.hold();
          bumpUi();
        }
      } else if (code === 'Space' && !e.repeat) {
        const lockRes = eng.hardDrop();
        handleLockResult(lockRes);
        bumpUi();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        heldDirsRef.current.left = false;
        heldDirsRef.current.activeDir = heldDirsRef.current.right ? 1 : 0;
        heldDirsRef.current.dasTimer = 0;
      } else if (e.code === 'ArrowRight') {
        heldDirsRef.current.right = false;
        heldDirsRef.current.activeDir = heldDirsRef.current.left ? -1 : 0;
        heldDirsRef.current.dasTimer = 0;
      } else if (e.code === 'ArrowDown') {
        heldDirsRef.current.down = false;
      }
    };

    const onBlur = () => {
      heldDirsRef.current.left = false;
      heldDirsRef.current.right = false;
      heldDirsRef.current.down = false;
      heldDirsRef.current.activeDir = 0;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [bumpUi, handleLockResult, handleResetCurrent, settingsOpen]);

  // Main 60fps requestAnimationFrame Loop (Gravity + DAS/ARR + SDF + Pulse Animation)
  useEffect(() => {
    let lastTs = performance.now();
    let rafId = 0;

    const frame = (now: number) => {
      const dt = Math.min(50, Math.max(0, now - lastTs));
      lastTs = now;

      if (activeModeRef.current !== 'editor' && !settingsOpen) {
        const eng = engineRef.current;
        const cfg = settingsRef.current;
        const held = heldDirsRef.current;

        // Horizontal DAS / ARR
        if (held.activeDir !== 0 && !isAutoPlayingRef.current) {
          held.dasTimer += dt;
          if (held.dasTimer >= cfg.das) {
            if (cfg.arr === 0) {
              eng.dasHorizontal(held.activeDir);
            } else {
              held.arrTimer += dt;
              while (held.arrTimer >= cfg.arr) {
                held.arrTimer -= cfg.arr;
                if (!eng.moveHorizontal(held.activeDir, false)) break;
              }
            }
          }
        }

        // Continuous Soft Drop
        if (held.down && !isAutoPlayingRef.current) {
          if (cfg.sdf >= 41) {
            eng.sonicDrop();
          } else {
            const interval = Math.max(8, 800 / cfg.sdf);
            held.softDropTimer += dt;
            while (held.softDropTimer >= interval) {
              held.softDropTimer -= interval;
              if (!eng.softDropOne()) break;
            }
          }
        }

        // Engine tick (skip gravity auto-lock while demo animation is stepping!)
        if (!isAutoPlayingRef.current) {
          const gravLock = eng.tick(dt);
          if (gravLock) {
            handleLockResult(gravLock);
          }
        }
      }

      setFlashAlpha((prev) => (prev > 0.005 ? prev * 0.88 : 0));
      setUiTick((n) => n + 1);
      rafId = window.requestAnimationFrame(frame);
    };

    rafId = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(rafId);
  }, [handleLockResult, settingsOpen]);

  const eng = engineRef.current;
  const currentStepIdx =
    activeMode === 'lesson' ? eng.getCurrentGuidedStepIndex() : null;
  const currentStep =
    currentStepIdx !== null && eng.lesson
      ? eng.lesson.steps[currentStepIdx] ?? null
      : null;
  const nextStep =
    currentStepIdx !== null && eng.lesson
      ? eng.lesson.steps[currentStepIdx + 1] ?? null
      : null;

  // Compute exact SRS path for the active step so the coach & Demo button always show exact inputs
  const computedActions = useMemo<AtomicAction[] | null>(() => {
    if (activeMode !== 'lesson' || !currentStep) return null;
    const requireTSpin =
      currentStep.piece === 'T' &&
      (currentStep.expectedClear === 'TSS' ||
        currentStep.expectedClear === 'TSD' ||
        currentStep.expectedClear === 'TST' ||
        currentStep.expectedClear === 'TSMS' ||
        currentStep.expectedClear === 'TSMD');
    const path = findSRSPath(eng.board, currentStep, requireTSpin);
    return path ? path.actions : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMode, currentStep, eng.piecesPlaced, practiceMode, selectedLesson.id]);

  // Animated SRS Spin Demonstration ("▶ Demostrar Giro")
  const handleDemoCurrentStep = useCallback(() => {
    if (!currentStep || isAutoPlaying) return;
    const engine = engineRef.current;

    // Reset current piece back to exact spawn position before animating path
    if (!engine.activePiece || engine.activePiece.type !== currentStep.piece) {
      return;
    }

    const requireTSpin =
      currentStep.piece === 'T' &&
      (currentStep.expectedClear === 'TSS' ||
        currentStep.expectedClear === 'TSD' ||
        currentStep.expectedClear === 'TST' ||
        currentStep.expectedClear === 'TSMS' ||
        currentStep.expectedClear === 'TSMD');

    const path = findSRSPath(engine.board, currentStep, requireTSpin);
    if (!path) return;

    // Put activePiece cleanly at spawn before stepping through path.actions
    engine.activePiece = {
      type: currentStep.piece,
      rotation: 0,
      x: 3,
      y: 18,
    };
    engine.lastActionWasRotation = false;
    engine.lastKickIndex = 0;
    engine.manipulationsCount = 0;

    setIsAutoPlaying(true);
    bumpUi();

    path.actions.forEach((act, idx) => {
      const tId = window.setTimeout(() => {
        if (act === 'hardDrop') {
          const res = engine.hardDrop();
          handleLockResult(res);
        } else {
          executeAtomicAction(engine, act);
          if (act === 'cw' || act === 'ccw' || act === 'rot180') {
            const spinCheck = engine.activePiece
              ? detectTSpin(engine.board, engine.activePiece, true, engine.lastKickIndex)
              : { isTSpin: false };
            sound.rotate(spinCheck.isTSpin);
          } else {
            sound.move();
          }
        }
        if (idx === path.actions.length - 1) {
          setIsAutoPlaying(false);
        }
        bumpUi();
      }, (idx + 1) * 210);
      autoPlayTimersRef.current.push(tId);
    });
  }, [bumpUi, currentStep, handleLockResult, isAutoPlaying]);

  // Editor Handlers
  const handlePaintCell = useCallback(
    (x: number, y: number, erase: boolean) => {
      setEditorBoard((prev) => {
        const next = cloneBoard(prev);
        next[y][x] = erase || eraseMode ? null : activeBrush;
        return next;
      });
    },
    [activeBrush, eraseMode]
  );

  const handleOpenEditorFromCurrent = useCallback(() => {
    clearAutoPlayTimers();
    setEditorBoard(cloneBoard(engineRef.current.board));
    setActiveMode('editor');
  }, [clearAutoPlayTimers]);

  const handleTestTemplate = useCallback(() => {
    clearAutoPlayTimers();
    const topDown = serializeBoardTopDown(editorBoard);
    const q = parseQueueString(queueInput);
    const hold = holdInput === '' ? null : holdInput;
    setActiveMode('zen');
    engineRef.current.startCustomTemplate(topDown, q, hold);
    bumpUi();
  }, [bumpUi, clearAutoPlayTimers, editorBoard, holdInput, queueInput]);

  const handleSaveCustomTemplate = useCallback(
    (name: string, description: string) => {
      const newItem: CustomTemplateItem = {
        id: `custom-${Date.now()}`,
        name,
        description,
        boardTopDown: serializeBoardTopDown(editorBoard),
        queue: parseQueueString(queueInput),
        hold: holdInput === '' ? null : holdInput,
        createdAt: Date.now(),
      };
      setCustomTemplates((prev) => {
        const next = [newItem, ...prev];
        saveCustomTemplates(next);
        return next;
      });
    },
    [editorBoard, holdInput, queueInput]
  );

  const handleLaunchCustomTemplate = useCallback(
    (tpl: CustomTemplateItem) => {
      clearAutoPlayTimers();
      setEditorBoard(parseTopDownBoard(tpl.boardTopDown));
      setQueueInput(tpl.queue.join(', '));
      setHoldInput(tpl.hold ?? '');
      setActiveMode('zen');
      engineRef.current.startCustomTemplate(tpl.boardTopDown, tpl.queue, tpl.hold);
      bumpUi();
    },
    [bumpUi, clearAutoPlayTimers]
  );

  const isGrounded = activeMode !== 'editor' && eng.isGrounded();
  const lockLimit = activeMode === 'lesson' || activeMode === 'zen' ? 1200 : 500;
  const lockRatio = isGrounded ? eng.lockTimerMs / lockLimit : 0;
  const spinCheck =
    activeMode !== 'editor' && eng.activePiece && eng.lastActionWasRotation
      ? detectTSpin(eng.board, eng.activePiece, true, eng.lastKickIndex)
      : { isTSpin: false, isMini: false };

  const pps =
    eng.elapsedMs > 500 ? (eng.piecesPlaced / (eng.elapsedMs / 1000)).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100">
      {/* Top Competitive Header */}
      <header className="border-b border-slate-800/90 bg-slate-950/85 backdrop-blur-md px-4 py-2.5 sticky top-0 z-40">
        <div className="max-w-[1460px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-sky-400 flex items-center justify-center font-black text-slate-950 shadow-lg">
              4L
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                FOUR.LOL DOJO
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  SRS + 52 LECCIONES
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Entrenador interactivo de C-Spin, Aperturas, T-Spins, Perfect Clears y Wall Kicks
              </div>
            </div>
          </div>

          {/* Mode Tabs */}
          <nav className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => startLessonSession(selectedLesson, practiceMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeMode === 'lesson'
                  ? 'bg-fuchsia-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Academia ({ALL_LESSONS.length})
            </button>

            <button
              onClick={handleOpenEditorFromCurrent}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeMode === 'editor'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              Editor
            </button>

            <button
              onClick={() => startFreePlayMode('sprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeMode === 'sprint'
                  ? 'bg-sky-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Sprint 40L
            </button>

            <button
              onClick={() => startFreePlayMode('marathon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeMode === 'marathon'
                  ? 'bg-sky-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Maratón
            </button>

            <button
              onClick={() => startFreePlayMode('ultra')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeMode === 'ultra'
                  ? 'bg-sky-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              Ultra 2m
            </button>

            <button
              onClick={() => startFreePlayMode('zen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                activeMode === 'zen'
                  ? 'bg-emerald-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              Zen Libre
            </button>
          </nav>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setSettings((s) => ({ ...s, enableSound: !s.enableSound }))
              }
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
              title="Activar / silenciar sonido"
            >
              {settings.enableSound ? (
                <Volume2 className="w-4 h-4 text-sky-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-fuchsia-400" />
              DAS / Controles
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Arena */}
      <main className="flex-1 max-w-[1460px] w-full mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-[330px_1fr_370px] gap-4 items-start">
        {/* LEFT COLUMN: Lesson Catalog */}
        <div className="h-[680px]">
          <LessonSidebar
            lessons={ALL_LESSONS}
            selectedLessonId={activeMode === 'lesson' ? selectedLesson.id : null}
            completedIds={completedIds}
            hideCompleted={hideCompleted}
            onToggleHideCompleted={toggleHideCompleted}
            customTemplates={customTemplates}
            onSelectLesson={(lesson) => startLessonSession(lesson, practiceMode)}
            onLaunchCustomTemplate={handleLaunchCustomTemplate}
            onOpenEditor={handleOpenEditorFromCurrent}
          />
        </div>

        {/* CENTER COLUMN: Hold + Tetris Playfield + Next Queue */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="flex items-start justify-center gap-3 sm:gap-4">
            {/* Left Side of Board: HOLD + Combat Stats */}
            <div className="w-28 sm:w-32 flex flex-col gap-3">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  HOLD (C / Shift)
                </div>
                <MiniPieceCanvas
                  piece={activeMode === 'editor' ? (holdInput || null) : eng.holdPiece}
                  cellSize={16}
                  dimmed={!eng.canHold && activeMode !== 'editor'}
                />
              </div>

              {/* Combat Telemetry */}
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 space-y-2.5">
                {eng.b2bChain > 0 && (
                  <div className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-black text-center flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    B2B ×{eng.b2bChain}
                  </div>
                )}

                {eng.combo > 0 && (
                  <div className="px-2 py-1 rounded-lg bg-sky-500/20 border border-sky-400/50 text-sky-300 text-[11px] font-black text-center">
                    {eng.combo} COMBO
                  </div>
                )}

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Ataque Enviado
                  </div>
                  <div className="text-lg font-black font-mono text-fuchsia-300">
                    {eng.attackSent} <span className="text-[10px] text-slate-400">líneas</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Líneas
                  </div>
                  <div className="text-base font-black font-mono text-slate-100">
                    {eng.lines}
                    {activeMode === 'sprint'
                      ? ' / 40'
                      : activeMode === 'marathon'
                        ? ' / 150'
                        : ''}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Tiempo / PPS
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-200">
                    {activeMode === 'ultra'
                      ? formatTime(120_000 - eng.elapsedMs)
                      : formatTime(eng.elapsedMs)}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">{pps} PPS</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Finesse
                  </div>
                  <div
                    className={`text-xs font-mono font-bold ${
                      eng.finesseFaultsTotal === 0 ? 'text-emerald-400' : 'text-amber-300'
                    }`}
                  >
                    {eng.finesseFaultsTotal} faltas
                  </div>
                  {eng.lastFinesseHint && (
                    <div className="text-[10px] text-amber-200/85 mt-1 leading-tight">
                      {eng.lastFinesseHint}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center Playfield Canvas */}
            <BoardCanvas
              board={activeMode === 'editor' ? editorBoard : eng.board}
              activePiece={activeMode === 'editor' ? null : eng.activePiece}
              enableGhost={settings.enableGhost}
              enableGrid={settings.enableGrid}
              showGuide={showGuide && activeMode === 'lesson'}
              currentStep={currentStep}
              nextStep={nextStep}
              lockRatio={lockRatio}
              isGrounded={isGrounded}
              isSpinReady={spinCheck.isTSpin}
              banner={banner}
              flashAlpha={flashAlpha}
              gameOver={eng.gameOver}
              victory={eng.victory}
              lessonCompleted={activeMode === 'lesson' && eng.lessonCompleted}
              editorMode={activeMode === 'editor'}
              onPaintCell={handlePaintCell}
              onReset={handleResetCurrent}
              onNextLesson={activeMode === 'lesson' ? handleNextLesson : undefined}
              renderTick={uiTick}
            />

            {/* Right Side of Board: NEXT Queue + Undo/Reset */}
            <div className="w-28 sm:w-32 flex flex-col gap-3">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  NEXT
                </div>
                <div className="space-y-1.5">
                  {(activeMode === 'editor'
                    ? parseQueueString(queueInput).slice(0, 5)
                    : eng.queue.slice(0, 5)
                  ).map((p, i) => (
                    <div
                      key={i}
                      className={`py-0.5 rounded-lg ${
                        i === 0 ? 'bg-slate-950/70 border border-slate-800' : ''
                      }`}
                    >
                      <MiniPieceCanvas piece={p} cellSize={i === 0 ? 16 : 13} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Controls */}
              {activeMode !== 'editor' && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2 space-y-1.5">
                  <button
                    onClick={handleResetCurrent}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-100 flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-fuchsia-400" />
                    Reiniciar (R)
                  </button>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        if (eng.undo()) bumpUi();
                      }}
                      disabled={eng.history.length === 0}
                      title="Deshacer movimiento (Backspace / Ctrl+Z)"
                      className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-[11px] font-semibold text-slate-200 flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      Atrás
                    </button>
                    <button
                      onClick={() => {
                        if (eng.redo()) bumpUi();
                      }}
                      disabled={eng.redoStack.length === 0}
                      title="Rehacer movimiento (Ctrl+Y)"
                      className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-[11px] font-semibold text-slate-200 flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Redo2 className="w-3.5 h-3.5" />
                      Rehacer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Keyboard Bar under Board */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200">
                ← →
              </kbd>{' '}
              Mover
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200">
                ↓
              </kbd>{' '}
              Soft Drop
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200">
                Espacio
              </kbd>{' '}
              Hard Drop
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-fuchsia-300">
                ↑/X
              </kbd>{' '}
              Giro ↻
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-fuchsia-300">
                Z
              </kbd>{' '}
              Giro ↺
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-fuchsia-300">
                A
              </kbd>{' '}
              180°
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-amber-300">
                C/Shift
              </kbd>{' '}
              Hold
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-300">
                Backspace
              </kbd>{' '}
              Deshacer
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Lesson Theory & Step Coach OR Custom Template Editor */}
        <div className="h-[680px]">
          {activeMode === 'editor' ? (
            <TemplateEditor
              activeBrush={activeBrush}
              onSelectBrush={setActiveBrush}
              eraseMode={eraseMode}
              onToggleEraseMode={setEraseMode}
              queueInput={queueInput}
              onChangeQueueInput={setQueueInput}
              holdInput={holdInput}
              onChangeHoldInput={setHoldInput}
              onClearBoard={() => setEditorBoard(createEmptyBoard())}
              onLoadCurrentLessonToEditor={() => {
                engineRef.current.startLesson(selectedLesson, 'execute');
                setEditorBoard(cloneBoard(engineRef.current.board));
              }}
              onTestTemplate={handleTestTemplate}
              onSaveTemplate={handleSaveCustomTemplate}
              onExportJson={() =>
                JSON.stringify(
                  {
                    boardTopDown: serializeBoardTopDown(editorBoard),
                    queue: parseQueueString(queueInput),
                    hold: holdInput || null,
                  },
                  null,
                  2
                )
              }
              onImportJson={(raw) => {
                try {
                  const parsed = JSON.parse(raw) as {
                    boardTopDown: string[];
                    queue?: PieceType[];
                    hold?: PieceType | null;
                  };
                  if (!Array.isArray(parsed.boardTopDown)) return false;
                  setEditorBoard(parseTopDownBoard(parsed.boardTopDown));
                  if (Array.isArray(parsed.queue)) {
                    setQueueInput(parsed.queue.join(', '));
                  }
                  setHoldInput(parsed.hold ?? '');
                  return true;
                } catch {
                  return false;
                }
              }}
              customTemplates={customTemplates}
              onDeleteCustomTemplate={(id) => {
                setCustomTemplates((prev) => {
                  const next = prev.filter((item) => item.id !== id);
                  saveCustomTemplates(next);
                  return next;
                });
              }}
              onLoadCustomIntoEditor={(tpl) => {
                setEditorBoard(parseTopDownBoard(tpl.boardTopDown));
                setQueueInput(tpl.queue.join(', '));
                setHoldInput(tpl.hold ?? '');
              }}
            />
          ) : (
            <TheoryPanel
              lesson={selectedLesson}
              practiceMode={practiceMode}
              onChangePracticeMode={(m) => startLessonSession(selectedLesson, m)}
              completedSteps={eng.completedStepIndices}
              currentStepIdx={currentStepIdx}
              computedActions={computedActions}
              isAutoPlaying={isAutoPlaying}
              onDemoCurrentStep={handleDemoCurrentStep}
              showGuide={showGuide}
              onToggleGuide={() => setShowGuide((g) => !g)}
              autoRepeat={autoRepeat}
              onToggleAutoRepeat={() => setAutoRepeat((r) => !r)}
            />
          )}
        </div>
      </main>

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
