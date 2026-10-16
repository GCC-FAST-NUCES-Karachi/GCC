// Single source of truth for Commit Snake. Used by the game and the hub preview.

export const COLS = 20;
export const ROWS = 14;

export const WIN_SCORE = 15;
export const FOOD_TTL_MS = 10000; // every commit lives 10s, then moves (no penalty)
export const START_TICK_MS = 190; // snake step time at 0 commits
export const MIN_TICK_MS = 110; // fastest step time
export const TICK_STEP_MS = 5; // each commit shaves this much off the step time

export const START_SNAKE = [
  { x: 2, y: 12 },
  { x: 1, y: 12 },
  { x: 0, y: 12 },
];
export const START_DIRECTION = { x: 1, y: 0 };
export const START_FOOD = { x: 12, y: 12 };

// "GCC" drawn as obstacles in the middle of the board.
const GLYPHS = [
  [".###.", "#....", "#....", "#.###", "#...#", "#...#", ".###."],
  [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
];

export const BLOCK_LIST = [];
GLYPHS.forEach((glyph, letter) =>
  glyph.forEach((row, y) =>
    [...row].forEach((cell, x) => {
      if (cell === "#") BLOCK_LIST.push({ x: 1 + letter * 6 + x, y: 3 + y });
    })
  )
);
export const BLOCK_SET = new Set(BLOCK_LIST.map(({ x, y }) => `${x},${y}`));

// The inside of the G is a narrow dead end. Never spawn commits there.
export const NO_SPAWN = new Set();
for (let y = 6; y <= 8; y += 1) {
  for (let x = 2; x <= 4; x += 1) NO_SPAWN.add(`${x},${y}`);
}