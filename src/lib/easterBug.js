// The "easter bug" flag. It lives in memory only, so every page load or new visitor starts over.
//   bug === true   the endless loop is running and the navbar terminal is hidden (default)
//   bug === false  the easter egg is over: loop off, terminal shown in the navbar
// After the finale the terminal stays in the navbar while the visitor browses the site.
// Refreshing the page (or opening it fresh) resets bug to true and the egg plays again.

const listeners = new Set();
let bug = true;
let justUnlocked = false; // true only after the egg was finished in this page session

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
  listeners.forEach((listener) => listener());
}

export function wasJustUnlocked() {
  return justUnlocked;
}
