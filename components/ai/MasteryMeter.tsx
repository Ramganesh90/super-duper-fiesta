"use client";

import { getMastery } from "@/lib/ai/progress";
import { useAiProgress } from "./useAiProgress";

function masteryLabel(pct: number): string {
  if (pct >= 85) return "AI whisperer 🧙";
  if (pct >= 60) return "Shipping real things 🚀";
  if (pct >= 30) return "Neurons firing 🧠";
  if (pct > 0) return "Booting up 🌱";
  return "Not started yet";
}

// Overall AI-mastery dial (0–100), weighted by track importance.
export default function MasteryMeter() {
  const state = useAiProgress();
  const pct = getMastery(state);

  return (
    <div className="comic-border-sm flex flex-col gap-2 bg-paper px-5 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-comic text-lg tracking-wide">AI MASTERY</p>
        <p className="font-comic text-2xl tracking-wide text-hero-blue">{pct}%</p>
      </div>
      <div
        className="h-4 overflow-hidden rounded-full border-2 border-ink bg-paper-dim"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`AI mastery: ${pct}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-hero-blue via-ai-violet to-action-red transition-all"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <p className="text-xs text-ink/70 sm:text-sm">
        {masteryLabel(pct)} · weighted across the six AI tracks
      </p>
    </div>
  );
}
