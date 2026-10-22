"use client";
import "./EasterBug.css";

import { memo } from "react";

// One group per stage. memo() means a stage that is already on screen is never
// re-rendered or re-animated when the next stage is added.
const Stage = memo(function Stage({ pieces, animate }) {
  return (
    <g>
      {pieces.map((c, i) => (
        <path
          key={i}
          d={c.d}
          pathLength="1"
          className={`glass-crack ${animate ? "is-new" : "is-drawn"}`}
          style={{
            "--delay": `${c.delay.toFixed(2)}s`,
            "--dur": `${c.dur.toFixed(2)}s`,
            strokeWidth: c.w,
            strokeOpacity: c.o,
          }}
        />
      ))}
    </g>
  );
});

/**
 * Draws crack stages 1..stage from the shared glass data.
 * Stages <= staticUpTo are drawn instantly (already seen), the rest animate in.
 */
export default function GlassCracks({ glass, stage, staticUpTo = 0, className }) {
  const groups = [];
  for (let s = 1; s <= Math.min(stage, 4); s++) {
    groups.push(<Stage key={s} pieces={glass.stages[s]} animate={s > staticUpTo} />);
  }
  return (
    <svg className={className} viewBox={`0 0 ${glass.w} ${glass.h}`} preserveAspectRatio="none" aria-hidden="true">
      {groups}
    </svg>
  );
}
