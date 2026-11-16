"use client";

import { iconUrl } from "@/lib/design/catalog";
import type { Design } from "@/lib/design/types";

// A plain-DOM view of the same graph — keyboard & screen-reader friendly, and the
// fallback when WebGL is unavailable. Mirrors the 3D canvas's select/connect/delete.
export default function OutlineView({
  design, highlight, selectedId, connectSource,
  onSelect, onNodeActivate, onRemoveNode, onRemoveEdge,
}: {
  design: Design;
  highlight: Record<string, "warn" | "fail">;
  selectedId: string | null;
  connectSource: string | null;
  onSelect: (id: string) => void;
  onNodeActivate: (id: string) => void; // click = select, or complete a connection if a source is set
  onRemoveNode: (id: string) => void;
  onRemoveEdge: (id: string) => void;
}) {
  const nameOf = (id: string) => design.nodes.find((n) => n.id === id)?.label ?? "?";
  return (
    <div className="comic-border-sm flex flex-col gap-4 bg-paper-dim p-4">
      <div>
        <h3 className="font-comic mb-2 text-lg tracking-wide">📋 Components ({design.nodes.length})</h3>
        {design.nodes.length === 0 ? (
          <p className="text-sm text-ink/60">No components yet. Add some from the palette.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {design.nodes.map((n) => {
              const hl = highlight[n.id];
              return (
                <li
                  key={n.id}
                  className={`comic-border-sm flex items-center justify-between gap-2 bg-paper px-3 py-1.5 text-sm ${
                    selectedId === n.id ? "ring-2 ring-hero-blue" : ""
                  } ${hl === "fail" ? "ring-2 ring-action-red" : hl === "warn" ? "ring-2 ring-amber-500" : ""}`}
                >
                  <button type="button" onClick={() => onNodeActivate(n.id)} className="flex flex-1 items-center gap-2 text-left font-semibold">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconUrl(n.type)} alt="" width={18} height={18} className="shrink-0 rounded-[3px] bg-white" />
                    {n.label}
                    {n.replicas > 1 ? <span className="text-ink/50"> ×{n.replicas}</span> : null}
                    {connectSource === n.id ? <span className="text-emerald-700"> (connecting…)</span> : null}
                    {hl ? <span aria-hidden="true"> {hl === "fail" ? "❌" : "⚠️"}</span> : null}
                  </button>
                  <button type="button" onClick={() => onSelect(n.id)} className="text-xs text-hero-blue hover:underline">edit</button>
                  <button type="button" onClick={() => onRemoveNode(n.id)} className="text-xs text-action-red hover:underline">✕</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-comic mb-2 text-lg tracking-wide">🔗 Connections ({design.edges.length})</h3>
        {design.edges.length === 0 ? (
          <p className="text-sm text-ink/60">No connections yet. Select a node, choose &ldquo;Connect from here&rdquo;, then pick a target.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {design.edges.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{nameOf(e.from)} <span aria-hidden="true">→</span> {nameOf(e.to)}</span>
                <button type="button" onClick={() => onRemoveEdge(e.id)} className="text-xs text-action-red hover:underline">remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
