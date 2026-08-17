// Content model for the AI Academy — "Learn AI by Playing".
// Mirrors the data-driven AWS Segment model, plus comic fields (a character
// persona and a plain-English analogy) so every topic is fun, not a glossary.

export type AITrack =
  | "foundations"
  | "classical-ml"
  | "deep-learning"
  | "genai"
  | "ai-engineering"
  | "responsible-ai";

export interface TopicCharacter {
  name: string; // e.g. "The Attention Seeker"
  emoji: string;
  tagline: string; // a one-line, in-character quip
}

export interface KeyTerm {
  term: string;
  plain: string; // the jargon translated into plain (and slightly funny) English
}

export interface StudyResource {
  label: string;
  url: string;
  type: "docs" | "video" | "paper" | "course" | "interactive";
}

// Same shape as the AWS quiz/scenario so the components stay generic.
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

export interface Scenario {
  scenario: string;
  question: string;
  options: ScenarioOption[];
  correct: string;
  explanation: string;
}

// One topic in the roadmap.
export interface Topic {
  id: string; // e.g. "01-math"
  order: number; // 1..N, drives sequential unlock
  title: string;
  track: AITrack;
  character: TopicCharacter;
  oneLiner: string;
  analogy: string; // the comical, plain-English story that makes it click
  objectives: string[];
  keyConcepts: string[];
  keyTerms: KeyTerm[];
  resources: StudyResource[];
  scenarios: Scenario[];
  quiz: QuizQuestion[];
  xpReward: number;
}

export const TRACK_LABELS: Record<AITrack, string> = {
  foundations: "Foundations",
  "classical-ml": "Classical Machine Learning",
  "deep-learning": "Deep Learning",
  genai: "Generative AI & LLMs",
  "ai-engineering": "AI Engineering / LLMOps",
  "responsible-ai": "Responsible AI",
};

export const TRACK_SHORT: Record<AITrack, string> = {
  foundations: "Foundations",
  "classical-ml": "Classical ML",
  "deep-learning": "Deep Learning",
  genai: "GenAI & LLMs",
  "ai-engineering": "AI Engineering",
  "responsible-ai": "Responsible AI",
};

export const TRACK_ICONS: Record<AITrack, string> = {
  foundations: "🧭",
  "classical-ml": "🔮",
  "deep-learning": "🧠",
  genai: "✨",
  "ai-engineering": "🚀",
  "responsible-ai": "⚔️",
};

// GenAI-weighted mastery meter (sums to 100). Reflects where an AI *engineer*
// spends their time: heavy on GenAI and shipping, real but lighter foundations.
export const TRACK_WEIGHTS: Record<AITrack, number> = {
  foundations: 10,
  "classical-ml": 15,
  "deep-learning": 15,
  genai: 30,
  "ai-engineering": 20,
  "responsible-ai": 10,
};

export const TRACK_ORDER: AITrack[] = [
  "foundations",
  "classical-ml",
  "deep-learning",
  "genai",
  "ai-engineering",
  "responsible-ai",
];

// Future scope — advertised as "coming soon" on the dashboard, not built yet.
// Adding a real track later is just moving an entry into the roadmap.
export interface FutureTrack {
  title: string;
  emoji: string;
  blurb: string;
}

export const FUTURE_TRACKS: FutureTrack[] = [
  {
    title: "AI Data Patterns",
    emoji: "🗃️",
    blurb: "Ingestion, chunking strategies, feature stores, and data-centric AI — the plumbing behind great models.",
  },
  {
    title: "Multimodal AI",
    emoji: "🖼️",
    blurb: "Vision + language + audio: models that see, hear, and speak, and how to build with them.",
  },
  {
    title: "Alignment & RLHF",
    emoji: "🧭",
    blurb: "How models are steered to be helpful and safe — RLHF, DPO, and preference tuning.",
  },
];
