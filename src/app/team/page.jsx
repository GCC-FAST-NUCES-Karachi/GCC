import "./team.css";
import MemberCard from "./MemberCard";
import { teamMembers, tiers } from "../../content/team";

export const metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <main id="main-content" className="team-page">
      <p className="eyebrow">{"// git checkout team"}</p>
      <h1>Team</h1>
      <p className="team-intro">
        {"// hover or tap a card to see who's behind the commits"}
      </p>

      <div className="team-tree">
        {tiers.map((tier) => {
          const members = teamMembers.filter((m) => m.tier === tier.level);
          if (members.length === 0) return null;
          return (
            <section key={tier.level} className="tier" aria-label={tier.label.replace("_", " ")}>
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