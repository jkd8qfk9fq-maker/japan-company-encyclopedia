"use client";

import Image from "next/image";
import Link from "next/link";
import { INDUSTRY_IMAGES } from "@/assets/industries";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { IndustryMapData, MapFlow } from "@/lib/industry-map";
import type { IndustryId } from "@/types/company";

/** Wide screens and phones draw the same diagram, each with its own measurements. */
const LAYOUTS = [
  { width: 900, left: 210, right: 690, row: 40, top: 28, font: 15, stroke: 2, className: "hidden md:block" },
  { width: 360, left: 124, right: 236, row: 34, top: 14, font: 11.5, stroke: 1.2, className: "md:hidden" },
];

function involves(flow: MapFlow, id: IndustryId | null) {
  return id !== null && (flow.from === id || flow.to === id);
}

/**
 * The industry-to-industry map. A Client Component for one reason: choosing an industry — by its button or by its
 * name in the diagram — highlights its lines and opens the list of its companies without a page load. Everything it
 * shows is computed on the server (buildIndustryMap) and passed in; it fetches nothing.
 *
 * Two columns, sellers left and buyers right, line width = number of company pairs. A phone gets the same diagram
 * drawn at its own size (operator request, 2026-11-01), so it is read as a picture there too, not as a list.
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

          {/* The same diagram twice, laid out for each width: a phone gets its own geometry at its real size (labels at
              11–12px), not the wide one shrunk until its text is unreadable. */}
          {LAYOUTS.map((layout) => {
            const rowY = (list: IndustryId[], id: IndustryId) => layout.top + list.indexOf(id) * layout.row + layout.row / 2;
            const height = layout.top * 2 + Math.max(sellers.length, buyers.length, 1) * layout.row;
            const mid = (layout.left + layout.right) / 2;
            return (
              <svg
                key={layout.width}
                viewBox={`0 0 ${layout.width} ${height}`}
                className={cn("mt-2 h-auto w-full", layout.className)}
                role="img"
                aria-label="業界から業界への取引関係の図。産業を選ぶと、その業界の企業と取引の組が下に開きます。"
              >
                <g fill="none" strokeLinecap="round">
                  {data.flows.map((flow) => {
                    const y1 = rowY(sellers, flow.from);
                    const y2 = rowY(buyers, flow.to);
                    const lit = involves(flow, selected);
                    return (
                      <path
                        key={`${flow.from}>${flow.to}`}
                        d={`M${layout.left} ${y1} C${mid} ${y1} ${mid} ${y2} ${layout.right} ${y2}`}
                        stroke="var(--ink)"
                        strokeOpacity={selected ? (lit ? 0.85 : 0.08) : 0.35}
                        strokeWidth={layout.stroke + flow.pairs.length * layout.stroke}
                      />
                    );
                  })}
                </g>
                {([
                  [sellers, "s"],
                  [buyers, "b"],
                ] as const).map(([list, side]) =>
                  list.map((id) => {
                    const cy = rowY(list, id);
                    const left = side === "s";
                    const x = left ? layout.left : layout.right;
                    return (
                      <g key={`${side}-${id}`} onClick={() => select(id)} className="cursor-pointer">
                        {/* A row-high hit area, so a thumb can choose an industry on a phone. */}
                        <rect
                          x={left ? 0 : x}
                          y={cy - layout.row / 2}
                          width={left ? x : layout.width - x}
                          height={layout.row}
                          fill="transparent"
                        />
                        <rect
                          x={left ? x - 4 : x}
                          y={cy - layout.row * 0.3}
                          width={4}
                          height={layout.row * 0.6}
                          fill={selected === id ? "var(--ink)" : "currentColor"}
                        />
                        <text
                          x={left ? x - 10 : x + 10}
                          y={cy + layout.font * 0.35}
                          textAnchor={left ? "end" : "start"}
                          fontSize={layout.font}
                          fill={selected === id ? "var(--ink)" : "currentColor"}
                          fontWeight={selected === id ? 700 : 400}
                        >
                          {name.get(id)}
                        </text>
                      </g>
                    );
                  }),
                )}
              </svg>
            );
          })}
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
