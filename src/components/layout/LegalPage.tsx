import type { ReactNode } from "react";

/** Gabarit sobre des pages légales. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article data-surface="light" className="min-h-[100svh] bg-ivory text-ink">
      <div className="container-x mx-auto max-w-3xl pb-24 pt-[calc(var(--header-h)+3rem)]">
        <p className="label text-smoke">Informations</p>
        <h1 className="display mt-5 text-[clamp(2.8rem,8vw,5.5rem)]">{title}</h1>
        <p className="label mt-6 text-smoke">Mise à jour : {updated}</p>
        <div className="mt-12 space-y-10 text-[0.98rem] leading-relaxed text-ink/80 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-[1.7rem] [&_h2]:leading-tight [&_h2]:text-ink [&_mark]:bg-sage/50 [&_mark]:px-1 [&_mark]:text-ink">
          {children}
        </div>
      </div>
    </article>
  );
}
