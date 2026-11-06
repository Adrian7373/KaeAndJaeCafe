"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  ["Menu", "#menu"],
  ["About", "#about"],
  ["Gallery", "#gallery"],
  ["Reviews", "#testimonials"],
  ["Visit", "#contact"],
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-[1920px] transition-all duration-300 ${scrolled || open ? "border-b-2 border-rule bg-paper/90 text-ink backdrop-blur-md" : "text-ink"}`}
    >
      <nav className="flex items-center justify-between gap-4 px-4 py-2.5 md:px-10 2xl:px-30">
        <a href="#home" className="flex items-center gap-3">
          <img className="h-12 w-12 rounded-full bg-kae-cream p-0.5" src="/logo.svg" alt="Kae and Jae logo" />
          <span className="font-pacifico text-lg leading-[1.05]">
            Kae and<br />Jae Cafe
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([l, h]) => (
            <a
              key={h}
              href={h}
              className="group relative px-4 py-2 font-body text-sm font-bold"
            >
              {l}
              <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/order"
            className="hidden rounded-full bg-ink px-6 py-2.5 font-body text-sm font-bold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--accent)] active:translate-y-0 active:shadow-none sm:inline-block"
          >
            Order now
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t-2 border-rule px-4 pb-6 pt-3 lg:hidden">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="ed-display py-2 text-3xl">
              {l}
            </a>
          ))}
          <Link href="/order" className="mt-3 rounded-full bg-ink py-3 text-center font-body font-bold text-paper">
            Order now
          </Link>
        </div>
      )}
    </header>
  );
}
