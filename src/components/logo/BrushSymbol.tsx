import { useId, type Ref } from "react";
import { SYMBOL_PATH, SYMBOL_VIEWBOX } from "./paths";

/**
 * Symbole 雅 révélé par un « coup de pinceau » :
 * un tracé épais (masque) dont on anime `stroke-dashoffset` de 1 → 0.
 * Les bords du masque sont rendus organiques par un filtre de turbulence.
 */
export const BRUSH_STROKE =
  "M40 -60 C70 120 20 330 70 590 C110 360 150 140 150 -60 C190 140 230 330 235 590 C270 380 300 150 320 -60 C350 160 360 360 400 590 C430 380 460 140 490 -60 C520 150 540 360 565 590 C590 380 620 160 640 -60 C660 120 680 360 700 600";

type Props = {
  className?: string;
  /** Opacité du symbole « fantôme » visible avant le tracé (0 pour le masquer). */
  ghostOpacity?: number;
  strokeRef?: Ref<SVGPathElement>;
  ghostRef?: Ref<SVGPathElement>;
  colorClassName?: string;
  title?: string;
};

export function BrushSymbol({ className, ghostOpacity = 0.08, strokeRef, ghostRef, colorClassName, title }: Props) {
  const uid = useId().replace(/:/g, "");
  const maskId = `brush-mask-${uid}`;
  const filterId = `brush-filter-${uid}`;
  return (
    <svg
      viewBox={SYMBOL_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      overflow="visible"
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-60" y="-80" width="800" height="700">
          <path
            ref={strokeRef}
            d={BRUSH_STROKE}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={118}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1"
            strokeDashoffset={1}
            filter={`url(#${filterId})`}
            data-brush-stroke
          />
        </mask>
      </defs>
      {ghostOpacity > 0 && (
        <path ref={ghostRef} d={SYMBOL_PATH} fillRule="evenodd" fill="currentColor" opacity={ghostOpacity} />
      )}
      <path
        d={SYMBOL_PATH}
        fillRule="evenodd"
        fill="currentColor"
        mask={`url(#${maskId})`}
        className={colorClassName}
      />
    </svg>
  );
}
