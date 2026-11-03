/**
 * Génère la couche de profondeur du Hero : la photo réelle du Matcha Tornado,
 * rendue transparente partout sauf sur la boisson (crème, couvercle transparent, haut du gobelet).
 * Le mot « MIYABI. » passe ainsi DERRIÈRE la crème, comme le titre d'une couverture de magazine.
 *
 * Aucun pixel du produit n'est modifié : seul un canal alpha est ajouté.
 * Usage : node scripts/build-hero-cutout.js
 */
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const SRC = path.join(root, "public/images/hero/matcha-tornado-hero.jpg");
const OUT = path.join(root, "public/images/hero/matcha-tornado-depth.webp");

/** Limite basse de la découpe (fraction de la hauteur) : sous cette ligne, la photo du dessous suffit. */
const CUT_BOTTOM = 0.34;
const FADE = 0.03;

(async () => {
  const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const idx = (x, y) => y * W + x;
  const yMax = Math.round(H * CUT_BOTTOM);

  // 1. Un pixel est « fond » s'il est sombre ou si c'est le néon vert saturé du décor.
  const isBackgroundLike = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y) * 3;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const neon = g > r * 1.7 && g > b * 1.7;
      isBackgroundLike[idx(x, y)] = lum < 42 || neon ? 1 : 0;
    }
  }

  // 2. Remplissage depuis les bords : les zones sombres internes (morceaux de biscuit) restent dans le sujet.
  const outside = new Uint8Array(W * H);
  const stack = [];
  const seed = (x, y) => {
    const k = idx(x, y);
    if (!outside[k] && isBackgroundLike[k]) {
      outside[k] = 1;
      stack.push(k);
    }
  };
  for (let x = 0; x < W; x++) seed(x, 0);
  for (let y = 0; y < yMax; y++) {
    seed(0, y);
    seed(W - 1, y);
  }
  while (stack.length) {
    const k = stack.pop();
    const x = k % W;
    const y = (k - x) / W;
    if (x > 0) seed(x - 1, y);
    if (x < W - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < yMax - 1) seed(x, y + 1);
  }

  // 3. On ne garde que la plus grande composante connexe (la boisson), sans les reflets isolés.
  const label = new Int32Array(W * H);
  let best = 0;
  let bestSize = 0;
  let current = 0;
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < W; x++) {
      const k = idx(x, y);
      if (outside[k] || label[k]) continue;
      current++;
      let size = 0;
      stack.push(k);
      label[k] = current;
      while (stack.length) {
        const c = stack.pop();
        size++;
        const cx = c % W;
        const cy = (c - cx) / W;
        const visit = (nx, ny) => {
          if (nx < 0 || ny < 0 || nx >= W || ny >= yMax) return;
          const n = idx(nx, ny);
          if (!outside[n] && !label[n]) {
            label[n] = current;
            stack.push(n);
          }
        };
        visit(cx - 1, cy);
        visit(cx + 1, cy);
        visit(cx, cy - 1);
        visit(cx, cy + 1);
      }
      if (size > bestSize) {
        bestSize = size;
        best = current;
      }
    }
  }

  // 4. Le sujet est la plus grande composante. Sous le haut du couvercle, le plastique transparent
  //    est plein entre ses deux bords : on referme chaque ligne, sans toucher à la silhouette de la crème.
  const RIM_TOP = Math.round(H * 0.19);
  const mask = new Uint8Array(W * H);
  for (let y = 0; y < yMax; y++) {
    let first = -1;
    let last = -1;
    for (let x = 0; x < W; x++) {
      if (label[idx(x, y)] === best) {
        mask[idx(x, y)] = 255;
        if (first < 0) first = x;
        last = x;
      }
    }
    if (first >= 0 && y >= RIM_TOP) for (let x = first; x <= last; x++) mask[idx(x, y)] = 255;
  }

  // 5. Bord doux (anti-crénelage) puis fondu bas de la découpe.
  const alpha = await sharp(Buffer.from(mask), { raw: { width: W, height: H, channels: 1 } })
    .blur(0.7)
    .extractChannel(0)
    .raw()
    .toBuffer();
  const rgba = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    const fade = y > yMax - H * FADE ? Math.max(0, (yMax - y) / (H * FADE)) : 1;
    for (let x = 0; x < W; x++) {
      const k = idx(x, y);
      rgba[k * 4] = data[k * 3];
      rgba[k * 4 + 1] = data[k * 3 + 1];
      rgba[k * 4 + 2] = data[k * 3 + 2];
      rgba[k * 4 + 3] = Math.round(alpha[k] * fade);
    }
  }
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 95, effort: 6 })
    .toFile(OUT);
  console.log("OK", path.relative(root, OUT), `${W}x${H}`, "sujet:", bestSize, "px");
})();
