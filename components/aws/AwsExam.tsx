"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { pickExam, PASS_PCT, type ExamQuestion } from "@/lib/aws/exam";
import { recordMisses } from "@/lib/aws/progress";
import { DOMAIN_SHORT, DOMAIN_ICONS, DOMAIN_ORDER, type AwsDomain } from "@/lib/aws/types";

type Phase = "config" | "running" | "done";

interface ExamConfig {
  count: number;
  minutes: number;
  label: string;
}

const CONFIGS: ExamConfig[] = [
  { count: 20, minutes: 25, label: "Quick (20 Q · 25 min)" },
  { count: 40, minutes: 50, label: "Half (40 Q · 50 min)" },
  { count: 65, minutes: 90, label: "Full exam (65 Q · 90 min)" },
];

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AwsExam() {
  const [phase, setPhase] = useState<Phase>("config");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pos, setPos] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const start = (cfg: ExamConfig) => {
    setQuestions(pickExam(cfg.count));
    setAnswers({});
    setPos(0);
    setRemaining(cfg.minutes * 60);
    setPhase("running");
  };

  // Countdown; auto-submits at zero.
  useEffect(() => {
    if (phase !== "running") return;
    const finish = () => setPhase("done");
    const tick = () => setRemaining((r) => r - 1);
    if (remaining <= 0) {
      finish();
      return;
    }
    const t = setTimeout(tick, 1000);
    return () => clearTimeout(t);
  }, [phase, remaining]);

  // Record misses once, when the exam finishes.
  useEffect(() => {
    if (phase !== "done" || questions.length === 0) return;
    const wrong: string[] = [];
    const right: string[] = [];
    for (const q of questions) {
      (answers[q.id] === q.answer ? right : wrong).push(q.id);
    }
    recordMisses(wrong, right);
  }, [phase, questions, answers]);

  const results = useMemo(() => {
    if (phase !== "done") return null;
    let correct = 0;
    const byDomain: Record<string, { correct: number; total: number }> = {};
    for (const q of questions) {
      const ok = answers[q.id] === q.answer;
      if (ok) correct++;
      const d = (byDomain[q.domain] ??= { correct: 0, total: 0 });
      d.total++;
      if (ok) d.correct++;
    }
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    return { correct, pct, byDomain, passed: pct >= PASS_PCT };
  }, [phase, questions, answers]);

  // ---- Config screen ----
  if (phase === "config") {
    return (
      <div className="comic-border-sm flex flex-col gap-4 bg-paper p-6">
        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
          A timed, mixed-domain mock exam drawn from every week. Pick a length — the real
          SAA-C03 is 65 questions in 130 minutes with a ~{PASS_PCT}% passing score.
        </p>
        <div className="flex flex-wrap gap-3">
          {CONFIGS.map((cfg) => (
            <button
              key={cfg.count}
              type="button"
              onClick={() => start(cfg)}
              className="comic-border-sm font-comic bg-aws-orange px-4 py-3 text-sm tracking-wide text-ink-fixed transition-transform hover:-translate-y-0.5"
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---- Running ----
  if (phase === "running") {
    const q = questions[pos];
    const chosen = answers[q.id];
    const isLast = pos === questions.length - 1;
    return (
      <div className="flex flex-col gap-4">
        <div className="comic-border-sm flex items-center justify-between gap-3 bg-paper p-3 text-sm font-semibold">
          <span>Question {pos + 1} of {questions.length}</span>
          <span className={remaining <= 60 ? "text-action-red" : ""}>⏱️ {fmt(remaining)}</span>
        </div>

        <fieldset className="comic-border-sm bg-paper p-5">
          <legend className="font-comic px-2 text-lg tracking-wide sm:text-xl">{q.question}</legend>
          <div className="mt-3 flex flex-col gap-3" role="radiogroup" aria-label={q.question}>
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={chosen === opt}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                className={`comic-border-sm break-words px-4 py-3 text-left text-sm transition-colors sm:text-base ${
                  chosen === opt ? "bg-comic-yellow/30" : "bg-paper hover:bg-paper-dim"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPos((p) => Math.max(0, p - 1))}
            disabled={pos === 0}
            className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-ink/60">
            {Object.keys(answers).length}/{questions.length} answered
          </span>
          {isLast ? (
            <button
              type="button"
              onClick={() => setPhase("done")}
              className="comic-border-sm font-comic bg-action-red px-4 py-2 text-sm text-paper-fixed transition-transform hover:-translate-y-0.5"
            >
              Submit exam
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPos((p) => Math.min(questions.length - 1, p + 1))}
              className="comic-border-sm font-comic bg-hero-blue px-4 py-2 text-sm text-paper-fixed transition-transform hover:-translate-y-0.5"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- Results ----
  if (!results) return null;
  const missed = questions.filter((q) => answers[q.id] !== q.answer);
  return (
    <div className="flex flex-col gap-6">
      <div className={`comic-border flex flex-col items-center gap-2 p-6 text-center ${results.passed ? "bg-emerald-500/15" : "bg-action-red/10"}`}>
        <p className="font-comic text-5xl tracking-wide">{results.pct}%</p>
        <p className="font-comic text-2xl tracking-wide">
          {results.passed ? "PASS 🎉" : "Keep studying 💪"}
        </p>
        <p className="text-sm text-ink/70">
          {results.correct} / {questions.length} correct · passing is ~{PASS_PCT}%
        </p>
      </div>

      <div className="comic-border-sm bg-paper p-5">
        <h3 className="font-comic mb-3 text-xl tracking-wide">📊 BY DOMAIN (your weak areas)</h3>
        <ul className="flex flex-col gap-3">
          {DOMAIN_ORDER.filter((d) => results.byDomain[d]).map((d) => {
            const { correct, total } = results.byDomain[d as AwsDomain];
            const pct = Math.round((correct / total) * 100);
            return (
              <li key={d}>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{DOMAIN_ICONS[d as AwsDomain]} {DOMAIN_SHORT[d as AwsDomain]}</span>
                  <span className={pct < PASS_PCT ? "text-action-red" : "text-emerald-700"}>
                    {correct}/{total} · {pct}%
                  </span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full border-2 border-ink bg-paper-dim">
                  <div className={`h-full ${pct < PASS_PCT ? "bg-action-red" : "bg-emerald-500"}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {missed.length > 0 && (
        <div className="comic-border-sm bg-paper p-5">
          <h3 className="font-comic mb-3 text-xl tracking-wide">❌ REVIEW YOUR MISSES ({missed.length})</h3>
          <ul className="flex flex-col gap-4">
            {missed.map((q) => (
              <li key={q.id} className="text-sm">
                <p className="font-semibold">{q.question}</p>
                <p className="mt-1 text-emerald-700">✅ {q.answer}</p>
                <p className="mt-0.5 text-ink/70">{q.explanation}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink/60">
            These are saved — revisit them anytime from the dashboard&apos;s &ldquo;Review your misses&rdquo;.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setPhase("config")}
          className="comic-border-sm font-comic bg-aws-orange px-4 py-2 text-sm tracking-wide text-ink-fixed transition-transform hover:-translate-y-0.5"
        >
          Take another
        </button>
        <Link
          href="/aws"
          className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm tracking-wide transition-transform hover:-translate-y-0.5"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
