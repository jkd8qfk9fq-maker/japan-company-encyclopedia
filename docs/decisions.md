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
- **2026-11-23, +126 (1,006 listed)**: at the operator's request, the 711 unreleased entries were run through the same
  rules (`releaseReadiness` and the note patterns of `tests/release.test.ts`), and every note of the 172 that passed
  was read by Claude. 126 whose notes are facts only were added (going-concern disclosures as printed, tender offers,
  stock splits, post-balance-sheet events, lawsuits). Left out: 46 whose notes leave something to confirm or decide
  that the patterns did not catch (確認できません, 人による確認を推奨, an open question about the filing, a
  provisional industry), and 32 whose notes were stored as the text `[object Object]` — a defect to repair before they
  can be judged.

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

## JCE-078 — 2026-11-21: 企業分析SaaSを構築する（5観点の分析レポートと分析データの有料化）

**背景**: JCE-075 で百科事典の既存機能は全て無料に開いた。運営者の提案（2026-11-20）: 企業分析のフォーマット（システム）を作り、経済指標・財務データから企業の優位性を測ってレポート形式で表示し、分析データを有料化する。仕様案は docs/jce-078-analysis-saas-spec.md に置く。

**決めること**:
1. **分析は5観点で構成する。** 規模と地位／成長／収益性／財務の安定／外部環境との接続。土台は JCE-073 の計算指標レイヤー（既存10指標: 純利益率・利益率・自己資本比率・総資産回転率・1人あたり売上高/純利益・海外売上高比率・前期比・5期の伸び）で、分布規則（同種の利益行のみ、母数5社未満は分布なし、比較対象は最新期400日以内）と「計算値」の明記を継承する。
2. **外部環境は経済指標スナップショットで接続する。** データブック登録済みの公的統計から約15指標を repo 内コンテンツ（src/data/indicators/）として持ち、業界との対応表で結ぶ。接続の説明は構造に限り、因果は主張しない。ファンド等の見通し文書は素材にしない。更新は月次（X月次分析の取得に相乗り）。
3. **有料化は新規の分析層に限る。** JCE-075 で開いた範囲は再び閉じない。ゲートは plan.ts に PREMIUM_FEATURES_OPEN と独立に新設する。販売は既存プラン（診断サイトの Stripe）の上位層を基本形とする。
4. **会社数に比例する新規ルートは作らない。** 分析は既存のレポートページの拡張とし、新規ルートは /analysis と指標ページ（指標数分）のみ（2026-11-21 の静的ファイル数上限の教訓）。

**やらないこと**: 総合スコア・格付けの創作、投資助言に当たる表現、株価・時価総額・PER/PBR、与信判断（倒産確率・信用評点）、JCE-075 の無料範囲の再有料化。

## JCE-079 — 2026-11-21: 静的書き出しを複数 Worker に分割し、無料枠で公開し続ける

**背景**: 2026-11-21、静的アセットが37,018ファイルに達し、Workers Free の上限（1バージョン20,000ファイル、エラー code 10304）を超えてデプロイが止まった。内訳は企業ページ（詳細＋企業レポート）が約36,300ファイルで、公開企業2,993社に比例して増え続ける。Workers Paid（月$5、上限100,000ファイル）も提示したが、運営者は分割方式（無料）を選んだ（2026-11-21）。

**決めること**:
1. **企業ページをプレフィックス単位でシャード Worker に分ける。** nihonkigyohyakka-c1、-c2、… が /companies/<prefix>* を担当する。シャードも本体と同じ worker/index.ts を走らせ、セキュリティヘッダーやリダイレクトの振る舞いを揃える。カスタムドメインと cron（通知）は本体のみに置き、二重発火を防ぐ。/api/* はシャードへ回らない。
2. **分割は scripts/partition-static.mjs がデプロイのたびに実ファイルから再計算する。** 企業をプレフィックス atom（先頭1文字、ファイル数の多い文字は先頭2文字）単位でまとめ、軽いシャードから詰める。生成する wrangler 設定には担当 atom のルートだけを書くため、ルーティングと実ファイルは常に対で一致する。シャード数は総ファイル数から自動で決まり、どのスライスも19,500ファイルを超える場合は実行を失敗させて止める（上限超過のまま出荷しない）。
3. **デプロイは GitHub Actions に一本化する。** .github/workflows/deploy-static.yml が1回のビルドから全スライスを切り、シャード→本体の順にデプロイする。公開リポジトリのため Actions の分数はかからず、Workers Builds の分数消費と、プロジェクトごとにビルドがずれてスライス間で不整合になる問題が消える。
4. **Workers Builds の自動ビルドは止める。** 二重デプロイを防ぐため、nihonkigyohyakka プロジェクトの Git 接続を切り、サーバー版プロジェクト（japan-company-encyclopedia）も同様に止める（ダッシュボード操作は運営者）。

**やらないこと**: Workers Paid への移行（運営者判断で見送り）、企業ページのデータ描画化（ファイル数を増やさない方式への移行は将来の選択肢として残す）、URL・ページ内容・デザインの変更。

## JCE-080 — 2026-11-21: ファーストビュー監査の続き — JCE-077 が届かなかったページの圧縮

**背景（実測監査、2026-11-21）**: JCE-077 の反映後、本番の主要ページをモバイル幅（390px）で実測した。(1) IndustryHero（写真帯）のワードマークが `clamp(1.75rem, 5vw, 3rem)` のままで、JCE-077 が決めた業界ヘッダーの上限 1.75rem を超えていた。業界詳細では同じ英字名がページヘッダーと写真帯の二箇所にファーストビューで出る（本番 HTML の出現順で確認）。(2) /companies は導入文（.prose-ja、17px・行間2で約13行≒440px）と大きな上下余白のため、検索欄が約750px、最初の企業カードが約810px の位置にあり、スマホのファーストビューに企業が1社も入らなかった。JCE-077 はカード側だけを直し、このページヘッダーには届いていなかった。(3) 業界詳細・業界ハブとも、タブ直下の最初のパネルに CompanySection の上余白（py-14）がそのまま効き、本文の開始が遅れていた。

**決めること**:
1. **IndustryHero のワードマークを業界ラベルサイズに揃える**（最大 1.75rem、ページヘッダーと同じ段）。写真帯の高さも h-36 / md:h-64 に圧縮する。写真は業界の説明素材であり、文字はキャプションに留める。
2. **/companies のヘッダーを圧縮する。** 上余白 pt-8 / md:pt-12、導入文は業界ハブの導入文と同じ 0.9375rem・行間7、一覧までの間隔は mt-8。文面・内容は変えない。
3. **タブを持つページの最初のパネルは上余白を絞る。** 業界詳細の「仕組み」と業界ハブの「業界一覧」は CompanySection の上余白を pt-8 / md:pt-12 にする。本文・順序・データは変えない。

**やらないこと**: トップページと企業ページのヒーロー（実測で検索・主要数値がファーストビュー内に収まっている）、/discover の導入部（JCE-074 の意図的な構成）、写真帯の文字そのものの削除（キャプションとしての役割の要否は運営者判断に残す）、デザインシステム（書体・色）の変更。

## JCE-081 — 2026-11-21: JCE-078 の Phase 1・2 を実装する（5観点フォーマットと指標スナップショット）

**背景**: JCE-078 の仕様（docs/jce-078-analysis-saas-spec.md）に基づく実装。Phase 3（課金・プラン連携・PDF・B2B単品）は行わない。

**実装したこと**:
1. **Phase 1 — 5観点フォーマット**（src/lib/company-analysis.ts）。既存10指標（report-metrics）を5観点に再編し、観点1に印字値（売上高・総資産・純資産・従業員数）の業界内順位・パーセンタイルを、観点4に純資産の推移と前期比（会計基準が前期と同じ場合だけ計算）を足した。レポートページに「分析（5観点）」部を追加し、入口ページ /analysis を新設した。
2. **無料／有料の境界**。無料は観点ごとの自社の値＋業界中央値。有料（分布の全体像・推移・セグメント構成との接続・指標連携）は plan.ts に PREMIUM_FEATURES_OPEN と独立の ANALYSIS_FEATURES_OPEN（初期値 false）で構造だけ用意した。JCE-075 で開いた範囲は再び閉じていない。既存プランで分析層が開くかどうかは Phase 3 の判断ポイントのまま残す。
3. **Phase 2 — 指標スナップショット**。スキーマ（indicatorSchema / industryIndicatorsSchema、zod＋data-integrity テスト）、/indicators/[indicator-id] ページ、業界対応表（src/data/industry-indicators.json、接続の説明は構造のみ・因果は書かない）を実装。初期指標は FRED（仕様が認める公的集計）から出典を確認できた7系列のみ: 日本の実質GDP（内閣府）・完全失業率、米国の実質GDP・消費者物価指数・非農業部門雇用者数・FFレート、ドル円相場。月次更新は scripts/indicators/fetch-indicators.py が担う。
4. **入れなかったもの**。仕様の開始15指標のうち、日本の消費者物価指数（FRED の OECD 系列 CPALTT01JPN657N が再確認時に 404・タイムアウトで検証できなかった）・企業物価指数・有効求人倍率・実質賃金・輸出額・経常収支・短観DI・鉱工業生産指数は、FRED の系列が古い（鉱工業生産は2024年3月で停止）か出典を確認できる形で取得できず、初回は見送った。e-Stat・日銀等の一次情報からの取得手順を別途用意してから足す。

**やらないこと**: Phase 3 の課金実装、総合スコア・格付け、投資助言、株価系指標、与信判断、会社数に比例する新規ルート、JCE-075 の無料範囲の再有料化。

## JCE-082 — 2026-11-22: ハイブリッド学習 Phase 1（マイクロレッスン＋決算定期便ページ）

**背景**: 市場分析（セグメント分析・既存サービスの不満調査・Duolingo形式の適用分析・投入後評価フレームワーク）の結論に基づく実装。主役は「個人投資家・投資を学ぶ人」で、最大の未充足は価格ではなく「数字の意味が分からない・学び方が分からない」という学習障壁だった。形式はハイブリッド——コースで基礎を作り、決算定期便で継続させる——を採る。今回の Phase 1 は学習層と定期便ページまでで、課金と配信は行わない。

**設計判断**:
1. **Duolingoから採るのは3要素のみ**。①3〜4分のマイクロレッスン＋即時クイズ ②週単位の軽い進捗表示（今週進んだレッスン数だけを数える。罰・損失回避・連続記録の圧はかけない） ③間隔反復の復習キュー（1→3→7→21日、間違えたら翌日）。捨てたもの: リーグ競争、ハート/Energy制、毎日強制の通知、ポイント経済圏。全面模倣をしない理由は規模の構造（課金率約9%×巨大な母数が前提の事業形式は個人運営では再現できない）にある。
2. **学習の核は「予測→開示→照合」ループ**。クイズに先読み型（「この会社の売上は前期より増えたか」を、数字を見る前に答えさせる）を入れ、回答後に2期分の印字値と計算値（前期比）で答え合わせをする。AIの無料要約が代替するのは「説明」であり、自分で読むプロセスは代替されない、という深掘り分析の結論に基づく。
3. **実データ連動クイズは2系統**。既存のクイズプール（JCE-052、2社比較型）はそのまま再利用し、新規に1社型の生成器（src/lib/lesson-questions.ts）を足した: 最新期の売上高4択（選択肢は前期の印字値・10倍・1/10という算術的な近傍のみで、他社の数字をこの会社の数字として並べることはしない）と、先読み型の増減問題（前期比の絶対値が売上3%・純利益5%未満の年と、純利益が赤字を含む期は出題しない）。全問題が sourceIds と出典タイトルを保持し、画面に出典注記を出す。増減の向きは計算値として計算式を併記する。
4. **進捗は localStorage**（src/lib/storage/ の microProgress ストア）。アカウント基盤は変更しない。理由: 既存の学習・エンゲージメント機能（JCE-052/059/072）がすべてこの方式で、読者データをサーバーに送らない設計が一貫しているため。週の進捗はレッスン完了日からの純粋な集計で、新しい記録は増やしていない。サーバー側の学習履歴と課金は Phase 2/3 の判断事項。
5. **決算定期便はページまで**（/digest）。データは既存の開示検知（JCE-052 の updates、JCE-071 の検証済み数字つき要約）を再利用し、今週・先週の開示に「この決算の読み方」（関連マイクロレッスン）と企業レポート（分析5観点）への導線を付けた。定期便の価値はニュースの速報性ではなく「学んだ読み方で変化を読む」ことに置く。メール/Push配信は Phase 2 に送った（フォロー中企業への通知は JCE-059/069 が既に担っている）。

**実装したこと**: src/lib/lesson-questions.ts（1社型クイズ生成）、src/lib/micro-lessons.ts（単元・レッスンの定義とプールへの決定的な束ね）、src/lib/review-queue.ts（間隔反復）、src/lib/jst-dates.ts（週の境界）、src/app/lessons.json（静的JSON）、/learn へのマイクロレッスン組み込み（12ステップコースは存続）、src/lib/digest.ts と /digest、sitemap への /digest 追加、tests/micro-lessons.test.ts。最初の単元「売上と利益の違いを実在企業で読む」（5レッスン・10問）を完成形で入れ、後の2単元は構成（レッスン名）だけを用意した。

**やらないこと**: 課金・プラン連携（ANALYSIS_FEATURES_OPEN は触らない。JCE-075 の開放範囲は再び閉じない）、配信（メール・Push）、リーグ等の競争要素、総合スコア・格付け、投資助言、株価系指標・与信判断の出題、会社数に比例する新規ルート。

**追加要件（2026-11-22、経営稟議評価から）**:
6. **ポジショニングは「分析訓練環境」**。商品は「金融知識を学べる」ではなく「実際の決算で、自分で読み、予測し、検証することで企業を見る力を鍛える訓練の場」として打ち出す。/learn と /digest の導入コピーは利用者が得る結果で書き、「決算ニュースを届ける」式の表現は使わない（定期便という名前は便りの形式を指すに留め、価値の主張は訓練に置く）。
7. **5ステップ体験の骨格**。1社を読む体験を STEP1 予測 → STEP2 開示 → STEP3 照合 → STEP4 フィードバック → STEP5 蓄積 で設計する。Phase 1 の対応: STEP1 は先読み型クイズ（数字を見る前に方向を答えさせる）、STEP2 は /digest の今週・先週の開示、STEP3 はクイズの答え合わせと企業レポート（分析5観点）、STEP4 は復習キュー（見落とした問題の再出題）、STEP5 は訓練の記録（完了レッスンと回答数の蓄積表示）。/learn に5ステップの案内を置き、各ステップから対応する場所へリンクした。**Phase 2 課題**: (a) 決算前に立てた予測を保存し、開示後にその会社の実績と自動で照合する仕組み（現行の先読み型は2期とも開示済みの数字で訓練するもので、未来の開示への予測ではない） (b) 能力変化の可視化（正答率の推移・観点別の弱点） (c) STEP4 の体系化（見落とした指標・改善点の自動整理。現行は復習キューによる再出題まで） (d) 予測と照合の履歴を会社ごとに束ねた「自分の分析履歴」ページ。
8. **データの来歴表示は対象期間を必ず併記**。クイズ（1社型）は対象期間（会計年度、増減問題では前期→最新期）をカードに常時表示し、出典タイトルと sourceIds を保持する。/digest は開示のタイトルと要約に対象期間（年度・四半期）を含める（訂正イベントは数字を持たないため対象外）。**残課題**: 取得日・指標の定義・修正履歴まで含む完全な来歴表示は、データ基盤側（revisions と sources の公開側への接続）の整備が要るため Phase 1 では行わず、出典と期間までの表示に留めた。
9. **継続の圧をかけない方針は維持**。ストリーク切れの警告・損失回避のコピーは入れない。訓練の記録は「失うもの」としてではなく「次の会社を選ぶ手がかり」として表示する。

## JCE-083 — 2026-11-22: 独自性システム（予測の保存と照合・分析の記録・来歴の完全表示）

**背景**: 経営稟議で商品ポジションが「分析訓練環境」に固定され、独自性は情報量ではなく (1) 予測→開示→照合→フィードバック→蓄積の体験、(2) 検証済みデータの来歴の透明性、(3) 利用者自身の分析記録の蓄積、に置くことが決まった。JCE-082 の Phase 2 課題 (a)〜(d) と、来歴表示の残課題（取得日・定義・修正履歴）を実装する回。

**設計判断**:
1. **予測は「次の年次決算の方向」だけを記録する**。企業ページと企業レポートに予測パネルを置き、最新期の印字値を基準に、売上と純利益が次の有価証券報告書で増えるか減るかを記録する。四半期は対象にしない（予測の単位は年次で揃える）。最新期の値が載っていない・0以下の指標は受け付けない（赤字からの「増える」は一つの方向として読めないため。JCE-082 の出題ガードと同じ）。コピーは訓練であることを明示し、売買の判断を促す表現は一切しない。
2. **改竄防止は構造で作る**。予測は会社×指標×基準期ごとに write-once（ストアが二度目を拒否する）。記録には記録日時と基準期を固定し、結果は保持しない——照合は表示のたびにサイト側のデータだけで導出するので、保存された記録を書き換えても的中は作れない。ローカル保存である以上、ブラウザの保存領域そのものを消せば記録は消える。これは「自分のブラウザの中の訓練記録」という性質として明示し、サーバーで保証する仕組みとは偽らない。
3. **照合の判定は JCE-047 の比較可能性ルールをそのまま使う**。基準期と実績期で会計基準または売上の集計範囲（revenueBasis）が異なる場合は増減を判定せず「照合対象外」と理由を表示する。同額は「増減なし」として、一致・不一致のどちらにも数えない。判定に使う実績は基準期より後の最初の年次レコード。
4. **能力はスコア化しない**。訓練の記録（/learn）が示すのは事実の積み上げだけ: 照合を終えた予測の件数と内訳（一致／逆の向き／増減なし）、答えた問題の種類（読み方の広がり）、単元ごとのレッスン完了、復習キューの間隔の分布、先月と今月の活動量の比較。利用者の能力を1つの数値に合成したり格付けしたりはしない——根拠のない合成指標は、企業の総合スコアを禁じるのと同じ理由で作らない。
5. **会社ごとの分析履歴は既存ページの拡張で作る**。新規ルートは作らず、/learn の「訓練の記録」に、レッスンの回答・予測・照合を会社ごとに時系列で束ねて表示する。/digest の先頭には自分の照合結果（開示が載って照合できるようになった予測）を出す。記録は「次の会社を選ぶ手がかり」として提示し、喪失回避のコピーは使わない（JCE-082 の方針を維持）。
6. **来歴表示は、既存データで裏付けられる項目だけを出す**。企業レポートに「このデータの確かめ方」ブロックを新設: 対象期間（期の範囲と最新期の期末日）、数字の出典（タイトルへのリンク・公表日・EDINET文書ID）と確認日、計算値の定義（指標ごとの計算式）、修正履歴（訂正を表す revision の記録）。**出さなかった項目と理由**: 数字ごとの「取得日時」はエントリに存在しない（出典ごとの確認日 accessedAt はあるので、それを表示した）。検証方法の詳細な手順書はデータに紐づく形では存在しないため、ブロックには方針の要約と /about の「データの出典と加工について」への導線に留めた。
7. **保存と配信の方式は JCE-082 を継承**。予測は localStorage（src/lib/storage/ の predictions ストア）、照合に必要な各社の年次数字は静的 JSON（/predictions.json）で配信する。アカウント基盤は変更しない。予測データそのものはブラウザの外に出ない。

**実装したこと**: src/lib/predictions.ts（予測の型・write-once の追加・照合の判定・予測データの構築）、storage への predictions ストア追加、src/app/predictions.json、src/components/engagement/prediction-panel.tsx（企業ページ・レポート共通の予測と照合）、src/components/engagement/digest-verifications.tsx（/digest の照合表示）、src/components/engagement/training-history.tsx（能力の変化と会社ごとの記録、/learn）、src/components/company/data-provenance.tsx（レポートの来歴ブロック）、MicroQuestion への kind の追加（履歴の分類用）、tests/predictions.test.ts。来歴の修正履歴のために RevisionRepository へ listCorrectionsForTarget を追加した——レポートページは全社分レンダリングされるため、list() の全件読み（約1万ファイル）を各ページで繰り返すことはできず、ファイル名（= revision id）が対象と訂正を名指しする性質を使い、候補だけを読んで内容で検証する方式にした。

**やらないこと**: 能力スコア・格付け、予測の編集・削除 UI、四半期への予測、メール/Push での照合通知（配信は別フェーズ）、課金・プラン連携、会社数に比例する新規ルート。

## JCE-084 — 2026-11-22: 学習ユニット2・3の完成（事業の姿を読む／四半期で、いまの動きを読む）

**背景**: JCE-082 で /learn のマイクロレッスン基盤と単元1「売上と利益の違いを実在企業で読む」が本番稼働したが、単元2・3はレッスン名のみの「準備中」表示だった。JCE-074 の原則（未完成の公開面を残さない）にも反するため、両単元を完成形にする。テーマ選定は「既存データで裏付けられるものだけ」を条件とし、着手前に全社のデータ所在を実測した（事業別売上 1,755社、地域別売上 88社、四半期・中間期は四半期レコード288社／中間期レコード2,089社、連結従業員数 3,690社、株式ファクト 3,894社）。

**設計判断**:
1. **単元2「事業の姿を読む」は、姿を数字で読む5レッスンにする**。何を売っている会社か（説明文クイズ）、事業セグメントと売上の内訳、海外売上比率、従業員と1人あたり売上、株主と所有。クイズは新しい生成種別で作る: 最大の事業（segment-top、その会社の事業同士が選択肢で、最大が2位の1.25倍未満なら出題しない）、海外売上比率（overseas-ratio、JCE-038 の計算値に算術的近傍の選択肢）、従業員1人あたり売上高（employees、JCE-081 の計算指標と同じ定義で、誤答は前期の値・2倍・半分）、発行済株式総数（shares、JCE-066 の印字値）。従業員のレッスンには連結従業員数の方向を問う先読み型（growth-employees、±2%未満の年は出題しない）を入れ、各単元に最低1問の先読み型を置く方針を単元2でも守る。提出会社のみの従業員数（workforce）は使わない——持株会社では本社の人数だけになり、連結の売上と割ると姿を誤るため。本文でその区別自体を教える。
2. **単元3「四半期で、いまの動きを読む」は、比べ方の単元にする**。四半期と通期の違い、前年の同じ時期との比較（quarterly-direction: 累計四半期の方向を先読み型で、±3%未満は出題しない。出典の種別——決算短信（EDINET DB）か半期報告書か——を解説に明記する）、進捗の目安、訂正の読み方、仕上げの予測への接続。最後のレッスンは JCE-083 の予測パネル（企業ページの「次の決算の予測と照合」）への導線とし、年次の先読み型で締める。
3. **進捗率は「前年通期との目安」としてだけ出す**。進捗率本来の物差しは決算短信の会社予想だが、会社予想はエントリに存在しない（JCE-073 の追加順序 (3) で将来追加予定、その際は「会社予想（短信）」バッジで実績と区別する）。存在しない数字で問題は作れないため、quarterly-progress は「今期の累計売上 ÷ 前年の通期売上」を計算値として出し、本文と解説で「進捗そのものではなく目安」と明示する。会社予想の区別は本文で教える。
4. **データのないテーマは見送る**。設備投資と減価償却の関係、大株主・所有者別の内訳、会社予想と実績の照合は、いずれもエントリにデータが無い（JCE-073 の追加順序 (4)・(2)・(3) の未実装分）。レッスン本文で読み方（有報のどこに載るか）に触れるに留め、問題は作らない。データが入った時点でレッスンを足す。
5. **仕組みは JCE-082/083 を変更しない**。束ねは buildMicroCourse のスロット方式のまま（単元2・3の仕様を追加し、全単元を束ねる）。進捗ストア・復習キューはそのまま乗り、訓練の記録の種別ラベルだけ新しい種別ぶんを追加した。新規ルートは作らない（/lessons.json の中身が変わるだけ）。

**実装したこと**: src/lib/lesson-questions.ts（生成種別7種を追加: segment-top / overseas-ratio / employees / growth-employees / shares / quarterly-direction / quarterly-progress。各社上限は既存と同じ72問）、src/lib/micro-lessons.ts（単元2・3の仕様と束ね）、src/components/engagement/training-history.tsx（種別ラベル追加）、tests/micro-lessons.test.ts（新種別の生成・ガードと、全単元の束ね・先読み型の存在を検証。JCE-082 の「後続単元は構造のみ」テストは本決定で置き換えた）。

**やらないこと**: 会社予想・設備投資・大株主データの新規収集（JCE-073 の追加順序に従い、データ整備は別タスク）、四半期への予測の拡張（JCE-083 の年次限定を維持）、進捗率を会社予想比と偽る表示。

## JCE-085 — 2026-11-22: 学習クイズの出典・期間の欠落修正（/lessons.json 全30問への引用付与）

**背景**: 本番確認（2026-11-22 03:14）で、/lessons.json の全30問のうち11問に構造化フィールド sourceIds・period が無いことが判明した。JCE-082/084 の規則「全問が sourceIds・出典タイトル・対象期間を保持し画面に常時表示」を厳密に満たしていなかった。

