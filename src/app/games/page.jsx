import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Clock,
  GitBranch,
  GitPullRequest,
  Keyboard,
  Target,
} from "lucide-react";
import { BLOCK_LIST, COLS, ROWS } from "./commit-snake/config";
import "./games.css";

export const metadata = {
  title: "Games",
  description: "Play small games made by the GitHub Campus Club community.",
};

const PREVIEW_SNAKE = [9, 8, 7, 6, 5, 4].map((x) => ({ x, y: 12 }));
const PREVIEW_FOOD = { x: 13, y: 12 };

function SnakePreview() {
  return (
    <svg className="arcade-preview-svg" viewBox={`0 0 ${COLS} ${ROWS}`} aria-hidden="true">
      <defs>
        <pattern id="preview-grid" width="1" height="1" patternUnits="userSpaceOnUse">
          <path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgb(88 166 255 / 8%)" strokeWidth="0.03" />
        </pattern>
      </defs>
      <rect width={COLS} height={ROWS} fill="#080d12" />
      <rect width={COLS} height={ROWS} fill="url(#preview-grid)" />
      {BLOCK_LIST.map(({ x, y }) => (
        <rect key={`${x},${y}`} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" rx="0.15" fill="#38404a" stroke="#525a65" strokeWidth="0.04" />
      ))}
      {PREVIEW_SNAKE.map(({ x, y }, i) => (
        <rect key={x} x={x + 0.1} y={y + 0.1} width="0.8" height="0.8" rx="0.2" fill={i === 0 ? "#56d364" : "#2ea043"} />
      ))}
      <rect className="arcade-preview-food" x={PREVIEW_FOOD.x + 0.33} y={PREVIEW_FOOD.y + 0.33} width="0.34" height="0.34" rx="0.05" fill="#3fb950" transform={`rotate(45 ${PREVIEW_FOOD.x + 0.5} ${PREVIEW_FOOD.y + 0.5})`} />
    </svg>
  );
}

const games = [
  {
    href: "/games/commit-snake",
    name: "Commit Snake",
    command: "./play commit-snake",
    status: "PLAYABLE",
    description: "Collect commits before they expire, dodge the GCC blocks and ship the release. Every commit makes you faster.",
    meta: [
      { Icon: Target, label: "Goal", value: "15 commits" },
      { Icon: Clock, label: "Run time", value: "about 2 min" },
      { Icon: Keyboard, label: "Controls", value: "Keys or swipe" },
    ],
    Preview: SnakePreview,
  },
];

const CONTRIBUTE_URL = "https://github.com/ismailsilat7/ghcc/blob/main/games.md";

const steps = [
  { Icon: BookOpen, title: "Read the game guide", text: "See how a game plugs into the arcade." },
  { Icon: GitBranch, title: "Make a branch", text: "Build your game on its own branch." },
  { Icon: GitPullRequest, title: "Open a pull request", text: "We review it and add it to the arcade." },
];

export default function GamesPage() {
  const [featured, ...others] = games;

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

        <article className="arcade-feature">
          <div className="arcade-feature-copy">
            <span className="game-status"><i />{featured.status}</span>
            <p className="game-command">{`$ ${featured.command}`}</p>
            <h3>
              <Link href={featured.href} className="arcade-stretched">{featured.name}</Link>
            </h3>
            <p className="game-description">{featured.description}</p>
            <ul className="arcade-meta">
              {featured.meta.map(({ Icon, label, value }) => (
                <li key={label}>
                  <Icon size={16} aria-hidden="true" />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
            <span className="arcade-cta">Play now <ArrowRight size={16} aria-hidden="true" /></span>
          </div>
          <div className="arcade-preview" aria-hidden="true">
            <div className="arcade-preview-bar"><i /><i /><i /><span>commit-snake</span></div>
            <featured.Preview />
          </div>
        </article>

        {others.length > 0 && (
          <div className="games-grid">
            {others.map((game) => (
              <Link key={game.name} href={game.href} className="game-card">
                <span className="game-status"><i />{game.status}</span>
                <p className="game-command">{`$ ${game.command}`}</p>
                <h3>{game.name}</h3>
                <p className="game-description">{game.description}</p>
                <span className="arcade-cta">Play now <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        )}
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
        <a className="arcade-contribute-link" href={CONTRIBUTE_URL} target="_blank" rel="noreferrer">
          How to contribute <ArrowRight size={15} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}