import { perks, perksNote } from "./perks";
import PerkDetails from "./PerkDetails";
import { ArrowDown } from "lucide-react";
import "./perks.css";

export const metadata = {
  title: "Perks",
  description:
    "GitHub programs and resources for students: Student Developer Pack, Campus Experts, Copilot, Codespaces, Skills, Classroom, and Community Exchange.",
};

export default function PerksPage() {
  return (
    <main id="main-content" className="perks-page">
      <header className="perks-header" aria-labelledby="perks-title">
        <div className="perks-hero-copy">
          <p className="perks-subtitle">{"// git checkout perks"}</p>
          <h1 id="perks-title">More tools for <span>what you build.</span></h1>
          <p className="perks-intro">Explore GitHub programs and resources that help students learn, build, and bring projects to life.</p>
          <a className="perks-hero-link" href="#perks-list">Explore student perks <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </header>

      <ul className="perks-grid" id="perks-list">
        {perks.map((perk) => (
          <li key={perk.id} className="perk-card">
            <div className="perk-card-meta">
              <span className="perk-file">{perk.file}</span>
              <span className="perk-index" aria-hidden="true" />
            </div>

            <div className="perk-card-grid">
              <div className="perk-main-grid">
                <section className="perk-intro">
                  <h2>{perk.title}</h2>
                  <p className="perk-desc">{perk.description}</p>
                </section>

                <div className="perk-category" aria-label={`Category: ${perk.category}`}>
                  <span className="perk-tile-label">Type</span>
                  <span>{perk.category}</span>
                </div>
              </div>

              <div className="perk-bottom-grid">
                <section className="perk-benefits">
                  <h3 className="perk-tile-label">Benefits</h3>
                  <ul>
                    {perk.benefits.slice(0, 2).map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </section>

                <PerkDetails steps={perk.steps} />
              </div>
            </div>

            <a
              className="perk-btn"
              href={perk.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${perk.cta}: ${perk.title} (opens in a new tab)`}
            >
              <span>{perk.cta}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="perks-note">{perksNote}</p>
    </main>
  );
}
