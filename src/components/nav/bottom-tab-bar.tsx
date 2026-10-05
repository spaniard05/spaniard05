"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex h-16 items-stretch border-t border-slate-200 bg-white/95 backdrop-blur md:hidden"
      aria-label="Primary"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
          >
            <Icon
              className={`h-6 w-6 ${
                active ? "text-brand-600" : "text-slate-400"
              }`}
            />
            <span className={active ? "text-brand-600" : "text-slate-500"}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
