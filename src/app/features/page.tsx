import type { Metadata } from "next";
import Link from "next/link";
import { featureRepository } from "@/lib/repositories";
import { formatDateJa } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "特集",
  description: "企業と業界を、一つの問いから読み解く特集。",
  alternates: { canonical: "/features" },
};

export default async function FeaturesPage() {
  const features = await featureRepository.list();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Features</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[3rem]">特集</h1>
      <p className="prose-ja mt-4 max-w-2xl text-muted-foreground">
        一つの問いから、企業と業界をまたいで読む。
      </p>

      {features.length === 0 ? (
        <p className="mt-14 border-t border-foreground pt-8 text-muted-foreground">
          特集はまだ公開していません。
        </p>
      ) : (
        <ul className="mt-14 border-t border-foreground">
          {features.map((feature) => (
            <li key={feature.id} className="border-b border-border">
              <Link href={`/features/${feature.id}`} className="group grid gap-3 py-10 md:grid-cols-[10rem_1fr] md:gap-10">
                <span className="figures text-sm text-muted-foreground">{formatDateJa(feature.publishedAt)}</span>
                <span>
                  <span className="block font-serif text-[1.75rem] leading-snug font-semibold group-hover:underline group-hover:underline-offset-4 md:text-[2.25rem]">
                    {feature.title}
                  </span>
                  {feature.subtitle && <span className="mt-3 block text-muted-foreground">{feature.subtitle}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
