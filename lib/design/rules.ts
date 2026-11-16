import { CATALOG } from "./catalog";
import { simulate } from "./simulate";
import type { Design, DesignEdge, DesignNode, Finding, Pillar, Score } from "./types";

const DATA_STORES = new Set(["sql-db", "nosql-db", "object-storage", "search"]);
const DATABASES = new Set(["sql-db", "nosql-db"]);
const BALANCERS = new Set(["load-balancer", "api-gateway"]);

export const PILLAR_LABELS: Record<Pillar, string> = {
  structure: "🧩 Structure",
  reliability: "🛡️ Reliability",
  scalability: "📈 Scalability",
  security: "🔐 Security",
  performance: "⚡ Performance",
  operability: "🔭 Operability",
};

export const PILLAR_ORDER: Pillar[] = [
  "structure", "reliability", "scalability", "security", "performance", "operability",
];

export function evaluate(design: Design): Finding[] {
  const f: Finding[] = [];
  const { nodes, edges } = design;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const outOf = (id: string) => edges.filter((e) => e.from === id);
  const inTo = (id: string) => edges.filter((e) => e.to === id);
  const has = (t: string) => nodes.some((n) => n.type === t);
  const clients = nodes.filter((n) => n.type === "client");

  if (nodes.length === 0) {
    f.push({
      id: "empty", pillar: "structure", severity: "info",
      title: "Empty canvas",
      detail: "Add a Client, then a few components, and connect them to start getting feedback.",
      nodeIds: [], edgeIds: [],
    });
    return f;
  }

  // Reachability from any client (directed BFS).
  const reachable = new Set<string>();
  const queue = [...clients.map((c) => c.id)];
  clients.forEach((c) => reachable.add(c.id));
  while (queue.length) {
    const id = queue.shift()!;
    for (const e of outOf(id)) if (!reachable.has(e.to)) { reachable.add(e.to); queue.push(e.to); }
  }

  // ---------- Structure ----------
  if (clients.length === 0) {
    f.push({
      id: "no-client", pillar: "structure", severity: "warn",
      title: "No entry point",
      detail: "There's no Client representing users. Add one so traffic has a source.",
      fix: "Add a Client component.",
      nodeIds: [], edgeIds: [],
      quickFix: { kind: "add-node", label: "Client", nodeType: "client", to: firstNonClient(nodes) },
    });
  }

  for (const n of nodes) {
    if (n.type === "client" || n.type === "monitoring") continue;
    const connected = outOf(n.id).length + inTo(n.id).length > 0;
    if (!connected) {
      f.push({
        id: `orphan:${n.id}`, pillar: "structure", severity: "warn",
        title: `"${n.label}" is not connected`,
        detail: `${CATALOG[n.type].label} "${n.label}" has no connections, so it does nothing.`,
        fix: "Connect it, or remove it.",
        nodeIds: [n.id], edgeIds: [],
        quickFix: { kind: "remove-node", label: `Remove ${n.label}`, nodeId: n.id },
      });
    } else if (clients.length > 0 && !reachable.has(n.id)) {
      f.push({
        id: `unreachable:${n.id}`, pillar: "structure", severity: "warn",
        title: `"${n.label}" is unreachable`,
        detail: `No path of requests reaches "${n.label}" from a client.`,
        nodeIds: [n.id], edgeIds: [],
      });
    }
  }

  // Client wired straight to a database.
  for (const e of edges) {
    const from = byId.get(e.from), to = byId.get(e.to);
    if (from?.type === "client" && to && DATABASES.has(to.type)) {
      f.push({
        id: `client-db:${e.id}`, pillar: "structure", severity: "fail",
        title: "Client talks directly to the database",
        detail: `"${from.label}" connects straight to database "${to.label}". Put an app tier (and ideally a gateway/LB) in between.`,
        fix: "Insert a service between the client and the database.",
        nodeIds: [from.id, to.id], edgeIds: [e.id],
        quickFix: { kind: "add-node", label: "Insert a service", nodeType: "service", from: [from.id], to: [to.id], removeEdges: [e.id] },
      });
    }
  }

  // Dangling infra: no targets / no consumer.
  for (const n of nodes) {
    if (BALANCERS.has(n.type) && outOf(n.id).length === 0) {
      f.push({
        id: `no-targets:${n.id}`, pillar: "structure", severity: "warn",
        title: `"${n.label}" has no targets`,
        detail: `${CATALOG[n.type].label} "${n.label}" isn't forwarding to anything.`,
        nodeIds: [n.id], edgeIds: [],
      });
    }
    if (n.type === "queue" && outOf(n.id).length === 0) {
      f.push({
        id: `queue-consumer:${n.id}`, pillar: "structure", severity: "warn",
        title: `Queue "${n.label}" has no consumer`,
        detail: "Messages would pile up with nothing to process them.",
        fix: "Add a worker that consumes the queue.",
        nodeIds: [n.id], edgeIds: [],
        quickFix: { kind: "add-node", label: "Add a worker", nodeType: "worker", from: [n.id] },
      });
    }
  }

  // ---------- Reliability ----------
  for (const n of nodes) {
    if (!reachable.has(n.id) && clients.length > 0) continue;
    if (n.type === "service" && n.replicas <= 1) {
      f.push({
        id: `spof:${n.id}`, pillar: "reliability", severity: "warn",
        title: `"${n.label}" is a single point of failure`,
        detail: `Service "${n.label}" runs a single replica; if it dies, the path is down.`,
        fix: "Run at least 2 replicas.",
        nodeIds: [n.id], edgeIds: [],
        quickFix: { kind: "set-replicas", label: "Run 2 replicas", nodeId: n.id, replicas: 2 },
      });
    }
    if (DATABASES.has(n.type) && n.replicas <= 1) {
      f.push({
        id: `db-spof:${n.id}`, pillar: "reliability", severity: "warn",
        title: `Database "${n.label}" has no standby`,
        detail: `"${n.label}" has a single instance — no failover if it goes down.`,
        fix: "Add a replica/standby.",
        nodeIds: [n.id], edgeIds: [],
        quickFix: { kind: "set-replicas", label: "Add a standby", nodeId: n.id, replicas: 2 },
      });
    }
    if (DATA_STORES.has(n.type) && CATALOG[n.type].options.includes("backups") && !n.options.backups) {
      f.push({
        id: `backups:${n.id}`, pillar: "reliability", severity: "warn",
        title: `"${n.label}" has no backups`,
        detail: `Data store "${n.label}" isn't backed up — a corruption or delete is unrecoverable.`,
        nodeIds: [n.id], edgeIds: [],
        quickFix: { kind: "set-option", label: "Enable backups", nodeId: n.id, option: "backups", value: true },
      });
    }
  }

  // ---------- Scalability ----------
  for (const n of nodes) {
    if (n.type === "service" && n.replicas >= 2) {
      const frontedByLb = inTo(n.id).some((e) => BALANCERS.has(byId.get(e.from)?.type ?? ""));
      if (!frontedByLb) {
        f.push({
          id: `no-lb:${n.id}`, pillar: "scalability", severity: "warn",
          title: `"${n.label}" scaled out without a load balancer`,
          detail: `"${n.label}" runs ${n.replicas} replicas but nothing spreads traffic across them.`,
          fix: "Put a load balancer in front.",
          nodeIds: [n.id], edgeIds: [],
          quickFix: {
            kind: "add-node", label: "Add a load balancer", nodeType: "load-balancer",
            from: inTo(n.id).map((e) => e.from), to: [n.id], removeEdges: inTo(n.id).map((e) => e.id),
          },
        });
      }
      if (!n.options.stateless) {
        f.push({
          id: `stateful:${n.id}`, pillar: "scalability", severity: "warn",
          title: `"${n.label}" is scaled out but stateful`,
          detail: "Running multiple replicas without shared/external state means sessions break.",
          nodeIds: [n.id], edgeIds: [],
          quickFix: { kind: "set-option", label: "Mark stateless", nodeId: n.id, option: "stateless", value: true },
        });
      }
    }
  }

  // Synchronous service -> worker (should be via a queue).
  for (const e of edges) {
    const from = byId.get(e.from), to = byId.get(e.to);
    if (from?.type === "service" && to?.type === "worker") {
      f.push({
        id: `sync-worker:${e.id}`, pillar: "scalability", severity: "warn",
        title: "Worker called synchronously",
        detail: `"${from.label}" calls worker "${to.label}" directly. Decouple them with a queue.`,
        fix: "Insert a queue between them.",
        nodeIds: [from.id, to.id], edgeIds: [e.id],
        quickFix: { kind: "add-node", label: "Insert a queue", nodeType: "queue", from: [from.id], to: [to.id], removeEdges: [e.id] },
      });
    }
  }

  // ---------- Security ----------
  if (clients.length > 0 && !has("waf")) {
    const targets = clients.flatMap((c) => outOf(c.id));
    f.push({
      id: "no-waf", pillar: "security", severity: "warn",
      title: "No WAF on the public entry",
      detail: "Public traffic reaches your system with no web application firewall filtering it.",
      nodeIds: clients.map((c) => c.id), edgeIds: [],
      quickFix: targets.length
        ? { kind: "add-node", label: "Add a WAF", nodeType: "waf", from: clients.map((c) => c.id), to: targets.map((e) => e.to), removeEdges: targets.map((e) => e.id) }
        : { kind: "add-node", label: "Add a WAF", nodeType: "waf" },
    });
  }
  if (clients.length > 0 && !has("auth")) {
    f.push({
      id: "no-auth", pillar: "security", severity: "info",
      title: "No authentication component",
      detail: "There's no auth/identity component — fine for public read-only, risky otherwise.",
      nodeIds: [], edgeIds: [],
      quickFix: { kind: "add-node", label: "Add auth", nodeType: "auth" },
    });
  }
  for (const n of nodes) {
    if (n.type === "api-gateway" && !n.options.rateLimit) {
      f.push({
        id: `ratelimit:${n.id}`, pillar: "security", severity: "info",
        title: `"${n.label}" has no rate limiting`,
        detail: "Without throttling, a spike or abuse can overwhelm everything behind the gateway.",
        nodeIds: [n.id], edgeIds: [],
        quickFix: { kind: "set-option", label: "Enable rate limiting", nodeId: n.id, option: "rateLimit", value: true },
      });
    }
    if (DATA_STORES.has(n.type) && CATALOG[n.type].options.includes("encrypted") && !n.options.encrypted) {
      f.push({
        id: `encrypt:${n.id}`, pillar: "security", severity: "warn",
        title: `"${n.label}" is not encrypted at rest`,
        detail: `Data in "${n.label}" is stored unencrypted.`,
        nodeIds: [n.id], edgeIds: [],
        quickFix: { kind: "set-option", label: "Encrypt at rest", nodeId: n.id, option: "encrypted", value: true },
      });
    }
  }

  // ---------- Performance ----------
  const hasCache = has("cache");
  for (const e of edges) {
    const from = byId.get(e.from), to = byId.get(e.to);
    if (from?.type === "service" && to && DATABASES.has(to.type) && !hasCache) {
      f.push({
        id: `no-cache:${e.id}`, pillar: "performance", severity: "info",
        title: "Database read path has no cache",
        detail: `"${from.label}" reads from "${to.label}" with no cache — hot reads hit the DB every time.`,
        nodeIds: [from.id, to.id], edgeIds: [e.id],
        quickFix: { kind: "add-node", label: "Add a cache", nodeType: "cache", from: [from.id], to: [to.id], removeEdges: [e.id] },
      });
      break; // one hint is enough
    }
  }
  if (has("object-storage") && clients.length > 0 && !has("cdn")) {
    f.push({
      id: "no-cdn", pillar: "performance", severity: "info",
      title: "Static content without a CDN",
      detail: "You have object storage serving clients but no CDN to cache it at the edge.",
      nodeIds: [], edgeIds: [],
      quickFix: { kind: "add-node", label: "Add a CDN", nodeType: "cdn" },
    });
  }

  // ---------- Operability ----------
  if (nodes.length >= 3 && !has("monitoring")) {
    f.push({
      id: "no-monitoring", pillar: "operability", severity: "warn",
      title: "No monitoring",
      detail: "Nothing is collecting metrics, logs, or traces, so you'd be blind in production.",
      nodeIds: [], edgeIds: [],
      quickFix: { kind: "add-node", label: "Add monitoring", nodeType: "monitoring" },
    });
  }

  // ---------- Load simulation (overload) ----------
  const loads = simulate(design);
  for (const n of nodes) {
    const l = loads[n.id];
    if (!l || l.capacity <= 0) continue;
    if (l.util > 1) {
      const needed = Math.ceil(l.inbound / CATALOG[n.type].capacity);
      f.push({
        id: `overload:${n.id}`, pillar: "performance", severity: "warn",
        title: `"${n.label}" is over capacity`,
        detail: `At ${design.rps} rps, "${n.label}" receives ~${l.inbound} rps but serves ~${l.capacity}. (${Math.round(l.util * 100)}% load)`,
        fix: `Scale to ${needed} replicas or add capacity ahead of it.`,
        nodeIds: [n.id], edgeIds: [],
        quickFix: CATALOG[n.type].scalable
          ? { kind: "set-replicas", label: `Scale to ${needed} replicas`, nodeId: n.id, replicas: needed }
          : undefined,
      });
    }
  }

  return f;
}

function firstNonClient(nodes: DesignNode[]): string[] {
  const n = nodes.find((x) => x.type !== "client");
  return n ? [n.id] : [];
}

export function scoreOf(findings: Finding[], nodeCount: number): Score {
  if (nodeCount === 0) return { pct: 0, grade: "Empty — add components", tone: "empty" };
  const fails = findings.filter((x) => x.severity === "fail").length;
  const warns = findings.filter((x) => x.severity === "warn").length;
  const pct = Math.max(0, 100 - fails * 20 - warns * 7);
  if (fails > 0) return { pct, grade: "Has critical gaps", tone: "fail" };
  if (warns > 0) return { pct, grade: "Almost there", tone: "warn" };
  return { pct: 100, grade: "Solid design! 🏆", tone: "pass" };
}

// Re-export for the UI.
export type { DesignEdge };
