import ComicPanel from "@/components/comic/ComicPanel";
import PatternRoster from "@/components/patterns/PatternRoster";
import ProgressIndicator from "@/components/learning/ProgressIndicator";
import { getAllPatterns } from "@/lib/patterns";
import type { ComicPanelData } from "@/lib/types";

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

export default function Home() {
  const patterns = getAllPatterns();

  return (
    <div id="top" className="flex flex-col gap-16 pb-20 sm:gap-24">
      <section className="bg-halftone relative overflow-hidden border-b-4 border-ink bg-paper-dim px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="font-comic text-5xl leading-none tracking-wide text-ink sm:text-7xl lg:text-8xl">
          PATTERN<span className="text-action-red">-VERSE</span>
        </h1>
        <p className="font-comic mt-4 text-xl tracking-wide text-hero-blue sm:text-2xl">
          Where Design Patterns Come to Life
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Meet an original universe of superheroes — one for every Gang of Four design pattern, plus concurrency,
          architectural, and enterprise patterns beyond. Fight bad code, learn the pattern power that beats it,
          and walk away with real architectural intuition.
        </p>
        <a
          href="#roster"
          className="comic-border font-comic mt-8 inline-block bg-action-red px-8 py-4 text-lg text-paper tracking-wide transition-transform hover:-translate-y-1 sm:text-xl"
        >
          Enter the Pattern-Verse
        </a>
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

      <section id="roster" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-comic text-4xl tracking-wide sm:text-5xl">THE PATTERN ROSTER</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
            {patterns.length} heroes and counting. Every pattern has a personality, a superpower, and a weakness.
            Pick one and start training.
          </p>
        </div>
        <PatternRoster patterns={patterns} />
      </section>
    </div>
  );
}
