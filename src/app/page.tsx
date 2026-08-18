import { AppHeader } from "@/components/app-header";
import { BriefSection } from "@/components/brief-section";
import { NewBriefButton } from "@/components/new-brief-button";
import { createBrief } from "@/app/briefs/actions";
import { requireCurrentUser } from "@/lib/auth";
import { listOwnedBriefs, listSharedBriefs } from "@/lib/briefs";

export default async function HomePage() {
  const user = await requireCurrentUser();
  const [owned, shared] = await Promise.all([
    listOwnedBriefs(user.id),
    listSharedBriefs(user.id),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader userName={user.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-stone-900">
              Briefs
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              Start from a blank page. Import from a file comes next.
            </p>
          </div>
          <form action={createBrief}>
            <NewBriefButton />
          </form>
        </div>

        <BriefSection
          heading="Yours"
          empty="No briefs yet. Create one to start writing."
          briefs={owned}
        />
        <BriefSection
          heading="Shared with you"
          empty="Nothing shared yet. When a teammate grants access, it will show up here."
          briefs={shared}
        />
      </main>
    </div>
  );
}
