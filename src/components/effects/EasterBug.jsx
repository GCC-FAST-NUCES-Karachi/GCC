"use client";
import "./EasterBug.css";

import { useEffect, useRef, useState } from "react";
import BugFinale from "./BugFinale";
import GlassCracks from "./GlassCracks";
import { getGlass, resetGlass } from "@/lib/glass";

const LOOPS = 4; // after this many passes the glass shatters (BugFinale)
const MAX_CRACK_STAGE = 3; // loops 1-3 add cracks, loop 4 is the finale
const SHAKE_PX = [0, 3, 5, 8]; // tremor strength per stage
const FLASH_PEAK = [0, 0.1, 0.16, 0.26]; // white flash strength per stage

/**
 * Watches progress through the endless loop.
 *  - Every completed pass adds more white cracks to the screen (stages 1-3).
 *  - Cracks never heal, even if the visitor scrolls back up.
 *  - After the 4th pass the finale shatters the glass, then bug is set to false.
 */
export default function EasterBug({ active }) {
  const [stage, setStage] = useState(0);
  const [glass, setGlass] = useState(null);
  const [finale, setFinale] = useState(false);
  const stageRef = useRef(0);

  // Build the glass data while the browser is idle, so the first crack never hitches.
  useEffect(() => {
    if (!active) return undefined;
    const build = () => setGlass(getGlass());
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(build, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(build, 400);
    return () => clearTimeout(id);
  }, [active]);

  useEffect(() => {
    if (!active || finale) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const loop = window.__gccLoop;
      if (!loop) return;
      const progress = loop.progress();
      if (progress >= LOOPS) {
        setFinale(true);
        return;
      }
      // Only ever go up, and only touch React state when the stage really changes.
      const next = Math.min(MAX_CRACK_STAGE, Math.max(0, Math.floor(progress)));
      if (next > stageRef.current) {
        stageRef.current = next;
        setStage(next);
      }
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
      {active && !finale && glass && stage > 0 && (
        <>
          {/* Alternating class names restart the tremor on every new stage without remounting the cracks. */}
          <div
            className={`loop-glass ${stage % 2 ? "shake-a" : "shake-b"}`}
            style={{ "--amp": `${SHAKE_PX[stage]}px` }}
            aria-hidden="true"
          >
            <GlassCracks glass={glass} stage={stage} className="loop-cracks" />
          </div>
          <span key={stage} className="loop-flash" style={{ "--peak": FLASH_PEAK[stage] }} aria-hidden="true" />
        </>
      )}
      {finale && (
        <BugFinale
          startStage={stageRef.current}
          onDone={() => {
            resetGlass();
            setFinale(false);
          }}
        />
      )}
    </>
  );
}
