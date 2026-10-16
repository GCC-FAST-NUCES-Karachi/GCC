"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siGithub } from "simple-icons";
import "./Navbar.css";

const navItems = [
  { href: "/", label: "~/home" },
  { href: "/learn", label: "~/learn" },
  { href: "/events", label: "~/events" },
  { href: "/team", label: "~/team" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

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

  return (
    <nav ref={navRef} aria-label="Primary navigation" className="site-nav">
      <Link className="brand" href="/" aria-label="GCC home">
        <svg aria-hidden="true" className="brand-mark" viewBox="0 0 24 24"><path d={siGithub.path} /></svg>
        <span>GCC</span>
      </Link>

      <div className={`nav-links${menuOpen ? " is-open" : ""}`} id="primary-nav-links">
        {navItems.map((item) => (
          <Link
            aria-current={pathname === item.href ? "page" : undefined}
            className={pathname === item.href ? "active" : undefined}
            href={item.href}
            key={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        <Link href="/#join" className="join-button nav-join" onClick={() => setMenuOpen(false)}>Join the club</Link>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <a
          aria-label="GitHub organization"
          className="github-button"
          href="https://github.com/ismailsilat7/ghcc"
          rel="noreferrer"
          target="_blank"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d={siGithub.path} /></svg>
        </a>
      </div>
    </nav>
  );
}
