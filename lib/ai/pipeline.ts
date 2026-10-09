// Rules engine for the "Build your own AI pipeline" sandbox. Pure logic: given a
// pipeline configuration, return findings (pass/info/warn/fail) that the UI turns
// into a checklist and per-capability visual clues. Encodes modern AI-engineering
// best practices — grounding, guardrails, evaluation, and ops/cost.

export type UseCase = "rag_qa" | "assistant" | "agent" | "classification";
export type ModelSize = "small" | "large";
export type Pillar = "quality" | "safety" | "evaluation" | "ops";
export type Severity = "pass" | "info" | "warn" | "fail";

// Boolean capability keys the user toggles.
export type CapabilityKey =
  | "systemPrompt"
  | "retrieval"
  | "citations"
  | "inputGuardrail"
  | "outputGuardrail"
  | "tools"
  | "toolGuardrails"
  | "evals"
  | "monitoring"
  | "caching"
  | "piiHandling"
  | "humanInLoop";

export interface PipelineState {
  useCase: UseCase;
  modelSize: ModelSize;
  caps: Record<CapabilityKey, boolean>;
}

export interface Finding {
  id: string;
  pillar: Pillar;
  severity: Severity;
  title: string;
  detail: string;
  fix?: string;
  targets: CapabilityKey[]; // capability chips to highlight
}

export const PILLAR_LABELS: Record<Pillar, string> = {
  quality: "📝 Quality & Grounding",
  safety: "🛡️ Safety & Guardrails",
  evaluation: "🧪 Evaluation",
  ops: "🚀 Ops & Cost",
};

export const USE_CASES: { key: UseCase; label: string; emoji: string; blurb: string }[] = [
  { key: "rag_qa", label: "Knowledge Q&A (RAG)", emoji: "📚", blurb: "Answers questions from your documents." },
  { key: "assistant", label: "Chat assistant", emoji: "💬", blurb: "General conversational assistant." },
  { key: "agent", label: "Tool-using agent", emoji: "🤖", blurb: "Takes actions via tools/APIs." },
  { key: "classification", label: "Classification / extraction", emoji: "🏷️", blurb: "Labels or extracts structured data." },
];

export const CAPABILITIES: {
  key: CapabilityKey;
  label: string;
  emoji: string;
  pillar: Pillar;
}[] = [
  { key: "systemPrompt", label: "System prompt", emoji: "🗣️", pillar: "quality" },
  { key: "retrieval", label: "Retrieval (RAG)", emoji: "🗄️", pillar: "quality" },
  { key: "citations", label: "Citations / grounding", emoji: "🔖", pillar: "quality" },
  { key: "inputGuardrail", label: "Input guardrail", emoji: "🛂", pillar: "safety" },
  { key: "outputGuardrail", label: "Output guardrail", emoji: "🧯", pillar: "safety" },
  { key: "tools", label: "Tools / actions", emoji: "🛠️", pillar: "safety" },
  { key: "toolGuardrails", label: "Tool permissions/limits", emoji: "🔒", pillar: "safety" },
  { key: "piiHandling", label: "PII handling", emoji: "🕵️", pillar: "safety" },
  { key: "humanInLoop", label: "Human in the loop", emoji: "🧑‍⚖️", pillar: "safety" },
  { key: "evals", label: "Evals / test suite", emoji: "🧪", pillar: "evaluation" },
  { key: "monitoring", label: "Monitoring / tracing", emoji: "📹", pillar: "ops" },
  { key: "caching", label: "Caching", emoji: "⚡", pillar: "ops" },
];

export function emptyState(): PipelineState {
  return {
    useCase: "rag_qa",
    modelSize: "large",
    caps: {
      systemPrompt: false,
      retrieval: false,
      citations: false,
      inputGuardrail: false,
      outputGuardrail: false,
      tools: false,
      toolGuardrails: false,
      evals: false,
      monitoring: false,
      caching: false,
      piiHandling: false,
      humanInLoop: false,
    },
  };
}

// --- Rules -----------------------------------------------------------------

