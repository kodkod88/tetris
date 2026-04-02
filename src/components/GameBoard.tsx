import { useRef, useEffect } from 'react';
import type { Board, ActivePiece } from '../game/types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../game/constants';
import { TETROMINO_COLORS, getPieceCells } from '../game/tetrominoes';
import { getGhostPosition } from '../game/board';

const CELL_SIZE = 30;
export const CANVAS_W = BOARD_WIDTH * CELL_SIZE;
export const CANVAS_H = BOARD_HEIGHT * CELL_SIZE;

function drawCell(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  color: string,
  alpha: number
) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, 3);
  ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + 1, 3, CELL_SIZE - 2);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(col * CELL_SIZE + 1, row * CELL_SIZE + CELL_SIZE - 4, CELL_SIZE - 2, 3);
  ctx.fillRect(col * CELL_SIZE + CELL_SIZE - 4, row * CELL_SIZE + 1, 3, CELL_SIZE - 2);
  ctx.globalAlpha = 1;
}

interface Props {
  board: Board;
  activePiece: ActivePiece | null;
}

export default function GameBoard({ board, activePiece }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Grid lines
    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 0.5;
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      for (let c = 0; c < BOARD_WIDTH; c++) {
        ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // 3. Locked cells
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      for (let c = 0; c < BOARD_WIDTH; c++) {
        const cell = board[r][c];
        if (cell) drawCell(ctx, c, r, TETROMINO_COLORS[cell], 1);
      }
    }

    if (!activePiece) return;

    // 4. Ghost piece
    const ghost = getGhostPosition(board, activePiece);
    getPieceCells(activePiece.type, activePiece.rotation, ghost).forEach(({ x, y }) => {
      if (y >= 0) drawCell(ctx, x, y, TETROMINO_COLORS[activePiece.type], 0.2);
    });

    // 5. Active piece
    getPieceCells(activePiece.type, activePiece.rotation, activePiece.position).forEach(({ x, y }) => {
      if (y >= 0) drawCell(ctx, x, y, TETROMINO_COLORS[activePiece.type], 1);
    });
  }, [board, activePiece]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ display: 'block' }}
    />
  );
}
