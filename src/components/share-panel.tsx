"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { revokeShare, shareBrief } from "@/app/briefs/actions";

export type Teammate = {
  id: string;
  name: string;
  email: string;
  hasAccess: boolean;
};

export function SharePanel({
  documentId,
  teammates,
  children,
}: {
  documentId: string;
  teammates: Teammate[];
  children: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const sharedCount = teammates.filter((person) => person.hasAccess).length;

  async function run(
    userId: string,
    action: typeof shareBrief | typeof revokeShare,
  ) {
    setError(null);
    setPendingId(userId);
    try {
      const result = await action({ documentId, userId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not update sharing. Try again.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        {children}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-md border border-stone-300 bg-[#fffcf7] px-3 py-1.5 text-sm text-stone-800 hover:bg-stone-50"
        >
          Share{sharedCount > 0 ? ` · ${sharedCount}` : ""}
        </button>
      </div>
      {open ? (
        <div className="mt-3 rounded-lg border border-stone-200 bg-[#fffcf7] p-4">
          <p className="text-sm font-medium text-stone-900">Teammates</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            People you add can open and edit this brief. They cannot change who
            has access.
          </p>
          {error ? (
            <p className="mt-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <ul className="mt-3 flex flex-col gap-2">
            {teammates.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between gap-3 rounded-md border border-stone-200 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {person.name}
                  </p>
                  <p className="text-xs text-stone-500">{person.email}</p>
                </div>
                {person.hasAccess ? (
                  <button
                    type="button"
                    disabled={pendingId === person.id}
                    onClick={() => void run(person.id, revokeShare)}
                    className="text-sm text-stone-700 underline-offset-4 hover:underline disabled:opacity-60"
                  >
                    {pendingId === person.id ? "Removing…" : "Remove"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={pendingId === person.id}
                    onClick={() => void run(person.id, shareBrief)}
                    className="rounded-md bg-emerald-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
                  >
                    {pendingId === person.id ? "Sharing…" : "Share"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
