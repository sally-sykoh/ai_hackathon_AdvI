import { keyConcepts, confidenceBars } from "../data/mockData";
import "./RightPanel.css";

const statusColor = {
  strong: "var(--success)",
  partial: "var(--warning)",
  weak: "var(--danger)",
};

export default function RightPanel({ messageCount, completedCount }) {
  return (
    <aside className="right-panel">
      <div className="right-section">
        <div className="right-label">Current Lecture</div>
        <div className="lecture-context-card">
          <div className="lecture-context-title">Lecture 10 – Fine-Tuning LLMs</div>
          <div className="lecture-context-desc">
            Covers LoRA, full fine-tuning, catastrophic forgetting, hyperparameter
            selection, and data preparation for instruction-tuning.
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="right-label">Key Concepts</div>
        {keyConcepts.map((c, i) => (
          <div className="key-concept" key={i}>
            <div className="key-concept-dot" style={{ background: statusColor[c.status] }} />
            {c.label}
          </div>
        ))}
      </div>

      <div className="right-section">
        <div className="right-label">Your Confidence</div>
        <div className="confidence-meter">
          {confidenceBars.map((b, i) => (
            <div className="confidence-row" key={i}>
              <div className="confidence-label">{b.label}</div>
              <div className="confidence-bar-bg">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${b.pct}%`, background: b.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="right-section">
        <div className="right-label">This Session</div>
        <div className="session-stats">
          <div className="session-stat">
            <div className="session-stat-value">{messageCount}</div>
            <div className="session-stat-label">Messages</div>
          </div>
          <div className="session-stat">
            <div className="session-stat-value">8m</div>
            <div className="session-stat-label">Duration</div>
          </div>
          <div className="session-stat">
            <div className="session-stat-value">{completedCount}/5</div>
            <div className="session-stat-label">Qs Done</div>
          </div>
          <div className="session-stat">
            <div className="session-stat-value">B+</div>
            <div className="session-stat-label">Est. Grade</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
