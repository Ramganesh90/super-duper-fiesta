"use client";

import { useEffect, useState } from "react";
import {
  loadProgress,
  subscribeToProgress,
  type AiProgressState,
} from "@/lib/ai/progress";

// Returns the full AI progress state and re-renders on change. Starts empty so
// server and first client render match, then hydrates from localStorage.
export function useAiProgress(): AiProgressState {
  const [state, setState] = useState<AiProgressState>(() => ({
    completedTopics: [],
    quizResults: {},
    scenariosWon: [],
    xp: 0,
    streak: { current: 0, longest: 0, lastStudyDate: null },
  }));

  useEffect(() => {
    const sync = () => setState(loadProgress());
    sync();
    return subscribeToProgress(sync);
  }, []);

  return state;
}
