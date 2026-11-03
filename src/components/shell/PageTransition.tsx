"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Photo } from "@/components/ui/Photo";
import { photos, type ArtPhoto } from "@/data/photos";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/animation/gsap";
import { releaseStage } from "@/lib/stage";
import { useSmoothScroll } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionCtx);

/** Chaque page s'annonce par sa photographie et son nom. */
const ROUTES: Record<string, { label: string; photo?: ArtPhoto }> = {
  "/": { label: "Miyabi", photo: photos.tornado },
  "/carte": { label: "La Carte", photo: photos.crepeForest },
  "/creations": { label: "Nos Créations", photo: photos.splash },
  "/maison": { label: "Notre Maison", photo: photos.whisk },
  "/contact": { label: "Nous Trouver", photo: photos.takeaway },
};
const PANELS = [0, 1, 2, 3, 4];
/** Anciennes ancres de la page unique : elles mènent désormais à de vraies pages. */
const LEGACY_ANCHORS: Record<string, string> = {
  "#carte": "/carte",
  "#creations": "/creations",
  "#univers": "/maison",
  "#art": "/maison",
  "#visite": "/contact",
};
const FALLBACK_LABEL = "Miyabi";

/**
 * Transition « shōji » : cinq panneaux coulissent, la photographie de la page d'arrivée s'y dévoile,
 * puis tout se retire vers le haut. Jamais de flash blanc : la nouvelle page se prépare à couvert.
 * Le bouton retour du navigateur passe par un simple fondu.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const phase = useRef<"idle" | "cover" | "wait" | "reveal">("idle");
  const fallback = useRef<number>(0);
  const seenPath = useRef(pathname);
  const { pause, resume, scrollTo } = useSmoothScroll();
  const [dest, setDest] = useState(pathname);
  const [thumbs, setThumbs] = useState(false);

  useEffect(() => {
    const target = window.location.pathname === "/" ? LEGACY_ANCHORS[window.location.hash] : undefined;
    if (target) window.location.replace(target);
  }, []);

  // Les vignettes ne chargent qu'une fois la page prête : aucun impact sur le LCP.
  useEffect(() => {
    const load = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
      if (w.requestIdleCallback) w.requestIdleCallback(() => setThumbs(true));
      else window.setTimeout(() => setThumbs(true), 1500);
    };
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load, { once: true });
    return () => window.removeEventListener("load", load);
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
    ScrollTrigger.refresh();
    releaseStage();
    const q = gsap.utils.selector(el);
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(el, { visibility: "hidden" });
          html.dataset.transition = "";
          phase.current = "idle";
          resume();
          ScrollTrigger.refresh();
          document.getElementById("contenu")?.focus({ preventScroll: true });
        },
      })
      .to(q("[data-pt-content]"), { yPercent: -7, autoAlpha: 0, duration: 0.42, ease: "power2.in" }, 0)
      .to(q(".pt-panel"), { yPercent: -101, duration: 0.72, ease: "expo.inOut", stagger: { each: 0.035, from: "center" } }, 0.05);
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
      if (prefersReducedMotion() || !el) {
        router.push(href);
        return;
      }
      const html = document.documentElement;
      html.dataset.nav = "client";
      html.dataset.transition = "cover";
      phase.current = "cover";
      setDest(url.pathname);
      pause();
      router.prefetch(href);
      const q = gsap.utils.selector(el);
      gsap.set(el, { visibility: "visible" });
      gsap.set(q(".pt-panel"), { yPercent: 101 });
      gsap.set(q("[data-pt-content]"), { autoAlpha: 1, yPercent: 0 });
      gsap.set(q("[data-pt-label]"), { autoAlpha: 0, y: 14 });
      gsap
        .timeline({
          onComplete: () => {
            phase.current = "wait";
            router.push(href, { scroll: false });
            fallback.current = window.setTimeout(reveal, 4000);
          },
        })
        .to(q(".pt-panel"), { yPercent: 0, duration: 0.62, ease: "expo.inOut", stagger: { each: 0.035, from: "center" } }, 0)
        .fromTo(q("[data-pt-frame]"), { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.62, ease: "expo.inOut" }, 0.14)
        .fromTo(q("[data-pt-frame] [data-pt-img]"), { scale: 1.28 }, { scale: 1, duration: 0.9, ease: "expo.out" }, 0.14)
        .to(q("[data-pt-label]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.3);
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
  const route = ROUTES[dest];

  return (
    <TransitionCtx.Provider value={value}>
      {children}
      <div ref={overlay} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[150] overflow-hidden">
        <div className="absolute inset-0 flex">
          {PANELS.map((i) => (
            <span key={i} className="pt-panel -ml-px block h-full flex-1 bg-matcha" />
          ))}
        </div>
        <div data-pt-content className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-ivory">
          <div data-pt-frame className="relative aspect-[3/4] h-[42svh] overflow-hidden">
            {thumbs &&
              Object.entries(ROUTES).map(([path, r]) =>
                r.photo ? (
                  <div key={path} data-pt-img className={path === dest ? "absolute inset-0 opacity-100" : "absolute inset-0 opacity-0"}>
                    <Photo src={r.photo.src} alt="" fill sizes="32svh" quality={70} focus={r.photo.focus} />
                  </div>
                ) : null,
              )}
          </div>
          <p data-pt-label className="display text-[clamp(1.75rem,3vw,3rem)] italic">
            {route?.label ?? FALLBACK_LABEL}
          </p>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
