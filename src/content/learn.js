// Shared Learn content. Used by /learn (page.jsx) and by the terminal's `learn` branch.
import { perks } from "@/app/perks/perks";

export const tracks = [
  {
    number: "01",
    title: "Git & GitHub",
    description:
      "Get comfortable with repositories, branches, commits, and pull requests through hands-on practice.",
    command: "git-basics.md",
  },
  {
    number: "02",
    title: "Build for the web",
    description:
      "Turn an idea into a project, learn by shipping small features, and share your work in a repository.",
    command: "build-in-public.md",
  },
  {
    number: "03",
    title: "Open source",
    description:
      "Learn how to find a project, understand its contribution guide, and make your first useful contribution.",
    command: "first-contribution.md",
  },
];

export const resources = perks.filter((perk) =>
  ["skills", "classroom", "community-exchange"].includes(perk.id),
);
