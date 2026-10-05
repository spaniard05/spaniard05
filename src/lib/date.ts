// Shared date helpers. The app has a single user and no timezone picker yet,
// so "today" is the server's local day boundaries.

export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfTodayIso(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

export function endOfTodayIso(): string {
  const now = new Date();
  now.setHours(24, 0, 0, 0);
  return now.toISOString();
}

export function daysFromNowIso(days: number): string {
  const future = new Date();
  future.setDate(future.getDate() + days);
  future.setHours(23, 59, 59, 999);
  return future.toISOString();
}

export function formatDueDate(iso: string | null): string {
  if (!iso) return "No due date";
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;
  if (diffDays === -1) return `Yesterday, ${time}`;

  const dateLabel = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return `${dateLabel}, ${time}`;
}

export function isOverdue(iso: string | null): boolean {
  if (!iso) return false;
  return Date.parse(iso) < Date.now();
}
