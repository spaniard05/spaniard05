# Assistant

A single-user, mobile-first personal assistant PWA: Today, Health, School,
Tasks, and Learn. This phase is structure, auth, data, and manual entry —
no AI features yet.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript) + Tailwind CSS
- [Supabase](https://supabase.com) (Postgres + email auth, row-level security)
- [Vercel](https://vercel.com) for deployment

## 1. Create the Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create
   a new project (any region/plan works).
2. Wait for provisioning to finish, then open **Project Settings → API**.
   You'll need two values from this page in step 3:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon / public** key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Open **Authentication → Providers → Email** and make sure **Email**
   sign-in is enabled (it is by default). This app uses magic-link
   (passwordless) sign-in, so no further provider setup is needed.
4. Open **Authentication → URL Configuration** and set:
   - **Site URL**: `http://localhost:3000` for local dev (change to your
     production URL after deploying — see step 6).
   - **Redirect URLs**: add `http://localhost:3000/auth/callback` (and
     later your production `https://<your-app>.vercel.app/auth/callback`).

## 2. Run the migrations

The schema lives in `supabase/migrations/`. Apply it with either method:

**Option A — SQL Editor (no CLI needed)**

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste the contents of `supabase/migrations/0001_init.sql` and run it.

**Option B — Supabase CLI**

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

Either way, this creates `meals`, `workouts`, `workout_sets`, `courses`,
`assignments`, `tasks`, and `learn_items`, each with row-level security
policies scoping every row to its owner (`auth.uid() = user_id`).

## 3. Set environment variables

Copy the example file and fill in the values from step 1:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`NEXT_PUBLIC_*` variables are safe to expose to the browser (RLS is what
actually protects your data). `SUPABASE_SERVICE_ROLE_KEY` in
`.env.example` is only a placeholder for future server-only scripts — the
app itself never needs it, and it must never be prefixed with
`NEXT_PUBLIC_` or imported into client code.

## 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected
to `/sign-in`; enter your email and follow the magic link sent to your
inbox (check spam if it doesn't arrive within a minute).

Other scripts:

```bash
npm run build       # production build
npm run start        # run the production build
npm run lint          # next lint
npm run typecheck   # tsc --noEmit
```

## 5. Install as a PWA

On a phone, open the deployed (or local, over HTTPS/`localhost`) URL in
Safari or Chrome and use **Add to Home Screen**. The app installs with its
own icon and opens full-screen (`display: standalone`), via
`src/app/manifest.ts` and the icons in `public/icons/`.

## 6. Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In [Vercel](https://vercel.com/new), import the repository.
3. Add the two environment variables from step 3
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in
   **Project Settings → Environment Variables**.
4. Deploy.
5. Back in Supabase **Authentication → URL Configuration**, update **Site
   URL** to your Vercel URL and add
   `https://<your-app>.vercel.app/auth/callback` to **Redirect URLs** (you
   can keep the localhost ones too, for local dev).

## Project structure

See `CLAUDE.md` for a full architecture walkthrough (folder layout, data
layer, form/action conventions, the quick-add router, and auth). In short:

- `src/app/(app)/<screen>/` — one folder per tab (`today`, `health`,
  `school`, `tasks`, `learn`), each with a server-rendered `page.tsx`,
  `actions.ts` server actions, and small form/list components.
- `src/lib/data/` — typed Supabase queries and mutations, the only code
  that talks to the database.
- `src/lib/quick-add/` — the quick-add router, structured so a later phase
  can swap the manual destination picker for an AI classifier.
- `supabase/migrations/` — plain SQL, one file per schema change.

## Notes on this phase

- No AI/LLM features yet by design — quick-add uses a manual picker, not a
  classifier. See `src/lib/quick-add/router.ts` for how that's meant to
  evolve.
- Every route under `(app)` requires a signed-in session (enforced in
  `src/proxy.ts`); RLS is the independent second line of defense in
  Postgres itself.
