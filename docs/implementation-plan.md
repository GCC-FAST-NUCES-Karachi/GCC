# GCC Website — Implementation Plan

## Project context

This repository contains the GitHub Campus Club FAST-NUCES website. It is a Next.js App Router application built with React and JavaScript/JSX. The visual direction is a dark, space-inspired developer community site: Inter for primary text, JetBrains Mono for code-like labels, GitHub-inspired blue and green accents, a canvas galaxy, and a responsive floating navbar.

The current implementation is a working visual foundation. The landing page and shared shell are present; Events, Learn, and Team are still placeholder routes. The navbar's terminal control is intentionally an inert button until the terminal is implemented. The Play area is a placeholder. The infinite loop, glitch, and breaking-glass effects are planned, not currently active. Keep content usable without decorative motion, and respect reduced-motion preferences.

## Routes and current state

| Route | Current state | Implementation target |
| --- | --- | --- |
| `/` | Hero, Core Functions, Highlights, Play placeholder, sample events, Join section | Complete the loop seam and requested effects; replace sample content when approved; implement a playable game after choosing one. |
| `/events` | Placeholder copy | Add approved upcoming/past event data, details, and working RSVP destinations. |
| `/learn` | Placeholder copy | Add approved workshops, tutorials, and learning resources. |
| `/team` | Placeholder copy | Add approved team roles, names, bios, and contact links. |
| Terminal overlay | Not implemented; navbar control is inert | Implement as an accessible modal/panel, then connect the navbar button. It is not a route. |

Shared navigation and footer appear on all routes. Do not invent real event links, member biographies, social destinations, or club facts; keep placeholders clear until confirmed.

## Folder structure

```text
docs/
  design.md                    Figma-derived design and interaction specification
  landingpage_design.md        Detailed landing-page visual reference
  plan.md                      Current progress, scope, and high-level plan
  implementation-plan.md       This sequenced engineering plan
src/
  app/
    layout.jsx                 Root metadata, local fonts, shared shell
    globals.css                Global reset, typography, accessibility, shared utilities
    page.jsx                   `/` landing route
    landing/
      LandingSections.jsx      Landing sections, sample event data, Play placeholder
      GccCat.jsx               Landing/event mascot
      landing.css              Landing hero and section styles
    events/
      page.jsx                 `/events`
      events.css               Events route styles
    learn/
      page.jsx                 `/learn`
      learn.css                Learn route styles
    team/
      page.jsx                 `/team`
      team.css                 Team route styles
  components/
    effects/
      GalaxyBackground.jsx     Canvas galaxy and scroll response
      RevealOnScroll.jsx       Reusable reveal behavior
      RevealOnScroll.css       Reveal effect styles
    layout/
      Navbar.jsx               Responsive shared navbar; terminal control is inert
      Navbar.css               Navbar and responsive menu styles
      Footer.jsx               Shared site footer
      Footer.css               Footer styles
    modals/                    Shared modal components (currently empty)
    ui/                        Shared UI components (currently empty)
  content/
    highlights.js              Landing highlight content
  styles/
    tokens.css                 Shared color and font tokens
public/
  fonts/                       Local Inter and JetBrains Mono font files and licenses
  images/                      Brand and banner images
  documents/brand/             Downloadable brand documents
```

Keep route-specific presentation in the route folder. Put styles beside reusable components. Put site-wide resets, shared typography, and design tokens in the shared styles. A new terminal or effect component should live with its reusable feature rather than adding feature-specific rules to `globals.css`.

## Reference files to read before changing the site

1. [`docs/design.md`](./design.md) — primary design/behavior specification from Figma, including the Animation Index, loop, glass-crack sequence, terminal states and commands, and open decisions.
2. [`docs/landingpage_design.md`](./landingpage_design.md) — detailed landing layout and visual behavior for navbar, hero, sections, loop seam, and Easter egg.
3. [`docs/plan.md`](./plan.md) — current implementation status, confirmed scope, and outstanding product work.
4. [`README.md`](../README.md) — local setup and scripts.
5. [`src/styles/tokens.css`](../src/styles/tokens.css), [`src/app/globals.css`](../src/app/globals.css), and the stylesheet beside the route/component being changed — current style foundations and ownership.
6. The route/component source named in the folder map above — current JSX structure and behavior.

