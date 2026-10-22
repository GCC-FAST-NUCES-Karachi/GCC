# GitHub Campus Club FAST-NUCES

The GitHub Campus Club website and community arcade, built with Next.js App Router, React, and plain JavaScript.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run lint
npm run build
npm run start
```

## Routes

- `/` — landing page with club overview, highlights, upcoming events, and a link to the arcade.
- `/learn` — learning paths and selected external resources.
- `/events` — upcoming events and an empty state when no events are available.
- `/team` — faculty mentors and student leadership directory.
- `/perks` — GitHub programs and student resources.
- `/games` — arcade hub and game contribution guide.
- `/games/commit-snake` — playable Commit Snake game.
- `/games/bug-bash` — playable Bug Bash game.
- `/terminal` — simulated, read-only Git terminal and exploration puzzle.

The shared navbar and footer are part of the site shell. The terminal can also be opened from the navbar. It simulates a virtual repository and never runs shell commands or accesses the real filesystem.

## Project guidance

- [Progress and remaining work](docs/plan.md)
- [Sequenced implementation plan](docs/implementation-plan.md)
- [Design specification and current implementation map](docs/design.md)
- [Landing page design reference](docs/landingpage_design.md)
- [Arcade contribution guide](games.md)
- [Contributing](CONTRIBUTING.md)

The project uses JavaScript/JSX rather than TypeScript. Fonts are hosted locally; reusable colors and typography are defined in `src/styles/tokens.css`.
