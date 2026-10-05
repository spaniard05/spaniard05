import { createClient } from "@/lib/supabase/server";
import { getGoogleCalendarConnection } from "@/lib/data/google-calendar";
import { disconnectGoogleCalendar } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ googleConnected?: string; googleError?: string }>;
}) {
  const { googleConnected, googleError } = await searchParams;
  const supabase = await createClient();
  const connection = await getGoogleCalendarConnection(supabase);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Settings</h1>

      {googleConnected && (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          Google Calendar connected.
        </p>
      )}
      {googleError && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn&apos;t connect Google Calendar. Try again.
        </p>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Google Calendar</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tasks and assignments with a due date sync to your Google Calendar
          automatically — update or complete them here and the event follows.
        </p>

        {connection ? (
          <form action={disconnectGoogleCalendar} className="mt-3">
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Disconnect
            </button>
          </form>
        ) : (
          <a
            href="/auth/google/start"
            className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white"
          >
            Connect Google Calendar
          </a>
        )}
      </section>
    </div>
  );
}
