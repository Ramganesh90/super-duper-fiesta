export type PatternCategory =
  | "creational"
  | "structural"
  | "behavioral"
  | "concurrency"
  | "architectural"
  | "enterprise";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type PanelType = "problem" | "hero" | "power" | "result";

export interface PatternHero {
  name: string;
  codename: string;
  catchphrase: string;
  power: string;
  weakness: string;
  origin: string;
  enemies: string[];
  emoji: string;
  colorFrom: string;
  colorTo: string;
}

export interface ComicPanelData {
  type: PanelType;
  label: string;
  caption: string;
  speaker?: string;
  dialogue?: string;
  emoji: string;
}

export interface CodeExample {
  language: string;
  before: string;
  after: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface CodeBattleOption {
  id: string;
  label: string;
}

export interface CodeBattle {
  scenario: string;
  question: string;
  options: CodeBattleOption[];
  correct: string;
  explanation: string;
}

export interface ConversationLine {
  speaker: string;
  message: string;
}

export interface PatternStory {
  problem: string;
  solution: string;
  result: string;
}

export interface BeforeAfterData {
  before: string[];
  after: string[];
}

export interface PatternExplanation {
  useWhen: string[];
  avoidWhen: string[];
  commonMistakes: string[];
  realWorldExample: string;
}

// A single box in a structure diagram.
export interface DiagramNode {
  label: string;
  emoji?: string;
  sub?: string; // small caption under the label
}

// A horizontal band of nodes, optionally wrapped in a labeled group (e.g. the
// set of concrete implementations). Rows stack top-to-bottom with an arrow between.
export interface DiagramRow {
  group?: string;
  nodes: DiagramNode[];
}

// A simple, data-driven structure diagram rendered in the comic style.
export interface Diagram {
  caption: string;
  rows: DiagramRow[];
  note?: string;
}

export interface Pattern {
  id: string;
  title: string;
  category: PatternCategory;
  difficulty: Difficulty;
  hero: PatternHero;
  oneLiner: string;
  story: PatternStory;
  beforeAfter: BeforeAfterData;
  panels: ComicPanelData[];
  code: CodeExample;
  explanation: PatternExplanation;
  conversation: ConversationLine[];
  codeBattle: CodeBattle;
  quiz: QuizQuestion[];
  diagram?: Diagram;
}

export const CATEGORY_LABELS: Record<PatternCategory, string> = {
  creational: "Creational",
  structural: "Structural",
  behavioral: "Behavioral",
  concurrency: "Concurrency",
  architectural: "Architectural",
  enterprise: "Enterprise",
};

export const CATEGORY_ICONS: Record<PatternCategory, string> = {
  creational: "🛠",
  structural: "🧩",
  behavioral: "🧠",
  concurrency: "⏱",
  architectural: "🏛",
  enterprise: "🏢",
};
