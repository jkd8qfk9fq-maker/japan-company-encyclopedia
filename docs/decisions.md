# Decisions

Why the product is the way it is. Newest last. A decision that departs from the master
specification says so and says why.

---

### JCE-001 · 2026-09-13 · Accepted (operator)
**A separate project, not part of VALLE.** The specification differs from VALLE in subject, form,
stack and data source. Recorded on the VALLE side as D-040 in
`../company-data-platform/docs/VALLE_DECISIONS.md`.

### JCE-002 · 2026-09-13 · Accepted (operator)
**Seed with a few companies verified against primary sources, not ~100 written quickly.**
Specification §67 targets ~100 companies. Every entry is a set of factual claims; writing 100 from
memory would be fabrication. The first five are Toyota, Sony Group, Nintendo, Mitsubishi
Corporation and Tokyo Electron — chosen because their business structures have very different
shapes (flat segments, many segments, a single segment, a trading company, a B2B equipment maker),
which tests the claim that the structure component handles company-specific shapes.
Procedure: `docs/research-protocol.md`. Evidence: `docs/research/<id>.md`.

### JCE-003 · 2026-09-13 · Accepted — departs from spec §22
**Revenue and net income share one chart with ONE zero-based y-axis, not two.**
The spec allows a dual axis "when necessary". It is not necessary: both series are yen, and on a
shared axis the net-income column is readable at every company tested. It would also be harmful —
two scales let net income be stretched to any height, showing a beginner a profit margin that does
not exist. On one axis, the gap between the columns IS the thing worth understanding.
Geometry is unit-tested (`tests/financial-chart-geometry.test.ts`). Palette validated for both
themes with the dataviz checker (CVD ΔE 25.6 light / 16.2 dark).

### JCE-004 · 2026-09-13 · Accepted — departs from spec §17 in mechanism, not intent
**The company page "tabs" are a sticky section navigation over one continuous page, not panels
that hide content.** The page is ordered the way understanding deepens (3 s → 30 s → 3 min →
10 min), so scrolling is the progression. Hidden panels would break in-page search, make an
offline-saved page partial, and hide content from the 3-second-to-10-minute path. The bar looks and
behaves like tabs (sticky, horizontally scrollable on phones, active state follows scroll).

### JCE-005 · 2026-09-13 · Accepted
**The business structure picks its layout from what fits.** 2–4 top-level businesses: a top-down
tree (as in the spec's Toyota drawing) on wide screens, a left-rail tree on phones. 5+ businesses
(e.g. a trading company's groups): the left-rail tree everywhere. The shape always comes from the
data; nothing pads a flat structure to look fuller, and children appear only where the company
itself describes sub-businesses.

### JCE-006 · 2026-09-13 · Accepted
**Type extensions beyond the spec's data model**, each to keep absence and provenance honest:
`Source.id` + per-section `sourceIds`; `revenue`/`netIncome` as `number | null` (not optional);
verbatim `revenueLabel`/`netIncomeLabel` (営業収益, 売上収益, 収益 are not all "売上高");
`accountingStandard` per year; `listings[]` (Toyota is listed in Tokyo and Nagoya); `status` with
`needs-attention` notes; `revisions[]`. `entertainment` was added to the industry taxonomy — games
have no honest home in the spec's list.

### JCE-007 · 2026-09-13 · Accepted
**Business model is a vertical five-step flow at every width.** Five side-by-side columns were
built and rejected after viewing the rendered page: at desktop width each column held about eight
Japanese characters per line.

### JCE-008 · 2026-09-14 · RESOLVED 2026-09-15 (operator) — see JCE-015
**Reports do not reach anyone yet.** Spec §46–47 and §54 describe reports flowing to admin. With
static data and no server, a report can only be saved in the reader's localStorage, where no editor
will ever see it. The form says so plainly rather than pretending it was sent.
Delivering reports needs a server-side store, which has **recurring cost** — an operator decision.
Options: (a) a hosted database or form backend; (b) a repository issue per report via a serverless
function (no database, needs a token and a repository); (c) email via a transactional mail service.

### JCE-009 · 2026-09-14 · RESOLVED 2026-09-15 (operator): git-based
**Admin corrections cannot reach readers without a persistence decision.** Spec §48–51 describes an
admin editor whose corrections appear to everyone with revision history. Content is static modules
today, so an in-browser editor could only change the editor's own copy — a correction that looks
published but is not. That would be worse than no admin. Two honest paths:
(a) **git-based**: admin edits produce a commit / pull request against `src/data/`; publishing is a
deploy; revision history is git plus the `revisions` field. No running cost beyond hosting.
(b) **database-backed**: content moves behind the existing repository interfaces into a hosted
database; admin writes to it directly. Recurring cost, plus authentication for `/admin`.
Until decided, no admin editor is built. The repository interfaces already isolate the UI from
either choice.

### JCE-010 · 2026-09-14 · Recorded for Phase 6
**Automatic AI publication (spec §52) is the operator's decision for this product, and it is
different from VALLE's.** What this codebase already provides so that it can be done safely:
per-section sources, explicit nulls, `needs-attention` status with notes, a data integrity suite
that rejects unsourced sections, and revision history. The research agents that produced the seed
entries each caught and removed their own unsupported claims on re-check — evidence that a
self-verification pass is necessary, not optional, before anything is published automatically.

### JCE-011 · 2026-09-14 · Accepted — responds to independent review F-07
**The company hero follows the spec's own order (§18): name, official name, one sentence, structure.**
Code, market, industries and actions moved below the structure; the wordmark shrank (more for long
names). Measured afterwards in fresh browser contexts: the structure starts at 430–448px on desktop and
~430px at 390×844; at 1280×800 all first-level businesses are above the fold for three of five companies,
3 of 6 for Sony Group and 4 of 7 for Mitsubishi Corporation. The measurement also exposed that every
company page had been opening scrolled 180–490px down (the section tab bar called `scrollIntoView`); fixed.

### JCE-012 · 2026-09-14 · Accepted — responds to independent review F-01
**Revenue and net income each carry their scope when either changes across the series.** Sony's net
income includes the discontinued financial business in every year while its revenue excludes it from
2024年3月期, so for those years the gap between the columns is not a margin. `netIncomeBasis` is required
on every year whenever `revenueBasis` is set, and the page says in body text which years' columns
measure different perimeters. Plotting continuing-operations net income instead was rejected: the 有報's
five-year table does not print it for every year, so the series would mix sources.

### JCE-013 · 2026-09-14 · Accepted — responds to independent review F-05 and P3-2 (admin part superseded by JCE-015)
**Two fail-closed guards for production builds.** `/admin` returned 404 unless `ENABLE_ADMIN=true`
(it had no authentication; replaced by password login in JCE-015), and a production build throws without `SITE_URL` rather than publish
localhost canonical URLs, sitemap and robots. Both follow the principle already used for data: an unset
precondition stops the build instead of producing something that looks right and is not.

### JCE-014 · 2026-09-15 · Accepted — departs from spec §25's example chain
**In a chain industry, equipment and materials are drawn beside the chain, not inside it.**
The spec's example is 設計 → 製造装置 → 材料 → 製造 → パッケージ → 最終製品. The authoritative source used
(経済産業省「半導体に係る安定供給確保を図るための取組方針」, 2025 revision) splits making a semiconductor into
設計・前工程・後工程 and describes 製造装置・部素材・原料 as what that manufacturing needs — not as steps that
follow design. Arrows through them would teach an order that does not exist. `IndustryCategory.role`
(`stage` | `input`) now distinguishes the two; stages are drawn in sequence, inputs under
「工程を支える産業」. Tokyo Electron is placed in 製造装置; Sony Group in 設計, 前工程 and 後工程, with its
outsourced logic wafer recorded in the research log.

### JCE-015 · 2026-09-15 · Accepted (operator) — resolves JCE-008 and JCE-009
**Readers' reports are stored on the server and read in a password-protected admin. Corrections are git-based.**

The operator is the only editor, and the site is meant for other readers too. First instinct was to keep
reports in the reader's localStorage and have the form say they reached the editor; that would have been
true only for reports the operator filed on their own device, and false for every other reader. Instead:

- **Storage.** `POST` via a Server Action → Postgres (`DATABASE_URL`; schema in `db/migrations/`).
  Development without a database uses `.data/content-reports.json` (gitignored). Production without a
  database refuses the report and tells the reader so — nothing is "received" into a place nobody reads.
- **Only now may the form say 「編集者に届きました」**, because it is true.
- **Abuse.** Every field goes through `validateReportInput` (the only gate; the form's checks are
  convenience). Page paths are rebuilt from the validated company id, never taken from the post. A hidden
  honeypot field; 10 reports per sender per hour, keyed by an HMAC of the client address — the address itself
  is never stored. The database repeats the validation as CHECK constraints.
- **Admin authentication.** One password (the operator), scrypt-hashed; a stateless HMAC session cookie
  `admin-session` (HttpOnly, SameSite=Lax, path `/admin`, 12 h). `requireAdmin()` runs in the protected
  layout AND in every admin Server Action, because actions are reachable by direct POST. Missing settings
  close the admin. Login attempts are throttled in memory — best effort on serverless; the password length
  (≥ 12, enforced by the hash script) and scrypt cost are the real defence. Admin routes are forced dynamic:
  an early return without reading the cookie had let the build prerender them.
- **Hash format uses ":" not "$".** Next.js expands `$NAME` in .env files; a `$`-separated hash was
  silently corrupted and the right password never matched. Found by the end-to-end test, now pinned by a unit
  test.
- **Corrections (JCE-009 → git-based).** Admin corrections will be produced as changes to `src/data/` with a
  `Revision` appended, published by deploying. Not yet built.
- **Removed:** the `content-reports` localStorage key (spec §42) — superseded by server storage.
- **Verified end to end** (dev server, real browser): unauthenticated `/admin` → login; report submitted
  and confirmed; wrong password rejected; login; report listed; status changed; logout re-locks. Production
  build without settings: admin closed, report refused with a visible message, no confirmation shown.

### JCE-016 · 2026-09-15 · Accepted (operator) — Git-Based Correction System
**Corrections are made locally in the admin editor and published through git. Production never writes content.**

Operator specification of 2026-09-15: local admin editing + git; no GitHub API or pull requests from
production yet; zero cost and operationally simple; the repository is the source of truth.

- **Content is JSON** (`src/data/**/*.json`), because the editor must rewrite it safely and a TypeScript module
  with comments cannot be rewritten without losing them. The conversion was proven lossless (every committed
  TS value deep-equals its JSON), and every comment moved verbatim into the entry's research log.
- **zod** (the one added dependency) parses every file at load — a malformed file fails the build — and every
  save. Strict objects make an unknown key an error. Compile-time assertions keep the schemas and
  `src/types/` in agreement; a planted drift was observed failing the typecheck.
- **Revisions are records**, the spec's type {id, targetType, targetId, changedAt, reason, summary, before,
  after}, one file each in `src/data/revisions/` — separate from the content they describe, so an entry
  cannot rewrite its own history, and one file maps to one database row later. Embedded histories were
  migrated to `*-initial` records.
- **The save path** (`src/lib/content/content-store.ts`) refuses: a file changed since the editor loaded it;
  anything failing the schema or the shared integrity rules (`src/lib/content/integrity.ts`, also run by the
  tests); no change; no summary or reason; a removed source without explicit confirmation; removing a source
  a section still cites. It writes the revision before the content and keeps key order so the git diff is
  the change alone. It never runs git.
- **Editing is local only**: NODE_ENV=development, not Vercel, not CONTENT_EDITING=off. Production /admin
  offers login, reports, report details, source review, correction notes (`admin_note`, migration 0002) and
  revision history — read-only for content.
- **Report and revision stay separate.** The correction note on a report is where the link is written down.
- **Statuses**: 未対応 → 調査中 → 解決済み as specified, plus 対応不要 for reports that turn out not to be errors
  (and spam), so they leave the queue without being marked "resolved".
- **Naming**: JSON property names stay camelCase, matching the spec's own TypeScript types (`targetType`,
  `changedAt`); kebab-case applies to ids, file names, routes and storage keys.
- **Scope**: companies and terms are editable (spec §5). Industry pages are corrected by hand plus a revision
  file until an industry editor is needed.
- **Verified in a real browser**: 百万円 input 1695345 saved as 1695345000000; review showed only 財務;
  the git diff was two lines (value and updatedAt); the revision held before/after; the test change was
  restored. Report detail: note persisted, status 対応不要 removed it from the active queue.
- **Future** (not built, by decision): production admin → GitHub pull request → review → merge → deploy.
  `ContentStore` is the seam where a pull-request writer would replace the file writer.

### JCE-017 · 2026-10-11 · Accepted (operator) — Front page redesigned after a design reference

The operator supplied a reference image for the front page and asked for it to be built first, leaving out what
the site does not have. What changed, and what was deliberately left out:

- **Built**: header (name with a 朱 rule, tagline, nav, search field, settings), a hero band with search, search
  examples and three facts (listed companies, industries, primary sources), and three columns — industries as a
  starting point; companies with latest revenue, net income and a five-year chart; a reading list and the most
  recently updated companies. Server Components throughout; the search fields are plain GET forms to `/search?q=`.
- **Left out because the site has no such thing**: market-cap and fiscal-year filters, the compare tool, company
  logos, the saved-companies link in the header (saved companies still show on the page when there are any), the
  market-wide revenue chart, the "popular keywords" label (there is no usage data — shown as "検索例"), and the
  reference's explainer articles (replaced by the existing features, or the glossary when there are none).
- **Departure from the palette rule** ("one accent: 藍"): a small 朱 (`--seal`) rule marks the site name, section
  titles and the active nav item, as in the reference. It is a marker only — never a state, never gain/loss,
  never text or a fill behind text.
- **Invariant 4 is kept**: revenue and net income appear only on the three cards, in context with their chart and
  fiscal year; no ratios, no rankings, no change figures. The cards are headed 「解説つきの企業」: published pages
  with at least four complete years, largest latest revenue first — the order only picks which three to show
  (`src/lib/home.ts`, tested).
- **Header height** 3.5rem → 4.25rem (`--header-height`); desktop nav labels 企業を探す / 業界から探す / 特集 / 用語集.

### JCE-018 · 2026-10-16 · Accepted (operator) — Gradual release, and automatic financial updates

Follows the operator's answers of 2026-10-16 to the release proposal. The repository stays the source of truth
(option A); problems are reported as they come up.

