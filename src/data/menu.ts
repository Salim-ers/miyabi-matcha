import { photos, type ArtPhoto } from "./photos";

/**
 * La carte MIYABI MATCHA.
 *
 * Source : carte Uber Eats fournie (catégories, noms et noms japonais repris à l'identique).
 * `description` reprend le texte visible sur la carte source. `short` en est un raccourci d'une ligne,
 * composé uniquement de mots déjà présents dans cette description : rien n'est ajouté.
 *
 * Sources complémentaires : carte de la boutique (prix et produits) et affiches officielles (photos, noms japonais).
 * Images : 5 produits sans prise de vue ont une image générée par IA (public/images/menu/ia), à remplacer par de vraies photos.
 * Prix : champ `price` (en euros, ex. 6.5), repris de la carte de la boutique, et non d'Uber Eats, dont les tarifs diffèrent.
 * Il s'affiche automatiquement dès qu'il est renseigné. Aucun prix n'est deviné.
 *
 * Pour mettre à jour la carte : modifier ou ajouter des entrées ci-dessous.
 * Aucune modification de composant n'est nécessaire.
 */

export type MenuCategory = {
  id: string;
  /** Intitulé complet (titre et référencement). */
  label: string;
  /** Intitulé court (navigation par catégories). */
  short: string;
  /** Intitulé le plus court, pour les petits écrans. */
  tab?: string;
  /** Intitulé japonais tel qu'il figure sur la carte officielle. */
  labelJa?: string;
  order: number;
};

export type MenuProduct = {
  id: string;
  name: string;
  /** Nom japonais tel qu'il figure sur la carte officielle. */
  nameJa?: string;
  category: string;
  description?: string;
  /** Une seule ligne, issue de `description`. */
  short?: string;
  /** Photo du produit, obligatoire : un produit sans photo ne figure pas sur la carte. */
  photo: ArtPhoto;
  /** Prix en euros, tel qu'affiché en boutique. Laisser vide tant qu'il n'est pas confirmé. */
  price?: number;
  available?: boolean;
  order?: number;
};

export const menuCategories: MenuCategory[] = [
  { id: "matcha", label: "Matcha", short: "Matcha", labelJa: "宇治・福岡産の高級抹茶", order: 1 },
  { id: "crepes", label: "Crêpes japonaises au matcha", short: "Crêpes japonaises", tab: "Crêpes", labelJa: "抹茶の和風クレープ", order: 2 },
  { id: "cafe", label: "Café", short: "Café", labelJa: "コーヒー", order: 3 },
  { id: "boba", label: "Boba", short: "Boba", order: 4 },
  { id: "fruity-tea", label: "Fruity Tea", short: "Fruity Tea", labelJa: "フルーティーティー", order: 5 },
];

