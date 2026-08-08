"use client";

import { useState } from "react";
import type { CodeBattle as CodeBattleData } from "@/lib/types";
import { recordCodeBattleWin } from "@/lib/progress";

interface CodeBattleProps {
  patternId: string;
  battle: CodeBattleData;
}

export default function CodeBattle({ patternId, battle }: CodeBattleProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePick = (optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    if (optionId === battle.correct) {
      recordCodeBattleWin(patternId);
    }
  };

  const isCorrect = selected === battle.correct;

  return (
    <div className="comic-border bg-halftone-yellow relative overflow-hidden bg-paper p-6 sm:p-8">
      <p className="font-comic text-2xl tracking-wide text-action-red sm:text-3xl">⚔️ CODE BATTLE</p>
      <p className="mt-3 text-sm leading-relaxed sm:text-base">{battle.scenario}</p>
      <p className="font-comic mt-4 text-lg tracking-wide sm:text-xl">{battle.question}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label={battle.question}>
        {battle.options.map((option, i) => {
          const isPicked = selected === option.id;
          const showCorrect = selected && option.id === battle.correct;
          const showWrong = isPicked && option.id !== battle.correct;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePick(option.id)}
              disabled={!!selected}
              className={`comic-border-sm px-4 py-3 text-left text-sm font-semibold transition-colors sm:text-base ${
                showCorrect
                  ? "bg-emerald-500/20"
                  : showWrong
                    ? "bg-action-red/20"
                    : "bg-paper hover:bg-paper-dim"
              }`}
            >
              {String.fromCharCode(65 + i)}. {option.label}
              {showCorrect && <span className="ml-2" aria-hidden="true">✅</span>}
              {showWrong && <span className="ml-2" aria-hidden="true">❌</span>}
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className={`comic-border-sm mt-4 p-4 text-sm sm:text-base ${isCorrect ? "bg-emerald-500/10" : "bg-action-red/10"}`}
        >
          <p className="font-comic tracking-wide">{isCorrect ? "⚡ CORRECT!" : "💥 NOT QUITE"}</p>
          <p className="mt-1">{battle.explanation}</p>
        </div>
      )}
    </div>
  );
}