**欠落の原因**: 11問はすべて比較プール（JCE-052、src/lib/engagement-data.ts の buildQuizPool）由来だった。プールの QuizQuestion 型が出典・期間のフィールドを持たず、束ね側（src/lib/micro-lessons.ts の fromPool）もそれらを MicroQuestion へ渡していなかった。1社型の生成器（lesson-questions.ts）は JCE-082 の時点で全問に sourceIds・sourceTitle・period を付けていたため、欠落はプール由来の11問に限られた。内訳: revenue 2問、quarterly 3問、segment 2問、overseas 2問、describe 2問。うち9問は解説文に対象期間と出典種別（有価証券報告書／決算短信）が書かれていたが、構造化フィールドとしては無かった。describe 2問（describe-pole-to-win-holdings、describe-agora-hospitality-group）は解説文にも期間・具体的出典がなく「日本企業百科事典の解説から。」だけだった。

**設計判断**:
1. **プール側で引用を生成する**。QuizQuestion に sourceIds・sourceTitle・period を必須フィールドとして追加し、5種別すべてで生成時に埋める。比較問題（2社型）は両社のレコードの sourceIds の和集合、sourceTitle は正解側の会社の出典タイトル（解説文が両社の数字と期間を併記しているため）、period は両社の対象期間（一致すれば1期、異なれば「2026年3月期／2025年12月期」のように両方を併記）。
2. **describe 問題の出典は事業構造が指す有報**。説明文はエントリの一文要約で、内容は事業構造（businesses）の要約である。出典は、事業構造が指す sourceIds と一致する最新の年次レコード（＝その有報）とし、期間はその期。ポールトゥウィン: 有価証券報告書－第17期（2025/02/01－2026/01/31）、2026年1月期、yuho-2026。アゴーラホスピタリティーグループ: 有価証券報告書－第88期（2025/01/01－2025/12/31）、2025年12月期、yuho-2025。いずれも事業構造の sourceIds と最新レコードの sourceIds が一致することをデータで確認した。解説文も「{出典タイトル}（{対象期間}）の事業の内容から。」に改めた。
3. **出典が名指しできない問題は出さない**。出典タイトルが解決できない比較問題、事業構造の出典と一致する年次レコードが無い describe 問題は生成しない（欠落のまま出さない）。これは不変条件1・2の帰結であり、JCE-082 の出題ガードと同じ方針。
4. **再発防止は型とテスト**。MicroQuestion の sourceIds・sourceTitle・period を任意から必須にし、fromPool が3つとも渡す（渡し忘れはコンパイルエラーになる）。テストは3層: (a) プール生成の単体テスト（比較問題の両社引用、describe の事業構造由来の引用、根拠が無い場合の出題なし）(b) 実データテスト（プール全問に引用があること、describe 2問の出典・期間の完全一致）(c) 束ね後のテスト（コースに束ねられた全問に引用があること）。新しい種別・プールを足すときは、この3層のテストが欠落を検出する。

**実装したこと**: src/lib/engagement-data.ts（QuizQuestion への3フィールド追加、sourceTitleOf・periodsOf 補助関数、5種別への付与、describe の事業構造由来の出典特定と解説文の改稿）、src/lib/micro-lessons.ts（fromPool の受け渡し、MicroQuestion の3フィールド必須化）、tests/learn-course.test.ts（JCE-085 の単体・実データテスト、既存の segment・quarterly フィクスチャへの出典追加）、tests/micro-lessons.test.ts（束ね後の全問引用テスト）。/quiz.json（12ステップコースと日替わりクイズの共有プール）も同じ修正の恩恵を受け、出力に引用が付くようになった。表示側（micro-lessons.tsx の「対象期間」「出典」表示）は既にフィールド対応済みで変更なし。

**やらないこと**: 会社予想・設備投資・大株主データの新規収集、describe 問題の出典を説明文の執筆履歴に遡ること（説明文に sourceIds が存在しないため、事業構造由来の帰属を約束として記録する——説明文を別の文書から書き直す場合は帰属も事業構造とともに移すこと）、総合スコア・格付け、投資助言、株価系指標。

## JCE-086 — 2026-11-22: 決算定期便のメール配信の下準備（送信はしない）

**背景**: ハイブリッド事業の有料βでは「決算定期便」をメールで届けることが前提になっている（経営稟議の導線：無料体験 → メール等の直接接点 → 有料）。/digest ページは本番稼働中だが、メール配信の仕組みは無かった。今回は送信は行わず、下書きの生成までを作る（宛先リストはまだ存在しないため）。

**設計判断**:
1. **文面は /digest と同じ生成元から作る**。開示データは公開中の /updates.json（JCE-052 の buildUpdates の出力、JCE-071 の検証済み数字つき要約）を読み、週の切り分けと文面化だけをメール側で行う。buildUpdates 自体の再実装はしない。
2. **文面テンプレートは `src/lib/digest-email.ts`（ランタイム import なし）**。週の算術は `src/lib/jst-dates.ts`、読み方のラベルは `src/lib/digest.ts` の `readingFor` と同じ内容を写した。写しにしたのは、配信スクリプトが素の Node でこのモジュールを直接 import するため（`@/` エイリアスや副作用のあるモジュールには依存できない。Node 22.18 以降の型除去で読む）。写しのズレは `tests/digest-email.test.ts` のパリティテスト（メールの週が /digest の週と一致すること）で検出する。
3. **メールの構成**。件名は「今週の開示 N件（月曜〜日曜）」。本文は (a) 今週の決算短信を最大3件——「先に予測して、答え合わせ」の訓練に使えるものとして、種別だけの規則で選ぶ（順位付け・推奨ではない）(b) 今週の開示一覧を最大12件、残りは /digest への導線 (c) 自分の予測の照合（/digest）と訓練の記録（/learn#training-history）への導線 (d) 読み方レッスン（/learn）への導線 (e) 数字についての注記と配信停止の案内。先週の件数は1行だけ記す。
4. **線引きはページと同じ**。数字は開示が載せた売上高と純利益だけで、対象期間を必ず併記する。訂正イベントには数字を付けない。計算値はメールに含めない。株価・PER/PBR/ROE・推奨・スコア・格付けは文面に入らない（禁止語のテストがある）。
5. **配信スクリプト `scripts/digest/send-weekly-digest.mjs` は下書きだけを作る**。宛先 CSV（`scripts/digest/recipients.csv`、見本は `recipients.example.csv`）と文面から `scripts/digest/drafts/<日付>-digest-draft.md` を書く。送信処理は実装しない（将来の送信は Gmail コネクタ経由を想定し、スクリプト内に明記）。宛先が空の場合は下書きを書いたうえで「送信対象なし」と表示して終了する（exit 0）。宛先の形式誤り（メールアドレスの形が正しくない行）は推測で直さず終了する。重複アドレスは1通にまとめる。
6. **宛先リストと下書きは git 管理外**（.gitignore に追加）。実アドレスを公開 repo に入れない。運用手順は `docs/digest-email-ops.md` に置いた（配信タイミングは毎週月曜 07:30 JST を推奨としつつ最終決定は未定、文面の確認手順、退会は当面返信による手動対応）。

**実装したこと**: src/lib/digest-email.ts（文面テンプレート）、scripts/digest/send-weekly-digest.mjs（下書き生成スクリプト）、scripts/digest/recipients.example.csv（宛先リストの見本）、docs/digest-email-ops.md（運用手順書）、tests/digest-email.test.ts（文面・週のパリティ・禁止語・スクリプトの動作確認）、.gitignore（recipients.csv と drafts/ を管理外に）。

**動作確認**: 実データ（公開中の /updates.json、2026-11-22 週）で実行し、下書きが生成されることを確認した。今週72件・先週1,206件で、/digest 本番確認（JCE-082）の件数と一致した。一覧は12件までで「ほか 60件」と表示された。宛先が空のため「送信対象なし」で終了し、送信は行っていない。

**やらないこと**: 実際のメール送信（Gmail コネクタ経由の送信も今回は行わない）、送信元アドレス・配信頻度の最終決定、退会リンクの実装、送信処理の自動化、JCE-069 のメール通知システムとの統合。

## JCE-087 — 2026-11-22: ホームと企業ページのUI刷新（サービス導線を前面へ）＋有料βの受付開始

**背景**: 運営者の指示（2026-11-22、スマホ画面のスクリーンショット2枚つき）。(1) ホームのヒーロー文言「企業を知ることは、日本経済を知ること。」と説明文は不要で、ユーザー目線で「すぐにサービスに辿り着ける」構成にすること。(2) 企業ページは「何が載っているのか分かりにくい」「無駄なスペースが多い」——英字ワードマーク＋和名＋法人名の三重表示と大きな余白で主要数値までが遠い。(3) 金融規制の専門家確認が完了した（運営者報告）ため、有料β（月1,100円）の受付導線を開始する。

**設計判断**:
1. **ホームの冒頭は「ブランド＋検索＋サービス入口」に作り替える**。ヒーローの標語と説明文は削除する（メタ情報の SITE_DESCRIPTION は検索結果用の説明として残す）。検索の直下にサービス入口をカードで並べる: 学習（/learn）、決算定期便（/digest）、分析（/analysis）、企業を探す（/companies）、無料の分析体験（アンケート＆無料体験フォームへの外部リンク）。統計（掲載企業・業界分類・都道府県・出典件数・決算期数）は1行の帯に圧縮して入口の下に置く——数字そのものはサイトの実データから数える従来どおり（D10）で、見せ方だけを小さくする。
2. **企業ページのヒーローは「名前の重複を畳み、余白を詰める」**。法人名（officialName）は、法人格（株式会社・有限会社・合同会社）の前後付けを除くと会社名と同一になる場合は行として表示しない（同一でない場合は従来どおり表示する。データは変えない）。英字ワードマークは JCE-077 の方針をさらに進め、ラベルサイズ（最大1.5rem）に下げる。余白はモバイル側を中心に詰める（節の上下 padding もモバイルは py-10 に圧縮）。KeyFacts は規模だけの原則（不変条件4）を維持し、指標は増やさない。本文・データ・出典の内容と順序は変えない。
3. **企業ページ冒頭に「このページの内容」のアンカーナビを置く**。その企業に実際に存在する節（事業・モノとお金・ビジネスモデル・戦略と強み・つながり・財務・歴史・業界・出典）だけを、ヒーロー末尾に小さなリンク列として並べ、末尾に企業レポート（分析5観点）へのリンクを加える。節タブ（SectionTabs）はスクロール中の移動手段として従来どおり残し、役割を分ける（冒頭の目次＝何が載っているか、タブ＝移動）。
4. **有料βの受付導線は /learn に置く**。案内文は運営者の草案（有料β_案内文と特商法表記_草案.md）を土台に、価格（月1,100円・税込）、βで届くもの（決算定期便のメール配信と先行案内）、「学習機能は引き続き無料で使える」こと、「投資助言ではない」ことを正確に書く。決済は Stripe Payment Link への外部リンクとし、ANALYSIS_FEATURES_OPEN は変更しない（βはゲートなし運用・権利付与は手動、という既定どおり）。/analysis への重複掲載はしない（入口は /learn の1か所に集約し、定期便・レッスンの文脈で出す）。
5. **特定商取引法に基づく表記は百科事典側に /tokushoho を新設する**。事業者情報は診断サイト（shindan.kigyo-hyakka.com/tokushoho/）の既存表記と整合させる: 販売事業者 YUGENQ、運営統括責任者 LEO SUGIMOTO、メールアドレス yugenqjp@gmail.com、所在地・電話番号は「請求があった場合は、遅滞なく開示します」。価格・支払時期・解約・返金はβの条件（草案 §2）で書く。診断プラン（月390円）の表記は従来どおり診断サイト側にあり、本ページは学習サービス有料βの表記であることを明記して混同を避ける。利用規約の「プレミアムプラン」の節とサイトフッターから導線を張る。

**実装したこと**: src/app/page.tsx（ヒーロー刷新・サービス入口・統計の帯）、src/components/company/company-hero.tsx（余白圧縮・ワードマーク縮小・法人名の重複表示の整理・「このページの内容」ナビ）、src/components/company/company-view.tsx（目次の節一覧をヒーローへ受け渡し）、src/components/company/company-section.tsx（モバイルの節 padding 圧縮）、src/components/engagement/beta-offer.tsx（新規：/learn の有料β案内）、src/app/learn/page.tsx（β案内の配置）、src/app/tokushoho/page.tsx（新規：特定商取引法に基づく表記）、src/app/terms-of-use/page.tsx（β表記への導線）、src/components/navigation/site-footer.tsx（特商法表記リンク）、src/app/sitemap.ts（/tokushoho/ 追加）。

**やらないこと**: ANALYSIS_FEATURES_OPEN の変更、課金ゲートの実装、Stripe のアカウント設定変更、診断サイト側の表記・プランの変更、本文・データ・出典の内容変更、KeyFacts への指標追加。

## JCE-088 — 2026-11-22: 学習サービスのUIを Duolingo 型に刷新する（パス＋プレイヤー＋進捗の可視化＋配色の明転）

**背景**: 運営者の批判（2026-11-22）。現行 /learn は (1) 長いスクロールがストレス、(2) どれほど学べたか視覚化できない、(3) 色が淡白で暗く勉強意欲が湧かない。Duolingo のようなデザインと使い勝手を真似よ、との指示。設計の根拠は市場分析（Duolingo式学習UI/UXデザイン市場分析、2026-11-22）の判定表と P0/P1/P2 で、全面コピーではなく取捨選択が結論だった（パス・ノード状態・1画面1問・完了画面は採用、リーグ/ハート/ジェム/日次ストリークのゼロリセットは避ける）。

**設計判断**:
1. **学習ホームはパスにする**。縦スクロールのレッスン一覧（本文＋問題カードの羅列）を廃し、単元ごとの色バナー（単元名＋できること＋進捗バー）＋「読み方ノート」（Guidebook 相当：レッスン本文をノートとして開く）＋5ノードのパス表示にする。ノード状態は 未着手／次はここ／進行中（リング充填）／完了 の4種に、色だけでなくアイコン・番号・ラベルを併記する（色だけに頼らない）。「現在地へ戻る」フローティング導線を置く。復習キューは別節に埋めず、期日が来た問題があるときだけパスの先頭に復習ノードとして出す。
2. **レッスンはプレイヤーにする**。新ルート /learn/lesson/[lesson-id] と /learn/review で、1画面1ステップ（読む→予測する→即時フィードバック）にし、上部にステップ進捗バー、下部に固定CTA（未選択は無効→「こたえあわせ」→フィードバック後は「つぎへ」）。正誤フィードバックは下部シート形式で「なぜそうなるか（既存の解説）＋対象期間・出典の再提示＋企業ページへの導線」を出す。レッスン本文・クイズデータ（出典・期間つき）は JCE-082/084/085 の束ねをそのまま使う。
3. **完了画面を出す**。獲得ポイントの内訳、全体進捗の変化（リング＋単元 x/5）、次の行動1つだけを提示する。ポイント（分析ポイント）は正解数ではなく行動につける：回答+2／レッスン完了+10／復習の間隔段階+3×段階／予測の検証完了+20。ポイントは既存ストアと予測の照合結果からの導出であり、新しい保存形式は作らない（進捗ストア micro-lesson-progress、復習キュー、予測データの形式は不変更・移行なし）。
4. **進捗の可視化**。学習ホーム上部に全体進捗リング＋分析ポイント＋週の学習日数（週次リズム）と通算学習日数を置く。日次ストリークは置かない（ゼロリセットと罪悪感を避ける、分析の判定どおり）。訓練の記録には主指標（レッスン完了・答えた問題・検証を終えた予測・検証待ちの予測）と単元別バーを先頭に置き、既存の事実ベースの内訳（読み方の広がり・復習の定着・会社ごとの記録）はそのまま残す。総合スコア化・格付けはしない（JCE-083 を維持）。
5. **予測の状態をパス側に出す**。学習ホーム末尾に自分の予測の一覧を 検証待ち／検証済み／照合対象外 の状態チップで出す。検証は JCE-083 の導出のまま（結果は保存しない）。決算発表日そのものはサイトのデータに無いため捏造せず、「次の有価証券報告書の開示で照合されます」と状態だけを示す。
6. **配色は学習エリアだけ明転する**。/learn のパスとプレイヤーは白地ベースとし、紺は見出し文字に限定。CTA は緑1色（#3fa91c、下辺の濃色 #2e7d12 の4pxの影を持つ立体ボタン、押下で沈む）。単元色は3色（青 #1e9bf0／橙 #ed8f00／紫 #9b5de5）をバナー・ノード・バーにのみ使う。不正解の赤はフィードバックシート内だけに置き、ノードや進捗は赤くしない。サイト全体のテーマ（ダーク含む）は変更しない——学習エリアは両テーマで白地を保つ。
7. **やらないこと（分析の「避ける」判定）**: 週次リーグ・ランキング、ハート/Energy、ジェム等の通貨経済、ストリークのゼロリセットと罪悪感通知、ダミーノードで長く見せること、マスコットの新規制作（P2）。

**実装したこと**: src/lib/learning-ui.ts（新規：単元色・ポイント算定・ノード状態・週次リズムの純粋関数）、src/components/engagement/learn-ui.tsx（新規：進捗リングと立体ボタン）、src/components/engagement/micro-lessons.tsx（パス型ホームへ書き換え）、src/components/engagement/lesson-player.tsx（新規：レッスン／復習のプレイヤーと完了画面）、src/app/learn/lesson/[lesson-id]/page.tsx・src/app/learn/review/page.tsx（新規ルート）、src/app/learn/page.tsx（パスを冒頭へ、5ステップの導線をプレイヤーへ付け替え）、src/components/engagement/training-history.tsx（主指標と単元別バーを追加）、src/app/digest/page.tsx（レッスン導線のリンク先をプレイヤーへ）、tests/learning-ui.test.ts（新規）。

**やらないこと**: 12ステップコース（JCE-072）と今日の1問のプレイヤー化（今回はマイクロレッスンと復習に限る）、予測への決算発表日の表示（データが無いため）、アカウント基盤・保存形式の変更、サイト全体のテーマ変更。

**補足（2026-11-22）— 本番デプロイ失敗の修正**: マージ後の deploy-static（Run #11）が「Build the static export」で失敗した。原因は新規ルート /learn/lesson/[lesson-id] に generateStaticParams が無く、`output: "export"` の静的ビルドが動的セグメントを事前生成できなかったこと。修正: レッスンIDの一覧を単元スペックから導出する定数 `MICRO_LESSON_IDS` を src/lib/micro-lessons.ts に追加し（単一の出典とし、ページ側の手書きリストは持たない）、page.tsx がそれを読んで generateStaticParams を返す。tests/micro-lessons.test.ts に、ID一覧が buildMicroCourse の束ね結果と一致し15件であることを担保するテストを追加。あわせて全動的ルートを監査し、公開側で generateStaticParams を欠くのはこのルートのみであることを確認した（admin 配下の動的ルートは scripts/build-static.mjs の LEFT_OUT で静的書き出しから除外されるため対象外）。

## JCE-089 — 2026-11-22: 同意バナーを1行の帯に縮小する（詳細はプライバシーポリシーへ）

**背景**: 事業戦略レビューのデザイン分析の指摘。初回訪問では閲覧統計（Google アナリティクス）の同意バナーが画面の下半分（約45%）を覆い、最初の3秒で目に入るのがアナリティクスの説明文になっていた。百科事典の看板である「3秒で分かる」（CLAUDE.md の最重要UX指標）と正反対の初回体験になっている。

**設計判断**:
1. **バナーは1行の帯にする**。`AnalyticsConsent`（src/components/analytics/analytics-consent.tsx、JCE-056）の表示を、見出し＋説明段落＋ボタンの縦積みから、短い文とボタンを横に並べる細い帯（py-2.5、本文は text-xs/sm）に変える。スマホではボタンが2段目に折り返しても従来の約45%より大幅に小さい。
2. **詳細は既存の説明ページに逃がす**。送信される情報の内訳、同意 Cookie の1年保存と関連サイトとの共有、取り消し方法は、プライバシーポリシーの「Google アナリティクス（同意した場合のみ）」節（/privacy#google-analytics、JCE-036/JCE-056 でバナーと文言の一致が保たれている）に既に全文がある。帯には「詳しく見る」リンクを置き、説明をバナー側に複製しない。
3. **選択に必要な文言と操作は帯に残す**。「同意した場合にだけ統計を取る」「同意しなくても、すべての機能を使える」の2点は帯の文に残し、「同意する」「同意しない」の両ボタン（同じ saveConsent ハンドラ、同じ大きさのタップ領域 min-h-11）も帯の中で完結させる。同意の保存・撤回（フッターの「閲覧統計の設定」）、同意済みの利用者には表示しない挙動、GA の読み込み条件は一切変えない——変えるのはレイアウトと表示量だけである。

**実装したこと**: src/components/analytics/analytics-consent.tsx（AnalyticsConsent の JSX とコメントのみ。runtime・guard・プライバシーポリシー・テストの変更なし）。

**やらないこと**: 同意の仕組みそのものの変更（Cookie 名・保存期間・共有範囲）、プライバシーポリシーの文言変更、同意管理プラットフォームの導入。

## JCE-090 — 2026-11-22: 学習コースをつまずき起点に再構築する（Phase A：構造の読み方）

**背景**: 運営者の批判（2026-11-22）。学習内容は専門性は高いが有用性が感じられず、例えば「実際の数字はどっちでしょう」は数字が期末ごとに変わるので意味がない。有報のP/L表の読み方・貸借対照表の読み方など、顧客が一度つまずく課題を分析し、その上で学習データのフローを作ること。分析と設計は「学習つまずき分析とフロー設計_2026-11-22」（棚卸し：現行30問のうち数字当て型8問・構造理解型0問、P/Lの中間段階とB/S項目が皆無）に基づく。本回は設計の Phase A（既存データで作れる範囲）だけを実装する。

**設計判断**:
1. **問うのは値ではなく読み方**。答えが項目名・区分・並び順・手順・理由・関係である問いを基本形とする。実在の会社の数字は「値当て」ではなく「実物で確かめる」素材として、表の抜粋（項目探し・関係の読み・地域別情報）の中に印字値のまま載せる。期末が変わっても壊れない問いだけを置く。
2. **単元は解消順序の6単元・27レッスン**。①利益は5つある（P/Lの骨格）②最終利益が動く理由 ③連結という物差し ④B/Sは一時点の写真 ⑤2つの表はつながっている ⑥実物で読む（有報の地図と予測）。1レッスンは原則「構造1問＋実物1問」の2問。旧3単元・15レッスンは置き換える。
3. **問いには3つの出どころがある**。(a) 生成（src/lib/lesson-questions.ts）：実在の会社の印字値と会社自身のラベルから作る。出典・期間は従来どおり全問に保持する。(b) 著述（src/lib/structure-questions.ts 新規）：会社を特定しない構造問題（並べ替え・差の内訳・区分判定・手順・概念）。会社の事実を述べないため企業の引用は持たず、sourceTitle に一般的な根拠（表示の決まり）を名指し、companyId は null、period は空とする。JCE-085 の「全問に引用と期間」は、数字を持つ問いについての規則として維持する。(c) プール（JCE-052）：事業同定（describe）だけを仕上げ単元の手がかり素材として残す。比較プールの他の種別は束ねない（12ステップコースと今日の1問は不変更）。
4. **新形式は2つだけ足す**。並べ替え型（format: "order"、項目をタップして表の順に並べる。保存される回答は並びの id を "," でつないだ文字列で、既存の回答形式と同形）と、表の抜粋の表示（table フィールド）。差の内訳・区分判定・ラベル読み・手順・関係の読みは、既存の1画面1選択のステップのまま実装する。プレイヤーのステップ表示・フィードバック・完了画面の仕組みは壊さない。
5. **方向予測は手がかり付きでのみ置く**。手がかりはデータから作る（最大の事業とその割合、または同じ数字のその前の年の動き。いずれも計算値と明示）。手がかりが作れない会社には方向問題を出さない。レッスン単独の二択は廃し、予測の記録は従来どおり企業ページの予測機能（JCE-083）に残す。
6. **既存30問の処遇は設計どおり**。残す3問：segment-top（生成を維持し単元1へ）、describe 2問（単元6の仕上げへ再配置）。作り替える：figure→項目探し、employees（値）→手順（著述）、overseas-ratio→地域別の項目探し、quarterly-progress→手順（著述）、会社間比較→関係の読み、方向予測→手がかり付き予測。捨てる2問：shares（発行済株式総数の値当て）。生成器からは figure / shares / employees / overseas-ratio / quarterly-progress の5種別を削除した。
7. **設計との差分（実装側の判断として記録）**。(a) 単元1レッスン5「2社の段階利益を並べる」は、段階利益の揃った2社の組を生成で保証できないため、実物問いを「1社・2期の段階の関係の読み＋事業別情報」に置き換えた（読む技能は同じ）。(b) 仕上げレッスンは describe 2問＋手がかり付き予測2問の4問とし、所要時間を6分とした（2問構成の例外はこの1レッスンだけ）。(c) 従業員数の方向（growth-employees）は単元3「連結と単体」に置いた——従業員数にも連結と提出会社の2種類があることが P7 の読みそのものだからである。
8. **進捗データは形式不変更・移行なし**。レッスンID・問題IDが変わるため、旧コースの回答・完了・復習予定は新しいコースに引き継がれない。ただし保存の検証（src/lib/storage/stores.ts）は ID を知らない形で書かれており、未知の ID が残っても例外にはならない：パス・記録・復習は現在のコースの問題だけを引いて表示し、復習キューの期限切れ ID はプレイヤー側で除外される。ポイントは「行った行為の通算」という JCE-088 の定義のまま、保存済みの回答・完了の件数から導出する（旧コースで答えた分も行為としては残る）。

**Phase B として残すもの（今回は実装しない）**: P/L全文の段階（売上総利益・営業利益の年次値、営業外・特別損益・法人税等の内訳）と B/S の内訳（流動／固定の金額、主要項目、借入金の内訳）を実データで扱う演習。これらは登録データ側に項目の取り込みが必要で、データ側の判断とセットで進める。Phase A の単元4・5では、金額の演習の代わりに区分・手順・概念の構造問題で読み方を教える。

