"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDUSTRY_IMAGES } from "@/assets/industries";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { IndustryMapData, MapFlow } from "@/lib/industry-map";
import type { IndustryId } from "@/types/company";

const ROW = 40;
const TOP = 28;
const LEFT_X = 210;
const RIGHT_X = 690;

function involves(flow: MapFlow, id: IndustryId | null) {
  return id !== null && (flow.from === id || flow.to === id);
}

/**
 * The industry-to-industry map. A Client Component for one reason: choosing an industry — by its button or by its
 * name in the diagram — highlights its lines and opens the list of its companies without a page load. Everything it
 * shows is computed on the server (buildIndustryMap) and passed in; it fetches nothing.
 *
 * Wide screens get the two-column diagram (sellers left, buyers right, line width = number of company pairs). Phones
 * get the same lines as a list, because a diagram scaled to 360px would set its labels at 6px.
 */
export function IndustryFlowMap({ data }: { data: IndustryMapData }) {
  const [selected, setSelected] = useState<IndustryId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const name = new Map(data.industries.map((i) => [i.id, i.name]));

  const select = (id: IndustryId) => {
    const next = selected === id ? null : id;
    setSelected(next);
    // Bring the list into view: on a phone it is below the fold, and the tap would otherwise seem to do nothing.
    if (next) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const sellers = [...new Set(data.flows.map((f) => f.from))];
  const buyers = [...new Set(data.flows.map((f) => f.to))];
  const height = TOP * 2 + Math.max(sellers.length, buyers.length, 1) * ROW;
  const y = (list: IndustryId[], id: IndustryId) => TOP + list.indexOf(id) * ROW + ROW / 2;
  const industry = data.industries.find((i) => i.id === selected) ?? null;
  const shownFlows = selected ? data.flows.filter((f) => involves(f, selected)) : data.flows;

  return (
    <div>
      <div role="group" aria-label="産業を選ぶ" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {data.industries.map((i) => {
          const lines = data.flows.filter((f) => involves(f, i.id)).length;
          return (
            <button
              key={i.id}
              type="button"
              aria-pressed={selected === i.id}
              onClick={() => select(i.id)}
              className={cn(
                "flex min-h-16 items-center gap-3 overflow-hidden rounded-md border py-2 pr-3 pl-2 text-left transition-colors",
                selected === i.id ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground",
              )}
            >
              <span className="relative size-12 shrink-0 overflow-hidden rounded">
                <Image src={INDUSTRY_IMAGES[i.id]} alt="" fill sizes="3rem" className="object-cover" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-serif text-[0.9375rem] leading-snug font-semibold">{i.name}</span>
                <span className={cn("figures text-xs", selected === i.id ? "opacity-80" : "text-muted-foreground")}>
                  {i.companies.length}社{lines > 0 ? `・線 ${lines}本` : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {data.flows.length > 0 && (
        <div className="mt-10 rounded-md border border-border bg-background p-4 md:p-6">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>売る側の業界</span>
            <span>買う側の業界</span>
          </div>

          <svg
            viewBox={`0 0 900 ${height}`}
            className="mt-2 hidden h-auto w-full md:block"
            role="img"
            aria-label="業界から業界への取引関係の図。同じ内容を下の一覧と企業リストで読めます。"
          >
            <g fill="none" strokeLinecap="round">
              {data.flows.map((flow) => {
                const y1 = y(sellers, flow.from);
                const y2 = y(buyers, flow.to);
                const lit = involves(flow, selected);
                return (
                  <path
                    key={`${flow.from}>${flow.to}`}
                    d={`M${LEFT_X} ${y1} C${(LEFT_X + RIGHT_X) / 2} ${y1} ${(LEFT_X + RIGHT_X) / 2} ${y2} ${RIGHT_X} ${y2}`}
                    stroke="var(--ink)"
                    strokeOpacity={selected ? (lit ? 0.85 : 0.08) : 0.35}
                    strokeWidth={2 + flow.pairs.length * 2}
                  />
                );
              })}
            </g>
            {sellers.map((id) => (
              <g key={`s-${id}`} onClick={() => select(id)} className="cursor-pointer">
                <rect x={LEFT_X - 4} y={y(sellers, id) - 12} width={4} height={24} fill="currentColor" />
                <text
                  x={LEFT_X - 14}
                  y={y(sellers, id) + 5}
                  textAnchor="end"
                  fontSize={15}
                  fill="currentColor"
                  fontWeight={selected === id ? 700 : 400}
                >
                  {name.get(id)}
                </text>
              </g>
            ))}
            {buyers.map((id) => (
              <g key={`b-${id}`} onClick={() => select(id)} className="cursor-pointer">
                <rect x={RIGHT_X} y={y(buyers, id) - 12} width={4} height={24} fill="currentColor" />
                <text x={RIGHT_X + 14} y={y(buyers, id) + 5} fontSize={15} fill="currentColor" fontWeight={selected === id ? 700 : 400}>
                  {name.get(id)}
                </text>
              </g>
            ))}
          </svg>

          <ul className="mt-2 space-y-1 md:hidden">
            {shownFlows.map((flow) => (
              <li key={`${flow.from}>${flow.to}`} className="flex min-h-9 items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 text-right">{name.get(flow.from)}</span>
                <ArrowRight aria-label="から" className="size-4 shrink-0 text-ink" />
                <span className="min-w-0 flex-1">{name.get(flow.to)}</span>
                <span className="figures w-10 shrink-0 text-right text-xs text-muted-foreground">{flow.pairs.length}組</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={panelRef} aria-live="polite" className="mt-10 scroll-mt-32">
        {industry ? (
          <section aria-labelledby="industry-panel-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-foreground pb-3">
              <h3 id="industry-panel-heading" className="font-serif text-2xl font-semibold">
                {industry.name}の企業
                <span className="figures ml-3 text-sm font-normal text-muted-foreground">{industry.companies.length}社</span>
              </h3>
              <Link href={`/industries/${industry.id}`} className="link-ink inline-flex min-h-11 items-center text-sm">
                {industry.name}業界のページへ
              </Link>
            </div>

            {shownFlows.length > 0 && (
              <ul className="mt-5 space-y-3 text-sm">
                {shownFlows.map((flow) => (
                  <li key={`${flow.from}>${flow.to}`}>
                    <p className="font-medium">
                      {name.get(flow.from)} → {name.get(flow.to)}
                    </p>
                    <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                      {flow.pairs.map((pair) => (
                        <li key={`${pair.sellerId}>${pair.buyerId}`}>
                          <Link href={`/companies/${pair.sellerId}`} className="link-ink">
                            {pair.sellerName}
                          </Link>
                          {" → "}
                          <Link href={`/companies/${pair.buyerId}`} className="link-ink">
                            {pair.buyerName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {industry.companies.map((company) => (
                <li key={company.id} className="rounded-md border border-border p-4">
                  <Link href={`/companies/${company.id}`} className="font-serif text-lg font-semibold hover:underline">
                    {company.name}
                  </Link>
                  {!company.primary && <span className="ml-2 text-xs text-muted-foreground">（主な業界は別）</span>}
                  {company.ties.length > 0 && (
                    <dl className="mt-2 space-y-1 text-sm">
                      {(["仕入先", "顧客"] as const).map((role) => {
                        const list = company.ties.filter((t) => t.role === role);
                        if (list.length === 0) return null;
                        return (
                          <div key={role} className="flex gap-2">
                            <dt className="shrink-0 text-muted-foreground">{role}</dt>
                            <dd className="flex flex-wrap gap-x-3">
                              {list.map((tie) => (
                                <Link key={tie.companyId} href={`/companies/${tie.companyId}`} className="link-ink">
                                  {tie.companyName}
                                </Link>
                              ))}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="text-sm text-muted-foreground">産業を選ぶと、その産業の企業と取引のつながりが一覧で表示されます。</p>
        )}
      </div>
    </div>
  );
}
