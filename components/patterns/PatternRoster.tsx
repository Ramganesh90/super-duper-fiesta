"use client";

import { useMemo, useState } from "react";
import type { Pattern, PatternCategory } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/types";
import HeroCard from "@/components/comic/HeroCard";

interface PatternRosterProps {
  patterns: Pattern[];
}

const CATEGORY_ORDER: PatternCategory[] = [
  "creational",
  "structural",
  "behavioral",
  "concurrency",
  "architectural",
  "enterprise",
];

function matches(pattern: Pattern, query: string): boolean {
  const haystack = [
    pattern.hero.name,
    pattern.title,
    pattern.hero.catchphrase,
    pattern.hero.power,
    CATEGORY_LABELS[pattern.category],
    pattern.difficulty,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export default function PatternRoster({ patterns }: PatternRosterProps) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const searchResults = useMemo(
    () => (isSearching ? patterns.filter((p) => matches(p, trimmedQuery)) : []),
    [patterns, trimmedQuery, isSearching]
  );

  const categoriesPresent = useMemo(
    () => CATEGORY_ORDER.filter((category) => patterns.some((p) => p.category === category)),
    [patterns]
  );

  const byCategory = useMemo(
    () =>
      categoriesPresent.map((category) => ({
        category,
        patterns: patterns.filter((p) => p.category === category),
      })),
    [categoriesPresent, patterns]
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <label className="sr-only" htmlFor="pattern-search">
          Search patterns by name, category, or difficulty
        </label>
        <input
          id="pattern-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search heroes by name, power, or category…"
          className="comic-border-sm bg-paper px-4 py-3 text-base placeholder:text-ink/50 sm:text-lg"
        />
        <nav aria-label="Jump to category" className="flex flex-wrap gap-2">
          {categoriesPresent.map((category) => (
            <a
              key={category}
              href={`#category-${category}`}
              className="comic-border-sm inline-flex items-center gap-1.5 bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
            </a>
          ))}
        </nav>
      </div>

      {isSearching ? (
        <section aria-live="polite">
          <p className="mb-5 font-semibold">
            {searchResults.length === 0
              ? `No heroes match "${query}".`
              : `${searchResults.length} hero${searchResults.length === 1 ? "" : "es"} match "${query}"`}
          </p>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((pattern) => (
                <HeroCard key={pattern.id} pattern={pattern} showCategory />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-12">
          {byCategory.map((group) => (
            <section key={group.category} aria-labelledby={`category-${group.category}`}>
              <h3
                id={`category-${group.category}`}
                className="font-comic mb-5 scroll-mt-24 flex items-center gap-2 text-2xl tracking-wide sm:text-3xl"
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
          <a
            href="#top"
            className="comic-border-sm font-comic self-center bg-paper px-4 py-2 text-sm tracking-wide transition-transform hover:-translate-y-0.5"
          >
            ↑ Back to top
          </a>
        </div>
      )}
    </div>
  );
}
