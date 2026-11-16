"use client";

import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FavoriteButton } from "@/components/company/favorite-button";
import type { ConnectionsData } from "@/lib/engagement-data";
import { GROUP_LABEL, GROUP_OF, INWARD_LABEL, OUTWARD_LABEL, type RelationGroup } from "@/lib/relationship-labels";
import { recordDiscovered, recordExploreStep } from "@/lib/storage/stores";
import type { RelationshipKind } from "@/types/company";
import { loadConnections } from "./load";

type Neighbour = { id: string; label: string; group: RelationGroup };
const GROUPS: RelationGroup[] = ["trade", "peers", "capital"];

/** Read ?from= without useSearchParams, so the static page needs no Suspense boundary and renders its shell at once. */
const fromQuery = () => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("from"));

/**
 * つながりをたどる (JCE-052): one company in the middle, its relations around it read from both ends (the supplier's
 * customer is the same fact as the customer's supplier), and a trail back. Every relation is one an entry states with
 * a source; the full sentence and its source are on the company's page.
 */
export function ConnectionExplorer() {
  const [data, setData] = useState<ConnectionsData | null>(null);
  const [failed, setFailed] = useState(false);
  const [trail, setTrail] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadConnections().then((d) => {
      setData(d);
      const start = fromQuery();
      if (start && d.nodes.some((n) => n.id === start)) setTrail([start]);
    }, () => setFailed(true));
  }, []);

  const byId = useMemo(() => new Map((data?.nodes ?? []).map((n) => [n.id, n])), [data]);
  const adjacency = useMemo(() => {
    const map = new Map<string, Neighbour[]>();
    const add = (from: string, n: Neighbour) => {
      const list = map.get(from) ?? [];
      if (!list.some((x) => x.id === n.id && x.label === n.label)) list.push(n);
      map.set(from, list);
    };
    for (const [a, b, kind] of data?.edges ?? []) {
      const k = kind as RelationshipKind;
      add(a, { id: b, label: OUTWARD_LABEL[k], group: GROUP_OF[k] });
      add(b, { id: a, label: INWARD_LABEL[k], group: GROUP_OF[k] });
    }
    return map;
  }, [data]);

  const go = useCallback((id: string, fromTrailIndex?: number) => {
    setTrail((t) => (fromTrailIndex !== undefined ? t.slice(0, fromTrailIndex + 1) : [...t, id]));
    if (fromTrailIndex === undefined) {
      recordExploreStep();
      recordDiscovered(id);
    }
    window.history.replaceState(null, "", `?from=${encodeURIComponent(id)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (failed) return <p className="text-sm text-muted-foreground">つながりを読み込めませんでした。通信状態を確かめて、もう一度開いてください。</p>;
  if (!data) return <p className="text-sm text-muted-foreground">つながりを集めています…</p>;

  const current = trail.at(-1);
  const center = current ? byId.get(current) : undefined;

  if (!center) {
    // Where to start: the companies with the most stated relations, and a search over every connected company.
    const hubs = [...adjacency.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 9).map(([id]) => byId.get(id)!).filter(Boolean);
    const matches = query.trim() ? data.nodes.filter((n) => n.name.includes(query.trim())).slice(0, 12) : [];
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
        <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <span className="sr-only">会社名で探す</span>
          <input
            id="explore-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="会社名で探す（例：トヨタ）"
            className="min-h-11 w-full bg-transparent text-sm outline-none"
          />
        </label>
        {matches.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {matches.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => go(n.id)} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground">
                  {n.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">つながりの多い会社から始める</p>
          <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-3">
            {hubs.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => go(n.id)} className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-left hover:border-foreground">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{n.name}</span>
                    <span className="block text-xs text-muted-foreground">{n.industryName} ・ {adjacency.get(n.id)?.length ?? 0}のつながり</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">{data.nodes.length}社・{data.edges.length}本のつながり。どれも各社の有価証券報告書などの出典にもとづく記載です。</p>
      </div>
    );
  }

  const neighbours = adjacency.get(center.id) ?? [];
  const flows = center.industry ? data.industryFlows.filter((f) => f.from === center.industry || f.to === center.industry).slice(0, 6) : [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <nav aria-label="たどった道" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <button type="button" onClick={() => setTrail([])} className="rounded-full px-2 py-1 hover:text-foreground">はじめから</button>
        {trail.map((id, i) => (
          <span key={`${id}-${i}`} className="flex items-center gap-1">
            <span aria-hidden>›</span>
            {i === trail.length - 1 ? (
              <span className="font-medium text-foreground">{byId.get(id)?.name}</span>
            ) : (
              <button type="button" onClick={() => go(id, i)} className="rounded-full px-1 py-1 underline-offset-2 hover:text-foreground hover:underline">
                {byId.get(id)?.name}
              </button>
            )}
          </span>
        ))}
      </nav>

      <div className="rounded-md border border-foreground/20 bg-card p-5">
        {center.industry && (
          <Link href={`/industries/${center.industry}`} className="text-xs font-semibold text-seal hover:underline">
            {center.industryName}
          </Link>
        )}
        <h2 className="mt-1 font-serif text-2xl font-semibold">{center.name}</h2>
        {center.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{center.description}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href={`/companies/${center.id}#connections`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background">
            くわしく見る
          </Link>
          <FavoriteButton companyId={center.id} companyName={center.name} />
          <Link href={`/network?from=${center.id}`} className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm hover:border-foreground">
            立体で見る
          </Link>
          {trail.length > 1 && (
            <button type="button" onClick={() => go(trail[trail.length - 2], trail.length - 2)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-4 text-sm hover:border-foreground">
              <ArrowLeft className="size-4" aria-hidden />
              ひとつ戻る
            </button>
          )}
        </div>
      </div>

      {GROUPS.map((group) => {
        const items = neighbours.filter((n) => n.group === group && byId.has(n.id));
        if (items.length === 0) return null;
        return (
          <section key={group} aria-label={GROUP_LABEL[group]}>
            <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{GROUP_LABEL[group]}</h3>
            <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
              {items.map((n) => {
                const node = byId.get(n.id)!;
                const visited = trail.includes(n.id);
                return (
                  <li key={`${n.id}-${n.label}`}>
                    <button type="button" onClick={() => go(n.id)} className="flex w-full items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-left hover:border-foreground">
                      <span className="w-16 shrink-0 text-[0.6875rem] font-semibold text-seal">{n.label}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{node.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {node.industryName}
                          {visited && "・たどった会社"}
                        </span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {neighbours.length === 0 && <p className="text-sm text-muted-foreground">この会社について、百科事典に記載されたつながりはまだありません。</p>}

      {flows.length > 0 && (
        <section aria-label="関連する業界">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">業界どうしのつながり（{center.industryName}）</h3>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {flows.map((f) => {
              const other = f.from === center.industry ? { id: f.to, name: f.toName, dir: "売る先" } : { id: f.from, name: f.fromName, dir: "仕入れる元" };
              return (
                <li key={`${f.from}-${f.to}`}>
                  <Link href={`/industries/${other.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:border-foreground">
                    <span className="text-xs text-muted-foreground">{other.dir}</span>
                    {other.name}
                    <span className="figures text-xs text-muted-foreground">{f.ties}組</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
