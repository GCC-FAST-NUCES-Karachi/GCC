import Link from "next/link";
import { Clock3, MapPin } from "lucide-react";
import events from "@/content/events";
import GccCat from "@/app/landing/GccCat";
import "./events-list.css";

export default function EventsList({ items = events, emptyHeadingLevel = 3 }) {
  if (items.length === 0) {
    const EmptyHeading = emptyHeadingLevel === 2 ? "h2" : "h3";

    return (
      <div className="events-empty-state">
        <div className="events-empty-timeline" aria-hidden="true">
          <span>{"// empty"}</span>
          <span>{"// empty"}</span>
          <span>{"// empty"}</span>
        </div>
        <div className="events-empty-illustration" aria-hidden="true">
          <span className="events-empty-moon" />
          <GccCat sleeping />
        </div>
        <EmptyHeading>No events on this branch yet.</EmptyHeading>
        <p className="events-empty-command">git pull soon.</p>
      </div>
    );
  }

  return (
    <div className="events-grid">
      {items.map((event) => (
        <article className="event-item" key={event.title}>
          <div className="event-mascot"><GccCat accessory={event.mascot} /></div>
          <span className={`event-marker ${event.state === "open" ? "open" : "warning"}`} aria-hidden="true" />
          <span className="event-connector" aria-hidden="true" />
          <div className="event-card">
            <div className="event-card-top">
              <span className="event-date"><small>{event.month}</small><strong>{event.day}</strong></span>
              <span className={`event-state ${event.state === "almost full" ? "warning" : ""}`}>{event.state}</span>
            </div>
            <h3>{event.title}</h3>
            <p><MapPin size={13} aria-hidden="true" /><span>{event.place}</span></p>
            <p><Clock3 size={13} aria-hidden="true" /><span>{event.time}</span></p>
            <Link className="event-rsvp" href="/events" aria-label={`RSVP for ${event.title}`}>RSVP</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
