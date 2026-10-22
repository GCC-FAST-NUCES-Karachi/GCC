# GCC Landing Page Design Reference

This document captures the landing-page direction from the GCC Figma handoff and notes how it maps to the current code. It is design guidance, not a claim that every Figma animation or sample is implemented. For implementation priorities, see [plan.md](plan.md).

## Visual language

- Near-black canvas with a subtle grid and global galaxy backdrop.
- Centered, responsive content with generous vertical spacing and readable contrast.
- Inter for headings/body and JetBrains Mono for paths, section labels, and terminal-style details.
- Dark bordered cards with restrained blue/green accents; green for primary actions and blue for links/active states.
- Code-inspired language should remain decorative and secondary to clear instructions.

## Page order

`Shared navbar → Hero → Core Functions → Highlights → Play → Upcoming Events → Join → Shared footer`

The current landing route is composed in `src/app/page.jsx`; section components are in `src/app/landing/LandingSections.jsx` and their stylesheet is `src/app/landing/landing.css`.

## Sections

### Hero

The hero presents “Ideas become code. Students become builders.” as a concise headline, short supporting copy, and two paths: “See what we do” links to Core Functions and “Meet the community” links to Join. Keep the GitHub mark restrained and the galaxy/grid background decorative; maintain text contrast and retain a static/reduced-motion presentation.

### Core Functions

Four cards describe Hackathons, Workshops, Tech Talks, and Community. Each pairs a code-like filename and function label with an icon and short explanation. Cards should remain readable at mobile widths and have consistent pointer and keyboard feedback.

### Highlights

Responsive cards represent posts, tutorials, and recaps, with small type/hash metadata. Current preview art and copy are illustrative sample content in `src/content/highlights.js`. The “View all highlights” link currently leads to `/learn`; update it if a dedicated highlights destination is introduced.

### Play / arcade

The design originally described a not-yet-selected game placeholder. The current section promotes the playable Commit Snake game at `/games/commit-snake` and links to the arcade contribution section at `/games#contribute`. Keep the game teaser truthful and make controls/instructions available on the game route.

### Upcoming Events

The landing page and `/events` share `EventsList`. Event data is maintained in `src/content/events.js`. Preserve the empty state when there are no upcoming items. Confirm event details and RSVP URLs before release.

### Join and footer

The landing Join section uses a mailto CTA. The shared footer supplies navigation, community/build links, social icons, and metadata. Verify club-owned external destinations and contact details before release.

## Motion and Easter egg reference

The landing is wrapped in `src/components/effects/InfiniteLoop.jsx`. Four progress interstitials lead to `BugFinale`, which cracks and shatters the screen and transitions to `/terminal`; discovery is persisted in local storage. Review scroll lock, Escape behavior, reduced-motion handling, and navigation recovery whenever this interaction changes.

`RevealOnScroll` is used for the Play section and supports reduced motion. The global galaxy has its own reduced-motion behavior. Decorative effects must never hide content or be required to reach the terminal, arcade, or page navigation.

## Current component map

| Area | Implementation |
| --- | --- |
| Landing composition | `src/app/page.jsx` |
| Core Functions, Highlights, Play, Events, Join | `src/app/landing/LandingSections.jsx` |
| Landing-specific presentation | `src/app/landing/landing.css` |
| Highlights source data | `src/content/highlights.js` |
| Event source data and shared renderer | `src/content/events.js`, `src/components/events/EventsList.jsx` |
| Galaxy, reveal, and loop/Easter egg effects | `src/components/effects/GalaxyBackground.jsx`, `src/components/effects/RevealOnScroll.jsx`, `src/components/effects/InfiniteLoop.jsx`, `EasterBug.jsx`, `BugFinale.jsx` |
| Shared navbar and footer | `src/components/layout/` |
| Terminal | `src/components/terminal/`, with standalone route in `src/app/terminal/` |

## Handoff checks

- Verify phone/tablet layout in the running implementation; desktop Figma frames do not define every responsive state.
- Replace sample event/highlight content with approved material and verify all CTA destinations.
- Check keyboard focus, link names, reduced motion, contrast, and narrow-screen overflow.
- Keep Figma animation notes and placeholder annotations out of user-facing page copy.
