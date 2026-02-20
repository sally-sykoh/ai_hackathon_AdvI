import { useState, useEffect, useRef } from "react";
import { student } from "../data/mockData";

function TutorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function StudentAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-maize-500 to-maize-400 flex items-center justify-center text-umblue-700 text-[10px] font-bold flex-shrink-0">
      {student.initials}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-3.5 py-2.5 bg-white border border-umblue-100 rounded-2xl rounded-tl-sm self-start ml-9 shadow-sm">
      <div className="typing-dot w-1.5 h-1.5 bg-umblue-300 rounded-full" />
      <div className="typing-dot w-1.5 h-1.5 bg-umblue-300 rounded-full" />
      <div className="typing-dot w-1.5 h-1.5 bg-umblue-300 rounded-full" />
    </div>
  );
}

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

export default function ChatCard({ messages, onSend, loading = false, disabled = false }) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || loading || disabled) return;
    onSend(trimmed);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-umblue-100 shadow-sm flex flex-col overflow-hidden h-full">
      {/* Tutor identity header */}
      <div className="flex flex-col items-center pt-5 pb-3 border-b border-umblue-100 bg-gradient-to-b from-umblue-50/60 to-white">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-umblue-600 to-umblue-400 flex items-center justify-center text-white shadow-md ring-2 ring-white mb-2">
          <TutorIcon />
        </div>
        <div className="text-sm font-semibold text-umblue-700">Ada</div>
        <div className="text-[11px] text-umblue-400">Your AI Course Tutor</div>
        <div className="text-[10px] text-umblue-300 mt-0.5">
          {disabled ? "Connecting..." : "Lecture 10 – Fine-Tuning LLMs"}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 chat-scroll bg-umblue-50/20 min-h-0">
        {messages.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full text-umblue-300 text-xs">
            {disabled ? "Connecting to Ada..." : "Starting session..."}
          </div>
        )}

        {messages.map((msg, i) => {
          const isAi = msg.role === "ai";
          return (
            <div
              key={i}
              className={`flex gap-2 animate-msg-in ${isAi ? "" : "flex-row-reverse"}`}
              style={{ maxWidth: "85%", marginLeft: isAi ? undefined : "auto" }}
            >
              {isAi ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-umblue-600 to-umblue-400 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <TutorIcon />
                </div>
              ) : (
                <StudentAvatar />
              )}
              <div>
                {isAi && (
                  <span className="text-[10px] font-medium text-umblue-400 ml-0.5 mb-0.5 block">Ada</span>
                )}
                <div
                  className={`px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl ${
                    isAi
                      ? "bg-white border border-umblue-100 text-umblue-700 rounded-tl-sm shadow-sm"
                      : "bg-umblue-700 text-white rounded-tr-sm"
                  }`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />
                <div className={`text-[9px] text-umblue-300 mt-0.5 ${isAi ? "ml-0.5" : "text-right mr-0.5"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-umblue-100 bg-white">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-umblue-50/60 border border-umblue-100 rounded-full px-4 py-2 text-sm text-umblue-700 placeholder:text-umblue-300 outline-none transition focus:border-maize-400 focus:ring-2 focus:ring-maize-100"
            placeholder={disabled ? "Connecting..." : "Ask anything"}
            value={text}
            disabled={disabled || loading}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || loading || disabled}
            className="w-9 h-9 rounded-full bg-maize-500 hover:bg-maize-400 disabled:bg-umblue-200 flex items-center justify-center transition shadow-sm flex-shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00274C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
