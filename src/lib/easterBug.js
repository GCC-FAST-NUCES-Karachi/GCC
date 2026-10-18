//   bug === true   the endless loop is running and the navbar terminal is hidden
//   bug === false  the egg has been discovered; the loop is off and terminal is shown

const listeners = new Set();
const DISCOVERED_KEY = "easter_bug_discovered";
const TERMINAL_GLOW_KEY = "terminal_glow_shown";

function readStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable in private browsing or restricted contexts.
  }
}

// Start in the server-safe state and restore saved settings after hydration.
let bug = true;
let justUnlocked = false; // true only after the egg was finished in this page session
let terminalGlowShown = false;

if (typeof window !== "undefined") {
  bug = readStorage(DISCOVERED_KEY) !== "true";
  terminalGlowShown = readStorage(TERMINAL_GLOW_KEY) === "true";
}

export function getBug() {
  return bug;
}

// Server and first client render always assume the bug is still active.
export function getServerBug() {
  return true;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setBug(value) {
  bug = value;
  justUnlocked = !value;
  if (!value) writeStorage(DISCOVERED_KEY, "true");
  listeners.forEach((listener) => listener());
}

export function wasJustUnlocked() {
  return justUnlocked;
}

// Consume the unlock glow once, even if the navbar unmounts on /terminal and
// mounts again when the visitor returns to the rest of the site.
export function consumeTerminalGlow() {
  if (!justUnlocked || terminalGlowShown) return false;
  terminalGlowShown = true;
  writeStorage(TERMINAL_GLOW_KEY, "true");
  return true;
}
