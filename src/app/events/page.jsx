import EventsList from "@/components/events/EventsList";
import "./events.css";

export const metadata = {
  title: "Upcoming Events",
  description: "Upcoming GitHub Campus Club events at FAST-NUCES.",
};

export default function EventsPage() {
  return (
    <main id="main-content" className="events-page">
      <header className="events-page-heading">
        <h1>Upcoming Events</h1>
        <p>{"// git fetch origin --events"}</p>
      </header>

      <EventsList emptyHeadingLevel={2} />
    </main>
  );
}
