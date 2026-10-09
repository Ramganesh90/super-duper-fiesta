"use client";

import { useEffect, useMemo, useState } from "react";

export interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsProps {
  cards: Flashcard[];
  // Tailwind bg class for the accent buttons, e.g. "bg-hero-blue" / "bg-aws-orange" / "bg-ai-violet".
  accent?: string;
  // Text color that pairs with the accent bg.
  accentText?: string;
  // Stable id for this deck; when set, "known" cards persist in localStorage.
  deckId?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Self-contained flashcard deck: flip to reveal, step through, shuffle, and track
// how many you got right this session. No persistence — a lightweight study aid.
export default function Flashcards({
  cards,
  accent = "bg-hero-blue",
  accentText = "text-paper",
  deckId,
}: FlashcardsProps) {
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  // Load persisted "known" cards for this deck (starts empty so SSR matches).
  useEffect(() => {
    const load = () => {
      let next = new Set<number>();
      try {
        if (deckId) {
          const raw = window.localStorage.getItem(`flashcards:known:${deckId}`);
          if (raw) next = new Set(JSON.parse(raw) as number[]);
        }
      } catch {
        /* ignore */
      }
      setKnown(next);
      setHydrated(true);
    };
    load();
  }, [deckId]);

  useEffect(() => {
    if (!hydrated || !deckId) return;
    try {
      window.localStorage.setItem(`flashcards:known:${deckId}`, JSON.stringify([...known]));
    } catch {
      /* ignore */
    }
  }, [known, hydrated, deckId]);

  const current = cards[order[pos]];
  const total = cards.length;

  const knownCount = known.size;
  const accentBtn = `${accent} ${accentText}`;

  const go = (next: number) => {
    setFlipped(false);
    setPos((next + total) % total);
  };

  const reshuffle = () => {
    setOrder(shuffle(cards.map((_, i) => i)));
    setPos(0);
    setFlipped(false);
  };

  const markKnown = () => {
    setKnown((prev) => {
      const s = new Set(prev);
      s.add(order[pos]);
      return s;
    });
    if (pos < total - 1) go(pos + 1);
  };

  const restart = () => {
    setKnown(new Set());
    setOrder(cards.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  };

  const progressPct = useMemo(
    () => (total > 0 ? Math.round((knownCount / total) * 100) : 0),
    [knownCount, total]
  );

  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>
          Card {pos + 1} of {total}
        </span>
        <span>
          ✅ {knownCount} known ({progressPct}%)
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-live="polite"
        className="flip-card block w-full text-center"
      >
        <span className={`flip-inner block ${flipped ? "is-flipped" : ""}`}>
          <span className="flip-face comic-border flex min-h-[11rem] w-full flex-col items-center justify-center gap-3 bg-paper p-6 sm:min-h-[13rem]">
            <span className="font-comic text-xs uppercase tracking-widest text-ink/50">Prompt · tap to flip</span>
            <span className="text-base leading-relaxed sm:text-lg">{current.front}</span>
          </span>
          <span className="flip-face flip-face-back comic-border flex min-h-[11rem] w-full flex-col items-center justify-center gap-3 bg-paper p-6 sm:min-h-[13rem]">
            <span className="font-comic text-xs uppercase tracking-widest text-ink/50">Answer · tap to flip</span>
            <span className="text-base leading-relaxed sm:text-lg">{current.back}</span>
            {known.has(order[pos]) && (
              <span className="text-xs font-semibold text-emerald-700">marked known</span>
            )}
          </span>
        </span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => go(pos - 1)}
          className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={`comic-border-sm font-comic px-4 py-2 text-sm transition-transform hover:-translate-y-0.5 ${accentBtn}`}
        >
          Flip
        </button>
        <button
          type="button"
          onClick={markKnown}
          className="comic-border-sm font-comic bg-emerald-500 px-4 py-2 text-sm text-paper transition-transform hover:-translate-y-0.5"
        >
          Got it ✓
        </button>
        <button
          type="button"
          onClick={() => go(pos + 1)}
          className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
        >
          Next →
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <button
          type="button"
          onClick={reshuffle}
          className="font-semibold text-ink/70 underline-offset-2 hover:underline"
        >
          🔀 Shuffle
        </button>
        <button
          type="button"
          onClick={restart}
          className="font-semibold text-ink/70 underline-offset-2 hover:underline"
        >
          ↺ Restart
        </button>
      </div>
    </div>
  );
}
