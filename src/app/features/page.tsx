import type { Metadata } from "next";
import { FeatureCard } from "@/components/feature/feature-card";
import { featureRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "特集",
  description: "企業と業界を、一つの問いから読み解く特集。数字はすべて有価証券報告書から。",
  alternates: { canonical: "/features" },
};

/**
 * The features list (JCE-111): the newest feature as a lead card with its headline figure, the rest as a grid of
 * cards — theme, number, title, reading time — so the page is chosen from at a glance instead of scrolled through.
 */
export default async function FeaturesPage() {
  const features = await featureRepository.list();
  const [lead, ...rest] = features;

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6 pb-12 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Features</p>
      <h1 className="mt-1 font-serif text-[1.75rem] leading-tight font-semibold md:text-[2.5rem]">特集</h1>
      <p className="prose-ja mt-3 max-w-2xl text-muted-foreground">
        一つの問いから、企業と業界をまたいで読む。数字はすべて掲載企業の有価証券報告書から計算しています。
      </p>

      {!lead ? (
        <p className="mt-14 border-t border-foreground pt-8 text-muted-foreground">特集はまだ公開していません。</p>
      ) : (
        <>
          <div className="mt-8">
            <FeatureCard feature={lead} index={0} size="lead" />
          </div>
          {rest.length > 0 && (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((f, i) => (
                <li key={f.id}><FeatureCard feature={f} index={i + 1} /></li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
