import { SignInForm } from "./sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 pt-safe pb-safe">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Assistant</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to see your day.
          </p>
        </div>
        <SignInForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
