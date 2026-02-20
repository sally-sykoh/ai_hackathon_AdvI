import { useState, useRef } from "react";
import "./ChatInput.css";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  return (
    <div className="chat-input-area">
      <div className="chat-input-row">
        <div className="chat-input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-input"
            rows="1"
            placeholder="Type your answer..."
            value={text}
            onChange={(e) => { setText(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="send-btn" onClick={submit} disabled={!text.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
        </button>
      </div>
      <div className="input-hint">
        Press Enter to send &bull; Shift+Enter for new line &bull; Your conversation is saved automatically
      </div>
    </div>
  );
}
