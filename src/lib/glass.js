// Shared glass data for the loop cracks (EasterBug) and the final shatter (BugFinale).
// It is generated ONCE and cached, so the cracks seen during the loops are exactly
// the cracks that shatter at the end.
//
// Crack stages:
//   1 = after loop 1  (a few thin cracks near the impact point)
//   2 = after loop 2  (cracks grow outward + first broken rings)
//   3 = after loop 3  (cracks reach most of the screen)
//   4 = finale        (extra dense cracks, then the glass shatters)

const rnd = Math.random;
const f1 = (n) => n.toFixed(1);
const toPath = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${f1(p[0])} ${f1(p[1])}`).join(" ");

// Fraction of the max radius reached by stage 1 and stage 2. Stage 3 covers the rest.
const REACH = [0.24, 0.52];
const stageOfReach = (f) => (f < REACH[0] ? 1 : f < REACH[1] ? 2 : 3);
const stageStart = [0, 0, REACH[0], REACH[1], 0]; // index = stage

let cache = null;

export function getGlass() {
  if (!cache) cache = buildGlass(window.innerWidth, window.innerHeight);
  return cache;
}

export function resetGlass() {
  cache = null;
}

function makeRay(angle, cx, cy, maxR, w, h, branchChance, onBranch) {
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
    if (dist > 60 && rnd() < branchChance) onBranch(x, y, angle, dist);
    if (x < -40 || x > w + 40 || y < -40 || y > h + 40) break;
  }
  return pts;
}

function makeBranch(x, y, angle) {
  let a = angle + (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.7);
  let d = 0;
  const len = 60 + rnd() * 220;
  const pts = [[x, y]];
  while (d < len) {
    const s = 22 + rnd() * 40;
    a += (rnd() - 0.5) * 0.6;
    x += Math.cos(a) * s;
    y += Math.sin(a) * s;
    d += s;
    pts.push([x, y]);
  }
  return { pts, len: d };
}

function buildGlass(w, h) {
  // Mobile GPUs struggle with hundreds of animated fragments, so use fewer of everything.
  const compact = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.05;

  const cracks = [];
  const add = (stage, d, width, delay, dur) =>
    cracks.push({ stage, d, w: width, o: 0.5 + stage * 0.12, delay, dur });

  // ── Main rays (stages 1-3) ────────────────────────────────────────────────
  const RAYS = compact ? 10 : 14;
  const EARLY = compact ? 3 : 4; // rays that already exist after loop 1
  const MID = compact ? 6 : 8; // rays that exist after loop 2
  const rays = [];
  const minStages = [];

  for (let r = 0; r < RAYS; r++) {
    const rank = (r * 3) % RAYS; // spreads the early rays around the circle
    const minStage = rank < EARLY ? 1 : rank < MID ? 2 : 3;
    minStages.push(minStage);
    const segStage = (dist) => Math.max(minStage, stageOfReach(dist / maxR));
    const baseW = 1.3 + rnd() * 0.8;

    const pts = makeRay((r / RAYS) * Math.PI * 2, cx, cy, maxR, w, h, 0.14, (bx, by, ang, dist) => {
      const st = segStage(dist);
      if (dist / maxR < 0.06) return;
      const b = makeBranch(bx, by, ang);
      add(st, toPath(b.pts), 0.8, Math.max(0, dist / maxR - stageStart[st]) * 0.9 + 0.08, 0.2 + b.len / 900);
    });
    rays.push(pts);

    // Split the ray into one piece per stage so each stage only draws its new part.
    const flush = (piece, st) => {
      const len = piece[piece.length - 1][2] - piece[0][2];
      const taper = st === 1 ? 1 : st === 2 ? 0.85 : 0.7;
      add(st, toPath(piece), baseW * taper, rank * 0.012, 0.22 + (len / maxR) * 0.9);
    };
    let cur = segStage(pts[1][2]);
    let piece = [pts[0], pts[1]];
    for (let i = 2; i < pts.length; i++) {
      const st = segStage(pts[i][2]);
      if (st !== cur) {
        flush(piece, cur);
        piece = [pts[i - 1]];
        cur = st;
      }
      piece.push(pts[i]);
    }
    flush(piece, cur);
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

  // Broken rings between neighbouring rays.
  const ring = (R, chance, stageFor, delayFor, dur) => {
    for (let r = 0; r < RAYS; r++) {
      if (rnd() < chance) continue;
      const next = (r + 1) % RAYS;
      const p = pointAt(rays[r], R * (0.9 + rnd() * 0.2));
      const q = pointAt(rays[next], R * (0.9 + rnd() * 0.2));
      if (!p || !q) continue;
      const mid = [(p[0] + q[0]) / 2 + (rnd() - 0.5) * 18, (p[1] + q[1]) / 2 + (rnd() - 0.5) * 18];
      add(stageFor(r, next), toPath([p, mid, q]), 0.9, delayFor, dur);
    }
  };
  (compact ? [110, 320, 560] : [70, 180, 330, 520, 760]).forEach((R) => {
    const base = stageOfReach(R / maxR);
    const st = (a, b) => Math.max(minStages[a], minStages[b], base);
    ring(R, compact ? 0.5 : 0.3, st, 0.12 + Math.max(0, R / maxR - stageStart[base]) * 0.8, 0.18);
  });

  // ── Stage 4: the final burst of cracks right before the shatter ──────────
  const EXTRA = compact ? 6 : 10;
  for (let e = 0; e < EXTRA; e++) {
    const angle = ((e + 0.2 + rnd() * 0.6) / EXTRA) * Math.PI * 2;
    const pts = makeRay(angle, cx, cy, maxR, w, h, 0.18, (bx, by, ang, dist) => {
      const b = makeBranch(bx, by, ang);
      add(4, toPath(b.pts), 0.8, 0.05 + (dist / maxR) * 0.3, 0.18 + b.len / 1000);
    });
    const len = pts[pts.length - 1][2];
    add(4, toPath(pts), 1 + rnd() * 0.8, rnd() * 0.2, 0.25 + (len / maxR) * 0.35);
  }
  (compact ? [60, 200, 440] : [40, 130, 250, 420, 640]).forEach((R) => {
    ring(R, 0.55, () => 4, 0.1 + (R / maxR) * 0.3, 0.16);
  });

  const stages = [[], [], [], [], []];
  cracks.forEach((c) => stages[c.stage].push(c));

  // ── Shards: a jittered grid, every cell split into two triangles ─────────
  const cols = compact ? 4 : 9;
  const cellW = w / cols;
  const rows = Math.max(5, Math.round(h / cellW));
  const cellH = h / rows;
  const V = [];
  for (let j = 0; j <= rows; j++) {
    V[j] = [];
    for (let i = 0; i <= cols; i++) {
      const edgeX = i === 0 || i === cols;
      const edgeY = j === 0 || j === rows;
      V[j][i] = [
        i * cellW + (edgeX ? 0 : (rnd() - 0.5) * cellW * 0.7),
        j * cellH + (edgeY ? 0 : (rnd() - 0.5) * cellH * 0.7),
      ];
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
          poly: tri
            .map((p) => `${(((p[0] - minX) / bw) * 100).toFixed(2)}% ${(((p[1] - minY) / bh) * 100).toFixed(2)}%`)
            .join(","),
          delay: dist * 0.7 + rnd() * 0.12,
          dx: ((mx - cx) / maxR) * 140 + (rnd() - 0.5) * 60,
          dy: 280 + rnd() * 560,
          rot: (rnd() - 0.5) * 80,
          alpha: 0.04 + rnd() * 0.06, // neutral white glass tint
        });
      });
    }
  }

  return { w, h, stages, shards };
}
