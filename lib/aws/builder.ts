// Rules engine for the "Build your own VPC" sandbox. Pure, framework-free logic:
// given a BuilderState, produce findings (pass/info/warn/fail) that the UI turns
// into a checklist and per-component visual clues. Reflects AWS Well-Architected
// best practices at the level the SAA-C03 exam cares about.

export type AZ = "a" | "b" | "c";
export type ResourceType = "alb" | "ec2" | "rds" | "nat";

export interface BuilderResource {
  id: string;
  type: ResourceType;
  securityGroup: boolean; // alb / ec2 / rds
  publicIp: boolean; // ec2
  encrypted: boolean; // rds
  multiAz: boolean; // rds
}

export interface BuilderSubnet {
  id: string;
  tier: "public" | "private";
  az: AZ;
  nacl: boolean; // is a (non-default) Network ACL applied?
  resources: BuilderResource[];
}

export interface BuilderState {
  internetGateway: boolean;
  subnets: BuilderSubnet[];
}

export type Pillar = "security" | "resilience" | "networking" | "cost";
export type Severity = "pass" | "info" | "warn" | "fail";

export interface Finding {
  id: string;
  pillar: Pillar;
  severity: Severity;
  title: string;
  detail: string;
  fix?: string;
  targets: string[]; // component ids to highlight on the canvas
}

export const PILLAR_LABELS: Record<Pillar, string> = {
  security: "🔐 Security",
  resilience: "🛡️ Resilience",
  networking: "🌐 Networking",
  cost: "💰 Cost",
};

export const RESOURCE_META: Record<
  ResourceType,
  { label: string; emoji: string; toggles: Array<keyof BuilderResource> }
> = {
  alb: { label: "Application Load Balancer", emoji: "⚖️", toggles: ["securityGroup"] },
  ec2: { label: "EC2 / App server", emoji: "🖥️", toggles: ["securityGroup", "publicIp"] },
  rds: { label: "RDS Database", emoji: "🗄️", toggles: ["securityGroup", "encrypted", "multiAz"] },
  nat: { label: "NAT Gateway", emoji: "🔀", toggles: [] },
};

export const TOGGLE_LABELS: Partial<Record<keyof BuilderResource, string>> = {
  securityGroup: "Security group",
  publicIp: "Public IP",
  encrypted: "Encrypted",
  multiAz: "Multi-AZ",
};

export const EMPTY_STATE: BuilderState = { internetGateway: false, subnets: [] };

// --- Factories -------------------------------------------------------------

export function newResource(type: ResourceType, id: string): BuilderResource {
  return {
    id,
    type,
    securityGroup: true, // most people attach one; encryption/multi-AZ are the common misses
    publicIp: false,
    encrypted: false,
    multiAz: false,
  };
}

export function newSubnet(tier: "public" | "private", az: AZ, id: string): BuilderSubnet {
  return { id, tier, az, nacl: false, resources: [] };
}

// --- Rules -----------------------------------------------------------------

interface ResourceWithSubnet extends BuilderResource {
  subnet: BuilderSubnet;
}

