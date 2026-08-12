import type { Metadata } from "next";
import Link from "next/link";
import AwsDashboard from "@/components/aws/AwsDashboard";
import type { SegmentSummary } from "@/components/aws/WeekGrid";
import { getAllSegments } from "@/lib/aws/segments";

export const metadata: Metadata = {
  title: "AWS Solutions Architect — Learn by Playing",
  description:
    "A gamified 8-week study plan for the AWS Solutions Architect – Associate (SAA-C03) exam. Earn XP, keep a daily streak, unlock domain badges, and track your exam readiness.",
  alternates: { canonical: "/aws" },
};

export default function AwsHomePage() {
  const segments = getAllSegments();
  const summaries: SegmentSummary[] = segments.map((s) => ({
    id: s.id,
    week: s.week,
    title: s.title,
    domain: s.domain,
    oneLiner: s.oneLiner,
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
            AWS Solutions Architect
          </li>
        </ol>
      </nav>

      <header className="mb-10 text-center">
        <h1 className="font-comic text-4xl tracking-wide text-aws-orange-dark sm:text-5xl">
          AWS SOLUTIONS ARCHITECT
        </h1>
        <p className="font-comic mt-2 text-xl tracking-wide text-hero-blue sm:text-2xl">
          Learn by Playing · SAA-C03
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          One week, one segment. Work through the 8-week plan, pass each quiz and scenario to earn XP and
          level up, keep your daily streak alive, and watch your exam-readiness climb.
        </p>
      </header>

      <AwsDashboard segments={summaries} />
    </div>
  );
}
