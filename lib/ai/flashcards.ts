import type { Topic } from "./types";
import type { Flashcard } from "@/components/learning/Flashcards";

// Build a flashcard deck for an AI topic from its existing content.
export function buildTopicFlashcards(t: Topic): Flashcard[] {
  const cards: Flashcard[] = [
    { front: `In one line: ${t.title}?`, back: t.oneLiner },
  ];

  // Jargon-in-plain-English makes excellent term/definition cards.
  for (const kt of t.keyTerms) {
    cards.push({ front: kt.term, back: kt.plain });
  }

  t.keyConcepts.forEach((c, i) => {
    cards.push({ front: `Key concept #${i + 1} (${t.title})`, back: c });
  });

  for (const q of t.quiz) {
    cards.push({ front: q.question, back: `${q.answer} — ${q.explanation}` });
  }

  return cards;
}
