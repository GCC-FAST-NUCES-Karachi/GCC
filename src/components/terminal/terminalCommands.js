/**
 * terminalCommands.js — Command Parser & Dispatcher
 *
 * Pure functions: (command string, state) -> { output, stateUpdates }.
 * No side effects, no DOM access, nothing is ever executed.
 *
 * Supported: git help | log --oneline | branch | status | checkout <branch>,
 * cat <file>, ls, clear, exit, hint, pwd, whoami.
 * Hidden until earned: git unlock (after 3 key words), git challenge (on secret).
 */

import {
  BRANCH_FILES,
  CHALLENGE,
  CLUES,
  CLUE_KEYS,
  COMMIT_LOG,
  KEY_WORDS,
  PUBLIC_BRANCHES,
  UNLOCK_BANNER,
} from "./terminalData.js";

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------
const text = (content, type = "normal") => ({ type, content });
const error = (content) => ({ type: "error", content });
const success = (content) => ({ type: "success", content });
const info = (content) => ({ type: "info", content });
const heading = (content) => ({ type: "heading", content });
const file = (content, name) => ({ type: "file", content, name });
const suggestion = (label, command) => ({ type: "suggestion", label, command });
const link = (label, href) => ({ type: "link", label, href });
const cmdRow = (command, desc, fill) => ({ type: "cmd", command, desc, fill: fill ?? command });
const blank = () => text("");

const allCluesFound = (state) => state.discoveredClues.length >= CLUE_KEYS.length;

function accessibleBranches(state) {
  const list = [...PUBLIC_BRANCHES];
  if (state.secretUnlocked) list.push("secret");
  return list;
}

/** Used for hidden commands so they look like any other unknown subcommand. */
function unknownGit(sub) {
  return {
    output: [
      error(`git: '${sub}' is not a recognized command.`),
      suggestion("See commands: git help", "git help"),
    ],
  };
}

/** Whether a piece of inline code in a file may be rendered as a tappable command. */
export function isRunnableSuggestion(cmd) {
  return /^(git (help|log --oneline|branch|status|checkout (main|learn|events|team|join))|ls|hint|clear|cat [\w.-]+)$/.test(
    cmd.trim()
  );
}

// ---------------------------------------------------------------------------
// git help (adapts to progress; never names the hidden branch)
// ---------------------------------------------------------------------------
function cmdHelp(state) {
  const out = [
    heading("Commands you can use"),
    info("Tap a command to run it, or type it below."),
    blank(),
    text("Explore", "dim"),
    cmdRow("ls", "See files here"),
    cmdRow("cat README.md", "Read the README"),
    cmdRow("git branch", "See other branches"),
    cmdRow("git checkout learn", "Explore the learning branch"),
    blank(),
    text("Need help?", "dim"),
    cmdRow("git log --oneline", "Read the commit history"),
    cmdRow("hint", "Get a nudge"),
  ];

  if (allCluesFound(state) && !state.secretUnlocked) {
    out.push(cmdRow("git unlock <w1> <w2> <w3>", "Use your three key words", "git unlock "));
  }
  if (state.secretUnlocked && state.currentBranch === "secret" && !state.challengeCompleted) {
    out.push(cmdRow("git challenge <answer>", "Answer the final question", "git challenge "));
  }

  out.push(
    blank(),
    text("UTILITY", "dim"),
    cmdRow("clear", "Clear the screen"),
    cmdRow("exit", "Close the terminal"),
    blank(),
    suggestion("Start exploring: ls", "ls")
  );
  return { output: out };
}

// ---------------------------------------------------------------------------
// git log --oneline
// ---------------------------------------------------------------------------
function cmdLog() {
  return {
    output: [
      heading("Simulated commit history"),
      blank(),
      ...COMMIT_LOG.map((c) => ({ type: "log", hash: c.hash, msg: c.msg })),
      blank(),
      info("A fictional history for the GCC virtual repository."),
    ],
  };
}

