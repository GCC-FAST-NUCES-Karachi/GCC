"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BLOCK_LIST,
  BLOCK_SET,
  COLS,
  FOOD_TTL_MS,
  MIN_TICK_MS,
  NO_SPAWN,
  ROWS,
  START_DIRECTION,
  START_FOOD,
  START_SNAKE,
  START_TICK_MS,
  TICK_STEP_MS,
  WIN_SCORE,
} from "./config";

const STORAGE_KEY = "gcc-commit-snake-v2";

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const KEY_TO_DIR = {
  arrowup: DIRS.up,
  w: DIRS.up,
  arrowdown: DIRS.down,
  s: DIRS.down,
  arrowleft: DIRS.left,
  a: DIRS.left,
  arrowright: DIRS.right,
  d: DIRS.right,
};
const STATUS_LABEL = {
  idle: "READY",
  running: "LIVE",
  paused: "PAUSED",
  won: "SHIPPED",
  lost: "CRASHED",
};

const pad = (n) => String(n).padStart(2, "0");
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

function createGame() {
  return {
    snake: START_SNAKE.map((p) => ({ ...p })),
    dir: START_DIRECTION,
    queue: [],
    food: { ...START_FOOD },
    foodLeft: FOOD_TTL_MS,
    score: 0,
    elapsed: 0,
    acc: 0,
    status: "idle",
  };
}

function snapshot(g) {
  return {
    status: g.status,
    score: g.score,
    seconds: Math.floor(g.elapsed / 1000),
    ttl: Math.ceil(Math.max(0, g.foodLeft) / 1000),
  };
}

function spawnFood(snake, previous) {
  const taken = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const key = `${x},${y}`;
      if (BLOCK_SET.has(key) || NO_SPAWN.has(key) || taken.has(key)) continue;
      if (previous && previous.x === x && previous.y === y) continue;
      free.push({ x, y });
    }
  }
  return free.length ? free[Math.floor(Math.random() * free.length)] : previous;
}

