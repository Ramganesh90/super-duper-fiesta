import type { TopicCharacter } from "@/lib/ai/types";

// The comic persona for a topic: character + their plain-English analogy.
export default function CharacterCard({
  character,
  analogy,
}: {
  character: TopicCharacter;
  analogy: string;
}) {
  return (
    <div className="comic-border bg-halftone relative overflow-hidden bg-paper-dim p-5 sm:p-7">
      <div className="flex items-center gap-4">
        <span className="text-5xl sm:text-6xl" aria-hidden="true">{character.emoji}</span>
        <div>
          <p className="font-comic text-2xl tracking-wide text-ai-violet-dark sm:text-3xl">
            {character.name}
          </p>
          <p className="text-sm italic text-ink/80 sm:text-base">&ldquo;{character.tagline}&rdquo;</p>
        </div>
      </div>
      <div className="speech-bubble mt-5 p-4 sm:p-5">
        <p className="text-sm leading-relaxed sm:text-base">{analogy}</p>
      </div>
    </div>
  );
}