// ---------------------------------------------------------------------------
// git branch
// ---------------------------------------------------------------------------
function cmdBranch(state) {
  return {
    output: [
      heading("Branches"),
      blank(),
      ...accessibleBranches(state).map((b) =>
        text(
          b === state.currentBranch ? `* ${b}` : `  ${b}`,
          b === state.currentBranch ? "branch-active" : "branch"
        )
      ),
      blank(),
      suggestion("Switch branch: git checkout learn", "git checkout learn"),
    ],
  };
}

// ---------------------------------------------------------------------------
// git status
// ---------------------------------------------------------------------------
function cmdStatus(state) {
  const n = state.discoveredClues.length;
  const total = CLUE_KEYS.length;
  const out = [
    heading("Repository status"),
    blank(),
    text(`  On branch: ${state.currentBranch}`, "branch-active"),
    text("  Working tree: clean (read-only simulation)"),
    blank(),
  ];

  if (state.challengeCompleted) {
    out.push(success("  Explorer badge: unlocked"), text("  All challenges completed."));
  } else if (state.secretUnlocked) {
    out.push(info("  Hidden branch: unlocked"), text("  Final challenge: in progress"));
    if (state.currentBranch !== "secret") {
      out.push(suggestion("Continue: git checkout secret", "git checkout secret"));
    }
  } else {
    out.push(text(`  Key words found: ${n}/${total}`));
    if (n === 0) out.push(info("  Read files with cat to find the first key word."));
    else if (n < total) out.push(info(`  ${total - n} more to find. Try hint if you're stuck.`));
    else out.push(success("  All three found. Use them with git unlock."));
  }
  out.push(blank(), suggestion("Try: ls", "ls"));
  return { output: out };
}

// ---------------------------------------------------------------------------
// git checkout <branch>
// ---------------------------------------------------------------------------
const BRANCH_LINKS = {
  learn: { label: "Open /learn on the website", href: "/learn" },
  events: { label: "Open /events on the website", href: "/events" },
  team: { label: "Open /team on the website", href: "/team" },
  join: { label: "Join the club", href: "/#join" },
};

function cmdCheckout(args, state) {
  const requested = args[0];
  if (!requested) {
    return {
      output: [
        error("Usage: git checkout <branch>"),
        blank(),
        suggestion("List branches: git branch", "git branch"),
      ],
    };
  }

  const name = requested.toLowerCase();
  // Locked and nonexistent branches get the exact same response (no leak).
  if (!accessibleBranches(state).includes(name)) {
    return {
      output: [
        error(`error: pathspec '${requested}' did not match any known branch`),
        blank(),
        info("Use git branch to see the available branches."),
        suggestion("List branches: git branch", "git branch"),
      ],
    };
  }

  if (name === state.currentBranch) {
    return { output: [info(`Already on branch '${name}'.`)] };
  }

  const out = [success(`Switched to branch '${name}'.`)];
  if (BRANCH_LINKS[name]) {
    out.push(blank(), link(BRANCH_LINKS[name].label, BRANCH_LINKS[name].href));
  }
  out.push(blank());
  if (name === "secret") {
    out.push(info("Welcome to the inner circle."), suggestion("Read: cat README.md", "cat README.md"));
  } else {
    out.push(suggestion("See files: ls", "ls"));
  }
  return { output: out, stateUpdates: { currentBranch: name } };
}

// ---------------------------------------------------------------------------
// ls
// ---------------------------------------------------------------------------
function cmdLs(state) {
  const files = BRANCH_FILES[state.currentBranch];
  if (!files) return { output: [error("No files on this branch.")] };
  const names = Object.keys(files);
  return {
    output: [
      heading(`Files on ${state.currentBranch}/`),
      info("Tap a file to read it."),
      ...names.map((n) => ({ type: "cmd", command: n, desc: "", fill: `cat ${n}` })),
    ],
  };
}

