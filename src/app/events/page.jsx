import EventsList from "@/components/events/EventsList";
import "./events.css";

// Rebuild hourly so events move from Upcoming to Past once they end, without
// rendering on every request.
export const revalidate = 3600;

export const metadata = {
  title: "Events",
  description: "Upcoming and past GitHub Campus Club events at FAST-NUCES.",
};

export default function EventsPage() {
  return (
    <main id="main-content" className="events-page">
      <header className="events-page-heading">
        <h1>Events</h1>
        <p>{"// git fetch origin --events"}</p>
      </header>

      <EventsList emptyHeadingLevel={2} showArchive />
    </main>
  );
}
