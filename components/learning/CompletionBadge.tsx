interface CompletionBadgeProps {
  heroName: string;
}

export default function CompletionBadge({ heroName }: CompletionBadgeProps) {
  return (
    <div
      role="status"
      className="comic-border flex flex-col items-center gap-2 bg-comic-yellow p-6 text-center text-ink"
    >
      <span className="text-5xl" aria-hidden="true">
        🏆
      </span>
      <p className="font-comic text-2xl tracking-wide sm:text-3xl">PATTERN MASTERED</p>
      <p className="text-sm sm:text-base">
        You&apos;ve trained with <strong>{heroName}</strong> and passed the quiz. This pattern is officially yours.
      </p>
    </div>
  );
}
