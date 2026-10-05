"use server";

import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import { deleteGoogleCalendarConnection } from "@/lib/data/google-calendar";

export async function disconnectGoogleCalendar() {
  const { user, supabase } = await requireUserAndClient();
  await deleteGoogleCalendarConnection(supabase, user.id);
  revalidatePath("/settings");
}
