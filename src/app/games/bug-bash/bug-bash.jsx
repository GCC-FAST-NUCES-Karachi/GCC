"use client";

import Link from "next/link";
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BIG_BUGS,
  BOARD_PAD,
  BOMBS,
  BOSS_BONUS,
  BOSS_GAP_MS,
  BOSS_HIT_POINTS,
  BOSS_HP,
  BOSS_HP_STEP,
  BOSS_TTL_MS,
  BUGS,
  BOSS_SPAWN_RATE,
  CHIP_TTL_END_MS,
  CHIP_TTL_JITTER,
  CHIP_FALL,
  CHIP_TTL_START_MS,
  CODE,
  COMBO_STEP,
  DISGUISED_BUGS,
  FALL_TIME_SCALE,
  FEATURES,
  FIRST_BOSS_MS,
  FIRST_SPAWN_MS,
  LEVEL_MS,
  LINE_H,
  LINES,
  MAX_LIVES,
  MAX_MULT,
  MINI_ESCAPE_DAMAGE,
  MINI_TTL_MS,
  POINTS,
  POWERS,
  MOVE_CHANCE_END,
  MOVE_CHANCE_START,
  MOVE_SPEED_MAX,
  MOVE_SPEED_MIN,
  RAMP_CURVE,
  RAMP_MS,
  RANKS,
  SLOW_FACTOR,
  SLOW_MS,
  SOURCE,
  SPAWN_END_MS,
  SPAWN_JITTER,
  SPAWN_START_MS,
  SPAWN_TABLE,
  SPLIT_BUGS,
} from "./config";

const STORAGE_KEY = "gcc-bug-bash-v1";

const STATUS_LABEL = {
  idle: "READY",
  running: "LIVE",
  paused: "PAUSED",
  lost: "FAILED",
};

const BUG_KINDS = new Set(["bug", "big", "split", "mini", "disguise"]);
const LABELS = { bug: BUGS, big: BIG_BUGS, disguise: DISGUISED_BUGS, code: CODE, feature: FEATURES, bomb: BOMBS };
const ICONS = { bug: "●", mini: "•", split: "◆", big: "⬤", feature: "✓", bomb: "⚠", hotfix: "★", debug: "★", linter: "★" };
const HIT_MS = 260; // squash / miss animation length
const RED = "#f85149";
const GREEN = "#3fb950";
const PURPLE = "#bc8cff";

const isBug = (it) => BUG_KINDS.has(it.kind);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const multFor = (combo) => (combo < 1 ? 1 : Math.min(MAX_MULT, 1 + Math.floor((combo - 1) / COMBO_STEP)));
// 0 at the start of a run, 1 once fully ramped. See RAMP_CURVE in config.js.
const rampFor = (elapsed) => Math.min(elapsed / RAMP_MS, 1) ** RAMP_CURVE;
const lerp = (from, to, t) => from + (to - from) * t;
const jitter = (amount) => 1 - amount + Math.random() * amount * 2;
const pad = (n) => String(n).padStart(2, "0");

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

function rankFor(score) {
  let index = 0;
  RANKS.forEach((rank, i) => {
    if (score >= rank.score) index = i;
  });
  return { rank: RANKS[index].title, next: RANKS[index + 1] || null };
}

function toneFor(kind) {
  if (BUG_KINDS.has(kind) && kind !== "disguise") return "bug";
  if (kind === "disguise" || kind === "code") return "code";
  if (POWERS[kind]) return "power";
  return kind;
}

// Chips are laid out in px, so their widths are estimated from the monospace label.
function chipWidth(it) {
  const big = it.kind === "big";
  return it.label.length * (big ? 9.7 : 8.45) + (big ? 92 : 42);
}

// Leave the line-number gutter clear unless the board is too narrow for it.
const gutter = (g) => (g.width < 480 ? 8 : 56);

// Height of the chip body, and of the whole chip including its countdown bar.
const bodyHeight = (it) => (it.kind === "big" ? 40 : it.kind === "mini" ? 26 : 30);
const chipHeight = (it) => bodyHeight(it) + 5;
const lineTop = (line, kind) => BOARD_PAD + line * LINE_H - (kind === "big" ? 6 : 1);

function center(it) {
  return [it.x + chipWidth(it) / 2, it.y + bodyHeight(it) / 2];
}

// A falling chip escapes once its middle crosses the bottom edge of the board.
const fallSpeed = (g, it) => ((g.height - it.y - chipHeight(it) / 2) / it.ttl) * 1000;

// Pick a column for a falling chip: clear of every chip on the board if possible,
// otherwise at least clear of chips that are still entering at the top.
function fallX(g, it) {
  const min = gutter(g);
  const w = chipWidth(it);
  const room = Math.max(0, g.width - w - min - 14);
  const clear = (x, others) => others.every((o) => x + w + 12 < o.x || x > o.x + chipWidth(o) + 12);
  const live = g.items.filter((o) => !o.hit);
  const entering = live.filter((o) => o.y < chipHeight(o) * 2);
  let fallback = null;
  for (let i = 0; i < 12; i += 1) {
    const x = min + Math.random() * room;
    if (clear(x, live)) return x;
    if (fallback === null && clear(x, entering)) fallback = x;
  }
  return fallback;
}

/* ---------- game state ---------- */

