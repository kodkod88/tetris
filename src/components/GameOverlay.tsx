import type { GameState } from '../game/types';

interface Props {
  phase: GameState['phase'];
  score: number;
  onStart: () => void;
  onResume: () => void;
  onReset: () => void;
}

export default function GameOverlay({ phase, score, onStart, onResume, onReset }: Props) {
  if (phase === 'playing') return null;

  return (
    <div className="overlay">
      {phase === 'idle' && (
        <>
          <div className="overlay-title">TETRIS</div>
          <button onClick={onStart}>START GAME</button>
          <div className="overlay-hint">
            ← → Move &nbsp;|&nbsp; ↑ / X Rotate CW &nbsp;|&nbsp; Z Rotate CCW
            <br />
            ↓ Soft drop &nbsp;|&nbsp; Space Hard drop &nbsp;|&nbsp; C / Shift Hold
            <br />
            P / Esc Pause
          </div>
        </>
      )}
      {phase === 'paused' && (
        <>
          <div className="overlay-title">PAUSED</div>
          <button onClick={onResume}>RESUME</button>
          <button className="btn-secondary" onClick={onReset}>NEW GAME</button>
        </>
      )}
      {phase === 'gameover' && (
        <>
          <div className="overlay-title">GAME OVER</div>
          <div className="overlay-score">Score: {score.toLocaleString()}</div>
          <button onClick={onReset}>PLAY AGAIN</button>
        </>
      )}
    </div>
  );
}
