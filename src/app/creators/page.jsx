import "../team/team.css";
import { ArrowDown } from "lucide-react";
import MemberCard from "../team/MemberCard";
import { technicalGroups } from "../../content/contributors";

export const metadata = { title: "Creators" };

// Abhi Tech Dev ki team use ho rahi hai. Baad me sirf TEAM_TITLE ya data badal dena.

const TEAM_TITLE = "Tech Dev";

const PHOTOS = {
  "Ismail Silat": "/images/tech-dev/abd.jpeg",
  "Abdul Rahman": "/images/tech-dev/abd.jpeg",
  "Urwa Rafique": "/images/tech-dev/abd.jpeg",
  "Hamza Safdar": "/images/tech-dev/abd.jpeg",
};

const toMember = (person, i) => ({
  slug: `creator-${person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`,
  name: person.name,
  role: person.role,
  photo: PHOTOS[person.name], // undefined = default avatar
});

export default function CreatorsPage() {
  const group = technicalGroups.find((g) => g.title === TEAM_TITLE);
  const people = group ? group.members.map(toMember) : [];

  // Pehle Head, phir Co-Heads
  const heads = people.filter((m) => m.role === "Head");
  const coHeads = people.filter((m) => m.role !== "Head");

  return (
    <main id="main-content" className="team-page">
      <section className="team-hero" aria-labelledby="creators-title">
        <div className="team-hero-copy">
          <p className="eyebrow">{"// git log --author"}</p>
          <h1 id="creators-title">The creators behind <span>the site.</span></h1>
          <p className="team-intro">The people who designed, built, and maintain GCC’s digital home.</p>
          <a className="team-hero-link" href="#creators-directory">
            Meet the creators <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      <div className="team-tree" id="creators-directory">
        <section className="tier tier-level-0" aria-label={TEAM_TITLE}>
          <h2 className="tier-heading">{TEAM_TITLE}</h2>
          <p className="tier-label" aria-hidden="true">{"// head"}</p>
          <ul className="tier-row">
            {heads.map((m) => <MemberCard key={m.slug} member={m} />)}
          </ul>
        </section>

        {coHeads.length > 0 && (
          <section className="tier tier-level-1" aria-label={`${TEAM_TITLE} co-heads`}>
            <p className="tier-label" aria-hidden="true">{"// co-heads"}</p>
            <ul className="tier-row">
              {coHeads.map((m) => <MemberCard key={m.slug} member={m} />)}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
