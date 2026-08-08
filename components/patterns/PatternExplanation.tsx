import type { Pattern } from "@/lib/types";

interface PatternExplanationProps {
  pattern: Pattern;
}

export default function PatternExplanation({ pattern }: PatternExplanationProps) {
  const { explanation } = pattern;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="comic-border-sm bg-emerald-500/10 p-5">
          <h3 className="font-comic text-xl tracking-wide text-emerald-700">✅ USE WHEN</h3>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed sm:text-base">
            {explanation.useWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="comic-border-sm bg-action-red/10 p-5">
          <h3 className="font-comic text-xl tracking-wide text-action-red">🚫 DON&apos;T USE WHEN</h3>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed sm:text-base">
            {explanation.avoidWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="comic-border-sm bg-comic-yellow/15 p-5">
        <h3 className="font-comic text-xl tracking-wide text-comic-yellow-dark">⚠️ COMMON MISTAKES</h3>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed sm:text-base">
          {explanation.commonMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="comic-border-sm bg-hero-blue/10 p-5">
        <h3 className="font-comic text-xl tracking-wide text-hero-blue">🌍 REAL-WORLD EXAMPLE</h3>
        <p className="mt-2 text-sm leading-relaxed sm:text-base">{explanation.realWorldExample}</p>
      </div>
    </div>
  );
}
