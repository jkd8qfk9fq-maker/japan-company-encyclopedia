import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock } from "lucide-react";
import { FEATURE_IMAGES } from "@/assets/features";
import { readingMinutes } from "@/lib/feature-meta";
import { formatDateJa } from "@/lib/utils/format";
import type { Feature } from "@/types/feature";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

/**
 * A feature as it is listed (JCE-111, JCE-113). Three shapes, after the magazine and news sites readers already
 * know how to scan (JCE-113): `lead` — photograph, title and the headline figures side by side, for the newest
 * feature; `row` — a thumbnail list item with date, title and a two-line lead, for 新着; `default` — a card, for
 * 次に読む at the foot of an article. Every figure shown is one of the feature's own computed keyFigures.
 */

const ACCENTS = ["bg-navy", "bg-seal", "bg-growth"] as const;
export const accentFor = (index: number) => ACCENTS[index % ACCENTS.length]!;

/** The feature's photograph, or its colour block where it has none. */
function Picture({ feature, index, sizes, className = "", priority = false }: { feature: Feature; index: number; sizes: string; className?: string; priority?: boolean }) {
  const image = FEATURE_IMAGES[feature.id];
  return (
    <div className={`relative overflow-hidden ${image ? "bg-foreground" : accentFor(index)} ${className}`}>
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
    </div>
  );
}

function Meta({ feature }: { feature: Feature }) {
  return (
    <span className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="figures"><F s={formatDateJa(feature.publishedAt)} /></span>
      <span className="inline-flex items-center gap-1"><span data-l="ja"><Clock className="size-3.5" aria-hidden />約{readingMinutes(feature)}分</span><span data-l="en"><Clock className="size-3.5" aria-hidden /> approx. {readingMinutes(feature)} min</span></span>
    </span>
  );
}

function LeadCard({ feature, index }: { feature: Feature; index: number }) {
  const [first, ...more] = feature.keyFigures ?? [];
  return (
    <Link
      href={`/features/${feature.id}`}
      className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg md:grid-cols-[1fr_1.15fr] lg:grid-cols-[1fr_1.1fr_17rem]"
    >
      <div className="relative">
        <Picture feature={feature} index={index} sizes="(min-width: 768px) 40vw, 100vw" priority className="aspect-[16/10] h-full md:aspect-auto md:min-h-72" />
        <span className="absolute top-4 left-4 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white shadow"><T m={{ ja: "注目の特集", en: "Featured" }} /></span>
      </div>
      <div className="flex flex-col p-6 md:p-8">
        <Meta feature={feature} />
        <h3 className="mt-3 font-serif text-[1.5rem] leading-snug font-semibold group-hover:underline group-hover:underline-offset-4 md:text-[1.875rem]">
          <L s={feature.title} />
        </h3>
        {feature.subtitle && <p className="mt-4 text-[0.9375rem] leading-7 text-muted-foreground"><L s={feature.subtitle} /></p>}
        <span className="mt-auto inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-navy dark:text-foreground">
          <span data-l="ja">続きを読む <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span><span data-l="en">Read more <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
        </span>
      </div>
      {first && (
        <div className="m-4 mt-0 flex flex-col rounded-xl bg-muted/60 p-5 md:col-span-2 md:mt-4 lg:col-span-1 lg:ml-0">
          {feature.topic && <p className="text-xs font-semibold text-muted-foreground">{feature.topic}</p>}
          <p className="figures mt-2 text-[2.75rem] leading-none font-semibold text-navy dark:text-foreground"><F s={first.value} /></p>
          <p className="mt-2 text-xs leading-snug text-muted-foreground"><L s={first.label} /></p>
          {more.length > 0 && (
            <dl className="mt-4 space-y-3 border-t border-border pt-4">
              {more.map((k) => (
                <div key={k.label}>
                  <dt className="text-xs leading-snug text-muted-foreground"><L s={k.label} /></dt>
                  <dd className="figures mt-0.5 text-lg font-semibold"><F s={k.value} /></dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </Link>
  );
}

function RowCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <Link href={`/features/${feature.id}`} className="group flex items-center gap-4 py-5 md:gap-6">
      <Picture feature={feature} index={index} sizes="(min-width: 768px) 13rem, 7rem" className="aspect-[4/3] w-28 shrink-0 rounded-lg sm:w-40 md:w-52" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {feature.topic && <span className="rounded-full bg-muted px-2.5 py-0.5 text-[0.6875rem] font-semibold">{feature.topic}</span>}
          <Meta feature={feature} />
        </div>
        <h3 className="mt-1.5 font-serif text-[1.0625rem] leading-snug font-semibold group-hover:underline group-hover:underline-offset-4 md:text-xl">
          <L s={feature.title} />
        </h3>
        {feature.subtitle && <p className="mt-1.5 line-clamp-2 hidden text-sm leading-6 text-muted-foreground sm:block"><L s={feature.subtitle} /></p>}
      </div>
      <ChevronRight className="hidden size-8 shrink-0 rounded-full bg-muted p-1.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block" aria-hidden />
    </Link>
  );
}

export function FeatureCard({ feature, index, size = "default" }: { feature: Feature; index: number; size?: "default" | "lead" | "row" }) {
  if (size === "lead") return <LeadCard feature={feature} index={index} />;
  if (size === "row") return <RowCard feature={feature} index={index} />;
  const lead = feature.keyFigures?.[0];
  return (
    <Link href={`/features/${feature.id}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative">
        <Picture feature={feature} index={index} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" className="aspect-[16/9]" />
        {feature.topic && <span className="absolute top-3 left-3 rounded-full bg-navy/90 px-3 py-1 text-xs font-semibold text-white">{feature.topic}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {lead && (
          <p className="flex items-baseline gap-2">
            <span className="figures text-2xl leading-none font-semibold"><F s={lead.value} /></span>
            <span className="text-xs leading-snug text-muted-foreground"><L s={lead.label} /></span>
          </p>
        )}
        <h3 className="mt-3 font-serif text-lg leading-snug font-semibold group-hover:underline group-hover:underline-offset-4"><L s={feature.title} /></h3>
        <p className="mt-auto flex items-center justify-between pt-4">
          <Meta feature={feature} />
          <span className="inline-flex items-center gap-1 text-xs font-medium">
            <span data-l="ja">読む <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden /></span><span data-l="en">Read <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
          </span>
        </p>
      </div>
    </Link>
  );
}
