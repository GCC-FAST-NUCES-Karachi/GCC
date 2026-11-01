# GCC Website — Design Specification

This is the working visual reference derived from the GCC Figma handoff. The implementation map at the end records what is currently present in the repository. Design details that are not in that map are proposals/reference details, not shipped behavior. For current content and outstanding product work, see [plan.md](plan.md).

## Brand and foundations

Confident, playful, technical, and community-centered. Use code as a visual language for labels and navigation while keeping user-facing information plain and readable.

- **Palette:** near-black backgrounds, dark card surfaces, GitHub-inspired borders, blue and green accents, white headings, muted body text, and occasional purple/orange/yellow details. Shared CSS custom properties in `src/styles/tokens.css` are the code source of truth.
- **Typography:** locally hosted Inter for primary copy and JetBrains Mono for commands, labels, and terminal content.
- **Layout:** centered responsive content with generous spacing; the Figma desktop canvas is 1440px with a roughly 1200px content region.
- **Cards and controls:** restrained borders and radii, visible keyboard focus, clear hover/focus feedback, and touch-friendly sizing.
- **Motion:** decorative motion must not carry essential information. Respect `prefers-reduced-motion`; preserve static content and direct access to controls.

If a handoff value conflicts with an established shared token or accessible implementation behavior, update the shared source of truth deliberately rather than introducing unrelated one-off styles.

## Current route map

| Route | Current content |
| --- | --- |
| `/` | Hero, Core Functions, Highlights, Play/arcade teaser, upcoming events, Join section |
| `/learn` | Learning paths and selected external resources |
| `/events` | Shared upcoming-event list and empty state |
| `/team` | Faculty mentors and student leadership directory |
| `/perks` | GitHub programs and student resources |
| `/games` | Arcade hub and contribution information |
| `/games/commit-snake` | Playable Commit Snake |
| `/games/bug-bash` | Playable Bug Bash |
| `/games/octo-dive` | Playable Octo Dive quiz |
| `/terminal` | Simulated Git terminal |

The navbar and footer are shared. The terminal is available from the global navbar and its own route. Current route details and metadata live in the corresponding `src/app/**/page.jsx` files.

## Landing-page visual direction

The intended section order is:

`Navbar → Hero → Core Functions → Highlights → Play → Upcoming Events → Join → Footer`

- **Hero:** strong club statement over a dark grid/galaxy background, with the GitHub mark and a scroll cue. Keep contrast stable across background states.
- **Core Functions:** four cards for hackathons, workshops, tech talks, and community, with code-like filenames, simple icons, and concise descriptions.
- **Highlights:** responsive cards for posts, recaps, and tutorials. Current items are two past-workshop posters plus LinkedIn and WhatsApp community cards, defined in `src/app/landing/LandingSections.jsx`.
- **Play:** arcade-window panel listing every playable game from `src/content/games.js`, with a link to the `/games` hub.
- **Events:** shared event component used on the landing and `/events`. The content source is `src/content/events.js`; verify sample event details and RSVP links.
- **Join:** call to action that opens the club's WhatsApp community (`WHATSAPP_URL` in `src/content/site.js`).
- **Footer:** brand summary, navigation, community/build links, and the commit the build came from. While the landing loop runs, each loop copy ends with its own footer.

See [landingpage_design.md](landingpage_design.md) for more detailed visual notes and the comparison with current implementation.

## Terminal design and behavior

The terminal is a safe fictional Git environment, not a shell. It displays boot/welcome output, command suggestions, a virtual filesystem and branches, and an optional exploration puzzle. Commands are parsed in `src/components/terminal/terminalCommands.js`; content and puzzle data live in `terminalData.js`; provider state is session-persisted. It is available as an overlay from the navbar and at `/terminal`.

Preserve keyboard history/input, usable command suggestions, clear close behavior, and focus/scroll restoration. Never execute real commands or read/write files from the user's machine. The puzzle's hidden branch and challenge behavior are implemented in code and may evolve with the terminal content; do not treat old Figma command tables as a complete current command list.

## Motion and effects

- The canvas galaxy is a global visual layer. Reduced-motion users receive a static presentation.
- `InfiniteLoop` wraps the landing route. Four progress interstitials lead to `BugFinale`, a crack/shatter sequence that transitions to `/terminal`; discovery is persisted in local storage.
- Play uses the shared reveal-on-scroll component with a reduced-motion path.
- Review the finale's scroll lock, Escape behavior, reduced-motion handling, and navigation recovery when changing it.
- The current four-pass behavior is implemented in `src/components/effects/EasterBug.jsx`; treat any different Figma loop-count assumption as a historical annotation unless reconfirmed.

## Current implementation map

| Design piece | Current source | Status |
| --- | --- | --- |
| Shared shell and navbar | `src/app/layout.jsx`, `src/components/layout/`, `src/components/terminal/` | Responsive site shell; working terminal trigger and overlay. |
| Hero and galaxy | `src/app/page.jsx`, `src/app/landing/landing.css`, `src/components/effects/GalaxyBackground.jsx` | Landing hero and canvas galaxy are implemented; reduced-motion fallback is present. |
| Core Functions and Highlights | `src/app/landing/LandingSections.jsx` | Implemented. |
| Play | `src/app/landing/LandingSections.jsx`, `src/content/games.js` | Lists every arcade game and links to `/games`. |
| Events | `src/components/events/EventsList.jsx`, `src/content/events.js`, route styles | Shared list and empty state; event content/destinations need verification. |
| Join | `src/app/landing/LandingSections.jsx`, `src/content/site.js` | WhatsApp community CTA. |
| Team and Perks | `src/app/team/`, `src/content/team.js`, `src/app/perks/` | Populated routes; confirm copy/assets/destinations. |
| Arcade | `src/app/games/`, `src/content/games.js` | Hub plus playable Commit Snake, Bug Bash, and Octo Dive. See [games.md](../games.md). |
| Terminal | `src/app/terminal/`, `src/components/terminal/` | Simulated terminal with virtual commands and puzzle flow. |
| Loop interstitials and Easter egg | `src/components/effects/InfiniteLoop.jsx`, `EasterBug.jsx`, `BugFinale.jsx`, `src/lib/easterBug.js` | Four progress prompts lead to a crack/shatter finale and terminal route; local storage remembers discovery. |

## Content and handoff notes

The Figma reference includes sample copy, sample events, desktop-first layouts, and visual states. Verify factual content and external URLs with the club. Check phone and tablet behavior in the implementation rather than assuming the desktop frames define it. Keep decorative Figma annotations out of rendered copy.
