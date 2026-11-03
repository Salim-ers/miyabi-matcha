# MIYABI MATCHA — The Art of Matcha

Site vitrine de MIYABI MATCHA, 2 rue Joseph Sansboeuf, 75008 Paris.
Next.js 15 (App Router) · TypeScript strict · Tailwind CSS 4 · GSAP 3.13 + ScrollTrigger + SplitText · Lenis.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node 20.9 ou plus récent.

## Déployer sur Vercel

1. Pousser le dossier sur GitHub, puis l'importer dans Vercel (le framework est détecté automatiquement).
2. Définir la variable d'environnement `NEXT_PUBLIC_SITE_URL` avec l'URL finale (par exemple `https://miyabimatcha.fr`). Elle sert aux balises canoniques, à Open Graph, au sitemap et aux données structurées.

## Modifier le contenu (sans toucher aux composants)

| Quoi | Fichier |
| --- | --- |
| Adresse, Instagram, liens Google Maps, **horaires**, navigation, SEO | `src/data/site.ts` |
| **La carte** (catégories, produits, descriptions, photos) | `src/data/menu.ts` |
| Créations signature (section « Nos créations ») | `src/data/products.ts` |
| Textes éditoriaux (Hero, manifeste, L'art du matcha, Univers) | `src/data/content.ts` |

- **Horaires** : `hours` vaut `null` tant qu'ils ne sont pas validés (le site affiche alors un message neutre). Exemple : `hours: [{ days: "Lundi – Dimanche", hours: "12:00 – 20:00" }]`. Le site n'affiche jamais « ouvert actuellement ».
- **Prix** : volontairement absents. Le modèle `MenuProduct` n'a pas de champ prix.
- **Masquer un produit** : `available: false`.

## Ajouter ou remplacer une photo

1. Déposer le fichier dans `public/images/<dossier>/`.
2. Lancer `npm run images:manifest` (nécessite `sharp`, inclus en dépendance de développement). Le script régénère `src/data/images.ts` avec les dimensions réelles et le flou de chargement.
3. Référencer le chemin (`/images/...`) dans le fichier de données concerné.

Les images passent par `next/image`, qui sert de l'AVIF ou du WebP à la taille de l'écran, jusqu'à 3840 px de large. Next n'agrandit jamais une image au-delà de sa taille d'origine.

## Police japonaise

`src/fonts/shippori-mincho-500-subset.woff2` ne contient que les caractères utilisés (44 Ko), plus tous les kana. Si vous ajoutez des noms en kanji, relancez :

```bash
pip install fonttools brotli
python scripts/subset-jp-font.py ShipporiMincho-Medium.ttf
```

Les caractères absents s'affichent dans la police mincho du système.

## Points d'attention

- **Résolution des photos** : les fichiers fournis font au maximum 1536 px. Ils restent nets, mais ce ne sont pas des sources 4K. Pour un rendu natif sur écran 4K, remplacer les fichiers par des exports haute définition (mêmes noms), puis relancer `npm run images:manifest`.
- **Photos de produits** : les visuels « affiche » ont été recadrés pour retirer le texte incrusté (nom du produit et logo en haut). Les originaux ne sont pas modifiés.
- **Thai Milk Tea** : la photo « Thai Milk Tea Iced Smoothie » illustre l'article « Thai Milk Tea » de la carte. Retirer le champ `image` dans `menu.ts` si ce ne sont pas les mêmes boissons.
- **Descriptions de la carte** : elles reprennent le texte visible sur Uber Eats, coupé avant les passages tronqués. Les descriptions anglaises ont été traduites fidèlement. Les intitulés japonais sont ceux de votre carte, y compris 宇治・福岡産の高級抹茶 pour la catégorie Matcha.
- **Mentions légales** : les champs surlignés « à compléter » (raison sociale, SIRET, contact…) sont dans `src/app/mentions-legales/page.tsx` et `src/app/confidentialite/page.tsx`.
- **Google Maps** : l'iframe ne se charge qu'après un clic sur « Afficher la carte » (cookies tiers). Le choix est mémorisé sur l'appareil. Les liens « Itinéraire » fonctionnent sans consentement.

## Architecture

```
src/
  app/            layout (polices, SEO, JSON-LD), pages, sitemap, robots, icônes, image OG
  components/
    loader/       Preloader : 雅 tracé au pinceau, poudre de matcha, rideau d'encre
    navigation/   rail vertical (desktop), en-tête et barre d'actions (mobile), menu plein écran
    hero/         Hero en profondeur (symbole, photo, typographie)
    story/        Manifeste et « L'art du matcha » (séquence épinglée)
    products/     Showcase des créations (scène desktop, swipe mobile)
    universe/     Bandeau typographique et composition éditoriale
    menu/         La carte filtrable, aperçu photo au survol
    location/     Adresse, itinéraire, carte Google Maps avec consentement
    footer/       Symbole redessiné au défilement
    motion/       RevealText, RevealImage, Magnetic
    logo/         Tracés vectoriels du logo officiel et BrushSymbol
  data/           tout le contenu modifiable
  lib/            configuration GSAP, intro, utilitaires
public/images     photos optimisées · public/logos  logo SVG (symbole, logotype, complet)
```

## Accessibilité et mouvement

- `prefers-reduced-motion` : intro désactivée, défilement natif, récit « L'art du matcha » présenté en version verticale, animations remplacées par des états fixes.
- L'intro est jouée une seule fois par session. On peut la passer avec le bouton « Passer l'intro » ou la touche Échap.
- Navigation clavier : lien d'évitement, piège de focus et Échap dans le menu, flèches ← → dans le showcase.
- Lenis est désactivé sur les écrans tactiles, qui gardent leur défilement natif.
