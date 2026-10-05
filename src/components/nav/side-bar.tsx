"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { LogOutIcon, SettingsIcon } from "./icons";
import { signOut } from "@/lib/auth/actions";

export function SideBar({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
      <div className="mb-8 px-2">
        <p className="text-lg font-semibold text-slate-900">Assistant</p>
        {userEmail && (
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {userEmail}
          </p>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "text-brand-600" : "text-slate-400"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          pathname.startsWith("/settings")
            ? "bg-brand-50 text-brand-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <SettingsIcon
          className={`h-5 w-5 ${
            pathname.startsWith("/settings") ? "text-brand-600" : "text-slate-400"
          }`}
        />
        Settings
      </Link>

      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
        >
          <LogOutIcon className="h-5 w-5 text-slate-400" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
