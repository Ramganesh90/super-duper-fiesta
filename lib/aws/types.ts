// Content model for the AWS Solutions Architect — Associate (SAA-C03) study app.
// Mirrors the data-driven approach in lib/types.ts: every weekly segment is JSON,
// typed here, and rendered by generic components.

export type AwsDomain =
  | "foundations"
  | "security"
  | "resilience"
  | "performance"
  | "cost";

export interface AwsService {
  name: string;
  purpose: string;
  emoji?: string;
}

export interface StudyResource {
  label: string;
  url: string;
  type: "docs" | "video" | "whitepaper" | "faq" | "workshop";
}

// A single scored quiz question — same shape as the Pattern-Verse QuizQuestion.
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ScenarioOption {
  id: string;
  label: string;
}

// A "pick-the-right-architecture" challenge — mirrors the CodeBattle shape.
export interface Scenario {
  scenario: string;
  question: string;
  options: ScenarioOption[];
  correct: string;
  explanation: string;
}

// One week of the study plan.
export interface Segment {
  id: string; // e.g. "week-1"
  week: number; // 1..8
  title: string;
  domain: AwsDomain;
  oneLiner: string;
  examWeightNote: string;
  objectives: string[];
  services: AwsService[];
  keyConcepts: string[];
  resources: StudyResource[];
  scenarios: Scenario[];
  quiz: QuizQuestion[];
  xpReward: number;
}

export const DOMAIN_LABELS: Record<AwsDomain, string> = {
  foundations: "Foundations",
  security: "Design Secure Architectures",
  resilience: "Design Resilient Architectures",
  performance: "Design High-Performing Architectures",
  cost: "Design Cost-Optimized Architectures",
};

// Short label for compact chips/badges.
export const DOMAIN_SHORT: Record<AwsDomain, string> = {
  foundations: "Foundations",
  security: "Secure",
  resilience: "Resilient",
  performance: "High-Performing",
  cost: "Cost-Optimized",
};

export const DOMAIN_ICONS: Record<AwsDomain, string> = {
  foundations: "🧭",
  security: "🔐",
  resilience: "🛡️",
  performance: "⚡",
  cost: "💰",
};

// Official SAA-C03 exam weightings. Foundations is prep, not a scored domain (0%),
// but still contributes XP and streaks. Used by the readiness meter.
export const DOMAIN_WEIGHTS: Record<AwsDomain, number> = {
  foundations: 0,
  security: 30,
  resilience: 26,
  performance: 24,
  cost: 20,
};

export const DOMAIN_ORDER: AwsDomain[] = [
  "foundations",
  "security",
  "resilience",
  "performance",
  "cost",
];
