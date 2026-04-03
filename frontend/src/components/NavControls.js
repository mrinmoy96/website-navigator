import React, { useState } from "react";
import "./NavControls.css";

export default function NavControls({ index, total, onPrev, onNext, onJump }) {
  const [inputMode, setInputMode] = useState(false);
  const [inputVal,  setInputVal]  = useState("");

  const progressPct = total > 1 ? (index / (total - 1)) * 100 : 100;

  const handleCounterClick = () => {
    setInputVal(String(index + 1));
    setInputMode(true);
  };

  const commitJump = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n >= 1 && n <= total) {
      onJump(n - 1);
    }
    setInputMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")  commitJump();
    if (e.key === "Escape") setInputMode(false);
  };

  return (
    <div className="nav-controls" role="navigation" aria-label="Site navigation">
      {/* Progress bar */}
      <div className="nav-progress" role="progressbar"
        aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="nav-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="nav-row">
        {/* Prev button */}
        <button
          className="nav-btn nav-btn--prev"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Previous website"
          title="Previous  (←)"
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 4L7 10L13 16" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Prev</span>
        </button>

        {/* Counter / Jump input */}
        <div className="nav-counter">
          {inputMode ? (
            <input
              className="nav-jump-input"
              type="number"
              min={1}
              max={total}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={commitJump}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-label={`Jump to site number (1–${total})`}
            />
          ) : (
            <button
              className="nav-counter-btn"
              onClick={handleCounterClick}
              title="Click to jump to a specific site"
              aria-label={`Site ${index + 1} of ${total}. Click to jump.`}
            >
              <span className="counter-cur">{index + 1}</span>
              <span className="counter-sep">/</span>
              <span className="counter-tot">{total}</span>
            </button>
          )}
          <span className="counter-hint">
            {inputMode ? "↩ to jump · Esc cancel" : "click to jump"}
          </span>
        </div>

        {/* Next button */}
        <button
          className="nav-btn nav-btn--next"
          onClick={onNext}
          disabled={index === total - 1}
          aria-label="Next website"
          title="Next  (→)"
        >
          <span>Next</span>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 4L13 10L7 16" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