function createGame(width = 820, height = 560, font = "monospace") {
  return {
    status: "idle",
    score: 0,
    combo: 0,
    maxCombo: 0,
    lives: MAX_LIVES,
    squashed: 0,
    bosses: 0,
    elapsed: 0,
    afterglow: 0, // effects keep playing briefly after a run ends
    items: [],
    fx: [],
    boss: null,
    slowLeft: 0,
    fever: false,
    flash: null,
    banner: null,
    comboAt: -1e9,
    endReason: "",
    nextSpawn: FIRST_SPAWN_MS,
    nextBoss: FIRST_BOSS_MS,
    uid: 0,
    width,
    height,
    font, // resolved board font, for canvas text
    sounds: [],
    announce: "",
    recorded: false,
  };
}

const sfx = (g, kind, n = 0) => g.sounds.push([kind, n]);

function burst(g, x, y, color, count, spread = 1) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (90 + Math.random() * 220) * spread;
    g.fx.push({
      id: ++g.uid,
      type: "particle",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 120,
      size: 3 + Math.round(Math.random() * 4),
      color,
      born: g.elapsed,
    });
  }
}

function floatText(g, text, x, y, color, size) {
  const left = Math.max(4, Math.min(x, g.width - text.length * size * 0.62 - 4));
  g.fx.push({ id: ++g.uid, type: "text", text, x: left, y, color, size, born: g.elapsed });
}

function setBanner(g, text, sub, color) {
  g.banner = { text, sub, color, born: g.elapsed };
  g.announce = `${text}. ${sub}.`;
}

function flash(g, color) {
  g.flash = { color, at: g.elapsed };
}

function breakCombo(g) {
  g.combo = 0;
  g.fever = false;
}

function hurt(g, text, it, color, flashColor, damage = 1) {
  const [cx, cy] = center(it);
  g.lives -= damage;
  breakCombo(g);
  floatText(g, text, cx - 60, cy - 24, color, 18);
  flash(g, flashColor);
  g.announce = `${text.replace(/ −[\d.]+$/, "")}. Build health ${Math.max(0, g.lives)} of ${MAX_LIVES}.`;
}

function end(g, reason) {
  g.status = "lost";
  g.endReason = reason;
  if (reason === "health") g.lives = 0;
  g.banner = null;
  g.announce = `${reason === "bomb" ? "You force pushed to main." : "Build failed."} Final score ${g.score}.`;
  sfx(g, reason === "bomb" ? "boom" : "over");
}

function spawn(g) {
  const seconds = g.elapsed / 1000;
  const ramp = rampFor(g.elapsed);
  const weights = Object.entries(SPAWN_TABLE).map(([kind, { weight, rampWeight = 0, after = 0, whenHurt }]) => {
    const locked = seconds < after || (whenHurt && g.lives >= MAX_LIVES);
    return [kind, locked ? 0 : weight + rampWeight * ramp];
  });
  let roll = Math.random() * weights.reduce((sum, [, weight]) => sum + weight, 0);
  let kind = "bug";
  for (const [k, weight] of weights) {
    roll -= weight;
    if (roll < 0) {
      kind = k;
      break;
    }
  }

  let label;
  let halves = null;
  if (kind === "split") ({ label, halves } = pick(SPLIT_BUGS));
  else if (POWERS[kind]) label = POWERS[kind];
  else label = pick(LABELS[kind]);

  const it = { id: ++g.uid, kind, label, halves, born: g.elapsed, vx: 0, vy: 0, hp: 0, maxHp: 0, hitAt: -1e9, hit: false, good: false };
  if (CHIP_FALL) {
    const x = fallX(g, it);
    if (x === null) return;
    it.x = x;
    it.y = -chipHeight(it); // starts just above the board and slides in
  } else {
    // one chip per line, with an empty line between neighbours
    const used = new Set(g.items.map((other) => other.line));
    const free = [];
    for (let line = 0; line < LINES - 1; line += 1) {
      if (!used.has(line) && !used.has(line - 1) && !used.has(line + 1)) free.push(line);
    }
    if (!free.length) return;
    it.line = pick(free);
    const min = gutter(g);
    it.x = min + Math.random() * Math.max(0, g.width - chipWidth(it) - min - 14);
    it.y = lineTop(it.line, kind);
  }
  // rendered position; motion is painted as an offset from it
  it.x0 = it.x;
  it.y0 = it.y;
  if ((kind === "bug" || kind === "split") && Math.random() < lerp(MOVE_CHANCE_START, MOVE_CHANCE_END, ramp)) {
    it.vx = (Math.random() < 0.5 ? -1 : 1) * lerp(MOVE_SPEED_MIN, MOVE_SPEED_MAX, Math.random()) * (1 + ramp);
  }
  if (kind === "big") it.hp = it.maxHp = Math.random() < 0.5 ? 2 : 3;
  it.ttl = lerp(CHIP_TTL_START_MS, CHIP_TTL_END_MS, ramp) * jitter(CHIP_TTL_JITTER) * (SPAWN_TABLE[kind].life || 1) * (CHIP_FALL ? FALL_TIME_SCALE : 1);
  if (CHIP_FALL) it.vy = fallSpeed(g, it);
  g.items.push(it);
}

