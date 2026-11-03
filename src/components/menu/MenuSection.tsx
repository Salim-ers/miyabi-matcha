"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { getMenu, type MenuProduct } from "@/data/menu";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/animation/gsap";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { cn, pad2 } from "@/lib/utils/cn";

const menu = getMenu();
const ALL = "tout";

type Props = {
  /** `page` : utilisé comme page autonome /carte (titre en h1). */
  variant?: "section" | "page";
};

/** La carte complète — sans prix — avec filtres animés et aperçu photo au survol. */
export function MenuSection({ variant = "section" }: Props) {
  const [filter, setFilter] = useState<string>(ALL);
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const first = useRef(true);
  const { scrollTo } = useSmoothScroll();

  const visible = useMemo(() => (filter === ALL ? menu : menu.filter((c) => c.id === filter)), [filter]);
  const total = useMemo(() => menu.reduce((n, c) => n + c.products.length, 0), []);

  const choose = (id: string) => {
    if (id === filter) return;
    const el = list.current;
    const reduce = window.matchMedia(MQ.reduce).matches;
    const apply = () => {
      setFilter(id);
      // Ramène le début de la liste sous la barre de filtres si l'on est plus bas.
      const anchor = root.current?.querySelector<HTMLElement>("[data-menu-anchor]");
      if (anchor && anchor.getBoundingClientRect().top < 0) scrollTo(anchor, { immediate: reduce });
    };
    if (!el || reduce) return apply();
    gsap.to(el, { autoAlpha: 0, y: 14, duration: 0.28, ease: "power2.in", onComplete: apply });
  };

  // Indicateur de filtre actif
  useLayoutEffect(() => {
    const wrap = tabs.current;
    const ind = indicator.current;
    const btn = wrap?.querySelector<HTMLElement>(`[data-filter="${filter}"]`);
    if (!wrap || !ind || !btn) return;
    const place = () => {
      gsap.to(ind, { x: btn.offsetLeft, width: btn.offsetWidth, duration: first.current ? 0 : 0.7, ease: "expo.out" });
    };
    place();
    // Centre l'onglet actif horizontalement, sans jamais faire défiler la page.
    if (wrap.scrollWidth > wrap.clientWidth) {
      wrap.scrollTo({
        left: btn.offsetLeft - (wrap.clientWidth - btn.offsetWidth) / 2,
        behavior: first.current ? "auto" : "smooth",
      });
    }
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [filter]);

  // Entrée des produits après filtrage
  useGSAP(
    () => {
      const el = list.current;
      if (!el) return;
      if (first.current) {
        first.current = false;
        return;
      }
      const items = el.querySelectorAll("[data-menu-item], [data-menu-cat]");
      if (window.matchMedia(MQ.reduce).matches) {
        gsap.set(el, { autoAlpha: 1, y: 0 });
      } else {
        gsap.set(el, { autoAlpha: 1, y: 0 });
        gsap.fromTo(items, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.03, ease: "expo.out" });
      }
      ScrollTrigger.refresh();
    },
    { dependencies: [filter], scope: list },
  );

  const Heading = variant === "page" ? "h1" : "h2";
  const CatHeading = variant === "page" ? "h2" : "h3";
  const itemLevel = variant === "page" ? "h3" : "h4";
  const titleClass =
    "mt-5 font-display text-[clamp(4.2rem,22vw,7rem)] font-light leading-[0.85] tracking-[-0.04em] lg:text-[clamp(6rem,12vw,15rem)]";

  return (
    <section
      ref={root}
      id="carte"
      data-surface="light"
      data-nav="carte"
      aria-labelledby="carte-title"
      className="relative bg-ivory text-ink"
    >
      <div className={cn("container-x mx-auto max-w-[120rem] pb-10", variant === "page" ? "pt-36 lg:pt-32" : "pt-24 lg:pt-36")}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label flex items-center gap-4 text-[0.62rem] text-matcha-deep">
              <span aria-hidden className="h-px w-10 bg-matcha-deep/50" />
              {total} créations · {menu.length} univers
            </p>
            {variant === "page" ? (
              <Heading id="carte-title" className={titleClass}>
                La carte
              </Heading>
            ) : (
              <RevealText as={Heading} id="carte-title" mode="chars" className={titleClass}>
                La carte
              </RevealText>
            )}
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pb-4">
            <p className="text-[1rem] leading-relaxed text-ink/70">
              Matcha, crêpes japonaises, café, boba et thés fruités : toute la carte MIYABI, à savourer sur place ou à emporter.
            </p>
            <p className="label mt-5 text-[0.58rem] text-ink/60">Carte indicative · tarifs et disponibilités en boutique</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div data-menu-anchor className="sticky top-[var(--header-offset)] z-30 transition-[top] duration-500 border-y border-ink/10 bg-ivory/92 backdrop-blur-xl lg:top-0">
        <div
          ref={tabs}
          role="toolbar"
          aria-label="Filtrer la carte par catégorie"
          className="no-scrollbar container-x relative mx-auto flex max-w-[120rem] gap-1 overflow-x-auto py-3"
        >
          <span
            ref={indicator}
            aria-hidden
            className="absolute bottom-3 left-0 top-3 rounded-full bg-ink"
            style={{ width: 0 }}
          />
          {[{ id: ALL, label: "Tout", count: total }, ...menu.map((c) => ({ id: c.id, label: c.label, count: c.products.length }))].map((t) => (
            <button
              key={t.id}
              type="button"
              data-filter={t.id}
              onClick={() => choose(t.id)}
              aria-pressed={filter === t.id}
              className={cn(
                "label relative z-10 flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[0.62rem] transition-colors duration-500",
                filter === t.id ? "text-ivory" : "text-ink/60 hover:text-ink",
              )}
            >
              {t.label}
              <sup className="text-[0.55rem] tracking-normal opacity-60">{t.count}</sup>
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div ref={list} className="container-x mx-auto max-w-[120rem] pb-24 pt-6 lg:pb-36">
        {visible.map((cat, ci) => (
          <div
            key={cat.id}
            className="grid gap-x-6 border-b border-ink/10 py-12 last:border-b-0 lg:grid-cols-12 lg:py-20"
            aria-labelledby={`cat-${cat.id}`}
            role="group"
          >
            <div data-menu-cat className="mb-8 lg:sticky lg:top-28 lg:col-span-4 lg:mb-0 lg:self-start">
              <span className="label text-[0.58rem] text-matcha-deep">{pad2(menu.indexOf(cat) + 1 || ci + 1)}</span>
              <CatHeading id={`cat-${cat.id}`} className="mt-3 font-display text-[clamp(2.4rem,8vw,3.2rem)] font-light leading-[0.95] tracking-[-0.02em] lg:text-[clamp(2.6rem,3.6vw,4.4rem)]">
                {cat.label}
              </CatHeading>
              {cat.labelJa && (
                <p lang="ja" className="mt-3 font-jp text-[0.9rem] tracking-[0.06em] text-ink/65">
                  {cat.labelJa}
                </p>
              )}
            </div>
            <ul className="grid gap-x-12 lg:col-span-8 md:grid-cols-2">
              {cat.products.map((p) => (
                <MenuItem key={p.id} product={p} level={itemLevel} />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <HoverPreview />
    </section>
  );
}

function MenuItem({ product: p, level: H }: { product: MenuProduct; level: "h3" | "h4" }) {
  return (
    <li
      data-menu-item
      data-preview={p.image}
      data-preview-alt={p.name}
      className="group relative flex gap-5 border-t border-ink/10 py-6 md:[&:nth-child(-n+2)]:border-t-0 [&:first-child]:border-t-0"
    >
      <div className="min-w-0 flex-1">
        <H className="flex items-center gap-3 font-display text-[1.65rem] font-normal leading-[1.08] tracking-[-0.01em] transition-transform duration-700 ease-[var(--ease-expo)] lg:group-hover:translate-x-1.5">
          {p.name}
          {p.image && <span aria-hidden className="hidden size-1.5 shrink-0 rounded-full bg-tea lg:inline-block" />}
        </H>
        {p.nameJa && (
          <p lang="ja" className="mt-1.5 font-jp text-[0.8rem] tracking-[0.04em] text-ink/62">
            {p.nameJa}
          </p>
        )}
        {p.description && <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/65">{p.description}</p>}
      </div>
      {p.image && (
        <div className="relative size-20 shrink-0 overflow-hidden bg-ink lg:hidden">
          <Photo src={p.image} alt={p.name} fill quality={70} sizes="80px" className="object-cover" loading="lazy" />
        </div>
      )}
    </li>
  );
}

/** Aperçu flottant qui suit le pointeur au survol d'un produit photographié (desktop). */
function HoverPreview() {
  const box = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<{ src: string; alt: string } | null>(null);

  useGSAP(() => {
    const el = box.current;
    const area = el?.closest("section");
    if (!area || !el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MQ.desktop} and ${MQ.finePointer}`, () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
      let currentItem: HTMLElement | null = null;
      const move = (e: PointerEvent) => {
        xTo(e.clientX + 28);
        yTo(e.clientY - 120);
        const item = (e.target as Element).closest<HTMLElement>("[data-menu-item]");
        if (item === currentItem) return;
        currentItem = item;
        const img = item?.dataset.preview;
        if (img) {
          setSrc({ src: img, alt: item?.dataset.previewAlt ?? "" });
          gsap.to(el, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.6, ease: "expo.out" });
        } else {
          gsap.to(el, { autoAlpha: 0, scale: 0.85, rotate: 0, duration: 0.4, ease: "power3.out" });
        }
      };
      const leave = () => {
        currentItem = null;
        gsap.to(el, { autoAlpha: 0, scale: 0.85, duration: 0.4 });
      };
      area.addEventListener("pointermove", move);
      area.addEventListener("pointerleave", leave);
      return () => {
        area.removeEventListener("pointermove", move);
        area.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  });

  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none invisible fixed left-0 top-0 z-[95] hidden h-60 w-48 scale-90 overflow-hidden bg-ink shadow-[0_40px_80px_-24px_rgba(16,21,16,0.55)] lg:block"
    >
      {src && <Photo key={src.src} src={src.src} alt="" fill quality={75} sizes="192px" className="object-cover" />}
    </div>
  );
}
