import { CATALOG } from "./catalog";
import type { ComponentType, Design, DesignEdge, DesignNode, NodeOptions, QuickFix } from "./types";

// Module-scope id generation (never called during React render).
let counter = 0;
export function uid(prefix: string): string {
  counter += 1;
  try {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  } catch {
    return `${prefix}-${counter}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  }
}

// Find the first free grid cell near the center, spiralling outward.
export function freeCell(nodes: DesignNode[]): { x: number; z: number } {
  const taken = new Set(nodes.map((n) => `${n.x},${n.z}`));
  for (let r = 0; r < 12; r++) {
    for (let x = -r; x <= r; x++) {
      for (let z = -r; z <= r; z++) {
        if (Math.max(Math.abs(x), Math.abs(z)) !== r) continue;
        if (!taken.has(`${x},${z}`)) return { x, z };
      }
    }
  }
  return { x: 0, z: nodes.length };
}

export function defaultOptions(type: ComponentType): NodeOptions {
  const opts: NodeOptions = {};
  // Sensible, teaching-friendly defaults: start insecure/single so findings guide the user.
  for (const o of CATALOG[type].options) opts[o] = false;
  return opts;
}

export function makeNode(type: ComponentType, cell: { x: number; z: number }, label?: string): DesignNode {
  return {
    id: uid(type),
    type,
    label: label || CATALOG[type].label,
    x: cell.x,
    z: cell.z,
    replicas: 1,
    options: defaultOptions(type),
  };
}

export function applyQuickFix(design: Design, fix: QuickFix): Design {
  const nodes = design.nodes.map((n) => ({ ...n, options: { ...n.options } }));
  let edges = design.edges.slice();

  if (fix.kind === "set-option") {
    const n = nodes.find((x) => x.id === fix.nodeId);
    if (n) n.options = { ...n.options, [fix.option]: fix.value };
  } else if (fix.kind === "set-replicas") {
    const n = nodes.find((x) => x.id === fix.nodeId);
    if (n) n.replicas = Math.max(1, fix.replicas);
  } else if (fix.kind === "remove-node") {
    const idx = nodes.findIndex((x) => x.id === fix.nodeId);
    if (idx >= 0) nodes.splice(idx, 1);
    edges = edges.filter((e) => e.from !== fix.nodeId && e.to !== fix.nodeId);
  } else if (fix.kind === "add-node") {
    if (fix.removeEdges?.length) {
      const rm = new Set(fix.removeEdges);
      edges = edges.filter((e) => !rm.has(e.id));
    }
    const node = makeNode(fix.nodeType, freeCell(nodes), fix.label);
    nodes.push(node);
    for (const fromId of fix.from ?? []) {
      if (nodes.some((n) => n.id === fromId)) edges.push(edge(fromId, node.id));
    }
    for (const toId of fix.to ?? []) {
      if (nodes.some((n) => n.id === toId)) edges.push(edge(node.id, toId));
    }
  }

  return { ...design, nodes, edges };
}

export function edge(from: string, to: string): DesignEdge {
  return { id: uid("e"), from, to };
}
