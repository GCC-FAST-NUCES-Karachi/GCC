"use client";

/**
 * TerminalProvider.jsx — Global Terminal State
 *
 * Single source of truth for: open/close, branch, history, output buffer,
 * tutorial, clues, secret/challenge state. Persists progress AND the visible
 * output in sessionStorage, so a page reload restores the terminal as it was.
 *
 * Exposes (in addition to the original API):
 *   isClosing   — true during the exit animation (Terminal reads it for CSS)
 *   skipBoot()  — finish the boot animation instantly
 *   closeTerminal({ restoreScroll: false }) — used when a link navigates away
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BOOT_LINES, WELCOME_MESSAGE, RETURN_MESSAGE } from "./terminalData.js";
import { executeCommand, TUTORIAL_STEPS } from "./terminalCommands.js";

const TerminalContext = createContext(null);

const SESSION_KEY = "gcc-terminal-state";
const CLOSE_MS = 220;
const MAX_SAVED_OUTPUT = 300; // keep storage small; newest lines win

// ---------------------------------------------------------------------------
// State helpers
// ---------------------------------------------------------------------------
function defaultState() {
  return {
    currentBranch: "main",
    commandHistory: [],
    historyIndex: -1,
    output: [],
    tutorialStep: 0,
    tutorialSkipped: false,
    discoveredClues: [],
    secretUnlocked: false,
    challengeCompleted: false,
    hasBooted: false,
    booting: false, // runtime only, never persisted
  };
}

function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    // Guard against corrupted/old shapes
    if (!Array.isArray(parsed.output)) parsed.output = [];
    if (!Array.isArray(parsed.commandHistory)) parsed.commandHistory = [];
    if (!Array.isArray(parsed.discoveredClues)) parsed.discoveredClues = [];
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(s) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        currentBranch: s.currentBranch,
        commandHistory: s.commandHistory,
        output: s.output.slice(-MAX_SAVED_OUTPUT),
        tutorialStep: s.tutorialStep,
        tutorialSkipped: s.tutorialSkipped,
        discoveredClues: s.discoveredClues,
        secretUnlocked: s.secretUnlocked,
        challengeCompleted: s.challengeCompleted,
        hasBooted: s.hasBooted,
      })
    );
  } catch {
    // Storage unavailable or full — continue without persistence.
  }
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const blank = () => ({ type: "normal", content: "" });

const tutorialActive = (s) => !s.tutorialSkipped && s.tutorialStep < TUTORIAL_STEPS.length - 1;

function tutorialEntry(stepIndex) {
  const step = TUTORIAL_STEPS[stepIndex];
  return {
    type: "tutorial",
    content: step.message,
    suggestedCommand: step.suggestedCommand,
    final: !step.suggestedCommand,
  };
}

function buildBootOutput(s) {
  const out = BOOT_LINES.map((l) => ({ type: "boot", content: l.text }));
  out.push(blank(), { type: "welcome", content: WELCOME_MESSAGE });
  if (tutorialActive(s)) out.push(blank(), tutorialEntry(s.tutorialStep));
  return out;
}

function buildReturnOutput(s) {
  const msg = RETURN_MESSAGE.replace("{branch}", s.currentBranch).replace(
    "{clues}",
    String(s.discoveredClues.length)
  );
  const out = [{ type: "info", content: msg }];
  if (tutorialActive(s)) out.push(blank(), tutorialEntry(s.tutorialStep));
  return out;
}

function pushHistory(history, cmd) {
  return history[history.length - 1] === cmd ? history : [...history, cmd];
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function TerminalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [state, setState] = useState(defaultState);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const hydratedRef = useRef(false);
  const triggerRef = useRef(null);
  const scrollPosRef = useRef(0);
  const bootTimers = useRef([]);
  const closeTimer = useRef(null);
  const closingRef = useRef(false);
  // Why the terminal last closed: "close" (go back / Escape / exit) or "navigate" (a link was followed)
  const closeIntentRef = useRef("close");

  /**
   * Load the saved session exactly once. It is also called from openTerminal,
   * because a child component can open the terminal before the mount effect
   * below has run (child effects fire before parent effects).
   */
  const hydrate = useCallback(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const saved = loadSession();
    if (!saved) return;
    const merged = { ...stateRef.current, ...saved, booting: false, historyIndex: -1 };
    stateRef.current = merged;
    setState(merged);
  }, []);

  // Hydrate from session on mount (client only)
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Persist progress + output (only after hydration, so we never overwrite
  // a saved session with the empty default state)
  useEffect(() => {
    if (hydratedRef.current && state.hasBooted) saveSession(state);
  }, [state]);

  // Clear timers on unmount
  useEffect(
    () => () => {
      bootTimers.current.forEach(clearTimeout);
      clearTimeout(closeTimer.current);
    },
    []
  );

  // ---- Boot ---------------------------------------------------------------
  const clearBootTimers = useCallback(() => {
    bootTimers.current.forEach(clearTimeout);
    bootTimers.current = [];
  }, []);

  /** Jump straight to the finished boot screen. */
  const skipBoot = useCallback(() => {
    clearBootTimers();
    setState((prev) =>
      prev.booting
        ? { ...prev, output: buildBootOutput(prev), booting: false, hasBooted: true }
        : prev
    );
  }, [clearBootTimers]);

  const startBoot = useCallback(() => {
    clearBootTimers();

    if (prefersReducedMotion()) {
      setState((prev) => ({ ...prev, output: buildBootOutput(prev), booting: false, hasBooted: true }));
      return;
    }

    setState((prev) => ({ ...prev, output: [], booting: true }));

    let elapsed = 0;
    BOOT_LINES.forEach((line) => {
      elapsed += line.delay;
      bootTimers.current.push(
        setTimeout(() => {
          setState((prev) =>
            prev.booting
              ? { ...prev, output: [...prev.output, { type: "boot", content: line.text }] }
              : prev
          );
        }, elapsed)
      );
    });
    bootTimers.current.push(
      setTimeout(() => {
        setState((prev) =>
          prev.booting
            ? { ...prev, output: buildBootOutput(prev), booting: false, hasBooted: true }
            : prev
        );
      }, elapsed + 260)
    );
  }, [clearBootTimers]);

  // ---- Open / close -------------------------------------------------------
  const openTerminal = useCallback(
    (triggerElement) => {
      hydrate(); // make sure saved progress/output is loaded before deciding what to show

      // Accept an element, an event, or nothing.
      const el = triggerElement?.currentTarget ?? triggerElement;
      triggerRef.current = el instanceof HTMLElement ? el : document.activeElement;
      scrollPosRef.current = window.scrollY;

      clearTimeout(closeTimer.current);
      closingRef.current = false;
      closeIntentRef.current = "close";
      setIsClosing(false);
      document.body.style.overflow = "hidden";
      setIsOpen(true);

      const s = stateRef.current;
      if (!s.hasBooted) {
        startBoot();
      } else if (s.output.length === 0) {
        // Only happens if the visitor ran `clear` before reloading.
        setState((prev) => ({ ...prev, output: buildReturnOutput(prev) }));
      }
      // Otherwise the restored/previous output is already there — don't append anything.
    },
    [hydrate, startBoot]
  );

  const closeTerminal = useCallback(
    (opts) => {
      if (closingRef.current) return;
      closingRef.current = true;
      closeIntentRef.current = opts?.navigating ? "navigate" : "close";
      skipBoot(); // never leave a half-finished boot behind
      setIsClosing(true);

      const finish = () => {
        setIsOpen(false);
        setIsClosing(false);
        closingRef.current = false;
        document.body.style.overflow = "";

        if (opts?.restoreScroll !== false) {
          window.scrollTo(0, scrollPosRef.current);
          triggerRef.current?.focus?.();
        }
        triggerRef.current = null;
      };

      closeTimer.current = setTimeout(finish, prefersReducedMotion() ? 0 : CLOSE_MS);
    },
    [skipBoot]
  );

  // ---- Commands -----------------------------------------------------------
  const runCommand = useCallback(
    (rawInput) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      if (state.booting) skipBoot();

      const result = executeCommand(trimmed, state);
      const updates = result.stateUpdates || {};

      if (updates.__clear) {
        setState((prev) => ({
          ...prev,
          output: [],
          commandHistory: [],
          historyIndex: -1,
        }));
        return;
      }

      if (updates.__exit) {
        closeTerminal();
        return;
      }

      // Tutorial progress
      let tutorialOutput = [];
      let tutorialUpdate = {};
      if (!state.tutorialSkipped && state.tutorialStep < TUTORIAL_STEPS.length - 1) {
        if (TUTORIAL_STEPS[state.tutorialStep].check(trimmed.toLowerCase())) {
          const next = state.tutorialStep + 1;
          tutorialUpdate = { tutorialStep: next };
          if (TUTORIAL_STEPS[next]) tutorialOutput = [blank(), tutorialEntry(next)];
        }
      }

      const echo = { type: "command-echo", content: trimmed, branch: state.currentBranch };

      setState((prev) => ({
        ...prev,
        output: [...prev.output, echo, ...result.output, ...tutorialOutput],
        commandHistory: pushHistory(prev.commandHistory, trimmed),
        historyIndex: -1,
        ...updates,
        ...tutorialUpdate,
      }));
    },
    [state, skipBoot, closeTerminal]
  );

  const skipTutorial = useCallback(() => {
    setState((prev) => ({ ...prev, tutorialSkipped: true }));
  }, []);

  const navigateHistory = useCallback((direction) => {
    setState((prev) => {
      const { commandHistory, historyIndex } = prev;
      if (commandHistory.length === 0) return prev;

      let next;
      if (direction === "up") {
        next = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      } else {
        if (historyIndex === -1) return prev;
        next = historyIndex + 1 >= commandHistory.length ? -1 : historyIndex + 1;
      }
      return { ...prev, historyIndex: next };
    });
  }, []);

  const historyValue = useMemo(
    () => (state.historyIndex === -1 ? null : state.commandHistory[state.historyIndex] ?? null),
    [state.historyIndex, state.commandHistory]
  );

  const value = useMemo(
    () => ({
      isOpen,
      isClosing,
      openTerminal,
      closeTerminal,
      state,
      runCommand,
      skipTutorial,
      skipBoot,
      navigateHistory,
      historyValue,
      closeIntentRef,
    }),
    [isOpen, isClosing, openTerminal, closeTerminal, state, runCommand, skipTutorial, skipBoot, navigateHistory, historyValue]
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used within a TerminalProvider");
  return ctx;
}
