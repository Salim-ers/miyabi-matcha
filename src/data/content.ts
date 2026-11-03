/**
 * Textes éditoriaux du site.
 * Ton : court, raffiné, évocateur — sans affirmation factuelle non vérifiée
 * (aucune provenance, certification ou date inventée).
 */

export const hero = {
  eyebrow: "Paris 8e — Maison de matcha",
  titleLines: ["The Art", "of Matcha."],
  image: "/images/hero/matcha-tornado-hero.jpg",
  imageAlt: "Matcha Tornado MIYABI : matcha glacé tourbillonnant sous une crème légère, dans un gobelet au logo 雅",
  ctaPrimary: { label: "Découvrir la carte", href: "/#carte" },
  ctaSecondary: { label: "Nous rendre visite", href: "/#visite" },
};

export const manifesto = {
  label: "Manifeste",
  text: "Chez MIYABI, le matcha se prépare comme un geste. Avec précision, avec patience — pour le seul plaisir d'un instant.",
  aside: "Matcha, café japonais, boba et crêpes au matcha. Une même exigence, de la feuille à la dégustation.",
};

export type StoryChapter = {
  id: string;
  index: string;
  title: string;
  quote: string;
  text: string;
  image: string;
  alt: string;
  detail?: { image: string; alt: string };
  /** Forme de transition par masque à l'entrée de la scène. */
  reveal: "circle" | "rise" | "diagonal" | "split" | "iris" | "wipe";
  focus?: string;
};

export const story = {
  label: "L'art du matcha",
  title: "De la feuille à la dégustation",
  chapters: [
    {
      id: "feuille",
      index: "01",
      title: "La feuille",
      quote: "Tout commence par la feuille.",
      text: "Tendre, vivante, d'un vert éclatant. Avant la tasse, il y a le thé — et le respect qu'on lui doit.",
      image: "/images/preparation/leaves-hands.jpg",
      alt: "Mains effleurant de jeunes feuilles de thé vert",
      detail: { image: "/images/preparation/tea-field.jpg", alt: "Rangées de théiers sous un ciel clair" },
      reveal: "rise",
    },
    {
      id: "poudre",
      index: "02",
      title: "La poudre",
      quote: "Le temps révèle les saveurs.",
      text: "Une poudre d'un vert profond, fine comme un souffle. Toute l'intensité de la feuille, concentrée.",
      image: "/images/preparation/powder-spoon.jpg",
      alt: "Cuillère de bambou chargée de matcha en poudre au-dessus d'un bol en verre",
      detail: { image: "/images/preparation/water-pour.jpg", alt: "Filet d'eau versé sur le matcha en poudre" },
      reveal: "circle",
    },
    {
      id: "geste",
      index: "03",
      title: "Le geste",
      quote: "Tout commence par un geste.",
      text: "Le fouet de bambou trace ses courbes. L'eau, la poudre et le rythme se rencontrent.",
      image: "/images/preparation/chasen-whisk.jpg",
      alt: "Matcha fouetté au chasen, le fouet en bambou, dans un bol en verre",
      reveal: "diagonal",
    },
    {
      id: "preparation",
      index: "04",
      title: "La préparation",
      quote: "La précision devient plaisir.",
      text: "Une mousse fine, une couleur intense. Chaque boisson est montée avec soin, au moment.",
      image: "/images/preparation/whisked-matcha.jpg",
      alt: "Matcha fraîchement fouetté, mousse fine et vert intense",
      detail: { image: "/images/preparation/matcha-pour-cup.jpg", alt: "Matcha versé sur une boisson lactée aux fraises" },
      reveal: "iris",
    },
    {
      id: "creation",
      index: "05",
      title: "La création",
      quote: "Une pâte, un seul mouvement.",
      text: "La crêpe au matcha s'étale, fine et souple, prête à recevoir crème légère et fruits.",
      image: "/images/preparation/crepe-batter.jpg",
      alt: "Pâte à crêpe au matcha étalée au rouleau sur une plaque",
      detail: { image: "/images/preparation/crepe-lift.jpg", alt: "Crêpe au matcha soulevée à la spatule" },
      reveal: "split",
    },
    {
      id: "degustation",
      index: "06",
      title: "La dégustation",
      quote: "Le dernier geste vous appartient.",
      text: "Un instant suspendu, une saveur juste. Le matcha se savoure — sur place ou à emporter.",
      image: "/images/location/matcha-cup-hand.jpg",
      alt: "Boisson matcha MIYABI tenue en main, couches de matcha et de lait",
      detail: { image: "/images/location/takeaway-hands.jpg", alt: "Plateau de boissons MIYABI à emporter" },
      reveal: "wipe",
    },
  ] satisfies StoryChapter[],
};

export const showcase = {
  label: "Nos créations",
  title: "Signatures",
  intro: "Des boissons et des crêpes pensées comme des objets précieux. À découvrir en boutique.",
};

export const universe = {
  label: "Notre univers",
  band: ["A moment of elegance.", "A taste of Japan."],
  title: "Une maison du matcha, au cœur de Paris.",
  intro:
    "À deux pas de Saint-Lazare, MIYABI réunit le matcha, le café japonais et les crêpes dans un même esprit : la précision au service du plaisir.",
  pillars: [
    { title: "L'identité", text: "Un nom, 雅, qui signifie l'élégance raffinée. Une ligne que l'on suit dans chaque détail." },
    { title: "Le geste", text: "Fouetter, verser, étaler. Des gestes simples, répétés avec justesse." },
    { title: "La création", text: "Des recettes originales, entre tradition japonaise et gourmandise parisienne." },
    { title: "La dégustation", text: "Le plaisir d'un moment pour soi, à savourer sur place ou à emporter." },
  ],
  images: {
    main: { src: "/images/location/shop-window-tray.jpg", alt: "Plateau de boissons MIYABI devant la vitrine de la boutique" },
    splash: { src: "/images/location/strawberry-splash.jpg", alt: "Boisson matcha et fraise MIYABI dans une éclaboussure de fruits rouges" },
    crepe: { src: "/images/preparation/crepe-spread.jpg", alt: "Pâte à crêpe au matcha étalée à la spatule" },
    detail: { src: "/images/preparation/whisked-matcha.jpg", alt: "Surface veloutée d'un matcha fouetté" },
  },
};

export const location = {
  label: "Nous trouver",
  title: "Venez nous rendre visite",
  hoursPending: "Horaires bientôt communiqués ici. Les dernières informations sont publiées sur Instagram.",
};
