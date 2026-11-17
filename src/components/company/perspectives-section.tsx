import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { SourceList } from "@/components/sources/source-list";
import { companyMetrics } from "@/lib/company-metrics";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { industryRepository } from "@/lib/repositories";
import { quotedNames, segmentShares, sentences, strategyTargets, type StrategyTarget } from "@/lib/strategy";
import { formatDateJa, formatYen } from "@/lib/utils/format";
import type { Company, Perspective, Perspectives } from "@/types/company";
import type { Industry } from "@/types/industry";
import type { Source } from "@/types/source";

const ITEMS: { key: keyof Perspectives; question: string; label: string }[] = [
  { key: "strategy", question: "どうやって成長する？", label: "成長戦略" },
  { key: "competitiveAdvantage", question: "なぜ勝てる？", label: "競争優位性" },
  { key: "industryPosition", question: "業界の中での立ち位置", label: "業界内の位置づけ" },
];

/**
 * 戦略と強み (JCE-055): how the company grows and why it wins, rather than only what it announced. Two columns on a
 * wide screen — the company's words on the left, numbers and diagrams on the right — one column on a phone, numbers
 * first. The words are the company's own, whole sentences, the first shown and the rest one tap away; what the
 * company says and what this encyclopedia infers stay apart and labelled (JCE-024). The numbers and the diagrams are
 * drawn from the entry's data and its industry's structure, so every company gets them without anyone writing them,
 * and each block names its source and the date it describes.
 */
