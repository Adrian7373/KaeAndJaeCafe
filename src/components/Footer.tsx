"use client";

import Morph from "@/components/landing/Morph";

import Link from "next/link";

const word = "Kae".split("");
const word2 = "Jae".split("");

const link =
  "group relative inline-block w-fit transition-colors duration-200 hover:text-kae-pink";
const underline =
  "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100";

function Letters({ chars, offset = 0 }: { chars: string[]; offset?: number }) {
  return (
    <>
      {chars.map((c, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${(i + offset) * 25}ms` }}
          className="inline-block cursor-default transition-all duration-300 ease-out hover:-translate-y-[0.06em] hover:text-kae-pink hover:[font-variation-settings:'opsz'_144,'SOFT'_100]"
        >
          {c}
        </span>
      ))}
    </>
  );
}

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t-2 border-kae-pink bg-kae-dark text-kae-cream">
      {/* Closing line */}
      <div className="mx-auto max-w-[1920px] px-4 pt-20 md:px-10 md:pt-28 2xl:px-30">
        <p className="ed-display max-w-5xl pb-2 text-4xl leading-[1.12] sm:text-5xl md:text-7xl"><Morph>
          See you <span className="ed-italic text-kae-pink">soon</span> at Camp Tinio{" "}
          <span className="ed-caps text-kae-gold">Mon to Sat</span>{" "}
          <span className="ed-hangul text-kae-gold">또 봐요</span>
        </Morph></p>

        <div className="mt-20 grid gap-10 border-t border-kae-cream/25 pt-10 font-body text-base sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs tracking-[0.2em] text-kae-pink uppercase">Visit</p>
            <p className="max-w-[16rem] leading-relaxed">Zone 3, Camp Tinio, Cabanatuan City, Philippines, 3100</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs tracking-[0.2em] text-kae-pink uppercase">Hours</p>
            <p className="leading-relaxed">
              Monday to Saturday
              <br />
              10:00 AM to 6:00 PM
              <br />
              Sunday closed
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs tracking-[0.2em] text-kae-pink uppercase">Order</p>
            <Link href="/order" className={link}>
              Order online
              <span className={underline} />
            </Link>
            <a href="#menu" className={link}>
              See the menu
              <span className={underline} />
            </a>
            <a href="#contact" className={link}>
              Send a message
              <span className={underline} />
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs tracking-[0.2em] text-kae-pink uppercase">Follow</p>
            <a href="https://www.facebook.com/profile.php?id=61569261819780" className={link} target="_blank" rel="noreferrer">
              Facebook
              <span className={underline} />
            </a>
            <a href="https://www.facebook.com/messages/t/1051738004696972" className={link} target="_blank" rel="noreferrer">
              Messenger
              <span className={underline} />
            </a>
            <p className="mt-2 font-label text-sm">0966 632 8432</p>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="mx-auto mt-12 max-w-[1920px] px-4 pb-10 md:px-10 2xl:px-30" aria-label="Kae and Jae Cafe">
        <p aria-hidden style={{ fontSize: "clamp(6rem, 24vw, 28rem)", lineHeight: 0.82, letterSpacing: "-0.04em" }} className="ed-display flex items-baseline justify-between whitespace-nowrap select-none">
          <span>
            <Letters chars={word} />
          </span>
          <span className="ed-italic text-kae-pink">&amp;</span>
          <span>
            <Letters chars={word2} offset={4} />
          </span>
        </p>
      </div>

      <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-4 px-4 pb-8 pt-6 font-label text-xs tracking-widest uppercase md:px-10 2xl:px-30">
        <p>© 2026 Kae and Jae Cafe</p>
        <a href="#home" className={link}>
          Back to top ↑<span className={underline} />
        </a>
      </div>
    </footer>
  );
}
