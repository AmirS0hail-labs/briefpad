import Link from "next/link";
import { formatUpdatedAt } from "@/lib/dates";

type BriefSummary = {
  id: string;
  title: string;
  updatedAt: Date;
  ownerName?: string;
};

export function BriefSection({
  heading,
  empty,
  briefs,
  variant,
}: {
  heading: string;
  empty: string;
  briefs: BriefSummary[];
  variant: "owned" | "shared";
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
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-stone-50"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium text-stone-900">
                      {brief.title}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        variant === "owned"
                          ? "bg-emerald-50 text-emerald-900"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {variant === "owned" ? "Yours" : "Shared"}
                    </span>
                  </span>
                  {brief.ownerName ? (
                    <span className="mt-0.5 block truncate text-xs text-stone-500">
                      From {brief.ownerName}
                    </span>
                  ) : null}
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
