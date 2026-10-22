"use client";
import "./EasterBug.css";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GitBranch, GitMerge } from "lucide-react";
import { setBug } from "@/lib/easterBug";
import { getGlass } from "@/lib/glass";
import GlassCracks from "./GlassCracks";

const TYPE_MS = 22; // typing speed for commands (matches the CSS)
const OPEN_MS = 2200; // how long "terminal is now opening" stays up before the page returns
const CLUE_DOTS = [0, 1, 2, 3];
const SHATTER_AT = 1100; // ms: final cracks finish, glass breaks
const TERMINAL_AT = 2300; // ms: shards have fallen, terminal boots

// The GitHub-style terminal boot. `wait` is the pause after the line (and after typing, for commands).
const SCRIPT = [
  { kind: "cmd", text: "git fetch origin easter-bug", wait: 450 },
  { kind: "out", text: "remote: Enumerating objects: 404, done.", wait: 300 },
  { kind: "out", text: "remote: Counting objects: 100% (404/404), done.", wait: 300 },
  { kind: "progress", wait: 900 },
  { kind: "cmd", text: "git checkout easter-bug", wait: 350 },
  { kind: "out", text: "Switched to branch 'easter-bug'", wait: 450 },
  { kind: "cmd", text: 'git merge --no-ff easter-bug', wait: 450 },
  { kind: "ok", text: "Merge made by the 'ort' strategy.", wait: 300 },
  { kind: "del", text: "-  bug = true", wait: 220 },
  { kind: "add", text: "+  bug = false", wait: 500 },
  { kind: "cmd", text: "./terminal --open", wait: 500 },
];

/**
 * Finale: the cracks from the loops are completed, the screen shatters, then a
 * GitHub-style terminal boots and says "terminal is now opening". At the end the
 * bug flag is set to false (egg over).
 */
