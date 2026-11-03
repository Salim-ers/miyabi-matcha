"use client";

import Link from "next/link";
import { useRef } from "react";
import { BrushSymbol } from "@/components/logo/BrushSymbol";
import { MiyabiWordmark } from "@/components/logo/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { navigation, site } from "@/data/site";
import { universe } from "@/data/content";
import { gsap, MQ, useGSAP } from "@/lib/animation/gsap";

/** Footer — le symbole 雅 se redessine au pinceau en fin de parcours. */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const stroke = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const path = stroke.current;
      if (!el || !path) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 75%", end: "top 5%", scrub: 0.8 },
          },
        );
        gsap.from(el.querySelectorAll("[data-foot-col]"), {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });
      });
      mm.add(MQ.reduce, () => {
        gsap.set(path, { strokeDashoffset: 0 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={root} data-surface="dark" className="relative overflow-hidden bg-ink text-ivory lg:pl-[var(--rail)]">
      <div className="container-x mx-auto max-w-[120rem] pt-24 lg:pt-32">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BrushSymbol
              strokeRef={stroke}
              ghostOpacity={0.05}
              className="h-auto w-full max-w-[44rem] text-ivory"
              title="雅 — MIYABI"
            />
          </div>
          <div className="lg:col-span-5 lg:pb-6">
            <MiyabiWordmark className="h-auto w-56 text-ivory" title="MIYABI MATCHA" />
            <p className="mt-8 font-display text-[1.9rem] font-light italic leading-tight text-gold">
              {universe.band[0]}
              <br />
              {universe.band[1]}
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-ivory/12 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div data-foot-col>
            <p className="label text-[0.58rem] text-ivory/55">Adresse</p>
            <address className="mt-4 not-italic leading-relaxed text-ivory/85">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
            <a
              href={site.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="label link-line mt-4 inline-flex min-h-11 items-center gap-1.5 text-[0.6rem] text-gold"
            >
              Itinéraire <ArrowUpRight className="size-3" />
            </a>
          </div>
          <nav data-foot-col aria-label="Plan du site">
            <p className="label text-[0.58rem] text-ivory/55">Explorer</p>
            <ul className="mt-4 space-y-1">
              {navigation.map((n) => (
                <li key={n.id}>
                  <Link href={n.href} className="link-line inline-flex min-h-9 items-center text-ivory/85 hover:text-ivory">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div data-foot-col>
            <p className="label text-[0.58rem] text-ivory/55">Suivre</p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line mt-4 inline-flex min-h-11 items-center gap-2 font-display text-[1.45rem] font-light"
            >
              {site.instagram.handle} <ArrowUpRight className="size-4" />
            </a>
            <Link href="/carte" className="label link-line mt-3 flex min-h-11 w-fit items-center text-[0.6rem] text-gold">
              Voir la carte complète
            </Link>
          </div>
          <div data-foot-col>
            <p className="label text-[0.58rem] text-ivory/55">Informations</p>
            <ul className="mt-4 space-y-1">
              <li>
                <Link href="/mentions-legales" className="link-line inline-flex min-h-9 items-center text-ivory/85">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="link-line inline-flex min-h-9 items-center text-ivory/85">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/12 py-8 text-[0.8rem] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} · Paris
          </p>
          <a href="#contenu" className="label link-line inline-flex min-h-11 items-center text-[0.58rem]">
            Retour en haut ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
