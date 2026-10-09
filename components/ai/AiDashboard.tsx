"use client";

import Link from "next/link";
import LevelBadge from "./LevelBadge";
import MasteryMeter from "./MasteryMeter";
import StreakTracker from "./StreakTracker";
import TrackBadges from "./TrackBadges";
import TopicGrid, { type TopicSummary } from "./TopicGrid";
import ResetProgress from "./ResetProgress";
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

      <Link
        href="/ai/builder"
        className="comic-border bg-halftone flex flex-col items-start gap-1 bg-ai-violet/10 p-5 transition-transform hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-comic text-xl tracking-wide text-ai-violet-dark sm:text-2xl">
            🏗️ Build your own AI pipeline
          </p>
          <p className="text-sm text-ink/80 sm:text-base">
            Assemble an LLM app and get live best-practice feedback on grounding, guardrails, and evals.
          </p>
        </div>
        <span className="comic-border-sm font-comic bg-ai-violet px-4 py-2 text-sm tracking-wide text-paper-fixed">
          Open the sandbox →
        </span>
      </Link>

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

      <div className="flex justify-end border-t-2 border-dashed border-ink/20 pt-4">
        <ResetProgress />
      </div>
    </div>
  );
}
