import { BLOCK_LIST, COLS, ROWS } from "@/app/games/commit-snake/config";

const SNAKE = [9, 8, 7, 6, 5, 4].map((x) => ({ x, y: 12 }));
const FOOD = { x: 13, y: 12 };

// Static, decorative board used on the landing Play section and the /games hub.
export default function SnakePreview({ className = "snake-preview-svg" }) {
  return (
    <svg className={className} viewBox={`0 0 ${COLS} ${ROWS}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="snake-preview-grid" width="1" height="1" patternUnits="userSpaceOnUse">
          <path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgb(88 166 255 / 8%)" strokeWidth="0.03" />
        </pattern>
      </defs>
      <rect width={COLS} height={ROWS} fill="#080d12" />
      <rect width={COLS} height={ROWS} fill="url(#snake-preview-grid)" />
      {BLOCK_LIST.map(({ x, y }) => (
        <rect key={`${x},${y}`} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" rx="0.15" fill="#38404a" stroke="#525a65" strokeWidth="0.04" />
      ))}
      {SNAKE.map(({ x, y }, i) => (
        <rect key={x} x={x + 0.1} y={y + 0.1} width="0.8" height="0.8" rx="0.2" fill={i === 0 ? "#56d364" : "#2ea043"} />
      ))}
      <rect className="snake-preview-food" x={FOOD.x + 0.33} y={FOOD.y + 0.33} width="0.34" height="0.34" rx="0.05" fill="#3fb950" transform={`rotate(45 ${FOOD.x + 0.5} ${FOOD.y + 0.5})`} />
    </svg>
  );
}