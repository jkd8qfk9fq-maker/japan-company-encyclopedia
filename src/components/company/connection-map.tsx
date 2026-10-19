import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company, RelationshipKind } from "@/types/company";
import styles from "./connection-map.module.css";
import { RELATIONSHIP_LABEL } from "./related-companies";

export type Lane = "owners" | "up" | "down" | "group" | "other";

export type Connection = {
  company: Company;
  /** As this page states it: the role the other company plays for THIS company. */
  label: string;
  /** True when the tie is written in the other company's entry, not this one. */
  inbound: boolean;
};

/** Where a related company sits, read as "it is this company's <kind>". */
const LANE_OF: Record<RelationshipKind, Lane> = {
  parent: "owners",
  "other-affiliated-company": "owners",
  supplier: "up",
  customer: "down",
  subsidiary: "group",
  affiliate: "group",
  technology: "other",
  "business-partner": "other",
  "same-industry": "other",
  competitor: "other",
  "same-business-model": "other",
};

/**
 * The same tie seen from the other end. X's entry saying "this company is X's supplier" makes X this company's
 * customer. The four symmetric kinds read the same both ways. 関連会社 / その他の関係会社 turn into 出資元 / 出資先
 * rather than into each other: the filing categories are about who holds whose shares, and only the direction
 * survives the inversion, not the category.
 */
const INVERSE: Record<RelationshipKind, { lane: Lane; label: string }> = {
  supplier: { lane: "down", label: "顧客" },
  customer: { lane: "up", label: "仕入先" },
  parent: { lane: "group", label: "子会社" },
  subsidiary: { lane: "owners", label: "親会社" },
  affiliate: { lane: "owners", label: "出資元" },
  "other-affiliated-company": { lane: "group", label: "出資先" },
  technology: { lane: "other", label: RELATIONSHIP_LABEL.technology },
  "business-partner": { lane: "other", label: RELATIONSHIP_LABEL["business-partner"] },
  "same-industry": { lane: "other", label: RELATIONSHIP_LABEL["same-industry"] },
  competitor: { lane: "other", label: RELATIONSHIP_LABEL.competitor },
  "same-business-model": { lane: "other", label: RELATIONSHIP_LABEL["same-business-model"] },
};

const LANE_TITLE: Record<Lane, string> = {
  owners: "株主側（親会社など）",
  up: "仕入先（上流）",
  down: "顧客（下流）",
  group: "グループ・出資先",
  other: "技術・取引・同業のつながり",
};

/** Per lane on the map; the full list with every description is directly below it. */
const MAX_PER_LANE = 5;

export function placeConnections(
  outgoing: { company: Company; kind: RelationshipKind }[],
  inbound: { company: Company; kind: RelationshipKind }[],
): Record<Lane, Connection[]> {
  const lanes: Record<Lane, Connection[]> = { owners: [], up: [], down: [], group: [], other: [] };
  const seen = new Set<string>();
  const add = (lane: Lane, connection: Connection) => {
    // One company can be named by both entries; the map shows it once per lane, this company's own wording first.
    const key = `${lane}:${connection.company.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    lanes[lane].push(connection);
  };
  for (const { company, kind } of outgoing) add(LANE_OF[kind], { company, label: RELATIONSHIP_LABEL[kind], inbound: false });
  for (const { company, kind } of inbound) add(INVERSE[kind].lane, { company, label: INVERSE[kind].label, inbound: true });
  return lanes;
}

function LaneBox({ lane, items, className }: { lane: Lane; items: Connection[]; className?: string }) {
  const trade = lane === "up" || lane === "down";
  return (
    <section
      aria-label={LANE_TITLE[lane]}
      className={cn(
        "rounded-md bg-background p-4",
        trade ? "border border-ink" : lane === "other" ? "border border-dashed border-muted-foreground" : "border border-foreground",
        className,
      )}
    >
      <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{LANE_TITLE[lane]}</h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.slice(0, MAX_PER_LANE).map((item) => (
          <li key={item.company.id}>
            <Link
              href={`/companies/${item.company.id}`}
              className="inline-flex min-h-11 flex-col justify-center rounded-md border border-border px-3 py-1.5 leading-tight hover:border-foreground"
            >
              <span className="font-serif text-[0.9375rem] font-semibold">{item.company.name}</span>
              <span className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                {item.label}
                {item.inbound && <span className="sr-only">（{item.company.name}の項目に記載）</span>}
              </span>
            </Link>
          </li>
        ))}
        {items.length > MAX_PER_LANE && (
          <li>
            <a href="#related-companies-list" className="link-ink inline-flex min-h-11 items-center px-1 text-sm">
              ほか{items.length - MAX_PER_LANE}社
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}

function TradeArrow({ className }: { className: string }) {
  // Goods and services flow upstream → company → downstream: down the page on a phone, left to right from md up.
  return (
    <div aria-hidden className={cn(styles.link, className)}>
      <ArrowRight className="size-5 rotate-90 text-ink md:rotate-0" />
    </div>
  );
}

function OwnershipRule({ className }: { className: string }) {
  return (
    <div aria-hidden className={cn(styles.link, className)}>
      <span className={styles.rule} />
    </div>
  );
}

/**
 * "つながり" as a picture: who owns the company, who supplies it, who buys from it, what it owns, and the ties
 * that have no direction. Every box is a company with its own page; every tie is one the filings state — this
 * company's entry, or a released company's entry that names it (`inbound`). A lane with nobody in it is not drawn,
 * and with nobody at all the map is not drawn either: an empty diagram would claim the company stands alone.
 */
export function ConnectionMap({ company, lanes }: { company: Company; lanes: Record<Lane, Connection[]> }) {
  const has = (lane: Lane) => lanes[lane].length > 0;
  if (!(["owners", "up", "down", "group", "other"] as const).some(has)) return null;

  return (
    <figure aria-labelledby={`${company.id}-connections-caption`}>
      <div className={styles.map}>
        {has("owners") && (
          <>
            <LaneBox lane="owners" items={lanes.owners} className={styles.owners} />
            <OwnershipRule className={styles.linkOwners} />
          </>
        )}
        {has("up") && (
          <>
            <LaneBox lane="up" items={lanes.up} className={styles.up} />
            <TradeArrow className={styles.linkUp} />
          </>
        )}
        <div
          className={cn(
            styles.center,
            "flex min-h-20 flex-col items-center justify-center rounded-md bg-foreground px-5 py-4 text-center text-background",
          )}
        >
          {company.shortNameEn && (
            <span className="wordmark text-[1.375rem]" aria-hidden>
              {company.shortNameEn}
            </span>
          )}
          <span className={cn("text-sm", company.shortNameEn && "mt-1 opacity-80")}>{company.name}</span>
        </div>
        {has("down") && (
          <>
            <TradeArrow className={styles.linkDown} />
            <LaneBox lane="down" items={lanes.down} className={styles.down} />
          </>
        )}
        {has("group") && (
          <>
            <OwnershipRule className={styles.linkGroup} />
            <LaneBox lane="group" items={lanes.group} className={styles.group} />
          </>
        )}
      </div>
      {has("other") && <LaneBox lane="other" items={lanes.other} className="mt-6" />}
      <figcaption id={`${company.id}-connections-caption`} className="mt-5 text-xs leading-5 text-muted-foreground">
        有価証券報告書に書かれた関係だけを表示しています。矢印はモノやサービスの流れ、縦の線は資本関係、点線の枠は向きのない関係です。
        関係ごとの説明と出典は下の一覧にあります。
      </figcaption>
    </figure>
  );
}
