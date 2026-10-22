/**
 * terminalData.js — Virtual GCC Repository
 *
 * Fictional, read-only repository used by the terminal simulation.
 * It never touches the real Git repository or filesystem.
 *
 * PUZZLE DESIGN
 * -------------
 * All hints live only in KEY.md (present on every branch, content is dynamic).
 * Other files contain no hints. learn / events / team files are generated from
 * the website's content (see branchFiles.js).
 *
 *   main   -> cat KEY.md -> word 1: the action in commit f4a9c1e   -> "launch"
 *   learn  -> cat KEY.md -> word 2: how commit e2c8f91 ends        -> "pathway"
 *   events -> cat KEY.md -> word 3: what commit d9b2c76 hosted      -> "hackathon"
 *
 * `git unlock launch pathway hackathon` reveals the hidden branch.
 * If you change COMMIT_LOG, also update KEY_WORDS and CLUE_STEPS below.
 */

import { buildBranchFiles } from "./branchFiles.js";

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
// Clues (all defined BEFORE BRANCH_FILES, which needs KEY_SENTINEL)
// ---------------------------------------------------------------------------
export const CLUE_KEYS = ["clue-readme", "clue-learn", "clue-events"];

/** A clue is earned when the visitor runs `cat KEY.md` on the right branch (in order). */
export const CLUES = [
  { key: "clue-readme", branch: "main" },
  { key: "clue-learn", branch: "learn" },
  { key: "clue-events", branch: "events" },
];

/** Answer for `git unlock` — derived from COMMIT_LOG, in clue order. */
export const KEY_WORDS = ["launch", "pathway", "hackathon"];

export const PUBLIC_BRANCHES = ["main", "learn", "events", "team", "join"];

/** In BRANCH_FILES, this sentinel is replaced by the output of renderKey(). */
export const KEY_SENTINEL = "__KEY__";

const CLUE_STEPS = [
  {
    short: "Word 1: the action in commit f4a9c1e.",
    how: "Run `git log --oneline` and find commit f4a9c1e. The word that says what was done there (the action) is word 1.",
  },
  {
    short: "Word 2: how commit e2c8f91 ends.",
    how: "Run `git log --oneline` and find commit e2c8f91. The word that finishes its message is word 2.",
  },
  {
    short: "Word 3: what commit d9b2c76 hosted.",
    how: "Run `git log --oneline` and find commit d9b2c76. The word naming the thing that was hosted is word 3.",
  },
];

/** KEY.md content: grows with the visitor's progress. */
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

// ---------------------------------------------------------------------------
// Virtual filesystem per branch (built from website content, see branchFiles.js)
// ---------------------------------------------------------------------------
export const BRANCH_FILES = buildBranchFiles(KEY_SENTINEL);

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
