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

/** Clue tab milta hai jab visitor sahi branch par `cat KEY.md` kare (order mein). */
export const CLUES = [
  { key: "clue-readme", branch: "main" },
  { key: "clue-learn", branch: "learn" },
  { key: "clue-events", branch: "events" },
];

/** BRANCH_FILES mein is sentinel ki jagah renderKey() ka output dikhta hai. */
export const KEY_SENTINEL = "__KEY__";

const CLUE_STEPS = [
  {
    short: "Word 1: commit f4a9c1e, the verb.",
    how: "Run `git log --oneline`. Find commit f4a9c1e. The verb in its message is word 1.",
  },
  {
    short: "Word 2: commit e2c8f91, the last word.",
    how: "Run `git log --oneline`. Find commit e2c8f91. The last word of its message is word 2.",
  },
  {
    short: "Word 3: commit d9b2c76, the event.",
    how: "Run `git log --oneline`. Find commit d9b2c76. The event named in its message is word 3.",
  },
];

/** KEY.md ka content: progress ke saath grow karta hai. */
export function renderKey({ found, branch, secretUnlocked, challengeCompleted }) {
  const out = [
    "# KEY.md",
    "",
    "All hints live here. Re-read this file after every step.",
    "",
  ];

  if (challengeCompleted) {
    out.push("All done. Nothing left to find. Go build something.");
    return out.join("\n");
  }

  const done = Math.min(found, CLUE_STEPS.length);
  if (done > 0) {
    out.push("## Done");
    for (let i = 0; i < done; i++) out.push(`- ${CLUE_STEPS[i].short}`);
    out.push("");
  }

  out.push("## Next");

  if (secretUnlocked) {
    out.push(
      "The secret branch is open.",
      "1. `git checkout secret`",
      "2. `cat BADGE.md`",
      "3. Answer with `git challenge <answer>`",
      "",
      "Hint: the command that creates a brand new repository."
    );
  } else if (found >= CLUE_STEPS.length) {
    out.push(
      "You have all 3 words.",
      "Run `git unlock <word1> <word2> <word3>` in the same order (capitals don't matter)."
    );
  } else {
    const step = CLUE_STEPS[found];
    const needed = CLUES[found].branch;
    if (branch !== needed) {
      out.push(
        `Step ${found + 1} is on the '${needed}' branch.`,
        `1. \`git checkout ${needed}\``,
        "2. `cat KEY.md`"
      );
    } else {
      out.push(step.how);
    }
  }
  return out.join("\n");
}

/** Answer for `git unlock` — derived from COMMIT_LOG, in clue order. */
export const KEY_WORDS = ["launch", "pathway", "hackathon"];

export const PUBLIC_BRANCHES = ["main", "learn", "events", "team", "join"];

// ---------------------------------------------------------------------------
// Virtual filesystem per branch
// ---------------------------------------------------------------------------
export const BRANCH_FILES = {
  main: {
    "KEY.md": KEY_SENTINEL,
    "README.md": `# GitHub Campus Club — FAST-NUCES

A community of students who ship code and build together.

Stuck? Run \`cat KEY.md\`.`,
    "CONTRIBUTING.md": `# Contributing

1. Attend a workshop
2. Join a build session
3. Propose a project
4. Help others learn`,
    "MEMBERS.md": `# Members

Open to all FAST-NUCES students. See /team.`,
  },

  learn: {
    "KEY.md": KEY_SENTINEL,
    "README.md": `# Learn with GCC

Workshops, guides and resources. See /learn.`,
    "workshops.md": `# Workshops

- Git & GitHub basics
- Branching for teams
- Code review practice`,
    "git-basics.md": `# Git Basics

- git init: start a repository
- git add: stage changes
- git commit: save a snapshot
- git branch: list branches
- git checkout: switch branches
- git log: read history`,
  },

  events: {
    "KEY.md": KEY_SENTINEL,
    "README.md": `# GCC Events

Hackathons, workshops and meetups. See /events.`,
    "events.md": `# Schedule

- Git workshop series (monthly)
- Open-source sessions (bi-weekly)
- Community showcase (end of semester)`,
    "TIMELINE.md": `# Timeline

- Club founded
- First workshop
- First hackathon
- Community showcase
- Website launched`,
  },

  team: {
    "KEY.md": KEY_SENTINEL,
    "README.md": `# GCC Team

The people behind the club. See /team.`,
    "team.md": `# Roles

President, Vice President, Tech Lead, Community Lead, Content Lead.`,
    "ROLES.md": `# Open Roles

Be a FAST-NUCES student and love building things. Apply at /#join.`,
  },

  join: {
    "KEY.md": KEY_SENTINEL,
    "README.md": `# Join GCC

Click "Join the club" on the website: /#join`,
    "JOIN.md": `# Membership

Workshops, talks, open-source projects and a community of builders.
No prior experience needed.`,
  },

  secret: {
    "KEY.md": KEY_SENTINEL,
    "README.md": `# The Secret Branch

You found it. Not everyone makes it here.

Run \`cat BADGE.md\` to continue.`,
    "BADGE.md": `__CHALLENGE__`,
    "LORE.md": `# The GCC Origin Story

A terminal, a blinking cursor, and students who believed building together is the best way to learn.

You are one of the curious ones. Now go build something.`,
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

Every project begins with one command that creates a repository from nothing.
What is it?

Answer with: \`git challenge <your answer>\``,

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

export const WELCOME_MESSAGE = `Explore a practice version of the GCC project.
Tap a suggested command to run it. Nothing here changes real files.`;

export const RETURN_MESSAGE = `Session saved · branch: {branch} · clues: {clues}/3`;
