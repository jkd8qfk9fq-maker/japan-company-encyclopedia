"use client";

import { useActionState, useId } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const ids = { password: useId(), error: useId() };

  return (
    <form action={action} className="space-y-5" aria-describedby={state.error ? ids.error : undefined}>
      <div>
        <label htmlFor={ids.password} className="text-sm font-medium">パスワード</label>
        <input
          id={ids.password}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-base"
        />
      </div>
      {state.error && (
        <p id={ids.error} role="alert" className="text-sm text-destructive">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-8 text-background disabled:opacity-60"
      >
        {pending ? "確認しています…" : "ログイン"}
      </button>
    </form>
  );
}
