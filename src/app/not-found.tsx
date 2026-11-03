import Link from "next/link";
import { MiyabiSymbol } from "@/components/logo/Logo";

export default function NotFound() {
  return (
    <section data-surface="dark" className="container-x relative flex min-h-[100svh] flex-col items-start justify-center overflow-hidden bg-ink">
      <MiyabiSymbol className="pointer-events-none absolute -right-[10vw] top-1/2 w-[80vw] -translate-y-1/2 text-matcha-deep/50" />
      <p className="label relative text-[0.6rem] text-gold">Erreur 404</p>
      <h1 className="relative mt-5 font-display text-[clamp(3rem,10vw,8rem)] font-light leading-[0.9] tracking-[-0.03em]">
        Cette page
        <br />
        <em className="text-gold">s&apos;est évaporée.</em>
      </h1>
      <Link href="/" className="label relative mt-10 flex min-h-14 items-center rounded-full bg-ivory px-7 text-[0.64rem] text-ink">
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
