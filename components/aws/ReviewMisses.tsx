"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMissedQuestions, recordMisses } from "@/lib/aws/progress";
import { getQuestionsByIds, type ExamQuestion } from "@/lib/aws/exam";

// Spaced-repetition-lite: quiz the questions you've previously missed (from the
// mock exam or weekly quizzes). Answering one correctly clears it from the list.
export default function ReviewMisses() {
  const [queue, setQueue] = useState<ExamQuestion[]>([]);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);
  const [ready, setReady] = useState(false);

  // Load the current miss list once on mount.
  useEffect(() => {
    const load = () => {
      setQueue(getQuestionsByIds(getMissedQuestions()));
      setReady(true);
    };
    load();
  }, []);

  if (!ready) {
    return <p className="py-10 text-center text-sm text-ink/60">Loading…</p>;
  }

  if (queue.length === 0) {
    return (
      <div className="comic-border-sm flex flex-col items-center gap-3 bg-paper p-8 text-center">
        <span className="text-5xl" aria-hidden="true">🎯</span>
        <p className="font-comic text-xl tracking-wide">No misses to review!</p>
        <p className="text-sm text-ink/70">
          Take a mock exam or a weekly quiz — any questions you get wrong will collect here for focused review.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/aws/exam" className="comic-border-sm font-comic bg-aws-orange px-4 py-2 text-sm tracking-wide text-ink-fixed hover:-translate-y-0.5">
            Take a mock exam
          </Link>
          <Link href="/aws" className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm tracking-wide hover:-translate-y-0.5">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const q = queue[pos];
  const isCorrect = selected === q.answer;
  const remaining = queue.length - clearedCount;

  const check = () => {
    if (!selected) return;
    setRevealed(true);
    if (selected === q.answer) {
      recordMisses([], [q.id]); // clear this miss
      setClearedCount((n) => n + 1);
    }
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setPos((p) => (p + 1) % queue.length);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="comic-border-sm flex items-center justify-between bg-paper p-3 text-sm font-semibold">
        <span>Reviewing {queue.length} missed question(s)</span>
        <span>✅ {clearedCount} cleared · {remaining} left</span>
      </div>

      <fieldset className="comic-border-sm bg-paper p-5">
        <legend className="font-comic px-2 text-lg tracking-wide sm:text-xl">{q.question}</legend>
        <div className="mt-3 flex flex-col gap-3" role="radiogroup" aria-label={q.question}>
          {q.options.map((opt) => {
            const showCorrect = revealed && opt === q.answer;
            const showWrong = revealed && selected === opt && opt !== q.answer;
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={selected === opt}
                disabled={revealed}
                onClick={() => setSelected(opt)}
                className={`comic-border-sm break-words px-4 py-3 text-left text-sm transition-colors sm:text-base ${
                  showCorrect ? "bg-emerald-500/20" : showWrong ? "bg-action-red/20" : selected === opt ? "bg-comic-yellow/30" : "bg-paper hover:bg-paper-dim"
                }`}
              >
                {opt}
                {showCorrect && <span className="ml-2" aria-hidden="true">✅</span>}
                {showWrong && <span className="ml-2" aria-hidden="true">❌</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      {revealed && (
        <div className={`comic-border-sm p-4 text-sm sm:text-base ${isCorrect ? "bg-emerald-500/10" : "bg-action-red/10"}`}>
          <p className="font-comic tracking-wide">{isCorrect ? "⚡ CORRECT — cleared from your misses!" : "💥 NOT QUITE — stays for next time"}</p>
          <p className="mt-1">{q.explanation}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!revealed ? (
          <button type="button" onClick={check} disabled={!selected} className="comic-border-sm font-comic bg-hero-blue px-4 py-2 text-paper-fixed transition-transform hover:-translate-y-0.5 disabled:opacity-40">
            Check
          </button>
        ) : (
          <button type="button" onClick={next} className="comic-border-sm font-comic bg-aws-orange px-4 py-2 text-ink-fixed transition-transform hover:-translate-y-0.5">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
