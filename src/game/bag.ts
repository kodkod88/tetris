import type { TetrominoType } from './types';

const ALL_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newBag(): TetrominoType[] {
  return shuffle([...ALL_TYPES]);
}

export function refillQueue(
  nextPieces: TetrominoType[],
  bag: TetrominoType[]
): { nextPieces: TetrominoType[]; bag: TetrominoType[] } {
  let currentBag = [...bag];
  const queue = [...nextPieces];
  while (queue.length < 6) {
    if (currentBag.length === 0) currentBag = newBag();
    queue.push(currentBag.shift()!);
  }
  return { nextPieces: queue, bag: currentBag };
}
