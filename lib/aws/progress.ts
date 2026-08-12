// Gamification engine for the AWS SA study app.
// Mirrors lib/progress.ts (localStorage + pub/sub) but adds levels, a daily
// streak, an exam-readiness meter, and domain badges. Uses its OWN storage key
// so it never collides with Pattern-Verse progress.

import {
  DOMAIN_ORDER,
  DOMAIN_WEIGHTS,
  type AwsDomain,
} from "./types";
import { getAllSegments, getSegmentsByDomain } from "./segments";

const STORAGE_KEY = "aws-sa:progress";
const UPDATE_EVENT = "aws-sa:progress-updated";

export interface AwsQuizResult {
  score: number;
  total: number;
  completedAt: string;
}

export interface AwsStreak {
  current: number;
  longest: number;
  lastStudyDate: string | null; // local date, "YYYY-MM-DD"
}

export interface AwsProgressState {
  completedSegments: string[];
  quizResults: Record<string, AwsQuizResult>;
  scenariosWon: string[]; // keyed "<segmentId>#<index>"
  xp: number;
  streak: AwsStreak;
}

const EMPTY_STATE: AwsProgressState = {
  completedSegments: [],
  quizResults: {},
  scenariosWon: [],
  xp: 0,
  streak: { current: 0, longest: 0, lastStudyDate: null },
};

// --- Levels ----------------------------------------------------------------

export interface LevelInfo {
  level: number; // 1-based
  title: string;
  currentThreshold: number;
  nextThreshold: number | null;
  xpIntoLevel: number;
  xpForLevel: number; // xp span of the current level (0 when maxed)
  progressPct: number; // 0..100 toward next level
  isMax: boolean;
}

const LEVELS: { threshold: number; title: string }[] = [
  { threshold: 0, title: "Cloud Novice" },
  { threshold: 150, title: "Cloud Apprentice" },
  { threshold: 400, title: "Solutions Builder" },
  { threshold: 800, title: "Solutions Architect" },
  { threshold: 1400, title: "Well-Architected Sage" },
];

export function getLevel(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].threshold) idx = i;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  const isMax = next === null;
  const xpIntoLevel = xp - current.threshold;
  const xpForLevel = isMax ? 0 : next!.threshold - current.threshold;
  const progressPct = isMax
    ? 100
    : Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100));
  return {
    level: idx + 1,
    title: current.title,
    currentThreshold: current.threshold,
    nextThreshold: next?.threshold ?? null,
    xpIntoLevel,
    xpForLevel,
    progressPct,
    isMax,
  };
}

// --- Storage ---------------------------------------------------------------

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadProgress(): AwsProgressState {
  if (!isBrowser()) return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY_STATE,
      ...parsed,
      streak: { ...EMPTY_STATE.streak, ...(parsed.streak ?? {}) },
    };
  } catch {
    return EMPTY_STATE;
  }
}

function saveProgress(state: AwsProgressState) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function subscribeToProgress(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(UPDATE_EVENT, callback);
  return () => window.removeEventListener(UPDATE_EVENT, callback);
}

// --- Streak ----------------------------------------------------------------

function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Mutates state.streak to reflect study activity happening "today". Consecutive
// days extend the streak; a gap resets it to 1. Same-day activity is a no-op.
function applyStreak(state: AwsProgressState) {
  const today = localDateStr(new Date());
  const last = state.streak.lastStudyDate;
  if (last === today) return;

  const yesterday = localDateStr(new Date(Date.now() - 24 * 60 * 60 * 1000));
  state.streak.current = last === yesterday ? state.streak.current + 1 : 1;
  state.streak.lastStudyDate = today;
  state.streak.longest = Math.max(state.streak.longest, state.streak.current);
}

// "I studied today" check-in — advances the streak without needing a quiz.
export function checkInToday(): AwsProgressState {
  const state = loadProgress();
  applyStreak(state);
  saveProgress(state);
  return state;
}

