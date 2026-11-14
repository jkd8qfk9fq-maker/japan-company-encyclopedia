"use client";

import { ArrowDown, ArrowRight, BookMarked, Compass } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import type { DiscoverCard } from "@/lib/discover";
import { discoveredStore, recordDiscovered } from "@/lib/storage/stores";
import { formatYen } from "@/lib/utils/format";
import { dailyOrder, loadDiscoverFeed, todayInJapan } from "./discover-data";

const SHINDAN_URL = "https://shindan.kigyo-hyakka.com";
const PAGE = 8;
// A card counts as met once it has filled most of the screen for a moment, not when it flicks past.
const MEET_AFTER_MS = 900;

type Slot =
  | { kind: "intro" }
  | { kind: "company"; id: string; via?: { from: string; label: string } }
  | { kind: "promo"; n: number };

/**
 * The discovery feed (JCE-046): one company per screen, swiped vertically with CSS scroll snapping — no gesture
 * library, the browser's own scrolling is the swipe. Tapping a related company puts it next, so a reader can follow
 * competitors and suppliers from card to card; every card leads to the full entry.
 */
export function DiscoverFeed() {
  const [cards, setCards] = useState<DiscoverCard[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [industry, setIndustry] = useState<string>("all");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [shown, setShown] = useState(PAGE);
  const discovered = useLocalStore(discoveredStore);
  const scroller = useRef<HTMLDivElement>(null);
  const day = useMemo(() => todayInJapan(), []);

  useEffect(() => {
    loadDiscoverFeed().then(setCards, () => setFailed(true));
  }, []);

  const byId = useMemo(() => new Map((cards ?? []).map((c) => [c.id, c])), [cards]);

  const ordered = useMemo(() => {
    if (!cards) return [];
    const pool = industry === "all" ? cards : cards.filter((c) => c.industry.id === industry);
    // Companies already in the reader's collection go to the back: the feed is for meeting new ones.
    const met = new Set(discoveredStore.get());
    const order = dailyOrder(pool, day);
    return [...order.filter((c) => !met.has(c.id)), ...order.filter((c) => met.has(c.id))];
    // The collection is read once per filter on purpose: re-sorting while the reader swipes would move cards away.
  }, [cards, industry, day]);

  useEffect(() => {
    if (!cards) return;
    const next: Slot[] = [{ kind: "intro" }];
    ordered.forEach((c, i) => {
      next.push({ kind: "company", id: c.id });
      if ((i + 1) % 9 === 0) next.push({ kind: "promo", n: (i + 1) / 9 });
    });
    // Rebuilding the slot list is the reaction to a new filter or the feed arriving, not derived render state:
    // followed companies are spliced into it afterwards and must survive until the filter changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlots(next);
    setShown(PAGE);
    scroller.current?.scrollTo({ top: 0 });
  }, [ordered, cards]);

  const follow = useCallback((at: number, from: DiscoverCard, to: { id: string; label: string }) => {
    setSlots((current) => {
      const next = [...current];
      next.splice(at + 1, 0, { kind: "company", id: to.id, via: { from: from.name, label: to.label } });
      return next;
    });
    setShown((n) => Math.max(n, at + 3));
    // Wait for the inserted card to render before moving to it.
    requestAnimationFrame(() => {
      const el = scroller.current?.querySelector<HTMLElement>(`[data-slot="${at + 1}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // Track which card fills the screen: record it in the collection, and render more before the reader reaches the end.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const timers = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const index = Number(el.dataset.slot);
          if (entry.isIntersecting) {
            setShown((n) => (index + 3 > n ? n + PAGE : n));
            const id = el.dataset.company;
            if (id) timers.set(el, window.setTimeout(() => recordDiscovered(id), MEET_AFTER_MS));
          } else {
            window.clearTimeout(timers.get(el));
            timers.delete(el);
          }
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-slot]").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [slots, shown]);

  const industries = useMemo(() => {
    const counts = new Map<string, { id: string; name: string; count: number }>();
    for (const c of cards ?? []) {
      const entry = counts.get(c.industry.id) ?? { id: c.industry.id, name: c.industry.name, count: 0 };
      entry.count++;
      counts.set(c.industry.id, entry);
    }
    return [...counts.values()].sort((a, b) => b.count - a.count);
  }, [cards]);

  if (failed) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-white/80">
        カードを読み込めませんでした。通信状態を確かめて、もう一度開いてください。
      </div>
    );
  }

  const today = ordered.slice(0, 3);

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-0 top-0 z-20 flex gap-2 overflow-x-auto px-4 pt-3 pb-2 [scrollbar-width:none]">
        {[{ id: "all", name: "すべて" }, ...industries].map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => setIndustry(i.id)}
            aria-pressed={industry === i.id}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur transition-colors ${
              industry === i.id ? "border-white bg-white text-neutral-950" : "border-white/25 bg-black/30 text-white/85 hover:bg-white/15"
            }`}
          >
            {i.name}
          </button>
        ))}
      </div>

      <div ref={scroller} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]">
        {cards === null ? (
          <div className="flex h-full items-center justify-center text-sm text-white/70">企業を集めています…</div>
        ) : (
          slots.slice(0, shown).map((slot, index) => {
            if (slot.kind === "intro") {
              return <IntroCard key="intro" index={index} today={today} met={discovered.length} total={cards.length} />;
            }
            if (slot.kind === "promo") return <PromoCard key={`promo-${slot.n}`} index={index} n={slot.n} />;
            const card = byId.get(slot.id);
            if (!card) return null;
            return (
              <CompanyCard
                key={`${slot.id}-${index}`}
                index={index}
                card={card}
                via={slot.via}
                inCollection={discovered.includes(card.id)}
                onFollow={(to) => follow(index, card, to)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function Screen({ index, company, children, className = "" }: { index: number; company?: string; children: React.ReactNode; className?: string }) {
  return (
    <section data-slot={index} data-company={company} className={`relative flex h-full snap-start snap-always flex-col overflow-hidden ${className}`}>
      {children}
    </section>
  );
}

function IntroCard({ index, today, met, total }: { index: number; today: DiscoverCard[]; met: number; total: number }) {
  return (
    <Screen index={index} className="justify-center-safe bg-[radial-gradient(120%_80%_at_80%_0%,#1e3a5f_0%,#0a0f1a_55%,#05070b_100%)] px-6 pt-20 pb-14 text-white">
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-300">DISCOVER</p>
      <h1 className="mt-2 font-serif text-[2rem] leading-tight font-semibold">
        今日、出会う
        <br />
        日本の会社。
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70 [@media(max-height:700px)]:hidden">
        上にスワイプすると、次の会社。気になる会社のつながりをたどると、知らなかった会社に出会えます。
      </p>
      <div className="mt-6 max-w-sm">
        <p className="text-xs font-semibold text-white/60">今日の3社</p>
        <ol className="mt-2 space-y-2">
          {today.map((c, i) => (
            <li key={c.id} className="flex items-baseline gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <span className="figures text-amber-300">{i + 1}</span>
              <span className="min-w-0 truncate font-medium">{c.name}</span>
              <span className="ml-auto shrink-0 text-xs text-white/50">{c.industry.name}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-6 flex items-center gap-4 text-sm">
        <Link href="/discover/collection" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 hover:bg-white/10">
          <BookMarked className="size-4" aria-hidden />
          マイ企業図鑑 <span className="figures">{met}</span>/<span className="figures">{total}</span>
        </Link>
      </div>
      <p className="mt-6 max-w-sm text-[0.6875rem] leading-relaxed text-white/45 [@media(max-height:700px)]:mt-3">
        カードの内容は各社の有価証券報告書をもとにした百科事典の記載です。良い会社のおすすめや投資の判断材料ではありません。
      </p>
      <ArrowDown className="absolute bottom-3 left-1/2 size-5 -translate-x-1/2 animate-bounce text-white/60" aria-hidden />
    </Screen>
  );
}

function CompanyCard({
  index,
  card,
  via,
  inCollection,
  onFollow,
}: {
  index: number;
  card: DiscoverCard;
  via?: { from: string; label: string };
  inCollection: boolean;
  onFollow: (to: { id: string; label: string }) => void;
}) {
  return (
    <Screen index={index} company={card.id} className="bg-neutral-950 text-white">
      {/* The industry's photograph, never the company's own: it shows the kind of work (JCE-031). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={card.image} alt="" loading="lazy" className="absolute inset-x-0 top-0 h-[58%] w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-neutral-950/70 to-neutral-950" aria-hidden />
      <div className="relative mt-auto flex flex-col gap-3 px-5 pt-16 pb-5 [@media(max-height:700px)]:gap-2 [@media(max-height:700px)]:pb-3">
        {via && (
          <p className="text-xs text-amber-300">
            {via.from}の{via.label}から
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link href={`/industries/${card.industry.id}`} className="rounded-sm bg-amber-300 px-2 py-0.5 font-semibold text-neutral-950">
            {card.industry.name}
          </Link>
          {card.revenue && (
            <span className="text-white/60">
              売上高 <span className="figures">{formatYen(card.revenue.amount)}</span>（{card.revenue.fiscalYear}）
            </span>
          )}
        </div>
        <h2 className={`font-serif leading-tight font-semibold ${card.name.length > 10 ? "text-[1.5rem]" : "text-[1.875rem]"}`}>{card.name}</h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-white/85 [@media(max-height:700px)]:line-clamp-2">{card.description}</p>
        {card.hook && <Hook hook={card.hook} />}
        {/* The businesses only when there is no one to follow: following is how the feed moves on, and the
            businesses are the first thing on the full page. */}
        {card.businesses.length > 0 && card.related.length === 0 && (
          <ul className="flex flex-wrap gap-1.5 text-xs">
            {card.businesses.map((b) => (
              <li key={b} className="rounded-full border border-white/20 px-2.5 py-1 text-white/80">
                {b}
              </li>
            ))}
          </ul>
        )}
        {card.related.length > 0 && (
          <div>
            <p className="text-[0.6875rem] font-semibold text-white/50 [@media(max-height:700px)]:sr-only">つながる会社へ進む</p>
            <ul className="mt-1.5 flex gap-2 overflow-x-auto [scrollbar-width:none] [@media(max-height:700px)]:mt-0">
              {card.related.map((r) => (
                <li key={r.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onFollow(r)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-left text-sm backdrop-blur hover:bg-white/20 [@media(max-height:700px)]:py-1.5"
                  >
                    <span className="text-[0.6875rem] text-amber-300">{r.label}</span>
                    <span className="font-medium">{r.name}</span>
                    <ArrowRight className="size-3.5 text-white/60" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <Link
            href={`/companies/${card.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-white/90"
          >
            <Compass className="size-4" aria-hidden />
            くわしく見る
          </Link>
          <span className={`text-xs ${inCollection ? "text-amber-300" : "text-white/40"}`}>{inCollection ? "図鑑に記録済み" : "図鑑に記録中…"}</span>
        </div>
      </div>
    </Screen>
  );
}

function Hook({ hook }: { hook: NonNullable<DiscoverCard["hook"]> }) {
  if (hook.kind === "overseas") {
    return (
      <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5">
        <p className="text-sm">
          売上の <span className="figures text-xl font-semibold text-amber-300">{hook.percent}%</span> が海外
        </p>
        <p className="mt-1 text-[0.6875rem] text-white/55">
          計算値：{hook.formula}（{hook.fiscalYear}）
        </p>
      </div>
    );
  }
  if (hook.kind === "advantage") {
    return (
      <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5">
        <p className="text-[0.6875rem] font-semibold text-amber-300">有価証券報告書が書く強み</p>
        <p className="mt-1 text-sm leading-relaxed text-white/90 [@media(max-height:700px)]:line-clamp-2">{hook.text}</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5">
      <p className="text-[0.6875rem] font-semibold text-amber-300">沿革のはじまり</p>
      <p className="mt-1 text-sm">
        <span className="figures text-xl font-semibold text-amber-300">{hook.year}</span>年　{hook.title}
      </p>
    </div>
  );
}

// The two YUGENQ diagnoses, between every ninth company: the feed shows what exists, these say which fits the reader.
function PromoCard({ index, n }: { index: number; n: number }) {
  const first = n % 2 === 1;
  return (
    <Screen index={index} className="justify-center bg-[radial-gradient(120%_80%_at_20%_100%,#3b2a0a_0%,#0a0a0a_60%)] px-6 text-white">
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-300">{first ? "最初の一社" : "企業タイプ診断"}</p>
      <h2 className="mt-3 font-serif text-[1.875rem] leading-tight font-semibold">
        {first ? (
          <>
            気になった会社、
            <br />
            理由を言えますか？
          </>
        ) : (
          <>
            あなたに近いのは、
            <br />
            どんなタイプの会社？
          </>
        )}
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
        {first
          ? "気になる会社を1社選んで、なぜ気になるのかを言葉にしてみる。会社を知る一歩目のためのサービスです。"
          : "質問に答えると16のタイプのどれかになり、同じ4つの軸で分析した業界と会社がわかります。回答はブラウザの外に送られません。"}
      </p>
      <a
        href={first ? `${SHINDAN_URL}/first/` : `${SHINDAN_URL}/`}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-200"
      >
        {first ? "最初の一社を見つける" : "診断してみる"}
        <ArrowRight className="size-4" aria-hidden />
      </a>
      <p className="mt-6 text-xs text-white/45">上にスワイプすると、フィードの続き。</p>
    </Screen>
  );
}