// ---------------------------------------------------------------------------
// cat <file>
// ---------------------------------------------------------------------------
function cmdCat(args, state) {
  const filename = args[0];
  if (!filename) {
    return {
      output: [error("Usage: cat <filename>"), blank(), suggestion("List files: ls", "ls")],
    };
  }

  const files = BRANCH_FILES[state.currentBranch] || {};
  // Own-property check so names like "constructor" can't hit the prototype.
  if (!Object.prototype.hasOwnProperty.call(files, filename)) {
    const available = Object.keys(files);
    return {
      output: [
        error(`cat: ${filename}: no such file on branch '${state.currentBranch}'`),
        blank(),
        info(`Available files: ${available.join(", ")}`),
        suggestion(`Try: cat ${available[0]}`, `cat ${available[0]}`),
      ],
    };
  }

  const content = files[filename];

  if (content === "__CHALLENGE__") {
    if (state.challengeCompleted) {
      return {
        output: [
          { type: "reward", content: CHALLENGE.rewardArt },
          blank(),
          info("You already completed this challenge. Well done."),
        ],
      };
    }
    return {
      output: [
        file(CHALLENGE.question, filename),
        blank(),
        suggestion("Answer: git challenge ", "git challenge "),
      ],
    };
  }

  // Clue discovery: only when the visitor reads the file that holds the marker.
  const clue = CLUES.find(
    (c) =>
      c.branch === state.currentBranch &&
      c.file === filename &&
      content.includes(c.pattern) &&
      !state.discoveredClues.includes(c.key)
  );

  const out = [file(content, filename)];
  let stateUpdates;

  if (clue) {
    const found = [...state.discoveredClues, clue.key];
    stateUpdates = { discoveredClues: found };
    out.push(blank(), success(`Clue ${found.length} of ${CLUE_KEYS.length} found.`));
    if (found.length === 1) {
      out.push(
        info("Run git log --oneline. Find f4a9c1e, take the verb from its message, and remember it as word 1."),
        suggestion("Read commit history: git log --oneline", "git log --oneline"),
        blank(),
        info("Keep exploring the other branches and their files to find the next clue."),
        suggestion("See available branches: git branch", "git branch")
      );
    } else if (found.length === 2) {
      out.push(
        info("Run git log --oneline. Find e2c8f91, take the last word of its message, and remember it as word 2."),
        suggestion("Read commit history: git log --oneline", "git log --oneline"),
        blank(),
        info("One clue remains. Explore the other branches and read their files to find it."),
        suggestion("See available branches: git branch", "git branch")
      );
    } else {
      out.push(
        success("All three clues found."),
        info("Run git log --oneline. The event in d9b2c76 is word 3. Enter all three words in clue order."),
        suggestion("Read commit history: git log --oneline", "git log --oneline"),
        suggestion("Unlock with your words: git unlock ", "git unlock ")
      );
    }
  }
  return { output: out, stateUpdates };
}

// ---------------------------------------------------------------------------
// git unlock <w1> <w2> <w3>   (invisible until all clues are found)
// ---------------------------------------------------------------------------
function cmdUnlock(args, state) {
  if (!allCluesFound(state)) return unknownGit("unlock");

  if (state.secretUnlocked) {
    return {
      output: [
        info("The hidden branch is already unlocked."),
        suggestion("Visit: git checkout secret", "git checkout secret"),
      ],
    };
  }

  const words = args.join(" ").toLowerCase().split(/[^a-z]+/).filter(Boolean);
  if (words.length === 0) {
    return {
      output: [
        error("Usage: git unlock <word1> <word2> <word3>"),
        info("Use the three key words from the commit history, in the order you found them."),
      ],
    };
  }

  if (words.join(" ") === KEY_WORDS.join(" ")) {
    return {
      output: [
        { type: "banner", content: UNLOCK_BANNER },
        blank(),
        info("A new branch has appeared in your repository."),
        suggestion("Enter: git checkout secret", "git checkout secret"),
      ],
      stateUpdates: { secretUnlocked: true },
    };
  }

  return {
    output: [
      error("Those key words don't open anything. Progress is safe, try again."),
      blank(),
      info("Check the spelling and the order. Each word comes from a different commit."),
      suggestion("Need a nudge? hint", "hint"),
    ],
  };
}

