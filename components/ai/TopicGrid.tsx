"use client";

import Link from "next/link";
import { getTopicStatus, type TopicStatus } from "@/lib/ai/progress";
import { TRACK_ICONS, TRACK_LABELS, TRACK_ORDER, type AITrack } from "@/lib/ai/types";
import { useAiProgress } from "./useAiProgress";

export interface TopicSummary {
  id: string;
  order: number;
  title: string;
  track: AITrack;
  oneLiner: string;
  character: { name: string; emoji: string };
}

const STATUS_META: Record<TopicStatus, { label: string; badge: string; classes: string }> = {
  mastered: { label: "Mastered", badge: "🏆", classes: "bg-comic-yellow" },
  "in-progress": { label: "In progress", badge: "⏳", classes: "bg-paper" },
  available: { label: "Ready to play", badge: "▶️", classes: "bg-paper" },
  locked: { label: "Locked", badge: "🔒", classes: "bg-paper-dim opacity-70" },
};

function TopicCard({ topic, status }: { topic: TopicSummary; status: TopicStatus }) {
  const meta = STATUS_META[status];
  const locked = status === "locked";

  const inner = (
    <div
      className={`comic-border-sm flex h-full flex-col gap-2 p-4 transition-transform ${meta.classes} ${
        locked ? "cursor-not-allowed" : "hover:-translate-y-1"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-comic text-sm tracking-wide text-ai-violet-dark">
          TOPIC {topic.order}
        </span>
        <span className="text-2xl" aria-hidden="true">{topic.character.emoji}</span>
      </div>
      <h4 className="font-comic text-lg leading-tight tracking-wide sm:text-xl">{topic.title}</h4>
      <p className="text-xs italic text-ink/60">with {topic.character.name}</p>
      <p className="text-xs leading-relaxed text-ink/80 sm:text-sm">{topic.oneLiner}</p>
      <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs font-semibold sm:text-sm">
        <span aria-hidden="true">{meta.badge}</span>
        {locked ? "Master the previous topic to unlock" : meta.label}
      </p>
    </div>
  );

  if (locked) {
    return <li title="Master the previous topic to unlock">{inner}</li>;
  }

  return (
    <li>
      <Link href={`/ai/${topic.id}`} className="block h-full focus:outline-none">
        {inner}
      </Link>
    </li>
  );
}

export default function TopicGrid({ topics }: { topics: TopicSummary[] }) {
  const state = useAiProgress();

  return (
    <div className="flex flex-col gap-8">
      <h3 className="font-comic text-xl tracking-wide sm:text-2xl">🗺️ THE AI ROADMAP</h3>
      {TRACK_ORDER.map((track) => {
        const trackTopics = topics.filter((t) => t.track === track);
        if (trackTopics.length === 0) return null;
        return (
          <section key={track} aria-labelledby={`track-${track}`}>
            <h4
              id={`track-${track}`}
              className="font-comic mb-4 flex items-center gap-2 text-lg tracking-wide sm:text-xl"
            >
              <span aria-hidden="true">{TRACK_ICONS[track]}</span>
              {TRACK_LABELS[track]}
            </h4>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trackTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} status={getTopicStatus(state, topic.id)} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
