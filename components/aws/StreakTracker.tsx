"use client";

import { useState } from "react";
import { checkInToday } from "@/lib/aws/progress";
import { useAwsProgress } from "./useAwsProgress";

function localToday(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// Daily-streak counter with a manual "I studied today" check-in.
export default function StreakTracker() {
  const { streak } = useAwsProgress();
  const [justChecked, setJustChecked] = useState(false);

  const checkedInToday = streak.lastStudyDate === localToday();

  const handleCheckIn = () => {
    checkInToday();
    setJustChecked(true);
  };

  return (
    <div className="comic-border-sm flex flex-col gap-3 bg-paper px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-comic text-lg tracking-wide">🔥 STREAK</p>
          <p className="text-xs text-ink/70 sm:text-sm">
            Longest: {streak.longest} day{streak.longest === 1 ? "" : "s"}
          </p>
        </div>
        <p className="font-comic text-3xl tracking-wide text-action-red">
          {streak.current}
          <span className="ml-1 text-base">day{streak.current === 1 ? "" : "s"}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={handleCheckIn}
        disabled={checkedInToday}
        aria-live="polite"
        className="comic-border-sm font-comic bg-aws-orange px-4 py-2 text-sm tracking-wide text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 sm:text-base"
      >
        {checkedInToday
          ? justChecked
            ? "✅ Checked in — see you tomorrow!"
            : "✅ Studied today"
          : "I studied today"}
      </button>
    </div>
  );
}
