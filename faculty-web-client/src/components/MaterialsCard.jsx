import { useState } from "react";
import { materials } from "../data/mockData";

const typeStyles = {
  pdf: { bg: "bg-red-50", text: "text-red-600" },
  ppt: { bg: "bg-maize-50", text: "text-maize-700" },
  pptx: { bg: "bg-maize-50", text: "text-maize-700" },
  doc: { bg: "bg-umblue-50", text: "text-umblue-600" },
  docx: { bg: "bg-umblue-50", text: "text-umblue-600" },
};

const typeLabel = { pdf: "PDF", ppt: "PPT", pptx: "PPT", doc: "DOC", docx: "DOC" };

function extOf(name) {
  return name.split(".").pop().toLowerCase();
}

export default function MaterialsCard() {
  const [expanded, setExpanded] = useState(true);

  // Group materials by course and limit to first 6 files
  const limitedMaterials = materials.slice(0, 6);
  const groupedByCourse = limitedMaterials.reduce((acc, m) => {
    const course = m.course || "EECS 183";
    if (!acc[course]) acc[course] = [];
    acc[course].push(m);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-umblue-100 shadow-sm overflow-hidden h-full flex flex-col" style={{ minHeight: "500px" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-umblue-50/50 transition-colors flex-shrink-0"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-umblue-50 border border-umblue-100 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-umblue-400">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-umblue-400">
                Course Materials
              </div>
              <span className="text-[10px] font-semibold text-umblue-300 bg-umblue-50 px-2 py-0.5 rounded-full">
                Loaded from Canvas
              </span>
            </div>
            <div className="text-sm font-bold text-umblue-700 mt-0.5">
              {limitedMaterials.length} files from Canvas
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className={`text-umblue-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Expandable body */}
      <div
        className={`overflow-y-auto transition-all duration-200 flex-1 ${expanded ? "" : "hidden"}`}
      >
        <div className="px-5 pb-5 border-t border-umblue-50 pt-3 space-y-3">
          {Object.entries(groupedByCourse).map(([course, courseMaterials]) => (
            <div key={course}>
              <div className="text-xs font-bold text-umblue-600 mb-2 px-1">{course}</div>
              <div className="space-y-1.5">
                {courseMaterials.map((m, i) => {
                  const ext = extOf(m.name);
                  const style = typeStyles[ext] ?? typeStyles.doc;
                  return (
                    <div key={i} className="flex items-center gap-3 hover:bg-umblue-50/50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${style.bg} ${style.text}`}>
                        {(typeLabel[ext] ?? "FILE").toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-umblue-700 truncate">{m.name}</div>
                        <div className="text-xs text-umblue-400">Loaded {m.date} &middot; {m.size}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
