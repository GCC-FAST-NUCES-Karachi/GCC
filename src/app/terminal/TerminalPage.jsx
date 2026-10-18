"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerminal } from "@/components/terminal/TerminalProvider.jsx";
export default function TerminalPage() {
  const { isOpen, openTerminal, closeTerminal } = useTerminal();
  const router = useRouter();
  const pathname = usePathname();

  // Page khulte hi terminal khulo; page chhodte hi band karo (back button par bhi)
  useEffect(() => {
    openTerminal();
    return () => closeTerminal({ restoreScroll: false });
  }, [openTerminal, closeTerminal]);

  // User "go back" / exit / Escape kare to home par bhejo
  // (pathname check isliye ke terminal ke andar ke links /events waghera ko override na karein)
  useEffect(() => {
    if (!isOpen && pathname === "/terminal") {
      const t = setTimeout(() => router.push("/"), 260);
      return () => clearTimeout(t);
    }
  }, [isOpen, pathname, router]);

  return <main aria-hidden="true" style={{ minHeight: "100vh" }} />;
}