export function evaluate(state: PipelineState): Finding[] {
  const c = state.caps;
  const f: Finding[] = [];
  const isRag = state.useCase === "rag_qa";
  const isAgent = state.useCase === "agent";
  const isClassification = state.useCase === "classification";

  // ---- Quality & Grounding ----
  f.push(
    c.systemPrompt
      ? { id: "sysprompt", pillar: "quality", severity: "pass", title: "System prompt set", detail: "A system prompt anchors the model's role and behavior.", targets: [] }
      : { id: "sysprompt", pillar: "quality", severity: "warn", title: "No system prompt", detail: "Without a system prompt, behavior and tone drift between calls.", fix: "Add a system prompt defining role, rules, and output format.", targets: ["systemPrompt"] }
  );

  if (isRag) {
    f.push(
      c.retrieval
        ? { id: "grounding", pillar: "quality", severity: "pass", title: "Grounded with retrieval", detail: "Answers are grounded in retrieved documents.", targets: [] }
        : { id: "grounding", pillar: "quality", severity: "fail", title: "No grounding for a knowledge app", detail: "A Q&A app with no retrieval will answer from memory and hallucinate.", fix: "Add RAG: retrieve relevant chunks and put them in the prompt.", targets: ["retrieval"] }
    );
  } else {
    f.push({
      id: "grounding-opt",
      pillar: "quality",
      severity: c.retrieval ? "pass" : "info",
      title: c.retrieval ? "Retrieval enabled" : "Retrieval optional here",
      detail: c.retrieval
        ? "Retrieval grounds answers in your data."
        : "Add RAG if this must answer from private or current knowledge.",
      targets: [],
    });
  }

  if (c.retrieval) {
    f.push(
      c.citations
        ? { id: "citations", pillar: "quality", severity: "pass", title: "Citations enabled", detail: "Responses cite their sources, so answers are verifiable.", targets: [] }
        : { id: "citations", pillar: "quality", severity: "warn", title: "Retrieval without citations", detail: "Users can't verify grounded answers without source citations.", fix: "Return the source chunks/links alongside the answer.", targets: ["citations"] }
    );
  }

  // Model right-sizing (quality/cost overlap — placed here for use-case fit)
  if (isClassification && state.modelSize === "large") {
    f.push({
      id: "model-size",
      pillar: "ops",
      severity: "warn",
      title: "Oversized model for classification",
      detail: "A large model for simple labeling/extraction wastes cost and latency.",
      fix: "Try a small/cheap model; it likely passes your evals for this task.",
      targets: [],
    });
  }

  // ---- Safety & Guardrails ----
  f.push(
    c.inputGuardrail
      ? { id: "input-guard", pillar: "safety", severity: "pass", title: "Input guardrail", detail: "Inputs are screened before reaching the model.", targets: [] }
      : { id: "input-guard", pillar: "safety", severity: "warn", title: "No input guardrail", detail: "No defense against prompt injection or unsafe/off-topic input.", fix: "Screen and sanitize inputs before the model.", targets: ["inputGuardrail"] }
  );
  f.push(
    c.outputGuardrail
      ? { id: "output-guard", pillar: "safety", severity: "pass", title: "Output guardrail", detail: "Outputs are checked before reaching users.", targets: [] }
      : { id: "output-guard", pillar: "safety", severity: "warn", title: "No output guardrail", detail: "Unsafe, off-policy, or malformed output can reach users unchecked.", fix: "Validate/filter outputs (safety, PII, format) before returning them.", targets: ["outputGuardrail"] }
  );

  if (isAgent && !c.tools) {
    f.push({ id: "agent-tools", pillar: "safety", severity: "warn", title: "Agent has no tools", detail: "An agent needs tools to take actions; otherwise it's just a chatbot.", fix: "Add tool/function calling (or switch use case).", targets: ["tools"] });
  }
  if (c.tools) {
    f.push(
      c.toolGuardrails
        ? { id: "tool-guard", pillar: "safety", severity: "pass", title: "Tool permissions in place", detail: "Tools run with scoped permissions and limits.", targets: [] }
        : { id: "tool-guard", pillar: "safety", severity: "fail", title: "Tools without guardrails", detail: "The agent can take unchecked, possibly irreversible actions.", fix: "Add per-tool permissions, approvals for sensitive actions, and limits.", targets: ["toolGuardrails"] }
    );
    f.push(
      c.humanInLoop
        ? { id: "hitl", pillar: "safety", severity: "pass", title: "Human in the loop", detail: "A person reviews high-stakes actions before they run.", targets: [] }
        : { id: "hitl", pillar: "safety", severity: "warn", title: "No human in the loop", detail: "An autonomous agent acting on sensitive operations has no review step.", fix: "Require human approval for consequential/irreversible actions.", targets: ["humanInLoop"] }
    );
  }

  f.push(
    c.piiHandling
      ? { id: "pii", pillar: "safety", severity: "pass", title: "PII handled", detail: "Personal data is minimized/redacted and not leaked to logs.", targets: [] }
      : { id: "pii", pillar: "safety", severity: "warn", title: "No PII handling", detail: "User data may flow to the model/logs without redaction or consent limits.", fix: "Redact/minimize PII and avoid logging secrets.", targets: ["piiHandling"] }
  );

  // ---- Evaluation ----
  f.push(
    c.evals
      ? { id: "evals", pillar: "evaluation", severity: "pass", title: "Evals in place", detail: "A repeatable eval suite guards against quality regressions.", targets: [] }
      : { id: "evals", pillar: "evaluation", severity: "fail", title: "No evals", detail: "Shipping on vibes: you can't measure quality or catch regressions when prompts/models change.", fix: "Build an eval set (and/or LLM-as-judge) and run it on every change.", targets: ["evals"] }
  );

  // ---- Ops & Cost ----
  f.push(
    c.monitoring
      ? { id: "monitoring", pillar: "ops", severity: "pass", title: "Monitoring enabled", detail: "You can see latency, cost, errors, and quality drift in production.", targets: [] }
      : { id: "monitoring", pillar: "ops", severity: "warn", title: "No monitoring", detail: "No observability means silent cost spikes, failures, and quality drift.", fix: "Log inputs/outputs, latency, cost, and errors; track quality over time.", targets: ["monitoring"] }
  );
  f.push(
    c.caching
      ? { id: "caching", pillar: "ops", severity: "pass", title: "Caching enabled", detail: "Repeated/similar requests are served from cache — cheaper and faster.", targets: [] }
      : { id: "caching", pillar: "ops", severity: "info", title: "No caching", detail: "Caching repeats (and prompt caching) cuts latency and token cost.", targets: ["caching"] }
  );

  return f;
}