export function evaluate(state: BuilderState): Finding[] {
  const findings: Finding[] = [];
  const subnets = state.subnets;
  const publicSubnets = subnets.filter((s) => s.tier === "public");
  const privateSubnets = subnets.filter((s) => s.tier === "private");

  const all: ResourceWithSubnet[] = subnets.flatMap((s) =>
    s.resources.map((r) => ({ ...r, subnet: s }))
  );
  const rds = all.filter((r) => r.type === "rds");
  const ec2 = all.filter((r) => r.type === "ec2");
  const alb = all.filter((r) => r.type === "alb");
  const nats = all.filter((r) => r.type === "nat");
  const sgCapable = all.filter((r) => r.type !== "nat");
  const hasResources = all.length > 0;

  // ---- Cost: empty hint ----
  if (!hasResources && subnets.length === 0) {
    findings.push({
      id: "empty",
      pillar: "cost",
      severity: "info",
      title: "Empty canvas",
      detail: "Add a subnet, then drop in an ALB, EC2 app server, and an RDS database to start designing.",
      targets: [],
    });
    return findings;
  }

  // ---- Security ----
  // S1: security groups on every capable resource
  const missingSg = sgCapable.filter((r) => !r.securityGroup);
  if (sgCapable.length > 0) {
    findings.push(
      missingSg.length
        ? {
            id: "sg",
            pillar: "security",
            severity: "fail",
            title: "Security group missing",
            detail: `${missingSg.length} resource(s) have no security group — nothing filters their traffic.`,
            fix: "Attach a least-privilege security group to every ALB, EC2, and RDS.",
            targets: missingSg.map((r) => r.id),
          }
        : {
            id: "sg",
            pillar: "security",
            severity: "pass",
            title: "Security groups attached",
            detail: "Every resource has a security group guarding its traffic.",
            targets: [],
          }
    );
  }

  // S2: NACLs on every subnet (defense in depth) — the classic miss
  const noNacl = subnets.filter((s) => !s.nacl);
  findings.push(
    noNacl.length
      ? {
          id: "nacl",
          pillar: "security",
          severity: "warn",
          title: "NACL not applied",
          detail: `${noNacl.length} subnet(s) rely on the default NACL only — no subnet-level defense in depth.`,
          fix: "Apply a custom Network ACL to each subnet to complement your security groups.",
          targets: noNacl.map((s) => s.id),
        }
      : {
          id: "nacl",
          pillar: "security",
          severity: "pass",
          title: "Network ACLs applied",
          detail: "Each subnet has a NACL for subnet-level defense in depth.",
          targets: [],
        }
  );

  // S3: databases must live in private subnets
  if (rds.length > 0) {
    const publicRds = rds.filter((r) => r.subnet.tier === "public");
    findings.push(
      publicRds.length
        ? {
            id: "rds-private",
            pillar: "security",
            severity: "fail",
            title: "Database in a public subnet",
            detail: "An RDS database sits in a public subnet, exposing it to the internet.",
            fix: "Move databases to private subnets; reach them only from the app tier.",
            targets: publicRds.map((r) => r.id),
          }
        : {
            id: "rds-private",
            pillar: "security",
            severity: "pass",
            title: "Databases are private",
            detail: "Databases live in private subnets, away from the internet.",
            targets: [],
          }
    );

    // S4: encryption at rest
    const unencrypted = rds.filter((r) => !r.encrypted);
    findings.push(
      unencrypted.length
        ? {
            id: "rds-enc",
            pillar: "security",
            severity: "warn",
            title: "Database not encrypted",
            detail: `${unencrypted.length} database(s) have no encryption at rest.`,
            fix: "Enable KMS encryption at rest on your RDS instances.",
            targets: unencrypted.map((r) => r.id),
          }
        : {
            id: "rds-enc",
            pillar: "security",
            severity: "pass",
            title: "Databases encrypted at rest",
            detail: "Encryption at rest is enabled on your databases.",
            targets: [],
          }
    );
  }

  // S5: app servers shouldn't have public IPs
  const publicEc2 = ec2.filter((r) => r.publicIp);
  if (publicEc2.length > 0) {
    findings.push({
      id: "ec2-public-ip",
      pillar: "security",
      severity: "warn",
      title: "App server has a public IP",
      detail: "An EC2 app server is directly exposed via a public IP.",
      fix: "Put app servers in private subnets behind a load balancer; use NAT for outbound.",
      targets: publicEc2.map((r) => r.id),
    });
  }

  // ---- Resilience ----
  // R1: span multiple AZs
  if (hasResources) {
    const azWithResources = new Set(all.map((r) => r.subnet.az));
    findings.push(
      azWithResources.size >= 2
        ? {
            id: "multi-az",
            pillar: "resilience",
            severity: "pass",
            title: "Spans multiple AZs",
            detail: `Workloads are spread across ${azWithResources.size} Availability Zones.`,
            targets: [],
          }
        : {
            id: "multi-az",
            pillar: "resilience",
            severity: "warn",
            title: "Single Availability Zone",
            detail: "Everything lives in one AZ — an AZ outage takes the whole app down.",
            fix: "Add subnets in a second AZ and spread resources across them.",
            targets: [],
          }
    );
  }

  // R2: Multi-AZ databases
  if (rds.length > 0) {
    const singleAzRds = rds.filter((r) => !r.multiAz);
    findings.push(
      singleAzRds.length
        ? {
            id: "rds-multiaz",
            pillar: "resilience",
            severity: "warn",
            title: "Database is not Multi-AZ",
            detail: `${singleAzRds.length} database(s) have no standby for automatic failover.`,
            fix: "Enable RDS Multi-AZ so a standby can take over automatically.",
            targets: singleAzRds.map((r) => r.id),
          }
        : {
            id: "rds-multiaz",
            pillar: "resilience",
            severity: "pass",
            title: "Databases are Multi-AZ",
            detail: "Databases have a standby in another AZ for failover.",
            targets: [],
          }
    );
  }

  // R3: NAT gateway for private outbound (app servers)
  const privateEc2 = ec2.filter((r) => r.subnet.tier === "private");
  if (privateEc2.length > 0) {
    const natInPublic = nats.some((n) => n.subnet.tier === "public");
    findings.push(
      natInPublic
        ? {
            id: "nat",
            pillar: "resilience",
            severity: "pass",
            title: "Private outbound via NAT",
            detail: "Private app servers can reach the internet through a NAT gateway.",
            targets: [],
          }
        : {
            id: "nat",
            pillar: "resilience",
            severity: "warn",
            title: "No NAT gateway",
            detail: "Private app servers can't reach the internet for updates or external APIs.",
            fix: "Add a NAT gateway in a public subnet for outbound-only internet access.",
            targets: privateEc2.map((r) => r.id),
          }
    );
  }

  // R4: app tier behind a load balancer
  if (ec2.length > 0) {
    findings.push(
      alb.length > 0
        ? {
            id: "alb",
            pillar: "resilience",
            severity: "pass",
            title: "App tier behind a load balancer",
            detail: "Traffic reaches app servers through a load balancer.",
            targets: [],
          }
        : {
            id: "alb",
            pillar: "resilience",
            severity: "warn",
            title: "No load balancer",
            detail: "App servers aren't behind a load balancer, so there's no health-checking or spreading of traffic.",
            fix: "Add an Application Load Balancer in front of your app tier.",
            targets: ec2.map((r) => r.id),
          }
    );
  }

  // ---- Networking ----
  // N1: internet gateway for public subnets
  if (publicSubnets.length > 0) {
    findings.push(
      state.internetGateway
        ? {
            id: "igw",
            pillar: "networking",
            severity: "pass",
            title: "Internet gateway attached",
            detail: "Public subnets have a route to the internet via the IGW.",
            targets: [],
          }
        : {
            id: "igw",
            pillar: "networking",
            severity: "fail",
            title: "No internet gateway",
            detail: "You have public subnets but no internet gateway — nothing can reach the internet.",
            fix: "Attach an internet gateway to the VPC (toggle it on above).",
            targets: publicSubnets.map((s) => s.id),
          }
    );
  }

  // N2: tiered design (both public and private)
  if (hasResources) {
    if (publicSubnets.length > 0 && privateSubnets.length > 0) {
      findings.push({
        id: "tiers",
        pillar: "networking",
        severity: "pass",
        title: "Tiered subnets",
        detail: "You separate public-facing and private resources into different subnets.",
        targets: [],
      });
    } else {
      findings.push({
        id: "tiers",
        pillar: "networking",
        severity: "warn",
        title: "Missing a subnet tier",
        detail: "A good VPC separates public (load balancer) and private (app/data) tiers.",
        fix: "Add both a public and a private subnet.",
        targets: [],
      });
    }
  }

  // N3: NAT gateway must sit in a public subnet
  const natInPrivate = nats.filter((n) => n.subnet.tier === "private");
  if (natInPrivate.length > 0) {
    findings.push({
      id: "nat-placement",
      pillar: "networking",
      severity: "fail",
      title: "NAT gateway in a private subnet",
      detail: "A NAT gateway must sit in a public subnet to provide outbound internet.",
      fix: "Move the NAT gateway to a public subnet.",
      targets: natInPrivate.map((n) => n.id),
    });
  }

  // ---- Cost ----
  if (nats.length > 0) {
    findings.push({
      id: "nat-cost",
      pillar: "cost",
      severity: "info",
      title: "NAT gateways bill hourly + per-GB",
      detail: "One NAT per AZ gives HA but multiplies cost. For S3/DynamoDB, free gateway VPC endpoints avoid NAT entirely.",
      targets: [],
    });
  }

  return findings;
}

