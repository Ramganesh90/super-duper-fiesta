"use client";

import { useEffect, useMemo, useState } from "react";
import {
  evaluate,
  scoreOf,
  emptyState,
  PRESETS,
  USE_CASES,
  CAPABILITIES,
  PILLAR_LABELS,
  type PipelineState,
  type CapabilityKey,
  type Severity,
  type Pillar,
  type UseCase,
} from "@/lib/ai/pipeline";
import { awardAchievement } from "@/lib/ai/progress";

const STORAGE_KEY = "ai-eng:pipeline";
const PILLAR_ORDER: Pillar[] = ["quality", "safety", "evaluation", "ops"];
const SEV_ICON: Record<Severity, string> = { pass: "✅", info: "ℹ️", warn: "⚠️", fail: "❌" };
const SEV_RING: Record<"warn" | "fail", string> = {
  warn: "ring-2 ring-amber-500",
  fail: "ring-2 ring-action-red",
};
const SCORE_TONE: Record<string, string> = {
  fail: "bg-action-red/15 text-action-red-dark",
  warn: "bg-comic-yellow/30 text-comic-yellow-dark",
  pass: "bg-emerald-500/20 text-emerald-800",
};

// Ordered stages shown in the pipeline flow strip, with the capability that powers each.
const FLOW: { label: string; emoji: string; cap?: CapabilityKey; always?: boolean }[] = [
  { label: "Input", emoji: "💬", always: true },
  { label: "Input guard", emoji: "🛂", cap: "inputGuardrail" },
  { label: "Retrieval", emoji: "🗄️", cap: "retrieval" },
  { label: "LLM", emoji: "🧠", always: true },
  { label: "Tools", emoji: "🛠️", cap: "tools" },
  { label: "Output guard", emoji: "🧯", cap: "outputGuardrail" },
  { label: "Output", emoji: "📤", always: true },
];

