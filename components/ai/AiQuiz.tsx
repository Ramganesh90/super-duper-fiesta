"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/ai/types";
import { recordQuizResult } from "@/lib/ai/progress";

interface AiQuizProps {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestion[];
}

// Scored quiz for a topic. Passing (≥60%) marks it mastered, awards XP, and
// advances the daily streak via lib/ai/progress.
export default function AiQuiz({ topicId, topicTitle, questions }: AiQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const isCorrect = selected === question?.answer;
  const isLast = index === questions.length - 1;

  const handleSelect = (option: string) => {
    if (revealed) return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (!selected) return;
    setRevealed(true);
    if (selected === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      recordQuizResult(topicId, score, questions.length);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  const handleRetry = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const passed = score / questions.length >= 0.6;
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-comic text-3xl tracking-wide">
          {score} / {questions.length} CORRECT
        </p>
        {passed ? (
          <div
            role="status"
            className="comic-border flex flex-col items-center gap-2 bg-comic-yellow p-6 text-center text-ink"
          >
            <span className="text-5xl" aria-hidden="true">🏆</span>
            <p className="font-comic text-2xl tracking-wide sm:text-3xl">TOPIC MASTERED</p>
            <p className="text-sm sm:text-base">
              You conquered <strong>{topicTitle}</strong>. XP awarded and the next topic is unlocked!
            </p>
          </div>
        ) : (
          <p className="max-w-md text-sm sm:text-base">
            Not quite mastered — you need at least 60%. Re-read the analogy and concepts above and try again!
          </p>
        )}
        <button
          type="button"
          onClick={handleRetry}
          className="comic-border-sm font-comic bg-hero-blue px-4 py-2 text-paper transition-transform hover:-translate-y-0.5"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <fieldset className="comic-border-sm bg-paper p-5">
        <legend className="font-comic px-2 text-lg tracking-wide sm:text-xl">{question.question}</legend>
        <div className="mt-3 flex flex-col gap-3" role="radiogroup" aria-label={question.question}>
          {question.options.map((option) => {
            const isSelected = selected === option;
            const showCorrect = revealed && option === question.answer;
            const showWrong = revealed && isSelected && option !== question.answer;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(option)}
                disabled={revealed}
                className={`comic-border-sm break-words px-4 py-3 text-left text-sm transition-colors sm:text-base ${
                  showCorrect
                    ? "bg-emerald-500/20"
                    : showWrong
                      ? "bg-action-red/20"
                      : isSelected
                        ? "bg-comic-yellow/30"
                        : "bg-paper hover:bg-paper-dim"
                }`}
              >
                {option}
                {showCorrect && <span className="ml-2" aria-hidden="true">✅</span>}
                {showWrong && <span className="ml-2" aria-hidden="true">❌</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      {revealed && (
        <div
          className={`comic-border-sm p-4 text-sm sm:text-base ${isCorrect ? "bg-emerald-500/10" : "bg-action-red/10"}`}
        >
          <p className="font-comic tracking-wide">{isCorrect ? "⚡ CORRECT!" : "💥 NOT QUITE"}</p>
          <p className="mt-1">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!revealed ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!selected}
            className="comic-border-sm font-comic bg-hero-blue px-4 py-2 text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          >
            Check Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="comic-border-sm font-comic bg-ai-violet px-4 py-2 text-paper transition-transform hover:-translate-y-0.5"
          >
            {isLast ? "See Results" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}
