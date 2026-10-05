-- Tracks which Google Task a locally-imported task came from, so re-running
-- the import is safe (no duplicates).
alter table public.tasks
  add column if not exists google_task_id text;

create unique index if not exists tasks_google_task_id_unique
  on public.tasks (user_id, google_task_id)
  where google_task_id is not null;
