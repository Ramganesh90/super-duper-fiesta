"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

export default function CodeBlock({ code, language = "typescript", label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access denied; nothing to recover, the code stays selectable.
    }
  };

  return (
    <div className="comic-border-sm overflow-hidden bg-ink text-paper">
      <div className="flex items-center justify-between border-b-2 border-paper/20 px-4 py-2">
        <span className="font-code text-xs uppercase tracking-widest text-paper/70">
          {label ?? language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-code rounded border border-paper/40 px-2 py-1 text-xs text-paper/80 transition-colors hover:bg-paper/10"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="font-code overflow-x-auto p-4 text-xs leading-relaxed sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
