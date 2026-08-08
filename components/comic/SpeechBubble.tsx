interface SpeechBubbleProps {
  speaker: string;
  message: string;
  align?: "left" | "right";
  accent?: string;
}

export default function SpeechBubble({ speaker, message, align = "left", accent }: SpeechBubbleProps) {
  const isRight = align === "right";
  return (
    <div className={`flex flex-col ${isRight ? "items-end text-right" : "items-start text-left"}`}>
      <span
        className="font-comic mb-1 px-2 text-sm tracking-wide"
        style={accent ? { color: accent } : undefined}
      >
        {speaker}
      </span>
      <div
        className={`speech-bubble ${isRight ? "speech-bubble-right" : ""} max-w-prose px-4 py-3 text-base leading-snug sm:text-lg`}
      >
        {message}
      </div>
    </div>
  );
}
