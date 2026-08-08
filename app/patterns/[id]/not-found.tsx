import Link from "next/link";

export default function PatternNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <span className="text-6xl" aria-hidden="true">
        🕵️
      </span>
      <h1 className="font-comic text-4xl tracking-wide sm:text-5xl">HERO NOT FOUND</h1>
      <p className="text-base leading-relaxed sm:text-lg">
        This pattern hasn&apos;t joined the Pattern-Verse yet. Check the roster for the heroes who have.
      </p>
      <Link
        href="/patterns"
        className="comic-border-sm font-comic bg-hero-blue px-5 py-3 text-paper tracking-wide transition-transform hover:-translate-y-0.5"
      >
        Back to the Roster
      </Link>
    </div>
  );
}