// --- Scoring ---------------------------------------------------------------

export interface Score {
  pct: number;
  grade: string;
  tone: "fail" | "warn" | "pass";
}

export function scoreOf(findings: Finding[]): Score {
  const applicable = findings.filter((x) => x.severity !== "info");
  const passed = applicable.filter((x) => x.severity === "pass").length;
  const pct = applicable.length ? Math.round((passed / applicable.length) * 100) : 0;
  const hasFail = findings.some((x) => x.severity === "fail");
  const hasWarn = findings.some((x) => x.severity === "warn");
  if (hasFail) return { pct, grade: "Not production-ready", tone: "fail" };
  if (hasWarn) return { pct, grade: "Almost there", tone: "warn" };
  return { pct, grade: "Production-ready! 🏆", tone: "pass" };
}

// --- Presets ---------------------------------------------------------------

export const PRESETS: Record<"naive" | "production", () => PipelineState> = {
  naive: () => ({
    useCase: "rag_qa",
    modelSize: "large",
    caps: {
      systemPrompt: false,
      retrieval: false,
      citations: false,
      inputGuardrail: false,
      outputGuardrail: false,
      tools: false,
      toolGuardrails: false,
      evals: false,
      monitoring: false,
      caching: false,
      piiHandling: false,
      humanInLoop: false,
    },
  }),
  production: () => ({
    useCase: "rag_qa",
    modelSize: "large",
    caps: {
      systemPrompt: true,
      retrieval: true,
      citations: true,
      inputGuardrail: true,
      outputGuardrail: true,
      tools: false,
      toolGuardrails: false,
      evals: true,
      monitoring: true,
      caching: true,
      piiHandling: true,
      humanInLoop: false,
    },
  }),
};
