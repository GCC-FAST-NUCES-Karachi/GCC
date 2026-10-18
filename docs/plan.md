# GCC Website — Progress and Plan

This document tracks the repository's current implementation and product work still needed. For the intended visual direction, see [design.md](design.md) and [landingpage_design.md](landingpage_design.md). The code is authoritative for shipped behavior; Figma-derived details below are design references, not proof that a behavior is implemented.

## Current progress

- Next.js App Router, React, and JavaScript/JSX form the application foundation. Inter and JetBrains Mono are served locally, with shared tokens in `src/styles/tokens.css`.
- The shared shell includes responsive navigation, footer, a global canvas galaxy, and a terminal provider.
- The landing page includes the hero, Core Functions, sample Highlights, an arcade teaser, the shared upcoming-events list, and a Join mail link.
- `/events` renders the shared events list and its empty state. Current events are maintained in `src/content/events.js`; verify event details and RSVP destinations before public release.
- `/learn` presents three learning paths, selected GitHub student resources, and a link to Events.
- `/team` presents the roster from `src/content/team.js` with local team portraits.
- `/perks` presents GitHub programs and student resources from `src/app/perks/perks.js`.
- `/games` is the arcade hub. `/games/commit-snake` is playable with keyboard, on-screen direction controls, and swipe input; local storage keeps best-score records on the current device.
- `/terminal` and the navbar terminal control open a simulated, read-only Git terminal. It has command history, tutorial/onboarding, virtual branch files, clues, an unlock flow, and a final challenge. State is saved in session storage.
- The landing loop includes four progress interstitials and a crack/shatter finale that opens `/terminal`; discovery is persisted in local storage. Review its scroll-lock and reduced-motion behavior when tuning it.
- Landing highlights, terminal repository text, events, and some social/footer destinations are sample or provisional content. Confirm them before release.

## Remaining work

### 1. Verify content and destinations

- Confirm event information, RSVP destinations, team names/roles, learning copy, and the accuracy of claims across the site.
- Review GitHub/social links, Join email address, footer destinations, highlight links, and downloadable brand assets. Replace any generic or personal-account destinations with approved club destinations.
- Decide whether sample highlights and terminal puzzle history are intentionally fictional and label/update them as needed.

### 2. Responsive and accessibility review

- Review navigation, galaxy, landing sections, route layouts, arcade controls, and terminal at phone, tablet, laptop, and wide desktop widths.
- Check keyboard access, visible focus, screen-reader names, heading/landmark structure, contrast, touch targets, page overflow, and terminal focus/scroll restoration.
- Check the galaxy and game performance on mobile hardware and preserve the existing reduced-motion paths.

### 3. Review the landing-loop and Easter egg

- The loop, four progress interstitials, and crack/shatter finale are implemented. Confirm that the endless scroll, progress prompts, and terminal transition remain the desired behavior.
- Review the finale's scroll lock, Escape path, reduced-motion behavior, and local-storage persistence. Adjust implementation and docs together if product intent changes.

### 4. Grow the arcade

- Commit Snake is the only listed game. Add games through the route structure and hub entry described in [games.md](../games.md).
- Keep the landing Play section as an entry point to the playable game and arcade contribution path; it is no longer a game placeholder.

### 5. Release readiness

- Confirm the canonical production domain and add canonical/social metadata, sitemap, and robots policy when known.
- Review page metadata, favicon, external links, downloads, browser console output, responsive behavior, and accessibility before release.
- Re-run `npm run lint` and `npm run build` after implementation changes.

## Scope notes

- The site currently uses sample event content and some provisional external destinations; confirm these before launch.
- The terminal is a safe simulation. Its commands operate only on the in-memory/session-persisted virtual repository.
- The arcade is live with Commit Snake; future games are not committed to scope until selected and implemented.
- The landing infinite loop, four progress interstitials, and crack/shatter finale are implemented; the finale routes to `/terminal` and disables the loop after discovery.
