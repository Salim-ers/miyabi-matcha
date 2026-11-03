"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/animation/gsap";
import { INTRO_EVENT, isIntroPending } from "@/lib/intro";

type ScrollTarget = string | number | HTMLElement;

type ScrollCtx = {
  scrollTo: (target: ScrollTarget, opts?: { immediate?: boolean }) => void;
  lock: () => void;
  unlock: () => void;
};

const Ctx = createContext<ScrollCtx>({ scrollTo: () => {}, lock: () => {}, unlock: () => {} });
export const useSmoothScroll = () => useContext(Ctx);

/**
 * Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger.
 * Désactivé sur écrans tactiles et si l'utilisateur limite les animations : défilement natif.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const locks = useRef(0);
  const [, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(MQ.reduce).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1, anchors: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (isIntroPending()) lenis.stop();
    const onIntro = () => {
      if (locks.current === 0) lenis.start();
    };
    window.addEventListener(INTRO_EVENT, onIntro);
    setReady(true);
    return () => {
      window.removeEventListener(INTRO_EVENT, onIntro);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: ScrollTarget, opts?: { immediate?: boolean }) => {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el === null) return;
    const lenis = lenisRef.current;
    const offset = window.matchMedia(MQ.desktop).matches ? 0 : 0;
    if (lenis) {
      lenis.scrollTo(el, { offset, duration: opts?.immediate ? 0 : 1.6, immediate: opts?.immediate, force: true });
      return;
    }
    const reduce = window.matchMedia(MQ.reduce).matches;
    if (typeof el === "number") window.scrollTo({ top: el, behavior: reduce ? "auto" : "smooth" });
    else el.scrollIntoView({ behavior: reduce || opts?.immediate ? "auto" : "smooth", block: "start" });
  }, []);

  const lock = useCallback(() => {
    locks.current += 1;
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);
  const unlock = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current === 0) {
      document.documentElement.style.overflow = "";
      if (!isIntroPending()) lenisRef.current?.start();
    }
  }, []);

  // Liens d'ancre internes (#section ou /#section depuis l'accueil) → défilement fluide.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      scrollTo(el);
      window.history.pushState(null, "", url.hash);
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  const value = useMemo(() => ({ scrollTo, lock, unlock }), [scrollTo, lock, unlock]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
