import "./team.css";
import MemberCard from "./MemberCard";
import { teamMembers, tiers } from "../../content/team";

export const metadata = { title: "Team" };

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
            Meet the team <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <div className="team-tree" id="team-directory">
        {tiers.map((tier) => {
          const members = teamMembers.filter((m) => m.tier === tier.level);
          if (members.length === 0) return null;
          return (
            <section key={tier.level} className={`tier tier-level-${tier.level}`} aria-label={tier.label.replace("_", " ")}>
              {tier.heading && <h2 className="tier-heading">{tier.heading}</h2>}
              <p className="tier-label" aria-hidden="true">{`// ${tier.label}`}</p>
              <ul className="tier-row" style={{ "--cols": members.length }}>
                {members.map((m) => (
                  <MemberCard key={m.slug} member={m} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
