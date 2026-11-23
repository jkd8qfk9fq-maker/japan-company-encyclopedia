import type { Metadata } from "next";
import { SyncReceive } from "@/components/sync/sync-receive";

export const metadata: Metadata = { title: "別の端末から引き継ぐ", robots: { index: false } };

/** The page an e-mailed link opens (JCE-065). Static; the one-time token is read in the browser from the fragment. */
export default function SyncPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-5 pb-16 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Sync</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">別の端末から引き継ぐ</h1>
      <div className="mt-8">
        <SyncReceive />
      </div>
    </div>
  );
}
