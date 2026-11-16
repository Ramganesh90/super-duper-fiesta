import type { Metadata } from "next";
import Link from "next/link";
import DesignStudio from "@/components/design/DesignStudio";

export const metadata: Metadata = {
  title: "System Design Studio — Build in 3D",
  description:
    "Design any system architecture on a 3D canvas: add components, wire them up, and get live best-practice feedback that highlights single points of failure, missing pieces, and bottlenecks.",
  alternates: { canonical: "/design" },
};

export default function DesignPage() {
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
          <li className="text-ink" aria-current="page">
            System Design Studio
          </li>
        </ol>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="font-comic text-4xl tracking-wide text-design-teal-dark sm:text-5xl">
          SYSTEM DESIGN STUDIO
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Build any architecture on a 3D canvas — drop in components, connect them, and get live
          feedback. Single points of failure, missing pieces, and bottlenecks light up in the scene,
          with one-click fixes. Push the load slider to watch where it breaks.
        </p>
      </header>

      <DesignStudio />
    </div>
  );
}
