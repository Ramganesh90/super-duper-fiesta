// Gamification engine for the AI Academy. Same shape as lib/aws/progress.ts
// (localStorage + pub/sub, XP/levels/streak/mastery/badges), with its OWN
// storage key so it never collides with the other apps.

import { TRACK_ORDER, TRACK_WEIGHTS, type AITrack } from "./types";
import { getAllTopics, getTopicsByTrack } from "./topics";

const STORAGE_KEY = "ai-eng:progress";
const UPDATE_EVENT = "ai-eng:progress-updated";

export interface AiQuizResult {
  score: number;
  total: number;
  completedAt: string;
}

export interface AiStreak {
  current: number;
  longest: number;
  lastStudyDate: string | null; // local date, "YYYY-MM-DD"
}

export interface AiProgressState {
  completedTopics: string[];
  quizResults: Record<string, AiQuizResult>;
  scenariosWon: string[]; // keyed "<topicId>#<index>"
  xp: number;
  streak: AiStreak;
}

const EMPTY_STATE: AiProgressState = {
  completedTopics: [],
  quizResults: {},
  scenariosWon: [],
  xp: 0,
  streak: { current: 0, longest: 0, lastStudyDate: null },
};

// --- Levels (AI-flavored) --------------------------------------------------

export interface LevelInfo {
  level: number;
  title: string;
  currentThreshold: number;
  nextThreshold: number | null;
  xpIntoLevel: number;
  xpForLevel: number;
  progressPct: number;
  isMax: boolean;
}

const LEVELS: { threshold: number; title: string }[] = [
  { threshold: 0, title: "Prompt Padawan" },
  { threshold: 200, title: "Neural Novice" },
  { threshold: 500, title: "Model Wrangler" },
  { threshold: 1000, title: "AI Engineer" },
  { threshold: 1700, title: "Singularity Sage" },
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

export function loadProgress(): AiProgressState {
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

function saveProgress(state: AiProgressState) {
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

function applyStreak(state: AiProgressState) {
  const today = localDateStr(new Date());
  const last = state.streak.lastStudyDate;
  if (last === today) return;

  const yesterday = localDateStr(new Date(Date.now() - 24 * 60 * 60 * 1000));
  state.streak.current = last === yesterday ? state.streak.current + 1 : 1;
  state.streak.lastStudyDate = today;
  state.streak.longest = Math.max(state.streak.longest, state.streak.current);
}

export function checkInToday(): AiProgressState {
  const state = loadProgress();
  applyStreak(state);
  saveProgress(state);
  return state;
}

// --- Activity recording ----------------------------------------------------

export function recordQuizResult(
  topicId: string,
  score: number,
  total: number
): AiProgressState {
  const state = loadProgress();
  const passed = total > 0 && score / total >= 0.6;
  const alreadyMastered = state.completedTopics.includes(topicId);

  state.quizResults[topicId] = {
    score,
    total,
    completedAt: new Date().toISOString(),
  };

  if (passed && !alreadyMastered) {
    state.completedTopics.push(topicId);
    state.xp += 100 + score * 10;
  } else if (passed) {
    state.xp += score * 2;
  }

  applyStreak(state);
  saveProgress(state);
  return state;
}

export function recordScenarioWin(
  topicId: string,
  scenarioIndex: number
): AiProgressState {
  const state = loadProgress();
  const key = `${topicId}#${scenarioIndex}`;
  if (!state.scenariosWon.includes(key)) {
    state.scenariosWon.push(key);
    state.xp += 20;
    applyStreak(state);
    saveProgress(state);
  }
  return state;
}

export function isScenarioWon(
  state: AiProgressState,
  topicId: string,
  scenarioIndex: number
): boolean {
  return state.scenariosWon.includes(`${topicId}#${scenarioIndex}`);
}

// --- Derived: unlock status, badges, mastery -------------------------------

export type TopicStatus = "locked" | "available" | "in-progress" | "mastered";

// Topic 1 is always available; each later topic unlocks once the previous is mastered.
export function isTopicUnlocked(state: AiProgressState, topicId: string): boolean {
  const ordered = getAllTopics();
  const idx = ordered.findIndex((t) => t.id === topicId);
  if (idx <= 0) return true;
  const prev = ordered[idx - 1];
  return state.completedTopics.includes(prev.id);
}

export function getTopicStatus(state: AiProgressState, topicId: string): TopicStatus {
  if (state.completedTopics.includes(topicId)) return "mastered";
  if (!isTopicUnlocked(state, topicId)) return "locked";
  const started =
    topicId in state.quizResults ||
    state.scenariosWon.some((k) => k.startsWith(`${topicId}#`));
  return started ? "in-progress" : "available";
}

// A track badge is earned when every topic in that track is mastered.
export function getEarnedTrackBadges(state: AiProgressState): AITrack[] {
  return TRACK_ORDER.filter((track) => {
    const topics = getTopicsByTrack(track);
    return topics.length > 0 && topics.every((t) => state.completedTopics.includes(t.id));
  });
}

export function isTrackEarned(state: AiProgressState, track: AITrack): boolean {
  const topics = getTopicsByTrack(track);
  return topics.length > 0 && topics.every((t) => state.completedTopics.includes(t.id));
}

// Overall "AI Mastery" (0..100), weighted by TRACK_WEIGHTS. Each track blends
// how many of its topics are mastered with the best quiz percentages achieved.
export function getMastery(state: AiProgressState): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const track of TRACK_ORDER) {
    const weight = TRACK_WEIGHTS[track];
    if (weight === 0) continue;
    const topics = getTopicsByTrack(track);
    if (topics.length === 0) continue;

    const masteredFrac =
      topics.filter((t) => state.completedTopics.includes(t.id)).length / topics.length;

    const quizFrac =
      topics.reduce((sum, t) => {
        const r = state.quizResults[t.id];
        return sum + (r && r.total > 0 ? r.score / r.total : 0);
      }, 0) / topics.length;

    const trackScore = 0.6 * masteredFrac + 0.4 * quizFrac;
    weightedSum += trackScore * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 100);
}

export function getXP(): number {
  return loadProgress().xp;
}

export function resetProgress(): AiProgressState {
  saveProgress(EMPTY_STATE);
  return EMPTY_STATE;
}
