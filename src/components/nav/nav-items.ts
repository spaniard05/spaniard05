import {
  HealthIcon,
  LearnIcon,
  SchoolIcon,
  TasksIcon,
  TodayIcon,
} from "./icons";

export const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: TodayIcon },
  { href: "/health", label: "Health", icon: HealthIcon },
  { href: "/school", label: "School", icon: SchoolIcon },
  { href: "/tasks", label: "Tasks", icon: TasksIcon },
  { href: "/learn", label: "Learn", icon: LearnIcon },
] as const;
