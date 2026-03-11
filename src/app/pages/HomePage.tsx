import { Hero } from "../components/Hero";
import { TechMarquee } from "../components/TechMarquee";
import { About } from "../components/About";
import { Committees } from "../components/Committees";
import { Stats } from "../components/Stats";
import { Events } from "../components/Events";
import { JoinCTA } from "../components/JoinCTA";

export function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Committees />
      <Stats />
      <Events />
      <JoinCTA />
    </>
  );
}
