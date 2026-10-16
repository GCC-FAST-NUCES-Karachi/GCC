# GCC Website — Design Specification

## Brand and foundations

Confident, playful, technical, never corporate. Use code as a visual language: comment subtitles, path-like nav, and git-command section labels.

| Token | Value |
| --- | --- |
| `bg/space`, `bg/base`, `bg/card`, `bg/terminal` | `#010409`, `#0d1117`, `#161b22`, `#000000` |
| `border/default` | `#30363d` |
| `accent/blue`, `accent/green` | `#58a6ff`, `#3fb950` |
| `text/heading`, `text/body`, `text/dim` | `#ffffff`, `#c9d1d9`, `#8b949e` |
| `icon/yellow`, `icon/purple`, `icon/orange` | `#e3b341`, `#bc8cff`, `#f0883e` |

- Type: Inter ExtraBold headings; Inter Regular body; JetBrains Mono for labels, nav, comments, and terminal.
- Layout: 1440px canvas, 1200px content width, 60px grid, 120px side margin.
- Cards: 1px border, 12–16px radius; hover gives blue glow and 4px lift.
- Navbar: glass pill with `rgba(13,17,23,.6)`, blur, and soft blue glow.
- Buttons: filled green “Join the club”; outlined blue “View all”.

Implement all values as shared CSS tokens. Decorative animation must never be required to understand or use content.

## Routes and shared shell

| Route | v1 content |
| --- | --- |
| `/` | Landing L1–L6 |
| `/learn`, `/events`, `/team` | “Content coming soon” placeholders |
| Terminal | Overlay, not a route |

The floating pill navbar contains brand, `~/home`, `~/learn`, `~/events`, `~/team`, active underline, terminal switch, Join CTA, and GitHub icon. Footer: brand blurb, social icons, Navigate / Community / Build, and `main · a1b2c3d`. Community links are GitHub, Discord, Instagram, LinkedIn; Build links are projects, code of conduct, contact, brand kit.

## Landing: L1–L6

1. **L1 Hero:** galaxy, GitHub logo, “Where students ship code and build the future together.”, `// scroll to accelerate`, scroll hint, welcome terminal widget.
2. **L2 Core Functions:** `Hackathons()`, `Workshops()`, `Tech Talks()`, `Community()` cards and designed hover state.
3. **L3 Highlights:** `git log --highlights`; masonry of post, recap, and code cards; “View all highlights”.
4. **L3b Play:** `./play --arcade`; terminal-framed 420×420 game placeholder and commentary—not a v1 game commitment.
5. **L4 Events:** `git fetch origin --events`; timeline with date/title/place/time, cat mascot, green RSVP. Empty state: sleeping cat and “No events on this branch yet. git pull soon.”
6. **L5 Footer / seam:** footer top gradient matches hero bottom gradient for invisible looping.
7. **L6 Easter egg:** crack sequence and secret terminal entry.

## Motion, galaxy, and loop

The Figma Animation Index is the visual target. Only the Play reveal is fixed: at 30% visible, opacity 0→1 and 24px rise over 400ms. Other values need tuning.

| Index | Behaviour |
| --- | --- |
| 01–04 | Fixed galaxy, velocity-driven spin, GitHub-colour star fallback, brighter/denser footer stars |
| 05 | Seamless full landing footer-to-hero loop; assumed four loops, pending design confirmation |
| 06–08 | HIT 1 impact/tremor, HIT 2 spreading fractures/light leaks, shatter to black |
| 09–10 | `fatal: merge conflict in reality.js`, +/-2px ghost layers, cursor, `git checkout secret` prompt |
| 11–12 | Navbar terminal/go-back with restored scroll position; boot-copy reveal |

Core navigation, content, CTAs, and forms must work before galaxy, loop, crack, or terminal load. Isolate each as a client-side enhancement.

- Start desktop galaxy with canvas/pre-rendered texture; only use 3D if needed.
- Mobile defaults to static/star fallback; enable interactive galaxy only after real-device testing.
- `prefers-reduced-motion`: static stars, no automatic loop/crack, terminal still explicitly reachable.
- Preserve readable hero contrast regardless of background state.

Figma’s sequence is **full loop → HIT 1 → HIT 2 → shatter → fatal message → `git checkout secret` → terminal**. Keep it safe: never trap scroll or browser navigation; set a session flag after the first entry. The terminal is a proper modal: it traps keyboard focus while open, then releases it to its trigger on Escape, “go back”, or `exit`; it also restores saved scroll. Mobile and reduced-motion users get the navbar switch plus a footer “Open terminal” button, never automatic looping. Prototype iOS/browser scrolling first; if it is unreliable, keep terminal entry points and drop forced looping.

## Terminal: T1–T5

Black window, traffic-light dots, title `gcc-terminal`, “go back” top-right, prompt `visitor@gcc:~/club (main)$`. Boot: mounting, branch index, contributor key, `access granted: contributor level`, ASCII GCC logo, “Welcome, visitor. Type git help to begin.”

| Commands | Behaviour |
| --- | --- |
| `git help`, `git log --oneline`, `git branch`, `git status`, `cat README.md`, `ls`, `clear`, `exit` | Designed command behaviour |
| `git checkout main` | Terminal home |
| `git checkout learn/events/team` | Structured branch content; instruct return via main |
| `git checkout join` | `name`, `email`, `interest` prompts; submit membership |
| `git checkout secret` | Easter-egg entry |

Branches: `main`, `learn`, `events`, `team`, `join`, `secret-??????`. The design team must choose whether `secret` is an accepted alias (while `secret-??????` is only a teaser) or whether `git branch` reveals the exact secret branch name. Unknown branches emit the designed pathspec error and `git branch` hint. Tab completion/history are nice-to-have. Never execute actual commands.

## Figma handoff and decisions

Export approved mascot/logo/social assets; retain their intended geometry. The file has desktop 1440px only: obtain tablet/mobile designs. Confirm final external links, content, event source, and CTA destinations.

Open questions:

1. Four landing repeats only, or loop across pages?
2. Does Join use form/modal, terminal `join`, or both?
3. Does `/events` share the landing data and who owns it?
4. Final Learn, Team, Events, Highlights, and footer copy?
5. Which Play game, or placeholder-only in v1?
6. Approve mobile/tablet layouts and the mobile galaxy decision after testing.
7. Confirm the secret-branch parser behaviour: accept `secret` as an alias, or reveal and require the full branch name.
