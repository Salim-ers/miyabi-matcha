const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const root = process.argv[2] || process.cwd(); const out = process.argv[3] || path.join(root, "src/data/images.ts");
const walk = (d) => fs.readdirSync(d).flatMap((f) => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : [p]; });
(async () => {
  const files = walk(path.join(root, 'public/images')).filter((f) => /\.(jpe?g|png|webp)$/.test(f)).sort();
  const entries = [];
  for (const f of files) {
    const meta = await sharp(f).metadata();
    const buf = await sharp(f).resize(16).jpeg({ quality: 55 }).toBuffer();
    const rel = '/' + path.relative(path.join(root, 'public'), f).split(path.sep).join('/');
    entries.push(`  "${rel}": { width: ${meta.width}, height: ${meta.height}, blurDataURL: "data:image/jpeg;base64,${buf.toString('base64')}" },`);
  }
  fs.writeFileSync(out, `// Généré automatiquement par scripts/generate-image-manifest.js — ne pas modifier à la main.\n// Dimensions réelles des fichiers sources (aucune image n'est upscalée).\nexport type ImageMeta = { width: number; height: number; blurDataURL: string };\n\nexport const imageManifest: Record<string, ImageMeta> = {\n${entries.join('\n')}\n};\n`);
  console.log(entries.length, 'images');
})();
