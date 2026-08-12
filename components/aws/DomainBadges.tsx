"use client";

import { isDomainEarned } from "@/lib/aws/progress";
import { getSegmentsByDomain } from "@/lib/aws/segments";
import { DOMAIN_ICONS, DOMAIN_ORDER, DOMAIN_SHORT } from "@/lib/aws/types";
import { useAwsProgress } from "./useAwsProgress";

// One badge per exam domain; earned when every segment in the domain is mastered.
export default function DomainBadges() {
  const state = useAwsProgress();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-comic text-xl tracking-wide sm:text-2xl">🎖️ DOMAIN BADGES</h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DOMAIN_ORDER.map((domain) => {
          const segs = getSegmentsByDomain(domain);
          const mastered = segs.filter((s) => state.completedSegments.includes(s.id)).length;
          const earned = isDomainEarned(state, domain);
          return (
            <li
              key={domain}
              className={`comic-border-sm flex flex-col items-center gap-1 px-3 py-4 text-center transition-colors ${
                earned ? "bg-comic-yellow text-ink" : "bg-paper-dim text-ink/70"
              }`}
            >
              <span className={`text-3xl ${earned ? "" : "opacity-40 grayscale"}`} aria-hidden="true">
                {earned ? DOMAIN_ICONS[domain] : "🔒"}
              </span>
              <span className="font-comic text-sm tracking-wide">{DOMAIN_SHORT[domain]}</span>
              <span className="text-xs">
                {earned ? "Unlocked!" : `${mastered}/${segs.length} weeks`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
