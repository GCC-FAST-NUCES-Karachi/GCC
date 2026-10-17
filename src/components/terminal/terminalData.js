/**
 * terminalData.js — Virtual GCC Repository
 *
 * Fictional, read-only repository used by the terminal simulation.
 * It never touches the real Git repository or filesystem.
 *
 * PUZZLE DESIGN (read this before editing clues)
 * ----------------------------------------------
 * Three files each hold one "key word" line. Each key word is NOT written in
 * the file; the visitor must derive it from a commit message in `git log --oneline`:
 *
 *   1. main/README.md           -> verb in commit f4a9c1e            -> "launch"
 *   2. learn/git-basics.md      -> last word of commit e2c8f91       -> "pathway"
 *   3. events/TIMELINE.md       -> event named in commit d9b2c76     -> "hackathon"
 *
 * `git unlock launch pathway hackathon` reveals the hidden branch.
 * If you change COMMIT_LOG messages, update KEY_WORDS to match.
 */

// ---------------------------------------------------------------------------
// ASCII helpers
// ---------------------------------------------------------------------------
const BOX_INNER = 34; // total box width = 36 chars, fits a 320px phone when scaled

function boxed(lines, inner = BOX_INNER) {
  const pad = (s) => {
    const str = s.length > inner ? s.slice(0, inner) : s;
    const total = inner - str.length;
    const left = Math.floor(total / 2);
    return " ".repeat(left) + str + " ".repeat(total - left);
  };
  return [
    "╔" + "═".repeat(inner) + "╗",
    ...lines.map((l) => "║" + pad(l) + "║"),
    "╚" + "═".repeat(inner) + "╝",
  ].join("\n");
}

const G = [" ██████╗ ", "██╔════╝ ", "██║  ███╗", "██║   ██║", "╚██████╔╝", " ╚═════╝ "];
const C = [" ██████╗", "██╔════╝", "██║     ", "██║     ", "╚██████╗", " ╚═════╝"];
const GCC_ART = G.map((row, i) => row + C[i] + C[i]);

// ---------------------------------------------------------------------------
// Commit history (stable — no random hashes)
// ---------------------------------------------------------------------------
export const COMMIT_LOG = [
  { hash: "f4a9c1e", msg: "feat: launch club website v1" },
  { hash: "b2d7e03", msg: "docs: add contributing guidelines" },
  { hash: "8c3f5a2", msg: "feat: first workshop — intro to git" },
  { hash: "a1e8d04", msg: "fix: update event calendar links" },
  { hash: "d9b2c76", msg: "feat: host first hackathon" },
  { hash: "3e7a1f5", msg: "docs: team roster and roles" },
  { hash: "c5d4b89", msg: "chore: add learning resources index" },
  { hash: "71f6e23", msg: "feat: community showcase event" },
  { hash: "9a4d0b7", msg: "refactor: reorganize branch structure" },
  { hash: "e2c8f91", msg: "feat: add hidden contributor pathway" },
];

// ---------------------------------------------------------------------------
// Discovery clues
// ---------------------------------------------------------------------------
export const CLUE_KEYS = ["clue-readme", "clue-learn", "clue-events"];

/** A clue is "discovered" when the visitor cats the file that contains `pattern`. */
export const CLUES = [
  { key: "clue-readme", branch: "main", file: "README.md", pattern: "Key word 1 of 3" },
  { key: "clue-learn", branch: "learn", file: "git-basics.md", pattern: "Key word 2 of 3" },
  { key: "clue-events", branch: "events", file: "TIMELINE.md", pattern: "Key word 3 of 3" },
];

/** Answer for `git unlock` — derived from COMMIT_LOG, in clue order. */
export const KEY_WORDS = ["launch", "pathway", "hackathon"];

export const PUBLIC_BRANCHES = ["main", "learn", "events", "team", "join"];