export const menuProducts: MenuProduct[] = [
  // MATCHA
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    nameJa: "抹茶ラテ",
    category: "matcha",
    description: "Préparé avec un matcha Cérémonie d'exception, soigneusement fouetté.",
    short: "Matcha Cérémonie d'exception, soigneusement fouetté.",
    photo: photos.matchaLatte,
    price: 5.95,
    order: 1,
  },
  {
    id: "strawberry-matcha-cream",
    name: "Strawberry Matcha Cream",
    nameJa: "苺抹茶クリーム",
    category: "matcha",
    description:
      "Un mélange délicat de matcha japonais et de purée de fraise, surmonté d'une crème légère et veloutée.",
    short: "Matcha japonais, purée de fraise, crème légère.",
    photo: photos.strawberryCream,
    price: 6.5,
    order: 2,
  },
  {
    id: "matcha-yuzu-sparkling",
    name: "Matcha Yuzu Sparkling",
    nameJa: "抹茶柚子スパークリング",
    category: "matcha",
    description: "Un mélange pétillant de matcha japonais d'exception et de yuzu frais.",
    short: "Matcha japonais et yuzu frais, pétillant.",
    photo: photos.yuzu,
    price: 5.95,
    order: 3,
  },
  {
    id: "hojicha-soy-cream",
    name: "Hojicha Soy Cream",
    nameJa: "ほうじ茶ソイクリーム",
    category: "matcha",
    description:
      "Un mélange délicat de hojicha japonais, infusé et mélangé à du lait de soja velouté, surmonté d'une crème légère.",
    short: "Hojicha japonais, lait de soja, crème légère.",
    photo: photos.iaHojichaSoy,
    price: 5.95,
    order: 4,
  },
  {
    id: "matcha-coconut-cloud",
    name: "Matcha Coconut Cloud",
    nameJa: "抹茶ココナッツ雲",
    category: "matcha",
    description:
      "Un latte aérien : matcha japonais d'exception et lait de coco onctueux, surmonté d'une mousse légère.",
    short: "Matcha japonais, lait de coco, mousse légère.",
    photo: photos.coconut,
    price: 5.95,
    order: 5,
  },
  {
    id: "jasmine-matcha-mochi",
    name: "Jasmine Matcha Mochi",
    nameJa: "ジャスミン抹茶餅",
    category: "matcha",
    description:
      "Un latte unique combinant le matcha japonais d'exception et la délicatesse du thé jasmin, accompagné de mochi moelleux.",
    short: "Matcha japonais, thé jasmin, mochi moelleux.",
    photo: photos.jasmine,
    price: 6.5,
    order: 7,
  },


  // CRÊPES JAPONAISES AU MATCHA
  {
    id: "crepe-classic",
    name: "Crêpe Matcha Japonais Classic",
    nameJa: "クラシッククレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère.",
    short: "Crêpe fine au matcha japonais, crème légère.",
    photo: photos.crepeClassic,
    price: 8,
    order: 1,
  },
  {
    id: "crepe-forest-fruit",
    name: "Crêpe Matcha Japonais Forest Fruit",
    nameJa: "森のフルーツ抹茶和風クレープ",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de fruits rouges.",
    short: "Crêpe fine au matcha, crème légère, fruits rouges.",
    photo: photos.crepeForest,
    price: 9,
    order: 2,
  },
  {
    id: "crepe-strawberry",
    name: "Crêpe Matcha Japonais Strawberry",
    nameJa: "クレープ・ストロベリー＆クリーム",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de fraises fraîches.",
    short: "Crêpe fine au matcha, crème légère, fraises fraîches.",
    photo: photos.crepeStrawberry,
    price: 9,
    order: 3,
  },
  {
    id: "crepe-creme-brulee",
    name: "Crêpe Crème Brûlée",
    nameJa: "クレープ・クレームブリュレ",
    category: "crepes",
    description: "Une crème riche et veloutée, surmontée d'une fine couche de caramel croquant.",
    short: "Crème veloutée, fine couche de caramel croquant.",
    photo: photos.crepeBrulee,
    price: 9,
    order: 4,
  },
  {
    id: "crepe-lotus-speculoos",
    name: "Crêpe Matcha Japonais Lotus Speculoos",
    nameJa: "クレープ・スペキュロス",
    category: "crepes",
    description:
      "Une crêpe fine et moelleuse, préparée avec du matcha japonais d'exception et garnie de crème légère et de biscuits Lotus.",
    short: "Crêpe fine au matcha, crème légère, biscuits Lotus.",
    photo: photos.crepeLotus,
    price: 9,
    order: 5,
  },

  // CAFÉ
  {
    id: "white-vienna",
    name: "White Vienna",
    nameJa: "ホワイトウィンナー",
    category: "cafe",
    description:
      "Inspiré des cafés de Kyoto : un espresso doux issu de grains japonais, marié à une crème blanche.",
    short: "Espresso doux de grains japonais, crème blanche.",
    photo: photos.whiteVienna,
    price: 5.95,
    order: 1,
  },
  {
    id: "black-sesame-vienna",
    name: "Black Sesame Vienna",
    nameJa: "黒ごまウィンナーコーヒー",
    category: "cafe",
    description:
      "Une création signée Miyabi Matcha : espresso japonais onctueux, relevé par la richesse du sésame noir.",
    short: "Espresso japonais, richesse du sésame noir.",
    photo: photos.blackSesameVienna,
    price: 6.5,
    order: 2,
  },
  {
    id: "camelot-caramel-latte",
    name: "Camelot Caramel Latte",
    nameJa: "キャメロットキャラメルラテ",
    category: "cafe",
    description: "Entre la noblesse du caramel doré et la profondeur du café japonais.",
    short: "Caramel doré et profondeur du café japonais.",
    photo: photos.camelot,
    price: 5.95,
    order: 3,
  },
  {
    id: "latte",
    name: "Latte",
    nameJa: "ラテ",
    category: "cafe",
    description: "Une boisson à base d'espresso, douce et crémeuse.",
    short: "À base d'espresso, douce et crémeuse.",
    photo: photos.latte,
    price: 4.8,
    order: 4,
  },
  {
    id: "americano",
    name: "Americano",
    nameJa: "アメリカーノ",
    category: "cafe",
    description: "Un Americano classique : espresso allongé d'eau chaude.",
    short: "Espresso allongé d'eau chaude.",
    photo: photos.americano,
    price: 3,
    order: 5,
  },

  // BOBA
  {
    id: "thai-milk-tea",
    name: "Thai Milk Tea",
    nameJa: "タイミルクティー",
    category: "boba",
    description: "Un classique thaï, doux et crémeux : thé noir corsé et lait.",
    short: "Thé noir corsé et lait, doux et crémeux.",
    photo: photos.thai,
    price: 6.5,
    order: 1,
  },
  {
    id: "brown-sugar-milk-tea",
    name: "Brown Sugar Milk Tea",
    nameJa: "黒糖ミルクティー",
    category: "boba",
    description: "Thé au lait doux et crémeux, au sucre brun caramélisé.",
    short: "Thé au lait, sucre brun caramélisé.",
    photo: photos.iaMilkTea,
    price: 6.5,
    order: 3,
  },
  {
    id: "black-sesame-mochi-cream",
    name: "Black Sesame Mochi Cream",
    nameJa: "黒ごまもちクリーム",
    category: "boba",
    description: "Mochi moelleux et crème riche au sésame noir.",
    short: "Mochi moelleux, crème au sésame noir.",
    photo: photos.iaSesameMochi,
    price: 6.95,
    order: 4,
  },

  // Sur la carte de la boutique
  {
    id: "matcha-tornado",
    name: "Matcha Tornado",
    category: "boba",
    photo: photos.tornadoCard,
    price: 6.5,
    order: 2,
  },


  // FRUITY TEA
  {
    id: "various-berry-black-tea",
    name: "Various Berry Black Tea",
    nameJa: "ベリーミックス紅茶",
    category: "fruity-tea",
    description: "Un thé noir délicat, infusé avec un mélange de baies rouges fraîches et acidulées.",
    short: "Thé noir délicat, baies rouges fraîches.",
    photo: photos.iaBerry,
    price: 5.5,
    order: 1,
  },
  {
    id: "passionfruit-sparkling",
    name: "Passionfruit Sparkling",
    nameJa: "パッションフルーツスパークリング",
    category: "fruity-tea",
    description: "Un mélange pétillant de jus de fruit de la passion frais et d'eau gazeuse.",
    short: "Jus de fruit de la passion frais, eau gazeuse.",
    photo: photos.iaPassion,
    price: 5.5,
    order: 2,
  },
];

/** Suppléments, tels qu'ils figurent sur la carte de la boutique. */
export const menuExtras = [
  { label: "Extra Shot", price: "+ 1 €" },
  { label: "Extra Matcha Shot", price: "+ 1 €" },
  { label: "Lait de coco, de soja ou d'avoine", price: "+ 0,50 €" },
];

const priceFormat = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
export const formatPrice = (price: number) => priceFormat.format(price);

/** Catégories triées, avec leurs produits disponibles triés. Les catégories vides sont masquées. */
export function getMenu() {
  return [...menuCategories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      ...category,
      products: menuProducts
        .filter((p) => p.category === category.id && p.available !== false)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    }))
    .filter((c) => c.products.length > 0);
}

export type MenuSection = ReturnType<typeof getMenu>[number];
