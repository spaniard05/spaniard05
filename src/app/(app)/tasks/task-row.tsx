"use client";

import { useTransition } from "react";
import { CompleteCheckbox } from "@/components/ui/complete-checkbox";
import { EyeOffIcon, TrashIcon } from "@/components/nav/icons";
import { formatDueDate, isOverdue } from "@/lib/date";
import { setTaskStatus, setTaskArchivedAction, deleteTaskAction } from "./actions";
import type { Task } from "@/lib/data/tasks";

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

export function TaskRow({
  task,
  archived = false,
}: {
  task: Task;
  archived?: boolean;
}) {
  const done = task.status === "done";
  const overdue = !done && isOverdue(task.due_at);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) {
      return;
    }
    startTransition(() => deleteTaskAction(task.id));
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <CompleteCheckbox
          checked={done}
          onToggle={() => setTaskStatus(task.id, done ? "todo" : "done")}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`truncate font-medium ${
              done ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {task.title}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
            {task.due_at && (
              <span className={`text-xs ${overdue ? "text-red-600" : "text-slate-400"}`}>
                {formatDueDate(task.due_at)}
              </span>
            )}
            {task.recurring && (
              <span className="text-xs text-slate-400">· {task.recurring}</span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={isPending}
            aria-label={archived ? "Unhide task" : "Hide task"}
            onClick={() =>
              startTransition(() => setTaskArchivedAction(task.id, !archived))
            }
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 disabled:opacity-50 active:bg-slate-100"
          >
            <EyeOffIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={isPending}
            aria-label="Delete task"
            onClick={handleDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 disabled:opacity-50 active:bg-red-50 active:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {task.notes && (
        <details className="mt-2 pl-10">
          <summary className="cursor-pointer text-xs font-medium text-slate-500">
            Notes
          </summary>
          <p className="mt-1 whitespace-pre-wrap text-xs text-slate-600">
            {task.notes}
          </p>
        </details>
      )}
    </li>
  );
}
