# Independent review — 2026-09-14

Reviewer: QA / Security / Reliability (adversarial, read-only on the codebase).
Scope: `japan-company-encyclopedia` at `720e5f0` (working tree clean). Not part of VALLE.

Method: I did not reuse any research agent's scratch files. Every source document cited below was
downloaded again by me (`curl -L` with browser headers) into my own scratch directory and extracted with
`pdftotext -enc UTF-8 -raw`. Everything marked "observed" was run by me; the command output is summarised,
not paraphrased from the project's own docs.

Status of this document: complete.

---

## Verdict

**SHIP-READY FOR LOCAL USE.**

No P0 and no P1. Every financial figure I checked (10 latest-year values, plus earlier years for three
companies) matches its primary source digit for digit, and none of the 16 prose claims I checked is
unsupported. Tests (105), typecheck, lint and build all pass. Company data does not reach the client
bundle. I found no security hole.

This is not "done" against the spec. §86 has 1 FAIL, 5 NOT BUILT and 4 NOT VERIFIABLE items (§7).

Nothing blocks local use. Fix before anyone other than the operator reads the site:
- **F-01**: Sony's financial section labels a figure that excludes financial revenue as 「…及び金融ビジネス収入」,
  and for two years charts revenue and net income of different scopes.

Fix before any deployment:
- **F-05**: `/admin` has no authentication.
- **P3-2**: `SITE_URL` must be required, or the sitemap and robots advertise localhost.

Open P2s: F-02 (landing page not saved offline), F-03 (focusable chart inside `role="img"`),
F-04 (`pagePath` accepts `//host`), F-06 (theme script reads localStorage outside `src/lib/storage/`),
F-07 (structure not visually dominant on arrival).

Counts: P0 0 · P1 0 · P2 7 · P3 12.

---

## 1. Data truthfulness

### 1.1 Source URL resolution (all 45 URLs in `src/data/**`)

Observed: 38 of 45 return `200` to a plain `curl -L`. The 7 `www.sony.com` URLs return `403` to plain curl
but `200 application/pdf` / `200 text/html` when sent with ordinary browser headers (`User-Agent`,
`Accept`, `Sec-Fetch-*`). This is bot protection, not a dead link; a reader clicking in a browser gets the
document. **No source URL is dead.**

### 1.2 Latest fiscal year — revenue and net income (10 values)

All read from the 連結経営指標等 table of the cited 有報 and cross-checked against the cited 決算短信 p.1.
Values in 百万円; stored value = printed × 1,000,000.

| Company | Field | Stored | 有報 (as printed) | 短信 (as printed) | Result |
|---|---|---|---|---|---|
| Toyota 2026年3月期 | 営業収益 | 50,684,952 | 50,684,952 (`yuho-2026` p.2) | 50,684,952 | MATCH |
| Toyota 2026年3月期 | 親会社の所有者に帰属する当期利益 | 3,848,098 | 3,848,098 | 3,848,098 (当期利益 3,985,761 correctly not used) | MATCH |
| Sony 2026年3月期 | 売上高及び金融ビジネス収入 | 12,479,620 | 12,479,620 (`yuho-2026` p.1) | 継続事業 売上高 12,479,620 | MATCH (scope: see F-01) |
| Sony 2026年3月期 | 当社株主に帰属する当期純利益（損失） | △326,865 | △326,865 | ※1: △326,865 (継続事業 1,030,893) | MATCH |
| Nintendo 2026年3月期 | 売上高 | 2,313,051 | 2,313,051 (`yuho-2026` p.2) | 2,313,051 | MATCH |
| Nintendo 2026年3月期 | 親会社株主に帰属する当期純利益 | 424,056 | 424,056 | 424,056 | MATCH |
| Mitsubishi Corp. 2026年3月期 | 収益 | 18,915,995 | 18,915,995 (`yuho-2026` p.1) | 18,915,995 | MATCH |
| Mitsubishi Corp. 2026年3月期 | 当期純利益（当社の所有者に帰属） | 800,460 | 800,460 | 800,460 (当期利益 916,726 correctly not used) | MATCH |
| Tokyo Electron 2026年3月期 | 売上高 | 2,443,533 | 2,443,533 (`yuho-2026` p.2) | 2,443,533 | MATCH |
| Tokyo Electron 2026年3月期 | 親会社株主に帰属する当期純利益 | 574,454 | 574,454 | 574,454 | MATCH |

