"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ComicPanel from "./ComicPanel";
import type { ComicPanelData } from "@/lib/types";

interface ComicReaderProps {
  panels: ComicPanelData[];
  accent?: string;
}

export default function ComicReader({ panels, accent }: ComicReaderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const isFirst = index === 0;
  const isLast = index === panels.length - 1;

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= panels.length) return;
    setDirection(nextIndex > index ? 1 : -1);
    setIndex(nextIndex);
  };

  return (
    <div className="bg-halftone comic-border flex flex-col gap-5 bg-paper-dim p-4 sm:p-6">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={reduceMotion ? undefined : { opacity: 0, x: direction * 40 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.25 }}
        >
          <ComicPanel panel={panels[index]} index={index} accent={accent} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          className="comic-border-sm font-comic bg-paper px-4 py-2 text-sm tracking-wide transition-transform hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0 sm:text-base"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Comic panels">
          {panels.map((panel, i) => (
            <button
              key={panel.label}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Panel ${i + 1}: ${panel.label}`}
              onClick={() => goTo(i)}
              className={`h-3 w-3 rounded-full border-2 border-ink transition-colors ${
                i === index ? "bg-ink" : "bg-paper"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          className="comic-border-sm font-comic bg-hero-blue px-4 py-2 text-sm tracking-wide text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0 sm:text-base"
        >
          Next Panel →
        </button>
      </div>
    </div>
  );
}
