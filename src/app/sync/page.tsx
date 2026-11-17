import type { Metadata } from "next";
import { SyncReceive } from "@/components/sync/sync-receive";

export const metadata: Metadata = { title: "別の端末から引き継ぐ", robots: { index: false } };

/** The page an e-mailed link opens (JCE-065). Static; the one-time token is read in the browser from the fragment. */
export default function SyncPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-12 pb-16 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Sync</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">別の端末から引き継ぐ</h1>
      <div className="mt-8">
        <SyncReceive />
      </div>
    </div>
  );
}
