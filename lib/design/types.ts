// Data model for the System Design Studio: a user-built directed graph of
// vendor-neutral components, plus the findings the rules engine produces.

export type ComponentType =
  | "client"
  | "dns"
  | "cdn"
  | "waf"
  | "load-balancer"
  | "api-gateway"
  | "service"
  | "worker"
  | "cache"
  | "sql-db"
  | "nosql-db"
  | "queue"
  | "object-storage"
  | "search"
  | "auth"
  | "monitoring";

export type OptionKey = "replica" | "backups" | "stateless" | "autoscale" | "rateLimit" | "encrypted";

export type NodeOptions = Partial<Record<OptionKey, boolean>>;

export interface DesignNode {
  id: string;
  type: ComponentType;
  label: string;
  /** Grid cell on the floor (not world units). */
  x: number;
  z: number;
  replicas: number;
  options: NodeOptions;
}

/** Directed: `from` sends requests to `to`. */
export interface DesignEdge {
  id: string;
  from: string;
  to: string;
}

export interface Design {
  id: string;
  name: string;
  nodes: DesignNode[];
  edges: DesignEdge[];
  /** Requests per second entering from clients; drives the load simulation. */
  rps: number;
  /** Set once the confetti has fired for this design (or it started clean). */
  celebrated?: boolean;
}

export type Shape =
  | "sphere"
  | "octahedron"
  | "dodecahedron"
  | "icosahedron"
  | "cone"
  | "puck"
  | "wide-box"
  | "cube"
  | "capsule"
  | "cylinder"
  | "hex-cylinder"
  | "long-box"
  | "bucket"
  | "torus-knot"
  | "ring"
  | "dome";

export type Category = "Entry" | "Traffic" | "Compute" | "Data" | "Messaging" | "Platform";

export type Pillar = "structure" | "reliability" | "scalability" | "security" | "performance" | "operability";
export type Severity = "pass" | "info" | "warn" | "fail";

/** A small declarative change, applied by the pure `applyQuickFix`. */
export type QuickFix =
  | {
      kind: "add-node";
      label: string;
      nodeType: ComponentType;
      /** New node receives an edge from each of these… */
      from?: string[];
      /** …and sends an edge to each of these. */
      to?: string[];
      /** Edges replaced by the new node (e.g. when inserting it between two nodes). */
      removeEdges?: string[];
    }
  | { kind: "set-option"; label: string; nodeId: string; option: OptionKey; value: boolean }
  | { kind: "set-replicas"; label: string; nodeId: string; replicas: number }
  | { kind: "remove-node"; label: string; nodeId: string };

export interface Finding {
  id: string;
  pillar: Pillar;
  severity: Severity;
  title: string;
  detail: string;
  fix?: string;
  nodeIds: string[];
  edgeIds: string[];
  quickFix?: QuickFix;
}

export interface NodeLoad {
  inbound: number;
  capacity: number;
  /** inbound / capacity; 0 for nodes with no meaningful capacity. */
  util: number;
}

export interface Score {
  pct: number;
  grade: string;
  tone: "empty" | "fail" | "warn" | "pass";
}
