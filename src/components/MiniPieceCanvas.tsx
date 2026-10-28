import { useEffect, useRef } from 'react';
import { PIECE_COLORS, PIECE_SHAPES } from '../engine/srs.ts';
import type { PieceType } from '../engine/types.ts';

interface MiniPieceCanvasProps {
  piece: PieceType | null;
  cellSize?: number;
  dimmed?: boolean;
}

export function MiniPieceCanvas({
  piece,
  cellSize = 18,
  dimmed = false,
}: MiniPieceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = cellSize * 4 + 8;
  const height = cellSize * 2.6 + 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (!piece) return;

    const offsets = PIECE_SHAPES[piece][0];
    const xs = offsets.map(([x]) => x);
    const ys = offsets.map(([, y]) => y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanW = (maxX - minX + 1) * cellSize;
    const spanH = (maxY - minY + 1) * cellSize;
    const startX = (width - spanW) / 2;
    const startY = (height - spanH) / 2;

    const palette = PIECE_COLORS[piece];
    ctx.globalAlpha = dimmed ? 0.38 : 1;

    for (const [ox, oy] of offsets) {
      const px = startX + (ox - minX) * cellSize;
      // flip y so +y is up
      const py = startY + (maxY - oy) * cellSize;

      ctx.fillStyle = palette.fill;
      ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

      // Top/left highlight
      ctx.fillStyle = palette.light;
      ctx.fillRect(px + 1, py + 1, cellSize - 2, 3);
      ctx.fillRect(px + 1, py + 1, 3, cellSize - 2);

      // Bottom/right bevel
      ctx.fillStyle = palette.dark;
      ctx.fillRect(px + 1, py + cellSize - 4, cellSize - 2, 3);
      ctx.fillRect(px + cellSize - 4, py + 1, 3, cellSize - 2);
    }
    ctx.globalAlpha = 1;
  }, [piece, cellSize, dimmed, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="block mx-auto"
    />
  );
}
