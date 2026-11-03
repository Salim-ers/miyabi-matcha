"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MiyabiSymbol, MiyabiWordmark } from "@/components/logo/Logo";
import { navigation } from "@/data/site";
import { cn } from "@/lib/utils/cn";
import { MobileBar } from "./MobileBar";
import { MobileMenu } from "./MobileMenu";
import { useSmoothScroll } from "./SmoothScroll";
import { TLink } from "./TLink";

/** En-tête unique : discret, se retire quand on descend, revient quand on remonte. Ses couleurs suivent la surface visible. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({ solid: false, hidden: false });
  const { lock, unlock } = useSmoothScroll();
  const trigger = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const openRef = useRef(false);

  const toggle = useCallback(
    (next: boolean) => {
      if (next === openRef.current) return;
      openRef.current = next;
      if (next) lock();
      else unlock();
      setOpen(next);
    },
    [lock, unlock],
  );
  const closeAndRefocus = useCallback(() => {
    toggle(false);
    trigger.current?.focus({ preventScroll: true });
  }, [toggle]);

  useEffect(() => {
    toggle(false);
  }, [pathname, toggle]);

  // Se retire à la descente, revient à la remontée.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last;
      setState((s) => {
        const solid = y > 40;
        const hidden = y > 120 && delta > 3 ? true : delta < -3 || y <= 120 ? false : s.hidden;
        return solid === s.solid && hidden === s.hidden ? s : { solid, hidden };
      });
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.dataset.headerVisible = String(!state.hidden);
  }, [state.hidden]);

  // Couleur de l'interface : suit la section sous l'en-tête.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    document.documentElement.dataset.toneLive = "1";
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
    const first = nodes[0];
    if (first) header.dataset.tone = first.dataset.surface;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) header.dataset.tone = (e.target as HTMLElement).dataset.surface;
        }
      },
      { rootMargin: "-2% 0px -97% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      <a href="#contenu" className="label fixed left-4 top-4 z-[300] -translate-y-24 bg-ink px-4 py-3 text-ivory transition-transform focus:translate-y-0">
        Aller au contenu
      </a>
      <header
        ref={headerRef}
        data-header
        className={cn(
          "fixed inset-x-0 top-0 z-[110] flex h-[var(--header-h)] items-center justify-between container-x pt-[env(safe-area-inset-top)]",
          open ? "text-ivory" : "text-[var(--chrome-fg)]",
          state.solid && !open && "bg-[var(--chrome-bg)]",
          state.hidden && !open && "-translate-y-full",
        )}
      >
        <TLink href="/" className="group flex min-h-11 items-center gap-3" aria-label="MIYABI MATCHA, accueil">
          <span data-header-symbol className="block w-9 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105 lg:w-11">
            <MiyabiSymbol className="h-auto w-full" />
          </span>
          <MiyabiWordmark className="h-auto w-[3.9rem] lg:w-[4.4rem]" />
        </TLink>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-[clamp(1.5rem,2.3vw,3rem)]">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.id}>
                  <TLink href={item.href} aria-current={active ? "page" : undefined} className="relative flex min-h-11 items-center">
                    <span className="roll text-[0.8125rem] font-medium tracking-[0.01em]">
                      <span>{item.short}</span>
                      <span aria-hidden>{item.short}</span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-px left-1/2 size-1 -translate-x-1/2 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-expo)]",
                        active ? "scale-100" : "scale-0",
                      )}
                    />
                  </TLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={trigger}
          type="button"
          onClick={() => toggle(!openRef.current)}
          aria-expanded={open}
          aria-controls="menu-plein-ecran"
          className="label flex min-h-11 min-w-11 items-center justify-end gap-3 xl:hidden"
        >
          <span>{open ? "Fermer" : "Menu"}</span>
          <span className="relative block h-2.5 w-6" aria-hidden>
            <span className={cn("absolute right-0 top-0 h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-expo)]", open && "translate-y-[5px] rotate-45")} />
            <span className={cn("absolute bottom-0 right-0 h-px bg-current transition-all duration-500 ease-[var(--ease-expo)]", open ? "w-6 -translate-y-[4px] -rotate-45" : "w-4")} />
          </span>
        </button>
      </header>
      <MobileMenu open={open} onClose={closeAndRefocus} />
      <MobileBar hiddenByMenu={open} />
    </>
  );
}
