import type { Category, ComponentType, OptionKey, Shape } from "./types";

export interface CatalogEntry {
  label: string;
  emoji: string;
  category: Category;
  shape: Shape;
  /** Hex color for the 3D mesh and UI chips. */
  color: string;
  /** Requests/sec a single replica can serve; 0 = passive/source (no capacity check). */
  capacity: number;
  /** Per-type toggles exposed in the inspector. */
  options: OptionKey[];
  /** Whether this type can have more than one replica. */
  scalable: boolean;
  blurb: string;
}

// Vendor-neutral component catalog. Order within a category drives the palette.
export const CATALOG: Record<ComponentType, CatalogEntry> = {
  client: {
    label: "Client", emoji: "👤", category: "Entry", shape: "sphere", color: "#38bdf8",
    capacity: 0, options: [], scalable: false, blurb: "Users / devices sending requests.",
  },
  dns: {
    label: "DNS", emoji: "🌐", category: "Entry", shape: "ring", color: "#22d3ee",
    capacity: 100000, options: [], scalable: false, blurb: "Resolves names to addresses.",
  },
  cdn: {
    label: "CDN", emoji: "📡", category: "Traffic", shape: "dome", color: "#2dd4bf",
    capacity: 50000, options: [], scalable: false, blurb: "Caches static content at the edge.",
  },
  waf: {
    label: "WAF", emoji: "🛡️", category: "Traffic", shape: "cone", color: "#f87171",
    capacity: 20000, options: [], scalable: false, blurb: "Filters malicious HTTP traffic.",
  },
  "load-balancer": {
    label: "Load Balancer", emoji: "⚖️", category: "Traffic", shape: "wide-box", color: "#fb923c",
    capacity: 40000, options: [], scalable: false, blurb: "Spreads traffic across targets.",
  },
  "api-gateway": {
    label: "API Gateway", emoji: "🚪", category: "Traffic", shape: "hex-cylinder", color: "#fbbf24",
    capacity: 15000, options: ["rateLimit"], scalable: true, blurb: "Routing, auth, throttling.",
  },
  service: {
    label: "Service", emoji: "⚙️", category: "Compute", shape: "cube", color: "#60a5fa",
    capacity: 1000, options: ["stateless", "autoscale"], scalable: true, blurb: "Application / API server.",
  },
  worker: {
    label: "Worker", emoji: "🧵", category: "Compute", shape: "capsule", color: "#818cf8",
    capacity: 800, options: ["autoscale"], scalable: true, blurb: "Background / async processing.",
  },
  cache: {
    label: "Cache", emoji: "⚡", category: "Data", shape: "octahedron", color: "#facc15",
    capacity: 30000, options: ["encrypted"], scalable: true, blurb: "In-memory hot data.",
  },
  "sql-db": {
    label: "SQL DB", emoji: "🗄️", category: "Data", shape: "cylinder", color: "#a78bfa",
    capacity: 2000, options: ["backups", "encrypted"], scalable: true, blurb: "Relational database.",
  },
  "nosql-db": {
    label: "NoSQL DB", emoji: "📚", category: "Data", shape: "cylinder", color: "#c084fc",
    capacity: 10000, options: ["backups", "encrypted"], scalable: true, blurb: "Key-value / document store.",
  },
  queue: {
    label: "Queue", emoji: "📬", category: "Messaging", shape: "long-box", color: "#34d399",
    capacity: 50000, options: [], scalable: false, blurb: "Decouples producers & consumers.",
  },
  "object-storage": {
    label: "Object Storage", emoji: "🪣", category: "Data", shape: "bucket", color: "#4ade80",
    capacity: 20000, options: ["backups", "encrypted"], scalable: false, blurb: "Blobs, files, static assets.",
  },
  search: {
    label: "Search", emoji: "🔎", category: "Data", shape: "icosahedron", color: "#f472b6",
    capacity: 4000, options: ["encrypted"], scalable: true, blurb: "Full-text / log search.",
  },
  auth: {
    label: "Auth", emoji: "🔑", category: "Platform", shape: "dodecahedron", color: "#fda4af",
    capacity: 10000, options: [], scalable: true, blurb: "Identity & access.",
  },
  monitoring: {
    label: "Monitoring", emoji: "📈", category: "Platform", shape: "torus-knot", color: "#94a3b8",
    capacity: 0, options: [], scalable: false, blurb: "Metrics, logs, traces (passive).",
  },
};

export const CATEGORY_ORDER: Category[] = ["Entry", "Traffic", "Compute", "Data", "Messaging", "Platform"];

export const ALL_TYPES = Object.keys(CATALOG) as ComponentType[];

export const DATA_STORES: ComponentType[] = ["sql-db", "nosql-db", "object-storage", "search"];
export const DATABASES: ComponentType[] = ["sql-db", "nosql-db"];
export const COMPUTE: ComponentType[] = ["service", "worker"];
export const BALANCERS: ComponentType[] = ["load-balancer", "api-gateway"];

export function isDataStore(t: ComponentType): boolean {
  return DATA_STORES.includes(t);
}
