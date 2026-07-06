import { BentoHero } from "../components/BentoHero";
import { TechMarquee } from "../components/TechMarquee";
import { Events } from "../components/Events";
import { JoinCTA } from "../components/JoinCTA";

export function HomePage() {
  return (
    <>
      <BentoHero />
      <TechMarquee />
      <Events />
      <JoinCTA />
    </>
  );
}
