import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { readingMinutes } from "@/lib/feature-meta";
import { formatDateJa } from "@/lib/utils/format";
import type { Feature } from "@/types/feature";

/**
 * A feature as a card (JCE-111): the theme, the one headline figure, the title and the reading time — what a
 * reader decides on in the list, in the order data-led sites put it (the number first, then the question).
 */

const ACCENTS = ["bg-navy", "bg-seal", "bg-growth"] as const;
export const accentFor = (index: number) => ACCENTS[index % ACCENTS.length]!;

export function FeatureCard({ feature, index, size = "default" }: { feature: Feature; index: number; size?: "default" | "lead" }) {
  const lead = feature.keyFigures?.[0];
  const minutes = readingMinutes(feature);
  const large = size === "lead";
  return (
    <Link
      href={`/features/${feature.id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg ${large ? "md:grid md:grid-cols-[1.1fr_1fr]" : ""}`}
    >
      <div className={`relative flex flex-col justify-end text-white ${accentFor(index)} ${large ? "min-h-56 p-6 md:min-h-80 md:p-10" : "min-h-40 p-5"}`}>
        {feature.topic && (
          <span className="absolute top-4 left-5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide md:top-6 md:left-auto md:left-6">
            {feature.topic}
          </span>
        )}
        {lead && (
          <>
            <span className={`figures leading-none font-semibold ${large ? "text-5xl md:text-7xl" : "text-4xl"}`}>{lead.value}</span>
            <span className={`mt-2 leading-snug text-white/80 ${large ? "text-sm md:text-base" : "text-xs"}`}>{lead.label}</span>
          </>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${large ? "p-6 md:p-10" : "p-5"}`}>
        <h3 className={`font-serif leading-snug font-semibold group-hover:underline group-hover:underline-offset-4 ${large ? "text-2xl md:text-[2rem]" : "text-lg"}`}>
          {feature.title}
        </h3>
        {feature.subtitle && (
          <p className={`mt-3 text-muted-foreground ${large ? "text-[0.9375rem] leading-7" : "line-clamp-2 text-sm leading-6"}`}>{feature.subtitle}</p>
        )}
        <p className="mt-auto flex items-center gap-3 pt-5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden />約{minutes}分</span>
          <span className="figures">{formatDateJa(feature.publishedAt)}</span>
          <span className="ml-auto inline-flex items-center gap-1 font-medium text-foreground">
            読む <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </p>
      </div>
    </Link>
  );
}