export default function PipelineBuilder() {
  const [state, setState] = useState<PipelineState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = () => {
      let next: PipelineState | null = null;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) next = JSON.parse(raw) as PipelineState;
      } catch {
        /* ignore */
      }
      if (next) setState(next);
      setHydrated(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const findings = useMemo(() => evaluate(state), [state]);
  const score = useMemo(() => scoreOf(findings), [findings]);

  // Reward a production-ready pipeline once with bonus XP in the AI app.
  useEffect(() => {
    if (score.tone === "pass") awardAchievement("ai-production-ready", 150);
  }, [score.tone]);

  const sevByTarget = useMemo(() => {
    const m = new Map<CapabilityKey, "warn" | "fail">();
    for (const f of findings) {
      if (f.severity !== "warn" && f.severity !== "fail") continue;
      for (const t of f.targets) {
        if (f.severity === "fail" || m.get(t) !== "fail") m.set(t, f.severity);
      }
    }
    return m;
  }, [findings]);

  const setUseCase = (useCase: UseCase) => setState((s) => ({ ...s, useCase }));
  const toggleCap = (key: CapabilityKey) =>
    setState((s) => ({ ...s, caps: { ...s.caps, [key]: !s.caps[key] } }));
  const setModel = (modelSize: "small" | "large") => setState((s) => ({ ...s, modelSize }));

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="comic-border-sm flex flex-wrap items-center gap-2 bg-paper p-4">
        <span className="font-comic text-sm tracking-wide">Use case:</span>
        {USE_CASES.map((u) => (
          <button
            key={u.key}
            type="button"
            onClick={() => setUseCase(u.key)}
            aria-pressed={state.useCase === u.key}
            title={u.blurb}
            className={`comic-border-sm px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
              state.useCase === u.key ? "bg-ai-violet text-paper" : "bg-paper"
            }`}
          >
            {u.emoji} {u.label}
          </button>
        ))}
        <button type="button" onClick={() => setState(PRESETS.naive())} className="comic-border-sm ml-auto bg-paper px-3 py-1.5 text-sm font-semibold hover:-translate-y-0.5">
          Load naive demo
        </button>
        <button type="button" onClick={() => setState(PRESETS.production())} className="comic-border-sm bg-paper px-3 py-1.5 text-sm font-semibold hover:-translate-y-0.5">
          Load production-ready
        </button>
      </div>

      {/* Pipeline flow strip */}
      <div className="comic-border bg-halftone flex flex-wrap items-center justify-center gap-1 bg-paper-dim p-4">
        {FLOW.map((stage, i) => {
          const present = stage.always || (stage.cap ? state.caps[stage.cap] : false);
          const sev = stage.cap ? sevByTarget.get(stage.cap) : undefined;
          return (
            <div key={stage.label} className="flex items-center">
              <div
                className={`comic-border-sm relative flex min-w-[5.5rem] flex-col items-center px-2 py-2 text-center text-xs font-semibold ${
                  present ? "bg-paper" : "border-dashed bg-paper-dim text-ink/40"
                } ${sev ? SEV_RING[sev] : ""}`}
              >
                {sev && <span className="absolute -right-2 -top-2 text-sm" aria-hidden="true">{sev === "fail" ? "❌" : "⚠️"}</span>}
                <span aria-hidden="true" className="text-lg">{stage.emoji}</span>
                {stage.label}
                {!present && !stage.always && <span className="text-[10px] font-normal">(off)</span>}
              </div>
              {i < FLOW.length - 1 && <span className="px-1 text-ink/40" aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="comic-border-sm flex flex-wrap items-center gap-2 bg-paper p-4">
            <span className="font-comic text-sm tracking-wide">Model size:</span>
            {(["small", "large"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModel(m)}
                aria-pressed={state.modelSize === m}
                className={`comic-border-sm px-3 py-1 text-sm font-semibold ${state.modelSize === m ? "bg-ink text-paper" : "bg-paper"}`}
              >
                {m === "small" ? "🐣 Small / cheap" : "🦣 Large"}
              </button>
            ))}
          </div>

          {PILLAR_ORDER.map((pillar) => {
            const caps = CAPABILITIES.filter((cap) => cap.pillar === pillar);
            return (
              <div key={pillar} className="comic-border-sm bg-paper p-4">
                <p className="font-comic mb-2 text-sm tracking-wide">{PILLAR_LABELS[pillar]}</p>
                <div className="flex flex-wrap gap-2">
                  {caps.map((cap) => {
                    const active = state.caps[cap.key];
                    const sev = sevByTarget.get(cap.key);
                    return (
                      <button
                        key={cap.key}
                        type="button"
                        onClick={() => toggleCap(cap.key)}
                        aria-pressed={active}
                        className={`comic-border-sm relative px-3 py-1.5 text-sm font-semibold transition-colors ${
                          active ? "bg-emerald-500/25" : "bg-paper-dim"
                        } ${sev ? SEV_RING[sev] : ""}`}
                      >
                        {sev && <span className="absolute -right-2 -top-2 text-xs" aria-hidden="true">{sev === "fail" ? "❌" : "⚠️"}</span>}
                        <span aria-hidden="true" className="mr-1">{cap.emoji}</span>
                        {active ? "✓ " : ""}{cap.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-4">
          <div className={`comic-border-sm flex items-center justify-between gap-3 p-4 ${SCORE_TONE[score.tone]}`}>
            <div>
              <p className="font-comic text-lg tracking-wide">{score.grade}</p>
              <p className="text-xs opacity-80">Production-readiness score</p>
            </div>
            <p className="font-comic text-4xl tracking-wide">{score.pct}%</p>
          </div>

          {score.tone === "pass" && (
            <div role="status" className="comic-border-sm bg-emerald-500/15 p-3 text-center text-sm font-semibold text-emerald-800">
              🎉 Production-ready! You earned <strong>+150 XP</strong> in the AI app.
            </div>
          )}

          {PILLAR_ORDER.map((pillar) => {
            const group = findings.filter((f) => f.pillar === pillar);
            if (group.length === 0) return null;
            return (
              <div key={pillar} className="comic-border-sm bg-paper p-4">
                <p className="font-comic mb-2 text-sm tracking-wide">{PILLAR_LABELS[pillar]}</p>
                <ul className="flex flex-col gap-2">
                  {group.map((f) => (
                    <li key={f.id} className="text-sm">
                      <p className="font-semibold">
                        <span className="mr-1" aria-hidden="true">{SEV_ICON[f.severity]}</span>
                        {f.title}
                      </p>
                      <p className="text-xs leading-relaxed text-ink/70">{f.detail}</p>
                      {f.fix && f.severity !== "pass" && (
                        <p className="mt-0.5 text-xs leading-relaxed text-ai-violet-dark">💡 {f.fix}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
