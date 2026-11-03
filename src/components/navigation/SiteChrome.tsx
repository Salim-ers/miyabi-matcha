"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MiyabiSymbol } from "@/components/logo/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { ArrowUpRight, MenuBookIcon, RouteIcon } from "@/components/ui/Icons";
import { navigation, site } from "@/data/site";
import { cn, pad2 } from "@/lib/utils/cn";
import { FullscreenMenu } from "./FullscreenMenu";
import { useSectionObserver } from "./useSectionObserver";

/** Interface de navigation : rail vertical (desktop), en-tête + barre d'actions (mobile / tablette), menu plein écran. */
export function SiteChrome() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useSectionObserver(pathname);
  const [open, setOpen] = useState(false);
  const { lock, unlock } = useSmoothScroll();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openRef = useRef(false);
  const toggle = useCallback(
    (next?: boolean, trigger?: HTMLButtonElement | null) => {
      const value = next ?? !openRef.current;
      if (value === openRef.current) return;
      openRef.current = value;
      if (value) {
        if (trigger) triggerRef.current = trigger;
        lock();
      } else {
        unlock();
      }
      document.documentElement.dataset.menu = value ? "open" : "";
      setOpen(value);
    },
    [lock, unlock],
  );

  useEffect(() => {
    toggle(false);
  }, [pathname, toggle]);

  const menuHref = isHome ? "#carte" : "/carte";

  return (
    <>
      <a
        href="#contenu"
        className="label fixed left-4 top-4 z-[300] -translate-y-24 bg-ivory px-4 py-3 text-ink transition-transform focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <SideRail active={isHome ? active : ""} open={open} onToggle={(el) => toggle(undefined, el)} />
      <DesktopActions menuHref={menuHref} />
      <MobileHeader open={open} onToggle={(el) => toggle(undefined, el)} />
      <MobileActionBar menuHref={menuHref} />
      <FullscreenMenu
        open={open}
        active={isHome ? active : ""}
        onClose={() => {
          toggle(false);
          triggerRef.current?.focus({ preventScroll: true });
        }}
      />
    </>
  );
}

/* ───────────────────────── Rail vertical (desktop) ───────────────────────── */

