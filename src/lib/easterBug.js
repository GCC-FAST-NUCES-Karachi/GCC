// Persistence is temporarily disabled: discovery and terminal glow reset on reload.
//   bug === true   the endless loop is running and the navbar terminal is hidden
//   bug === false  the egg has been discovered; the loop is off and terminal is shown

const listeners = new Set();
// const DISCOVERED_KEY = "easter_bug_discovered";
// const wasDiscoveredOnDevice = () => {
//   if (typeof window === "undefined") return false;
//   try {
//     return window.localStorage.getItem(DISCOVERED_KEY) === "true";
//   } catch {
//     return false;
//   }
// };

let bug = true; // was: !wasDiscoveredOnDevice()
let justUnlocked = false; // true only after the egg was finished in this page session
let terminalGlowShown = false; // was read from localStorage; reset each page load

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
  // if (!value && typeof window !== "undefined") {
  //   try { window.localStorage.setItem(DISCOVERED_KEY, "true"); } catch {}
  // }
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
  // if (typeof window !== "undefined") {
  //   try { window.localStorage.setItem(TERMINAL_GLOW_KEY, "true"); } catch {}
  // }
  return true;
}
