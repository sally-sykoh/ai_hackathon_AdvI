import { useState } from "react";
import { lectures } from "./data/mockData";
import LectureSidebar from "./components/LectureSidebar";
import Topbar from "./components/Topbar";
import CriticalInfo from "./components/CriticalInfo";
import SuggestedQuestions from "./components/SuggestedQuestions";
import GarminAnalytics from "./components/GarminAnalytics";
import Dashboard from "./components/Dashboard";
import MaterialsCard from "./components/MaterialsCard";
import DiveDeepModal from "./components/DiveDeepModal";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(4);
  const [modal, setModal] = useState({ open: false, conceptId: null, conceptName: "", pct: 0 });

  const lecture = lectures.find((l) => l.id === currentLecture);
  const lectureName = `Lecture ${currentLecture}`;
  const lectureTitle = lecture?.title ?? "";
  const lectureId = `lec${currentLecture}`;

  function handleSelectLecture(id) {
    setCurrentLecture(id);
    setSidebarOpen(false);
  }

  function handleDiveDeep(conceptId, conceptName, pct) {
    setModal({ open: true, conceptId, conceptName, pct });
  }

  return (
    <div className="min-h-screen bg-umblue-50">
      <div className="bg-umblue-700 py-1.5 px-8 flex items-center justify-end">
        <div className="flex items-center gap-5">
          <span className="text-umblue-300 text-[10px] tabular-nums">Feb 20, 2026</span>
          <div className="flex items-center gap-1.5 text-[10px] text-umblue-300">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      <LectureSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentLecture={currentLecture}
        onSelect={handleSelectLecture}
      />

      <Topbar />

      <div className="px-8 pt-6 pb-8">
        {/* Row 1: Stat cards */}
        <div className="mb-4">
          <Dashboard statsOnly />
        </div>

        {/* Row 2: 3-column top panel */}
        <div className="grid grid-cols-12 gap-4 mb-4">

          {/* Left: Critical Concepts — 4 rows stacked */}
          <div className="col-span-3">
            <CriticalInfo onDiveDeep={handleDiveDeep} />
          </div>

          {/* Center: Garmin-style analytics */}
          <div className="col-span-4">
            <GarminAnalytics />
          </div>

          {/* Right: Suggested Questions + Course Materials dropdown */}
          <div className="col-span-5 flex flex-col gap-3">
            {/* Course Materials — collapsed dropdown at the top */}
            <MaterialsCard />

            {/* Suggested Questions fills remaining space */}
            <div className="flex-1">
              <SuggestedQuestions lectureId={lectureId} />
            </div>
          </div>

        </div>
      </div>

      <DiveDeepModal
        open={modal.open}
        conceptId={modal.conceptId}
        conceptName={modal.conceptName}
        pct={modal.pct}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
