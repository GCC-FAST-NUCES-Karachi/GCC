// Octo Dive Web Audio sound helpers
// No audio files; all sounds synthesised with the Web Audio API.
// AudioContext is created lazily on the first call so we respect
// the browser's requirement that audio contexts be created after a user gesture.

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Short blip played when the player taps a tile. */
export function playSelect() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.frequency.setValueAtTime(660, c.currentTime);
    gain.gain.setValueAtTime(0.18, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.08);
  } catch { /* audio not available */ }
}

/** Rising two-note chime for a correct answer. */
export function playCorrect() {
  try {
    const c = getCtx();
    [[440, 0], [660, 0.1]].forEach(([freq, delay]) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(0.22, c.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.25);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + 0.28);
    });
  } catch { /* audio not available */ }
}

/** Low sad buzz for wrong answer or timeout. */
export function playWrong() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, c.currentTime);
    osc.frequency.linearRampToValueAtTime(100, c.currentTime + 0.35);
    gain.gain.setValueAtTime(0.25, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.42);
  } catch { /* audio not available */ }
}

/** Short jingle when a run ends. */
export function playEnd() {
  try {
    const c = getCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const delay = i * 0.13;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(0.2, c.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.3);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + 0.35);
    });
  } catch { /* audio not available */ }
}