function step(g) {
  const next = g.queue.shift();
  if (next) g.dir = next;
  const head = g.snake[0];
  const nx = (head.x + g.dir.x + COLS) % COLS;
  const ny = (head.y + g.dir.y + ROWS) % ROWS;
  const ate = g.food && nx === g.food.x && ny === g.food.y;
  const body = ate ? g.snake : g.snake.slice(0, -1);

  if (BLOCK_SET.has(`${nx},${ny}`) || body.some((p) => p.x === nx && p.y === ny)) {
    g.status = "lost";
    return;
  }

  g.snake = [{ x: nx, y: ny }, ...body];
  if (!ate) return;

  g.score += 1;
  if (g.score >= WIN_SCORE) {
    g.status = "won";
    g.food = null;
    return;
  }
  g.food = spawnFood(g.snake, g.food);
  g.foodLeft = FOOD_TTL_MS;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

export default function CommitSnake() {
  const canvasRef = useRef(null);
  const gameRef = useRef(createGame());
  const bestRef = useRef({ score: 0, time: null });
  const reducedMotion = useRef(false);
  const swipeStart = useRef(null);

  const [hud, setHud] = useState(() => snapshot(createGame()));
  const [best, setBest] = useState({ score: 0, time: null });
  const [newBest, setNewBest] = useState(false);

  const syncHud = useCallback(() => {
    const next = snapshot(gameRef.current);
    setHud((prev) =>
      prev.status === next.status &&
      prev.score === next.score &&
      prev.seconds === next.seconds &&
      prev.ttl === next.ttl
        ? prev
        : next
    );
  }, []);

  /* ---------- drawing ---------- */
  const draw = useCallback((now = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const c = canvas.width / COLS;
    if (!c) return;
    const g = gameRef.current;
    const won = g.status === "won";
    const lost = g.status === "lost";

    ctx.fillStyle = "#080d12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(88,166,255,.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < COLS; x += 1) {
      ctx.moveTo(x * c, 0);
      ctx.lineTo(x * c, canvas.height);
    }
    for (let y = 1; y < ROWS; y += 1) {
      ctx.moveTo(0, y * c);
      ctx.lineTo(canvas.width, y * c);
    }
    ctx.stroke();

    // GCC blockers (light up green when you ship)
    ctx.save();
    if (won) {
      ctx.shadowColor = "rgba(63,185,80,.9)";
      ctx.shadowBlur = c * 0.5;
    }
    ctx.fillStyle = won ? "#2ea043" : "#38404a";
    ctx.strokeStyle = won ? "#7ee787" : "#525a65";
    ctx.lineWidth = Math.max(1, c * 0.04);
    for (const { x, y } of BLOCK_LIST) {
      const i = c * 0.08;
      roundRect(ctx, x * c + i, y * c + i, c - i * 2, c - i * 2, c * 0.18);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // commit pickup with countdown ring
    if (g.food) {
      const cx = g.food.x * c + c / 2;
      const cy = g.food.y * c + c / 2;
      const left = Math.max(0, g.foodLeft / FOOD_TTL_MS);
      const urgent = left < 0.3 && g.status === "running";
      const color = urgent ? "#f0883e" : "#3fb950";
      const pulse = reducedMotion.current ? 1 : 1 + Math.sin(now / 180) * 0.08;
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = c * 0.6;
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = color;
      const s = c * 0.34 * pulse;
      roundRect(ctx, -s / 2, -s / 2, s, s, c * 0.05);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, c * 0.07);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, c * 0.44, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left);
      ctx.stroke();
      ctx.restore();
    }

    // snake
    const len = g.snake.length;
    g.snake.forEach((part, i) => {
      const inset = c * 0.1;
      const isHead = i === 0;
      ctx.save();
      ctx.globalAlpha = lost ? 0.55 : 1;
      ctx.fillStyle = isHead
        ? lost
          ? "#f85149"
          : "#56d364"
        : `hsl(135 55% ${44 - (i / Math.max(len, 1)) * 14}%)`;
      ctx.shadowColor = "rgba(63,185,80,.35)";
      ctx.shadowBlur = isHead ? c * 0.4 : 0;
      roundRect(ctx, part.x * c + inset, part.y * c + inset, c - inset * 2, c - inset * 2, c * 0.22);
      ctx.fill();
      ctx.restore();

      if (isHead) {
        const d = g.dir;
        const px = -d.y;
        const py = d.x;
        const hx = part.x * c + c / 2;
        const hy = part.y * c + c / 2;
        ctx.fillStyle = "#04110a";
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.arc(hx + d.x * c * 0.16 + px * side * c * 0.17, hy + d.y * c * 0.16 + py * side * c * 0.17, c * 0.07, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }, []);

  /* ---------- finishing a run ---------- */
  const finish = useCallback((g) => {
    const prev = bestRef.current;
    const next = { score: Math.max(prev.score, g.score), time: prev.time };
    let isNew = g.score > prev.score;
    if (g.status === "won" && (prev.time === null || g.elapsed < prev.time)) {
      next.time = g.elapsed;
      isNew = true;
    }
    bestRef.current = next;
    setBest(next);
    setNewBest(isNew);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable, ignore */
    }
  }, []);

  /* ---------- game loop ---------- */
  useEffect(() => {
    let raf;
    let last = performance.now();
    const frame = (now) => {
      const g = gameRef.current;
      const dt = Math.min(now - last, 100);
      last = now;

      if (g.status === "running") {
        g.elapsed += dt;
        g.foodLeft -= dt;
        g.acc += dt;

        if (g.foodLeft <= 0 && g.food) {
          g.food = spawnFood(g.snake, g.food);
          g.foodLeft = FOOD_TTL_MS;
        }

        const tick = Math.max(MIN_TICK_MS, START_TICK_MS - g.score * TICK_STEP_MS);
        while (g.acc >= tick && g.status === "running") {
          g.acc -= tick;
          step(g);
        }
        if (g.status !== "running") finish(g);
      }

      draw(now);
      syncHud();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [draw, finish, syncHud]);

  /* ---------- canvas sizing, saved best, motion pref, tab visibility ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cell = Math.max(8, Math.floor((rect.width * dpr) / COLS));
      canvas.width = cell * COLS;
      canvas.height = cell * ROWS;
      draw(performance.now());
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = motion.matches;
    const onMotion = (e) => { reducedMotion.current = e.matches; };
    motion.addEventListener("change", onMotion);

    const onHidden = () => {
      const g = gameRef.current;
      if (document.hidden && g.status === "running") g.status = "paused";
    };
    document.addEventListener("visibilitychange", onHidden);

    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
        if (saved && Number.isFinite(saved.score)) {
          bestRef.current = { score: saved.score, time: Number.isFinite(saved.time) ? saved.time : null };
          setBest(bestRef.current);
        }
      } catch {
        /* ignore */
      }
    }, 0);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onHidden);
      window.clearTimeout(timer);
    };
  }, [draw]);

  /* ---------- actions ---------- */
  const begin = useCallback(() => {
    const g = gameRef.current;
    if (g.status === "won" || g.status === "lost") {
      gameRef.current = createGame();
      setNewBest(false);
    }
    gameRef.current.status = "running";
    syncHud();
  }, [syncHud]);

  const restart = useCallback(() => {
    gameRef.current = createGame();
    setNewBest(false);
    syncHud();
  }, [syncHud]);

  const togglePause = useCallback(() => {
    const g = gameRef.current;
    if (g.status === "running") g.status = "paused";
    else if (g.status === "paused") g.status = "running";
    syncHud();
  }, [syncHud]);

  const steer = useCallback((dir) => {
    const g = gameRef.current;
    if (g.status !== "running") return;
    const last = g.queue[g.queue.length - 1] || g.dir;
    const opposite = dir.x === -last.x && dir.y === -last.y;
    const same = dir.x === last.x && dir.y === last.y;
    if (!opposite && !same && g.queue.length < 2) g.queue.push(dir);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target?.closest?.("input, textarea, select")) return;
      const key = event.key.toLowerCase();
      const status = gameRef.current.status;

      const dir = KEY_TO_DIR[key];
      if (dir && status === "running") {
        event.preventDefault();
        steer(dir);
        return;
      }
      if (key === " " || key === "p") {
        if (target?.closest?.("button, a")) return; // let focused buttons handle their own Space
        event.preventDefault();
        if (status === "running" || status === "paused") togglePause();
        else begin();
        return;
      }
      if (key === "r" && status !== "idle") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [begin, restart, steer, togglePause]);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    swipeStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!swipeStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - swipeStart.current.x;
    const dy = t.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? DIRS.right : DIRS.left) : dy > 0 ? DIRS.down : DIRS.up);
  };

  /* ---------- render ---------- */
  const { status, score, seconds, ttl } = hud;
  const live = status === "running" || status === "paused";
  const showOverlay = status !== "running";

  const overlay = {
    idle: { kicker: "// uncommitted changes", title: "Ready to branch out?", text: `Collect ${WIN_SCORE} commits before they expire. Avoid the GCC blocks.`, cta: "Start run", Icon: Play },
    paused: { kicker: "// working tree saved", title: "Run paused", text: "Your branch will wait for you.", cta: "Resume", Icon: Play },
    lost: { kicker: "// branch terminated", title: "Branch terminated.", text: `You collected ${score} of ${WIN_SCORE} commits in ${formatTime(seconds * 1000)}.`, cta: "Play again", Icon: RotateCcw },
    won: { kicker: "// all commits collected", title: "GCC shipped.", text: `${WIN_SCORE} commits in ${formatTime(seconds * 1000)}. Nice work!`, cta: "Play again", Icon: RotateCcw },
  }[status];

  return (
    <>
      <Link href="/games" className="games-back">
        <ArrowLeft size={16} aria-hidden="true" /> All games
      </Link>

      <header className="snake-heading">
        <p className="games-kicker">{"$ ./play commit-snake"}</p>
        <h1>
          Commit <span>Snake</span>
        </h1>
        <p>Collect {WIN_SCORE} commits, outrun the timer and ship the GCC.</p>
      </header>

      <div className="snake-layout">
        {/* ---------- scorecard ---------- */}
        <section className="snake-score" aria-label="Scorecard">
          <div className="score-head">
            <span className="games-kicker">{"// scorecard"}</span>
            <span className={`snake-pill is-${status}`}>{STATUS_LABEL[status]}</span>
          </div>

          <div className="score-main">
            <strong>{pad(score)}</strong>
            <span>/ {WIN_SCORE} commits</span>
          </div>

          <ol className="score-graph" aria-label={`${score} of ${WIN_SCORE} commits collected`}>
            {Array.from({ length: WIN_SCORE }, (_, i) => (
              <li key={i} className={i < score ? "on" : ""} data-level={Math.min(4, 1 + Math.floor(i / 4))} />
            ))}
          </ol>

          <dl className="score-stats">
            <div><dt>time</dt><dd>{formatTime(seconds * 1000)}</dd></div>
            <div><dt>best</dt><dd>{pad(Math.max(best.score, score))}</dd></div>
            <div><dt>fastest</dt><dd>{best.time === null ? "--" : formatTime(best.time)}</dd></div>
          </dl>

          <div className="score-ttl" data-warn={status === "running" && ttl <= 3}>
            <div className="score-ttl-label">
              <span>commit expires</span>
              <strong>{live ? `${ttl}s` : "--"}</strong>
            </div>
            <div className="score-ttl-bar" aria-hidden="true">
              <i style={{ width: `${live ? (ttl / (FOOD_TTL_MS / 1000)) * 100 : 100}%` }} />
            </div>
          </div>
        </section>

        {/* ---------- canvas ---------- */}
        <section className="snake-arena" aria-label="Commit Snake game">
          <div className="arena-bar">
            <span className="arena-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="arena-title">gcc-arcade ~ commit-snake</span>
            <button
              type="button"
              className="snake-pause"
              onClick={togglePause}
              disabled={!live}
              aria-label={status === "paused" ? "Resume game" : "Pause game"}
            >
              {status === "paused" ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              <span>{status === "paused" ? "Resume" : "Pause"}</span>
            </button>
          </div>

          <div className="arena-screen" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <canvas
              ref={canvasRef}
              className="arena-canvas"
              role="img"
              aria-label={`Commit Snake board. Score ${score} of ${WIN_SCORE}.`}
            />
            {showOverlay && (
              <div className={`arena-overlay is-${status}`}>
                <div className="overlay-card">
                  <p className="games-kicker">{overlay.kicker}</p>
                  <h2>{overlay.title}</h2>
                  <p className="overlay-text">{overlay.text}</p>
                  {newBest && (status === "won" || status === "lost") && <p className="overlay-badge">new personal best</p>}
                  <button type="button" className="snake-start" onClick={begin}>
                    <overlay.Icon size={16} aria-hidden="true" /> {overlay.cta}
                  </button>
                  {status === "idle" && <p className="overlay-hint">or press Space</p>}
                </div>
              </div>
            )}
          </div>

          <div className="snake-touch" aria-label="Touch controls">
            <button type="button" className="dpad-up" onClick={() => steer(DIRS.up)} aria-label="Move up"><ArrowUp aria-hidden="true" /></button>
            <button type="button" className="dpad-left" onClick={() => steer(DIRS.left)} aria-label="Move left"><ArrowLeft aria-hidden="true" /></button>
            <button type="button" className="dpad-down" onClick={() => steer(DIRS.down)} aria-label="Move down"><ArrowDown aria-hidden="true" /></button>
            <button type="button" className="dpad-right" onClick={() => steer(DIRS.right)} aria-label="Move right"><ArrowRight aria-hidden="true" /></button>
          </div>
        </section>

        {/* ---------- rules + keys ---------- */}
        <section className="snake-rules" aria-labelledby="snake-rules-heading">
          <p className="games-kicker" id="snake-rules-heading">{"$ cat RULES.md"}</p>
          <ol>
            <li><b>Ship it.</b> Collect {WIN_SCORE} commits to release the GCC.</li>
            <li><b>Beat the clock.</b> Each commit expires after {FOOD_TTL_MS / 1000} seconds and moves. No penalty.</li>
            <li><b>Watch your step.</b> Walls wrap around. Hitting a GCC block or your own tail ends the run.</li>
            <li><b>Speed builds.</b> Every commit makes the snake a little faster.</li>
          </ol>
          <div className="snake-keys">
            <p><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd><span>or WASD to move</span></p>
            <p><kbd>Space</kbd><span>start / pause</span></p>
            <p><kbd>R</kbd><span>reset</span></p>
          </div>
        </section>
      </div>

      <p className="games-sr" role="status">
        {status === "won" ? "You shipped the GCC." : status === "lost" ? `Run over. ${score} commits collected.` : ""}
      </p>
    </>
  );
}