import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, changeFrequency: "monthly" | "weekly" | "yearly", priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", "monthly", 1),
    page("/carte", "weekly", 0.9),
    page("/creations", "monthly", 0.8),
    page("/maison", "monthly", 0.6),
    page("/contact", "yearly", 0.8),
    page("/mentions-legales", "yearly", 0.2),
    page("/confidentialite", "yearly", 0.2),
  ];
}
