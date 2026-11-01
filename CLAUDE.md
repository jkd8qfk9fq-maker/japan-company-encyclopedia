@AGENTS.md

# CLAUDE.md — 日本企業百科事典 (japan-company-encyclopedia)

A visual encyclopedia of companies listed on Japanese securities exchanges. It answers
**"what does this company do?"** — not "should I buy it?".

**The most important UX metric**: a reader can say what a company does after ~3 seconds on
its page (the *3-second comprehension rate*). **The most important component**: the
company-specific business structure.

The operator's master specification: `docs/master-specification.md`. Departures from it: `docs/decisions.md`.

This project is **completely independent** of the other projects in `../`: do not reuse, import, copy
or modify their code, architecture, data models, schemas, design, branding, routes or environment
variables, and never reference them in the application. Decision recorded in
`../company-data-platform/docs/VALLE_DECISIONS.md` (D-040).

---

## Invariants — violating any of these is a P0

1. **No fabrication.** Never invent, estimate, interpolate or carry forward a fact. This covers
   prose as much as numbers: a business description, a history event and a "why it matters" line
   are all claims. A fact that could not be verified against a source is left out, or set to
   `null`, and the entry's `status` becomes `needs-attention` with a note saying what is missing.
2. **Every factual section is sourced.** `Business`, `BusinessModel`, `FinancialRecord`,
   `HistoryEvent` and `RelatedCompany` carry `sourceIds` that resolve to the entity's `sources`.
   `tests/data-integrity.test.ts` enforces this; do not weaken it to make data pass.
3. **EDINET first, Wikipedia only to supplement.** The 有価証券報告書 (EDINET) is the basis of every entry and
   is trusted as filed. Japanese Wikipedia may add what the filing does not say (former names, brand and product
   names, background) — paraphrased, never copied (CC BY-SA), cited as its own source — and never a figure, never
   anything that contradicts the filing (operator decision 2026-10-30, `docs/decisions.md` JCE-030). Other
   aggregator sites are not sources.
4. **Not a brokerage.** No stock price, PER, PBR, ROE, ROA, dividend yield, technical indicators,
   price targets or recommendations, and no ratio computed from the figures. The financial section shows the
   filing's own five-year summary as printed — revenue, the profit line the filing prints between revenue and net
   income (with its label), net income, total assets, net assets, employees (operator's request, 2026-09-21,
   commit "Add 利益・総資産・純資産・従業員数 to every entry"). **Prose** cites revenue and net income only
   (`docs/agent-brief.md`, checked by `scripts/pipeline/prose-policy.mjs`).
5. **Users never edit content.** They can report errors. Corrections go through admin and leave a
   `Revision`.
6. **kebab-case for every external name**: file names, folder names, route segments, data ids,
   localStorage keys. TypeScript identifiers (types, components, functions) follow normal
   TypeScript conventions — `BusinessStructure` lives in `business-structure.tsx`.
7. **`localStorage` is for user-local state only** (favorites, recently viewed, settings),
   and only through `src/lib/storage/`. Company content never depends on it — it is JSON in
   `src/data/`, parsed through `src/lib/content/schemas.ts`, rendered on the server, and read only through
   the repositories in `src/lib/repositories/`.
9. **The repository is the source of truth for published content.** Corrections are made in the local
   admin editor (development only), which writes the JSON and a Revision; the operator reviews the diff,
   commits and pushes. Nothing in this app runs git or writes content in production
   (`docs/correction-workflow.md`, decisions JCE-016).
8. **Server Components by default.** A `"use client"` directive needs a reason (interaction,
   browser API). Do not turn a page into a Client Component to save effort.

---

## Working with the operator: live preview

**While implementing, keep a live preview open in a separate browser window** (operator request,
2026-09-15). At the start of any build work: run `npm run dev` in the background on port 3000 and open
the page being worked on in the default browser (Windows: `Start-Process http://localhost:3000/<path>`).
Leave it running — Next.js hot-reloads as files change — and tell the operator which URL shows the change.
If port 3000 is taken, find out what holds it before using another port. Production builds can run
alongside it.

## Commands

```bash
npm run dev          # http://localhost:3000
SITE_URL=http://localhost:3000 npm run build   # production build; FAILS without SITE_URL by design
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest — includes the data integrity suite
npm run admin:hash-password   # prints ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET
npm run db:migrate            # applies db/migrations to DATABASE_URL
npm run content:check         # integrity tests + typecheck + lint, before committing content
npm run content:diff          # read-only: changed data files, new revisions, diff
npm run content:autopilot -- status          # registration queue → review sheets (docs/auto-registration.md); `approve` is the only step that registers
npm run content:refresh-financials -- --all  # dry run: registered companies with a newer 有報 (Actions detects this daily — the one EDINET detector)
```

