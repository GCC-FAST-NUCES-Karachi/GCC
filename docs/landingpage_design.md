# GCC landing page design reference

This document describes the GCC v3 landing page in the Figma file **GCC Website Mockup**. The desktop frames are 1440 × 900. Use the `GCC v3 / 2 Landing L1-L6` set as the source for the landing page; the frozen v1 and GCC v2 frames are historical references.

## Shared visual language

- **Canvas:** near-black `#010409` with a low-contrast square grid, about 60 px per cell. The galaxy is a fixed visual layer across the page, with a brighter blue-white core on the hero and restrained stars elsewhere.
- **Content:** centered desktop content, roughly 1200 px wide. Preserve generous vertical spacing between sections and readable contrast over the grid and galaxy.
- **Type:** bold sans-serif for primary headings and body copy; monospace for navigation paths, section commands, timestamps, metadata, code snippets, and terminal prompts.
- **Surfaces:** dark card/terminal panels, thin GitHub-style borders, modest corner radii, and restrained blue, green, purple, orange, and yellow accents. Green is used for primary actions and success/open states; blue for links and active navigation.
- **Voice:** use code and Git language as decoration and information architecture. Keep it legible and secondary to the page content.

## Page order

`Navbar → L1 Hero → L2 Core Functions → L3 Highlights → L3b Play → L4 Upcoming Events → L5 Footer / loop seam`

L6 is a progressive Easter egg layered over the end-of-scroll experience. It must not block normal scrolling or navigation.

## Navbar / floating pill

**Components:** `Navbar`, brand mark, route links, terminal switch, join CTA, GitHub link.

**Appearance:** a centered, compact glass pill with a subtle border and blue glow. Left to right: GitHub mark and `GCC`, `~/home`, `~/learn`, `~/events`, `~/team`, terminal switch, green “Join the club” pill, and circular GitHub icon. Use monospace for route and terminal labels. The active route has a blue curved underline. Keep the navbar’s width bounded by the desktop content grid; it should read as a floating control, not a full-width banner.

**Behavior:** route links navigate to their pages and show the active route. The terminal switch opens the terminal overlay when that feature is implemented. The join action leads to the club’s join flow. The GitHub mark links to the club’s organization.

## L1 — Hero

**Components:** `Hero`, `GitHubMark`, `HeroHeading`, `ScrollPrompt`, `ScrollIndicator`, `GalaxyBackground`.

**Appearance:** fill most of the first 900 px viewport. Keep the main message on the left and the galaxy art on the right. The left stack is a large GitHub mark, the bold three-line heading “Where students ship code and build the future together.”, then the blue monospace prompt `// scroll to accelerate`. The right side holds a luminous, tilted spiral galaxy with a white-gold core, diffuse blue nebula, and fine stars. A subtle grid spans both sides. Put a small mouse-shaped scroll indicator and `scroll` label near the bottom center. Fade the lower edge into the next section.

**Behavior:** the galaxy stays fixed behind the page. Scroll velocity can affect its rotation speed; return smoothly to a slow idle spin when scrolling stops. Provide a quiet static star fallback when motion is reduced. Keep all copy readable if the effect is unavailable.

## L2 — Core Functions

**Components:** `SectionHeading`, `FunctionCard` × 4, category icon.

**Appearance:** centered `Core Functions` heading with the monospace subtitle `// Defining our primary execution modules`, followed by a short centered introduction. Place four equal dark cards in one desktop row:

1. `competitive_programming.exe` — `Hackathons()` with a trophy icon and a short description about competing, building, and shipping in 24 hours.
2. `skill_development.py` — `Workshops()` with a wrench icon and a description about practical sessions from Git basics through deployment.
3. `knowledge_sharing.js` — `Tech Talks()` with a microphone icon and a description about students and invited engineers sharing what they build.
4. `network_building.ts` — `Community()` with a people icon and a description about finding teammates, mentors, and open-source reviewers.

Use small monospace filenames at the top, a colored icon tile, a code-like function name, and compact body text. The workshop card’s blue border/glow is the shown hover/focus treatment; apply a consistent lift and blue glow to each card on interaction.

## L3 — Highlights

**Components:** `SectionHeading`, `HighlightCard` variants (`post`, `recap`, `tutorial`), `ViewAllLink`.

**Appearance:** centered `Highlights` heading and `// git log --highlights` subtitle. Under it, use an asymmetric three-column masonry layout of dark cards with thin borders. The Figma examples include a club post with a banner and engagement counts, a Git tutorial card with a terminal/code preview, a larger “Hack the Orbit recap” card with a media preview and project/student stats, a “Branching 101” code card, and a second club post. Each card uses a small type badge and short commit-like hash. Place `View all highlights →` centered below the grid in blue.

**Behavior:** cards can link to their original post, recap, or tutorial. Keep the masonry responsive: collapse to fewer columns without reordering the content unexpectedly.

## L3b — Play

**Components:** `SectionHeading`, `ArcadeWindow`, `GameCanvas`, `CommentaryPanel`, `SecretHint`.

