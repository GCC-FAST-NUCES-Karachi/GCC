// Octo Dive — configuration (Kahoot-style quiz version)

// Run settings
export const QUESTIONS_PER_RUN = 15;   // 9 easy then 6 tech
export const QUESTION_SECONDS  = 15;
export const MAX_SPEED_BONUS   = 50;
export const MAX_STREAK_BONUS  = 50;
export const STREAK_PER_CORRECT = 10;  // +10 per consecutive correct (capped at MAX_STREAK_BONUS)

// Ocean depth zones (score thresholds)
export const ZONES = [
  { name: "Sunlit Zone",   minScore: 0,    color: "var(--octo-zone-sunlit)"   },
  { name: "Twilight Zone", minScore: 500,  color: "var(--octo-zone-twilight)" },
  { name: "Midnight Zone", minScore: 1000, color: "var(--octo-zone-midnight)" },
  { name: "Abyss",         minScore: 1500, color: "var(--octo-zone-abyss)"    },
];

// Rank titles (by final score)
export const RANKS = [
  { minScore: 0,    title: "Surface Skimmer" },
  { minScore: 500,  title: "Reef Explorer"   },
  { minScore: 1000, title: "Deep Diver"      },
  { minScore: 1500, title: "Abyss Legend"    },
];

// Answer-tile shapes (one per tile A–D)
export const TILE_SHAPES = ["square", "pill", "diamond", "notch"];