**実装したこと**: src/lib/lesson-questions.ts（生成種別の入替：find-row / relation-stages / relation-net-assets / label-reading / region-find を追加、値当ての5種別を削除、方向問題への clue 付与と「手がかり無しは出題しない」ガード）、src/lib/structure-questions.ts（著述の構造問題35問）、src/lib/micro-lessons.ts（MicroQuestion に format・table を追加し companyId を null 可に、6単元27レッスンの仕様と著述スロットの束ね、MICRO_LESSON_IDS は27件を仕様から導出）、src/components/engagement/lesson-player.tsx（並べ替えUI、表の表示、企業リンクの条件化、ステップ見出しの出し分け）、src/components/engagement/training-history.tsx（新種別のラベル、会社に属さない問題の扱い）、src/lib/learning-ui.ts（単元色は3色を単元順に繰り返す旨の注記）、src/lib/digest.ts・src/lib/digest-email.ts（読み方導線のアンカーとラベルを新単元へ）、src/app/learn/page.tsx・src/app/digest/page.tsx（STEP 1 の導線を仕上げレッスンへ）、tests/micro-lessons.test.ts（生成・束ね・引用の担保を新コースに合わせて再構成）。

**やらないこと**: Phase B のデータ拡張と演習、12ステップコース（JCE-072）と今日の1問の変更、進捗ストア・復習キュー・予測の保存形式の変更、課金・プラン連携、総合スコア・格付け、投資助言、株価系指標の出題。

## JCE-091 — 2026-11-22: レッスンに「学ぶ」パートを組み込む（問いの前に、教える）

**背景**: 運営者が JCE-090 の新コースを実際に受けた感想。「先に学習がないために、急に問題に飛んでしまうと混乱する。1回の内容を充実させよう」。当時のレッスンは本文2段落の直後に問いが来る構成で、概念の説明も実物を読む手ほどきも不足していた。問いの作り替えはしない（JCE-090 の形式と順序が前提）——足りないのは、問いの前にある学習の量と順序である。

**設計判断**:
1. **1レッスンの流れを4部に統一する**。(1) つまずきの提示：そのレッスンが解く「読めなくなる瞬間」を1〜2文で具体的に示す。(2) 概念の説明：既存の本文に、表の形の段階図（著述の図表、項目と区分だけ・金額なし）を添える。(3) 実物で一緒に読む：束ねられた問いの表の抜粋を、誘導文と出典・期間つきで先に一緒に読む。(4) 問い：JCE-090 の問いをそのまま。プレイヤーのステップ見出しは「つまずく場所／読む／表の形／実物で、一緒に読む」と出し分ける。
2. **著述コンテンツは src/lib/lesson-guide.ts に分離する**（structure-questions.ts と同じ分担）。レッスン仕様（micro-lessons.ts）は問いスロットの定義のままにし、束ねのときにレッスンIDで合成する。ガイドの無いレッスンは存在しないことをテストで担保する（LESSON_GUIDES のキーが MICRO_LESSON_IDS と一致）。
3. **一緒に読む表は、原則として束ねられた問い自身の表を使う**。新しい数字は作らない。誘導文は「どこを見るか」を教えるもので、問いの答えの行を名指ししない。問いに表が無いレッスンでは、様式そのものの著述抜粋（left-and-right の区分と主な項目）か、文章だけの誘導にし、guideCite は問い由来の表にだけ付ける。例外が1件ある：shades-of-red（赤字の段階）は、束ねられる項目探しの抜粋が貸借対照表の要約になる場合があり（どちらのバリアントが束ねられるかはデータ側で決まる）、符号と段階の誘導と合わないため、表の引き継ぎをしない（liftGuideTable: false）。
4. **所要時間は実態に合わせて更新する**。学ぶパートでステップは従来の4から7〜9（仕上げは9）になるため、表示は全レッスン5〜7分（仕上げ7分）にした。進捗の保存形式・復習キュー・ポイントの仕組みは不変更で、MicroLesson への追加フィールドはすべて任意（既存の構築箇所を壊さない）。

**実装したこと**: src/lib/lesson-guide.ts（新規：27レッスン分のつまずき提示・段階図21件・誘導文・所要時間）、src/lib/micro-lessons.ts（MicroLesson に stumble / diagram / guide / guideTable / guideCite を追加し、束ねで合成。guideTable は問いの表を優先し、著述抜粋にフォールバック）、src/components/engagement/lesson-player.tsx（読むステップの種別と見出し、表と出典の表示、表描画を ExcerptTable に共通化——問い側の表示は従来どおり）、tests/micro-lessons.test.ts（JCE-091 の担保：全27レッスンの学ぶパート、ガイドのカバー範囲、表の引き継ぎとフォールバック、段階図が金額を持たないこと、所要時間）。

**実測**: 実データで束ねた全27レッスンで、つまずき提示・本文2段落・誘導文2段落が入っていることを確認した。ステップ数は7〜9（従来4）。一緒に読む表は11レッスンが問いの実表、1レッスンが著述抜粋、残りは文章の誘導のみ。段階図は21レッスン。

**やらないこと**: 問い自体の作り替え・順序変更、Phase B のデータ拡張、進捗ストア・復習キューの形式変更、12ステップコースと今日の1問の変更。

## JCE-092 — 2026-11-22: 学習 Phase B（P/L全文・B/S内訳の実データ演習と、そのためのデータ層）

**背景**: JCE-090 で残した Phase B。運営者が 2026-11-22 に「Phase B もどんどん進めて」と決定した。Phase A の単元1②・単元2・単元4④⑤・単元5④⑤は、P/L全文の段階と B/S の内訳を実データで扱う演習がデータ不足で未実装だった（設計書「学習つまずき分析とフロー設計_2026-11-22」§3.3・§3.4）。本回はデータ層の拡張と、実データが揃った範囲の演習を実装する。

**設計判断**:
1. **データは新しい任意フィールド `financialStatements` に足す**。会社エントリに、連結の損益計算書と貸借対照表を「行の並び」のまま持つレコード（年度ごと）を追加する。各行は、会社自身の印字ラベル（label）、印字値（amount、円）、そして表の中での役割（role：売上原価・売上総利益・販管費内訳・特別損失内訳・流動負債の借入行、など閉じた集合）を持つ。既存の `financials`（5期表の抜粋）・企業ページの表示・既存のレッスンは一切変えない。計算値は従来どおり保存しない——保存するのは印字値だけであり、割合や合計はページ／問題の側で計算し「計算値」と明示する。
2. **値の出所は、その会社の有報（EDINET）の XBRL だけ**。対象会社のエントリの `sources` にある有価証券報告書の XBRL（CSV変換）から機械的に読み取り、同じ書類の既存レコード（financials の売上・経常利益・純利益・総資産・純資産）と全件照合して一致した年度だけを採用する。段階の足し算（売上−原価＝粗利、など）も検算する。照合できない項目・年度は入れない（欠落のまま）。Wikipedia や集約サイトは使わない。取り込みは scripts/research/statement-details.mjs が行い、会社ごとに改訂記録（Revision）を残す（JCE-049 の四半期追加と同じ作法）。
3. **対象は5社に絞る**。現行レッスンが束ねる会社と Phase B の演習が要る項目を持つ会社から、日本基準で開示の揃う5社（ミスミグループ本社・大東建託・京阪ホールディングス・しまむら・SCREENホールディングス）を選んだ。全社には広げない——演習は「どの会社の表でも読める」技能を教えるもので、出題は各レッスン1問ずつであり、束ねに必要なのは項目の揃った数社分で足りる。広げるかどうかは、演習の使われ方を見て別途決める。なおイオンとセブン＆アイ・ホールディングスは当初候補だったが、両社の「営業収益」様式は金融サービス事業の営業収益・営業原価など会社固有の要素に依存し、XBRL（CSV）にその印字ラベルが載らない行があるため、ラベルを推測で作らない原則（不変条件1）により今回は対象から外した。
4. **演習は6種別を生成に追加する**（src/lib/lesson-questions.ts）。detail-sga（販管費の内訳を読む）、detail-special（特別損益の内訳を読む）、detail-working-capital（流動資産の抜粋で「まだ現金でない資産」の組を読む）、detail-borrowings（流動・固定に分かれた借入と社債の行を全部数える。合計は解説で計算値として示す）、detail-goodwill（無形固定資産の内訳を読む）、detail-depreciation（有形固定資産の取得価額・減価償却累計額・純額の3行を読む）。いずれも表の抜粋を印字値のまま見せ、答えは項目名・行の組・関係であり、値の暗記は問わない（JCE-090 の原則どおり）。出典・期間は全問に保持する（JCE-085）。
5. **レッスンへの組み込みは、設計が Phase B と名指した6レッスンに限る**。単元1②（gross-vs-operating）と単元2①（special-items-gap）は既存2問の後ろに実物（金額）の問いを1問足して3問にする。単元4④（assets-not-cash）・4⑤（find-all-borrowings）・単元5④（invisible-assets）・5⑤（book-value）も同様に、著述2問＋実物1問の3問にする。これは「1レッスン2問」原則の2つ目の例外であり（1つ目は単元6の仕上げ）、理由はこの6レッスンだけが「概念は著述で教えられるが、金額の読みは実物でしか練習できない」ためである。他のレッスンは変えない。所要時間は該当レッスンのみ6分→7分に更新する。
6. **進捗データは形式不変更**（JCE-088/090/091 と同じ）。新しい問題IDが増えるだけで、保存・復習・ポイントの仕組みは変えない。未知IDの安全な扱いも従来どおり。

**Phase B でも残るもの（今回は実装しない）**: 減価償却の「注記レベル」の演習のうち、有形固定資産等明細表（附属明細表）の期中増減を読む演習は、XBRL（CSV）に明細表の増減がタグ付けされないため対象外にした（貸借対照表に印字される取得価額・累計額・純額の読みは実装する）。対象5社以外の会社への financialStatements の展開。IFRS・米国基準の会社の全文（経常利益・特別損益の区分がなく、演習の前提が違うため、日本基準の会社から始める）。

**実装したこと**: src/types/company.ts（StatementRole / StatementLine / FinancialStatements と Company.financialStatements）、src/lib/content/schemas.ts（同スキーマ）、scripts/research/statement-details.mjs（EDINET XBRL からの取り込みと照合）、対象5社のデータと改訂記録、src/lib/content/integrity.ts（financialStatements の担保：出典の解決・年度の重複・金額の単位と、financials との照合。tests/data-integrity.test.ts が全社に対して実行する）、src/lib/lesson-questions.ts（生成6種別）、src/lib/micro-lessons.ts（6レッスンへのスロット追加）、src/lib/lesson-guide.ts（該当レッスンの誘導文と所要時間の更新）、src/components/engagement/training-history.tsx（新種別のラベル）、tests/micro-lessons.test.ts（Phase B の担保）。

**やらないこと**: 企業ページへの全文表示の追加、既存レッスンの問いの作り替え、進捗ストアの形式変更、株価系指標の出題、対象社の拡大。

## JCE-093 — 2026-11-23: ID基盤（Phase 0）— 全エントリーへ EDINETコードと法人番号を付ける

**背景**: データ基盤クラウドシステム化スキーム（2026-11-23）の Phase 0。エントリーの企業同定は証券コードと社名しかなく、証券コードの変更・商号変更をまたいで書類を機械的に結ぶ鍵がなかった。企業マスタ（pipeline/listing.tsv、sync-listing.mjs）はすでに EDINETコードと法人番号を持つが、エントリー側に対応がなかった。本回はその対応をエントリーに刻む。

**設計判断**:
1. **値は金融庁の EDINET コードリストだけから写す**。突合の鍵は証券コード（企業マスタと同じ方式）。名称での突合はしない——同名の別法人が実在し、名称は表記ゆれも大きい。リストが上場提出者として証券コードで引けない会社には付けない（推測で埋めない、不変条件1）。値の正しさは「公式リストの行をそのまま写したこと」にあり、付与は scripts/pipeline/assign-identity-codes.mjs が冪等に行う（既存値と違う値が来たら競合として止め、人が確認するまで書き換えない）。
2. **フィールドは任意（optional）**。`edinetCode`（E＋5桁）と `corporateNumber`（13桁）を `code` の直後に置く。付けられない会社がある以上、必須にはできない。形式と一意性（一つの EDINETコード・法人番号を2社が持たない）は tests/data-integrity.test.ts が担保する。
3. **`updatedAt` は変えない、会社ごとの改訂記録も作らない**。これは内容の編集ではなく公式リスト由来の同定情報の付与であり、現時点でどのページにも表示されない。記録は本決裁と、付与スクリプトが出す pipeline/identity-codes-report.md が担う（sync-listing が台帳同期を要約で記録する作法と同じ）。
4. **実測（コードリスト 2026-11-22 現在、エントリー 3,900社）**: 証券コードで突合し両コードを付与できたのは **3,704社**（全社とも法人番号まで揃った）。突合できなかった **196社**の内訳は、上場廃止でリストに非上場として残り証券コードを持たない会社が189社、同名行が複数あり同定できない会社が1社（テクノプロ・ホールディングス）、上場提出者としての行がない会社が2社、コードでも名称でも該当行がない会社が4社。詳細はレポートに全社分を記録した。これらの会社への付与は、企業マスタ側の履歴（上場廃止の確定情報）と合わせて別途判断する。
5. **名称の表記差異が46社**あった（コードでは突合し付与済み）。大半は商号変更をエントリーかリストのどちらかが未反映のものと、旧字体・称号などの表記差異であり、レポートに全件を挙げた。エントリーの商号そのものの追随は登録パイプライン側の仕事として切り分ける。

**Phase 0 で残るもの（今回は実装しない）**: 企業マスタの履歴テーブルとの突合の常時化（sync-listing の historyLines は既にある。エントリー側のコード変更・社名変更への追随は Phase 4 の適用自動化で扱う）。未突合196社への付与判断。EDINETコード・法人番号の企業ページへの表示（鮮度表示と合わせて Phase 5）。

**実装したこと**: src/types/company.ts（Company.edinetCode / corporateNumber）、src/lib/content/schemas.ts（同スキーマ）、scripts/pipeline/assign-identity-codes.mjs（コードリストからの突合・付与・レポート。sync-listing.mjs のパーサと台帳化を再利用し、書き込み前に ownership の assertMachineWrite で検査する）、対象3,704社のデータ、pipeline/identity-codes-report.md（未突合196社と名称差異46社の全件記録）、tests/data-integrity.test.ts（形式の担保を identity fields の検査へ追加、EDINETコードと法人番号の一意性の検査を新設）、scripts/pipeline/ownership.mjs（新2フィールドを facts 層へ登録。あわせて JCE-092 で追加された financialStatements の登録漏れも同じ層へ登録した——プログラムが有報から抽出して書き込む事実データであり、自動書き込みの検査が正しく通るためにも facts が正しい置き場所である）。

**やらないこと**: 未突合の会社への名称突合での付与、企業ページへの表示追加、企業マスタ（listing.tsv）の作り替え、証券コード自体の変更への追随。

## JCE-094 — 2026-11-23: 企業ページ再設計（スマホ第一・3層構造）

**背景**: 運営者の指摘「サービスのUIはまだ悪い。必要な情報と必要ではない情報が入り混じっている。ユーザーは基本スマホ」。市場UI/UX分析（2026-11-23、バフェットコード・IRBANK・EDINET DB 等8サービス）§3-1 の適用案を実施する。問題は3点だった：ファーストビューに規模がない（売上・純利益・従業員数が第5セクションまで出てこない）、事業説明が3か所（構造カード／5ステップ／業界位置）に重複する、第5セクション（財務）に最新数字・四半期・比較の目安・業界比較・深掘り・表・CSV が同居する。表示層のみの変更で、データ（src/data）・進捗保存形式には触らない。事実・数値は落とさない（再配置と段階開示であり、削除は重複説明の統合だけ）。

**設計判断**:
1. **ファーストビューを固定型にする**。会社名＋一言説明＋規模3点（KeyFacts、従来からヒーロー内）＋出典バッジ＋主要導線3ボタン（つながりを見る／数字の推移／この会社で学ぶ）。規模の出典は、折り畳みの「出典を見る」からバッジ（書類名＋最終確認日、末尾の出典一覧の該当項目へのアンカー）に変えた。ボタンはセクションへのアンカーで、スマホでは SectionTabs が該当タブを開く（ハッシュ追従の既存の仕組み）。
2. **3層に再編する**。L1 要約＝ヒーロー＋つながりの冒頭（総件数・種類別内訳・主な3件を相手企業へのチップで）。L2 詳細＝つながり全件、学ぶ、事業、モノとお金、戦略と強み、財務の最新数字と5期グラフ、歴史、業界。L3 専門家向け＝5期の表・CSV（従来どおり FinancialSection 内で折り畳み）、四半期の動き（推移の中に折り畳み）、業界比較と財務の深掘り、出典の全件。
3. **つながりを第2セクションへ前倒しする**（従来は事業・モノとお金・ビジネスモデル・戦略の後）。分析訓練（予測／照合、JCE-083）は財務の末尾から独立した「学ぶ」セクションにし、つながりの直後に置く。企業ページ自体を訓練の入口にする。予測パネルの `id="prediction"` は維持し、既存の導線（定期便の照合リンク等）はそのまま効く。
4. **事業説明の重複を統合する**。「モノとお金の流れ」（バリューチェーン図）と「つくって、届けて、売上になるまで」（5ステップ）は別セクションで同じ事業を2度説明していたため、1セクション（モノとお金の流れ）に統合し、5ステップは小見出しの下に置いた。タブ・目次から「ビジネスモデル」の独立項目は消える。
5. **旧・第5セクション（財務）を解体する**。最新数字と前期比（FinancialSummaryRow）と5期グラフ・売上の内訳（FinancialSection）を先頭に開いたまま置き、四半期の動きは `<details>` で推移の中に畳む。比較の目安（CompanyMetrics）は単独表示をやめ、業界比較ブロックの中の1項目に畳む（業界比較が無い会社では従来どおり単独で出す）。帰結として、PremiumGate が閉じている読者には比較の目安も閉じる——比較の一部として扱う判断であり、ゲート自体の開閉方針（JCE-075）は変えていない。
6. **出典は末尾の一覧に一本化する**。SourceList に `variant="refs"` を追加し、企業ページ内の各セクションの出典表示を「出典 [n]（出典一覧へのリンク）」の番号参照に替えた。番号とアンカー（`source-<id>`）は SourceIndex の並びと一致する。例外は2つ：ほかの会社の項目に書かれた関係（inbound）の出典は、その会社の出典でありこのページの一覧に無いため、従来どおりその場に全文を残す。業界ページ・用語集・特集など企業ページ以外での SourceList は従来どおり。出典拘束（不変条件2）は弱めていない——全ての事実から出典へ辿れることは、バッジと番号参照でむしろ常時見える形にした。
7. **目次とタブ（JCE-087）は新しい構成順に更新する**。並びは つながり／学ぶ／事業／モノとお金／戦略と強み／財務／歴史／業界／出典。スマホではこの順がそのままタブの順になる。

**実装したこと**: src/components/company/company-view.tsx（セクション順の再編、つながりのL1要約、学ぶセクション新設、財務の内部再編）、company-hero.tsx（導線3ボタン、hasConnections の受け渡し）、key-facts.tsx（出典バッジ）、source-index.tsx（各項目へのアンカー）、src/components/sources/source-list.tsx（variant="refs"）、business-list.tsx / business-model.tsx / financial-section.tsx / quarterly-section.tsx / company-metrics.tsx / history-timeline.tsx / perspectives-section.tsx / related-companies.tsx（出典表示の参照化。related-companies は自社の関係のみ参照化し inbound は全文のまま）。

**やらないこと**: ホームの再設計（分析 §3-2）と学習の双方向リンク（§3-3）は次段。企業レポート（/report）の体裁、データ・スキーマの変更、有料境界そのものの変更。

## JCE-095 — 2026-11-23: 検証のラベル照合 — 有報が「又は…（△）」を落とした短縮表記を同一行として扱う

**背景**: refresh-financials が 2026-11-21 から3日連続で失敗した。原因はクラウディアホールディングス（3607）1社で、取得の失敗ではなく検証（verify-financials）のラベル照合だった。同社の第50期有報（docID S100ZIVB、2026-11-20 提出）の「主要な経営指標等の推移」は、行ラベルを短縮形で印字する——「経常利益」「親会社株主に帰属する当期純利益」。登録済みラベルは出典である第49期有報の表記「経常利益又は経常損失（△）」「親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）」であり、検証が完全一致を求めるため、2022〜2025年8月期の8件（純利益4件・利益4件）が落ちた。行の並びと値は従来どおりで、過去年度の値も登録済みと一致している（probe で実ラベルを確認済み）。

**設計判断**:
1. **直すのは検証側の照合だけ**。登録済みラベルは出典有報の表記そのものであり、正しく記録されているため書き換えない。エントリデータにも触らない。
2. **許す差異は末尾の選択肢サフィックスだけに限定する**。照合時に、ラベルの末尾が「又は」で始まり「（△）」で終わる部分を取り除いた形でも照合し、それで一致すれば同一行として扱う。それ以外の表記差異（サフィックスが末尾にない、（△）で終わらない、行そのものが違う）は従来どおり失敗させる。任意の表記ゆれを許す緩い照合にはしない。
3. **照合箇所は2か所とも同じ規則にする**。売上・純利益のラベル照合と、利益・総資産・純資産の表示ラベル照合の両方に同じ `labelIsPrinted` を使う。

**実装したこと**: scripts/research/verify-financials.mjs（`labelIsPrinted` を追加し、ラベル照合2か所を置き換え）、tests/verify-financials.test.ts（新規：フィクスチャの証拠パックでスクリプトを実走させ、短縮形の受理・全文形の受理・（△）なし選択肢の拒否・別行の拒否・末尾でないサフィックスの拒否を担保）。

**実測**: 修正前 dry run（refresh-financials kuraudia-holdings）は8件のラベル不一致で失敗（exit 1）。修正後は would-update（2026年8月期を追加）・失敗0件（exit 0）。単体テスト5件全通過。

**やらないこと**: 登録済みラベルの書き換え、抽出側（draft-entry）の変更、サフィックス以外の表記ゆれの許容。

## JCE-096 — 2026-11-23: 分析SaaS Phase 1 — 分解系モジュール9件を5観点分析の計算レイヤーに追加する

**背景**: 運営者が Notion に作成した「分析システム提案の計算式評価と完全版仕様」（マクロ分析手法を企業単位に縮小する分解系モジュール群）を、JCE-081 の5観点分析へ組み込む。組み込みスキームは goal 文書「分析SaaS組み込みスキーム_2026-11-23」に定めた。既存の2段構成（report-metrics.ts の計算レイヤー → company-analysis.ts の5観点）は維持し、分解は構造が違う（複数行のグループ＋内訳の合計が親と一致する）ため report-metrics の DEFS には混ぜず、新規ファイル `src/lib/analysis-decomposition.ts` に式レジストリ（軽量版：id・version・観点・種別・表示条件・非表示理由を持つ定義配列）と純粋関数として実装する。結果は保存しない（静的生成時に計算する。現行構成ではこれが仕様の「保存済み結果を読む」の等価物）。

**解禁決定（運営者、2026-11-23）**: D1（純資産利益率・増分ROE）と F1（DuPont 分解）は ROE を中核とするため、当初は不変条件4との衝突として保留した。運営者は「分析レイヤーに限り計算値として解禁する」と決定した。すなわち、5観点分析とレポートの計算レイヤーに限り、印字値から計算する ROE 近似指標（仕様の名称「純資産利益率（ROEの近似）」）を「計算値」と明記して表示してよい。本文側（企業ページ本文・KeyFacts 等）での ROE・ROA 等の禁止は従来どおり維持し、不変条件4の本文は書き換えない。本決定はその解釈の記録である。

**設計判断**:
1. **フェーズ1の対象は9モジュール**。A1 増益分解（Bennet 中点型、利益行＋純利益ブリッジ）、A2 業界成長への寄与度（leave-one-out）、B1 純資産の増減分解、C1 資産増減の調達内訳、E1 トレンド乖離（前4期 Theil–Sen 外挿）、F2 利益率の安定性、F3 成長の資産効率、D1 純資産利益率（解禁により追加）、F1 DuPont 3要因＋ΔROE の Shapley 分解。A3 はフェーズ1.5、A-full・B2・C2・D2 と asFiledIn はフェーズ2、E の状態空間モデル化はフェーズ3に残す。
2. **観点への配置**。A1→成長・収益性、A2→規模と地位、B1・C1→財務の安定、E1・F3→成長、F2・D1・F1→収益性。B1 は既存の「純資産の前期比」行を置き換える（前期比は B1 グループ内の行として内包する）。
3. **出せない指標は行ごと出さない**。非表示（suppressed）の理由文言はレジストリに保持し、テストと管理側でのみ使う。読者画面には出さない（現行レイヤーの流儀）。計算できない会社・期は埋めない。
4. **共通の表示条件**。金融業（主たる産業が finance）は A1・C1 の対象外。会計基準・revenueBasis が異なる期の組は増減を計算しない。決算期変更（12か月未満）は、レコードに期間の月数を持たないため、連続する periodEnd の間隔が340日未満の期を短期間として増減・トレンドの対象から外す（決定論的な代理判定としてここに明記する）。前期比で売上高または総資産が±30%を超える場合は、その旨の注記をグループに併記する。
5. **D1 の定義**。本体は期間合計の比（pooled）＝5期の当期純利益の合計 ÷ 5期の純資産の合計を主表示とし、各期の純利益÷純資産（期末）の標準偏差を併記する。増分は仕様どおり3年・1年ラグ付き iROE = (NI₅−NI₂)÷(E₄−E₁) とし、分母が正で、かつ期首純資産の5%以上ある場合だけ出す。純資産が全期正でない会社、会計基準が5期で一貫しない会社は対象外。
6. **F1 の定義**。ROE は平均純資産ベース（当期純利益 ÷ 前期末と最新期末の平均純資産）とし、利益率×総資産回転率×財務レバレッジに分解する。前期との差は3要因の Shapley 分解（6通りの順序の平均）で分け、内訳の合計は差と一致する。
7. **E1 は「推計値」**。AnalysisRow.kind に "estimated" を追加し、専用バッジで出す。当てはめは前4期だけで行い最新期は含めない。「簡易推計（4期、外挿）」を注記に明記し、4年CAGR（計算値）を併記する。
8. **asFiledIn はフェーズ1では代替する**。仕様の最重要前処理（同一有報の前期欄での増減）は現行データモデルに値ごとの提出書類 ID が無く保証できないため、既存の比較可能性ルール（同一会計基準・同一 revenueBasis、JCE-047）で代替し、保証できない旨をここに記録する。導入はフェーズ2のデータモデル課題。
9. **有料境界は変えない**。分解グループも既存行と同じ扱い（自社の値＋業界中央値は無料部、分布の全体像は AnalysisGate の内側）。ANALYSIS_FEATURES_OPEN は変更しない。A2 の集中度（HHI）等の集計詳細はグループ注記として有料側にだけ出す。

