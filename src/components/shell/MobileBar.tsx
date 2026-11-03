"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuBookIcon, RouteIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";
import { cn } from "@/lib/utils/cn";
import { TLink } from "./TLink";

const item = "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full text-[0.8125rem] font-medium transition-transform duration-200 active:scale-[0.97]";

/**
 * Barre inférieure discrète (mobile et tablette) : Itinéraire et Voir la carte.
 * Sur la couverture, elle attend que l'on commence à descendre pour laisser le premier écran intact.
 * Sur la page Carte, le second bouton mène à la page Nous Trouver.
 */
export function MobileBar({ hiddenByMenu }: { hiddenByMenu: boolean }) {
  const pathname = usePathname();
  const [past, setPast] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const update = () => setPast(window.scrollY > window.innerHeight * 0.35);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  const visible = !hiddenByMenu && (!isHome || past);
  const second = pathname === "/carte" ? { href: "/contact", label: "Nous trouver", Icon: RouteIcon } : { href: "/carte", label: "Voir la carte", Icon: MenuBookIcon };

  return (
    <nav
      aria-label="Actions rapides"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[100] flex justify-center px-3 pb-[calc(0.625rem+env(safe-area-inset-bottom))] transition-transform duration-700 ease-[var(--ease-expo)] lg:hidden",
        visible ? "translate-y-0" : "translate-y-[140%]",
      )}
      inert={!visible}
    >
      <div className="flex w-full max-w-md items-stretch gap-1 rounded-full bg-ink p-1 text-ivory shadow-[0_10px_34px_-12px_rgba(23,26,23,0.55)]">
        <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className={item}>
          <RouteIcon className="size-4 opacity-80" />
          Itinéraire
          <span className="sr-only">(Google Maps, nouvel onglet)</span>
        </a>
        <TLink href={second.href} className={cn(item, "bg-ivory text-ink")}>
          <second.Icon className="size-4 opacity-80" />
          {second.label}
        </TLink>
      </div>
    </nav>
  );
}
