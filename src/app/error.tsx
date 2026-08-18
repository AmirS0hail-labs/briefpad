"use client";

import Link from "next/link";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center px-6 py-24">
      <p className="font-serif text-2xl text-stone-900">Briefpad</p>
      <h1 className="mt-6 text-xl font-medium text-stone-900">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        The last action did not finish. You can try again, or go back to your
        briefs.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-stone-400">Reference {error.digest}</p>
      ) : null}
      <div className="mt-6 flex items-center gap-4 text-sm">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-md bg-emerald-900 px-3.5 py-2 font-medium text-white hover:bg-emerald-800"
        >
          Try again
        </button>
        <Link href="/" className="text-emerald-900 underline-offset-4 hover:underline">
          All briefs
        </Link>
      </div>
    </main>
  );
}
