"use client";

import { useRef } from "react";

// Default avatar shown until a real photo is added.
function DefaultAvatar() {
  return (
    <svg viewBox="0 0 96 96" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="96" height="96" fill="#58a6ff" />
      <ellipse cx="48" cy="37" rx="14" ry="16" fill="#ffffff" />
      <ellipse cx="48" cy="86" rx="28" ry="24" fill="#ffffff" />
    </svg>
  );
}

// "Fizza Batool (CS)" -> name "Fizza Batool", dept "CS"
function splitDept(fullName) {
  const m = fullName.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? { name: m[1], dept: m[2] } : { name: fullName, dept: null };
}

function Photo({ member }) {
  return (
    <div className="member-photo">
      {member.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={member.photo} alt="" loading="lazy" />
      ) : (
        <DefaultAvatar />
      )}
    </div>
  );
}

function CodeBlock({ member, name, dept }) {
  return (
    <code className="member-code">
      <span className="py-var">member</span> <span className="py-op">=</span> {"{"}
      {"\n  "}
      <span className="py-str">&quot;name&quot;</span>:{"\n    "}<span className="py-val">&quot;{name}&quot;</span>,
      {dept && (
        <>
          {"\n  "}
          <span className="py-str">&quot;dept&quot;</span>: <span className="py-val">&quot;{dept}&quot;</span>,
        </>
      )}
      {"\n  "}
      <span className="py-pos">
        <span className="py-str">&quot;position&quot;:</span>
        <span className="py-val">&quot;{member.role}&quot;,</span>
      </span>
      {member.id && (
        <>
          {"\n  "}
          <span className="py-str">&quot;id&quot;</span>: <span className="py-val">&quot;{member.id}&quot;</span>,
        </>
      )}
      {"\n"}
      {"}"}
    </code>
  );
}

export default function MemberCard({ member }) {
  const { name, dept } = splitDept(member.name);
  const dialogRef = useRef(null);
  const label = `${name}${dept ? `, ${dept}` : ""}, ${member.role}`;

  // Touch devices and phone-width screens open the popup; laptops use the hover reveal.
  function handleClick() {
    if (window.matchMedia("(hover: none), (max-width: 700px)").matches) {
      dialogRef.current?.showModal();
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <li className="member">
      <button type="button" className="member-trigger" onClick={handleClick} aria-label={label}>
        <Photo member={member} />
      </button>

      {/* Laptop: dark layer over the photo on hover / keyboard focus */}
      <div className="member-reveal" aria-hidden="true">
        <CodeBlock member={member} name={name} dept={dept} />
      </div>

      {/* Phone / tablet: popup */}
      <dialog
        ref={dialogRef}
        className="member-dialog"
        aria-label={label}
        onClick={(e) => e.target === e.currentTarget && closeDialog()}
      >
        <div className="member-dialog-body">
          <button type="button" className="member-dialog-close" onClick={closeDialog} aria-label="Close">
            ✕
          </button>
          <Photo member={member} />
          <CodeBlock member={member} name={name} dept={dept} />
        </div>
      </dialog>
    </li>
  );
}