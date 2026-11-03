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
    <div className="relative h-full w-full overflow-hidden bg-beige">
      {consent ? (
        <>
          <iframe
            title={`Carte Google Maps : ${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`}
            src={site.maps.embed}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <button
            type="button"
            onClick={revoke}
            className="absolute bottom-3 left-3 min-h-10 rounded-full bg-ivory px-4 text-[0.75rem] font-medium text-ink shadow-[0_6px_20px_-8px_rgba(23,26,23,0.5)]"
          >
            Masquer la carte
          </button>
        </>
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
          <MiyabiSymbol className="pointer-events-none absolute left-1/2 top-1/2 w-[min(80%,34rem)] -translate-x-1/2 -translate-y-1/2 text-matcha/[0.06]" />
          <p className="display relative text-[clamp(1.6rem,3vw,2.8rem)] italic">Carte interactive</p>
          <p className="relative max-w-[38ch] text-[0.8125rem] leading-relaxed text-smoke">
            Fournie par Google Maps, qui peut déposer des cookies. Elle ne se charge qu&apos;avec votre accord.
          </p>
          <div className="relative flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <button
              type="button"
              onClick={accept}
              disabled={consent === null}
              className="min-h-12 rounded-full bg-ink px-7 text-[0.8125rem] font-medium text-ivory transition-colors duration-500 hover:bg-matcha"
            >
              Afficher la carte
            </button>
            <a href={site.maps.place} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-1.5 text-[0.8125rem] font-medium">
              <span className="hairline">Ouvrir Google Maps</span> <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
