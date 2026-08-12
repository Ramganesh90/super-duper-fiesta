import type { Metadata } from "next";
import Link from "next/link";
import ComicPanel from "@/components/comic/ComicPanel";
import ProgressIndicator from "@/components/learning/ProgressIndicator";
import RandomHeroButton from "@/components/homepage/RandomHeroButton";
import PatternRoster from "@/components/patterns/PatternRoster";
import GuessThePattern from "@/components/learning/GuessThePattern";
import { getAllPatterns } from "@/lib/patterns";
import type { ComicPanelData } from "@/lib/types";

export const metadata: Metadata = {
  title: "Pattern-Verse — Design Patterns as Superheroes",
  description:
    "Learn 52 software design patterns through an original comic universe. Meet the Pattern Heroes, battle bad code, pass quizzes, and master Creational, Structural, Behavioral, Concurrency, Architectural, and Enterprise patterns.",
  alternates: { canonical: "/patterns" },
};

const INTRO_PANELS: ComicPanelData[] = [
  {
    type: "problem",
    label: "Bad Code Strikes",
    caption: "A wall of tangled, tightly-coupled code towers over the codebase.",
    speaker: "Bad Code",
    dialogue: "HAHAHA! Your application is impossible to maintain!",
    emoji: "🦹",
  },
  {
    type: "hero",
    label: "The Developer",
    caption: "A lone developer stares at the wreckage, out of ideas.",
    speaker: "Developer",
    dialogue: "Who can save us?",
    emoji: "🧑‍💻",
  },
  {
    type: "result",
    label: "The Pattern Heroes",
    caption: "A team of original superheroes steps out of the shadows, ready to help.",
    speaker: "Pattern Heroes",
    dialogue: "We can.",
    emoji: "🦸",
  },
];

export default function PatternsIndexPage() {
  const patterns = getAllPatterns();
  const heroSummaries = patterns.map((p) => ({ id: p.id, name: p.hero.name, emoji: p.hero.emoji }));

  return (
    <div id="top" className="flex flex-col gap-16 pb-20 sm:gap-20">
      <section className="bg-halftone relative overflow-hidden border-b-4 border-ink bg-paper-dim px-4 py-14 text-center sm:px-6 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold">
          <ol className="flex flex-wrap items-center justify-center gap-1.5 text-ink/70">
            <li>
              <Link href="/" className="underline-offset-2 hover:underline">
                Study Companion
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink" aria-current="page">
              Pattern-Verse
            </li>
          </ol>
        </nav>
        <h1 className="font-comic text-5xl leading-none tracking-wide text-ink sm:text-7xl">
          PATTERN<span className="text-action-red">-VERSE</span>
        </h1>
        <p className="font-comic mt-4 text-xl tracking-wide text-hero-blue sm:text-2xl">
          Where Design Patterns Come to Life
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Meet an original universe of superheroes — one for every Gang of Four design pattern, plus
          concurrency, architectural, and enterprise patterns beyond. Fight bad code, learn the pattern
          power that beats it, and walk away with real architectural intuition.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6" aria-labelledby="intro-comic-heading">
        <h2 id="intro-comic-heading" className="sr-only">
          Opening comic: the Pattern Heroes arrive
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {INTRO_PANELS.map((panel, index) => (
            <ComicPanel key={panel.label} panel={panel} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ProgressIndicator totalPatterns={patterns.length} />
      </section>

      <section
        className="bg-halftone-yellow comic-border mx-auto w-full max-w-3xl bg-paper-dim px-4 py-10 text-center sm:px-6 sm:py-12"
        aria-labelledby="showcase-heading"
      >
        <h2 id="showcase-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          NOT SURE WHERE TO START?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Let fate pick your first pattern. Summon a random hero and see who shows up.
        </p>
        <div className="mt-8">
          <RandomHeroButton patterns={heroSummaries} />
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-comic text-4xl tracking-wide sm:text-5xl">THE PATTERN ROSTER</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
            {patterns.length} heroes and counting. Every pattern has a personality, a superpower, and a
            weakness. Search, jump to a category, or scroll and pick one.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-3xl">
          <h3 className="sr-only">Guess the Pattern</h3>
          <GuessThePattern patterns={patterns} />
        </div>

        <PatternRoster patterns={patterns} />
      </div>
    </div>
  );
}
