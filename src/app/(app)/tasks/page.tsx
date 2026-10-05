import { createClient } from "@/lib/supabase/server";
import { listArchivedTasks, listTasks } from "@/lib/data/tasks";
import { Section } from "@/components/ui/section";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";

export default async function TasksPage() {
  const supabase = await createClient();
  const [tasks, archivedTasks] = await Promise.all([
    listTasks(supabase),
    listArchivedTasks(supabase),
  ]);
  const open = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Tasks</h1>

      <Section title="Add a task">
        <TaskForm />
      </Section>

      <Section title="Open">
        <TaskList tasks={open} />
      </Section>

      {done.length > 0 && (
        <Section title="Done">
          <TaskList tasks={done} />
        </Section>
      )}

      {archivedTasks.length > 0 && (
        <details className="mb-6">
          <summary className="mb-2 cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-500">
            Hidden ({archivedTasks.length})
          </summary>
          <TaskList tasks={archivedTasks} archived />
        </details>
      )}
    </div>
  );
}