**実装したこと**: src/lib/analysis-decomposition.ts（新規：式レジストリと9モジュールの純粋関数、suppressed 理由の保持）、src/lib/company-analysis.ts（AnalysisRow.kind に "estimated" を追加、AnalysisPerspective.groups を追加、B1 への置き換えに伴い単独の純資産前期比行を撤去）、src/components/company/company-analysis.tsx（グループ表示、推計値バッジ、points 単位の書式）、tests/analysis-decomposition.test.ts（新規：ミスミの印字値からの手計算ゴールデン、性質テスト、表示条件テスト、実データ突合）、tests/company-analysis.test.ts（B1 グループ前提へ更新）。

**実測（全社計算、公開2,993社・全社に financials あり）**: 表示社数は A1 2,775社／A2 2,929社／B1 2,938社／C1 2,788社／E1 2,196社／F2 2,740社／F3 2,935社／D1 2,731社／F1 2,873社。非表示率は最大で E1 の26.6%（5期一貫性と ±30% 超の変動を含む系列の除外による）で、全モジュールがスキームの撤退条件（非表示率30%超）以内に収まったため、閾値は30%／突合5%のまま JCE-096 の条件として固定する。

**やらないこと**: 不変条件4の本文の書き換え、本文側への ROE 型指標の表示、結果の保存（静的生成時に計算する）、ANALYSIS_FEATURES_OPEN の変更、asFiledIn の導入（フェーズ2）。

## JCE-097 — 2026-11-23: 分析SaaS Phase 1.5 — A3 セグメント寄与（前期セグメント売上の登録と寄与度分解）

**背景**: JCE-096 でフェーズ1.5に残した A3（セグメント寄与分解）は、segmentRevenue が最新期のみで前期比較情報がなく増減が取れないことが前提条件だった。実測（2026-11-23）で、最新有報の XBRL（CSV）にはセグメント別の外部顧客への売上高が当期（CurrentYearDuration）と前期（Prior1YearDuration）の両コンテキストでタグ付けされており、現行の抽出（segment-revenue.mjs）がそのまま前期にも使えることを確認した。キャッシュ済みの実有報7社すべてで前期セグメントが抽出でき、事業への対応付けと前期の印字売上高への突合が通った。増減を同一有報の前期欄で取るため、JCE-096 でフェーズ2送りにした asFiledIn の考え方を、このモジュールに限って先行して満たす。

**設計判断**:
1. **データモデル**: `SegmentRevenue` に任意の `previous`（fiscalYear・periodEnd・items）を追加する。前期値も同じ有報の同じ注記の前期欄の印字値であり、出典（sourceIds・locator・label）は当期のブロックと共有する。別ブロックにしないのは、前期だけが独立に存在する状態（当期が落ちたのに前期だけ残る）を作らないため。
2. **前期レコードの同定**: 前期として紐づける財務レコードは、セグメント年度の直前のレコードで、periodEnd の間隔が340日以上400日以内（通常の12か月期）のものだけとする。間隔がこの範囲を外れる組（年度の欠落、決算期変更の前後）は前期を付けない。決算期変更の判定に期間の月数ではなく間隔を使うのは JCE-096 の代理判定と同旨。
3. **前期ブロックの採否は全か無か**。有報自身の合計と合わない、前期のセグメント名が事業に対応付かない、前期セグメントの合計が前期の印字売上高を超える場合は、前期ブロック自体を付けない（一部のセグメントだけの前期は作らない。当期ブロックの採否ルールと同じ）。
4. **A3 の表示**: 主表示は寄与度（pt）＝セグメントの売上増減 ÷ 前期の全社売上高とし、寄与率（ΔR_seg ÷ ΔR）は使わない（完全版仕様どおり）。両期に共通する事業についてだけ増減を取り、片方の期にしかない事業（新設・廃止・改称で対応付かないもの）の金額は調整額に含める。調整額（全社売上の増減 − 共通事業の増減の合計）は独立行で出し、セグメント側へ配分しない。共通事業が2未満の会社はモジュール自体を出さない。
5. **配置と境界**: A3 は観点2「成長」に置く。行の業界分布は付けない（事業の対応が会社ごとに異なり、分布に意味がないため）。有料境界と ANALYSIS_FEATURES_OPEN は変更しない。
6. **登録経路**: evidence-pack が segmentPriorFacts（前期の事実）も作り、draft-entry → merge-fragments／refresh-financials が当期ブロックに previous を付ける。既登録の1,755社は backfill-segment-prior.mjs で、エントリが既に引用している同じ有報から前期だけを足す（新しい有報へは進めない。それは refresh-financials の仕事）。

**実装したこと**: src/types/company.ts・src/lib/content/schemas.ts（SegmentRevenue.previous の追加）、src/lib/content/integrity.ts（前期の重複・最上位事業・金額・財務レコードとの一致チェック）、scripts/pipeline/segment-revenue.mjs（segmentRevenueFacts／namedSegmentFacts への期間パラメータ、segmentRevenuePreviousBlock と priorRecordFor の新設）、scripts/research/evidence-pack.mjs・draft-entry.mjs（segmentPriorFacts の生成と受け渡し）、scripts/pipeline/merge-fragments.mjs・refresh-financials.mjs（当期ブロックへの previous の付加と、保持時の前期チェック）、scripts/pipeline/backfill-segment-prior.mjs（新規：既登録分への前期の追加。引用済みの有報だけを読み、Prior1YearDuration の期末が前期レコードの期末と一致することも有報のコンテキストで照合する）、src/lib/analysis-decomposition.ts（A3 を式レジストリに追加し観点2「成長」へ接続）、tests/segment-revenue.test.ts・tests/analysis-decomposition.test.ts（前期抽出の単体テスト、A3 のゴールデン・性質・表示条件テスト、実データ突合への A3 追加）。

**実測**: 実現可能性の事前実測では、キャッシュ済みの実有報9件すべてに前期コンテキストがあり、エントリに対応付いた7件すべてで前期セグメントの抽出・対応付け・前期印字売上高への突合が通った。backfill（公開済みを対象）では、候補1,041社に対し追加1,009社・追加なし18社・見送り14社（すべて「前期レコードが通常の12か月前にない」）・失敗0件。A3 の表示社数は公開2,993社中1,007社で、前期を登録できた1,009社のうち2社だけが revenueBasis の不一致で非表示になった（対象母集団に対する非表示率0.2%。スキームの撤退条件30%以内）。

**やらないこと**: 前期セグメントの本文・企業ページ表への表示（A3 の入力としてのみ使う。segmentRevenue の表示は従来どおり最新期のみ）、寄与率の表示、片方の期にしかない事業の増減の推定、ANALYSIS_FEATURES_OPEN の変更。

## JCE-098 — 2026-11-23: 分析SaaS Phase 2 — 財務諸表明細の拡充と A-full・B2・D2（C2 は見送り）

**背景**: フェーズ2のモジュール（A-full・B2・C2・D2）は financialStatements（有報の P/L・B/S 明細）を前提とするが、JCE-092 時点で明細を持つのは5社のみだった。本回は明細データの拡充を本体とし、拡充できた範囲でモジュールを実装する。運営者指示「進めて」（2026-11-23）。

**拡充のトランシェ（実測と定義）**:
1. **トランシェ定義**: 「公開済みで、最新2期の財務レコードの出典から有報（書類種別030000・有価証券報告書）を特定でき、その提出書類が EDINET のローカルキャッシュ（登録パイプラインの証拠キャッシュ）に既にある会社」。新規の EDINET 取得は行わない（共有枠100/日を圧迫しない）。キャッシュは downloadDocument がキーなしで返す範囲のみ。
2. **実測**: 公開3,119社に対し、キャッシュ済み証拠だけで拡充できるのは2,952社（JGAAP 2,761・IFRS 191）。キャッシュに無い154社と、書類IDを特定できない8社は今回の対象外（新規取得が必要なため、別トランシェとして残す）。
3. **結果**: 新規に明細を登録したのは1,992社（すべて JGAAP）。既存5社と合わせ、financialStatements を持つ会社は1,997社。残り960社は保守的に不採用（主な理由：必須行が明細に無い・読めない 1,079件（年度単位）、販管費内訳の合計が販管費を超える 381件、流動資産＋固定資産≠総資産 212件、5期レコードとの値不一致（売上69・総資産53・純資産53・純利益53・経常利益37件））。整合性チェックは一切緩めていない。不採用の会社は明細なしのまま残し、モジュール側で出さない。
4. **IFRS・米国基準の境界**: IFRS 191社は全社不採用。現行の要素マップは JGAAP の表示科目を前提としており、IFRS の明細（表示科目の構成が異なる）では必須行が読めない。表記・項目の差異を推測で吸収しないため、IFRS 対応は要素マップの拡張として別途行う。米国基準はキャッシュ自体が無い（5社とも未キャッシュ）。
5. **登録方法**: statement-details.mjs に --bulk モードを追加（キャッシュ専用。無い会社は取得せずスキップ）。会社ごとの改訂記録は付けず、updatedAt も変更しない（JCE-097 の backfill と同じ扱い）。明細ブロックに docId（下記 asFiledIn）を併せて付与した。

**asFiledIn（提出書類IDの保持）— 明細レイヤーに限定して導入**:
1. `FinancialStatements.docId`（任意、形式 S+英数7桁）を追加し、型・zod スキーマ・integrity（自社の出典のいずれかと一致すること）を拡張した。全1,997ブロックに付与済み。ブロックの全年度が最新2レコードの期間内にある場合のみ付与する（前期欄は同じ有報から読まれているため同一 docId で正しい）。
2. フェーズ2モジュールは、明細の2年度ブロックの docId が両方あり一致する場合に限り両年を同じ有報から読んだものとして扱う（docId が無いブロック同士は従来どおり可）。増減の同一性担保として使う。
3. **financials（5期レコード）側の asFiledIn は導入しない**。レコードは複数有報の前期欄をまたいで構成されうるため、レコード単位の docId は意味を持たない。必要になれば出典（sources）の書類IDで代替する。登録パイプライン側の課題として残す。

**モジュールの設計判断**:
1. **A-full（営業利益の3要因分解、観点＝収益性）**: Bennet 中点型。売上効果＝ΔR×営業利益率の平均、粗利率効果＝Δ（粗利/R）×R平均、販管費率効果＝−Δ（販管費/R）×R平均。営業総利益（operating-gross-profit）を印字する会社はそちらを起点とし、注記で明示する（両期で形式が違う会社は出さない）。印字の丸めによる残差は「その他の差異」として独立行で出す（0 の場合は出さない）。営業利益行は A1 と重なるため出さない。
2. **B2（純資産の完全分解、観点＝財務の安定）**: Δ純資産＝親会社株主に帰属する当期純利益（印字値の行）＋Δ評価・換算差額等＋（Δ資本金＋Δ資本剰余金）＋自己株式の増減（印字額の増減）＋Δ非支配株主持分＋残差。資本金が両期に無い会社は出さない。残差には配当・新株予約権・利益剰余金のその他変動・丸めが含まれ、その旨と「|残差|＞純資産の1%なら大きい期である」旨を注記する。非支配株主持分が両期に無い会社ではその行を出さない。
3. **D2（増分ROIC、観点＝収益性）**: 金融業は対象外。実効税率 τ＝法人税等÷税引前利益を 0〜50% にクリップ（税引前利益が0以下の年は出さない）。投下資本＝純資産＋純有利子負債（借入金・社債の role 合計 − 現金及び預金）。リース債務は明細の role に無いため投下資本に含めず、注記で明示する。増分は ΔIC＞0 かつ ΔIC≧期首ICの5% の場合のみ表示する（分母ルール）。平均調達金利＝支払利息（営業外費用の注記行でラベルが「支払利息」で始まる行）÷有利子負債の平均。行がある場合のみ出し、増分ROICとの大小を事実として注記する。明細が2期のみのため、完全版仕様のラグ（投下から1〜2年）は付けられず単年の増分とする——明細の年数が増えた時点で再検討する制約として記録する。
4. **C2（資金ギャップ）は見送り**: 営業キャッシュフローと設備投資の登録データがどこにも無く、financialStatements は P/L・B/S のみで CF 明細を持たない。CF 明細の登録が前提条件であり、推測で埋めない。フェーズ2の残件として残す。
5. **共通の表示条件**: 明細の最新2年が財務レコードの最新2件と一致し、同一会計基準で、期間が340日以上（前期欄の再掲を弾く）であること。計算できない会社は行ごと出さない。有料境界と ANALYSIS_FEATURES_OPEN は変更しない。

**実装したこと**: scripts/research/statement-details.mjs（--bulk キャッシュ専用モード、docId の記録）、scripts/research/backfill-statement-docid.mjs（新規：全ブロックへの docId 付与）、src/types/company.ts・src/lib/content/schemas.ts（FinancialStatements.docId）、src/lib/content/integrity.ts（docId の出典一致チェック）、src/lib/analysis-decomposition.ts（a-full・b2・d2 を式レジストリに追加し観点へ接続。配置は a1・a-full・a2・a3・b1・b2・c1・e1・f2・f3・d1・d2・f1 の順）、明細1,992社分のデータ、tests/analysis-decomposition.test.ts（ミスミの印字明細からのゴールデン＝手計算照合、性質テスト、表示条件テスト、実データ突合への3モジュール追加）。

**実測**: 明細2年分がある公開会社は1,907社。表示社数（公開3,119社中）：A-full 1,862社（59.7%。明細行不足で45社が非表示）、B2 1,907社（61.1%。明細2年がある全社）、D2 931社（29.8%。金融業・投下資本の増分条件・明細行不足で非表示）。ゴールデン照合（ミスミ）：A-full の効果3件と残差の合計が営業利益の増減 +1,133百万円と一致、B2 の構成要素が印字値の増減と一致（Δ純資産 +30,445百万円）、D2 の増分ROIC 7.51%・ΔIC +76,800百万円を印字値から手計算で確認。拡充後の data-integrity は58,648件全通過。

**やらないこと**: C2 の実装（CF 明細の登録が前提）、IFRS・米国基準の明細対応（要素マップ拡張が前提）、未キャッシュ154社・書類ID不明8社の拡充（新規 EDINET 取得が前提の別トランシェ）、financials 側 asFiledIn、D2 のラグ付き増分、ANALYSIS_FEATURES_OPEN の変更。

## JCE-099 — 2026-11-23: ダークを標準にした高密度の UI（ホーム・企業ページの第一画面・検索・ナビ）

（PR #78 では JCE-098 として記録したが、同時刻にマージされた分析SaaS Phase 2〔PR #79〕も JCE-098 を使い、マージでこの記録が上書きされたため、JCE-099 として記録し直す。内容は PR #78 のまま。）

**背景**: 運営者がダークテーマのモック（ホームと企業詳細）を示し、「株価は反映しないが、このデザインで」「現状は最悪の前提で、情報を減らさず高密度に（Dense, not cluttered）」と指示した（2026-11-23）。390px 幅で全ページを確認した結果、ホームの第一画面に数字も価値の一文もない、検索「トヨタ」でカメイが先頭、企業一覧の前置きが一覧を押し下げる、企業ページの第一画面に推移・構成・つながりがない、下部ナビ6項目の重複、黒とグレーだけのダークで面の区切りが見えない、を問題とした。設計レポートは Artifact（「百科事典 UI 再設計」）。

**設計判断**:
1. **ダークを標準にする**。何も選んでいない読者はダーク（紺の夜、oklch 0.17 / 色相 262）。設定のライト・端末に合わせるは残す。カードは背景より一段明るい面、罫線は13%。朱は印と現在地だけ、青は売上とリンク、珊瑚色は純利益の線。上げ下げを赤緑で示さない方針は不変。
2. **ホーム**：一文の約束と写真（業界ハブの既存写真）→検索→検索例→数字のタイル（掲載企業・業界・企業のつながり・最新の更新。株価・指数の代わり、すべてデータから数える）→解説つきの主な企業（売上の大きい順、横スクロール）→8つの入口のアイコングリッド。下の節は順序を保ち、文字と余白を詰めた。
3. **企業ページの第一画面**（JCE-094 の3層は維持）：証券コードのピル、社名と英字名、社名の頭文字の印（ロゴの代わり。企業のブランド画像は使わない）、業界と本社の一行、規模3タイル（決算期つき）、出典バッジ、要約カード3つ（業績の推移＝売上の棒と純利益の線を別目盛りで明記／事業の構成＝構成比の計算値／関連企業の上位3件）。要約カードは各節へのリンクで、数字は登録値と既存の計算だけ。
4. **検索の並び**：完全一致→名前・コードの前方一致→名前の部分一致→本文の一致の4段、段の中は50音順（2026-10-22 の索引順を段の中で維持）。
5. **ナビ**：下部はホーム／企業を探す／業界／比較／保存の5つ。残りの行き先はヘッダーのメニュー（`<details>`、JavaScript 不要）に名前と一言で並べる。

**やらないこと（次の段）**: ハブページの見出しの共通化、企業一覧の段階読み込み、業界ページの写真帯の縮小、企業ページ下部の節の規格統一。

## JCE-100 — 2026-11-23: 課金・権利付与の実体を百科事典側に持つ（SaaS 構築 Step 1）と、月390円プランの新規受付停止

（運営者の指示では「JCE-099」だったが、その番号は同日のダーク UI の決定（PR #81）が使用済みのため、JCE-100 として記録する。）

**背景**: 運営者が SaaS 構築順を確定した（Step 1 課金の実体 → Step 2 分析の有料境界＋PDF → Step 3 データ拡充の残り〔CF明細・IFRS・未キャッシュ〕 → Step 4 取得の完全無人化＋30日実証 → Step 5 経済指標8指標 → Step 6 層分離＋API提供 → Step 7 E本格版）。百科事典には課金の実体がなく、プラン判定は企業タイプ診断サイトの Worker が Stripe を都度照会する借用だった。あわせて Phase 4 決定（2026-11-23：月390円は新規受付停止＝廃止確定）を実行する。

**実測（現行仕様、2026-11-23）**:
- 判定経路: 購入コードは Stripe の subscription id（`sub_…`）。読者の入力か、診断サイトが親ドメインに残す Cookie `yugenq_plan` で百科事典に届き、`src/lib/plan.ts` が診断サイトの `POST /api/plan` へ送る。診断 Worker は自前の `STRIPE_SECRET_KEY` で `subscriptions/{id}` を都度取得し、有効判定は status が active / trialing、`paidUntil` = 期間末、`checkAfter` = min(paidUntil, +3日)。結果は localStorage（planStore）に保持する。Checkout は診断 Worker の `POST /api/checkout` が Worker 変数 `STRIPE_PRICE_ID`（月390円・7日間トライアル、CTS-044）でセッションを作る。
- Stripe（YUGENQ live）: 価格は2件のみ — 月390円 `price_1UaaqIFm3JfKaAku4nCDuxC8`（商品 `prod_Vbi8yQUiLyTvDW`）と学習β 月1,100円 `price_1UeI7zFm3JfKaAkuHmwYpG9X`（商品 `prod_VfdOFlTGPrGzNo`）。サブスクは1件のみで運営者自身の契約（`sub_1UbAI9Fm3JfKaAkuMuVK6CZs`、metadata purpose=operator、100%割引、全期間 charges 0件）。Payment Link は学習βの1件（`plink_1UeI86Fm3JfKaAkuBy1zmQw0`）のみで、390円の価格は使っていない。

**設計判断**:
1. **ストアは既存の D1（kigyo-push、PUSH_DB）に足す**。`migrations/0004_billing.sql` で `entitlements`（コード＝subscription id を主キーに、状態・paidUntil・出所）と `billing_events`（Webhook の冪等記録）を追加する。新しい基盤・新しいデータベースは作らない。受信と判定は既存 Worker（worker/index.ts）に `worker/billing/` を足して担う — 通知（JCE-059/065/069）と同じ worker/store+api の形。
2. **Webhook**: `POST /api/billing/webhook`。`STRIPE_WEBHOOK_SECRET`（Worker シークレット）で署名を検証する（HMAC-SHA256、`t.body`、5分の tolerance、定数時間比較）。`customer.subscription.created/updated/deleted` と `invoice.paid` を処理し、イベント id で冪等にする。シークレット未設定・ストア未接続なら 503 を返し、機能は「未設定」として何も壊さない。学習βの Payment Link 経由の契約も `customer.subscription.created` で同じ表に入る（販売条件・価格・計測条件〔〜2027-01-31、合格線〕は変えない）。
3. **判定**: `POST /api/plan`（自サイト）を新設し、診断 `/api/plan` と同じ応答形・同じ有効判定（active/trialing かつ paidUntil が未来、checkAfter = min(paidUntil, +3日)）を D1 から返す。ストアが読めない場合は 503 を返し、クライアントのフォールバックを促す。
4. **移行方式は union（有効な答えを優先）**: `plan.ts` の checkPlan は自サイト → 診断の順に聞き、どちらかが有効なら有効とする。D1 にまだ無い既存コードは診断側の答えで従来どおり開くため、移行中に既存の表示は壊れない。Webhook のライブ登録と既存コードの D1 への移し替えが済んだら診断フォールバックを外す（Step 2 へ引き継ぎ）。
5. **βの権利記録**: 手動付与は同じ `entitlements` に `source = 'beta-manual'` として記録できる形にする（行の出所を必ず残す）。βの販売は Payment Link のまま変えない。
6. **フラグは変更しない**: `PREMIUM_FEATURES_OPEN` と `ANALYSIS_FEATURES_OPEN` には触らない（有料境界を開くのは Step 2）。

**月390円の新規受付停止（Phase 4 決定の実行）**:
- Stripe の月390円の価格を inactive にする。inactive な価格では Checkout セッションを作れないため、診断・百科事典・最初の一社の全申込導線で新規加入が成立しなくなる。運営者自身の既存契約は解約しない（価格の inactive 化で既存サブスクは止まらない）。
- 実行結果（2026-11-23）: 販売していた価格は商品のデフォルト価格で、そのままでは inactive にできなかったため、代替のデフォルト価格（`price_1UeusrFm3JfKaAkuWNbxGdMb`、同額・metadata に「販売しない placeholder」と明記）を作ってデフォルトを移してから、販売していた価格を inactive にした。商品の metadata にも sales_status=closed を記録した。検証: inactive な価格で Checkout セッションを作ろうとすると Stripe が「The price specified is inactive」と返して失敗すること、運営者の契約 `sub_1UbAI9Fm3JfKaAkuMuVK6CZs` が active のままであることを確認した。
- 診断サイトの /plan ページの文案差し替えと Worker の `/api/checkout` の恒久停止は、-MBTI repo をこの環境から clone できず、その repo のゲート（`npm run check`）を回せないため今回は行わない。価格の停止で申込自体は成立しない。残件として記録する。

**やらないこと**: Stripe ダッシュボードでの Webhook エンドポイント登録と `STRIPE_WEBHOOK_SECRET` の設定（運営者のライブ操作）、D1 マイグレーション 0004 の本番適用、診断フォールバックの撤去、学習βの販売条件の変更、-MBTI repo の変更。

## JCE-101 — 2026-11-23: SaaS Step 1 の移行完了（Webhook 登録・シークレット設定・D1 0004 本番適用）と Step 2（分析の有料境界＋PDF）

運営者指示「進めて」（2026-11-23）を受け、JCE-100 で「やらないこと」に残した移行作業と、構築順 Step 2 を実施した。

