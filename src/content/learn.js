// Shared Learn content. Used by /learn (page.jsx) and by the terminal's `learn` branch.
import { perks } from "@/app/perks/perks";

export const tracks = [
  {
    number: "01",
    title: "Git & GitHub",
    description:
      "Undo buttons exist. Branches are free. Learn repos, commits, branches, and pull requests by breaking and fixing real projects.",
    command: "git-basics.md",
    prompt: 'git commit -m "no more fear"',
    outcome: "your first pull request",
    cta: "Open the course",
    href: "https://skills.github.com",
  },
  {
    number: "02",
    title: "Build for the web",
    description:
      "Start with a messy idea. Build it in tiny pieces, publish it with GitHub Pages, and drop the link in the group chat.",
    command: "build-in-public.md",
    prompt: "git push origin idea",
    outcome: "a live site with your name on it",
    cta: "Launch your first site",
    href: "https://github.com/skills/github-pages",
  },
  {
    number: "03",
    title: "Open source",
    description:
      "Every giant project started as a tiny commit. Find a beginner-friendly one, read its contributing guide, and leave your mark.",
    command: "first-contribution.md",
    prompt: "your name in someone else's repo",
    outcome: "your first open source contribution",
    cta: "Send your first PR",
    href: "https://github.com/firstcontributions/first-contributions",
  },
];

export const resources = perks.filter((perk) =>
  ["skills", "classroom", "community-exchange"].includes(perk.id),
);
