import type { TetrominoType } from '../game/types';
import { MiniPieceCanvas } from './MiniPieceCanvas';

export default function NextPiecesPanel({ pieces }: { pieces: TetrominoType[] }) {
  return (
    <div className="panel">
      <div className="panel-title">Next</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pieces.slice(0, 3).map((type, i) => (
          <MiniPieceCanvas key={i} type={type} />
        ))}
      </div>
    </div>
  );
}
