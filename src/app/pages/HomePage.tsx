import { BentoHero } from "../components/home/BentoHero";
import { TechMarquee } from "../components/home/TechMarquee";
import { Events } from "../components/home/Events";
import { JoinCTA } from "../components/home/JoinCTA";
import { HomePageProvider } from "../../context/HomePageProvider";
import { usePageMeta } from "../../hooks/usePageMeta";

export function HomePage() {
  usePageMeta({
    title: "Home",
    description:
      "The official website of the Purdue University IEEE Student Branch. Purdue's premier student-run engineering organization featuring technical project committees, workshops, and professional development since 1903.",
  });

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
