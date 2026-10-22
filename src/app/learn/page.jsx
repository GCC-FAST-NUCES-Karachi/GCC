import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { tracks } from "@/content/learn";
import "./learn.css";

export const metadata = {
  title: "Learn",
  description:
    "Learning resources and practical starting points for GitHub Campus Club students.",
};

const workshops = [
  { file: "workshop.md", description: "Build along live. Leave with something that runs." },
  { file: "build-night.md", description: "Bring your project. Work side by side. Get unstuck faster." },
  { file: "show-and-tell.md", description: "Demo what you made. Finished is optional." },
  { file: "contribute.md", description: "Pick an open source issue and tackle it as a squad." },
];

export default function LearnPage() {
  return (
    <main id="main-content" className="learn-page">
      <header className="learn-header">
        <div className="learn-hero-copy">
          <p className="eyebrow">{"// git checkout learn"}</p>
          <h1>Learn by <span>building.</span></h1>
          <p className="learn-intro">
            Lectures can wait. Pick a path, make something small, and push it. Your
            first commit is closer than you think.
          </p>
          <a className="learn-start-link" href="#learning-paths">Find your starting point <ArrowDown size={15} aria-hidden="true" /></a>
        </div>
        <div className="learn-terminal" aria-label="A preview of your first git commands">
          <div className="learn-terminal-bar"><span /><span /><span /><code>~/your-next-project</code></div>
          <div className="learn-terminal-body">
            <p><span>$</span> git init</p>
            <p><span>$</span> git add .</p>
            <p><span>$</span> git commit -m <b>"first step"</b></p>
            <p className="learn-terminal-success">✓ You’re already building.</p>
          </div>
        </div>
      </header>

      <section className="learn-section" id="learning-paths" aria-labelledby="learn-tracks-heading">
        <div className="learn-section-heading">
          <p className="learn-kicker">01 / Learning paths</p>
          <h2 id="learn-tracks-heading">A place to start</h2>
          <p>Three paths. Zero prerequisites. No wrong door.</p>
        </div>
        <ul className="learn-tracks">
          {tracks.map((track) => (
            <li className="learn-track" key={track.number}>
              <div>
                <div className="learn-track-meta"><span className="learn-track-number">{track.number}</span><span className="learn-track-file">{track.command}</span></div>
                <h3>{track.title}</h3>
                <p className="learn-track-prompt">{track.prompt}</p>
                <p>{track.description}</p>
                <p className="learn-track-outcome"><strong>You’ll ship:</strong> {track.outcome}</p>
                <a href={track.href} target="_blank" rel="noopener noreferrer">
                  {track.cta}
                  <ArrowRight size={15} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="learn-next" aria-labelledby="learn-events-heading">
        <p className="learn-kicker">Learn — together</p>
        <h2 id="learn-events-heading">Workshops and events</h2>
        <p>Code is better with company. Show up, build something, break it, fix it, and show it off to the GitHub Campus Club community.</p>
        <ul className="learn-workshops">
          {workshops.map((workshop) => (
            <li key={workshop.file}>
              <span className="learn-workshop-file">{workshop.file}</span>
              <ArrowRight className="learn-workshop-separator" size={14} aria-hidden="true" />
              <span>{workshop.description}</span>
            </li>
          ))}
        </ul>
        <p className="learn-event-detail"><strong>Bring:</strong> a laptop and a GitHub account.</p>
        <p className="learn-event-detail"><strong>Experience needed:</strong> none. Beginners welcome.</p>
        <Link href="/events">Explore upcoming events <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
