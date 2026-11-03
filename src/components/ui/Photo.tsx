import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";
import { imageManifest } from "@/data/images";
import { cn } from "@/lib/utils/cn";

type PhotoProps = Omit<ImageProps, "src" | "width" | "height"> & {
  src: string;
  /** "cover" (par défaut) ou "contain" : à choisir pour chaque emplacement. */
  fit?: "cover" | "contain";
  /** Point focal (object-position) sur grand écran. */
  focus?: string;
  /** Point focal sur mobile, si le recadrage diffère. */
  focusM?: string;
};

/**
 * Photo réelle MIYABI, optimisée par next/image (AVIF / WebP, tailles adaptées).
 * Les dimensions et la couleur de chargement proviennent de src/data/images.ts.
 */
export function Photo({ src, alt, fill, quality = 82, fit = "cover", focus, focusM, className, style, ...rest }: PhotoProps) {
  const meta = imageManifest[src];
  const art = {
    "--focus": focus ?? "50% 50%",
    "--focus-m": focusM ?? focus ?? "50% 50%",
    ...(meta && fit === "cover" ? { backgroundColor: meta.color } : {}),
    ...style,
  } as CSSProperties;
  const classes = cn(
    fit === "contain" ? "object-contain" : "object-cover",
    "[object-position:var(--focus-m)] lg:[object-position:var(--focus)]",
    className,
  );
  if (fill || !meta) {
    return <Image src={src} alt={alt} fill quality={quality} className={classes} style={art} {...rest} />;
  }
  return <Image src={src} alt={alt} width={meta.width} height={meta.height} quality={quality} className={classes} style={art} {...rest} />;
}
