import type { Metadata } from "next";
import Link from "next/link";
import PipelineBuilder from "@/components/ai/PipelineBuilder";

export const metadata: Metadata = {
  title: "Build Your Own AI Pipeline — Sandbox",
  description:
    "An interactive AI-engineering sandbox: assemble an LLM pipeline (RAG, guardrails, tools, evals, monitoring) and get live best-practice feedback when you miss grounding, guardrails, or evals.",
  alternates: { canonical: "/ai/builder" },
};

export default function AiBuilderPage() {
  return (
    <div id="top" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold">
        <ol className="flex flex-wrap items-center gap-1.5 text-ink/70">
          <li>
            <Link href="/" className="underline-offset-2 hover:underline">
              Study Companion
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/ai" className="underline-offset-2 hover:underline">
              AI Academy
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            Pipeline Builder
          </li>
        </ol>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="font-comic text-4xl tracking-wide text-ai-violet-dark sm:text-5xl">
          BUILD YOUR OWN AI PIPELINE
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Pick a use case, then assemble your LLM pipeline — retrieval, prompts, guardrails, tools,
          evals, monitoring. The best-practice checker flags every gap in real time: missing grounding,
          an agent with no tool permissions, shipping with no evals, and more.
        </p>
      </header>

      <PipelineBuilder />
    </div>
  );
}