// ---------------------------------------------------------------------------
// git challenge <answer>   (invisible outside the secret branch)
// ---------------------------------------------------------------------------
function cmdChallenge(args, state) {
  if (!state.secretUnlocked || state.currentBranch !== "secret") return unknownGit("challenge");

  if (state.challengeCompleted) {
    return {
      output: [
        success("You already completed the challenge."),
        info("Run cat BADGE.md to see your badge again."),
      ],
    };
  }

  const answer = args.join(" ").trim().toLowerCase().replace(/\s+/g, " ");
  if (!answer) {
    return {
      output: [
        error("Usage: git challenge <answer>"),
        suggestion("Read the question: cat BADGE.md", "cat BADGE.md"),
      ],
    };
  }

  if (CHALLENGE.answers.includes(answer)) {
    return {
      output: [
        { type: "reward", content: CHALLENGE.rewardArt },
        blank(),
        success("Challenge complete. You explored deeper than most."),
        info("This badge is a virtual achievement only. No membership or credentials are issued."),
        blank(),
        link("Upcoming events", "/events"),
        link("Learning resources", "/learn"),
        link("Join the club", "/#join"),
      ],
      stateUpdates: { challengeCompleted: true },
    };
  }

  return {
    output: [
      error("Not quite. No penalty, try again."),
      info("Think about the very first thing a developer runs in a new project."),
      suggestion("Re-read: cat BADGE.md", "cat BADGE.md"),
    ],
  };
}

// ---------------------------------------------------------------------------
// hint — 3 progressive levels per stage; level rises each time it is asked
// ---------------------------------------------------------------------------
const HINTS = {
  0: [
    "Start by opening a file. The README has your first clue.",
    "Read README.md to the bottom, then look up its commit in the history.",
    "Open README.md, then find the commit it mentions with git log --oneline.",
  ],
  1: [
    "The next clue is in the learning branch. First list the branches.",
    "Switch to learn, then open git-basics.md.",
    "Run git checkout learn, then cat git-basics.md.",
  ],
  2: [
    "The last file pointed to a branch about things that happen. Think dates and meetups.",
    "That branch is about events, and it has a file named after a history of the club.",
    "Run git checkout events, then cat TIMELINE.md.",
  ],
  3: [
    "Three key words, three commits. git log --oneline shows all of them.",
    "Word 1: the verb in f4a9c1e. Word 2: the last word of e2c8f91. Word 3: the event named in d9b2c76.",
    "Type the three words after git unlock, in that order, separated by spaces. Capitals don't matter.",
  ],
  unlocked: [
    "A new branch appeared. See which one with git branch.",
    "Switch to it, then read BADGE.md.",
    "The question asks for the first command of any new project. Answer with git challenge, then your answer.",
  ],
};

function cmdHint(state) {
  if (state.challengeCompleted) {
    return {
      output: [
        success("You've completed everything. No hints needed."),
        info("Explore freely, or type exit to close."),
      ],
    };
  }

  const stage = state.secretUnlocked ? "unlocked" : Math.min(state.discoveredClues.length, 3);
  const lines = HINTS[stage];
  const current = (state.hintLevels && state.hintLevels[stage]) || 0;
  const level = Math.min(current + 1, lines.length);

  const out = [heading(`Hint ${level}/${lines.length}`), blank(), text(lines[level - 1])];
  if (level < lines.length) {
    out.push(blank(), info("Run hint again for a clearer nudge."));
  }

  return {
    output: out,
    stateUpdates: { hintLevels: { ...(state.hintLevels || {}), [stage]: level } },
  };
}

