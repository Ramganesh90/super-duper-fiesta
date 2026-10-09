import { getAllSegments } from "./segments";
import type { AwsDomain } from "./types";

// A single exam question flattened from the per-week quizzes, with a stable id
// (so misses can be tracked) and its domain (for weak-area breakdowns).
export interface ExamQuestion {
  id: string; // "<segmentId>#q<index>"
  segmentId: string;
  week: number;
  domain: AwsDomain;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export function buildQuestionPool(): ExamQuestion[] {
  const pool: ExamQuestion[] = [];
  for (const s of getAllSegments()) {
    s.quiz.forEach((q, i) => {
      pool.push({
        id: `${s.id}#q${i}`,
        segmentId: s.id,
        week: s.week,
        domain: s.domain,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
      });
    });
  }
  return pool;
}

export function getQuestionsByIds(ids: string[]): ExamQuestion[] {
  const byId = new Map(buildQuestionPool().map((q) => [q.id, q]));
  return ids.map((id) => byId.get(id)).filter((q): q is ExamQuestion => Boolean(q));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A shuffled exam of up to n questions, shuffling each question's options too.
export function pickExam(n: number): ExamQuestion[] {
  return shuffle(buildQuestionPool())
    .slice(0, n)
    .map((q) => ({ ...q, options: shuffle(q.options) }));
}

// SAA-C03 scaled passing score is ~720/1000 ≈ 72%.
export const PASS_PCT = 72;
