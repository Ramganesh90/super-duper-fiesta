"use client";

import LevelBadge from "./LevelBadge";
import MasteryMeter from "./MasteryMeter";
import StreakTracker from "./StreakTracker";
import TrackBadges from "./TrackBadges";
import TopicGrid, { type TopicSummary } from "./TopicGrid";
import { FUTURE_TRACKS } from "@/lib/ai/types";

// Client shell for /ai: live stats, track badges, the topic roadmap, and a
// "coming soon" strip advertising future tracks (e.g. AI Data Patterns).
export default function AiDashboard({ topics }: { topics: TopicSummary[] }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LevelBadge />
        <MasteryMeter />
        <StreakTracker />
      </div>

      <TrackBadges />

      <TopicGrid topics={topics} />

      <section aria-labelledby="future-heading" className="flex flex-col gap-3">
        <h3 id="future-heading" className="font-comic text-xl tracking-wide sm:text-2xl">
          🔮 COMING SOON
        </h3>
        <p className="text-sm text-ink/70 sm:text-base">
          Future tracks on the way — the roadmap keeps growing.
        </p>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FUTURE_TRACKS.map((track) => (
            <li
              key={track.title}
              className="comic-border-sm flex flex-col gap-1 border-dashed bg-paper-dim/60 p-4"
            >
              <p className="font-comic text-lg tracking-wide">
                <span className="mr-1.5" aria-hidden="true">{track.emoji}</span>
                {track.title}
              </p>
              <p className="text-xs leading-relaxed text-ink/70 sm:text-sm">{track.blurb}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ai-violet-dark">
                Coming soon
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
