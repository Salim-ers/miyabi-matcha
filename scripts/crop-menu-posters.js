/**
 * Recadre les affiches produits pour la carte : retire le logo du haut et le texte incrusté du bas
 * (nom, japonais, prix), que le site affiche déjà en vrai texte. Aucun redimensionnement ni retouche.
 *
 * Usage : node scripts/crop-menu-posters.js <dossier des affiches>
 * Pour une nouvelle affiche : ajouter une ligne ci-dessous, puis lancer `npm run images:manifest`.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

sharp.cache(false);

const RATIO = 0.9;
const OUT = path.resolve(__dirname, "../public/images/menu");

/** poster : fichier source · y0, y1 : sous le logo, au-dessus du texte · cx : centre du produit (en pixels, sur 1122 × 1402). */
const CROPS = [
  { out: "matcha-latte", poster: "16.png", y0: 245, y1: 1100, cx: 565 },
  { out: "strawberry-matcha-cream", poster: "17.png", y0: 245, y1: 1036, cx: 562 },
  { out: "matcha-yuzu-sparkling", poster: "20.png", y0: 245, y1: 1058, cx: 555 },
  { out: "hojicha-black-sesame-cream", poster: "21.png", y0: 245, y1: 1058, cx: 572 },
  { out: "matcha-coconut-cloud", poster: "19.png", y0: 245, y1: 1042, cx: 555 },
  { out: "jasmine-matcha-mochi", poster: "18.png", y0: 245, y1: 1082, cx: 552 },
  { out: "crepe-classic", poster: "12.png", y0: 292, y1: 1052, cx: 550 },
  { out: "crepe-creme-brulee", poster: "13.png", y0: 292, y1: 1052, cx: 540 },
  { out: "crepe-strawberry", poster: "14.png", y0: 180, y1: 1058, cx: 555 },
  { out: "crepe-lotus-speculoos", poster: "15.png", y0: 290, y1: 1050, cx: 568 },
  { out: "white-vienna", poster: "6.png", y0: 290, y1: 1108, cx: 555 },
  { out: "black-sesame-vienna", poster: "5.png", y0: 245, y1: 1066, cx: 562 },
];

(async () => {
  const dir = process.argv[2];
  if (!dir) throw new Error("Indiquer le dossier des affiches.");
  fs.mkdirSync(OUT, { recursive: true });
  for (const c of CROPS) {
    const input = fs.readFileSync(path.join(dir, c.poster));
    const { width: W, height: H } = await sharp(input).metadata();
    const h = c.y1 - c.y0;
    const w = Math.min(W, Math.round(h * RATIO));
    const left = Math.max(0, Math.min(W - w, Math.round(c.cx - w / 2)));
    await sharp(input)
      .extract({ left, top: c.y0, width: w, height: Math.min(h, H - c.y0) })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(path.join(OUT, `${c.out}.jpg`));
    console.log(c.out, `${w}x${h}`);
  }
})();
