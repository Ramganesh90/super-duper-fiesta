# Pattern-Verse

**Where Design Patterns Come to Life** — an interactive learning platform that teaches Gang of Four design
patterns through an original comic-book universe. Every pattern is a superhero with a personality, a
superpower, a weakness, and a story.

## Stack

- [Next.js](https://nextjs.org) (App Router, static generation via `generateStaticParams`)
- TypeScript
- Tailwind CSS v4
- [Framer Motion](https://www.framer.com/motion/) for panel/interaction animation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content model

Patterns are data, not code. Each pattern lives as JSON in `data/patterns/*.json` and is typed by
`lib/types.ts`. Adding a new pattern requires **no new React components or pages** — only:

1. A new `data/patterns/<id>.json` file matching the `Pattern` schema
2. Adding the pattern to the arrays imported in `lib/patterns.ts`

The comic engine (`components/comic`), pattern layout (`components/patterns`), and learning components
(`components/learning`) are fully generic and render whatever the JSON describes.

## Progress

Quiz results, Code Battle wins, bookmarks, and XP persist in `localStorage` (see `lib/progress.ts`) — no
backend or database required for the MVP.

## Current scope (Phase 1–4 MVP)

Three patterns are live: **Singleton** (The One), **Factory Method** (Forge Master), and **Observer**
(Signal-Man) — one from each GoF category. Each pattern page includes the full learning loop: comic story,
problem/solution, before/after, code example, hero conversation, use/avoid guidance, common mistakes,
real-world examples, a Code Battle scenario, and a scored quiz that awards XP and a "Pattern Mastered" badge.

Expanding to the full 23 GoF patterns (and beyond) is purely a content task — see [Content model](#content-model).
