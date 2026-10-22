"use client";

import { useId, useState } from "react";

export default function PerkDetails({ steps }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`perk-details${open ? " is-open" : ""}`}>
      <button
        className="perk-details-summary"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>How to get it</span>
        <span className="perk-details-icon" aria-hidden="true" />
      </button>
      <div className="perk-details-panel" id={panelId} aria-hidden={!open}>
        <div className="perk-details-content" inert={!open}>
          <h3>Steps</h3>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
