"use client";

import { useEffect, useRef, useState } from "react";
import { BrushSymbol } from "@/components/logo/BrushSymbol";
import { gsap } from "@/lib/animation/gsap";
import { completeIntro, isIntroPending } from "@/lib/intro";

const CURTAIN_FULL = "M0 0 H100 V100 C70 100 30 100 0 100 Z";
const CURTAIN_BEND = "M0 0 H100 V58 C72 74 28 74 0 58 Z";
const CURTAIN_GONE = "M0 0 H100 V0 C70 0 30 0 0 0 Z";

type Grain = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; c: string };
const POWDER = ["#9cbf5a", "#7f9f48", "#657f45", "#b5cf77", "#4f6a35"];

/**
 * Intro signature : 雅 révélé au pinceau, poudre de matcha qui accompagne le geste,
 * logotype dévoilé en tracking, puis rideau d'encre organique qui découvre le site.
 * Jouée une seule fois par session ; « Passer » et Échap permettent de l'éviter.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const stroke = useRef<SVGPathElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!isIntroPending()) {
      setMounted(false);
      return;
    }
    const el = root.current;
    const path = stroke.current;
    const cvs = canvas.current;
    if (!el || !path || !cvs) return;

    const q = gsap.utils.selector(el);
    const ctx2d = cvs.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // — Poudre de matcha émise à la pointe du pinceau —
    const grains: Grain[] = [];
    const total = path.getTotalLength();
    const svg = path.ownerSVGElement;
    const spawn = (progress: number) => {
      if (!svg) return;
      const pt = path.getPointAtLength(progress * total);
      const m = svg.getScreenCTM();
      if (!m) return;
      const x = (pt.x * m.a + pt.y * m.c + m.e) * dpr;
      const y = (pt.x * m.b + pt.y * m.d + m.f) * dpr;
      for (let i = 0; i < 5; i++) {
        const max = 0.8 + Math.random() * 1.1;
        grains.push({
          x: x + (Math.random() - 0.5) * 60 * dpr,
          y: y + (Math.random() - 0.5) * 60 * dpr,
          vx: (Math.random() - 0.5) * 0.9 * dpr,
          vy: (-0.15 - Math.random() * 0.6) * dpr,
          r: (0.5 + Math.random() * 1.8) * dpr,
          life: 0,
          max,
          c: POWDER[(Math.random() * POWDER.length) | 0] ?? "#9cbf5a",
        });
      }
    };
    const render = () => {
      if (!ctx2d) return;
      ctx2d.clearRect(0, 0, cvs.width, cvs.height);
      const dt = gsap.ticker.deltaRatio() / 60;
      for (let i = grains.length - 1; i >= 0; i--) {
        const g = grains[i];
        if (!g) continue;
        g.life += dt;
        if (g.life >= g.max) {
          grains.splice(i, 1);
          continue;
        }
        g.x += g.vx;
        g.y += g.vy;
        g.vx *= 0.985;
        const a = Math.sin((g.life / g.max) * Math.PI) * 0.75;
        ctx2d.globalAlpha = a;
        ctx2d.fillStyle = g.c;
        ctx2d.beginPath();
        ctx2d.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx2d.fill();
      }
    };
    gsap.ticker.add(render);

    // — Ressources critiques : polices + image du Hero —
    const heroReady = new Promise<void>((resolve) => {
      const img = document.querySelector<HTMLImageElement>("[data-hero-photo] img");
      if (!img || img.complete) return resolve();
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    });
    const ready = Promise.race([
      Promise.all([document.fonts?.ready ?? Promise.resolve(), heroReady]),
      new Promise((r) => setTimeout(r, 2200)),
    ]);

    let finished = false;
    const tl = gsap.timeline({ paused: true });
    const progress = { p: 0 };

    tl.set(el, { autoAlpha: 1 })
      .to(progress, {
        p: 1,
        duration: 1.15,
        ease: "power2.inOut",
        onUpdate: () => {
          path.style.strokeDashoffset = String(1 - progress.p);
          if (progress.p < 0.98) spawn(progress.p);
        },
      })
      .fromTo(q("[data-pl-symbol]"), { scale: 1.06 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0)
      .fromTo(
        q("[data-pl-word]"),
        { autoAlpha: 0, letterSpacing: "1.1em", filter: "blur(6px)" },
        { autoAlpha: 1, letterSpacing: "0.46em", filter: "blur(0px)", duration: 1.1, stagger: 0.1, ease: "expo.out" },
        0.55,
      )
      .fromTo(q("[data-pl-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.inOut" }, 0.75)
      .addLabel("hold");

    const exit = () => {
      if (finished) return;
      finished = true;
      const out = gsap.timeline({
        onComplete: () => {
          gsap.ticker.remove(render);
          setMounted(false);
        },
      });
      out
        .to(q("[data-pl-content]"), { yPercent: -18, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, 0)
        .to(q("canvas"), { autoAlpha: 0, duration: 0.4 }, 0)
        .to(q("[data-pl-curtain-ink]"), { attr: { d: CURTAIN_BEND }, duration: 0.55, ease: "power3.in" }, 0.35)
        .to(q("[data-pl-curtain-ink]"), { attr: { d: CURTAIN_GONE }, duration: 0.55, ease: "power3.out" }, ">")
        .to(q("[data-pl-curtain-green]"), { attr: { d: CURTAIN_BEND }, duration: 0.55, ease: "power3.in" }, 0.48)
        .to(q("[data-pl-curtain-green]"), { attr: { d: CURTAIN_GONE }, duration: 0.55, ease: "power3.out" }, ">")
        .call(completeIntro, [], 0.62);
    };

    tl.play();
    const minTime = new Promise((r) => setTimeout(r, 1500));
    Promise.all([ready, minTime]).then(exit);

    const skip = (e?: KeyboardEvent) => {
      if (e && e.key !== "Escape") return;
      tl.progress(1);
      exit();
    };
    const onKey = (e: KeyboardEvent) => skip(e);
    window.addEventListener("keydown", onKey);
    const btn = el.querySelector<HTMLButtonElement>("[data-pl-skip]");
    const onSkip = () => skip();
    btn?.addEventListener("click", onSkip);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      btn?.removeEventListener("click", onSkip);
      gsap.ticker.remove(render);
      tl.kill();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[200] text-ivory"
      role="status"
      aria-live="polite"
      aria-label="Chargement de MIYABI MATCHA"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path data-pl-curtain-green d={CURTAIN_FULL} fill="#263D24" />
        <path data-pl-curtain-ink d={CURTAIN_FULL} fill="#101510" />
      </svg>
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
      <div data-pl-content className="relative flex h-full flex-col items-center justify-center gap-10">
        <div data-pl-symbol className="w-[min(58vw,22rem)]">
          <BrushSymbol strokeRef={stroke} ghostOpacity={0.06} className="h-auto w-full" />
        </div>
        <div className="flex flex-col items-center">
          <span data-pl-word className="label block pl-[0.46em] text-[clamp(1rem,2.4vw,1.5rem)] font-normal tracking-[0.46em] opacity-0">
            MIYABI
          </span>
          <span data-pl-rule className="my-3 block h-px w-14 origin-center bg-gold/60" />
          <span data-pl-word className="label block pl-[0.46em] text-[0.7rem] font-normal tracking-[0.46em] text-ivory/70 opacity-0">
            MATCHA
          </span>
        </div>
      </div>
      <button
        type="button"
        data-pl-skip
        className="label absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 min-h-11 px-3 text-ivory/50 transition-colors hover:text-ivory"
      >
        Passer l&apos;intro
      </button>
    </div>
  );
}
