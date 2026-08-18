"use client";

import { useFormStatus } from "react-dom";

export function NewBriefButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-emerald-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
    >
      {pending ? "Creating…" : "New brief"}
    </button>
  );
}