export async function PerspectivesSection({ company }: { company: Company }) {
  const perspectives = company.perspectives!;
  const strategy = perspectives.strategy?.disclosed;
  const targets = strategy ? strategyTargets(strategy.text) : [];
  const shares = segmentShares(company);
  const primary = company.industries.find((r) => r.primary) ?? company.industries[0];
  const industry = primary ? await industryRepository.get(primary.industryId) : null;
  const present = ITEMS.filter((i) => perspectives[i.key]);

  return (
    // A phone reads one column in the order numbers → words → diagrams. A wide screen reads two balanced columns: the
    // words with the industry diagram under them, and the numbers with the growth map. The column wrappers are
    // `display: contents` on a phone so their children join the one flow and take the phone order.
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-x-12">
      <div className="contents lg:block lg:space-y-6">
        <div className="order-2 space-y-6 lg:order-none">
          {present.map(({ key, question, label }, index) => (
            <PerspectiveCard
              key={key}
              number={index + 1}
              question={question}
              label={label}
              perspective={perspectives[key] as Perspective}
              sources={company.sources}
            />
          ))}
        </div>
        {industry && (
          <div className="order-4 lg:order-none">
            <IndustryPosition company={company} industry={industry} />
          </div>
        )}
      </div>

      <div className="contents lg:block lg:space-y-6">
        <div className="order-1 lg:order-none">
          <KeyNumbers company={company} targets={targets} strategy={strategy} />
        </div>
        {shares && (
          <div className="order-3 lg:order-none">
            <GrowthMap company={company} shares={shares} />
          </div>
        )}
      </div>
    </div>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-muted-foreground">{children}</p>;
}

/** 「1兆円」 → a large 1 and a smaller 兆円, so the eye lands on the number. */
function BigValue({ value, qualifier }: { value: string; qualifier: string | null }) {
  const [, number, unit] = /^([\d,.]+)(.*)$/.exec(value) ?? [, value, ""];
  return (
    <span className="figures whitespace-nowrap">
      <span className="text-[2.5rem] leading-none font-semibold tracking-tight md:text-5xl">{number}</span>
      <span className="ml-0.5 text-lg font-semibold">{unit}</span>
      {qualifier && <span className="ml-1 text-sm">{qualifier}</span>}
    </span>
  );
}

function KeyNumbers({
  company,
  targets,
  strategy,
}: {
  company: Company;
  targets: StrategyTarget[];
  strategy: Perspective["disclosed"];
}) {
  const latest = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
  const overseas = companyMetrics(company)?.overseasSalesRatio ?? null;
  const hasNow = (latest && latest.revenue !== null) || overseas;
  if (targets.length === 0 && !hasNow) return null;

  return (
    <section aria-label="重要な数字" className="overflow-hidden rounded-md border border-border bg-card">
      {targets.length > 0 && strategy && (
        <div className="bg-navy px-5 py-6 text-white md:px-6">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-white/80">
            <span aria-hidden className="h-3 w-1 rounded-full bg-growth" />
            会社が掲げる目標
          </p>
          <dl className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
            {targets.map((t) => (
              <div key={`${t.metric}-${t.value}`}>
                <dt className="text-xs text-white/75">
                  {t.year ? `${t.year}・` : ""}
                  {t.metric}
                </dt>
                <dd className="mt-1">
                  <BigValue value={t.value} qualifier={t.qualifier} />
                  <p className="mt-2 text-[0.6875rem] leading-5 text-white/65">{t.context}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {hasNow && latest && (
        <div className="px-5 py-5 md:px-6">
          <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">いまの数字（{latest.fiscalYear}）</p>
          <dl className="mt-3 grid grid-cols-2 gap-4">
            {latest.revenue !== null && (
              <div>
                <dt className="text-xs text-muted-foreground">{latest.revenueLabel}</dt>
                <dd className="figures mt-1 text-2xl font-semibold text-navy dark:text-foreground">{formatYen(latest.revenue)}</dd>
              </div>
            )}
            {overseas && (
              <div>
                <dt className="text-xs text-muted-foreground">海外売上高比率（計算値）</dt>
                <dd className="figures mt-1 text-2xl font-semibold text-navy dark:text-foreground">{overseas.percent}%</dd>
                <dd className="mt-1 text-[0.6875rem] leading-4 text-muted-foreground">{overseas.formula}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
      <div className="space-y-1 border-t border-border px-5 py-3 md:px-6">
        {targets.length > 0 && strategy && (
          <Meta>
            目標：有価証券報告書{strategy.locator ?? ""}の文言から抜き出し・{formatDateJa(strategy.asOf)}時点
          </Meta>
        )}
        {hasNow && latest && <Meta>いまの数字：{latest.fiscalYear}の有価証券報告書</Meta>}
        <SourceList
          sources={company.sources}
          sourceIds={[...new Set([...(targets.length ? (strategy?.sourceIds ?? []) : []), ...(latest?.sourceIds ?? []), ...(overseas?.sourceIds ?? [])])]}
        />
      </div>
    </section>
  );
}

function Statement({ text }: { text: string }) {
  const [lead, ...rest] = sentences(text);
  return (
    <>
      <p className="mt-3 text-[1.0625rem] leading-8">{lead}</p>
      {rest.length > 0 && (
        <details className="group mt-2">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-ink select-none [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
            続きを読む（あと{rest.length}文）
          </summary>
          <ul className="mt-1 space-y-2 border-l border-border pl-4 text-[0.9375rem] leading-7">
            {rest.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

function PerspectiveCard({
  number,
  question,
  label,
  perspective,
  sources,
}: {
  number: number;
  question: string;
  label: string;
  perspective: Perspective;
  sources: Source[];
}) {
  const names = perspective.disclosed ? quotedNames(perspective.disclosed.text) : [];
  return (
    <article aria-label={label} className="rounded-md border border-border bg-card p-5 md:p-7">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
        <span className="figures text-sm font-semibold text-navy dark:text-ink">{String(number).padStart(2, "0")}</span>
        <h3 className="text-lg font-semibold md:text-xl">{question}</h3>
        <span className="text-xs text-muted-foreground">{label}</span>
      </header>

      {names.length > 0 && (
        <ul aria-label="会社が掲げる名前" className="mt-4 flex flex-wrap gap-2">
          {names.map((n) => (
            <li key={n} className="rounded-sm bg-navy px-2.5 py-1 text-xs font-medium text-white">
              {n}
            </li>
          ))}
        </ul>
      )}

      {perspective.disclosed && (
        <div>
          <Statement text={perspective.disclosed.text} />
          <div className="mt-3">
            <Meta>
              会社の説明・有価証券報告書{perspective.disclosed.locator ?? ""}・{formatDateJa(perspective.disclosed.asOf)}時点
            </Meta>
            <SourceList sources={sources} sourceIds={perspective.disclosed.sourceIds} />
          </div>
        </div>
      )}

      {perspective.analysis && (
        <div className="mt-5 border-l-2 border-ink pl-4">
          <p className="text-xs font-semibold text-ink">編集部の分析（推論）</p>
          <Statement text={perspective.analysis.text} />
          <p className="mt-2 text-sm text-muted-foreground">根拠：{perspective.analysis.basis}</p>
          <div className="mt-2">
            <Meta>{formatDateJa(perspective.analysis.asOf)}時点の資料による</Meta>
            <SourceList sources={sources} sourceIds={perspective.analysis.sourceIds} />
          </div>
        </div>
      )}
    </article>
  );
}

function GrowthMap({ company, shares }: { company: Company; shares: NonNullable<ReturnType<typeof segmentShares>> }) {
  const anyGrowth = shares.items.some((i) => i.growth);
  const max = Math.max(...shares.items.map((i) => i.percent));
  return (
    <figure className="rounded-md border border-border bg-card p-5 md:p-6">
      <figcaption>
        <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">成長の構図</p>
        <p className="mt-1 font-semibold">売上の内訳と、会社が伸ばすと述べる事業</p>
      </figcaption>
      {/* One bar for the whole: the reader sees at once how big the growth businesses are against the rest. */}
      <div aria-hidden className="mt-4 flex h-3 overflow-hidden rounded-full bg-muted">
        {shares.items.map((i) => (
          <span
            key={i.businessId}
            className={`h-full border-r border-card last:border-r-0 ${i.growth ? "bg-growth" : "bg-navy/80 dark:bg-ink/70"}`}
            style={{ width: `${i.percent}%` }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {shares.items.map((i) => (
          <li key={i.businessId} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_3.5rem] items-center gap-3 text-sm">
            <span className="truncate" title={i.name}>
              {i.name}
            </span>
            <span className="h-2 rounded-full bg-muted">
              <span
                className={`block h-full rounded-full ${i.growth ? "bg-growth" : "bg-navy/80 dark:bg-ink/70"}`}
                style={{ width: `${(i.percent / max) * 100}%` }}
              />
            </span>
            <span className="figures text-right">
              {i.percent}%{i.growth && <span className="sr-only">（成長を掲げる事業）</span>}
            </span>
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        {anyGrowth && (
          <li className="flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-sm bg-growth" />成長を掲げる事業</li>
        )}
        <li className="flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-sm bg-navy/80 dark:bg-ink/70" />そのほかの事業</li>
      </ul>
      <div className="mt-3 space-y-1 border-t border-border pt-3">
        <Meta>
          割合は計算値：各事業の{shares.label} ÷ 合計（{shares.fiscalYear}・有価証券報告書【セグメント情報】）。
          {anyGrowth
            ? "緑は、会社の成長戦略の文で、成長・拡大・強化などと同じ文に名前が挙がった事業です。"
            : "会社の成長戦略の文に、成長を掲げる事業の名前は見つかりませんでした。"}
        </Meta>
        <SourceList sources={company.sources} sourceIds={company.segmentRevenue?.sourceIds} />
      </div>
    </figure>
  );
}

/**
 * Where the company stands in its industry, drawn in the industry's own shape: a value-chain industry (食品, 自動車…)
 * as stages with arrows, a parallel one (金融, IT…) as a group of tiles — what it buys from above, what it sells to
 * below. The stage the company occupies is marked when the industry's research has placed it.
 */
function IndustryPosition({ company, industry }: { company: Company; industry: Industry }) {
  const placements = industry.categories.filter((c) => c.companyIds.includes(company.id));
  const stages = industry.categories.filter((c) => c.role !== "input");
  const inputs = industry.categories.filter((c) => c.role === "input");
  const from = (industry.links ?? []).filter((l) => l.direction === "from");
  const to = (industry.links ?? []).filter((l) => l.direction === "to");
  const here = (id: string) => placements.some((p) => p.id === id);
  const sourceIds = [
    ...new Set([...placements, ...from, ...to].flatMap((x) => x.sourceIds)),
  ];

  const pill = (id: string) =>
    here(id)
      ? "rounded-sm bg-navy px-3 py-2 text-sm font-medium text-white"
      : "rounded-sm border border-border bg-card px-3 py-2 text-sm text-muted-foreground";

  const linkRow = (label: string, links: typeof from) =>
    links.length > 0 && (
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {links.map((l) => (
            <li key={l.industryId}>
              <Link href={`/industries/${l.industryId}`} className="inline-flex rounded-full border border-border px-3 py-1 text-xs hover:border-foreground">
                {INDUSTRY_LABELS[l.industryId].name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <figure className="rounded-md border border-border bg-card p-5 md:p-6">
      <figcaption>
        <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">業界の中の位置</p>
        <p className="mt-1 font-semibold">
          {industry.name}業界の{industry.structure === "chain" ? "流れ" : "顔ぶれ"}
          {placements.length > 0 && <span className="font-normal">と、{company.name}のいる場所</span>}
        </p>
      </figcaption>

      <div className="mt-4 space-y-3">
        {linkRow("仕入れる・頼る業界", from)}
        {from.length > 0 && <ArrowDown aria-hidden className="mx-auto size-4 text-muted-foreground" />}

        <div className="rounded-md bg-paper p-3">
          {industry.structure === "chain" ? (
            <ol className="space-y-1.5">
              {stages.map((c, i) => (
                <li key={c.id}>
                  {i > 0 && <ArrowDown aria-hidden className="mx-auto mb-1.5 size-3.5 text-muted-foreground" />}
                  <div className={`flex items-center justify-between gap-2 ${pill(c.id)}`}>
                    <span>{c.name}</span>
                    {here(c.id) && <span className="text-[0.6875rem] text-white/80">{company.name}はここ</span>}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="grid grid-cols-2 gap-1.5">
              {stages.map((c) => (
                <li key={c.id} className={pill(c.id)}>
                  {c.name}
                  {here(c.id) && <span className="block text-[0.6875rem] text-white/80">{company.name}はここ</span>}
                </li>
              ))}
            </ul>
          )}
          {inputs.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              支える産業：
              {inputs.map((c) => (
                <span key={c.id} className={here(c.id) ? "font-semibold text-foreground" : ""}>
                  {c.name}
                  {here(c.id) && `（${company.name}）`}{" "}
                </span>
              ))}
            </p>
          )}
        </div>

        {to.length > 0 && <ArrowDown aria-hidden className="mx-auto size-4 text-muted-foreground" />}
        {linkRow("売る・届ける先の業界", to)}
      </div>

      <div className="mt-4 space-y-1 border-t border-border pt-3">
        <Meta>
          {industry.name}業界の整理（{formatDateJa(industry.updatedAt)}時点、掲載企業の有価証券報告書から）。
          {placements.length === 0 && `${company.name}がどの段階にいるかは、まだ整理していません。`}
        </Meta>
        <SourceList sources={industry.sources} sourceIds={sourceIds.length > 0 ? sourceIds : industry.sourceIds} />
        <Link href={`/industries/${industry.id}`} className="inline-flex min-h-11 items-center text-sm text-ink">
          {industry.name}業界のしくみを見る →
        </Link>
      </div>
    </figure>
  );
}
