import { createClient } from "@/lib/supabase/server";
import { getGoogleCalendarConnection } from "@/lib/data/google-calendar";
import { disconnectGoogleCalendar, importGoogleTasks } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    googleConnected?: string;
    googleError?: string;
    tasksImported?: string;
    tasksImportError?: string;
  }>;
}) {
  const { googleConnected, googleError, tasksImported, tasksImportError } =
    await searchParams;
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
      {tasksImported && (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          Imported {tasksImported} task{tasksImported === "1" ? "" : "s"} from
          Google Tasks.
        </p>
      )}
      {tasksImportError && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn&apos;t import Google Tasks. Try again.
        </p>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Google Calendar &amp; Tasks</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tasks and assignments with a due date sync to your Google Calendar
          automatically — update or complete them here and the event follows.
        </p>

        {connection ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <form action={importGoogleTasks}>
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white"
              >
                Import from Google Tasks
              </button>
            </form>
            <form action={disconnectGoogleCalendar}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Disconnect
              </button>
            </form>
          </div>
        ) : (
          <a
            href="/auth/google/start"
            className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white"
          >
            Connect Google
          </a>
        )}
      </section>
    </div>
  );
}
