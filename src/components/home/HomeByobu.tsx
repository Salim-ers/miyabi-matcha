"use client";

import { useRef } from "react";
import { TLink } from "@/components/shell/TLink";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { home } from "@/data/content";
import { photos, type ArtPhoto } from "@/data/photos";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";
import { isLite } from "@/lib/stage";

type Panel = { id: string; name: string; photo: ArtPhoto; focus: string; href: string };

/** Trois photos réservées à l'accueil : aucune ne revient ailleurs sur le site. */
const TRIO: Panel[] = [
  { id: "crepe", name: "Crêpe au matcha", photo: photos.crepeLift, focus: "50% 55%", href: "/creations#crepe-forest-fruit" },
  { id: "strawberry", name: "Strawberry Matcha", photo: photos.pour, focus: "50% 100%", href: "/creations#strawberry-matcha" },
  { id: "matcha", name: "Le matcha", photo: photos.cupHand, focus: "42% 70%", href: "/carte#matcha" },
];

const OPEN = (9 * Math.PI) / 180;
const FOLDED = (80 * Math.PI) / 180;

function Caption({ item, index }: { item: Panel; index: number }) {
  return (
    <span className="flex items-baseline justify-between gap-3">
      <span className="display text-[clamp(1.5rem,2.2vw,3.2rem)] italic leading-[1.06]">{item.name}</span>
      <span className="label shrink-0 text-[0.62rem] text-smoke">0{index + 1}</span>
    </span>
  );
}

/**
 * Trois signatures sur un paravent (byōbu) : les panneaux restent solidaires de leurs charnières
 * et le paravent se déplie au défilement. Une vraie perspective, portée par de vraies photographies.
 * Sur mobile : glissement tactile natif, chaque panneau pivote légèrement selon sa position.
 */
export function HomeByobu() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const stage = el?.querySelector<HTMLElement>("[data-stage]");
      if (!el || !stage) return;
      const panels = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll("[data-panel]"));
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        if (isLite()) return;
        stage.classList.add("is-3d");
        const fold = { a: FOLDED, tilt: 0 };

        const layout = () => {
          const totalW = stage.clientWidth;
          const w = totalW / 3 / Math.cos(OPEN);
          const h = Math.min(w * 1.4, window.innerHeight * 0.8);
          stage.style.height = `${h}px`;
          const cos = Math.cos(fold.a);
          const sin = Math.sin(fold.a);
          const deg = (fold.a * 180) / Math.PI;
          const x0 = (totalW - 3 * w * cos) / 2;
          panels.forEach((panel, i) => {
            const odd = i % 2 === 1;
            gsap.set(panel, { width: w, height: h, x: x0 + i * w * cos, z: odd ? -w * sin : 0, rotationY: odd ? -deg : deg });
          });
          stage.style.setProperty("--fold", String(Math.min(1, sin * 1.6)));
          stage.style.transform = `rotateY(${fold.tilt}deg)`;
        };

        layout();
        const tween = gsap.to(fold, {
          a: OPEN,
          ease: "power2.out",
          onUpdate: layout,
          scrollTrigger: { trigger: stage, start: "top 92%", end: "top 28%", scrub: 0.8, onRefresh: layout },
        });
        const onResize = () => layout();
        window.addEventListener("resize", onResize);

        const move = (e: PointerEvent) => {
          gsap.to(fold, { tilt: (e.clientX / window.innerWidth - 0.5) * -5, duration: 1.2, ease: "power3.out", overwrite: "auto", onUpdate: layout });
        };
        el.addEventListener("pointermove", move);

        return () => {
          window.removeEventListener("resize", onResize);
          el.removeEventListener("pointermove", move);
          tween.scrollTrigger?.kill();
          tween.kill();
          stage.classList.remove("is-3d");
          stage.removeAttribute("style");
          panels.forEach((p) => gsap.set(p, { clearProps: "all" }));
        };
      });

      // Mobile : pivot léger selon la position dans le glissement
      mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
        let raf = 0;
        const update = () => {
          raf = 0;
          const center = stage.getBoundingClientRect().left + stage.clientWidth / 2;
          panels.forEach((panel) => {
            const r = panel.getBoundingClientRect();
            const ratio = gsap.utils.clamp(-1, 1, (r.left + r.width / 2 - center) / r.width);
            panel.style.transform = `rotateY(${(ratio * -9).toFixed(2)}deg) scale(${(1 - Math.abs(ratio) * 0.05).toFixed(3)})`;
          });
        };
        const onScroll = () => {
          if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        stage.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          stage.removeEventListener("scroll", onScroll);
          cancelAnimationFrame(raf);
          panels.forEach((p) => (p.style.transform = ""));
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-surface="light" className="relative overflow-hidden bg-ivory pb-20 pt-20 lg:pb-[clamp(6rem,13svh,10rem)] lg:pt-[clamp(6rem,13svh,10rem)]">
      <div className="container-x flex items-center justify-between gap-6">
        <h2 className="label text-smoke">{home.signaturesLabel}</h2>
        <TLink href="/creations" className="group inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-medium">
          <span className="hairline">Toutes les créations</span>
          <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1" />
        </TLink>
      </div>

      <div
        data-stage
        className="byobu-stage no-scrollbar mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] lg:mx-auto lg:mt-10 lg:grid lg:w-[min(84vw,128svh)] lg:grid-cols-3 lg:gap-0 lg:overflow-visible lg:px-0"
      >
        {TRIO.map((item, i) => (
          <div key={item.id} className="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:contents">
            <TLink
              data-panel
              href={item.href}
              aria-label={item.name}
              className="byobu-panel group block aspect-[1/1.32] w-full lg:aspect-[1/1.4]"
            >
              <Photo
                src={item.photo.src}
                alt={item.photo.alt}
                focus={item.focus}
                fill
                sizes="(min-width: 64rem) 34vw, (min-width: 40rem) 50vw, 82vw"
                className="transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.045]"
              />
              <span className={`byobu-shade ${i % 2 === 0 ? "byobu-shade-a" : "byobu-shade-b"}`} aria-hidden />
            </TLink>
            <span className="mt-3 block lg:hidden">
              <Caption item={item} index={i} />
            </span>
          </div>
        ))}
        <span aria-hidden className="w-px shrink-0 lg:hidden" />
      </div>

      {/* Grand écran : les noms, à plat sous le paravent */}
      <div className="mx-auto mt-5 hidden w-[min(84vw,128svh)] grid-cols-3 gap-6 lg:grid">
        {TRIO.map((item, i) => (
          <TLink key={item.id} href={item.href} tabIndex={-1} aria-hidden className="block">
            <Caption item={item} index={i} />
          </TLink>
        ))}
      </div>
    </section>
  );
}
