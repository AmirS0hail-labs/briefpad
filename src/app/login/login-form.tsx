"use client";

import { useActionState, useState } from "react";
import { DEMO_PASSWORD, DEMO_USERS } from "@/lib/demo-users";
import { loginAction, type LoginState } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    null,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-stone-700">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none ring-stone-400 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-stone-700">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none ring-stone-400 focus:ring-2"
          />
        </label>
        {state?.error ? (
          <p className="text-sm text-red-800" role="alert">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-md bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-800">Demo teammates</p>
        <p className="mt-1 text-sm text-stone-600">
          Same password for all accounts:{" "}
          <code className="rounded bg-white px-1 py-0.5 text-stone-800">
            {DEMO_PASSWORD}
          </code>
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {DEMO_USERS.map((user) => (
            <li key={user.email}>
              <button
                type="button"
                onClick={() => {
                  setEmail(user.email);
                  setPassword(DEMO_PASSWORD);
                }}
                className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-left text-sm hover:border-stone-400"
              >
                <span className="font-medium text-stone-900">{user.name}</span>
                <span className="mt-0.5 block text-stone-500">{user.email}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
