"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/components/shell/SmoothScroll";
import { MiyabiSymbol } from "@/components/logo/Logo";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import type { ArtPhoto } from "@/data/photos";
import type { MenuProduct, MenuSection } from "@/data/menu";
import { gsap, MQ, prefersReducedMotion } from "@/lib/animation/gsap";
import { isDirectLoad, onStage } from "@/lib/stage";
import { cn } from "@/lib/utils/cn";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * La carte : une page d'usage, pensée pour être consultée vite, debout, d'une main.
 * Catégories en onglets (tout le contenu reste dans le code de la page pour le référencement et sans JavaScript).
 * Grand écran : photographie en colonne fixe, produits à droite ; le survol d'un produit la remplace.
 */
export function CarteClient({ menu }: { menu: MenuSection[] }) {
  const firstId = menu[0]?.id ?? "matcha";
  const [activeId, setActiveId] = useState(firstId);
  const [shownId, setShownId] = useState(firstId);
  const [preview, setPreview] = useState<ArtPhoto | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const { scrollTo } = useSmoothScroll();

  const shown = menu.find((c) => c.id === shownId) ?? menu[0];

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
      setPreview(null);
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

  // Entrée de la nouvelle catégorie : la photographie s'ouvre, les cartes montent en cascade.
  const firstRun = useRef(true);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const initial = firstRun.current;
    firstRun.current = false;
    if (prefersReducedMotion() || (initial && isDirectLoad())) return;

    const grid = el.querySelector<HTMLElement>(`[data-category="${shownId}"]`);
    const cards = grid ? Array.from(grid.querySelectorAll<HTMLElement>("[data-card]")) : [];
    const heading = el.querySelectorAll<HTMLElement>("[data-cat-title]");
    const scene = el.querySelector<HTMLElement>(`[data-scene="${shownId}"]`);
    gsap.set(cards, { y: 34, autoAlpha: 0 });
    gsap.set(heading, { yPercent: 110 });
    if (scene) gsap.set(scene, { clipPath: "inset(0% 50% 0% 50%)" });
    const stop = onStage(() => {
      gsap.to(cards, { y: 0, autoAlpha: 1, duration: 0.95, ease: "expo.out", stagger: { each: 0.05, grid: "auto" }, clearProps: "transform,opacity,visibility" });
      gsap.to(heading, { yPercent: 0, duration: 1, ease: "expo.out" });
      if (scene) gsap.to(scene, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "expo.inOut", clearProps: "clipPath" });
    });
    return () => stop();
  }, [shownId]);

  const next = menu[(menu.findIndex((c) => c.id === shownId) + 1) % menu.length];

  return (
    <div ref={root} className="bg-ivory">
      {/* Titre */}
      <header className="container-x flex items-end justify-between gap-6 pb-5 pt-[calc(var(--header-h)+1.25rem)] lg:pb-7 lg:pt-[calc(var(--header-h)+1.5rem)]">
        <h1 className="display shrink-0 whitespace-nowrap text-[clamp(3rem,13vw,6rem)] leading-[0.86] lg:text-[clamp(4rem,6.8vw,9.5rem)]">La Carte</h1>
        <p className="max-w-[24ch] pb-1 text-right text-[0.75rem] leading-snug text-smoke sm:text-[0.8125rem]">Tarifs et disponibilités en boutique.</p>
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

      <div ref={anchor} className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Photographie de la catégorie */}
        <div className="relative lg:order-none">
          <div className="relative h-[42vw] max-h-[20rem] overflow-hidden bg-beige sm:h-[34vw] lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:max-h-none">
            {menu.map((c) => (
              <div key={c.id} data-scene={c.id} className={cn("scene-layer", c.id === shownId ? "z-10" : "invisible z-0")}>
                <Photo src={c.scene.src} alt={c.id === shownId ? c.scene.alt : ""} focus={c.scene.focus} focusM={c.scene.bandM ?? c.scene.focusM} fill sizes="(min-width: 64rem) 42vw, 100vw" priority={c.id === firstId} />
              </div>
            ))}
            {/* Survol d'un produit : sa photographie prend la place */}
            {preview && (
              <div key={preview.src} className="scene-layer z-20 hidden animate-[preview-in_0.7s_var(--ease-expo)_both] lg:block">
                <Photo src={preview.src} alt="" focus={preview.focus} fill sizes="42vw" />
              </div>
            )}
            <div aria-hidden className="absolute inset-x-0 bottom-0 z-30 h-1/2 bg-gradient-to-t from-black/55 to-transparent lg:h-1/3" />
            <div className="absolute inset-x-[var(--gutter)] bottom-4 z-30 flex items-end justify-between gap-4 text-ivory lg:bottom-8">
              <div className="overflow-hidden pb-1">
                <h2 data-cat-title className="display text-[clamp(1.9rem,4.4vw,5.6rem)] leading-[1.02]">
                  {shown?.label}
                </h2>
              </div>
              {shown?.labelJa && <p lang="ja" className="hidden shrink-0 pb-2 font-jp text-[0.85rem] tracking-[0.12em] text-ivory/85 sm:block">{shown.labelJa}</p>}
            </div>
          </div>
        </div>

        {/* Produits */}
        <div className="container-x pb-14 pt-6 lg:px-[clamp(1.5rem,3vw,4rem)] lg:pb-24 lg:pt-10">
          {menu.map((c) => (
            <div
              key={c.id}
              id={`panel-${c.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${c.id}`}
              data-category={c.id}
              hidden={c.id !== shownId}
              className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-10 3xl:grid-cols-3 4xl:grid-cols-4"
            >
              {c.products.map((p) => (
                <ProductCard key={p.id} product={p} paper={c.paper} onPreview={setPreview} />
              ))}
            </div>
          ))}
          <noscript>
            <style>{`[data-category][hidden]{display:grid!important;margin-bottom:3rem}`}</style>
          </noscript>

          {next && (
            <button
              type="button"
              onClick={() => select(next.id)}
              className="cta mt-10 flex min-h-14 w-full items-center justify-between gap-4 border-t border-ink/10 pt-5 text-left lg:mt-14"
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
    </div>
  );
}

