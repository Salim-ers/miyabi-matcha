"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/animation/gsap";
import { isIntroPending, STAGE_EVENT } from "@/lib/stage";

type ScrollTarget = number | HTMLElement;

type ScrollCtx = {
  scrollTo: (target: ScrollTarget, opts?: { immediate?: boolean; offset?: number }) => void;
  /** Bloque le défilement (Lenis, sans toucher à la barre de défilement). */
  pause: () => void;
  resume: () => void;
  /** Bloque le défilement pour un calque plein écran (menu mobile). */
  lock: () => void;
  unlock: () => void;
};

const Ctx = createContext<ScrollCtx>({ scrollTo: () => {}, pause: () => {}, resume: () => {}, lock: () => {}, unlock: () => {} });
export const useSmoothScroll = () => useContext(Ctx);

/**
 * Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger.
 * Désactivé sur écrans tactiles et si l'utilisateur limite les animations : défilement natif.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const holds = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia(MQ.reduce).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, anchors: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (isIntroPending()) lenis.stop();
    const onStage = () => {
      if (holds.current === 0) lenis.start();
    };
    window.addEventListener(STAGE_EVENT, onStage);
    return () => {
      window.removeEventListener(STAGE_EVENT, onStage);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: ScrollTarget, opts?: { immediate?: boolean; offset?: number }) => {
    const lenis = lenisRef.current;
    const reduce = window.matchMedia(MQ.reduce).matches;
    const immediate = opts?.immediate || reduce;
    const offset = opts?.offset ?? 0;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: immediate ? 0 : 1.4, immediate, force: true });
      return;
    }
    const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + offset, behavior: immediate ? "auto" : "smooth" });
  }, []);

  const pause = useCallback(() => {
    holds.current += 1;
    lenisRef.current?.stop();
  }, []);
  const resume = useCallback(() => {
    holds.current = Math.max(0, holds.current - 1);
    if (holds.current === 0 && !isIntroPending()) lenisRef.current?.start();
  }, []);
  const lock = useCallback(() => {
    pause();
    document.documentElement.style.overflow = "hidden";
  }, [pause]);
  const unlock = useCallback(() => {
    resume();
    document.documentElement.style.overflow = "";
  }, [resume]);

  const value = useMemo(() => ({ scrollTo, pause, resume, lock, unlock }), [scrollTo, pause, resume, lock, unlock]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
