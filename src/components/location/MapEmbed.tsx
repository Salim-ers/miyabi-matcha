"use client";

import { useEffect, useState } from "react";
import { MiyabiSymbol } from "@/components/logo/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { site } from "@/data/site";
import { readStorage, writeStorage } from "@/lib/utils/storage";

export const MAPS_CONSENT_KEY = "miyabi:maps-consent";

/**
 * Carte Google Maps interactive (zoom, déplacement, fiche, itinéraire).
 * Service tiers déposant des cookies : chargée uniquement après accord du visiteur,
 * choix mémorisé sur cet appareil et révocable.
 */
export function MapEmbed() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    setConsent(readStorage(MAPS_CONSENT_KEY) === "granted");
  }, []);

  const accept = () => {
    writeStorage(MAPS_CONSENT_KEY, "granted");
    setConsent(true);
  };
  const revoke = () => {
    writeStorage(MAPS_CONSENT_KEY, null);
    setConsent(false);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-matcha-night">
      {consent ? (
        <>
          <iframe
            title={`Carte Google Maps — ${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`}
            src={site.maps.embed}
            className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.75)_contrast(1.04)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <button
            type="button"
            onClick={revoke}
            className="label absolute bottom-3 left-3 min-h-9 rounded-full bg-ink/80 px-4 text-[0.55rem] text-ivory/80 backdrop-blur transition-colors hover:text-ivory"
          >
            Masquer la carte
          </button>
        </>
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
          <MiyabiSymbol className="pointer-events-none absolute left-1/2 top-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 text-ivory/[0.04]" />
          <span className="relative flex size-14 items-center justify-center rounded-full border border-gold/40">
            <span className="size-2.5 rounded-full bg-gold" />
            <span className="absolute inset-0 animate-ping rounded-full border border-gold/30 [animation-iteration-count:3]" />
          </span>
          <div className="relative">
            <p className="font-display text-[1.9rem] font-light leading-tight">{site.address.street}</p>
            <p className="label mt-2 text-[0.6rem] text-ivory/60">
              {site.address.postalCode} {site.address.city}
            </p>
          </div>
          <p className="relative max-w-xs text-[0.82rem] leading-relaxed text-ivory/55">
            La carte interactive est fournie par Google Maps, qui peut déposer des cookies. Elle ne se charge qu&apos;avec votre accord.
          </p>
          <div className="relative flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={accept}
              disabled={consent === null}
              className="label min-h-12 rounded-full bg-ivory px-6 text-[0.62rem] text-ink transition-colors hover:bg-gold"
            >
              Afficher la carte
            </button>
            <a
              href={site.maps.place}
              target="_blank"
              rel="noopener noreferrer"
              className="label link-line flex min-h-12 items-center gap-1.5 text-[0.62rem] text-ivory/80"
            >
              Ouvrir Google Maps <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