function tick(g, real) {
  g.slowLeft = Math.max(0, g.slowLeft - real);
  const dt = real * (g.slowLeft > 0 ? SLOW_FACTOR : 1);
  g.elapsed += dt;
  const now = g.elapsed;
  g.fx = g.fx.filter((f) => now - f.born < (f.type === "particle" ? 700 : 900));

  const kept = [];
  for (const it of g.items) {
    if (it.hit) {
      if (now - it.hitAt < HIT_MS) kept.push(it);
      continue;
    }
    if (it.vx) {
      it.x += (it.vx * dt) / 1000;
      const min = gutter(g);
      const max = Math.max(min, g.width - chipWidth(it) - 14);
      if (it.x < min) {
        it.x = min;
        it.vx = Math.abs(it.vx);
      }
      if (it.x > max) {
        it.x = max;
        it.vx = -Math.abs(it.vx);
      }
    }
    if (it.vy) it.y += (it.vy * dt) / 1000;
    if (now - it.born > it.ttl) {
      if (isBug(it)) {
        const damage = it.kind === "mini" ? MINI_ESCAPE_DAMAGE : 1;
        hurt(g, `shipped to prod −${damage}`, it, "#ff7b72", RED, damage);
        sfx(g, "escape");
      }
      continue;
    }
    kept.push(it);
  }
  g.items = kept;

  g.nextSpawn -= dt * (g.boss ? BOSS_SPAWN_RATE : 1);
  if (g.nextSpawn <= 0) {
    spawn(g);
    g.nextSpawn = lerp(SPAWN_START_MS, SPAWN_END_MS, rampFor(now)) * jitter(SPAWN_JITTER);
  }

  if (!g.boss && now >= g.nextBoss) {
    const hp = BOSS_HP + g.bosses * BOSS_HP_STEP;
    g.boss = { hp, max: hp, born: now, hitAt: -1e9 };
    setBanner(g, "BOSS INCOMING", "legacy_monolith.js needs refactoring", RED);
    sfx(g, "boss");
  }
  if (g.boss && now - g.boss.born > BOSS_TTL_MS) {
    g.boss = null;
    g.nextBoss = now + BOSS_GAP_MS;
    g.lives -= 1;
    breakCombo(g);
    flash(g, RED);
    setBanner(g, "MONOLITH SURVIVED", "−1 build health", RED);
    sfx(g, "escape");
  }

  if (g.lives <= 0) end(g, "health");
}

function kill(g, it) {
  const before = multFor(g.combo);
  g.combo += 1;
  g.maxCombo = Math.max(g.maxCombo, g.combo);
  const mult = multFor(g.combo);
  const points = POINTS[it.kind] * mult * (g.fever ? 2 : 1);
  g.score += points;
  g.squashed += 1;

  const [cx, cy] = center(it);
  burst(g, cx, cy, g.fever ? GREEN : "#ff7b72", it.kind === "big" ? 22 : 12);
  burst(g, cx, cy, "#ffffff", 4, 0.6);
  floatText(g, `+${points}`, cx - 16, cy - 26, g.fever ? "#7ee787" : GREEN, 22 + mult * 5);
  g.comboAt = g.elapsed;

  if (mult > before) {
    flash(g, GREEN);
    if (mult === MAX_MULT && !g.fever) {
      g.fever = true;
      setBanner(g, "FEVER MODE", "double points until you slip", GREEN);
      sfx(g, "fever");
    } else if (!g.fever) {
      setBanner(g, `COMBO ×${mult}`, `${g.combo} in a row`, GREEN);
      sfx(g, "combo");
    }
  }
  sfx(g, "squash", g.combo);
}

function hit(g, id) {
  if (g.status !== "running") return;
  const it = g.items.find((item) => item.id === id);
  if (!it || it.hit) return;
  const now = g.elapsed;
  const [cx, cy] = center(it);
  const settle = (good) => {
    it.hit = true;
    it.good = good;
    it.hitAt = now;
  };

  if (it.kind === "bomb") {
    settle(false);
    burst(g, cx, cy, "#ffa657", 40, 1.6);
    burst(g, cx, cy, RED, 20, 1.2);
    flash(g, "#f0883e");
    end(g, "bomb");
    return;
  }

  if (POWERS[it.kind]) {
    settle(true);
    burst(g, cx, cy, "#d2a8ff", 16);
    flash(g, PURPLE);
    sfx(g, "power");
    if (it.kind === "hotfix") {
      g.lives = Math.min(MAX_LIVES, g.lives + 1);
      setBanner(g, "HOTFIX", "+1 build health", "#d2a8ff");
    } else if (it.kind === "debug") {
      g.slowLeft = SLOW_MS;
      setBanner(g, "DEBUGGER ATTACHED", `time slowed for ${SLOW_MS / 1000}s`, "#d2a8ff");
    } else {
      let fixed = 0;
      for (const other of g.items) {
        if (other.hit || !isBug(other)) continue;
        other.hit = true;
        other.good = true;
        other.hitAt = now;
        kill(g, other);
        fixed += 1;
      }
      setBanner(g, "LINTER RAN", `${fixed} bug${fixed === 1 ? "" : "s"} auto-fixed`, "#d2a8ff");
    }
    return;
  }

  if (!isBug(it)) {
    settle(false);
    hurt(g, it.kind === "feature" ? "that's a feature −1" : "that was fine −1", it, "#e3b341", "#d29922");
    sfx(g, "bad");
    if (g.lives <= 0) end(g, "health");
    return;
  }

  if (it.kind === "big" && it.hp > 1) {
    it.hp -= 1;
    it.hitAt = now;
    burst(g, cx, cy, "#ff7b72", 5, 0.7);
    sfx(g, "tick");
    return;
  }

  settle(true);
  kill(g, it);

  if (it.kind === "split") {
    it.halves.forEach((label, i) => {
      const half = { id: ++g.uid, kind: "mini", label, born: now, vx: (i ? 1 : -1) * (70 + Math.random() * 40), vy: 0, hp: 0, maxHp: 0, hitAt: -1e9, hit: false, good: false, ttl: MINI_TTL_MS };
      half.x = Math.max(gutter(g), Math.min(g.width - chipWidth(half) - 14, it.x + (i ? 40 : -20)));
      if (CHIP_FALL) {
        // halves keep falling a little faster than the bug they came from, but always
        // get a moment on screen even when the bug was squashed right at the bottom
        half.y = it.y + (i ? 14 : -14);
        const span = Math.max(0, g.height - half.y - chipHeight(half) / 2);
        half.ttl = Math.max(700, (span / (it.vy * 1.15)) * 1000);
        half.vy = (span / half.ttl) * 1000;
      } else {
        half.line = Math.max(0, Math.min(LINES - 1, it.line + (i ? 1 : -1)));
        half.y = lineTop(half.line, "mini");
      }
      half.x0 = half.x;
      half.y0 = half.y;
      g.items.push(half);
    });
  }
}

