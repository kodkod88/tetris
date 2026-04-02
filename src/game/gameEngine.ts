import type { GameState, GameAction, ActivePiece } from './types';
import { GRAVITY_MS, LOCK_DELAY_MS, MAX_LOCK_MOVES } from './constants';
import {
  createBoard,
  isValidPosition,
  lockPiece,
  clearLines,
  getGhostPosition,
  isTopOut,
} from './board';
import { spawnPiece } from './tetrominoes';
import { tryRotate } from './rotation';
import { refillQueue } from './bag';
import {
  calculateLineClearScore,
  calculateLevel,
  softDropScore,
  hardDropScore,
} from './scoring';

// ── Shared constants ──────────────────────────────────────────────────────────

// Reused wherever a piece lock/spawn cycle resets timing counters.
const RESET_LOCK = { lockDelay: 0, lockMoves: 0, gravityAccum: 0 } as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * After a lateral move or rotation, recalculates the lock-delay counters
 * so that grounded pieces correctly extend their placement window.
 */
function applyLockInteraction(
  state: GameState,
  newPiece: ActivePiece
): Pick<GameState, 'lockMoves' | 'lockDelay'> {
  const isGrounded = !isValidPosition(state.board, newPiece.type, newPiece.rotation, {
    x: newPiece.position.x,
    y: newPiece.position.y + 1,
  });
  return {
    lockMoves: isGrounded ? state.lockMoves + 1 : state.lockMoves,
    lockDelay: isGrounded && state.lockMoves < MAX_LOCK_MOVES ? 0 : state.lockDelay,
  };
}

// ── Initial state ─────────────────────────────────────────────────────────────

export function createInitialState(): GameState {
  const { nextPieces, bag } = refillQueue([], []);
  return {
    board: createBoard(),
    activePiece: null,
    holdPiece: null,
    holdUsed: false,
    nextPieces,
    bag,
    score: 0,
    lines: 0,
    level: 1,
    phase: 'idle',
    ...RESET_LOCK,
  };
}

// ── Action handlers ───────────────────────────────────────────────────────────

function handleStartGame(_state: GameState): GameState {
  const fresh = createInitialState();
  const [firstType, ...rest] = fresh.nextPieces;
  return { ...fresh, activePiece: spawnPiece(firstType), nextPieces: rest, phase: 'playing' };
}

function handleMove(state: GameState, dx: number): GameState {
  if (!state.activePiece || state.phase !== 'playing') return state;
  const newPos = { x: state.activePiece.position.x + dx, y: state.activePiece.position.y };
  if (!isValidPosition(state.board, state.activePiece.type, state.activePiece.rotation, newPos)) {
    return state;
  }
  const newPiece: ActivePiece = { ...state.activePiece, position: newPos };
  return { ...state, activePiece: newPiece, ...applyLockInteraction(state, newPiece) };
}

function handleSoftDrop(state: GameState): GameState {
  if (!state.activePiece || state.phase !== 'playing') return state;
  const newPos = { x: state.activePiece.position.x, y: state.activePiece.position.y + 1 };
  if (!isValidPosition(state.board, state.activePiece.type, state.activePiece.rotation, newPos)) {
    return state;
  }
  return {
    ...state,
    activePiece: { ...state.activePiece, position: newPos },
    score: state.score + softDropScore(1),
    gravityAccum: 0,
  };
}

function handleHardDrop(state: GameState): GameState {
  if (!state.activePiece || state.phase !== 'playing') return state;
  const ghost = getGhostPosition(state.board, state.activePiece);
  const distance = ghost.y - state.activePiece.position.y;
  return lockAndSpawn({
    ...state,
    activePiece: { ...state.activePiece, position: ghost },
    score: state.score + hardDropScore(distance),
  });
}

function handleRotate(state: GameState, direction: 'CW' | 'CCW'): GameState {
  if (!state.activePiece || state.phase !== 'playing') return state;
  const result = tryRotate(
    state.board,
    state.activePiece.type,
    state.activePiece.rotation,
    state.activePiece.position,
    direction
  );
  if (!result.success) return state;
  const newPiece: ActivePiece = {
    ...state.activePiece,
    rotation: result.rotation,
    position: result.position,
  };
  return { ...state, activePiece: newPiece, ...applyLockInteraction(state, newPiece) };
}

