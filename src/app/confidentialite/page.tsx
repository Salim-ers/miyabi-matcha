import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/confidentialite" },
};

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="novembre 2026">
      <section>
        <h2>En résumé</h2>
        <p>
          Ce site est une vitrine. Il ne comporte ni formulaire, ni compte client, ni outil de mesure d&apos;audience, ni publicité. Aucune
          donnée personnelle n&apos;est collectée par {site.name} via ce site.
        </p>
      </section>
      <section>
        <h2>Stockage local</h2>
        <p>
          Deux préférences techniques peuvent être enregistrées dans votre navigateur, sans être transmises à quiconque : le fait que
          l&apos;introduction animée a déjà été vue pendant la session (stockage de session), et votre accord pour l&apos;affichage de la
          carte Google Maps (stockage local). Vous pouvez les effacer à tout moment depuis les réglages de votre navigateur ou via le bouton
          « Masquer la carte ».
        </p>
      </section>
      <section>
        <h2>Google Maps</h2>
        <p>
          La carte interactive de la page « Nous Trouver » est fournie par Google. Elle n&apos;est chargée qu&apos;après votre accord
          explicite. Une fois affichée, Google peut collecter des données et déposer des cookies conformément à sa propre{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            politique de confidentialité
          </a>
          . Les liens « Itinéraire » ouvrent Google Maps dans un nouvel onglet.
        </p>
      </section>
      <section>
        <h2>Liens externes</h2>
        <p>
          Le lien vers Instagram ouvre un service tiers soumis à sa propre politique de confidentialité ({" "}
          <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          ).
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., qui peut traiter des données techniques de connexion (adresse IP, journaux) nécessaires à la
          sécurité et au bon fonctionnement du service.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question : <mark>adresse e-mail à compléter</mark> — {site.address.street}, {site.address.postalCode} {site.address.city}.
        </p>
      </section>
    </LegalPage>
  );
}
