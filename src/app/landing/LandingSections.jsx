import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Gamepad2,
  Mic,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import { siWhatsapp } from "simple-icons";
import EventsList from "@/components/events/EventsList";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import HighlightsCarousel from "./HighlightsCarousel";

const functions = [
  {
    file: "competitive_programming.exe",
    name: "Hackathons()",
    Icon: Trophy,
    tone: "gold",
    text: "Got an idea? Put it to the test. Team up, tackle challenges, and turn a midnight brainstorm into a sunrise demo.",
  },
  {
    file: "skill_development.py",
    name: "Workshops()",
    Icon: Wrench,
    tone: "blue",
    text: "Got curious? Get hands-on. Explore new tools, experiment with real workflows, and turn ‘what if?’ into ‘what’s next?’",
  },
  {
    file: "knowledge_sharing.js",
    name: "Tech Talks()",
    Icon: Mic,
    tone: "purple",
    text: "Get fresh insights, discover emerging technologies, and hear how people in tech think, experiment, and solve real-world problems.",
  },
  {
    file: "network_building.ts",
    name: "Community()",
    Icon: Users,
    tone: "orange",
    text: "Meet your people, find your collaborators, and grow alongside a community that gets your passion for tech.",
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

function WorkshopCard({ image, alt, title, description }) {
  return (
    <article className="workshop-highlight-card">
      <div className="workshop-poster-frame">
        <Image className="workshop-poster" src={image} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" />
      </div>
      <div className="workshop-highlight-copy">
        <span className="workshop-highlight-type">Workshop recap</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

function CommunityLinkCard({ href, label, title, description, icon, available = true }) {
  const Icon = icon;
  const content = (
    <>
      <span className={`community-card-icon ${label === "LinkedIn" ? "linkedin-mark" : "whatsapp-mark"}`} aria-hidden="true">
        {label === "LinkedIn" ? <Image src="/images/linkedin-in-bug.png" alt="" width={36} height={31} /> : <Icon />}
      </span>
      <span className="community-link-copy"><strong>{title}</strong><span>{description}</span></span>
      {available ? <ArrowRight size={17} aria-hidden="true" /> : <span className="community-coming-soon">Coming soon</span>}
    </>
  );

  return available ? (
    <a className={`community-link-card ${label.toLowerCase()}`} href={href} target="_blank" rel="noreferrer" aria-label={`${title} (opens in a new tab)`}>{content}</a>
  ) : (
    <div className={`community-link-card ${label.toLowerCase()} unavailable`} aria-label={`${title}: link coming soon`}>{content}</div>
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
      <SectionHeading id="functions-heading" title="What's in Our Stack?" command="// Explore the stack. Discover your potential." description="Learn it in workshops. Build it at hackathons. Take it to the industry. The future of tech starts with you." />
      <div className="functions-grid">{functions.map((item) => <FunctionCard key={item.name} {...item} />)}</div>
    </section>
  );
}

export function HighlightsSection() {
  return (
    <section id="highlights" className="landing-section highlights-section" aria-labelledby="highlights-heading">
      <SectionHeading id="highlights-heading" title="Highlights" command="// a few things we've done together" description="Past workshops, plus places to keep up with the community." />
      <div className="highlights-grid">
        <HighlightsCarousel slideCount={2}>
          <WorkshopCard image="/images/events/tech-careers-talk.jpg" alt="Poster for The Real Talk on Your Tech Careers, featuring Imran Azhar" title="The real talk on your tech careers" description="A conversation about the skills and realities of building a career in tech, with Imran Azhar." />
          <WorkshopCard image="/images/events/research-scholarship-talk.jpg" alt="Poster for a talk with Professor Chaoning Zhang about MS and PhD scholarships abroad" title="Research & scholarships abroad" description="Guidance on MS and PhD scholarships from Professor Chaoning Zhang, Full Professor at UESTC, China." />
        </HighlightsCarousel>
        <div className="community-highlight-links" aria-label="Connect with the community">
        <CommunityLinkCard label="LinkedIn" href="https://www.linkedin.com/company/github-campus-club-fast-nuces/" title="Follow us on LinkedIn" description="Club news, opportunities, and updates." />
        <CommunityLinkCard label="WhatsApp" href="https://chat.whatsapp.com/EweThN5W27a4cVgFC5VyPC?s=sw&p=a&mlu=4&ilr=4" title="Join the WhatsApp community" description="Get in touch with the club community." icon={() => <svg viewBox="0 0 24 24"><path d={siWhatsapp.path} /></svg>} />
        </div>
      </div>
    </section>
  );
}

export function PlaySection() {
  const games = [
    {
      name: "Commit Snake",
      genre: "ARCADE · SURVIVAL",
      description: "Collect commits. Dodge the blockers. Keep your branch alive.",
      href: "/games/commit-snake",
      detail: "KEYBOARD · SWIPE",
    },
    {
      name: "Bug Bash",
      genre: "ACTION · QUICK REFLEXES",
      description: "Smash the bugs. Save the good code. Never force push.",
      href: "/games/bug-bash",
      detail: "CLICK · TAP · SLASH",
    },
    {
      name: "Octo Dive",
      genre: "TRIVIA · DEEP DIVE",
      description: "Dive through GitHub and Git questions, build streaks and earn depth with every correct answer.",
      href: "/games/octo-dive",
      detail: "TAP · KEYS 1–4",
    },
  ];

  return (
    <RevealOnScroll as="section" id="play" className="landing-section play-section" aria-labelledby="play-heading">
      <SectionHeading id="play-heading" title="Play" command="// ./play --arcade" />
      <div className="arcade-window">
        <div className="arcade-titlebar">
          <span className="arcade-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="arcade-title"><Gamepad2 size={15} aria-hidden="true" /> GCC ARCADE</span>
          <span className="arcade-status">{games.length} CABINETS READY</span>
        </div>
        <div className="arcade-library">
          <div className="arcade-library-heading">
            <div><span>GAMES AVAILABLE NOW</span><h3>Choose your game</h3><p>Quick rounds. Club-made chaos.</p></div>
            <Link href="/games" className="arcade-library-link">ALL GAMES <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="arcade-game-grid">
            {games.map(({ name, genre, description, href, detail }) => (
              <article className="arcade-game-card" key={name}>
                <div className="arcade-machine-top"><span>ARCADE GAME</span><span className="arcade-ready"><i /> PLAYABLE</span></div>
                <div className="arcade-game-copy">
                  <span className="arcade-game-genre">{genre}</span>
                  <h4>{name}</h4>
                  <p>{description}</p>
                  <div className="arcade-game-footer"><span className="arcade-game-detail">{detail}</span><Link className="arcade-play-link" href={href}>PLAY NOW <ArrowRight size={15} aria-hidden="true" /></Link></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
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
      <a href="https://chat.whatsapp.com/EweThN5W27a4cVgFC5VyPC?s=sw&p=a&mlu=4&ilr=4" className="join-button" target="_blank" rel="noreferrer">Join the community <ArrowRight size={16} aria-hidden="true" /></a>
    </section>
  );
}
