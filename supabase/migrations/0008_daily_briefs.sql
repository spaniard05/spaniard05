-- Caches one AI-generated recommendations brief per user per day, so Today
-- only calls the AI once per day rather than on every page load.
create table if not exists public.daily_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  brief_date date not null,
  content text not null,
  created_at timestamptz not null default now(),
  unique (user_id, brief_date)
);

alter table public.daily_briefs enable row level security;

create policy "daily_briefs_select_own" on public.daily_briefs
  for select using (auth.uid() = user_id);
create policy "daily_briefs_insert_own" on public.daily_briefs
  for insert with check (auth.uid() = user_id);
create policy "daily_briefs_update_own" on public.daily_briefs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_briefs_delete_own" on public.daily_briefs
  for delete using (auth.uid() = user_id);
