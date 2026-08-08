"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Pattern } from "@/lib/types";

interface GuessThePatternProps {
  patterns: Pattern[];
}

function pickRandom(patterns: Pattern[], excludeId?: string): Pattern {
  const pool = excludeId ? patterns.filter((p) => p.id !== excludeId) : patterns;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function GuessThePattern({ patterns }: GuessThePatternProps) {
  // Deterministic on first render so server and client markup match; swapped for a
  // real random pick immediately after mount (Math.random() can't be used during
  // the initial render without causing a hydration mismatch).
  const [current, setCurrent] = useState<Pattern>(patterns[0]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    // Intentional: standard fix for hydration mismatches from non-deterministic
    // initial state (Math.random()), not a derived-state anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(pickRandom(patterns));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const battle = current.codeBattle;
  const isCorrect = selected === battle.correct;

  const handlePick = (optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    setScore((s) => ({ correct: s.correct + (optionId === battle.correct ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    setCurrent(pickRandom(patterns, current.id));
    setSelected(null);
  };

  return (
    <div className="comic-border bg-halftone-yellow relative overflow-hidden bg-paper p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-comic text-2xl tracking-wide text-action-red sm:text-3xl">🔍 GUESS THE PATTERN</p>
        {score.total > 0 && (
          <p className="font-comic text-sm tracking-wide sm:text-base">
            Score: {score.correct}/{score.total}
          </p>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed sm:text-base">{battle.scenario}</p>
      <p className="font-comic mt-4 text-lg tracking-wide sm:text-xl">{battle.question}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label={battle.question}>
        {battle.options.map((option, i) => {
          const isPicked = selected === option.id;
          const showCorrect = selected && option.id === battle.correct;
          const showWrong = isPicked && option.id !== battle.correct;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePick(option.id)}
              disabled={!!selected}
              className={`comic-border-sm break-words px-4 py-3 text-left text-sm font-semibold transition-colors sm:text-base ${
                showCorrect
                  ? "bg-emerald-500/20"
                  : showWrong
                    ? "bg-action-red/20"
                    : "bg-paper hover:bg-paper-dim"
              }`}
            >
              {String.fromCharCode(65 + i)}. {option.label}
              {showCorrect && <span className="ml-2" aria-hidden="true">✅</span>}
              {showWrong && <span className="ml-2" aria-hidden="true">❌</span>}
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className={`comic-border-sm mt-4 p-4 text-sm sm:text-base ${isCorrect ? "bg-emerald-500/10" : "bg-action-red/10"}`}
        >
          <p className="font-comic tracking-wide">{isCorrect ? "⚡ CORRECT!" : "💥 NOT QUITE"}</p>
          <p className="mt-1">{battle.explanation}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              href={`/patterns/${current.id}`}
              className="comic-border-sm font-comic inline-block bg-hero-blue px-4 py-2 text-paper transition-transform hover:-translate-y-0.5"
            >
              Learn {current.hero.name} →
            </Link>
            <button
              type="button"
              onClick={handleNext}
              className="comic-border-sm font-comic bg-comic-yellow px-4 py-2 text-ink transition-transform hover:-translate-y-0.5"
            >
              Next Challenge ⚡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
