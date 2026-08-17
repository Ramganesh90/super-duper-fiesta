import type { Metadata } from "next";
import Link from "next/link";
import PatternHubSnapshot from "@/components/patterns/PatternHubSnapshot";
import AwsHubSnapshot from "@/components/aws/AwsHubSnapshot";
import AiHubSnapshot from "@/components/ai/AiHubSnapshot";
import { getAllPatterns } from "@/lib/patterns";
import { getAllSegments } from "@/lib/aws/segments";
import { getAllTopics } from "@/lib/ai/topics";

export const metadata: Metadata = {
  title: "Study Companion — Learn by Playing",
  description:
    "A mini dashboard of gamified learning apps: master software design patterns through a comic universe, and study for the AWS Solutions Architect exam by playing.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const patternCount = getAllPatterns().length;
  const weekCount = getAllSegments().length;
  const topicCount = getAllTopics().length;

  return (
    <div id="top" className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-14 sm:px-6 sm:py-20">
      <section className="text-center">
        <h1 className="font-comic text-5xl leading-none tracking-wide text-ink sm:text-6xl lg:text-7xl">
          STUDY <span className="text-action-red">COMPANION</span>
        </h1>
        <p className="font-comic mt-4 text-xl tracking-wide text-hero-blue sm:text-2xl">
          Learn by playing — one skill at a time
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          A little arcade of learning apps. Pick a track, rack up XP, keep your streak alive, and turn
          studying into a game you actually want to come back to.
        </p>
      </section>

      <section aria-labelledby="apps-heading" className="flex flex-col gap-6">
        <h2 id="apps-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          🎮 YOUR APPS
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Design Patterns — Pattern-Verse */}
          <div className="comic-border flex flex-col bg-paper p-6 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">🦸</span>
              <div>
                <h3 className="font-comic text-2xl tracking-wide text-hero-blue">Design Patterns</h3>
                <p className="text-sm text-ink/70">Pattern-Verse · comic, pattern-wise</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed sm:text-base">
              Meet {patternCount} design patterns as comic-book superheroes. Fight bad code, learn the power
              that beats it, and pass quizzes to master each pattern.
            </p>
            <PatternHubSnapshot total={patternCount} />
            <Link
              href="/patterns"
              className="comic-border-sm font-comic mt-6 self-start bg-hero-blue px-5 py-2.5 text-paper tracking-wide transition-transform hover:-translate-y-0.5"
            >
              Enter Pattern-Verse →
            </Link>
          </div>

          {/* AWS Solutions Architect */}
          <div className="comic-border flex flex-col bg-paper p-6 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">☁️</span>
              <div>
                <h3 className="font-comic text-2xl tracking-wide text-aws-orange-dark">AWS Solutions Architect</h3>
                <p className="text-sm text-ink/70">SAA-C03 · learn by playing</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed sm:text-base">
              An {weekCount}-week gamified plan for the Solutions Architect – Associate exam. Earn XP, keep a
              daily streak, unlock domain badges, and track your exam readiness.
            </p>
            <AwsHubSnapshot />
            <Link
              href="/aws"
              className="comic-border-sm font-comic mt-6 self-start bg-aws-orange px-5 py-2.5 text-ink tracking-wide transition-transform hover:-translate-y-0.5"
            >
              Start Studying →
            </Link>
          </div>

          {/* AI Academy */}
          <div className="comic-border flex flex-col bg-paper p-6 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">🤖</span>
              <div>
                <h3 className="font-comic text-2xl tracking-wide text-ai-violet-dark">AI Academy</h3>
                <p className="text-sm text-ink/70">AI engineering · learn by playing</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed sm:text-base">
              A comical roadmap of {topicCount} topics — from math foundations to LLMs, RAG, and agents —
              taught by a cast of characters. Earn XP, keep a streak, and unlock track badges.
            </p>
            <AiHubSnapshot />
            <Link
              href="/ai"
              className="comic-border-sm font-comic mt-6 self-start bg-ai-violet px-5 py-2.5 text-paper tracking-wide transition-transform hover:-translate-y-0.5"
            >
              Enter AI Academy →
            </Link>
          </div>
        </div>
      </section>

      <section className="comic-border-sm bg-halftone-yellow bg-paper-dim px-5 py-6 text-center">
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          Each app keeps its own progress on this device — no account needed. More tracks can join the
          arcade over time.
        </p>
      </section>
    </div>
  );
}