| Variable | Why |
|---|---|
| `SITE_URL` | Required for any production build. Canonical URLs, sitemap and robots use it; without it the build throws rather than publish localhost URLs |
| `DATABASE_URL` | Where reader reports are stored (Postgres; `npm run db:migrate`). Unset in development → `.data/content-reports.json`. Unset in production → the report form refuses to send |
| `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | Admin login, from `npm run admin:hash-password`. Either missing → `/admin` is closed. Copy `.env.example` to `.env.local` for development |

**Gate every commit on exit codes**, not on grepped output: `npx tsc --noEmit -p . && npx eslint src tests && npx vitest run && git commit …`. Two commits on 2026-09-14 went in broken because a command checked `grep`'s status instead, and one on 2026-09-21 for the same reason — `npm test | grep "Tests "` matches the summary line whether or not the run passed.

**Never restore a file with `git checkout` while uncommitted work is in flight.** The pattern "plant a wrong figure → confirm the checker rejects it → `git checkout` the file" silently reverted a company's newly backfilled fields to HEAD on 2026-09-21, and the broken entry was committed. Copy the file to the scratchpad first and restore from that copy.

---

## Adding or correcting a company

**Correcting** published content: use the local admin editor — `docs/correction-workflow.md`. Do not
hand-edit JSON for a factual correction without also writing a Revision file; the editor does both.

**Adding** a company — two paths, both ending in the same `companySchema` shape and both gated by
`npm test`:

- **A small number of companies, researched fully by hand**: `docs/research-protocol.md`.
  1. Follow the protocol exactly.
  2. Data file: `src/data/companies/<company-id>.json`, valid against `companySchema`.
  3. Research log: `docs/research/<company-id>.md` — every figure traced to a document and page.
  4. Register it in `src/data/companies/index.ts`, and add a first revision
     `src/data/revisions/<date>-company-<company-id>-initial.json`.
  5. `npm test` must pass.
- **The listed universe, at scale**: `docs/pipeline.md`. A company may be registered with
  `status: { state: "figures-only" }` — figures and sources only, no prose yet — and promoted
  later once the prose stages run. `npm test` is the same gate either way.

**The company page is the standard for every entry, old and new** (`docs/decisions.md` JCE-026). It is drawn from the
entry's data by `src/components/company/company-view.tsx` — no per-company layout, no per-company step at registration.
What a new entry needs for the page to be full is ordinary, sourced data: `businesses` (with `products`) for the structure
and its markers, `businessModel.flow` for the flow, `financials` for the key facts and chart, `history` for the timeline,
and `relatedCompanies` — `supplier` / `customer` wherever the filing states who sells to whom, because only those draw the
arrows on the connection map and the lines on the industry map (the 産業マップ tab of `/industries`). A section without data is not drawn;
never add a fact to make one appear. No photographs on company pages. Industries carry Unsplash / Pexels photographs:
one per industry (its 仕組み tab, and as a thumbnail wherever the industry is listed), one per stage of a researched
structure, and the industries hub's banners (`src/assets/industries`, provenance in its SOURCES.md, no credit shown by
the operator's choice — JCE-031, JCE-032); a photograph is never of a company's own site, product or brand.

## Development Workflow

このプロジェクトでは、機能追加・構造変更・データフロー変更を行う際、以下の原則に従う。

### 1. 既存構造を優先する

新しいファイル、コンポーネント、関数、ライブラリ、抽象化を追加する前に、既存コードを確認する。

### 2. Graphifyを構造理解に使用する

変更範囲が複数ファイル・複数機能に及ぶ場合は、Graphifyを使用して関連するコード、データ、依存関係を確認する。

特に以下を確認する。

- データの生成元
- データの保存先
- データを利用するコンポーネント
- import / dependency relationships
- 関連するadmin、revision、source、agent
- 変更による影響範囲

単純なUI変更や文言変更ではGraphifyを必須としない。

### 3. Ponytailの原則を維持する

実装前に以下を検討する。

1. 本当に新しいコードが必要か
2. 既存コードを再利用できないか
3. 標準ライブラリで対応できないか
4. Next.js、React、ブラウザ等の既存機能で対応できないか
5. 既存依存関係を利用できないか
6. より単純な実装がないか
7. 最小限の変更で目的を達成できないか

不要な抽象化、不要なutility、不要なwrapper、不要なdependencyを追加しない。

### 4. 変更前に影響範囲を確認する

大規模な変更では、実装前に変更対象と影響範囲を説明する。

### 5. 実装後に確認する

実装後は、

- 変更ファイル
- データフロー
- 関連機能
- 型エラー
- 既存機能への影響

を確認する。

必要に応じてGraphifyで変更後の構造を再確認する。

### 6. データ整合性を優先する

日本企業辞典のcompany data、financials、sources、revisionsなどについて、単純化を理由にデータ整合性を犠牲にしない。

### 7. ユーザーの要求以上の機能を勝手に追加しない

明示されていない機能、UI、抽象化、依存関係を勝手に追加しない。

## Style

Comments explain **why**, not what — match the density of the existing code. UI copy is Japanese.
