import { useEffect, useRef, useState } from 'react';
import {
  BOARD_WIDTH,
  PIECE_COLORS,
  VISIBLE_HEIGHT,
  getGhostPiece,
  getPieceCells,
} from '../engine/srs.ts';
import type { BannerEvent } from '../engine/gameEngine.ts';
import type {
  ActivePiece,
  CellColor,
  LessonStep,
} from '../engine/types.ts';

const RENDER_ROWS = 22; // 20 standard rows + 2 top spawn rows
const CELL_PX = 28;

interface BoardCanvasProps {
  board: CellColor[][];
  activePiece: ActivePiece | null;
  enableGhost: boolean;
  enableGrid: boolean;
  showGuide: boolean;
  currentStep: LessonStep | null;
  nextStep: LessonStep | null;
  lockRatio: number; // 0..1
  isGrounded: boolean;
  isSpinReady: boolean;
  banner: BannerEvent | null;
  flashAlpha: number;
  gameOver: boolean;
  victory: boolean;
  lessonCompleted: boolean;
  editorMode: boolean;
  onPaintCell?: (x: number, y: number, erase: boolean) => void;
  onReset: () => void;
  onNextLesson?: () => void;
  renderTick: number;
}

export function BoardCanvas({
  board,
  activePiece,
  enableGhost,
  enableGrid,
  showGuide,
  currentStep,
  nextStep,
  lockRatio,
  isGrounded,
  isSpinReady,
  banner,
  flashAlpha,
  gameOver,
  victory,
  lessonCompleted,
  editorMode,
  onPaintCell,
  onReset,
  onNextLesson,
  renderTick,
}: BoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mouseButtons, setMouseButtons] = useState<number>(0);

  const width = BOARD_WIDTH * CELL_PX;
  const height = RENDER_ROWS * CELL_PX;

  const paintFromMouseEvent = (
    e: React.MouseEvent<HTMLCanvasElement>,
    buttonsMask: number
  ) => {
    if (!editorMode || !onPaintCell || buttonsMask === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const gx = Math.floor(px / CELL_PX);
    const gy = RENDER_ROWS - 1 - Math.floor(py / CELL_PX);
    if (gx >= 0 && gx < BOARD_WIDTH && gy >= 0 && gy < VISIBLE_HEIGHT) {
      const erase = (buttonsMask & 2) !== 0;
      onPaintCell(gx, gy, erase);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // 1. Background: top spawn buffer (rows 20-21) slightly darker than main 20-row arena
    const topBufferPx = (RENDER_ROWS - VISIBLE_HEIGHT) * CELL_PX;
    ctx.fillStyle = '#070b16';
    ctx.fillRect(0, 0, width, topBufferPx);
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, topBufferPx, width, height - topBufferPx);

    // 2. Grid lines
    if (enableGrid || editorMode) {
      ctx.strokeStyle = editorMode
        ? 'rgba(100, 116, 139, 0.28)'
        : 'rgba(51, 65, 85, 0.35)';
      ctx.lineWidth = 1;
      for (let x = 1; x < BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_PX + 0.5, topBufferPx);
        ctx.lineTo(x * CELL_PX + 0.5, height);
        ctx.stroke();
      }
      for (let r = RENDER_ROWS - VISIBLE_HEIGHT; r < RENDER_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL_PX + 0.5);
        ctx.lineTo(width, r * CELL_PX + 0.5);
        ctx.stroke();
      }
    }

    // Top-out 20-row boundary line
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(0, topBufferPx);
    ctx.lineTo(width, topBufferPx);
    ctx.stroke();
    ctx.setLineDash([]);

    const drawBlock = (
      gx: number,
      gy: number,
      colorKey: Exclude<CellColor, null>,
      alpha = 1,
      highlightGlow = false
    ) => {
      if (gy < 0 || gy >= RENDER_ROWS) return;
      const px = gx * CELL_PX;
      const py = (RENDER_ROWS - 1 - gy) * CELL_PX;
      const pal = PIECE_COLORS[colorKey];

      ctx.save();
      ctx.globalAlpha = alpha;
      if (highlightGlow) {
        ctx.shadowColor = pal.fill;
        ctx.shadowBlur = 12;
      }
      ctx.fillStyle = pal.fill;
      ctx.fillRect(px + 1, py + 1, CELL_PX - 2, CELL_PX - 2);

      ctx.shadowBlur = 0;
      ctx.fillStyle = pal.light;
      ctx.fillRect(px + 1, py + 1, CELL_PX - 2, 3.5);
      ctx.fillRect(px + 1, py + 1, 3.5, CELL_PX - 2);

      ctx.fillStyle = pal.dark;
      ctx.fillRect(px + 1, py + CELL_PX - 4.5, CELL_PX - 2, 3.5);
      ctx.fillRect(px + CELL_PX - 4.5, py + 1, 3.5, CELL_PX - 2);
      ctx.restore();
    };

    // 3. Locked board cells
    for (let y = 0; y < RENDER_ROWS; y++) {
      const row = board[y];
      if (!row) continue;
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = row[x];
        if (cell) {
          drawBlock(x, y, cell, 1, false);
        }
      }
    }

    // 4. Guided Step Target Silhouette Overlay (four.lol interactive trainer guide!)
    if (!editorMode && showGuide && currentStep) {
      // Optional subtle preview of next step when current step doesn't clear lines
      if (nextStep && !currentStep.expectedClear) {
        const nextCells = getPieceCells({
          type: nextStep.piece,
          rotation: nextStep.rotation,
          x: nextStep.x,
          y: nextStep.y,
        });
        const nextPal = PIECE_COLORS[nextStep.piece];
        ctx.save();
        ctx.strokeStyle = nextPal.fill;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        for (const [cx, cy] of nextCells) {
          if (cy < 0 || cy >= RENDER_ROWS) continue;
          const px = cx * CELL_PX;
          const py = (RENDER_ROWS - 1 - cy) * CELL_PX;
          ctx.strokeRect(px + 3, py + 3, CELL_PX - 6, CELL_PX - 6);
        }
        ctx.restore();
      }

      const targetCells = getPieceCells({
        type: currentStep.piece,
        rotation: currentStep.rotation,
        x: currentStep.x,
        y: currentStep.y,
      });
      const pal = PIECE_COLORS[currentStep.piece];
      const pulse = 0.68 + 0.25 * Math.sin(performance.now() / 220);

      ctx.save();
      for (const [cx, cy] of targetCells) {
        if (cy < 0 || cy >= RENDER_ROWS) continue;
        const px = cx * CELL_PX;
        const py = (RENDER_ROWS - 1 - cy) * CELL_PX;

        ctx.fillStyle = pal.glow;
        ctx.globalAlpha = 0.26 * pulse;
        ctx.fillRect(px + 2, py + 2, CELL_PX - 4, CELL_PX - 4);

        ctx.globalAlpha = pulse;
        ctx.strokeStyle = pal.light;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(px + 2.5, py + 2.5, CELL_PX - 5, CELL_PX - 5);

        ctx.setLineDash([]);
        ctx.fillStyle = pal.light;
        ctx.globalAlpha = 0.85;
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentStep.piece, px + CELL_PX / 2, py + CELL_PX / 2);
      }
      ctx.restore();
    }

    // 5. Ghost Piece & Active Piece
    if (!editorMode && activePiece && !gameOver) {
      if (enableGhost) {
        const ghost = getGhostPiece(board, activePiece);
        if (ghost.y !== activePiece.y) {
          const gCells = getPieceCells(ghost);
          const pal = PIECE_COLORS[activePiece.type];
          ctx.save();
          ctx.strokeStyle = pal.fill;
          ctx.fillStyle = pal.glow;
          ctx.lineWidth = 1.75;
          for (const [gx, gy] of gCells) {
            if (gy < 0 || gy >= RENDER_ROWS) continue;
            const px = gx * CELL_PX;
            const py = (RENDER_ROWS - 1 - gy) * CELL_PX;
            ctx.globalAlpha = 0.16;
            ctx.fillRect(px + 2, py + 2, CELL_PX - 4, CELL_PX - 4);
            ctx.globalAlpha = 0.62;
            ctx.strokeRect(px + 2, py + 2, CELL_PX - 4, CELL_PX - 4);
          }
          ctx.restore();
        }
      }

      const activeCells = getPieceCells(activePiece);
      const lockDim = isGrounded ? 1 - lockRatio * 0.25 : 1;
      for (const [ax, ay] of activeCells) {
        drawBlock(ax, ay, activePiece.type, lockDim, isSpinReady);
      }
    }

    // 6. Clear flash effect
    if (flashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.35, flashAlpha)})`;
      ctx.fillRect(0, topBufferPx, width, height - topBufferPx);
      ctx.restore();
    }

    // Column indices footer hint on canvas top buffer in editor mode
    if (editorMode) {
      ctx.save();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      for (let x = 0; x < BOARD_WIDTH; x++) {
        ctx.fillText(String(x), x * CELL_PX + CELL_PX / 2, topBufferPx - 8);
      }
      ctx.restore();
    }
  }, [
    board,
    activePiece,
    enableGhost,
    enableGrid,
    showGuide,
    currentStep,
    nextStep,
    lockRatio,
    isGrounded,
    isSpinReady,
    flashAlpha,
    gameOver,
    editorMode,
    width,
    height,
    renderTick,
  ]);

  return (
    <div className="relative select-none flex flex-col items-center">
      <div
        className={`relative rounded-xl overflow-hidden border-2 transition-shadow duration-200 ${
          isSpinReady
            ? 'border-fuchsia-400 shadow-[0_0_28px_rgba(217,70,239,0.45)]'
            : lessonCompleted
              ? 'border-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.35)]'
              : 'border-slate-700/90 shadow-[0_14px_40px_rgba(0,0,0,0.65)]'
        }`}
      >
        <canvas
          ref={canvasRef}
          style={{ width: `${width}px`, height: `${height}px` }}
          className={`block ${editorMode ? 'cursor-crosshair' : ''}`}
          onContextMenu={(e) => {
            if (editorMode) e.preventDefault();
          }}
          onMouseDown={(e) => {
            if (!editorMode) return;
            setMouseButtons(e.buttons);
            paintFromMouseEvent(e, e.buttons);
          }}
          onMouseMove={(e) => {
            if (!editorMode || mouseButtons === 0) return;
            paintFromMouseEvent(e, e.buttons || mouseButtons);
          }}
          onMouseUp={() => setMouseButtons(0)}
          onMouseLeave={() => setMouseButtons(0)}
        />

        {/* Floating Action Callout Banner (T-SPIN TRIPLE!, B2B TSD!, PERFECT CLEAR!) */}
        {banner && (
          <div
            key={banner.id}
            className="pointer-events-none absolute inset-x-2 top-16 flex flex-col items-center text-center animate-callout z-20"
          >
            <div
              className="px-3.5 py-1.5 rounded-lg bg-slate-950/90 border backdrop-blur-md shadow-xl"
              style={{ borderColor: banner.color }}
            >
              <div
                className="text-sm font-black tracking-wider uppercase"
                style={{ color: banner.color }}
              >
                {banner.title}
              </div>
              {banner.subtitle && (
                <div className="text-[11px] font-semibold text-slate-200 mt-0.5">
                  {banner.subtitle}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lesson Completed Celebration Banner (non-blocking bottom badge if player wants to keep playing!) */}
        {lessonCompleted && !gameOver && !editorMode && (
          <div className="absolute inset-x-2.5 bottom-2.5 z-20 rounded-xl bg-emerald-950/95 border border-emerald-400/70 p-2.5 backdrop-blur-md shadow-2xl space-y-2">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-300">
                ✓ ¡Objetivo Completado!
              </div>
              <div className="text-[11px] text-emerald-100/90 leading-snug mt-0.5">
                Pulsa <kbd className="px-1 py-0.5 rounded bg-emerald-900 text-emerald-200 font-mono">R</kbd> para repetir o avanza a la siguiente.
              </div>
            </div>
            <div className={`grid gap-1.5 ${onNextLesson ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <button
                onClick={onReset}
                className="w-full py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center cursor-pointer transition"
              >
                Repetir (R)
              </button>
              {onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-emerald-500/40 font-semibold text-xs text-center truncate cursor-pointer transition"
                >
                  Siguiente →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Game Over / Mode Victory Overlay */}
        {(gameOver || victory) && !editorMode && (
          <div className="absolute inset-0 z-30 bg-slate-950/82 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div
              className={`text-2xl font-black tracking-tight mb-1 ${
                victory ? 'text-amber-300' : 'text-rose-400'
              }`}
            >
              {victory ? '🏆 ¡MODO COMPLETADO!' : '💥 TOP OUT'}
            </div>
            <p className="text-xs text-slate-300 mb-4">
              {victory
                ? 'Excelente ejecución y velocidad de apilado.'
                : 'Puedes deshacer el último movimiento (Ctrl+Z) o reiniciar al instante (R).'}
            </p>
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-bold text-sm cursor-pointer transition shadow-lg"
            >
              Reiniciar (R)
            </button>
          </div>
        )}
      </div>

      {/* Lock Delay Progress Bar */}
      <div className="w-full h-1.5 mt-1.5 rounded-full bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ${
            isSpinReady ? 'bg-fuchsia-400' : 'bg-sky-400'
          }`}
          style={{ width: `${isGrounded ? Math.min(100, lockRatio * 100) : 0}%` }}
        />
      </div>
    </div>
  );
}
