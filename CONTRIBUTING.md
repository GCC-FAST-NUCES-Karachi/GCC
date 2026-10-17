# Contributing to GCC

Thanks for helping build the GitHub Campus Club FAST-NUCES website and arcade. Contributions can improve the site, add a game, fix an issue, or make the docs clearer.

## First contribution

1. Fork the repository on GitHub, then clone your fork. If you already have repository access, clone it directly.

   ```bash
   git clone https://github.com/<your-account>/ghcc.git
   cd ghcc
   ```

2. Install the project dependencies and start the development server:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Next.js usually reloads the page when you save a file.

3. Create a focused branch from the current `main` branch:

   ```bash
   git switch main
   git pull origin main
   git switch -c feat/short-description
   ```

   Use `fix/` for a bug fix and `docs/` for documentation-only work. If you cloned a fork, check that `origin` points to your fork; add the club repository as `upstream` if you need to pull its latest `main`.

4. Make the change. Before committing, inspect the diff and run the checks:

   ```bash
   npm run lint
   npm run build
   git diff --check
   git status --short
   ```

   `npm run lint` runs ESLint; `npm run build` checks that Next.js can compile the site. The repository does not currently define a test script. For visual or interactive changes, also open the affected route locally and check it at desktop and narrow mobile widths.

5. Commit and push your branch:

   ```bash
   git add <files-you-changed>
   git commit -m "Describe the change"
   git push -u origin feat/short-description
   ```

6. Open a pull request against `main`. Explain the user-visible change, mention any related issue, list the checks you ran, and add before/after screenshots or a short recording for visual changes. Reply to review comments and update the PR until it is ready for a maintainer to merge.

## Where to find guidance

- [Visual design specification](docs/design.md) is the broad product and interaction reference, including color, typography, spacing, motion, accessibility expectations, and current implementation notes.
- [Landing page design reference](docs/landingpage_design.md) is the detailed landing-page handoff: page order, component appearance, and behavior.
- [Game contribution guide](games.md) explains how the arcade is organized and how to add a game.
- [Shared design tokens](src/styles/tokens.css) are the source of truth for reusable colors and font variables. Use the existing CSS variables instead of copying hex values into new components.
- [Global styles](src/app/globals.css) define base typography, focus rings, shared page behavior, and reduced-motion defaults.
- [Game styles](src/app/games/games.css) hold shared arcade and Commit Snake presentation styles. Reuse these for game pages where they fit; keep game-only selectors scoped with a clear prefix.

Use the design documents as working guidance, then check the live components for the current implementation. Some older design notes describe planned or sample content. When a design note and a reusable token disagree, keep the token centralized and update the source of truth instead of creating a one-off value.

## Contribution habits

- Keep each pull request focused and describe trade-offs or unfinished parts clearly.
- Prefer the existing Next.js, React, and plain JavaScript patterns. The project uses JavaScript rather than TypeScript.
- Reuse shared components and CSS tokens; avoid adding dependencies for small features.
- Make links and controls usable by keyboard, give icon-only controls accessible names, and preserve visible focus styles.
- Keep layouts responsive and check reduced-motion behavior when adding animation.
- Never commit credentials, local environment files, `node_modules`, or generated build output such as `.next/`.

## Questions

If you are unsure where a change belongs, open an issue or draft pull request with a short proposal before building a large feature. For game-specific questions, start with [games.md](games.md).
