"use client";

import { usePathname } from "next/navigation";

export default function SiteChromeClient({ children, navbar, footer }) {
  const standaloneTerminal = usePathname() === "/terminal";

  return (
    <>
      {!standaloneTerminal && <a className="skip-link" href="#main-content">Skip to main content</a>}
      {!standaloneTerminal && navbar}
      {children}
      {!standaloneTerminal && footer}
    </>
  );
}
