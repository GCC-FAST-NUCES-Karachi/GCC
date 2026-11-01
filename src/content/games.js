// The arcade directory. The /games hub and the landing Play section both read this
// list, so a new game only needs one entry here (see games.md).
//
// slug:         route folder under src/app/games/ (the page lives at /games/<slug>)
// genre:        short label for the landing card
// tagline:      one line for the landing card
// description:  longer copy for the /games hub card
// controls:     short input summary for the landing card
// meta:         goal / run time / controls rows on the hub card. icon is one of
//               "goal", "time", "keyboard", "pointer" (mapped in src/app/games/page.jsx)
// contributors: GitHub usernames; href is optional and defaults to the profile

export const games = [
  {
    slug: "commit-snake",
    name: "Commit Snake",
    genre: "ARCADE · SURVIVAL",
    tagline: "Collect commits. Dodge the blockers. Keep your branch alive.",
    description: "Collect commits before they expire and dodge the GCC blocks. Ship the release, grow your branch, and build speed with every commit.",
    controls: "KEYBOARD · SWIPE",
    meta: [
      { icon: "goal", label: "Goal", value: "15 commits" },
      { icon: "time", label: "Run time", value: "about 2 min" },
      { icon: "keyboard", label: "Controls", value: "Keys or swipe" },
    ],
    contributors: [{ username: "ismailsilat7" }],
  },
  {
    slug: "bug-bash",
    name: "Bug Bash",
    genre: "ACTION · QUICK REFLEXES",
    tagline: "Smash the bugs. Save the good code. Never force push.",
    description: "Squash bugs before they ship, spare the working code and never force push. Chain combos into fever mode and take down the legacy monolith.",
    controls: "CLICK · TAP · SLASH",
    meta: [
      { icon: "goal", label: "Goal", value: "Keep the build green" },
      { icon: "time", label: "Run time", value: "1 to 3 min" },
      { icon: "pointer", label: "Controls", value: "Click, tap or slash" },
    ],
    contributors: [{ username: "maybethemuhammadibrahim" }],
  },
  {
    slug: "octo-dive",
    name: "Octo Dive",
    genre: "TRIVIA · DEEP DIVE",
    tagline: "Dive through GitHub and Git questions, build streaks and earn depth with every correct answer.",
    description: "Dive through GitHub and Git questions, build streaks and earn depth with every correct answer.",
    controls: "TAP · KEYS 1–4",
    meta: [
      { icon: "goal", label: "Goal", value: "Reach the Abyss" },
      { icon: "time", label: "Run time", value: "about 3 min" },
      { icon: "keyboard", label: "Controls", value: "Tap tiles or 1–4" },
    ],
    contributors: [{ username: "del-b2l", href: "https://github.com/GCC-FAST-NUCES-Karachi/GCC/commits?author=del-b2l" }],
  },
];

export const gameHref = (game) => `/games/${game.slug}`;
export const contributorHref = ({ username, href }) => href ?? `https://github.com/${username}`;
