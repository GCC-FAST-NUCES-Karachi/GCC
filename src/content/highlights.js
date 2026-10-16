const highlights = [
  {
    id: "club-update",
    type: "post",
    label: "update",
    title: "Club update",
    body: "Updates from club build sessions and community events will appear here.",
    tall: true,
  },
  {
    id: "intro-to-git",
    type: "tutorial",
    label: "guide",
    title: "Intro to Git",
    code: ["git init", "git add .", 'git commit -m "first"'],
  },
  {
    id: "project-showcase",
    type: "recap",
    label: "showcase",
    title: "Project showcase",
    body: "A look back at projects, demos, and what members learned while building together.",
    featured: true,
  },
  {
    id: "branching-101",
    type: "tutorial",
    label: "guide",
    title: "Branching 101",
    code: ["git checkout -b feature", "git push origin feature", "# open a pull request"],
  },
  {
    id: "community-notes",
    type: "post",
    label: "update",
    title: "Community notes",
    body: "Notes from workshops, talks, and open-source sessions will appear here.",
  },
];

export default highlights;
