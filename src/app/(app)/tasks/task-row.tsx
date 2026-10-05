"use client";

import { CompleteCheckbox } from "@/components/ui/complete-checkbox";
import { formatDueDate, isOverdue } from "@/lib/date";
import { setTaskStatus } from "./actions";
import type { Task } from "@/lib/data/tasks";

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

export function TaskRow({ task }: { task: Task }) {
  const done = task.status === "done";
  const overdue = !done && isOverdue(task.due_at);

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
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
    </li>
  );
}
