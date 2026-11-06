"use client";

import Morph from "./Morph";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";

/** Open Monday to Saturday, 10:00 to 18:00, Philippine time. */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
  const day = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value) % 24;
  return day !== "Sun" && hour >= 10 && hour < 18;
}

const field =
  "w-full rounded-xl border-2 border-rule bg-card px-4 py-3 font-body text-ink outline-none transition placeholder:text-ink/45 focus:ring-4 focus:ring-kae-pink/60";

export default function Visit() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    // Client-only (depends on the visitor's current time).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(isOpenNow());
  }, []);

  return (
    <section id="contact" className="bg-paper-alt px-4 py-24 text-ink md:px-10 md:py-32 2xl:px-30">
      <div className="mx-auto grid max-w-[1920px] gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 font-label text-xs tracking-[0.2em] uppercase">
            Visit
            {open !== null && (
              <span className={`rounded-full px-3 py-1 tracking-widest ${open ? "bg-kae-scallion text-kae-cream" : "bg-kae-gochujang text-kae-cream"}`}>
                {open ? "Open now" : "Closed now"}
              </span>
            )}
          </p>
          <h2 className="ed-display text-5xl leading-[1.02] md:text-7xl"><Morph>
            Find the <span className="ed-italic text-accent">cart,</span> <span className="ed-caps">or</span> message{" "}
            <span className="ed-hangul text-kae-gochujang dark:text-kae-gold">안녕</span> first.
          </Morph></h2>
          <ul className="mt-10 space-y-5 text-lg">
            {[
              [MapPin, "Zone 3, Camp Tinio, Cabanatuan City, Philippines, 3100"],
              [Clock, "Monday to Saturday, 10:00 AM to 6:00 PM"],
              [Clock, "Sunday, closed"],
              [Mail, "kaeandjae@gmail.com"],
              [Phone, "0966 632 8432"],
            ].map(([Icon, t], i) => {
              const I = Icon as typeof MapPin;
              return (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                    <I size={17} />
                  </span>
                  <span className="pt-1">{t as string}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <form className="flex flex-col gap-4 rounded-3xl border-2 border-rule bg-paper p-6 shadow-[8px_8px_0_0_var(--accent)] md:p-8" action="">
            <h3 className="ed-display text-3xl">
              Send us a <span className="ed-italic text-accent">note</span>
            </h3>
            <label className="font-label text-xs tracking-widest uppercase" htmlFor="c-name">Your name</label>
            <input id="c-name" className={field} type="text" name="name" placeholder="Jae" />
            <label className="font-label text-xs tracking-widest uppercase" htmlFor="c-email">Your email</label>
            <input id="c-email" className={field} type="email" name="email" placeholder="you@example.com" />
            <label className="font-label text-xs tracking-widest uppercase" htmlFor="c-msg">Message</label>
            <textarea id="c-msg" className={`${field} h-36 resize-none`} name="message" placeholder="Hi! Do you cater for events?" />
            <button className="mt-2 self-start rounded-full bg-ink px-7 py-3 font-body text-sm font-bold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--accent)] active:translate-y-0 active:shadow-none">
              Send message
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
