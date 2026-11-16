import { TEMPLATES } from "./templates";
import type { Design } from "./types";

const STORAGE_KEY = "design-studio:designs";

export interface StudioState {
  designs: Design[];
  activeId: string | null;
}

export function emptyStudio(): StudioState {
  return { designs: [], activeId: null };
}

// A first-run studio seeded with the three-tier template so there's something to look at.
export function seedStudio(): StudioState {
  const d = TEMPLATES.find((t) => t.key === "three-tier")!.make();
  return { designs: [d], activeId: d.id };
}

export function loadStudio(): StudioState {
  if (typeof window === "undefined") return emptyStudio();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedStudio();
    const parsed = JSON.parse(raw) as StudioState;
    if (!parsed.designs || parsed.designs.length === 0) return seedStudio();
    return parsed;
  } catch {
    return seedStudio();
  }
}

export function saveStudio(state: StudioState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
