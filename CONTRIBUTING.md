# Contributing to GCC

Thanks for helping build the GitHub Campus Club FAST-NUCES website and arcade. This project is maintained by club members and is open to anyone who wants to learn by contributing, from a one-line typo fix to a whole new page or game.

**Contents**

- [Ground rules](#ground-rules)
- [Ways to contribute](#ways-to-contribute)
- [Set up the project](#set-up-the-project)
- [Make a change](#make-a-change)
- [Open a pull request](#open-a-pull-request)
- [Where things live](#where-things-live)
- [Common tasks](#common-tasks)
- [Guidelines](#guidelines)
- [Open work](#open-work)
- [Report a bug or a security issue](#report-a-bug-or-a-security-issue)
- [Credit for your work](#credit-for-your-work)

## Ground rules

- Be respectful and patient. Many contributors are making their first pull request here.
- Keep each pull request focused on one change. Small PRs are reviewed faster.
- For anything large, such as a new page, a new game, or a new dependency, open an issue first so we can agree on the approach before you build it.
- Never commit credentials, `.env` files, `node_modules`, or build output such as `.next/`.

## Ways to contribute

- **Fix a bug** you found on the site, or one from the [issue tracker](https://github.com/GCC-FAST-NUCES-Karachi/GCC/issues).
- **Build a missing page** from the [open work](#open-work) list.
- **Add a game** to the arcade. The [arcade guide](games.md) walks through it.
- **Improve accessibility, performance, or docs.**
- **Review a pull request** and try the change locally.

## Set up the project

You need [Node.js](https://nodejs.org) 20.9 or newer (the current LTS is recommended), npm, and Git.

1. Fork the repository on GitHub, then clone your fork:

   ```bash
   git clone https://github.com/<your-username>/GCC.git
   cd GCC
   git remote add upstream https://github.com/GCC-FAST-NUCES-Karachi/GCC.git
   ```

2. Install dependencies from the lockfile and start the dev server:

   ```bash
   npm ci
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Next.js reloads the page when you save a file. No environment variables are needed.

## Make a change

1. Start from an up-to-date `main` and create a branch:

   ```bash
   git switch main
   git pull upstream main
   git switch -c feat/short-description
   ```

   Use a prefix that matches the change: `feat/` for new features or pages, `fix/` for bug fixes, `docs/` for documentation, `perf/` for performance, and `chore/` for maintenance.

2. Make your change. Follow the [guidelines](#guidelines) and reuse what is already there before adding something new.

3. Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org) style used in this repository's history:

   ```text
   feat: add join page with membership steps
   fix(events): hide events once they have ended
   docs: explain how to add a team member
   ```

4. Check your work before pushing:

   ```bash
   npm run lint
   npm run build
   git diff --check
   ```

   There is no automated test suite yet (adding one is on the [open work](#site-wide-improvements) list). Open every page you touched and check it at desktop and phone widths, with the keyboard, and with reduced motion turned on in your OS settings.

## Open a pull request

1. Push your branch to your fork and open a pull request against `main`.
2. In the description, explain what changed and why, link the related issue (for example `Closes #12`), list the checks you ran, and add before/after screenshots or a short recording for anything visual.
3. Respond to review comments by pushing more commits to the same branch.

`main` is protected. A pull request is merged only when:

- the **CI** workflow passes (`npm ci`, `npm run lint`, and `npm run build` on Node 24), and
- a maintainer has approved it. Changes under `.github/` (workflows and repository settings) also need approval from a code owner listed in [`.github/CODEOWNERS`](.github/CODEOWNERS).

Every merge to `main` is deployed to production automatically, so a PR should leave the site in a releasable state.

## Where things live

| What | Where |
| --- | --- |
| Pages (one folder per route) | `src/app/<route>/page.jsx`, with route styles beside them |
| Landing page sections | `src/app/landing/` |
| Arcade games | `src/app/games/<slug>/`, listed in `src/content/games.js` |
| Navbar and footer | `src/components/layout/` |
| Simulated terminal | `src/components/terminal/` (commands in `terminalCommands.js`, virtual files in `branchFiles.js` and `terminalData.js`) |
| Events | `src/content/events.js` (date logic in `src/lib/events.js`) |
| Team and contributors | `src/content/team.js`, `src/content/contributors.js` |
| Learning paths | `src/content/learn.js` |
| Student perks | `src/app/perks/perks.js` |
| Links, socials, and contact email | `src/content/site.js` |
| Colours, fonts, focus styles | `src/styles/tokens.css`, `src/app/globals.css` |
| Design references | [docs/design.md](docs/design.md), [docs/landingpage_design.md](docs/landingpage_design.md) |

## Common tasks

**Add or update an event.** Add an entry to the `events` array in `src/content/events.js` with `startAt` and `endAt` as ISO timestamps in UTC (Karachi is UTC+5). The landing page, `/events`, and the terminal show it as upcoming until it ends, then `/events` moves it to Past events. Both pages rebuild hourly, so the switch happens within an hour of the end time.

**Add a team member.** Add an entry to `teamMembers` in `src/content/team.js` and put a square `.webp` portrait in `public/images/Team/`. Comments at the top of the file explain each field.

**Change a link or the contact email.** Edit `src/content/site.js`. The navbar, footer, landing page, and terminal all read from it.

**Add a game.** Follow the [arcade guide](games.md). In short: a route folder under `src/app/games/<slug>/` and one entry in `src/content/games.js`.

**Add a page.** Create `src/app/<route>/page.jsx`, export `metadata` with a title and description, give the `<main>` element `id="main-content"` so the skip link works, and add the route to the navbar and footer in `src/components/layout/` if it should be reachable from every page.

## Guidelines

- **JavaScript, not TypeScript.** The project uses plain JavaScript and JSX. Keep it that way unless the maintainers decide otherwise.
- **Server components by default.** Add `"use client"` only to components that need state, effects, or browser APIs.
- **Content is data.** Put copy, lists, and links in `src/content/` rather than hard-coding them inside components, so other contributors can update them without touching layout code.
- **Use the design tokens.** Use the CSS custom properties in `src/styles/tokens.css` instead of copying hex values. Keep new selectors scoped with a clear prefix so they cannot restyle other pages.
- **Accessible by default.** Every control must work with a keyboard, show a visible focus state, and have an accessible name. Icon-only buttons need an `aria-label`. Check colour contrast for small text.
- **Respect reduced motion.** Honour `prefers-reduced-motion`, and never use motion as the only way to convey information.
- **Browser storage can fail.** Wrap every `localStorage` and `sessionStorage` call in `try/catch`, and read saved values after mount so the server and client render the same markup.
- **Be careful with dependencies.** Avoid adding a package for something small. If you need one, explain why in the pull request.
- **Keep content truthful.** Do not invent events, people, statistics, or quotes. Mark anything provisional clearly.

## Open work

These pages and features are not built yet and are open for contributors. Comment on the related issue, or open one, before you start so two people don't build the same thing. If there is no issue yet, open one titled after the item.

### Pages

| Page | Suggested route | What it needs |
| --- | --- | --- |
| **404 page** | `src/app/not-found.jsx` | A "page not found" page in the site's style, with links back to home and the main sections. Missing URLs currently show the default Next.js 404. |
| **Error page** | `src/app/error.jsx` | A friendly page shown when something breaks while a page renders, with a "Try again" button (Next.js passes a `retry` function) and a link to report the issue. There is no error page today, so errors show the Next.js default. |
| **Join** | `/join` | What membership involves, who can join, and the steps to sign up, with the WhatsApp community link from `src/content/site.js`. Once it exists, restore the "Join the club" button that is commented out in `src/components/layout/Navbar.jsx` and point it here. |
| **Contact** | `/contact` | The club email (`CONTACT_EMAIL`), social links, and where to find the club on campus. Read everything from `src/content/site.js`. |
| **About** | `/about` | The club's mission, a short history, and how it relates to the GitHub Campus Program. Content must be confirmed with the club leads. |
| **Code of Conduct** | `/code-of-conduct` | A community code of conduct (for example, adapted from the [Contributor Covenant](https://www.contributor-covenant.org)), published both as a page and as `CODE_OF_CONDUCT.md` in the repository root, with a way to report problems. |
| **Privacy notice** | `/privacy` | Plain-language notice covering Vercel Analytics and Speed Insights and what the site keeps in the browser: `localStorage` keys `easter_bug_discovered`, `terminal_glow_shown`, `gcc-commit-snake-v2`, `gcc-bug-bash-v1`, `octo-dive-best-v2`, `octo-dive-mute`, and the `sessionStorage` key `gcc-terminal-state`. Link it from the footer. |
| **Event details and RSVP** | `/events/[slug]` | A page per event with the full description, speakers, venue, and a registration link. Add `slug` and `rsvpUrl` fields to `src/content/events.js` and link the event cards to the new page. |
| **Projects showcase** | `/projects` | Projects built by members, with a repository link, the people involved, and a screenshot. Define the data in a new `src/content/projects.js`. |
| **Brand kit** | `/brand` | Downloads for the logos and banners that already exist in `public/images/brand/` and `public/documents/brand/`, with usage notes. |
| **Gallery** | `/gallery` | Photos from past events. The past-event cards on `/events` already support image galleries; this would collect them in one place. |
| **FAQ** | `/faq` | Common questions from new students: joining, cost, required experience, and how to contribute. |
| **News or blog** | `/blog` | Workshop recaps and announcements. Open an issue first to agree on a content format (for example MDX files) before building it. |
| **Arcade leaderboard** | `/games/leaderboard` | Needs a backend and server-side score validation, since scores are currently kept only in each player's browser. Open an issue with a proposal before starting. |

### Site-wide improvements

- **Search and social sharing.** Add `src/app/sitemap.js`, `src/app/robots.js`, `metadataBase`, and an Open Graph image so links preview well when shared. This needs the production domain, so ask a maintainer for it in the issue.
- **Automated tests.** There is no test suite yet. Good first targets are the pure modules: `src/components/terminal/terminalCommands.js`, `src/lib/events.js`, and the Octo Dive question bank (checking that every `answer` index is valid). A few end-to-end smoke tests for the main routes would also help.
- **Landing page accessibility.** The landing page renders its content several times for the endless-scroll effect, and screen readers and keyboard users can reach the repeated copies. Improvements are welcome as long as the scrolling behaviour stays the same.
- **More arcade games.** See the [arcade guide](games.md).
- **Repository templates.** Issue templates, a pull request template, and a `SECURITY.md`.

## Report a bug or a security issue

**Bugs.** Open an [issue](https://github.com/GCC-FAST-NUCES-Karachi/GCC/issues/new) with the page URL, what you expected, what happened, the steps to reproduce it, and your browser and device. Screenshots help.

**Security issues.** Please do not open a public issue. Email the club at the contact address in [`src/content/site.js`](src/content/site.js) with the details, and we will reply there.

## Credit for your work

When your first pull request is merged, add yourself to the `contributors` list in [`src/content/contributors.js`](src/content/contributors.js) (it powers the Contributors section of the `/team` page) and to the Contributors table in the [README](README.md#contributors). You can do this in the same pull request as your change or in a follow-up.

## Questions

Not sure where a change belongs? Open an issue or a draft pull request with a short proposal, and a maintainer will help you shape it. For game-specific questions, start with [games.md](games.md).
