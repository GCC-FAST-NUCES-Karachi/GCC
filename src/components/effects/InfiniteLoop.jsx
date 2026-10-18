"use client";
import "./InfiniteLoop.css";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { getBug, getServerBug, subscribe } from "@/lib/easterBug";
import EasterBug from "./EasterBug";

/**
 * Endless scroll. The children are rendered three times back to back. The page
 * opens at its normal top. Once the visitor scrolls past the end (or up from the
 * top) the scroll position is kept inside the middle copy by jumping exactly one
 * copy height. The copies are identical, so the jump is invisible and the page
 * never ends in either direction.
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
    const top = topRef.current;
    const mid = midRef.current;
    if (!top || !mid) return undefined;

    // Only the middle copy keeps its ids so #hash links and aria references hit it.
    const outer = [top, mid.nextElementSibling].filter(Boolean);
    outer.forEach((copy) => copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id")));

    document.body.classList.add("is-looping");

    let period = 0; // height of one copy
    let offset = 0; // total distance jumped, so scroll stays continuous for other effects
    let looped = false; // false until the first jump, so the page opens at its normal top
    let frame = 0;
    let touchY = 0;

    const measure = () => {
      period = mid.getBoundingClientRect().top - top.getBoundingClientRect().top;
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
      if (y >= 2 * period - 1) {
        jump(Math.floor((y - period + 1) / period)); // past the end: back one copy
      } else if (looped && y < period - 1) {
        jump(-1); // scrolled up out of the middle copy: forward one copy
      }
    };

    // Scrolling up from the very top: reveal the end of the previous copy.
    const revealAbove = () => {
      if (looped || period < 1 || window.scrollY > 0) return;
      jump(-1);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(normalize);
    };
    const onWheel = (event) => { if (event.deltaY < 0) revealAbove(); };
    const onKeyDown = (event) => { if (event.key === "ArrowUp" || event.key === "PageUp") revealAbove(); };
    const onTouchStart = (event) => { touchY = event.touches[0].clientY; };
    const onTouchMove = (event) => { if (event.touches[0].clientY > touchY) revealAbove(); };

    measure();
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
    resizeObserver.observe(mid);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
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
          <div ref={topRef} className="infinite-loop-copy" aria-hidden="true" inert>{children}</div>
          <div ref={midRef} className="infinite-loop-copy">{children}</div>
          <div className="infinite-loop-copy" aria-hidden="true" inert>{children}</div>
        </>
      ) : children}
      <EasterBug active={bug} />
    </>
  );
}
