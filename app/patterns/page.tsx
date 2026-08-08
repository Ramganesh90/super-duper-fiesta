import type { Metadata } from "next";
import PatternRoster from "@/components/patterns/PatternRoster";
import GuessThePattern from "@/components/learning/GuessThePattern";
import { getAllPatterns } from "@/lib/patterns";

export const metadata: Metadata = {
  title: "The Pattern Roster",
  description:
    "Browse every hero in the Pattern-Verse — 52 design patterns spanning Creational, Structural, Behavioral, Concurrency, Architectural, and Enterprise categories. Search by name, power, or difficulty.",
  alternates: { canonical: "/patterns" },
};

export default function PatternsIndexPage() {
  const patterns = getAllPatterns();

  return (
    <div id="top" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 text-center">
        <h1 className="font-comic text-4xl tracking-wide sm:text-5xl">THE PATTERN ROSTER</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          {patterns.length} heroes and counting. Every pattern has a personality, a superpower, and a weakness.
          Search, jump to a category, or scroll and pick one.
        </p>
      </div>

      <div className="mx-auto mb-12 max-w-3xl">
        <h2 className="sr-only">Guess the Pattern</h2>
        <GuessThePattern patterns={patterns} />
      </div>

      <PatternRoster patterns={patterns} />
    </div>
  );
}
