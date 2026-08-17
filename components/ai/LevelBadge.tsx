"use client";

import { getLevel } from "@/lib/ai/progress";
import { useAiProgress } from "./useAiProgress";

// Current level title, XP, and progress toward the next level.
export default function LevelBadge() {
  const { xp } = useAiProgress();
  const level = getLevel(xp);

  return (
    <div className="comic-border-sm flex flex-col gap-2 bg-paper px-5 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-comic text-lg tracking-wide">
          LVL {level.level} · {level.title.toUpperCase()}
        </p>
        <p className="font-comic text-xl tracking-wide text-ai-violet-dark">🏆 {xp} XP</p>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full border-2 border-ink bg-paper-dim"
        role="progressbar"
        aria-valuenow={level.progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress to next level: ${level.progressPct}%`}
      >
        <div className="h-full bg-ai-violet transition-all" style={{ width: `${level.progressPct}%` }} />
      </div>
      <p className="text-xs text-ink/70 sm:text-sm">
        {level.isMax
          ? "Max level reached — Singularity Sage. 🌌"
          : `${level.nextThreshold! - xp} XP to level ${level.level + 1}`}
      </p>
    </div>
  );
}
