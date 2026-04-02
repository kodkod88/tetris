import type { TetrominoType, RotationState, Board, Point } from './types';
import { isValidPosition } from './board';

type KickTable = Record<number, Point[]>;
type KickTables = { CW: KickTable; CCW: KickTable };

// ── SRS wall-kick data ────────────────────────────────────────────────────────

const WALL_KICKS_JLSTZ_CW: KickTable = {
  0: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  3: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
};

const WALL_KICKS_JLSTZ_CCW: KickTable = {
  0: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  2: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  3: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
};

const WALL_KICKS_I_CW: KickTable = {
  0: [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
  1: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
  2: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  3: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
};

const WALL_KICKS_I_CCW: KickTable = {
  0: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
  1: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
  3: [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
};

// O piece needs no kicks — a single zero-offset entry always succeeds.
const ZERO_KICKS: KickTable = {
  0: [{ x: 0, y: 0 }],
  1: [{ x: 0, y: 0 }],
  2: [{ x: 0, y: 0 }],
  3: [{ x: 0, y: 0 }],
};

const JLSTZ: KickTables = { CW: WALL_KICKS_JLSTZ_CW, CCW: WALL_KICKS_JLSTZ_CCW };

// Data-driven map: adding a new piece type requires only an entry here, not
// changes to tryRotate (Open/Closed Principle).
const PIECE_KICK_TABLES: Record<TetrominoType, KickTables> = {
  I: { CW: WALL_KICKS_I_CW, CCW: WALL_KICKS_I_CCW },
  O: { CW: ZERO_KICKS,      CCW: ZERO_KICKS },
  T: JLSTZ,
  S: JLSTZ,
  Z: JLSTZ,
  J: JLSTZ,
  L: JLSTZ,
};

// ── Public API ────────────────────────────────────────────────────────────────

export type RotateResult =
  | { success: true; rotation: RotationState; position: Point }
  | { success: false };

export function tryRotate(
  board: Board,
  type: TetrominoType,
  currentRotation: RotationState,
  position: Point,
  direction: 'CW' | 'CCW'
): RotateResult {
  const nextRotation = (direction === 'CW'
    ? (currentRotation + 1) % 4
    : (currentRotation + 3) % 4) as RotationState;

  const kicks = PIECE_KICK_TABLES[type][direction][currentRotation];
  for (const kick of kicks) {
    const testPos = { x: position.x + kick.x, y: position.y + kick.y };
    if (isValidPosition(board, type, nextRotation, testPos)) {
      return { success: true, rotation: nextRotation, position: testPos };
    }
  }
  return { success: false };
}
