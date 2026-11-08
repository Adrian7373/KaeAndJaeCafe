import Link from "next/link";
import type { ReactNode } from "react";
import ThemeToggle from "@/components/landing/ThemeToggle";

export const LEGAL_UPDATED = "November 8, 2026";

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/refund-policy", label: "Refund, Cancellation and Delivery" },
  { href: "/cookies", label: "Cookies and Local Storage" },
] as const;

export type LegalSection = { id: string; title: string; body: ReactNode };

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6 marker:text-accent">{children}</ul>;
}

export default function LegalPage({
  title,
  intro,
  sections,
  current,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  current: string;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink transition-colors duration-500">
      <header className="border-b-2 border-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <img className="h-11 w-11 rounded-full bg-kae-cream p-0.5" src="/logo.svg" alt="" />
            <span className="font-pacifico text-lg leading-[1.05]">
              Kae and<br />Jae Cafe
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="font-body text-sm font-bold underline-offset-4 hover:underline">
              Back to home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:px-10 md:py-20 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <nav aria-label="Legal pages" className="mb-8">
            <p className="mb-3 font-label text-xs tracking-[0.2em] uppercase">Legal</p>
            <ul className="space-y-2 font-body text-sm">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={l.href === current ? "page" : undefined}
                    className={l.href === current ? "font-bold text-accent" : "underline-offset-4 hover:underline"}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="On this page" className="hidden lg:block">
            <p className="mb-3 font-label text-xs tracking-[0.2em] uppercase">On this page</p>
            <ol className="space-y-2 font-body text-sm text-ink-soft">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="underline-offset-4 hover:text-ink hover:underline">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article>
          <p className="mb-4 font-label text-xs tracking-[0.2em] uppercase">Last updated {LEGAL_UPDATED}</p>
          <h1 className="ed-display text-4xl leading-[1.05] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-ink-soft">{intro}</p>

          <div className="mt-12 space-y-12">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-8">
                <h2 className="ed-display mb-4 text-2xl md:text-3xl">
                  {i + 1}. {s.title}
                </h2>
                <div className="max-w-2xl space-y-4 font-body leading-relaxed">{s.body}</div>
              </section>
            ))}
          </div>
        </article>
      </div>

      <footer className="border-t-2 border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 font-label text-xs tracking-widest uppercase md:px-10">
          <p>© 2026 Kae and Jae Cafe</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