- **Release line.** Only `published` companies are public: 184 at the first release. `figures-only` and
  `needs-attention` entries stay in the repository and the admin editor but have no page — not listed, not
  searched, not in the sitemap, not linked from another company, and their URL is a 404. Promoting an entry to
  `published` releases it; nothing else changes. Implemented once, in the repository layer (`src/lib/release.ts`;
  `companyRepository.list/get/getMany/listByIndustry` are the public view, `listAll/getAny` the admin's).
- **Sharing.** Company pages carry X, copy-link and device share-sheet buttons (Instagram has no web share URL;
  its routes are the share sheet and a pasted link) and a `twitter:card`. Per-company share images are not built:
  they need a Japanese font file shipped with the app, which is a separate decision.
- **Wikipedia** stays a lead-finder only (`wikipedia-company-search`): never a source, never written into
  `src/data/`. Invariant 3 and the `finalize.mjs` / `npm test` checks are unchanged.
- **Financial figures update automatically; prose never does.** `scripts/pipeline/refresh-financials.mjs`
  (`npm run content:refresh-financials -- --all --apply`) finds registered companies whose newest 有価証券報告書
  has a later fiscal year end than the newest year in their `financials` — decided from the entry alone, so a
  manual run and CI agree and `pipeline/state` is not needed (it only remembers what a person already looked at).
  It reads the new year from EDINET and adds it to `financials` with the filing as a new source and a Revision;
  the oldest year leaves so the five-year window holds. Rows already registered, prose and status are untouched,
  so a published page stays published. It writes only if verify-financials, the schema/integrity rules and the
  integrity suite pass (and puts everything back if the suite fails). It HOLDS — not an error — when the new
  filing prints a different value for a registered year (a restatement), changes the year end, has an irregular
  period, mixes accounting standards, or the source id clashes. A company whose evidence cannot be fetched or
  whose result fails verification FAILS the run (exit 1); a day of the EDINET index that cannot be vouched for
  fails the whole run. Nothing it cannot read is filled in (invariant 1). It never runs git: the operator reviews
  `npm run content:diff` and commits (invariant 9). `--rehearse <id>` re-derives a company's newest registered
  year from EDINET without writing anything, to prove the path on real data. Default scope is the promoted tiers.
- **Scheduled detection (GitHub Actions, private repository).** `.github/workflows/refresh-financials.yml` runs
  every day at 07:00 JST, **detection only**: no `--apply`, no commit or push, a token with `contents: read`
  and nothing else, one secret (`EDINET_API_KEY`), and a check that `src/data` did not change. Candidates, holds
  and failures are in the job log, the job summary and the `refresh-report` artifact (30 days). A person applies an
  update locally, reviews the diff and commits. Issue notifications are deliberately not built yet; automatic
  writing, if ever, is a separate decision. `tests/refresh-workflow.test.ts` pins these properties.
- **Open.** "Quarterly" is not modelled: EDINET carries one 有価証券報告書 a year, which the schema stores, so a
  daily scan picks each one up as it is filed. Figures from 決算短信 or 半期報告書 would need a schema decision.
  EDINET's terms of use for scheduled API access are still to be confirmed (continuous-update-decisions B-6).

### JCE-019 · 2026-10-16 · Accepted (operator) — Release review, and an operator-only draft console

Before the first push, what the site would show readers was reviewed on a production build of the publication set (not
only on the repository), and a place was added where operators can see unreleased entries before releasing them.

- **What was checked.** Every prerendered page, RSC payload and client chunk of the build was scanned for unreleased
  companies, review notes, working-process wording, local paths and settings; the served site was probed (unreleased
  pages, admin, search, sitemap, listings); and the 184 published entries were scanned for process wording and
  unfinished markers. Found: nothing of an unreleased entry reaches readers (404s, sitemap and search index hold the
  184 released companies only, no client chunk carries company data) — and one defect: prose in published entries
  linked to registered-but-unreleased companies, which was a 404. `RichText` now links a company or industry only if
  its page exists, and leaves the label as plain text otherwise (`withoutUnavailableLinks`, tested).
- **Left as it is, on purpose.** Industry pages without a researched explanation say 「解説は準備中」 (18 of 19 pages):
  it is an honest placeholder and the page is the way to browse released companies by industry. The admin editor's
  client code is in the public JavaScript chunks; it carries no data, and every admin page and action checks the session.
- **The draft console.** `/admin/drafts` lists every entry without a public page (要確認 / 数値のみ), with a search and
  paging, and `/admin/drafts/<id>` previews one with the component that renders the public page (`CompanyView`), under
  a banner that says what is still missing. It is under `/admin`: `requireAdmin` guards it, the session cookie exists
  only on `/admin`, it is `noindex`, never prerendered, and nothing on the public site links to it. A draft is shown as
  readers would see it today, so a link to a company that is not released is plain text there too.
- **Readiness** (`releaseReadiness`) is the integrity rules applied to the entry as if it were `published`, plus its open
  review notes. It decides nothing; it says what stands between the entry and the public site.
- **Releasing one at a time.** Preview in the console → in the local editor set the state to 公開 (a Revision is
  written) → `npm run content:check` → commit and push → the site is rebuilt and shows the released companies only.
  Production still writes no content (JCE-016); releasing is a commit.

### JCE-020 · 2026-10-17 · Accepted (operator) — EDINET change detection made dependable

The first Actions run failed on 「日次索引 1 日（2026-10-16）を確認できず」. Cause, established by reading EDINET's answers:
`processDateTime` is the time of EDINET's nightly batch (0:00–0:06 JST, the same value for every day), and a day is final only
once a batch has run on a LATER date — so the index for "yesterday" is not final between midnight and the batch.
- `ensureIndexCache` now returns why each day is unresolved (`reasons`: not final, key missing, key refused, rate limit,
  server error, network error, EDINET's own message) and can wait for what waiting can fix (`waitForFinalMs`, polling).
  `refresh-financials` waits up to 10 minutes (`--wait-final`); other callers keep the old behaviour.
- A missing or refused key stops the run at once, for every remaining day, without more requests. EDINET reports a refused key
  as HTTP 200 with a body `{"StatusCode": 401, "message": …}` (no `metadata`); that is now recognised.
- Every message and report passes through `scrubSecrets`: the key, and any `Subscription-Key=…`, never reaches a log,
  the job summary or the report artifact. Network failures are reported by their error code only.
- Consecutive days with the same reason are shown as one line (`groupReasons`).

### JCE-021 · 2026-10-17 · Accepted (operator) — Listing status, industry and new listings from the EDINET code list

The EDINET code list (EDINETコードリスト, one 0.6 MB file, updated daily) gives every filer's 上場区分, 提出者業種 (33 industries)
and securities code. `scripts/pipeline/sync-listing.mjs` reads it and reports how it differs from the project.
- **Terms of use (EDINET 利用規約, WZEK0030, read 2026-10-17).** Content may be used under 公共データ利用規約 (PDL 1.0): name the
  source; say that a processed result is edited, and by whom. Machine retrieval from the website is prohibited except through the
  API or for content the API cannot give; the code list is not in the API and the terms do not mention it. Short-term bulk access
  is prohibited. So: the file is handed to the script (`--file`) by default; `--download` fetches it once, at most every 20 hours,
  and is not part of any scheduled job. **Still to confirm with the operator**: that this reading of the exception is acceptable.
- **Open (a requirement, not yet done): the site does not state the PDL 1.0 notice.** /about says facts rest on primary sources, but
  not that the data is edited and processed from EDINET by the operator. The wording needs the operator's name.
- **It reads, it does not act.** It writes only its own ledger `pipeline/listing.tsv` (with `--write`; refused if the list is
  malformed, short, or differs from the last ledger by more than 5%), never an entry, a state file or the universe. A difference —
  a registered company that is no longer listed, a new listing, a changed industry — is a report; acting on it is a reviewed step.
- First sync (list of 2026-10-16): 3,813 listed; 185 registered entries are not shown as listed (3 of them published or
  needs-attention: abalance, right-on, tryt); 106 listed companies have no entry (65 parked, 13 failed intake, 5 in the universe
  with no record, 23 new listings the universe has not seen).
- **Operator's decisions of 2026-10-17.** The code list is taken by hand (`--file`); `--download` is not to be scheduled; whether
  machine retrieval of content the API cannot give is allowed is held until the terms' reading is settled. The PDL 1.0 notice
  on /about waits for the operator's name; a proposal (position and wording, name still a placeholder) is in
  docs/source-terms.md, which also records the terms and what remains to do.


### JCE-022 · 2026-10-18 · Accepted (operator) — Registration autopilot, and one EDINET detector

Goal set by the operator: stop driving each company by hand. `scripts/pipeline/autopilot.mjs` (docs/auto-registration.md) takes a queue of
figures-only companies and does everything up to a review sheet; **registering stays a person's command** (`approve --confirm --hash`).
- **Programs do the work; a model writes two things.** Pre-checks, EDINET evidence, related-company candidates (names that are in the filing,
  with their listing status), number checks, source checks, schema/integrity, the writing rules, retries, state, the review sheet — programs.
  Group 1 (business structure, history) and group 2 (business model, industry, related companies) — a headless `claude -p` data-research
  agent (`ai-executor.mjs`; the operator's own login, a per-call and a total budget, no web tools unless asked, writes only to
  `pipeline/results`, never sees the EDINET key). Failed lines are repaired by sending the model only those lines (at most twice).
- **The operator's writing rules of 2026-10-17 became checks** (`prose-policy.mjs`, `check-policy.mjs`, and a gate in `finalize.mjs`): a
  one-sentence `businessModel.description`; the business, not the filing, is the subject; prose financial figures are revenue and net income only;
  a link needs an identity (name in the filing, listed per the EDINET code list) AND a relationship the filing states about that pair. They apply
  to new registrations; already-registered entries (written before the rules) are not rewritten and are not checked by `data-integrity`.
- **Nothing is registered or published by automation.** Production holds no queue (the files are local and git-ignored); `/admin/queue` is a
  read-only view; Actions and the site cannot register (pinned by tests). Approval needs `--confirm` and the sheet's content hash, so what was
  read is what is registered; a double registration is refused (`approve`, `finalize`, and the revision-id check).
- **One EDINET detector: the GitHub Actions workflow** (`refresh-financials.yml`, JCE-018). No Vercel cron, no second workflow, no site-side EDINET
  call (`tests/single-detector.test.ts`). The Postgres ledger/cron design of docs/continuous-update-plan.md is **not built**: the daily detection
  already covers the yearly update, and the registration queue is local. Revisit when the detection needs durable history.
- **Failure handling.** A rate limit or lost login pauses the whole queue without spending a company's attempt; any other failure costs an
  attempt (two per group), then holds that company with the reason; an unexpected exception holds only that company; a model that changed a
  file it must not touch holds the company and names the files; the run is single-instance (lock) and resumable (fragments and state are the memory).
- **Open.** Company sites are not collected automatically (their terms are unconfirmed, docs/source-terms.md); JPX is uninvestigated; relationship
  *content* (what the filing says about a pair) is read by a person on the review sheet; entries registered before the rules are not backfilled.

### JCE-023 · 2026-10-18 · Accepted (operator: "全て許可") — Autopilot judgements 1 and 2 decided; registration of the queue authorised

The operator authorised proceeding with the recommendations of docs/autopilot-decisions.md and with building companies.
- **Judgement 1 (company sites as sources): EDINET only.** `finalize.mjs` refuses a source on any other host unless the host is listed in
  `pipeline/source-allowlist.txt` (empty; a host is added after its terms of use have been read). Links that rested on a company's own pages
  (Sojitz→さくらインターネット, Suzuken→Welby, Obayashi→三菱地所) were removed from the queued entries with a line in each research log.
- **Judgement 2 (links to companies that are not listed): not linked.** A counterpart the EDINET code list does not show as 上場 is refused
  (`prose-policy.mjs` `not-in-ledger` / `not-listed` are errors); what the filing says about it goes to `warnings`
  (Idemitsu→富士石油, Daiwa House→住友電設 removed). G-FACTORY was removed from Hanwa's links (identity rested on the filing alone).
- **Judgement 3 (the 258 registered entries): not done.** It is a bulk change to pages that are already public and needs its own diff-first
  procedure (the standing rule for large data updates); it stays open in docs/autopilot-decisions.md.
- **Registration.** Queued companies are registered by the operator-authorised `approve`, after the program checks and my reading of each
  sheet's flags. Companies whose entry carries `needsReview` register as `needs-attention` (not public). Nothing is committed or pushed.

### JCE-026 · 2026-10-19 · Accepted (operator) — Company page redesign, stage 1: existing data only

The operator asked for a company page that is understood by looking — structure, flow, connections, history — and approved
stage 1 of the redesign plan (mockup: the "リデザイン案" canvas). Stage 1 changes presentation only.
- **No data change.** No new field, no schema change, nothing in `src/data`. What needs a field (revenue by segment and by
  region, a procurement step, event kinds, the business environment) is stage 2; the page does not draw a placeholder for it.
- **Order:** hero (name, one sentence, industries, structure, key facts) → 事業 → ビジネスモデル → つながり → 財務 → 歴史 → 業界 → 出典.
  Every section after the hero is drawn only when the entry has its data.
- **Key facts:** the latest year's revenue, net income and 従業員数 (operator's decision, 2026-10-19), with the filing's own labels and
  sources. Size only — no growth rate or ratio (invariant 4).
- **Connections map:** this entry's `relatedCompanies` plus released entries that name this company, turned around (being X's
  supplier makes X a customer; 関連会社 / その他の関係会社 become 出資元 / 出資先, since only the direction of ownership survives the
  inversion). Those inbound ties are listed separately, in the other company's words and with its sources. Unreleased companies
  are never drawn (no page to link to).
- **Business markers:** one swatch + number per top-level business, the same in the diagram and the list; colour never alone.
- **Photographs:** none on company pages (operator, 2026-10-19: the hero has no photo slot). Industry images belong to the
  industry map only, captioned as images with the photographer and Unsplash; not added until the photos can be fetched.
- **日経平均・TOPIX:** out of scope until the constituent lists' source and terms are confirmed.
- **Standard for every company (operator, 2026-10-19):** the design applies to all entries through the shared components
  and is the default for every future registration. Registration adds data only; CLAUDE.md says which fields fill which
  section. The industry map (the 産業マップ tab of `/industries`) aggregates `supplier` / `customer` ties of released companies.
