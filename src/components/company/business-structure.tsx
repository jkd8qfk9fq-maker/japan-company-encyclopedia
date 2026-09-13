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

function NodeName({ business }: { business: Business }) {
  const label = business.shortName ?? business.name;
  return (
    <span className="flex min-h-12 items-center justify-center rounded-md border border-foreground bg-background px-4 py-2 font-serif text-[1.0625rem] leading-snug font-semibold">
      {label}
      {business.shortName && business.shortName !== business.name && (
        <span className="sr-only">（{business.name}）</span>
      )}
    </span>
  );
}

function Columns({ company }: { company: Company }) {
  const n = company.businesses.length;
  return (
    <div className="flex flex-col items-center">
      <RootNode company={company} align="center" />
      <div className={styles.stem} aria-hidden />
      <ol
        className={cn(styles.branches, "w-full")}
        style={{ "--n": n } as React.CSSProperties}
      >
        {company.businesses.map((business) => {
          const { items, kind } = leavesOf(business);
          return (
            <li key={business.id} className={styles.branch}>
              <NodeName business={business} />
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

function Spine({ company }: { company: Company }) {
  return (
    <div>
      <RootNode company={company} align="start" />
      <ol className={styles.spine}>
        {company.businesses.map((business) => {
          const { items, kind } = leavesOf(business);
          return (
            <li key={business.id} className={styles.row}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-5">
                <div className="shrink-0 sm:w-56">
                  <NodeName business={business} />
                </div>
                {items.length > 0 && (
                  <ul
                    className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm leading-6 text-muted-foreground sm:pt-3"
                    aria-label={kind === "children" ? "主な事業" : "主な製品・サービス"}
                  >
                    {items.slice(0, MAX_LEAVES).map((item, i) => (
                      <li key={item}>
                        {i > 0 && <span aria-hidden className="mr-3 text-border">/</span>}
                        {item}
                      </li>
                    ))}
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
  const n = company.businesses.length;
  if (n === 0) return null;

  const fitsColumns = n >= 2 && n <= MAX_COLUMNS;

  return (
    <figure aria-labelledby={`${company.id}-structure-caption`}>
      {fitsColumns ? (
        <>
          <div className="hidden md:block">
            <Columns company={company} />
          </div>
          <div className="md:hidden">
            <Spine company={company} />
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-3xl">
          <Spine company={company} />
        </div>
      )}
      <figcaption
        id={`${company.id}-structure-caption`}
        className="mt-8 text-center text-xs leading-5 text-muted-foreground"
      >
        {company.name}の事業構造。区分は同社の開示に基づきます。
      </figcaption>
    </figure>
  );
}
