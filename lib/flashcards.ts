import type { Pattern } from "./types";
import type { Flashcard } from "@/components/learning/Flashcards";

// Build a flashcard deck for a pattern from its existing content — no separate
// authoring needed, and always in sync with the pattern data.
export function buildPatternFlashcards(p: Pattern): Flashcard[] {
  const cards: Flashcard[] = [
    { front: `In one line, what is the ${p.title}?`, back: p.oneLiner },
    { front: `What problem does ${p.hero.name} (${p.title}) solve?`, back: p.story.problem },
    { front: `How does the ${p.title} solve it?`, back: p.story.solution },
    { front: `${p.hero.name}'s superpower?`, back: p.hero.power },
    { front: `${p.hero.name}'s weakness?`, back: p.hero.weakness },
  ];

  if (p.explanation.useWhen.length) {
    cards.push({ front: `When should you USE the ${p.title}?`, back: p.explanation.useWhen.join(" • ") });
  }
  if (p.explanation.avoidWhen.length) {
    cards.push({ front: `When should you AVOID the ${p.title}?`, back: p.explanation.avoidWhen.join(" • ") });
  }

  for (const q of p.quiz) {
    cards.push({ front: q.question, back: `${q.answer} — ${q.explanation}` });
  }

  return cards;
}
