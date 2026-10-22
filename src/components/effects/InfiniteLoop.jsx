"use client";
import "./InfiniteLoop.css";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { getBug, getServerBug, subscribe } from "@/lib/easterBug";
import EasterBug from "./EasterBug";

/**
 * Repeat the landing page as visitors scroll down. The page opens at its real
 * top; upward scrolling remains ordinary page scrolling. Progress is preserved
 * across each downward wrap for the Easter egg hints and background effects.
 */
export default function InfiniteLoop({ children }) {
  const topRef = useRef(null);
  const midRef = useRef(null);
  const wasBug = useRef(true);
  // While bug is true the loop runs. The easter egg finale sets it to false.
  const bug = useSyncExternalStore(subscribe, getBug, getServerBug);

  useEffect(() => {
    if (!bug) {
      // The egg just ended: go back to the normal top of the page.
      if (wasBug.current) window.scrollTo({ top: 0, behavior: "instant" });
      wasBug.current = false;
      return undefined;
    }
    wasBug.current = true;
    const first = topRef.current;
    const second = midRef.current;
    if (!first || !second) return undefined;

    // The first copy is the interactive copy and owns the page IDs.
    const outer = [second, second.nextElementSibling, second.nextElementSibling?.nextElementSibling].filter(Boolean);
    outer.forEach((copy) => copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id")));

    document.body.classList.add("is-looping");

    let period = 0; // height of one copy
    let offset = 0; // total distance jumped, so scroll stays continuous for other effects
    let looped = false;
    let frame = 0;

    const measure = () => {
      period = second.getBoundingClientRect().top - first.getBoundingClientRect().top;
    };

    const jump = (copies) => {
      offset += copies * period;
      looped = true;
      window.scrollTo({ top: window.scrollY - copies * period, behavior: "instant" });
    };

    const normalize = () => {
      frame = 0;
      if (period < 1) return;
      const y = window.scrollY;
      // Browsers snap scroll positions to whole pixels, so allow 1px of slack.
      if (y >= 3 * period - 1) {
        // Return to the first copy while preserving the scroll progress value.
        const copies = Math.floor(y / period);
        jump(copies);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(normalize);
    };
    measure();
    if (window.location.hash) {
      // Hash navigation targets IDs in the first interactive copy.
      offset = 0;
      looped = true;
    }
    normalize();

    // Lets the galaxy background follow a continuous scroll value instead of the wrapped one.
    window.__gccLoop = {
      unwrappedY: () => window.scrollY + offset,
      // How many loops the visitor has scrolled through (1.5 = halfway through the second one).
      progress: () => (window.scrollY + offset) / period,
      distanceFromHero: () => {
        const p = (((window.scrollY - period) % period) + period) % period;
        return Math.min(p, period - p);
      },
    };

    const resizeObserver = new ResizeObserver(() => {
      // Content height can change after load (fonts, images, resize). Once looping, keep
      // the same spot inside the loop instead of letting the old position land elsewhere.
      const previous = period;
      measure();
      if (looped && previous > 0 && Math.abs(period - previous) > 0.5) {
        window.scrollTo({ top: window.scrollY + (period - previous), behavior: "instant" });
      }
      onScroll();
    });
    resizeObserver.observe(second);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      delete window.__gccLoop;
      document.body.classList.remove("is-looping");
    };
  }, [bug]);

  return (
    <>
      {bug ? (
        <>
          <div ref={topRef} className="infinite-loop-copy">{children}</div>
          <div ref={midRef} className="infinite-loop-copy" aria-hidden="true">{children}</div>
          <div className="infinite-loop-copy" aria-hidden="true">{children}</div>
          <div className="infinite-loop-copy" aria-hidden="true">{children}</div>
        </>
      ) : children}
      <EasterBug active={bug} />
    </>
  );
}
