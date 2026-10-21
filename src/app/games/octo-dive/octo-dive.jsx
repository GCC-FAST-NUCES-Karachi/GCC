"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, RefreshCw, Volume2, VolumeX } from "lucide-react";
import OctocatDiver from "./octocat-diver";
import {
  ALL_QUESTIONS,
  EASY_QUESTIONS,
  MAX_SPEED_BONUS,
  MAX_STREAK_BONUS,
  QUESTIONS_PER_RUN,
  QUESTION_SECONDS,
  RANKS,
  STREAK_PER_CORRECT,
  TILE_SHAPES,
  ZONES,
} from "./config";
import { playCorrect, playEnd, playSelect, playWrong } from "./sounds";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick 9 easy + 6 tech, shuffle option order each time. */
function buildRun() {
  const easy = shuffle(EASY_QUESTIONS).slice(0, 9);
  const tech = shuffle(ALL_QUESTIONS.filter((q) => q.level === "tech")).slice(0, 6);
  return [...easy, ...tech].map((q) => {
    const indices = shuffle([0, 1, 2, 3]);
    const options = indices.map((i) => q.options[i]);
    const answer = indices.indexOf(q.answer);
    return { ...q, options, answer };
  });
}

function getZone(score) {
  return ZONES.slice().reverse().find((z) => score >= z.minScore) ?? ZONES[0];
}

function getRank(score) {
  return RANKS.slice().reverse().find((r) => score >= r.minScore) ?? RANKS[0];
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------
const LS_KEY = "octo-dive-best-v2";
const LS_MUTE = "octo-dive-mute";

function readBest() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(LS_KEY) ?? "0", 10) || 0;
}
function saveBest(score) {
  if (typeof window === "undefined") return;
  if (score > readBest()) localStorage.setItem(LS_KEY, String(score));
}
function readMute() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LS_MUTE) === "1";
}
function saveMute(v) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_MUTE, v ? "1" : "0");
}

// ---------------------------------------------------------------------------
// Game state machine
// ---------------------------------------------------------------------------
const PHASE = { START: "start", QUESTION: "question", RESULT: "result", END: "end" };

