import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Clock,
  GitBranch,
  GitPullRequest,
  Keyboard,
  MousePointerClick,
  Target,
} from "lucide-react";
import { siGithub } from "simple-icons";
import { contributorHref, gameHref, games } from "@/content/games";
import { GAMES_GUIDE_URL } from "@/content/site";
import "./games.css";

export const metadata = {
  title: "Games",
  description: "Play small games made by the GitHub Campus Club community.",
};

const META_ICONS = { goal: Target, time: Clock, keyboard: Keyboard, pointer: MousePointerClick };

const steps = [
  { Icon: BookOpen, title: "Read the game guide", text: "See how a game plugs into the arcade." },
  { Icon: GitBranch, title: "Make a branch", text: "Build your game on its own branch." },
  { Icon: GitPullRequest, title: "Open a pull request", text: "We review it and add it to the arcade." },
];

export default function GamesPage() {
  return (
    <main id="main-content" className="games-page">
      <header className="games-hero">
        <p className="games-kicker">{"// gcc arcade · community builds"}</p>
        <h1>
          Take a break.<br />
          <span>Ship a high score.</span>
        </h1>
        <p className="games-intro">Small games made by the club, for the club. Pick one to play, or help us add the next one.</p>
        <div className="games-hero-actions">
          <a href="#games-list" className="games-btn games-btn-primary">
            Browse games <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a className="games-btn games-btn-outline" href="#contribute">
            <GitPullRequest size={16} aria-hidden="true" /> Contribute a game
          </a>
        </div>
      </header>

      <section id="games-list" className="games-list" aria-labelledby="games-list-heading">
        <div className="games-list-heading">
          <div>
            <p className="games-kicker">{"$ ls ./games"}</p>
            <h2 id="games-list-heading">
              Available games <span>({games.length})</span>
            </h2>
          </div>
          <span className="games-live"><i /> ARCADE ONLINE</span>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <article key={game.slug} className="game-card">
              <div className="game-card-top"><span className="game-status"><i />PLAYABLE</span><code>{`$ ./play ${game.slug}`}</code></div>
              <h3>{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <ul className="arcade-meta">
                {game.meta.map(({ icon, label, value }) => {
                  const Icon = META_ICONS[icon];
                  return <li key={label}><Icon size={16} aria-hidden="true" /><span>{label}</span><strong>{value}</strong></li>;
                })}
              </ul>
              <div className="game-card-footer">
                <div className="game-contributor-group" aria-label={`Contributors to ${game.name}`}>
                  <span className="game-contributors-label">Contributed by</span>
                  <div className="game-contributors">
                    {game.contributors.map((contributor) => (
                      <a key={contributor.username} href={contributorHref(contributor)} target="_blank" rel="noreferrer" aria-label={`${contributor.username} on GitHub`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siGithub.path} /></svg><span>{contributor.username}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="game-card-action">
                  <Link href={gameHref(game)} className="arcade-cta">Play now <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contribute" className="arcade-contribute" aria-labelledby="contribute-heading">
        <div className="arcade-contribute-head">
          <p className="games-kicker">{"// your branch, your rules"}</p>
          <h2 id="contribute-heading">Build the next game</h2>
        </div>
        <ol className="arcade-steps">
          {steps.map(({ Icon, title, text }) => (
            <li key={title}>
              <span className="arcade-step-icon"><Icon size={18} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <a className="arcade-contribute-link" href={GAMES_GUIDE_URL} target="_blank" rel="noreferrer">
          How to contribute <ArrowRight size={15} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
