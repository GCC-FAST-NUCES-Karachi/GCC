"use client";
import "./EasterBug.css";

import { useEffect, useRef, useState } from "react";
import BugFinale from "./BugFinale";

// One message per loop, shown in the middle of that loop. After the 4th loop the finale starts.
const MESSAGES = ["Keep Scrolling", "Do Discover", "Can you find the bug!", "Is it really a bug?"];
const LOOPS = MESSAGES.length;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Watches how far the visitor has scrolled through the endless loop.
 *  - Halfway through each loop a full-screen glitch message flickers in and out like a rendering bug.
 *  - After the 4th loop the cracking-screen finale plays, then bug is set to false.
 */
export default function EasterBug({ active }) {
  const glitchRef = useRef(null);
  const [message, setMessage] = useState(0);
  const [finale, setFinale] = useState(false);

  useEffect(() => {
    if (!active || finale) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const loop = window.__gccLoop;
      const el = glitchRef.current;
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
        <div ref={glitchRef} className="bug-glitch" aria-hidden="true">
          <span className="bug-scan" />
          <span className="bug-tear" style={{ "--t": "14%", "--h": "5%", "--d": "0s" }} />
          <span className="bug-tear" style={{ "--t": "38%", "--h": "2%", "--d": "-.5s" }} />
          <span className="bug-tear" style={{ "--t": "61%", "--h": "7%", "--d": "-1.1s" }} />
          <span className="bug-tear" style={{ "--t": "83%", "--h": "3%", "--d": "-.8s" }} />
          <p className="bug-text" data-text={MESSAGES[message]}>{MESSAGES[message]}</p>
          <span className="bug-cap bug-cap-tl"><i />Uncaught RangeError: Maximum call stack size exceeded</span>
          <span className="bug-cap bug-cap-bl">at render (InfiniteLoop.jsx:∞) · loop {message + 1}/{LOOPS}</span>
          <span className="bug-cap bug-cap-br">0x{(0xdead00 + message * 0x11).toString(16)}</span>
        </div>
      )}
      {finale && <BugFinale onDone={() => setFinale(false)} />}
    </>
  );
}
