import { useRef, useEffect } from 'react';
import type { TetrominoType } from '../game/types';
import { TETROMINOES, TETROMINO_COLORS } from '../game/tetrominoes';

const CELL = 24;
export const MINI_CANVAS_SIZE = 4 * CELL;

export function drawMiniPiece(
  ctx: CanvasRenderingContext2D,
  type: TetrominoType,
  canvasSize: number,
  alpha = 1
) {
  const cells = TETROMINOES[type][0];
  const xs = cells.map((c) => c.x);
  const ys = cells.map((c) => c.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const offsetX = (canvasSize - (maxX - minX + 1) * CELL) / 2 - minX * CELL;
  const offsetY = (canvasSize - (maxY - minY + 1) * CELL) / 2 - minY * CELL;

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  cells.forEach(({ x, y }) => {
    const px = x * CELL + offsetX;
    const py = y * CELL + offsetY;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = TETROMINO_COLORS[type];
    ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(px + 1, py + 1, CELL - 2, 2);
    ctx.fillRect(px + 1, py + 1, 2, CELL - 2);
  });
  ctx.globalAlpha = 1;
}

export function MiniPieceCanvas({ type, alpha = 1 }: { type: TetrominoType; alpha?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawMiniPiece(ctx, type, MINI_CANVAS_SIZE, alpha);
  }, [type, alpha]);

  return (
    <canvas
      ref={ref}
      width={MINI_CANVAS_SIZE}
      height={MINI_CANVAS_SIZE}
      style={{ display: 'block' }}
    />
  );
}
