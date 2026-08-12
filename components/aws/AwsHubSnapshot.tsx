"use client";

import { getLevel, getReadiness } from "@/lib/aws/progress";
import { useAwsProgress } from "./useAwsProgress";
import { getAllSegments } from "@/lib/aws/segments";

// Compact live progress line for the AWS app card on the Study Companion hub.
export default function AwsHubSnapshot() {
  const state = useAwsProgress();
  const readiness = getReadiness(state);
  const level = getLevel(state.xp);
  const total = getAllSegments().length;
  const mastered = state.completedSegments.length;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div
        className="h-2.5 overflow-hidden rounded-full border-2 border-ink bg-paper-dim"
        role="progressbar"
        aria-valuenow={readiness}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Exam readiness: ${readiness}%`}
      >
        <div className="h-full bg-aws-orange transition-all" style={{ width: `${Math.max(readiness, 2)}%` }} />
      </div>
      <p className="text-xs font-semibold text-ink/80 sm:text-sm">
        {readiness}% exam-ready · {mastered}/{total} weeks · Lvl {level.level} {level.title}
        {state.streak.current > 0 ? ` · 🔥 ${state.streak.current}d` : ""}
      </p>
    </div>
  );
}