function SideRail({ active, open, onToggle }: { active: string; open: boolean; onToggle: (el: HTMLButtonElement) => void }) {
  const progressRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const current = navigation.find((n) => n.id === active);

  return (
    <header
      className={cn(
        "fixed inset-y-0 left-0 z-[110] hidden w-[var(--rail)] flex-col items-center justify-between py-7 text-[var(--chrome-fg)] transition-[background-color,color] duration-700 lg:flex",
        open ? "bg-ink text-ivory" : "bg-[var(--chrome-bg)]",
      )}
    >
      <span aria-hidden className="absolute inset-y-0 right-0 w-px bg-[var(--chrome-line)]" />
      <span
        ref={progressRef}
        aria-hidden
        className="absolute right-0 top-0 h-full w-px origin-top scale-y-0 bg-[var(--chrome-accent)]"
      />

      <Link href="/#accueil" className="group flex flex-col items-center gap-2" aria-label="MIYABI MATCHA — accueil">
        <MiyabiSymbol className="w-11 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110" />
      </Link>

      <nav aria-label="Sections" className="flex flex-col items-center gap-6">
        <span
          aria-hidden
          className="label mb-4 h-36 overflow-hidden text-[0.625rem] text-[var(--chrome-muted)] [writing-mode:vertical-rl]"
        >
          <span key={current?.id ?? "none"} className="inline-block animate-[railIn_.8s_var(--ease-expo)]">
            {current?.label ?? "MIYABI MATCHA"}
          </span>
        </span>
        <ul className="flex flex-col items-center gap-1">
          {navigation.map((item, i) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex h-8 w-12 items-center justify-center"
                >
                  <span
                    className={cn(
                      "h-px transition-all duration-500 ease-[var(--ease-expo)]",
                      isActive ? "w-7 bg-[var(--chrome-accent)]" : "w-3 bg-[var(--chrome-muted)] group-hover:w-5",
                    )}
                  />
                  <span className="pointer-events-none absolute left-[calc(100%+0.9rem)] top-1/2 flex -translate-x-2 -translate-y-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-ink/90 px-4 py-2 text-ivory opacity-0 shadow-lg backdrop-blur transition-all duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                    <span className="label text-[0.6rem] text-gold">{pad2(i + 1)}</span>
                    <span className="font-display text-lg leading-none">{item.label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={(e) => onToggle(e.currentTarget)}
        aria-expanded={open}
        aria-controls="menu-plein-ecran"
        className="group flex min-h-11 flex-col items-center gap-3 px-3"
      >
        <span className="relative block h-3 w-6" aria-hidden>
          <span
            className={cn(
              "absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-expo)]",
              open && "translate-y-1.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ease-[var(--ease-expo)]",
              open ? "w-6 -translate-y-1.5 -rotate-45" : "w-4 group-hover:w-6",
            )}
          />
        </span>
        <span className="label text-[0.6rem] [writing-mode:vertical-rl]">{open ? "Fermer" : "Menu"}</span>
      </button>
    </header>
  );
}

/* ───────────────────────── Actions desktop (haut droite) ───────────────────────── */

function DesktopActions({ menuHref }: { menuHref: string }) {
  return (
    <div className="fixed right-[clamp(1.25rem,2.4vw,2.75rem)] top-6 z-[107] hidden items-center gap-3 lg:flex">
      <Magnetic>
        <a
          href={site.maps.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="label flex h-11 items-center gap-2 rounded-full border border-[var(--chrome-line)] px-5 text-[0.65rem] text-[var(--chrome-fg)] backdrop-blur-md transition-colors duration-500 hover:border-[var(--chrome-fg)]"
        >
          Itinéraire <ArrowUpRight className="size-3.5" />
          <span className="sr-only">(Google Maps, nouvel onglet)</span>
        </a>
      </Magnetic>
      <Magnetic>
        <Link
          href={menuHref}
          className="label flex h-11 items-center rounded-full bg-[var(--chrome-fg)] px-5 text-[0.65rem] text-[var(--chrome-bg)] transition-colors duration-500"
        >
          La carte
        </Link>
      </Magnetic>
    </div>
  );
}

/* ───────────────────────── En-tête mobile / tablette ───────────────────────── */

function MobileHeader({ open, onToggle }: { open: boolean; onToggle: (el: HTMLButtonElement) => void }) {
  const [state, setState] = useState<{ solid: boolean; hidden: boolean }>({ solid: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last;
      setState((s) => {
        const solid = y > 24;
        const hidden = y > 240 && delta > 4 ? true : delta < -4 || y < 240 ? false : s.hidden;
        return solid === s.solid && hidden === s.hidden ? s : { solid, hidden };
      });
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.header = state.hidden && !open ? "hidden" : "";
  }, [state.hidden, open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[110] flex h-[calc(var(--header-h)+env(safe-area-inset-top))] items-center justify-between px-4 pt-[env(safe-area-inset-top)] text-[var(--chrome-fg)] transition-all duration-500 ease-[var(--ease-expo)] lg:hidden",
        state.solid && !open && "bg-[color-mix(in_oklab,var(--chrome-bg)_86%,transparent)] backdrop-blur-xl",
        state.hidden && !open && "-translate-y-full",
        open && "text-ivory",
      )}
    >
      <Link href="/#accueil" className="flex min-h-11 items-center gap-3" aria-label="MIYABI MATCHA — accueil">
        <MiyabiSymbol className="w-9" />
        <span className="label text-[0.6rem] leading-tight tracking-[0.36em]">
          Miyabi
          <br />
          <span className="text-[var(--chrome-muted)]">Matcha</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={(e) => onToggle(e.currentTarget)}
        aria-expanded={open}
        aria-controls="menu-plein-ecran"
        className="label flex min-h-11 min-w-11 items-center gap-3 px-1 text-[0.65rem]"
      >
        {open ? "Fermer" : "Menu"}
        <span className="relative block h-2.5 w-6" aria-hidden>
          <span className={cn("absolute right-0 top-0 h-px w-6 bg-current transition-transform duration-500", open && "translate-y-[5px] rotate-45")} />
          <span className={cn("absolute bottom-0 right-0 h-px bg-current transition-all duration-500", open ? "w-6 -translate-y-[4px] -rotate-45" : "w-4")} />
        </span>
      </button>
    </header>
  );
}

/* ───────────────────────── Barre d'actions fixe (mobile / tablette) ───────────────────────── */

function MobileActionBar({ menuHref }: { menuHref: string }) {
  const item =
    "flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-[14px] transition-[background-color,transform] duration-200 active:scale-[0.97] active:bg-ivory/10";
  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <div className="mx-auto flex max-w-xl items-stretch gap-1 rounded-[20px] border border-ivory/10 bg-ink/92 p-1.5 text-ivory shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className={item}>
          <RouteIcon className="size-[1.15rem] text-gold" />
          <span className="label text-[0.7rem] tracking-[0.22em]">Itinéraire</span>
          <span className="sr-only">(Google Maps, nouvel onglet)</span>
        </a>
        <span aria-hidden className="my-3 w-px bg-ivory/12" />
        <Link href={menuHref} className={item}>
          <MenuBookIcon className="size-[1.15rem] text-gold" />
          <span className="label text-[0.7rem] tracking-[0.22em]">La carte</span>
        </Link>
      </div>
    </nav>
  );
}
