import { cn } from "@/lib/utils";
import type { Business, Company } from "@/types/company";
import styles from "./business-structure.module.css";

/**
 * The company-specific business structure — the most important component in
 * the product. Its job is the 3-second answer: one glance should say what the
 * company is made of.
 *
 * The SHAPE comes from the data, never from a template. A company with three
 * segments draws three branches; one with eight draws eight; one that reports a
 * single segment draws the businesses it describes. Nothing here pads a
 * structure to look fuller.
 *
 * Two layouts, chosen by what fits rather than by a fixed rule per company:
 *   columns — a top-down tree like an org chart. Clearest, but only fits 2–4
 *             branches side by side, and only on a wide screen.
 *   spine   — a left-rail tree. Fits any number of branches at any width.
 * With 2–4 businesses, phones get the spine and wider screens get columns.
 * With 5+, everyone gets the spine.
 */

const MAX_COLUMNS = 4;
const MAX_LEAVES = 4;

/** What sits under a node: its sub-businesses if the company describes any, else a few products. */
function leavesOf(business: Business): { items: string[]; kind: "children" | "products" } {
  if (business.children && business.children.length > 0) {
    return { items: business.children.map((c) => c.shortName ?? c.name), kind: "children" };
  }
  return { items: business.products ?? [], kind: "products" };
}

const SEGMENT_TONES = 6;

/**
 * A business's marker: its number on its colour. The same mark labels the business in this diagram and in the list
 * under it (business-list.tsx), so the two read as one object. The number carries the identity — colour only helps
 * the eye — and past the sixth business there is no colour left, so the mark is the number alone.
 */
export function SegmentMark({ index }: { index: number }) {
  return (
    <span aria-hidden className="figures inline-flex shrink-0 items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
      {index < SEGMENT_TONES && (
        // Text never sits on the colour: a swatch beside the number keeps contrast the same in light and dark.
        <span className="size-2.5 rounded-[2px]" style={{ background: `var(--segment-${index + 1})` }} />
      )}
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function RootNode({ company, align }: { company: Company; align: "center" | "start" }) {
  return (
    <div
      className={cn(
        "relative z-10 inline-flex flex-col rounded-md bg-foreground px-6 py-4 text-background",
        align === "center" ? "items-center text-center" : "items-start",
      )}
    >
      {company.shortNameEn && (
        <span className="wordmark text-[1.625rem] md:text-[2rem]" aria-hidden>
          {company.shortNameEn}
        </span>
      )}
      <span className={cn("text-sm", company.shortNameEn && "mt-1 opacity-75")}>{company.name}</span>
    </div>
  );
}

function NodeName({ business, index }: { business: Business; index: number }) {
  const label = business.shortName ?? business.name;
  return (
    <span className="flex min-h-12 items-center justify-center gap-2.5 rounded-md border border-foreground bg-background px-4 py-2 font-serif text-[1.0625rem] leading-snug font-semibold">
      <SegmentMark index={index} />
      {label}
      {business.shortName && business.shortName !== business.name && (
        <span className="sr-only">（{business.name}）</span>
      )}
    </span>
  );
}

/** A single reportable segment drawn between the company and its sub-businesses. */
function ViaNode({ business }: { business: Business }) {
  return (
    <span className="relative z-10 inline-flex min-h-10 items-center rounded-full border border-border bg-background px-4 text-sm">
      <span className="mr-2 text-xs text-muted-foreground">単一セグメント</span>
      <span className="font-medium">{business.name}</span>
    </span>
  );
}

function Columns({ company, branches, via }: { company: Company; branches: Business[]; via: Business | null }) {
  const n = branches.length;
  return (
    <div className="flex flex-col items-center">
      <RootNode company={company} align="center" />
      <div className={styles.stem} aria-hidden />
      {via && (
        <>
          <ViaNode business={via} />
          <div className={styles.stem} aria-hidden />
        </>
      )}
      <ol
        className={cn(styles.branches, "w-full")}
        style={{ "--n": n } as React.CSSProperties}
      >
        {branches.map((business, index) => {
          const { items, kind } = leavesOf(business);
          return (
            <li key={business.id} className={styles.branch}>
              <NodeName business={business} index={index} />
              {items.length > 0 && (
                <ul
                  className={cn(styles.leaves, "space-y-1 text-sm leading-6 text-muted-foreground")}
                  aria-label={kind === "children" ? "主な事業" : "主な製品・サービス"}
                >
                  {items.slice(0, MAX_LEAVES).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                  {items.length > MAX_LEAVES && (
                    <li className="figures text-xs">ほか{items.length - MAX_LEAVES}件</li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Spine({ company, branches, via }: { company: Company; branches: Business[]; via: Business | null }) {
  return (
    <div>
      <RootNode company={company} align="start" />
      {via && (
        <div className={styles.spineVia}>
          <ViaNode business={via} />
        </div>
      )}
      <ol className={styles.spine}>
        {branches.map((business, index) => {
          const { items, kind } = leavesOf(business);
          return (
            <li key={business.id} className={styles.row}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-5">
                <div className="shrink-0 sm:w-56">
                  <NodeName business={business} index={index} />
                </div>
                {items.length > 0 && (
                  // Space, not "/" separators: a separator wraps to the start of a line.
                  <ul
                    className="flex flex-wrap gap-x-5 gap-y-0.5 text-sm leading-6 text-muted-foreground sm:pt-3"
                    aria-label={kind === "children" ? "主な事業" : "主な製品・サービス"}
                  >
                    {items.slice(0, MAX_LEAVES).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                    {items.length > MAX_LEAVES && (
                      <li className="figures text-xs leading-6">ほか{items.length - MAX_LEAVES}件</li>
                    )}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function BusinessStructure({ company }: { company: Company }) {
  if (company.businesses.length === 0) return null;

  // One top-level business with sub-businesses (a company reporting a single
  // segment, like Tokyo Electron) would otherwise draw one lonely branch and
  // hide the level that actually says what the company makes. Draw the
  // segment as an intermediate node and branch from its children instead.
  // This only changes which existing level is drawn; nothing is added.
  const only = company.businesses.length === 1 ? company.businesses[0] : null;
  const via = only && only.children && only.children.length > 0 ? only : null;
  const branches = via ? via.children! : company.businesses;
  const n = branches.length;

  const fitsColumns = n >= 2 && n <= MAX_COLUMNS;

  return (
    <figure aria-labelledby={`${company.id}-structure-caption`}>
      {fitsColumns ? (
        <>
          <div className="hidden md:block">
            <Columns company={company} branches={branches} via={via} />
          </div>
          <div className="md:hidden">
            <Spine company={company} branches={branches} via={via} />
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-3xl">
          <Spine company={company} branches={branches} via={via} />
        </div>
      )}
      <figcaption
        id={`${company.id}-structure-caption`}
        className="mt-6 text-center text-xs leading-5 text-muted-foreground"
      >
        {company.name}の事業構造。区分は同社の開示に基づきます。
      </figcaption>
    </figure>
  );
}
