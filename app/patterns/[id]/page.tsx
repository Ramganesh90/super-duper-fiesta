import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PatternHeader from "@/components/patterns/PatternHeader";
import PatternExplanation from "@/components/patterns/PatternExplanation";
import BeforeAfter from "@/components/patterns/BeforeAfter";
import ComicPage from "@/components/comic/ComicPage";
import SpeechBubble from "@/components/comic/SpeechBubble";
import CodeBlock from "@/components/code/CodeBlock";
import CodeBattle from "@/components/learning/CodeBattle";
import Quiz from "@/components/learning/Quiz";
import { getAllPatternIds, getAllPatterns, getPatternById } from "@/lib/patterns";

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

  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14">
      <PatternHeader pattern={pattern} />

      <section aria-labelledby="comic-story-heading" className="flex flex-col gap-4">
        <h2 id="comic-story-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          📖 THE COMIC STORY
        </h2>
        <ComicPage panels={pattern.panels} accent={pattern.hero.colorFrom} />
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
        <div className="comic-border-sm flex flex-col gap-6 bg-paper-dim p-5 sm:p-8">
          {pattern.conversation.map((line, i) => (
            <SpeechBubble
              key={`${line.speaker}-${i}`}
              speaker={line.speaker}
              message={line.message}
              align={i % 2 === 0 ? "left" : "right"}
              accent={line.speaker === pattern.hero.name ? pattern.hero.colorFrom : undefined}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="explanation-heading" className="flex flex-col gap-4">
        <h2 id="explanation-heading" className="font-comic text-3xl tracking-wide sm:text-4xl">
          🧠 WHY IT WORKS
        </h2>
        <PatternExplanation pattern={pattern} />
      </section>

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

      <nav aria-label="More patterns" className="border-t-4 border-ink pt-8">
        <h2 className="font-comic text-xl tracking-wide">MORE HEROES TO MEET</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {allPatterns
            .filter((p) => p.id !== pattern.id)
            .map((p) => (
              <li key={p.id}>
                <a
                  href={`/patterns/${p.id}`}
                  className="comic-border-sm inline-flex items-center gap-2 bg-paper px-3 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  <span aria-hidden="true">{p.hero.emoji}</span>
                  {p.hero.name}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </article>
  );
}
