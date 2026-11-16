"use client";

import { CATALOG, AWS_SERVICE, iconUrl } from "@/lib/design/catalog";
import type { DesignNode, Finding, NodeLoad, OptionKey } from "@/lib/design/types";

const OPTION_LABELS: Record<OptionKey, string> = {
  replica: "Replica",
  backups: "Backups",
  stateless: "Stateless",
  autoscale: "Autoscale",
  rateLimit: "Rate limiting",
  encrypted: "Encrypted",
};

export default function Inspector({
  node, load, findings, connectSource,
  onRename, onReplicas, onToggleOption, onDelete, onStartConnect, onCancelConnect,
}: {
  node: DesignNode | null;
  load?: NodeLoad;
  findings: Finding[];
  connectSource: string | null;
  onRename: (id: string, label: string) => void;
  onReplicas: (id: string, n: number) => void;
  onToggleOption: (id: string, opt: OptionKey) => void;
  onDelete: (id: string) => void;
  onStartConnect: (id: string) => void;
  onCancelConnect: () => void;
}) {
  if (!node) {
    return (
      <div className="comic-border-sm bg-paper p-4 text-sm text-ink/60">
        Select a component to edit it. Tip: drag nodes to arrange, scroll to zoom, drag the floor to orbit.
      </div>
    );
  }
  const entry = CATALOG[node.type];
  const connecting = connectSource === node.id;
  const mine = findings.filter((f) => f.nodeIds.includes(node.id));

  return (
    <div className="comic-border-sm flex flex-col gap-3 bg-paper p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-comic text-lg tracking-wide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconUrl(node.type)} alt="" width={24} height={24} className="shrink-0 rounded bg-white" />
          {entry.label}
        </span>
        <button type="button" onClick={() => onDelete(node.id)} className="text-xs font-semibold text-action-red hover:underline">
          delete
        </button>
      </div>
      <p className="-mt-1 text-xs text-ink/50">{AWS_SERVICE[node.type]}</p>

      <label className="flex flex-col gap-1 text-xs font-semibold">
        Label
        <input
          value={node.label}
          onChange={(e) => onRename(node.id, e.target.value)}
          className="comic-border-sm bg-paper-dim px-2 py-1 text-sm font-normal"
        />
      </label>

      {entry.scalable && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Replicas</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onReplicas(node.id, node.replicas - 1)} className="comic-border-sm bg-paper px-2 font-bold">−</button>
            <span className="w-6 text-center font-comic">{node.replicas}</span>
            <button type="button" onClick={() => onReplicas(node.id, node.replicas + 1)} className="comic-border-sm bg-paper px-2 font-bold">+</button>
          </div>
        </div>
      )}

      {entry.options.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onToggleOption(node.id, opt)}
              aria-pressed={!!node.options[opt]}
              className={`comic-border-sm px-2 py-1 text-xs font-semibold ${node.options[opt] ? "bg-emerald-500/25" : "bg-paper-dim"}`}
            >
              {node.options[opt] ? "✓ " : ""}{OPTION_LABELS[opt]}
            </button>
          ))}
        </div>
      )}

      {load && load.capacity > 0 && (
        <p className="text-xs text-ink/70">
          Load: ~{load.inbound} / {load.capacity} rps ({Math.round(load.util * 100)}%)
        </p>
      )}

      <button
        type="button"
        onClick={() => (connecting ? onCancelConnect() : onStartConnect(node.id))}
        className={`comic-border-sm px-3 py-1.5 text-sm font-semibold ${connecting ? "bg-emerald-500/30" : "bg-paper"}`}
      >
        {connecting ? "Click a target node… (cancel)" : "🔗 Connect from here"}
      </button>

      {mine.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-dashed border-ink/20 pt-2">
          <p className="text-xs font-semibold">Issues with this component</p>
          {mine.map((f) => (
            <p key={f.id} className="text-xs text-ink/70">
              {f.severity === "fail" ? "❌" : f.severity === "warn" ? "⚠️" : "ℹ️"} {f.title}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
