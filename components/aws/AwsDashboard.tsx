"use client";

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

      <DomainBadges />

      <WeekGrid segments={segments} />

      <div className="flex justify-end border-t-2 border-dashed border-ink/20 pt-4">
        <ResetProgress />
      </div>
    </div>
  );
}
