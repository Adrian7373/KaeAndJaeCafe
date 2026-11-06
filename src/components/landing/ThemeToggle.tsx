"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("kj-theme");
    } catch {}
    const isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
    // Client-only value: must be read after hydration to avoid a server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(isDark);
    // The theme only applies on the landing page; clear it when navigating away.
    return () => document.documentElement.classList.remove("dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("kj-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      className={`relative flex h-10 w-[4.5rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-ink bg-paper p-0.5 transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-300 ease-out ${dark ? "translate-x-[2.1rem]" : "translate-x-0"}`}
      >
        {dark ? <Moon size={15} /> : <Sun size={15} />}
      </span>
      <Sun size={14} className={`absolute right-2.5 text-ink transition-opacity ${dark ? "opacity-70" : "opacity-0"}`} />
      <Moon size={14} className={`absolute left-2.5 text-ink transition-opacity ${dark ? "opacity-0" : "opacity-70"}`} />
    </button>
  );
}
