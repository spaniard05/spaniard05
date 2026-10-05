import type { AssignmentWithCourse } from "@/lib/data/assignments";
import type { Course } from "@/lib/data/courses";
import { EmptyState } from "@/components/ui/empty-state";
import { AssignmentRow } from "./assignment-row";

export function AssignmentList({
  courses,
  assignments,
}: {
  courses: Course[];
  assignments: AssignmentWithCourse[];
}) {
  if (assignments.length === 0) {
    return <EmptyState>No assignments yet.</EmptyState>;
  }

  const byCourse = new Map<string, AssignmentWithCourse[]>();
  for (const assignment of assignments) {
    const list = byCourse.get(assignment.course_id) ?? [];
    list.push(assignment);
    byCourse.set(assignment.course_id, list);
  }

  return (
    <div className="space-y-4">
      {courses
        .filter((course) => byCourse.has(course.id))
        .map((course) => (
          <div key={course.id}>
            <h3 className="mb-1.5 text-sm font-medium text-slate-700">
              {course.name}
              {course.code && (
                <span className="ml-1.5 text-xs font-normal text-slate-400">
                  {course.code}
                </span>
              )}
            </h3>
            <ul className="space-y-1.5">
              {byCourse.get(course.id)!.map((assignment) => (
                <AssignmentRow key={assignment.id} assignment={assignment} />
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