function hitBoss(g) {
  if (g.status !== "running" || !g.boss) return;
  const now = g.elapsed;
  const feverMult = g.fever ? 2 : 1;
  const points = BOSS_HIT_POINTS * multFor(g.combo) * feverMult;
  const bx = g.width / 2 + (Math.random() - 0.5) * Math.min(300, g.width * 0.6);
  const by = g.height * 0.44 + (Math.random() - 0.5) * 100;
  g.score += points;
  burst(g, bx, by, RED, 5, 0.8);
  floatText(g, `+${points}`, bx, by - 20, "#ff7b72", 20);
  g.boss.hp -= 1;
  g.boss.hitAt = now;
  if (g.boss.hp > 0) {
    sfx(g, "bosshit");
    return;
  }

  const bonus = BOSS_BONUS * feverMult;
  g.score += bonus;
  g.boss = null;
  g.bosses += 1;
  g.nextBoss = now + BOSS_GAP_MS;
  burst(g, g.width / 2, g.height * 0.44, GREEN, 40, 1.8);
  burst(g, g.width / 2, g.height * 0.44, "#ffffff", 16, 1.2);
  flash(g, GREEN);
  setBanner(g, "MONOLITH REFACTORED", `+${bonus} pts`, GREEN);
  sfx(g, "win");
}

/* ---------- rendering ----------
   React only re-renders when the board's structure changes: a chip spawns, is hit or
   expires, a number on screen changes, a banner appears. Everything that moves every
   frame (chip motion and fading, countdown bars, the boss, particles and floating
   points) is painted straight onto the DOM and a canvas by paint() below, the same way
   Commit Snake draws its board. */

function buildView(g) {
  const now = g.elapsed;
  const running = g.status === "running";
  const openBugs = g.items.filter((it) => !it.hit && isBug(it)).length;
  return {
    status: g.status,
    endReason: g.endReason,
    score: g.score,
    lives: g.lives,
    combo: g.combo,
    maxCombo: g.maxCombo,
    squashed: g.squashed,
    bosses: g.bosses,
    fever: g.fever,
    slow: g.slowLeft > 0,
    mult: multFor(g.combo) * (g.fever ? 2 : 1),
    time: formatTime(now),
    level: 1 + Math.floor(now / LEVEL_MS),
    ramp: Math.round(rampFor(now) * 100),
    items: g.items.map((it) => ({
      id: it.id,
      kind: it.kind,
      tone: toneFor(it.kind),
      label: it.label,
      icon: ICONS[it.kind] || "",
      hit: it.hit,
      good: it.good,
      pips: it.kind === "big" ? Array.from({ length: it.maxHp }, (_, i) => i < it.hp) : null,
      top: it.y0,
      left: it.x0,
    })),
    boss: g.boss ? { done: g.boss.max - g.boss.hp, max: g.boss.max } : null,
    banner: running && g.banner && now - g.banner.born < 1400 ? { text: g.banner.text, sub: g.banner.sub, color: g.banner.color, born: g.banner.born } : null,
    statusLine: !running ? "" : g.slowLeft > 0 ? `debugger attached · ${(g.slowLeft / 1000).toFixed(1)}s` : `${openBugs} open bug${openBugs === 1 ? "" : "s"}`,
  };
}

const viewKey = (view) => JSON.stringify(view);

