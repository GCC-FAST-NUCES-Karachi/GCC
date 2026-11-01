// Shared event-date rules for the landing list, /events, and the terminal.
// An event counts as upcoming until it ends (or until it starts, if it has no end time).

const endTime = (event) => new Date(event.endAt ?? event.startAt).getTime();
const byStart = (a, b) => new Date(a.startAt) - new Date(b.startAt);

export function getUpcomingEvents(items, now = Date.now()) {
  return items.filter((event) => endTime(event) >= now).sort(byStart);
}

export function getPastEvents(items, now = Date.now()) {
  return items.filter((event) => endTime(event) < now).sort((a, b) => byStart(b, a));
}
