import { BentoHero } from "../components/home/BentoHero";
import { TechMarquee } from "../components/home/TechMarquee";
import { Events } from "../components/home/Events";
import { JoinCTA } from "../components/home/JoinCTA";
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
