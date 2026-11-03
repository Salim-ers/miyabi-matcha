"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MiyabiSymbol } from "@/components/logo/Logo";
import { Photo } from "@/components/ui/Photo";
import { ArrowUpRight, CloseIcon } from "@/components/ui/Icons";
import { navigation, site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { cn, pad2 } from "@/lib/utils/cn";

/** Photo associée à chaque entrée du menu (aperçu au survol). */
const previews: Record<string, { src: string; alt: string }> = {
  accueil: { src: "/images/products/matcha-tornado.jpg", alt: "Matcha Tornado" },
  art: { src: "/images/preparation/chasen-whisk.jpg", alt: "Matcha fouetté au chasen" },
  creations: { src: "/images/products/camelot-caramel-latte.jpg", alt: "Camelot Caramel Latte" },
  univers: { src: "/images/location/shop-window-tray.jpg", alt: "Boissons MIYABI devant la vitrine" },
  carte: { src: "/images/products/crepe-forest-fruit.jpg", alt: "Crêpe Forest Fruit" },
  visite: { src: "/images/location/takeaway-hands.jpg", alt: "Boissons MIYABI à emporter" },
};

type Props = { open: boolean; active: string; onClose: () => void };

export function FullscreenMenu({ open, active, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [hovered, setHovered] = useState<string>(active || "accueil");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const desktop = window.matchMedia(MQ.desktop).matches;
      const reduce = window.matchMedia(MQ.reduce).matches;
      gsap.set(el, { autoAlpha: 0 });
      const t = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      if (reduce) {
        t.to(el, { autoAlpha: 1, duration: 0.2 });
      } else {
        t.set(el, { autoAlpha: 1 })
          .fromTo(
            q("[data-menu-panel]"),
            { clipPath: desktop ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" },
            0,
          )
          .fromTo(q("[data-menu-symbol]"), { autoAlpha: 0, scale: 1.12, rotate: -4 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 2 }, 0.35)
          .fromTo(q("[data-menu-link]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.055 }, 0.45)
          .fromTo(q("[data-menu-index]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, stagger: 0.05 }, 0.6)
          .fromTo(q("[data-menu-preview]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" }, 0.4)
          .fromTo(q("[data-menu-foot]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.75);
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
      setHovered(active || "accueil");
      t.timeScale(1).play();
      const first = el.querySelector<HTMLElement>("[data-menu-focus]");
      window.setTimeout(() => first?.focus({ preventScroll: true }), 80);
    } else if (t.progress() > 0) {
      t.timeScale(1.7).reverse();
    }
  }, [open, active]);

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
      // Le bouton du rail / de l'en-tête reste accessible pour fermer.
      const toggles = Array.from(document.querySelectorAll<HTMLElement>('[aria-controls="menu-plein-ecran"]')).filter(
        (n) => n.offsetParent !== null,
      );
      const all = [...toggles, ...nodes];
      const first = all[0];
      const last = all[all.length - 1];
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
      className="invisible fixed inset-0 z-[105] lg:left-[var(--rail)]"
    >
      <div data-menu-panel className="absolute inset-0 overflow-hidden bg-ink text-ivory">
        {/* Symbole monumental en arrière-plan */}
        <div
          aria-hidden
          data-menu-symbol
          className="pointer-events-none absolute -right-[18vw] top-1/2 w-[110vw] -translate-y-1/2 text-matcha-deep/45 lg:-right-[6vw] lg:w-[62vw]"
        >
          <MiyabiSymbol className="h-auto w-full" />
        </div>

        <div className="relative grid h-full grid-rows-[1fr_auto] px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(var(--header-h)+env(safe-area-inset-top)+1rem)] lg:grid-cols-[1.25fr_1fr] lg:grid-rows-[1fr_auto] lg:gap-x-[6vw] lg:px-[6vw] lg:py-14">
          <nav aria-label="Navigation principale" className="flex flex-col justify-end lg:justify-center">
            <ul className="flex flex-col gap-1 lg:gap-2">
              {navigation.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <Link
                    href={item.href}
                    data-menu-link
                    data-menu-focus={i === 0 ? "" : undefined}
                    onClick={onClose}
                    onMouseEnter={() => setHovered(item.id)}
                    onFocus={() => setHovered(item.id)}
                    aria-current={item.id === active ? "true" : undefined}
                    className="group flex items-baseline gap-4 py-1 lg:gap-6"
                  >
                    <span data-menu-index className="label w-7 shrink-0 text-[0.6rem] text-gold/80">
                      {pad2(i + 1)}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[clamp(2.4rem,10.5vw,3.4rem)] font-light leading-[1.02] tracking-[-0.02em] transition-[color,transform] duration-700 ease-[var(--ease-expo)] lg:text-[clamp(3rem,5.6vw,6.5rem)]",
                        "group-hover:translate-x-3 group-hover:italic group-focus-visible:translate-x-3",
                        item.id === active ? "text-ivory" : "text-ivory/60 group-hover:text-ivory",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Aperçu photographique (desktop) */}
          <div className="relative hidden items-center lg:flex">
            <div data-menu-preview className="relative aspect-[4/5] w-full max-w-[32rem] overflow-hidden">
              {Object.entries(previews).map(([id, img]) => (
                <div
                  key={id}
                  className={cn(
                    "absolute inset-0 transition-[opacity,transform,filter] duration-[1100ms] ease-[var(--ease-expo)]",
                    id === hovered ? "scale-100 opacity-100 grayscale-0" : "scale-110 opacity-0 grayscale",
                  )}
                >
                  <Photo src={img.src} alt="" fill sizes="32rem" className="object-cover" />
                </div>
              ))}
              <span className="label absolute bottom-4 left-4 text-[0.6rem] text-ivory/80">
                {previews[hovered]?.alt}
              </span>
            </div>
          </div>

          <div className="col-span-full mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-t border-ivory/10 pt-5 lg:mt-0">
            <address data-menu-foot className="not-italic">
              <span className="label block text-[0.6rem] text-ivory/55">Adresse</span>
              <span className="mt-1 block text-sm text-ivory/85">
                {site.address.street}, {site.address.postalCode} {site.address.city}
              </span>
            </address>
            <div data-menu-foot className="flex items-center gap-6">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="label link-line flex min-h-11 items-center gap-1.5 text-[0.62rem]">
                Instagram <ArrowUpRight className="size-3" />
              </a>
              <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className="label link-line flex min-h-11 items-center gap-1.5 text-[0.62rem]">
                Itinéraire <ArrowUpRight className="size-3" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="flex size-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-ivory lg:hidden"
                aria-label="Fermer le menu"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
