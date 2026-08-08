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
  const [activeCategory, setActiveCategory] = useState<PatternCategory | null>(null);

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;
  const hasFilters = isSearching || activeCategory !== null;

  const categoriesPresent = useMemo(
    () => CATEGORY_ORDER.filter((category) => patterns.some((p) => p.category === category)),
    [patterns]
  );

  const scopedPatterns = useMemo(
    () => (activeCategory ? patterns.filter((p) => p.category === activeCategory) : patterns),
    [patterns, activeCategory]
  );

  const searchResults = useMemo(
    () => (isSearching ? scopedPatterns.filter((p) => matches(p, trimmedQuery)) : []),
    [scopedPatterns, trimmedQuery, isSearching]
  );

  const byCategory = useMemo(() => {
    const visibleCategories = activeCategory ? [activeCategory] : categoriesPresent;
    return visibleCategories.map((category) => ({
      category,
      patterns: patterns.filter((p) => p.category === category),
    }));
  }, [patterns, activeCategory, categoriesPresent]);

  const handleCategoryClick = (category: PatternCategory) => {
    setActiveCategory((current) => (current === category ? null : category));
  };

  const handleReset = () => {
    setQuery("");
    setActiveCategory(null);
  };

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
          placeholder={
            activeCategory
              ? `🔍 Search within ${CATEGORY_LABELS[activeCategory]}…`
              : "🔍 Search heroes by name, power, or category…"
          }
          className="comic-border-sm bg-paper px-4 py-3 text-base placeholder:text-ink/50 sm:text-lg"
        />
        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
            {categoriesPresent.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  aria-pressed={isActive}
                  className={`comic-border-sm inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    isActive ? "bg-hero-blue text-paper" : "bg-paper"
                  }`}
                >
                  {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
                </button>
              );
            })}
          </nav>
          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="font-comic text-sm tracking-wide text-action-red underline-offset-2 hover:underline"
            >
              ✕ Reset
            </button>
          )}
        </div>
      </div>

      {isSearching ? (
        <section aria-live="polite">
          <p className="mb-5 font-semibold">
            {searchResults.length === 0
              ? `No heroes match "${query}"${activeCategory ? ` in ${CATEGORY_LABELS[activeCategory]}` : ""}.`
              : `${searchResults.length} hero${searchResults.length === 1 ? "" : "es"} match "${query}"${
                  activeCategory ? ` in ${CATEGORY_LABELS[activeCategory]}` : ""
                }`}
          </p>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((pattern) => (
                <HeroCard key={pattern.id} pattern={pattern} showCategory={!activeCategory} />
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
