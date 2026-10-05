"use server";

import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import { createCourse } from "@/lib/data/courses";
import { createAssignment, updateAssignmentStatus } from "@/lib/data/assignments";
import { parseOptionalIso, parseOptionalText, requireText } from "@/lib/forms";
import type { AssignmentStatus } from "@/lib/supabase/types";
import type { FormState } from "@/components/ui/action-form";

function revalidateSchool() {
  revalidatePath("/school");
  revalidatePath("/today");
}

export async function addCourseAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const name = requireText(formData.get("name"));

    await createCourse(supabase, user.id, {
      name,
      code: parseOptionalText(formData.get("code")),
      semester: parseOptionalText(formData.get("semester")),
    });

    revalidateSchool();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that course." };
  }
}

export async function addAssignmentAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const title = requireText(formData.get("title"));
    const courseId = requireText(formData.get("courseId"));

    await createAssignment(supabase, user.id, {
      course_id: courseId,
      title,
      due_at: parseOptionalIso(formData.get("dueAt")),
      notes: parseOptionalText(formData.get("notes")),
    });

    revalidateSchool();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that assignment." };
  }
}

export async function setAssignmentStatus(id: string, status: AssignmentStatus) {
  const { supabase } = await requireUserAndClient();
  await updateAssignmentStatus(supabase, id, status);
  revalidateSchool();
}
