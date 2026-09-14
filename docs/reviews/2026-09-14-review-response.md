# Response to the independent review — 2026-09-14

What was done about each finding in `2026-09-14-independent-review.md`. Every "Fixed" item was
observed working after the change, not reasoned about.

| Finding | Status | What changed · evidence |
|---|---|---|
| **F-01** Sony label contradicts figure; columns of different scope | **Fixed** | `netIncomeBasis` added and required with `revenueBasis`; the legend shows each scope under its label; notes state in body text that 2024–2026年3月期 columns measure different perimeters and are not a margin. JCE-012 |
| **F-02** First page not available offline | **Fixed** | Service worker v2 caches open windows on activate. Observed: first visit `/companies/nintendo` → cache `pages-v2 /companies/nintendo`; offline reload renders 任天堂 |
| **F-03** Focusable bands inside `role="img"` | **Fixed** | SVG is `role="group"` with a label; each year stays a focusable, labelled group |
| **F-04** `pagePath` accepts `//example.com` | **Fixed** | Pattern `^\/(?![/\\])[a-z0-9/-]*$`; `tests/stores.test.ts` plants `//example.com`, `/\example.com`, `https://…`, `javascript:` and an uppercase path — all dropped |
| **F-05** `/admin` reachable once deployed | **Fixed (guard)** | Production builds 404 `/admin` unless `ENABLE_ADMIN=true`. Observed 404 on `/admin` and `/admin/reports` under `next start`. Authentication still required before enabling on a public host. JCE-013 |
| **F-06** localStorage read outside `src/lib/storage/` | **Fixed** | Script moved to `src/lib/storage/theme-script.ts`; no `localStorage` access remains outside the storage layer |
| **F-07** Wordmark dominates, structure below fold | **Fixed** | Hero reordered per spec §18; wordmark reduced. Measured structure top 430–448px desktop. Also found and fixed pages opening scrolled 180–490px down. JCE-011 |
| P3-1 Uppercase ids soft-404 | Open | Likely Windows case-insensitive file lookup; re-check on the deployment host |
| P3-2 Sitemap/robots use localhost without `SITE_URL` | **Fixed** | Production build throws without `SITE_URL`. Observed: exit 1 with the guard's message; exit 0 with it set |
| P3-3 `/features/none` placeholder | Open | Harmless; remove when the first feature is published |
| P3-4 Navigation leads to empty pages | **Fixed** | 特集 and 用語集 are shown in header, footer and home only when they have content |
| P3-5 Manifest and icons cache-first forever | **Fixed** | Stale-while-revalidate |
| P3-6 No CSP / Permissions-Policy | Open | Needs hashes for the inline theme script and JSON-LD; do before deployment |
| P3-7 Test misses Japanese investment-metric names | **Fixed** | 自己資本利益率, 時価総額, 配当性向, 1株当たり, EPS added; current data passes |
| P3-8 Protocol departures only in logs | **Fixed** | Reorganisation and single-segment rules added to `docs/research-protocol.md` |
| P3-9 Admin shows raw category id | **Fixed** | Shared `REPORT_CATEGORY_LABEL` |
| P3-10 Unneeded `"use client"` on a hook | **Fixed** | Removed |
| P3-11 Sony URLs 403 to non-browser clients | **Fixed (documented)** | Noted in the research protocol |
| P3-12 Small text-link targets | **Fixed** | Header and footer links are 44px tall |

## Not addressed here, by nature

- **Not built**: related companies, terms, features (content needs research), admin correction (JCE-009),
  report delivery (JCE-008). The last two need operator decisions.
- **Not verifiable without people**: 3-second comprehension (spec §89 test), business-model
  understandability, information density.
