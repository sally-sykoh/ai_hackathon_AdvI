import { criticalConcepts } from "../data/mockData";
import "./CriticalInfo.css";

const severityColor = {
  700: "var(--danger-700)",
  600: "var(--danger-600)",
  400: "var(--danger-400)",
  300: "var(--danger-300)",
};

const pctBg = {
  700: "#FEE2E2",
  600: "#FECACA",
  400: "#FCA5A5",
  300: "#FECACA",
};

const pctColor = {
  700: "#B91C1C",
  600: "#DC2626",
  400: "#B91C1C",
  300: "#DC2626",
};

export default function CriticalInfo({ onDiveDeep }) {
  return (
    <section className="critical-section">
      <div className="section-label">
        Critical Information &mdash; Concepts Students Are Struggling With
      </div>
      <div className="critical-grid">
        {criticalConcepts.map((c) => (
          <div className="critical-card" key={c.id}>
            <div
              className="critical-bar"
              style={{ background: severityColor[c.severity] }}
            />
            <div className="critical-content">
              <div className="critical-top">
                <div className="critical-concept">{c.concept}</div>
                <span
                  className="critical-pct"
                  style={{
                    background: pctBg[c.severity],
                    color: pctColor[c.severity],
                  }}
                >
                  {c.pct}% struggling
                </span>
              </div>
              <div className="critical-desc">{c.desc}</div>
              <button
                className="dive-deep-btn"
                onClick={() => onDiveDeep(c.id, c.concept, c.pct)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Dive Deep
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
