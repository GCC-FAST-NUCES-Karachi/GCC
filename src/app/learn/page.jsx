import Link from "next/link";
import { perks } from "@/app/perks/perks";
import "./learn.css";

export const metadata = {
  title: "Learn",
  description:
    "Learning resources and practical starting points for GitHub Campus Club students.",
};

const resources = perks.filter((perk) =>
  ["skills", "classroom", "community-exchange"].includes(perk.id),
);

const tracks = [
  {
    number: "01",
    title: "Git & GitHub",
    description:
      "Get comfortable with repositories, branches, commits, and pull requests through hands-on practice.",
    command: "git-basics.md",
  },
  {
    number: "02",
    title: "Build for the web",
    description:
      "Turn an idea into a project, learn by shipping small features, and share your work in a repository.",
    command: "build-in-public.md",
  },
  {
    number: "03",
    title: "Open source",
    description:
      "Learn how to find a project, understand its contribution guide, and make your first useful contribution.",
    command: "first-contribution.md",
  },
];

export default function LearnPage() {
  return (
    <main id="main-content" className="learn-page">
      <header className="learn-header">
        <p className="eyebrow">{"// git checkout learn"}</p>
        <h1>Learn by building.</h1>
        <p className="learn-intro">
          Start with the fundamentals, follow your curiosity, and learn alongside
          other students. Pick a path below or explore self-paced GitHub resources.
        </p>
      </header>

      <section className="learn-section" aria-labelledby="learn-tracks-heading">
        <div className="learn-section-heading">
          <p className="learn-kicker">01 / Learning paths</p>
          <h2 id="learn-tracks-heading">A place to start</h2>
        </div>
        <ul className="learn-tracks">
          {tracks.map((track) => (
            <li className="learn-track" key={track.number}>
              <span className="learn-track-number">{track.number}</span>
              <div>
                <p className="learn-track-file">{track.command}</p>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="learn-section" aria-labelledby="learn-resources-heading">
        <div className="learn-section-heading">
          <p className="learn-kicker">02 / External resources</p>
          <h2 id="learn-resources-heading">Keep exploring</h2>
          <p>Free and practical ways to keep learning at your own pace.</p>
        </div>
        <ul className="learn-resources">
          {resources.map((resource) => (
            <li className="learn-resource" key={resource.id}>
              <p className="learn-resource-category">{resource.category}</p>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <a href={resource.href} target="_blank" rel="noopener noreferrer">
                {resource.cta}<span aria-hidden="true"> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <aside className="learn-next">
        <p className="learn-kicker">Learn together</p>
        <h2>Workshops and events</h2>
        <p>Join club sessions to practice with others and share what you build.</p>
        <Link href="/events">Explore upcoming events <span aria-hidden="true">→</span></Link>
      </aside>
    </main>
  );
}
