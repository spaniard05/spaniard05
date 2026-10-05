"use client";

import { CompleteCheckbox } from "@/components/ui/complete-checkbox";
import { formatDueDate, isOverdue } from "@/lib/date";
import { setAssignmentStatus } from "./actions";
import type { AssignmentWithCourse } from "@/lib/data/assignments";

export function AssignmentRow({
  assignment,
}: {
  assignment: AssignmentWithCourse;
}) {
  const done = assignment.status === "done";
  const overdue = !done && isOverdue(assignment.due_at);

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <CompleteCheckbox
        checked={done}
        onToggle={() =>
          setAssignmentStatus(assignment.id, done ? "todo" : "done")
        }
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-medium ${
            done ? "text-slate-400 line-through" : "text-slate-900"
          }`}
        >
          {assignment.title}
        </p>
        <p className={`text-xs ${overdue ? "text-red-600" : "text-slate-400"}`}>
          {formatDueDate(assignment.due_at)}
        </p>
      </div>
    </li>
  );
}
