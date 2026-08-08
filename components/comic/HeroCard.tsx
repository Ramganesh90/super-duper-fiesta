"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Pattern } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/types";
import { isPatternMastered, subscribeToProgress } from "@/lib/progress";

const DIFFICULTY_STARS: Record<Pattern["difficulty"], string> = {
  beginner: "⭐",
  intermediate: "⭐⭐",
  advanced: "⭐⭐⭐",
};

interface HeroCardProps {
  pattern: Pattern;
  showCategory?: boolean;
}

export default function HeroCard({ pattern, showCategory = false }: HeroCardProps) {
  const mastered = useSyncExternalStore(
    subscribeToProgress,
    () => isPatternMastered(pattern.id),
    () => false
  );
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="comic-border flex h-full flex-col gap-3 bg-paper p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="comic-border-sm flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl"
          style={{ background: `linear-gradient(135deg, ${pattern.hero.colorFrom}, ${pattern.hero.colorTo})` }}
          role="img"
          aria-label={`${pattern.hero.name} badge`}
        >
          {pattern.hero.emoji}
        </span>
        {mastered && (
          <span className="comic-border-sm font-comic bg-comic-yellow px-2 py-1 text-xs text-ink">
            ✅ MASTERED
          </span>
        )}
      </div>

      <div>
        <h3 className="font-comic text-2xl leading-none tracking-wide">{pattern.hero.name.toUpperCase()}</h3>
        <p className="font-comic mt-1 text-sm tracking-wide text-hero-blue">{pattern.title.toUpperCase()}</p>
      </div>

      <blockquote className="border-l-4 border-ink pl-3 text-sm italic leading-snug sm:text-base">
        &ldquo;{pattern.hero.catchphrase}&rdquo;
      </blockquote>

      <div className="mt-auto flex items-center justify-between pt-2 text-sm">
        {showCategory ? (
          <span className="inline-flex items-center gap-1 font-semibold">
            {CATEGORY_ICONS[pattern.category]} {CATEGORY_LABELS[pattern.category]}
          </span>
        ) : (
          <span />
        )}
        <span aria-label={`Difficulty: ${pattern.difficulty}`}>{DIFFICULTY_STARS[pattern.difficulty]}</span>
      </div>

      <Link
        href={`/patterns/${pattern.id}`}
        className="comic-border-sm font-comic mt-2 block bg-hero-blue px-4 py-2 text-center text-paper tracking-wide transition-transform hover:-translate-y-0.5"
      >
        Learn Pattern
      </Link>
    </motion.div>
  );
}