export default function BugFinale({ onDone, startStage = 3 }) {
  const router = useRouter();
  const [glass] = useState(() => getGlass()); // same cracks the visitor already saw
  const [phase, setPhase] = useState("crack"); // crack -> shatter -> terminal -> out
  const [shown, setShown] = useState(0);
  const [opening, setOpening] = useState(false);
  const timers = useRef([]);
  const finished = useRef(false);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; });

  const later = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    setBug(false); // the easter bug is over: loop off, terminal appears in the navbar
    setPhase("out");
    later(1000, () => {
      doneRef.current();
      router.push("/terminal");
    });
  };

  // Crack and shatter timeline
  useEffect(() => {
    later(SHATTER_AT, () => setPhase("shatter"));
    later(TERMINAL_AT, () => setPhase("terminal"));
    const pending = timers.current;
    return () => { pending.forEach(clearTimeout); };
  }, []);

  // Terminal script
  useEffect(() => {
    if (phase !== "terminal") return undefined;
    let t = 250;
    SCRIPT.forEach((line, i) => {
      later(t, () => setShown(i + 1));
      t += line.wait + (line.kind === "cmd" ? line.text.length * TYPE_MS : 0);
    });
    later(t + 200, () => setOpening(true));
    later(t + 200 + OPEN_MS, finish);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Lock scrolling and allow Esc to skip
  useEffect(() => {
    const stop = (event) => event.preventDefault();
    const onKey = (event) => {
      if (event.key === "Escape") finish();
      else if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) event.preventDefault();
    };
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the cinematic frame within the visible area on mobile browsers, where
  // the visual viewport can be smaller than the layout viewport.
  useEffect(() => {
    const root = document.querySelector(".fin-root");
    const viewport = window.visualViewport;
    if (!root || !viewport) return undefined;
    const syncViewport = () => {
      root.style.setProperty("--fin-vvh", `${viewport.height}px`);
      root.style.setProperty("--fin-vvt", `${viewport.offsetTop}px`);
    };
    syncViewport();
    viewport.addEventListener("resize", syncViewport);
    viewport.addEventListener("scroll", syncViewport);
    return () => {
      viewport.removeEventListener("resize", syncViewport);
      viewport.removeEventListener("scroll", syncViewport);
    };
  }, []);

  return (
    <div className={`fin-root is-${phase}`} role="dialog" aria-modal="true" aria-label="Easter egg">
      {/* The GitHub-style terminal, revealed when the glass falls away */}
      <div className={`fin-stage${opening ? " is-opening" : ""}`}>
        <div className="terminal-window fin-term">
          <div className="terminal-titlebar">
            <div className="terminal-dots" aria-hidden="true"><i className="terminal-dot terminal-dot--red" /><i className="terminal-dot terminal-dot--yellow" /><i className="terminal-dot terminal-dot--green" /></div>
            <div className="terminal-title"><span className="terminal-title-name">gcc-terminal</span><span className="terminal-branch-pill">⎇ easter-bug</span></div>
            <div className="terminal-pips is-unlocked" aria-hidden="true">{CLUE_DOTS.map((dot) => <span key={dot} className="terminal-pip is-on" />)}</div>
            <button type="button" className="terminal-close-btn" onClick={finish} aria-label="Skip to terminal">go back</button>
          </div>
          <div className="terminal-output fin-term-body" aria-hidden="true">
            {SCRIPT.slice(0, shown).map((line, i) => {
              const last = i === shown - 1 ? " is-last" : "";
              if (line.kind === "cmd") {
                return (
                  <div key={i} className={`fin-line${last}`}>
                    <span className="fin-prompt">$</span>{" "}
                    <span className="fin-type" style={{ "--n": line.text.length }}>{line.text}</span>
                  </div>
                );
              }
              if (line.kind === "progress") {
                return (
                  <div key={i} className={`fin-line fin-out${last}`}>
                    Receiving objects: <span className="fin-bar"><b /></span> 100% (404/404), 4.04 MiB | 40.40 MiB/s, done.
                  </div>
                );
              }
              return <div key={i} className={`fin-line fin-${line.kind}${last}`}>{line.text}</div>;
            })}
          </div>
          <div className="terminal-input-area" aria-hidden="true">
            <div className="terminal-input-row">
              <span className="terminal-prompt"><span className="terminal-prompt-branch">[easter-bug]</span><span className="terminal-prompt-sign">$</span></span>
              <div className="terminal-input-wrapper"><span className="fin-placeholder">type a command…</span></div>
              <span className="terminal-send" aria-hidden="true">
                <svg viewBox="0 0 20 20" focusable="false">
                  <path d="M16 5v5a2 2 0 0 1-2 2H5m3-3-3 3 3 3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="fin-open" aria-live="polite">
          <p>{opening ? "terminal is now opening" : ""}<span className="fin-dots" aria-hidden="true" /></p>
          <div className="fin-pr" aria-hidden="true">
            <span className="fin-pr-badge"><GitMerge size={15} /> Merged</span>
            <span className="fin-pr-title">fix: the loop is over <em>#404</em></span>
            <span className="fin-pr-branch"><GitBranch size={13} /> easter-bug → main</span>
          </div>
        </div>
        <button type="button" className="fin-skip" onClick={finish} aria-label="Skip terminal animation">esc or click to skip ↗</button>
      </div>

      {/* The cracking glass */}
      <div className="fin-glass" aria-hidden="true">
        <div className="fin-shards">
          {glass.shards.map((s, i) => (
            <span
              key={i}
              className="fin-shard"
              style={{
                left: s.left, top: s.top, width: s.width, height: s.height,
                clipPath: `polygon(${s.poly})`,
                background: `rgb(255 255 255 / ${s.alpha.toFixed(3)})`,
                "--delay": `${s.delay.toFixed(2)}s`, "--dx": `${s.dx.toFixed(0)}px`, "--dy": `${s.dy.toFixed(0)}px`, "--rot": `${s.rot.toFixed(0)}deg`,
              }}
            />
          ))}
        </div>
        {/* Stages the visitor already saw are drawn instantly; only the final burst animates. */}
        <GlassCracks glass={glass} stage={4} staticUpTo={startStage} className="fin-cracks" />
        <span className="fin-flash" />
        <span className="fin-flash fin-flash-2" />
      </div>
    </div>
  );
}
