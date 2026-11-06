import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Design System · Kae & Jae Cafe",
  description: "Colors, type, components and editorial patterns for Kae & Jae Cafe.",
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Swatch = { name: string; token: string; hex: string; role: string; dark?: boolean };

const brand: Swatch[] = [
  { name: "Kae Purple", token: "kae-purple", hex: "#5c0a8a", role: "Primary. Headlines, buttons, brand surfaces.", dark: true },
  { name: "Kae Pink", token: "kae-pink", hex: "#ee9bc1", role: "Signature accent. Italic words, highlights, hovers." },
];
const neutrals: Swatch[] = [
  { name: "Kae Dark", token: "kae-dark", hex: "#2d0545", role: "Ink. Body text, dark sections.", dark: true },
  { name: "Kae Cream", token: "kae-cream", hex: "#fff4e0", role: "Paper. Default editorial page background." },
  { name: "Kae Light", token: "kae-light", hex: "#fcf4f8", role: "Faint blush surface for cards and forms." },
];
const flavor: Swatch[] = [
  { name: "Gochujang", token: "kae-gochujang", hex: "#d9382a", role: "Spicy, sale, urgency, destructive.", dark: true },
  { name: "Crispy Gold", token: "kae-gold", hex: "#f5b021", role: "Fried-chicken highlight, ratings, best sellers." },
  { name: "Scallion", token: "kae-scallion", hex: "#3f7d3a", role: "Success, available, order confirmed.", dark: true },
];
const tints: Swatch[] = [
  { name: "Pink Soft", token: "kae-pink-soft", hex: "#f9d6e6", role: "Tinted surface, tags, selected rows." },
  { name: "Purple Soft", token: "kae-purple-soft", hex: "#ecdcf5", role: "Tinted surface, info, hover on light." },
];

