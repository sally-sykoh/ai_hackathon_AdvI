import { useState, useRef } from "react";
import { questionSets } from "../data/mockData";
import "./SuggestedQuestions.css";

export default function SuggestedQuestions() {
  const [setIndex, setSetIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const cardsRef = useRef([]);

  const currentSet = questionSets[setIndex];

  function shuffle() {
    if (animating) return;
    setAnimating(true);

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
    <section className="suggested-section">
      <div className="suggested-header">
        <div className="section-label" style={{ marginBottom: 0 }}>
          Suggested Questions for Students
        </div>
        <button className="shuffle-btn" onClick={shuffle}>
          <span className="shuffle-icon">&#x21bb;</span> Shuffle
        </button>
      </div>
      <div className="suggested-grid">
        {currentSet.map((item, i) => (
          <div
            className="question-card"
            key={`${setIndex}-${i}`}
            ref={(el) => (cardsRef.current[i] = el)}
            style={{ transition: "all .25s ease" }}
          >
            <div className="question-number">Question {i + 1}</div>
            <div className="question-text">{item.q}</div>
            <span className="question-tag">{item.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
