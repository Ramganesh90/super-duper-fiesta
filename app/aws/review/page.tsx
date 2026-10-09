import type { Metadata } from "next";
import Link from "next/link";
import ReviewMisses from "@/components/aws/ReviewMisses";

export const metadata: Metadata = {
  title: "Review Your Misses — AWS Solutions Architect",
  description:
    "Focused review of the SAA-C03 questions you've previously answered wrong. Answer one correctly to clear it from your list.",
  alternates: { canonical: "/aws/review" },
};

export default function ReviewPage() {
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
            Review Misses
          </li>
        </ol>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="font-comic text-4xl tracking-wide text-aws-orange-dark sm:text-5xl">
          REVIEW YOUR MISSES
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          The questions you&apos;ve gotten wrong, gathered for focused practice. Get one right and it
          leaves the list.
        </p>
      </header>

      <ReviewMisses />
    </div>
  );
}
