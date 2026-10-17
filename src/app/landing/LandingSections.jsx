import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Mic,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import EventsList from "@/components/events/EventsList";
import highlights from "@/content/highlights";
import RevealOnScroll from "@/components/effects/RevealOnScroll";

const functions = [
  {
    file: "competitive_programming.exe",
    name: "Hackathons()",
    Icon: Trophy,
    tone: "gold",
    text: "Compete, build and ship in 24 hours. Teams form on the night and demos run till sunrise.",
  },
  {
    file: "skill_development.py",
    name: "Workshops()",
    Icon: Wrench,
    tone: "blue",
    text: "Hands-on sessions from Git basics to deploying your first app. Bring a laptop, leave with a repo.",
  },
  {
    file: "knowledge_sharing.js",
    name: "Tech Talks()",
    Icon: Mic,
    tone: "purple",
    text: "Students and invited engineers share what they are building, breaking and learning.",
  },
  {
    file: "network_building.ts",
    name: "Community()",
    Icon: Users,
    tone: "orange",
    text: "Find teammates, mentors and open-source buddies who will review your pull requests.",
  },
];

function SectionHeading({ id, title, command, description }) {
  return (
    <header className="landing-section-heading">
      <h2 id={id}>{title}</h2>
      <p className="section-command">{command}</p>
      {description && <p className="section-description">{description}</p>}
    </header>
  );
}

function FunctionCard({ file, name, Icon, tone, text }) {
  return (
    <article className="function-card">
      <div className="function-card-top">
        <span className="function-file">{file}</span>
        <span className={`function-icon ${tone}`}><Icon aria-hidden="true" size={20} /></span>
      </div>
      <h3 className="function-signature"><span>function</span> <strong>{name}</strong> <span>{"{"}</span></h3>
      <p className="function-description">{text}</p>
      <span className="function-closing">{"}"}</span>
    </article>
  );
}

function HighlightCard({ item }) {
  return (
    <article className={`highlight-card ${item.type}${item.featured ? " featured" : ""}${item.tall ? " tall" : ""}`}>
      <div className="highlight-card-meta"><span className="content-badge">[{item.type}]</span><code>{item.label}</code></div>
      {item.type === "post" && (
        <>
          <div className="post-author"><span className="author-avatar" aria-hidden="true">G</span><span><strong>GCC Campus Club</strong><small>Community update</small></span></div>
          <p className="highlight-copy">{item.body}</p>
          <div className="post-banner" aria-hidden="true"><span>GCC COMMUNITY</span></div>
        </>
      )}
      {item.type === "tutorial" && (
        <>
          <div className="code-window"><div className="window-dots"><i /><i /><i /><span>{item.title.toLowerCase().replaceAll(" ", "_")}.md</span></div><div className="code-lines"><p># {item.title}</p>{item.code.map((line, index) => <p key={line}><span>{index + 1}</span><code>{line}</code></p>)}</div></div>
          <Link className="read-more" href="/learn">Read more <ArrowRight size={13} aria-hidden="true" /></Link>
        </>
      )}
      {item.type === "recap" && (
        <>
          <div className="recap-art" aria-hidden="true"><span className="recap-orbit orbit-one" /><span className="recap-orbit orbit-two" /><i /><b /><em /></div>
          <h3>{item.title}</h3>
          <p className="highlight-copy">{item.body}</p>
          <p className="recap-stats">Projects, demos and learning</p>
        </>
      )}
    </article>
  );
}

function EventsSection() {
  return (
    <section id="events" className="landing-section events-section" aria-labelledby="events-heading">
      <SectionHeading id="events-heading" title="Upcoming Events" command="// git fetch origin --events" />
      <EventsList />
    </section>
  );
}

export function CoreFunctionsSection() {
  return (
    <section id="functions" className="landing-section functions-section" aria-labelledby="functions-heading">
      <SectionHeading id="functions-heading" title="Core Functions" command="// Defining our primary execution modules" description="From late-night hackathons to industry partnerships, we're building the future of tech, one function at a time." />
      <div className="functions-grid">{functions.map((item) => <FunctionCard key={item.name} {...item} />)}</div>
    </section>
  );
}

export function HighlightsSection() {
  return (
    <section id="highlights" className="landing-section highlights-section" aria-labelledby="highlights-heading">
      <SectionHeading id="highlights-heading" title="Highlights" command="// git log --highlights" />
      <div className="highlights-grid">{highlights.map((item) => <HighlightCard key={item.id} item={item} />)}</div>
      <Link className="view-all-link" href="/learn">View all highlights <ArrowRight size={15} aria-hidden="true" /></Link>
    </section>
  );
}

// The game is not chosen yet, so nothing here is clickable or implies it is playable.
export function PlaySection() {
  return (
    <RevealOnScroll as="section" id="play" className="landing-section play-section" aria-labelledby="play-heading">
      <SectionHeading id="play-heading" title="Play" command="// ./play --arcade" />
      <div className="arcade-window">
        <div className="arcade-titlebar">
          <span className="arcade-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="arcade-title">gcc-arcade</span>
          <span className="arcade-status">1 game playable</span>
        </div>
        <div className="arcade-content">
          <div className="game-canvas" role="img" aria-label="Commit Snake is available to play in the GCC arcade.">
            <Gamepad2 size={40} aria-hidden="true" />
            <strong>Commit Snake</strong>
            <span>{"// playable now"}</span>
          </div>
          <div className="arcade-side">
            <div className="arcade-commentary">
              <span className="commentary-label">{"// available now"}</span>
              <p>Collect commits, dodge the GCC blocks, and see how high you can score.</p>
              <Link className="arcade-play-link" href="/games/commit-snake">Play Commit Snake <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="secret-hint">
              <strong>{"// more games"}</strong>
              <p>The arcade will grow as the club adds more community-made games.</p>
              <Link href="/games#contribute">Build the next one <ArrowRight size={13} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </div>
      <p className="arcade-prompt" aria-hidden="true">{"> 1 game loaded. more to come_"}</p>
    </RevealOnScroll>
  );
}

export function UpcomingEventsSection() {
  return <EventsSection />;
}

export function LandingJoinSection() {
  return (
    <section id="join" className="landing-join-section" aria-labelledby="join-heading">
      <div><p className="section-command">{"// git checkout join"}</p><h2 id="join-heading">Build something with us.</h2><p>A community for FAST-NUCES students who learn, build, and ship together.</p></div>
      <a href="mailto:ghcc@nu.edu.pk?subject=Join%20GitHub%20Campus%20Club" className="join-button">Join the club <ArrowRight size={16} aria-hidden="true" /></a>
    </section>
  );
}
