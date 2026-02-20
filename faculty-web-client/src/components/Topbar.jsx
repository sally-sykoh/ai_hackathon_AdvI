import "./Topbar.css";

export default function Topbar({ lectureName, onOpenSidebar }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="lecture-btn" onClick={onOpenSidebar}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>{lectureName}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 14, height: 14 }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <h1 className="greeting">
          Hi, <span>Mr. Bob</span>
        </h1>
      </div>
      <div className="topbar-right">
        <div style={{ position: "relative" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="badge">3</span>
        </div>
        <div className="avatar">B</div>
      </div>
    </header>
  );
}
