import { useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import GameBoard from './GameBoard';
import NextPiecesPanel from './NextPiecesPanel';
import HoldPiecePanel from './HoldPiecePanel';
import ScorePanel from './ScorePanel';
import GameOverlay from './GameOverlay';

export default function TetrisGame() {
  const { state, actions } = useGameState();
  const isActive = state.phase === 'playing';

  const tick = useCallback((delta: number) => actions.tick(delta), [actions]);
  useGameLoop(tick, isActive);

  const handlePause = useCallback(() => {
    if (state.phase === 'playing') actions.pauseGame();
    else if (state.phase === 'paused') actions.resumeGame();
  }, [state.phase, actions]);

  useKeyboard(
    {
      onMoveLeft:  actions.moveLeft,
      onMoveRight: actions.moveRight,
      onSoftDrop:  actions.softDrop,
      onHardDrop:  actions.hardDrop,
      onRotateCW:  actions.rotateCW,
      onRotateCCW: actions.rotateCCW,
      onHold:      actions.hold,
      onPause:     handlePause,
    },
    state.phase === 'playing' || state.phase === 'paused'
  );

  return (
    <div className="tetris-layout">
      <HoldPiecePanel piece={state.holdPiece} disabled={state.holdUsed} />

      <div className="center-col">
        <GameBoard board={state.board} activePiece={state.activePiece} />
        <GameOverlay
          phase={state.phase}
          score={state.score}
          onStart={actions.startGame}
          onResume={actions.resumeGame}
          onReset={actions.resetGame}
        />
      </div>

      <div className="right-col">
        <NextPiecesPanel pieces={state.nextPieces} />
        <ScorePanel score={state.score} level={state.level} lines={state.lines} />
      </div>
    </div>
  );
}