When references disagree, use the current product decisions in `docs/plan.md` for scope and the Figma-derived documents for the intended visual direction. Keep unresolved items listed in the decision checklist below; do not silently turn a design annotation into user-facing copy.

## Next steps

### Phase 1 — Confirm content, destinations, and remaining decisions

**Files to review:** `docs/design.md`, `docs/landingpage_design.md`, `docs/plan.md`, `src/app/landing/LandingSections.jsx`, `src/content/highlights.js`, `src/components/layout/Navbar.jsx`, `src/components/layout/Footer.jsx`, and all three placeholder route files.

- Make a single inventory of every internal link, external link, social link, Join action, highlight link, and RSVP action.
- Replace incorrect or generic destinations only when the real URL is known. Clearly label any temporary destination.
- Confirm the event source, event details, RSVP method, Join flow, approved Learn content, Team roster, social URLs, production domain, and game choice.
- Keep the current sample events and placeholder RSVP links for development until those details are provided; flag them as not release-ready.

**Complete when:** every route and CTA has an owner and known destination, or is explicitly recorded as awaiting approved information.

### Phase 2 — Finish the four public routes and their content

**Files:** `src/app/events/page.jsx`, `src/app/events/events.css`, `src/app/learn/page.jsx`, `src/app/learn/learn.css`, `src/app/team/page.jsx`, `src/app/team/team.css`, `src/app/landing/LandingSections.jsx`, and `src/content/highlights.js`.

- Replace Events placeholder copy with an accessible upcoming/past events presentation driven by real event data.
- Replace Learn placeholder copy with approved resources, workshops, and learning paths.
- Replace Team placeholder copy with approved people/roles and contact information.
- Replace sample highlight copy/media and event data when real content is approved.
- Keep page-specific styling beside its route; extract repeated UI into shared components only when at least two routes genuinely use it.

**Complete when:** all routes have intentional content, responsive layouts, meaningful empty states, and valid links.

### Phase 3 — Validate responsive layout and accessibility before adding motion

**Files:** `src/components/layout/Navbar.jsx`, `src/components/layout/Navbar.css`, `src/components/layout/Footer.css`, the page stylesheets, `src/app/globals.css`, and `src/styles/tokens.css`.

- Check the navbar across desktop, tablet, and phone widths: centered link group on wide layouts, the compact left-aligned transition, then the hamburger menu; retain the inert terminal button, GitHub link, and Join CTA.
- Check Join button height, menu placement, focus visibility, no-overflow behavior, and tap targets on narrow screens.
- Review hero, galaxy, section widths, cards, event timeline, footer, and all page layouts at representative viewport widths.
- Verify keyboard navigation, screen-reader labels, landmarks/headings, contrast, and reduced-motion behavior.

**Complete when:** no supported viewport has clipped controls, horizontal page overflow, inaccessible navigation, or essential content hidden behind effects.

### Phase 4 — Implement the infinite loop and landing effects

**Design references:** Animation Index and L5/L6 in `docs/design.md`; loop seam and Easter egg in `docs/landingpage_design.md`.

**Likely files:** new focused components/styles under `src/components/effects/`, with integration in `src/app/page.jsx` or the relevant landing section in `src/app/landing/LandingSections.jsx`.

