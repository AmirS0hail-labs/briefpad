import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { BriefEditor } from "@/components/brief-editor";
import { getCurrentUser, requireCurrentUser } from "@/lib/auth";
import { getBriefForUser } from "@/lib/briefs";
import { asTiptapDoc } from "@/lib/document";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return { title: "Briefpad" };
  }
  const result = await getBriefForUser(id, user.id);
  if (result.status !== "ok") {
    return { title: "Briefpad" };
  }
  return { title: `${result.brief.title} · Briefpad` };
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCurrentUser();
  const { id } = await params;
  const result = await getBriefForUser(id, user.id);

  if (result.status === "missing") {
    notFound();
  }

  if (result.status === "forbidden") {
    return (
      <div className="flex min-h-full flex-col">
        <AppHeader userName={user.name} />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
          <h1 className="text-xl font-medium text-stone-900">No access</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            This brief belongs to someone else. Ask them to share it, or go back
            to your list.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm text-emerald-900 underline-offset-4 hover:underline"
          >
            All briefs
          </Link>
        </main>
      </div>
    );
  }

  const { brief } = result;

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader userName={user.name} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <p className="mb-6 text-sm text-stone-500">
          <Link href="/" className="underline-offset-4 hover:underline">
            All briefs
          </Link>
        </p>
        <BriefEditor
          id={brief.id}
          initialTitle={brief.title}
          initialContent={asTiptapDoc(brief.contentJson)}
        />
      </main>
    </div>
  );
}
