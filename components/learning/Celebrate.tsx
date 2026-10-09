"use client";

import { useEffect, useState } from "react";

// Pre-computed particle vectors at module scope — avoids impure calls during
// render. Looks lively enough; identical each burst, which nobody notices.
const COLORS = ["🎉", "✨", "⭐", "🎊", "💥", "🏆"];
const PIECES = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  const dist = 120 + ((i * 37) % 160);
  return {
    dx: `${Math.round(Math.cos(angle) * dist)}px`,
    dy: `${Math.round(Math.sin(angle) * dist - 80)}px`,
    rot: `${((i * 53) % 720) - 360}deg`,
    emoji: COLORS[i % COLORS.length],
    delay: `${(i % 5) * 30}ms`,
  };
});

// Fires a one-shot confetti burst whenever `runId` changes to a new positive
// value. Fixed, pointer-events-none overlay. Reduced-motion users get no motion
// (the global reduced-motion rule zeroes the animation).
export default function Celebrate({ runId }: { runId: number }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const run = () => {
      if (runId <= 0) return;
      setActive(true);
      const t = setTimeout(() => setActive(false), 1300);
      return () => clearTimeout(t);
    };
    return run();
  }, [runId]);

  if (!active) return null;

  return (
    <div
      key={runId}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center overflow-hidden"
    >
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              "--dx": p.dx,
              "--dy": p.dy,
              "--rot": p.rot,
              animationDelay: p.delay,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
