"use client";

import { usePathname } from "next/navigation";
import { MenuBookIcon, RouteIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";
import { cn } from "@/lib/utils/cn";
import { TLink } from "./TLink";

const item = "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full text-[0.8125rem] font-medium transition-transform duration-200 active:scale-[0.97]";

/**
 * Deux boutons toujours accessibles au pouce, sur mobile et tablette (y compris à l'horizontale) :
 * La Carte et Itinéraire. L'affichage est géré par la classe .mobile-bar (globals.css).
 */
export function MobileBar({ hiddenByMenu }: { hiddenByMenu: boolean }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Actions rapides"
      inert={hiddenByMenu}
      className={cn(
        "mobile-bar fixed inset-x-0 bottom-0 z-[100] justify-center px-3 pb-[calc(0.625rem+env(safe-area-inset-bottom))] transition-transform duration-700 ease-[var(--ease-expo)]",
        hiddenByMenu && "translate-y-[140%]",
      )}
    >
      <div className="flex w-full max-w-md items-stretch gap-1 rounded-full bg-ink p-1 text-ivory shadow-[0_10px_34px_-12px_rgba(23,26,23,0.55)] lg:max-w-sm">
        <TLink href="/carte" aria-current={pathname === "/carte" ? "page" : undefined} className={cn(item, "bg-ivory text-ink")}>
          <MenuBookIcon className="size-4 opacity-80" />
          La Carte
        </TLink>
        <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className={item}>
          <RouteIcon className="size-4 opacity-80" />
          Itinéraire
          <span className="sr-only">(Google Maps, nouvel onglet)</span>
        </a>
      </div>
    </nav>
  );
}
