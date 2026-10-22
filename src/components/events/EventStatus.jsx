"use client";

import { useEffect, useState } from "react";

function getEventStatus(startAt, endAt, now = Date.now()) {
  if (now < Date.parse(startAt)) return "Confirmed";
  if (now < Date.parse(endAt)) return "Ongoing";
  return "Completed";
}

export default function EventStatus({ startAt, endAt }) {
  const [status, setStatus] = useState("Confirmed");

  useEffect(() => {
    const updateStatus = () => setStatus(getEventStatus(startAt, endAt));
    updateStatus();
    const intervalId = window.setInterval(updateStatus, 30_000);

    return () => window.clearInterval(intervalId);
  }, [startAt, endAt]);

  return <span className={`event-state${status === "Completed" ? " completed" : ""}`} aria-live="polite">{status}</span>;
}