// ---------------------------------------------------------------------------
// Virtual filesystem per branch
// ---------------------------------------------------------------------------
export const BRANCH_FILES = {
  main: {
    "README.md": `# GitHub Campus Club — FAST-NUCES

Welcome to GCC! We're a community of students who ship code and build the future together.

## Quick start
- Run \`ls\` to see the files on this branch
- Run \`git branch\` to see available branches
- Run \`git checkout learn\` to explore another branch
- Run \`cat <file>\` to read any file

## What we do
Hackathons, workshops, tech talks, and open-source projects. We believe learning happens when you build in public.

> "Every great developer you know started exactly where you are now." — someone who committed early and often.

---
Curious? This repository has more to it than meets the eye. Some commit messages are worth reading closely: run \`git log --oneline\` and find commit f4a9c1e.

🔑 Key word 1 of 3 — the verb in the message of commit f4a9c1e.

Keep it safe, you'll need all three. Next stop: CONTRIBUTING.md.`,

    "CONTRIBUTING.md": `# Contributing to GCC

We welcome contributors of all experience levels.

## How to contribute
1. Attend a workshop or tech talk
2. Join an open-source build session
3. Propose your own project idea
4. Help others learn through pair programming

## Our values
- Ship early, iterate often
- Teach what you know
- Learn from every merge conflict

## The hidden contributor track
Some say there's a path for those who read closely. If you found the first key word in the README, the second one lives where learning begins. Try \`git checkout learn\`.`,

    "MEMBERS.md": `# Members

GCC is open to all FAST-NUCES students. Current membership details are on the website.

Visit /team to see the current team.`,
  },

  learn: {
    "README.md": `# Learn with GCC

Resources, workshops, and guides for developers at every level.

## Workshop tracks
- Git & GitHub fundamentals
- Web development with modern frameworks
- Open-source contribution workflow
- Building portfolio projects

Visit /learn on the website for the full resource library.`,

    "workshops.md": `# Workshop Archive

## Upcoming
- Introduction to open source (date TBD)
- Building your first pull request

## Past sessions
- Git init: your first repository
- Branching strategies for teams
- Code review best practices

Each workshop includes hands-on exercises. Check /learn on the website for materials.`,

    "git-basics.md": `# Git Basics — Quick Reference

## Essential commands
- \`git init\` — start a new repository
- \`git add .\` — stage all changes
- \`git commit -m "msg"\` — save a snapshot with a message
- \`git push\` — send your commits to the remote
- \`git pull\` — fetch the latest changes
- \`git branch\` — list branches
- \`git checkout\` — switch branches
- \`git log\` — read the commit history

## Pro tip
The best way to learn git is to use it on a real project. Start small — even a README counts as a first commit.

---
Already holding a key word? There's another one here.

🔑 Key word 2 of 3 — the last word in the message of commit e2c8f91.

The final one lives on the \`events\` branch. Look for a TIMELINE.md.`,
  },

  events: {
    "README.md": `# GCC Events

Hackathons, workshops, tech talks, and community meetups.

Visit /events on the website for the latest schedule.`,

    "events.md": `# Event Schedule

## Current semester
- Git workshop series (monthly)
- Open-source contribution sessions (bi-weekly)
- Community showcase (end of semester)

## Past highlights
- Hacktoberfest participation
- GitHub Universe watch party
- Intro to web development bootcamp

Check /events on the website for dates and RSVP links.`,

    "TIMELINE.md": `# GCC Timeline

A brief, partly fictional history of GitHub Campus Club at FAST-NUCES.

## Milestones
- Club founded by a group of passionate developers
- First workshop shipped to 40+ attendees
- Open-source hackathon with 12 teams
- Community showcase featuring student projects
- Website launched and open-sourced

## The builder's tradition
At GCC we believe in hidden depths. Every project has layers: the code you see, and the story underneath.

🔑 Key word 3 of 3 — the event named in the message of commit d9b2c76.

You now hold three key words, found in order. Put them together, separated by spaces, to open what's hidden: \`git unlock <word1> <word2> <word3>\``,
  },

  team: {
    "README.md": `# GCC Team

The people who keep the club running.

Visit /team on the website for the full roster.`,

    "team.md": `# Team Structure

## Roles
- President — strategic direction and partnerships
- Vice President — operations and event coordination
- Tech Lead — workshops and technical content
- Community Lead — outreach and member experience
- Content Lead — social media and documentation

## Join the team
Applications open each semester. Check /team for details.`,

    "ROLES.md": `# Open Roles

We're always looking for passionate contributors.

## How to apply
1. Be a FAST-NUCES student
2. Have enthusiasm for building things
3. Submit your interest through the website

Visit /#join on the website to express interest.`,
  },

  join: {
    "README.md": `# Join GCC

Ready to be part of the community?

## How to join
Visit the GCC website and click "Join the club". We welcome students of all experience levels.

Website: /#join`,

    "JOIN.md": `# Membership

## What you get
- Access to workshops and tech talks
- Open-source project collaboration
- A community of like-minded developers
- Portfolio-building opportunities

## Requirements
- Be a FAST-NUCES student
- Show up and ship code

No prior experience required. We all start somewhere. Visit /#join on the website to get started.`,
  },

  secret: {
    "README.md": `# 🔓 The Secret Branch

You found it. Not everyone makes it here.

You followed the trail across three branches, read the commits closely, and opened a branch that doesn't show up for casual visitors.

## The GCC lore
This club was founded on a simple belief: the best developers aren't born, they commit. Every great project started with a single command. Every great community started with someone showing up.

## What's here
- BADGE.md — your final challenge and badge
- LORE.md — the full story

Run \`cat BADGE.md\` to continue.`,

    "BADGE.md": `__CHALLENGE__`,

    "LORE.md": `# The GCC Origin Story

In the beginning, there was a terminal and a blinking cursor.

A small group of students at FAST-NUCES shared a belief: building things together is the best way to learn.

They committed early and often. They reviewed each other's code. They shipped projects that mattered. And they left breadcrumbs for the curious ones who came after.

You are one of those curious ones. Welcome to the inner circle of GCC. Now go build something.`,
  },
};

