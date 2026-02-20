import { diveDeepData } from "../data/mockData";
import "./DiveDeepModal.css";

export default function DiveDeepModal({ open, conceptId, conceptName, pct, onClose }) {
  if (!open) return null;

  const insights = diveDeepData[conceptId] || [];

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Dive Deep: {conceptName}</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>
            <strong>{pct}% of students</strong> are struggling with this concept.
            Here&apos;s what our AI analysis found:
          </p>
          {insights.map((ins, i) => (
            <div className="modal-insight" key={i}>
              <strong>{ins.title}</strong>
              <p>{ins.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
