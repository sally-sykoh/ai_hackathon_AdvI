import { useState } from "react";
import { student, presetQuestions, lectureTopics } from "../data/mockData";
import "./LeftPanel.css";

export default function LeftPanel({ completedCount }) {
  const [selectedTopics, setSelectedTopics] = useState(new Set([10]));
  const total = presetQuestions.length;
  const pct = Math.round((completedCount / total) * 100);

  function toggleTopic(id) {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <aside className="left-panel">
      <div className="left-header">
        <div className="brand">
          <div className="brand-icon">E</div>
          <div className="brand-text">
            Edu<span>AI</span>
          </div>
        </div>
        <div className="student-info">
          <div className="student-avatar">{student.initials}</div>
          <div>
            <div className="student-name">{student.name}</div>
            <div className="student-course">{student.course}</div>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-label">Preset Questions Progress</div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-text">
          <span>{completedCount} of {total} completed</span>
          <span>{pct}%</span>
        </div>
      </div>

      <div className="preset-list">
        {presetQuestions.map((q, i) => {
          const isCompleted = i < completedCount;
          const isActive = i === completedCount;
          const cls = isCompleted ? "completed" : isActive ? "active" : "";

          return (
            <div className={`preset-item ${cls}`} key={q.id}>
              <div className="preset-check">
                {isCompleted ? "\u2713" : q.id}
              </div>
              <div className="preset-item-text">{q.text}</div>
            </div>
          );
        })}
      </div>

      <div className="topics-section">
        <div className="topics-label">Explore Lectures (Free-form)</div>
        {lectureTopics.map((t) => (
          <button
            key={t.id}
            className={`topic-chip ${selectedTopics.has(t.id) ? "selected" : ""}`}
            onClick={() => toggleTopic(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
