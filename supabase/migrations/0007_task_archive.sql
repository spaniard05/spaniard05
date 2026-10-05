-- Lets a task be hidden from the main list without completing or deleting
-- it (set when hidden, cleared to unhide).
alter table public.tasks
  add column if not exists archived_at timestamptz;
