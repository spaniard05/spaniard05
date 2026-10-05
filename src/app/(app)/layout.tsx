import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { listCourses } from "@/lib/data/courses";
import { SideBar } from "@/components/nav/side-bar";
import { TopBar } from "@/components/nav/top-bar";
import { BottomTabBar } from "@/components/nav/bottom-tab-bar";
import { QuickAddBar } from "@/components/quick-add/quick-add-bar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const courses = user ? await listCourses(supabase) : [];

  return (
    <div className="min-h-dvh bg-slate-50">
      <SideBar userEmail={user?.email} />

      <div className="flex min-h-dvh flex-col md:pl-64">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-4 pb-4">
          <div className="mx-auto w-full max-w-2xl">{children}</div>
        </main>

        <div className="sticky bottom-0 z-20 pb-safe">
          <QuickAddBar courses={courses.map((c) => ({ id: c.id, name: c.name }))} />
          <BottomTabBar />
        </div>
      </div>
    </div>
  );
}