- **Mockup layout (operator, 2026-10-19, "リデザイン案をできるだけそのまま"):** the page follows the approved canvas: hero
  with business chips and key facts, pill section navigation; 事業構造 = the structure diagram plus one card per business
  (first sentence of the entry's description + products; the full text folds open); the business model as a row of
  step cards (profit dark); a radial network beside a one-line-per-tie list (lanes on phones); revenue and net income
  as two bar charts, each on its own zero-based scale with values printed on the bars (the single-axis chart was
  replaced at the operator's request; the note under the charts says the scales differ); history as a horizontal
  timeline with the full year/出来事/意味 table folded below. Folding shortens nothing permanently: every sentence of
  the entry is still on the page. The mockup's segment share bar, procurement step and environment panel need data
  that does not exist yet and are not drawn.

### JCE-027 · 2026-10-20 · Accepted (operator) — Industries as one tabbed hub; phone tabs

- **Industries hub.** `/industries` is one page with tabs at every width: 業界一覧 (cards with the industry's companies
  and its trade lines) and 産業マップ (the industry map, folded in; `/industries/map` is gone). Each industry page is
  split into tabs: 仕組み / 企業 / つながり (the map's flows to and from that industry, company pair by pair) / 特集.
- **Phone tabs.** On a phone the company page shows one section at a time behind sideways-scrolling tabs, switched by
  tap or swipe; a link into a hidden section opens it. Every section is still server-rendered and in the document, and
  nothing is hidden until the script runs — offline and without JavaScript the page reads top to bottom as before.
  Wide screens keep the continuous page. This reverses the earlier "anchors, not panels" choice at the operator's request.
- **日経225・TOPIX: not built (operator, 2026-10-20).** The constituent lists are the providers' work: 日本経済新聞社
  requires a licence for business use and for providing index information to third parties, and JPX's reuse terms
  could not be read from the build environment. The prepared code (type, schema with a required `usageTerms`, a tab
  per index) was taken out before release and is in commit 95a51d2 for when the terms are confirmed.

### JCE-024 · 2026-10-19 · Accepted (operator) — Continuous pipeline: three layers, PRs for figures, all tiers, perspectives

The operator's answers to docs/continuous-pipeline-design.md §6, and the order of work (Phase 0 → master → metadata → figures → explanation).
- **Three layers by ownership, not by file.** `scripts/pipeline/ownership.mjs` names who may write each field: facts (identity, the five-year
  table) by programs that verify them; the explanation only through a person's approval; metadata alongside both. Automated writers
  (`refresh-financials`, `apply-amendment`) call `assertMachineWrite` before writing; `tests/field-ownership.test.ts` keeps the table complete.
- **Figures: GitHub Actions verifies and opens a pull request** when something changes; the site changes only when a person merges it.
  This is a change to JCE-016 ("no pull requests from production"): Actions is not the production server, writes nothing to `main`, and the
  pull request is the review step. The detection workflow keeps being the only scheduled EDINET caller.
- **All tiers are updated yearly**, figures-only included, with the existing checks; a failed fetch or check never removes good data.
- **New explanation fields**: growth strategy, competitive advantage, position in the industry — what the company itself discloses is kept
  apart from any analysis, each with its sources and the point in time it describes.
- **Approver: `YUGENQ`** for now, recorded so that individual approvers can be added later without changing the shape.
- **Financial table**: the page keeps showing the filing's six figures (commit d3a448e, 2026-09-21, at the operator's request). CLAUDE.md
  invariant 4 said "revenue and net income are the only financials", which was written before that change; it now says what the page shows,
  and that prose cites revenue and net income only.

### JCE-025 · 2026-10-19 · Accepted (operator) — An approval an AI ran is recorded as the AI's, never as the person's

Three companies registered on 2026-10-19 (tohoku-electric-power, sumitomo-forestry, nh-foods) carry a revision whose `approval` names
YUGENQ (kind operator), but Claude Code ran `autopilot approve`, reading the review hash with a script; no person read the sheets. The
basis was the operator's standing permission of 2026-10-18 (「全て許可します」), not a reading of each sheet.
- **The history is appended, not edited.** Each company gets a revision `<date>-company-<id>-approval-correction` with `corrects` (the
  revision it corrects), `before.approval` (as written) and `after.approval` (as it should read). `effectiveApproval`
  (src/lib/content/approvers.ts) reads the corrected one; `tests/data-integrity.test.ts` checks that a correction points at an earlier
  revision of the same content and that its `after.approval` is a valid approval.
- **Approver kind `agent`.** An agent's approval must carry `onBehalfOf` (the person whose authority it used) and `basis`; a person's must
  not. `src/data/approvers.json` lists `claude-code` (kind agent); it is never the default and never chosen with `--approver`.
- **Recorded mechanically.** `approve` run inside an AI agent (`CLAUDECODE=1`, or `JCE_AGENT=1`) records an agent approval on the default
  approver's authority (`scripts/pipeline/approvers.mjs` `approvalFor`). Only the operator running it is a formal approval.
- **Not decided here:** whether a proxy-approved entry may stay published until a formal approval, and the 16 companies registered on
  2026-10-18 the same way (their revisions predate the approval field and record no approver, so they state nothing false).

### JCE-028 · 2026-10-20 · Accepted (operator) — An AI proxy approval is enough to publish; it stays recorded as one

The operator decided that an explanation approved by an AI on the operator's authority may be published without a separate formal approval
(the question left open in JCE-025; numbered 028 because JCE-026 and JCE-027 were taken by the company-page work merged the same day). The release line is unchanged: `published` entries are public, whoever approved them.
- **The record keeps the difference.** An `approve` run by an AI is recorded as `approver.kind: "agent"` with `onBehalfOf` and `basis`
  (JCE-025); the admin revision pages show 「AI の代理承認」 or 「正式な承認」 (`approvalLabel` / `effectiveApproval`).
- **The 16 companies of 2026-10-18** got approval-correction revisions too (their revisions predate the approval field): the history now
  says, for all 19, that Claude Code ran `approve` on the standing permission of 2026-10-18. The original revisions are unchanged.
- **Dates are the system's** (same day): `accessedAt` is set by `finalize` from the evidence pack's build time as a JST date, and every date
  the pipeline writes or checks is a JST date — agents no longer write it (japan-tobacco and nippon-yusen were held by a UTC/JST mismatch).

### JCE-029 · 2026-10-22 · Accepted (operator) — Search suggests as you type; results in 50音順

- The header and front-page search fields suggest up to eight matches as you type (`SearchSuggest`), from
  `/search-index.json`, a static file built with the site and fetched only when a field is focused. Without JavaScript,
  or if the file cannot be fetched, the fields are the plain GET forms they were. The form now carries the base path,
  so it also works on the GitHub Pages preview.
- Order (suggestions and /search alike): an exact name or code first, then every match in 50音順 by Japanese
  collation of a sort key — the ひらがな reading for terms and industries (`INDUSTRY_LABELS.reading`), the name for
  companies and features. **Company names in kanji are not truly 50音順**: entries carry no reading, so a kanji name
  sorts by its characters (roughly their 音読み). The EDINET code list's 提出者名（ヨミ） would fix this; it is not
  taken in yet.

### JCE-030 · 2026-10-30 · Accepted (operator) — Speed first: EDINET trusted as filed, Wikipedia to supplement, one check to publish

The operator's priority is output speed.
- **Sources.** The 有価証券報告書 (EDINET) is the basis of every entry and is trusted as filed — nothing in it is re-verified
  against other material. Japanese Wikipedia may be used to *supplement* it: what the filing does not say (former names,
  brands, product names, background), paraphrased (CC BY-SA: never copied), cited as its own source. Never a figure
  (financials may not cite it; `integrity.ts`, `tests/data-integrity.test.ts`), never anything that contradicts the
  filing, never the only basis of a link. `ja.wikipedia.org` is on `pipeline/source-allowlist.txt`; agents may read one
  article per company (`autopilot run --allow-web`; `docs/agent-brief.md` §2a). This replaces invariant 3's "never
  Wikipedia" (CLAUDE.md updated).
- **Registration in bulk.** `autopilot approve-ready [--include-flagged]` registers every ready sheet in one command,
  sequentially, with each entry's own checks but without the whole-repository suite per company (`--no-repo-gate`).
- **One check to publish.** `npm run content:publish`: brings in other sessions' commits from GitHub (stops on a file both
  sides changed), runs the type check and the whole suite once, copies to the clean clone, commits and pushes. No local
  static build: Cloudflare builds, and a failing build there leaves the previous site up.

### JCE-031 · 2026-11-01 · Accepted (operator) — Industry 仕組み tab: photographs, an illustrated chain, a network

After the operator's two references (an upstream → own operations → downstream illustration, and a coloured
industry network):
- **Photographs.** One per industry at the top of the 仕組み tab, and one per stage of a researched structure, all from
  Unsplash under the Unsplash License, stored in `src/assets/industries` (served by next/image, so the static export and
  its base path work). **No credit is shown**, by the operator's choice (the licence does not require it); where each
  file came from is recorded in `src/assets/industries/SOURCES.md`. A photograph shows the kind of work, never a
  company's own site, product or a visible brand. Replaces "industry images belong to the industry map only".
- **Illustrated chain** (`ValueChain`, for `structure: "chain"`): chevron bands, numbered photo cards with the first
  sentence of each stage's sourced description and its companies; `input` categories in their own band joined by a
  dashed border, not placed before the first step. On a phone the cards are a sideways swipe row.
- **Network** (`IndustryNetwork`, every industry): the industry at the centre, its companies on a ring, the industries
  they trade with outside — only `supplier` / `customer` ties, coloured per industry with the site's segment palette,
  circles sized by the number of ties. Companies trading with the same industry are grouped so their lines run together.

### JCE-032 · 2026-11-01 · Accepted (operator) — Industry photographs wherever an industry is listed; Pexels as a source

The operator asked for images where they were still missing, from Unsplash or Pexels. unsplash.com and pexels.com
(site and API) refuse this environment, so photographs are taken from their image CDNs by photo id and each one is
checked by eye. The industry photographs of JCE-031 now also appear as thumbnails on the 業界一覧 cards, the 産業マップ
buttons and the front page's industry list; the industries hub and its 産業マップ tab get a Pexels banner each (Pexels
License, no credit required or shown). Provenance: `src/assets/industries/SOURCES.md`.

### JCE-033 · 2026-11-01 · Accepted (operator) — A photograph for every category; segment industries drawn as cards; uniform hub tiles

The operator asked for the industries list to be designed through its images and for the remaining gaps to be filled
from Pexels. Every category of every researched industry now has its own photograph (93 from Pexels, the six
semiconductor ones from JCE-031), keyed `<industry id>/<category id>` because category ids repeat across industries
(`src/assets/industries/stages/`). Each was checked by eye; candidates showing a readable brand (app icons, a shop
sign, a carrier label, a forklift maker) were rejected. `segments` industries use the same photo cards as the chain,
under one band 「事業の分類」 and without numbers or arrows, which would state an order the sources do not; the text-only
`IndustryStructure` is removed. On the hub, every industry tile is the same size (nearly all are researched, so the
double tile no longer distinguished anything); an unresearched industry is marked 「解説は準備中」 instead. The phone
gets the industry map drawn as a diagram at its own size rather than a list.

### JCE-034 · 2026-11-02 · Accepted (operator) — Head offices on a map: the home page and /prefectures

The operator asked for the home page to be redesigned after a reference image (generated, so its elements were
taken and its look was not) and for a map of Japan from which a reader can find where companies have their head
office. What it rests on:

- **Where**: the EDINET code list's 所在地 (金融庁, under 公共データ利用規約 PDL 1.0 — named and marked as edited on every
  page that shows it). The address rarely names the prefecture, so `scripts/pipeline/sync-headquarters.mjs` reads the
  municipality it opens with and looks it up in 総務省's 全国地方公共団体コード (`pipeline/municipalities.tsv`). A name
  that exists in more than one prefecture (府中市, 森町, 朝日町 …) gives a prefecture only when the address names it;
  otherwise the company is left out, never guessed. Only the prefecture and municipality are kept, in
  `src/data/headquarters.json`; the street address is not.
- **The map**: Natural Earth admin-1 outlines (public domain), simplified by `scripts/maps/build-japan-map.mjs` into
  `src/assets/japan/prefectures.json`. Prefectures are shaded in steps by the number of published companies whose head
  office is there — no dots placed inside a prefecture, which would show positions the data does not have. The
  Okinawa Islands sit in an inset; Natural Earth's filing of Amami and Yoron under Okinawa is corrected by leaving them
  out of it.
- **Pages**: `/prefectures` (the map and the 47 as a list by region) and `/prefectures/<id>` (the companies by
  municipality, the most common industries). Company pages show 本社 with a link to their prefecture.
- **Home**: hero and search as before, then 本社所在地から探す (map and the prefectures with most companies), 業界から
  探す as photograph cards, then the written companies beside the glossary and recent updates. No stock-photo hero, no
  logos of companies, no figure the encyclopedia does not have.

Amended 2026-11-02 (operator): the map zooms — pinch, the ＋/−/全体 buttons under it, or a trackpad pinch — and pans
once zoomed, so a phone can tap a small prefecture; a drag never opens a prefecture. Prefecture names (with their
counts) are written only when zoomed in. A prefecture page opens its map zoomed on that prefecture. Each prefecture's
company list has a search box (name, securities code, municipality, industry; width- and kana-insensitive).

### JCE-035 · 2026-11-02 · Accepted (operator) — Cheaper registration: one writing call, a short AI-only brief, a compact pack

Operator order of 2026-10-31 (after batch 2): cut tokens and cost per company without lowering quality.
A new company is written in **one** model call (group `all`: all six stages); updates keep the two groups, since they
rewrite only the stages a newer filing changed (`--two-calls` restores the old split). The rules the agent needs are in
`docs/agent-brief.md` alone, passed as system prompt (`--append-system-prompt-file`); the agent no longer loads
`.claude/agents/data-research.md` or reads `docs/pipeline.md`, and the call runs without MCP servers, plugins' skills,
slash commands or user settings (a turn's base context 56k → 14k tokens). The pack adds `sections.txt` (one sentence per
line, without officers, governance, audit, accounting policy and the statements; 204k → 61k characters for
mizuho-leasing) and the candidate list ignores officers' careers and the audit sections and katakana/latin names inside a
longer word (−25–45 %, no published link lost). A pack whose fiscal years disagree with the printed 決算年月 is held
before any model call and refused at approve. **`major-shareholder`** becomes a relationship kind: a business company in
【大株主の状況】 that is none of the four capital kinds (trust banks and financial institutions' pure investments are not
linked). A fragment with no industry, no or two primaries, or a doubled industry fails the fragment check. Wikipedia
(JCE-030) is fetched once when the pack is built (`wikipedia.json`, identity by securities code in the article), so the
agent has no web tools.

### JCE-036 · 2026-11-08 · Accepted (operator) — Groundwork for revenue: PDL attribution, privacy policy, analytics, and the advertising rules

The operator asked for a monetisation proposal and then for its first steps 1, 2 and 4 (2026-11-08): the groundwork
every revenue source needs, the rules for advertising, and a sample teaching material with a proposal for schools and
companies (kept outside the repositories).

- **PDL 1.0 attribution**: wording 案A of docs/source-terms.md is now on /about (「データの出典と加工について」, with the
  Wikipedia supplement of JCE-030 named) and as one line in the footer.
