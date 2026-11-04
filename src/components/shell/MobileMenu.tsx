"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MiyabiSymbol } from "@/components/logo/Logo";
import { ArrowUpRight, CloseIcon } from "@/components/ui/Icons";
import { navigation, site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { pad2 } from "@/lib/utils/cn";
import { TLink } from "./TLink";

/**
 * Menu plein écran (mobile et tablette) : quatre panneaux shōji descendent l'un après l'autre,
 * le 雅 se pose en filigrane, les pages montent. Les liens sont groupés en bas, à portée de pouce.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const reduce = window.matchMedia(MQ.reduce).matches;
      gsap.set(el, { autoAlpha: 0 });
      const t = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      if (reduce) {
        gsap.set(q("[data-m-panel]"), { yPercent: 0 });
        t.to(el, { autoAlpha: 1, duration: 0.2 });
      } else {
        t.set(el, { autoAlpha: 1 })
          .fromTo(q("[data-m-panel]"), { yPercent: -101 }, { yPercent: 0, duration: 0.85, ease: "expo.inOut", stagger: 0.06 }, 0)
          .fromTo(q("[data-m-symbol]"), { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 1.6 }, 0.35)
          .fromTo(q("[data-m-link]"), { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.065 }, 0.42)
          .fromTo(q("[data-m-foot]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.7);
      }
      tl.current = t;
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    const el = root.current;
    if (!t || !el) return;
    if (open) {
      t.timeScale(1.35).play();
      window.setTimeout(() => el.querySelector<HTMLElement>("[data-m-focus]")?.focus({ preventScroll: true }), 80);
    } else if (t.progress() > 0) {
      t.timeScale(1.9).reverse();
    }
  }, [open]);

  // Échap + piège de focus
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !root.current) return;
      const nodes = Array.from(root.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="menu-plein-ecran"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[105] overflow-hidden text-ivory xl:hidden"
    >
      <div className="absolute inset-0 flex" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} data-m-panel className="-ml-px block h-full flex-1 bg-matcha" />
        ))}
      </div>
      <div data-m-symbol aria-hidden className="pointer-events-none absolute -right-[16vw] top-[10svh] w-[92vw] text-ivory/[0.07] sm:w-[70vw]">
        <MiyabiSymbol className="h-auto w-full" />
      </div>

      <div className="relative flex h-full flex-col justify-end container-x pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[var(--header-h)] land:flex-row land:items-end land:justify-between land:gap-8">
        <nav aria-label="Navigation du menu">
          <ul className="flex flex-col">
            <li className="overflow-hidden">
              <TLink href="/" data-m-link data-m-focus onClick={onClose} aria-current={pathname === "/" ? "page" : undefined} className="flex items-baseline gap-4 py-1.5">
                <span className="label w-7 shrink-0 text-ivory/60">{pad2(0)}</span>
                <span className="display whitespace-nowrap text-[clamp(1.85rem,min(11.6vw,7.4svh),5rem)] italic leading-[1.06] land:text-[clamp(1.6rem,9.5svh,3.25rem)]">Accueil</span>
              </TLink>
            </li>
            {navigation.map((item, i) => (
              <li key={item.id} className="overflow-hidden">
                <TLink href={item.href} data-m-link onClick={onClose} aria-current={pathname === item.href ? "page" : undefined} className="flex items-baseline gap-4 py-1.5">
                  <span className="label w-7 shrink-0 text-ivory/60">{pad2(i + 1)}</span>
                  <span className="display whitespace-nowrap text-[clamp(1.85rem,min(11.6vw,7.4svh),5rem)] leading-[1.06] land:text-[clamp(1.6rem,9.5svh,3.25rem)]">{item.label}</span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex items-end justify-between gap-6 border-t border-ivory/20 pt-5 land:mt-0 land:shrink-0 land:flex-col land:gap-3 land:border-t-0 land:pt-0 land:text-right">
          <div data-m-foot>
            <address className="text-[0.85rem] not-italic leading-relaxed text-ivory/85">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.85rem]">
              Instagram <ArrowUpRight className="size-3.5" />
            </a>
          </div>
          <button
            data-m-foot
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex size-14 shrink-0 items-center justify-center rounded-full border border-ivory/30 active:bg-ivory/10"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
