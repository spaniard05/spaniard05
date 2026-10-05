"use client";

import { useTransition } from "react";
import type { LearnItem } from "@/lib/data/learn-items";
import type { LearnStatus } from "@/lib/supabase/types";
import { setLearnItemStatus } from "./actions";

const STATUS_LABELS: Record<LearnStatus, string> = {
  someday: "Someday",
  in_progress: "In progress",
  done: "Done",
};

export function LearnItemRow({ item }: { item: LearnItem }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={`font-medium ${
              item.status === "done" ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {item.title}
          </p>
          {item.resource_url && (
            <a
              href={item.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-xs text-brand-600 underline"
            >
              {item.resource_url}
            </a>
          )}
          {item.notes && (
            <p className="mt-0.5 text-xs text-slate-500">{item.notes}</p>
          )}
        </div>

        <select
          value={item.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() =>
              setLearnItemStatus(item.id, e.target.value as LearnStatus)
            )
          }
          className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50"
        >
          {(Object.keys(STATUS_LABELS) as LearnStatus[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}