// ---------------------------------------------------------------------------
// Question bank
// Each question: { q, options: [4 strings], answer: 0-3 index, level, why }
// 18 easy + 16 tech = 34 total — each run picks 9 easy + 6 tech = 15
// ---------------------------------------------------------------------------
export const EASY_QUESTIONS = [
  {
    q: "What is GitHub?",
    options: [
      "A language used for writing software",
      "A place to share and work on code",
      "A system for running a computer",
      "A company that builds computers",
    ],
    answer: 1,
    level: "easy",
    why: "GitHub is a cloud platform where developers store, share, and collaborate on code.",
  },
  {
    q: "What is a repository on GitHub?",
    options: [
      "A named line of development",
      "A saved snapshot of changes",
      "A project with files and history",
      "A roster of people on the project",
    ],
    answer: 2,
    level: "easy",
    why: "A repository (repo) is the main folder that holds all files and their history for a project.",
  },
  {
    q: "What does making a 'commit' do?",
    options: [
      "Removes a file from the project",
      "Saves a snapshot of your changes",
      "Combines two lines of development",
      "Deploys the current code to users",
    ],
    answer: 1,
    level: "easy",
    why: "A commit records a snapshot of your changes in the project's history.",
  },
  {
    q: "What is a branch in Git?",
    options: [
      "A copy of every site on the internet",
      "A separate line for making changes",
      "An earlier version removed from the project",
      "An account name used on GitHub",
    ],
    answer: 1,
    level: "easy",
    why: "A branch lets you work on features or fixes in isolation, then merge them back in.",
  },
  {
    q: "What is a Pull Request (PR)?",
    options: [
      "A request to copy a project to your computer",
      "A proposal to review code before merging",
      "A warning that a program has stopped running",
      "A question sent to a database for matching records",
    ],
    answer: 1,
    level: "easy",
    why: "A Pull Request asks teammates to review your branch changes before they're merged.",
  },
  {
    q: "What does 'forking' a repository mean?",
    options: [
      "Removing a project from its owner's account",
      "Making your own GitHub copy of a project",
      "Starting a separate line of work in Git",
      "Asking to merge your branch into a project",
    ],
    answer: 1,
    level: "easy",
    why: "Forking copies a public repo to your account so you can freely experiment.",
  },
  {
    q: "What does starring a repository on GitHub do?",
    options: [
      "Removes the project from your account",
      "Creates a separate copy under your account",
      "Saves the project so you can find it again",
      "Limits who can view the project's files",
    ],
    answer: 2,
    level: "easy",
    why: "Stars are GitHub's bookmarking system — they also signal popularity.",
  },
  {
    q: "What is a GitHub Issue?",
    options: [
      "A tracker for bugs, tasks, and project ideas",
      "A clash between edits on separate branches",
      "A notice that permission to use code has ended",
      "A command that Git does not recognize",
    ],
    answer: 0,
    level: "easy",
    why: "Issues are used to report bugs, suggest features, or plan work on a project.",
  },
  {
    q: "What is a README file?",
    options: [
      "A private file containing app credentials",
      "A report showing whether the tests passed",
      "A guide to a project and getting started",
      "A record of changes saved in the repository",
    ],
    answer: 2,
    level: "easy",
    why: "README is usually the first file people read; it describes the project and usage.",
  },
  {
    q: "What does 'open source' mean?",
    options: [
      "Software that runs only on Linux and cannot be changed",
      "Code with source anyone can inspect and change",
      "Software written in Python and shared as a paid product",
      "Software sold by subscription with its source kept private",
    ],
    answer: 1,
    level: "easy",
    why: "Open source means the code is public and anyone can contribute or build on it.",
  },
  {
    q: "What is Octocat?",
    options: [
      "A command used to inspect Git history",
      "GitHub's cat-and-octopus mascot",
      "A library for building Python web apps",
      "A method for combining branch changes",
    ],
    answer: 1,
    level: "easy",
    why: "Octocat is GitHub's beloved mascot, an octopus-cat hybrid that appears in GitHub branding.",
  },
  {
    q: "What is GitHub Pages?",
    options: [
      "A searchable site for GitHub product guides",
      "A service to publish static sites from repos",
      "A timeline showing a repository's saved changes",
      "A paid tier with extra account features",
    ],
    answer: 1,
    level: "easy",
    why: "GitHub Pages turns a repo into a free static website, great for portfolios and docs.",
  },
  {
    q: "What is GitHub Copilot?",
    options: [
      "A game that recreates flying an aircraft",
      "A dashboard for reviewing proposed code changes",
      "An AI tool that suggests code as you type",
      "A setting that blocks unsafe branch changes",
    ],
    answer: 2,
    level: "easy",
    why: "GitHub Copilot is an AI pair programmer powered by OpenAI that suggests code in real time.",
  },
  {
    q: "What is the default branch usually called in a new GitHub repository?",
    options: ["master or main", "integration branch", "release branch", "trunk branch"],
    answer: 0,
    level: "easy",
    why: "GitHub renamed the default branch from 'master' to 'main' in 2020; both are still common.",
  },
  {
    q: "What does 'clone' do in Git?",
    options: [
      "Makes another copy of one file on your computer",
      "Copies a repo and its history locally",
      "Removes branch references from the remote project",
      "Changes the name used for a branch in Git",
    ],
    answer: 1,
    level: "easy",
    why: "git clone copies a remote repository — all its files and history — to your local machine.",
  },
  {
    q: "Which of these is a version control system?",
    options: ["Git", "Python", "HTML", "CSS"],
    answer: 0,
    level: "easy",
    why: "Git tracks changes to files over time so you can review history and collaborate safely.",
  },
  {
    q: "Who created Git?",
    options: ["Bill Gates", "Linus Torvalds", "Mark Zuckerberg", "Guido van Rossum"],
    answer: 1,
    level: "easy",
    why: "Linus Torvalds created Git in 2005 to manage Linux kernel development.",
  },
  {
    q: "What does 'merge' do in Git?",
    options: [
      "Creates two separate lines from one branch",
      "Combines work across two branches",
      "Reverses a saved change from one commit",
      "Publishes a branch as a live application",
    ],
    answer: 1,
    level: "easy",
    why: "Merging integrates changes from a feature branch back into the target branch.",
  },
];

