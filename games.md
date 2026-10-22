# GCC Arcade: Game Guide

The arcade lives at `/games`. It is a collection of small, self-contained games that share the GCC site shell and visual language. Read this guide when playing, maintaining, or adding an arcade game.

## Find and play a game

1. Open `/games` to see the available games, their status, and a short description of the goal and controls.
2. Choose a game to open its own route. Each game should explain its rules and controls on the page, so players do not need this guide beside them.
3. Use the visible controls or keyboard controls shown in that game. On a phone, use touch controls where provided. Use the in-game link to return to the arcade.

## Current games

| Game | Route | Goal and controls |
| --- | --- | --- |
| Commit Snake | `/games/commit-snake` | Collect 15 commits before the run ends. Use arrow keys or WASD, the on-screen direction pad, or swipe on the board. Press Space to start or pause; press R to restart an active or completed run. |
| Octo Dive | `/games/octo-dive` | Answer 15 multiple-choice GitHub and Git questions before the 15-second timer runs out. Tap one of the 4 coloured answer tiles or press 1–4 / A–D. Speed bonus + streak bonus reward quick correct answers. Total score equals depth in metres. |
| Bug Bash | `/games/bug-bash` | Keep the build green for as long as you can. Click or tap bugs to squash them, or hold and drag to slash several. Keyboard players can Tab to a chip and press Enter. Press Space to start or pause, R to reset, and M to mute. |

Commit Snake pickups expire after 10 seconds and move to another open cell without a penalty. The board wraps at its edges. Hitting a GCC block or the snake's own body ends the run. The snake speeds up as commits are collected. The game saves the best score and fastest winning time in the browser's local storage on that device.

Bug Bash chips fall down a code file, and a bug escapes when it reaches the bottom. Set `CHIP_FALL` to `false` in `src/app/games/bug-bash/config.js` to make chips pop up in place on the code lines instead. An escaped bug, a hit on working code or a feature, or a surviving boss costs 1 of 3 build health. Hitting a ⚠ command such as `git push --force` ends the run at once. Every 3 squashes in a row raise the score multiplier, and reaching ×5 starts fever mode for double points. Bigger bugs take several hits, split bugs break into two smaller ones that cost only 0.25 build health each if they escape, and disguised bugs look like code with a wavy red underline. Power-ups restore health, slow time, or fix every bug on screen. A `legacy_monolith.js` boss appears after 40 seconds and then about once a minute. The game gets faster for the first 90 seconds; tune the pace with the progression values in `src/app/games/bug-bash/config.js`. It saves the best score and the sound setting in local storage on that device.

## How the arcade is organized

- `src/app/games/page.jsx` renders the arcade hub and its game cards. Its `games` list is the directory of games currently shown on the page.
- `src/app/games/games.css` contains styles shared by the arcade hub and games.
- Each game has a route folder under `src/app/games/`. For example, Commit Snake is in `src/app/games/commit-snake/` and Bug Bash is in `src/app/games/bug-bash/`.
- A route's `page.jsx` should stay small: export page metadata and render the game component.
- Put game behavior in a client component (`"use client"`) when it needs browser APIs, state, input events, canvas, or animation. Keep reusable, non-UI constants in a nearby `config.js` when that makes the game easier to maintain.

The current styling references are [the design specification](docs/design.md), [the landing-page design reference](docs/landingpage_design.md), [shared CSS tokens](src/styles/tokens.css), [global styles](src/app/globals.css), and [arcade styles](src/app/games/games.css). To make the best use of them:

1. Use the CSS custom properties such as `--bg-base`, `--bg-card`, `--border-default`, `--text-body`, `--accent-blue`, and `--accent-green` for colors. This keeps new games aligned when the palette changes.
2. Use `var(--font-sans)` for readable copy and `var(--font-mono)` for short commands, status labels, and code-like details.
3. Reuse existing game layout and control styles when they fit. Put new game-specific rules in `games.css` with a game-specific class prefix to avoid affecting other routes.
4. Treat code-like labels as decoration around clear game instructions. Players should understand the goal without decoding terminal jokes.
5. Keep animation optional: honor `prefers-reduced-motion`, and do not use motion to communicate information that has no static equivalent.

The design documents include both implemented behavior and older or aspirational notes. For the arcade, follow the current code and this guide where a document describes an unimplemented feature or a different game concept.

## Add a game

1. **Choose a route and scope.** Pick a short lowercase URL slug, such as `word-branch`. Keep the first version small enough to explain and play in a few minutes. Avoid adding a package unless the game needs it.

2. **Create the route and game component.** Use this shape:

   ```text
   src/app/games/<slug>/
   ├── page.jsx       # metadata and route composition
   ├── <game>.jsx     # interactive client component
   └── config.js      # optional shared constants
   ```

   `page.jsx` can import the shared game stylesheet with `import "../games.css";`. Export `metadata` with a concise title and description. Put `"use client"` at the top of the component file only if that component needs client-side React or browser features.

3. **Design the play experience.** Include the objective, rules, controls, start/restart behavior, and a clear result state. Support keyboard and touch when practical; do not make a keyboard-only game the sole option on mobile. Make focus visible and provide accessible names for controls. Pause safely when the tab is hidden if the game has a real-time loop, and respect reduced-motion preferences.

4. **Use the shared visual system.** Start with the CSS tokens and existing arcade classes. Keep the game readable at narrow widths, make interactive targets easy to use, and scope any new selectors so the game cannot restyle the hub or other games.

5. **Add it to the hub.** In `src/app/games/page.jsx`, add an entry to the `games` array with:
   - `href` matching the new route;
   - a short name and command label;
   - a truthful status such as `PLAYABLE` only when the game is ready;
   - a one-sentence description;
   - concise goal, expected run time, and control details;
   - a small preview component if the game has a useful static preview.

   The first entry is rendered as the featured game; later entries appear in the secondary grid. If the featured game changes, confirm its preview and hub layout still make sense.

6. **Run and inspect the project.** From the repository root:

   ```bash
   npm run dev
   npm run lint
   npm run build
   git diff --check
   ```

   Open `/games` and the new route. Play through start, pause/resume if supported, failure, and success states. Check desktop and narrow mobile layouts, keyboard use, and touch behavior. `npm run build` can take longer than lint because it compiles the full Next.js application.

7. **Document and propose the change.** Add the game to the current games table in this guide. Follow [CONTRIBUTING.md](CONTRIBUTING.md) to create a branch and open a focused pull request. Include screenshots or a recording for visual changes and describe the tested controls.

## Before opening the pull request

- The game can be reached from `/games` and has a working return link.
- The goal, controls, and all important game states are clear in the interface.
- Keyboard, touch, focus, responsive layout, and reduced-motion behavior have been checked as applicable.
- No secrets or generated files were added.
- The game list and this guide describe the current behavior accurately.