// ---------------------------------------------------------------------------
// Unlock banner + final challenge
// ---------------------------------------------------------------------------
export const UNLOCK_BANNER = boxed([
  "",
  "SECRET BRANCH UNLOCKED",
  "",
  "A new branch has appeared.",
  "",
]);

export const CHALLENGE = {
  question: `## The Final Commit

You found three key words and opened the hidden branch. One question left.

Every project at GCC begins with one command that creates a repository from nothing. What is it?

Answer with: \`git challenge <your answer>\`

Hint: it's two words. Think about beginnings.`,

  answers: ["git init", "init"],

  rewardArt: boxed([
    "",
    "*  EXPLORER BADGE UNLOCKED  *",
    "",
    ...GCC_ART,
    "",
    "SECRET BRANCH EXPLORER",
    "GitHub Campus Club",
    "FAST-NUCES",
    "",
    "a virtual badge, just for fun",
    "",
  ]),
};

// ---------------------------------------------------------------------------
// Boot / welcome copy (fictional interface text)
// ---------------------------------------------------------------------------
export const BOOT_LINES = [
  { text: "[ OK ] mounting virtual club environment", delay: 320 },
  { text: "[ OK ] loading repository index", delay: 280 },
  { text: "[ OK ] starting simulated contributor session", delay: 280 },
];

export const WELCOME_MESSAGE = `Welcome to GCC Terminal.
A simulated Git environment for exploring GitHub Campus Club at FAST-NUCES.
Type git help to see the available commands.`;

export const RETURN_MESSAGE = `Welcome back. Your session is still active.
Branch: {branch} | Key words found: {clues}/3`;
