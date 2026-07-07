import { BentoHero } from "../components/BentoHero";
import { TechMarquee } from "../components/TechMarquee";
import { Events } from "../components/Events";
import { JoinCTA } from "../components/JoinCTA";
import { HomePageProvider } from "../../context/HomePageContext";

export function HomePage() {
  return (
    // Fetch homePage data once; BentoHero + Stats consume via useHomePageData()
    <HomePageProvider>
      <BentoHero />
      <TechMarquee />
      <Events />
      <JoinCTA />
    </HomePageProvider>
  );
}
