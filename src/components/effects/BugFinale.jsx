"use client";
import "./EasterBug.css";

import { useEffect, useRef, useState } from "react";
import { GitBranch, GitMerge } from "lucide-react";
import { siGithub } from "simple-icons";
import { setBug } from "@/lib/easterBug";

const LOOPS_LABEL = 4; // shown in the HUD
const TYPE_MS = 22; // typing speed for commands (matches the CSS)
const OPEN_MS = 2200; // how long "terminal is now opening" stays up before the page returns

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

const rnd = Math.random;
const f1 = (n) => n.toFixed(1);
const toPath = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${f1(p[0])} ${f1(p[1])}`).join(" ");

// Builds the cracks (SVG paths) and the glass shards for the current viewport.
function buildGlass(w, h) {
  const cx = w * (0.38 + rnd() * 0.24);
  const cy = h * (0.36 + rnd() * 0.22);
  const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.05;

  // Cracks: rays from the impact point, with branches and broken rings between them.
  const cracks = [];
  const rays = [];
  const RAYS = 18;
  for (let r = 0; r < RAYS; r++) {
    let angle = (r / RAYS) * Math.PI * 2 + (rnd() - 0.5) * 0.22;
    let x = cx;
    let y = cy;
    let dist = 0;
    const pts = [[x, y, 0]];
    while (dist < maxR) {
      const step = 28 + rnd() * 64;
      angle += (rnd() - 0.5) * 0.45;
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      dist += step;
      pts.push([x, y, dist]);
      if (rnd() < 0.2 && dist > 60) {
        let bx = x;
        let by = y;
        let bAngle = angle + (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.7);
        let bDist = 0;
        const bLen = 60 + rnd() * 220;
        const bPts = [[bx, by]];
        while (bDist < bLen) {
          const s = 22 + rnd() * 40;
          bAngle += (rnd() - 0.5) * 0.6;
          bx += Math.cos(bAngle) * s;
          by += Math.sin(bAngle) * s;
          bDist += s;
          bPts.push([bx, by]);
        }
        cracks.push({ d: toPath(bPts), delay: (dist / maxR) * 0.75, dur: 0.2 + bDist / 900, w: 0.8 });
      }
      if (x < -40 || x > w + 40 || y < -40 || y > h + 40) break;
    }
    rays.push(pts);
    cracks.push({ d: toPath(pts), delay: 0, dur: 0.45 + (dist / maxR) * 0.5, w: 1.4 + rnd() * 1.1 });
  }

  const pointAt = (pts, R) => {
    for (let i = 1; i < pts.length; i++) {
      if (pts[i][2] >= R) {
        const a = pts[i - 1];
        const b = pts[i];
        const t = (R - a[2]) / (b[2] - a[2] || 1);
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      }
    }
    return null;
  };
  [70, 150, 260, 410, 600, 820].forEach((base) => {
    for (let r = 0; r < RAYS; r++) {
      if (rnd() < 0.3) continue;
      const R = base * (0.9 + rnd() * 0.2);
      const p = pointAt(rays[r], R);
      const q = pointAt(rays[(r + 1) % RAYS], R);
      if (!p || !q) continue;
      const mid = [(p[0] + q[0]) / 2 + (rnd() - 0.5) * 18, (p[1] + q[1]) / 2 + (rnd() - 0.5) * 18];
      cracks.push({ d: toPath([p, mid, q]), delay: (R / maxR) * 0.75 + 0.05, dur: 0.18, w: 0.9 });
    }
  });

  // Shards: a jittered grid, every cell split into two triangles.
  const cols = 11;
  const cellW = w / cols;
  const rows = Math.max(5, Math.round(h / cellW));
  const cellH = h / rows;
  const V = [];
  for (let j = 0; j <= rows; j++) {
    V[j] = [];
    for (let i = 0; i <= cols; i++) {
      const edgeX = i === 0 || i === cols;
      const edgeY = j === 0 || j === rows;
      V[j][i] = [i * cellW + (edgeX ? 0 : (rnd() - 0.5) * cellW * 0.7), j * cellH + (edgeY ? 0 : (rnd() - 0.5) * cellH * 0.7)];
    }
  }
  const shards = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = V[j][i];
      const b = V[j][i + 1];
      const c = V[j + 1][i + 1];
      const d = V[j + 1][i];
      const tris = (i + j) % 2 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]];
      tris.forEach((tri) => {
        const xs = tri.map((p) => p[0]);
        const ys = tri.map((p) => p[1]);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const bw = Math.max(1, Math.max(...xs) - minX);
        const bh = Math.max(1, Math.max(...ys) - minY);
        const mx = (xs[0] + xs[1] + xs[2]) / 3;
        const my = (ys[0] + ys[1] + ys[2]) / 3;
        const dist = Math.hypot(mx - cx, my - cy) / maxR;
        shards.push({
          left: minX,
          top: minY,
          width: bw,
          height: bh,
          poly: tri.map((p) => `${(((p[0] - minX) / bw) * 100).toFixed(2)}% ${(((p[1] - minY) / bh) * 100).toFixed(2)}%`).join(","),
          delay: dist * 0.7 + rnd() * 0.12,
          dx: ((mx - cx) / maxR) * 140 + (rnd() - 0.5) * 60,
          dy: 280 + rnd() * 560,
          rot: (rnd() - 0.5) * 80,
          tone: 7 + rnd() * 9,
        });
      });
    }
  }
  return { w, h, cracks, shards };
}

/**
 * Finale: the screen cracks, shatters, then a GitHub-style terminal boots and says
 * "terminal is now opening". At the end the bug flag is set to false (egg over).
 */
export default function BugFinale({ onDone }) {
  const [glass] = useState(() => buildGlass(window.innerWidth, window.innerHeight));
  const [phase, setPhase] = useState("crack"); // crack -> shatter -> terminal -> out
  const [integrity, setIntegrity] = useState(100);
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
    later(1000, () => doneRef.current());
  };

  // Crack and shatter timeline + integrity counter
  useEffect(() => {
    later(2300, () => setPhase("shatter"));
    later(3500, () => setPhase("terminal"));
    const start = performance.now() + 500;
    const id = setInterval(() => {
      const p = Math.min(1, Math.max(0, (performance.now() - start) / 1600));
      setIntegrity(Math.round(100 * (1 - p)));
    }, 50);
    later(2400, () => clearInterval(id));
    const pending = timers.current;
    return () => { clearInterval(id); pending.forEach(clearTimeout); };
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

  return (
    <div className={`fin-root is-${phase}`} role="dialog" aria-modal="true" aria-label="Easter egg">
      {/* The GitHub-style terminal, revealed when the glass falls away */}
      <div className={`fin-stage${opening ? " is-opening" : ""}`}>
        <div className="fin-gh" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d={siGithub.path} /></svg>
          <span className="fin-gh-ring" />
        </div>
        <div className="fin-term">
          <div className="fin-term-bar" aria-hidden="true"><i /><i /><i /><span>gcc@fast-nu: ~/gcc/easter-bug</span></div>
          <div className="fin-term-body" aria-hidden="true">
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
        </div>
        <div className="fin-open" aria-live="polite">
          <p>{opening ? "terminal is now opening" : ""}<span className="fin-dots" aria-hidden="true" /></p>
          <div className="fin-pr" aria-hidden="true">
            <span className="fin-pr-badge"><GitMerge size={15} /> Merged</span>
            <span className="fin-pr-title">fix: the loop is over <em>#404</em></span>
            <span className="fin-pr-branch"><GitBranch size={13} /> easter-bug → main</span>
          </div>
        </div>
        <span className="fin-skip" aria-hidden="true">esc to skip</span>
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
                background: `hsl(218 45% ${s.tone}% / .58)`,
                "--delay": `${s.delay.toFixed(2)}s`, "--dx": `${s.dx.toFixed(0)}px`, "--dy": `${s.dy.toFixed(0)}px`, "--rot": `${s.rot.toFixed(0)}deg`,
              }}
            />
          ))}
        </div>
        <svg className="fin-cracks" viewBox={`0 0 ${glass.w} ${glass.h}`} preserveAspectRatio="none">
          {["mag", "glow", "core"].map((layer) => (
            <g key={layer} className={`fin-layer-${layer}`}>
              {glass.cracks.map((c, i) => (
                <path
                  key={i}
                  d={c.d}
                  pathLength="1"
                  className="fin-crack"
                  style={{ "--delay": `${(0.5 + c.delay).toFixed(2)}s`, "--dur": `${c.dur.toFixed(2)}s`, strokeWidth: layer === "core" ? c.w : c.w + 2 }}
                />
              ))}
            </g>
          ))}
        </svg>
        <span className="fin-flash" />
        <span className="fin-flash fin-flash-2" />
        <div className="fin-hud">
          <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
          <div className="fin-hud-top">
            <span>⚠ SYSTEM INTEGRITY</span>
            <span className="fin-meter"><b style={{ width: `${integrity}%` }} /></span>
            <span className="fin-pct">{integrity}%</span>
          </div>
          <div className="fin-hud-bot">ERR_LOOP_OVERFLOW :: render() × {LOOPS_LABEL} :: KERNEL PANIC</div>
        </div>
      </div>
    </div>
  );
}


