import { siGithub } from "simple-icons";
import { ArrowRight } from "lucide-react";
import {
  CoreFunctionsSection,
  HighlightsSection,
  LandingJoinSection,
  PlaySection,
  UpcomingEventsSection,
} from "@/app/landing/LandingSections";
import InfiniteLoop from "@/components/effects/InfiniteLoop";
import Footer from "@/components/layout/Footer";
import "./landing/landing.css";

export const metadata = { title: "Home" };

// Rebuild hourly so the upcoming-events section drops events once they have ended.
export const revalidate = 3600;

export default function Home() {
  return (
    <InfiniteLoop footer={<Footer />}>
    <main id="main-content">
      <section className="hero" aria-labelledby="home-heading">
        <div className="hero-copy">
          <div className="hero-github-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d={siGithub.path} /></svg>
          </div>
          <h1 id="home-heading">Ideas become code. Students become builders.</h1>
          <p className="hero-description">Learn by doing, ship real projects, and find your people at GCC.</p>
          <div className="hero-actions">
            <a className="hero-cta join-button" href="#functions">See what we do <ArrowRight size={17} aria-hidden="true" /></a>
            <a className="hero-secondary" href="#join">Meet the community</a>
          </div>
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