**Step 1 移行の完了（ライブ操作、2026-11-23）**:
1. **D1 マイグレーション 0004 を本番適用**: Cloudflare API で kigyo-push に `entitlements`／`billing_events` を作成し、`d1_migrations` に 0004_billing.sql を記録した。適用後に両テーブルの存在を実測した。
2. **Stripe Webhook を登録**: エンドポイント `we_1UevW3Fm3JfKaAkuBPZMnXMg`、`https://kigyo-hyakka.com/api/billing/webhook`、対象はコードが処理する4イベント（customer.subscription.created/updated/deleted、invoice.paid）、状態 enabled。登録前はエンドポイント 0 件だったことを確認した。
3. **STRIPE_WEBHOOK_SECRET を Worker（nihonkigyohyakka）のシークレットに設定**: 発行された signing secret はメモリ内でのみ受け渡し、値そのものはファイル・ログ・文書のどこにも残していない。設定後に Worker のシークレット名一覧に STRIPE_WEBHOOK_SECRET があることを確認した。
4. **既存コードの移し替え**: 運営者の契約 `sub_1UbAI9Fm3JfKaAkuMuVK6CZs` を Stripe の現行値（status active、customer `cus_VcP6IAqHA649zF`、期間末はサブスクリプションアイテムの current_period_end）で `entitlements` に登録した（source = 'stripe'）。
5. **診断フォールバックは今回は外さない**: JCE-100 の設計判断4は「Webhook のライブ登録と移し替えが済んだら外す」としたが、移行直後の安全のため union 方式を当面維持する。フォールバックがある限り既存コードの表示は壊れず、撤去は実績（Webhook の実イベント処理）を確認してから別途行う。

**Step 2 — 分析の有料境界**:
1. **ANALYSIS_FEATURES_OPEN = true に変更し、意味を「分析レイヤーの on/off」に改めた**。有料境界の本体はフラグではなく権利判定（`analysisEntitled`）: 保存されたプランが支払期間内にあるブラウザだけが全分析（分布・推移・経済指標との接続）を描画する。権利の確認は JCE-100 の union 判定（自サイト entitlements → 診断フォールバック）のまま。
2. **AnalysisGate を PremiumGate と同じ形に作り替えた**: 権利なしではゲート内の子要素を描画せず、無料範囲の説明と購入コードの入力欄だけを出す。権利ありでは全分析を出す。フラグが false の間は JCE-078 の「提供を準備しています」の表示に戻る（レイヤー自体の停止スイッチとして残す）。
3. **無料範囲は変えない**: 各観点の自社の値＋業界の中央値は従来どおり全読者に公開する。PREMIUM_FEATURES_OPEN の挙動、/learn の開放状態、学習βの価格・計測条件には触れていない。新しい Stripe 価格は作っていない（分析単体の販売価格が必要になったら運営者の授権を別途得る）。

**Step 2 — PDF 出力**:
- 切り分けの結果、PDF 生成経路は新設しない。JCE-073 の印刷経路（レポート専用印刷 CSS＋印刷ボタン）が既に文書としての出力を担っており、不足は「PDFであることの明示」と「有料境界と印刷の関係」だけだった。
- 印刷ボタンの文言を「印刷・PDFで保存」に変更し、印刷範囲が画面と同じ境界に従うことを明記した: 権利ありのブラウザでは分析を含むレポート全体が、権利なしでは無料範囲だけが印刷・PDF化され、ゲートの案内自体は印刷されない（print:hidden）。

**検証**: 新規テスト tests/analysis-gate.test.ts（境界判定4件）。本番確認（デプロイ後）: 自サイト POST /api/plan が移し替えたコードに有効を返すこと、Webhook への不正署名が 400 を返すこと、レポートページでゲート表示・権利あり表示・PDF 出力の3点。

## JCE-102 — 2026-11-23: SaaS Step 3（1）— CF明細の登録と C2 資金ギャップの有効化

運営者指示「進めていって」（2026-11-23）と構築順 Step 3 の第1トランシェ。役割分担: 設計 = engineering（既存の明細レイヤーの規約踏襲）、実装 = engineering、検証 = data-quality（照合ゲートと data-integrity スイート）。

**CF 明細の登録**:
1. **データモデル**: `FinancialStatements` に任意フィールド `cashFlowStatement` を追加（JCE-092 の明細と同じ StatementLine 形式）。行は C2 が依拠する2行だけに限定する — 営業キャッシュフロー（要素 NetCashProvidedByUsedInOperatingActivities／IFRS は同名 +IFRS）と、会社自身が印字する固定資産の取得による支出（PurchaseOfPropertyPlantAndEquipmentInvCF を第一候補とし、無い会社は固定資産の取得・有形及び無形固定資産の取得の順に、その会社の印字行そのものを採る。IFRS は対応する IFRS 要素）。投資有価証券の取得など他の投資CF行は設備投資ではないので採らない。
2. **照合**: 営業CFは、同じ有報の経営指標等に印字された営業CF（SummaryOfBusinessResults 要素）と完全一致した場合だけ残す。不一致・読めない年は P/L・B/S を残したまま CF 行だけを付けない（推測で埋めない）。設備投資の行が「－」または存在しない年（資産の軽い会社に実在する）も付けない。
3. **実測**: 明細を持つ1,997社にバックフィル（statement-details.mjs の `--cashflow` モード新設、キャッシュのみ・改訂記録なし・updatedAt 不変更の JCE-097/098 方式）。両期とも付いたのは1,928社、最新期のみ等を含む1,943社に最新期の CF が付いた。残りは設備投資行の無い年・stale なブロック等で、理由はバッチログに残した。

**運転資本の材料の拡充（C2 の前提）**:
4. B/S の売上債権・仕入債務スロットは結合行（受取手形及び売掛金など）しか拾っておらず、C2 が組める会社が529社にとどまった。実データ調査に基づき、分割表示の要素（売掛金・受取手形・電子記録債権・契約資産／買掛金・支払手形・電子記録債務・営業未払金、建設業の完成工事未収入金・工事未払金）を追加し、`--balance-sheet` バックフィルで再構築した。再構築は「P/L が登録済みと完全一致し、B/S が全照合を通り、登録済みの行が全て残る」場合だけ書き込む純粋追加で、1,818社の両期・72社の1期（計1,890社）が広がった。未払金（AccountsPayableOther）は仕入債務ではないので含めない。
5. C2 の運転資本 = 売上債権（結合行または構成行の合計）+ 棚卸資産 − 仕入債務（構成行の合計）。棚卸資産は構成行と合計行（棚卸資産）が併記される会社では、残差最小の行を合計行として二重計上を避ける。

**C2 資金ギャップの実装**（analysis-decomposition.ts、観点4「財務の安定」）:
6. 資金ギャップ = 設備投資 + Δ運転資本 − 営業CF（完全版仕様の定義どおり）。行は営業CF（印字値）・設備投資（支出額、行名を式に明示）・運転資本（期末）・運転資本の増減・資金ギャップの5行、全て計算値の明示つき。設備投資の行名が「有形固定資産の取得による支出」でない会社は、その印字行名を注記する。材料が揃わない会社はモジュールごと出さない（従来規約）。
7. **表示社数は公開3,119社中1,586社**（B/S 拡充前は529社）。ゴールデンテストはミスミの印字値からの手計算（Δ運転資本 +152.52億円、設備投資 142.88億円、営業CF 521.9億円 → 資金ギャップ −226.5億円）。

**検証**: tsc・eslint 通過、対象テスト49件通過（C2 ゴールデン・二重計上防止・抑制条件を追加）、data-integrity スイート58,648件全通過。

**やらないこと**: 米国基準の明細対応（要素マップ未検証、候補社もキャッシュ内に0社）、IFRS の明細拡充と未キャッシュ取得は本 Step の後続トランシェ（JCE-103 以降）、B2 の IFRS 向け調整は IFRS 拡充と同時に行う。

## JCE-103 — 2026-11-23: SaaS Step 3（2）— IFRS 明細の拡充

運営者指示「進めていって」（2026-11-23）と構築順 Step 3 の第2トランシェ。JCE-102 に続く。役割分担: 設計 = engineering、実装 = engineering、検証 = data-quality。

**要素マップの拡張（statement-details）**:
1. P/L・B/S のスロットに IFRS タクソノミ（jpigp）の対応要素を追加した。対応付けはすべてキャッシュ内の実 XBRL で検証したものだけ。判断の記録: (1) 純資産（total-net-assets）は **親会社所有者帰属持分**（EquityAttributableToOwnersOfParentIFRS）に一致させる — エントリーの financials.純資産がこの値で記録されていることを AGC で実証したためで、資本合計（EquityIFRS）ではない。(2) 株主資本合計（total-shareholders-equity）の role は IFRS では埋めない（対応する単一の印字行がない）。(3) 借入金・社債の role は IFRS では埋めない — 検証できるのは社債及び借入金の流動・非流動の別だけで、有利子負債にあたる結合要素（InterestBearingLiabilities）は内訳の検証ができないため。結果として D2 は IFRS では従来どおり出ない。(4) 棚卸資産は合計要素（InventoriesCAIFRS）のみ。(5) 有形固定資産は IFRS の純額カテゴリ行（建物及び構築物・機械装置及び運搬具・工具器具備品・土地・建設仮勘定・使用権資産）で ppe-net として読む。
2. **非継続事業の閉合**: IFRS の税引前利益は継続事業の値のため、継続事業からの当期利益・非継続事業からの当期利益を独立した印字行（role: continuing-profit / discontinued-profit）として登録し、照合を「税引前−法人税等＝継続」「継続＋非継続＝当期純利益」の2段にした（ブリヂストンの実データで検証）。ラベルの符号分離（利益／損失）は JGAAP と同じ規則を IFRS の「（IFRS）」接尾辞除去後に適用する。
3. **照合の IFRS 調整**: 粗利−販管費＝営業利益の段は IFRS では適用しない（その他の収益・費用と持分法損益が間に入るため。他の完全一致照合と残りの段・B/S 恒等式で担保）。負債＋純資産＝総資産の恒等式には非支配株主持分を加える（純資産が親会社帰属のみのため）。親会社帰属持分の構成検算（資本金＋資本剰余金＋利益剰余金＋自己株式＋その他の資本の構成要素）を追加した。
4. **B2 の IFRS 調整**（analysis-decomposition）: IFRS では純資産が親会社帰属のみのため、非支配株主持分の増減を純資産増減の分解要素に含めない。

**実測**: 対象は IFRS・証拠キャッシュあり・明細なしの214社。**173社に登録**（うち公開157社）。モジュール表示（公開3,119社中）: C2 1,586→**1,690社**、A-full 1,862→**1,999社**、B2 1,907→**2,053社**。明細を持つ公開会社は2,154社になった。
**除外41社の内訳**（理由はバッチログに会社別に残した）: 金融業型の IFRS（営業利益の印字行がなく収益の形が異なる。マネックスグループ等）／親会社帰属持分の構成検算が標準要素で閉じない会社（売却目的保有資産に係るその他の包括利益を別要素で表示するデンソーの前期型 — 当期のみ登録できた会社を含む）／エントリーの純資産が非支配持分込みの資本合計で記録され印字値と一致しない会社／親会社帰属行が自社拡張要素で CSV に印字ラベルがなく、行として名前を付けられない会社（コカ・コーラ ボトラーズジャパンホールディングス。値そのものは経営指標の親会社帰属利益と一致するが、ラベルなしの行は作らないという既存規則を優先した）／その他の段照合が閉じない会社。いずれも推測で埋めていない。

**検証**: tsc・eslint 通過（警告1件は main 既存）、対象テスト50件全通過（AGC の C2・ブリヂストンの A-full/B2 と非継続行の実データテストを追加）、data-integrity スイート58,648件全通過。

**やらないこと**: 米国基準の明細対応（今回の範囲外。候補6社は未キャッシュで要素マップも未検証）、IFRS の D2（上記3の理由）、金融業型 IFRS の専用マップ（P/L の形が業態専用で、別途設計が要る）。

## JCE-104 — 2026-11-23: SaaS Step 3（3）— 未キャッシュ会社の EDINET 新規取得と明細拡充

運営者指示「進めていって」（2026-11-23）と構築順 Step 3 の第3トランシェ。JCE-102・103 に続く。

**取得の系統と進め方**:
1. 取得は EDINET API v2（api.edinet-fsa.go.jp）で、EDINET DB の共有日次枠（100/日）とは別系統であることをスクリプトの実装で確認した。対象は明細なし・キャッシュなしの436社（JGAAP 349・IFRS 81・米国基準6）。うち6社は最新出典に書類IDがなく、有報の出典の書類IDを候補として使い、採用は数値の完全一致照合が決める（JCE-102 で実装した候補フォールバック。トヨタ等がこの経路）。
2. 進め方は2段: 先に全社の type=5 を控えめな間隔（社間に0.3秒＋スクリプト内蔵の再試行）でキャッシュへ取得し（429 は発生せず、全436社取得完了）、その後に JCE-098 以来のキャッシュのみ・改訂記録なしの bulk で書き込んだ。refresh-financials の定期実行（07:00 JST）とは時間帯が重ならない。

**実測**: **284社に登録**（うち公開88社）。明細を持つ公開会社は2,242社になった。モジュール表示（公開3,119社中）: C2 1,690→**1,765社**、A-full 1,999→**2,082社**、B2 2,053→**2,138社**、D2 1,013→**1,068社**。
**残り152社は不採用**（理由はバッチログに会社別に残した）: 売上の行が読めない会社が最多で、トヨタのように売上合計が自社拡張要素（TotalNetRevenuesIFRS）で CSV に印字ラベルがない会社を含む（値は経営指標と一致するが、ラベルなしの行は作らない規則を優先。JCE-103 のコカ・コーラ ボトラーズジャパンと同じ扱い。マクロミルは親会社帰属行がこの形で、登録後に integrity が検出したため差し戻した）。次いで、解決した書類IDの書類から連結の明細行が読めない会社、B/S 恒等式が閉じない会社。米国基準6社は要素マップ未検証のため今回も対象外（取得した有報はキャッシュに残る）。

**検証**: tsc 通過、対象テスト50件全通過、data-integrity スイート58,648件全通過。

**Step 3 の残件**: 米国基準の明細対応、金融業型 IFRS の専用マップ、拡張要素でラベルのない行の扱い（設計判断として別途）、セグメント前期の未公開分（約714社）への backfill 展開可否の評価。

## JCE-105 — 2026-11-23: SaaS Step 3（4）— セグメント前期の未公開分への展開

運営者指示「進めていって」（2026-11-23）と構築順 Step 3 の第4トランシェ。JCE-104 に続く。

1. JCE-097 の backfill-segment-prior（同じ有報の前期欄から segmentRevenue.previous を取る、全部そろう場合だけ書く方式）を、公開分だけでなく全エントリー（--tier all）へ展開した。対象は segmentRevenue を持ち previous のない746社。
2. **実測: 667社に追加**（ファイル実測で 1,009社→1,676社が previous 保有、segmentRevenue 保有1,755社中）。残り79社は追加なし（前期欄のタグ付けなし・前期のセグメント名が事業に対応付かない・合計が前期売上を超える）か見送り（前期レコードが通常の12か月前にない）で、推測では埋めていない。失敗0件。
3. 表示への効果: A3（セグメント寄与）の表示可能会社は公開3,119社中 1,007社→**1,428社**。未公開エントリーの分は、公開された時点でそのまま効く。

**検証**: data-integrity スイート58,648件全通過、対象テスト（analysis-decomposition）41件全通過。

**Step 3 の完了**: 第1〜第4トランシェ（JCE-102〜105）で Step 3 は完了。残件は米国基準の明細対応、金融業型 IFRS の専用マップ、拡張要素で印字ラベルのない行の扱い（設計判断として別途）、IFRS の D2（有利子負債の内訳が検証できないため）の4点で、いずれも推測で埋めない原則による意図的な除外。

## JCE-106 — 2026-11-24: SaaS Step 4 — 取得の完全無人化の棚卸し、訂正の自動適用、30日実証の開始

運営者指示「進めていって」（2026-11-23）と構築順 Step 4。役割分担: 設計 = engineering、実装 = engineering、検証 = data-quality。

### 棚卸し（実ファイル・実 cron・実 Actions 設定からの実測）

| 工程 | 実体 | 自動化の実情 |
|---|---|---|
| 新規有報の検知（登録済み会社） | refresh-financials（Actions、日次07:00 JST）detect | 無人。検証→適用→PR まで propose が無人。マージは自動マージゲート（JCE-058）が実装済みだが repository variable AUTO_MERGE_FINANCIALS が未設定＝**現行は人がマージ**（有効化は運営者の判断事項として残す） |
| 半期報告書（160/170） | interim-financials（同じ workflow 内、JCE-045） | 無人。ただし対象は **published のみ** |
| 決算短信 Q1/Q3 | quarterly-earnings（同じ workflow 内、JCE-049、EDINET DB 日次枠80） | 無人。照合が閉じない会社は held |
| 訂正有報（130） | amendment-audit（同じ workflow 内、日次） | **検知と推奨まで無人、適用は手元で1社ずつ手動**（apply-amendment、pipeline/state のある機械だけ）← 本件で自動化 |
| 新規会社の検知 | watch-new-filings（ローカル、cron edinet-filings-watcher 毎日07:40） | 検知は無人。本文生成（AI）と承認は人 — 基盤スキームでも「最も残る」工程として分離済み |
| statement-details（明細拡充） | 手動トランシェのみ（Step 3 で実施） | **定期実行なし**。workflow への追加は本書の「workflow 追加分」で分離 |
| つながり（relatedCompanies） | 登録時のみ。refresh は segment/regional/workforce を差し替える | 本文工程に属し自動化しない |
| 公開 | 分割デプロイ（Actions） | push 以降は無人 |

### 実装1: 訂正の自動適用 `scripts/pipeline/apply-amendments-auto.mjs`

監査の推奨（auditAction）を固定ルールで振り分け、適用は既存の apply-amendment.mjs（検証・スキーマ・整合性・ロールバックのゲート付き）に一社ずつ委ねる。自動で進めるのは (a) record-only（財務も本文も変わらない。エントリーは変えず処理済みとして閉じる）(b) already-current（登録値が既に有効文書と一致）(c) update-financials で登録値が原本と一致しているもの（陳腐化ではなく訂正と確定できるもの）(d) 本文のみ変更の needs-attention フラグ付け。登録値が原本とも一致しない会社・不完全な訂正・未登録会社は必ず保留し、理由つきで報告する。pipeline/state の identity が無い会社は、エントリーだけから合成する（identityFromEntry と同じ事実＋出典の publishedAt を提出日とする。既存 state は上書きしない）。既定はドライランで、`--apply` のときだけ書く。

### 実装2: 30日実証 `scripts/pipeline/unattended-proof.mjs` と実証設計

- **無人の範囲**: 検知→検証→適用（PR 作成まで）→記録。マージは現行（AUTO_MERGE_FINANCIALS 未設定）では人の行為なので範囲外とし、代わりに保留・失敗件数を毎日記録して滞留を見えるようにする。運営者が variable を有効化した場合は、その時点で範囲をマージまで広げて記録し直す。
- **日次記録**: その日の EDINET 日次索引から、登録済み会社が提出した 120/130/160/170 を全件取り、各書類が「どのレーンが持っているか」を証拠で判定する（エントリーの到達期末・引用 docID、訂正索引、コミット済み実行記録 pipeline/runs、ウォッチャーのキュー）。判定できないものは推測で accounted にしない。
- **検知漏れの定義**: accounted でなく、提出から3日（日次レーン＋索引確定の余裕）を超えた書類。見たが検証で止めた書類は「保留」として別に数える。interim レーンの対象外（published 以外の 160/170）は「対象外」として別に数える。索引が確定していない日は記録を書かずに止まる（綺麗な日として書かない）。
- **照合の性質**: 記録は「その時点の証拠」で判定する。未マージ PR の中の処理は証拠に見えないため、日次は早期警告、**週次の再照合（過去7日をその時点の証拠で再判定）が正式な判定**とする。
- **置き場と実行**: 日次ログは goal の hidden_files（step4-proof/unattended-log.jsonl）に追記する。実行は Hatch cron `jce-step4-daily-proof`（毎日08:30 JST、ウォッチャー07:40 と Actions 07:00 の後）と `jce-step4-weekly-reconcile`（日曜09:30 JST）。EDINET API（書類一覧）だけを使い、EDINET DB の共有枠には触れない。
- **実証期間**: **2026-11-24 開始、2026-12-23 までの30日間**。完了条件は「30日無人＋検知漏れゼロ（週次再照合の判定で）」。

### ベースライン計測（実証開始前の過去日での試走）

2026-11-19: 検知26件・漏れ0（対象外6）。2026-11-20: 検知43件・**漏れ2件** — ともに公開企業の訂正半期報告書（170）で、ニプロ S100ZIZ3（2026-11-20提出）とセンコン物流 S100ZDPO（2026-11-10提出）。半期の訂正を能動的に適用するレーンが無く（interim は次回処理時に 170 を取り込む設計だが、この2社は実行記録に現れていない）、Step 4 の最初の発見として記録する。実証期間中に解消するか、週次再照合で追う。なお半期の index 行の periodEnd は提出者により年度末と半期末が混在するため、照合には使わない（interim-financials の既知の注意と同じ）。

### 試走（12社、ドライラン、実測）

候補は索引全体で268社。先頭12社で全区分を実測: record-only 7社、would-apply 3社（aeon・ai-storm・amiya、いずれも本文フラグ付け）、already-current 1社（arclands）、**held 1社（alt — apply-amendment 自身の検証は通過したが、ステージングした次エントリーが validate-file で落ちたため自動適用せず保留。既存データ側の問題が表面化したもので、バッチが作った変更ではない）**。ゲートが止めるべきものを止めることを含め、設計どおりに動いた。全268社の走査はダウンロード量が大きいため日次には載せず、workflow 追加後の Actions 側（キャッシュあり）で回す前提とする。ドライランでも pipeline/state（gitignore 対象の作業状態）だけは合成され得るが、エントリーデータは書かない。

### workflow 追加分（ユーザーが GitHub Web UI で追加する分）

`.github/workflows/` は GitHub コネクタの push では作成・更新できないため、次の2点は `docs/jce-106-workflow-addition.md` に正確な差分を用意して分離した。**未追加の間は「実装済み」とは言わない**。(1) propose ジョブに apply-amendments-auto --apply のステップを追加し、訂正の自動適用を日次 PR に同梱する。(2) statement-details の定期実行ステップ。追加されるまでは、訂正の自動適用は手元での --apply 実行が可能で、日次 cron がドライランで保留件数を実証ログに残す。

### やらないこと

- AUTO_MERGE_FINANCIALS の有効化（JCE-058 のスイッチは運営者の判断事項。有効化されれば無人の範囲がマージまで広がる）。
- 本文生成・つながりの自動化（AI 依存工程は基盤から分離済み。新規登録の検知キューは既に無人）。
- 米国基準・金融業型 IFRS の明細（Step 3 残件のまま）。

## JCE-107 — 2026-11-24: SaaS Step 5 — 経済指標スナップショットの残り8指標を一次情報から投入

運営者指示（構築順 Step 5、JCE-106 の次工程）。役割分担: 設計 = engineering、実装 = engineering、検証 = data-quality。

### 対象の特定（実測）

仕様 §4 の15指標のうち、JCE-081 で投入済みは7系列（FRED 経由）。残り8指標は「e-Stat・日銀等の一次情報からの取得が前提で、推測投入を避けたため」未投入だった。本件で全8指標を公表元の一次情報から取得・投入した。FRED 等の二次集計での代替はしていない。既存7系列の形式（頻度・単位・出典表記・期間開始日の規約）に揃えた。

### 投入した8指標

| id | 公表元・取得経路 | 定義（公表どおり） | 期間・点数 |
|---|---|---|---|
| japan-cpi 消費者物価指数 | 総務省統計局 公式CSV（2020年基準・全国・総合、原指数） | 指数（2020年=100）、月次 | 2020-01〜2026-10、82点 |
| japan-cgpi 企業物価指数 | 日本銀行 時系列統計データ検索API（PR01、国内企業物価指数・総平均 PRCG20_2200000000） | 指数（2020年=100）、月次 | 2016-01〜2026-10、130点 |
| boj-tankan-di 業況判断DI（日銀短観・大企業製造業） | 同API（CO、TK99F1000601GCQ01000、実績） | ％ポイント、四半期 | 2016Q1〜2026Q3、43点 |
| japan-current-account 経常収支 | 同API（BP01、BPBP6JYNCB、原数値） | 億円、月次 | 2016-01〜2026-09、129点 |
| japan-industrial-production 鉱工業生産指数 | 経済産業省 公式Excel（2020年基準、生産シート「鉱工業」行） | 指数（2020年=100・季節調整済）、月次 | 2018-01〜2026-09、105点 |
| japan-job-offers-ratio 有効求人倍率 | 厚生労働省 一般職業紹介状況 長期時系列表3（e-Stat公開ファイル、第３表ー１ パート含む、季節調整値） | 倍（季節調整済）、月次 | 2016-01〜2026-09、129点 |
| japan-real-wages 実質賃金指数 | 厚生労働省 毎月勤労統計調査 長期時系列表（e-Stat公開ファイル、現金給与総額・事業所規模5人以上・調査産業計・就業形態計、持家の帰属家賃を除く総合で実質化） | 指数（2020年平均=100）、月次 | 2016-01〜2026-08、128点 |
| japan-exports 輸出額（通関） | 財務省 貿易統計 主要商品別時系列表・輸出（e-Stat公開ファイル、年別CSVの総額） | 千円、月次 | 2016-01〜2026-09、129点 |

判断の記録:

- **CPI の期間が約10年に満たない理由**: 2020年基準の公式CSVは2020年開始。2025年基準のCSVは2025-01以降しか持たない。基準の異なる系列の接続はしない（系列定義の変更に当たるため）。
- **鉱工業生産の期間が約10年に満たない理由**: 2020年基準系列の公表開始が2018年（基準改定時に2018年まで遡及公表）。旧基準との接続はしない。
- **短観の日付**: スナップショットの規約（date は期間開始日）に従い四半期の初日に置いた。
- **経常収支は原数値を採用**: 季節調整済系列（BPBP6JYACBX12）ではなく原数値。財務省速報の見出し数値が原数値のため。日銀DBの値は億円未満の端数を含むデータベース公表値そのままで、丸めていない。
- **輸出額は公表単位の千円のまま格納**: 億円への換算はしない（換算は定義の変更であり、表示側の小数2桁丸めで公表値とずれるため）。
- **有効求人倍率は季節調整値**: 速報の見出し値が季節調整値のため。実数ではなく季節調整値の列を読んだ。

