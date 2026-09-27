import { ArrowDown } from "lucide-react";
import { Fragment } from "react";
import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
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
 * "どうやって儲けている？" — the 3-minute layer.
 *
 * The flow is always the same five steps in the same order, so a reader who
 * has understood one company's model can compare it with another's at a
 * glance. Only the words inside the steps are company-specific.
 */
export function BusinessModel({ model, sources }: { model: BusinessModelData; sources: Source[] }) {
  const steps = STEP_ORDER.map((kind) => model.flow.find((s) => s.kind === kind)).filter(
    (s): s is NonNullable<typeof s> => s !== undefined,
  );

  return (
    <div>
      {/*
        A vertical flow at every width. Five side-by-side columns were tried and
        rejected: at desktop width each column held ~8 Japanese characters per
        line, and the descriptions — the part that actually explains the model —
        became unreadable.
      */}
      <ol className="max-w-4xl">
        {steps.map((step, i) => (
          <Fragment key={step.kind}>
            {i > 0 && (
              <li aria-hidden className="flex h-9 items-center pl-5 text-muted-foreground md:pl-[5.25rem]">
                <ArrowDown className="size-4" />
              </li>
            )}
            <li className="grid gap-x-8 gap-y-2 rounded-md border border-border bg-background p-5 md:grid-cols-[9rem_1fr] md:p-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">
                  {STEP_LABEL[step.kind]}
                </p>
                <p className="mt-1 font-serif text-lg leading-snug font-semibold md:hidden">{step.title}</p>
              </div>
              <div>
                <p className="hidden font-serif text-xl leading-snug font-semibold md:block">{step.title}</p>
                <p className="text-[0.9375rem] leading-7 md:mt-2">
                  <RichText text={step.description} />
                </p>
              </div>
            </li>
          </Fragment>
        ))}
      </ol>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <p className="prose-ja max-w-2xl">
          <RichText text={model.description} />
        </p>
        <div>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">売上の源泉</h3>
          <ul className="mt-3 space-y-2">
            {model.revenueSources.map((source) => (
              <li key={source} className="flex gap-3 text-[0.9375rem] leading-7">
                <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-foreground" />
                {source}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SourceList sources={sources} sourceIds={model.sourceIds} className="mt-8" />
    </div>
  );
}