const menuItems = [
  { name: "Honey Butter Chicken", tag: "Meal", price: "₱249", note: "Four pieces, rice, slaw", hot: false },
  { name: "Tteokbokki", tag: "Snack", price: "₱129", note: "Chewy rice cakes, gochujang", hot: true },
  { name: "Cheesy Corn Dog", tag: "Snack", price: "₱89", note: "Mozzarella, potato crunch", hot: false },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Section({ id, n, title, intro, children }: { id: string; n: string; title: ReactNode; intro?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t-2 border-kae-dark px-5 py-16 md:px-12 md:py-24 2xl:px-30">
      <div className="mb-12 grid gap-6 md:grid-cols-[10rem_1fr]">
        <p className="font-label text-sm tracking-widest text-kae-purple">№ {n}</p>
        <div className="max-w-3xl">
          <h2 className="ed-display text-4xl leading-[1.05] text-kae-dark md:text-6xl">{title}</h2>
          {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-kae-dark/75">{intro}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-label text-xs uppercase tracking-[0.18em] text-kae-dark/60">{children}</p>;
}

function SwatchCard({ s }: { s: Swatch }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-kae-dark bg-white">
      <div
        className={`flex h-36 items-end p-4 ${s.dark ? "text-kae-cream" : "text-kae-dark"}`}
        style={{ background: s.hex }}
      >
        <span className="ed-display text-3xl">{s.name}</span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between font-label text-xs">
          <span>{s.hex.toUpperCase()}</span>
          <span className="text-kae-dark/60">bg-{s.token}</span>
        </div>
        <p className="text-sm leading-snug text-kae-dark/75">{s.role}</p>
      </div>
    </div>
  );
}

function SwatchGroup({ label, items, cols }: { label: string; items: Swatch[]; cols: string }) {
  return (
    <div className="mb-12">
      <div className="mb-4"><Label>{label}</Label></div>
      <div className={`grid gap-5 ${cols}`}>
        {items.map((s) => <SwatchCard key={s.token} s={s} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DesignSystemPage() {
  return (
    <div className="bg-kae-cream font-body text-kae-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-kae-dark bg-kae-cream/90 px-5 py-3 backdrop-blur md:px-12 2xl:px-30">
        <div className="flex items-center gap-3">
          <img className="h-11 w-11" src="/logo.svg" alt="Kae and Jae logo" />
          <span className="font-pacifico text-lg leading-none">Kae and Jae</span>
        </div>
        <nav className="hidden gap-6 font-label text-xs uppercase tracking-widest md:flex">
          {[["colors", "Color"], ["type", "Type"], ["editorial", "Mixing"], ["components", "Components"], ["layout", "Layout"], ["voice", "Voice"]].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="transition hover:text-kae-purple">{l}</a>
          ))}
        </nav>
        <span className="font-label text-xs">v1.0</span>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-kae-purple px-5 py-20 text-kae-cream md:px-12 md:py-32 2xl:px-30">
        <p className="font-label mb-8 text-xs uppercase tracking-[0.25em] text-kae-pink">Design System · Vol. 01 · 2026</p>
        <h1 className="ed-display max-w-5xl text-[2.9rem] leading-[1.02] md:text-8xl">
          Fried, <span className="ed-italic text-kae-pink">sauced</span> <span className="ed-caps">&amp;</span> served{" "}
          <span className="ed-hangul text-kae-gold">바삭하게</span>.
        </h1>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-kae-cream/80">
          The visual language of Kae &amp; Jae Cafe: a Korean-snack and fried-chicken kitchen
          written like a magazine. Big serif voices, tiny mono labels, a splash of hangul,
          and a lot of pink.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {["#5c0a8a", "#ee9bc1", "#2d0545", "#fff4e0", "#d9382a", "#f5b021", "#3f7d3a"].map((c) => (
            <span key={c} className="h-9 w-9 rounded-full border-2 border-kae-cream/70" style={{ background: c }} />
          ))}
        </div>
        <span aria-hidden className="ed-italic pointer-events-none absolute -right-6 -bottom-24 select-none text-[16rem] leading-none text-kae-pink/15 md:text-[28rem]">K&amp;J</span>
      </section>

      {/* 01 Principles */}
      <Section id="principles" n="01" title={<>Four ideas, <span className="ed-italic text-kae-purple">one</span> kitchen.</>}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Mix, don't match", "A single sentence may use three families. Each one has a job; none fights for it."],
            ["Appetite first", "Warm paper, hot reds, fried gold. Purple and pink hold the brand; food colors do the talking."],
            ["Quiet grid, loud type", "Hairline rules and generous space let oversized headlines carry the page."],
            ["Seoul meets street", "Hangul is a flavor, not a translation. Use it as seasoning, one phrase at a time."],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-2xl border-2 border-kae-dark bg-white p-6">
              <p className="font-label text-sm text-kae-purple">0{i + 1}</p>
              <h3 className="ed-display mt-6 text-2xl leading-tight">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-kae-dark/75">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 02 Logo */}
      <Section id="logo" n="02" title={<>The <span className="font-pacifico text-kae-purple">logo</span> keeps its handwriting.</>} intro="Pacifico is reserved for the wordmark and nowhere else. It is the one script voice in the system, so it always stays recognisable.">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { bg: "bg-white", fg: "text-kae-dark", disc: "" },
            { bg: "bg-kae-purple", fg: "text-kae-cream", disc: "rounded-full bg-kae-cream p-1.5" },
            { bg: "bg-kae-pink", fg: "text-kae-dark", disc: "" },
          ].map((v, i) => (
            <div key={i} className={`flex items-center gap-4 rounded-2xl border-2 border-kae-dark p-8 ${v.bg} ${v.fg}`}>
              <img className={`h-20 w-20 ${v.disc}`} src="/logo.svg" alt="" />
              <div className="font-pacifico text-3xl leading-tight">
                <div>Kae and</div>
                <div>Jae Cafe</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 font-label text-xs text-kae-dark/60">Clear space = height of the “K”. Min width 120px. On kae-purple or kae-dark the badge always sits on a kae-cream disc. Never recolor outside kae-purple, kae-dark, kae-cream, kae-pink.</p>
      </Section>

      {/* 03 Color */}
      <Section id="colors" n="03" title={<>Color, <span className="ed-italic text-kae-purple">served</span> warm.</>} intro="Kae Purple and Kae Pink are the brand. Everything else is seasoning: cream for paper, and three food-inspired accents used sparingly.">
        <SwatchGroup label="Brand" items={brand} cols="md:grid-cols-2" />
        <SwatchGroup label="Neutrals" items={neutrals} cols="md:grid-cols-3" />
        <SwatchGroup label="Flavor accents" items={flavor} cols="md:grid-cols-3" />
        <SwatchGroup label="Tints" items={tints} cols="md:grid-cols-2" />

        <div className="mt-4">
          <Label>Approved pairings</Label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["bg-kae-purple text-kae-cream", "Cream on Purple"],
              ["bg-kae-cream text-kae-purple", "Purple on Cream"],
              ["bg-kae-dark text-kae-pink", "Pink on Dark"],
              ["bg-kae-pink text-kae-dark", "Dark on Pink"],
              ["bg-kae-gochujang text-kae-cream", "Cream on Gochujang"],
              ["bg-kae-gold text-kae-dark", "Dark on Gold"],
              ["bg-kae-scallion text-kae-cream", "Cream on Scallion"],
              ["bg-kae-purple-soft text-kae-dark", "Dark on Purple Soft"],
            ].map(([c, l]) => (
              <div key={l} className={`ed-display rounded-xl border-2 border-kae-dark p-5 text-xl ${c}`}>Aa <span className="ed-italic">Aa</span><div className="mt-2 font-label text-[0.65rem] tracking-wider uppercase opacity-80">{l}</div></div>
            ))}
          </div>
          <p className="mt-5 max-w-2xl text-sm text-kae-dark/70">Avoid Pink on Cream or Gold on Cream for text; they fail contrast. Use them for fills and large decorative italics only.</p>
        </div>
      </Section>

      {/* 04 Typography */}
      <Section id="type" n="04" title={<>Four voices, <span className="ed-italic text-kae-purple">plus</span> a signature.</>} intro="Every family has one job. Roles keep the mix readable instead of chaotic.">
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            { role: "Display / Voice", name: "Fraunces", cls: "ed-display", sample: "Crispy by nature", sub: "Headlines, pull quotes, item names. Roman for authority, Italic for emotion.", token: "font-display" },
            { role: "Body / Interface", name: "Archivo", cls: "font-body font-bold", sample: "Order now, eat soon", sub: "Paragraphs, buttons, navigation. Use uppercase + tracking for tiny eyebrows.", token: "font-body" },
            { role: "Label / Numbers", name: "DM Mono", cls: "font-label", sample: "₱249 · 4 PCS · 12 MIN", sub: "Prices, weights, timers, order numbers, captions.", token: "font-label" },
            { role: "Seasoning", name: "Black Han Sans", cls: "font-hangul", sample: "떡볶이 · 치킨 · 김밥", sub: "Korean dish names and short phrases. One phrase per layout, max.", token: "font-hangul" },
          ].map((f) => (
            <div key={f.name} className="rounded-2xl border-2 border-kae-dark bg-white p-7">
              <div className="flex items-center justify-between font-label text-xs text-kae-dark/60"><span>{f.role}</span><span>{f.token}</span></div>
              <p className={`${f.cls} mt-6 text-4xl leading-tight md:text-5xl`}>{f.sample}</p>
              <p className="mt-5 text-sm text-kae-dark/75"><strong>{f.name}.</strong> {f.sub}</p>
            </div>
          ))}
          <div className="rounded-2xl border-2 border-kae-dark bg-kae-pink p-7 lg:col-span-2">
            <div className="flex items-center justify-between font-label text-xs text-kae-dark/70"><span>Signature · logo only</span><span>font-pacifico</span></div>
            <p className="font-pacifico mt-4 text-5xl md:text-6xl">Kae and Jae Cafe</p>
          </div>
        </div>

        <div className="mt-14">
          <Label>Scale</Label>
          <div className="mt-4 divide-y-2 divide-kae-dark/15 border-y-2 border-kae-dark">
            {[
              ["Display XL", "text-6xl md:text-8xl", "ed-display leading-none", "Hot & Crispy", "96 / 96"],
              ["Display L", "text-4xl md:text-6xl", "ed-display leading-[1.05]", "Wings of the week", "60 / 63"],
              ["Heading", "text-3xl", "ed-display leading-tight", "Korean street snacks", "30 / 36"],
              ["Subheading", "text-xl", "ed-italic leading-snug", "Made when you order, not before.", "20 / 28"],
              ["Body", "text-base", "font-body leading-relaxed", "Chicken is brined overnight, double-fried, and tossed in sauce to order.", "16 / 26"],
              ["Eyebrow", "text-xs", "font-body font-extrabold uppercase tracking-[0.18em]", "New on the menu", "12 / 16"],
              ["Label", "text-xs", "font-label", "ORDER #0421 · READY IN 12 MIN", "12 / 16"],
            ].map(([n, sz, cls, sample, spec]) => (
              <div key={n} className="grid items-baseline gap-2 py-5 md:grid-cols-[10rem_1fr_6rem]">
                <span className="font-label text-xs text-kae-dark/60">{n}</span>
                <span className={`${sz} ${cls}`}>{sample}</span>
                <span className="font-label text-xs text-kae-dark/60 md:text-right">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 05 Editorial mixing */}
      <Section id="editorial" n="05" title={<>One sentence, <span className="ed-italic text-kae-purple">five</span> <span className="ed-caps">fonts</span>.</>} intro="The signature move. Inside a single line we swap family, style and case, then correct size and baseline so they read as one voice.">
        <div className="space-y-5">
          <div className="rounded-2xl border-2 border-kae-dark bg-kae-purple p-8 text-kae-cream md:p-14">
            <p className="ed-display text-4xl leading-[1.12] md:text-7xl">
              Our <span className="ed-italic text-kae-pink">famous</span> fried chicken <span className="ed-caps">with</span> <span className="ed-hangul text-kae-gold">양념</span> sauce, <span className="ed-mono text-kae-pink">₱249</span> only.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-kae-dark bg-kae-cream p-8 md:p-14">
            <p className="ed-display text-4xl leading-[1.12] text-kae-dark md:text-7xl">
              <span className="ed-caps text-kae-purple">Tonight</span> we&rsquo;re <span className="ed-italic text-kae-purple">skipping</span> dinner for <span className="ed-hangul text-kae-gochujang">떡볶이</span> <span className="ed-caps">&amp;</span> corn dogs.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-kae-dark bg-kae-pink p-8 md:p-14">
            <p className="ed-display text-4xl leading-[1.12] text-kae-dark md:text-7xl">
              Six pieces. <span className="ed-italic">Zero</span> regrets. <span className="ed-mono">#KAEJAE</span> <span className="ed-caps">open till 11pm</span>
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["ed-display", "Fraunces 600", "The sentence's spine. Sets the baseline and size."],
            ["ed-italic", "Fraunces Italic + SOFT 100", "The emphasis word. Add kae-pink or kae-purple."],
            ["ed-caps", "Archivo 800 caps", "0.5em, tracked 0.14em, raised 0.28em to center on x-height."],
            ["ed-hangul", "Black Han Sans", "0.86em so stroke weight matches Fraunces 600."],
            ["ed-mono", "DM Mono", "0.55em, raised. For prices and hashtags."],
          ].map(([cls, n, d]) => (
            <div key={cls} className="rounded-xl border-2 border-kae-dark bg-white p-5">
              <p className="font-label text-xs text-kae-purple">.{cls}</p>
              <p className="ed-display mt-3 text-lg">{n}</p>
              <p className="mt-2 text-sm leading-snug text-kae-dark/70">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border-2 border-kae-scallion bg-white p-6">
            <p className="font-label text-xs text-kae-scallion">DO</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li>One italic emphasis word per line, maybe two.</li>
              <li>Switch family at word boundaries, never mid-word.</li>
              <li>Let the serif carry at least 60% of the sentence.</li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-kae-gochujang bg-white p-6">
            <p className="font-label text-xs text-kae-gochujang">DON&rsquo;T</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li>Use Pacifico inside sentences; it is logo-only.</li>
              <li>Stack more than five styles in one sentence.</li>
              <li>Mix colors on every swapped word; color OR font, not both, most of the time.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 06 Components */}
      <Section id="components" n="06" title={<>Components, <span className="ed-italic text-kae-purple">plated</span>.</>}>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Buttons */}
          <div>
            <Label>Buttons</Label>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-kae-purple px-7 py-3 font-body text-sm font-bold text-kae-cream transition hover:bg-kae-dark">Order now</button>
              <button className="rounded-full bg-kae-pink px-7 py-3 font-body text-sm font-bold text-kae-dark transition hover:bg-kae-gold">Add to cart</button>
              <button className="rounded-full border-2 border-kae-dark px-7 py-3 font-body text-sm font-bold transition hover:bg-kae-dark hover:text-kae-cream">View menu</button>
              <button className="rounded-full bg-kae-gochujang px-7 py-3 font-body text-sm font-bold text-kae-cream">Remove</button>
              <button className="rounded-full bg-kae-dark/15 px-7 py-3 font-body text-sm font-bold text-kae-dark/40" disabled>Sold out</button>
            </div>
            <button className="mt-4 inline-flex items-center gap-2 font-body font-bold underline decoration-kae-pink decoration-4 underline-offset-4 transition hover:text-kae-purple">Read the story →</button>
          </div>

          {/* Badges */}
          <div>
            <Label>Tags &amp; status</Label>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-kae-gochujang px-3 py-1 font-label text-xs text-kae-cream">🌶 SPICY</span>
              <span className="rounded-full bg-kae-gold px-3 py-1 font-label text-xs">BEST SELLER</span>
              <span className="rounded-full bg-kae-pink-soft px-3 py-1 font-label text-xs">SNACK</span>
              <span className="rounded-full bg-kae-purple-soft px-3 py-1 font-label text-xs">MEAL</span>
              <span className="rounded-full bg-kae-scallion px-3 py-1 font-label text-xs text-kae-cream">PREPARING</span>
              <span className="rounded-full border-2 border-kae-dark px-3 py-1 font-label text-xs">NEW</span>
            </div>
            <div className="mt-8"><Label>Input</Label></div>
            <div className="mt-4 max-w-sm">
              <label className="font-label text-xs uppercase tracking-widest" htmlFor="ds-name">Name for the order</label>
              <input id="ds-name" placeholder="e.g. Jae" className="mt-2 w-full rounded-xl border-2 border-kae-dark bg-white px-4 py-3 font-body outline-none transition placeholder:text-kae-dark/40 focus:border-kae-purple focus:ring-4 focus:ring-kae-pink/60" />
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Label>Menu cards</Label>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {menuItems.map((m, i) => (
              <article key={m.name} className="group overflow-hidden rounded-2xl border-2 border-kae-dark bg-white">
                <div className={`relative flex h-44 items-center justify-center ${["bg-kae-gold", "bg-kae-gochujang", "bg-kae-pink"][i]}`}>
                  <span className="ed-italic text-8xl text-kae-cream/90 transition group-hover:scale-110">{["01", "02", "03"][i]}</span>
                  <span className="absolute top-3 left-3 rounded-full bg-kae-dark px-3 py-1 font-label text-[0.65rem] text-kae-cream">{m.tag.toUpperCase()}</span>
                  {m.hot && <span className="absolute top-3 right-3 rounded-full bg-kae-cream px-3 py-1 font-label text-[0.65rem] text-kae-gochujang">🌶 SPICY</span>}
                </div>
                <div className="p-5">
                  <h3 className="ed-display text-2xl leading-tight">{m.name}</h3>
                  <p className="mt-1 text-sm text-kae-dark/70">{m.note}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-label text-lg">{m.price}</span>
                    <button className="rounded-full bg-kae-purple px-5 py-2 font-body text-sm font-bold text-kae-cream transition hover:bg-kae-pink hover:text-kae-dark">Add +</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {/* Pull quote */}
          <figure className="rounded-2xl border-2 border-kae-dark bg-kae-purple-soft p-8">
            <Label>Pull quote</Label>
            <blockquote className="ed-display mt-5 text-3xl leading-tight md:text-4xl">
              &ldquo;Best <span className="ed-italic text-kae-purple">tteokbokki</span> this side of <span className="ed-caps">Seoul</span>.&rdquo;
            </blockquote>
            <figcaption className="mt-5 font-label text-xs">— A VERY HUNGRY REGULAR</figcaption>
          </figure>
          {/* Order receipt */}
          <div className="rounded-2xl border-2 border-dashed border-kae-dark bg-white p-8">
            <Label>Order summary</Label>
            <div className="mt-5 space-y-3 font-label text-sm">
              {[["1× Honey Butter Chicken", "₱249"], ["2× Cheesy Corn Dog", "₱178"], ["1× Tteokbokki", "₱129"]].map(([a, b]) => (
                <div key={a} className="flex justify-between border-b border-dashed border-kae-dark/30 pb-3"><span>{a}</span><span>{b}</span></div>
              ))}
              <div className="flex items-baseline justify-between pt-2">
                <span className="ed-display text-2xl font-normal">Total</span>
                <span className="ed-display text-3xl text-kae-purple">₱556</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Label>Order tracker</Label>
          <ol className="mt-4 flex flex-wrap items-center gap-2 font-label text-xs">
            {[["Received", "bg-kae-scallion text-kae-cream"], ["Cooking", "bg-kae-gold"], ["Out for delivery", "bg-kae-purple-soft"], ["Delivered", "bg-kae-purple-soft"]].map(([l, c], i, a) => (
              <li key={l} className="flex items-center gap-2"><span className={`rounded-full border-2 border-kae-dark px-4 py-2 ${c}`}>{l.toUpperCase()}</span>{i < a.length - 1 && <span>→</span>}</li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 07 Layout */}
      <Section id="layout" n="07" title={<>Space, shape <span className="ed-caps">&amp;</span> <span className="ed-italic text-kae-purple">edges</span>.</>} intro="Thick 2px ink borders, big radii, and a flat sticker-like shadow give the interface a printed, tactile feel.">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <Label>Spacing (4px base)</Label>
            <div className="mt-4 space-y-2">
              {[4, 8, 12, 16, 24, 32, 48, 64, 96].map((s) => (
                <div key={s} className="flex items-center gap-3 font-label text-xs">
                  <span className="w-8 text-right">{s}</span>
                  <span className="h-3 rounded-sm bg-kae-purple" style={{ width: s * 2 }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Radius</Label>
            <div className="mt-4 grid grid-cols-2 gap-4 font-label text-xs">
              {[["rounded-lg", "8 · inputs"], ["rounded-xl", "12 · chips"], ["rounded-2xl", "16 · cards"], ["rounded-full", "pill · buttons"]].map(([c, l]) => (
                <div key={c} className={`flex h-20 items-center justify-center border-2 border-kae-dark bg-kae-pink-soft text-center ${c}`}>{l}</div>
              ))}
            </div>
          </div>
          <div>
            <Label>Elevation</Label>
            <div className="mt-4 space-y-5 font-label text-xs">
              <div className="rounded-2xl border-2 border-kae-dark bg-white p-5">Flat · border only</div>
              <div className="rounded-2xl border-2 border-kae-dark bg-white p-5 shadow-[6px_6px_0_0_var(--color-kae-dark)]">Sticker · 6px ink shadow</div>
              <div className="rounded-2xl border-2 border-kae-dark bg-white p-5 shadow-[6px_6px_0_0_var(--color-kae-pink)]">Pink sticker · hover / highlight</div>
              <div className="rounded-2xl bg-white p-5 shadow-xl shadow-kae-purple/20">Soft · overlays &amp; modals</div>
            </div>
          </div>
        </div>
        <div className="mt-14">
          <Label>Breakpoints</Label>
          <div className="mt-4 flex flex-wrap gap-3 font-label text-xs">
            {[["base", "0"], ["md", "768"], ["lg", "1024"], ["xl", "1280"], ["2xl", "1536"], ["3xl", "1920 · max width"]].map(([k, v]) => (
              <span key={k} className="rounded-full border-2 border-kae-dark bg-white px-4 py-2">{k} <span className="text-kae-purple">{v}</span></span>
            ))}
          </div>
        </div>
      </Section>

      {/* 08 Voice */}
      <Section id="voice" n="08" title={<>Voice <span className="ed-caps">&amp;</span> <span className="ed-italic text-kae-purple">tone</span>.</>} intro="Playful, warm, a little cheeky. We talk like the friend who orders for the table.">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Headlines", "Short, sensory, punchy.", "“Crunch first. Questions later.”"],
            ["Buttons", "Verbs. Two words max.", "“Order now” · “Add +” · “Track it”"],
            ["Errors", "Kind, never blamey.", "“Oops, that one just sold out.”"],
          ].map(([t, d, ex]) => (
            <div key={t} className="rounded-2xl border-2 border-kae-dark bg-white p-6">
              <p className="font-label text-xs text-kae-purple">{t.toUpperCase()}</p>
              <p className="mt-3 text-sm text-kae-dark/75">{d}</p>
              <p className="ed-italic mt-5 text-2xl leading-snug">{ex}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="flex flex-col items-start justify-between gap-6 bg-kae-dark px-5 py-14 text-kae-cream md:flex-row md:items-end md:px-12 2xl:px-30">
        <div>
          <p className="font-pacifico text-4xl text-kae-pink">Kae and Jae Cafe</p>
          <p className="ed-italic mt-2 text-xl text-kae-cream/80">Design System · v1.0</p>
        </div>
        <p className="font-label max-w-xs text-xs text-kae-cream/60">Tokens live in <code>src/app/globals.css</code>. Fonts are loaded in <code>src/app/layout.tsx</code>.</p>
      </footer>
    </div>
  );
}
