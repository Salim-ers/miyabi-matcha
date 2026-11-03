import type { Metadata, Viewport } from "next";
import { CreationsGallery } from "@/components/creations/CreationsGallery";
import { shareImage, site } from "@/data/site";

const description =
  "Les créations signature de MIYABI MATCHA à Paris 8e : Crêpe Forest Fruit, Strawberry Matcha, Camelot Caramel Latte, Americano.";

export const metadata: Metadata = {
  title: "Nos Créations : Crêpe Forest Fruit, Strawberry Matcha, Camelot Caramel Latte",
  description,
  alternates: { canonical: "/creations" },
  openGraph: { url: "/creations", title: `Nos Créations · ${site.name}`, description, images: [shareImage] },
};

export const viewport: Viewport = { themeColor: "#070903" };

export default function CreationsPage() {
  return <CreationsGallery />;
}
