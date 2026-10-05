import { LogOutIcon } from "./icons";
import { signOut } from "@/lib/auth/actions";

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 pt-safe backdrop-blur md:hidden">
      <p className="py-3 text-base font-semibold text-slate-900">Assistant</p>
      <form action={signOut}>
        <button
          type="submit"
          aria-label="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 active:bg-slate-100"
        >
          <LogOutIcon className="h-5 w-5" />
        </button>
      </form>
    </header>
  );
}