// --- Scoring ---------------------------------------------------------------

export interface Score {
  pct: number;
  grade: string;
  tone: "empty" | "fail" | "warn" | "pass";
}

export function scoreOf(findings: Finding[]): Score {
  const applicable = findings.filter((f) => f.severity !== "info");
  if (applicable.length === 0) return { pct: 0, grade: "Empty — start building", tone: "empty" };
  const passed = applicable.filter((f) => f.severity === "pass").length;
  const pct = Math.round((passed / applicable.length) * 100);
  const hasFail = findings.some((f) => f.severity === "fail");
  const hasWarn = findings.some((f) => f.severity === "warn");
  if (hasFail) return { pct, grade: "Needs work", tone: "fail" };
  if (hasWarn) return { pct, grade: "Almost there", tone: "warn" };
  return { pct, grade: "Well-Architected! 🏆", tone: "pass" };
}

// --- Presets ---------------------------------------------------------------

export const PRESETS: Record<"broken" | "wellArchitected", () => BuilderState> = {
  broken: () => ({
    internetGateway: false,
    subnets: [
      {
        id: "p-sub",
        tier: "public",
        az: "a",
        nacl: false,
        resources: [
          { id: "p-ec2", type: "ec2", securityGroup: false, publicIp: true, encrypted: false, multiAz: false },
          { id: "p-rds", type: "rds", securityGroup: false, publicIp: false, encrypted: false, multiAz: false },
        ],
      },
    ],
  }),
  wellArchitected: () => ({
    internetGateway: true,
    subnets: [
      {
        id: "pub-a",
        tier: "public",
        az: "a",
        nacl: true,
        resources: [
          { id: "alb-a", type: "alb", securityGroup: true, publicIp: false, encrypted: false, multiAz: false },
          { id: "nat-a", type: "nat", securityGroup: false, publicIp: false, encrypted: false, multiAz: false },
        ],
      },
      {
        id: "priv-a",
        tier: "private",
        az: "a",
        nacl: true,
        resources: [
          { id: "ec2-a", type: "ec2", securityGroup: true, publicIp: false, encrypted: false, multiAz: false },
          { id: "rds-a", type: "rds", securityGroup: true, publicIp: false, encrypted: true, multiAz: true },
        ],
      },
      {
        id: "priv-b",
        tier: "private",
        az: "b",
        nacl: true,
        resources: [
          { id: "ec2-b", type: "ec2", securityGroup: true, publicIp: false, encrypted: false, multiAz: false },
        ],
      },
    ],
  }),
};
