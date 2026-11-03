"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MiyabiSymbol } from "@/components/logo/Logo";
import { useSmoothScroll } from "@/components/shell/SmoothScroll";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { formatPrice, menuExtras, type MenuProduct, type MenuSection } from "@/data/menu";
import { gsap, prefersReducedMotion } from "@/lib/animation/gsap";
import { isDirectLoad, onStage } from "@/lib/stage";
import { cn } from "@/lib/utils/cn";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const CARD_SIZES = "(min-width: 160rem) 18vw, (min-width: 96rem) 23vw, (min-width: 40rem) 30vw, 44vw";

/**
 * La carte : une page d'usage, pensée pour être consultée vite, debout, d'une main.
 * Catégories en onglets (tout le contenu reste dans le code de la page pour le référencement et sans JavaScript).
 * Toutes les cartes ont le même format : photographie et nom japonais à sa droite,
 * ou fiche de papier quand aucune image n'est disponible.
 */
export function CarteClient({ menu }: { menu: MenuSection[] }) {
  const firstId = menu[0]?.id ?? "matcha";
  const [activeId, setActiveId] = useState(firstId);
  const [shownId, setShownId] = useState(firstId);

  const root = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const { scrollTo } = useSmoothScroll();

  const allPriced = menu.every((c) => c.products.every((p) => p.price != null));

  // L'indicateur glisse sous l'onglet actif.
  const moveIndicator = useCallback((id: string, animate: boolean) => {
    const nav = navRef.current;
    const mark = indicator.current;
    const tab = nav?.querySelector<HTMLElement>(`[data-tab="${id}"]`);
    if (!nav || !mark || !tab) return;
    const props = { x: tab.offsetLeft, width: tab.offsetWidth };
    if (animate && !prefersReducedMotion()) gsap.to(mark, { ...props, duration: 0.8, ease: "expo.out", overwrite: true });
    else gsap.set(mark, props);
    const scroller = tab.parentElement;
    if (scroller && scroller.scrollWidth > scroller.clientWidth) {
      scroller.scrollTo({ left: tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2, behavior: animate ? "smooth" : "auto" });
    }
  }, []);

  useEffect(() => {
    moveIndicator(activeId, false);
    const onResize = () => moveIndicator(activeId, false);
    window.addEventListener("resize", onResize);
    void document.fonts?.ready.then(() => moveIndicator(activeId, false));
    return () => window.removeEventListener("resize", onResize);
  }, [activeId, moveIndicator]);

  const select = useCallback(
    (id: string, opts?: { scroll?: boolean }) => {
      if (id === activeId || busy.current) return;
      setActiveId(id);
      moveIndicator(id, true);
      window.history.replaceState(null, "", `#${id}`);

      const needsScroll = opts?.scroll !== false && anchor.current && anchor.current.getBoundingClientRect().top < 0;
      const finish = () => {
        setShownId(id);
        if (needsScroll && anchor.current) scrollTo(anchor.current, { immediate: true, offset: -(navRef.current?.offsetHeight ?? 0) });
        busy.current = false;
      };
      const grid = root.current?.querySelector<HTMLElement>(`[data-category="${shownId}"]`);
      if (prefersReducedMotion() || !grid) {
        finish();
        return;
      }
      busy.current = true;
      gsap.to(grid.querySelectorAll("[data-card]"), {
        y: -14,
        autoAlpha: 0,
        duration: 0.32,
        ease: "power2.in",
        stagger: { each: 0.015, from: "start" },
        onComplete: finish,
      });
    },
    [activeId, moveIndicator, scrollTo, shownId],
  );

  // Lien direct vers une catégorie : /carte#boba
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && menu.some((c) => c.id === id)) {
        setActiveId(id);
        setShownId(id);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [menu]);

  // Entrée de la nouvelle catégorie : le titre monte, les cartes suivent en cascade.
  const firstRun = useRef(true);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const initial = firstRun.current;
    firstRun.current = false;
    if (prefersReducedMotion() || (initial && isDirectLoad())) return;

    const panel = el.querySelector<HTMLElement>(`[data-category="${shownId}"]`);
    if (!panel) return;
    const cards = Array.from(panel.querySelectorAll<HTMLElement>("[data-card]"));
    const heading = panel.querySelector<HTMLElement>("[data-cat-title]");
    gsap.set(cards, { y: 34, autoAlpha: 0 });
    if (heading) gsap.set(heading, { yPercent: 110 });
    const stop = onStage(() => {
      gsap.to(cards, { y: 0, autoAlpha: 1, duration: 0.95, ease: "expo.out", stagger: { each: 0.05, grid: "auto" }, clearProps: "transform,opacity,visibility" });
      if (heading) gsap.to(heading, { yPercent: 0, duration: 1, ease: "expo.out", clearProps: "transform" });
    });
    return () => stop();
  }, [shownId]);

  const next = menu[(menu.findIndex((c) => c.id === shownId) + 1) % menu.length];

  return (
    <div ref={root} className="bg-ivory">
      {/* Titre */}
      <header className="container-x flex items-end justify-between gap-6 pb-5 pt-[calc(var(--header-h)+1.25rem)] lg:pb-7 lg:pt-[calc(var(--header-h)+1.5rem)]">
        <h1 className="display shrink-0 whitespace-nowrap text-[clamp(3rem,13vw,6rem)] leading-[0.86] lg:text-[clamp(4rem,6.8vw,9.5rem)]">La Carte</h1>
        {!allPriced && <p className="max-w-[24ch] pb-1 text-right text-[0.75rem] leading-snug text-smoke sm:text-[0.8125rem]">Tarifs et disponibilités en boutique.</p>}
      </header>

      {/* Catégories */}
      <div ref={navRef} className="carte-nav border-y border-ink/10 bg-ivory">
        <div role="tablist" aria-label="Catégories de la carte" className="no-scrollbar relative flex gap-1 overflow-x-auto container-x sm:gap-3 lg:gap-8">
          {menu.map((c) => {
            const on = c.id === activeId;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                data-tab={c.id}
                aria-selected={on}
                aria-controls={`panel-${c.id}`}
                onClick={() => select(c.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap px-2 py-4 text-[0.875rem] font-medium transition-colors duration-500 first:pl-0 lg:px-0 lg:py-5 lg:text-[0.9375rem]",
                  on ? "text-ink" : "text-smoke hover:text-ink",
                )}
              >
                <span className="sm:hidden">{c.tab ?? c.short}</span>
                <span className="hidden sm:inline">{c.short}</span>
              </button>
            );
          })}
          <span ref={indicator} aria-hidden className="absolute bottom-0 left-0 h-[2px] w-0 bg-matcha" />
        </div>
      </div>

      {/* Produits */}
      <div ref={anchor} className="container-x pb-14 pt-7 lg:pb-24 lg:pt-10">
        {menu.map((c) => (
          <div key={c.id} id={`panel-${c.id}`} role="tabpanel" aria-labelledby={`tab-${c.id}`} data-category={c.id} hidden={c.id !== shownId}>
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6 lg:mb-9">
              <div className="overflow-hidden pb-1">
                <h2 data-cat-title className="display text-[clamp(2.2rem,5vw,6.5rem)] leading-[1.02]">
                  {c.label}
                </h2>
              </div>
              {c.labelJa && (
                <p lang="ja" className="shrink-0 font-jp text-[0.8125rem] tracking-[0.12em] text-smoke sm:pb-2 sm:text-[0.95rem]">
                  {c.labelJa}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:gap-x-7 lg:gap-y-11 2xl:grid-cols-4 4xl:grid-cols-5">
              {c.products.map((p, i) => (
                <ProductCard key={p.id} product={p} paper={c.paper} priority={c.id === firstId && i < 3} />
              ))}
            </div>
          </div>
        ))}
        <noscript>
          <style>{`[data-category][hidden]{display:block!important;margin-bottom:3rem}`}</style>
        </noscript>

        <dl aria-label="Suppléments" className="mt-10 flex flex-col gap-1.5 border-t border-ink/10 pt-5 text-[0.875rem] sm:flex-row sm:flex-wrap sm:gap-x-8 lg:mt-14">
          {menuExtras.map((extra) => (
            <div key={extra.label} className="flex justify-between gap-3 sm:justify-start">
              <dt className="text-smoke">{extra.label}</dt>
              <dd className="tabular-nums">{extra.price}</dd>
            </div>
          ))}
        </dl>

        {next && (
          <button
            type="button"
            onClick={() => select(next.id)}
            className="cta mt-5 flex min-h-14 w-full items-center justify-between gap-4 border-t border-ink/10 pt-5 text-left"
          >
            <span>
              <span className="label block text-[0.6rem] text-smoke">Ensuite</span>
              <span className="display mt-1 block text-[clamp(1.6rem,3vw,2.6rem)] italic">{next.label}</span>
            </span>
            <span className="cta-dot size-11 shrink-0 bg-ink text-ivory">
              <ArrowRight className="size-4" />
              <ArrowRight className="size-4" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Nom, prix (dès qu'il est renseigné) et description. */
function ProductText({ product }: { product: MenuProduct }) {
  return (
    <>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[0.9375rem] font-medium leading-snug lg:text-base">{product.name}</h3>
        {product.price != null && <span className="shrink-0 text-[0.9375rem] tabular-nums">{formatPrice(product.price)}</span>}
      </div>
      {product.short && <p className="mt-1 text-[0.8125rem] leading-snug text-smoke">{product.short}</p>}
    </>
  );
}

/** Une carte : photographie et nom japonais à sa droite, ou fiche de papier. Même format pour toutes. */
function ProductCard({ product, paper, priority }: { product: MenuProduct; paper: string; priority: boolean }) {
  const { photo, nameJa } = product;
  return (
    <article data-card className="group flex flex-col">
      {photo ? (
        <div className="menu-media flex gap-1.5 lg:gap-2.5">
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <Photo
              src={photo.src}
              alt={photo.alt}
              focus={photo.focus}
              fill
              sizes={CARD_SIZES}
              quality={85}
              priority={priority}
              className="transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
            />
          </div>
          {nameJa ? (
            <p lang="ja" className="tategaki menu-jp">
              {nameJa}
            </p>
          ) : (
            <span aria-hidden className="menu-jp" />
          )}
        </div>
      ) : (
        <div className="menu-media relative flex items-center justify-center p-3" style={{ backgroundColor: paper }}>
          {nameJa ? (
            <span lang="ja" className="tategaki max-h-full text-[clamp(0.85rem,6.2cqw,1.5rem)] leading-[1.7] text-matcha [text-wrap:balance] transition-transform duration-[1100ms] ease-[var(--ease-expo)] group-hover:-translate-y-1">
              {nameJa}
            </span>
          ) : (
            <span className="display text-center text-[clamp(1.2rem,10cqw,2.2rem)] italic leading-[1.1] text-matcha">{product.name}</span>
          )}
          <MiyabiSymbol className="absolute bottom-3 left-3 w-6 text-matcha/35" />
        </div>
      )}
      <ProductText product={product} />
    </article>
  );
}
