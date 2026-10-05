@AGENTS.md

# Assistant — architecture & conventions

A single-user, mobile-first PWA for personal organization (health, school,
tasks, learning). Phase 1 is structure, auth, data, and manual entry only —
**no AI/LLM features yet**. Keep that boundary until a later phase explicitly
asks for it.

## Stack

- Next.js App Router + TypeScript, Tailwind CSS
- Supabase (Postgres + email auth), row-level security on every table
- Deploy target: Vercel

## Folder structure

```
src/
  app/
    sign-in/              public, magic-link sign-in form
    auth/callback/        exchanges the emailed code for a session
    (app)/                everything behind auth; layout.tsx renders the
                           nav shell (SideBar / TopBar / BottomTabBar) and
                           the quick-add bar around {children}
      today/ health/ school/ tasks/ learn/
        page.tsx           server component: fetch + render
        actions.ts          "use server" mutations for that screen
        *-form.tsx          client component wrapping <ActionForm>
        *-list.tsx/*-row.tsx  presentational, read data-layer types
    manifest.ts, icon.png, apple-icon.png   PWA file conventions
  components/
    nav/        sidebar, top bar, bottom tabs, shared nav icons
    quick-add/  the persistent quick-add bar
    ui/         ActionForm, CompleteCheckbox, EmptyState, Section — shared
                across every screen, kept dumb/presentational
  lib/
    supabase/   client.ts (browser), server.ts (Server Components/Actions),
                proxy.ts (session refresh + route protection), types.ts
                (hand-written Database type mirroring the migrations)
    data/       one file per table: typed query + mutation functions that
                take a Supabase client as their first argument. This is the
                *only* place that calls `.from(table)` — pages and actions
                never touch Supabase directly.
    quick-add/  router.ts + action.ts (see below)
    auth/       session.ts (getCurrentUser / requireUserAndClient),
                actions.ts (signOut)
    date.ts, forms.ts   small shared helpers (date formatting, FormData
                parsing)
proxy.ts         route-protection + session refresh (see "Proxy" below)
supabase/migrations/   one file per logical change, plain SQL
```

### Why a separate data layer

`src/lib/data/*` is server-side data access, decoupled from UI. Pages
(Server Components) call these functions directly; `actions.ts` files call
them from Server Actions after validating `FormData`. Nothing under
`src/components` imports Supabase — components receive plain typed data as
props. This keeps RLS/queries in one place and UI purely presentational.

### Forms and mutations

Every add/edit form follows the same shape:

1. A `"use server"` function in the screen's `actions.ts`, typed as
   `(prevState: FormState, formData: FormData) => Promise<FormState>`,
   that resolves the user via `requireUserAndClient()`, parses `FormData`
   with the helpers in `lib/forms.ts`, calls one `lib/data/*` function, and
   `revalidatePath(...)` the affected screens (always including `/today`,
   which aggregates everything).
2. A client component rendering `<ActionForm action={...}>` (see
   `components/ui/action-form.tsx`), which wires `useActionState`, shows the
   returned error, and resets the form on success.

Toggling a status (assignment/task done, learn item status) is a small
server action bound to an id (e.g. `setTaskStatus.bind(null, id, status)`)
passed into a client `<CompleteCheckbox>`/`<select>`, wrapped in
`useTransition` rather than a full form.

### Quick-add → later AI router

`src/lib/quick-add/router.ts` exports `executeQuickAdd(supabase, userId,
destination, context)`, which maps one piece of free text to an insert in
the right table. Today, `destination` is chosen by the user via a picker in
`QuickAddBar`. When the AI-router phase lands, only the *source* of
`destination` (and any richer parsed fields) changes — a classifier decides
it instead of a `<select>` — `executeQuickAdd` and everything downstream of
it stays the same. Don't add AI/LLM calls here until that phase.

### Auth & proxy

Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (same
mechanics, renamed export). `src/proxy.ts` calls
`lib/supabase/proxy.ts#updateSession`, which refreshes the Supabase session
cookie on every request and redirects unauthenticated requests to
`/sign-in` (public paths: `/sign-in`, `/auth/callback`). Every route under
`(app)` is therefore guaranteed a session by the time it renders; data-layer
RLS is the second, independent line of defense (never trust the client).

Sign-in is passwordless (Supabase magic link / OTP) since this is a
single-user app — no password reset flow to maintain.

### Database types

`src/lib/supabase/types.ts` is a hand-written `Database` type mirroring
`supabase/migrations/0001_init.sql`. If you change the schema, update this
file in the same commit (or regenerate with `supabase gen types
typescript` once the Supabase CLI is wired up). Each table needs
`Row`/`Insert`/`Update`/`Relationships`, and the schema needs
`Views`/`Functions` keys — the generic Supabase client types resolve to
`never` if these are missing.

## Conventions

- Mobile-first Tailwind; the brand color scale lives in
  `tailwind.config.ts` (`brand-*`).
- Server Components fetch data; Client Components are only used where
  interactivity is required (forms, toggles, nav active-state).
- Don't add new tables/columns beyond what a feature needs — keep schema
  changes scoped to one migration file per change, forward-only (no
  editing already-applied migrations).
- No AI/LLM calls anywhere in this codebase yet.