/** Carte produit : photographie réelle, ou fiche de papier au nom japonais vertical (aucune photo inventée). */
function ProductCard({ product, paper, onPreview }: { product: MenuProduct; paper: string; onPreview: (p: ArtPhoto | null) => void }) {
  const { photo } = product;
  return (
    <article
      data-card
      className="group flex flex-col"
      onMouseEnter={() => photo && window.matchMedia(MQ.finePointer).matches && onPreview(photo)}
      onMouseLeave={() => onPreview(null)}
    >
      <div className="relative aspect-[4/5] overflow-hidden" style={photo ? undefined : { backgroundColor: paper }}>
        {photo ? (
          <Photo
            src={photo.src}
            alt={photo.alt}
            focus={photo.focus}
            focusM={photo.focusM}
            fill
            sizes="(min-width: 120rem) 20vw, (min-width: 64rem) 30vw, (min-width: 40rem) 32vw, 50vw"
            className="transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 [container-type:inline-size]">
            {product.nameJa && (
              <span lang="ja" className="tategaki max-h-full text-[clamp(0.85rem,6.4cqw,1.5rem)] leading-[1.7] text-matcha [text-wrap:balance] transition-transform duration-[1100ms] ease-[var(--ease-expo)] group-hover:-translate-y-1">
                {product.nameJa}
              </span>
            )}
            <MiyabiSymbol className="absolute bottom-3 left-3 w-6 text-matcha/35" />
          </div>
        )}
      </div>
      <h3 className="mt-3 text-[0.9375rem] font-medium leading-snug lg:text-base">{product.name}</h3>
      {product.short && <p className="mt-1 text-[0.8125rem] leading-snug text-smoke">{product.short}</p>}
    </article>
  );
}
