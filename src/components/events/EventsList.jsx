import { Clock3, MapPin } from "lucide-react";
import events, { pastEvents as highlightedPastEvents } from "@/content/events";
import GccCat from "@/app/landing/GccCat";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import EventStatus from "./EventStatus";
import PastEventCard from "./PastEventCard";
import "./events-list.css";

const plannedSlots = [
  {
    title: "The next build is compiling",
    description: "We’re shaping a hands-on session. Your next favorite project could start with one good question.",
    marker: "// next-build",
    footnote: "STATUS: SCOPING",
  },
  {
    title: "Something’s gathering",
    description: "New people. Big ideas. One room. We’re putting the next club meetup together.",
    marker: "// community-signal",
    footnote: "DATE: NOT COMMITTED",
  },
  {
    title: "Signal pending",
    description: "A new idea is taking shape. Details will land here when they’re ready.",
    marker: "// signal-pending",
    footnote: "STATUS: UNCONFIRMED",
  },
];

export default function EventsList({ items = events, emptyHeadingLevel = 3, showArchive = false }) {
  // Server component: the page is rebuilt hourly, so events are bucketed at build time.
  const upcomingEvents = getUpcomingEvents(items).slice(0, 3);

  if (showArchive) {
    const pastEvents = getPastEvents(items);
    const planned = plannedSlots.slice(0, Math.max(0, 3 - upcomingEvents.length));

    return (
      <div className="events-sections">
        <section className="events-section" aria-labelledby="upcoming-events-heading">
          <div className="events-section-heading">
            <h2 id="upcoming-events-heading">Upcoming</h2>
            <span>{formatEventCount(upcomingEvents.length)}</span>
          </div>
          {upcomingEvents.length > 0 || planned.length > 0 ? (
            <div className="events-grid">
              {upcomingEvents.map((event) => <EventCard key={event.title} event={event} />)}
              {planned.map((slot) => <PlannedEventCard key={slot.title} slot={slot} />)}
            </div>
          ) : (
            <p className="events-section-empty">No upcoming events just yet. Check back soon.</p>
          )}
        </section>

        <section className="events-section events-archive" aria-labelledby="past-events-heading">
          <div className="events-section-heading">
            <h2 id="past-events-heading">Past events</h2>
            <span>{formatEventCount(pastEvents.length + highlightedPastEvents.length)}</span>
          </div>
          {pastEvents.length > 0 || highlightedPastEvents.length > 0 ? (
            <div className="events-grid">
              {pastEvents.map((event) => <PastEventCard key={event.title} event={event} />)}
              {highlightedPastEvents.map((event) => <PastEventCard key={event.title} event={event} />)}
            </div>
          ) : (
            <p className="events-section-empty">The archive will grow as we make more things together.</p>
          )}
        </section>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
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

  const placeholders = plannedSlots.slice(0, Math.max(0, 3 - upcomingEvents.length));

  return (
    <>
      <div className="events-grid">
        {upcomingEvents.map((event) => <EventCard key={event.title} event={event} />)}
        {placeholders.map((slot) => <PlannedEventCard key={slot.title} slot={slot} />)}
      </div>
      <p className="events-planning-note">New events will appear here as dates and venues are confirmed.</p>
    </>
  );
}

function formatEventCount(count) {
  return `${count.toString().padStart(2, "0")} ${count === 1 ? "EVENT" : "EVENTS"}`;
}

function EventCard({ event }) {
  return (
    <article className="event-item">
      <div className="event-mascot"><GccCat accessory={event.mascot} /></div>
      <span className="event-marker open" aria-hidden="true" />
      <span className="event-connector" aria-hidden="true" />
      <div className="event-card">
        <div className="event-card-top">
          <span className="event-date"><small>{event.month}</small><strong>{event.day}</strong><small>{event.year}</small></span>
          <EventStatus startAt={event.startAt} endAt={event.endAt} />
        </div>
        <h3>{event.title}</h3>
        <p><MapPin size={13} aria-hidden="true" /><span>{event.place}</span></p>
        <p><Clock3 size={13} aria-hidden="true" /><span>{event.time}</span></p>
        {event.summary && <p className="event-summary">{event.summary}</p>}
      </div>
    </article>
  );
}

function PlannedEventCard({ slot }) {
  return (
    <article className="event-item event-item-planned">
      <div className="event-mascot"><GccCat sleeping /></div>
      <span className="event-marker" aria-hidden="true" />
      <span className="event-connector" aria-hidden="true" />
      <div className="event-card event-card-planned">
        <div className="event-card-top">
          <span className="event-planned-icon" aria-hidden="true">{slot.marker}</span>
          <span className="event-state planned">In the works</span>
        </div>
        <h3>{slot.title}</h3>
        <p className="event-placeholder-copy">{slot.description}</p>
        <p className="event-placeholder-footnote">{slot.footnote}</p>
      </div>
    </article>
  );
}
