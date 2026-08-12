import Link from "next/link";

export default function SegmentNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <span className="text-6xl" aria-hidden="true">
        🧭
      </span>
      <h1 className="font-comic text-4xl tracking-wide sm:text-5xl">WEEK NOT FOUND</h1>
      <p className="text-base leading-relaxed sm:text-lg">
        That study segment isn&apos;t part of the plan. Head back to the dashboard to pick a week.
      </p>
      <Link
        href="/aws"
        className="comic-border-sm font-comic bg-aws-orange px-5 py-3 text-ink tracking-wide transition-transform hover:-translate-y-0.5"
      >
        Back to the AWS Dashboard
      </Link>
    </div>
  );
}
