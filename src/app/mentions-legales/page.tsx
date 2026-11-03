import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: true, follow: true },
};

/**
 * Les champs surlignés sont à compléter avec les informations officielles de l'entreprise
 * (aucune donnée n'a été inventée).
 */
export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="novembre 2026">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          {site.name}
          <br />
          {site.address.street}, {site.address.postalCode} {site.address.city}
          <br />
          Raison sociale et forme juridique : <mark>à compléter</mark>
          <br />
          Capital social : <mark>à compléter</mark>
          <br />
          RCS / SIRET : <mark>à compléter</mark>
          <br />
          N° de TVA intracommunautaire : <mark>à compléter</mark>
          <br />
          Directeur·rice de la publication : <mark>à compléter</mark>
          <br />
          Contact : <mark>adresse e-mail à compléter</mark>
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>
          Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis —{" "}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Le nom {site.name}, le logo 雅, les photographies et l&apos;ensemble des contenus de ce site sont la propriété de {site.name} ou
          utilisés avec autorisation. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.
        </p>
      </section>
      <section>
        <h2>Informations sur les produits</h2>
        <p>
          La carte présentée sur ce site est indicative. Les produits, leur composition et leur disponibilité peuvent évoluer. Les tarifs en
          vigueur sont affichés en boutique.
        </p>
      </section>
    </LegalPage>
  );
}
