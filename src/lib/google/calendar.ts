import "server-only";

const EVENTS_BASE = "https://www.googleapis.com/calendar/v3/calendars";
const EVENT_DURATION_MS = 30 * 60 * 1000;

export interface CalendarEventInput {
  title: string;
  description?: string | null;
  /** ISO 8601 timestamp, ideally with an explicit UTC offset. */
  dueAtIso: string;
}

function eventsUrl(calendarId: string, eventId?: string) {
  const base = `${EVENTS_BASE}/${encodeURIComponent(calendarId)}/events`;
  return eventId ? `${base}/${encodeURIComponent(eventId)}` : base;
}

function eventBody(input: CalendarEventInput) {
  const end = new Date(
    new Date(input.dueAtIso).getTime() + EVENT_DURATION_MS
  ).toISOString();

  return {
    summary: input.title,
    description: input.description ?? undefined,
    start: { dateTime: input.dueAtIso },
    end: { dateTime: end },
  };
}

export async function createCalendarEvent(
  accessToken: string,
  calendarId: string,
  input: CalendarEventInput
): Promise<string> {
  const res = await fetch(eventsUrl(calendarId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventBody(input)),
  });

  if (!res.ok) {
    throw new Error(`Failed to create calendar event (${res.status})`);
  }
  const data = await res.json();
  return data.id as string;
}

export async function updateCalendarEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  input: CalendarEventInput
): Promise<void> {
  const res = await fetch(eventsUrl(calendarId, eventId), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventBody(input)),
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to update calendar event (${res.status})`);
  }
}

export async function deleteCalendarEvent(
  accessToken: string,
  calendarId: string,
  eventId: string
): Promise<void> {
  const res = await fetch(eventsUrl(calendarId, eventId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // 404/410 just means the event is already gone — treat as success.
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Failed to delete calendar event (${res.status})`);
  }
}