Note on URL naming: Mitsubishi's `yuho-2026` URL is `.../2025_04/y2025_04.pdf` and Sony's is `r7_q4.pdf`.
Both look like the wrong year at a glance; I opened both and confirmed the right-most column is 決算年月
2026年3月 (Mitsubishi labels it 回次「2025年度」; Sony's table header is 決算年月 2026年３月). Correct documents.

### 1.3 Earlier years

| Company | Year | Stored (百万円) | Independent source | Result |
|---|---|---|---|---|
| Toyota | 2022年3月期 | 31,379,507 / 2,850,110 | original filing `yuho-2022` p.2 IFRS rows: 31,379,507 / 2,850,110 | MATCH |
| Nintendo | 2022–2025年3月期 | 1,695,344 / 477,691; 1,601,677 / 432,768; 1,671,865 / 490,602; 1,164,922 / 278,806 | `yuho-2025` p.2 (same eight values) | MATCH (no restatement) |
| Sony | 2022年3月期 | 9,921,513 / 882,178 | `yuho-2023` p.1 and `yuho-2025` p.1 | MATCH |
| Sony | 2023年3月期 | 10,974,373 / 1,005,277 | `yuho-2025` p.1 (restated); original `yuho-2023` p.1 printed 11,539,837 / 937,126 | MATCH to restated figure; restatement disclosed in the entry's `note` |
| Sony | 2024年3月期 | 11,260,037 / 970,573 | `yuho-2026` p.1; `yuho-2025` p.1 printed 13,020,768 before the discontinued-operations restatement | MATCH to `yuho-2026`; scope disclosed |

**No financial figure mismatch found.** All 20+ values checked equal their source.

### 1.4 Prose spot-checks (at least one business description and one history event per company)

| Company | Claim | Source text found | Result |
|---|---|---|---|
| Toyota | 自動車 business: セダン、ミニバン、コンパクト、SUV、トラック…; domestic dealers + some large customers direct; overseas via 米国トヨタ自動車販売 etc.; all 11 product names | `yuho-2026` 事業の内容: same wording; all 11 names are in the printed 主な製品 list | VERIFIED |
| Toyota | 1986: TMM U.S.A.（現 TMM ケンタッキー）and TMM カナダ founded; "2026年3月期、北米で販売した車の74.6％は北米で生産" | 沿革「1986年１月 …」; MD&A「北米では…76.0％および74.6％が現地で生産」 | VERIFIED |
| Toyota | 2025: final contract to integrate 三菱ふそう and 日野; 日野 66.16% subsidiary deconsolidated 2026-04-01 | 沿革「2025年６月 … 最終契約を締結（…2026年４月１日において、日野自動車㈱は当社の連結子会社から除外）」; 関係会社「日野自動車 66.16」 | VERIFIED |
| Sony | ゲーム＆ネットワークサービス: PS5, PS Plus, digital software / add-on content | `yuho-2026` 事業の内容 and G&NS MD&A | VERIFIED |
| Sony | 1968: CBS・ソニーレコード, 50% owned, 100% in 1988, renamed 1991 | 沿革「1968年３月 …（当社50％出資）。（1988年１月 当社100％出資、1991年４月 …社名変更）」 | VERIFIED |
| Sony | 1980: CCDイメージセンサーを商品化 | official history page「1980 CCDイメージセンサーを開発 商品化」 | VERIFIED |
| Sony | 2026年3月期 note: loss caused by reclassifying the financial business's accumulated OCI; continuing operations profitable | 短信 ※1: 1,377,795百万円 loss from that reclassification; 継続事業 当社株主に帰属する当期純利益 1,030,893 | VERIFIED |
| Nintendo | Top-level businesses ゲーム専用機 2,239,541 / IP関連収入等 73,510 (single segment; product categories used) | `yuho-2026` 販売実績 and 収益の分解; 「単一セグメントのため」 | VERIFIED (presentation choice documented in research log) |
| Nintendo | Business model: ゲーム機とソフトでは利益率が大きく異なる | `yuho-2026`「…利益率が大きく異なるため、これらの売上割合の変動は売上総利益…に影響」 | VERIFIED |
| Nintendo | 2023 movie; 映像ビジネス「一層重要な位置づけ」; 2026年4月 Galaxy movie; Switch 2 sold 1,986万台 in 2026年3月期 | `yuho-2026` (社外取締役 section and 業績の概要), official history「…初のアニメ映画…公開」 | VERIFIED |
| Mitsubishi Corp. | エネルギー＆パワーソリューション formed April 2026 by merging two groups | `yuho-2026`「…グループと電力ソリューショングループを統合し「エネルギー＆パワーソリューショングループ」を設立」 | VERIFIED |
| Mitsubishi Corp. | 2020 Eneco: via a company set up with 中部電力, acquired all shares | 沿革「2020年 3月 …（現 N.V. Eneco）を子会社化」; 「中部電力株式会社と共同で設立した Diamond Chubu Europe B.V.を通じて…100%の株式を…取得」 | VERIFIED |
| Mitsubishi Corp. | ローソン: 50/50 with KDDI since 2024-08; ~22,500 stores at end of Feb 2026 | `yuho-2026`「2024年8月15日付で当社及びKDDIの出資比率を50%へ調整」「2026年2月末時点で…合計約22,500店」 | VERIFIED |
| Tokyo Electron | Customers Samsung Electronics and TSMC | `yuho-2026` 主要な販売先 table (11.8% / 11.5% of sales, and prior year) | VERIFIED |
| Tokyo Electron | 1986: exports begin; 総合研究所 completed at 韮崎 the same year; 90.2% of 2026年3月期 sales overseas | official milestones「1986年より海外への輸出を開始」, 1986 block「山梨県韮崎市穂坂工業団地内に総合研究所が完成」「半導体製造装置の輸出を開始」; `yuho-2026`「海外売上高の比率につきましては90.2%」 | VERIFIED |
| Tokyo Electron | 1999: 東証 industry changed 商業 → 電気機器; company describes 「開発製造機能をもつメーカーへの移行」 | milestones 1999「業種変更「商業」から「電気機器」へ」; `yuho-2026` 経営方針 | VERIFIED; the two facts are placed side by side without asserting causation — acceptable |

**No claim I checked is unsupported, and none states an interpretation as fact**, with one presentation
problem in Sony's financial section (F-01 below).

---

## 2. Findings

### P0 — none found

### P1 — none found

### P2

**F-01 · P2 · Sony's financial section: the headline label contradicts its figure, and the chart pairs
revenue and net income of different scopes**
`src/data/companies/sony-group.ts:337-370`, rendered by `src/components/company/financial-section.tsx:55-75`.
- Evidence: the largest number in the section reads 「売上高及び金融ビジネス収入 12兆4,796億円」. That figure
  *excludes* the financial business (`yuho-2026` p.1 注5; 短信 ※1). The label is verbatim from the filing, so
  it is not fabricated, but a beginner reading the page takes it to include financial revenue. The explanation
  is only in `text-xs` notes under the chart.
- Worse for the chart: for 2024年3月期 and 2025年3月期 the revenue column is continuing operations only, while
  the net-income column (970,573 / 1,141,600) is total attributable profit **including** the financial
  business. JCE-003's own argument is that the visual gap between the two columns is "the thing worth
  understanding"; for those two years that gap compares different perimeters. The page says the *revenue*
  scope changes across years, but never says that net income keeps the old scope. (The code comment at
  `sony-group.ts:307-309` knows this; the reader is not told.)
- Fix: (a) when `revenueBasis` is set, show a plain-language display label (e.g. 「売上高（金融事業を除く）」)
  with the verbatim label kept as secondary text; (b) add a `netIncomeBasis` (or a note) stating that net
  income includes the discontinued financial business in 2024–2025年3月期 and that the columns are not a
  margin for those years; or plot net income from continuing operations where the filing prints it
  (短信 gives 2025年3月期 1,067,431 and 2026年3月期 1,030,893) with its own label. Choose (b) or the
  alternative deliberately and record it as a decision.

**F-02 · P2 · The first page a reader opens is not available offline**
`public/sw.js:49-67` (network-first caching only happens inside the fetch handler).
- Evidence (observed with Chrome via playwright-core, production server): visit `/companies/toyota` once;
  the service worker installs and takes control; caches then contain only the shell
  (`/`, `/offline`, manifest, one icon) and three JS chunks — **not `/companies/toyota`**. Cut the network and
  reload `/companies/toyota`: the offline page 「このページはまだ保存されていません。」 is served. A page visited
  *after* the worker controls the tab (`/companies/nintendo`) is served from cache offline. The file's header
  comment promises "pages the reader has already opened stay readable" — false for the landing page, which for
  a search-engine visitor is often the only page.
- Fix: in `activate` (after `clients.claim()`), or from the registration component via `postMessage`, put the
  current client URLs into `PAGE_CACHE` (fetch them once with `cache: "reload"`).

**F-03 · P2 · Chart bands are focusable children of `role="img"`**
`src/components/company/financial-chart.tsx:59` (`role="img"`) and `:109-110` (`tabIndex={0} role="group"`).
- Evidence: keyboard trace on `/companies/sony-group` reaches the five year bands (Tab stops 26–30). But
  `role="img"` makes its descendants presentational, so assistive technology may flatten the per-year
  `aria-label`s into the single image name — a keyboard user hears one label five times or nothing per stop.
- Fix: drop `role="img"` from the `<svg>` (use `role="group"` + `aria-label`/`aria-describedby`), keep the
  bands as `role="group"` or make them `role="listitem"` inside a `role="list"`. The data table fallback
  (「数値を表で見る」) already exists, which is why this is P2, not P1.

**F-04 · P2 · Report `pagePath` validation accepts protocol-relative URLs**
`src/lib/storage/stores.ts:210` — `pagePath.startsWith("/")`; rendered as a link at
`src/components/admin/local-reports.tsx:28-31`.
- Evidence (observed): with `content-reports` set to a report whose `pagePath` is `//example.com`, `/admin/reports`
  renders `<a href="//example.com">` — an off-site link inside the admin screen. `/\example.com` would behave
  the same in browsers. Today only same-origin script or the device owner can write that key, so impact is
  low; but this parser is exactly what will guard reports from *other* readers once JCE-008 is decided, and
  the comment at `stores.ts:40` claims "a stale or hostile value cannot become a route".
- Fix: accept only `^/(?![/\\])[a-z0-9/-]*$`, or rebuild `pagePath` from the validated `companyId` /
  `industryId` / `featureId` instead of trusting a stored string.

**F-05 · P2 · `/admin` is reachable by anyone once deployed**
`src/app/admin/**`. Observed `200` for `/admin`, `/admin/companies`, `/admin/reports`, `/admin/revisions`.
Mitigations present: read-only, `noindex,nofollow`, `robots.txt` disallow, not linked from site navigation,
reports shown are the viewer's own device only. Nothing sensitive is exposed today, so not P1 for local use.
Before any deploy, and as a hard precondition for JCE-009 option (b), `/admin` needs authentication (or must
be excluded from the production build).

**F-06 · P2 · Invariant 7 is violated in letter: `localStorage` is read outside `src/lib/storage/`**
`src/app/layout.tsx:73-75` (inline pre-paint theme script). I argue this is not P1: the read must run before
hydration so it cannot import the module, it uses `STORAGE_KEYS.settings`, it whitelists `"light"|"dark"`, and
everything is in `try/catch` (observed: `user-settings = "not json"` causes no error). But CLAUDE.md says
"only through `src/lib/storage/`" with no exception, and the next person will cite this line as precedent.
Fix: move the script string into `src/lib/storage/theme-script.ts` (it is already a pure string builder) so the
invariant holds literally, or record the exception in `docs/decisions.md`.

**F-07 · P2 · On arrival, the wordmark dominates the page, not the business structure**
`src/components/company/company-hero.tsx` (hero) and the structure's position after it.
- Evidence (observed screenshots): at 1280×1000, 「SONY GROUP」 in display type fills the top ~250px; the
  structure's root node starts at y≈690 and only three of its six branches are above the fold. At 390×844
  (Toyota) only the structure's root node is visible above the bottom navigation. CLAUDE.md calls the structure
  "the most important component" and §86 asks that it be "visually dominant". The one-sentence description
  *is* prominent in the first viewport, which is what the 3-second goal needs, so this is a design judgement
  rather than a broken flow — but on the evidence it does not meet the checklist wording.
- Fix: a design decision, not mine to make: shrink the Latin wordmark on company pages or bring the structure
  (at least its first level) into the first viewport at common laptop and phone heights. If the current
  hierarchy is deliberate, record it in `docs/decisions.md` as a departure from §86.

### P3

1. **Uppercase ids return a soft 404.** `/companies/Toyota`, `/companies/TOYOTA`, `/industries/Automotive`
   return HTTP `200` with the not-found page body (`NEXT_HTTP_ERROR_FALLBACK;404`); `/About` returns 404.
   Probably Windows' case-insensitive file lookup of prerendered HTML — re-check on the real host.
2. **`sitemap.xml` and `robots.txt` hard-code `http://localhost:3000`** when `SITE_URL` is unset
   (`src/lib/site.ts`), even when served from :3200. Fail the production build if `SITE_URL` is missing.
3. **`/features/none`** placeholder param appears in the build output and returns 404
   (`src/app/features/[feature-id]/page.tsx:12`). Harmless workaround; comment or remove once features exist.
4. **Primary navigation leads to empty pages.** 特集 (header and bottom nav) → 「特集はまだ公開していません」;
   `/terms` → 「用語はまだ掲載していません」. Honest empty states, but they occupy top-level navigation.
5. **Manifest and icons are cache-first forever** (`public/sw.js:93-99`); changes reach installed clients only
   after a manual `VERSION` bump.
6. **No `Content-Security-Policy` or `Permissions-Policy` on pages** (`next.config.ts`). The inline theme script
   and JSON-LD would need a hash or nonce.
7. **The investment-metric test misses the Japanese names that actually appear in 有報 tables.**
   `tests/data-integrity.test.ts:209` bans `ROE`, `PER`, … but not 自己資本利益率 (ROE) or 1株当たり / EPS /
   時価総額 / 配当性向. (株価収益率 is caught only because it contains 株価.) These rows sit directly next to the
   figures researchers copy.
8. **Protocol departures recorded only in research logs.** Mitsubishi uses the 7 groups in force from
   2026-04-01, not the 8 reportable segments of the year shown, and orders エネルギー＆パワーソリューション by a
   computed sum (4,586,279); Nintendo's top level is its two product categories because it has a single segment.
   Both are well evidenced and reasonable; they depart from `docs/research-protocol.md` §2 and belong in
   `docs/decisions.md`.
9. **`/admin/reports` shows the raw category id** (`company-information`) instead of its Japanese label.
10. **`src/hooks/use-local-store.ts` carries an unnecessary `"use client"`** (a hook module is not a boundary).
11. **Sony's source URLs return 403 to non-browser clients.** Not a dead link, but any automated link checker
    will flag all seven. Note it in the research protocol.
12. **Small text-link targets.** On five pages the header/footer text links measure under 24px in one
    dimension (企業, 業界, 特集, 検索, このサービスについて, 情報の誤りを報告). Probably covered by WCAG 2.5.8's
    spacing exception; not measured.

---

## 3. Invariant and spec conformance

| Check | Result | Evidence |
|---|---|---|
| No investment metrics | PASS | `grep` for 株価/PER/PBR/ROE/ROA/配当/利回り/時価総額/EPS over `src/` and `public/`: only the About page disclaimer. Rendered company HTML: 「配当」 appears only in 「受取配当金」 (Mitsubishi business-model explanation of how profit arises); 「利益率」 only in Nintendo's sourced 「ゲーム機とソフトでは利益率が大きく異なる」. No ratio, price, or growth figure is shown. The integrity test's banned list lacks EPS / 1株当たり / 配当 / 時価総額 / 利益率 (P3) |
| Every factual section sourced | PASS | `tests/data-integrity.test.ts` checks `sourceIds` resolve for businesses, financials, history, related companies, features, terms; 105/105 tests pass |
| kebab-case names | PASS | Every file and folder under `src/ public/ scripts/ tests/ docs/` matches `^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+)*$` or `[kebab]`; exceptions are tool-mandated root files. All data `id:` values kebab-case. Storage keys: `company-favorites`, `recently-viewed-companies`, `user-settings`, `content-reports` |
| localStorage only via `src/lib/storage/` | FAIL in letter (F-06) | `src/app/layout.tsx:74` |
| Repositories only content read path | PASS | No `@/data` import in `src/` outside `src/lib/repositories/` and `src/data/` itself; only `tests/` import data directly |
| Server Components by default | PASS | 20 `"use client"` files, each justified — see below |

`"use client"` files and judgement:
- Needed (browser API / interaction): `app/error.tsx` (Next requires it), `admin/local-report-count.tsx`,
  `admin/local-reports.tsx`, `company/favorite-button.tsx`, `company/reader-trail.tsx`, `company/record-view.tsx`
  (localStorage); `company/company-directory.tsx` (filter state); `company/financial-chart.tsx` (hover/focus
  state, width measurement); `company/section-navigation.tsx` (scroll-spy); `navigation/nav-link.tsx`
  (`usePathname`); `pwa/offline-indicator.tsx` (`navigator.onLine`); `pwa/service-worker-registration.tsx`;
  `rich-text/term-reference.tsx` and `ui/popover.tsx` (popover); `search/search-input.tsx`,
  `search/search-results.tsx` (`useSearchParams`); `settings/application-settings.tsx`,
  `settings/report-form.tsx`, `settings/theme-setting.tsx`.
- Unnecessary but harmless: `src/hooks/use-local-store.ts` — a hook module, not a component boundary (P3).
- No page file is a Client Component.

---

## 4. Build and bundle

Observed on this machine:
- `npm test` — 5 files, **105 passed**, exit 0.
- `npm run typecheck` — exit 0, no output.
- `npm run lint` — exit 0, no output.
- `npm run build` — Next.js 16.3.5 (Turbopack), compiled, 31 static pages, exit 0.

Does full company data reach the browser? **No — disproved by grep.** Across all `.js` under `.next/static`
(1.2 MB of chunks), zero hits for each of 20 data-only probes: `50684952000000`, `50_684_952`,
`archives_2026_03.pdf`, `global.toyota`, `security_q2603`, `y2025_04.pdf`, `tel.co.jp`, `r7_q4`, `74.6％`,
`66.16`, `累積その他の包括利益`, `Tri Petch`, `クラウン`, `ザ・スーパーマリオ`, `井深大`, `22,500店`,
`東京エレクトロン研究所`, `トヨタやレクサス`, `needs-attention`, `ai-generated`.
Positive control (so the grep is not vacuous): UI strings from client components are found
(`この端末に保存された報告はありません` in 1 chunk, `company-favorites` in 6).
Server-rendered HTML carries each company's own data only on its own page (e.g. `toyota.html` contains
Toyota's source URL; `sony-group.html` does not). `search.html` contains product names by design (the search
index is passed to the client search component) — names only, no figures, prose or sources.

