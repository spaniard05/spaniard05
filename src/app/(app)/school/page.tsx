import { createClient } from "@/lib/supabase/server";
import { listCourses } from "@/lib/data/courses";
import { listAssignmentsWithCourse } from "@/lib/data/assignments";
import { Section } from "@/components/ui/section";
import { CourseForm } from "./course-form";
import { AssignmentForm } from "./assignment-form";
import { AssignmentList } from "./assignment-list";

export default async function SchoolPage() {
  const supabase = await createClient();
  const [courses, assignments] = await Promise.all([
    listCourses(supabase),
    listAssignmentsWithCourse(supabase),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">School</h1>

      <Section title="Add a course">
        <CourseForm />
      </Section>

      <Section title="Add an assignment">
        <AssignmentForm courses={courses} />
      </Section>

      <Section title="Assignments">
        <AssignmentList courses={courses} assignments={assignments} />
      </Section>
    </div>
  );
}
