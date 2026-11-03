import type { ReactNode } from "react";

/** Gabarit sobre des pages légales (surface ivoire). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article data-surface="light" className="min-h-[100svh] bg-ivory text-ink">
      <div className="container-x mx-auto max-w-3xl pb-28 pt-36 lg:pt-32">
        <p className="label text-[0.6rem] text-matcha-deep">Informations</p>
        <h1 className="mt-5 font-display text-[clamp(2.8rem,9vw,5.5rem)] font-light leading-[0.95] tracking-[-0.025em]">{title}</h1>
        <p className="label mt-6 text-[0.55rem] text-ink/45">Mise à jour : {updated}</p>
        <div className="mt-14 space-y-10 text-[0.98rem] leading-relaxed text-ink/75 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-[1.9rem] [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_mark]:bg-gold/40 [&_mark]:px-1 [&_mark]:text-ink">
          {children}
        </div>
      </div>
    </article>
  );
}
