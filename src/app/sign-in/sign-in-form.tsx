"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    if (redirectTo) {
      callbackUrl.searchParams.set("redirectTo", redirectTo);
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600 shadow-sm">
        Check <span className="font-medium text-slate-900">{email}</span> for
        a sign-in link.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-medium text-white shadow-sm active:bg-brand-700 disabled:opacity-60"
      >
        {status === "sending" ? "Sending link…" : "Send sign-in link"}
      </button>
    </form>
  );
}
