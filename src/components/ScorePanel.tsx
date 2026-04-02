export default function ScorePanel({
  score,
  level,
  lines,
}: {
  score: number;
  level: number;
  lines: number;
}) {
  return (
    <div className="panel">
      <div className="score-row">
        <div className="panel-title">Score</div>
        <div className="score-value">{score.toLocaleString()}</div>
      </div>
      <div className="score-row" style={{ marginTop: 12 }}>
        <div className="panel-title">Level</div>
        <div className="score-value">{level}</div>
      </div>
      <div className="score-row" style={{ marginTop: 12 }}>
        <div className="panel-title">Lines</div>
        <div className="score-value">{lines}</div>
      </div>
    </div>
  );
}
