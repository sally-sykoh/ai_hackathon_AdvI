import { useState, useRef } from "react";
import { questionSets } from "../data/mockData";
import { submitPresetQuestions } from "../services/api";

export default function SuggestedQuestions({ lectureId = "lec4" }) {
  const [setIndex, setSetIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [customQuestion, setCustomQuestion] = useState({ q: "", tag: "" });
  const cardsRef = useRef([]);

  const currentSet = [...questionSets[setIndex], ...customQuestions];

  function toggleQuestion(index) {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  }

  function handleAddCustom() {
    if (!customQuestion.q.trim()) return;
    const newQuestion = {
      q: customQuestion.q.trim(),
      tag: customQuestion.tag.trim() || "Custom",
    };
    setCustomQuestions((prev) => [...prev, newQuestion]);
    setCustomQuestion({ q: "", tag: "" });
    setShowCustomModal(false);
    // Auto-select the newly added question
    const newIndex = questionSets[setIndex].length + customQuestions.length;
    setSelected((prev) => new Set([...prev, newIndex]));
  }

  async function handleSubmit() {
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      const questionsToSubmit = currentSet.filter((_, i) => selected.has(i));
      await submitPresetQuestions(lectureId, questionsToSubmit);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelected(new Set());
        setCustomQuestions([]); // Clear custom questions after submission
      }, 3000);
    } catch (err) {
      console.error("Failed to submit questions:", err);
      alert("Failed to submit questions. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function shuffle() {
    if (animating) return;
    setAnimating(true);
    setSelected(new Set()); // Clear selection when shuffling
    cardsRef.current.forEach((card) => {
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(8px)";
      }
    });
    setTimeout(() => {
      setSetIndex((prev) => (prev + 1) % questionSets.length);
      setTimeout(() => {
        cardsRef.current.forEach((card, i) => {
          if (card) {
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, i * 80);
          }
        });
        setAnimating(false);
      }, 30);
    }, 200);
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-umblue-100 shadow-sm p-5 h-full flex flex-col" style={{ minHeight: "500px" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-umblue-400">
              Suggested Questions
            </div>
            <div className="text-sm font-bold text-umblue-700 mt-0.5">
              Share with students to reinforce today&apos;s concepts
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <button
                onClick={handleSubmit}
                disabled={submitting || submitted}
                className="flex items-center gap-1.5 text-xs font-semibold bg-maize-500 hover:bg-maize-400 disabled:bg-maize-300 text-umblue-700 px-3 py-1.5 rounded-full transition-colors"
              >
                {submitted ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Submitted!
                  </>
                ) : submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    Submit {selected.size}
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => setShowCustomModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-umblue-700 bg-maize-50 hover:bg-maize-100 px-3 py-1.5 rounded-full transition-colors border border-maize-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Custom
            </button>
            <button
              onClick={shuffle}
              className="flex items-center gap-1.5 text-xs font-semibold text-umblue-700 bg-umblue-50 hover:bg-umblue-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
              </svg>
              Shuffle
            </button>
          </div>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {currentSet.map((item, i) => {
            const isSelected = selected.has(i);
            const isCustom = i >= questionSets[setIndex].length;
            return (
              <div
                key={`${setIndex}-${i}-${isCustom ? 'custom' : ''}`}
                ref={(el) => (cardsRef.current[i] = el)}
                style={{ transition: "all .25s ease" }}
                className={`border rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer ${
                  isSelected
                    ? "border-maize-400 bg-maize-50 shadow-sm"
                    : "border-umblue-100 hover:border-umblue-200"
                } ${isCustom ? "ring-1 ring-maize-200" : ""}`}
                onClick={() => toggleQuestion(i)}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? "bg-maize-500 border-maize-500"
                        : "border-umblue-200 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-umblue-700">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {/* Number badge */}
                  <div className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? "bg-maize-500 text-umblue-700" : isCustom ? "bg-maize-100 text-maize-700" : "bg-umblue-100 text-umblue-600"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-umblue-700 font-medium leading-relaxed">{item.q}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        isCustom ? "bg-maize-50 text-maize-700" : "bg-umblue-50 text-umblue-400"
                      }`}>
                        {item.tag}
                      </span>
                      {isCustom && (
                        <span className="text-[10px] text-umblue-300 font-medium">Custom</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Question Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCustomModal(false)}>
          <div className="bg-white rounded-2xl border border-umblue-100 shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-umblue-700">Create Custom Question</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-full hover:bg-umblue-50 flex items-center justify-center text-umblue-400 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-umblue-400 uppercase tracking-wider mb-2">
                  Question
                </label>
                <textarea
                  value={customQuestion.q}
                  onChange={(e) => setCustomQuestion((prev) => ({ ...prev, q: e.target.value }))}
                  placeholder="Enter your question here..."
                  className="w-full px-4 py-3 border border-umblue-100 rounded-xl text-sm text-umblue-700 placeholder:text-umblue-300 focus:outline-none focus:border-maize-400 focus:ring-2 focus:ring-maize-100 resize-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-umblue-400 uppercase tracking-wider mb-2">
                  Concept / Tag (optional)
                </label>
                <input
                  type="text"
                  value={customQuestion.tag}
                  onChange={(e) => setCustomQuestion((prev) => ({ ...prev, tag: e.target.value }))}
                  placeholder="e.g., Functions & Parameters"
                  className="w-full px-4 py-2.5 border border-umblue-100 rounded-xl text-sm text-umblue-700 placeholder:text-umblue-300 focus:outline-none focus:border-maize-400 focus:ring-2 focus:ring-maize-100"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddCustom}
                  disabled={!customQuestion.q.trim()}
                  className="flex-1 bg-maize-500 hover:bg-maize-400 disabled:bg-maize-300 disabled:cursor-not-allowed text-umblue-700 font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Question
                </button>
                <button
                  onClick={() => {
                    setShowCustomModal(false);
                    setCustomQuestion({ q: "", tag: "" });
                  }}
                  className="px-4 py-2.5 border border-umblue-100 hover:bg-umblue-50 text-umblue-600 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
