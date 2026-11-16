import { edge, makeNode } from "./quickfix";
import type { ComponentType, Design, DesignEdge, DesignNode, NodeOptions } from "./types";
import { uid } from "./quickfix";

interface Spec {
  key: string;
  type: ComponentType;
  x: number;
  z: number;
  replicas?: number;
  options?: NodeOptions;
}

// Build a design from a compact spec: nodes keyed by a local key, edges by key pairs.
function build(name: string, specs: Spec[], links: [string, string][], rps = 1000): Design {
  const nodes: DesignNode[] = [];
  const keyToId: Record<string, string> = {};
  for (const s of specs) {
    const node = makeNode(s.type, { x: s.x, z: s.z });
    if (s.replicas) node.replicas = s.replicas;
    if (s.options) node.options = { ...node.options, ...s.options };
    keyToId[s.key] = node.id;
    nodes.push(node);
  }
  const edges: DesignEdge[] = links.map(([a, b]) => edge(keyToId[a], keyToId[b]));
  return { id: uid("design"), name, nodes, edges, rps };
}

export const TEMPLATES: { key: string; name: string; blurb: string; make: () => Design }[] = [
  {
    key: "blank",
    name: "Blank canvas",
    blurb: "Start from nothing.",
    make: () => ({ id: uid("design"), name: "Untitled design", nodes: [], edges: [], rps: 1000 }),
  },
  {
    key: "three-tier",
    name: "Three-tier web app",
    blurb: "A clean, well-architected baseline.",
    make: () =>
      build(
        "Three-tier web app",
        [
          { key: "client", type: "client", x: -2, z: 0 },
          { key: "waf", type: "waf", x: -1, z: 0 },
          { key: "lb", type: "load-balancer", x: 0, z: 0 },
          { key: "svc", type: "service", x: 1, z: 0, replicas: 2, options: { stateless: true } },
          { key: "auth", type: "auth", x: 1, z: -1 },
          { key: "cache", type: "cache", x: 2, z: 1 },
          { key: "db", type: "sql-db", x: 3, z: 0, replicas: 2, options: { backups: true, encrypted: true } },
          { key: "mon", type: "monitoring", x: 0, z: 2 },
        ],
        [
          ["client", "waf"], ["waf", "lb"], ["lb", "svc"],
          ["svc", "auth"], ["svc", "cache"], ["cache", "db"],
        ],
      ),
  },
  {
    key: "url-shortener",
    name: "URL shortener",
    blurb: "Read-heavy, cache-fronted key-value store.",
    make: () =>
      build(
        "URL shortener",
        [
          { key: "client", type: "client", x: -2, z: 0 },
          { key: "cdn", type: "cdn", x: -1, z: -1 },
          { key: "gw", type: "api-gateway", x: -1, z: 0, options: { rateLimit: true } },
          { key: "svc", type: "service", x: 0, z: 0, replicas: 2, options: { stateless: true } },
          { key: "cache", type: "cache", x: 1, z: 1 },
          { key: "db", type: "nosql-db", x: 2, z: 0, replicas: 2, options: { backups: true, encrypted: true } },
          { key: "mon", type: "monitoring", x: 0, z: 2 },
        ],
        [["client", "gw"], ["gw", "svc"], ["svc", "cache"], ["cache", "db"]],
      ),
  },
  {
    key: "chat",
    name: "Chat app",
    blurb: "Realtime with a queue and workers.",
    make: () =>
      build(
        "Chat app",
        [
          { key: "client", type: "client", x: -2, z: 0 },
          { key: "waf", type: "waf", x: -1, z: 0 },
          { key: "lb", type: "load-balancer", x: 0, z: 0 },
          { key: "svc", type: "service", x: 1, z: 0, replicas: 3, options: { stateless: true } },
          { key: "queue", type: "queue", x: 2, z: 1 },
          { key: "worker", type: "worker", x: 3, z: 1, replicas: 2 },
          { key: "db", type: "nosql-db", x: 3, z: -1, replicas: 2, options: { backups: true, encrypted: true } },
          { key: "mon", type: "monitoring", x: 0, z: 2 },
        ],
        [["client", "waf"], ["waf", "lb"], ["lb", "svc"], ["svc", "queue"], ["queue", "worker"], ["worker", "db"], ["svc", "db"]],
      ),
  },
  {
    key: "broken",
    name: "Broken starter",
    blurb: "Lots of problems to find and fix.",
    make: () =>
      build(
        "Broken starter",
        [
          { key: "client", type: "client", x: -2, z: 0 },
          { key: "svc", type: "service", x: 0, z: 0 },
          { key: "db", type: "sql-db", x: 2, z: 0 },
          { key: "cache", type: "cache", x: 0, z: 2 },
        ],
        [["client", "db"], ["client", "svc"], ["svc", "db"]],
      ),
  },
];
