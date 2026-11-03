import { TLink } from "@/components/shell/TLink";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils/cn";

type Props = {
  href: string;
  children: string;
  external?: boolean;
  tone?: "ink" | "ivory";
  className?: string;
};

/** Petit bouton de la marque : un libellé qui roule, une flèche qui traverse sa pastille. */
export function Cta({ href, children, external, tone = "ink", className }: Props) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const body = (
    <>
      <span className="roll label text-[0.68rem]">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span className={cn("cta-dot size-11 shrink-0", tone === "ink" ? "bg-ink text-ivory" : "bg-ivory text-ink")}>
        <Arrow className="size-4" />
        <Arrow className="size-4" />
      </span>
    </>
  );
  const classes = cn("cta inline-flex min-h-11 items-center gap-4", tone === "ink" ? "text-ink" : "text-ivory", className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {body}
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    );
  }
  return (
    <TLink href={href} className={classes}>
      {body}
    </TLink>
  );
}
