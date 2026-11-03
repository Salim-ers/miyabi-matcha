"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { showcase } from "@/data/content";
import { signatures } from "@/data/products";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { cn, pad2 } from "@/lib/utils/cn";

const TOTAL = signatures.length;

/**
 * Nos créations — scène éditoriale.
 * Desktop : grande photographie active, nom monumental, compteur, transitions par masques (clic, glisser, clavier).
 * Mobile / tablette : swipe tactile natif (scroll-snap), sans conflit avec le défilement vertical.
 */
export function Showcase() {
  const [index, setIndex] = useState(0);
  const current = signatures[index] ?? signatures[0]!;

  return (
    <section
      id="creations"
      data-surface="dark"
      data-nav="creations"
      aria-labelledby="creations-title"
      aria-roledescription="carrousel"
      className="relative isolate overflow-hidden bg-ink"
      style={{
        ["--tint" as string]: current.tint,
        ["--accent" as string]: current.accent,
        transition: "--tint 1.4s cubic-bezier(0.65,0,0.35,1), --accent 1.4s cubic-bezier(0.65,0,0.35,1)",
      }}
    >
      {/* Ambiance colorée dérivée du produit */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_60%_55%_at_64%_52%,var(--tint)_0%,color-mix(in_oklab,var(--tint)_40%,#0b0f0b)_45%,#0b0f0b_80%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="container-x relative mx-auto max-w-[120rem] pt-24 lg:pt-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label flex items-center gap-4 text-[0.62rem] text-gold">
              <span aria-hidden className="h-px w-10 bg-gold/60" />
              {showcase.label}
            </p>
            <RevealText
              as="h2"
              id="creations-title"
              className="mt-5 font-display text-[clamp(3rem,12vw,5rem)] font-light italic leading-none tracking-[-0.02em] lg:text-[clamp(4rem,6.5vw,8rem)]"
            >
              {showcase.title}
            </RevealText>
          </div>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-ivory/60 lg:mb-3 lg:mr-[8vw]">{showcase.intro}</p>
        </div>
      </div>

      <Stage index={index} setIndex={setIndex} />
      <Swipe index={index} setIndex={setIndex} />

      <p className="sr-only" aria-live="polite">
        Création {index + 1} sur {TOTAL} : {current.name}
      </p>
    </section>
  );
}

/* ───────────────────────── Scène desktop ───────────────────────── */

function Stage({ index, setIndex }: { index: number; setIndex: (n: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef(index);
  const busy = useRef(false);
  const dir = useRef(1);

  const go = useCallback(
    (to: number, direction?: number) => {
      if (busy.current) return;
      const next = (to + TOTAL) % TOTAL;
      if (next === index) return;
      dir.current = direction ?? (next > index ? 1 : -1);
      setIndex(next);
    },
    [index, setIndex],
  );

  // Transition entre deux créations
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const from = prev.current;
      const to = index;
      prev.current = to;
      const q = gsap.utils.selector(el);
      const layers = q("[data-stage-layer]");
      const names = q("[data-stage-name]");
      const metas = q("[data-stage-meta]");
      const reduce = window.matchMedia(MQ.reduce).matches;

      if (from === to) {
        layers.forEach((l, i) => gsap.set(l, { autoAlpha: i === to ? 1 : 0, clipPath: "inset(0% 0% 0% 0%)" }));
        names.forEach((n, i) => gsap.set(n, { autoAlpha: i === to ? 1 : 0 }));
        metas.forEach((n, i) => gsap.set(n, { autoAlpha: i === to ? 1 : 0 }));
        return;
      }

      const d = dir.current;
      const inLayer = layers[to];
      const outLayer = layers[from];
      if (!inLayer || !outLayer) return;

      if (reduce) {
        gsap.set(outLayer, { autoAlpha: 0 });
        gsap.set(inLayer, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        names.forEach((n, i) => gsap.set(n, { autoAlpha: i === to ? 1 : 0 }));
        metas.forEach((n, i) => gsap.set(n, { autoAlpha: i === to ? 1 : 0 }));
        return;
      }

      busy.current = true;
      const inChars = names[to]?.querySelectorAll("[data-char]") ?? [];
      const outChars = names[from]?.querySelectorAll("[data-char]") ?? [];
      const tl = gsap.timeline({ onComplete: () => void (busy.current = false) });
      tl.set(inLayer, { autoAlpha: 1, zIndex: 2, clipPath: d > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" })
        .set(outLayer, { zIndex: 1 })
        .to(inLayer, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "expo.inOut" }, 0)
        .fromTo(inLayer.querySelector("img"), { scale: 1.25, yPercent: 8 * d }, { scale: 1, yPercent: 0, duration: 1.6, ease: "expo.out" }, 0.05)
        .to(outLayer.querySelector("img"), { scale: 0.92, yPercent: -10 * d, duration: 1.25, ease: "expo.inOut" }, 0)
        .to(outLayer, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0.75)
        .set(outLayer.querySelector("img"), { scale: 1, yPercent: 0 })
        .to(outChars, { yPercent: -110 * d, duration: 0.45, stagger: 0.01, ease: "power3.in" }, 0)
        .set(names[from] ?? null, { autoAlpha: 0 })
        .set(names[to] ?? null, { autoAlpha: 1 }, 0.62)
        .fromTo(inChars, { yPercent: 115 * d }, { yPercent: 0, duration: 1.1, stagger: 0.018, ease: "expo.out", immediateRender: true }, 0.62)
        .to(metas[from] ?? null, { autoAlpha: 0, y: -12, duration: 0.35 }, 0)
        .fromTo(metas[to] ?? null, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.7)
        .to(q("[data-stage-digit-inner]"), { yPercent: (-100 * to) / TOTAL, duration: 1, ease: "expo.inOut" }, 0.1);
    },
    { scope: root, dependencies: [index] },
  );

  // Profondeur au pointeur
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.finePointer} and ${MQ.motion}`, () => {
        const px = gsap.quickTo(q(el, "[data-stage-photo]"), "x", { duration: 1.2, ease: "power3.out" });
        const py = gsap.quickTo(q(el, "[data-stage-photo]"), "y", { duration: 1.2, ease: "power3.out" });
        const nx = gsap.quickTo(q(el, "[data-stage-names]"), "x", { duration: 1.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          px(x * 26);
          py(y * 18);
          nx(x * -18);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Glisser pour changer de création
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let startX = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || (e.target as Element).closest("button, a")) return;
      dragging = true;
      startX = e.clientX;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 70) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [go, index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, -1);
    }
  };

  return (
    <div
      ref={root}
      className="showcase-stage relative h-[min(92svh,64rem)] min-h-[40rem] cursor-grab select-none active:cursor-grabbing"
      onKeyDown={onKeyDown}
      role="group"
      aria-label="Créations signature — utilisez les flèches pour naviguer"
      tabIndex={0}
    >
      {/* Noms monumentaux */}
      <div data-stage-names className="pointer-events-none absolute inset-y-0 left-[var(--gutter)] z-10 flex w-[58%] items-center">
        {signatures.map((s, i) => (
          <h3
            key={s.id}
            data-stage-name
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-x-0 top-1/2 -translate-y-[62%] font-display text-[clamp(4.2rem,8.2vw,11.5rem)] font-light leading-[0.9] tracking-[-0.035em]",
              i !== 0 && "invisible",
            )}
          >
            {s.lines.map((line, li) => (
              <span key={li} className={cn("block overflow-hidden pb-[0.08em]", li % 2 === 1 && "pl-[0.6em] italic text-[var(--accent)]")}>
                {Array.from(line).map((ch, ci) => (
                  <span key={ci} data-char className="inline-block whitespace-pre will-change-transform">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h3>
        ))}
      </div>

      {/* Photographie active */}
      <div data-stage-photo className="absolute inset-y-[4%] right-[10%] z-0 aspect-[0.9] max-w-[50%]">
        {signatures.map((s, i) => (
          <div
            key={s.id}
            data-stage-layer
            className={cn("feather absolute inset-0 overflow-hidden", i !== 0 && "invisible")}
          >
            <Photo
              src={s.image}
              alt={s.name}
              fill
              quality={90}
              sizes="(min-width: 1024px) 46vw, 1px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Informations */}
      <div className="absolute bottom-[8%] left-[var(--gutter)] z-20 w-[min(30rem,38%)]">
        {signatures.map((s, i) => (
          <div key={s.id} data-stage-meta className={cn("absolute bottom-0 left-0 w-full", i !== 0 && "invisible")}>
            <p className="label text-[0.6rem] text-[var(--accent)]">{s.kind}</p>
            {s.nameJa && <p lang="ja" className="mt-3 font-jp text-sm tracking-[0.08em] text-ivory/70">{s.nameJa}</p>}
            {s.description && <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory/70">{s.description}</p>}
          </div>
        ))}
      </div>

      {/* Compteur + contrôles */}
      <div className="absolute right-[clamp(1.25rem,2.4vw,2.75rem)] top-1/2 z-20 flex -translate-y-1/2 flex-col items-end gap-8">
        <div className="flex items-start gap-2 font-display font-light leading-none">
          <span className="block h-[clamp(3rem,4.6vw,5.5rem)] overflow-hidden text-[clamp(3rem,4.6vw,5.5rem)]">
            <span data-stage-digit-inner className="block">
              {signatures.map((s, i) => (
                <span key={s.id} className="block h-[clamp(3rem,4.6vw,5.5rem)]">
                  {pad2(i + 1)}
                </span>
              ))}
            </span>
          </span>
          <span className="mt-1 text-lg text-ivory/55">/ {pad2(TOTAL)}</span>
        </div>
        <div className="flex gap-3">
          <Magnetic>
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              className="flex size-14 items-center justify-center rounded-full border border-ivory/20 transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink"
              aria-label="Création précédente"
            >
              <ArrowLeft className="size-5" />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              className="flex size-14 items-center justify-center rounded-full border border-ivory/20 transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink"
              aria-label="Création suivante"
            >
              <ArrowRight className="size-5" />
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Index photographique */}
      <ol className="absolute bottom-[8%] right-[clamp(1.25rem,2.4vw,2.75rem)] z-20 flex gap-2" aria-label="Choisir une création">
        {signatures.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={s.name}
              aria-current={i === index ? "true" : undefined}
              className="group relative block h-16 w-12 overflow-hidden"
            >
              <Photo
                src={s.image}
                alt=""
                fill
                quality={60}
                sizes="48px"
                className={cn(
                  "object-cover transition-[opacity,transform,filter] duration-700",
                  i === index ? "opacity-100" : "opacity-35 grayscale group-hover:opacity-80 group-hover:grayscale-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[var(--accent)] transition-transform duration-700",
                  i === index ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function q(el: Element, sel: string) {
  return el.querySelectorAll(sel);
}

/* ───────────────────────── Swipe mobile / tablette ───────────────────────── */

function Swipe({ index, setIndex }: { index: number; setIndex: (n: number) => void }) {
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) setIndex(slides.indexOf(e.target as HTMLElement));
        }
      },
      { root: el, threshold: [0.6] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [setIndex]);

  const scrollToSlide = (i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft - (el.clientWidth - slide.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <div className="showcase-swipe pb-20 pt-10">
      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[calc(50vw-41vw)] sm:px-[calc(50vw-29vw)]"
        aria-label="Créations signature"
      >
        {signatures.map((s, i) => (
          <li
            key={s.id}
            className="w-[82vw] shrink-0 snap-center sm:w-[58vw]"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${TOTAL} : ${s.name}`}
          >
            <div className="feather relative aspect-[0.9] w-full">
              <Photo src={s.image} alt={s.name} fill quality={85} sizes="(min-width: 640px) 58vw, 82vw" className="object-cover" />
            </div>
            <div
              className={cn(
                "mt-2 transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]",
                i === index ? "translate-y-0 opacity-100" : "translate-y-3 opacity-30",
              )}
            >
              <p className="label text-[0.58rem]" style={{ color: s.accent }}>
                {s.kind}
              </p>
              <h3 className="mt-2 font-display text-[2.4rem] font-light leading-[0.95] tracking-[-0.02em]">
                {s.lines.map((l, li) => (
                  <span key={li} className={cn("block", li % 2 === 1 && "italic")} style={li % 2 === 1 ? { color: s.accent } : undefined}>
                    {l}
                  </span>
                ))}
              </h3>
              {s.nameJa && <p lang="ja" className="mt-2 font-jp text-[0.8rem] text-ivory/60">{s.nameJa}</p>}
              {s.description && <p className="mt-2 text-[0.9rem] leading-relaxed text-ivory/65">{s.description}</p>}
            </div>
          </li>
        ))}
      </ul>

      <div className="container-x mt-8 flex items-center justify-between">
        <p className="font-display text-2xl font-light">
          {pad2(index + 1)} <span className="text-base text-ivory/55">/ {pad2(TOTAL)}</span>
        </p>
        <div className="relative mx-6 h-px flex-1 bg-ivory/12">
          <span
            className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-[width] duration-700 ease-[var(--ease-expo)]"
            style={{ width: `${((index + 1) / TOTAL) * 100}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollToSlide(Math.max(0, index - 1))}
            className="flex size-11 items-center justify-center rounded-full border border-ivory/20 active:bg-ivory/10 disabled:opacity-30"
            disabled={index === 0}
            aria-label="Création précédente"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSlide(Math.min(TOTAL - 1, index + 1))}
            className="flex size-11 items-center justify-center rounded-full border border-ivory/20 active:bg-ivory/10 disabled:opacity-30"
            disabled={index === TOTAL - 1}
            aria-label="Création suivante"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