- **/privacy**: states only what the site does — browser-local favourites/history/settings, reader reports (no name or
  e-mail; an irreversible key from the IP address for rate limiting), cookieless page counts, the host's access logs,
  no ads. Any new collection, an ad network above all, is added there before it goes live.
- **Analytics**: Cloudflare Web Analytics (no cookies, no identifier in the browser, so no consent banner). Off until
  the operator sets `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (Workers build) / the repository variable `CF_ANALYTICS_TOKEN`
  (Pages workflow); the token is public by design. Steps in docs/cloudflare.md.
- **Advertising rules** (published on /about#advertising before any ad exists; ADS_ENABLED stays false until the
  operator decides a placement):
  1. Every advertisement, affiliate link and sponsored article is labelled 「広告」 or 「PR」 where it starts
     (景品表示法 告示 令和5年第19号, in force 2023-10-01).
  2. Ads go only in the AdSlot placements (feature-inline, company-bottom, industry-inline, home-feature) — never inside
     the one-sentence description, the business structure, the business model, the financials or the history, and
     never between a claim and its sources.
  3. No advertiser or payment changes what an entry says or the order entries appear in. Sponsored articles are
     separate from entries; any fact in them is sourced like an entry's.
  4. No advertising or affiliate for opening securities accounts or buying financial products: it would contradict
     invariant 4, and paid introductions of that kind may need registration (金融サービス仲介業).
  5. Affiliate partners fit the readers (job hunting, careers, learning about industries and companies). Each one is
     recorded here before it goes live.

### JCE-037 · 2026-11-08 · Accepted (operator) — Glossary words explained wherever they appear

The operator asked for the difficult words of every company and industry page to carry the same tap/hover explanation
the glossary already gives (example: 「精密切削加工部品」「精密研削加工部品」). Marking each word up in 3,900 entries by
hand would not keep up, so the explanation is attached at render time: `src/lib/term-linking.ts` finds glossary words in
the plain text of any rich text (descriptions, businesses, the business model, industry pages) and in the products and
customers lists, and links the first occurrence of each per text. Explicit `[[term:…]]` markup still works and wins.
Latin and katakana names match only as whole words (「リース」 is not found in 「リリース」); the longest name wins; the
four accounting words that are in almost every entry (有価証券報告書, セグメント, 連結子会社, 子会社) stay explicit-only.
A term may list `aliases` (「切削」 for 切削加工, 「ジェネリック医薬品」 for 後発医薬品) used only for finding it.

Nineteen terms were added from primary sources (industry associations, the e-Gov text of the laws), recorded in
docs/research/terms-2026-11-08.md with the words that could not be sourced this round. Adding a term to src/data/terms
is now all it takes for every page that uses the word to explain it.

### JCE-038 · 2026-11-09 · Accepted (operator) — モノとお金の流れ, comparison figures, and three computed ratios

The operator brought an extraction prompt (a Sankey `sankey_data` of supplier → segment → customer with segment
shares as weights, and `comparison_metrics`: revenue, 純利益率, 海外売上高比率, 平均年間給与, 平均勤続年数, 従業員数,
top 3 segments) and a reference image of a value-chain flow with a すべて／モノ／お金 switch and a node detail panel.
Asked where it conflicted with the invariants, the operator answered (2026-11-09): **allow all three ratios**, **add
salary and tenure**, **implement the diagram and the pipeline support** now.

- **Invariant 4 amended.** Allowed: each business's share of segment revenue, 純利益率 (net income ÷ revenue of the
  same year, with the filing's labels as the formula) and 海外売上高比率 (non-Japan rows ÷ all rows of 地域ごとの情報).
  Computed by code at render time from printed figures, labelled 計算値, never stored, never written by an agent
  (a ratio typed into prose or data could disagree with the figures beside it). Investment metrics stay banned.
- **Not taken from the reference, because they would be invented (invariant 1, not negotiable):** 推定営業利益率
  ranges, 「約75%」, generic explanations such as 「固定費比率が高いため稼働率の維持が必須」, money labels the filing does
  not support (卸売代金・金融配当), and **link widths** (`links.value` 1–100): no filing prints what a company spends
  with each kind of supplier or how a segment's revenue splits between its customers. The diagram therefore draws
  lines without widths; only a business carries a size, from its printed segment revenue.
- **Data (schema):** `businessModel.suppliers[]` (the filing's own general noun for its procurement, optional
  `businessIds`), `segmentRevenue` and `regionalRevenue` (yen, as printed in the segment note and 地域ごとの情報),
  `workforce` (【従業員の状況】 of the 提出会社: headcount, 平均年間給与, 平均勤続年数 as years or years + months). All
  sourced; Wikipedia is refused as their source. Segment and regional revenue are `detail` (agent maps rows to
  businesses, `check-prose-figures` matches each amount to the printed note in 百万円・千円・円); workforce is a `fact`,
  transcribed from the XBRL (`workforceFigures`, evidence-pack) and carried by `draft-entry`, `merge-fragments`,
  `finalize` and `refresh-financials`. EXTRACTOR_VERSION is not bumped (it would rebuild every pack); packs gain
  workforce when rebuilt for a new filing.
- **Page:** a 「モノとお金の流れ」 section after 事業 (`ValueChainFlow`, a Client Component for the switch and the lines;
  lines are not drawn on phones, where the detail panel lists every tie in words), and 「比較の目安」 above the
  financial charts. Customers come from each business's `customers`; the business model's list is used only when no
  business names any, so a company-wide list is never drawn as one segment's buyers. A supplier with no named
  business points at the company as a whole. With no suppliers the column is replaced by a sentence saying so.
- **Amended the same day (operator: "目的の完遂までの方法は問いません"; new registrations must include it).** Probes of real
  filings through the EDINET workflow showed segment external revenue is detail-tagged (three element spellings), so
  `segmentRevenue` and `regionalRevenue` became **facts transcribed by machine**, not agent writing:
  `scripts/pipeline/segment-revenue.mjs` matches each tagged segment to a business by the filing's own Japanese
  segment name (label linkbase) and requires the members to add up to the filing's printed total; regional revenue is
  read from the note's text and kept only when the regions add up to the printed 合計 and that 合計 equals the
  consolidated revenue. The pack, the draft, merge-fragments, refresh-financials (every new filing) and the backfill
  use the same functions; agents write only `businessModel.suppliers`, checked by prose-policy in the repair loop.
  Existing entries are filled by a hand-started job of the one EDINET workflow (`backfill_workforce` input,
  `backfill-value-chain.mjs`, pull request into the branch it runs on); no new workflow and no second detector.
- **Filled (2026-11-09, backfill run of the EDINET workflow, merged by hand because the repository does not let
  Actions open pull requests):** of 618 published entries, 605 have 従業員の状況, 417 segment revenue, 50 regional
  revenue. The rest are left out by the checks, not approximated: segments whose names match no business, US GAAP
  filers (no tags), eight segment tables wider than the revenue line they would sit beside (第一生命, retailers and
  banks whose segments include other income), regional tables that are omitted (domestic ≥ 90%), transposed
  (味の素) or two-level. **Suppliers** are filled only by the writing agent, at registration or an explanation update.
- **Kept through every later write:** refresh-financials replaces all three with the newest filing's; merge-fragments
  keeps a registered entry's while its year and businesses still fit (a draft from an older pack has none).
- No comparison page was built (JCE-017's "no compare tool" stands until asked).

### JCE-039 · 2026-11-10 · Accepted (operator) — kigyo-hyakka.com, and Google AdSense in the four placements

The operator chose Google AdSense for the 企業タイプ診断 and the encyclopedia. AdSense will not take a `*.workers.dev`
address (it asks for the root domain, which belongs to Cloudflare), so the operator bought `kigyo-hyakka.com` on
Cloudflare: the encyclopedia is served at the root and the 診断 at `shindan.kigyo-hyakka.com`, both attached by
`routes` in their wrangler config. `worker/index.ts` answers only to redirect the old workers.dev address and `www.`
(301, path kept), so shared links keep working; `/_next/*` assets skip it.

Ownership is claimed with AdSense's meta tag on every page and `/ads.txt`; neither loads a script. Ads appear only once
the operator's display ad unit id is set in `src/components/ads/ad-slot.tsx` (after Google approves the site), and then
only in the four AdSlot placements, labelled 広告, under the rules of JCE-036. /privacy and /about#advertising switch to
the AdSense disclosure on the same flag, so the pages never say less than the site does.

### JCE-040 · 2026-11-11 · Accepted — Google Fonts are kept in the repository for the production build

Cloudflare builds failed now and then (2026-11-11: three of five) inside next/font: Google's CSS sometimes listed a
font file whose URL has no extension, and next/font's loader throws on it ("Cannot read properties of null (reading
'1')"). The same build always passed elsewhere. Retrying would only make the failure rarer, and a failed build had
already led to an old build being retried — and an old version published (JCE-039).

`scripts/fonts/vendor-google-fonts.mjs` now copies the three families (252 woff2 files, 13 MB) and their unicode-range
stylesheets into `src/assets/fonts/google`, and `build-static.mjs` points next/font at them through its
`NEXT_FONT_GOOGLE_MOCKED_RESPONSES` hook, so the build never asks Google. Readers get the same self-hosted, sliced
fonts as before. The hook is next/font's own (its test mocks): a font request the folder does not hold fails the build
naming the URL — run the script again. A Windows build keeps downloading (the hook reads only "/"-rooted paths).
`tests/vendored-fonts.test.ts` checks the folder matches the layout.

### JCE-041 · 2026-11-12 · Accepted (operator) — 産業インデックス: the industries' figures, inside the encyclopedia

The operator had a proposal to grow a separate "Japan Industry Index" product on the encyclopedia's data, and decided
instead that the index belongs **inside the encyclopedia** ("インデックスは日本企業百科事典に組み込みたい"), with the
companies being registered separately and all of them expected by the coming Sunday. This is a departure from the
master specification's "do not build a financial dashboard" (§03 18, §Final) and is kept narrow on purpose:

- **What it is**: a third tab on `/industries` (数字で見る) and a 数字 section on each industry page, drawn on the server
  from the released companies' own `financials`, `regionalRevenue` and `relatedCompanies` at build time
  (`src/lib/industry-figures.ts`, `src/components/industry/industry-figures.tsx`). As companies are registered and
  released, the figures grow with the next build; nothing is written by hand or by an agent.
- **The figures**: per industry, the sums of the latest year's revenue, net income and employees (each saying how
  many companies it adds and how many it had to leave out); and four ratios, every one a 計算値 with its formula
  printed beside it — 純利益率 (Σ純利益 ÷ Σ売上高), 5期の売上高の伸び (latest ÷ five years earlier, median over
  companies), 上位3社への集中 (top three ÷ the industry), 海外売上高比率 (median of the companies' printed ratio).
  JCE-038 allowed three ratios on a company page; this adds the sums and two industry-level ratios (growth multiple,
  concentration) under the same rule: printed figures of one year, computed on the page, never stored or estimated.
- **What it is not**: no stock price, valuation, ranking of good companies or recommendation (invariant 4). A missing
  figure leaves a company out of that sum, counted in `excluded`, never approximated (invariant 1). Only released
  companies add to a public sum. The hub still opens on the industry list; the figures are the last tab.
- The ten largest companies of an industry are listed by revenue, with each one's own margin and growth beside it:
  a size order from the filings, labelled as such, not a quality order.

### JCE-042 · 2026-11-12 · Accepted (operator) — The figures tab draws like a data book: cards with ▲▼, a donut, small line charts, a performance table

The operator showed the design of their economic data book (a dashboard of "latest" cards, each figure with a ▲▼
against its forecast and a line of context; period line charts; a release table; a per-country performance table
with ▲▼ counts) and asked for the industry figures (JCE-041) to borrow that visual language — "円グラフなど BI ツールを
駆使して視覚的理解を助ける". The data book's own data is **not** imported: the operator said so, and macro statistics
would be a new class of fact outside invariant 3's sources. Only the forms are taken:

- **Cards** for the headline figures, each with its ▲▼ against the all-industry value and a line saying how many
  companies it adds; the ▲▼ is a comparison, never a judgement (the caption says so, as the data book's does).
- **A donut** for one whole split into a few parts (revenue and employees by industry on the hub; revenue by
  company on an industry page): at most six named parts and the rest folded into その他, the share printed on each
  part that has room, the names and values listed beside it as the legend. One hue stepped light to dark, the
  largest part darkest, the rest lightest; a 2px gap of surface between parts.
- **Small line charts** of the five-year revenue index, one per industry, the all-industry line in grey behind
  each. The index counts only companies with five complete years, added up as the same roster and set to 100 at
  the oldest year (`revenueIndexSeries`), so a line never shows growth that is only new entries.
- **A performance table** with ▲▼ against the all-industry reference for margin and growth.

All of it is server-rendered SVG and HTML in the site's own ink and type — no chart library, no script, no data
colour on text — so the pages stay plain documents and the figures read with styles off (the list beside a donut
carries every value).

### JCE-043 · 2026-11-13 · Accepted (operator) — 業界比較 on the company page, as a premium feature of the YUGENQ plan

The operator asked for an industry comparison in each company's financial section, and for it to be part of the
premium plan ("この業界比較システムはプレミアムプランで進める"). Two departures are recorded, both the operator's:

- **A comparison tool exists** (JCE-017's "no compare tool" ends here, for this one form): `src/lib/industry-comparison.ts`
  places a company among the released companies of its primary industry — rank out of N and the industry median
  for 純利益率, 5期の売上高の伸び, 海外売上高比率 and 平均年間給与, the company's share of the industry's revenue, and its
  own five-year index beside the industry's (`revenueIndexSeries` of JCE-042). Arithmetic on printed figures only,
  computed at build time, formula and count beside each; a company without a figure has no comparison for it; an
  industry with fewer than three released companies has none at all. A rank is a position by size, labelled so and
  never a verdict (invariant 4); the block says the comparison is against this encyclopedia's companies, not every
  listed company.
- **The site reads the YUGENQ plan** (the plan sold on the 企業タイプ診断 site, 月額390円, shared by the YUGENQ services).
  D-040 keeps this project's code and data its own: nothing is imported from the other repositories. What crosses
  is one HTTPS call — `POST https://shindan.kigyo-hyakka.com/api/plan` with a purchase code, which that site now
  answers for this origin (its CTS-022) — and one cookie on the parent domain that may carry the code. The answer
  is kept through the storage layer (`planStore`, invariant 7); nothing about the reader is sent anywhere.
  `PremiumGate` is a view switch, not a wall: the static HTML holds the free view (what the block shows, where the
  plan is sold, a field for the code), and the comparison, computed from public filings, is shown once the browser
  holds a paid plan — the same rule the 診断 site applies to its own paid parts.
- The figures tab of /industries (JCE-041/042) stays free: the plan pays for the company-level position.

### JCE-044 · 2026-11-13 · Accepted (operator) — 財務の深掘り: five-year structure beside the industry, in the premium block

The operator asked for more in the encyclopedia's premium part, and for readings worth more than a pie chart or a
position in the market. What is added (`src/lib/financial-deep-dive.ts`, drawn by `financial-deep-dive.tsx` inside
the same `PremiumGate` as 業界比較): for the five printed years, 純利益率 and the filing's own profit line ÷ 売上高,
自己資本比率 (純資産 ÷ 総資産), 売上高 and 純利益 ÷ 従業員数 (連結), and 総資産・純資産・従業員数 as an index of the oldest
year — each beside the median of the industry's other released companies in the same position of their table.
These extend the computed-ratio rule of JCE-038/041: same-year printed figures only, formula beside each, a missing
year a gap in the line. 自己資本比率 and the per-employee figures are balance-sheet and headcount arithmetic, not
market measures; ROE, ROA, PER and everything priced by the market remain excluded (invariant 4). The copy explains
each group in a sentence a beginner can use ("借りたものではなく自分のもの", "人手で稼ぐか、仕組みで稼ぐか").

### JCE-045 · 2026-11-13 · Accepted (operator) — 半期の数字: the 半期報告書 read into `interimFinancials`, shown in the premium block

The operator asked for quarterly results to be shown ("四半期決算で表示が可能かシステムを構築"). Since April 2024 the
quarterly report no longer exists on EDINET; the first half still does, as the 半期報告書 (docTypeCode 160, 訂正 170),
and its own 主要な経営指標等の推移 prints the half's cumulative figures beside the same half of the previous year. The
third and first quarters live only in 決算短信 on TDnet, which has no free API and whose terms of automated use are
unconfirmed, so they are not read (see `docs/proposals/2026-11-12-interim-reports.md` in the supervisor repository).

- **Data**: `interimFinancials[]` on the entry — fiscal year, `period: "H1"`, the half's start and end, 売上高・利益・純利益
  with the filer's own labels, the accounting standard, cited to a new source (`hanki-YYYYMM`, the filing's docID). The
  five full years in `financials` are untouched; a half is never mixed into them, and 総資産・純資産 at mid-year are
  not stored. A line the filing does not tag is null (invariant 1).
- **Pipeline**: `scripts/pipeline/interim-financials.mjs` reads the type=5 CSV like the annual extractor, by the same
  element ids (summary rows, consolidated unless the filer has none), from the `CurrentYTDDuration` and
  `Prior1YTDDuration` contexts; plans from the entry and the cached day indexes alone; with `--apply` writes the entry,
  the source and a Revision, gated by `tests/validate-file.test.ts`. It runs inside the one scheduled EDINET workflow
  (detect: dry run and count; propose: apply), so JCE-018's single detector stands.
- **Page**: 「半期の動き」 at the top of the premium block — each line's half figure, its 前年同期比 and its share of the
  last full year, with the previous half beside it as a grey bar. Computed on the page, formulas printed, nothing
  annualised or forecast.

### JCE-046 · 2026-11-14 · Accepted (operator) — DISCOVER: a feed for meeting companies, with マイ企業図鑑

The operator proposed turning the encyclopedia from a place to look things up into one where readers keep meeting
companies ("企業を調べる必要がなくても、次々と日本企業を知りたくなる"), and asked for it to be built and launched.

- **/discover**: one company per screen, swiped vertically with CSS scroll snapping (no gesture library). The day's
  order is a shuffle seeded by the date in Japan, so 今日の3社 is the same for everyone and changes at midnight JST;
  companies already in the reader's collection go to the back. Filters by the company's primary industry.
