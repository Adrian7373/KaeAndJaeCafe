"use client";

import { useRef, useState } from "react";
import { useRafScroll } from "./hooks";

/*
  Placeholder reviews: the reviewer photos are supplied by the owner, the review texts
  are invented for layout and should be replaced with real customer quotes.
  Wrap one word in *asterisks* to set it in the italic accent voice.
*/
const reviews = [
  {
    name: "Aaron Tanig",
    photo: "/reviews/aaron-tanig.jpg",
    pos: "50% 38%",
    order: "Chicken meals",
    ko: "바삭해요",
    text: "Crispy talaga yung chicken, tapos hindi nakakaumay yung *sauce*. Kahit lumamig, malutong pa rin.",
  },
  {
    name: "Adrian Gabriel Ablaza",
    photo: "/reviews/adrian-gabriel-ablaza.jpg",
    pos: "50% 30%",
    order: "Corndogs",
    ko: "핫도그",
    text: "I come by after class for the *corndogs*. The potato coating stays crunchy until the last bite.",
  },
  {
    name: "John Ken Salvador",
    photo: "/reviews/john-ken-salvador.jpg",
    pos: "50% 35%",
    order: "Tteokbokki",
    ko: "떡볶이",
    text: "Yung tteokbokki nila *sakto* ang anghang, hindi lang puro pula. Umorder ulit ako the same night.",
  },
  {
    name: "John Michael Tanig",
    photo: "/reviews/john-michael-tanig.jpg",
    pos: "50% 35%",
    order: "Delivery",
    ko: "배달",
    text: "Fast order tracking, and the rider found my house on the first try. Still *hot* when it arrived.",
  },
  {
    name: "Justine Tanig",
    photo: "/reviews/justine-tanig.jpg",
    pos: "50% 30%",
    order: "Milk tea",
    ko: "음료",
    text: "Milk tea with extra pearls, kaya kong ubusin ng *dalawa*. Sweet pero hindi sobra.",
  },
  {
    name: "Krischa Mae Concepcion",
    photo: "/reviews/krischa-mae-concepcion.jpg",
    pos: "50% 48%",
    order: "Chicken meals",
    ko: "맛있어요",
    text: "Our barkada orders the chicken meals every payday. Sulit, generous sa rice, and the *gochujang* is the real deal.",
  },
];

function Quote({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let i = 0;
  return (
    <>
      {parts.flatMap((part) => {
        const em = part.startsWith("*");
        const words = (em ? part.slice(1, -1) : part).split(" ").filter(Boolean);
        return words.map((w) => {
          const k = i++;
          return (
            <span
              key={k}
              style={{ animationDelay: `${k * 45}ms` }}
              className={`inline-block animate-[wordIn_0.6s_cubic-bezier(0.2,0.7,0.2,1)_both] pr-[0.26em] ${em ? "ed-italic text-accent" : ""}`}
            >
              {w}
            </span>
          );
        });
      })}
    </>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);

  const go = (n: number) => {
    const next = (n + reviews.length) % reviews.length;
    if (next === active) return;
    setPrev(active);
    setActive(next);
  };

  // Scroll motion: the photo stack tilts and the big quote mark drifts
  useRafScroll((_, vh) => {
    const el = stage.current;
    if (!el) return;
    // Measure the untransformed wrapper, otherwise the tilt feeds back into its own input
    const r = (el.parentElement ?? el).getBoundingClientRect();
    const d = Math.max(-1.5, Math.min(1.5, (r.top + r.height / 2 - vh / 2) / vh)); // about -1..1 around center
    el.style.transform = `rotate(${(d * -5).toFixed(2)}deg) translate3d(0, ${(d * 24).toFixed(1)}px, 0)`;
    if (mark.current) mark.current.style.transform = `translate3d(${(d * -60).toFixed(0)}px, ${(d * 80).toFixed(0)}px, 0)`;
  });

  const r = reviews[active];

  return (
    <div className="relative mt-14 grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <span
        ref={mark}
        aria-hidden
        className="ed-italic pointer-events-none absolute -top-16 right-0 select-none text-[22rem] leading-none text-accent/10 will-change-transform md:text-[34rem]"
      >
        &rdquo;
      </span>

      {/* Photo stack */}
      <div className="mx-auto w-full min-w-0 max-w-[22rem] lg:max-w-none">
        <div ref={stage} className="relative aspect-[4/5] will-change-transform">
          <div aria-hidden className="absolute inset-0 rotate-[7deg] rounded-[2rem] border-2 border-rule bg-kae-pink" />
          <div aria-hidden className="absolute inset-0 -rotate-[5deg] rounded-[2rem] border-2 border-rule bg-kae-gold" />
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] border-2 border-rule bg-card shadow-[8px_8px_0_0_var(--accent)]">
            {prev !== null && (
              <img key={`p${prev}`} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: reviews[prev].pos }} src={reviews[prev].photo} alt="" />
            )}
            <img
              key={`a${active}`}
              className="absolute inset-0 h-full w-full animate-[wipe_0.9s_cubic-bezier(0.65,0,0.2,1)_both] object-cover"
              style={{ objectPosition: r.pos }}
              src={r.photo}
              alt={`Photo of ${r.name}`}
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-kae-dark px-3 py-1 font-label text-[0.7rem] tracking-wider text-kae-cream uppercase">{r.order}</span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="relative min-w-0">
        <blockquote key={active} className="ed-display text-3xl leading-[1.15] sm:text-4xl xl:text-5xl" aria-live="polite">
          <Quote text={r.text} />
        </blockquote>
        <figcaption key={`c${active}`} className="mt-8 flex animate-[wordIn_0.6s_0.5s_cubic-bezier(0.2,0.7,0.2,1)_both] flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-label text-sm tracking-[0.18em] uppercase">{r.name}</span>
          <span className="ed-hangul text-xl text-kae-gochujang dark:text-kae-gold">{r.ko}</span>
        </figcaption>

        {/* Selector with progress rings */}
        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4" role="tablist" aria-label="Reviewers">
          {reviews.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={p.name}
                onClick={() => go(i)}
                className={`group relative h-14 w-14 shrink-0 cursor-pointer rounded-full transition-transform duration-300 hover:-translate-y-1 sm:h-16 sm:w-16 ${on ? "scale-110" : ""}`}
              >
                <img
                  className={`h-full w-full rounded-full object-cover transition-all duration-300 ${on ? "" : "opacity-60 saturate-50 group-hover:opacity-100 group-hover:saturate-100"}`}
                  style={{ objectPosition: p.pos }}
                  src={p.photo}
                  alt=""
                />
                <svg viewBox="0 0 64 64" className="pointer-events-none absolute -inset-1.5 h-[calc(100%+12px)] w-[calc(100%+12px)] -rotate-90">
                  <circle cx="32" cy="32" r="30" fill="none" stroke="var(--rule)" strokeOpacity={on ? 0.2 : 0} strokeWidth="2.5" />
                  {on && (
                    <circle
                      key={active}
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="188.5"
                      style={{ animation: "ringFill 7s linear forwards", animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() => go(active + 1)}
                    />
                  )}
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
