-- Lets the tasks table also hold grocery list and personal-wishlist items,
-- shown as separate sections on the Tasks screen but sharing the same
-- add/complete/hide/delete machinery.
alter table public.tasks
  add column if not exists list text not null default 'tasks'
    check (list in ('tasks', 'groceries', 'shopping'));
