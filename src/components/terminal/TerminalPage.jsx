"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerminal } from "@/components/terminal/TerminalProvider.jsx";

export default function TerminalPage() {
  const { isOpen, openTerminal, closeTerminal, closeIntentRef } = useTerminal();
  const router = useRouter();
  const pathname = usePathname();
  const hasOpened = useRef(false);

  // Open on enter; close on leave. Prefetch home so the exit is instant.
  useEffect(() => {
    router.prefetch("/");
    openTerminal();
    return () => closeTerminal({ restoreScroll: false });
  }, [openTerminal, closeTerminal, router]);

  // When the terminal closes (go back / Escape / exit) go home exactly once.
  // If it closed because the visitor followed a link inside it (e.g. /events),
  // do NOT redirect: that navigation is already in progress and must win.
  useEffect(() => {
    if (isOpen) {
      hasOpened.current = true;
    } else if (
      hasOpened.current &&
      pathname === "/terminal" &&
      closeIntentRef.current !== "navigate"
    ) {
      router.replace("/");
    }
  }, [isOpen, pathname, router, closeIntentRef]);

  return <main aria-hidden="true" style={{ minHeight: "100vh" }} />;
}