### 投入経路と検証

- 新規スクリプト `scripts/indicators/fetch-indicators-primary.py`（標準ライブラリのみ、xlsx は zip/XML として読む）が8系列の取得・整形・書き込みを行う。e-Stat のファイルIDは公式一覧ページから解決し、既知IDは候補の先頭に置くが、**全ファイルで内容検証（シート名・表題・系列名）を必須**とし、一致しなければ書き込まず停止する。貿易は年別ファイルを接続する前に、各ファイルが重複して含む前年12月の一致を全件確認する。実質賃金の旧形式 .xls は LibreOffice 変換を経由し、変換できない環境では停止する（バイナリ形式の推測読みはしない）。
- **全点検証**: 投入した全点について、独立した別経路の読み取り（Excel は openpyxl、日銀は CSV 形式出力、CSV は別パーサ）と突合し、8系列すべて不一致ゼロを確認した（サンプル照合ではない）。
- 業界対応表に構造的リンクを11件追加（全28件）: 機械←鉱工業生産・短観DI、自動車←短観DI、小売・食品←消費者物価、化学・エネルギー←企業物価、人材サービス←有効求人倍率、小売←実質賃金、商社←輸出額・経常収支。note は構造の説明のみ（因果表現は data-integrity が禁止・検査）。
- テスト: `tests/indicators-primary.test.ts` を追加（8指標の登録・頻度・出典ドメイン・24点以上を固定し、二次集計への差し替えや登録漏れを検出する）。data-integrity 全58,648件通過、tsc・eslint 通過。
- 未投入として残した指標はない（8指標すべて一次情報から取得できた）。

### やらないこと

- 既存7系列（FRED）の取得経路の変更（仕様が許容する公表経路として維持）。
- 指標の追加・定義変更（仕様 §4 の15指標で確定）。

## JCE-108 — 2026-11-24: 2大巨頭化 — 百科事典と「分析訓練」の2本柱、学習を同じドメインの専用アプリに

運営者指示（2026-11-24）：「サービスが膨大なので、専用アプリを構築し、日本企業百科事典と学習ページで2大巨頭化させるかを検討したうえで構築する。常にコンシューマ目線で、全部を網羅せず尖らせる」。

**判断**:
1. **柱は2つ**。百科事典＝「その会社が何をしているかが3秒で分かる」。分析訓練＝「決算を予想してから読み、出た数字で照合し、外したところを復習する」— 有報が読めるようになる学習アプリ。企業タイプ診断・最初の一社は柱への入口として残し、ランキング・財務で探す・都道府県・分析・つながり等は消さずにメニューと入口の格子に置く。
2. **学習は専用アプリにするが、別ドメイン・別コードにはしない**。訓練の記録（レッスンの進み・予測・復習の予定）はこのブラウザの保存域にあり、ドメインを分けると引き継げない。問題は掲載企業のデータからビルド時に作るため、データ基盤を分けると二重になる。有料β（月1,100円、JCE-087）の導線も動かさない。そこで同じオリジンの中で、/learn・/quiz・/digest をアプリとして独立させる：ヘッダーの名前が「分析訓練」になり、下のバーが学習用（コース・今日の1問・定期便・復習・百科事典へ）に切り替わり、専用のマニフェスト（/learn/manifest.webmanifest）とアイコンでホーム画面に別アプリとして置ける。利用が増えて別の顔が要るときは、端末間同期（JCE の sync）で記録を移して別ドメインに出す。
3. **百科事典のホームを絞る**。入口の格子から「学習」「定期便」を外し（6つに）、「今日の1問」「企業ネットワーク」の段を、分析訓練の入口1つに置き換える（ネットワークは格子の「つながり」に残る）。メニューの「学習」「決算定期便」は「分析訓練」1つにまとめる。
4. **管理アプリ**は作る方針とし、本番を直接書き換える型ではなく、変更をプルリクエストとして出す型にする（不変条件 1・2・5・9 と、テストの関門をそのまま保つため）。置き場所は admin.kigyo-hyakka.com、Cloudflare Access で運営者のみ。運営者の作業（許可するメールアドレス、GitHub 書き込みトークンの登録）が要るため、分析訓練の第1弾の後に着手する。

**変えないこと**: 学習の中身（レッスン・問題・出典）、有料βの価格と計測条件、診断・最初の一社のサイト、SaaS 構築順（Step 6 以降）。

## JCE-109 — 2026-11-24: 管理アプリ（admin.kigyo-hyakka.com）— 編集をプルリクエストにする

運営者指示（2026-11-24）「記事の作成や更新を含めた管理者アプリの構築を検討する」と JCE-108 の判断4の実行。運営者は「ログインできるメールアドレス」と「GitHub への書き込み権限」をすぐ用意できるが、Cloudflare Zero Trust（Access）はまだ有効にできない。

**判断**:
1. **本番を直接書き換えない**。保存は、内容ファイルと Revision を1コミットにしたプルリクエストを main 向けに作るだけで、マージは運営者が GitHub で行う。テストの関門（data-integrity ほか）と、リポジトリが正本であること（不変条件 9）はそのまま。
2. **検査は手元の管理画面と1つのコードを共有する**。content-store.ts からファイル操作を持たない規則（スキーマ・id・整合性・変更の有無・要約と理由・出典削除の確認・Revision の組み立て）を `src/lib/content/content-edit.ts` に切り出し、両方がそれを呼ぶ。2つの編集口が別のものを受け入れることがない。
3. **ログインはメールのリンク**（Access の代わり）。パスワードを持たない。許可するアドレスもトークンも Worker のシークレットに運営者が入れ、この作業者は値を見ない。署名鍵はその2つから導くので、追加の秘密は無い。
4. **v1 の対象は企業と用語**。「記事」にあたる特集は掲載データからビルド時に作る（JCE-074）ため、編集の対象はその元である企業・用語になる。新しい用語の追加もできる。

**やらないこと**: 本番のデータベースや配信物の直接変更、マージの自動化、AI による本文生成の起動。

## JCE-110 — 2026-11-24: 意味の層 —「この会社の今」（分析レイヤー冒頭の要約文）

運営者の設計メモ「『意味の層』設計メモ — 開示のその先」（2026-11-25 付）と、それへの提案に対する回答（2026-11-24）。初心者が決算で分からないのは「儲かっているのか・危なくないのか」「何が稼いでいるのか」「何に力を入れているのか」の3つで、欠けているのはデータではなく因果の組み立て、という定義による。

**判断**:
1. **文は計算結果から機械的に組み立てる**（`src/lib/meaning-layer.ts`）。型は固定で、差し替わるのは分解モジュール（JCE-096）の行の値と、データにある名前（利益行の印字ラベル、事業名）だけ。文中の数字は表と同じ書式化関数（`src/lib/analysis-format.ts`）で書き、増減の行だけ表の「増減」列が示す向きを＋で明示する。不変条件 4 の「文章で触れてよいのは売上高と純利益」は人・エージェントが書く本文の規則で、この層はコードが表の値をそのまま文にするものとして別扱いにする（値はすべて表に計算値・印字値として既に出ているもの）。
2. **判断語彙と因果の断定を持たない**。使えるつなぎは分解そのものの算術（「〜のうち」「〜による分」）まで。良い・危険・好調・改善などの語と「〜のため」「〜により」は、`tests/meaning-layer.test.ts` が全公開企業の文で禁止する。テンプレート側の文字に数字を持たせないことも同じテストで確かめる。
3. **出せないときは出さない**。行が揃わない型は作らず、欠けていることも書かない。選ぶ順は型ごとの固定順で、「目立つ事実」を選ぶ編集判断は入れない。問いごとの上限は Q1 が4文、Q2 が1文、全体で5文（運営者：必要に応じて変えてよい）。連結範囲の変更が疑われる期（売上高・総資産の±30%超）は、分解表と同じ注記を文に添える。
4. **無料部に置く**（運営者判断：「ここが独自性を見せる面」）。会社ページの「分析（5観点）」の見出しの直下。根拠の表（分解グループ）はその下の現行構成のまま。
5. **データの追加**（運営者判断）：CF明細に減価償却費と投資キャッシュ・フロー合計を、設備投資と同じ照合で追加する（第2段階）。セグメントの追加はセグメント利益を先にする（第3段階、Q2 の事業別利益率）。研究開発費・セグメント別設備投資はその後。

**第1段階の範囲**：Q1（A1 の純利益増減と利益の分解、C2 の設備投資と営業CF、B1、F2、C1）と Q2（A3 の最大寄与事業）。公開 3,119 社のうち 3,063 社に1文以上、2,899 社に4〜5文が出る。

**第2段階の仕組み（データは Actions の手動実行で入れる）**：`STATEMENT_ROLES` に `depreciation`（営業活動の減価償却費の印字行）と `investing-cash-flow`（投資キャッシュ・フロー合計）を追加。`statement-details.mjs` の `buildCashFlow` が両行を任意で読み、既存ブロックへは `--cashflow-extras` で追加する。減価償却費は要素名ではなく印字ラベル（「減価償却」で始まる営業活動の行がちょうど1つ）で採り、2つ以上あれば採らない。投資CF合計は同じ有報の経営指標等の値が読めて完全一致した場合だけ残す（要素名の誤りが未照合の行にならないよう、経営指標等の値を必須にする）。追加は、再読した営業CF・設備投資が登録済みと完全一致する年だけの純粋追加で、改訂記録なし・updatedAt 不変更（JCE-097/098 の bulk 方式）。EDINET の鍵は Actions のシークレットにしかないため、refresh-financials の手動入力 `backfill_cashflow_extras` で実行し、結果はプルリクエストになる（各ブロックが既に指す書類を読むだけで、新しい書類の検知ではない）。C2 の表に「設備投資の前期比」（同じ有報の2期のときだけ）・減価償却費・投資キャッシュフローの行を足し、設備投資の文に前期比と減価償却費を添える。

**第2段階の実測（2026-11-24、PR #111）**：CF明細を持つ2,393社のうち2,390社に追加。減価償却費の印字行は「減価償却費」「減価償却費及び償却費」「減価償却費及びその他の償却費」「減価償却費及び無形資産償却費」の4種で、複数行による不採用は0年。読めなかった年は減価償却費21・投資CF2・営業CF/設備投資の再読不一致3で、推測では埋めていない。要素名は事前に probe（SUBARU・キーエンス・キッコーマン）で実書類と照合した。

**第3段階の仕組み（セグメント利益）**：probe（ADEKA・アキレス・AGS・SUBARU）で、セグメント利益は会社が選んだ損益の要素（日本基準 `jppfs_cor:OperatingIncome` など、IFRS `jpigp_cor:OperatingProfitLossIFRS`）がセグメントのコンテキストに付くこと、セグメントの売上高（`NetSales`／`RevenueIFRS`、セグメント間を含む）も同じく付くことを確かめた。`segment-revenue.mjs` の会員別の読み取りを `memberFacts` に切り出し、売上の表と同じ規則（各会員1値・会社自身の合計と丸めの範囲で一致）で利益と売上を読む。候補の要素のうち合計と一致するものがちょうど1つの場合だけ採り、2つ以上（営業利益と経常利益の両方）は曖昧として採らない。売上の表の全事業に利益と売上がそろう場合だけ `segmentRevenue.profit` に書く（integrity が同じ事業の組であることを検査）。分析に A4「セグメント別の利益率」（利益 ÷ セグメントの売上高、計算値。その他は除く）を足し、Q2 に「{利益}率が最も高いのは〇〇で x%。売上構成比は y%。」を加えた。Q2 は最大2文とし、5文の中では Q1 が最後の文を譲る。既登録分へは refresh-financials の手動入力 `backfill_segment_profit` で、売上の表が引用する同じ有報から足す。

**第3段階の実測（2026-11-24、Actions 実行 45473329343）**：売上の表を持つ1,755社のうち1,543社に読めた。読めなかった212社の内訳：利益が無いか合計と一致しない75、売上高が無いか合計と一致しない54、売上が正でない事業がある35、利益の要素が2つ以上合計と一致する（曖昧）30、セグメント名が事業に当たらない18。測度は営業利益1,457社・経常利益80社・継続事業からの税引前利益6社。**レビューで見つけた誤り**：IFRS の6社（キッコーマン・日本航空ほか）はセグメントの税引前利益が全て「－」で、「－」を0と読む売上の表の規則のままだと合計の「－」と一致してしまい、利益率 0.0% の文になった。セグメント利益の読み取りでは「－」を「記載なし」として扱う（strict）よう直し、この6社の利益は登録しない（後の実行で別の測度が合えば入る）。登録は1,537社。

**Q3「何に力を入れているか」（2026-11-25、運営者「完璧な構築までどんどん進めて」）**：probe（ADEKA・SUBARU・キーエンス・アキレス）で要素を実書類と照合した。研究開発費は【研究開発活動】の総額（`ResearchAndDevelopmentExpensesResearchAndDevelopmentActivities`）、IFRS の当期に費用認識した研究開発費、販売費及び一般管理費の研究開発費の順に、連結・メンバーなしの文脈だけを読む（セグメントや提出会社の値は採らない）。事業別の設備投資はセグメント情報の「有形固定資産及び無形固定資産の増加額」、IFRS の「非流動資産の増加額」（期末時点の事実）、設備投資等の概要の順に、セグメント利益と同じ規則（各会員1値・会社の合計と一致・「－」は記載なし・全事業）で読む。データは `researchAndDevelopment`（最上位、財務レコードの年度・売上高未満を integrity が検査）と `segmentRevenue.capex`。分析は A5「研究開発費」（印字値と売上高比）と A6「事業別の設備投資」（事業ごとの割合、その他は除く）。文は「事業別に見ると、{項目}の x% は〇〇。」、なければ「研究開発費は x で、売上高の y%。」。5文の配分は Q1 3・Q2 1・Q3 1 とし、三つの問いに一度ずつ答える（Q2 は利益率の文、なければ寄与の文）。既登録分は手動入力 `backfill_q3`（各社が既に引用している有報だけを読む）。意図の断定はしない（「力を入れている」とは書かず、お金の配分の事実だけ）。

**Q3 の実測（2026-11-25、Actions 実行 45546506269・PR #116）**：全3,900件のうち、研究開発費2,049社（【研究開発活動】の総額1,969・販売費及び一般管理費75・IFRS 5）、事業別の設備投資1,059社（有形固定資産及び無形固定資産の増加額1,045・設備投資額11・非流動資産の増加額3）。登録しなかった主な理由：研究開発費の印字がない1,800（研究開発をしていない、または金額を書かない会社）、事業別の設備投資が無いか合計と一致しない681、研究開発費が売上高以上または売上高がない34。研究開発費が売上高の3割を超える16社は創薬ベンチャーが中心で、印字どおり。公開3,119社で「この会社の今」は4〜5文が2,200社、Q3 の文が出る会社は研究開発費か事業別の設備投資を持つ会社。

**分析訓練との接続**：(1) 予測の照合（STEP 3）に STEP 4 フィードバックとして、照合した年度と同じ年度の「この会社の今」の Q1 文（純利益の増減・利益の分解・設備投資）を表示する（会社ページと分析レポートのみ。一括の /predictions.json には含めない）。(2) 今日の1問に「読み解き」の問いを追加：「〇〇の経常利益は前期から減りました。この増減に大きく効いたのは？ 売上の増減／利益率の変化」。片方がもう片方の2倍以上のときだけ出題し、答え合わせは「この会社の今」の文そのもの。12ステップのコースは変えない。

**誤読ケースの人手確認（2026-11-25）**：純利益が2割以上減り、設備投資が3割以上増え、営業CFが設備投資を上回る売上高3,000億円以上の4社（SUBARU・ネクソン・武蔵精密工業・電源開発）の文を読んだ。SUBARU は「利益減＝危ない」ではなく、設備投資 +37.2%・減価償却費 2,711億円・営業CF 3,582億円が並び、メモの狙いどおりに読める。武蔵精密工業と電源開発は、経常利益が増えたのに純利益が減っており、文だけでは食い違って見えた。そこで、純利益と利益の行が逆向きに動いた期に限り、純利益の文に A1 の差（税・特別損益などの変動）を添える（「純利益の増減は前期比 −65億円。このうち税・特別損益などの変動による分は −88億円。」）。ネクソンは運転資本の材料がなく、設備投資の文が出ない（C2 の条件どおり）。

**やらないこと**：買い／売り・安全／危険の判断、スコア・順位、自前の業績予測、経営者の意図の断定（会社自身の記述の引用を除く）、データの無い会社への定型文。

## JCE-111 — 2026-11-25: 特集ページの再設計 — 答えを先に、数字は棒で、目次と次の一本

運営者指示（2026-11-25）「特集のページは質素で読む人の気力を削がれる。スクロール中心で読みにくい。読まれている記事やサイトを調査し、デザインと UI/UX を分析して構築する」。

**調査と分析**：データ報道の設計（CHI 2024「Design Patterns for Data-Driven News Articles」の72パターン、FT の John Burn-Murdoch の「注釈で明快にする」、Flourish・Shorthand・Observable の実践ガイド、Distill のスクロール型と段階型の比較）と、国内のオウンドメディア改善の知見（見出しと目次の連動で「いまどこにいるか」を示す、ヒートマップで読み飛ばされる冒頭を削る）を確認した。共通するのは (1) 結論と主要な数字を冒頭に置く（逆ピラミッド）、(2) 数字の列は表より図で、ただし単純なデータに凝った対話型は向かない、(3) 現在地がわかる目次と進捗、(4) 読み終えた人に次の一本を出す、の4点。旧デザインは、黒い大見出しの後に段落と表が縦に続くだけで、要点も数字の強調も目次もなく、20行の表がそのまま並ぶため「スクロールして探す」ページになっていた。

**判断**：
1. **一覧**：最新の特集を大きなカード、残りを格子のカードにする。各カードは主題（海外売上・給与・成長・雇用・配当・生産性）、主要な数字1つ、題、2行の副題、読了時間。数字を先に見せて選ばせる。
2. **記事の冒頭**：色帯の見出し（パンくず・題・副題・読了時間・出典）、その下に主要な数字3つのカード、「この特集のポイント」（番号つき2〜3文）。読者は冒頭だけで結論を持ち帰れる。
3. **目次**：広い画面は左に追従する目次、スマートフォンは開閉できる目次。見出しに番号（01, 02…）と錨。全特集で最初の表の前に「業界で見る」の見出しを置き、表がすべて目次から届くようにした。上端に読了の進捗バー（唯一のクライアント部品、装飾のみ）。
4. **表 → 棒**：表の各行に数値（`bar`）を持たせ、名前と印字した値を1行に、その下に全幅の棒を描く。棒は値を描くだけで独自の数字を持たない。長い表は8行を見せ、残りは「残りN件を表示」で畳む。注記（計算値・範囲・式）はそのまま。
5. **終わり**：関連の企業・業界・用語をチップで、「次に読む特集」をカードで3本。
6. **データ**：`Feature` に `topic`・`keyFigures`・`takeaways` を追加。いずれも feature-articles.ts で本文と同じ計算値から組み立て、手書きしない（JCE-074 の規則のまま）。配当の2表は「割合」を先頭の列に並べ替えた（棒が割合を描くため）。

**やらないこと**：スクロール連動の演出（データが単純なため）、写真の追加（特集の写真の方針は変えない）、文中の数字の手書き。

### JCE-112 · 2026-11-25 · Accepted (operator) — A five-year table with no parent-attributable row: the total 当期利益, under its own label, with a disclosure note

日本電波工業 (6779) and ＨＯＹＡ (7741) could not be registered at all. Both are IFRS filers whose
連結経営指標等 prints no parent-attributable profit row: the five-year table's only bottom line is
「当期利益」, the total including non-controlling interests (tagged `ProfitLossIFRSSummaryOfBusinessResults`;
the attributable element is not tagged, and the attributable figure exists only in the P&L, for two years —
no five-year series can be built from it). The extractor refused the total as net income and
verify-financials' attribution rule refused the label, so intake failed both companies. The distinction the
rules protect is real — for ＨＯＹＡ the total (251,451百万円) and the parent-attributable profit
(253,085百万円) measurably differ — so presenting the total *as* parent-attributable net income would
fabricate (invariant 1). Asked, the operator decided (2026-11-25): **relax the attribution requirement for
this case only, and register both companies.**

- **Scope, kept narrow.** The relaxation covers only the label/attribution requirement, and only where the
  five-year table prints no attributable row at all. The extractor's fallback
  (`NET_INCOME_TOTAL_ELEMENTS` in `evidence-pack.mjs`) fires solely when no attributable element is tagged
  in the table the pack reads, so a filer that tags an attributable row is always served that row and can
  never reach the exception. The rule is not disabled, and no other company is affected.
- **The figures are the filing's, as printed.** Values come from the tagged total, unaltered. The series
  keeps the filing's own printed label (「当期利益」); it is never renamed to 当期純利益 or worded to suggest
  parent attribution. The page's column title and the ratio formula already use the entry's label verbatim,
  so both show 当期利益.
- **Disclosure is mandatory and machine-checked.** The pack flags the case
  (`figures.netIncomeIsTotalProfit`) and warns; every financials row of the entry must carry a note stating
  that the summary's profit is 当期利益 including non-controlling interests and differs from the
  parent-attributable profit. verify-financials admits the unattributed label only when the pack flag is
  set, the matched candidate is the total element, and the row's note carries that disclosure — otherwise
  the old failure stands.
- EXTRACTOR_VERSION 10 → 11, so packs built before the fallback rebuild instead of being reused.

（記録上の注記：登録ツリー jce-live の decisions.md では JCE-039 として記録されたが、main の JCE-039 は AdSense の決定で既に使われているため、main では JCE-112 に振り替えて収録した。内容は同一。）

## JCE-113 — 2026-11-25: 特集一覧を「雑誌・ニュースの表紙」の型に — 写真・テーマ・注目・新着・サイドバー

運営者指示（2026-11-25）：参考デザイン（画像）を添えて「特集記事のデザインを、市場のデザインも分析して構築する」。

**市場の型の分析**（日経電子版の特集、東洋経済オンライン、NewsPicks、Forbes JAPAN、note の特集ページ、統計サイトの「データで見る」系）：

1. **写真の帯で「どこにいるか」を示す**：表紙は写真＋大きな見出し語で始まり、本文の一覧はその下。文字だけの見出しは「まだ準備中」に見えやすい。
2. **テーマのチップを最上部に**：読者は記事名より先に関心（海外・給与・雇用…）で選ぶ。横並びのチップは、スマートフォンでは横スクロールで1行に収まる。
3. **注目の1本を大きく**：写真・見出し・リードの3点と、データ系メディアでは**数字の囲み**を横に並べる。数字が先にある見出しはクリック率が高いという、データ系記事で繰り返し見られる型。
4. **新着はサムネイルのリスト**：カードの格子より、写真・日付・見出し・2行のリードを1行に並べたリストのほうが、縦に速く読み流せる（ニュースサイトの標準）。
5. **サイドバーに順位とカテゴリ**：多くのサイトは閲覧数の順位を置く。
6. **最後に案内の帯**：サイトの説明ページへの導線。

**この事典で変えたこと**：

- **閲覧数の順位は置かない**：示してよい閲覧数を持たない（Cloudflare の集計は表示しない）。参考画像の「人気の特集」と閲覧数は作り話になるため、サイドバーは「**数字で選ぶ**」として、各特集の先頭の keyFigure を並べる（順位ではなく掲載順の番号）。注目の特集の囲みも、参考画像の「前年同期比」や推移の線は持たない数字なので描かず、その特集の keyFigures（計算値）だけを出す。
- **写真**は業界ページの Unsplash / Pexels の写真を流用（`src/assets/features`、出典は src/assets/industries/SOURCES.md）。特集ごとに場面の合うもの（海外売上＝港、給与＝職場、配当＝書類と電卓…）。企業・製品・ブランドが写るものは使わない：港の船の写真（`trading.jpg`）は端末事業者の看板が写るため表紙の帯に使わず、工場の写真にした。写真のない特集は従来どおり色の帯。JCE-111 の「写真は追加しない」はこれで改める（新しい写真は取得していない）。
- **案内の帯**のコピーは作らず、サイトの説明（「何をしている会社かが、わかる。」）を使う。
- 記事ページの見出しの帯にも同じ写真を紺のグラデーションの下に敷く。数字の囲みは帯の上に重ねる。

**確認**：デスクトップ（1280px）・スマートフォン（390px）・ライト／ダークで表示し、横はみ出しなし。`tests/features.test.ts` に写真の対応先が公開中の特集 id であることを追加。

## JCE-114 — 2026-11-25: プレミアムの企業レポートを「目次つきの分析資料」に — 要点とチャートを先に、表は畳んで PDF では開く

運営者指示（2026-11-25、参考デザインの画像つき）：「プレミアムの分析資料が見にくい。指標を追加し、目次を設定したデザインにしたい。指標チャートで理解でき、数字のデータは PDF で印刷でき、畳んで書かれたデザインで、ページを開けば分析内容が理解できるように」。

**構成**（`/companies/[id]/report`、`company-report.tsx`）：

