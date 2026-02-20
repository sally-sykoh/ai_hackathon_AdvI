import { lectures } from "../data/mockData";
import "./LectureSidebar.css";

export default function LectureSidebar({ open, onClose, currentLecture, onSelect }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "active" : ""}`}
        onClick={onClose}
      />
      <nav className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Lectures</h2>
          <button className="sidebar-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="sidebar-list">
          {lectures.map((lec) => (
            <div
              key={lec.id}
              className={`sidebar-item ${lec.id === currentLecture ? "active" : ""}`}
              onClick={() => onSelect(lec.id)}
            >
              <span className="dot" />
              Lecture {lec.id} &ndash; {lec.title}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
