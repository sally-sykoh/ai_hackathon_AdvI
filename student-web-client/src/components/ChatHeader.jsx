import "./ChatHeader.css";

export default function ChatHeader({ mode }) {
  const isPreset = mode === "preset";

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <div className="ai-avatar-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
            <path d="M18 14a6 6 0 00-12 0v4h12v-4z" />
            <circle cx="9" cy="10" r="1" fill="#fff" />
            <circle cx="15" cy="10" r="1" fill="#fff" />
          </svg>
          <div className="ai-online" />
        </div>
        <div>
          <div className="chat-title">EduAI Study Agent</div>
          <div className="chat-subtitle">Lecture 10 – Fine-Tuning LLMs</div>
        </div>
      </div>
      <div className={`chat-mode-indicator ${isPreset ? "preset" : "freeform"}`}>
        <div className="mode-dot" />
        <span>{isPreset ? "Preset Questions" : "Free-form"}</span>
      </div>
    </div>
  );
}
