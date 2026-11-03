import { SYMBOL_PATH, SYMBOL_VIEWBOX, WORDMARK_PATH, WORDMARK_VIEWBOX } from "./paths";

type LogoProps = { className?: string; title?: string };

/** Symbole officiel 雅 (tracé vectoriel du logo fourni). */
export function MiyabiSymbol({ className, title }: LogoProps) {
  return (
    <svg
      viewBox={SYMBOL_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={SYMBOL_PATH} />
    </svg>
  );
}

/** Logotype officiel « MIYABI MATCHA ». */
export function MiyabiWordmark({ className, title }: LogoProps) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={WORDMARK_PATH} />
    </svg>
  );
}
