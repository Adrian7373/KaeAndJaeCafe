"use client";

import Morph from "./Morph";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStickyProgress } from "./hooks";

/* Hero images: photorealistic cutouts generated with Higgsfield (public/hero). */
const stages = [
  { name: "Korean fried chicken", hangul: "치킨", src: "/hero/chicken.png", alt: "Korean fried chicken glazed in gochujang sauce" },
  { name: "Milk tea", hangul: "음료", src: "/hero/tea.png", alt: "Iced taro milk tea with tapioca pearls" },
  { name: "Tteokbokki", hangul: "떡볶이", src: "/hero/tteokbokki.png", alt: "Bowl of tteokbokki in spicy sauce" },
  { name: "Corndogs", hangul: "핫도그", src: "/hero/corndog.png", alt: "Potato corn dogs with ketchup and mustard" },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Hero() {
  const wrap = useRef<HTMLElement>(null);
  const headline = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);

  useStickyProgress(wrap, (p) => {
    progress.current = p;
    if (headline.current) {
      headline.current.style.transform = `translate3d(0, ${-p * 70}px, 0)`;
      headline.current.style.opacity = String(1 - Math.max(0, p - 0.8) * 4);
    }
    if (disc.current) disc.current.style.transform = `translate(-50%, -50%) scale(${0.85 + p * 0.45})`;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });

  // Photos orbit the disc; scroll picks which one comes to the front.
  useEffect(() => {
    const n = stages.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0;
    let last = -1;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const sf = progress.current * (n - 1);
      const fl = Math.floor(sf);
      const target = Math.min(n - 1, fl + smooth(0.2, 0.8, sf - fl));
      cur += (target - cur) * (reduce ? 1 : 0.09);
      frames.current.forEach((el, i) => {
        if (!el) return;
        const ang = ((i - cur) / n) * Math.PI * 2;
        const depth = (Math.cos(ang) + 1) / 2; // 1 = front, 0 = back
        const x = Math.sin(ang) * 46;
        const y = (1 - Math.cos(ang)) * -9;
        const s = 0.46 + depth * 0.62;
        el.style.transform = `translate(calc(-50% + ${x}%), calc(-50% + ${y}%)) scale(${s}) rotate(${Math.sin(ang) * 8}deg)`;
        el.style.zIndex = String(Math.round(depth * 10));
        el.style.opacity = String(0.55 + depth * 0.45);
        el.style.filter = depth > 0.92 ? "none" : `saturate(${0.75 + depth * 0.25})`;
      });
      const s = Math.round(cur);
      if (s !== last) {
        last = s;
        setStage(s);
      }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="home" ref={wrap} className="relative h-[360vh] bg-hero text-ink">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* The disc grows as you scroll */}
        <div
          ref={disc}
          className="absolute top-[74%] left-1/2 aspect-square w-[120vw] rounded-full bg-hero-disc will-change-transform md:top-1/2 md:left-[66%] md:w-[min(62vw,88vh)]"
          style={{ transform: "translate(-50%, -50%) scale(0.85)" }}
        />

        {/* Photo orbit, same center as the disc */}
        <div className="absolute top-[74%] left-1/2 aspect-square w-[120vw] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-[66%] md:w-[min(62vw,88vh)]">
          {stages.map((s, i) => (
            <div
              key={s.src}
              ref={(el) => {
                frames.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2 aspect-square w-[74%] will-change-transform"
            >
              <img className="h-full w-full object-contain drop-shadow-[0_28px_28px_rgb(0_0_0/0.45)]" src={s.src} alt={s.alt} draggable={false} />
            </div>
          ))}
        </div>

        <div className="pointer-events-none relative z-30 mx-auto flex h-full w-full max-w-[1920px] flex-col justify-start px-4 pt-24 pb-24 md:justify-center md:px-10 md:pt-20 md:pb-10 2xl:px-30">
          <div ref={headline} className="pointer-events-auto max-w-[40rem] will-change-transform md:max-w-[44%] lg:max-w-[40rem]">
            <p className="mb-4 font-label text-xs tracking-[0.2em] uppercase">Camp Tinio, Cabanatuan City · Mon to Sat 10 AM to 6 PM</p>
            <h1 className="ed-display text-[2.7rem] leading-[1.02] sm:text-6xl md:text-[4.1rem] xl:text-[5.4rem] 2xl:text-[6.4rem]"><Morph>
              Crunch <span className="ed-italic text-accent dark:text-kae-pink">first,</span>{" "}
              <span className="ed-caps">questions</span> later{" "}
              <span className="ed-hangul text-kae-gochujang dark:text-kae-gold">바삭!</span>
            </Morph></h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
              Fried chicken meals, Korean street snacks and sweet drinks, made to order from our mobile kitchen.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/order"
                className="rounded-full bg-ink px-7 py-3.5 font-body text-sm font-bold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--accent)] active:translate-y-0 active:shadow-none"
              >
                Order now
              </Link>
              <a
                href="#menu"
                className="rounded-full border-2 border-ink px-7 py-3 font-body text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-paper active:translate-y-0"
              >
                See the menu
              </a>
            </div>
          </div>

          {/* Stage caption */}
          <div className="pointer-events-none absolute right-4 bottom-8 left-4 flex items-end justify-between gap-4 md:right-10 md:left-10 2xl:right-30 2xl:left-30">
            <div className="hidden font-label text-xs tracking-widest uppercase md:block">Scroll to spin the table</div>
            <div className="ml-auto rounded-3xl bg-kae-dark px-5 py-4 text-right" aria-live="polite">
              <p key={stage} className="ed-display animate-[capIn_0.5s_ease-out] text-2xl leading-none text-kae-cream md:text-4xl">
                {stages[stage].name} <span className="ed-hangul text-kae-gold">{stages[stage].hangul}</span>
              </p>
              <div className="mt-3 ml-auto flex w-40 gap-1.5 md:w-60">
                {stages.map((s, i) => (
                  <span key={s.name} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= stage ? "bg-kae-cream" : "bg-kae-cream/30"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <span ref={bar} className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-kae-gold" />
      </div>
    </section>
  );
}
