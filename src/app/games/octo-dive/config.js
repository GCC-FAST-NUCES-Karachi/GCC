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
      "A programming language",
      "A platform to host and collaborate on code",
      "An operating system",
      "A hardware company",
    ],
    answer: 1,
    level: "easy",
    why: "GitHub is a cloud platform where developers store, share, and collaborate on code.",
  },
  {
    q: "What is a repository on GitHub?",
    options: [
      "A branch name",
      "A type of commit",
      "A project folder that stores code and history",
      "A list of contributors",
    ],
    answer: 2,
    level: "easy",
    why: "A repository (repo) is the main folder that holds all files and their history for a project.",
  },
  {
    q: "What does making a 'commit' do?",
    options: [
      "Deletes a file permanently",
      "Saves a snapshot of your changes",
      "Merges two branches",
      "Sends code to production",
    ],
    answer: 1,
    level: "easy",
    why: "A commit records a snapshot of your changes in the project's history.",
  },
  {
    q: "What is a branch in Git?",
    options: [
      "A copy of the entire internet",
      "A way to work on changes separately without affecting the main code",
      "A deleted version of a file",
      "A GitHub username",
    ],
    answer: 1,
    level: "easy",
    why: "A branch lets you work on features or fixes in isolation, then merge them back in.",
  },
  {
    q: "What is a Pull Request (PR)?",
    options: [
      "A request to download code",
      "A way to propose and review changes before merging",
      "An error message",
      "A type of database query",
    ],
    answer: 1,
    level: "easy",
    why: "A Pull Request asks teammates to review your branch changes before they're merged.",
  },
  {
    q: "What does 'forking' a repository mean?",
    options: [
      "Deleting a repo",
      "Copying someone's repo to your own account",
      "Creating a new branch",
      "Sending a pull request",
    ],
    answer: 1,
    level: "easy",
    why: "Forking copies a public repo to your account so you can freely experiment.",
  },
  {
    q: "What does starring a repository on GitHub do?",
    options: [
      "Deletes it",
      "Forks it to your account",
      "Bookmarks it so you can find it easily",
      "Makes it private",
    ],
    answer: 2,
    level: "easy",
    why: "Stars are GitHub's bookmarking system — they also signal popularity.",
  },
  {
    q: "What is a GitHub Issue?",
    options: [
      "A way to track bugs, tasks, or feature requests",
      "A type of merge conflict",
      "An expired license",
      "A broken Git command",
    ],
    answer: 0,
    level: "easy",
    why: "Issues are used to report bugs, suggest features, or plan work on a project.",
  },
  {
    q: "What is a README file?",
    options: [
      "A secret config file",
      "An auto-generated test report",
      "A document that explains what a project is and how to use it",
      "A list of all commits",
    ],
    answer: 2,
    level: "easy",
    why: "README is usually the first file people read; it describes the project and usage.",
  },
  {
    q: "What does 'open source' mean?",
    options: [
      "Code that only runs on Linux",
      "Software whose source code is publicly available to view, use, and modify",
      "Code written in Python",
      "Software that costs money",
    ],
    answer: 1,
    level: "easy",
    why: "Open source means the code is public and anyone can contribute or build on it.",
  },
  {
    q: "What is Octocat?",
    options: [
      "A Git command",
      "GitHub's mascot — a half-cat, half-octopus character",
      "A popular Python library",
      "A type of merge strategy",
    ],
    answer: 1,
    level: "easy",
    why: "Octocat is GitHub's beloved mascot, an octopus-cat hybrid that appears in GitHub branding.",
  },
  {
    q: "What is GitHub Pages?",
    options: [
      "GitHub's documentation portal",
      "A service to host static websites directly from a repository",
      "A page that lists all your commits",
      "A premium GitHub plan",
    ],
    answer: 1,
    level: "easy",
    why: "GitHub Pages turns a repo into a free static website, great for portfolios and docs.",
  },
  {
    q: "What is GitHub Copilot?",
    options: [
      "A flight simulator game",
      "A tool to manage pull requests",
      "An AI coding assistant that suggests code as you type",
      "A branch protection rule",
    ],
    answer: 2,
    level: "easy",
    why: "GitHub Copilot is an AI pair programmer powered by OpenAI that suggests code in real time.",
  },
  {
    q: "What is the default branch usually called in a new GitHub repository?",
    options: ["master or main", "develop", "release", "trunk"],
    answer: 0,
    level: "easy",
    why: "GitHub renamed the default branch from 'master' to 'main' in 2020; both are still common.",
  },
  {
    q: "What does 'clone' do in Git?",
    options: [
      "Duplicates a file locally",
      "Downloads a full copy of a repository to your machine",
      "Deletes remote branches",
      "Renames a branch",
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
      "Splits a branch into two",
      "Combines changes from one branch into another",
      "Reverts the last commit",
      "Publishes code to a server",
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
      "When the internet goes down",
      "When two branches changed the same lines and Git can't auto-merge",
      "When you commit with the wrong message",
      "When a branch is deleted",
    ],
    answer: 1,
    level: "tech",
    why: "A merge conflict happens when the same lines were edited differently in two branches.",
  },
  {
    q: "What does a .gitignore file do?",
    options: [
      "Deletes files from the repo",
      "Lists files that Git should not track",
      "Speeds up git status",
      "Sets the default branch name",
    ],
    answer: 1,
    level: "tech",
    why: ".gitignore tells Git which files to skip — e.g. node_modules, .env, build outputs.",
  },
  {
    q: "What does HEAD point to in Git?",
    options: [
      "The first commit ever made",
      "The remote repository",
      "The currently checked-out commit or branch tip",
      "The project README",
    ],
    answer: 2,
    level: "tech",
    why: "HEAD is a pointer to your current position in the commit history — usually the branch tip.",
  },
  {
    q: "What is GitHub Actions used for?",
    options: [
      "Editing code in the browser",
      "Automating workflows like testing and deployment",
      "Creating repositories faster",
      "Reviewing pull requests",
    ],
    answer: 1,
    level: "tech",
    why: "GitHub Actions lets you automate CI/CD pipelines with YAML workflow files in your repo.",
  },
  {
    q: "You ran `git commit` but misspelled the message. How do you fix the last commit message?",
    options: [
      "git fix --message",
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
    options: ["MIT License", "GPL v3", "AGPL", "CC BY-NC"],
    answer: 0,
    level: "tech",
    why: "The MIT License is permissive — anyone can do almost anything with the code.",
  },
  {
    q: "You want to copy a public repo you do NOT own so you can freely change it on GitHub. What do you do?",
    options: ["Star it", "Fork it", "Clone it", "Watch it"],
    answer: 1,
    level: "tech",
    why: "Forking creates your own copy of the repo on GitHub where you can push changes freely.",
  },
  {
    q: "Which command shows the current status of your working directory and staging area?",
    options: ["git info", "git log", "git status", "git diff --staged"],
    answer: 2,
    level: "tech",
    why: "git status shows which files are modified, staged, or untracked in your working directory.",
  },
  {
    q: "Which command displays the commit history of a repository?",
    options: ["git history", "git log", "git commits", "git show --all"],
    answer: 1,
    level: "tech",
    why: "git log lists past commits in reverse chronological order — great for reviewing project history.",
  },
  {
    q: "What does it mean to 'stage' a file in Git?",
    options: [
      "Delete it from the repo",
      "Mark it to be included in the next commit",
      "Push it to the remote",
      "Revert it to the last saved version",
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
      "They are lost forever",
      "They stay in main — only the branch pointer is removed",
      "They revert automatically",
      "They move to a special archive branch",
    ],
    answer: 1,
    level: "tech",
    why: "Deleting a merged branch only removes the pointer. All commits are already part of main's history.",
  },
];

// All questions combined for convenience
export const ALL_QUESTIONS = [...EASY_QUESTIONS, ...TECH_QUESTIONS];