function initRun() {
  return {
    phase: PHASE.START,
    questions: buildRun(),
    qIndex: 0,
    timeLeft: QUESTION_SECONDS,
    score: 0,
    streak: 0,
    chosen: null,
    correct: null,
    pointsEarned: null,
    personalBest: readBest(),
    correctCount: 0,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "NEW_RUN":
      return initRun();

    case "START":
      return { ...state, phase: PHASE.QUESTION, timeLeft: QUESTION_SECONDS, chosen: null, correct: null, pointsEarned: null };

    case "TICK": {
      if (state.phase !== PHASE.QUESTION) return state;
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, phase: PHASE.RESULT, chosen: null, correct: false, streak: 0, pointsEarned: 0 };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };
    }

    case "ANSWER": {
      if (state.phase !== PHASE.QUESTION) return state;
      const q = state.questions[state.qIndex];
      const correct = action.index === q.answer;
      let pts = 0;
      let streak = state.streak;
      if (correct) {
        const speedBonus = Math.round((state.timeLeft / QUESTION_SECONDS) * MAX_SPEED_BONUS);
        streak = Math.min(state.streak + 1, MAX_STREAK_BONUS / STREAK_PER_CORRECT);
        const streakBonus = Math.min(streak * STREAK_PER_CORRECT, MAX_STREAK_BONUS);
        pts = 100 + speedBonus + streakBonus;
      } else {
        streak = 0;
      }
      return {
        ...state,
        phase: PHASE.RESULT,
        chosen: action.index,
        correct,
        streak,
        score: state.score + pts,
        pointsEarned: pts,
        correctCount: state.correctCount + (correct ? 1 : 0),
      };
    }

    case "NEXT": {
      const next = state.qIndex + 1;
      if (next >= QUESTIONS_PER_RUN) {
        const best = Math.max(state.personalBest, state.score);
        saveBest(state.score);
        return { ...state, phase: PHASE.END, personalBest: best };
      }
      return { ...state, phase: PHASE.QUESTION, qIndex: next, timeLeft: QUESTION_SECONDS, chosen: null, correct: null, pointsEarned: null };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Tile labels
// ---------------------------------------------------------------------------
const TILE_LABELS = ["A", "B", "C", "D"];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function OctoDive() {
  const [state, dispatch] = useReducer(reducer, null, initRun);
  const [muted, setMuted] = useState(readMute);
  const [shake, setShake] = useState(false);
  const [tint, setTint] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const timerRef = useRef(null);
  const nextTimerRef = useRef(null);
  const shakeTimers = useRef([]);

  // Track reduced-motion changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Sound helper
  const sound = useCallback((fn) => { if (!muted) fn(); }, [muted]);

  // Timer tick
  useEffect(() => {
    if (state.phase !== PHASE.QUESTION) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(timerRef.current);
  }, [state.phase, state.qIndex]);

  // Pause timer on hidden tab
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) clearInterval(timerRef.current);
      else if (state.phase === PHASE.QUESTION)
        timerRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [state.phase]);

  // After result: play sound, trigger effects, then auto-advance
  useEffect(() => {
    if (state.phase !== PHASE.RESULT) { clearTimeout(nextTimerRef.current); return; }

    if (state.correct) {
      sound(playCorrect);
    } else {
      sound(playWrong);
      // Schedule state updates via setTimeout to avoid synchronous setState-in-effect
      const t1 = setTimeout(() => setShake(true), 0);
      const t2 = setTimeout(() => setTint(true), 0);
      const t3 = setTimeout(() => setShake(false), 420);
      const t4 = setTimeout(() => setTint(false), 800);
      shakeTimers.current = [t1, t2, t3, t4];
      if (reducedMotion) {
        clearTimeout(t1); clearTimeout(t3); // no shake in reduced-motion
        clearTimeout(t4);
        const t5 = setTimeout(() => setTint(false), 1500);
        shakeTimers.current = [t2, t5];
      }
    }
    nextTimerRef.current = setTimeout(() => dispatch({ type: "NEXT" }), 1500);
    return () => {
      clearTimeout(nextTimerRef.current);
      shakeTimers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.qIndex]);

  // End jingle
  useEffect(() => {
    if (state.phase === PHASE.END) setTimeout(() => sound(playEnd), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (state.phase === PHASE.START && (e.key === " " || e.key === "Enter")) {
        e.preventDefault(); dispatch({ type: "START" }); return;
      }
      if (state.phase === PHASE.QUESTION) {
        const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
        const idx = map[e.key.toLowerCase()];
        if (idx !== undefined) { e.preventDefault(); handleAnswer(idx); }
      }
      if (state.phase === PHASE.END && e.key.toLowerCase() === "r")
        dispatch({ type: "NEW_RUN" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.chosen]);

  function handleAnswer(idx) {
    if (state.phase !== PHASE.QUESTION || state.chosen !== null) return;
    sound(playSelect);
    dispatch({ type: "ANSWER", index: idx });
  }

  function handleCopy() {
    const zone = getZone(state.score);
    const text = `I dove ${state.score}m in Octo Dive with ${state.score} pts (${zone.name}) #GCCArcade`;
    navigator.clipboard?.writeText(text).catch(() => { });
  }

  function toggleMute() {
    setMuted((m) => { saveMute(!m); return !m; });
  }

  const q = state.questions[state.qIndex];
  const zone = getZone(state.score);
  const rank = getRank(state.score);
  const depthPct = Math.min(state.score / 1500, 1);
  const isNewBest = state.phase === PHASE.END && state.score > 0 && state.score >= state.personalBest;
  const timerPct = (state.timeLeft / QUESTION_SECONDS) * 100;
  const timerWarn = state.timeLeft <= 5;
  const isPlaying = state.phase === PHASE.QUESTION || state.phase === PHASE.RESULT;

  const liveMsg =
    state.phase === PHASE.RESULT
      ? state.correct
        ? `Correct! +${state.pointsEarned} points.`
        : `Not quite. The correct answer was: ${q?.options[q?.answer] ?? ""}.`
      : state.phase === PHASE.END
        ? `Run complete. ${state.score} points. ${rank.title}.`
        : "";

  return (
    <>
      {/* back link */}
      <Link href="/games" className="games-back">
        <ArrowLeft size={16} aria-hidden="true" /> All games
      </Link>

      {/* heading (matches snake-heading pattern) */}
      <header className="snake-heading">
        <p className="games-kicker">{"$ ./play octo-dive"}</p>
        <h1>Octo <span>Dive</span></h1>
        <p>Answer 15 GitHub and Git questions. Every correct answer helps Octocat dive deeper.</p>
      </header>

      {/* aria-live */}
      <p className="games-sr" role="status" aria-live="polite" aria-atomic="true">{liveMsg}</p>

      {/* ── three-column layout matching snake ── */}
      <div
        className={[
          "snake-layout octo-layout-override",
          shake && !reducedMotion ? "octo-shake" : "",
          tint ? "octo-tint" : "",
        ].filter(Boolean).join(" ")}
        style={{ "--zone-color": zone.color }}
      >
        {/* ── SCORE / SIDE PANEL ── */}
        <section className="snake-score" aria-label="Scorecard">
          <div className="score-head">
            <span className="games-kicker">{"// scorecard"}</span>
            <button
              id="octo-mute-btn"
              type="button"
              className="octo-mute-btn"
              aria-pressed={muted}
              onClick={toggleMute}
              aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            >
              {muted
                ? <VolumeX size={15} aria-hidden="true" />
                : <Volume2 size={15} aria-hidden="true" />}
            </button>
          </div>

          {/* mascot lives here — fixed size, never overlaps game content */}
          <div className="octo-scorecard-mascot">
            <OctocatDiver depthPct={depthPct} animate={!reducedMotion} />
          </div>

          <div className="score-main">
            <strong>{state.score}</strong>
            <span>/ 1500 m</span>
          </div>

          <dl className="score-stats">
            <div><dt>depth</dt><dd>{state.score} m</dd></div>
            <div><dt>correct</dt><dd>{state.correctCount} / {QUESTIONS_PER_RUN}</dd></div>
            <div><dt>best</dt><dd>{Math.max(state.personalBest, state.score)} m</dd></div>
          </dl>

          {/* streak — always in scorecard, doesn't shift game column */}
          <div className="octo-streak-row" aria-label={`Streak: ${state.streak}`}>
            <span className="octo-streak-label">streak</span>
            <span className={`octo-streak-value${state.streak > 0 ? " octo-streak-active" : ""}`}>
              {state.streak > 0 ? `×${state.streak}` : "—"}
            </span>
          </div>

          {/* zone indicator */}
          <div className="score-ttl">
            <div className="score-ttl-label">
              <span>zone</span>
              <strong style={{ color: zone.color }}>{zone.name}</strong>
            </div>
            <div className="score-ttl-bar" aria-hidden="true">
              <i style={{ width: `${depthPct * 100}%`, background: zone.color }} />
            </div>
          </div>
        </section>

        {/* ── ARENA (the game window) ── */}
        <section
          className="snake-arena"
          aria-label="Octo Dive game"
          data-game="octo-dive"
        >
          {/* window chrome bar */}
          <div className="arena-bar">
            <span className="arena-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="arena-title">gcc-arcade ~ octo-dive</span>
          </div>

          <div className="arena-screen">
            {/* ── START overlay ── */}
            {state.phase === PHASE.START && (
              <div className="arena-overlay is-idle">
                <div className="overlay-card">
                  <p className="games-kicker">{"// knowledge runs deep"}</p>
                  <h2>Let's branch out.</h2>
                  <p className="overlay-text">
                    Answer fast. Stack your streak.<br />
                    Dive deeper with every point.<br />
                    GLHF &lt;3
                  </p>
                  {/* <p className="overlay-text" style={{ fontSize: "0.78rem", marginTop: 0 }}>
                    Tap a tile or press <kbd>1</kbd>–<kbd>4</kbd> / <kbd>A</kbd>–<kbd>D</kbd>.
                  </p> */}
                  <button
                    id="octo-start-btn"
                    type="button"
                    className="snake-start"
                    onClick={() => dispatch({ type: "START" })}
                  >

                    {/* submarine SVG icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M2 8.5h12a0 0 0 0 1 0 0v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-1Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 8.5V6h4v2.5M8 6V4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="5" cy="10" r=".7" fill="currentColor" />
                      <circle cx="8" cy="10" r=".7" fill="currentColor" />
                      <circle cx="11" cy="10" r=".7" fill="currentColor" />
                      <circle cx="12.5" cy="3" r=".8" stroke="currentColor" strokeWidth="1.1" />
                      <circle cx="14.5" cy="1.5" r=".5" fill="currentColor" />
                      <path d="M5 14h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>

                    Start dive
                  </button>
                  <p className="overlay-hint">or press Space</p>
                </div>
              </div>
            )}

            {/* ── QUESTION / RESULT content ── */}
            {isPlaying && (
              <div className="octo-arena-inner">
                {/* header: Q counter + level badge */}
                <div className="octo-q-header">
                  <span className="octo-round-badge" aria-label={`Question ${state.qIndex + 1} of ${QUESTIONS_PER_RUN}`}>
                    Q {state.qIndex + 1} / {QUESTIONS_PER_RUN}
                  </span>
                  <span className={`octo-level-badge octo-level-${q?.level}`}>
                    {q?.level === "easy" ? "Beginner" : "Tech"}
                  </span>
                </div>

                {/* timer bar */}
                <div
                  className={`octo-timer-bar${timerWarn ? " octo-timer-warn" : ""}${state.phase === PHASE.RESULT ? " octo-timer-locked" : ""}`}
                  role="timer"
                  aria-label={`${state.timeLeft} seconds remaining`}
                >
                  <div className="octo-timer-track">
                    <div className="octo-timer-fill" style={{ width: `${timerPct}%` }} />
                  </div>
                  <span className="octo-timer-text" aria-hidden="true">{state.timeLeft}s</span>
                </div>

                {/* question */}
                <div className="octo-question-card" aria-live="polite" aria-atomic="true">
                  <p className="octo-question-text">{q?.q}</p>
                </div>

                {/* result pop (correct/wrong) */}
                {state.phase === PHASE.RESULT && (
                  <div
                    className={`octo-result-pop ${state.correct ? "octo-result-correct" : "octo-result-wrong"}`}
                    role="status"
                    aria-live="assertive"
                    aria-atomic="true"
                  >
                    {state.correct
                      ? <>✓ Correct! <span className="octo-pts-earned">+{state.pointsEarned} pts</span></>
                      : <>✗ {state.chosen === null ? "Time's up!" : "Not quite"}</>}
                  </div>
                )}

                {/* why explanation */}
                {state.phase === PHASE.RESULT && q?.why && (
                  <p className="octo-why-text" role="note">{q.why}</p>
                )}

                {/* answer tiles */}
                <div className="octo-tiles-grid" role="group" aria-label="Answer choices">
                  {q?.options.map((opt, i) => {
                    let tileState = "";
                    if (state.phase === PHASE.RESULT) {
                      if (i === q.answer) tileState = "correct";
                      else if (i === state.chosen && !state.correct) tileState = "wrong";
                      else tileState = "dim";
                    }
                    return (
                      <button
                        key={i}
                        id={`octo-tile-${i}`}
                        type="button"
                        className={[
                          "octo-tile",
                          `octo-tile-${TILE_SHAPES[i]}`,
                          `octo-tile-color-${i}`,
                          tileState ? `octo-tile-${tileState}` : "",
                        ].filter(Boolean).join(" ")}
                        onClick={() => handleAnswer(i)}
                        disabled={state.phase === PHASE.RESULT}
                        aria-pressed={state.chosen === i}
                        aria-label={`${TILE_LABELS[i]}: ${opt}`}
                      >
                        <span className="octo-tile-letter" aria-hidden="true">{TILE_LABELS[i]}</span>
                        <span className="octo-tile-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── END overlay ── */}
            {state.phase === PHASE.END && (
              <div className="arena-overlay is-won">
                <div className="overlay-card">
                  <p className="games-kicker">{"// run complete"}</p>
                  <h2 style={{ color: zone.color }}>{rank.title}</h2>
                  <p className="overlay-text">
                    <strong>{state.score} m</strong> · {state.score} pts · {state.correctCount}/{QUESTIONS_PER_RUN} correct
                  </p>
                  {isNewBest && <p className="overlay-badge">new personal best</p>}
                  <div className="octo-end-actions">
                    <button
                      id="octo-replay-btn"
                      type="button"
                      className="snake-start"
                      onClick={() => dispatch({ type: "NEW_RUN" })}
                    >
                      <RefreshCw size={15} aria-hidden="true" /> Play again
                    </button>
                    <button
                      id="octo-copy-btn"
                      type="button"
                      className="octo-btn octo-btn-outline"
                      onClick={handleCopy}
                    >
                      <Copy size={14} aria-hidden="true" /> Copy result
                    </button>
                  </div>
                  <p className="overlay-hint">or press R to restart</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── RULES sidebar ── */}
        <section className="snake-rules" aria-labelledby="octo-rules-heading">
          <p className="games-kicker" id="octo-rules-heading">{"$ cat RULES.md"}</p>
          <ol>
            <li><b>15 questions.</b> They get harder as you dive deeper.</li>
            <li><b>15 seconds</b> per question. Answer wrong or time out and streak resets.</li>
            <li><b>Score = depth.</b> Correct = 100 + speed bonus (up to +50) + streak bonus (+10 each, max +50).</li>
            <li><b>Aim for the Abyss</b> at 900 m.</li>
          </ol>
          <div className="snake-keys">
            <p><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd><span>or A B C D to answer</span></p>
            <p><kbd>Space</kbd><span>start</span></p>
            <p><kbd>R</kbd><span>restart after run</span></p>
          </div>
        </section>
      </div>
    </>
  );
}
