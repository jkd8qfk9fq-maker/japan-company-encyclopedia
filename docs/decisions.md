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
