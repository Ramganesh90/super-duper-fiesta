"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  evaluate,
  scoreOf,
  newResource,
  newSubnet,
  EMPTY_STATE,
  PRESETS,
  RESOURCE_META,
  TOGGLE_LABELS,
  PILLAR_LABELS,
  type BuilderState,
  type BuilderResource,
  type ResourceType,
  type AZ,
  type Severity,
  type Pillar,
} from "@/lib/aws/builder";
import { awardAchievement } from "@/lib/aws/progress";
import Celebrate from "@/components/learning/Celebrate";

const STORAGE_KEY = "aws-sa:builder";
const AZS: AZ[] = ["a", "b", "c"];
const ADDABLE: ResourceType[] = ["alb", "ec2", "rds", "nat"];
const PILLAR_ORDER: Pillar[] = ["security", "resilience", "networking", "cost"];

const SEV_ICON: Record<Severity, string> = { pass: "✅", info: "ℹ️", warn: "⚠️", fail: "❌" };
const SEV_RING: Record<"warn" | "fail", string> = {
  warn: "ring-2 ring-amber-500",
  fail: "ring-2 ring-action-red",
};

const SCORE_TONE: Record<string, string> = {
  empty: "bg-paper-dim text-ink/70",
  fail: "bg-action-red/15 text-action-red-dark",
  warn: "bg-comic-yellow/30 text-comic-yellow-dark",
  pass: "bg-emerald-500/20 text-emerald-800",
};