- **What a card says** (`src/lib/discover.ts`, served as the static `/discover-feed.json`): the entry's own sourced
  words, shortened, never rephrased — the first sentence of the description, and one "hook": an overseas share of
  50% or more (computed by `companyMetrics`, labelled 計算値 with its formula, JCE-038), else the first sentence of the
  strength the filing itself states (`perspectives.competitiveAdvantage.disclosed`), else an overseas share of 20% or
  more, else the oldest event of the 沿革. No "意外な事実" is written for the feed; a 世界シェア appears only where an
  entry's sourced text already says it. Revenue is printed as filed. Released companies with a description only.
- **Following**: a card offers up to four related companies, trade and competition first, capital relations last;
  tapping one puts it next in the feed with a line saying where it came from. Every card leads to the full entry.
- **マイ企業図鑑** (`/discover/collection`): a company that fills the screen for about a second is recorded in
  `localStorage` (`discovered-companies`, through `src/lib/storage/`), never sent anywhere (invariant 7). The page
  shows, by industry, how many companies the reader has met out of how many.
- **The two diagnoses**: after every ninth company a card leads to 最初の一社 or 企業タイプ診断 on
  shindan.kigyo-hyakka.com, in their own words. They are YUGENQ services, linked as on the rest of the site; nothing
  is recommended (invariant 4), and the intro card says the feed is not a recommendation or investment material.
- **Photographs**: the industry's photograph (JCE-031), never the company's own.
- Not built yet: a quiz, a daily quiz. They need questions whose answers are the entry's own data, designed so that a
  wrong option is never a false statement about a real company.

### JCE-047 · 2026-11-14 · Accepted (operator) — 財務の詳細化と業界の数字の拡充

The operator asked for the analysis tools to be extended: the company's financial section more detailed and easier to
use, and more figures, index charts and pie charts in 業界の数字.

- **Company page (free)**: the latest year's printed lines first, each with its 前期比 (`src/lib/financial-summary.ts`,
  計算値, 最新期 ÷ 前期 − 1). 前期比 is left out across a change of accounting standard, across a change of revenue
  scope (for 売上 and 純利益), and over a base of zero or below — a percentage over a loss says nothing. The five-year
  charts become tabs (売上と純利益 / the filing's profit line / 総資産と純資産 / 従業員数), each tab only where the
  filings print that line. 売上の内訳: the printed セグメント and 地域 amounts as donuts. The table gains 前期比 under
  each value and a CSV of the printed figures in yen (a `data:` link made with the page; no script, no request).
- **業界の数字**: sums of 総資産; Σ純資産 ÷ Σ総資産 (自己資本比率) and Σ売上高 ÷ Σ従業員数 over companies printing both;
  the count of companies whose latest 純利益 is below zero; the median of revenue and of 平均年間給与 (提出会社, as
  printed); companies by revenue band and by accounting standard; Japan against the rest of the world from 地域ごとの
  情報. Five-year indexes of 総資産 and 従業員数 are built like the revenue index (JCE-042): each over the companies whose
  five years of that line are complete. The hub adds the donuts of 純利益 (industries whose sum is positive only — a
  negative part cannot be drawn in a ring, and the page says so) and 総資産 by industry, and the index small multiples
  switch between the three lines; an industry page draws its three indexes on one chart against the all-industry
  revenue, and its size ranking switches between 売上高, 従業員数 and 総資産.
- All of it is arithmetic on printed figures with its formula beside it, as JCE-038/041/044. No market measure; the
  ▲▼ marks are direction against a reference, never a judgement.

### JCE-048 · 2026-11-15 · Accepted (operator) — DISCOVER: 今日の3社 jump to their cards; followed industries come first

- Tapping one of 今日の3社 on the intro card scrolls the feed to that company's card (it is a button, not a link: the
  card is in the feed, the full entry is one tap further).
- A reader can follow industries — from the intro card's panel, or with the フォロー button beside a card's industry.
  Follows are kept in `localStorage` (`followed-industries`, through `src/lib/storage/`), never sent anywhere. The
  companies of followed industries come first in the feed, in the order the industries were followed, each group
  still in the day's shuffle with met companies last (`feedOrder` in `discover-data.ts`, tested). Followed industries
  also lead the filter row, starred. 今日の3社 are the first three of the reader's own order, so with follows they are
  from those industries; without follows they are the same for everyone, as JCE-046 had it.
- The order is rebuilt when the follow panel closes, not when a card's フォロー is tapped: a feed that reorders under the
  reader's finger loses their place. A follow from a card applies from the next rebuild (closing the panel, changing
  the filter, or opening the page again).

### JCE-049 · 2026-11-15 · Accepted (operator) — 決算短信 Q1/Q3 from EDINET DB, shown free with its attribution

Since 2024 the first and third quarters exist only in 決算短信 (TDnet), which EDINET does not hold and TDnet offers
no free API for. The operator subscribed to EDINET DB's API and decided to take Q1/Q3 from it, with the source stated —
the one exception to invariant 3's "other aggregator sites are not sources", and only for these two quarters.

- **What comes from EDINET DB**: `quarterlyEarnings` — 第1・第3四半期 cumulative 売上・営業利益・純利益 (百万円, below
  that cut off), for the latest three fiscal years. The half stays the 半期報告書 (JCE-045) and the full year the
  有価証券報告書; EDINET DB's Q2 and full-year rows are never stored, only used to check it.
- **Checked before written** (`scripts/pipeline/quarterly-earnings.mjs`): EDINET DB's Q2 and full year are compared with
  the entry's own EDINET figures. A revenue more than ¥1 million apart holds the company (EDINET DB's 営業収益 vs 売上高,
  a different perimeter). A net income apart while revenue agrees means EDINET DB carries the group's profit including
  non-controlling interests (AGC, イオン): the quarters are kept without net income. A proportional tolerance was tried
  and dropped the same day: it let ¥3,696 million pass as ¥3,698 million.
- **Sources**: one per quarter (`tanshin-YYYYMM-qN`), publisher naming EDINET DB, linking the company's own document
  where EDINET DB gives one; the integrity suite checks the attribution.
- **Shown free** (operator, 2026-11-15) as 「四半期の動き（累計）」 under the latest year's figures: Q1, 中間期, Q3 and
  the previous full year, each beside the same point a year earlier, 前年同期比 computed. Wherever an EDINET DB figure
  is on the page, its terms' attribution ("Powered by EDINET DB") and the substance of its disclaimer are printed. The
  premium 「半期の動き」 block is replaced by this free section.
- **Rate**: the plan allows 100 requests a day. The detect job reads the announcement calendar only; the propose job
  fetches companies that announced a quarter we lack, then never-checked companies, up to 80 a run. Responses are kept
  in the EDINET cache (never committed) so a held company can be re-examined without a request.
- **Key**: `EDINETDB_API_KEY`, a repository secret used only by refresh-financials (tests/single-detector.test.ts),
  never by the site.

### JCE-050 · 2026-11-15 · Accepted (operator) — The premium gate stays a view switch, with its two known holes

A check on 2026-11-15 found two ways to read the premium blocks (業界比較, 財務の深掘り) without the plan: their content
is in every company page's HTML (the static export carries the children of `PremiumGate` in its payload), and a
made-up plan record in localStorage with a far `checkAfter` opens them without a request. The operator was offered a
server-side lock (the data moved out of the page and served by the Worker after it checks the code) and chose to keep
the current design: the plan sells the convenience of seeing these readings on the page, as JCE-043 and the 診断
site's CTS-013 say. The 診断 site closed its forged-record hole the same day (CTS-025); this site did not, by the same
choice. Revisit if premium content becomes something that must not be read without paying.

### JCE-051 · 2026-11-15 · Accepted (operator) — 業界の数字 moves to the premium plan

