import { Skeleton } from "@/components/ui/skeleton";

/** Shown during client-side navigation. Mirrors the hero's shape so nothing jumps. */
export default function CompanyLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 md:px-8 md:pt-20" aria-busy="true" aria-label="読み込み中">
      <Skeleton className="h-20 w-2/3 md:h-32" />
      <Skeleton className="mt-6 h-9 w-48" />
      <Skeleton className="mt-8 h-7 w-full max-w-3xl" />
      <Skeleton className="mt-3 h-7 w-4/5 max-w-2xl" />
      <div className="mt-20 flex flex-col items-center gap-8">
        <Skeleton className="h-20 w-48" />
        <div className="grid w-full grid-cols-3 gap-5">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </div>
  );
}
