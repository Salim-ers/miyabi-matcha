import type { Metadata } from "next";
import { Location } from "@/components/location/Location";
import { MenuSection } from "@/components/menu/MenuSection";

export const metadata: Metadata = {
  title: "La carte — matcha, crêpes japonaises, café & boba",
  description:
    "La carte MIYABI MATCHA à Paris 8e : matcha latte, boissons signature au matcha, crêpes japonaises au matcha, café japonais, boba et thés fruités.",
  alternates: { canonical: "/carte" },
};

export default function CartePage() {
  return (
    <>
      <MenuSection variant="page" />
      <Location />
    </>
  );
}
