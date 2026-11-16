import { CATALOG } from "./catalog";
import type { Design, NodeLoad } from "./types";

// Propagate load from clients along directed edges, splitting evenly across each
// node's outgoing edges. A per-path visited set makes this terminate on cycles
// and prevents a single path from counting a node twice.
export function simulate(design: Design): Record<string, NodeLoad> {
  const inbound: Record<string, number> = {};
  for (const n of design.nodes) inbound[n.id] = 0;

  const outFrom: Record<string, string[]> = {};
  for (const e of design.edges) (outFrom[e.from] ??= []).push(e.to);

  const visit = (id: string, flow: number, path: Set<string>) => {
    const outs = outFrom[id] ?? [];
    if (outs.length === 0 || flow <= 0) return;
    const share = flow / outs.length;
    for (const to of outs) {
      if (path.has(to)) continue;
      inbound[to] = (inbound[to] ?? 0) + share;
      const next = new Set(path);
      next.add(to);
      visit(to, share, next);
    }
  };

  const rps = Math.max(0, design.rps || 0);
  for (const n of design.nodes) {
    if (n.type === "client") {
      inbound[n.id] = rps;
      visit(n.id, rps, new Set([n.id]));
    }
  }

  const loads: Record<string, NodeLoad> = {};
  for (const n of design.nodes) {
    const perReplica = CATALOG[n.type].capacity;
    const capacity = perReplica > 0 ? perReplica * Math.max(1, n.replicas) : 0;
    const inb = Math.round(inbound[n.id] ?? 0);
    loads[n.id] = {
      inbound: inb,
      capacity,
      util: capacity > 0 ? inb / capacity : 0,
    };
  }
  return loads;
}