- First implement the infinite loop/seam as a progressive enhancement. Confirm whether it repeats only the landing page or spans routes, and confirm loop count before making it automatic.
- Add the multi-stage glitch and breaking-glass sequence as distinct effects: impact/tremor, branching cracks/light leaks, shatter, and recovery/terminal prompt as specified by the approved design.
- Provide an explicit reduced-motion/static path; do not trap scroll, block browser navigation, obscure text, or run the sequence for reduced-motion users.
- Keep effects session-safe and restore the visitor's scroll position after leaving any overlay.
- Test on iOS/mobile browsers before enabling automatic loop behavior; fall back to an explicit trigger if scroll behavior is unreliable.

**Complete when:** the effect is visually faithful, reversible, keyboard-safe, performant, and cannot prevent normal browsing.

### Phase 5 — Implement the terminal overlay and connect the navbar

**Design references:** Terminal T1–T5 and terminal command table in `docs/design.md`.

**Likely files:** `src/components/modals/TerminalModal.jsx` and its colocated stylesheet, plus `src/components/layout/Navbar.jsx` and `Navbar.css`. Add a provider only if shared state genuinely requires it.

- Implement the specified boot sequence and safe, simulated commands (`git help`, `git log --oneline`, `git branch`, `git status`, `cat README.md`, `ls`, `clear`, `exit`, and supported `git checkout` branches). Never execute shell commands.
- Make the panel a real accessible modal: focus entry/trap/restore, Escape and “go back” behavior, scroll restoration, and mobile sizing.
- Implement `main`, `learn`, `events`, `team`, `join`, and `secret` branches only after associated content and Join behavior are confirmed.
- Decide whether `secret` is a valid alias or whether the complete branch name must be entered; this remains open in `docs/design.md`.
- Connect the existing inert navbar button only after the overlay works end-to-end. Add a mobile/footer entry point if required by the approved design.

**Complete when:** the same terminal works with keyboard, pointer, touch, and screen reader, with predictable close and recovery paths.

### Phase 6 — Replace the Play placeholder with the selected game

**Files:** `src/app/landing/LandingSections.jsx` and a focused game component under `src/app/landing/` (or a shared component only if it will be reused elsewhere), with styles beside the game.

- Confirm the game, goals, session length, controls, and whether a leaderboard is needed before implementation.
- Replace the placeholder canvas with the game and clear instructions, start/restart controls, and completion state.
- Support keyboard and touch; ensure game input does not hijack page scrolling or conflict with terminal/loop interactions.
- Keep performance acceptable on mobile and provide a reduced-motion or non-animated experience.

**Complete when:** visitors can understand, start, play, and restart the game on phone and desktop without instructions outside the page.

### Phase 7 — SEO, metadata, production links, and release checks

**Files:** `src/app/layout.jsx`, route `page.jsx` files, and new Next.js metadata routes such as `src/app/sitemap.js` and `src/app/robots.js`; update `README.md` and `docs/plan.md` as deployment details are confirmed.

- Add accurate title/description metadata per route, canonical URLs, social sharing metadata/images, and a checked favicon.
- Add a sitemap and robots policy for the confirmed production domain; do not publish preview URLs as canonical.
- Verify all internal routes, organization/social links, event registration destinations, Join behavior, downloads, and footer links against their intended destinations.
- Run the project lint/build scripts, inspect production output, check browser console errors, and repeat accessibility/responsive checks after content and effects land.
- Confirm analytics/privacy needs and deployment environment before adding tracking or external services.

**Complete when:** the production domain, metadata, sitemap/robots, content, links, and responsive/accessibility checks are all verified.

## Decisions to resolve during implementation

- Does the infinite loop run four times, continue indefinitely, or only serve as a visual seam? Is it landing-only or site-wide?
- What exact conditions trigger the first crack and the shatter sequence?
- Is the terminal's `secret` branch an alias, or must the user enter a generated branch name?
- Is Join a mail link, a web form, a terminal flow, or more than one of these? Who receives submissions?
- What is the final Play game and which controls/platforms must it support?
- What are the canonical production URL and approved social/event/team/content destinations?
- Which mobile and tablet layouts are approved, and should the mobile galaxy remain animated after device testing?

