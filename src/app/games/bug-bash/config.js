// Single source of truth for Bug Bash tuning, labels, and the editor backdrop.

export const MAX_LIVES = 3;
// Build health lost when one half of a split bug escapes. The player already hit the
// split bug once, so letting both halves through costs 0.5 instead of a full point.
export const MINI_ESCAPE_DAMAGE = 0.25;

// ---------- progression ----------
// Timings are in game time; the debugger power-up slows game time down.
// Each *_START value applies when a run begins and eases toward its *_END value
// over RAMP_MS. RAMP_CURVE shapes that: 1 is linear, below 1 front-loads the ramp
// so the first half minute already feels busier, above 1 holds back early on.
export const RAMP_MS = 90000;
export const RAMP_CURVE = 0.7;

export const FIRST_SPAWN_MS = 250; // delay before the first chip of a run
export const SPAWN_START_MS = 600; // average gap between chips
export const SPAWN_END_MS = 430;
export const SPAWN_JITTER = 0.3; // each gap is randomly up to ±30% of the average
export const BOSS_SPAWN_RATE = 0.45; // chips spawn this much as often while a boss is up

export const CHIP_TTL_START_MS = 2500; // average chip lifetime before any per-kind scaling
export const CHIP_TTL_END_MS = 1375;
export const CHIP_TTL_JITTER = 0.15;
export const MINI_TTL_MS = 2300; // lifetime of the halves a split bug leaves behind

export const MOVE_CHANCE_START = 0.2; // chance a bug or split bug drifts sideways
export const MOVE_CHANCE_END = 0.65;
export const MOVE_SPEED_MIN = 30; // px per second; doubles once fully ramped
export const MOVE_SPEED_MAX = 80;

// Chips fall from the top of the editor and escape when they reach the bottom, so
// their lifetime is how long the fall takes. false makes them pop up in place on a
// code line instead. FALL_TIME_SCALE stretches lifetimes while falling, because a
// moving chip takes longer to read and only becomes visible as it slides in.
export const CHIP_FALL = true;
export const FALL_TIME_SCALE = 1.35;

// How often each chip kind is picked, relative to the others.
//   after:      seconds into a run before it can appear
//   rampWeight: extra weight added as the run ramps up
//   life:       lifetime multiplier, so rarer chips stay readable
//   whenHurt:   only appears while build health is below max
export const SPAWN_TABLE = {
  bug: { weight: 30 },
  code: { weight: 16 },
  feature: { weight: 10 },
  disguise: { weight: 16, rampWeight: 6, after: 6, life: 1.25 },
  big: { weight: 7, after: 8, life: 1.7 },
  debug: { weight: 2.2, after: 12, life: 0.9 },
  bomb: { weight: 4, rampWeight: 4, after: 15, life: 1.15 },
  split: { weight: 8, after: 18, life: 1.1 },
  linter: { weight: 1.8, after: 22, life: 0.9 },
  hotfix: { weight: 2.2, whenHurt: true, life: 0.9 },
};

export const LEVEL_MS = 15000; // one "sprint speed" level on the scorecard
export const SLOW_MS = 5000; // debugger power-up duration
export const SLOW_FACTOR = 0.4; // game speed while the debugger is attached

export const FIRST_BOSS_MS = 40000;
export const BOSS_GAP_MS = 55000; // after a boss is refactored or survives
export const BOSS_TTL_MS = 15000;
export const BOSS_HP = 25;
export const BOSS_HP_STEP = 12; // each later boss takes this many more hits

export const POINTS = { bug: 10, mini: 6, split: 15, big: 30, disguise: 25 };
export const BOSS_HIT_POINTS = 5;
export const BOSS_BONUS = 250;
export const COMBO_STEP = 3; // squashes per multiplier step
export const MAX_MULT = 5; // reaching it starts fever mode (double points)

// Chips sit on the lines of the editor backdrop.
export const LINES = 18;
export const LINE_H = 28;
export const BOARD_PAD = 14;

export const BUGS = [
  "NullPointerException",
  "off-by-one",
  "race condition",
  "memory leak",
  "undefined is not a function",
  "infinite loop",
  "SQL injection",
  "segfault",
  "stale cache",
  "unhandled promise",
  "missing await",
  "heisenbug",
  "divide by zero",
];
export const BIG_BUGS = ["prod is down", "CVE-2026-1337", "data corruption", "p0 incident"];
export const SPLIT_BUGS = [
  { label: "merge conflict", halves: ["<<<<<<< HEAD", ">>>>>>> main"] },
  { label: "circular import", halves: ["a.js", "b.js"] },
  { label: "fork()", halves: ["child #1", "child #2"] },
  { label: "duplicate state", halves: ["state", "state (copy)"] },
];
export const DISGUISED_BUGS = [
  "if (x = null)",
  "i <= arr.length",
  "catch (e) {}",
  "items.lenght",
  "\"0\" + total",
  "return; total",
  "while (true) {}",
  "user.id = undefined",
  "if (x === NaN)",
  "nums.sort()",
  "if (list == [])",
  "setTimeout(save(), 0)",
  "fetch(url).json()",
  "indexOf(x) > 0",
  "map(x => { x * 2 })",
  "s.replace(\" \", \"_\")",
  "0.1 + 0.2 === 0.3",
  "price.toFixed(2) + tax",
  "JSON.parse(undefined)",
  "new Date(2026, 12, 1)",
  "delete items[i]",
  "user?.name.first",
];
export const CODE = [
  "return total;",
  "const items = [];",
  "i++",
  "// TODO: refactor",
  "import { cart }",
  "export default",
  "await fetch(url)",
  "total += price",
  "if (user) {",
];
export const FEATURES = ["tests passing", "autocomplete", "type hints", "linter", "CI green", "code review", "hot reload", "dark mode"];
export const BOMBS = ["git push --force", "rm -rf /", "DROP DATABASE prod", "git reset --hard"];
export const POWERS = {
  hotfix: "hotfix · +1 health",
  debug: "debugger · slow-mo",
  linter: "linter · fix all",
};

export const RANKS = [
  { score: 0, title: "Intern" },
  { score: 200, title: "Junior Developer" },
  { score: 500, title: "Developer" },
  { score: 1000, title: "Senior Engineer" },
  { score: 1800, title: "Staff Engineer" },
];

// Decorative file shown behind the chips.
export const SOURCE = [
  "import { cart } from './store';",
  "import { tax } from './tax';",
  "",
  "export async function checkout(user) {",
  "  if (!user) throw new Error('auth');",
  "  const items = await cart.load(user.id);",
  "  let total = 0;",
  "",
  "  for (let i = 0; i < items.length; i++) {",
  "    total += items[i].price * items[i].qty;",
  "  }",
  "",
  "  total = tax.apply(total, user.region);",
  "  const order = await api.post('/orders', {",
  "    user: user.id, items, total,",
  "  });",
  "  return order;",
  "}",
];
