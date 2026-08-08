"use client";

import { useSyncExternalStore } from "react";
import { loadProgress, subscribeToProgress } from "@/lib/progress";

interface ProgressIndicatorProps {
  totalPatterns: number;
}

export default function ProgressIndicator({ totalPatterns }: ProgressIndicatorProps) {
  const mastered = useSyncExternalStore(
    subscribeToProgress,
    () => loadProgress().completedPatterns.length,
    () => 0
  );
  const xp = useSyncExternalStore(
    subscribeToProgress,
    () => loadProgress().xp,
    () => 0
  );

  const pct = totalPatterns > 0 ? Math.round((mastered / totalPatterns) * 100) : 0;

  return (
    <div className="comic-border-sm flex flex-col gap-2 bg-paper px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-comic text-lg tracking-wide">
          {mastered} / {totalPatterns} PATTERNS MASTERED
        </p>
        <div
          className="mt-2 h-3 w-48 overflow-hidden rounded-full border-2 border-ink bg-paper-dim sm:w-64"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-hero-blue transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="font-comic text-xl tracking-wide text-comic-yellow-dark">🏆 {xp} XP</p>
    </div>
  );
}
