import { dashboardStats, conceptMastery, questionResponses } from "../data/mockData";
import "./Dashboard.css";

function TrendIcon({ up }) {
  if (up) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <section className="dashboard-section">
      <div className="section-label">Dashboard &mdash; Lecture 10 Overview</div>

      <div className="dashboard-cards">
        {dashboardStats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={s.valueColor ? { color: s.valueColor } : undefined}>
              {s.value}
            </div>
            <div className={`stat-change ${s.up ? "up" : "down"}`}>
              <TrendIcon up={s.up} />
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Concept Mastery */}
        <div className="dash-card">
          <div className="dash-card-header">
            Concept Mastery Overview
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>Lecture 10</span>
          </div>
          <div className="dash-card-body">
            {conceptMastery.map((c, i) => (
              <div className="concept-row" key={i}>
                <div className="concept-label">{c.label}</div>
                <div className="concept-bar-bg">
                  <div
                    className="concept-bar-fill"
                    style={{ width: `${c.pct}%`, background: c.color }}
                  />
                </div>
                <div className="concept-pct" style={{ color: c.color }}>
                  {c.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Responses */}
        <div className="dash-card">
          <div className="dash-card-header">
            Student Responses to Preset Questions
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>128 students</span>
          </div>
          <div className="dash-card-body">
            {questionResponses.map((r, i) => (
              <div className="response-row" key={i}>
                <div className="response-q">{r.label}</div>
                <div className="response-bars">
                  <div className="response-correct" style={{ width: `${r.correct}%` }} />
                  <div className="response-partial" style={{ width: `${r.partial}%` }} />
                  <div className="response-incorrect" style={{ width: `${r.incorrect}%` }} />
                </div>
              </div>
            ))}
            <div className="response-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: "var(--success)" }} />
                Strong Understanding
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: "var(--warning)" }} />
                Partial
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: "var(--danger-400)" }} />
                Struggling
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
