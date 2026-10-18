"use client";
import "./EasterBug.css";

import { useEffect, useRef, useState } from "react";
import BugFinale from "./BugFinale";

// One short prompt per pass. The last pass leads into the existing finale.
const MESSAGES = [
  {
    title: "Keep exploring",
    body: "Scroll to discover what GCC is building.",
    cue: "A little more to explore",
  },
  {
    title: "This feels familiar",
    body: "The page is looping on purpose. Keep scrolling to see why.",
    cue: "The loop is intentional",
  },
  {
    title: "What does this loop uncover?",
    body: "There’s something hidden in the code. Follow the loop to find it.",
    cue: "Something is hidden",
  },
  {
    title: "You found the bug",
    body: "One more pass reveals what happened.",
    cue: "Final pass",
  },
];
const LOOPS = MESSAGES.length;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Watches progress through the endless loop.
 *  - A themed interstitial appears briefly around the middle of each pass.
 *  - After the 4th pass the existing finale plays, then bug is set to false.
 */
export default function EasterBug({ active }) {
  const interstitialRef = useRef(null);
  const [message, setMessage] = useState(0);
  const [finale, setFinale] = useState(false);

  useEffect(() => {
    if (!active || finale) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const loop = window.__gccLoop;
      const el = interstitialRef.current;
      if (!loop || !el) return;
      const progress = loop.progress();
      if (progress >= LOOPS) {
        setFinale(true);
        return;
      }
      const index = Math.floor(progress);
      const intensity = smooth(0.38, 0.45, progress - index) * (1 - smooth(0.55, 0.62, progress - index));
      el.style.setProperty("--i", intensity.toFixed(3));
      el.classList.toggle("is-on", intensity > 0.01);
      if (intensity > 0.01) setMessage(((index % LOOPS) + LOOPS) % LOOPS);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active, finale]);

  return (
    <>
      {active && !finale && (
        <div ref={interstitialRef} className="loop-interstitial" aria-hidden="true">
          <div className="loop-message">
            <div className="loop-message-meta">
              <span className="loop-message-dot" />
              <span>{MESSAGES[message].cue}</span>
              <span className="loop-message-count">{String(message + 1).padStart(2, "0")} / {String(LOOPS).padStart(2, "0")}</span>
            </div>
            <p className="loop-message-title">{MESSAGES[message].title}</p>
            <p className="loop-message-body">{MESSAGES[message].body}</p>
            <div className="loop-message-progress" aria-hidden="true">
              {MESSAGES.map((item, index) => <span key={item.title} className={index <= message ? "is-complete" : ""} />)}
            </div>
          </div>
        </div>
      )}
      {finale && <BugFinale onDone={() => setFinale(false)} />}
    </>
  );
}
