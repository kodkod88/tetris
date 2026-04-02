import type { Board, CellValue, Point, ActivePiece, TetrominoType, RotationState } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';
import { getPieceCells } from './tetrominoes';

export function createBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array<CellValue>(BOARD_WIDTH).fill(null)
  );
}

export function isValidPosition(
  board: Board,
  type: TetrominoType,
  rotation: RotationState,
  position: Point
): boolean {
  const cells = getPieceCells(type, rotation, position);
  return cells.every(({ x, y }) =>
    x >= 0 &&
    x < BOARD_WIDTH &&
    y < BOARD_HEIGHT &&
    (y < 0 || board[y][x] === null)
  );
}

export function lockPiece(board: Board, piece: ActivePiece): Board {
  const cells = getPieceCells(piece.type, piece.rotation, piece.position);
  const newBoard = board.map((row) => [...row]);
  cells.forEach(({ x, y }) => {
    if (y >= 0) newBoard[y][x] = piece.type;
  });
  return newBoard;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = BOARD_HEIGHT - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array<CellValue>(BOARD_WIDTH).fill(null)
  );
  return { board: [...emptyRows, ...remaining], linesCleared };
}

export function getGhostPosition(board: Board, piece: ActivePiece): Point {
  let y = piece.position.y;
  while (isValidPosition(board, piece.type, piece.rotation, { x: piece.position.x, y: y + 1 })) {
    y++;
  }
  return { x: piece.position.x, y };
}

export function isTopOut(board: Board, piece: ActivePiece): boolean {
  return !isValidPosition(board, piece.type, piece.rotation, piece.position);
}
