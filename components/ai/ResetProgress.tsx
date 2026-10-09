"use client";

import { useState } from "react";
import { resetProgress } from "@/lib/ai/progress";

// Two-step "Reset progress" control for the AI Academy.
export default function ResetProgress() {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = () => {
    resetProgress();
    setConfirming(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  if (done) {
    return (
      <p role="status" className="text-sm font-semibold text-emerald-700">
        ✅ Progress reset.
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-semibold text-action-red underline-offset-2 hover:underline"
      >
        ↺ Reset progress
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold">Erase all XP, mastered topics, badges &amp; streak?</span>
      <button
        type="button"
        onClick={handleReset}
        className="comic-border-sm font-comic bg-action-red px-3 py-1 text-paper-fixed transition-transform hover:-translate-y-0.5"
      >
        Yes, reset
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="comic-border-sm font-comic bg-paper px-3 py-1 transition-transform hover:-translate-y-0.5"
      >
        Cancel
      </button>
    </div>
  );
}
