# Audit photographique

Inspection de chaque fichier de `public/images` : dimensions, cadrage, sujet, qualité, puis emplacement retenu.
Le registre utilisé par le code (fichier, description, point focal) est `src/data/photos.ts`.

## La règle : chaque photo une seule fois

Aucune photographie n'apparaît deux fois sur le site, toutes pages et tous onglets confondus. Avant d'utiliser une photo, vérifier dans le tableau ci-dessous qu'elle est libre.

Le projet compte 21 photographies distinctes, et toutes sont utilisées. Cela impose trois arbitrages, à revoir dès que de nouvelles photos arrivent :

- **Matcha Tornado** n'a qu'une seule prise de vue : elle est sur l'accueil, donc pas sur `/creations`.
- **Crêpe Forest Fruit, Camelot Caramel Latte, Americano et Strawberry Matcha** sont photographiés sur `/creations`. Sur `/carte`, ils affichent une fiche de papier avec un lien « Voir la photo ».
- **La porte « La Boutique »** de l'accueil est typographique : aucune photo de la boutique n'est disponible.

## Constats qui ont guidé la direction artistique

- **Le studio noir est un atout.** Les photos de produits partagent le même décor : fond noir, néon vert, table d'acier ronde, produit centré. C'est ce qui permet l'alcôve noire du Hero et la galerie de `/creations`.
- **Les fichiers sont petits.** Aucun ne dépasse 1 672 px, et les photos de produits ne font que 774 à 864 px de large. Elles ne sont jamais utilisées en plein écran large : seule `strawberry-splash` (1 536 px) l'est.

## Inventaire et répartition

| Fichier | Dimensions | Sujet et cadrage | Qualité | Emplacement unique |
| --- | --- | --- | --- | --- |
| `hero/matcha-tornado-hero.jpg` | 1122 × 949 | Matcha Tornado, centré, table en bas, très peu d'espace au-dessus de la crème | Excellente | **Accueil, Hero** : monumental, aligné en bas de l'alcôve, noir prolongé au-dessus |
| `hero/matcha-tornado-depth.webp` | 1122 × 949 | Dérivé : même photo, transparente sauf la crème et le haut du gobelet | Découpe contrôlée sur fond magenta | **Accueil, Hero** : couche superposée, la crème passe devant le titre |
| `preparation/crepe-lift.jpg` | 941 × 1672 | Crêpe soulevée à la spatule, fond gris uni | Très bonne | **Accueil, paravent** |
| `preparation/matcha-pour-cup.jpg` | 1024 × 1536 | Matcha versé au-dessus d'un gobelet | Très bonne | **Accueil, paravent** : calé en bas pour garder le gobelet entier |
| `products/brown-sugar-coffee-iced-smoothie.jpg` | 864 × 960 | Gobelet, crème caramélisée, perles | Très bonne | **Accueil, paravent** |
| `preparation/tea-field.jpg` | 941 × 1672 | Deux personnes de dos, champ de théiers, ciel, câbles | Correcte, documentaire | **Accueil, rouleau** : recadré pour réduire les câbles |
| `preparation/whisked-matcha.jpg` | 1086 × 1448 | Surface de matcha dans un bol, fond bois | Excellente, texture | **Accueil, rouleau** |
| `preparation/crepe-batter.jpg` | 1086 × 1448 | Pâte au rouleau, gant noir, plaque rouillée | Bonne | **Accueil, rouleau** |
| `location/matcha-cup-hand.jpg` | 1024 × 1536 | Gobelet tenu en main, bouteilles floues en haut à droite | Bonne, décor chargé | **Carte, Matcha Latte** |
| `preparation/crepe-spread.jpg` | 1086 × 1448 | Crêpe sur plaque, spatule | Bonne | **Carte, ambiance Crêpes** |
| `products/latte.jpg` | 819 × 910 | Gobelet, deux couches | Très bonne | **Carte, Latte** |
| `products/thai-milk-tea-iced-smoothie.jpg` | 850 × 931 | Gobelet, crème, perles | Très bonne | **Carte, Thai Milk Tea** : 14 px retirés en haut (reste de texte « MATCHA ») |
| `products/crepe-forest-fruit.jpg` | 823 × 915 | Cône garni, support blanc entier | Très bonne | **Créations, scène I** |
| `location/strawberry-splash.jpg` | 1536 × 1024 | Boisson au centre, couronne de matcha, fraises | Excellente, la plus grande | **Créations, scène II** : plein cadre, zoom arrière |
| `products/camelot-caramel-latte.jpg` | 778 × 865 | Gobelet, biscuit tenu à la pince | Très bonne | **Créations, scène III** |
| `products/americano.jpg` | 774 × 860 | Gobelet, glaçons, la plus petite | Très bonne | **Créations, scène IV** |
| `preparation/leaves-hands.jpg` | 1024 × 1536 | Mains dans de jeunes feuilles, sans zone vide | Excellente | **Maison, séquence 1** : grand panneau |
| `preparation/powder-spoon.jpg` | 1086 × 1448 | Cuillère de poudre au-dessus d'un bol, fond gris | Très bonne | **Maison, séquence 2**, image 1 |
| `preparation/water-pour.jpg` | 1024 × 1536 | Filet d'eau sur la poudre | Excellente | **Maison, séquence 2**, image 2 |
| `preparation/chasen-whisk.jpg` | 1086 × 1448 | Fouet de bambou en action, mains | Très bonne | **Maison, séquence 2**, image 3 |
| `location/takeaway-hands.jpg` | 1086 × 1448 | Plateau tenu à deux mains, pull beige | Bonne | **Maison, séquence 3** |
| `location/shop-window-tray-crop.jpg` | 1086 × 1166 | Dérivé recadré : plateau de quatre boissons devant la vitrine | Très bonne | **Contact** : affichée à son ratio, le plateau occupe toute la largeur |
| `location/shop-window-tray.jpg` | 1086 × 1448 | Original : le lettrage de la vitrine apparaît à l'envers en haut | Très bonne | Non affiché : remplacé par le recadrage ci-dessus |
| `products/matcha-tornado.jpg` | 853 × 948 | Même prise de vue que le fichier du Hero, en moins grand | Très bonne | Non affiché : doublon |

## Règles appliquées

- **Jamais de déformation** : toutes les images passent par `object-fit`, dans un cadre au ratio choisi.
- **Jamais de produit tronqué** : les grands formats de la carte et les panneaux du paravent conservent le produit entier.
- **Décor et produit distincts** : les fondus au noir de `/creations` portent sur le décor et s'arrêtent avant le produit, sauf une légère atténuation tout en bas de l'image.
- **Découpe limitée** : une seule, celle du Hero, sur fond noir et contrôlée à fort contraste. Aucun autre détourage.

## Pour aller plus loin

À demander à la boutique ou au photographe, par ordre de priorité :

1. Une seconde photo du Matcha Tornado, de la Crêpe Forest Fruit et du Camelot : elles pourraient alors figurer à la fois sur `/creations` et `/carte`, sans doublon.
2. Une vraie photo de la façade et de l'intérieur de la boutique : aucune n'existe dans le projet. Elle irait sur `/contact` et sur la porte « La Boutique ».
3. Les exports haute définition des photos de produits (3 000 px de large ou plus) : c'est ce qui manque pour un rendu natif sur écran 4K.
4. Des photos des autres produits de la carte, surtout les crêpes et les boissons au matcha.
