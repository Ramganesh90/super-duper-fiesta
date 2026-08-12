"use client";

import { useSyncExternalStore } from "react";
import { loadProgress, subscribeToProgress } from "@/lib/progress";

// Compact live progress line for the Pattern-Verse card on the Study Companion hub.
export default function PatternHubSnapshot({ total }: { total: number }) {
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

  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div
        className="h-2.5 overflow-hidden rounded-full border-2 border-ink bg-paper-dim"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Patterns mastered: ${pct}%`}
      >
        <div className="h-full bg-hero-blue transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
      <p className="text-xs font-semibold text-ink/80 sm:text-sm">
        {mastered}/{total} patterns mastered · 🏆 {xp} XP
      </p>
    </div>
  );
}
