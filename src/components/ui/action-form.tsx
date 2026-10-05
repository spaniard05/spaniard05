"use client";

import { useActionState, useEffect, useRef } from "react";

export type FormState = { error: string | null };
export const initialFormState: FormState = { error: null };

type ActionFn = (
  prevState: FormState,
  formData: FormData
) => Promise<FormState>;

/**
 * A <form> wired to a server action via useActionState, with error display
 * and auto-reset-on-success baked in so every add/edit form in the app
 * behaves the same way.
 */
export function ActionForm({
  action,
  className,
  children,
}: {
  action: ActionFn;
  className?: string;
  children: (args: { pending: boolean }) => React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialFormState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      formRef.current?.reset();
    }
    wasPending.current = isPending;
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className={className}>
      {children({ pending: isPending })}
      {state.error && (
        <p className="mt-1.5 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  );
}