// ---------------------------------------------------------------------------
// Utility commands
// ---------------------------------------------------------------------------
const cmdClear = () => ({ output: [], stateUpdates: { __clear: true } });
const cmdExit = () => ({ output: [], stateUpdates: { __exit: true } });

function cmdUnknown(raw) {
  return {
    output: [
      error(`gcc-terminal: command not found: ${raw}`),
      blank(),
      info("This terminal supports a small set of Git-style commands."),
      suggestion("See available commands: git help", "git help"),
    ],
  };
}

const READ_ONLY_GIT = new Set([
  "commit", "add", "push", "pull", "merge", "rebase", "stash", "diff", "fetch", "clone", "remote", "reset",
]);

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------
export function executeCommand(rawInput, state) {
  const trimmed = rawInput.trim();
  if (!trimmed) return { output: [] };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1);

  if (cmd === "git") {
    const sub = (rest[0] || "").toLowerCase();
    const subArgs = rest.slice(1);

    switch (sub) {
      case "help":
      case "--help":
        return cmdHelp(state);
      case "log":
        if (subArgs.length === 0 || subArgs[0] === "--oneline") return cmdLog();
        return {
          output: [
            info("Usage: git log --oneline"),
            suggestion("Try: git log --oneline", "git log --oneline"),
          ],
        };
      case "branch":
      case "branches":
        return cmdBranch(state);
      case "status":
        return cmdStatus(state);
      case "checkout":
      case "switch":
        return cmdCheckout(subArgs, state);
      case "unlock":
        return cmdUnlock(subArgs, state);
      case "challenge":
        return cmdChallenge(subArgs, state);
      case "init":
        return {
          output: [
            info("This simulated repository is already initialized."),
            suggestion("Try: git help", "git help"),
          ],
        };
      default:
        if (READ_ONLY_GIT.has(sub)) {
          return {
            output: [
              info(`git ${sub} is a real Git command, but this is a read-only simulation.`),
              suggestion("See supported commands: git help", "git help"),
            ],
          };
        }
        return unknownGit(sub);
    }
  }

  switch (cmd) {
    case "ls":
    case "dir":
      return cmdLs(state);
    case "cat":
    case "type":
      return cmdCat(rest, state);
    case "clear":
    case "cls":
      return cmdClear();
    case "exit":
    case "quit":
    case "close":
      return cmdExit();
    case "help":
      return cmdHelp(state);
    case "hint":
      return cmdHint(state);
    case "pwd":
      return { output: [text(`~/club (branch: ${state.currentBranch})`)] };
    case "whoami":
      return { output: [text("visitor, a curious explorer of GCC")] };
    case "cd":
      return {
        output: [
          info("Use git checkout <branch> to move between branches."),
          suggestion("List branches: git branch", "git branch"),
        ],
      };
    case "sudo":
      return {
        output: [error("Nice try. No sudo in this simulation."), suggestion("Try: git help", "git help")],
      };
    case "rm":
    case "mv":
    case "cp":
    case "mkdir":
    case "touch":
    case "nano":
    case "vim":
    case "vi":
      return {
        output: [
          info("This is a read-only simulation. Files can't be changed."),
          suggestion("Try reading a file: cat README.md", "cat README.md"),
        ],
      };
    default:
      return cmdUnknown(trimmed);
  }
}

// ---------------------------------------------------------------------------
// Quick-command chips (shown above the input; tapping fills the input)
// ---------------------------------------------------------------------------
export function getQuickCommands(state) {
  const files = Object.keys(BRANCH_FILES[state.currentBranch] || {});
  const list = [];

  if (state.currentBranch === "secret" && !state.challengeCompleted) {
    list.push({ label: "cat BADGE.md", command: "cat BADGE.md" });
  }
  if (state.secretUnlocked && state.currentBranch !== "secret") {
    list.push({ label: "git checkout secret", command: "git checkout secret" });
  } else if (allCluesFound(state) && !state.secretUnlocked) {
    list.push({ label: "git unlock", command: "git unlock " });
  }

  list.push({ label: "git help", command: "git help" }, { label: "ls", command: "ls" });
  if (files[0]) list.push({ label: `cat ${files[0]}`, command: `cat ${files[0]}` });
  list.push(
    { label: "git branch", command: "git branch" },
    { label: "git log --oneline", command: "git log --oneline" },
    { label: "git status", command: "git status" },
    { label: "hint", command: "hint" },
    { label: "clear", command: "clear" }
  );

  const seen = new Set();
  return list.filter((c) => (seen.has(c.command) ? false : seen.add(c.command)));
}

