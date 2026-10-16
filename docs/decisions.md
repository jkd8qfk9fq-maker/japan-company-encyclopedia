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
