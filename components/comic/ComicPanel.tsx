"use client";

import { motion, useReducedMotion } from "framer-motion";
import SpeechBubble from "./SpeechBubble";
import type { ComicPanelData } from "@/lib/types";

const PANEL_STYLES: Record<ComicPanelData["type"], { bg: string; halftone: string; label: string }> = {
  problem: { bg: "bg-action-red/10", halftone: "bg-halftone", label: "text-action-red" },
  hero: { bg: "bg-hero-blue/10", halftone: "bg-halftone", label: "text-hero-blue" },
  power: { bg: "bg-comic-yellow/20", halftone: "bg-halftone-yellow", label: "text-comic-yellow-dark" },
  result: { bg: "bg-emerald-500/10", halftone: "bg-halftone", label: "text-emerald-700" },
};

interface ComicPanelProps {
  panel: ComicPanelData;
  index: number;
  accent?: string;
}

export default function ComicPanel({ panel, index, accent }: ComicPanelProps) {
  const style = PANEL_STYLES[panel.type];
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={`comic-border relative flex flex-col gap-4 overflow-hidden p-5 sm:p-6 ${style.bg}`}
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className={`pointer-events-none absolute inset-0 ${style.halftone}`} aria-hidden="true" />
      <figcaption className="relative flex items-center gap-2">
        <span className={`font-comic text-sm tracking-widest sm:text-base ${style.label}`}>
          {String(index + 1).padStart(2, "0")} · {panel.label}
        </span>
      </figcaption>
      <div className="relative flex items-center justify-center py-4">
        <span
          className="comic-border-sm flex h-24 w-24 items-center justify-center rounded-full bg-paper text-5xl sm:h-28 sm:w-28 sm:text-6xl"
          role="img"
          aria-label={`${panel.label} illustration`}
          style={accent ? { boxShadow: `4px 4px 0 0 ${accent}` } : undefined}
        >
          {panel.emoji}
        </span>
      </div>
      <p className="comic-border-sm relative bg-paper px-3 py-2 text-base leading-relaxed break-words sm:text-lg">
        {panel.caption}
      </p>
      {panel.speaker && panel.dialogue && (
        <div className="relative mt-2">
          <SpeechBubble speaker={panel.speaker} message={panel.dialogue} accent={accent} />
        </div>
      )}
    </motion.figure>
  );
}
