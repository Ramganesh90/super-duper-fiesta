# Pattern-Verse

**Where Design Patterns Come to Life** — an interactive learning platform that teaches software design
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

## Current scope

52 patterns are live, spanning six categories:

- **Creational** (11): all 5 GoF patterns (Singleton, Factory Method, Abstract Factory, Builder, Prototype)
  plus common idioms (Object Pool, Lazy Initialization, Multiton, Simple Factory, Parameterized Constructor,
  Static Factory Method)
- **Structural** (8): all 7 GoF patterns (Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy)
  plus Private Class Data
- **Behavioral** (12): all 11 GoF patterns (Chain of Responsibility, Command, Interpreter, Iterator,
  Mediator, Memento, Observer, State, Strategy, Template Method, Visitor) plus Filter/Criteria
- **Concurrency** (5): Active Object, Reactor, Proactor, Monitor Object, Thread Pool
- **Architectural** (7): MVC, MVP, MVVM, Layered Architecture, Microkernel, SOA, CQRS
- **Enterprise** (9): View Helper, Data Mapper, Dependency Injection, Inversion of Control, Service Locator,
  Repository, Unit of Work, DAO, Business Delegate

Every pattern page includes the full learning loop: comic story, problem/solution, before/after, code
example, hero conversation, use/avoid guidance, common mistakes, a real-world example, a Code Battle
scenario, and a scored quiz that awards XP and a "Pattern Mastered" badge.

Adding a pattern beyond these 52 is purely a content task — see [Content model](#content-model).
