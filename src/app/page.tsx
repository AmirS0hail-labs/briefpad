import { AppHeader } from "@/components/app-header";
import { BriefSection } from "@/components/brief-section";
import { ImportBriefButton } from "@/components/import-brief-button";
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
              Start from a blank page, import a draft, then share it with a
              teammate.
            </p>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-3">
            <form action={createBrief}>
              <NewBriefButton />
            </form>
            <ImportBriefButton />
          </div>
        </div>

        <BriefSection
          heading="Yours"
          empty="No briefs yet. Create one to start writing."
          briefs={owned}
          variant="owned"
        />
        <BriefSection
          heading="Shared with you"
          empty="Nothing shared yet. When a teammate grants access, it will show up here."
          briefs={shared.map((brief) => ({
            id: brief.id,
            title: brief.title,
            updatedAt: brief.updatedAt,
            ownerName: brief.owner.name,
          }))}
          variant="shared"
        />
      </main>
    </div>
  );
}
