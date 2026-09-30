import type { Segment } from "./types";
import type { Flashcard } from "@/components/learning/Flashcards";

// Build a flashcard deck for an AWS segment from its existing content.
export function buildSegmentFlashcards(s: Segment): Flashcard[] {
  const cards: Flashcard[] = [
    { front: `What is the focus of Week ${s.week}: ${s.title}?`, back: s.oneLiner },
  ];

  for (const svc of s.services) {
    cards.push({ front: `AWS service — ${svc.name}: what's it for?`, back: svc.purpose });
  }

  s.keyConcepts.forEach((c, i) => {
    cards.push({ front: `Key concept #${i + 1} (${s.title})`, back: c });
  });

  for (const q of s.quiz) {
    cards.push({ front: q.question, back: `${q.answer} — ${q.explanation}` });
  }

  return cards;
}
