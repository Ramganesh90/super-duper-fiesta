import type { Pattern, PatternCategory } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/types";
import HeroCard from "@/components/comic/HeroCard";

interface PatternRosterProps {
  patterns: Pattern[];
}

const CATEGORY_ORDER: PatternCategory[] = ["creational", "structural", "behavioral"];

export default function PatternRoster({ patterns }: PatternRosterProps) {
  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    patterns: patterns.filter((p) => p.category === category),
  })).filter((group) => group.patterns.length > 0);

  return (
    <div className="flex flex-col gap-12">
      {byCategory.map((group) => (
        <section key={group.category} aria-labelledby={`category-${group.category}`}>
          <h3
            id={`category-${group.category}`}
            className="font-comic mb-5 flex items-center gap-2 text-2xl tracking-wide sm:text-3xl"
          >
            <span aria-hidden="true">{CATEGORY_ICONS[group.category]}</span>
            {CATEGORY_LABELS[group.category]}
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.patterns.map((pattern) => (
              <HeroCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
