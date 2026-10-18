import { siGithub } from "simple-icons";
import {
  CoreFunctionsSection,
  HighlightsSection,
  LandingJoinSection,
  PlaySection,
  UpcomingEventsSection,
} from "@/app/landing/LandingSections";
import InfiniteLoop from "@/components/effects/InfiniteLoop";
import "./landing/landing.css";

export default function Home() {
  return (
    <InfiniteLoop>
    <main id="main-content">
      <section className="hero" aria-labelledby="home-heading">
        <div className="hero-copy">
          <div className="hero-github-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d={siGithub.path} /></svg>
          </div>
          <h1 id="home-heading">Where students ship code and build the future together.</h1>
          <p className="eyebrow">{"// scroll to accelerate"}</p>
        </div>
      </section>
      <CoreFunctionsSection />
      <HighlightsSection />
      <PlaySection />
      <UpcomingEventsSection />
      <LandingJoinSection />
    </main>
    </InfiniteLoop>
  );
}
