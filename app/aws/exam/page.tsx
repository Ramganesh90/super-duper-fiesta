import type { Metadata } from "next";
import Link from "next/link";
import AwsExam from "@/components/aws/AwsExam";

export const metadata: Metadata = {
  title: "Mock Exam — AWS Solutions Architect",
  description:
    "A timed, mixed-domain SAA-C03 practice exam drawn from every week, with a score, a pass/fail verdict, and a per-domain weak-area breakdown.",
  alternates: { canonical: "/aws/exam" },
};

export default function ExamPage() {
  return (
    <div id="top" className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold">
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
            Mock Exam
          </li>
        </ol>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="font-comic text-4xl tracking-wide text-aws-orange-dark sm:text-5xl">
          MOCK EXAM
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Test yourself under time pressure with questions mixed across every domain — then see exactly
          which areas need more work.
        </p>
      </header>

      <AwsExam />
    </div>
  );
}
