"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toPlainText } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import { formatYen } from "@/lib/utils/format";
import { COMPANY_NODE, type ValueChain, type ValueChainLink } from "@/lib/value-chain";
import { SegmentMark } from "./business-structure";

type Mode = "all" | "goods" | "money";
const MODES: { id: Mode; label: string }[] = [
  { id: "all", label: "すべて表示" },
  { id: "goods", label: "モノの流れ" },
  { id: "money", label: "お金の流れ" },
];

type Path = { key: string; d: string; flow: ValueChainLink["flow"]; ends: [string, string] };

/**
 * The value chain as a diagram (JCE-038, after the operator's reference): 調達 → the company's businesses → 顧客,
 * with the goods and the money drawn as two kinds of line and a switch between them. A Client Component because the
 * switch, the selection and the lines (drawn between the cards as they are laid out) need the browser.
 *
 * What it draws is `buildValueChain`'s graph and nothing more: no line has a width, because no filing prints a
 * flow's size; a business's bar is its printed segment revenue. On a phone the columns stack and the lines are not
 * drawn — selecting a card still lists what it is tied to, so nothing is only in the lines.
 */
export function ValueChainFlow({ chain, companyName }: { chain: ValueChain; companyName: string }) {
  const [mode, setMode] = useState<Mode>("all");
  const largest = [...chain.segments].sort((a, b) => (b.amount ?? -1) - (a.amount ?? -1))[0];
  const [selected, setSelected] = useState<string>(largest?.id ?? COMPANY_NODE);

  const container = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const root = container.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const rect = (id: string) => root.querySelector<HTMLElement>(`[data-node="${id}"]`)?.getBoundingClientRect();
    const next: Path[] = [];
    for (const link of chain.links) {
      // Each tie is drawn once per flow, always from its left card to its right one; money only changes the arrow.
      const [left, right] = link.flow === "goods" ? [link.source, link.target] : [link.target, link.source];
      const a = rect(left);
      const b = rect(right);
      if (!a || !b || a.width === 0) continue;
      const offset = link.flow === "goods" ? -6 : 6;
      const x1 = a.right - box.left;
      const y1 = a.top + a.height / 2 - box.top + offset;
      const x2 = b.left - box.left;
      const y2 = b.top + b.height / 2 - box.top + offset;
      const mid = (x1 + x2) / 2;
      const d = link.flow === "goods"
        ? `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2 - 4},${y2}`
        : `M${x2},${y2} C${mid},${y2} ${mid},${y1} ${x1 + 4},${y1}`;
      next.push({ key: `${link.flow}:${left}:${right}`, d, flow: link.flow, ends: [left, right] });
    }
    setPaths(next);
    setSize({ width: box.width, height: box.height });
  }, [chain.links]);

  useLayoutEffect(() => {
    measure();
    const root = container.current;
    if (!root) return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [measure]);

  const tied = useMemo(() => {
    const set = new Set<string>([selected]);
    for (const link of chain.links) {
      if (link.source === selected) set.add(link.target);
      if (link.target === selected) set.add(link.source);
    }
    return set;
  }, [chain.links, selected]);

  const nodeClass = (id: string) =>
    cn(
      "w-full rounded-md border bg-card px-4 py-3 text-left transition-[opacity,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
      id === selected ? "border-ink ring-1 ring-ink" : "border-border hover:border-foreground",
      !tied.has(id) && "md:opacity-55",
    );

  const shown = (flow: ValueChainLink["flow"]) => mode === "all" || mode === flow;

  return (
    <div>
      <div role="group" aria-label="表示する流れ" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm transition-colors",
              mode === m.id ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div ref={container} className="relative mt-5 rounded-md border border-border bg-card p-4 md:p-6">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          width={size.width}
          height={size.height}
        >
          <defs>
            <marker id="vc-goods" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--ink)" />
            </marker>
            <marker id="vc-money" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--segment-5)" />
            </marker>
          </defs>
          {paths.filter((p) => shown(p.flow)).map((p) => (
            <path
              key={p.key}
              d={p.d}
              fill="none"
              stroke={p.flow === "goods" ? "var(--ink)" : "var(--segment-5)"}
              strokeWidth={1.5}
              strokeDasharray={p.flow === "money" ? "2 4" : undefined}
              strokeLinecap="round"
              markerEnd={`url(#vc-${p.flow})`}
              opacity={p.ends.includes(selected) ? 1 : 0.35}
            />
          ))}
        </svg>

        <div
          className={cn(
            "relative grid gap-6 md:gap-16",
            chain.suppliers.length > 0 ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)]" : "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
          )}
        >
          {chain.suppliers.length > 0 && (
            <Column title="調達">
              {chain.suppliers.map((s) => (
                <button key={s.id} type="button" data-node={s.id} aria-pressed={selected === s.id} onClick={() => setSelected(s.id)} className={nodeClass(s.id)}>
                  <span className="block text-sm font-semibold">{s.name}</span>
                </button>
              ))}
            </Column>
          )}

          <Column title="自社の事業">
            <div
              data-node={COMPANY_NODE}
              className={cn("space-y-2 rounded-md border border-dashed p-2", selected === COMPANY_NODE ? "border-ink" : "border-border")}
            >
              <p className="px-2 pt-1 text-xs font-semibold text-muted-foreground">{companyName}</p>
              {chain.segments.map((s, i) => (
                <button key={s.id} type="button" data-node={s.id} aria-pressed={selected === s.id} onClick={() => setSelected(s.id)} className={nodeClass(s.id)}>
                  <span className="flex items-center gap-2">
                    <SegmentMark index={i} />
                    <span className="min-w-0 text-sm font-semibold">{s.name}</span>
                    {s.share !== null && <span className="figures ml-auto text-xs text-muted-foreground">{s.share.toFixed(1)}%</span>}
                  </span>
                  {s.share !== null && (
                    <span aria-hidden className="mt-2 block h-1.5 rounded-full bg-muted">
                      <span className="block h-full rounded-full" style={{ width: `${Math.max(s.share, 1)}%`, background: `var(--segment-${(i % 6) + 1})` }} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Column>

          <Column title="顧客">
            {chain.customers.length === 0 ? (
              <p className="text-xs leading-6 text-muted-foreground">顧客の書かれた事業がありません。</p>
            ) : (
              chain.customers.map((c) => (
                <button key={c.id} type="button" data-node={c.id} aria-pressed={selected === c.id} onClick={() => setSelected(c.id)} className={nodeClass(c.id)}>
                  <span className="block text-sm leading-6">{c.name}</span>
                </button>
              ))
            )}
          </Column>
        </div>

        {chain.suppliers.length === 0 && (
          // Said, not left blank: an absent column would read as "buys nothing" rather than "not established".
          <p className="relative mt-6 text-xs leading-6 text-muted-foreground">調達先は、有価証券報告書から一般的な呼び名で確かめられたものがまだないため描いていません。</p>
        )}
        <ul aria-label="線の種類" className="relative mt-6 hidden flex-wrap justify-end gap-x-6 gap-y-1 text-xs text-muted-foreground md:flex">
          <li className="flex items-center gap-2"><span aria-hidden className="h-0 w-8 border-t-[1.5px] border-ink" />モノの流れ（調達・製品・サービス）</li>
          <li className="flex items-center gap-2"><span aria-hidden className="h-0 w-8 border-t-2 border-dotted border-[var(--segment-5)]" />お金の流れ（代金・売上）</li>
        </ul>
      </div>

      <Detail chain={chain} selected={selected} mode={mode} />
    </div>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center gap-2">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

/** What the selected card is and what it is tied to — in words, so the lines are never the only carrier. */
function Detail({ chain, selected, mode }: { chain: ValueChain; selected: string; mode: Mode }) {
  const name = (id: string) =>
    id === COMPANY_NODE
      ? "会社全体"
      : (chain.suppliers.find((s) => s.id === id)?.name ?? chain.segments.find((s) => s.id === id)?.name ?? chain.customers.find((c) => c.id === id)?.name ?? id);
  const ties = (flow: ValueChainLink["flow"]) => chain.links.filter((l) => l.flow === flow && (l.source === selected || l.target === selected));
  const lines = (["goods", "money"] as const)
    .filter((flow) => mode === "all" || mode === flow)
    .flatMap((flow) => ties(flow).map((l) => `${name(l.source)} → ${name(l.target)}（${l.label}）`));

  const supplier = chain.suppliers.find((s) => s.id === selected);
  const segment = chain.segments.find((s) => s.id === selected);
  const customer = chain.customers.find((c) => c.id === selected);

  return (
    <section aria-live="polite" className="mt-5 rounded-md border border-border bg-card p-5 md:p-6">
      {segment && (
        <>
          <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-3">
            <h3 className="font-serif text-lg font-semibold">{segment.name}</h3>
            <span className="rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">事業</span>
          </div>
          {(segment.amount !== null || segment.products.length > 0) && (
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              {segment.amount !== null && chain.revenue && (
                <div>
                  <dt className="text-xs text-muted-foreground">{chain.revenue.label}（{chain.revenue.fiscalYear}）</dt>
                  <dd className="figures mt-1 font-serif text-lg font-semibold">{formatYen(segment.amount)}</dd>
                </div>
              )}
              {segment.share !== null && (
                <div>
                  <dt className="text-xs text-muted-foreground">事業の合計に占める割合（計算値）</dt>
                  <dd className="figures mt-1 font-serif text-lg font-semibold">{segment.share.toFixed(1)}%</dd>
                </div>
              )}
              {segment.products.length > 0 && (
                <div>
                  <dt className="text-xs text-muted-foreground">主な製品・サービス</dt>
                  <dd className="mt-1 text-sm leading-6">{segment.products.slice(0, 4).join("、")}</dd>
                </div>
              )}
            </dl>
          )}
          <p className="mt-4 text-[0.9375rem] leading-7">{toPlainText(segment.description)}</p>
        </>
      )}
      {supplier && (
        <>
          <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-3">
            <h3 className="font-serif text-lg font-semibold">{supplier.name}</h3>
            <span className="rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">調達先</span>
          </div>
          <p className="mt-4 text-[0.9375rem] leading-7">{toPlainText(supplier.description)}</p>
        </>
      )}
      {customer && (
        <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-3">
          <h3 className="font-serif text-lg font-semibold">{customer.name}</h3>
          <span className="rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">顧客</span>
        </div>
      )}
      {lines.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">つながり</h4>
          <ul className="mt-2 space-y-1 text-sm leading-6">
            {lines.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

