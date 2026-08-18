import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/login/logout-action";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-stone-200 bg-[#fffcf7]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <p className="font-serif text-xl text-stone-900">Briefpad</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-stone-600">{user?.name}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-stone-700 underline-offset-4 hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-medium tracking-tight text-stone-900">
          Briefs
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
          A quiet place for team writing. Create a brief, import a draft, or
          open something shared with you.
        </p>

        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Yours
          </h2>
          <p className="mt-3 rounded-lg border border-dashed border-stone-300 bg-[#fffcf7] px-4 py-8 text-sm text-stone-500">
            No briefs yet. You will be able to start from a blank page or import
            a Markdown or text file.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Shared with you
          </h2>
          <p className="mt-3 rounded-lg border border-dashed border-stone-300 bg-[#fffcf7] px-4 py-8 text-sm text-stone-500">
            Nothing shared yet. When a teammate grants access, it will show up
            here.
          </p>
        </section>
      </main>
    </div>
  );
}
