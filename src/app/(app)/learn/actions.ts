"use server";

import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import { createLearnItem, updateLearnItemStatus } from "@/lib/data/learn-items";
import { parseOptionalText, requireText } from "@/lib/forms";
import type { LearnStatus } from "@/lib/supabase/types";
import type { FormState } from "@/components/ui/action-form";

export async function addLearnItemAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const title = requireText(formData.get("title"));

    await createLearnItem(supabase, user.id, {
      title,
      resource_url: parseOptionalText(formData.get("resourceUrl")),
      notes: parseOptionalText(formData.get("notes")),
    });

    revalidatePath("/learn");
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that." };
  }
}

export async function setLearnItemStatus(id: string, status: LearnStatus) {
  const { supabase } = await requireUserAndClient();
  await updateLearnItemStatus(supabase, id, status);
  revalidatePath("/learn");
}
