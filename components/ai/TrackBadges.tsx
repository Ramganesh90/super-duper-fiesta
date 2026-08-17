"use client";

import { isTrackEarned } from "@/lib/ai/progress";
import { getTopicsByTrack } from "@/lib/ai/topics";
import { TRACK_ICONS, TRACK_ORDER, TRACK_SHORT } from "@/lib/ai/types";
import { useAiProgress } from "./useAiProgress";

// One badge per track; earned when every topic in the track is mastered.
export default function TrackBadges() {
  const state = useAiProgress();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-comic text-xl tracking-wide sm:text-2xl">🎖️ TRACK BADGES</h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TRACK_ORDER.map((track) => {
          const topics = getTopicsByTrack(track);
          const mastered = topics.filter((t) => state.completedTopics.includes(t.id)).length;
          const earned = isTrackEarned(state, track);
          return (
            <li
              key={track}
              className={`comic-border-sm flex flex-col items-center gap-1 px-3 py-4 text-center transition-colors ${
                earned ? "bg-comic-yellow text-ink" : "bg-paper-dim text-ink/70"
              }`}
            >
              <span className={`text-3xl ${earned ? "" : "opacity-40 grayscale"}`} aria-hidden="true">
                {earned ? TRACK_ICONS[track] : "🔒"}
              </span>
              <span className="font-comic text-sm tracking-wide">{TRACK_SHORT[track]}</span>
              <span className="text-xs">
                {earned ? "Unlocked!" : `${mastered}/${topics.length}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
