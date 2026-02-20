import { useState } from "react";
import { materials } from "../data/mockData";
import "./MaterialsCard.css";

const typeClass = { pdf: "pdf", ppt: "ppt", doc: "doc", docx: "doc" };
const typeLabel = { pdf: "PDF", ppt: "PPT", pptx: "PPT", doc: "DOC", docx: "DOC" };

function extOf(name) {
  return name.split(".").pop().toLowerCase();
}

export default function MaterialsCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section style={{ marginBottom: 28 }}>
      <div className="section-label">Course Materials</div>
      <div className="materials-card">
        <div className="materials-header" onClick={() => setExpanded((v) => !v)}>
          <div className="materials-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
            <h3>Lecture 10 Materials</h3>
            <span className="materials-count">{materials.length} files</span>
          </div>
          <div className="materials-actions">
            <button className="upload-btn" onClick={(e) => e.stopPropagation()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
            <div className={`expand-icon ${expanded ? "rotated" : ""}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
        <div className={`materials-body ${expanded ? "open" : ""}`}>
          <div className="materials-body-inner">
            {materials.map((m, i) => {
              const ext = extOf(m.name);
              return (
                <div className="material-item" key={i}>
                  <div className="left">
                    <div className={`material-icon ${typeClass[ext] || "doc"}`}>
                      {(typeLabel[ext] || "FILE").toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{m.name}</div>
                      <div className="material-meta">Uploaded {m.date} &bull; {m.size}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
