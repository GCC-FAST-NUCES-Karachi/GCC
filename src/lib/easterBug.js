// The discovered flag persists on this device so the easter egg only plays once.
//   bug === true   the endless loop is running and the navbar terminal is hidden
//   bug === false  the egg has been discovered; the loop is off and terminal is shown

const listeners = new Set();
const DISCOVERED_KEY = "easter_bug_discovered";
const TERMINAL_GLOW_KEY = "terminal_glow_shown";
const wasDiscoveredOnDevice = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DISCOVERED_KEY) === "true";
  } catch {
    return false;
  }
};

let bug = !wasDiscoveredOnDevice();
let justUnlocked = false; // true only after the egg was finished in this page session
let terminalGlowShown = (() => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(TERMINAL_GLOW_KEY) === "true";
  } catch {
    return false;
  }
})();

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
  if (!value && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(DISCOVERED_KEY, "true");
    } catch {
      // Keep the in-memory discovery for this session if storage is unavailable.
    }
  }
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
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(TERMINAL_GLOW_KEY, "true");
    } catch {
      // The module flag still prevents repeats until this page session ends.
    }
  }
  return true;
}
