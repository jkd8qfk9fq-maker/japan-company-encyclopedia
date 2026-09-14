@AGENTS.md

# CLAUDE.md — 日本企業百科事典 (japan-company-encyclopedia)

A visual encyclopedia of companies listed on Japanese securities exchanges. It answers
**"what does this company do?"** — not "should I buy it?".

**The most important UX metric**: a reader can say what a company does after ~3 seconds on
its page (the *3-second comprehension rate*). **The most important component**: the
company-specific business structure.

This is a sibling of the VALLE projects in `../`, **not part of VALLE**. It shares no code,
database or contract with them. Decision recorded in
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
3. **Primary sources first.** 有価証券報告書, 決算短信, 統合報告書 and the company's own official
   pages. News articles only for events a company does not document itself. **Never Wikipedia**
   or aggregator sites as a source for a fact.
4. **Not a brokerage.** No stock price, PER, PBR, ROE, ROA, dividend yield, technical indicators,
   price targets or recommendations. Revenue and net income, in context, are the only financials.
5. **Users never edit content.** They can report errors. Corrections go through admin and leave a
   `Revision`.
6. **kebab-case for every external name**: file names, folder names, route segments, data ids,
   localStorage keys. TypeScript identifiers (types, components, functions) follow normal
   TypeScript conventions — `BusinessStructure` lives in `business-structure.tsx`.
7. **`localStorage` is for user-local state only** (favorites, recently viewed, settings, reports),
   and only through `src/lib/storage/`. Company content never depends on it — it is static data in
   `src/data/`, rendered on the server, and read only through the repositories in `src/lib/repositories/`.
8. **Server Components by default.** A `"use client"` directive needs a reason (interaction,
   browser API). Do not turn a page into a Client Component to save effort.

---

## Commands

```bash
npm run dev          # http://localhost:3000
SITE_URL=http://localhost:3000 npm run build   # production build; FAILS without SITE_URL by design
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest — includes the data integrity suite
```

| Variable | Why |
|---|---|
| `SITE_URL` | Required for any production build. Canonical URLs, sitemap and robots use it; without it the build throws rather than publish localhost URLs |
| `ENABLE_ADMIN` | `/admin` 404s in production unless `true`. It has no authentication — do not enable it on a public host (JCE-009) |

**Gate every commit on exit codes**, not on grepped output: `npx tsc --noEmit -p . && npx eslint src tests && npx vitest run && git commit …`. Two commits on 2026-09-14 went in broken because a command checked `grep`'s status instead.

---

## Adding or correcting a company

1. Research protocol: `docs/research-protocol.md`. Follow it exactly.
2. Data file: `src/data/companies/<company-id>.ts`, typed as `Company`.
3. Research log: `docs/research/<company-id>.md` — every figure traced to a document and page.
4. Register it in `src/data/companies/index.ts`.
5. `npm test` must pass. A correction appends a `Revision`; it never rewrites history silently.

## Style

Comments explain **why**, not what — match the density of the existing code. UI copy is Japanese.
