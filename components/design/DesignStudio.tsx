"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Celebrate from "@/components/learning/Celebrate";
import Palette from "./Palette";
import Inspector from "./Inspector";
import FindingsPanel from "./FindingsPanel";
import OutlineView from "./OutlineView";
import { evaluate, scoreOf } from "@/lib/design/rules";
import { simulate } from "@/lib/design/simulate";
import { applyQuickFix, edge, freeCell, makeNode } from "@/lib/design/quickfix";
import { loadStudio, saveStudio, seedStudio, type StudioState } from "@/lib/design/store";
import { TEMPLATES } from "@/lib/design/templates";
import type { ComponentType, Design, OptionKey, QuickFix } from "@/lib/design/types";

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-paper-dim">
      <p className="font-comic text-lg tracking-wide text-ink/50">Loading 3D canvas…</p>
    </div>
  ),
});

export default function DesignStudio() {
  const [studio, setStudio] = useState<StudioState>(() => ({ designs: [], activeId: null }));
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [focusedIds, setFocusedIds] = useState<string[]>([]);
  const [view, setView] = useState<"3d" | "outline">("3d");
  const [webglOk, setWebglOk] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [dark, setDark] = useState(false);
  const [celebrateRun, setCelebrateRun] = useState(0);

  // Hydrate from storage (empty first render matches SSR).
  useEffect(() => {
    const load = () => { setStudio(loadStudio()); setHydrated(true); };
    load();
  }, []);

  useEffect(() => {
    if (hydrated) saveStudio(studio);
  }, [studio, hydrated]);

  // Theme, reduced motion, WebGL support.
  useEffect(() => {
    const readTheme = () => setDark(document.documentElement.dataset.theme === "dark");
    readTheme();
    const obs = new MutationObserver(readTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readMotion = () => setAnimate(!mq.matches);
    readMotion();
    mq.addEventListener?.("change", readMotion);

    const detect = () => {
      try {
        const c = document.createElement("canvas");
        const gl = c.getContext("webgl2") || c.getContext("webgl");
        if (!gl) setWebglOk(false);
      } catch {
        setWebglOk(false);
      }
    };
    detect();

    return () => { obs.disconnect(); mq.removeEventListener?.("change", readMotion); };
  }, []);

  const activeDesign: Design | null = useMemo(
    () => studio.designs.find((d) => d.id === studio.activeId) ?? studio.designs[0] ?? null,
    [studio],
  );

  const findings = useMemo(() => (activeDesign ? evaluate(activeDesign) : []), [activeDesign]);
  const loads = useMemo(() => (activeDesign ? simulate(activeDesign) : {}), [activeDesign]);
  const score = useMemo(() => scoreOf(findings, activeDesign?.nodes.length ?? 0), [findings, activeDesign]);

  const highlight = useMemo(() => {
    const m: Record<string, "warn" | "fail"> = {};
    for (const f of findings) {
      if (f.severity !== "warn" && f.severity !== "fail") continue;
      for (const id of f.nodeIds) if (f.severity === "fail" || m[id] !== "fail") m[id] = f.severity;
    }
    return m;
  }, [findings]);

  // Celebrate the first time a non-empty design reaches a clean pass.
  useEffect(() => {
    if (!activeDesign) return;
    const fire = () => {
      if (score.tone === "pass" && !activeDesign.celebrated) {
        setCelebrateRun((r) => r + 1);
        setStudio((s) => ({ ...s, designs: s.designs.map((d) => (d.id === activeDesign.id ? { ...d, celebrated: true } : d)) }));
      }
    };
    fire();
  }, [score.tone, activeDesign]);

  // ---- mutations ----
  const updateActive = (fn: (d: Design) => Design) =>
    setStudio((s) => ({ ...s, designs: s.designs.map((d) => (d.id === activeDesign?.id ? fn(d) : d)) }));

  const addComponent = (t: ComponentType) =>
    updateActive((d) => ({ ...d, nodes: [...d.nodes, makeNode(t, freeCell(d.nodes))] }));

  const moveNode = (id: string, x: number, z: number) =>
    updateActive((d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, x, z } : n)) }));

  const removeNode = (id: string) => {
    updateActive((d) => ({ ...d, nodes: d.nodes.filter((n) => n.id !== id), edges: d.edges.filter((e) => e.from !== id && e.to !== id) }));
    if (selectedId === id) setSelectedId(null);
    if (connectSource === id) setConnectSource(null);
  };
  const removeEdge = (id: string) => updateActive((d) => ({ ...d, edges: d.edges.filter((e) => e.id !== id) }));

  const renameNode = (id: string, label: string) => updateActive((d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, label } : n)) }));
  const setReplicas = (id: string, n: number) => updateActive((d) => ({ ...d, nodes: d.nodes.map((x) => (x.id === id ? { ...x, replicas: Math.max(1, Math.min(9, n)) } : x)) }));
  const toggleOption = (id: string, opt: OptionKey) =>
    updateActive((d) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, options: { ...n.options, [opt]: !n.options[opt] } } : n)) }));

  const applyFix = (fix: QuickFix) => updateActive((d) => applyQuickFix(d, fix));
  const setRps = (rps: number) => updateActive((d) => ({ ...d, rps }));

  const nodeActivate = (id: string) => {
    if (connectSource && connectSource !== id) {
      const from = connectSource;
      updateActive((d) =>
        d.edges.some((e) => e.from === from && e.to === id) ? d : { ...d, edges: [...d.edges, edge(from, id)] },
      );
      setConnectSource(null);
    } else {
      setSelectedId(id);
    }
  };

  // ---- design management ----
  const newFromTemplate = (key: string) => {
    const d = TEMPLATES.find((t) => t.key === key)!.make();
    setStudio((s) => ({ designs: [...s.designs, d], activeId: d.id }));
    setSelectedId(null); setConnectSource(null);
  };
  const switchDesign = (id: string) => { setStudio((s) => ({ ...s, activeId: id })); setSelectedId(null); setConnectSource(null); };
  const renameDesign = (name: string) => setStudio((s) => ({ ...s, designs: s.designs.map((d) => (d.id === activeDesign?.id ? { ...d, name } : d)) }));
  const duplicateDesign = () => {
    if (!activeDesign) return;
    const copy = TEMPLATES[0].make(); // reuse id generator path
    const dup: Design = { ...activeDesign, id: copy.id, name: `${activeDesign.name} (copy)`, celebrated: false };
    setStudio((s) => ({ designs: [...s.designs, dup], activeId: dup.id }));
  };
  const deleteDesign = () => {
    if (!activeDesign) return;
    setStudio((s) => {
      const rest = s.designs.filter((d) => d.id !== activeDesign.id);
      const next = rest.length ? rest : seedStudio().designs;
      return { designs: next, activeId: next[0].id };
    });
    setSelectedId(null);
  };

  const selectedNode = activeDesign?.nodes.find((n) => n.id === selectedId) ?? null;
  const showScene = view === "3d" && webglOk;

  if (!activeDesign) {
    return <div className="comic-border bg-paper p-8 text-center text-ink/60">Loading studio…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Celebrate runId={celebrateRun} />

      {/* Toolbar */}
      <div className="comic-border-sm flex flex-wrap items-center gap-2 bg-paper p-3">
        <select
          value={activeDesign.id}
          onChange={(e) => switchDesign(e.target.value)}
          className="comic-border-sm bg-paper-dim px-2 py-1 text-sm font-semibold"
          aria-label="Switch design"
        >
          {studio.designs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input
          value={activeDesign.name}
          onChange={(e) => renameDesign(e.target.value)}
          className="comic-border-sm bg-paper px-2 py-1 text-sm"
          aria-label="Rename current design"
        />
        <button type="button" onClick={duplicateDesign} className="comic-border-sm bg-paper px-2 py-1 text-xs font-semibold hover:-translate-y-0.5">Duplicate</button>
        <button type="button" onClick={deleteDesign} className="comic-border-sm bg-paper px-2 py-1 text-xs font-semibold text-action-red hover:-translate-y-0.5">Delete</button>
        <span className="mx-1 hidden text-ink/30 sm:inline">|</span>
        <select onChange={(e) => { if (e.target.value) { newFromTemplate(e.target.value); e.target.value = ""; } }} defaultValue="" className="comic-border-sm bg-design-teal px-2 py-1 text-xs font-semibold text-ink-fixed" aria-label="New design from template">
          <option value="" disabled>+ New from template…</option>
          {TEMPLATES.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs font-semibold">
            Load
            <input type="range" min={0} max={50000} step={1000} value={activeDesign.rps} onChange={(e) => setRps(Number(e.target.value))} aria-label="Requests per second" />
            <span className="w-16 tabular-nums">{activeDesign.rps.toLocaleString()} rps</span>
          </label>
          {webglOk && (
            <button type="button" onClick={() => setView(view === "3d" ? "outline" : "3d")} className="comic-border-sm bg-paper px-2 py-1 text-xs font-semibold">
              {view === "3d" ? "📋 Outline" : "🧊 3D"}
            </button>
          )}
        </div>
      </div>

      {connectSource && (
        <div className="comic-border-sm bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-800">
          Connect mode: click a target component to draw an arrow from the selected one. <button type="button" className="underline" onClick={() => setConnectSource(null)}>cancel</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_20rem]">
        {/* Canvas / outline */}
        <div className="flex flex-col gap-4">
          {!webglOk && (
            <p className="comic-border-sm bg-comic-yellow/20 p-2 text-xs">
              3D isn&apos;t available here, so you&apos;re using the outline view — all features still work.
            </p>
          )}
          {showScene ? (
            <div className="comic-border h-[60vh] min-h-[420px] overflow-hidden">
              <Scene3D
                design={activeDesign}
                loads={loads}
                highlight={highlight}
                selectedId={selectedId}
                focusedIds={focusedIds}
                connectSourceId={connectSource}
                animate={animate}
                dark={dark}
                onSelectNode={nodeActivate}
                onMoveNode={moveNode}
                onBackground={() => { setSelectedId(null); }}
              />
            </div>
          ) : (
            <OutlineView
              design={activeDesign}
              highlight={highlight}
              selectedId={selectedId}
              connectSource={connectSource}
              onSelect={setSelectedId}
              onNodeActivate={nodeActivate}
              onRemoveNode={removeNode}
              onRemoveEdge={removeEdge}
            />
          )}
          <div className="comic-border-sm bg-paper p-4">
            <Palette onAdd={addComponent} />
          </div>
        </div>

        {/* Side panels */}
        <div className="flex flex-col gap-4">
          <Inspector
            node={selectedNode}
            load={selectedNode ? loads[selectedNode.id] : undefined}
            findings={findings}
            connectSource={connectSource}
            onRename={renameNode}
            onReplicas={setReplicas}
            onToggleOption={toggleOption}
            onDelete={removeNode}
            onStartConnect={(id) => { setSelectedId(id); setConnectSource(id); }}
            onCancelConnect={() => setConnectSource(null)}
          />
          <FindingsPanel findings={findings} score={score} onFocus={setFocusedIds} onApplyFix={applyFix} />
        </div>
      </div>
    </div>
  );
}
