-- Tracks whether a meal's macros were filled in by hand or estimated by AI,
-- so the UI can label estimated values and the user knows to double check them.
alter table public.meals
  add column if not exists macros_estimated boolean not null default false;