**Appearance:** centered `Play` heading with `// ./play --arcade`. Center a terminal-window frame named `gcc-arcade`, with three window dots. Inside, put a square black game canvas on the left and a commentary panel on the right. The panel explains that the club’s arcade competition is being prepared; below it, a yellow-outlined secret hint says that another branch can be found by following the landing-page loop and watching for cracks. Show the green prompt `> press any key to start_` beneath the window.

**Behavior:** the canvas is intentionally a placeholder until the game is chosen. Do not imply an unfinished game is playable. Reveal the section with a short fade and 24 px rise when it enters view; honor reduced-motion preferences.

## L4 — Upcoming Events

**Components:** `SectionHeading`, `EventTimeline`, `EventMarker`, `EventCard`, `EventMascot`, `EventEmptyState`.

**Appearance:** centered `Upcoming Events` heading with `// git fetch origin --events`. Connect three event markers along a thin horizontal line. A small blue cat mascot sits above each marker, with a fitting accessory (terminal, microphone, trophy). Below each marker, attach a dark event card containing a date tile, availability badge, event title, venue, time, divider, and full-width green RSVP button. The example events are an Intro to Git and GitHub Workshop (Oct 24), Open Source Night Talk (Nov 05), and Hack the Orbit 24h Hackathon (Nov 14).

**Empty state:** retain the section heading and timeline. Replace the event cards with three subdued `// empty` markers, a sleeping blue cat on a crescent, the message “No events on this branch yet.”, and the green monospace line `git pull soon.`

**Behavior:** RSVP buttons lead to their corresponding sign-up destinations. Use the empty state when the event source has no upcoming items.

## L5 — Footer and loop seam

**Components:** `LoopSeam`, `FooterBrand`, `SocialLinks`, `FooterLinkColumn` × 3, `FooterMeta`.

**Appearance:** transition from the landing’s grid/galaxy into the footer with the same bottom-to-top glow as the hero, so the background can loop without a hard seam. Add the small `// end of loop` cue above the footer. The footer itself is a dark, wide panel with a top divider. Left: GCC mark, short club blurb, and circular GitHub, LinkedIn, Instagram, and community links. Right: three compact columns named `NAVIGATE`, `COMMUNITY`, and `BUILD`, with monospace links. The bottom row has a thin divider, `© GCC. Built with commits.` at left, and `main · a1b2c3d` at right.

**Behavior:** footer links are real destinations and remain usable without animation. On mobile, stack the brand and link columns and keep the metadata readable.

## L6 — Easter egg

**Components:** `ScrollLoopTrigger`, `CrackOverlay`, `FatalMessage`, `SecretBranchPrompt`, terminal overlay.

**Appearance and sequence:** after the visitor reaches the end of the landing-page loop repeatedly (or visits three to four distinct pages, as annotated in Figma), begin with a faint page tremor and the first crack. The next frame spreads branches of cracks and light leaks; the final hit shatters to black. Show `fatal: merge conflict in reality.js`, then invite the visitor to try `git checkout secret` to enter the terminal.

**Behavior:** this is progressive enhancement. Never trap scroll, break browser navigation, or run automatically for reduced-motion users. Keep the normal terminal switch and footer entry available as explicit alternatives. Restore scroll position when leaving the terminal.

## Current implementation map

| Design piece | Current site location | State |
| --- | --- | --- |
| Shared navbar | `src/components/layout/Navbar.jsx`, `src/app/globals.css`, `src/components/effects/TerminalProvider.jsx` | Route links, active state, join CTA, GitHub link, and a working terminal overlay are implemented. |
| L1 hero and background | `src/app/page.jsx`, `src/components/effects/GalaxyBackground.jsx`, `src/app/globals.css` | Hero structure, mark, scroll cue, grid, and a CSS galaxy approximation are present. The approximation is static and less detailed than Figma’s particle-rendered spiral. |
| L2 Core Functions | `src/components/landing/LandingSections.jsx`, `src/app/globals.css` | Four function cards, icon tiles, descriptions, and hover/focus styling are implemented. |
| L3 Highlights | `src/components/landing/LandingSections.jsx`, `src/app/globals.css` | Responsive masonry cards with post, tutorial, and recap variants are implemented using illustrative local previews and sample content. |
| L3b Play | `src/components/landing/LandingSections.jsx`, `src/app/globals.css` | Terminal-style arcade frame and commentary are implemented. The game canvas remains a placeholder until the game is chosen. |
| L4 Events and empty state | `src/components/landing/LandingSections.jsx`, `src/components/landing/GccCat.jsx`, `src/app/globals.css` | Event timeline/cards, mascot variants, and the empty-state renderer are implemented with Figma sample events. Replace sample data and RSVP destination with approved live event data. |
| L5 Footer | `src/components/layout/Footer.jsx`, `src/app/globals.css` | Footer columns, brand, social icons, metadata, and the loop seam are implemented. |
| L6 Easter egg | `src/components/effects/EasterEgg.jsx`, `src/components/effects/TerminalProvider.jsx` | Three end-of-page passes trigger the optional crack/fatal screen once per session, with dismiss and terminal actions. It is disabled for reduced-motion users. |

The screenshot annotations in Figma describe animation behavior; they are design notes, not visible production copy. Keep those labels out of the rendered page.
