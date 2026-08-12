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

const SITE_URL = "https://study-companion.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Study Companion — Learn by Playing",
    template: "%s | Study Companion",
  },
  description:
    "A mini dashboard of gamified learning apps: master software design patterns through a comic universe, and study for the AWS Solutions Architect (SAA-C03) exam by playing.",
  openGraph: {
    title: "Study Companion — Learn by Playing",
    description:
      "A mini dashboard of gamified learning apps — design patterns as superheroes, and AWS Solutions Architect study by playing.",
    url: SITE_URL,
    siteName: "Study Companion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Companion — Learn by Playing",
    description:
      "A mini dashboard of gamified learning apps — design patterns and AWS Solutions Architect, learned by playing.",
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
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link href="/" className="font-comic text-2xl tracking-wide text-ink sm:text-3xl">
              STUDY<span className="text-action-red"> COMPANION</span>
            </Link>
            <nav aria-label="Apps" className="flex items-center gap-2">
              <Link
                href="/patterns"
                className="comic-border-sm font-comic bg-comic-yellow px-3 py-1.5 text-sm text-ink transition-transform hover:-translate-y-0.5 sm:text-base"
              >
                Patterns
              </Link>
              <Link
                href="/aws"
                className="comic-border-sm font-comic bg-aws-orange px-3 py-1.5 text-sm text-ink transition-transform hover:-translate-y-0.5 sm:text-base"
              >
                AWS SA
              </Link>
            </nav>
          </div>
        </header>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="border-t-4 border-ink bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm sm:px-6">
            <p className="font-comic text-lg text-comic-yellow">STUDY COMPANION</p>
            <p className="mt-2 opacity-80">
              A mini arcade of gamified learning apps — design patterns and AWS Solutions Architect,
              learned by playing.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
