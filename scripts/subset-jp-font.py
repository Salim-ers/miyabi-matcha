"""
Génère src/fonts/shippori-mincho-500-subset.woff2 : police japonaise réduite aux
caractères réellement utilisés dans src/ (+ tous les kana et la ponctuation japonaise).

À relancer après l'ajout de nouveaux noms japonais à la carte :
  pip install fonttools brotli
  python scripts/subset-jp-font.py chemin/vers/ShipporiMincho-Medium.ttf
(TTF disponible sur Google Fonts ou via le paquet npm @expo-google-fonts/shippori-mincho)
"""
import pathlib, re, sys
from fontTools import subset

root = pathlib.Path(__file__).resolve().parent.parent
text = "".join(p.read_text(encoding="utf-8") for p in (root / "src").rglob("*.ts*"))
cjk = set(re.findall(r"[　-〿぀-ヿ一-鿿＀-￯]", text))
kana = {chr(c) for c in range(0x3040, 0x3100)} | {chr(c) for c in range(0x3000, 0x3040)}
chars = "".join(sorted(cjk | kana))
out = root / "src/fonts/shippori-mincho-500-subset.woff2"
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["*"]
font = subset.load_font(sys.argv[1], opts)
sub = subset.Subsetter(opts)
sub.populate(text=chars)
sub.subset(font)
subset.save_font(font, str(out), opts)
print(f"{len(cjk)} caractères CJK utilisés → {out} ({out.stat().st_size // 1024} Ko)")