export const TECH_QUESTIONS = [
  {
    q: "You want to start tracking a new project folder with Git. Which command do you run first?",
    options: ["git start", "git init", "git create", "git new"],
    answer: 1,
    level: "tech",
    why: "git init initialises a new Git repository in the current directory.",
  },
  {
    q: "You edited two files and want to stage both for the next commit. Which command works?",
    options: ["git save .", "git stage --all", "git add .", "git commit -a"],
    answer: 2,
    level: "tech",
    why: "git add . stages all changed files in the current directory for the next commit.",
  },
  {
    q: "You want to upload your local commits to GitHub. Which command do you use?",
    options: ["git upload", "git send", "git push", "git sync"],
    answer: 2,
    level: "tech",
    why: "git push sends your local commits to the remote repository on GitHub.",
  },
  {
    q: "You cloned a repo and your teammate pushed new commits. How do you get them?",
    options: ["git fetch --reset", "git pull", "git clone again", "git refresh"],
    answer: 1,
    level: "tech",
    why: "git pull fetches and merges the latest remote changes into your current branch.",
  },
  {
    q: "What is a merge conflict?",
    options: [
      "When a network outage blocks access to the remote",
      "When overlapping edits in two branches conflict",
      "When a commit has a typo in its description",
      "When a branch reference is removed from the repo",
    ],
    answer: 1,
    level: "tech",
    why: "A merge conflict happens when the same lines were edited differently in two branches.",
  },
  {
    q: "What does a .gitignore file do?",
    options: [
      "Removes matching files from the repository history",
      "Lists files Git should leave untracked",
      "Makes status checks finish faster on large projects",
      "Chooses the name for a repository's first branch",
    ],
    answer: 1,
    level: "tech",
    why: ".gitignore tells Git which files to skip — e.g. node_modules, .env, build outputs.",
  },
  {
    q: "What does HEAD point to in Git?",
    options: [
      "The first commit at the root of the repository history",
      "The remote-tracking pointer for the shared repository",
      "Your current commit or checked-out branch tip",
      "The main guide file in the project folder",
    ],
    answer: 2,
    level: "tech",
    why: "HEAD is a pointer to your current position in the commit history — usually the branch tip.",
  },
  {
    q: "What is GitHub Actions used for?",
    options: [
      "Changing source files in GitHub's web editor",
      "Automating tasks such as tests and deployments",
      "Creating a repo from a prebuilt project template",
      "Reviewing proposed changes before they are merged",
    ],
    answer: 1,
    level: "tech",
    why: "GitHub Actions lets you automate CI/CD pipelines with YAML workflow files in your repo.",
  },
  {
    q: "You ran `git commit` but misspelled the message. How do you fix the last commit message?",
    options: [
      "git commit --fixup",
      "git commit --amend",
      "git revert HEAD",
      "git reset --hard",
    ],
    answer: 1,
    level: "tech",
    why: "git commit --amend lets you rewrite the most recent commit message (before pushing).",
  },
  {
    q: "Which open-source license lets anyone use, modify, and distribute code with almost no restrictions?",
    options: ["MIT License: permissive reuse", "GPL v3: reuse with same-license terms", "AGPL: network use shares source", "CC BY-NC: attribution, noncommercial use"],
    answer: 0,
    level: "tech",
    why: "The MIT License is permissive — anyone can do almost anything with the code.",
  },
  {
    q: "You want to copy a public repo you do NOT own so you can freely change it on GitHub. What do you do?",
    options: ["Star it on GitHub", "Fork it on GitHub", "Clone the repo locally", "Watch for project updates"],
    answer: 1,
    level: "tech",
    why: "Forking creates your own copy of the repo on GitHub where you can push changes freely.",
  },
  {
    q: "Which command shows the current status of your working directory and staging area?",
    options: ["git branch -vv", "git status", "git diff", "git log --oneline"],
    answer: 2,
    level: "tech",
    why: "git status shows which files are modified, staged, or untracked in your working directory.",
  },
  {
    q: "Which command displays the commit history of a repository?",
    options: ["git reflog", "git log", "git branch", "git show"],
    answer: 1,
    level: "tech",
    why: "git log lists past commits in reverse chronological order — great for reviewing project history.",
  },
  {
    q: "What does it mean to 'stage' a file in Git?",
    options: [
      "Remove the file from the repository's history",
      "Select its changes for your next commit",
      "Send its current changes to the remote repo",
      "Restore the file to its last committed version",
    ],
    answer: 1,
    level: "tech",
    why: "Staging (git add) marks specific changes to include in your next commit, giving you control over what gets saved.",
  },
  {
    q: "Which command unstages a file without deleting your changes?",
    options: [
      "git reset HEAD <file>",
      "git rm --cached <file>",
      "git checkout -- <file>",
      "git stash <file>",
    ],
    answer: 0,
    level: "tech",
    why: "git reset HEAD <file> removes the file from the staging area but keeps your edits in the working directory.",
  },
  {
    q: "You delete a branch after merging it into main. What happens to the merged changes?",
    options: [
      "They disappear when the branch reference is removed",
      "They remain in main; only the branch pointer is removed",
      "They are undone as soon as the branch is deleted",
      "They move to another branch while main resets to before the merge",
    ],
    answer: 1,
    level: "tech",
    why: "Deleting a merged branch only removes the pointer. All commits are already part of main's history.",
  },
];

// All questions combined for convenience
export const ALL_QUESTIONS = [...EASY_QUESTIONS, ...TECH_QUESTIONS];
