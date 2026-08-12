import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AwsQuiz from "@/components/aws/AwsQuiz";
import ScenarioChallenge from "@/components/aws/ScenarioChallenge";
import { getAllSegmentIds, getAllSegments, getSegmentById } from "@/lib/aws/segments";
import { DOMAIN_ICONS, DOMAIN_LABELS } from "@/lib/aws/types";

interface SegmentPageProps {
  params: Promise<{ segmentId: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSegmentIds().map((segmentId) => ({ segmentId }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
  const { segmentId } = await params;
  const segment = getSegmentById(segmentId);
  if (!segment) {
    return { title: "Segment Not Found" };
  }
  return {
    title: `Week ${segment.week}: ${segment.title}`,
    description: segment.oneLiner,
    alternates: { canonical: `/aws/${segment.id}` },
    openGraph: {
      title: `Week ${segment.week}: ${segment.title}`,
      description: segment.oneLiner,
      url: `/aws/${segment.id}`,
      type: "article",
    },
  };
}

export default async function SegmentPage({ params }: SegmentPageProps) {
  const { segmentId } = await params;
  const segment = getSegmentById(segmentId);

  if (!segment) {
    notFound();
  }

  const all = getAllSegments();
  const idx = all.findIndex((s) => s.id === segment.id);
  const nextSegment = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

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
            <Link href="/aws" className="underline-offset-2 hover:underline">
              AWS SA
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            Week {segment.week}
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-comic text-sm tracking-wide text-aws-orange-dark">
            WEEK {segment.week}
          </span>
          <span className="comic-border-sm inline-flex items-center gap-1 bg-paper px-2 py-0.5 text-xs font-semibold">
            {DOMAIN_ICONS[segment.domain]} {DOMAIN_LABELS[segment.domain]}
          </span>
        </div>
        <h1 className="font-comic text-4xl leading-none tracking-wide sm:text-5xl">{segment.title}</h1>
        <p className="text-base leading-relaxed text-ink/80 sm:text-lg">{segment.oneLiner}</p>
        <p className="comic-border-sm inline-block self-start bg-comic-yellow/20 px-3 py-1.5 text-xs font-semibold sm:text-sm">
          📊 {segment.examWeightNote}
        </p>
      </header>

      <section aria-labelledby="objectives-heading" className="flex flex-col gap-4">
        <h2 id="objectives-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          🎯 THIS WEEK&apos;S OBJECTIVES
        </h2>
        <ul className="comic-border-sm flex flex-col gap-2 bg-paper p-5">
          {segment.objectives.map((obj) => (
            <li key={obj} className="flex gap-2 text-sm leading-relaxed sm:text-base">
              <span aria-hidden="true">▸</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="services-heading" className="flex flex-col gap-4">
        <h2 id="services-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          🧰 KEY SERVICES
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {segment.services.map((service) => (
            <div key={service.name} className="comic-border-sm bg-paper p-4">
              <p className="font-comic text-lg tracking-wide">
                {service.emoji ? <span className="mr-1.5" aria-hidden="true">{service.emoji}</span> : null}
                {service.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed sm:text-base">{service.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="concepts-heading" className="flex flex-col gap-4">
        <h2 id="concepts-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          🧠 KEY CONCEPTS
        </h2>
        <ul className="flex flex-col gap-3">
          {segment.keyConcepts.map((concept) => (
            <li key={concept} className="comic-border-sm bg-paper-dim p-4 text-sm leading-relaxed sm:text-base">
              {concept}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="resources-heading" className="flex flex-col gap-4">
        <h2 id="resources-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
          📚 STUDY RESOURCES
        </h2>
        <ul className="flex flex-wrap gap-3">
          {segment.resources.map((res) => (
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

      <div className="comic-border flex flex-col gap-12 border-aws-orange-dark bg-aws-orange/10 p-5 sm:p-8">
        <p className="font-comic -mt-1 text-center text-sm tracking-widest text-aws-orange-dark sm:text-base">
          ⚡ PLAY TO MASTER THIS WEEK ⚡
        </p>

        <section aria-labelledby="scenarios-heading" className="flex flex-col gap-6">
          <h2 id="scenarios-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
            🏗️ SCENARIO CHALLENGES
          </h2>
          {segment.scenarios.map((scenario, i) => (
            <ScenarioChallenge
              key={`${segment.id}-scenario-${i}`}
              segmentId={segment.id}
              index={i}
              scenario={scenario}
            />
          ))}
        </section>

        <section aria-labelledby="quiz-heading" className="flex flex-col gap-4">
          <h2 id="quiz-heading" className="font-comic text-2xl tracking-wide sm:text-3xl">
            🏆 MASTERY QUIZ
          </h2>
          <AwsQuiz segmentId={segment.id} segmentTitle={segment.title} questions={segment.quiz} />
        </section>
      </div>

      <nav aria-label="Continue" className="flex flex-wrap items-center justify-between gap-3 border-t-4 border-ink pt-8">
        <Link
          href="/aws"
          className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm tracking-wide transition-transform hover:-translate-y-0.5"
        >
          ← Back to dashboard
        </Link>
        {nextSegment && (
          <Link
            href={`/aws/${nextSegment.id}`}
            className="comic-border-sm font-comic bg-aws-orange px-4 py-2 text-sm tracking-wide text-ink transition-transform hover:-translate-y-0.5"
          >
            Next: Week {nextSegment.week} — {nextSegment.title} →
          </Link>
        )}
      </nav>
    </article>
  );
}
