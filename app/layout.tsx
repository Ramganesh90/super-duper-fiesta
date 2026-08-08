import type { Metadata } from "next";
import { Bangers, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://pattern-verse.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pattern-Verse — Where Design Patterns Come to Life",
    template: "%s | Pattern-Verse",
  },
  description:
    "Learn the 23 Gang of Four design patterns, plus concurrency, architectural, and enterprise patterns, through an original comic-book universe. Meet the Pattern Heroes, battle bad code, and master software architecture.",
  openGraph: {
    title: "Pattern-Verse — Where Design Patterns Come to Life",
    description:
      "Learn software design patterns through an original comic-book universe of Pattern Heroes.",
    url: SITE_URL,
    siteName: "Pattern-Verse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pattern-Verse — Where Design Patterns Come to Life",
    description:
      "Learn software design patterns through an original comic-book universe of Pattern Heroes.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bangers.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <header className="border-b-4 border-ink bg-paper sticky top-0 z-40">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="font-comic text-2xl tracking-wide text-hero-blue sm:text-3xl">
              PATTERN<span className="text-action-red">-VERSE</span>
            </Link>
            <Link
              href="/#roster"
              className="comic-border-sm font-comic bg-comic-yellow px-3 py-1.5 text-sm text-ink transition-transform hover:-translate-y-0.5 sm:text-base"
            >
              Pattern Roster
            </Link>
          </div>
        </header>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="border-t-4 border-ink bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm sm:px-6">
            <p className="font-comic text-lg text-comic-yellow">PATTERN-VERSE</p>
            <p className="mt-2 opacity-80">
              An original comic universe for learning the Gang of Four design patterns.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
