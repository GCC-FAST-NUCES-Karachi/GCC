/**
 * branchFiles.js — Virtual files for each terminal branch.
 *
 * learn / events / team are GENERATED from the website's own content files
 * (src/content/*), so the terminal never drifts out of date. Edit the website
 * data and the terminal follows.
 *
 * main / join / secret are hand-written. The puzzle files (KEY.md and the
 * secret branch) are not tied to website content.
 *
 * It is a function (not a constant) so terminalData.js can pass in KEY_SENTINEL
 * without creating a circular import.
 */

import events from "@/content/events";
import { tiers, teamMembers } from "@/content/team";
import { tracks, resources } from "@/content/learn";
import { CONTACT_EMAIL } from "@/content/site";
import { getUpcomingEvents } from "@/lib/events";

// ---------------------------------------------------------------------------
// Generators (website data -> terminal file text)
// ---------------------------------------------------------------------------
function eventsFile() {
  const lines = ["# Upcoming Events", ""];
  const upcoming = getUpcomingEvents(events);
  if (upcoming.length === 0) {
    lines.push("No events scheduled right now. Check /events for updates.");
    return lines.join("\n");
  }
  for (const e of upcoming) {
    lines.push(`- ${e.month} ${e.day}: ${e.title} (${e.place}, ${e.time})`);
  }
  lines.push("", "Full details: /events");
  return lines.join("\n");
}

function teamFile() {
  const lines = ["# Team", ""];
  let heading = null;

  for (const tier of [...tiers].sort((a, b) => a.level - b.level)) {
    const members = teamMembers.filter((m) => m.tier === tier.level);
    if (members.length === 0) continue;

    // Tiers without their own heading continue under the previous one
    // (ExCom is split across several tiers on the website).
    const h = tier.heading || heading || tier.label;
    if (h !== heading) {
      if (heading) lines.push("");
      lines.push(`## ${h}`);
      heading = h;
    }
    for (const m of members) lines.push(`- ${m.name}: ${m.role}`);
  }

  lines.push("", "Full team page: /team");
  return lines.join("\n");
}

function resourcesFile() {
  const lines = ["# Resources", ""];
  for (const r of resources) lines.push(`- ${r.title}: ${r.description}`);
  lines.push("", "Links to all of these: /learn");
  return lines.join("\n");
}

// One file per learning track, named exactly like on the website (git-basics.md, ...)
const trackFiles = Object.fromEntries(
  tracks.map((t) => [t.command, `# ${t.title}\n\n${t.description}`]),
);

// ---------------------------------------------------------------------------
// Branch -> files
// ---------------------------------------------------------------------------
export function buildBranchFiles(KEY_SENTINEL) {
  return {
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

Start with the fundamentals, follow your curiosity, and learn alongside other students.

Full page: /learn`,
      ...trackFiles,
      "resources.md": resourcesFile(),
    },

    events: {
      "KEY.md": KEY_SENTINEL,
      "README.md": `# GCC Events

Hackathons, workshops and meetups. See /events.`,
      "events.md": eventsFile(),
    },

    team: {
      "KEY.md": KEY_SENTINEL,
      "README.md": `# GCC Team

The people behind the club. See /team.`,
      "team.md": teamFile(),
    },

    join: {
      "KEY.md": KEY_SENTINEL,
      "README.md": `# Join GCC

A community for FAST-NUCES students who learn, build, and ship together.

Click "Join the club" on the website: /#join`,
      "CONTACT.md": `# Contact

Email: ${CONTACT_EMAIL}

Or use the Join button on the website.`,
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
}
