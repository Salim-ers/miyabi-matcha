import type { Metadata } from "next";
import { MaisonStory } from "@/components/maison/MaisonStory";
import { shareImage, site } from "@/data/site";

const description =
  "Notre maison : l'inspiration japonaise, la préparation du matcha au fouet de bambou et l'instant MIYABI, à deux pas de Saint-Lazare, Paris 8e.";

export const metadata: Metadata = {
  title: "Notre Maison : l'art du matcha, geste après geste",
  description,
  alternates: { canonical: "/maison" },
  openGraph: { url: "/maison", title: `Notre Maison · ${site.name}`, description, images: [shareImage] },
};

export default function MaisonPage() {
  return <MaisonStory />;
}
