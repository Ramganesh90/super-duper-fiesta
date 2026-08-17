"use client";

import { getLevel, getMastery } from "@/lib/ai/progress";
import { useAiProgress } from "./useAiProgress";
import { getAllTopics } from "@/lib/ai/topics";

// Compact live progress line for the AI app card on the Study Companion hub.
export default function AiHubSnapshot() {
  const state = useAiProgress();
  const mastery = getMastery(state);
  const level = getLevel(state.xp);
  const total = getAllTopics().length;
  const mastered = state.completedTopics.length;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div
        className="h-2.5 overflow-hidden rounded-full border-2 border-ink bg-paper-dim"
        role="progressbar"
        aria-valuenow={mastery}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`AI mastery: ${mastery}%`}
      >
        <div className="h-full bg-ai-violet transition-all" style={{ width: `${Math.max(mastery, 2)}%` }} />
      </div>
      <p className="text-xs font-semibold text-ink/80 sm:text-sm">
        {mastery}% mastery · {mastered}/{total} topics · Lvl {level.level} {level.title}
        {state.streak.current > 0 ? ` · 🔥 ${state.streak.current}d` : ""}
      </p>
    </div>
  );
}
