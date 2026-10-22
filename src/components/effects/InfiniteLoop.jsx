"use client";
import "./InfiniteLoop.css";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { getBug, getServerBug, subscribe } from "@/lib/easterBug";
import EasterBug from "./EasterBug";

/**
 * Endless scroll, downward only. The children are rendered twice back to back and the
 * page opens at its normal top with nothing above the hero. Once the visitor scrolls
 * past the end of the first copy the scroll position jumps back exactly one copy height.
 * The copies are identical, so the jump is invisible and the page never ends going down.
 * Scrolling up simply stops at the top of the page.
 */
export default function InfiniteLoop({ children }) {
  const firstRef = useRef(null);
  const secondRef = useRef(null);
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
    const first = firstRef.current;
    const second = secondRef.current;
    if (!first || !second) return undefined;

    // Only the first copy keeps its ids so #hash links and aria references hit it.
    second.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

    document.body.classList.add("is-looping");

    let period = 0; // height of one copy
    let offset = 0; // total distance jumped back, so scroll stays continuous for other effects
    let frame = 0;
    // Downward travel, counted in loops. Only scrolling DOWN adds to it, scrolling up never
    // subtracts, and it always starts at 0 (a reload or hash link does not count as progress).
    let travelled = 0;
    let lastY = 0; // previous continuous scroll position, to measure each downward step

    const track = () => {
      const y = window.scrollY + offset;
      const step = y - lastY;
      // Ignore teleports (browser scroll restoration, End key): real scrolling never moves half a loop in one frame.
      if (step > 0 && step < period / 2) travelled += step / period;
      lastY = y;
    };

    const measure = () => {
      period = second.getBoundingClientRect().top - first.getBoundingClientRect().top;
    };

    const normalize = () => {
      frame = 0;
      if (period < 1) return;
      track(); // measure before any jump; jumps keep the continuous position unchanged
      const y = window.scrollY;
      // Browsers snap scroll positions to whole pixels, so allow 1px of slack.
      if (y >= period - 1) {
        const copies = Math.floor((y + 1) / period); // past the end of the first copy: back
        offset += copies * period;
        window.scrollTo({ top: y - copies * period, behavior: "instant" });
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(normalize);
    };

    measure();
    lastY = window.scrollY; // count from here: the visitor starts at 0 loops
    normalize();

    // Lets the galaxy background follow a continuous scroll value instead of the wrapped one.
    window.__gccLoop = {
      unwrappedY: () => window.scrollY + offset,
      // How many loops the visitor has scrolled DOWN through (1.5 = halfway through the second one).
      // Scrolling up never reduces it.
      progress: () => {
        track();
        return travelled;
      },
      distanceFromHero: () => {
        const p = ((window.scrollY % period) + period) % period;
        return Math.min(p, period - p);
      },
    };

    const resizeObserver = new ResizeObserver(() => {
      // Content height can change after load (fonts, images, resize): keep the jumped
      // distance a whole number of copies and do not count the change as scrolling.
      const previous = period;
      measure();
      if (previous > 0 && Math.abs(period - previous) > 0.5) {
        offset = Math.round(offset / previous) * period;
        lastY = window.scrollY + offset;
      }
      onScroll();
    });
    resizeObserver.observe(first);
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
          <div ref={firstRef} className="infinite-loop-copy">{children}</div>
          <div ref={secondRef} className="infinite-loop-copy" aria-hidden="true" inert>{children}</div>
        </>
      ) : children}
      <EasterBug active={bug} />
    </>
  );
}