export default function VpcBuilder() {
  const [state, setState] = useState<BuilderState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const idRef = useRef(0);
  // Stable per-instance prefix (via useId) + a counter — unique ids without impure calls.
  const instance = useId();
  const uid = (p: string) => `${p}-${instance}-${idRef.current++}`;

  // Load persisted build on mount (keeps SSR output === first client render).
  useEffect(() => {
    const load = () => {
      let next: BuilderState | null = null;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) next = JSON.parse(raw) as BuilderState;
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

  // Reward a flawless design once with bonus XP in the AWS app.
  useEffect(() => {
    if (score.tone === "pass") awardAchievement("vpc-well-architected", 150);
  }, [score.tone]);

  // Worst severity per target id, for canvas highlighting.
  const sevByTarget = useMemo(() => {
    const m = new Map<string, "warn" | "fail">();
    for (const f of findings) {
      if (f.severity !== "warn" && f.severity !== "fail") continue;
      for (const t of f.targets) {
        if (f.severity === "fail" || m.get(t) !== "fail") m.set(t, f.severity);
      }
    }
    return m;
  }, [findings]);

  // --- mutations ---
  const addSubnet = (tier: "public" | "private") =>
    setState((s) => ({ ...s, subnets: [...s.subnets, newSubnet(tier, "a", uid(tier))] }));

  const removeSubnet = (id: string) =>
    setState((s) => ({ ...s, subnets: s.subnets.filter((sub) => sub.id !== id) }));

  const patchSubnet = (id: string, patch: Partial<{ nacl: boolean; az: AZ }>) =>
    setState((s) => ({
      ...s,
      subnets: s.subnets.map((sub) => (sub.id === id ? { ...sub, ...patch } : sub)),
    }));

  const addResource = (subnetId: string, type: ResourceType) =>
    setState((s) => ({
      ...s,
      subnets: s.subnets.map((sub) =>
        sub.id === subnetId ? { ...sub, resources: [...sub.resources, newResource(type, uid(type))] } : sub
      ),
    }));

  const removeResource = (subnetId: string, rid: string) =>
    setState((s) => ({
      ...s,
      subnets: s.subnets.map((sub) =>
        sub.id === subnetId ? { ...sub, resources: sub.resources.filter((r) => r.id !== rid) } : sub
      ),
    }));

  const toggleResource = (subnetId: string, rid: string, key: keyof BuilderResource) =>
    setState((s) => ({
      ...s,
      subnets: s.subnets.map((sub) =>
        sub.id === subnetId
          ? {
              ...sub,
              resources: sub.resources.map((r) =>
                r.id === rid ? { ...r, [key]: !r[key] } : r
              ),
            }
          : sub
      ),
    }));

  return (
    <div className="flex flex-col gap-6">
      <Celebrate runId={score.tone === "pass" ? 1 : 0} />
      {/* Toolbar */}
      <div className="comic-border-sm flex flex-wrap items-center gap-2 bg-paper p-4">
        <button type="button" onClick={() => addSubnet("public")} className={btn("bg-aws-orange text-ink-fixed")}>
          + Public subnet
        </button>
        <button type="button" onClick={() => addSubnet("private")} className={btn("bg-hero-blue text-paper-fixed")}>
          + Private subnet
        </button>
        <label className="comic-border-sm ml-1 inline-flex items-center gap-2 bg-paper-dim px-3 py-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={state.internetGateway}
            onChange={(e) => setState((s) => ({ ...s, internetGateway: e.target.checked }))}
          />
          🌐 Internet Gateway
        </label>
        <span className="mx-1 hidden text-ink/30 sm:inline">|</span>
        <button type="button" onClick={() => setState(PRESETS.broken())} className={btn("bg-paper")}>
          Load broken example
        </button>
        <button type="button" onClick={() => setState(PRESETS.wellArchitected())} className={btn("bg-paper")}>
          Load well-architected
        </button>
        <button type="button" onClick={() => setState(EMPTY_STATE)} className="ml-auto text-sm font-semibold text-action-red underline-offset-2 hover:underline">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Canvas */}
        <div className="comic-border bg-halftone flex flex-col gap-4 bg-paper-dim p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="font-comic text-lg tracking-wide">
              ☁️ Your VPC
            </p>
            <span
              className={`comic-border-sm px-2 py-0.5 text-xs font-semibold ${
                state.internetGateway ? "bg-emerald-500/20" : "bg-paper"
              }`}
            >
              {state.internetGateway ? "🌐 IGW attached" : "no internet gateway"}
            </span>
          </div>

          {state.subnets.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink/60">
              Add a subnet to begin — then drop in an ALB, app servers, and a database.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {state.subnets.map((sub) => {
                const sev = sevByTarget.get(sub.id);
                return (
                  <div
                    key={sub.id}
                    className={`relative rounded-md border-2 border-dashed p-3 ${
                      sub.tier === "public" ? "border-aws-orange-dark/60 bg-aws-orange/5" : "border-hero-blue/60 bg-hero-blue/5"
                    } ${sev ? SEV_RING[sev] : ""}`}
                  >
                    {sev && (
                      <span className="absolute -right-2 -top-2 text-lg" aria-hidden="true">
                        {sev === "fail" ? "❌" : "⚠️"}
                      </span>
                    )}
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-comic text-sm tracking-wide">
                        {sub.tier === "public" ? "🌤️ Public" : "🔒 Private"} subnet
                      </span>
                      <button type="button" onClick={() => removeSubnet(sub.id)} className="text-xs text-action-red hover:underline">
                        remove
                      </button>
                    </div>

                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-ink/60">AZ:</span>
                      {AZS.map((az) => (
                        <button
                          key={az}
                          type="button"
                          onClick={() => patchSubnet(sub.id, { az })}
                          aria-pressed={sub.az === az}
                          className={`comic-border-sm px-2 py-0.5 font-semibold ${sub.az === az ? "bg-ink text-paper" : "bg-paper"}`}
                        >
                          {az}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => patchSubnet(sub.id, { nacl: !sub.nacl })}
                        aria-pressed={sub.nacl}
                        className={`comic-border-sm ml-1 px-2 py-0.5 font-semibold ${sub.nacl ? "bg-emerald-500/30" : "bg-paper"}`}
                      >
                        {sub.nacl ? "✅ NACL" : "NACL off"}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {sub.resources.map((r) => (
                        <ResourceChip
                          key={r.id}
                          resource={r}
                          sev={sevByTarget.get(r.id)}
                          onToggle={(key) => toggleResource(sub.id, r.id, key)}
                          onRemove={() => removeResource(sub.id, r.id)}
                        />
                      ))}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ADDABLE.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => addResource(sub.id, t)}
                          className="comic-border-sm bg-paper px-2 py-1 text-xs font-semibold transition-transform hover:-translate-y-0.5"
                        >
                          + {RESOURCE_META[t].emoji} {RESOURCE_META[t].label.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-4">
          <div className={`comic-border-sm flex items-center justify-between gap-3 p-4 ${SCORE_TONE[score.tone]}`}>
            <div>
              <p className="font-comic text-lg tracking-wide">{score.grade}</p>
              <p className="text-xs opacity-80">Well-Architected score</p>
            </div>
            <p className="font-comic text-4xl tracking-wide">{score.pct}%</p>
          </div>

          {score.tone === "pass" && (
            <div role="status" className="comic-border-sm bg-emerald-500/15 p-3 text-center text-sm font-semibold text-emerald-800">
              🎉 Well-Architected! You earned <strong>+150 XP</strong> in the AWS app.
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
                        <p className="mt-0.5 text-xs leading-relaxed text-hero-blue">💡 {f.fix}</p>
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

function btn(extra: string) {
  return `comic-border-sm font-comic px-3 py-2 text-sm tracking-wide transition-transform hover:-translate-y-0.5 ${extra}`;
}

function ResourceChip({
  resource,
  sev,
  onToggle,
  onRemove,
}: {
  resource: BuilderResource;
  sev?: "warn" | "fail";
  onToggle: (key: keyof BuilderResource) => void;
  onRemove: () => void;
}) {
  const meta = RESOURCE_META[resource.type];
  return (
    <div className={`comic-border-sm relative bg-paper p-2 ${sev ? SEV_RING[sev] : ""}`}>
      {sev && (
        <span className="absolute -right-2 -top-2 text-base" aria-hidden="true">
          {sev === "fail" ? "❌" : "⚠️"}
        </span>
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm">
          <span className="mr-1" aria-hidden="true">{meta.emoji}</span>
          {meta.label}
        </span>
        <button type="button" onClick={onRemove} className="text-xs text-action-red hover:underline">
          ✕
        </button>
      </div>
      {meta.toggles.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {meta.toggles.map((key) => {
            const active = resource[key] as boolean;
            // publicIp is "risky when on"; others are "good when on".
            const goodWhenOn = key !== "publicIp";
            const onClass = goodWhenOn ? "bg-emerald-500/30" : "bg-action-red/20";
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggle(key)}
                aria-pressed={active}
                className={`comic-border-sm px-2 py-0.5 text-xs font-semibold ${active ? onClass : "bg-paper-dim"}`}
              >
                {active ? "✓ " : ""}
                {TOGGLE_LABELS[key]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
