# GCC Website — Implementation Plan

## Project snapshot

The repository is a JavaScript/JSX Next.js App Router application. It has a shared responsive shell, landing page, Events/Learn/Team/Perks routes, a playable arcade game, and a simulated Git terminal. This plan starts from the implementation that is in the repository now; see [plan.md](plan.md) for status and [design.md](design.md) for the design reference and implementation comparison.

## Route and feature map

| Route / feature | Current implementation | Source of truth |
| --- | --- | --- |
| `/` | Hero, Core Functions, sample Highlights, Play/arcade teaser, upcoming events, Join section; wrapped by `InfiniteLoop` | `src/app/page.jsx`, `src/app/landing/`, `src/content/highlights.js`, `src/content/events.js` |
| `/events` | Shared event list with upcoming items and empty state | `src/app/events/`, `src/components/events/EventsList.jsx`, `src/content/events.js` |
| `/learn` | Learning paths and selected student resources | `src/app/learn/`, `src/app/perks/perks.js` |
| `/team` | Roster grouped by tiers with member cards and portraits | `src/app/team/`, `src/content/team.js`, `src/app/team/MemberCard.jsx` |
| `/perks` | GitHub programs/resources with expandable details | `src/app/perks/` |
| `/games` | Arcade directory and contribution section | `src/app/games/page.jsx`, `src/app/games/games.css`, `games.md` |
| `/games/commit-snake` | Keyboard, touch-pad, and swipe playable game; per-device records | `src/app/games/commit-snake/` |
| `/terminal` and navbar terminal | Safe simulated terminal with virtual files, branch navigation, clues, challenge, history, onboarding, and session persistence | `src/app/terminal/`, `src/components/terminal/` |
| Shared shell | Galaxy, navigation, footer, terminal context and overlay | `src/app/layout.jsx`, `src/components/layout/`, `src/components/effects/GalaxyBackground.jsx`, `src/components/terminal/` |

## Working conventions

- Keep route-specific styles beside their route and shared component styles beside the component. Shared tokens live in `src/styles/tokens.css`; global behavior belongs in `src/app/globals.css`.
- Keep the project in JavaScript/JSX. Do not add TypeScript or a dependency for a small local feature without a clear need.
- Keep terminal commands simulated. Never connect them to the host shell, repository, or filesystem.
- Keep interactive controls keyboard-usable, labeled, visibly focused, responsive, and compatible with reduced motion.
- Treat sample content and provisional external URLs as content requiring verification, not as approved facts.

## Next implementation sequence

### 1. Content and destination audit

Review `src/content/events.js`, `src/content/highlights.js`, `src/content/team.js`, `src/app/perks/perks.js`, terminal virtual files in `src/components/terminal/terminalData.js`, plus links in the navbar/footer and page components. Confirm names, descriptions, dates, RSVP targets, social accounts, Join contact, and footer destinations with the club. Keep clearly provisional data until approved and avoid presenting invented details as real.

**Done when:** the site has an owner-approved content source and destination for each public claim and call to action, or explicitly identifies missing information.

### 2. Responsive and accessibility review

Review the shared shell and all routes at narrow/mobile, tablet, laptop, and wide desktop widths. Check overflow, content order, image sizing, game controls, terminal sizing, focus management, labels, heading hierarchy, contrast, reduced-motion behavior, and restoration of focus/scroll when closing the terminal.

**Done when:** essential content and controls work without a pointer, without animation, and at supported viewport widths.

### 3. Review the implemented landing loop and Easter egg

`src/components/effects/InfiniteLoop.jsx` wraps the landing route. Four loop progress interstitials lead to `BugFinale`, which cracks/shatters the screen and transitions to `/terminal`. The discovered state is persisted in local storage. Review the current behavior against product intent, including scroll lock, Escape, reduced motion, persistence, and navigation recovery, before changing it.

**Done when:** the intended behavior is explicit in the docs and the shipped effect has a reliable recovery/exit path.

### 4. Extend the arcade when there is a selected game

The current hub lists Commit Snake. Follow [games.md](../games.md) to add a focused route, clear rules and controls, and a truthful hub entry. Keep the landing Play panel linked to the actual game and contribution route.

**Done when:** each listed game is reachable, playable, and accurately described in both the UI and game guide.

### 5. Production metadata and release readiness

Confirm the production hostname before setting canonical URLs or sitemap/robots policy. Review route metadata in `src/app/**/page.jsx`, root metadata in `src/app/layout.jsx`, icon assets, social previews, external links, and brand downloads. Run the lint/build scripts and inspect the main routes, console, responsive behavior, and accessibility before release.

**Done when:** production identity, links, metadata, content, and release checks are verified.

## Open decisions

- Is the infinite-loop interaction intended to stay, and what should its exact user-visible behavior be?
- Should the current four-pass Easter egg and terminal transition remain as implemented?
- What are the approved club-owned GitHub/social URLs and production domain?
- Are event, team, and highlight samples final, or should they be replaced with verified content?
- What additional arcade game should be built, if any?
