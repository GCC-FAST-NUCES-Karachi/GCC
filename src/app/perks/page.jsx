import { perks, perksNote } from "./perks";
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
            <span className="perk-file">{perk.file}</span>
            <h2>{perk.title}</h2>
            <p className="perk-desc">{perk.description}</p>

            <details className="perk-details">
              <summary>Benefits and how to get it</summary>
              <h3>Benefits</h3>
              <ul>
                {perk.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
              <h3>Steps</h3>
              <ol>
                {perk.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </details>

            <a
              className="perk-btn"
              href={perk.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${perk.cta}: ${perk.title} (opens in a new tab)`}
            >
              {perk.cta}
            </a>
          </li>
        ))}
      </ul>

      <p className="perks-note">{perksNote}</p>
    </main>
  );
}