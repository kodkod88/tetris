import type { TetrominoType } from '../game/types';
import { MiniPieceCanvas, MINI_CANVAS_SIZE } from './MiniPieceCanvas';

export default function HoldPiecePanel({
  piece,
  disabled,
}: {
  piece: TetrominoType | null;
  disabled: boolean;
}) {
  return (
    <div className="panel">
      <div className="panel-title">Hold</div>
      {piece ? (
        <MiniPieceCanvas type={piece} alpha={disabled ? 0.35 : 1} />
      ) : (
        <div
          style={{
            width: MINI_CANVAS_SIZE,
            height: MINI_CANVAS_SIZE,
            background: '#1a1a2e',
          }}
        />
      )}
    </div>
  );
}
