"use client";

import { useState } from "react";

// Default avatar shown until real photos arrive.
function DefaultAvatar() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      <rect width="96" height="96" fill="#58a6ff" />
      <ellipse cx="48" cy="37" rx="14" ry="16" fill="#ffffff" />
      <ellipse cx="48" cy="86" rx="28" ry="24" fill="#ffffff" />
    </svg>
  );
}

export default function MemberCard({ member }) {
  const [open, setOpen] = useState(false);
  const panelId = `member-${member.slug}`;

  return (
    <li className={`member${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="member-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <code className="member-code">
          <span className="py-var">member</span> <span className="py-op">=</span> {"{"}
          {"\n  "}
          <span className="py-str">&quot;name&quot;</span>:{"\n    "}<span className="py-val">&quot;{member.name}&quot;</span>,
          {member.id && (
            <>
              {"\n  "}
              <span className="py-str">&quot;id&quot;</span>: <span className="py-val">&quot;{member.id}&quot;</span>,
            </>
          )}
          {"\n"}
          {"}"}
        </code>

        {/* Always in the DOM so screen readers get the title; only visually collapsed. */}
        <span className="member-panel" id={panelId}>
          <span className="member-panel-inner">
            <span className="member-photo">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" />
              ) : (
                <DefaultAvatar />
              )}
            </span>
            <span className="member-role">{member.role}</span>
          </span>
        </span>
      </button>
    </li>
  );
}