1. **見出しの帯**（紺）：PREMIUM ANALYSIS、社名、正式名・証券コード・業種、最新期・データ時点・出典のバッジ、「印刷・PDFで保存」。
2. **目次**：広い画面は左に追従する目次と PDF 保存の案内、スマートフォンは章の横スクロール。章に番号（1. 企業概要と要点 …）。データのない章は出さず、番号は詰める。
3. **1章 企業概要と要点**：事業の説明、**指標カード**（売上・利益の行・純利益の印字値と前期比〔計算値、JCE-047 の比較可能性の規則〕、海外売上高比率〔計算値〕。地域別がない会社は従業員数）、「この会社の今」（JCE-110）。
4. **2章 業績の推移**：棒（売上高と利益の行、印字値）と線（利益の行 ÷ 売上高、計算値、右目盛）の複合チャート。5期の表は「数字の表」として畳む。
5. **3章 事業と地域の構成**：事業別・地域別のドーナツ（割合は計算値、6区分を超える分は「その他のN区分」にまとめて名前で示す）。金額の表は畳む。
6. **4章 業界の中での位置**：計算値の各指標を1行に、自社の点・業界の中央値の線・第1〜第3四分位の帯で描き、中央値と順位を添える。計算式と分布の全表は畳む。
7. **5章 5観点の分析**：観点ごとに題と説明だけを見せ、表は開いて読む（`CompanyAnalysisSection` の `folded`）。分布の全体像も1つの折りたたみに。
8. **6章 予測と答え合わせ**（無料）、**7章 出典とデータの来歴**。

**畳んだ表と PDF**：画面では `<details>` で畳むが、印刷（ボタンでもブラウザのメニューでも）の直前にすべて開き、印刷後に元へ戻す（`report-print-button.tsx` の beforeprint / afterprint）。PDF には画面で畳んだ表もすべて入る。印刷の改ページは章単位で避けるのをやめ（章が1ページを超え、1ページ目が空いた）、図・カード・行・表の行を割らない規則にした。閲覧統計の同意バーは印刷しない。

**参考画像から採らなかったもの**：時価総額・PER・PBR・配当利回りの「関連データ」（不変条件4）、会社の建物やロゴの写真（企業ページに写真を置かない）、「世界最大級」「リーダー」のような評価の語（不変条件1・4）、根拠のない「本章のポイント」の文。要点は「この会社の今」（固定テンプレートと表の数字だけ）で置き換える。チャートの色は系列を分けるだけで、増減の良し悪しを色で示さない。

**確認**：AGC・トヨタ自動車で 1280px／390px、ライト／ダーク、A4 PDF（Chromium）を確認。チャートはスマートフォン用に幅の狭い版を別に描き、文字の大きさを保つ。`tests/report-layout.test.ts`：利益率の線の値が印字値の比と一致、ドーナツの割合と「その他」のまとめ、目次の錨と章、畳んだ表がページ内にあること、市場の数字がないこと。
## JCE-115 — 2026-11-25: 管理画面に「入口フォーム」セクション — 申込の状態はローカルの状態ファイルにだけ置く

運営者指示（2026-11-25）「先日 Claude Code で作った管理ページの中で、入口フォーム（無料の1社分析体験）の内容を管理できるようにしてほしい」。

**判断**：
1. **置き場所**：フォーム回答（連絡先メールを含む個人情報）は `.data/entrance-form.json` にだけ置く。`/.data/` は既に gitignore 対象（読者報告の開発用保存先と同じ置き方）で、コミット対象ファイル・公開ページには絶対に含めない。本番サーバーにこのファイルは存在しないため、管理 lib は登録キューの画面と同じく `available: false` を返し、「無い」ことと「空」を取り違えない。
2. **同期経路**：回答の読み取りは、毎朝の新規回答チェックと同じ Google Forms コネクタ（`hatch_gws_cli forms forms responses list`、formId `17uAeskow3hUo8v3CsUE1qiAPmCtpCXG5sMB_Kdmuycs`）を使う。アプリ自身は Google に接続しない。コネクタの出力を `scripts/admin/sync-entrance-form.mjs` が状態ファイルへ取り込み、既存の対応ステータスとメモは保持する（同期で運営側の記録を消さない）。
3. **対応ステータスの書き込み**：管理画面からのステータス・メモの保存は、内容編集と同じくローカル開発環境でのみ有効（`localEditingStatus` のガード）。本番の /admin からは書き込めない（JCE-016 の原則どおり、本番は何も書かない）。
4. **画面**：`/admin/entrance` に漏斗サマリ（累計回答数／未対応数／β案内希望数）と新しい順の一覧を置き、各行で会社・β希望・ステータス・メモを管理する。ダッシュボードの統計カードと管理ナビにも加える。

役割分担: 設計 = engineering、実装 = engineering、検証 = engineering（型・lint・テスト・ローカル描画確認）。

## JCE-118 — 2026-11-25: 5観点のレーダーチャート — 各軸は代表の指標1つの業界パーセンタイル、合成しない

（記録上の注記：PR #123 では JCE-115 として入ったが、先に入った「入口フォーム」の記録と番号が重なったため JCE-118 に振り替えた。）

運営者指示（2026-11-25）：「5観点の分析をレーダーチャート形式で、規模と地位・成長・収益性・財務の安定・外部環境との接続の5つの問いを使って視覚的に分析できるようにしたい。業界での企業のポジションがわかる」。

**仕組み**（`src/lib/perspective-radar.ts`、`PerspectiveRadar`）：各観点に**代表の指標を1つ**、決まった順で割り当て、その指標の業界内パーセンタイル（分析の表がすでに印字している「その値より小さい会社の割合」）を中心からの距離にする。

| 観点 | 指標（最初に分布のあるものを使う） |
|---|---|
| 規模と地位 | 売上高（印字値） |
| 成長 | 売上高の5期の伸び → 売上高の前期比 |
| 収益性 | 利益率（同種の利益行どうし）→ 純利益率 |
| 財務の安定 | 自己資本比率 |
| 外部環境との接続 | 海外売上高比率 |

25・50・75 の輪が業界の四分位、点線の 50 が中央値。軸の名前の下に指標名とパーセンタイルを書き、横の一覧に値・期・順位を添える。

**合成しない**（JCE-078 仕様 §7「観点ごとに位置を示し、合成しない」を守る形にした）：観点の中の複数の行を平均した「観点スコア」は作らない。5軸を足す・重みをつける・面積を数字にすることもしない。図の注記に「大きいことは良いことを意味しない（自己資本比率や海外売上高比率は会社の形）」「点数ではない」と明記する。分布のない軸は「分布なし」と書き、点を置かない（推測しない）。分布のある軸が3本未満の会社には図を出さない。

**置き場所**：企業レポートの「5観点の分析」の章の冒頭（無料の範囲。数字は同じ章の表と同じ）。

**確認**：AGC で 1280px／390px、ライト／ダーク。`tests/report-layout.test.ts`：各軸の値が対応する行の業界パーセンタイルそのものであること（掲載80社）、指標の切り替え順、図と注記が出ること。

## JCE-116 — 2026-11-25: 業界の説明を3行に畳み、企業ページの最初の画面に数字とグラフを入れる

運営者指示（2026-11-25）：「業界の流れが長文で、スクロールしないと流れとスキームがわからない。簡潔にするか文字を小さく」「企業ページは指標・グラフが見えるようにトップを圧縮」。

- **業界の流れ／仕組み**：説明文は文字を一段小さく（スマートフォン 15px）し、3行で畳んで「続きを読む」でその場に開く（`<details>`、全文はページ内にあり検索にも残る）。工程図との間隔を詰め、工程・支える産業のカードの写真を 3:2 から 5:2（タブレット以上 2:1）に低くした。説明文そのものは変えない（出典つきの記述のため要約を書き足さない）。
- **企業ページの最初の画面**（スマートフォン）：説明文を一段小さく、事業のチップを折り返さず1行の横スクロールに、出典バッジは有報の題名を「有報」と短く（PC は従来どおり題名）、「このページの内容」の1行はスマートフォンでは出さない（直下のタブと同じ内容のため）。結果、390px の幅で売上高・純利益・従業員数と「業績の推移」のグラフが最初の画面に入る。

確認：半導体業界・AGC を 1280px／390px で表示。vitest 全件 pass。

## JCE-117 — 2026-11-25: 本番の管理アプリ（admin-app）にも「入口フォーム」— 回答は KV にだけ置き、対応は運用データとして直接書く

運営者指示（2026-11-25）「プッシュして。管理ページのどこにもない」：JCE-115 の入口フォーム管理は Next 側の管理画面に入ったが、運営者が実際に使うのは admin.kigyo-hyakka.com（admin-app/ の Worker、JCE-109）で、そちらには無かった。

**判断**：
1. **置き場所**：フォーム回答（連絡先メールを含む個人情報）は、このアプリ専用の Cloudflare KV 名前空間 `kigyo-admin-entrance` にだけ置く。JCE-115 の「状態ファイルにだけ置き、リポジトリ・公開ページには絶対に含めない」を、ローカルファイルを持てない Worker では KV に置き換えた。バインドが無い間は画面が「未設定」を返し、「無い」ことと「空」を取り違えない（JCE-115 と同じ）。
2. **同期経路**：アプリ自身は Google に接続しない。読み取りは毎朝の新規回答チェックと同じ Google Forms コネクタで、その出力を `scripts/admin/sync-entrance-kv.mjs` が KV へ取り込む（Cloudflare API トークンは実行環境にだけ置く）。マージ規則は JCE-115 の同期と同一：回答項目は Google が正、対応ステータスとメモは保持する。
3. **対応ステータスの書き込み**：掲載コンテンツの変更は従来どおりプルリクエスト経由（不変条件9）。ただし対応ステータスとメモは公開されない運用データであり、Next 側でも状態ファイルへの直接書き込みだったため、Worker から KV へ直接書く。閲覧権限では書けない。
4. **画面**：admin-app のナビに「入口フォーム」を追加し、ファネル集計（回答数／未対応／体験提供済み／β案内済み、β希望数つき）と新しい順の一覧、各回答のステータス変更とメモを JCE-115 と同じ項目・ラベルで置く。システム設定にも KV の設定状態を出す。

役割分担: 設計 = engineering、実装 = engineering、検証 = engineering（型・lint・テスト）。

## JCE-119 — 2026-11-25: 特集の業界別テーブルの行リンクを、業界ページから「特集×業界の企業ランキング」へ

運営者指示（2026-11-25、スクリーンショット付き）「特集の中で産業別でリンクが貼ってあるのですが、このリンクをタップすると業界に飛ぶのではなくその産業の中での項目別で企業のランキングが出るようにしてほしい」。役割分担: 設計 = engineering、実装 = engineering、検証 = data-quality。

**対象**：6特集の業界別テーブル7件の業界行リンク — 海外売上高比率（中央値）、平均年間給与（中央値）、5期の売上成長（中央値）、従業員数（合計／中央値の2表）、配当を出す会社の割合、従業員1人あたり売上高（中央値）。いずれも `src/lib/feature-articles.ts` が組み立てる `data-table` の業界行である。

**判断**：
1. **リンク先の変更**：業界行の遷移先を `/industries/<業界>` から新設の `/features/<特集>/rankings/<業界>` へ変える。ランキングは、その特集の項目について、その業界を主な業界とする公開企業のうち値を持つ会社を、値の高い順に並べたもの。各行は順位・企業名（企業ページへのリンク）・値・対象期。会社ごとの値は特集の表とまったく同じ入力から同じ関数で求める（売上成長は `revenueGrowth5y`、給与・配当は印字値、従業員数と1人あたり売上高は最新期の印字値）ため、特集の中央値とランキングは食い違わない。海外売上高比率だけは例外で、`companyMetrics` の percent は表示用に0.1ptへ丸めた値であり特集の中央値（`buildIndustryFigures` が印字の地域別売上高から全精度で求める）とは一致しないため、ランキングも地域別売上高の印字値から全精度で再計算する（表示はどちらも小数1桁で一致する）。実装は `src/lib/feature-rankings.ts` に集約し、静的パラメータは特集の表に実際にあるリンクから導出する（リンクのある組には必ずページがあり、リンクのない組には作らない）。
2. **ランキングは値の順序であって評価ではない**：並びは既存指標の値そのものの順序で、独自スコアや会社の良し悪しではないことをページ冒頭に明記する（JCE-062 の業界ランキングと同じ言い方）。計算値には「計算値」と式を、印字値には印字どおりであることを、特集の表の注記と同じ言葉で示す。
3. **配当特集の扱い**：特集の項目「配当を出す会社の割合」は業界の集計で、会社には帰属しない。そのためランキングの項目は各社に印字された1株当たり配当額とし、特集本文の注意（金額の大小を会社どうしで比べても株主への戻し方の手厚さは測れない）をランキングにもそのまま掲げる。従業員1人あたり売上高も、特集本文の注意（効率の順位ではない）を掲げる。
4. **対象外**：本文中の `[[industry:]]` リンクと末尾の関連業界チップは、文章の中で業界そのものへ言及するリンクなので業界ページのままにする。サイト内の他の業界リンクは変更しない。ランキングページからは特集へ戻る導線と、業界ページへのリンクも置く。

**やらないこと**：業界ページ側の変更、新しい指標の追加、値を持たない会社の推測での掲載。

（採番の注記：当初 JCE-113 として記録したが、main の JCE-113（特集一覧の再設計）と JCE-116（業界ページの再設計）が既に使われていたため、JCE-119 に振り替えた。）

## JCE-120 — 2026-11-26: 意味の層を有料βの中核へ —「この会社の今」の答えを分析レイヤーの権利内へ移す

運営者判断（2026-11-25）：現行の有料差分は「開放の対価」に寄っており、月1,100円の利用者メリットが小さい。意味の層（JCE-110）を有料βの中核に据える。

**判断**：
1. **JCE-110 の判断4（無料部に置く）を改める**。「この会社の今」の全文は、会社ページでも企業レポートでも、分析レイヤーの権利（JCE-101 の `analysisEntitled`）の内側に置く。無料で見られるのは見出しと、その会社が答えを持つ問いまでで、文も数字も出さない。分析の既存の境界（各観点の自社値と業界の中央値は無料、全体像は権利内）と同じ形の入口であり、販売側の正である R8 差分表の「分解して読む（無料は入口だけ）」と一致する。入口に文が混ざらないことは `tests/meaning-gate.test.ts` が静的マークアップ（＝権利のない読者の初期表示）で担保する。
2. **ゲートは `MeaningGate`**（`src/components/company/analysis-gate.tsx`）。AnalysisGate と同じ権利・同じ購入コードで開き、どちらのフォームに入力しても両方が開く。権利がない間は入口とコード入力だけを描き、印刷にも出さない。`ANALYSIS_FEATURES_OPEN` が切れている間は入口だけが立ち、レイヤーの準備中表示は AnalysisGate 側が担う。コード入力の送信処理は両ゲートで共通化した。
3. **生成の規則は JCE-110 のまま変えない**。文の生成・判断語彙の禁止・文中の数値と表の突合は `tests/meaning-layer.test.ts` が従来どおり全公開企業で担保する。本変更は配置だけであり、テンプレートも入力も変えていない。
4. **学習層での利用は従来どおり無料のまま**。予測の照合フィードバックと「今日の1問」の読み解きは、JCE-110 の分析訓練との接続として学習の動線に残す（学習自体は無料、という JCE-082 の方針）。有料境界を移すのは会社ページとレポートの分析レイヤーに限る。
5. **販売側の表示を揃える**。会社ページの境界説明、AnalysisGate の案内、`/analysis` の説明、`/learn` の有料β案内に、「この会社の今」の答えが有料範囲であることを明記した。

**実測（配置変更時点の集計）**：公開3,133社のうち3,108社に1文以上（5文1,176社・4文1,026社・3文766社・2文109社・1文31社）。0文の25社は、比較できる期が揃わない等の理由で JCE-110 の規則どおり文を作らない会社（例：アルトナー）。誤読ケースの確認は JCE-110 の人手確認（SUBARU・武蔵精密工業ほか）を引き継ぎ、生成文そのものは変えていない。

**やらないこと**：生成テンプレートの追加・変更、学習層の有料化、JCE-075 で開いた既存機能の再有料化（意味の層は JCE-078 の新規分析層に属する要約であり、その無料配置は JCE-110 の判断だったものを本判断で改める）。

## JCE-121 — 2026-11-25: 経済指標スナップショットの更新を週次でシステム化 — 取得も検証も AI なし、異常時は PR を作らず止まる

運営者指示（2026-11-25）：「プッシュした後は経済指標の更新はシステムで動き更新にAIを必要としないか確認。システムで動いていなければ設計してシステム化の構築」。

**実測した現状**：取得スクリプト2本（`fetch-indicators.py`＝FRED 収録の7系列、`fetch-indicators-primary.py`＝日本の一次情報8系列）はどちらも決定的処理で AI を一切使わないが、**定期実行は存在しなかった**。GitHub Actions の scheduled workflow は refresh-financials.yml の1本（EDINET 専用）だけで指標には触れず、この環境の cron にも指標更新ジョブはない。FRED 側スクリプトの docstring 自身が「月次手続き：人が実行し、差分を確認してコミット」と書いており、実態もそのとおりだった（一次情報8系列の投入は JCE-107 の手作業、updatedAt 2026-11-24／FRED 7系列は 2026-11-21 で止まっている）。判定：**全て手動**。

**構築したもの**：

1. **検証ゲート `scripts/indicators/validate-indicator-update.py`**（新規、決定的処理のみ）。取得後のスナップショットをコミット済みと比較し、次を異常として止める（exit 1、理由を要約に出す）：系列ファイルの増減／定義（id・名称・出典・単位・頻度）の変更／日付の逆行・非数値・**新規の**欠落（公表機関自身の欠落＝BLS の 2025年10月 CPI のように既登録の穴は公表側のものとして通す）／最新日付の後退／取得範囲（10年）内での観測の消失／最新から37か月より古い値の変更（基準改定か取得の破損であり、系列の定義に関わるので人が判断する）／重なる値の10%超の同時変更。新しい観測と公表機関による直近の改定は PR 本文用に old → new で列挙する。`updatedAt` は比較対象外（毎回変わるため、それだけの差分は「変更なし」として静かに終わる）。
2. **workflow への同梱**：新しい scheduled workflow は作らない（tests/single-detector.test.ts が「scheduled は refresh-financials.yml の1本だけ」と固定しており、その原則にも触れない）。refresh-financials.yml に `indicators` ジョブと `refresh_indicators` 入力を足す差分を `docs/jce-121-workflow-addition.md` に用意した（JCE-106 と同じ運用：**GitHub Web UI で運営者が追加するまでは未実装**）。ジョブは日次スケジュールの中で月曜（JST）に自己ゲートし、手動実行では入力で即時実行できる。取得→検証→指標テスト＋data-integrity→許可範囲外の変更拒否→PR 作成。**自動マージはしない**（AUTO_MERGE_FINANCIALS の対象外）。鍵は不要（全て公開された一次情報と FRED CSV）。実質賃金の旧式 .xls 変換のため LibreOffice を入れる。

**ローカル実走（2026-11-25、この作業ツリー）**：

- 一次情報8系列を取得し切り、内容検証も全て通過（CPI 82点 ..2026-10／企業物価 130点 ..2026-10／鉱工業 105点 ..2026-09／有効求人倍率 129点 ..2026-09／実質賃金 129点 ..2026-09／輸出 129点 ..2026-09／経常収支 129点 ..2026-09／短観 43点 ..2026Q3）。
- 検証ゲート：正常系は exit 0 で、差分は実質賃金の新しい観測1件（2026-09-01 = 83.5）だけを正しく報告。異常系の注入試験3件（深い過去の値の改変／範囲内の観測の削除／復元）も、異常を理由つきで止め、復元後に通ることを確認した。
- `tests/indicators-primary.test.ts` は取得後のデータで 9件全て合格。
- **FRED はこの VM からは取得できなかった**（fred.stlouisfed.org が応答せず curl がタイムアウト。2026-11-21 の実走では取得できており、経路自体の問題ではない）。そのため FRED 7系列のローカル実走確認は未完了。Actions のネットワークでは通常経路であり、workflow 側は取得失敗時に理由つきで止まる作りにしてある。なお、この実走で得た実質賃金の新観測は本ブランチには混ぜていない（データ変更はシステムの PR で出すのが筋であり、作業ツリーは HEAD に戻した）。

**残る運営者作業**：`docs/jce-121-workflow-addition.md` の差分を GitHub Web UI で `.github/workflows/refresh-financials.yml` に追加すること。追加後の確認手順（手動実行で `refresh_indicators` を有効にする等）も同文書にある。

## JCE-122 — 2026-11-26: 意味の層フェーズ2 —「投資と利益の関係」をCF明細の2期で精密化する

運営者指示（2026-11-26「フェーズ2へ」）。設計メモ（意味の層_設計メモ_2026-11-25）§7 のフェーズ2。番号は JCE-121 が経済指標の自動更新（JCE-121、別ブランチで確定済み）に使われているため 122 とする。

**実測した前提**：明細（financialStatements）は公開3,133社のうち2,139社が2期分・103社が1期分で、3期以上を持つ社は0社。最新期に設備投資・減価償却費・営業CFの3行が揃うのは2,164社、2期とも揃うのは2,075社。したがって複数期の文は「同じ有報の2期」が上限であり、それを超える継続期間は書かない。

**判断**：
1. **C2（資金ギャップ）に計算行を4つ足す**。いずれも計算値として式を併記し、分母が正の印字値でないときは行自体を出さない（既存の条件付き行と同じ流儀）。
   - `c2-capex-operating-ratio`：設備投資 ÷ 営業キャッシュフロー（営業CFが0以下の期は出さない）。
   - `c2-capex-depreciation-ratio`：設備投資 ÷ 減価償却費（最新期）。
   - `c2-capex-depreciation-ratio-prev`：前期の同割合。行の年度は前期自身の年度とし、同じ有報の前期欄からのみ読む（`c2-capex-growth` と同じ条件）。
   - `c2-depreciation-growth`：減価償却費の前期比（同じ有報の前期欄）。
2. **文は既存の `q1-capex-cash` を拡張する**（新しい文は作らない。要約ブロックの文数・配分は変えない）。追加されるのは、(a) 減価償却費の前期比の併記、(b)「設備投資は営業キャッシュフローの X% にあたる」、(c) 減価償却費に対する割合の前期・最新期の併記と、両期の大小関係（上回っている／下回っている、4通りの組合せ）。大小関係は2つの割合行の値からのみ判定し、どちらかの期が同額（100%）のときは (c) 自体を作らない。意図の言い切り（「拡大投資をしている」等）は従来どおり書かない。
3. **前期の数値を文に入れるときは前期行自身の年度を持つ行から取る**。意味層テストの突合規則を拡張し、「-prev」で終わる行はその行自身の年度（グループが扱う年度の範囲内）であることを検証する。それ以外の行は従来どおり文の年度と一致すること。
4. **明細のない会社・前期欄のない会社はフェーズ1の文のまま**。文の有無と会社の分布は JCE-110／120 の規則を引き継ぐ。

**実測（登録データに対する複製計算＋実パイプラインでの生成確認）**：設備投資の文が出る会社（C2 が立つ会社）は1,765社。そのうち営業CF比の節が付くのは1,585社（残り180社は営業CFが0以下で割合を言わない）、減価償却費の前期比が付くのは1,755社、2期の割合と大小関係まで付くのは1,754社（両期とも上回る616社／両期とも下回る666社／下→上233社／上→下239社、同額で作らない1社）。文の総数と会社の分布（5文1,176社…）はフェーズ1から変わらない。生成例：SUBARU は「設備投資は営業キャッシュフローの 65.4%にあたる。減価償却費に対する設備投資の割合は、前期 73.5%、最新期 86.4%。設備投資は前期・最新期とも減価償却費を下回っている。」まで伸び、明細の材料が揃わない会社（例：スリーディーマトリックス）は従来どおり設備投資の文自体を出さない。

**やらないこと**：3期以上の継続の記述（データが無い）、セグメント別の投資配分（フェーズ3、A3/A6 の前期比較の登録待ち）、投資フェーズの判定語彙の導入。

## JCE-123 — 2026-11-26: 表示言語の切り替え（日本語・英語）— インターフェースを多言語にし、企業の中身は原文のまま

運営者指示（2026-11-26「英語版を作成。色々な言語が使えるようにしたい。ホームの一番上の通知ベルの隣に JP、US などと表示し、タップで選べる形式に。設定画面からも選べるように」）。

**判断**：
1. **ページは1回だけ（日本語で）書き出し、インターフェースの文字列に各言語を並べて持たせ、CSS で読者の言語だけを見せる**。`<T m={{ ja, en }} />`（`src/components/i18n/t.tsx`）が言語ごとに `data-l` 付きの span を出し、`localeCss()`（`src/lib/i18n.ts`）が `<html data-lang>` に応じて他の言語を隠す。`/en/` のような第2の URL 群は作らない：静的書き出しのページ数（3,000社超）とデプロイ時間が倍になり、企業の中身は翻訳しないため得るものがない。切り替えにリクエストも再描画も要らず、Server Component のまま使える。
2. **言語の選択はこのブラウザの設定（`user-settings` の `language`）に保存し、テーマと同じ描画前スクリプトで `data-lang` と `lang` を付ける**。英語を選んだ読者に日本語のラベルが一瞬出ることはない。未知の値は捨てて日本語にする（`isLocale`）。サーバーには何も送らない。
3. **入口は2か所**。ヘッダーの通知ベルの隣に言語のバッジ（JP／US）を置き、タップで一覧から選ぶ（スマホ・PC とも）。設定の「表示」に「表示言語」のラジオを置く（テーマの上）。両方が同じ保存先を書き換える。
4. **翻訳するのはインターフェースだけ**：ヘッダー・メニュー・下部バー・フッター・設定・ホームの見出しと説明・検索欄・閲覧統計の同意バー。業界名は既存の `INDUSTRY_LABELS.nameEn` を使う。**企業の解説・数字・ラベル・出典は有報の日本語のまま**：訳文はどの有報も述べていない新しい記述になる（不変条件1）。日本語以外を選んだ読者には、ヘッダーの下に「メニューと見出しは英語、企業の中身は原文の日本語で、機械翻訳はしていない」と表示する（`LANGUAGE_NOTE`）。
5. **言語を増やすときは `LOCALES` と `LOCALE_META` に足すだけ**。`Message` は全言語の文字列を必須にしているので、訳の抜けは型検査が列挙する。CSS は `LOCALES` から生成する。

