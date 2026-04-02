import { useReducer, useCallback } from 'react';
import { gameReducer, createInitialState } from '../game/gameEngine';

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const actions = {
    startGame:  useCallback(() => dispatch({ type: 'START_GAME' }), []),
    pauseGame:  useCallback(() => dispatch({ type: 'PAUSE_GAME' }), []),
    resumeGame: useCallback(() => dispatch({ type: 'RESUME_GAME' }), []),
    resetGame:  useCallback(() => dispatch({ type: 'RESET_GAME' }), []),
    moveLeft:   useCallback(() => dispatch({ type: 'MOVE_LEFT' }), []),
    moveRight:  useCallback(() => dispatch({ type: 'MOVE_RIGHT' }), []),
    softDrop:   useCallback(() => dispatch({ type: 'SOFT_DROP' }), []),
    hardDrop:   useCallback(() => dispatch({ type: 'HARD_DROP' }), []),
    rotateCW:   useCallback(() => dispatch({ type: 'ROTATE_CW' }), []),
    rotateCCW:  useCallback(() => dispatch({ type: 'ROTATE_CCW' }), []),
    hold:       useCallback(() => dispatch({ type: 'HOLD' }), []),
    tick:       useCallback((deltaMs: number) => dispatch({ type: 'TICK', deltaMs }), []),
  };

  return { state, actions };
}
