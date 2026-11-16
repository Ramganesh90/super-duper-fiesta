"use client";

import { PILLAR_LABELS, PILLAR_ORDER } from "@/lib/design/rules";
import type { Finding, QuickFix, Score, Severity } from "@/lib/design/types";

const SEV_ICON: Record<Severity, string> = { pass: "✅", info: "ℹ️", warn: "⚠️", fail: "❌" };
const SCORE_TONE: Record<string, string> = {
  empty: "bg-paper-dim text-ink/70",
  fail: "bg-action-red/15 text-action-red-dark",
  warn: "bg-comic-yellow/30 text-comic-yellow-dark",
  pass: "bg-emerald-500/20 text-emerald-800",
};

export default function FindingsPanel({
  findings, score, onFocus, onApplyFix,
}: {
  findings: Finding[];
  score: Score;
  onFocus: (ids: string[]) => void;
  onApplyFix: (fix: QuickFix) => void;
}) {
  const problems = findings.filter((f) => f.severity !== "pass");
  return (
    <div className="flex flex-col gap-3">
      <div className={`comic-border-sm flex items-center justify-between gap-3 p-4 ${SCORE_TONE[score.tone]}`}>
        <div>
          <p className="font-comic text-lg tracking-wide">{score.grade}</p>
          <p className="text-xs opacity-80">Design health</p>
        </div>
        <p data-testid="design-score" className="font-comic text-4xl tracking-wide">{score.pct}%</p>
      </div>

      {problems.length === 0 ? (
        <p className="comic-border-sm bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-800">
          🎉 No issues found — this design looks solid.
        </p>
      ) : (
        PILLAR_ORDER.map((pillar) => {
          const group = problems.filter((f) => f.pillar === pillar);
          if (group.length === 0) return null;
          return (
            <div key={pillar} className="comic-border-sm bg-paper p-3">
              <p className="font-comic mb-2 text-sm tracking-wide">{PILLAR_LABELS[pillar]}</p>
              <ul className="flex flex-col gap-2">
                {group.map((f) => (
                  <li
                    key={f.id}
                    className="text-sm"
                    onMouseEnter={() => onFocus(f.nodeIds)}
                    onMouseLeave={() => onFocus([])}
                  >
                    <p className="font-semibold">
                      <span className="mr-1" aria-hidden="true">{SEV_ICON[f.severity]}</span>
                      {f.title}
                    </p>
                    <p className="text-xs leading-relaxed text-ink/70">{f.detail}</p>
                    {f.quickFix && (
                      <button
                        type="button"
                        onClick={() => onApplyFix(f.quickFix!)}
                        className="comic-border-sm mt-1 bg-design-teal px-2 py-0.5 text-xs font-semibold text-ink-fixed transition-transform hover:-translate-y-0.5"
                      >
                        🔧 {f.quickFix.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
