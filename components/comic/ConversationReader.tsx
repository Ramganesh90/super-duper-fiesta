"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SpeechBubble from "./SpeechBubble";
import type { ConversationLine } from "@/lib/types";

interface ConversationReaderProps {
  conversation: ConversationLine[];
  heroName: string;
  accent?: string;
}

export default function ConversationReader({ conversation, heroName, accent }: ConversationReaderProps) {
  const [revealed, setRevealed] = useState(1);
  const reduceMotion = useReducedMotion();
  const isDone = revealed >= conversation.length;

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence initial={false}>
        {conversation.slice(0, revealed).map((line, i) => (
          <motion.div
            key={i}
            initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SpeechBubble
              speaker={line.speaker}
              message={line.message}
              align={i % 2 === 0 ? "left" : "right"}
              accent={line.speaker === heroName ? accent : undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!isDone && (
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(r + 1, conversation.length))}
          className="comic-border-sm font-comic self-center bg-hero-blue px-5 py-2.5 text-paper tracking-wide transition-transform hover:-translate-y-0.5"
        >
          Continue ↓ ({revealed}/{conversation.length})
        </button>
      )}
    </div>
  );
}
