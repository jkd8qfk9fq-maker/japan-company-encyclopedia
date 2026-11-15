"use client";

import { ArrowDown, ArrowRight, BookMarked, Check, Compass, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import type { DiscoverCard } from "@/lib/discover";
import { computeStreak } from "@/lib/streak";
import { activityStore, discoveredStore, followedIndustriesStore, jstToday, recordDiscovered, toggleFollowedIndustry } from "@/lib/storage/stores";
import { formatYen } from "@/lib/utils/format";
import { feedOrder, loadDiscoverFeed, todayInJapan } from "./discover-data";

const SHINDAN_URL = "https://shindan.kigyo-hyakka.com";
const PAGE = 8;
// A card counts as met once it has filled most of the screen for a moment, not when it flicks past.
const MEET_AFTER_MS = 900;

type Slot =
  | { kind: "intro" }
  | { kind: "company"; id: string; via?: { from: string; label: string } }
  | { kind: "promo"; n: number }
  | { kind: "pause"; met: number };

/** A pause after this many companies (JCE-052): the feed has a natural end to each sitting. */
const PAUSE_EVERY = 20;

/**
 * Companies handed over by another page, e.g. the 企業タイプ診断 result (`#companies=a,b,c&from=shindan`). Read without
 * useSearchParams so the static page needs no Suspense boundary.
 */
// Read from the fragment, not the query: the diagnosis links here with the companies closest to a person's answers,
// and a fragment never leaves the browser — no request to this site carries anything derived from a result.
function seededFromQuery(): { ids: string[]; from: string | null } {
  if (typeof window === "undefined") return { ids: [], from: null };
  const q = new URLSearchParams(window.location.hash.slice(1));
  const ids = (q.get("companies") ?? "").split(",").filter((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)).slice(0, 30);
  return { ids, from: q.get("from") };
}

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
  const following = useLocalStore(followedIndustriesStore);
  // The follows the order is built from. Updated when the reader closes the follow panel, not on every tap: a
  // follow from a card must not move the feed away from the card being read. It takes effect at the next rebuild.
  const [orderFollows, setOrderFollows] = useState<string[] | null>(null);
  const [choosing, setChoosing] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const day = useMemo(() => todayInJapan(), []);

  useEffect(() => {
    loadDiscoverFeed().then(setCards, () => setFailed(true));
  }, []);

  const byId = useMemo(() => new Map((cards ?? []).map((c) => [c.id, c])), [cards]);

  const ordered = useMemo(() => {
    if (!cards) return [];
    // The collection and the follows are read once per rebuild on purpose: re-sorting while the reader swipes
    // would move cards away from under them.
    return feedOrder(cards, day, { industry, met: new Set(discoveredStore.get()), followed: orderFollows ?? followedIndustriesStore.get() });
  }, [cards, industry, day, orderFollows]);

  const jumpTo = useCallback(
    (companyId: string) => {
      const index = slots.findIndex((slot) => slot.kind === "company" && slot.id === companyId);
      if (index === -1) return;
      setShown((n) => Math.max(n, index + 2));
      // Wait for the card to render (it may be beyond the cards drawn so far) before moving to it.
      requestAnimationFrame(() => {
        scroller.current?.querySelector<HTMLElement>(`[data-slot="${index}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [slots],
  );

  const closeChooser = () => {
    setChoosing(false);
    setOrderFollows(followedIndustriesStore.get());
  };

  useEffect(() => {
    if (!cards) return;
    const next: Slot[] = [{ kind: "intro" }];
    // Handed-over companies first (the 診断's closest companies), only on the unfiltered feed and only those released.
    const seed = industry === "all" ? seededFromQuery() : { ids: [], from: null };
    const seeded = seed.ids.filter((id) => cards.some((c) => c.id === id));
    const via = seed.from === "shindan" ? { from: "企業タイプ診断", label: "近い会社" } : { from: "あなたが選んだ会社", label: "続き" };
    const rest = ordered.filter((c) => !seeded.includes(c.id));
    [...seeded.map((id) => ({ id, seeded: true })), ...rest.map((c) => ({ id: c.id, seeded: false }))].forEach((c, i) => {
      next.push({ kind: "company", id: c.id, ...(c.seeded ? { via } : {}) });
      if ((i + 1) % 9 === 0) next.push({ kind: "promo", n: (i + 1) / 9 });
      if ((i + 1) % PAUSE_EVERY === 0) next.push({ kind: "pause", met: i + 1 });
    });
    // Rebuilding the slot list is the reaction to a new filter or the feed arriving, not derived render state:
    // followed companies are spliced into it afterwards and must survive until the filter changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlots(next);
    setShown(PAGE);
    scroller.current?.scrollTo({ top: 0 });
  }, [ordered, cards, industry]);

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
  // Followed industries lead the filter row too, in the order they were followed.
  const chips = [
    ...following.map((id) => industries.find((i) => i.id === id)).filter((i): i is (typeof industries)[number] => Boolean(i)),
    ...industries.filter((i) => !following.includes(i.id)),
  ];

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
        {[{ id: "all", name: "すべて" }, ...chips].map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => setIndustry(i.id)}
            aria-pressed={industry === i.id}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur transition-colors ${
              industry === i.id ? "border-white bg-white text-neutral-950" : "border-white/25 bg-black/30 text-white/85 hover:bg-white/15"
            }`}
          >
            {following.includes(i.id) && <Star className="mr-1 inline size-3 -translate-y-px fill-current" aria-label="フォロー中" />}
            {i.name}
          </button>
        ))}
      </div>

      {choosing && (
        <FollowChooser industries={industries} following={following} onToggle={toggleFollowedIndustry} onClose={closeChooser} />
      )}

      <div ref={scroller} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]">
        {cards === null ? (
          <div className="flex h-full items-center justify-center text-sm text-white/70">企業を集めています…</div>
        ) : (
          slots.slice(0, shown).map((slot, index) => {
            if (slot.kind === "intro") {
              return (
                <IntroCard
                  key="intro"
                  index={index}
                  today={today}
                  met={discovered.length}
                  total={cards.length}
                  following={following.map((id) => industries.find((i) => i.id === id)?.name).filter((n): n is string => Boolean(n))}
                  onJump={jumpTo}
                  onChoose={() => setChoosing(true)}
                />
              );
            }
            if (slot.kind === "promo") return <PromoCard key={`promo-${slot.n}`} index={index} n={slot.n} />;
            if (slot.kind === "pause") return <PauseCard key={`pause-${slot.met}`} index={index} met={slot.met} />;
            const card = byId.get(slot.id);
            if (!card) return null;
            return (
              <CompanyCard
                key={`${slot.id}-${index}`}
                index={index}
                card={card}
                via={slot.via}
                inCollection={discovered.includes(card.id)}
                followingIndustry={following.includes(card.industry.id)}
                onFollowIndustry={() => toggleFollowedIndustry(card.industry.id)}
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

function IntroCard({
  index,
  today,
  met,
  total,
  following,
  onJump,
  onChoose,
}: {
  index: number;
  today: DiscoverCard[];
  met: number;
  total: number;
  following: string[];
  onJump: (companyId: string) => void;
  onChoose: () => void;
}) {
  return (
    <Screen index={index} className="justify-center-safe bg-[radial-gradient(120%_80%_at_80%_0%,#1e3a5f_0%,#0a0f1a_55%,#05070b_100%)] px-6 pt-20 pb-14 text-white [@media(max-height:700px)]:pt-14 [@media(max-height:700px)]:pb-4">
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 [@media(max-height:700px)]:hidden">DISCOVER</p>
      <h1 className="mt-2 font-serif text-[2rem] leading-tight font-semibold [@media(max-height:700px)]:text-[1.5rem]">
        今日、出会う
        <br />
        日本の会社。
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70 [@media(max-height:700px)]:hidden">
        上にスワイプすると、次の会社。気になる会社のつながりをたどると、知らなかった会社に出会えます。
      </p>
      <div className="mt-6 max-w-sm [@media(max-height:700px)]:mt-3">
        <p className="text-xs font-semibold text-white/60">今日の3社</p>
        <ol className="mt-2 space-y-2 [@media(max-height:700px)]:space-y-1.5">
          {today.map((c, i) => (
            <li key={c.id}>
              {/* A button, not a link: it moves the feed to the company's card, which is where the feed tells it. */}
              <button
                type="button"
                onClick={() => onJump(c.id)}
                className="flex w-full items-baseline gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left transition-colors hover:bg-white/10 [@media(max-height:700px)]:py-1.5"
              >
                <span className="figures text-amber-300">{i + 1}</span>
                <span className="min-w-0 truncate font-medium">{c.name}</span>
                <span className="ml-auto shrink-0 text-xs text-white/50">{c.industry.name}</span>
                <ArrowDown className="size-3.5 shrink-0 self-center text-white/40" aria-hidden />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-5 max-w-sm [@media(max-height:700px)]:mt-3">
        <button
          type="button"
          onClick={onChoose}
          className="flex w-full items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-left text-sm hover:bg-amber-300/15 [@media(max-height:700px)]:py-2"
        >
          <Star className="size-4 shrink-0 text-amber-300" aria-hidden />
          <span className="min-w-0 truncate">{following.length > 0 ? `フォロー中：${following.join("・")}` : "気になる業界をフォローすると、先に出てきます"}</span>
          <span className="ml-auto shrink-0 text-xs text-amber-300">{following.length > 0 ? "変更" : "選ぶ"}</span>
        </button>
      </div>
      {/* One row even at 320–375px: a wrapped second row pushes the intro past the SE's screen. */}
      <div className="mt-4 flex items-center gap-1.5 text-sm whitespace-nowrap [@media(max-height:700px)]:mt-3 [@media(max-width:380px)]:text-xs">
        <Link href="/discover/collection" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-2 hover:bg-white/10">
          <BookMarked className="size-4" aria-hidden />
          <span className="[@media(max-width:380px)]:hidden">マイ企業</span>図鑑 <span className="figures">{met}</span>/<span className="figures">{total}</span>
        </Link>
        <Link href="/quiz" className="rounded-full border border-white/20 px-3 py-2 hover:bg-white/10 [@media(max-width:380px)]:px-2.5">今日の1問</Link>
        <Link href="/explore" className="rounded-full border border-white/20 px-3 py-2 hover:bg-white/10 [@media(max-width:380px)]:px-2.5">つながり</Link>
      </div>
      <p className="mt-6 max-w-sm text-[0.6875rem] leading-relaxed text-white/45 [@media(max-height:700px)]:hidden">
        カードの内容は各社の有価証券報告書をもとにした百科事典の記載です。良い会社のおすすめや投資の判断材料ではありません。
      </p>
      <ArrowDown className="absolute bottom-3 left-1/2 size-5 -translate-x-1/2 animate-bounce text-white/60 [@media(max-height:700px)]:hidden" aria-hidden />
    </Screen>
  );
}

function CompanyCard({
  index,
  card,
  via,
  inCollection,
  followingIndustry,
  onFollowIndustry,
  onFollow,
}: {
  index: number;
  card: DiscoverCard;
  via?: { from: string; label: string };
  inCollection: boolean;
  followingIndustry: boolean;
  onFollowIndustry: () => void;
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
          <button
            type="button"
            onClick={onFollowIndustry}
            aria-pressed={followingIndustry}
            className={`inline-flex items-center gap-0.5 rounded-sm border px-1.5 py-0.5 ${followingIndustry ? "border-amber-300 text-amber-300" : "border-white/30 text-white/70 hover:text-white"}`}
          >
            {followingIndustry ? <Check className="size-3" aria-hidden /> : <Plus className="size-3" aria-hidden />}
            {followingIndustry ? "フォロー中" : "フォロー"}
          </button>
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
          <ul className="flex flex-wrap gap-1.5 text-xs [@media(max-height:700px)]:hidden">
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
          {card.related.length > 0 && (
            <Link href={`/network?from=${card.id}`} className="text-xs text-white/70 underline underline-offset-2 hover:text-white">
              ネットワークで見る
            </Link>
          )}
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
      <p className="mt-1 text-sm [@media(max-height:700px)]:line-clamp-2">
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

/**
 * Choosing industries to follow (JCE-048). The order is rebuilt when the panel closes, so the followed industries'
 * companies are first when the reader returns to the top of the feed.
 */
function FollowChooser({
  industries,
  following,
  onToggle,
  onClose,
}: {
  industries: { id: string; name: string; count: number }[];
  following: string[];
  onToggle: (industryId: string) => void;
  onClose: () => void;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="follow-title" className="absolute inset-0 z-30 flex flex-col bg-neutral-950/95 px-5 pt-6 pb-5 text-white backdrop-blur">
      <h2 id="follow-title" className="font-serif text-xl font-semibold">
        気になる業界をフォロー
      </h2>
      <p className="mt-1 text-sm text-white/65">フォローした業界の会社が、フィードの先頭に来ます。フォローはこのブラウザの中だけに残ります。</p>
      <ul className="mt-5 flex flex-1 flex-wrap content-start gap-2 overflow-y-auto">
        {industries.map((i) => {
          const on = following.includes(i.id);
          return (
            <li key={i.id}>
              <button
                type="button"
                onClick={() => onToggle(i.id)}
                aria-pressed={on}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors ${
                  on ? "border-amber-300 bg-amber-300 text-neutral-950" : "border-white/25 text-white/85 hover:bg-white/10"
                }`}
              >
                {on ? <Check className="size-3.5" aria-hidden /> : <Plus className="size-3.5" aria-hidden />}
                {i.name}
                <span className={`figures text-xs ${on ? "text-neutral-950/60" : "text-white/45"}`}>{i.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={onClose} className="mt-4 min-h-11 rounded-full bg-white text-sm font-semibold text-neutral-950 hover:bg-white/90">
        {following.length > 0 ? `${following.length}業界を先頭にしてフィードへ` : "フィードへ戻る"}
      </button>
    </div>
  );
}

/**
 * A pause every twenty companies (JCE-052): what this sitting added up to, and other ways to keep learning. The feed
 * goes on for whoever wants more; it simply stops presenting itself as endless.
 */
function PauseCard({ index, met }: { index: number; met: number }) {
  const days = useLocalStore(activityStore);
  const streak = computeStreak(days, jstToday());
  return (
    <Screen index={index} className="justify-center-safe bg-[radial-gradient(120%_80%_at_50%_0%,#1f3326_0%,#0a0f0c_60%)] px-6 pt-16 pb-10 text-white">
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-300">ひと区切り</p>
      <h2 className="mt-3 font-serif text-[1.875rem] leading-tight font-semibold">
        今日は{met}社の
        <br />
        会社に出会いました。
      </h2>
      {streak.current > 0 && <p className="mt-3 text-sm text-white/75">{streak.current}日続けて、日本の会社を知っています。</p>}
      <ul className="mt-6 grid max-w-sm gap-2 text-sm">
        <li><Link href="/quiz" className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 hover:bg-white/10">今日の1問に答える<ArrowRight className="size-4" aria-hidden /></Link></li>
        <li><Link href="/explore" className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 hover:bg-white/10">気になった会社のつながりをたどる<ArrowRight className="size-4" aria-hidden /></Link></li>
        <li><Link href="/discover/collection" className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 hover:bg-white/10">マイ企業図鑑と記録を見る<ArrowRight className="size-4" aria-hidden /></Link></li>
      </ul>
      <p className="mt-6 text-xs text-white/50">まだ続けるなら、上にスワイプ。</p>
    </Screen>
  );
}
