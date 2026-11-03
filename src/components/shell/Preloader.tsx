"use client";

import { useEffect, useRef, useState } from "react";
import { BrushSymbol } from "@/components/logo/BrushSymbol";
import { MiyabiWordmark } from "@/components/logo/Logo";
import { gsap } from "@/lib/animation/gsap";
import { completeIntro, isIntroPending } from "@/lib/stage";

/**
 * Intro : sur le même ivoire que le Hero, le 雅 officiel se trace au pinceau,
 * puis le symbole rejoint sa place dans l'en-tête pendant que la couverture s'ouvre.
 * Aucun flash, aucun saut. Courte, jouée une seule fois par session, jamais bloquante (Échap ou clic pour passer).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const stroke = useRef<SVGPathElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!isIntroPending()) {
      setMounted(false);
      return;
    }
    const el = root.current;
    const path = stroke.current;
    if (!el || !path) return;
    const q = gsap.utils.selector(el);

    const heroReady = new Promise<void>((resolve) => {
      const img = document.querySelector<HTMLImageElement>("[data-hero-photo] img");
      if (!img || img.complete) return resolve();
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    });
    const ready = Promise.race([
      Promise.all([document.fonts?.ready ?? Promise.resolve(), heroReady]),
      new Promise((r) => setTimeout(r, 1900)),
    ]);

    const draw = gsap
      .timeline()
      .to(path, { strokeDashoffset: 0, duration: 1.05, ease: "power2.inOut" }, 0)
      .fromTo(q("[data-pl-word]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }, 0.5);

    let finished = false;
    let leave: gsap.core.Timeline | null = null;
    const exit = () => {
      if (finished) return;
      finished = true;
      draw.progress(1);
      document.documentElement.dataset.logoFlying = "1";
      const symbol = q("[data-pl-symbol]")[0];
      const target = document.querySelector<HTMLElement>("[data-header-symbol]");
      const from = symbol?.getBoundingClientRect();
      const to = target?.getBoundingClientRect();
      leave = gsap.timeline({
        onComplete: () => {
          delete document.documentElement.dataset.logoFlying;
          setMounted(false);
        },
      });
      leave.to(q("[data-pl-word]"), { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.in" }, 0);
      if (symbol && from && to && to.width > 0) {
        leave.to(
          symbol,
          {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
            duration: 0.95,
            ease: "expo.inOut",
          },
          0.05,
        );
      }
      leave
        .call(completeIntro, [], 0.42)
        .to(q("[data-pl-bg]"), { autoAlpha: 0, duration: 0.7, ease: "power1.inOut" }, 0.42)
        .set(q("[data-pl-symbol]"), { autoAlpha: 0 }, 1.0);
    };

    const minTime = new Promise((r) => setTimeout(r, 1450));
    Promise.all([ready, minTime]).then(exit);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
    };
    window.addEventListener("keydown", onKey);
    el.addEventListener("click", exit);

    return () => {
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("click", exit);
      draw.kill();
      leave?.kill();
      delete document.documentElement.dataset.logoFlying;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[200] cursor-pointer text-ink" role="status" aria-label="Chargement de MIYABI MATCHA">
      <div data-pl-bg className="absolute inset-0 bg-ivory" />
      <div className="relative flex h-full flex-col items-center justify-center gap-7">
        <div data-pl-symbol className="w-[min(46vw,13rem)] origin-center will-change-transform">
          <BrushSymbol strokeRef={stroke} ghostOpacity={0.05} className="h-auto w-full" />
        </div>
        <div data-pl-word className="invisible">
          <MiyabiWordmark className="h-auto w-[min(30vw,8.5rem)]" />
        </div>
      </div>
    </div>
  );
}