function handleHold(state: GameState): GameState {
  if (!state.activePiece || state.phase !== 'playing' || state.holdUsed) return state;
  const held = state.activePiece.type;
  const returning = state.holdPiece;

  let { nextPieces, bag } = state;
  let nextType = returning;

  if (!nextType) {
    nextType = nextPieces[0];
    ({ nextPieces, bag } = refillQueue(nextPieces.slice(1), bag));
  }

  return {
    ...state,
    activePiece: spawnPiece(nextType),
    holdPiece: held,
    holdUsed: true,
    nextPieces,
    bag,
    ...RESET_LOCK,
  };
}

function lockAndSpawn(state: GameState): GameState {
  if (!state.activePiece) return state;

  const newBoard = lockPiece(state.board, state.activePiece);
  const { board: clearedBoard, linesCleared } = clearLines(newBoard);
  const newLines = state.lines + linesCleared;

  const [nextType, ...rest] = state.nextPieces;
  const { nextPieces, bag } = refillQueue(rest, state.bag);
  const newPiece = spawnPiece(nextType);

  const base = {
    board: clearedBoard,
    score: state.score + calculateLineClearScore(linesCleared, state.level),
    lines: newLines,
    level: calculateLevel(newLines),
  };

  if (isTopOut(clearedBoard, newPiece)) {
    return { ...state, ...base, activePiece: null, phase: 'gameover' };
  }

  return {
    ...state,
    ...base,
    activePiece: newPiece,
    nextPieces,
    bag,
    holdUsed: false,
    ...RESET_LOCK,
  };
}

function handleTick(state: GameState, deltaMs: number): GameState {
  if (!state.activePiece || state.phase !== 'playing') return state;

  const gravityMs = GRAVITY_MS[Math.min(state.level, 20)] ?? 10;
  const newAccum = state.gravityAccum + deltaMs;

  const isGrounded = !isValidPosition(
    state.board,
    state.activePiece.type,
    state.activePiece.rotation,
    { x: state.activePiece.position.x, y: state.activePiece.position.y + 1 }
  );

  if (!isGrounded) {
    if (newAccum < gravityMs) return { ...state, gravityAccum: newAccum };
    const steps = Math.floor(newAccum / gravityMs);
    let piece = state.activePiece;
    for (let i = 0; i < steps; i++) {
      const next = { x: piece.position.x, y: piece.position.y + 1 };
      if (!isValidPosition(state.board, piece.type, piece.rotation, next)) break;
      piece = { ...piece, position: next };
    }
    return { ...state, activePiece: piece, gravityAccum: newAccum % gravityMs, lockDelay: 0 };
  }

  const newLockDelay = state.lockDelay + deltaMs;
  if (newLockDelay >= LOCK_DELAY_MS || state.lockMoves >= MAX_LOCK_MOVES) {
    return lockAndSpawn({ ...state, lockDelay: newLockDelay });
  }
  return { ...state, lockDelay: newLockDelay, gravityAccum: newAccum };
}

// ── Main reducer ──────────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':  return handleStartGame(state);
    case 'PAUSE_GAME':  return state.phase === 'playing' ? { ...state, phase: 'paused' }  : state;
    case 'RESUME_GAME': return state.phase === 'paused'  ? { ...state, phase: 'playing' } : state;
    case 'TICK':        return handleTick(state, action.deltaMs);
    case 'MOVE_LEFT':   return handleMove(state, -1);
    case 'MOVE_RIGHT':  return handleMove(state, 1);
    case 'SOFT_DROP':   return handleSoftDrop(state);
    case 'HARD_DROP':   return handleHardDrop(state);
    case 'ROTATE_CW':   return handleRotate(state, 'CW');
    case 'ROTATE_CCW':  return handleRotate(state, 'CCW');
    case 'HOLD':        return handleHold(state);
    case 'RESET_GAME':  return createInitialState();
    default:            return state;
  }
}
