-- Per-set notes (e.g. "drop set", "new peak", grip/cue reminders) — the
-- original workout_sets schema only had workout-level notes.
alter table public.workout_sets
  add column if not exists notes text;