---

## 5. Security

| Area | Result | Evidence |
|---|---|---|
| `public/sw.js` scope | PASS | Registered with `scope: "/"`, same-origin GET only, `updateViaCache: "none"`, `sw.js` served `no-store` |
| Stale content | PASS with note | Navigations are network-first; a cached page is served only when the network fails. Only `response.ok && type === "basic"` is cached, so 404s and opaque responses cannot be stored |
| Poisoned content | PASS | No cross-origin caching; static cache is only `/_next/static/*` (content-hashed), `/icons/*`, manifest. Pages are static HTML with no reflection of query strings |
| Manifest / icons cache-first forever | P3 | A changed manifest or icon never reaches an installed client until `VERSION` is bumped by hand |
| Offline landing page not cached | P2 | F-02 |
| JSON-LD | PASS | `JSON.stringify(...).replace(/</g, "\\u003c")` — no `</script>` or `<!--` breakout possible; data is static |
| `dangerouslySetInnerHTML` | PASS | Two uses only: JSON-LD above, and the theme script, which contains only a constant key |
| localStorage parsing | PASS | Every read goes through a validating parser; ids must be kebab-case. Observed: `company-favorites = {"x":1}`, `recently-viewed-companies = ["../evil","<img src=x onerror=alert(1)>","toyota"]`, `user-settings = "not json"` → no page error, no dialog, invalid ids dropped |
| Report text rendering | PASS | Rendered as React text with `whitespace-pre-wrap`; `<script>` payload shown inertly |
| Report `pagePath` | P2 | F-04 |
| `/admin` exposure | P2 | F-05 |
| `next.config.ts` headers | PASS with P3 | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` observed on responses. No `Content-Security-Policy` on pages and no `Permissions-Policy` (P3; HSTS belongs to the host) |

---

## 6. Rendered behaviour

Production server `next start -p 3200`:
- Every route in the build output returns `200` except `/features/none` → `404` (see P3).
- Unknown ids: `/companies/unknown-co` 404, `/industries/unknown` 404, `/features/unknown` 404,
  `/no-such-page` 404. PASS.
- `/sitemap.xml` 200 `application/xml` (17 URLs), `/robots.txt` 200, `/manifest.webmanifest` 200
  `application/manifest+json` (name, `start_url` `/`, `display: standalone`, 192/512/maskable icons).
- Horizontal overflow: 20 routes × widths 390 / 768 / 1280 — `scrollWidth` never exceeds the viewport and no
  element (outside an intentional `overflow-x-auto` scroller) extends past it. No console errors. PASS.
- Keyboard (`/companies/sony-group`, 1280px): skip link is the first stop; header nav; industry chips;
  save button; report link; **section tabs 概要 / 事業 / ビジネスモデル / 財務 / 歴史 / 業界 reached**;
  each 「出典を見る」 `<summary>`; **all five chart year bands reached**; 「数値を表で見る」; footer. No trap.
- Offline after one visit: offline page served for unvisited pages (PASS); the visited landing page is not
  saved (F-02).
- Chart focus: a year band focused with the keyboard gets a visible stroke on its hit rectangle (computed
  `stroke` changes from none to the ink colour). The earlier "no outline" reading on the `<g>` itself is
  expected; the ring is drawn on the child rect.
- Basic structure on `/`, `/companies/mitsubishi-corporation`, `/search`, `/settings`, `/report`: `lang="ja"`,
  exactly one `h1`, no skipped heading levels, no duplicate ids, no unnamed links or buttons, no unlabelled
  inputs, no `img` without `alt`. On the Mitsubishi page, 5 focusable elements sit inside `role="img"` (F-03).
- Functional (observed): save button `aria-pressed` false→true, `company-favorites` = `["nintendo"]`;
  recently viewed `["toyota","nintendo"]` (newest first, no duplicates); search 「トヨタ」「とよた」「7203」 →
  Toyota, 「ゲーム」 → Sony and Nintendo, 「半導体」 → Tokyo Electron, Mitsubishi and the semiconductors
  industry, 「PER」/「xyzxyz」 → a no-results message; `/report?company=toyota` preselects Toyota; empty submit
  → 「報告の種類を選んでください。」; a submitted report shows 「…報告はまだ編集者に自動では届きません。」 and appears
  in `/admin/reports` on the same device; `/admin/revisions` lists each company's `ai-generated` revision with
  its sources; company pages show 「最終更新 2026年9月14日」. Tokyo Electron's page links to
  `/industries/semiconductors`, which links back to Tokyo Electron and Sony.
- The server was stopped at the end of the review.

---

## 7. Spec §86 QA checklist

The master specification is not in the repository; the 29 items below were supplied verbatim by the
coordinator. "NOT BUILT" means nothing a reader could use exists; "NOT VERIFIABLE" means it needs a human
test or a tool I did not have.

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Home is not a dashboard | PASS | `/` shows: wordmark and tagline, search, recently viewed, industries with company counts, company cards with one sentence each. No figures, charts, tiles or tickers |
| 2 | 3-second company understanding works | NOT VERIFIABLE | Needs the §89 human test. What the page offers: the one-sentence description is the largest body text in the first viewport at 390px and 1280px, and a test caps its length |
| 3 | Business structure is visually dominant | FAIL | F-07: wordmark dominates the first viewport; structure starts at y≈690 (1280×1000); only its root node is above the fold at 390×844 |
| 4 | Company-specific structures work | PASS | Five different shapes render with no overflow or console errors at 390/768/1280 (flat 3 segments, 6 segments with children, 2 categories, 7 groups on the left rail, single segment through a 「単一セグメント」 node). Inspected visually: Sony desktop, Toyota mobile |
| 5 | Business model is understandable | NOT VERIFIABLE | Human comprehension. The five-step flow is present and test-enforced; the claim I spot-checked (Nintendo) is sourced |
| 6 | Revenue + net income share one chart | PASS | One SVG, one zero-based y-axis (geometry unit-tested), Sony's loss drawn below zero, a marker where the revenue scope changes. Scope caveat: F-01 |
| 7 | History uses important events only | PASS | 7–8 events per company (Toyota 8, Sony 7, Nintendo 7, Mitsubishi 8, Tokyo Electron 7), each with a sourced 意味. Whether each one is "important" is editorial; the ones I checked are turning points the sources describe |
| 8 | Industry navigation works both directions | PASS | `/companies/tokyo-electron` → `/industries/semiconductors` → back to Tokyo Electron and Sony |
| 9 | Related companies work | NOT BUILT | `relatedCompanies: []` in all five entries; the section is hidden. Type, test and component exist, but no reader can use it |
| 10 | Search works | PASS | Name, hiragana reading, securities code, business keyword and industry all found; no-results message shown |
| 11 | Favorites work | PASS | `aria-pressed` toggles; `company-favorites` persists; the home page lists the saved company; a corrupt value degrades to empty |
| 12 | Recently viewed works | PASS | `["toyota","nintendo"]` newest first, no duplicates, shown on home as 「最近見た企業」 |
| 13 | Terms work | NOT BUILT | `/terms`: 「用語はまだ掲載していません」; the term popover has no content to exercise |
| 14 | Feature links work | NOT BUILT | `/features`: 「特集はまだ公開していません」; only the placeholder route `/features/none` (404) exists |
| 15 | Sources are visible | PASS | Every section has a keyboard-reachable 「出典を見る（n件）」 disclosure with the document URLs |
| 16 | Reports work | NOT BUILT (delivery) | Saving on the device works and the form says honestly that reports do not reach editors (JCE-008). A report reaches no one, so its purpose — catching errors — is not met |
| 17 | Admin correction works | NOT BUILT | JCE-009; the admin banner says read-only |
| 18 | Revision history works | PASS (display only) | `/admin/revisions` lists revisions with sources; company pages show 最終更新. No flow can create a correction revision until #17 exists |
| 19 | Mobile layout works | PASS | 20 routes at 390px: no horizontal overflow, no console errors, bottom navigation present |
| 20 | Tablet layout works | PASS | Same check at 768px |
| 21 | Desktop layout works | PASS | Same check at 1280px |
| 22 | PWA installation works | NOT VERIFIABLE | Install requirements met: manifest (name, `start_url`, `standalone`, 192/512/maskable icons) and a service worker controlling the page. The install prompt itself was not tried (headless Chrome) |
| 23 | Offline fallback works | PASS | Offline navigation to an unvisited page serves the offline page; a page visited once the worker is in control is served from cache. The landing-page gap is F-02 |
| 24 | Accessibility basics work | PASS | `lang`, one h1, no heading skips, labelled controls, skip link first, keyboard reaches section tabs and chart bands with a visible focus stroke, data table alternative. Contrast and screen-reader output not measured; F-03 open |
| 25 | No unnecessary financial dashboard elements | PASS | Two figures, one chart, a collapsed table. No ratios, growth rates, good/bad colours or market data |
| 26 | No unnecessary information density | NOT VERIFIABLE | A design judgement; nothing observed contradicts it (long detail is in collapsed disclosures) |
| 27 | All filenames are kebab-case | PASS | Scripted check of `src/ public/ scripts/ tests/ docs/`; tool-mandated root files excepted |
| 28 | All folder names are kebab-case | PASS | Same check |
| 29 | All route segments are kebab-case | PASS | `about admin companies [company-id] features [feature-id] industries [industry-id] offline report search settings terms` |

Totals: 19 PASS · 1 FAIL · 5 NOT BUILT · 4 NOT VERIFIABLE (items 16 and 18 counted by their main status).

---

## 8. What I could not verify, and why

- **The master specification.** It is not in the repository. I judged §86 from the item text the coordinator
  sent, plus the §85/§89 context in that message.
- **Human-comprehension items** (3-second understanding, business model clarity, information density) need
  people, not a script.
- **Screen-reader output and colour contrast.** No assistive technology or contrast tool was run; F-03 comes
  from the ARIA spec, not from listening to it.
- **The PWA install prompt and iOS Safari.** Only headless desktop Chrome was driven.
- **Not every claim.** I checked the 10 latest-year figures, earlier years for Toyota, Nintendo and Sony, Sony's
  segment ordering (G&NS 4,685,651 > ET&S 2,260,532 > I&SS 2,151,533 > 音楽 2,120,110 > 映画 1,499,290 百万円,
  `yuho-2026` セグメント売上高 — matches the data order), and 16 prose claims. Not checked: earlier-year
  figures for Mitsubishi and Tokyo Electron, most product and customer lists, the other segment orderings, and
  the remaining history events (for example Mitsubishi 1954/1968/1974/2001/2003, Sony 1946/1989/1993/2021).
- **Official HTML pages** were checked as tag-stripped text. A claim that only exists in content rendered by
  JavaScript would have looked missing; every claim I looked for was found, so this did not come up.
- **Host behaviour.** There is no deployment, so response headers, HSTS, caching and the uppercase soft-404
  (P3-1) on a Linux host are unverified.
