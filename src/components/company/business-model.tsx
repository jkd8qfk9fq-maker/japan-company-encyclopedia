import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { firstSentence } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import type { BusinessModel as BusinessModelData, BusinessModelStepKind } from "@/types/company";
import type { Source } from "@/types/source";

const STEP_LABEL: Record<BusinessModelStepKind, string> = {
  company: "会社",
  offering: "製品・サービス",
  customer: "顧客",
  revenue: "売上",
  profit: "利益",
};

const STEP_ORDER: BusinessModelStepKind[] = ["company", "offering", "customer", "revenue", "profit"];

/**
 * "どうやって儲けている？" as a flow, after the approved mockup: the steps the entry has, left to right on a wide
 * screen and top to bottom on a phone, each with its title and the first sentence of its description. The money
 * end — profit — is the dark card. A step the entry does not have is not drawn: the flow says only what the
 * filing supports. Every step's full description opens below the flow, so nothing is cut, only folded.
 */
export function BusinessModel({ model, sources }: { model: BusinessModelData; sources: Source[] }) {
  const steps = STEP_ORDER.map((kind) => model.flow.find((s) => s.kind === kind)).filter(
    (s): s is NonNullable<typeof s> => s !== undefined,
  );

  return (
    <div>
      <ol aria-label="ビジネスモデルの流れ" className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((step, i) => {
          const last = step.kind === "profit";
          return (
            <Fragment key={step.kind}>
              {i > 0 && (
                <li aria-hidden className="flex items-center justify-center text-muted-foreground lg:w-7 lg:shrink-0">
                  <ChevronRight className="size-4 rotate-90 lg:rotate-0" />
                </li>
              )}
              <li
                className={cn(
                  "min-w-0 rounded-md border p-5 lg:flex-1",
                  last ? "border-foreground bg-foreground text-background" : "border-foreground bg-card",
                )}
              >
                <p className={cn("figures text-xs tracking-[0.12em]", last ? "opacity-75" : "text-muted-foreground")}>
                  {String(i + 1).padStart(2, "0")} {STEP_LABEL[step.kind]}
                </p>
                <p className="mt-2 font-serif text-lg leading-snug font-semibold">{step.title}</p>
                <p className={cn("mt-2 text-[0.8125rem] leading-6", last ? "opacity-90" : "")}>
                  <RichText text={firstSentence(step.description)} />
                </p>
              </li>
            </Fragment>
          );
        })}
      </ol>

      <details className="group mt-6">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
          各段階を詳しく読む
        </summary>
        <dl className="mt-4 max-w-4xl divide-y divide-border border-y border-border">
          {steps.map((step) => (
            <div key={step.kind} className="grid gap-x-8 gap-y-1 py-5 md:grid-cols-[9rem_1fr]">
              <dt className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{STEP_LABEL[step.kind]}</dt>
              <dd>
                <p className="font-serif text-lg font-semibold">{step.title}</p>
                <p className="mt-1 text-[0.9375rem] leading-7">
                  <RichText text={step.description} />
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <p className="max-w-2xl text-[0.9375rem] leading-8">
          <RichText text={model.description} />
        </p>
        {model.revenueSources.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">売上の源泉</h3>
            <ul className="mt-3 space-y-2">
              {model.revenueSources.map((source) => (
                <li key={source} className="flex gap-3 text-sm leading-7">
                  <span aria-hidden className="mt-3.5 h-px w-3 shrink-0 bg-foreground" />
                  {source}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <SourceList sources={sources} sourceIds={model.sourceIds} className="mt-6" />
    </div>
  );
}
