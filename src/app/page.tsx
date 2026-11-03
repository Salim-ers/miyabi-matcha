import type { Metadata } from "next";
import { HomeByobu } from "@/components/home/HomeByobu";
import { HomeDoors } from "@/components/home/HomeDoors";
import { HomeEmaki } from "@/components/home/HomeEmaki";
import { HomeHero } from "@/components/home/HomeHero";
import { RevealText } from "@/components/motion/RevealText";
import { home } from "@/data/content";
import { seo, shareImage, site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: seo.title, description: site.description, images: [shareImage] },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      {/* Écrans tactiles et mouvement réduit : la phrase d'identité a sa propre scène */}
      <section data-surface="dark" className="statement bg-night px-[var(--gutter)] py-24 text-ivory sm:py-32">
        <RevealText as="p" className="display mx-auto max-w-[20ch] text-center text-[clamp(2.4rem,9.5vw,5.5rem)] italic leading-[1.06]">
          {home.statement.join(" ")}
        </RevealText>
      </section>
      <HomeByobu />
      <HomeEmaki />
      <HomeDoors />
    </>
  );
}
