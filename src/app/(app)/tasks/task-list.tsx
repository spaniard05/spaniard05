import type { Task } from "@/lib/data/tasks";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskRow } from "./task-row";

export function TaskList({
  tasks,
  archived = false,
  emptyMessage = "No tasks yet.",
}: {
  tasks: Task[];
  archived?: boolean;
  emptyMessage?: string;
}) {
  if (tasks.length === 0) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <ul className="space-y-1.5">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} archived={archived} />
      ))}
    </ul>
  );
}
