import { questionResponses } from "../data/mockData";

export default function StudentResponses() {
  return (
    <div className="bg-white rounded-2xl border border-umblue-100 shadow-sm p-5 h-full flex flex-col" style={{ minHeight: "500px" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-umblue-400">
          Student Responses
        </div>
        <span className="text-xs text-umblue-400 font-medium">142 students</span>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        {questionResponses.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-bold text-umblue-400 w-5 flex-shrink-0">{r.label}</span>
            <div className="flex-1 flex h-2 rounded-full overflow-hidden gap-px">
              <div className="bg-emerald-400 rounded-l-full" style={{ width: `${r.correct}%` }} />
              <div className="bg-amber-400" style={{ width: `${r.partial}%` }} />
              <div className="bg-red-400 rounded-r-full" style={{ width: `${r.incorrect}%` }} />
            </div>
            <span className="text-[10px] text-umblue-400 w-8 text-right flex-shrink-0">{r.correct}%</span>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-umblue-50">
        {[
          { color: "bg-emerald-400", label: "Strong" },
          { color: "bg-amber-400", label: "Partial" },
          { color: "bg-red-400", label: "Struggling" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] text-umblue-400 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
