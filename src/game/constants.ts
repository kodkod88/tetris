export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const GRAVITY_MS: Record<number, number> = {
  1: 800, 2: 717, 3: 634, 4: 551, 5: 468,
  6: 385, 7: 302, 8: 219, 9: 168, 10: 118,
  11: 100, 12: 80,  13: 70,  14: 60,  15: 50,
  16: 40,  17: 30,  18: 20,  19: 15,  20: 10,
};

export const LOCK_DELAY_MS = 500;
export const MAX_LOCK_MOVES = 15;

export const LINE_CLEAR_SCORES: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

export const SOFT_DROP_SCORE = 1;
export const HARD_DROP_SCORE = 2;

export const LINES_PER_LEVEL = 10;

export const SPAWN_COL = 3;
