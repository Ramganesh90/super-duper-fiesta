import Link from "next/link";

export default function TopicNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <span className="text-6xl" aria-hidden="true">
        🤖
      </span>
      <h1 className="font-comic text-4xl tracking-wide sm:text-5xl">TOPIC NOT FOUND</h1>
      <p className="text-base leading-relaxed sm:text-lg">
        That topic isn&apos;t on the roadmap. Head back to the AI Academy to pick one.
      </p>
      <Link
        href="/ai"
        className="comic-border-sm font-comic bg-ai-violet px-5 py-3 text-paper tracking-wide transition-transform hover:-translate-y-0.5"
      >
        Back to the AI Roadmap
      </Link>
    </div>
  );
}
