"use client";

import { useState } from "react";
import type { Scenario } from "@/lib/aws/types";
import { recordScenarioWin } from "@/lib/aws/progress";

interface ScenarioChallengeProps {
  segmentId: string;
  index: number;
  scenario: Scenario;
}

// "Pick-the-right-architecture" challenge — mirrors the Pattern-Verse Code Battle,
// recording a win (and XP) to lib/aws/progress the first time it's solved.
export default function ScenarioChallenge({ segmentId, index, scenario }: ScenarioChallengeProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePick = (optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    if (optionId === scenario.correct) {
      recordScenarioWin(segmentId, index);
    }
  };

  const isCorrect = selected === scenario.correct;

  return (
    <div className="comic-border bg-halftone-yellow relative overflow-hidden bg-paper p-6 sm:p-8">
      <p className="font-comic text-2xl tracking-wide text-aws-orange-dark sm:text-3xl">
        🏗️ SCENARIO {index + 1}
      </p>
      <p className="mt-3 text-sm leading-relaxed sm:text-base">{scenario.scenario}</p>
      <p className="font-comic mt-4 text-lg tracking-wide sm:text-xl">{scenario.question}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label={scenario.question}>
        {scenario.options.map((option, i) => {
          const isPicked = selected === option.id;
          const showCorrect = selected && option.id === scenario.correct;
          const showWrong = isPicked && option.id !== scenario.correct;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePick(option.id)}
              disabled={!!selected}
              className={`comic-border-sm break-words px-4 py-3 text-left text-sm font-semibold transition-colors sm:text-base ${
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
          <p className="font-comic tracking-wide">{isCorrect ? "⚡ CORRECT! +20 XP" : "💥 NOT QUITE"}</p>
          <p className="mt-1">{scenario.explanation}</p>
        </div>
      )}
    </div>
  );
}
