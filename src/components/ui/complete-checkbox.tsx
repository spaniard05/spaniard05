"use client";

import { useTransition } from "react";

export function CompleteCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={checked ? "Mark as not done" : "Mark as done"}
      disabled={isPending}
      onClick={() => startTransition(() => onToggle())}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-slate-300 text-transparent active:border-slate-400"
      } ${isPending ? "opacity-50" : ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </button>
  );
}
