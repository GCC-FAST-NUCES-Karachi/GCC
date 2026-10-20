import "./team.css";
import { ArrowDown } from "lucide-react";
import MemberCard from "./MemberCard";
import { teamMembers, tiers } from "../../content/team";
import { contributors, technicalGroups, technicalLead } from "../../content/contributors";

export const metadata = { title: "Team" };

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function PersonCard({ person, featured = false }) {
  return (
    <article className={`tech-person${featured ? " tech-person-lead" : ""}`}>
      <div className="tech-person-avatar" aria-hidden="true">{initials(person.name)}</div>
      <div className="tech-person-info">
        <h4>{person.name}</h4>
        {person.role && <p>{person.role}</p>}
        {person.github && (
          <a className="tech-person-github" href={person.github} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
        {!person.github && <span className="tech-person-github-placeholder">GitHub · add link</span>}
      </div>
    </article>
  );
}

export default function TeamPage() {
  return (
    <main id="main-content" className="team-page">
      <section className="team-hero" aria-labelledby="team-title">
        <div className="team-hero-copy">
          <p className="eyebrow">{"// git checkout team"}</p>
          <h1 id="team-title">Meet the people behind the <span>commits.</span></h1>
          <p className="team-intro">
            Faculty mentors and student leaders bringing the GitHub Campus Club to life.
          </p>
          <a className="team-hero-link" href="#team-directory">
            Meet the team <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      <div className="team-tree" id="team-directory">
        {tiers.map((tier) => {
          const members = teamMembers.filter((m) => m.tier === tier.level);
          if (members.length === 0) return null;
          return (
            <section key={tier.level} className={`tier tier-level-${tier.level}`} aria-label={tier.label.replaceAll("_", " ")}>
              {tier.heading && <h2 className="tier-heading">{tier.heading}</h2>}
              <p className="tier-label" aria-hidden="true">{`// ${tier.label}`}</p>
              <ul className={`tier-row${tier.label.startsWith("leadership") ? " tier-row-excom" : ""}`} style={{ "--cols": members.length }}>
                {members.map((m) => (
                  <MemberCard key={m.slug} member={m} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="contributors-section" aria-labelledby="technical-team-title">
        <div className="tech-section-heading">
          <div className="tech-section-title">
            <p className="tier-label">{"// people behind the repo"}</p>
            <h2 id="technical-team-title">Technical Team<span className="tech-heading-dot">.</span></h2>
          </div>
          <p className="contributors-intro">The people designing, building, and maintaining GCC’s digital presence.</p>
        </div>

        <div className="tech-hierarchy">
          <div className="tech-lead-node">
            <div className="tech-lead-person">
              <span className="tech-node-kicker">Team lead</span>
              <PersonCard person={technicalLead} featured />
            </div>
          </div>
          <div className="tech-groups">
            {technicalGroups.map((group) => (
              <section className="tech-group" key={group.title} aria-labelledby={`tech-group-${group.title.replaceAll(" ", "-")}`}>
                <div className="tech-group-heading">
                  <h3 id={`tech-group-${group.title.replaceAll(" ", "-")}`}>{group.title}</h3>
                </div>
                <div className="tech-people">
                  {group.members.map((person) => <PersonCard key={person.name} person={person} />)}
                </div>
              </section>
            ))}
          </div>
        </div>

        <section className="community-contributors" aria-labelledby="contributors-title">
          <div className="community-contributors-heading">
            <div>
              <p className="tier-label">{"// more hands, more commits"}</p>
              <h3 id="contributors-title">Contributors</h3>
            </div>
            <p>Growing with every project and pull request.</p>
          </div>
          <ul className="repo-contributors">
            {contributors.map((contributor) => (
              <li key={contributor.name}>
                <span className="contributor-name">{contributor.name}</span>
                {contributor.github ? (
                  <a href={contributor.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                ) : <span className="repo-contributor-placeholder">GitHub · add link</span>}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
