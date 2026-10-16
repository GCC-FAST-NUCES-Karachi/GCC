import {
  ArrowRight,
  Clock3,
  MapPin,
  Mic,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import GccCat from "./GccCat";
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

const events = [
  { month: "OCT", day: "24", title: "Intro to Git and GitHub Workshop", place: "Innovation Lab, Block B", time: "18:00 – 20:00", state: "open" },
  { month: "NOV", day: "05", title: "Open Source Night Talk", place: "Main Auditorium", time: "19:00 – 21:00", state: "open", mascot: "mic" },
  { month: "NOV", day: "14", title: "Hack the Orbit 24h Hackathon", place: "Engineering Atrium", time: "Sat 10:00 – Sun 10:00", state: "almost full", mascot: "trophy" },
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
          <div className="post-author"><span className="author-avatar">G</span><span><strong>GCC Campus Club</strong><small>Community update</small></span></div>
          <p className="highlight-copy">{item.body}</p>
          <div className="post-banner"><span>GCC COMMUNITY</span></div>
        </>
      )}
      {item.type === "tutorial" && (
        <>
          <div className="code-window"><div className="window-dots"><i /><i /><i /><span>{item.title.toLowerCase().replaceAll(" ", "_")}.md</span></div><div className="code-lines"><p># {item.title}</p>{item.code.map((line, index) => <p key={line}><span>{index + 1}</span><code>{line}</code></p>)}</div></div>
          <a className="read-more" href="/learn">Read more <ArrowRight size={13} aria-hidden="true" /></a>
        </>
      )}
      {item.type === "recap" && (
        <>
          <div className="recap-art" aria-hidden="true"><span className="recap-orbit orbit-one" /><span className="recap-orbit orbit-two" /><i /><b /><em /></div>
          <h3>{item.title}</h3>
          <p className="highlight-copy">{item.body}</p>
          <p className="recap-stats">Projects · demos · learning</p>
        </>
      )}
    </article>
  );
}

function EventsSection({ items = events }) {
  return (
    <section className="landing-section events-section" aria-labelledby="events-heading">
      <SectionHeading id="events-heading" title="Upcoming Events" command="// git fetch origin --events" />
      {items.length === 0 ? (
        <div className="events-empty">
          <div className="empty-timeline"><span>{"// empty"}</span><span>{"// empty"}</span><span>{"// empty"}</span></div>
          <div className="empty-cat-scene"><span className="empty-crescent" aria-hidden="true" /><GccCat sleeping /></div>
          <h3>No events on this branch yet.</h3>
          <p>git pull soon.</p>
        </div>
      ) : (
        <div className="events-grid">
          {items.map((event) => (
            <article className="event-item" key={event.title}>
              <div className="event-mascot"><GccCat accessory={event.mascot} /></div>
              <span className={`event-marker ${event.state === "open" ? "open" : "warning"}`} aria-hidden="true" />
              <span className="event-connector" aria-hidden="true" />
              <div className="event-card">
                <div className="event-card-top"><span className="event-date"><small>{event.month}</small><strong>{event.day}</strong></span><span className={`event-state ${event.state === "almost full" ? "warning" : ""}`}>{event.state}</span></div>
                <h3>{event.title}</h3>
                <p><MapPin size={13} aria-hidden="true" /> {event.place}</p>
                <p><Clock3 size={13} aria-hidden="true" /> {event.time}</p>
                <a className="event-rsvp" href="/events" aria-label={`RSVP for ${event.title}`}>RSVP</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function CoreFunctionsSection() {
  return (
    <section className="landing-section functions-section" aria-labelledby="functions-heading">
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
      <a className="view-all-link" href="/learn">View all highlights <ArrowRight size={15} aria-hidden="true" /></a>
    </section>
  );
}

export function PlaySection() {
  return (
    <RevealOnScroll as="section" className="landing-section play-section" aria-labelledby="play-heading">
      <SectionHeading id="play-heading" title="Play" command="// ./play --arcade" />
      <div className="arcade-window">
        <div className="arcade-titlebar"><span className="arcade-dots"><i /><i /><i /></span><span>gcc-arcade</span><span /></div>
        <div className="arcade-content">
          <div className="game-canvas"><span>GAME CANVAS</span><small>content to be decided</small></div>
          <div className="arcade-commentary"><p className="commentary-label">{"// commentary"}</p><p>Take a break from shipping code. This is the club’s arcade corner, ready for a little friendly competition.</p><p>The game is still being chosen. This canvas is reserved for the experience. Instructions and controls will appear here when it’s ready.</p></div>
        </div>
      </div>
      <p className="arcade-prompt">&gt; game loading soon_</p>
    </RevealOnScroll>
  );
}

export function UpcomingEventsSection() {
  return <EventsSection />;
}

export function LandingJoinSection() {
  return (
    <section id="join" className="landing-join-section">
      <div><p className="section-command">{"// git checkout join"}</p><h2>Build something with us.</h2><p>A community for FAST-NUCES students who learn, build, and ship together.</p></div>
      <a href="mailto:ghcc@nu.edu.pk?subject=Join%20GitHub%20Campus%20Club" className="join-button">Join the club <ArrowRight size={16} aria-hidden="true" /></a>
    </section>
  );
}
