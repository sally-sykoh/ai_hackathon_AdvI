import { useState, useCallback } from "react";
import { student, initialMessages, aiResponses } from "./data/mockData";
import WireframeBanner from "./components/WireframeBanner";
import LeftPanel from "./components/LeftPanel";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import RightPanel from "./components/RightPanel";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [typing, setTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);

  const completedCount = 2;

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  const handleSend = useCallback(
    (text) => {
      const studentMsg = {
        role: "student",
        text,
        time: getTime(),
      };
      setMessages((prev) => [...prev, studentMsg]);
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
        const aiText = aiResponses[responseIdx % aiResponses.length];
        const aiMsg = {
          role: "ai",
          presetLabel: null,
          text: aiText,
          time: getTime(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setResponseIdx((prev) => prev + 1);
      }, 1500);
    },
    [responseIdx]
  );

  const studentMsgCount = messages.filter((m) => m.role === "student").length;

  return (
    <>
      <WireframeBanner />
      <div className="app-shell">
        <LeftPanel completedCount={completedCount} />
        <div className="chat-area">
          <ChatHeader mode="preset" />
          <ChatMessages
            messages={messages}
            typing={typing}
            studentInitials={student.initials}
          />
          <ChatInput onSend={handleSend} />
        </div>
        <RightPanel messageCount={studentMsgCount} completedCount={completedCount} />
      </div>
    </>
  );
}
