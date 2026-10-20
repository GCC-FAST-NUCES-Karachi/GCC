"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { siGithub } from "simple-icons";
import { consumeTerminalGlow, getBug, getServerBug, subscribe } from "@/lib/easterBug";
import "./Navbar.css";
const navItems = [
  { href: "/", label: "~/home" },
  { href: "/learn", label: "~/learn" },
  { href: "/perks", label: "~/perks" },
  { href: "/events", label: "~/events" },
  { href: "/games", label: "~/games" },
  { href: "/team", label: "~/team" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTerminalGlow, setShowTerminalGlow] = useState(false);
  const navRef = useRef(null);
  // The terminal appears after the easter egg is discovered.
  const bug = useSyncExternalStore(subscribe, getBug, getServerBug);

  useEffect(() => {
    if (!bug && consumeTerminalGlow()) setShowTerminalGlow(true);
  }, [bug]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const handleTerminalClick = () => {
    setMenuOpen(false);
    router.push("/terminal");
  };

  return (
    <nav ref={navRef} aria-label="Primary navigation" className="site-nav">
      <Link className="brand" href="/" aria-label="GCC home">
        <svg aria-hidden="true" className="brand-mark" viewBox="0 0 24 24">
          <path d={siGithub.path} />
        </svg>
        <span>GCC</span>
      </Link>

      <div
        className={`nav-links${menuOpen ? " is-open" : ""}`}
        id="primary-nav-links"
      >
        {navItems.map((item) => (
          <Link
            aria-current={
              pathname === item.href ||
              (item.href === "/games" && pathname.startsWith("/games/"))
                ? "page"
                : undefined
            }
            className={
              pathname === item.href ||
              (item.href === "/games" && pathname.startsWith("/games/"))
                ? "active"
                : undefined
            }
            href={item.href}
            key={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        {!bug && (
          <button
            className={`terminal-button${showTerminalGlow ? " is-new" : ""}`}
            type="button"
            aria-label="Open terminal"
            title="Open terminal"
            onClick={handleTerminalClick}
          >
            <span aria-hidden="true">&gt;_</span>
            <span className="terminal-label" aria-hidden="true">terminal</span>
          </button>
        )}
        {/* <Link href="/#join" className="join-button nav-join" onClick={() => setMenuOpen(false)}>
          <span className="join-label-desktop">Join the club</span>
          <span className="join-label-mobile">Join</span>
        </Link> */}
        <a
          aria-label="GitHub organization"
          className="github-button"
          href="https://github.com/ismailsilat7/ghcc"
          rel="noreferrer"
          target="_blank"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d={siGithub.path} />
          </svg>
        </a>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            aria-hidden="true"
            className={`nav-menu-icon${menuOpen ? " is-open" : ""}`}
          >
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </nav>
  );
}
