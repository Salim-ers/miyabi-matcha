"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { BrushSymbol } from "@/components/logo/BrushSymbol";
import { MiyabiWordmark } from "@/components/logo/Logo";
import { gsap, isLightDevice, prefersReducedMotion, ScrollTrigger } from "@/lib/animation/gsap";
import { releaseStage } from "@/lib/stage";
import { useSmoothScroll } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionCtx);

const PANELS = [0, 1, 2, 3, 4];
/** Anciennes ancres de la page unique : elles mènent désormais à de vraies pages. */
const LEGACY_ANCHORS: Record<string, string> = {
  "#carte": "/carte",
  "#creations": "/creations",
  "#univers": "/maison",
  "#art": "/maison",
  "#visite": "/contact",
};

/**
 * Transition « shōji » : cinq panneaux coulissent, le 雅 officiel s'y trace au pinceau,
 * puis tout se retire vers le haut. Jamais de flash blanc : la nouvelle page se prépare à couvert.
 * Le bouton retour du navigateur passe par un simple fondu.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const stroke = useRef<SVGPathElement>(null);
  const phase = useRef<"idle" | "cover" | "wait" | "reveal">("idle");
  const fallback = useRef<number>(0);
  const seenPath = useRef(pathname);
  const { pause, resume, scrollTo } = useSmoothScroll();

  useEffect(() => {
    const target = window.location.pathname === "/" ? LEGACY_ANCHORS[window.location.hash] : undefined;
    if (target) window.location.replace(target);
  }, []);

  const reveal = useCallback(() => {
    const el = overlay.current;
    if (!el || phase.current === "reveal") return;
    phase.current = "reveal";
    window.clearTimeout(fallback.current);
    scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const html = document.documentElement;
    html.dataset.transition = "reveal";
    const light = isLightDevice();
    // Écran tactile : pas de scène épinglée, le recalcul attend que le navigateur soit libre.
    if (!light) ScrollTrigger.refresh();
    releaseStage();
    const q = gsap.utils.selector(el);
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(el, { visibility: "hidden" });
          html.dataset.transition = "";
          phase.current = "idle";
          resume();
          if (light) window.setTimeout(() => ScrollTrigger.refresh(), 400);
          else ScrollTrigger.refresh();
          document.getElementById("contenu")?.focus({ preventScroll: true });
        },
      })
      .to(q("[data-pt-content]"), { yPercent: -7, autoAlpha: 0, duration: 0.42, ease: "power2.in" }, 0)
      .to(q(".pt-panel"), { yPercent: -101, duration: light ? 0.5 : 0.72, ease: "expo.inOut", stagger: { each: light ? 0.02 : 0.035, from: "center" } }, 0.05);
  }, [resume, scrollTo]);

  const navigate = useCallback(
    (href: string) => {
      if (phase.current !== "idle") return;
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
        scrollTo(target ?? 0);
        return;
      }
      const el = overlay.current;
      if (prefersReducedMotion() || !el || !stroke.current) {
        router.push(href);
        return;
      }
      const html = document.documentElement;
      html.dataset.nav = "client";
      html.dataset.transition = "cover";
      phase.current = "cover";
      pause();
      router.prefetch(href);
      const q = gsap.utils.selector(el);
      gsap.set(el, { visibility: "visible" });
      gsap.set(q(".pt-panel"), { yPercent: 101 });
      gsap.set(q("[data-pt-content]"), { autoAlpha: 1, yPercent: 0 });
      gsap.set(q("[data-pt-word]"), { autoAlpha: 0, y: 10 });
      const light = isLightDevice();
      gsap.set(stroke.current, { strokeDashoffset: light ? 0 : 1 });
      gsap.set(q("[data-pt-symbol]"), light ? { autoAlpha: 0, scale: 0.94 } : { autoAlpha: 1, scale: 1 });
      const cover = gsap
        .timeline({
          onComplete: () => {
            phase.current = "wait";
            router.push(href, { scroll: false });
            fallback.current = window.setTimeout(reveal, 4000);
          },
        })
        .to(q(".pt-panel"), { yPercent: 0, duration: light ? 0.46 : 0.62, ease: "expo.inOut", stagger: { each: light ? 0.02 : 0.035, from: "center" } }, 0)
        .to(q("[data-pt-word]"), { autoAlpha: 1, y: 0, duration: light ? 0.3 : 0.5, ease: "expo.out" }, light ? 0.22 : 0.4);
      // Écran tactile : le logo apparaît en fondu. Ailleurs, il se trace au pinceau.
      if (light) cover.to(q("[data-pt-symbol]"), { autoAlpha: 1, scale: 1, duration: 0.34, ease: "power2.out" }, 0.14);
      else cover.to(stroke.current, { strokeDashoffset: 0, duration: 0.72, ease: "power2.inOut" }, 0.12);
    },
    [pause, reveal, router, scrollTo],
  );

  useEffect(() => {
    if (seenPath.current === pathname) return;
    seenPath.current = pathname;
    if (phase.current === "wait") {
      const raf = requestAnimationFrame(() => requestAnimationFrame(reveal));
      return () => cancelAnimationFrame(raf);
    }
    // Retour / avance du navigateur : la position est restaurée par Next, simple fondu.
    document.documentElement.dataset.nav = "client";
    gsap.fromTo("#contenu", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, ease: "power1.out", clearProps: "opacity,visibility" });
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [pathname, reveal]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionCtx.Provider value={value}>
      {children}
      <div ref={overlay} aria-hidden data-pt-overlay className="pointer-events-none invisible fixed inset-0 z-[150] overflow-hidden">
        <div className="absolute inset-0 flex">
          {PANELS.map((i) => (
            <span key={i} className="pt-panel -ml-px block h-full flex-1 bg-matcha" />
          ))}
        </div>
        <div data-pt-content className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-ivory">
          <div data-pt-symbol className="w-[min(42vw,11rem)]">
            <BrushSymbol strokeRef={stroke} ghostOpacity={0.1} className="h-auto w-full" />
          </div>
          <div data-pt-word>
            <MiyabiWordmark className="h-auto w-[min(28vw,7rem)]" />
          </div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
