import { Hero } from "@/components/hero/Hero";
import { Location } from "@/components/location/Location";
import { MenuSection } from "@/components/menu/MenuSection";
import { Showcase } from "@/components/products/Showcase";
import { Manifesto } from "@/components/story/Manifesto";
import { Story } from "@/components/story/Story";
import { Universe } from "@/components/universe/Universe";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Story />
      <Showcase />
      <Universe />
      <MenuSection />
      <Location />
    </>
  );
}
