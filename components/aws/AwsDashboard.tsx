"use client";

import Link from "next/link";
import LevelBadge from "./LevelBadge";
import ReadinessMeter from "./ReadinessMeter";
import StreakTracker from "./StreakTracker";
import DomainBadges from "./DomainBadges";
import WeekGrid, { type SegmentSummary } from "./WeekGrid";
import ResetProgress from "./ResetProgress";

// Client shell for the /aws home: live stats (level, readiness, streak),
// domain badges, and the 8-week grid. All read from lib/aws/progress.
export default function AwsDashboard({ segments }: { segments: SegmentSummary[] }) {
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
        <span className="comic-border-sm font-comic bg-aws-orange px-4 py-2 text-sm tracking-wide text-ink">
          Open the sandbox →
        </span>
      </Link>

      <DomainBadges />

      <WeekGrid segments={segments} />

      <div className="flex justify-end border-t-2 border-dashed border-ink/20 pt-4">
        <ResetProgress />
      </div>
    </div>
  );
}