**あわせて直したこと**：PC のヘッダーは 1024〜1279px で日本語でも横にはみ出していた（実測 1,140px／1,024px）。主ナビゲーションの表示を `xl`（1280px）以上にし、それ未満はメニューから辿る形にした。英語でも 1280px で収まる。

**検証**：`tests/i18n.test.ts`（全ナビ項目の全言語、span の出力、CSS、描画前スクリプト、設定の読み戻し）。390px と 1280px で、バッジから英語を選ぶ→再読み込みしても英語、設定で日本語に戻す、を確認。

**やらないこと**：企業・業界・特集・用語の本文の翻訳、言語別 URL、ブラウザの言語からの自動切り替え（読者が選ぶまで日本語）。

## JCE-125 — 2026-11-26: 分析訓練アプリの範囲を訓練そのものに絞る — scope・スプラッシュ・iOSメタ・訓練シェル

運営者指示（2026-11-26）：「分析訓練はWEBアプリで開くとアプリとして動くようにしてほしい」。あわせて「他の情報が多い」。JCE-108 で分析訓練を専用アプリにしたが、マニフェストの scope がサイト全体のため、ホーム画面のアプリが実質百科事典全体の入口になっており、アプリの対象が訓練に絞れていなかった。

**判断**：
1. **マニフェストの scope を /learn に絞る**（JCE-108 判断2の「scope はサイト全体」を改める）。start_url は /learn のまま。アプリの中で完結するのはコース・レッスン・復習キューで、今日の1問（/quiz）・決算定期便（/digest）・企業ページへのリンクはブラウザで開く（scope を適用する Android の場合。iOS は scope を使わない）。訓練の記録は同一オリジンのブラウザ保存域にあり、scope は保存域の範囲ではないので、記録の引き継ぎには影響しない。
2. **スプラッシュの背景を現行のダークUIに合わせる**。background_color を #ffffff から theme_color と同じ #0f1626 にする。
3. **iOS の standalone メタを Apple 名でも併記する**。Next が appleWebApp.capable から出すのは標準名 `mobile-web-app-capable` のみで、Apple 名 `apple-mobile-web-app-capable` を見る環境ではアプリとして開かないことがある。TRAINING_APP_METADATA に `other` で Apple 名を足し、訓練ページ5つ（/learn・レッスン・復習・/quiz・/digest）すべてに行き渡らせる。
4. **サービスワーカーの登録はサイト共通のまま、訓練のアプリシェルをプリキャッシュに足す**。登録を /learn 系だけに狭めない：同じワーカーが JCE-059 のプッシュ通知と百科事典のオフライン閲覧を担っており、狭めると /learn を開かない読者の通知とオフラインが黙って止まる。代わりに SHELL_URLS に /learn/・訓練マニフェスト・訓練アイコンを足し（VERSION v3）、訓練マニフェストも stale-while-revalidate の対象にする。ナビゲーションは従来どおりネットワーク優先なので、古い版のページが残り続けることはない。
5. **ホーム画面追加の導線は既存の TrainingInstall（JCE-108）のまま**。閉じられる小さな案内が既にあるので、バナーは足さない。

**変えないこと**：訓練の記録の保存方式とキー（`src/lib/storage` の localStorage、同一オリジン）、学習の中身、有料βの価格と導線、サイト側のマニフェストとアイコン、プッシュ通知。

## JCE-124 — 2026-11-26: 意味の層フェーズ3 — セグメント前期比較による Q2（何が儲かっているか）の精密化

運営者指示（2026-11-26「フェーズ3へ」）。設計メモ（意味の層_設計メモ_2026-11-25）§7 のフェーズ3。番号は JCE-123 が表示言語の切り替え（2026-11-26、PR #129）に使われたため 124 とする。

**実測した前提**：公開3,133社のうち segmentRevenue を持つのは1,493社、previous（同じ有報の前期欄）があるのは1,430社（95.8%）。A3（セグメント寄与）が立つのは1,428社。Q2 の文が出るのは1,472社（q2-margin 1,288社＋q2-segment 184社）で、A3 のある会社はすべて Q2 の文を持つ。previous のない公開63社は、JCE-105 の backfill（2026-11-23）の後（2026-11-25）にセグメントブロックが登録・更新されたものが多く、dry-run（書き込みなし）では14社がデータ理由で見送り（前期レコードが通常の12か月前にない等）、24社が EDINET_API_KEY がこの環境にないため未判定（残り25社は needs-attention 枠で未試行）。鍵付きの再実行で追加できる可能性があり、登録側の残りとして下に残す。

**判断**：
1. **A3（セグメント別の売上寄与）に事業別の金額増減行 `a3-{businessId}-change` を足す**。寄与行の直後、単位は yen、式は「その事業の売上高 − 前期の売上高」。JCE-122 の C2 への計算行追加と同じ流儀で、文の出典となる行を表にも出す。
2. **文は既存の `q2-segment` を拡張する**（新しい文は作らない。Q2 の文数・配分は変えない。JCE-110 の順序＝q2-margin 先、q2-segment は fallback のまま）。金額の併記は、トップ寄与事業の金額増減が全体の増減と同符号かつ絶対値が全体以下のときに限る（「のうち」が算術的に真のときだけ）。満たすときは「売上高の増減 +300億円 のうち、増加への寄与が最も大きいのは機械事業で +8.0pt（増減 +240億円）。」のように pt と金額を併記し、満たさないときは従来どおり pt のみ。1,428社中895社（62.7%）がこの条件を満たす。満たさない533社は、事業の増減が全体を上回る（最大1610倍）か符号が逆（1社）で、金額を併記すると「のうち」が偽になるため pt のみとする。**寄与率（Δseg/Δtotal）は表示しない**（JCE-097 の理由：全体の増減が小さいときに爆発する）。
3. **符号規則を拡張する**。`isSignedRowKey` を新設し、固定の SIGNED_ROWS に加え `a3-{businessId}-change` の動的キーにも正の値に「+」を付ける（表の「増減」列が含意する符号を文で明示する、従来の流儀）。意味層テストの突合規則も同じ関数を使う。
4. **前期セグメントのない会社はフェーズ1・2の文のまま**。Q2 の文が出る会社数（1,472社）はフェーズ3で変わらない。

**実測（実パイプラインでの生成確認）**：q2-segment が出る184社のうち、円金額形式は128社、pt のみの形式は56社。文の総数と会社の分布（5文1,176社…）はフェーズ1から変わらない。生成例（実パイプラインの出力そのまま）：CCIグループは「売上高の増減 +775億円 のうち、増加への寄与が最も大きいのは銀行業で +84.92pt（増減 +761億円）。」、ＲＥＶＯＬＵＴＩＯＮは構成比の移動が 0.904 と大きいがセグメントの増減が全体を大きく上回るため金額は出さず「売上高の増減 +290億円 のうち、増加への寄与が最も大きいのはクラウドファンディング事業で +561.23pt。」、CINC は前期セグメントが無く Q2 の文自体が出ない（フェーズ1・2の文のまま）。全社スイープ（意味層テスト）は、円金額形式の文が100社を超えることを下限として固定している。

**やらないこと**：Q3 の構成比移動の文、寄与率の表示、3期以上の継続の記述。Q3 の構成比移動は3番目の Q3 スロット（a6・a5 の後）として測ると 5pp 以上で60社・10pp 以上で37社しか届かず、最大の移動（revolution 0.904、kodama-chemical-industry 0.800 など）は範囲変更の可能性が高く、セグメントの再定義と事業の実態変化を区別する材料がない。文が事実でも「構成が変わった」を有機的な変化として誤読させかねないため、範囲変更の区別が付くまで出さない。

**登録側の残り（本フェーズでは実行できず）**：`scripts/pipeline/backfill-segment-prior.mjs --tier all --write` の鍵付き再実行。EDINET_API_KEY は Actions のシークレットにしかなく、refresh-financials.yml には backfill_segment_prior の手動入力がまだ無い。追加は `.github/workflows/` のため運営者が GitHub Web UI で行う（GitHub App 権限では push できない）。手順：入力 `backfill_segment_prior`（boolean）を追加し、backfill ジョブに `node scripts/pipeline/backfill-segment-prior.mjs --tier all --write --summary out/summary.md` を実行するステップを足す。JCE-097 の方式（読むのは各エントリーが既に引用している有報のみ・改訂記録なし・updatedAt 不変更）を守る。期待される追加は公開で最大24社（＋needs-attention 枠の未試行分）。

## JCE-126 — 2026-11-26: 企業レポートの入口を企業ページの上部へ — ヒーロー直下の帯に昇格し、財務末尾のカードは廃止

運営者指示（2026-11-26「プレミアムの企業レポートを各企業ページの見えやすいところに配置して欲しい」）。

**判断**：
1. **入口はヒーローの直下に1つだけ置く**（`src/components/company/report-cta.tsx`）。ネイビーの帯に「企業レポート」の見出しと「プレミアム」のバッジ、中身の要約（「この会社の今」の答え・9グループの分析・5期の数字と売上の内訳・業界の中での位置・印刷／PDF）を載せ、帯全体が `/companies/<id>/report` へのリンク。最初の画面の終わりに必ず入り、スマホでも PC でも同じ位置に出る。これまで入口はヒーローの「このページの内容」のテキストリンクと財務セクション末尾のカードしかなく、上部では見えなかった。
2. **財務セクション末尾のカード（JCE-073）は廃止する**。同じ行き先の大きなカードが1ページに2つあると煩い。ヒーローの目次行の「分析・レポート」は1行目次の一部として残す。
3. **入口の表示と中身の開示は分ける**。帯は全公開企業のページに無料側でも出す（レポート自体は全公開企業に生成される）。有料境界はレポート側の既存の仕組み（JCE-101／JCE-120）のままで、帯は何も開示しない。
4. **文言はレポートの実物に合わせる**：第1章「この会社の今」と9グループの分析（JCE-096／JCE-120）、5期の印字値と売上の内訳、業界の中での位置、印刷して PDF に保存できる形（JCE-114）。

**やらないこと**：ヒーローの3ボタン（この会社の読み方）への組み込み — ページ内の読み方の選択と、別ページの有料の入口は性質が違う。価格の表示 — 価格は /learn とレポート側で扱う。企業ごとの出し分け — 入口は全社一律。

## JCE-127 — 2026-11-26: 意味の層の文の型を拡張 — Q2・Q3 に2文目を足し、上限を 3/2/2・最大7文へ

**目的**: 有料版「この会社の今」の厚み。フェーズ1〜3（JCE-120／122／124）の完了時点で文数分布は上限の5文に 1,176社が張り付き、Q2 は各社1文・Q3 も配分が1種しか並ばなかった。運営者指示（2026-11-26「有料版を完全版に作り上げるためにクオリティをどんどん上げてほしい」）と、2026-11-24 の「上限は必要に応じて変更可」の決定に基づく。原則は不変：全ての文は分解グループの行（印字値・計算式つき計算値）に遡れ、判断語彙なし、意図の断定なし、データがなければ文を出さない。有料／無料の境界（MeaningGate）と企業データには触れていない。

**変更前の実測**（公開 3,133社、変更前コードで全数実測）: 文数分布 0文 25／1文 31／2文 109／3文 766／4文 1,026／5文 1,176。文の総数 12,531（平均 4.00文／社）。問い別に答える会社数 Q1 3,077／Q2 1,472／Q3 1,999。テンプレート別: q1-net-income 2,901、q1-profit-split 2,901、q1-capex-cash 1,765、q1-net-assets 1,325、q1-margin-range 156、q1-funding 12、q2-margin 1,288、q2-segment 184、q3-capex 893、q3-rnd 1,106。

**追加したテンプレート**（いずれも既存の分解グループの行のみから組み立て、文中の数字は表と同じ行・同じ書式）:

1. **q2-largest-share（A4）**: 売上構成比が最も大きい事業とその構成比。q2-margin（利益率が最も高い事業）とは別の事実 — 何を主に売っているか。A4 が立つ全 1,288社で発火。
2. **q2-segment-second（A3）**: 寄与2番目の事業。合計は直前の q2-segment が述べるため再掲しない。ガードは q2-segment と同じ（全体と同符号であること、金額は全体以下でのみ併記）。q2-segment の立つ 184社中 146社で発火。
3. **q3-capex-second（A6）**: 設備投資の2番目の事業を q3-capex と同じ形で。A6 のみ立つ会社で発火し 332社。
4. **q1-working-capital（C2）**: 運転資本の増減。符号つきで述べるため SIGNED_ROWS に c2-working-capital-change を追加。Q1 が3文に届かない会社でのみ発火し、実測は 3社と小さい — Q1 が薄い会社は C2 の前提である明細を持たないことが多いため。到達は小さいが事実として正しく、将来明細が増えれば効くため残す。

**上限の変更**: PER_QUESTION を q1: 3／q2: 1／q3: 1 から q1: 3／q2: 2／q3: 2 へ、MAX_SENTENCES を 5 から 7 へ。テンプレートの順序は、Q3 では q3-rnd を q3-capex-second より前に置いた — 設備投資と研究開発という別種の配分が先に並ぶため。この順序と上限で、A5∩A6 の会社で上限に落ちていた研究開発の文が立つようになり、q3-rnd は 1,106 → 1,667社（A5 が立つ全社）で発火する。

**変更後の実測**（同条件で全数実測）: 文数分布 0文 25／1文 19／2文 110／3文 755／4文 799／5文 247／6文 320／7文 858。文の総数 14,861（平均 4.74文／社、+18.6%）。7文そろう会社が 858社できた。問い別に答える会社数は不変（Q1 3,077／Q2 1,472／Q3 1,999）— 新テンプレートは既に答えている会社の厚みを増やすもので、答えられない会社が残るのはセグメント利益・事業別設備投資・研究開発の登録側の制約であり、文の型では増えない。

**見送った候補と理由**:

- **A2（業界成長への寄与度・業界の売上シェア、3,068社で成立）**: 規模・地位の観点であり、3つの問い（儲かっているか／何が稼いでいるか／何に力を入れているか）のいずれにも対応しない。問いの規律を崩してまで入れない。
- **F3（売上と総資産の伸びの差、3,074社で成立）**: 差の数字だけでは2つの伸びの内訳がなく、初心者には読めない。総資産の伸び自体は C1 の行にあり、q1-funding が既に使っている。
- **D1（純資産利益率＝ROE近似、2,850社で成立）**: 近似指標を要約の文にすると格付けのように読まれる恐れがあり、「因果の可視化」という層の原則に合わない。分析層の表（計算値の明示つき）に留める。
- **E1（トレンドと乖離、2,278社で成立）**: 推計値であり、意味の層は印字値・計算値のみを使う。自前の予測文を作らない原則（設計メモ §8）にも触れる。
- **B2（純資産の増減の完全分解、2,138社で成立）**: q1-net-assets（B1）と内容が重なり、到達も明細保有社に限られる。
- **a-full（営業利益の内訳（3要因）、2,082社で成立）**: q1-profit-split（A1 の2要因分解）と重複し、明細保有社に限られる。
- **C1 の自己資本比率の変化**: 水準のない変化のみの数字で、比率が安全・危険の判断に直結して読まれる恐れがある。
- **従業員数の増減**: 分解グループではなく観点の印字行（company-analysis の printed-employees）にあり、意味の層の入力（分解グループのみ）の外。入力契約を変えるほどの必然性はない。
- **地域別売上の構成**: 分解グループに地域別の行がなく、同じく入力の外。
- **配当などの資本配分**: 独立した行が分解グループになく（B1 の「配当などその他の増減」に含まれるのみ）、切り出して述べられない。

**検証**: meaning-layer 11件（新規2件を含む。全社スイープで、全社の文について数値突合・判断語彙なし・上限7文・新文の出典行の存在を確認）、meaning-gate 5件（無料側に新文を含め全文が出ないこと）、analysis-decomposition 44件、tsc --noEmit・eslint 通過。

## JCE-128 — 2026-11-26: 企業・業界・用語の中身を英語の「参考訳」で見せる（不変条件1の例外）

運営者指示（2026-11-26「企業の説明・数字・出典、業界ページ・特集・同期パネルも英語のものを構築してほしい」）。方法は運営者が選択：「参考訳を自動生成」（原文の日本語が優先と明示し、訳文の数字・リンク・英字表記を機械で検査してから登録）。JCE-123 の判断4（中身は訳さない）をこの決定で置き換える。

**判断**：
1. **中身の英語は「AI による参考訳」で、原文（日本語）が優先**。英語を選んだ読者にはヘッダーの下に、参考訳であること・食い違えば日本語が優先すること・未訳の部分は日本語で出ることを常に示す（`LANGUAGE_NOTE`）。訳文は新しい事実ではなく原文の言い換えとして扱い、**訳が原文にない内容を足していないかを機械で確かめられた訳だけを出す**（判断3）。
2. **訳は `src/data/translations/en/{companies,industries,terms}/<id>.json` に、原文の文字列のハッシュをキーにして持つ**（`translationFileSchema`）。原文が1文字でも変わればキーが外れ、古い訳は出なくなる（訳の持ち越しをしない）。企業の JSON 自体には手を入れない。
3. **登録と表示の両方で `checkTranslation`（`src/lib/translation-check.ts`）に通す**：原文の数字がすべて訳にあり訳に余分な数字がない（兆・億・百万は換算して比較）、原文にない月を足していない、`[[company:…]]` などのリンクが同じ、英字の名前（Zoff、iPhone…）がそのまま、日本語が残っていない、極端に短くない。通らなかった訳は保存せず、その文は日本語で出す。表示側（`translationRepository`）も同じ検査を通った訳しか使わない。`tests/translations.test.ts` が全ファイルを検査する。
4. **訳は `scripts/pipeline/translate.mjs`（`npm run content:translate`）で作る**。運営者の Claude Code のログイン（`claude -p`、ai-executor と同じ）を使い、鍵は扱わない。落ちた文は理由を添えて1回だけ再試行し、それでも落ちれば日本語のまま。使用量の上限に達したら止まり、次の実行で続きから。初回（2026-11-26）は業界の解説455文・用語183文・全社の一行説明3,777社を登録、公開企業の事業構造は約6万文のうち3,662文で上限に達した（続きは同じコマンド）。
5. **数字の表記は訳さず換算する**：「9,477億円」→「¥947.7 billion」、「2026年3月期」→「FY ended Mar 2026」（`src/lib/figure-en.ts`、`<F>`）。印字の桁をそのまま英語の単位に移すだけで丸めない。読めない形はそのまま出す。出典名は EDINET の書類名だけを決まった訳語に置き換える（`documentTitleEn`、`<DocTitle>`）。社名の英語は EDINET の提出者名（英字）（`nameEn`）で、訳ではない。
6. **インターフェースの文言**（企業ページ・業界・特集・用語・同期パネルの見出しと説明、src/lib の指標名や有報の行ラベル）は `<T>` と辞書（`src/lib/ui-dictionary-en.ts`、`<L>`）で持つ。辞書にない文字列は日本語のまま出る。
7. **表示言語の span は `display: contents`**。文章を丸ごと言語別に包んでも、フレックスやグリッドの並びが包む前と変わらない。SVG の `<text>` の中には span を置けないので、図の中の文字は日本語のまま。

**まだ英語にならないもの**：公開企業の事業構造の残り・沿革・ビジネスモデル・戦略と強みの文（`translate.mjs` を `--fields businesses,history,businessModel,perspectives` で続ける）、ブラウザ側で描く部品（モノとお金の流れ図、予測パネル、DISCOVER など）の企業名・事業名、グラフ内の文字。

**検証**：`tests/translations.test.ts`（検査の単体テストと、保存済みの訳がすべて検査を通ること）、`tests/i18n.test.ts`。英語表示で企業・業界・用語・特集の各ページを開き、日本語の残りを数えて確認した。

## JCE-129 — 2026-11-26: 参考訳を少ないトークンで作る（翻訳サービスを使わない理由と、他言語への道筋）

運営者指示（2026-11-26「WOVN.io・shutto翻訳などのように、効率的にトークン使用量を減らして英語や他言語に対応できる方法を分析し構築」）。JCE-128 の参考訳はそのままに、作り方の無駄を削る。

**分析**：
- **差し込み型の翻訳サービス（WOVN.io・shutto翻訳・ポリリンガル・Spoke など）は使わない**。ページを描いた後に機械翻訳を差し込む仕組みで、(1) 訳が `checkTranslation` を通らないまま読者に出る（数字の取り違えを止められない＝不変条件1）、(2) 訳がリポジトリに残らず原文の変更との対応が取れない（不変条件9）、(3) 月額の契約とページ数に応じた従量の費用がかかり、約4,000社×数十ページ分の分量では割高、(4) 多くはブラウザ側の差し替えで検索エンジンに英語ページとして載りにくい。良い点（訳の使い回し・用語集・機械翻訳＋人の修正）は、以下の形で自前のパイプラインに取り込む。
- **測った無駄**（公開企業の事業構造、未訳 2,450,474 字）：カードに出す「最初の1文」を全文とは別の文字列として訳していた（約54万字＝22%）。他社と完全に同じ文（「その他」などのセグメント名）を社ごとに訳していた（3,156文）。毎回の呼び出しで規則文を利用者メッセージとして送っていた（キャッシュされない）。すべてを上位モデル（sonnet）で訳していた。

**判断**（`scripts/pipeline/translate.mjs`）：
1. **文ごとに送り、文ごとに受け取る**。全文の訳と同時に1文目の訳がそろうので、カード用の1文目は呼び出さずに得る（同じ企業の同じ文に限る）。文の切れ目は `firstSentence` と同じ規則（`sentences`、`src/lib/rich-text.ts`）。
2. **訳の使い回し（翻訳メモリ）**：保存済みの訳と原文が完全に一致する文は、どの企業の訳でも使い回す。ただし、その訳に元の企業の英語名（`nameEn` の固有の語）が入っていて原文に無いときは使わない（「同社」を社名で訳した文を他社に持ち込まないため）。使い回す訳も `checkTranslation` を通す。
3. **安いモデルが先、落ちた文だけ上位モデル**：1回目は `--model`（既定 haiku）、検査に落ちた文と1文目が得られなかった文は `--retry-model`（既定 sonnet）で理由を添えて1回だけ。検査はどちらにも同じに掛かる。
4. **規則文はシステムプロンプトに置く**（`--system-prompt`）。呼び出しをまたいでキャッシュされ、Claude Code 既定のシステムプロンプトも送らない。1回のまとまりを 6,000 字・80 件に広げる。
5. `--dry-run` は何も書かず、使い回し・1文目の導出・送る字数の見込みだけを出す。

**効果（2026-11-26 の計測）**：公開企業の事業構造で、送る字数は 2,450,474 字 → 1,905,882 字（−22%、使い回し 3,156 文、1文目の導出 11,247 文）。6社の試行では 132 文のうち 130 文を登録（1文目 24 文は呼び出しなし）、送った 4,369 字で $0.05＝千字あたり約 $0.011。JCE-128 の初回（sonnet、一行説明 114,988 字で $6.92＝千字あたり約 $0.06）の約5分の1。残る事業構造・沿革・ビジネスモデル・戦略と強み（約 770 万字）は、従来の方法の見込み約 $560 に対して約 $90 の見込み。

**他言語（中国語・韓国語など）への道筋**（この決定では作らない）：訳の作り方は言語を変えても同じ（`translationFileSchema` の locale を広げ、`translations/<locale>/` に置く）で、費用も1言語あたり英語とほぼ同じ。問題は届け方で、JCE-128 の「1ページに全言語の span を入れる」方式は言語を足すごとにページが約3割大きくなり、静的書き出し（約22GB）がもたない。3言語目からは、配信している Cloudflare Worker が HTMLRewriter で保存済みの訳に差し替える方式（差し込み型サービスと同じ配り方を、検査済みの自前の訳で行う）か、言語別の URL を主要ページだけに作る方式を、別の決定で選ぶ。

## JCE-130 — 2026-11-26: 本番バグ修正 — トップページの企業カードに未描画の `<T>` 式がそのまま表示された

運営者報告（2026-11-26、スクリーンショット付き）。トップページ「解説つきの主な企業」の企業カードで、証券コードの横に業界名ではなく `$<T m={{ ja: INDUSTRY_LABELS[primary.in…` という文字列がそのまま出ていた。

**原因**: `src/app/page.tsx` の2か所（主な企業カードと「最近更新された企業」リスト）で、`T` コンポーネントの `ja` 文字列の中に、入れ子の `<T m={{…}} />` の JSX ソースが文字列として埋め込まれていた（英語側は正しく名前を埋め込んでいた）。データ側ではなくコンポーネント側の欠陥で、この2か所を通る全カードが対象だった。他の画面・データに同じ文字列化パターンは無いことを `src` と `src/data` の全体検索で確認した。

**修正**: `ja` 側も英語側と同じく `INDUSTRY_LABELS[primary.industryId].name` を直接埋め込む形に直した（2行のみ）。仕様からの逸脱ではないため、方針の変更は伴わない。
