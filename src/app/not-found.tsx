import { MiyabiSymbol } from "@/components/logo/Logo";
import { Cta } from "@/components/ui/Cta";

export default function NotFound() {
  return (
    <section data-surface="light" className="container-x relative flex min-h-[100svh] flex-col items-start justify-center overflow-hidden bg-ivory text-ink">
      <MiyabiSymbol className="pointer-events-none absolute -right-[10vw] top-1/2 w-[80vw] -translate-y-1/2 text-sage/40" />
      <p className="label relative text-[0.6rem] text-smoke">Erreur 404</p>
      <h1 className="display relative mt-5 text-[clamp(3rem,10vw,9rem)]">
        Cette page
        <br />
        <em>s&apos;est évaporée.</em>
      </h1>
      <Cta href="/" className="relative mt-10">
        Retour à l&apos;accueil
      </Cta>
    </section>
  );
}
