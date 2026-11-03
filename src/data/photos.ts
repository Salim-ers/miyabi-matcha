/**
 * Registre photographique de MIYABI MATCHA.
 * Règle du site : chaque photographie n'apparaît qu'une seule fois, toutes pages confondues.
 * Exception validée : Crêpe Forest Fruit, Camelot, Americano et Matcha Tornado figurent aussi sur la carte.
 * Chaque entrée : fichier réel, description, point focal (object-position).
 * L'audit complet (dimensions, sujet, usages, limites) est dans docs/AUDIT-PHOTOS.md.
 *
 * `focus`  : point focal par défaut (grands écrans)
 * `focusM` : point focal sur mobile quand le recadrage diffère
 */

export type ArtPhoto = {
  src: string;
  alt: string;
  focus?: string;
  focusM?: string;
};

export const photos = {
  /* — Série studio : fond noir, table d'acier, néon vert. Cadrages identiques, produit centré. — */
  tornado: {
    src: "/images/hero/matcha-tornado-hero.jpg",
    alt: "Matcha Tornado MIYABI : matcha glacé tourbillonnant sous une crème légère, dans un gobelet au logo 雅",
    focus: "50% 50%",
  },
  crepeForest: {
    src: "/images/products/crepe-forest-fruit.jpg",
    alt: "Crêpe japonaise au matcha Forest Fruit, garnie de framboises, myrtilles et groseilles, dans son support blanc",
    focus: "50% 50%",
  },
  camelot: {
    src: "/images/products/camelot-caramel-latte.jpg",
    alt: "Camelot Caramel Latte MIYABI : un morceau de biscuit caramélisé déposé à la pince au-dessus du gobelet",
    focus: "50% 50%",
  },
  thai: {
    src: "/images/products/thai-milk-tea-iced-smoothie.jpg",
    alt: "Thai Milk Tea Iced Smoothie MIYABI, crème et perles de tapioca, dans un gobelet au logo 雅",
    focus: "50% 55%",
  },
  latte: {
    src: "/images/products/latte.jpg",
    alt: "Latte glacé MIYABI, espresso et lait en deux couches, dans un gobelet au logo 雅",
    focus: "50% 50%",
  },
  americano: {
    src: "/images/products/americano.jpg",
    alt: "Americano glacé MIYABI, glaçons dans un café ambré, gobelet au logo 雅",
    focus: "50% 50%",
  },

  /* — Carte : prises de vue recadrées depuis les affiches officielles (scripts/crop-menu-posters.js) — */
  matchaLatte: { src: "/images/menu/matcha-latte.jpg", alt: "Matcha Latte MIYABI, vert tendre, gobelet au logo 雅" },
  strawberryCream: { src: "/images/menu/strawberry-matcha-cream.jpg", alt: "Strawberry Matcha Cream MIYABI : matcha, lait et fraise en trois couches" },
  yuzu: { src: "/images/menu/matcha-yuzu-sparkling.jpg", alt: "Matcha Yuzu Sparkling MIYABI, matcha et yuzu dans un gobelet au logo 雅" },
  coconut: { src: "/images/menu/matcha-coconut-cloud.jpg", alt: "Matcha Coconut Cloud MIYABI, matcha sur une base blanche" },
  jasmine: { src: "/images/menu/jasmine-matcha-mochi.jpg", alt: "Jasmine Matcha Mochi MIYABI, matcha sur une base claire" },
  crepeClassic: { src: "/images/menu/crepe-classic.jpg", alt: "Crêpe Classic au matcha, disque de crème marqué MIYABI MATCHA" },
  crepeBrulee: { src: "/images/menu/crepe-creme-brulee.jpg", alt: "Crêpe Crème Brûlée au matcha, surface caramélisée" },
  crepeStrawberry: { src: "/images/menu/crepe-strawberry.jpg", alt: "Crêpe Strawberry au matcha, fraises fraîches et crème" },
  crepeLotus: { src: "/images/menu/crepe-lotus-speculoos.jpg", alt: "Crêpe Lotus Speculoos au matcha, deux biscuits Lotus" },
  whiteVienna: { src: "/images/menu/white-vienna.jpg", alt: "White Vienna MIYABI, café sous une crème blanche" },
  blackSesameVienna: { src: "/images/menu/black-sesame-vienna.jpg", alt: "Black Sesame Vienna MIYABI, café sur une base mouchetée de sésame noir" },

  /* — Carte : images générées par IA (gpt-image-2) à partir des photos du site, pour les produits sans prise de vue.
       À remplacer par de vraies photos dès que possible : même nom de fichier, même cadrage. — */
  iaHojichaSoy: { src: "/images/menu/ia/hojicha-soy-cream.jpg", alt: "Illustration du Hojicha Soy Cream : hojicha sur lait de soja, crème légère" },
  iaMilkTea: { src: "/images/menu/ia/brown-sugar-milk-tea.jpg", alt: "Illustration du Brown Sugar Milk Tea : thé au lait et sucre brun caramélisé" },
  iaSesameMochi: { src: "/images/menu/ia/black-sesame-mochi-cream.jpg", alt: "Illustration du Black Sesame Mochi Cream : crème au sésame noir et mochi" },
  iaBerry: { src: "/images/menu/ia/various-berry-black-tea.jpg", alt: "Illustration du Various Berry Black Tea : thé noir glacé et baies rouges" },
  iaPassion: { src: "/images/menu/ia/passionfruit-sparkling.jpg", alt: "Illustration du Passionfruit Sparkling : fruit de la passion, bulles et glaçons" },

  /** Même prise de vue que le Hero, cadrée sur le gobelet pour la carte. */
  tornadoCard: { src: "/images/products/matcha-tornado.jpg", alt: "Matcha Tornado MIYABI : matcha glacé tourbillonnant sous une crème légère" },

  /* — Boissons en situation — */
  cupHand: {
    src: "/images/location/matcha-cup-hand.jpg",
    alt: "Boisson matcha MIYABI tenue en main, couche de matcha sur le lait",
    focus: "42% 62%",
  },
  splash: {
    src: "/images/location/strawberry-splash.jpg",
    alt: "Boisson matcha et fraise MIYABI dans une éclaboussure de matcha et de fruits rouges",
    focus: "50% 50%",
    focusM: "51% 55%",
  },
  pour: {
    src: "/images/preparation/matcha-pour-cup.jpg",
    alt: "Matcha versé depuis un bec verseur sur une boisson lactée à la fraise MIYABI",
    focus: "50% 50%",
  },
  tray: {
    // Recadré : le lettrage de la vitrine, vu à l'envers, détournait le regard des boissons.
    src: "/images/location/shop-window-tray-crop.jpg",
    alt: "Plateau de boissons MIYABI posé devant la vitrine de la boutique",
    focus: "53% 50%",
  },
  takeaway: {
    src: "/images/location/takeaway-hands.jpg",
    alt: "Plateau de boissons MIYABI à emporter, tenu à deux mains",
    focus: "48% 58%",
  },

  /* — Gestes et matières — */
  leaves: {
    src: "/images/preparation/leaves-hands.jpg",
    alt: "Mains effleurant de jeunes feuilles de thé vert",
    focus: "50% 45%",
  },
  field: {
    src: "/images/preparation/tea-field.jpg",
    alt: "Deux personnes de dos face à des rangées de théiers, sous un ciel clair",
    focus: "50% 62%",
  },
  powder: {
    src: "/images/preparation/powder-spoon.jpg",
    alt: "Cuillère de bambou chargée de matcha en poudre au-dessus d'un bol en verre",
    focus: "62% 62%",
  },
  water: {
    src: "/images/preparation/water-pour.jpg",
    alt: "Filet d'eau versé sur le matcha en poudre dans un bol en verre",
    focus: "50% 58%",
  },
  whisk: {
    src: "/images/preparation/chasen-whisk.jpg",
    alt: "Matcha fouetté au chasen, le fouet en bambou, dans un bol en verre",
    focus: "48% 50%",
  },
  whisked: {
    src: "/images/preparation/whisked-matcha.jpg",
    alt: "Matcha fraîchement fouetté, mousse fine et vert intense, dans un bol en verre",
    focus: "40% 52%",
  },
  crepeBatter: {
    src: "/images/preparation/crepe-batter.jpg",
    alt: "Pâte à crêpe au matcha étalée au rouleau de bois sur une plaque",
    focus: "55% 50%",
  },
  crepeLift: {
    src: "/images/preparation/crepe-lift.jpg",
    alt: "Crêpe au matcha soulevée à la spatule, texture fine et souple",
    focus: "50% 45%",
  },
  crepeSpread: {
    src: "/images/preparation/crepe-spread.jpg",
    alt: "Crêpe au matcha détachée à la spatule sur sa plaque",
    focus: "50% 55%",
  },
} satisfies Record<string, ArtPhoto>;

export type PhotoKey = keyof typeof photos;
