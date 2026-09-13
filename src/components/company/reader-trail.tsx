"use client";

import Link from "next/link";
import { useLocalStore } from "@/hooks/use-local-store";
import type { CompanySummary } from "@/lib/company-summary";
import { favoritesStore, recentlyViewedStore } from "@/lib/storage/stores";

/**
 * The reader's own trail: saved companies and recently viewed ones. Renders
 * nothing until there is something to show — an empty "最近見た企業" block on
 * a first visit is noise.
 *
 * Receives summaries for every company because the ids live in localStorage
 * and the server cannot know which ones to send. Ids that no longer resolve
 * (a removed entry, a tampered value) are silently skipped.
 */
export function ReaderTrail({ companies }: { companies: CompanySummary[] }) {
  const recent = useLocalStore(recentlyViewedStore);
  const favorites = useLocalStore(favoritesStore);
  const byId = new Map(companies.map((c) => [c.id, c]));

  const groups = [
    { title: "保存した企業", ids: favorites },
    { title: "最近見た企業", ids: recent },
  ]
    .map((g) => ({ ...g, items: g.ids.map((id) => byId.get(id)).filter((c): c is CompanySummary => !!c) }))
    .filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section aria-label="あなたの閲覧" className="mx-auto max-w-6xl px-5 pt-16 md:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{group.title}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.slice(0, 8).map((company) => (
                <li key={company.id}>
                  <Link
                    href={`/companies/${company.id}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm hover:border-foreground"
                  >
                    {company.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
