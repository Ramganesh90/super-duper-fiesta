# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**Study Companion** (package name `super-duper-fiesta`) is a Next.js App Router site hosting three
independent, gamified learning apps under one shell:

- `/patterns` — **Pattern-Verse**: 52 software design patterns taught as comic-book superheroes.
- `/aws` — an 8-week gamified study plan for the AWS Solutions Architect Associate (SAA-C03) exam.
- `/ai` — **AI Academy**: a 19-topic roadmap from math foundations through LLMs, RAG, and agents.

Each app is a fully parallel, self-contained vertical slice (own data files, own `lib/` module, own
route, own components, own `localStorage` progress key) — see Architecture below. There is no backend;
all persistence is client-side `localStorage`.

## Commands

```bash
npm install       # install deps
npm run dev        # start dev server (http://localhost:3000)
npm run build       # production build (also runs static generation for all dynamic routes)
npm run start       # serve the production build
npm run lint        # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test suite configured in this repo (no test script, no test runner dependency). Type
checking happens via `tsc` through `next build`; there is no standalone `typecheck` script.

## Architecture

### The three-app pattern

`/patterns`, `/aws`, and `/ai` each follow the identical structure. Understanding one means
understanding all three:

1. **Content as data** — each item (pattern / week segment / topic) is a JSON file:
   `data/patterns/<id>.json`, `data/aws/segments/week-N.json`, `data/ai/topics/NN-slug.json`.
2. **A loader module** in `lib/` (`lib/patterns.ts`, `lib/aws/segments.ts`, `lib/ai/topics.ts`) statically
   imports every JSON file, concatenates them into an array (order matters — AWS weeks and AI topics are
   meant to be worked through sequentially), and exposes `getAll*()` / `get*ById()` / filter helpers.
   Types for each domain live alongside (`lib/types.ts`, `lib/aws/types.ts`, `lib/ai/types.ts`).
3. **Fully static dynamic routes** — `app/patterns/[id]/page.tsx`, `app/aws/[segmentId]/page.tsx`,
   `app/ai/[topicId]/page.tsx` each set `export const dynamicParams = false` and implement
   `generateStaticParams()` from the loader's `getAll*Ids()`, so every item page is pre-rendered at build
   time. Each also has a sibling `loading.tsx` and `not-found.tsx`.
4. **Generic, data-driven components** — `components/patterns/`, `components/aws/`, `components/ai/`
   (plus the shared `components/comic/` engine, `components/learning/` game widgets, and
   `components/code/CodeBlock`) render whatever the JSON describes. Adding a new pattern/week/topic
   requires **no new components or pages** — only a new JSON file plus registering it in the loader's
   array.
5. **Client-side progress** — `lib/progress.ts` (patterns), `lib/aws/progress.ts`, `lib/ai/progress.ts`
   each read/write their own `localStorage` key (`pattern-verse:progress`, `aws-sa:progress`,
   `ai-eng:progress`) and dispatch a `window` event (e.g. `pattern-verse:progress-updated`) on save so
   components can subscribe (`subscribeToProgress`) and re-render without a page refresh. Each tracks
   XP, completed items, quiz results, and app-specific extras (code-battle wins/bookmarks for patterns,
   streaks/domain badges for AWS, streaks/track badges for AI). A corresponding `use*Progress.ts` hook
   per app (e.g. `components/aws/useAwsProgress.ts`) wraps this for components.

When adding content to an existing app, follow the pattern for that app exactly: add the JSON file
matching its type in `lib/*/types.ts`, then register it in the loader array — do not create new
route/component code for it.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config` — theme is defined with `@theme` in
`app/globals.css`). The site uses a hand-drawn "comic book" visual language: custom theme tokens like
`--color-ink`, `--color-paper`, `--color-hero-blue`, `--color-aws-orange`, `--color-ai-violet`, and
utility classes such as `.comic-border`, `.comic-border-sm`, `.font-comic` (Bangers font) and
`.bg-halftone*` for the panel/badge look. Each app has its own accent color (blue = patterns, orange =
AWS, violet = AI) used consistently across its badges, buttons, and headers — match it when adding UI
for a given app.

### Routing/SEO plumbing

`app/sitemap.ts` and `app/robots.ts` generate the sitemap/robots output by pulling all ids from the
three loaders — a new pattern/segment/topic JSON file automatically gets a sitemap entry once it's
registered in its loader array. (Note: `sitemap.ts` and `robots.ts` currently point at different
placeholder `SITE_URL` values — check both if changing the production domain.)

### Path aliases

`@/*` resolves to the repo root (`tsconfig.json`), e.g. `@/lib/patterns`, `@/components/comic/HeroCard`,
`@/data/patterns/singleton.json`.
