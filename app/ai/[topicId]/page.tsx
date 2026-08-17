import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AiQuiz from "@/components/ai/AiQuiz";
import ScenarioChallenge from "@/components/ai/ScenarioChallenge";
import CharacterCard from "@/components/ai/CharacterCard";
import { getAllTopicIds, getAllTopics, getTopicById } from "@/lib/ai/topics";
import { TRACK_ICONS, TRACK_LABELS } from "@/lib/ai/types";

interface TopicPageProps {
  params: Promise<{ topicId: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTopicIds().map((topicId) => ({ topicId }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic) {
    return { title: "Topic Not Found" };
  }
  return {
    title: `${topic.title} — ${topic.character.name}`,
    description: topic.oneLiner,
    alternates: { canonical: `/ai/${topic.id}` },
    openGraph: {
      title: `${topic.title} — ${topic.character.name}`,
      description: topic.oneLiner,
      url: `/ai/${topic.id}`,
      type: "article",
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  const all = getAllTopics();
  const idx = all.findIndex((t) => t.id === topic.id);
  const nextTopic = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="-mb-4 text-sm font-semibold">
        <ol className="flex flex-wrap items-center gap-1.5 text-ink/70">
          <li>
            <Link href="/" className="underline-offset-2 hover:underline">
              Study Companion
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/ai" className="underline-offset-2 hover:underline">
              AI Academy
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            Topic {topic.order}
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-comic text-sm tracking-wide text-ai-violet-dark">
            TOPIC {topic.order}
          </span>
          <span className="comic-border-sm inline-flex items-center gap-1 bg-paper px-2 py-0.5 text-xs font-semibold">
            {TRACK_ICONS[topic.track]} {TRACK_LABELS[topic.track]}
          </span>
        </div>
        <h1 className="font-comic text-4xl leading-none tracking-wide sm:text-5xl">{topic.title}</h1>
        <p className="text-base leading-relaxed text-ink/80 sm:text-lg">{topic.oneLiner}</p>
      </header>

      <section aria-labelledby="character-heading" className="flex flex-col gap-4">
        <h2 id="character-heading" className="sr-only">Meet your guide</h2>
        <CharacterCard character={topic.character} analogy={topic.analogy} />
      </section>

      <section aria-labelledby="objectives-heading" className="flex flex-col gap-4">
        <h2 id="objectives-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          🎯 WHAT YOU&apos;LL LEARN
        </h2>
        <ul className="comic-border-sm flex flex-col gap-2 bg-paper p-5">
          {topic.objectives.map((obj) => (
            <li key={obj} className="flex gap-2 text-sm leading-relaxed sm:text-base">
              <span aria-hidden="true">▸</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="concepts-heading" className="flex flex-col gap-4">
        <h2 id="concepts-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          🧠 KEY CONCEPTS
        </h2>
        <ul className="flex flex-col gap-3">
          {topic.keyConcepts.map((concept) => (
            <li key={concept} className="comic-border-sm bg-paper-dim p-4 text-sm leading-relaxed sm:text-base">
              {concept}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="terms-heading" className="flex flex-col gap-4">
        <h2 id="terms-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          🔤 JARGON, IN PLAIN ENGLISH
        </h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {topic.keyTerms.map((kt) => (
            <div key={kt.term} className="comic-border-sm bg-paper p-4">
              <dt className="font-comic text-lg tracking-wide text-ai-violet-dark">{kt.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed sm:text-base">{kt.plain}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="resources-heading" className="flex flex-col gap-4">
        <h2 id="resources-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          📚 GO DEEPER
        </h2>
        <ul className="flex flex-wrap gap-3">
          {topic.resources.map((res) => (
            <li key={res.url}>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="comic-border-sm inline-flex items-center gap-1.5 bg-paper px-3 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                <span aria-hidden="true">🔗</span>
                {res.label}
                <span className="text-xs text-ink/60">({res.type})</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="comic-border flex flex-col gap-12 border-ai-violet-dark bg-ai-violet/10 p-5 sm:p-8">
        <p className="font-comic -mt-1 text-center text-sm tracking-widest text-ai-violet-dark sm:text-base">
          ⚡ PLAY TO MASTER THIS TOPIC ⚡
        </p>

        <section aria-labelledby="scenarios-heading" className="flex flex-col gap-6">
          <h2 id="scenarios-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
            🧩 SCENARIO CHALLENGES
          </h2>
          {topic.scenarios.map((scenario, i) => (
            <ScenarioChallenge
              key={`${topic.id}-scenario-${i}`}
              topicId={topic.id}
              index={i}
              scenario={scenario}
            />
          ))}
        </section>

        <section aria-labelledby="quiz-heading" className="flex flex-col gap-4">
          <h2 id="quiz-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
            🏆 MASTERY QUIZ
          </h2>
          <AiQuiz topicId={topic.id} topicTitle={topic.title} questions={topic.quiz} />
        </section>
      </div>

      <nav aria-label="Continue" className="flex flex-wrap items-center justify-between gap-3 border-t-4 border-ink pt-8">
        <Link
          href="/ai"
          className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm tracking-wide transition-transform hover:-translate-y-0.5"
        >
          ← Back to roadmap
        </Link>
        {nextTopic && (
          <Link
            href={`/ai/${nextTopic.id}`}
            className="comic-border-sm font-comic bg-ai-violet px-4 py-2 text-sm tracking-wide text-paper transition-transform hover:-translate-y-0.5"
          >
            Next: {nextTopic.title} →
          </Link>
        )}
      </nav>
    </article>
  );
}
