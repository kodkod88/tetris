export type Point = { x: number; y: number };

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type RotationState = 0 | 1 | 2 | 3;

export type TetrominoShape = Point[];

export type CellValue = TetrominoType | null;

export type Board = CellValue[][];

export interface ActivePiece {
  type: TetrominoType;
  rotation: RotationState;
  position: Point;
}

export interface GameState {
  board: Board;
  activePiece: ActivePiece | null;
  holdPiece: TetrominoType | null;
  holdUsed: boolean;
  nextPieces: TetrominoType[];
  bag: TetrominoType[];
  score: number;
  lines: number;
  level: number;
  phase: 'idle' | 'playing' | 'paused' | 'gameover';
  lockDelay: number;
  lockMoves: number;
  gravityAccum: number;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'TICK'; deltaMs: number }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'ROTATE_CW' }
  | { type: 'ROTATE_CCW' }
  | { type: 'HOLD' }
  | { type: 'RESET_GAME' };
