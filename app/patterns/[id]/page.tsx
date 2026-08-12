import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PatternHeader from "@/components/patterns/PatternHeader";
import PatternExplanation from "@/components/patterns/PatternExplanation";
import BeforeAfter from "@/components/patterns/BeforeAfter";
import ComicReader from "@/components/comic/ComicReader";
import ConversationReader from "@/components/comic/ConversationReader";
import CodeBlock from "@/components/code/CodeBlock";
import CodeBattle from "@/components/learning/CodeBattle";
import Quiz from "@/components/learning/Quiz";
import ProgressIndicator from "@/components/learning/ProgressIndicator";
import { getAllPatternIds, getAllPatterns, getPatternById } from "@/lib/patterns";
import { CATEGORY_ICONS, CATEGORY_LABELS, type PatternCategory } from "@/lib/types";

const CATEGORY_ORDER: PatternCategory[] = [
  "creational",
  "structural",
  "behavioral",
  "concurrency",
  "architectural",
  "enterprise",
];

interface PatternPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPatternIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
  const { id } = await params;
  const pattern = getPatternById(id);
  if (!pattern) {
    return { title: "Pattern Not Found" };
  }
  return {
    title: `${pattern.hero.name} — ${pattern.title}`,
    description: pattern.oneLiner,
    alternates: { canonical: `/patterns/${pattern.id}` },
    openGraph: {
      title: `${pattern.hero.name} — ${pattern.title}`,
      description: pattern.oneLiner,
      url: `/patterns/${pattern.id}`,
      type: "article",
    },
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { id } = await params;
  const pattern = getPatternById(id);

  if (!pattern) {
    notFound();
  }

  const allPatterns = getAllPatterns();
  const categoryPeers = allPatterns.filter((p) => p.category === pattern.category && p.id !== pattern.id);

  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="-mb-6 text-sm font-semibold">
        <ol className="flex flex-wrap items-center gap-1.5 text-ink/70">
          <li>
            <Link href="/patterns" className="underline-offset-2 hover:underline">
              Pattern-Verse
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/patterns#category-${pattern.category}`} className="underline-offset-2 hover:underline">
              {CATEGORY_ICONS[pattern.category]} {CATEGORY_LABELS[pattern.category]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            {pattern.hero.name}
          </li>
        </ol>
      </nav>

      <PatternHeader pattern={pattern} />

      <ProgressIndicator totalPatterns={allPatterns.length} />

      <section aria-labelledby="comic-story-heading" className="flex flex-col gap-4">
        <h2 id="comic-story-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          📖 THE COMIC STORY
        </h2>
        <ComicReader panels={pattern.panels} accent={pattern.hero.colorFrom} />
      </section>

      <section aria-labelledby="problem-solution-heading" className="flex flex-col gap-4">
        <h2 id="problem-solution-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          💥 PROBLEM &amp; SOLUTION
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="comic-border-sm bg-paper p-5">
            <h3 className="font-comic text-xl tracking-wide">THE PROBLEM</h3>
            <p className="mt-2 text-sm leading-relaxed sm:text-base">{pattern.story.problem}</p>
          </div>
          <div className="comic-border-sm bg-paper p-5">
            <h3 className="font-comic text-xl tracking-wide">THE SOLUTION</h3>
            <p className="mt-2 text-sm leading-relaxed sm:text-base">{pattern.story.solution}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="before-after-heading" className="flex flex-col gap-4">
        <h2 id="before-after-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          🎉 BEFORE / AFTER
        </h2>
        <BeforeAfter data={pattern.beforeAfter} />
      </section>

      <section aria-labelledby="code-example-heading" className="flex flex-col gap-4">
        <h2 id="code-example-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          💻 CODE EXAMPLE
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CodeBlock code={pattern.code.before} language={pattern.code.language} label="Before" />
          <CodeBlock code={pattern.code.after} language={pattern.code.language} label="After" />
        </div>
      </section>

      <section aria-labelledby="conversation-heading" className="flex flex-col gap-4">
        <h2 id="conversation-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          🗨️ HERO CONVERSATION
        </h2>
        <div className="comic-border-sm bg-paper-dim p-5 sm:p-8">
          <ConversationReader
            conversation={pattern.conversation}
            heroName={pattern.hero.name}
            accent={pattern.hero.colorFrom}
          />
        </div>
      </section>

      <section aria-labelledby="explanation-heading" className="flex flex-col gap-4">
        <h2 id="explanation-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          🧠 WHY IT WORKS
        </h2>
        <PatternExplanation pattern={pattern} />
      </section>

      <div className="comic-border flex flex-col gap-14 border-comic-yellow-dark bg-comic-yellow/10 p-5 sm:p-8">
        <p className="font-comic -mt-1 text-center text-sm tracking-widest text-comic-yellow-dark sm:text-base">
          ⚡ THE FINAL CHALLENGE ⚡
        </p>

        <section aria-labelledby="code-battle-heading" className="flex flex-col gap-4">
          <h2 id="code-battle-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
            🎯 YOUR TURN
          </h2>
          <CodeBattle patternId={pattern.id} battle={pattern.codeBattle} />
        </section>

        <section aria-labelledby="quiz-heading" className="flex flex-col gap-4">
          <h2 id="quiz-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
            🏆 QUIZ
          </h2>
          <Quiz patternId={pattern.id} heroName={pattern.hero.name} questions={pattern.quiz} />
        </section>
      </div>

      <nav aria-label="More patterns in this category" className="border-t-4 border-ink pt-8">
        <h2 className="font-comic text-xl tracking-wide">
          MORE {CATEGORY_LABELS[pattern.category].toUpperCase()} HEROES
        </h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {categoryPeers.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/patterns/${p.id}`}
                  className="comic-border-sm inline-flex items-center gap-2 bg-paper px-3 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  <span aria-hidden="true">{p.hero.emoji}</span>
                  {p.hero.name}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <nav aria-label="Browse other categories" className="pt-2">
        <h2 className="font-comic text-xl tracking-wide">BROWSE OTHER CATEGORIES</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {CATEGORY_ORDER.filter((category) => category !== pattern.category).map((category) => (
            <li key={category}>
              <Link
                href={`/patterns#category-${category}`}
                className="comic-border-sm inline-flex items-center gap-1.5 bg-paper px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
