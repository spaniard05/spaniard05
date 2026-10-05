-- Optional free-text notes on tasks, matching the pattern already used by
-- assignments and learn_items.
alter table public.tasks
  add column if not exists notes text;
