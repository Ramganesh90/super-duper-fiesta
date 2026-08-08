"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export interface HeroSummary {
  id: string;
  name: string;
  emoji: string;
}

interface RandomHeroButtonProps {
  patterns: HeroSummary[];
}

type Phase = "idle" | "shuffling" | "landed";

const SHUFFLE_DURATION_MS = 1100;
const SHUFFLE_TICK_MS = 75;
const LANDED_PAUSE_MS = 450;

export default function RandomHeroButton({ patterns }: RandomHeroButtonProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [shownHero, setShownHero] = useState<HeroSummary | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const pickRandom = () => patterns[Math.floor(Math.random() * patterns.length)];

  const handleSummon = async () => {
    if (phase !== "idle" || patterns.length === 0) return;

    const finalHero = pickRandom();

    if (reduceMotion) {
      router.push(`/patterns/${finalHero.id}`);
      return;
    }

    setPhase("shuffling");
    const start = Date.now();
    while (Date.now() - start < SHUFFLE_DURATION_MS) {
      if (cancelledRef.current) return;
      setShownHero(pickRandom());
      await new Promise((resolve) => setTimeout(resolve, SHUFFLE_TICK_MS));
    }

    if (cancelledRef.current) return;
    setShownHero(finalHero);
    setPhase("landed");
    await new Promise((resolve) => setTimeout(resolve, LANDED_PAUSE_MS));
    if (cancelledRef.current) return;
    router.push(`/patterns/${finalHero.id}`);
  };

  const isBusy = phase !== "idle";

  return (
    <div className="relative flex flex-col items-center gap-4">
      {phase === "shuffling" && !reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="bg-halftone-yellow pointer-events-none absolute -inset-8 -z-10 rounded-full"
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      <motion.button
        type="button"
        onClick={handleSummon}
        disabled={isBusy}
        whileHover={!isBusy && !reduceMotion ? { scale: 1.05, rotate: -1 } : undefined}
        whileTap={!isBusy && !reduceMotion ? { scale: 0.95 } : undefined}
        className="comic-border font-comic relative bg-comic-yellow px-8 py-5 text-xl tracking-wide text-ink transition-opacity disabled:opacity-90 sm:text-2xl"
      >
        <motion.span
          aria-hidden="true"
          className="mr-2 inline-block"
          animate={
            phase === "shuffling" && !reduceMotion
              ? { rotate: [0, -18, 16, -12, 0], scale: [1, 1.25, 1.1, 1.2, 1] }
              : phase === "landed" && !reduceMotion
                ? { scale: [1, 1.5, 1] }
                : undefined
          }
          transition={phase === "shuffling" ? { duration: 0.5, repeat: Infinity } : { duration: 0.4 }}
        >
          ⚡
        </motion.span>
        {phase === "idle" && "SUMMON A RANDOM HERO"}
        {phase === "shuffling" && "SUMMONING…"}
        {phase === "landed" && "IT'S YOU!"}
      </motion.button>

      <div className="flex h-8 items-center">
        {shownHero && isBusy && (
          <motion.p
            key={`${shownHero.id}-${phase}`}
            initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            aria-hidden={phase === "shuffling" ? true : undefined}
            aria-live={phase === "landed" ? "polite" : undefined}
            className="font-comic text-lg tracking-wide text-hero-blue sm:text-xl"
          >
            {shownHero.emoji} {shownHero.name.toUpperCase()}
          </motion.p>
        )}
      </div>
    </div>
  );
}
