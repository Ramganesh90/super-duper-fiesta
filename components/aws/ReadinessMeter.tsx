"use client";

import { getReadiness } from "@/lib/aws/progress";
import { useAwsProgress } from "./useAwsProgress";

function readinessLabel(pct: number): string {
  if (pct >= 85) return "Exam-ready 🎯";
  if (pct >= 60) return "Getting close 💪";
  if (pct >= 30) return "Building momentum 🚀";
  if (pct > 0) return "Just getting started 🌱";
  return "Not started yet";
}

// Weighted exam-readiness dial (0–100) based on mastered segments + quiz scores.
export default function ReadinessMeter() {
  const state = useAwsProgress();
  const pct = getReadiness(state);

  return (
    <div className="comic-border-sm flex flex-col gap-2 bg-paper px-5 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-comic text-lg tracking-wide">EXAM READINESS</p>
        <p className="font-comic text-2xl tracking-wide text-hero-blue">{pct}%</p>
      </div>
      <div
        className="h-4 overflow-hidden rounded-full border-2 border-ink bg-paper-dim"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Exam readiness: ${pct}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-action-red via-comic-yellow to-emerald-500 transition-all"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <p className="text-xs text-ink/70 sm:text-sm">
        {readinessLabel(pct)} · weighted by SAA-C03 domain percentages
      </p>
    </div>
  );
}
