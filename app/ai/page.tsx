import type { Metadata } from "next";
import Link from "next/link";
import AiDashboard from "@/components/ai/AiDashboard";
import type { TopicSummary } from "@/components/ai/TopicGrid";
import { getAllTopics } from "@/lib/ai/topics";

export const metadata: Metadata = {
  title: "AI Academy — Learn AI by Playing",
  description:
    "A comical, gamified roadmap to learn and master AI engineering — from math foundations and classical ML to deep learning, LLMs, RAG, agents, and shipping AI. Earn XP, keep a streak, and unlock track badges.",
  alternates: { canonical: "/ai" },
};

export default function AiHomePage() {
  const topics = getAllTopics();
  const summaries: TopicSummary[] = topics.map((t) => ({
    id: t.id,
    order: t.order,
    title: t.title,
    track: t.track,
    oneLiner: t.oneLiner,
    character: { name: t.character.name, emoji: t.character.emoji },
  }));

  return (
    <div id="top" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold">
        <ol className="flex flex-wrap items-center gap-1.5 text-ink/70">
          <li>
            <Link href="/" className="underline-offset-2 hover:underline">
              Study Companion
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            AI Academy
          </li>
        </ol>
      </nav>

      <header className="mb-10 text-center">
        <h1 className="font-comic text-4xl tracking-wide text-ai-violet-dark sm:text-5xl">
          AI ACADEMY
        </h1>
        <p className="font-comic mt-2 text-xl tracking-wide text-hero-blue sm:text-2xl">
          Learn AI by Playing 🤖
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Meet a cast of comic characters who make AI click — from the Number Sage to the Attention
          Seeker to the Puppeteer. Work the roadmap, pass quizzes and scenarios to earn XP and level up,
          keep your streak alive, and watch your AI mastery climb.
        </p>
      </header>

      <AiDashboard topics={summaries} />
    </div>
  );
}
