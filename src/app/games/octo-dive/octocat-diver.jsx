// Octo Dive — Octocat mascot
// Uses the transparent animated GIF at /octocat/octocat.gif.
// The `unoptimized` prop is required so Next.js does not strip the animation.
// `depthPct` (0-1) controls how far down the mascot dives via CSS transform.

import Image from "next/image";

export default function OctocatDiver({ animate = true }) {
  // Sink up to 80px as depth grows (instant under prefers-reduced-motion via CSS)
  // const sinkPx = Math.round(depthPct * 80);
  const sinkPx = 0;

  return (
    <div
      className={`octo-mascot-wrap${animate ? "" : " octo-mascot-no-motion"}`}
      style={{ transform: `translateY(${sinkPx}px)` }}
      aria-hidden="true"
    >
      <Image
        src="/octocat/octocat.gif"
        alt="Octocat mascot"
        width={96}
        height={96}
        unoptimized
        className="octo-mascot-img"
        priority
      />
    </div>
  );
}
