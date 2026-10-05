-- Google Calendar two-way sync: stores this user's OAuth tokens (never
-- exposed to the client — only read/written from server actions) and links
-- tasks/assignments to the calendar event created for them.

create table if not exists public.google_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  calendar_id text not null default 'primary',
  created_at timestamptz not null default now()
);

alter table public.google_calendar_connections enable row level security;

create policy "google_calendar_connections_select_own"
  on public.google_calendar_connections
  for select using (auth.uid() = user_id);
create policy "google_calendar_connections_insert_own"
  on public.google_calendar_connections
  for insert with check (auth.uid() = user_id);
create policy "google_calendar_connections_update_own"
  on public.google_calendar_connections
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "google_calendar_connections_delete_own"
  on public.google_calendar_connections
  for delete using (auth.uid() = user_id);

alter table public.tasks
  add column if not exists google_event_id text;

alter table public.assignments
  add column if not exists google_event_id text;
