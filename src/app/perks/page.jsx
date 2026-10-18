import { perks, perksNote } from "./perks";
import PerkDetails from "./PerkDetails";
import "./perks.css";

export const metadata = {
  title: "Perks | GCC",
  description:
    "GitHub programs and resources for students: Student Developer Pack, Campus Experts, Copilot, Codespaces, Skills, Classroom, and Community Exchange.",
};

export default function PerksPage() {
  return (
    <main className="perks-page">
      <header className="perks-header">
        <h1>Perks</h1>
        <p className="perks-subtitle">{"// GitHub programs & resources for students"}</p>
      </header>

      <ul className="perks-grid">
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
