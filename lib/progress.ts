const STORAGE_KEY = "pattern-verse:progress";

export interface QuizResult {
  score: number;
  total: number;
  completedAt: string;
}

export interface ProgressState {
  completedPatterns: string[];
  quizResults: Record<string, QuizResult>;
  codeBattlesWon: string[];
  bookmarks: string[];
  xp: number;
}

const EMPTY_STATE: ProgressState = {
  completedPatterns: [],
  quizResults: {},
  codeBattlesWon: [],
  bookmarks: [],
  xp: 0,
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadProgress(): ProgressState {
  if (!isBrowser()) return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_STATE, ...parsed };
  } catch {
    return EMPTY_STATE;
  }
}

function saveProgress(state: ProgressState) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("pattern-verse:progress-updated"));
}

export function isPatternMastered(patternId: string): boolean {
  return loadProgress().completedPatterns.includes(patternId);
}

export function subscribeToProgress(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener("pattern-verse:progress-updated", callback);
  return () => window.removeEventListener("pattern-verse:progress-updated", callback);
}

export function recordQuizResult(patternId: string, score: number, total: number): ProgressState {
  const state = loadProgress();
  const passed = total > 0 && score / total >= 0.6;
  const alreadyMastered = state.completedPatterns.includes(patternId);

  state.quizResults[patternId] = {
    score,
    total,
    completedAt: new Date().toISOString(),
  };

  if (passed && !alreadyMastered) {
    state.completedPatterns.push(patternId);
    state.xp += 100 + score * 10;
  } else if (passed) {
    state.xp += score * 2;
  }

  saveProgress(state);
  return state;
}

export function recordCodeBattleWin(patternId: string): ProgressState {
  const state = loadProgress();
  if (!state.codeBattlesWon.includes(patternId)) {
    state.codeBattlesWon.push(patternId);
    state.xp += 25;
    saveProgress(state);
  }
  return state;
}

export function toggleBookmark(patternId: string): ProgressState {
  const state = loadProgress();
  const idx = state.bookmarks.indexOf(patternId);
  if (idx >= 0) {
    state.bookmarks.splice(idx, 1);
  } else {
    state.bookmarks.push(patternId);
  }
  saveProgress(state);
  return state;
}

export function getXP(): number {
  return loadProgress().xp;
}

export function resetProgress(): ProgressState {
  saveProgress(EMPTY_STATE);
  return EMPTY_STATE;
}