The operator asked that the industry figures — the industries hub's 「数字で見る」 tab (JCE-041/042/047) and each
industry page's 「数字」 tab — belong to the premium plan. Both are wrapped in the same `PremiumGate` as the company
page's 業界比較 (JCE-043), with a description of what they hold; after paying, the reader returns to `#figures`. The
gate is the view switch of JCE-050 (the figures stay in the page's payload, by that decision). What stays free: the
industries list, each industry's 仕組み, 企業 and つながり tabs, the 産業マップ, and on company pages the latest
year's figures, 四半期の動き and the five-year charts.

### JCE-052 · 2026-11-15 · Accepted (operator) — Five engagement features, all in the reader's browser

The operator asked for five features that bring readers back without manipulative mechanics: notifications for
companies they follow, a daily company quiz, streaks and achievements, the 発見 feed (JCE-046), and exploring
relationships. All five follow the same rules as the rest of the site: no account, nothing about a reader on a server,
facts only from the entries.

- **Follow and notifications.** The existing お気に入り becomes 「フォロー」 (same store). `/updates.json` is built from the
  entries: the publication date of each 有価証券報告書・半期報告書 source, the `disclosedAt` of each 第1・第3四半期
  (JCE-049) and each correction revision, from the last 120 days. The bell in the header and `/notifications` match it
  against the followed companies **in the browser**; nothing is sent. No push notifications: a closed browser cannot be
  reached without storing a subscription on a server, which is a separate decision (phase 2).
- **今日の1問 (`/quiz`).** One question a day, the same for everyone, from `/quiz.json`, built from the entries: which of
  two companies in an industry has the larger printed revenue (at least 1.3× apart), which has the higher 海外売上高比率
  (a JCE-038 ratio, labelled 計算値 with its formula), or which company a description belongs to (its own names hidden).
  Every answer explains itself and links to the entries. One answer per day, kept in the browser. No timer, no lives.
- **連続日数と実績.** A day counts when a reader opens a company, meets one in 発見, answers the quiz or takes a step in
  つながり. One missed day in any seven does not break a streak, and today is not lost until it is over: the streak should
  reward curiosity, not punish a day off. Achievements are milestones of what the reader did (companies met, industries
  covered, quiz answers, streak, follows, steps), each showing only the next tier, never a ranking against others.
- **発見.** A pause card every 20 companies shows the streak and points to the quiz, つながり and the collection — a
  natural stopping point rather than an endless feed. The 企業タイプ診断 can hand over the companies a person is shown
  (`#companies=…&from=shindan`, CTS-027); it is a fragment, so it never reaches a server.
- **つながりをたどる (`/explore`).** `/connections.json` holds the `relatedCompanies` edges between published entries,
  read in both directions with the reverse label (supplier ↔ customer, parent ↔ subsidiary…), grouped as 取引・同業・資本.
  A breadcrumb keeps the path. Only edges a filing states; none are inferred.

### JCE-053 · 2026-11-15 · Accepted (operator) — A 3D company network (`/network`)

The operator asked for an interactive 3D map of companies and their suppliers, customers and partners: rotate, zoom,
drag, tap a company to read it and its relations.

- **Data: nothing new.** The map draws `/connections.json` (JCE-052) — only `relatedCompanies` edges between published
  entries, each stated with a source. One company sits in the middle, with everything one relation away and, while
  there is room, the best-connected companies one step further (56 at most; `src/lib/network-layout.ts`). No relation
  is inferred, and a test checks every line drawn is one the entries state.
- **No 3D library.** A few dozen points do not need one (CLAUDE.md, Ponytail): a small force layout in three
  dimensions, a perspective projection and the browser's canvas. The layout is seeded by the company id, so a company
  always draws the same map.
- **Use.** Drag turns it, pinch or wheel zooms, a tap selects; the panel below names the company, how it is tied to
  the middle (read from the correct end, JCE-052's labels) and its relations as buttons, and 「この会社を中心にする」
  moves the map there (counted as a step in つながり, added to the collection). Lines: 取引 vermilion, 資本 ivory,
  競合・同業 dashed grey. It turns slowly on its own unless the reader prefers reduced motion or pauses it.
- **Accessible equivalent.** The canvas is labelled as an image and the panel lists the same relations as text
  buttons; `/explore` remains the text-first walk. Linked from company pages, 発見, つながりをたどる and the home page.

### JCE-054 · 2026-11-16 · Accepted (operator) — Support pages, AdSense readiness and a platform audit

The operator asked for a user-journey review, AdSense readiness against Google's current requirements, customer
support (FAQ, tutorial, contact, feedback, troubleshooting) and an audit of links, forms, mobile layout, SEO, speed
and payment. The journey map and the AdSense checklist are kept in the supervisor repository (`docs/user-journey.md`).

- **A broken support path.** 「情報の誤りを報告」 (footer, every company page, settings, about) pointed at `/report`, which
  exists only in the server build; on the production static site it was a 404. It now points at `/contact`, which
  sends readers to the operator's Google Form and, from a company page (`?company=`), gives the line to paste so the
  report names its entry. The privacy policy says reports arrive through that form.
- **New pages.** `/help` (four-step tutorial and FAQ: data, updates, storage, premium, troubleshooting; FAQPage
  structured data), `/contact`, `/terms-of-use` (/terms is the glossary). Linked from the footer and the sitemap.
- **No ads on figures-only entries.** Google's publisher policies forbid ads on screens with little publisher
  content; the 1,082 entries without an explanation yet never render the ad slot, whatever ADSENSE_SLOT is.
- **Share image.** No page had an og:image; `public/og/default.png` (ivory, charcoal, vermilion) is now the default,
  repeated on the pages that set their own openGraph, and the Twitter card is the large-image one.
- **Mobile.** At 320px, five layouts scrolled sideways: single-column CSS grids sized their track to the widest child
  (company list, つながり, the network page's lists, the value chain, notifications, progress) and the industry
  wordmark "Telecommunications". Each grid now has `grid-cols-[minmax(0,1fr)]` and the wordmark breaks. A sweep of
  every industry page and a sample of company pages at 320px shows no sideways scroll.
- **Speed.** The home page passed every company's full summary to the reading trail, which needs id and name only:
  the HTML went from 1.1 MB to 350 KB (68 KB compressed).

### JCE-055 · 2026-11-17 · Accepted (operator) — 戦略と強み redesigned; each company's own website linked

The operator found 戦略と強み all text and hard to read, and asked for a turn from "what the company announces" to
"how it grows and why it wins": two columns on a computer, one on a phone, key figures large, short text, diagrams
generated by industry, navy / white / gray with an accent for growth only, a source and a date on every analysis. And a
link from every company to its own website. The operator's mockup was taken as a reference only: its competitor table
(「主な競合A社」) and its 課題 lists are not drawn, because no filing states them.

- **Words stay the company's.** The text is not summarised or rephrased (invariant 1): the first sentence is shown and the
  rest are one tap away, whole. Plan and brand names the company puts in 「」 become labels.
- **会社が掲げる目標.** Figures in the strategy text that the company states as targets, cut out mechanically
  (`src/lib/strategy.ts`): only revenue, the profit lines, net income and the overseas share (never an ROE or dividend
  target — invariant 4); only in a sentence that says it is a target and not one that reports it was reached; only when
  nothing narrows the figure to a part (「AI関連の売上高」); the year only when written just before it. Each is shown with
  the words around it, so the reader sees whose target it is. 79 of 2,765 strategies yield one. Beside them, the latest
  printed revenue and the overseas share (計算値, JCE-038).
- **成長の構図.** Each business's share of segment revenue (a JCE-038 ratio). A business is drawn in the growth colour when
  the company's own strategy names it in a sentence about growth (成長・拡大・強化・育成・注力・柱) — the page says so.
- **業界の中の位置.** Drawn in the shape of the company's primary industry: a value-chain industry as stages with arrows,
  a parallel one as tiles, with the industries it buys from and sells to; the company's stage is marked where the
  industry's research has placed it, and the page says when it has not.
- **Official website.** `scripts/pipeline/sync-websites.py` reads each entry's latest 有報 PDF (no API key) for
  【株式事務の概要】公告掲載方法, where a company that publishes notices electronically prints its own site's address.
  The origin is kept and linked in the hero, cited to that filing. No link when the filing prints no address (newspaper
  notices), when the host is printed by more than one company (a notice service such as pronexus, a parent's site), or
  when the filing cannot be read. An address printed as http:// is linked as https:// when the site answers there.
  First read 2026-11-17: 3,403 of 3,883 entries linked (255 print no address, 197 filings unreadable, 28 shared hosts). Data: `src/data/websites.json`; `tests/strategy-and-websites.test.ts` checks every address cites the entry's own 有報.

### JCE-056 · 2026-11-17 · Accepted (operator) — Google Analytics after consent, implemented here and shared by cookie

The operator wanted to see, across every service, how many people use them and what they read — "using Google
Analytics or similar" — and chose (2026-11-17) Google Analytics 4 on every site, for readers who agree, with the
cookieless counts (JCE-036) kept for everyone.

- **Cookieless counts are unchanged** (Cloudflare Web Analytics, every page view, no banner). They are the measure of
  real traffic; the zone's request totals are mostly crawlers.
- **Google Analytics only after 「同意する」.** A banner asks once (`src/components/analytics/analytics-consent.tsx`);
  both answers are the same size and every page works either way. The choice is the cookie `yugenq_consent_ga` on
  `.kigyo-hyakka.com`, the same name the 企業タイプ診断 site reads (its CTS-042), so one choice covers both — but the
  code is this site's own: the shared script of the other sites is neither loaded nor copied (D-040). 「閲覧統計の設定」
  in the footer withdraws it and removes Google's cookies.
- **Only the path leaves the browser.** Every request Google's tag makes (sendBeacon, fetch, XHR, image) passes
  `src/lib/analytics/guard.ts` first: each address is cut to origin + path + `utm_*`, and a request that still mentions
  a search term, token or long fragment seen on the page is not sent. Search terms (`/search?q=…`) never reach Google,
  whatever Google's own automatic measurement is set to (checked in a browser with the real gtag.js).
- **No advertising use**: ad storage, ad user data and ad personalisation denied; Google signals off. One event,
  `begin_checkout`, a name only.
- **Off until configured**: `GA_MEASUREMENT_ID` in `src/lib/site.ts` is empty until the operator creates the property;
  until then no banner, no tag, and /privacy shows nothing about Google Analytics. The /privacy section appears with
  the ID (recipient, information sent, purpose, how to stop it), so the page never says more or less than the site does.

**Incident, 2026-11-17 05:30–05:51 UTC.** The first release of this decision took every page down: the analytics
runtime imported the measurement ID from `src/lib/site.ts`, which throws in a production bundle without the server-only
`SITE_URL` ("SITE_URL is not set"). The direct-import test (`tests/client-imports.test.ts`) did not see it — the import
went Client Component → `src/lib/analytics/runtime.ts` → `site.ts` — and the development server does not throw, so the
local checks passed. Restored by rolling the Worker back to the previous version (60e3d254), then reverted in git
(8ec3ef0b). Fixed by keeping the ID in `src/lib/analytics/config.ts` (no imports) and by a second test that follows
every import of every Client Component. A release that adds client code is now checked on the production static
build (`npm run build:static`) in a browser for page errors before it goes out.

### JCE-057 · 2026-11-17 · Accepted (operator) — Needs-attention entries whose notes are only facts are released, notes shown

An evaluation of the service (2026-11-17) found 1,491 written entries without a page — 42% of the written content —
because JCE-018 releases only `published`. Reading their notes, most do not say that anything is missing or doubtful:
they record facts a reader should know (a tender offer, an event after the balance-sheet date, a stock split, a
merger, a planned move, which basis a table follows). The operator chose (2026-11-17) to release those, with the notes
shown, and to keep the rest unreleased until a person has looked.

- **An explicit list, not a runtime rule**: `src/data/released-with-notes.json`,
  validated by `releasedWithNotesSchema` and read by `isReleased` (`src/lib/release.ts`); 880 entries at the first
  release. The entries keep their
  `needs-attention` state and notes, so the integrity rules for that state still hold; nothing is promoted silently.
- **Who is on it**: notes that are facts only — none that says something could not be obtained, must be added or
  checked, or does not match; none that says the filing contradicts itself or leaves open whether something happened
  (食い違い・整合しない・分からない); no editors' working language (field names, evidence packs, instructions); no blank figure;
  and the entry passes the published tier's checks (`releaseReadiness`) with no problem. `tests/release.test.ts` holds
  every listed entry to all of this, so a later edit that adds a doubt to a listed entry fails the build.
- **The reader sees the notes**: 「この企業についての注記」 under the company header (`company-notes.tsx`), folded, with
  the editors' section names removed and each fact once, and a line saying the page reflects the filing's fiscal year.
- **Still unreleased** (611): notes that something is to be added or confirmed or may be wrong (354), notes in the
  editors' working language or otherwise unclassified (224), notes on a contradiction or an open question (27), blank
  figures (6). They are released one by one as a
  person resolves them — promotion to `published`, or adding the id here once the notes are facts only.
- Invariant 1 is unchanged: what the released pages say is sourced; what could not be verified is absent and, where it
  matters, the note says so.

### JCE-058 · 2026-11-17 · Accepted (operator, 2026-11-17) — A financial-update pull request may merge itself when every change was vouched for

Changes JCE-024's "the site changes only when a person merges the pull request", for one case. An evaluation
(2026-11-17) found quarterly figures waiting on unmerged pull requests (#5, #6): the checks run daily, but the page
changes only when someone merges. The operator asked for automatic merging of fully verified pull requests, off until
switched on.

- **Switch**: the repository variable `AUTO_MERGE_FINANCIALS` (Settings → Secrets and variables → Actions → Variables).
  `1` = on; unset or anything else = off, which is the JCE-024 behaviour. It is off at merge time of this change.
- **The gate** (`scripts/pipeline/auto-merge-gate.mjs`, `tests/auto-merge-gate.test.ts`) says yes only when: the change
  set is company entries, new revision files and the pipeline's bookkeeping, with nothing deleted and no new company;
  every changed entry is one a report says it updated (annual 有報, 半期報告書, 決算短信 Q1/Q3); no entry's status or
  notes changed; the amendment audit finished and found no new 訂正有価証券報告書; the annual run did not stop on a fatal
  error. Companies that were held or failed are not in the pull request (they are left as they were) and do not stop
  it; they stay listed in its body. The comparison itself (verify-financials and the integrity rules) is unchanged.
- **Always visible**: every pull request's body carries the gate's verdict, on or off, so a person can see which
  ones would have merged themselves before switching it on.
- **Merge**: squash, branch deleted, never `--admin`; a branch protection rule that requires a review still stops it.
  A merge made with the workflow's token does not start other workflows (GitHub's rule); Cloudflare still rebuilds main.
- `tests/refresh-workflow.test.ts` pins that the only `gh pr merge` is in the step guarded by the variable and the
  gate's verdict, and that nothing pushes to main or approves.

### JCE-059 · 2026-11-17 · Accepted (operator) — Notifications for followed companies (Web Push), the one thing kept on a server

JCE-052 kept every engagement feature in the browser and left push notifications for a separate decision, because a
closed browser cannot be reached without a subscription stored on a server. The operator decided it (implementation
prompt P1-1, 2026-11-17): Web Push, not e-mail — no address to hold, in keeping with "no login, data in the browser".

- **Opt-in, per company.** Under 「フォロー」 on a company page, 「決算・更新の通知を受け取る」 appears while the company
  is followed; お知らせ switches it for every followed company or stops it all. Unfollowing stops that company's
  notifications. The list of companies stays in the browser (`push-companies`) as before; only a reader who switches
  notifications on sends it, with the push address and keys their browser made.
- **What is stored, and nothing else** (D1 `kigyo-push`, `migrations/0001_push.sql`): the push endpoint, its two keys,
  the company ids, and the date the browser last sent its list. No IP address, user agent, name or e-mail. Removed on
  「通知をすべて止める」, when the list empties, when the push service answers 404/410, and after 180 days without use.
- **What is sent**: "〇〇の新しい決算データが公開されました" (有報・半期報告書・決算短信) or "〇〇の掲載内容が更新されました"
  (a correction) and the company's page — a fact, never advice. Encrypted for the browser (RFC 8291) and signed with
  the site's VAPID key (RFC 8292), implemented on WebCrypto in `worker/push/` and checked byte for byte against
  RFC 8291's worked example. The VAPID subject is the site's contact page, so no person's e-mail reaches a push service.
- **When**: a scheduled run every 30 minutes reads `/updates.json` — what the LIVE site lists — and announces each event
  once (`push_seen`); the first run only records what is already there. A notification therefore never points at a page
  that has not changed yet, whether the update came from a merged pull request or anything else. Pushes per run are
  capped (`PUSH_SENDS_PER_RUN`, default 40) and the rest go out in the next run.
- **Limits are a setting**: `PUSH_MAX_COMPANIES` (unset = no limit, the initial setting; a hard ceiling of 2,000 bounds
  one request). The free/premium split can be set later without a code change.
- **Safety**: subscriptions only from this site's pages (Origin), JSON only, 64 KB at most, rate-limited per IP; only the
  browsers' push services are accepted as endpoints, so the worker can never be pointed at another address; a
  notification opens only this site's pages.
- **iOS**: Safari delivers web notifications only to a site added to the home screen; elsewhere on iPhone and iPad the
  page explains that instead of offering a button that cannot work.
- **Off until configured**: the VAPID key pair is set as Worker secrets (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`), never
  in the repository. Without them `/api/push/key` answers `available: false` and the pages offer nothing.

### JCE-060 · 2026-11-17 · Accepted (operator) — 財務で探す: screening on printed figures, in the browser

The operator's implementation plan (P1-2, 2026-11-17) asked for a simple financial screening. It lives at
`/screening` (「財務で探す」; `/explore` already serves つながりをたどる, JCE-052).

- **Only figures the site already shows**: latest revenue and employees as printed, 5期の売上高の伸び (latest ÷ five
  years earlier, as on the industry pages), and the two ratios JCE-038 allows (純利益率・海外売上高比率), computed by the
  same code (`companyMetrics`, `revenueGrowth5y`). No stock-market figure, no score, no ranking label: invariant 4 holds.
  Industry and 本社の都道府県 come from the entry and the EDINET code list.
- **A missing figure is not a pass and not a zero**: a company without the figure a condition asks about is left out
  and counted, and the page says how many (「データなし」). Sorting puts such companies last.
- **Nothing leaves the browser**: `/screening.json` (about 2,900 rows, released companies only) is built with the
  site and filtered on the reader's device. Saved conditions (three per browser) are kept only through
  `src/lib/storage` (`screening-saved-conditions`).
- `tests/screening.test.ts` holds the rules and checks three conditions against counts read straight from the data
  files: 自動車 × 1兆円以上 (27 companies), 純利益率10%以上 × 従業員1,000人以上 (272, 14 データなし), 東京都 × 5期で1.5倍以上 (406).

### JCE-061 · 2026-11-17 · Accepted (operator) — 企業を見比べる: two or three companies side by side

The operator's implementation plan (P1-3, 2026-11-17) asked for a side-by-side comparison of two or three companies,
shared by link, with the third company as a premium benefit.

- **`/compare?ids=a,b,c`**, reached from 「見比べる」 on every company page and from the footer. The address is the whole
  state, so a link opens the same comparison; which companies a reader picks is never sent anywhere — the page draws
  them in the browser from `/compare.json`, built with the site (released companies only).
- **Only what the company page already shows**: the latest year's revenue, net income and employees as printed, with
  the filing's own labels; 純利益率 and 海外売上高比率 (JCE-038) and 5期の売上高の伸び (JCE-041/043) from the same code
  (`companyMetrics`, `revenueGrowth5y`), labelled 計算値 with the formula. A figure not printed shows 「データなし」. Under
  the table, each company's filing and fiscal year, linked. No verdict and no "which is better": invariant 4 holds.
- **設立年 is not shown.** The entries hold no founding date as a field, and a history event's year is not always the
  founding of the present company (トヨタ自動車's 1937 is トヨタ自動車工業). It is added only when the data has it.
- **Plan**: two companies free, three with the YUGENQ premium plan (`COMPARE_LIMITS`, a setting for P2-1). As with
  JCE-043 the gate is a view switch over public figures. The premium gate now keeps the address's query when it sends
  a buyer to checkout, so the reader returns to the same comparison.
- 最初の一社's own 見比べ (industry, business and the reader's notes) is a different feature in another project; its
  『準備中』 is lifted there, separately (D-040: nothing is shared in code).

### JCE-062 · 2026-11-17 · Accepted (operator) — 業界ランキング from the registered data only

The operator's implementation plan (P2-3, 2026-11-17) asked for regularly published indicators, including an
「産業タイプマップ」 built from diagnosis answers. The operator chose (2026-11-17) the rankings only: the map would need
answers sent to a server, which the diagnosis site's invariant 6 forbids, so it is not built.

- **`/rankings`** and four pages: 海外売上高比率が高い業界, 売上高の伸びが大きい業界, 従業員数の伸びが大きい業界,
  純利益率が高い業界. Each value is the one `buildIndustryFigures` already gives the 業界の数字 tab (JCE-042/047) —
  `src/lib/rankings.ts` only orders them — so a ranking cannot disagree with the industry pages.
- **Method on every page**: the formula, how many companies stand behind each industry's figure, how a missing figure is
  handled, and which fiscal years the latest figures are. An industry with fewer than five companies behind its
  figure is listed apart, not ranked. The wording is an order (「〜が高い業界」「大きい順」) and says it is not a verdict.
- **Follows the data**: the pages and their share images are built with the site, so a data update re-ranks them;
  nothing is edited by hand.
- **Share images** (`opengraph-image.tsx`) are drawn at build time by `next/og` with a subset of Noto Sans JP (OFL,
  `src/assets/fonts/og`), because `next/og` cannot read the WOFF2 files the pages use. `tests/rankings.test.ts` fails
  when an image would need a character the subset lacks, and checks each ranking's top entries against sums and
  medians taken straight from the data files.

### JCE-063 · 2026-11-17 · Accepted (operator) — A reading order for job hunting on every industry page (P2-2)

The operator's implementation plan (P2-2, 2026-11-17) asked for a path between the 企業タイプ診断 and this site.

- Under 業界の仕組み, every industry page with companies shows 「就活で〇〇業界を調べるなら」 (`#job-path`): read how
  the industry works; line up its three largest companies by latest printed revenue on 見比べ (JCE-061) — a size,
  said to be not a ranking of good or bad; check the fit on the 企業タイプ診断, whose premium ES advice is mentioned in
  one line. The 企業タイプ診断's matched industries link here (its CTS-043).
- The link to the diagnosis is an ordinary link; a click sends the event name `encyclopedia_to_diagnosis`, after
  consent only (JCE-056). Nothing about the reader goes with it.

### JCE-064 · 2026-11-17 · Accepted (operator) — Premium benefits here, and the 7-day trial (P2-1)

The operator's implementation plan (P2-1, 2026-11-17) asked to rebuild the YUGENQ premium plan around what exists and
to add a 7-day trial; the 企業タイプ診断 site sells it (its CTS-044).

- **Benefits here, each a setting**: 3社の見比べ (`COMPARE_LIMITS`, JCE-061), 20 saved conditions in 財務で探す
  (`SAVED_CONDITIONS_LIMITS`, JCE-060; free keeps 3), and no ads — the ad unit draws nothing, not even its label,
  and loads no ad script for a reader with the plan. 業界比較 and 財務の深掘り (JCE-043/044) are unchanged.
- **Not a benefit**: notifications for followed companies have no per-plan limit (`PUSH_MAX_COMPANIES` is unset, so
  everyone is unlimited); a larger limit is not sold until a smaller free one exists.
- **Trial wording**: `PLAN_TRIAL_DAYS` in `src/lib/plan.ts` says what the plan's Checkout gives; the premium gate's
  button reads 「7日間無料で試す（その後 月額390円）」 and says cancelling within the trial costs nothing. The number
  follows the 企業タイプ診断 site's, which owns the Checkout.

### JCE-065 · 2026-11-17 · Accepted (operator) — Moving a reader's lists to another device by an e-mailed link (P2-4)

The operator's implementation plan (P2-4, 2026-11-17) asked for moving browser-only data between devices without
accounts. The operator chose (2026-11-17) the encyclopedia's own lists only; the 企業タイプ診断's answers and results
are not moved (its invariant 6).

- **What moves**: follows, recently viewed, followed industries, saved screening conditions (`src/lib/sync-data.ts`,
  shared by the page and the Worker). Not the purchase code (its own e-mail recovery exists), not notification
  subscriptions (each belongs to one browser; the new device switches them on itself), not activity counts.
- **How**: 設定 → 「別の端末で引き継ぐ」 posts the lists and an address to `/api/sync/start`. The Worker stores the
  lists in D1 (`sync_transfers`, migration 0002) under the SHA-256 of a random one-time token, mails
  `https://kigyo-hyakka.com/sync/#t=<token>` through Resend, and keeps nothing else — no address, IP or user agent.
  The token is in the fragment, which browsers never send; `/sync` removes it from the address at once.
- **Limits**: 30 minutes, read once (`DELETE … RETURNING`), withdrawn by the sending browser (a second random key it
  keeps), replaced by its next link, pruned by the half-hourly schedule; `SYNC_LIMIT` 6 requests a minute per IP.
- **Merging, never overwriting**: the receiving page shows what would be added and writes only after 「この端末に取り込む」;
  lists are united, nothing on the receiving device is dropped.
- **Identifiers and notifications**: the transfer's keys are random and short-lived and are never tied to a push
  subscription (whose id is the hash of its own endpoint); nothing links either to a person.
- **Operator**: apply migration 0002 to the production database; `RESEND_API_KEY` is already a Worker secret, and
  the sender `sync@kigyo-hyakka.com` uses the domain Resend already sends from. Without a key the feature reports
  itself off.

### JCE-066 · 2026-11-18 · Accepted (operator) — 1株当たり配当額 and 発行済株式総数 as printed; no prices (P1-4)

The operator's implementation plan (P1-4) asked for share price, market value and dividend yield as reference figures.
Its own condition was to check first that a provider allows them to be shown: J-Quants (JPX) is limited to private
use by individuals and forbids showing its data to others (its corporate service, J-Quants Pro, needs a contract), and
EDINET DB carries no share prices. The operator chose (2026-11-18) to show only what the 有価証券報告書 prints.

- **`shareFacts`**: 1株当たり配当額 (円) and 発行済株式総数 of the 提出会社, from 主要な経営指標等の推移 (XBRL
  `DividendPaidPerShareSummaryOfBusinessResults` and `TotalNumberOfIssuedSharesSummaryOfBusinessResults`, the filer's own
  context first), for the year the entry's newest financials come from, with the filing as its source. Extracted by
  code (`shareFigures`), never typed; a missing or ambiguous figure is left out.
- **Kept current like 従業員の状況**: written by `backfill-value-chain` for registered entries, by `draft-entry` for new
  ones, carried by `refresh-financials` with a newer filing; a facts-layer field (`ownership.mjs`).
- **On the page**: two cells in 比較の目安, marked as printed values, with the line that price, market value and yield are
  not shown. Invariant 4 says so too. A price feed would need a licensed source (e.g. J-Quants Pro) and a new decision.

### JCE-067 · 2026-11-18 · Accepted (operator) — A pre-registration update is committed with the registration, not before

On 2026-11-18 the update of `figures-only` entries to a newer filing ahead of their registration ("procedure b") was
committed to main on its own three times (canbas, tms, stemrim). Each time the newer filing left a figure blank; the
integrity rule asks for `needs-attention` for that (invariant 1), but registration refuses any entry that is not
`figures-only` (double registration guard in `autopilot-lib.mjs`), and only the registration merge sets
`needs-attention` with its note. Between the two commits main failed `tests/data-integrity.test.ts`, which stopped the
daily financial refresh and every backfill gated on it.

- **Rule**: the pre-registration update travels with the registration (the staging merge), as 1d0f0ea7 already did for
  workforce. Not setting `needs-attention` early: that would break the registration guard.
- stemrim's update (52450851), committed alone, is reverted to its last passing state; it returns with its registration.
- CLAUDE.md says so, for every session that runs the procedure.

### JCE-068 · 2026-11-18 · Accepted (operator) — Security hardening after an authorised audit of the YUGENQ services

The operator asked for a demonstration attack on his own services and for the weak points found to be fixed, repeatedly.
A non-destructive audit (external probes with curl + code review; report in the operator's audit folder, not this repo)
found the content itself well guarded — no exposed secrets or sensitive paths, no CORS reflection, parameterised SQL,
push endpoints allow-listed — and the transport/header layer weak:

- **Plain HTTP served the site.** `http://kigyo-hyakka.com/` answered 200; an HSTS header received over plain HTTP is
  ignored, so a first visit could be intercepted. The Worker now upgrades every http:// request itself
  (`httpsUpgradeTarget`), so the guarantee is in code rather than only in a Cloudflare dashboard setting.
- **The Worker sets the security headers on every response it serves** (`withSecurityHeaders`): pages, the 404 page and
  the /api/push + /api/sync JSON answers. HSTS gains `includeSubDomains` (preload stays a separate, later step: it is
  only safe once every subdomain is confirmed HTTPS-only). The static export's `_headers` states the same values.
- **/sw.js had lost its own rules in production**: `next.config.ts` gives it `no-store` and a restrictive CSP, but
  `scripts/build-static.mjs` never wrote that block into `_headers`, and the live file was cacheable under the generic
  policy. The block is now written, and the Worker sets the same rules on the response, so they no longer depend on
  `_headers` alone.
- **A full Content-Security-Policy is sent Report-Only** (same value in `next.config.ts`, `worker/index.ts` and
  `scripts/build-static.mjs`): it records what an enforced `script-src` would block, without breaking AdSense /
  Analytics. Enforcing it is a later decision, taken from what the reports show.
- **Rate limits no longer key on a spoofable header**: `clientAddress()` preferred the first `x-forwarded-for` value,
  which the client itself supplies, so the admin-login and report limits could be rotated away. `cf-connecting-ip`
  (written by Cloudflare, not the client) now wins, then `x-real-ip`.
- **`/.well-known/security.txt`** (RFC 9116) points vulnerability reports at the contact page.
- Out of this repo, recorded for the operator: the diagnosis site shares the plain-HTTP and CSP findings, and its
  /api/* answers carry no security headers; both need the same treatment in that repository plus the Cloudflare
  "Always Use HTTPS" setting as a second layer.

### JCE-069 · 2026-11-18 · Accepted (operator) — Notifications by e-mail, for readers whose browser will not show them

JCE-059 chose Web Push alone ("no address to hold"). In use, the browser's permission is what stops it: Safari on
iPhone offers it only to a site on the home screen, many browsers block or silence the prompt, managed PCs forbid it,
and a reader who once said no is never asked again. The operator asked (2026-11-18) for the news to reach readers
anyway — chosen when the address is registered, and receivable later.

- **Three ways, none required** (お知らせ › 受け取り方): the お知らせ list itself (as before — every new filing of a
  followed company stays there to read later, no permission, nothing sent), **e-mail**, or the browser's notifications
  (JCE-059, unchanged). Where push cannot work or was refused, the company page points to 「メールで受け取る」.
- **What the reader chooses at registration**: the address and the kinds of news — 新しい決算の公開 (有報・半期・短信)
  and/or 掲載内容の更新 (訂正) — for every company they follow. The list follows the browser's follows (`MailSync`, as
  `PushSync`); unfollowing everything ends the sign-up.
- **Double opt-in**: nothing is sent but the confirmation mail until its link (24 hours, once) is opened; an
  unconfirmed address is deleted after 24 hours. Registering again from the same browser replaces the earlier sign-up.
- **What is stored** (D1 `kigyo-push`, `migrations/0003_mail_notify.sql`): the address, the company ids, the kinds,
  a random stop key and the hash of the browser's key. The browser keeps its key and only a masked address
  (`mail-notify`). This departs from JCE-059/JCE-065's "no address held" for this one feature, on the reader's choice,
  and the privacy policy says so (`/privacy#mail`).
- **Stopping**: every mail carries a stop link (`/notifications/mail/#s=…`) and RFC 8058 one-click headers, so the
  mail client's own 配信停止 works; お知らせ › 「メールの配信を止める」 too. Each deletes the address at once.
- **What is sent and when**: the same facts as push (`messageFor`) and the company pages, after the push run in the
  same half-hourly schedule, from the same live `/updates.json`, with its own `mail_seen` so neither channel holds the
  other back. One mail per address per run lists every followed company with news, so a busy filing day is one mail.
  At most `MAIL_SENDS_PER_RUN` (default 40) mails a run; `mail_delivered` remembers who already got which event, and
  the rest go out in the next run. Sent through Resend from `notice@kigyo-hyakka.com` (`MAIL_NOTIFY_FROM`).
- **Abuse**: sign-ups only from this site's pages (Origin), JSON only, 64 KB at most, rate-limited per IP and per
  recipient address (`MAIL_LIMIT`), so the confirmation mail cannot be used to flood someone's inbox.

### JCE-070 · 2026-11-18 · Accepted (operator) — 戦略と強み made to read at a glance on a phone

The operator asked (2026-11-18) for the 戦略と強み section to be easier to grasp, on phones too, for every company. On a
phone it ran about four screens of stacked text. Same data and the same company words (JCE-055 unchanged); only the
layout changed, in the shared component, so all 3,326 entries with the section get it at once:

- **The three questions side by side on a phone**: 成長戦略・競争優位性・業界内の位置づけ are swiped through (CSS scroll
  snap, no script), the next card peeking in, a 「横にスワイプ」 hint and n/total on each card; a wide screen stacks them
  as before. Each question carries an icon (成長 ↗, 強み 🛡, 位置 📍) so the three read as three different answers.
- **The industry flow in one line**: a chain industry's stages read left to right with arrows and wrap, instead of a
  column of boxes — the whole flow fits on a phone screen; the company's stage is still marked when it is known.
- **The growth legend only when there are two colours** — a lone 「そのほかの事業」 key explained nothing.

### JCE-071 · 2026-11-19 · Accepted (operator) — Filing alerts carry the verified figures, not just the fact

The operator asked (2026-11-19) to make the high-entry markets concrete, starting with disclosure alerts. The
market line is already drawn by others (IR BANK's alert β, 2026-11-06: free is a next-morning digest, instant is
paid), and every competitor's alert stops at the filing title. What none of them sends is the verified content.
JCE-059/069 already deliver the fact within the half hour; this decision adds what the filing actually says.

- **The event carries its figures.** `buildUpdates` adds, for a yuho / hanki / tanshin event, a summary built only
  from the entry's own printed figures for the period the filing reports: the period label, revenue and net
  income (the two figures prose may cite, invariant 4). No computed change rate is added; where the filing itself
  prints a change rate it is the filing's, cited as such. A correction event carries no figures.
- **Every channel shows it.** The お知らせ list shows the summary under the event; the push body and the mail body
  include it when present (`messageFor` in the worker), still a fact and never advice, still opening only the
  company's page.
- **No new store, no new permission.** The summary rides in `/updates.json` like the event itself; the worker
  reads it from the live file it already polls. Nothing about a reader changes.
- **Later, not now**: per-kind subscription filters (a D1 migration) and the followed companies' upcoming
  announcement calendar from the EDINET DB calendar the pipeline already reads (JCE-049) are separate decisions
  when they are built.

### JCE-072 · 2026-11-19 · Accepted (operator) — A first course: 有報の読み方入門, built from the quiz pool

The operator asked (2026-11-19) to systematise the learning side: the demand is not more data but a guided way to
read it (NISA accounts 26.47M with 38.0% never used, FSA 2025-03; the top reason for not investing is not knowing
how, 28.8%, JSDA 2024). The quiz pool (JCE-052) is already generated from printed figures with the answer's basis
written out; this decision arranges it into a course instead of a daily lottery.

- **`/learn`**: a twelve-step course, each step one pool question grouped by theme (事業の姿 → 5期の数字 →
  事業別の売上 → 海外の売上 → 四半期の動き), the explanation shown after answering, and a link into the company
  page section the question came from, so a step ends inside a real entry.
- **Progress is the reader's own**: steps done and the course badge live in `src/lib/storage/` with the streak
  and achievements (JCE-052); nothing is sent anywhere. The daily question is unchanged and counts as its step
  when it belongs to one.
- **The journey is one**: the course is linked from the diagnosis result's learning path and from 最初の一社, and
  its last step leads to following a company (JCE-059), which is where the alerts of JCE-071 begin.

### JCE-073 · 2026-11-19 · Accepted (operator) — The premium company report: printable, comparable, and still only verified figures

The operator asked (2026-11-19) for the B2B form of the encyclopedia: a company's data summarised so a premium
reader can print it, analyse it and compare companies — with the quality bar set from what real services sell
(market research 2026-11-19: TDB/TSR credit reports, Shared Research's sponsored reports, SPEEDA's comps).
What is bought in those markets is not data but a per-purpose judgement format; what none of them can offer is a
figure traceable to its filing. The report is therefore an exit of the same supply chain, under the same
invariants — and two of the research's top recommendations are refused by them: no stock price or valuation is
ever added (invariant 4), and no credit score or failure probability is invented (a fabricated judgement would
spend the trust the verification exists to build).

- **The one-page summary** (`/companies/[id]/report`, premium): modelled on the first page of a TSR report with
  the rating replaced by verified facts — the company's own description, five periods of printed figures, the
  segment and region composition of revenue, its industry position from the computed layer below, and every
  figure's source. A print layout of its own (the diagnosis site's CTS-037 pattern), made to be handed to a
  third party: premium includes the right to present it, which the credit bureaus expressly forbid.
- **The computed layer**: metrics computed from printed figures only, each labelled 計算値 — margins beyond the
  three prose ratios of JCE-038 live here, in tables, never in prose — with the industry median, quartiles, the
  company's rank and percentile beside them (the industry is the full listed population under one definition,
  which is the moat). Comparison extends `/compare` (JCE-061) with the same table for two to five companies
  and the same print layout.
- **Data added in this order, each with its source**: (1) segment profit and margin from the filings' segment
  information; (2) major shareholders, holder categories and officers, from the annual filing; (3) company
  forecasts and medium-term plan targets from the 決算短信 — always badged 会社予想（短信） apart from
  有報検証済み, with the forecast's progress against the recorded quarters updated by the existing pipeline;
  (4) capital expenditure, depreciation and R&D from the annual filing.
- **What it never becomes**: no advice and no rating (invariant 4), no contact or personal data, no unlisted
  companies, and the free entry page is unchanged — the report is a premium arrangement of what is already
  public on the site plus the computed layer, not a paywall over facts.

## JCE-074 — 2026-11-20: AdSense 却下（有用性の低いコンテンツ）への対応：独自編集コンテンツの層を作り、未完成の公開面をなくす

**背景（実測、2026-11-20）**: AdSense の審査結果は却下。管理画面に明示された理由は「有用性の低いコンテンツ」1件のみ。サイトの所有権確認は通過、ads.txt は承認済み。広告コードが描画されていない件（JCE-039、ADSENSE_SLOT=null）は指摘されていない。公開ページの本文量は中央値 約2,400字（最短859字）で薄くはなく、却下の主因は「有報データから自動生成されたテンプレートページの集合」という見え方と、開設初期でトラフィック信号が弱いことにあると判断する。加えて /features が「特集はまだ公開していません」の空ページのままサイトマップに含まれ、業界ページに「解説は準備中」の表示が残っている。未完成の公開面は審査で直接のマイナスになる。

**決めること**:
1. **未完成の公開面をなくす。** 空のページ、準備中表示、プレースホルダー文を公開面に残さない。内容が無いページは、内容ができるまでサイトマップと導線から外す（ページ自体の削除ではなく公開ラインの管理として行う）。
2. **特集（/features）を実装し、独自編集記事を公開する。** 記事は掲載企業の検証済み数値（印字値と、計算値と明記した集計）だけから書く横断の読み物とし、各記事に出典と集計の範囲を明記する。企業ページの要約の寄せ集めにしない。本文で使える数値は従来どおり売上高と純利益（不変条件）、集計の計算値は「計算値」と表示する。
3. **再審査は対策の本番反映後に1回だけリクエストする。** 無変更での再申請はしない。反映後の再申請までは、登録の進展（公開社数の増加）と通常の更新を続ける。
4. **広告の実装方式（JCE-039）は変えない。** 理由に挙がっていないため。承認後に ADSENSE_SLOT を設定する従来手順のままとする。

**やらないこと**: 記事量産のための薄い自動生成記事、キーワード詰め込み、トラフィックの購入。百科事典の哲学（出典拘束・誇張なし）の外にある対策は採らない。

## JCE-075 — 2026-11-20: 百科事典のプレミアムゲートを当面全開放する（広告と読者獲得を優先）

**背景**: 収益の柱を広告（AdSense、再審査中）に移し、読者獲得を優先する方針に切り替える。百科事典のプレミアム機能（JCE-043 のゲート、JCE-071〜073 の成果を含む）は本番に入った直後で、課金が読者の到達を妨げる段階にある。プラン自体の価値づくり（分析レポート等）は、読者基盤が育ってから別途行う。

**決めること**:
1. **このサイトのプレミアムゲートを全開放する。** 実装は `src/lib/plan.ts` の `PREMIUM_FEATURES_OPEN = true` の1点に集約する。対象は PremiumGate の全使用箇所（企業ページの財務の深掘り、企業レポート、業界の数字で見る、見比べ3社目）、見比べの社数上限（3社）、スクリーニングの保存条件上限（20件）。フラグを false に戻せばゲートは元どおりに戻る。
2. **プランそのものは変えない。** 販売（企業タイプ診断サイトの Checkout）、価格、トライアルは従来どおり。既存加入者の扱いも変えない。
3. **広告の出し分けは実プランで判定し続ける。** 広告ユニットはフラグではなく実際の加入状態だけを見る。無料読者には広告、加入者には広告なし、という広告モデルの線引きを保つため。
4. **ヘルプの案内を実態に合わせる。** プレミアムの増分は「広告が表示されなくなること」と「企業タイプ診断の全機能」と案内し、このサイトの機能は全て無料公開中と明記する。

**やらないこと**: プランの値下げ・廃止、診断サイト側のゲート変更、ゲート部品や購入導線の削除（再び閉じるときに必要）。

## JCE-076 — 2026-11-21: 型チェックのメモリ削減 — resolveJsonModule を切り、tsconfig を extends で間接化する

**背景（実測、2026-11-20〜21）**: PR#44 の本番ビルドは `next build` の型チェック段階で JavaScript heap out of memory（既定上限 約2,049MB）となり失敗した。原因はコードではなく型プログラムの大きさ: `resolveJsonModule: true` のため、生成バレル `src/data/companies/index.ts` が静的 import する企業 JSON 約3,900社分が全て推論リテラル型としてプログラムに入り、tsc の実測で 5,162 ファイル / Memory used 2,791,370K だった。企業数が増えるほど悪化する構造。PR#45 でビルドのヒープを 4096MB に上げて急場をしのいだが、恒常対策としてここで型側を痩せさせる。

**決めること**:
1. **JSON モジュールの型は `unknown` とし、検証は実行時に寄せる。** `src/types/json-modules.d.ts` に `declare module "*.json"` を置き、`resolveJsonModule` を切る。内容 JSON は全て読み込み時に検証される（企業・業界・用語は `parseContent` の zod スキーマ、本社・ウェブサイトも static-repositories で同じ）ため、推論型を捨てても検証の強さは変わらない。直接読む数ファイル（日本地図、released-with-notes、テストでの利用）は import 側に型注釈を付ける。
2. **tsconfig は `tsconfig.json`（extends のみ）＋ `tsconfig.base.json`（実体）にする。** Next.js 16.3.5 は `verifyTypeScriptSetup` → `writeConfigurationDefaults` で tsconfig.json を書き戻し `resolveJsonModule: true` を強制するが、同関数には「tsconfig が `extends` か `references` を持つ場合は書き換えを bail する」分岐がある（node_modules/next/dist/lib/typescript/writeConfigurationDefaults.js で確認）。また型チェック本体（runTypeCheck.js）のオプション合成は `{ ...requiredConfig, ...effectiveConfiguration.options }` でユーザー設定が後勝ちなので、解析済み設定の `resolveJsonModule: false` が Next の要求値に勝つ。`next dev --webpack` 起動＋企業ページ描画の前後で tsconfig 両ファイルのハッシュが不変であることを実測して確認した（2026-11-21）。この間接化を将来 tsconfig.json へ戻す（inline 化する）と書き戻しが復活し、ビルドが再び落ちる。戻さないこと。
3. **実測効果（単体 tsc、`--extendedDiagnostics`、tsbuildinfo 削除後の比較）**: プログラム 5,162 → 1,194 ファイル（JSON 3,969 → 0）、Memory used 2,747,756K → 644,051K（約 −77%）、Total time 43.16s → 18.55s。新規エラー 0 件（変更前後でエラー集合は完全一致、残る 142 件は検証環境に .next/types と next-env.d.ts が無いための既知の対象外のみ）。
4. **フォールバックは PR#45 のヒープ 4096MB。** 将来の Next のバージョンアップで extends 回避が効かなくなった場合（tsconfig.json が書き戻される、`resolveJsonModule` が true に戻る等）は、この対策は静かに失効し、ビルドは 4096MB ヒープで当面持ちこたえる。Next を更新したら、dev 起動後に tsconfig.json が書き換わっていないかを一度確認すること。

**やらないこと**: データ JSON と生成バレル（src/data/companies/index.ts）への変更、`typescript.ignoreBuildErrors` 等での型チェック自体の無効化。

**補足（2026-11-21）**: 静的書き出しビルド（scripts/build-static.mjs）は固定リストのルートファイルを作業コピーへ複製するが、そのリストに `tsconfig.base.json` が無く、コピー側の tsconfig.json が実体の無い extends になっていた。リストに tsconfig.json と並べて追加した。

## JCE-077 — 2026-11-21: ファーストビューの情報密度を上げる（ワードマークは「ラベル」であって「ポスター」ではない）

**背景（運営者の指摘、2026-11-21）**: 企業ページを開いた瞬間の情報量が少なく、主要な数字（売上高・純利益・従業員数）に届くまでスクロールが多い。原因は情報の不足ではなく配置で、英字ワードマークが最大5.5remの表示サイズで画面を占有し、説明文の大きな行間と余白が KeyFacts を折り返し以下に押し出していた。他ページにも同型の問題（業界ページのワードマーク、一覧カードのワードマーク、学習ページの上部余白）がある。

**決めること**:
1. **ワードマークはラベルサイズに統一する。** 企業ヒーローは最大2.25rem、業界ヘッダーは最大1.75rem、一覧カードは最大1.625rem。英字名は識別の手がかりとして残し、画面の主役にはしない。
2. **密度は構成で作り、指標は増やさない。** ヒーローの KeyFacts は従来どおり「規模だけ」（不変条件4: 成長率や順位を3秒レイヤーに置かない）。余白と文字サイズの圧縮で、説明・事業チップ・KeyFacts・操作ボタンまでをスマホのファーストビューに収める。
3. **同型の圧縮を他ページにも適用する。** 業界詳細ヘッダー、企業カード、学習コース（/learn）、企業レポート、有報トップのヒーロー余白。内容・データ・順序は変えない。

**やらないこと**: ファーストビューへの成長率・ランキング等の追加（不変条件4）、セクション構成や本文の変更、デザインシステム（書体・色）の変更。
