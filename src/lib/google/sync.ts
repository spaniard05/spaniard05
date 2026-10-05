import "server-only";
import type { TypedSupabaseClient } from "@/lib/data/client";
import type { Task } from "@/lib/data/tasks";
import { setTaskGoogleEventId } from "@/lib/data/tasks";
import type { Assignment } from "@/lib/data/assignments";
import { setAssignmentGoogleEventId } from "@/lib/data/assignments";
import { getValidGoogleAccessToken } from "./client";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
} from "./calendar";

/**
 * Keeps one task's Google Calendar event in sync with its current state.
 * Best-effort: calendar sync must never block saving the task itself, so
 * every failure (not connected, API error, token issue) is swallowed.
 */
export async function syncTaskToCalendar(
  supabase: TypedSupabaseClient,
  userId: string,
  task: Task
): Promise<void> {
  try {
    const conn = await getValidGoogleAccessToken(supabase, userId);
    if (!conn) return;

    const shouldHaveEvent = task.due_at != null && task.status !== "done";

    if (!shouldHaveEvent) {
      if (task.google_event_id) {
        await deleteCalendarEvent(
          conn.accessToken,
          conn.calendarId,
          task.google_event_id
        );
        await setTaskGoogleEventId(supabase, task.id, null);
      }
      return;
    }

    const input = {
      title: task.title,
      description: task.notes,
      dueAtIso: task.due_at as string,
    };

    if (task.google_event_id) {
      await updateCalendarEvent(
        conn.accessToken,
        conn.calendarId,
        task.google_event_id,
        input
      );
    } else {
      const eventId = await createCalendarEvent(
        conn.accessToken,
        conn.calendarId,
        input
      );
      await setTaskGoogleEventId(supabase, task.id, eventId);
    }
  } catch {
    // Best-effort sync — nothing to surface to the user here.
  }
}

/** Same as syncTaskToCalendar, for assignments. */
export async function syncAssignmentToCalendar(
  supabase: TypedSupabaseClient,
  userId: string,
  assignment: Assignment
): Promise<void> {
  try {
    const conn = await getValidGoogleAccessToken(supabase, userId);
    if (!conn) return;

    const shouldHaveEvent =
      assignment.due_at != null && assignment.status !== "done";

    if (!shouldHaveEvent) {
      if (assignment.google_event_id) {
        await deleteCalendarEvent(
          conn.accessToken,
          conn.calendarId,
          assignment.google_event_id
        );
        await setAssignmentGoogleEventId(supabase, assignment.id, null);
      }
      return;
    }

    const input = {
      title: assignment.title,
      description: assignment.notes,
      dueAtIso: assignment.due_at as string,
    };

    if (assignment.google_event_id) {
      await updateCalendarEvent(
        conn.accessToken,
        conn.calendarId,
        assignment.google_event_id,
        input
      );
    } else {
      const eventId = await createCalendarEvent(
        conn.accessToken,
        conn.calendarId,
        input
      );
      await setAssignmentGoogleEventId(supabase, assignment.id, eventId);
    }
  } catch {
    // Best-effort sync — nothing to surface to the user here.
  }
}
