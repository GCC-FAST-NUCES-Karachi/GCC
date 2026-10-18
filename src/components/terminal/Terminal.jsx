"use client";

/**
 * Terminal.jsx — GCC Terminal Overlay UI (mobile-first)
 *
 * - Accessible modal: focus moves in, is trapped, and returns to the trigger.
 *   The rest of the page is made `inert` while open.
 * - Mobile: follows the visual viewport so the on-screen keyboard never hides the input.
 * - Output is rendered from structured entries; file text is parsed into safe React
 *   nodes (no dangerouslySetInnerHTML anywhere).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTerminal } from "./TerminalProvider.jsx";
import {
  getCompletions,
  isRunnableSuggestion,
} from "./terminalCommands.js";
import { CLUE_KEYS } from "./terminalData.js";
import "./Terminal.css";

// ---------------------------------------------------------------------------
// File text -> blocks (paragraphs are re-flowed so they wrap well on phones)
// ---------------------------------------------------------------------------
function parseFile(content) {
  const blocks = [];
  let para = null;
  const flush = () => {
    if (para) blocks.push(para);
    para = null;
  };

  for (const raw of content.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      flush();
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ t: "h2", text: line.slice(3) });
    } else if (line.startsWith("# ")) {
      flush();
      blocks.push({ t: "h1", text: line.slice(2) });
    } else if (/^---+$/.test(line)) {
      flush();
      blocks.push({ t: "hr" });
    } else if (/^\s*(-|\d+\.)\s+/.test(line)) {
      flush();
      const m = line.match(/^\s*(-|\d+\.)\s+(.*)$/);
      blocks.push({ t: "li", marker: m[1] === "-" ? "•" : m[1], text: m[2] });
    } else if (line.startsWith("> ")) {
      if (para && para.t === "quote") para.text += " " + line.slice(2);
      else {
        flush();
        para = { t: "quote", text: line.slice(2) };
      }
    } else if (/^\s{2,}/.test(line)) {
      flush();
      blocks.push({ t: "pre", text: line });
    } else if (para && para.t === "p") {
      para.text += " " + line;
    } else {
      flush();
      para = { t: "p", text: line };
    }
  }
  flush();
  return blocks;
}

function Inline({ text, onSuggestionClick }) {
  return text.split(/(`[^`]+`)/g).map((seg, i) => {
    if (seg.length > 2 && seg.startsWith("`") && seg.endsWith("`")) {
      const code = seg.slice(1, -1);
      if (isRunnableSuggestion(code)) {
        return (
          <button
            key={i}
            type="button"
            className="tf-cmd"
            onClick={() => onSuggestionClick(code)}
          >
            {code}
          </button>
        );
      }
      return <code key={i}>{code}</code>;
    }
    return seg;
  });
}

function FileCard({ entry, onSuggestionClick }) {
  const blocks = useMemo(() => parseFile(entry.content), [entry.content]);
  const inline = (t) => (
    <Inline text={t} onSuggestionClick={onSuggestionClick} />
  );

  return (
    <div className="term-file">
      {entry.name && <div className="term-file-head">{entry.name}</div>}
      <div className="term-file-body">
        {blocks.map((b, i) => {
          switch (b.t) {
            case "h1":
              return (
                <div key={i} className="tf-h1">
                  {b.text}
                </div>
              );
            case "h2":
              return (
                <div key={i} className="tf-h2">
                  {b.text}
                </div>
              );
            case "hr":
              return <hr key={i} className="tf-hr" />;
            case "li":
              return (
                <div key={i} className="tf-li">
                  <span className="tf-marker">{b.marker}</span>
                  <span>{inline(b.text)}</span>
                </div>
              );
            case "quote":
              return (
                <blockquote key={i} className="tf-quote">
                  {inline(b.text)}
                </blockquote>
              );
            case "pre":
              return (
                <div key={i} className="tf-pre">
                  {b.text}
                </div>
              );
            default:
              return (
                <p
                  key={i}
                  className={`tf-p${b.text.startsWith("🔑") ? " tf-clue" : ""}`}
                >
                  {inline(b.text)}
                </p>
              );
          }
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Output line renderer
// ---------------------------------------------------------------------------
function OutputLine({ entry, onSuggestionClick, onNavigate }) {
  if (!entry) return null;

  switch (entry.type) {
    case "command-echo":
      return (
        <div className="term-line term-line--command-echo" data-echo="">
          <span className="term-command-prompt">
            <span className="term-user">visitor@gcc </span>
            <span className="term-branch">[{entry.branch}]</span>
            <span className="term-sign">$</span>
          </span>{" "}
          <span className="term-command-text">{entry.content}</span>
        </div>
      );

    case "file":
      return <FileCard entry={entry} onSuggestionClick={onSuggestionClick} />;

    case "cmd":
      return (
        <div className="term-cmd">
          <button
            type="button"
            className="term-cmd-btn"
            onClick={() => onSuggestionClick(entry.fill)}
          >
            {entry.command}
          </button>
          {entry.desc && <span className="term-cmd-desc">{entry.desc}</span>}
        </div>
      );

    case "log":
      return entry.hash ? (
        <div className="term-log">
          <span className="term-log-hash">{entry.hash}</span>
          <span className="term-log-msg">{entry.msg}</span>
        </div>
      ) : (
        <div className="term-line term-line--log">{entry.content}</div>
      );

    case "banner":
      return <pre className="term-art term-art--banner">{entry.content}</pre>;

    case "reward":
      return <pre className="term-art term-art--reward">{entry.content}</pre>;

    case "suggestion":
      return (
        <button
          className="term-suggestion"
          type="button"
          onClick={() => onSuggestionClick(entry.command)}
        >
          {entry.label}
        </button>
      );

    case "link":
      return (
        <Link className="term-link" href={entry.href} onClick={onNavigate}>
          {entry.label}
        </Link>
      );

    case "tutorial":
      return null; // handled by TutorialBlock

    case "boot":
    case "welcome":
    case "heading":
    case "error":
    case "success":
    case "info":
    case "dim":
    case "file-name":
    case "branch-active":
    case "branch":
      return (
        <div className={`term-line term-line--${entry.type}`}>
          {entry.content}
        </div>
      );

    default:
      return <div className="term-line">{entry.content}</div>;
  }
}

// ---------------------------------------------------------------------------
// Tutorial block (only the latest step is interactive)
// ---------------------------------------------------------------------------
function TutorialBlock({ entry, isLatest, onSuggestionClick, onSkip }) {
  if (!isLatest) {
    return null;
  }
  return (
    <div className={`term-tutorial${entry.final ? " is-final" : ""}`}>
      <div className="term-tutorial-text">{entry.content}</div>
      {!entry.final && (
        <div className="term-tutorial-actions">
          {entry.suggestedCommand && (
            <button
              className="term-suggestion"
              type="button"
              onClick={() => onSuggestionClick(entry.suggestedCommand)}
            >
              Run: {entry.suggestedCommand}
            </button>
          )}
          <button className="term-skip-btn" type="button" onClick={onSkip}>
            skip tutorial
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Terminal
// ---------------------------------------------------------------------------
export default function Terminal() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isOpen,
    isClosing,
    closeTerminal,
    state,
    runCommand,
    skipTutorial,
    navigateHistory,
    historyValue,
  } = useTerminal();

  const [input, setInput] = useState("");
  const [completions, setCompletions] = useState([]);
  const [activeCompletion, setActiveCompletion] = useState(-1);
  const [fx, setFx] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [engaged, setEngaged] = useState(false);

  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const overlayRef = useRef(null);
  const windowRef = useRef(null);
  const prevSecret = useRef(state.secretUnlocked);
  const prevDone = useRef(state.challengeCompleted);

  useEffect(() => setMounted(true), []);

  const handleClose = useCallback(() => {
    closeTerminal();
    if (pathname === "/terminal") router.push("/");
  }, [closeTerminal, pathname, router]);
  const handleNavigate = useCallback(
    () => closeTerminal({ restoreScroll: false }),
    [closeTerminal],
  );

  // History navigation -> input value (Down past the end clears the input)
  useEffect(() => {
    setInput(historyValue ?? "");
  }, [historyValue]);

  // Short celebratory pulse when the branch unlocks / challenge completes
  useEffect(() => {
    let timer;
    if (state.secretUnlocked && !prevSecret.current) {
      setFx("unlock");
      timer = setTimeout(() => setFx(null), 1500);
    }
    if (state.challengeCompleted && !prevDone.current) {
      setFx("reward");
      timer = setTimeout(() => setFx(null), 1800);
    }
    prevSecret.current = state.secretUnlocked;
    prevDone.current = state.challengeCompleted;
    return () => clearTimeout(timer);
  }, [state.secretUnlocked, state.challengeCompleted]);

  // Keep the newest output visible, including when reopening a long session.
  useEffect(() => {
    const out = outputRef.current;
    if (!out) return;
    requestAnimationFrame(() => {
      if (!outputRef.current) return;
      const el = outputRef.current;
      el.scrollTop = el.scrollHeight;
    });
  }, [state.output]);

  // Move focus into the dialog on open (input on desktop; dialog itself on touch
  // devices so the keyboard doesn't pop up over the boot screen)
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const timer = setTimeout(() => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      (coarse ? windowRef.current : inputRef.current)?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen, mounted]);

  // Make everything behind the modal inert while it's open
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const changed = [];
    Array.from(document.body.children).forEach((node) => {
      if (
        node === overlayRef.current ||
        ["SCRIPT", "STYLE", "LINK"].includes(node.tagName)
      )
        return;
      if (node.hasAttribute("inert")) return;
      node.setAttribute("inert", "");
      changed.push(node);
    });
    return () => changed.forEach((n) => n.removeAttribute("inert"));
  }, [isOpen, mounted]);

  // Mobile keyboard: size the overlay to the *visual* viewport
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const vv = window.visualViewport;
    if (!vv) return;
    let lastHeight = vv.height;

    const apply = () => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.style.setProperty("--vvh", `${vv.height}px`);
      overlay.style.setProperty("--vvt", `${vv.offsetTop}px`);
      if (vv.height < lastHeight - 40 && outputRef.current) {
        // keyboard just opened — keep the latest output visible
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
      lastHeight = vv.height;
    };

    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
    };
  }, [isOpen, mounted]);

  // Escape closes (unless the autocomplete list consumed it)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !e.defaultPrevented) {
        e.preventDefault();
        handleClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  // Focus trap: wrap Tab / Shift+Tab inside the dialog
  const handleOverlayKeyDown = useCallback((e) => {
    if (e.key !== "Tab" || e.defaultPrevented || !overlayRef.current) return;
    const focusables = Array.from(
      overlayRef.current.querySelectorAll(
        'button:not([disabled]), input, a[href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === windowRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // ---- Input handling -----------------------------------------------------
  const handleSuggestionClick = useCallback((command) => {
    setEngaged(true);
    setCompletions([]);
    setActiveCompletion(-1);
    // Complete suggestions are actions: run them with one tap. Keep templates
    // in the input so the visitor can fill in the missing value.
    if (!command.endsWith(" ") && !command.includes("<")) {
      runCommand(command);
      setInput("");
      return;
    }
    setInput(command);
    inputRef.current?.focus();
  }, [runCommand]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    runCommand(trimmed);
    setInput("");
    setCompletions([]);
    setActiveCompletion(-1);
  }, [input, runCommand]);

  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key.length === 1 || e.key === "Backspace") setEngaged(true);
      if (e.key === "Enter") {
        e.preventDefault();
        if (completions.length > 0 && activeCompletion >= 0) {
          setInput(completions[activeCompletion]);
          setCompletions([]);
          setActiveCompletion(-1);
        } else {
          handleSubmit();
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (completions.length > 0) {
          setActiveCompletion((p) => (p <= 0 ? completions.length - 1 : p - 1));
        } else {
          navigateHistory("up");
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (completions.length > 0) {
          setActiveCompletion((p) =>
            p >= completions.length - 1 ? -1 : p + 1,
          );
        } else {
          navigateHistory("down");
        }
        return;
      }

      if (e.key === "Tab" && !e.shiftKey) {
        const results = getCompletions(input, state);
        if (results.length === 0) return; // nothing to complete: let focus move (trap handles wrap)
        e.preventDefault();
        if (results.length === 1) {
          setInput(results[0]);
          setCompletions([]);
        } else {
          setCompletions(results);
          setActiveCompletion(0);
        }
        return;
      }

      if (e.key === "Escape" && completions.length > 0) {
        e.preventDefault(); // tells the document handler not to close
        setCompletions([]);
        setActiveCompletion(-1);
      }
    },
    [
      completions,
      activeCompletion,
      handleSubmit,
      navigateHistory,
      input,
      state,
    ],
  );

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
    setCompletions([]);
    setActiveCompletion(-1);
  }, []);

  const handleCompletionClick = useCallback((item) => {
    setInput(item);
    setCompletions([]);
    setActiveCompletion(-1);
    inputRef.current?.focus();
  }, []);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) handleClose();
    },
    [handleClose],
  );

  const handleOutputClick = useCallback((e) => {
    // On touch devices don't pop the keyboard just because the person tapped the text.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.getSelection()?.toString()) return;
    if (e.target.closest("button, a")) return;
    inputRef.current?.focus();
  }, []);

  if (!mounted || !isOpen) return null;

  const clueCount = state.discoveredClues.length;
  let lastTutorial = -1;
  state.output.forEach((e, i) => {
    if (e.type === "tutorial") lastTutorial = i;
  });

  return createPortal(
    <div
      ref={overlayRef}
      className={`terminal-overlay${isClosing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="GCC Terminal"
      onClick={handleBackdropClick}
      onKeyDown={handleOverlayKeyDown}
    >
      <div ref={windowRef} className="terminal-window" tabIndex={-1}>
        {fx && (
          <div
            key={fx}
            className={`terminal-fx terminal-fx--${fx}`}
            aria-hidden="true"
          />
        )}

        {/* Title bar */}
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <button
              type="button"
              className="terminal-dot terminal-dot--red"
              onClick={handleClose}
              aria-label="Close terminal"
            />
            <span
              className="terminal-dot terminal-dot--yellow"
              aria-hidden="true"
            />
            <span
              className="terminal-dot terminal-dot--green"
              aria-hidden="true"
            />
          </div>

          <div className="terminal-title">
            <span className="terminal-title-name">gcc-terminal</span>
            <span key={state.currentBranch} className="terminal-branch-pill">
              ⎇ {state.currentBranch}
            </span>
          </div>

          <div
            className={`terminal-pips${state.secretUnlocked ? " is-unlocked" : ""}`}
            role="img"
            aria-label={`Key words found: ${clueCount} of ${CLUE_KEYS.length}`}
            title={`Key words found: ${clueCount}/${CLUE_KEYS.length}`}
          >
            {CLUE_KEYS.map((k, i) => (
              <span
                key={k}
                className={`terminal-pip${i < clueCount ? " is-on" : ""}`}
              />
            ))}
          </div>

          <button
            className="terminal-close-btn"
            type="button"
            onClick={handleClose}
          >
            go back
          </button>
        </div>

        {/* Output */}
        <div
          ref={outputRef}
          className="terminal-output"
          aria-live="polite"
          aria-relevant="additions"
          role="log"
          onClick={handleOutputClick}
        >
          {state.output.map((entry, i) =>
            entry.type === "tutorial" ? (
              state.tutorialSkipped ? null : (
                <TutorialBlock
                  key={i}
                  entry={entry}
                  isLatest={i === lastTutorial}
                  onSuggestionClick={handleSuggestionClick}
                  onSkip={skipTutorial}
                />
              )
            ) : (
              <OutputLine
                key={i}
                entry={entry}
                onSuggestionClick={handleSuggestionClick}
                onNavigate={handleNavigate}
              />
            ),
          )}
        </div>

        {/* Input */}
        <div className="terminal-input-area">
          <div
            className={`terminal-input-row${engaged ? " is-engaged" : ""}`}
            onPointerDown={() => setEngaged(true)}
          >
            <span className="terminal-prompt" aria-hidden="true">
              <span className="terminal-prompt-branch">
                [{state.currentBranch}]
              </span>
              <span className="terminal-prompt-sign">$</span>
            </span>

            <div className="terminal-input-wrapper">
              {completions.length > 0 && (
                <div className="terminal-autocomplete" role="listbox">
                  {completions.map((item, i) => (
                    <button
                      key={item}
                      className={`terminal-autocomplete-item${i === activeCompletion ? " is-active" : ""}`}
                      type="button"
                      role="option"
                      aria-selected={i === activeCompletion}
                      onClick={() => handleCompletionClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              <input
                ref={inputRef}
                className="terminal-input"
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="type a command…"
                aria-label="Terminal command input"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                enterKeyHint="send"
                onBlur={() => setEngaged(false)}
              />
            </div>

            <button
              type="button"
              className="terminal-send"
              aria-label="Run command"
              disabled={!input.trim()}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                handleSubmit();
                inputRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M16 5v5a2 2 0 0 1-2 2H5m3-3-3 3 3 3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
