import "server-only";

const TASKS_BASE = "https://tasks.googleapis.com/tasks/v1";

export interface GoogleTaskList {
  id: string;
  title: string;
}

export interface GoogleTaskItem {
  id: string;
  title?: string;
  notes?: string;
  /** Date-only, encoded as RFC3339 midnight UTC (e.g. 2027-03-01T00:00:00.000Z). */
  due?: string;
  status: "needsAction" | "completed";
}

export async function listGoogleTaskLists(
  accessToken: string
): Promise<GoogleTaskList[]> {
  const res = await fetch(`${TASKS_BASE}/users/@me/lists`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to list Google task lists (${res.status})`);
  }
  const data = await res.json();
  return data.items ?? [];
}

export async function listGoogleTasks(
  accessToken: string,
  taskListId: string
): Promise<GoogleTaskItem[]> {
  const url = new URL(
    `${TASKS_BASE}/lists/${encodeURIComponent(taskListId)}/tasks`
  );
  url.searchParams.set("showCompleted", "false");
  url.searchParams.set("showHidden", "false");
  url.searchParams.set("maxResults", "100");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to list Google tasks (${res.status})`);
  }
  const data = await res.json();
  return data.items ?? [];
}
