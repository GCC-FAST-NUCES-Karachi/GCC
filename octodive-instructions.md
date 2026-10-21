Build a new arcade game for the GCC (GitHub Campus Club FAST-NUCES) Next.js site: "Octo Dive", a GitHub-themed, Krillion.io-style game where rarer valid answers score more, and Octocat dives deeper as you score.

FIRST: read games.md, CONTRIBUTING.md, docs/design.md, docs/landingpage_design.md, src/styles/tokens.css, src/app/globals.css, src/app/games/games.css, src/app/games/page.jsx and the existing src/app/games/commit-snake/ folder. Follow their conventions exactly. Give me a short plan (files to create or edit) before writing code.

STACK AND RULES
- Next.js + plain JavaScript (no TypeScript). No new npm packages.
- Route: /games/octo-dive. Layout: src/app/games/octo-dive/page.jsx (metadata + render the game only), octo-dive.jsx ("use client" game component), config.js (prompts, answer bank, scoring constants), octocat-diver.jsx (the character).
- Styles go in src/app/games/games.css with an "octo-" class prefix. Use CSS tokens (--bg-base, --bg-card, --border-default, --text-body, --accent-blue, --accent-green, etc.) and var(--font-sans) / var(--font-mono). If I need new colors (ocean depths), add tokens to src/styles/tokens.css instead of hardcoding hex values. Do not add a new font.
- Theme: cute and retro, chunky borders, pixel-style feel, readable at narrow mobile widths. Code-like labels are decoration only; the goal and rules must be plain and visible on the page. Please make it feel seamlessly integrated to match the rest of the webpage's theme.
- Add the game to the `games` array in src/app/games/page.jsx (do NOT make it the featured first entry; keep Commit Snake first). Status PLAYABLE only if it is fully working. Add a row for it to the games table in games.md.
- No backend, no secrets, no generated files.

GAMEPLAY
- A run has 6 timed rounds of 25 seconds. Each round shows a prompt such as "Name a Git command" or "Name a programming language".
- The player types answers and presses Enter or a Submit button. They can submit as many different valid answers as they can before the timer ends.
- Each prompt in config.js has an answer bank of about 25 answers, each with a canonical name, a few aliases, and a rarity tier: common = 10 pts, uncommon = 25, rare = 50, legendary = 100. Valid answers show their points and tier. Duplicates are ignored with a gentle message. Invalid answers shake the input, with no penalty.
- Write 8 prompts (6 are picked randomly per run) covering: Git commands, programming languages, GitHub features, famous open-source projects, code editors/IDEs, developer tools, terminal/Linux commands, and developer culture. All answers must be accurate and appropriate for a university audience.
- Matching is forgiving: lowercase, trim, strip punctuation, match aliases, and allow a one-letter typo for answers 5+ characters long. Implement this by hand.
- Octocat diver: total score = depth in meters. Octocat sinks smoothly down a vertical ocean that changes through 4 zones (sunlit, twilight, midnight, abyss) as depth grows. Show a depth meter and a score counter.
- End screen: final score, depth reached, a rank title (e.g. Surface Skimmer, Reef Explorer, Deep Diver, Abyss Legend), the player's rarest answer, personal best (saved in localStorage), a "Copy result" button that copies a shareable text like "I dove 340m in Octo Dive with 480 pts" so friends can compare, and a Play again button.
- Start screen with a clear goal, rules and controls. Include a "How scoring works" line explaining rarity.

OCTOCAT
- Octocat must be a self-contained SVG component (octocat-diver.jsx) wearing a little diving helmet, with idle bobbing and small bubbles. Do NOT download, trace or copy GitHub's official Octocat artwork. Draw a simple original cat-octopus placeholder. Keep it in one clearly named component so I can swap in the official asset later.

ACCESSIBILITY AND QUALITY
- Keyboard and touch both work. Visible focus, accessible names on all controls, input has a label, timer and score changes are announced politely (aria-live).
- Honor prefers-reduced-motion: depth changes become instant and bubbles/bobbing stop. Pause the round timer when the tab is hidden.
- No motion-only information: depth is also shown as a number.
- Include a working link back to /games.

FINISH
Run npm run lint, npm run build and git diff --check and fix any problems. Then play through a full run in the browser: start, valid/duplicate/invalid answers, timer ending, last round, end screen, replay, at desktop and narrow mobile width. Finally, draft a PR description (user-visible change, checks run, controls tested). Use branch name feat/octo-dive.