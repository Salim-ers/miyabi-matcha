/**
 * Registre photographique de MIYABI MATCHA.
 * Chaque entrée : fichier réel, description, point focal (object-position).
 * L'audit complet (dimensions, sujet, usages, limites) est dans docs/AUDIT-PHOTOS.md.
 *
 * `focus`  : point focal par défaut (grands écrans)
 * `focusM` : point focal sur mobile quand le recadrage diffère
 * `bandM`  : gros plan volontaire pour un bandeau mobile
 */

export type ArtPhoto = {
  src: string;
  alt: string;
  focus?: string;
  focusM?: string;
  /** Point focal pour un bandeau très horizontal (mobile), quand le produit entier ne peut pas y tenir. */
  bandM?: string;
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
    // Bandeau mobile : gros plan sur le geste et le biscuit, pas un gobelet tronqué.
    bandM: "50% 12%",
  },
  thai: {
    src: "/images/products/thai-milk-tea-iced-smoothie.jpg",
    alt: "Thai Milk Tea Iced Smoothie MIYABI, crème et perles de tapioca, dans un gobelet au logo 雅",
    focus: "50% 55%",
  },
  brownSugar: {
    src: "/images/products/brown-sugar-coffee-iced-smoothie.jpg",
    alt: "Brown Sugar Coffee Iced Smoothie MIYABI, crème caramélisée et perles de tapioca",
    focus: "50% 50%",
    // Bandeau mobile : gros plan sur la crème caramélisée.
    bandM: "50% 6%",
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
