import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { Skeleton } from "@/components/ui/skeleton";
import { buildSearchIndex } from "@/lib/search/search-index";

export const metadata: Metadata = {
  title: "検索",
  description: "企業名・証券コード・業界・用語から探す。",
  alternates: { canonical: "/search" },
};

export default async function SearchPage() {
  const entries = await buildSearchIndex();
  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-8 md:px-8 md:pt-12">
      <p className="eyebrow" aria-hidden>Search</p>
      <h1 className="mt-1 font-serif text-[1.75rem] font-semibold md:text-[2.5rem]">企業を探す</h1>
      <div className="mt-4">
        {/* useSearchParams needs a boundary so the page itself can still be prerendered. */}
        <Suspense fallback={<Skeleton className="h-14 w-full rounded-full" />}>
          <SearchResults entries={entries} />
        </Suspense>
      </div>
    </div>
  );
}
