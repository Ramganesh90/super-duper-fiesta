import type { Pattern } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/types";

const DIFFICULTY_STARS: Record<Pattern["difficulty"], string> = {
  beginner: "⭐ Beginner",
  intermediate: "⭐⭐ Intermediate",
  advanced: "⭐⭐⭐ Advanced",
};

interface PatternHeaderProps {
  pattern: Pattern;
}

export default function PatternHeader({ pattern }: PatternHeaderProps) {
  const { hero } = pattern;
  return (
    <header className="bg-halftone comic-border relative overflow-hidden bg-paper-dim p-6 sm:p-10">
      <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <span
          className="comic-border flex h-28 w-28 shrink-0 items-center justify-center rounded-full text-6xl sm:h-36 sm:w-36 sm:text-7xl"
          style={{ background: `linear-gradient(135deg, ${hero.colorFrom}, ${hero.colorTo})` }}
          role="img"
          aria-label={`${hero.name} portrait`}
        >
          {hero.emoji}
        </span>
        <div>
          <p className="font-comic text-sm tracking-widest text-hero-blue sm:text-base">
            {CATEGORY_ICONS[pattern.category]} {CATEGORY_LABELS[pattern.category].toUpperCase()} PATTERN
          </p>
          <h1 className="font-comic text-4xl leading-none tracking-wide sm:text-6xl">{hero.name.toUpperCase()}</h1>
          <p className="mt-1 text-lg font-semibold text-ink/70 sm:text-xl">{pattern.title}</p>
          <p className="mt-3 max-w-2xl text-base italic leading-snug sm:text-lg">&ldquo;{hero.catchphrase}&rdquo;</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="comic-border-sm bg-comic-yellow px-3 py-1 text-sm font-semibold">
              {DIFFICULTY_STARS[pattern.difficulty]}
            </span>
            <span className="comic-border-sm bg-paper px-3 py-1 text-sm font-semibold">
              ⚡ {hero.power}
            </span>
          </div>
        </div>
      </div>

      <p className="relative mt-6 max-w-3xl text-lg font-medium leading-relaxed sm:text-xl">{pattern.oneLiner}</p>

      <dl className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="comic-border-sm bg-paper p-4">
          <dt className="font-comic text-sm tracking-wide text-hero-blue">SUPERPOWER</dt>
          <dd className="mt-1 break-words text-sm leading-snug sm:text-base">{hero.power}</dd>
        </div>
        <div className="comic-border-sm bg-paper p-4">
          <dt className="font-comic text-sm tracking-wide text-action-red">WEAKNESS</dt>
          <dd className="mt-1 break-words text-sm leading-snug sm:text-base">{hero.weakness}</dd>
        </div>
        <div className="comic-border-sm bg-paper p-4">
          <dt className="font-comic text-sm tracking-wide text-comic-yellow-dark">TYPICAL ENEMIES</dt>
          <dd className="mt-1 break-words text-sm leading-snug sm:text-base">{hero.enemies.join(", ")}</dd>
        </div>
      </dl>

      <p className="relative mt-4 text-sm italic text-ink/70 sm:text-base">
        <span className="font-semibold not-italic">Origin story: </span>
        {hero.origin}
      </p>
    </header>
  );
}
