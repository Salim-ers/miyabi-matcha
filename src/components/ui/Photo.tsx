import Image, { type ImageProps } from "next/image";
import { imageManifest } from "@/data/images";

type PhotoProps = Omit<ImageProps, "src" | "width" | "height" | "placeholder" | "blurDataURL"> & {
  src: string;
};

/**
 * Photo réelle MIYABI, optimisée par next/image (AVIF / WebP, tailles adaptées).
 * Les dimensions et le flou de chargement proviennent de src/data/images.ts.
 */
export function Photo({ src, alt, fill, quality = 80, ...rest }: PhotoProps) {
  const meta = imageManifest[src];
  const blur = meta ? { placeholder: "blur" as const, blurDataURL: meta.blurDataURL } : {};
  if (fill || !meta) {
    return <Image src={src} alt={alt} fill quality={quality} {...blur} {...rest} />;
  }
  return <Image src={src} alt={alt} width={meta.width} height={meta.height} quality={quality} {...blur} {...rest} />;
}
