import Link from "next/link";
import { formatUpdatedAt } from "@/lib/dates";

type BriefSummary = {
  id: string;
  title: string;
  updatedAt: Date;
};

export function BriefSection({
  heading,
  empty,
  briefs,
}: {
  heading: string;
  empty: string;
  briefs: BriefSummary[];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-medium uppercase tracking-wide text-stone-500">
        {heading}
      </h2>
      {briefs.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-stone-300 bg-[#fffcf7] px-4 py-8 text-sm text-stone-500">
          {empty}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-[#fffcf7]">
          {briefs.map((brief) => (
            <li key={brief.id}>
              <Link
                href={`/briefs/${brief.id}`}
                className="flex items-baseline justify-between gap-4 px-4 py-3 hover:bg-stone-50"
              >
                <span className="truncate font-medium text-stone-900">
                  {brief.title}
                </span>
                <span className="shrink-0 text-xs text-stone-500">
                  {formatUpdatedAt(brief.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
