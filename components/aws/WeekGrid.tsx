"use client";

import Link from "next/link";
import { getSegmentStatus, type SegmentStatus } from "@/lib/aws/progress";
import { DOMAIN_ICONS, DOMAIN_SHORT, type AwsDomain } from "@/lib/aws/types";
import { useAwsProgress } from "./useAwsProgress";

export interface SegmentSummary {
  id: string;
  week: number;
  title: string;
  domain: AwsDomain;
  oneLiner: string;
}

const STATUS_META: Record<SegmentStatus, { label: string; badge: string; classes: string }> = {
  mastered: { label: "Mastered", badge: "🏆", classes: "bg-comic-yellow" },
  "in-progress": { label: "In progress", badge: "⏳", classes: "bg-paper" },
  available: { label: "Ready to play", badge: "▶️", classes: "bg-paper" },
  locked: { label: "Locked", badge: "🔒", classes: "bg-paper-dim opacity-70" },
};

function SegmentCard({ segment, status }: { segment: SegmentSummary; status: SegmentStatus }) {
  const meta = STATUS_META[status];
  const locked = status === "locked";

  const inner = (
    <div
      className={`comic-border-sm flex h-full flex-col gap-2 p-4 transition-transform ${meta.classes} ${
        locked ? "cursor-not-allowed" : "hover:-translate-y-1"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-comic text-sm tracking-wide text-aws-orange-dark">
          WEEK {segment.week}
        </span>
        <span className="comic-border-sm inline-flex items-center gap-1 bg-paper px-2 py-0.5 text-xs font-semibold">
          {DOMAIN_ICONS[segment.domain]} {DOMAIN_SHORT[segment.domain]}
        </span>
      </div>
      <h4 className="font-comic text-lg leading-tight tracking-wide sm:text-xl">{segment.title}</h4>
      <p className="text-xs leading-relaxed text-ink/80 sm:text-sm">{segment.oneLiner}</p>
      <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs font-semibold sm:text-sm">
        <span aria-hidden="true">{meta.badge}</span>
        {locked ? "Master the previous week to unlock" : meta.label}
      </p>
    </div>
  );

  if (locked) {
    return <li title="Master the previous week to unlock">{inner}</li>;
  }

  return (
    <li>
      <Link href={`/aws/${segment.id}`} className="block h-full focus:outline-none">
        {inner}
      </Link>
    </li>
  );
}

export default function WeekGrid({ segments }: { segments: SegmentSummary[] }) {
  const state = useAwsProgress();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-comic text-xl tracking-wide sm:text-2xl">🗓️ YOUR 8-WEEK PLAN</h3>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {segments.map((segment) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            status={getSegmentStatus(state, segment.id)}
          />
        ))}
      </ul>
    </div>
  );
}