// ---------------------------------------------------------------------------
// Autocomplete (respects branch visibility; never leaks hidden names)
// ---------------------------------------------------------------------------
export function getCompletions(partial, state) {
  const raw = partial.replace(/^\s+/, "");
  if (!raw) return [];

  const parts = raw.split(/\s+/); // keeps a trailing "" when input ends with a space
  const first = parts[0].toLowerCase();
  const canUnlock = allCluesFound(state) && !state.secretUnlocked;
  const canChallenge = state.secretUnlocked && state.currentBranch === "secret" && !state.challengeCompleted;

  if (parts.length === 1) {
    const commands = [
      "git help", "git log --oneline", "git branch", "git status", "git checkout ",
      "cat ", "ls", "clear", "exit", "hint", "pwd", "whoami",
    ];
    if (canUnlock) commands.push("git unlock ");
    if (canChallenge) commands.push("git challenge ");
    return commands.filter((c) => c.startsWith(raw.toLowerCase()));
  }

  if (first === "git" && parts.length === 2) {
    const subs = ["help", "log --oneline", "branch", "status", "checkout "];
    if (canUnlock) subs.push("unlock ");
    if (canChallenge) subs.push("challenge ");
    const p = parts[1].toLowerCase();
    return subs.filter((s) => s.startsWith(p)).map((s) => `git ${s}`);
  }

  if (first === "git" && ["checkout", "switch"].includes((parts[1] || "").toLowerCase()) && parts.length === 3) {
    const p = parts[2].toLowerCase();
    return accessibleBranches(state)
      .filter((b) => b.startsWith(p))
      .map((b) => `git ${parts[1]} ${b}`);
  }

  if ((first === "cat" || first === "type") && parts.length === 2) {
    const files = BRANCH_FILES[state.currentBranch] || {};
    const p = parts[1].toLowerCase();
    return Object.keys(files)
      .filter((f) => f.toLowerCase().startsWith(p))
      .map((f) => `${parts[0]} ${f}`);
  }

  return [];
}

// ---------------------------------------------------------------------------
// Tutorial
// ---------------------------------------------------------------------------
export const TUTORIAL_STEPS = [
  {
    id: "help",
    message: "Start here: see the commands you can use.",
    suggestedCommand: "git help",
    check: (cmd) => cmd.startsWith("git help") || cmd.startsWith("git --help"),
  },
  {
    id: "ls",
    message: "Next: see the files on this branch.",
    suggestedCommand: "ls",
    check: (cmd) => cmd === "ls" || cmd === "dir",
  },
  {
    id: "cat",
    message: "Next: open the README to find your first clue.",
    suggestedCommand: "cat README.md",
    check: (cmd) => cmd.startsWith("cat "),
  },
  {
    id: "branch",
    message: "Next: see the other versions of this project (branches).",
    suggestedCommand: "git branch",
    check: (cmd) => cmd === "git branch" || cmd === "git branches",
  },
  {
    id: "checkout",
    message: "Next: explore another branch to find more files.",
    suggestedCommand: "git checkout learn",
    check: (cmd) => cmd.startsWith("git checkout ") || cmd.startsWith("git switch "),
  },
  {
    id: "done",
    message:
      "Tutorial complete. Try another branch: use git branch to see your options, git checkout to explore one, and ls to find its files. Read them closely for clues.",
    suggestedCommand: null,
    check: () => false,
  },
];
