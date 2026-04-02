import { LINE_CLEAR_SCORES, LINES_PER_LEVEL, SOFT_DROP_SCORE, HARD_DROP_SCORE } from './constants';

export function calculateLineClearScore(linesCleared: number, level: number): number {
  if (linesCleared === 0) return 0;
  const base = LINE_CLEAR_SCORES[linesCleared] ?? 0;
  return base * level;
}

export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
}

export function softDropScore(cells: number): number {
  return cells * SOFT_DROP_SCORE;
}

export function hardDropScore(cells: number): number {
  return cells * HARD_DROP_SCORE;
}
