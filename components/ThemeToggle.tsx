"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// Inline script (run before paint) that sets data-theme from storage/OS so there
// is no flash of the wrong theme. Rendered as the first element in <body>.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('study-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read the theme the init script already applied.
  useEffect(() => {
    const read = () => {
      const current = (document.documentElement.dataset.theme as Theme) || "light";
      setTheme(current);
      setMounted(true);
    };
    read();
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("study-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  // Render a stable label until mounted to avoid hydration mismatch.
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="comic-border-sm bg-paper px-3 py-1.5 text-base transition-transform hover:-translate-y-0.5"
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
