-- Personal assistant app: initial schema
-- All tables are owned by a single authenticated user (auth.users) and are
-- protected by row-level security so a row is only readable/writable by its
-- owner (auth.uid() = user_id).

create extension if not exists "pgcrypto";

-- =========================================================================
-- meals
-- =========================================================================
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null,
  calories integer,
  protein numeric,
  carbs numeric,
  fat numeric,
  eaten_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists meals_user_id_eaten_at_idx
  on public.meals (user_id, eaten_at desc);

alter table public.meals enable row level security;

create policy "meals_select_own" on public.meals
  for select using (auth.uid() = user_id);
create policy "meals_insert_own" on public.meals
  for insert with check (auth.uid() = user_id);
create policy "meals_update_own" on public.meals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals_delete_own" on public.meals
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- workouts
-- =========================================================================
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  title text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists workouts_user_id_date_idx
  on public.workouts (user_id, date desc);

alter table public.workouts enable row level security;

create policy "workouts_select_own" on public.workouts
  for select using (auth.uid() = user_id);
create policy "workouts_insert_own" on public.workouts
  for insert with check (auth.uid() = user_id);
create policy "workouts_update_own" on public.workouts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_delete_own" on public.workouts
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- workout_sets
-- =========================================================================
create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workout_id uuid not null references public.workouts (id) on delete cascade,
  exercise text not null,
  reps integer,
  weight numeric,
  set_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists workout_sets_workout_id_set_order_idx
  on public.workout_sets (workout_id, set_order);

alter table public.workout_sets enable row level security;

create policy "workout_sets_select_own" on public.workout_sets
  for select using (auth.uid() = user_id);
create policy "workout_sets_insert_own" on public.workout_sets
  for insert with check (auth.uid() = user_id);
create policy "workout_sets_update_own" on public.workout_sets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_sets_delete_own" on public.workout_sets
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- courses
-- =========================================================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  code text,
  semester text,
  created_at timestamptz not null default now()
);

create index if not exists courses_user_id_idx on public.courses (user_id);

alter table public.courses enable row level security;

create policy "courses_select_own" on public.courses
  for select using (auth.uid() = user_id);
create policy "courses_insert_own" on public.courses
  for insert with check (auth.uid() = user_id);
create policy "courses_update_own" on public.courses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "courses_delete_own" on public.courses
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- assignments
-- =========================================================================
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  due_at timestamptz,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists assignments_user_id_due_at_idx
  on public.assignments (user_id, due_at);
create index if not exists assignments_course_id_idx
  on public.assignments (course_id);

alter table public.assignments enable row level security;

create policy "assignments_select_own" on public.assignments
  for select using (auth.uid() = user_id);
create policy "assignments_insert_own" on public.assignments
  for insert with check (auth.uid() = user_id);
create policy "assignments_update_own" on public.assignments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assignments_delete_own" on public.assignments
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- tasks
-- =========================================================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  due_at timestamptz,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  recurring text,
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_id_due_at_idx
  on public.tasks (user_id, due_at);

alter table public.tasks enable row level security;

create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- learn_items
-- =========================================================================
create table if not exists public.learn_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  status text not null default 'someday'
    check (status in ('someday', 'in_progress', 'done')),
  resource_url text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists learn_items_user_id_idx on public.learn_items (user_id);

alter table public.learn_items enable row level security;

create policy "learn_items_select_own" on public.learn_items
  for select using (auth.uid() = user_id);
create policy "learn_items_insert_own" on public.learn_items
  for insert with check (auth.uid() = user_id);
create policy "learn_items_update_own" on public.learn_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "learn_items_delete_own" on public.learn_items
  for delete using (auth.uid() = user_id);
