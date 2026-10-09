"use client";

import Link from "next/link";
import LevelBadge from "./LevelBadge";
import ReadinessMeter from "./ReadinessMeter";
import StreakTracker from "./StreakTracker";
import DomainBadges from "./DomainBadges";
import WeekGrid, { type SegmentSummary } from "./WeekGrid";
import ResetProgress from "./ResetProgress";
import { useAwsProgress } from "./useAwsProgress";

// Client shell for the /aws home: live stats (level, readiness, streak),
// domain badges, and the week grid. All read from lib/aws/progress.
export default function AwsDashboard({ segments }: { segments: SegmentSummary[] }) {
  const { missedQuestions } = useAwsProgress();
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LevelBadge />
        <ReadinessMeter />
        <StreakTracker />
      </div>

      <Link
        href="/aws/builder"
        className="comic-border bg-halftone-yellow flex flex-col items-start gap-1 bg-aws-orange/15 p-5 transition-transform hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-comic text-xl tracking-wide text-aws-orange-dark sm:text-2xl">
            🏗️ Build your own VPC
          </p>
          <p className="text-sm text-ink/80 sm:text-base">
            Assemble a real architecture and get live Well-Architected feedback on every miss.
          </p>
        </div>
        <span className="comic-border-sm font-comic bg-aws-orange px-4 py-2 text-sm tracking-wide text-ink-fixed">
          Open the sandbox →
        </span>
      </Link>

      <Link
        href="/aws/exam"
        className="comic-border bg-halftone flex flex-col items-start gap-1 bg-hero-blue/10 p-5 transition-transform hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-comic text-xl tracking-wide text-hero-blue sm:text-2xl">
            📝 Take a mock exam
          </p>
          <p className="text-sm text-ink/80 sm:text-base">
            Timed, mixed-domain practice with a score and a weak-area breakdown.
          </p>
        </div>
        <span className="comic-border-sm font-comic bg-hero-blue px-4 py-2 text-sm tracking-wide text-paper-fixed">
          Start exam →
        </span>
      </Link>

      {missedQuestions.length > 0 && (
        <Link
          href="/aws/review"
          className="comic-border-sm flex items-center justify-between gap-3 bg-action-red/10 px-4 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
        >
          <span>🔁 Review your {missedQuestions.length} missed question{missedQuestions.length === 1 ? "" : "s"}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

      <DomainBadges />

      <WeekGrid segments={segments} />

      <div className="flex justify-end border-t-2 border-dashed border-ink/20 pt-4">
        <ResetProgress />
      </div>
    </div>
  );
}
