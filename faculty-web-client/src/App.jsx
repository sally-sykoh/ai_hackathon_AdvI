import { useState } from "react";
import { lectures } from "./data/mockData";
import WireframeBanner from "./components/WireframeBanner";
import LectureSidebar from "./components/LectureSidebar";
import Topbar from "./components/Topbar";
import MaterialsCard from "./components/MaterialsCard";
import CriticalInfo from "./components/CriticalInfo";
import SuggestedQuestions from "./components/SuggestedQuestions";
import Dashboard from "./components/Dashboard";
import DiveDeepModal from "./components/DiveDeepModal";
import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(10);

  const [modal, setModal] = useState({
    open: false,
    conceptId: null,
    conceptName: "",
    pct: 0,
  });

  const lectureName = `Lecture ${currentLecture}`;

  function handleSelectLecture(id) {
    setCurrentLecture(id);
    setSidebarOpen(false);
  }

  function handleDiveDeep(conceptId, conceptName, pct) {
    setModal({ open: true, conceptId, conceptName, pct });
  }

  function handleCloseModal() {
    setModal((prev) => ({ ...prev, open: false }));
  }

  return (
    <>
      <WireframeBanner />

      <LectureSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentLecture={currentLecture}
        onSelect={handleSelectLecture}
      />

      <Topbar
        lectureName={lectureName}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <main className="main-content">
        <MaterialsCard />
        <CriticalInfo onDiveDeep={handleDiveDeep} />
        <SuggestedQuestions />
        <Dashboard />
      </main>

      <DiveDeepModal
        open={modal.open}
        conceptId={modal.conceptId}
        conceptName={modal.conceptName}
        pct={modal.pct}
        onClose={handleCloseModal}
      />
    </>
  );
}
