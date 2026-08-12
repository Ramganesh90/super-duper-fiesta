"use client";

import { useEffect, useState } from "react";
import {
  loadProgress,
  subscribeToProgress,
  type AwsProgressState,
} from "@/lib/aws/progress";

// Returns the full AWS progress state and re-renders whenever it changes.
// Starts from the empty state so server and first client render match, then
// hydrates from localStorage on mount to avoid a hydration mismatch.
export function useAwsProgress(): AwsProgressState {
  const [state, setState] = useState<AwsProgressState>(() => ({
    completedSegments: [],
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
