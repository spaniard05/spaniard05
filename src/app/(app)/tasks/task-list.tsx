import type { Task } from "@/lib/data/tasks";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskRow } from "./task-row";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <EmptyState>No tasks yet.</EmptyState>;
  }

  return (
    <ul className="space-y-1.5">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </ul>
  );
}
