import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center px-6 py-24">
      <p className="font-serif text-2xl text-stone-900">Briefpad</p>
      <h1 className="mt-6 text-xl font-medium text-stone-900">
        We couldn’t find that
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        The brief may have been deleted, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm text-emerald-900 underline-offset-4 hover:underline"
      >
        Back to briefs
      </Link>
    </main>
  );
}