// --- Activity recording ----------------------------------------------------

export function recordQuizResult(
  segmentId: string,
  score: number,
  total: number
): AwsProgressState {
  const state = loadProgress();
  const passed = total > 0 && score / total >= 0.6;
  const alreadyMastered = state.completedSegments.includes(segmentId);

  state.quizResults[segmentId] = {
    score,
    total,
    completedAt: new Date().toISOString(),
  };

  if (passed && !alreadyMastered) {
    state.completedSegments.push(segmentId);
    state.xp += 100 + score * 10;
  } else if (passed) {
    state.xp += score * 2;
  }

  applyStreak(state);
  saveProgress(state);
  return state;
}

export function recordScenarioWin(
  segmentId: string,
  scenarioIndex: number
): AwsProgressState {
  const state = loadProgress();
  const key = `${segmentId}#${scenarioIndex}`;
  if (!state.scenariosWon.includes(key)) {
    state.scenariosWon.push(key);
    state.xp += 20;
    applyStreak(state);
    saveProgress(state);
  }
  return state;
}

export function isScenarioWon(
  state: AwsProgressState,
  segmentId: string,
  scenarioIndex: number
): boolean {
  return state.scenariosWon.includes(`${segmentId}#${scenarioIndex}`);
}

// --- Derived: unlock status, badges, readiness -----------------------------

export type SegmentStatus = "locked" | "available" | "in-progress" | "mastered";

// Week 1 is always available; each later week unlocks once the previous is mastered.
export function isSegmentUnlocked(
  state: AwsProgressState,
  segmentId: string
): boolean {
  const ordered = getAllSegments();
  const idx = ordered.findIndex((s) => s.id === segmentId);
  if (idx <= 0) return true;
  const prev = ordered[idx - 1];
  return state.completedSegments.includes(prev.id);
}

export function getSegmentStatus(
  state: AwsProgressState,
  segmentId: string
): SegmentStatus {
  if (state.completedSegments.includes(segmentId)) return "mastered";
  if (!isSegmentUnlocked(state, segmentId)) return "locked";
  const started =
    segmentId in state.quizResults ||
    state.scenariosWon.some((k) => k.startsWith(`${segmentId}#`));
  return started ? "in-progress" : "available";
}

// A domain badge is earned when every segment in that domain is mastered.
export function getEarnedDomainBadges(state: AwsProgressState): AwsDomain[] {
  return DOMAIN_ORDER.filter((domain) => {
    const segs = getSegmentsByDomain(domain);
    return segs.length > 0 && segs.every((s) => state.completedSegments.includes(s.id));
  });
}

export function isDomainEarned(state: AwsProgressState, domain: AwsDomain): boolean {
  const segs = getSegmentsByDomain(domain);
  return segs.length > 0 && segs.every((s) => state.completedSegments.includes(s.id));
}

// Exam readiness (0..100), weighted by the official SAA-C03 domain percentages.
// Each scored domain blends how many of its segments are mastered with the best
// quiz percentages achieved. Foundations (weight 0) doesn't affect readiness.
export function getReadiness(state: AwsProgressState): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const domain of DOMAIN_ORDER) {
    const weight = DOMAIN_WEIGHTS[domain];
    if (weight === 0) continue;
    const segs = getSegmentsByDomain(domain);
    if (segs.length === 0) continue;

    const masteredFrac =
      segs.filter((s) => state.completedSegments.includes(s.id)).length / segs.length;

    const quizFrac =
      segs.reduce((sum, s) => {
        const r = state.quizResults[s.id];
        return sum + (r && r.total > 0 ? r.score / r.total : 0);
      }, 0) / segs.length;

    const domainScore = 0.6 * masteredFrac + 0.4 * quizFrac;
    weightedSum += domainScore * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 100);
}

export function getXP(): number {
  return loadProgress().xp;
}

export function resetProgress(): AwsProgressState {
  saveProgress(EMPTY_STATE);
  return EMPTY_STATE;
}
