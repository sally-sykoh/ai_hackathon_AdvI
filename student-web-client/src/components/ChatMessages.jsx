import { useEffect, useRef } from "react";
import "./ChatMessages.css";

function AiAvatar() {
  return (
    <div className="msg-avatar ai-bubble-avatar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
        <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
        <path d="M18 14a6 6 0 00-12 0v4h12v-4z" />
      </svg>
    </div>
  );
}

function StudentAvatar({ initials }) {
  return <div className="msg-avatar student-bubble-avatar">{initials}</div>;
}

export default function ChatMessages({ messages, typing, studentInitials }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => (
        <div className={`msg ${msg.role}`} key={i}>
          {msg.role === "ai" ? <AiAvatar /> : <StudentAvatar initials={studentInitials} />}
          <div>
            {msg.presetLabel && (
              <div className="preset-question-badge">
                <div className="pq-dot" />
                {msg.presetLabel}
              </div>
            )}
            <div
              className="msg-bubble"
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            <div className="msg-time">{msg.time}</div>
          </div>
        </div>
      ))}

      {typing && (
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
