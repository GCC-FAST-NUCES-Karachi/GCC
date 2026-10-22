import Link from "next/link";
import { ArrowRight, Clock, Keyboard, Target } from "lucide-react";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import SnakePreview from "@/components/games/SnakePreview";

const meta = [
  { Icon: Target, label: "Goal", value: "15 commits" },
  { Icon: Clock, label: "Run time", value: "about 2 min" },
  { Icon: Keyboard, label: "Controls", value: "Keys or swipe" },
];

// Replace the PlaySection export in LandingSections.jsx with this (or re-export it).
export function PlaySection() {
  return (
    <RevealOnScroll as="section" id="play" className="landing-section play-section" aria-labelledby="play-heading">
      <header className="landing-section-heading">
        <h2 id="play-heading">Play</h2>
        <p className="section-command">{"// ./play --arcade"}</p>
      </header>

      <article className="play-card">
        <Link href="/games/commit-snake" className="play-preview" tabIndex={-1} aria-hidden="true">
          <div className="play-preview-bar"><i /><i /><i /><span>commit-snake</span></div>
          <SnakePreview />
        </Link>

        <div className="play-copy">
          <span className="play-status"><i />PLAYABLE NOW</span>
          <p className="play-command">$ ./play commit-snake</p>
          <h3>Commit Snake</h3>
          <p className="play-description">Collect commits before they expire, dodge the GCC blocks and ship the release. Every commit makes you faster.</p>
          <ul className="play-meta">
            {meta.map(({ Icon, label, value }) => (
              <li key={label}>
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
                <strong>{value}</strong>
              </li>
            ))}
          </ul>
          <div className="play-actions">
            <Link href="/games/commit-snake" className="play-button">Play now <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/games" className="play-link">Browse the arcade</Link>
          </div>
        </div>
      </article>
    </RevealOnScroll>
  );
}