function paint(board, canvas, g, reduced) {
  if (!board) return;
  const now = g.elapsed;
  const fxNow = now + g.afterglow;

  for (const it of g.items) {
    const el = board.querySelector(`[data-chip="${it.id}"]`);
    if (!el) continue;
    const age = now - it.born;
    let scale = reduced || CHIP_FALL ? 1 : Math.min(1, 0.5 + age / 240);
    let opacity = 1;
    let shift = 0;
    let rotate = 0;
    if (it.hit) {
      const h = Math.min(1, (fxNow - it.hitAt) / HIT_MS);
      if (!reduced && it.good) {
        scale = 1 + 0.35 * h;
        rotate = (it.id % 2 ? 1 : -1) * h * 12;
      } else if (!reduced) {
        shift = Math.sin(h * 30) * 6;
      }
      opacity = 1 - h;
    } else {
      const left = it.ttl - age;
      if (left < 450) opacity = Math.max(0.35, left / 450);
      const since = now - it.hitAt;
      if (since < 160 && !reduced) {
        shift = Math.sin(since / 12) * 5;
        scale = 1.08;
      }
      if (POWERS[it.kind] && !reduced) scale *= 1 + 0.05 * Math.sin(now / 120);
    }
    el.style.transform = `translate3d(${(it.x - it.x0 + shift).toFixed(1)}px, ${(it.y - it.y0).toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(1)}deg)`;
    el.style.opacity = opacity.toFixed(3);
    const bar = el.querySelector(".bug-chip-ttl i");
    if (bar) bar.style.transform = `scaleX(${it.hit ? 0 : Math.max(0, 1 - age / it.ttl).toFixed(4)})`;
  }

  const boss = board.querySelector(".bug-boss");
  if (boss && g.boss) {
    const since = now - g.boss.hitAt;
    const shake = since < 120 && !reduced ? Math.sin(since / 8) * 7 : 0;
    const grow = reduced ? 1 : Math.min(1, 0.3 + (now - g.boss.born) / 400);
    boss.style.transform = `translate(calc(-50% + ${shake.toFixed(1)}px), -50%) scale(${grow.toFixed(3)})`;
    const [progress, time] = boss.querySelectorAll(".bug-boss-bar i");
    progress.style.transform = `scaleX(${(1 - g.boss.hp / g.boss.max).toFixed(4)})`;
    time.style.transform = `scaleX(${Math.max(0, 1 - (now - g.boss.born) / BOSS_TTL_MS).toFixed(4)})`;
  }

  const flashEl = board.querySelector(".bug-flash");
  if (flashEl) {
    const age = g.flash ? (fxNow - g.flash.at) / 280 : 9;
    flashEl.style.opacity = age < 1 ? (0.22 * (1 - age)).toFixed(3) : "0";
    if (g.flash) flashEl.style.background = g.flash.color;
  }

  const banner = board.querySelector(".bug-banner");
  if (banner && g.banner) {
    const age = (now - g.banner.born) / 1400;
    banner.style.opacity = (age < 0.75 ? 1 : Math.max(0, 1 - (age - 0.75) / 0.25)).toFixed(3);
    banner.style.transform = `scale(${(reduced || age >= 0.1 ? 1 : 0.7 + age * 3).toFixed(3)})`;
  }

  const combo = board.querySelector(".bug-combo strong");
  if (combo) {
    const age = (now - g.comboAt) / 220;
    combo.style.transform = `scale(${(age < 1 && !reduced ? 1 + 0.45 * (1 - age) : 1).toFixed(3)})`;
  }

  // particles and floating points
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;
  const dpr = canvas.width / Math.max(1, g.width);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.textBaseline = "top";
  for (const f of g.fx) {
    const a = (fxNow - f.born) / 1000;
    if (f.type === "particle") {
      if (reduced) continue;
      ctx.globalAlpha = Math.max(0, 1 - a / 0.7);
      ctx.fillStyle = f.color;
      ctx.fillRect(f.x + f.vx * a, f.y + f.vy * a + 500 * a * a, f.size, f.size);
    } else {
      const life = a / 0.9;
      const pop = reduced ? 1 : life < 0.12 ? 0.6 + (life / 0.12) * 0.6 : 1.2 - Math.min(0.2, (life - 0.12) * 0.6);
      const y = f.y - (reduced ? 0 : a * 50);
      ctx.globalAlpha = Math.max(0, life < 0.6 ? 1 : 1 - (life - 0.6) / 0.4);
      ctx.font = `800 ${f.size}px ${g.font}`;
      const w = ctx.measureText(f.text).width;
      ctx.save();
      ctx.translate(f.x + w / 2, y + f.size / 2);
      ctx.scale(pop, pop);
      ctx.fillStyle = "#000";
      ctx.fillText(f.text, -w / 2, -f.size / 2 + 2);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, -w / 2, -f.size / 2);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
}

/* ---------- sound ---------- */

function createSound(isMuted) {
  let ctx = null;
  const tone = (freq, dur, type = "square", vol = 0.05, to = null, delay = 0) => {
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  };
  const notes = (freqs, dur, vol, gap) => freqs.forEach((f, i) => tone(f, dur, "square", vol, null, i * gap));
  const sounds = {
    squash: (n) => {
      const f = 330 * 2 ** (Math.min(n, 14) / 12);
      tone(f, 0.09, "square", 0.05, f * 1.6);
    },
    tick: () => tone(260, 0.05, "square", 0.04, 200),
    bad: () => tone(150, 0.22, "sawtooth", 0.06, 80),
    escape: () => tone(240, 0.2, "triangle", 0.07, 110),
    power: () => notes([523, 659, 784, 1046], 0.09, 0.045, 0.06),
    combo: () => notes([660, 990], 0.07, 0.045, 0.05),
    fever: () => notes([523, 659, 784, 1046, 1318, 1568], 0.08, 0.05, 0.045),
    boom: () => {
      tone(120, 0.7, "sawtooth", 0.1, 30);
      tone(60, 0.8, "square", 0.08, 25, 0.05);
    },
    boss: () => notes([110, 98, 82], 0.25, 0.06, 0.22),
    bosshit: () => tone(90 + Math.random() * 40, 0.06, "square", 0.05, 60),
    win: () => notes([392, 523, 659, 784, 1046], 0.12, 0.05, 0.08),
    over: () => notes([392, 330, 262, 196], 0.18, 0.05, 0.16),
  };
  return {
    // Browsers only allow audio after a user gesture, so this runs on start and on board taps.
    unlock() {
      try {
        ctx ??= new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
      } catch {
        ctx = null;
      }
    },
    play(kind, n) {
      if (!ctx || isMuted()) return;
      try {
        sounds[kind]?.(n);
      } catch {
        /* audio failures never affect the game */
      }
    },
    close() {
      ctx?.close?.();
      ctx = null;
    },
  };
}

/* ---------- static copy ---------- */

const RULES = [
  ["Squash bugs.", `Click, tap or slash them before ${CHIP_FALL ? "they fall off the bottom" : "their timer runs out"}. Escaped bugs cost 1 health, or ${MINI_ESCAPE_DAMAGE} for half of a split bug.`],
  ["Spare the code.", "Hitting working code or a feature costs 1 health and breaks your combo."],
  ["Never force push.", "Hitting a ⚠ command ends the run instantly."],
  ["Chain it.", `Every ${COMBO_STEP} squashes raises the multiplier. At ×${MAX_MULT} you enter fever mode for double points.`],
  ["Beat the boss.", "A legacy monolith shows up about once a minute. Hit it until it breaks, or lose 1 health."],
];

const FIELD_GUIDE = [
  { tone: "bug", icon: "●", label: "memory leak", note: "squash" },
  { tone: "bug", icon: "⬤", label: "prod is down", pips: 2, note: "hit 2–3×" },
  { tone: "bug", icon: "◆", label: "merge conflict", note: "splits in 2" },
  { tone: "code", kind: "disguise", label: "if (x = null)", note: "disguised bug" },
  { tone: "code", label: "return total;", note: "leave it" },
  { tone: "feature", icon: "✓", label: "CI green", note: "leave it" },
  { tone: "bomb", icon: "⚠", label: "git push --force", note: "game over", danger: true },
  { tone: "power", icon: "★", label: "debugger", note: "power-up" },
];

/* ---------- static markup ----------
   The board re-renders every animation frame. Everything that does not change
   during a run is built once here, so React reuses these elements instead of
   recreating and diffing them 60 times a second. */

const PAGE_HEADER = (
  <>
    <Link href="/games" className="games-back">
      <ArrowLeft size={16} aria-hidden="true" /> All games
    </Link>

    <header className="snake-heading">
      <p className="games-kicker">{"$ ./play bug-bash"}</p>
      <h1>
        Bug <span>Bash</span>
      </h1>
      <p>Squash the bugs, spare the code, and keep the build green as long as you can.</p>
    </header>
  </>
);

const CODE_BACKDROP = (
  <div className="bug-code" aria-hidden="true">
    {SOURCE.map((line, i) => (
      <p key={i}><span>{i + 1}</span>{line || " "}</p>
    ))}
  </div>
);

const RULES_PANEL = (
  <section className="snake-rules" aria-labelledby="bug-rules-heading">
    <p className="games-kicker" id="bug-rules-heading">{"$ cat RULES.md"}</p>
    <ol>
      {RULES.map(([title, text]) => (
        <li key={title}><b>{title}</b> {text}</li>
      ))}
    </ol>
    <div className="bug-guide">
      <p className="bug-guide-title">FIELD GUIDE</p>
      <ul>
        {FIELD_GUIDE.map(({ tone, kind, icon, label, pips, note, danger }) => (
          <li key={label}>
            <span className={`bug-tag bug-tone-${tone}${kind ? ` is-${kind}` : ""}`}>
              {icon && <b aria-hidden="true">{icon}</b>}
              {label}
              {Array.from({ length: pips || 0 }, (_, i) => <i key={i} className="bug-pip on" aria-hidden="true" />)}
            </span>
            <span className={danger ? "is-danger" : ""}>{note}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="snake-keys">
      <p><kbd>Click</kbd><span>squash · drag to slash</span></p>
      <p><kbd>Space</kbd><span>start / pause</span></p>
      <p><kbd>R</kbd><span>reset</span></p>
      <p><kbd>M</kbd><span>mute</span></p>
    </div>
  </section>
);

// Re-renders only when a value it shows changes (time and speed tick once a second).
const Scorecard = memo(function Scorecard({ status, fever, score, lives, best, time, mult, level, ramp }) {
  const running = status === "running";
  return (
    <section className="snake-score" aria-label="Scorecard">
      <div className="score-head">
        <span className="games-kicker">{"// scorecard"}</span>
        <span className={`snake-pill is-${running && fever ? "won" : status}`}>
          {running && fever ? "FEVER" : STATUS_LABEL[status]}
        </span>
      </div>

      <div className="score-main">
        <strong>{String(score).padStart(4, "0")}</strong>
        <span>pts</span>
      </div>

      <div className="bug-health">
        <div className="score-ttl-label">
          <span>build health</span>
          <strong>{lives} / {MAX_LIVES}</strong>
        </div>
        <ol className="bug-health-cells" aria-label={`Build health ${lives} of ${MAX_LIVES}`}>
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <li key={i} className={i < lives ? "on" : ""} style={{ "--fill": Math.min(1, Math.max(0, lives - i)) }} />
          ))}
        </ol>
      </div>

      <dl className="score-stats">
        <div><dt>time</dt><dd>{time}</dd></div>
        <div><dt>best</dt><dd>{best ? best : "--"}</dd></div>
        <div className={`bug-mult${fever ? " is-fever" : ""}`}><dt>{fever ? "fever" : "combo"}</dt><dd>×{mult}</dd></div>
      </dl>

      <div className="score-ttl">
        <div className="score-ttl-label">
          <span>sprint speed</span>
          <strong>lvl {level}</strong>
        </div>
        <div className="score-ttl-bar" aria-hidden="true">
          <i style={{ width: `${ramp}%` }} />
        </div>
      </div>
    </section>
  );
});

/* ---------- component ---------- */

export default function BugBash() {
  const boardRef = useRef(null);
  const fxRef = useRef(null);
  const lastViewKey = useRef("");
  const gameRef = useRef(createGame());
  const soundRef = useRef(null);
  const bestRef = useRef(0);
  const mutedRef = useRef(false);
  const reducedMotion = useRef(false);
  const pointer = useRef(null);

  const [view, setView] = useState(() => buildView(createGame()));
  const [best, setBest] = useState(0);
  const [muted, setMuted] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const save = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ best: bestRef.current, muted: mutedRef.current }));
    } catch {
      /* storage unavailable, ignore */
    }
  }, []);

  // Flush queued sounds and announcements, record a finished run, then re-render from the game state.
  const sync = useCallback(() => {
    const g = gameRef.current;
    for (const [kind, n] of g.sounds) soundRef.current?.play(kind, n);
    g.sounds = [];
    if (g.announce) {
      setAnnouncement(g.announce);
      g.announce = "";
    }
    if (g.status === "lost" && !g.recorded) {
      g.recorded = true;
      const isNew = g.score > bestRef.current;
      if (isNew) {
        bestRef.current = g.score;
        setBest(g.score);
        save();
      }
      setNewBest(isNew);
    }
    const next = buildView(g);
    const key = viewKey(next);
    if (key !== lastViewKey.current) {
      lastViewKey.current = key;
      setView(next);
    }
  }, [save]);

  const paintNow = useCallback(() => {
    paint(boardRef.current, fxRef.current, gameRef.current, reducedMotion.current);
  }, []);

  // New chips, banners and the boss get their first frame before the browser paints them.
  useLayoutEffect(paintNow, [view, paintNow]);

  /* ---------- game loop ---------- */
  useEffect(() => {
    let raf;
    let last = performance.now();
    const frame = (now) => {
      const g = gameRef.current;
      const dt = Math.min(now - last, 100);
      last = now;
      if (g.status === "running") {
        tick(g, dt);
        sync();
        paintNow();
      } else if (g.status === "lost" && g.afterglow < 900) {
        g.afterglow += dt;
        paintNow();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [paintNow, sync]);

  /* ---------- board size, sound, saved state, motion pref, tab visibility ---------- */
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;
    const resize = () => {
      const g = gameRef.current;
      g.width = board.clientWidth;
      g.height = board.clientHeight;
      g.font = getComputedStyle(board).fontFamily;
      for (const it of g.items) it.x = Math.max(gutter(g), Math.min(it.x, g.width - chipWidth(it) - 14));
      const canvas = fxRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(g.width * dpr);
        canvas.height = Math.round(g.height * dpr);
      }
      paintNow();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(board);

    const sound = createSound(() => mutedRef.current);
    soundRef.current = sound;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = motion.matches;
    const onMotion = (e) => { reducedMotion.current = e.matches; };
    motion.addEventListener("change", onMotion);

    const onHidden = () => {
      const g = gameRef.current;
      if (document.hidden && g.status === "running") {
        g.status = "paused";
        sync();
      }
    };
    document.addEventListener("visibilitychange", onHidden);

    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
        if (saved && Number.isFinite(saved.best)) {
          bestRef.current = saved.best;
          setBest(saved.best);
        }
        if (saved?.muted === true) {
          mutedRef.current = true;
          setMuted(true);
        }
      } catch {
        /* ignore */
      }
    }, 0);

    return () => {
      observer.disconnect();
      sound.close();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onHidden);
      window.clearTimeout(timer);
    };
  }, [paintNow, sync]);

  /* ---------- actions ---------- */
  const begin = useCallback(() => {
    const { width, height, font } = gameRef.current;
    gameRef.current = createGame(width, height, font);
    gameRef.current.status = "running";
    soundRef.current?.unlock();
    setNewBest(false);
    setAnnouncement("");
    sync();
  }, [sync]);

  const reset = useCallback(() => {
    const { width, height, font } = gameRef.current;
    gameRef.current = createGame(width, height, font);
    setNewBest(false);
    setAnnouncement("");
    sync();
  }, [sync]);

  const toggle = useCallback(() => {
    const g = gameRef.current;
    if (g.status === "running") g.status = "paused";
    else if (g.status === "paused") {
      g.status = "running";
      soundRef.current?.unlock();
    } else {
      begin();
      return;
    }
    sync();
  }, [begin, sync]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    save();
  }, [save]);

  const strike = useCallback((el) => {
    const g = gameRef.current;
    if (el.dataset.boss !== undefined) hitBoss(g);
    else hit(g, Number(el.dataset.chip));
    sync();
    paintNow();
  }, [paintNow, sync]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target?.closest?.("input, textarea, select")) return;
      const key = event.key.toLowerCase();

      if (key === " " || key === "p") {
        // focused buttons handle their own Space; a focused chip or boss never squashes on Space
        if (target?.closest?.("a, button:not([data-chip]):not([data-boss])")) return;
        event.preventDefault();
        toggle();
        return;
      }
      if (key === "r" && gameRef.current.status !== "idle") reset();
      else if (key === "m") toggleMute();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset, toggle, toggleMute]);

  /* ---------- pointer: click, tap, or hold and drag to slash ---------- */
  const targetAt = (x, y) => document.elementFromPoint(x, y)?.closest?.("[data-chip], [data-boss]") ?? null;

  const onPointerDown = (e) => {
    if (gameRef.current.status !== "running" || e.button > 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    soundRef.current?.unlock();
    const target = targetAt(e.clientX, e.clientY);
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, target };
    if (target) strike(target);
  };

  const onPointerMove = (e) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    // sample the path so a fast slash cannot skip over a chip
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 12));
    for (let i = 1; i <= steps; i += 1) {
      const target = targetAt(p.x + (dx * i) / steps, p.y + (dy * i) / steps);
      if (target !== p.target) {
        p.target = target;
        if (target) strike(target);
      }
    }
    p.x = e.clientX;
    p.y = e.clientY;
  };

  const onPointerEnd = () => {
    pointer.current = null;
  };

  // Keyboard users can Tab to a chip and press Enter. Pointer clicks are already handled on pointerdown.
  const onKeyStrike = (e) => {
    if (e.detail === 0) strike(e.currentTarget);
  };

  /* ---------- render ---------- */
  const { status, score, lives, boss, banner } = view;
  const running = status === "running";
  const bomb = view.endReason === "bomb";
  const { rank, next } = rankFor(score);

  const overlay = {
    idle: { kicker: "// unstaged changes", title: "Ready to squash some bugs?", text: `Bugs ${CHIP_FALL ? "rain down" : "pop up across"} the editor. Squash them before they ship, leave working code alone, and never force push.`, cta: "Start run", Icon: Play },
    paused: { kicker: "// git stash", title: "Paused", text: "Your build is waiting.", cta: "Resume", Icon: Play },
    lost: {
      kicker: bomb ? "// you force pushed to main" : "// build failed",
      title: rank,
      text: `Score ${score} · ${view.squashed} bugs · max combo ${view.maxCombo}${view.bosses ? ` · ${view.bosses} monolith${view.bosses > 1 ? "s" : ""} refactored` : ""}`,
      cta: "Run again",
      Icon: RotateCcw,
    },
  }[status];

  return (
    <>
      {PAGE_HEADER}

      <div className="snake-layout">
        {/* ---------- scorecard ---------- */}
        <Scorecard
          status={status}
          fever={view.fever}
          score={score}
          lives={lives}
          best={best}
          time={view.time}
          mult={view.mult}
          level={view.level}
          ramp={view.ramp}
        />

        {/* ---------- board ---------- */}
        <section className="snake-arena" aria-label="Bug Bash game">
          <div className="arena-bar">
            <span className="arena-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="arena-title">gcc-arcade ~ bug-bash <span className="bug-file">— src/checkout.js</span></span>
            <div className="bug-actions">
              <button type="button" className="snake-pause" onClick={toggleMute} aria-pressed={!muted}>
                {muted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
                <span>Sound</span>
              </button>
              <button type="button" className="snake-pause" onClick={toggle}>
                {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                <span>{running ? "Pause" : status === "paused" ? "Resume" : "Start"}</span>
              </button>
            </div>
          </div>

          <div
            ref={boardRef}
            className={`bug-board is-${status}${running && view.fever ? " is-fever" : ""}${running && view.slow ? " is-slow" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onLostPointerCapture={onPointerEnd}
          >
            {CODE_BACKDROP}
            <div className="bug-tint" aria-hidden="true" />
            <div className="bug-flash" aria-hidden="true" />

            {boss && (
              <button
                type="button"
                className="bug-boss"
                data-boss=""
                onClick={onKeyStrike}
                tabIndex={running ? 0 : -1}
                aria-label={`legacy_monolith.js boss, ${boss.done} of ${boss.max} hits`}
              >
                <span className="bug-boss-head"><strong>⬛ legacy_monolith.js</strong><span>BOSS</span></span>
                <span className="bug-boss-meta">14,203 lines · no tests · last touched 2011</span>
                <span className="bug-boss-progress"><span>refactor progress</span><span>{boss.done} / {boss.max}</span></span>
                <span className="bug-boss-bar"><i /></span>
                <span className="bug-boss-bar is-time"><i /></span>
                <span className="bug-boss-hint">hit it fast. It costs 1 health if it survives.</span>
              </button>
            )}

            {view.items.map((chip) => (
              <button
                key={chip.id}
                type="button"
                data-chip={chip.id}
                className={`bug-chip bug-tone-${chip.tone} is-${chip.kind}${chip.hit ? " is-hit" : ""}${chip.hit && !chip.good ? " is-miss" : ""}`}
                style={{ top: chip.top, left: chip.left }}
                onClick={onKeyStrike}
                tabIndex={running && !chip.hit ? 0 : -1}
              >
                <span className="bug-chip-body">
                  {chip.icon && <b aria-hidden="true">{chip.icon}</b>}
                  <span>{chip.label}</span>
                  {chip.pips?.map((on, i) => <i key={i} className={`bug-pip${on ? " on" : ""}`} aria-hidden="true" />)}
                </span>
                <span className="bug-chip-ttl" aria-hidden="true"><i /></span>
              </button>
            ))}

            <canvas ref={fxRef} className="bug-fx" aria-hidden="true" />

            {banner && (
              <div key={banner.born} className="bug-banner" aria-hidden="true" style={{ "--banner": banner.color }}>
                <strong>{banner.text}</strong>
                <span>{banner.sub}</span>
              </div>
            )}

            {running && view.combo > 1 && (
              <div className={`bug-combo${view.fever ? " is-fever" : ""}`} aria-hidden="true">
                <small>{view.fever ? "FEVER" : "COMBO"}</small>
                <strong>×{view.mult}</strong>
                <span>{view.combo} in a row</span>
              </div>
            )}
            {view.statusLine && <div className={`bug-status${view.slow ? " is-slow" : ""}`} aria-hidden="true">{view.statusLine}</div>}

            {overlay && (
              <div className={`arena-overlay is-${status}${bomb ? " is-bomb" : ""}`}>
                <div className="overlay-card">
                  <p className="games-kicker">{overlay.kicker}</p>
                  <h2>{overlay.title}</h2>
                  <p className="overlay-text">{overlay.text}</p>
                  {status === "lost" && newBest && <p className="overlay-badge">new personal best</p>}
                  {status === "lost" && next && <p className="bug-next">{next.score - score} pts to {next.title}</p>}
                  <button type="button" className="snake-start" onClick={toggle}>
                    <overlay.Icon size={16} aria-hidden="true" /> {overlay.cta}
                  </button>
                  <p className="overlay-hint">or press Space</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ---------- rules + keys ---------- */}
        {RULES_PANEL}
      </div>

      <p className="games-sr" role="status">{announcement}</p>
    </>
  );
}
