# 日本企業百科事典 Web Service — Master Specification

> **Provenance.** Transcribed from the operator's message of 2026-09-13. Formatting is condensed
> (code blocks turned into lists, blank lines removed); the content and wording of every section are
> unchanged. Where the implementation deliberately departs from a section, the departure is recorded in
> `docs/decisions.md` — this file is the operator's intent, not the current state.

**Version:** 1.0 · **Implementation Target:** Claude Code · **Framework:** Next.js / TypeScript / Tailwind CSS / shadcn/ui · **Storage:** localStorage + static local data · **PWA:** Required · **Responsive:** Required · **Naming:** kebab-case

Operator's preface (summary): file names, directory names, routes and main generated artifacts are all kebab-case (`company-page.tsx`, `business-structure.tsx`, `business-model.tsx`, `financial-chart.tsx`, `history-timeline.tsx`, `related-companies.tsx`, `industry-structure.tsx`, `search-input.tsx`). TypeScript type names, React component names and variable names cannot be kebab-case and use `Company`, `BusinessStructure` etc. The policy is kebab-case for **external naming**: files, folders, URLs, JSON keys.

---

## 01. Project Mission
日本の上場企業を、**「会社名」ではなく「何をしている会社なのか」から理解するための企業百科事典**として提供する。
最重要KPIは、**3秒で、その会社が何をしている会社か説明できること。**
投資判断サービスではない。株価・PER・PBRなどの投資指標を中心とするサービスにはしない。

## 02. Core User Experience
3秒 → 何の会社？ / 30秒 → 何をしている？ / 3分 → どうやって儲けている？ / 10分 → 業界のどこにいる？ / さらに深く → 歴史・関連企業・用語・Feature

## 03. Product Principles
1. Information should be understandable before it is comprehensive.
2. The business structure is the primary differentiator.
3. Every company should have a company-specific business structure.
4. Do not create a brokerage-style UI.
5. Do not overload the first screen.
6. Visual hierarchy is more important than information density.
7. Sources must be visible.
8. AI-generated information must be correctable.
9. Users cannot directly edit company information.
10. Users can report incorrect information.
11. Mobile is a first-class experience.
12. PWA is required.
13. The initial scope is approximately 100 companies.
14. Expand to approximately 300 companies.
15. Eventually support all companies listed on Japanese securities exchanges.
16. Advertising is not part of the initial MVP.
17. Architecture must allow future advertising without redesigning the entire application.
18. Do not expand into an investment dashboard, social network, news portal, or learning platform.

## 04. Target Users
Primary: university students; job seekers; finance beginners; users researching Japanese companies.
Secondary: users who encounter an unfamiliar company in the news; users studying Japanese industries; users wanting to understand business structures.

## 05. Technical Stack
Use: Next.js, TypeScript, Tailwind CSS, shadcn/ui, React. Recommended: Next.js App Router; Server Components by default; Client Components only where interaction is required. Do not introduce unnecessary libraries.

## 06. Data Architecture
Separate **static service data** (companies, industries, terms, features) from **user-local data** (favorites, recently-viewed, settings, reports). The first group should be accessible during SSR/static rendering. The second group should use localStorage.

## 07. Storage Rule
Do NOT make company information dependent exclusively on browser localStorage. Use `src/data/` for initial company data. Use localStorage for user-specific state. This preserves SEO, SSR, static rendering, fast initial loading, PWA compatibility, future database migration.

## 08. Repository Architecture
```
src/
├── app/  page.tsx · companies/{page.tsx, [company-id]/page.tsx} · industries/{page.tsx, [industry-id]/page.tsx}
│         features/{page.tsx, [feature-id]/page.tsx} · search/page.tsx · settings/page.tsx
│         admin/{page.tsx, companies/, industries/, terms/, features/, reports/, revisions/}
├── components/ company/ industry/ feature/ search/ navigation/ settings/ admin/ ui/
├── data/ companies/ industries/ terms/ features/
├── hooks/
├── lib/ storage/ search/ utils/
├── types/
└── styles/
```

## 09. Naming Convention — Files
Always kebab-case: `company-page.tsx`, `company-hero.tsx`, `company-summary.tsx`, `business-structure.tsx`, `business-model.tsx`, `financial-chart.tsx`, `history-timeline.tsx`, `related-companies.tsx`, `industry-structure.tsx`, `search-input.tsx`, `search-results.tsx`, `feature-article.tsx`. Never `CompanyPage.tsx`, `BusinessStructure.tsx`, `FinancialChart.tsx`.

## 10. Folders
Always kebab-case: `business-model/`, `related-companies/`, `history-timeline/`, `industry-structure/`, `recently-viewed/`. Do not use `businessModel/`, `relatedCompanies/`, `historyTimeline/`.

## 11. Routes
Kebab-case: `/companies`, `/companies/toyota`, `/industries`, `/industries/automotive`, `/features`, `/features/japanese-automotive-industry`, `/search`, `/settings`, `/admin`.

## 12. Component Naming
Files kebab-case; React component identifiers follow normal TypeScript conventions. `import { BusinessStructure } from "./business-structure";` — file `business-structure.tsx`, component `BusinessStructure`. This distinction is intentional.

## 13. Home Page
The homepage must NOT resemble a financial dashboard. Do not create: stock ticker, market overview, financial rankings, price cards, large KPI grids. Instead create an editorial-style landing page.

## 14. Home Structure
Hero → Feature → Explore Industries → Selected Companies → Explore.
Suggested: "JAPANESE COMPANIES / Understand the companies behind Japan. / [企業を探す]" · FEATURE「なぜ日本の自動車産業はこれほど巨大なのか」 · EXPLORE 自動車 半導体 金融 商社 · COMPANIES Toyota Sony Nintendo Honda.

## 15. Home Design
Visual direction: Apple + VOGUE + Encyclopedia. Large typography; generous whitespace; restrained color palette; strong editorial hierarchy; sophisticated image usage; minimal visible UI; elegant transitions; no unnecessary cards; no dense information grids.

## 16. Company List
Route `/companies`. Features: search, industry filter, company cards. Card: TOYOTA / トヨタ自動車 / 自動車 金融 モビリティ. Avoid displaying too many financial metrics.

## 17. Company Page
Route `/companies/[company-id]`. Tabs: 概要 事業 ビジネスモデル 財務 歴史 業界 関連企業.

## 18. Company Hero
Must immediately answer: *What kind of company is this?* Structure: company name; company official name; one-sentence description; business structure. Example: TOYOTA / トヨタ自動車 / 自動車を中心に、金融やモビリティ関連事業を展開する日本を代表する企業。 / [Business Structure].

## 19. Business Structure
The most important component (`business-structure.tsx`). The structure must be company-specific.
Toyota example: TOYOTA → 自動車 (ICE, HEV, EV) / 金融 (自動車ローン) / モビリティ.
Mitsubishi Corporation example: 三菱商事 → 天然ガス (LNG) / 食品 (食品流通) / 金属 (鉄鋼原料).
The system must not force every company into the same structure.

## 20. Business Page
Tab 事業. Each business: business name, description, products, customers. Example: 01 自動車 — 乗用車・商用車などを製造・販売。主な製品: 乗用車, 商用車, ハイブリッド車, EV.

## 21. Business Model
`business-model.tsx`. Explain: What does the company provide? Who buys it? How does the company generate revenue? Visual model: Company → Product / Service → Customer → Revenue → Profit.

## 22. Financial Page
Display: Fiscal Year, Revenue, Net Income. The primary chart must display **Revenue + Net Income in the same chart**. Use a dual-axis chart when necessary because revenue and net income can differ substantially in scale. The chart is contextual. Do not add investment indicators.

## 23. Financial Data Exclusions
Do not implement in MVP: stock price, PER, PBR, ROE, ROA, dividend yield, RSI, MACD, price target, investment recommendation.

## 24. History
`history-timeline.tsx`. Display important turning points only. Table: 年 | 出来事 | 意味 (e.g. 1937 | 会社設立 | 自動車事業を開始 …). The "意味" column is important. The goal is not a complete corporate history; the goal is to **explain why the company became what it is today.**

## 25. Industry
`/industries/[industry-id]`. Explain the industry before listing companies. Example 半導体産業: 設計 → 製造装置 → 材料 → 製造 → パッケージ → 最終製品. Then associate companies with each stage.

## 26. Industry Navigation
Must support Company → Industry and Industry → Company. This creates an exploration loop.

## 27. Related Companies
Relationships: same-industry, competitor, supplier, customer, technology, same-business-model. Do not only show "competitors." The purpose is to explain the ecosystem around a company.

## 28. Terms
Explain only concepts necessary to understand companies and industries. Example 半導体製造装置 — 半導体を製造するために使用される装置の総称。

## 29. Inline Terms
Important terms in company/industry/feature content should be interactive (e.g. 東京エレクトロンは半導体製造装置を製造する。→ click shows the definition). Principle: **The dictionary should appear when the user needs it.**

## 30. Feature
`/features`, `/features/[feature-id]`. The editorial section. Visual direction more strongly editorial: VOGUE + Editorial Magazine.

## 31. Feature Example
「なぜ日本の自動車メーカーはEVだけを作らないのか」 — exploration: Feature → Toyota → Honda → Nissan → Denso → Battery companies → Automotive industry.

## 32. Feature → Knowledge
Feature content must link naturally to companies, industries, terms. Editorial content becomes an entry point for company exploration.

## 33. Search
`/search`. Search across company name, company name en, securities code, industry, term, feature. Search should feel instantaneous.

## 34. Mobile Navigation
Bottom navigation: Home, Companies, Industries, Search, Settings. Icons + labels. Avoid icon-only navigation unless the meaning is universally clear.

## 35. Desktop Navigation
Logo · Home, Companies, Industries, Features · Search. Keep navigation visually restrained.

## 36. Responsive Rules
Support mobile, tablet, desktop, large desktop. Do not simply shrink desktop layouts. Design mobile separately where necessary.

## 37. Mobile Company Page
Order: Company name → One sentence → Business Structure → Main businesses → Tabs. Do not put seven large tabs across the viewport. Use horizontal scroll, compact tab navigation, sticky tab bar if appropriate.

## 38. Touch Targets
Minimum practical touch area 44px+ for interactive controls.

## 39. PWA
Implement: manifest, icons, theme metadata, standalone display, service worker, cache strategy, offline fallback. PWA must not compromise normal browser usage.

## 40. Offline Behavior
If offline: previously cached content + basic application shell should remain available. Show a clear offline indicator where useful.

## 41. localStorage
Create a dedicated storage layer (e.g. `src/lib/storage/storage.ts`). Do not call localStorage directly throughout components. Use `storage.get()`, `storage.set()`, `storage.remove()` or specialized repositories.

## 42. Local Storage Keys
Kebab-case: `company-favorites`, `recently-viewed-companies`, `user-settings`, `content-reports`.

## 43. Favorites
Favorites mean companies the user wants to revisit. They do NOT represent an investment portfolio.

## 44. Recently Viewed
Store recently viewed companies (`recently-viewed-companies`). Limit to a reasonable number such as 10–20.

## 45. Settings
`/settings`. Sections: Appearance, Application, Support. Support must include 情報の誤りを報告.

## 46. Report System
Users cannot edit company information. They can report: company information, business information, financial information, history, industry classification, other.

## 47. Report Data
```ts
type ContentReport = { id: string; companyId?: string; industryId?: string; featureId?: string;
  category: string; message: string; createdAt: string;
  status: "open" | "investigating" | "resolved" | "rejected" }
```

## 48. Admin
`/admin`. Areas: companies, industries, terms, features, reports, revisions.

## 49. Admin Dashboard
Display: Companies, Reports, Needs Attention, Recently Updated. Keep it operational, not visually elaborate.

## 50. Company Editor
Admin must be able to edit: basic information, description, businesses, business model, financials, history, industry, related companies, sources.

## 51. Revision History
Every correction should create a revision (e.g. 2026-09-13 AI generated · 2026-09-14 Business description corrected · 2026-09-15 Financial data corrected).

## 52. AI Publication Architecture
Final production architecture: Public Sources → Data Retrieval → Extraction → Normalization → Cross-source Validation → AI Generation → AI Quality Check → Publish → Post-publication Monitoring. **AI is allowed to publish automatically. Human approval is NOT a mandatory publication gate.**

## 53. AI Validation
Check: source availability, date, numerical consistency, contradictions, duplicate information, outdated information, business classification, industry classification. When uncertainty is high, a `needs-attention` status should be generated.

## 54. Post-publication Correction
User report → Admin → AI investigation → Source verification → Correction → Revision. The page remains editable after publication.

## 55. Sources
Every important factual section should support: source title, publisher, URL, published date, accessed date. Example: Sources — ○○株式会社 有価証券報告書 / ○○株式会社 公式サイト — 最終確認 2026年9月13日.

## 56. Source UX
Do not make sources visually dominant. Use an expandable component 「出典を見る」; when expanded: Source, Publisher, Date, Original URL. Preserves trust without damaging the visual design.

## 57. Data Model
```ts
type Company = { id: string; code: string; name: string; nameEn?: string; description: string;
  industries: IndustryReference[]; businesses: Business[]; businessModel?: BusinessModel;
  financials: FinancialRecord[]; history: HistoryEvent[]; relatedCompanies: RelatedCompany[];
  sources: Source[]; updatedAt: string }
```

## 58. Business Type
```ts
type Business = { id: string; name: string; description: string; products?: string[]; customers?: string[]; children?: Business[] }
```
The recursive `children` structure is important (company → business → sub-business).

## 59. Business Model Type
```ts
type BusinessModel = { description: string; products: string[]; customers: string[]; revenueSources: string[]; flow: BusinessModelStep[] }
```

## 60. Financial Type
```ts
type FinancialRecord = { fiscalYear: string; revenue?: number; netIncome?: number; currency: string }
```

## 61. History Type
```ts
type HistoryEvent = { year: number; title: string; description: string; significance: string }
```

## 62. Source Type
```ts
type Source = { title: string; publisher: string; url: string; publishedAt?: string; accessedAt: string }
```

## 63. Industry Type
```ts
type Industry = { id: string; name: string; description: string; categories: IndustryCategory[]; companyIds: string[]; sources: Source[] }
```

## 64. Related Company Type
```ts
type RelatedCompany = { companyId: string; relationship: "same-industry" | "competitor" | "supplier" | "customer" | "technology" | "same-business-model" }
```

## 65. Feature Type
```ts
type Feature = { id: string; title: string; subtitle?: string; heroImage?: string; body: FeatureBlock[];
  relatedCompanies: string[]; relatedIndustries: string[]; relatedTerms: string[]; sources: Source[]; publishedAt: string }
```

## 66. Data Directory
`src/data/companies/`, `src/data/industries/`, `src/data/terms/`, `src/data/features/`. Files kebab-case (`toyota.ts`, `sony-group.ts`, `honda.ts`, `nintendo.ts`, `mitsubishi-corporation.ts`). Company identifiers should preferably be stable kebab-case slugs.

## 67. Initial Company Dataset
Begin with approximately **100 companies**. Do not attempt to build all Japanese listed companies during the initial implementation. The architecture must support 100 → 300 → all listed companies.

## 68. Japanese Company Definition
Default scope: **Companies listed on Japanese securities exchanges.** Do not arbitrarily include private companies, foreign companies solely because they are famous, or subsidiaries that are not independently listed, unless there is a deliberate future rule.

## 69. Initial Industry Categories
automotive, semiconductors, electronics, it, finance, trading, food, retail, real-estate, construction, chemicals, pharmaceuticals, transportation, energy, telecommunications, media. Industry IDs kebab-case.

## 70. Industry Expansion
e.g. automotive → automakers, auto-parts, tires, dealerships, automotive-finance. Do not over-engineer taxonomy during Phase 1.

## 71. Design System
Base colors: white, off-white, black, gray. Accent colors restrained. Avoid: red/green financial dashboard, neon colors, excessive gradients.

## 72. Typography
Typography as a primary visual element. Hero: large, editorial, high contrast. Body: comfortable reading size, high line-height. Labels: small but not excessively small.

## 73. Cards
Cards should not become the dominant design language. Use cards when they improve grouping. Avoid 20 identical cards, 12 KPI cards, dense grid dashboards.

## 74. Animation
Subtle: fade, slide, scale, hover. Avoid excessive animation. Animation should communicate hierarchy or interaction, not decoration alone.

## 75. Skeleton Loading
shadcn Skeleton or equivalent for company page, industry page, feature page, search results.

## 76. Error States
Designed error states, e.g. 「この企業の情報を取得できませんでした。もう一度お試しください。」 Do not expose raw errors.

## 77. Empty States
e.g. 「該当する企業が見つかりませんでした。企業名または証券コードを確認してください。」

## 78. Accessibility
Required: semantic HTML, keyboard navigation, focus states, ARIA labels, sufficient contrast, alt text, screen-reader-friendly labels.

## 79. Performance
Prioritize Server Components, static rendering, optimized images, lazy loading, minimal client JavaScript. Do not turn the entire application into a Client Component.

## 80. SEO
Every company page: title, description, canonical URL, Open Graph metadata. e.g. 「トヨタ自動車とは？｜日本企業百科事典」.

## 81. Metadata
Generate metadata dynamically from company data (`/companies/toyota`, `/industries/automotive`, `/features/japanese-automotive-industry`).

## 82. Future Advertisement Architecture
No advertisements in MVP, but create an abstraction such as `ad-slot.tsx`. Future placements: feature-inline, company-bottom, industry-inline, home-feature. Disabled by default.

## 83. No Advertisement Work in MVP
Do not spend development time on ad network integration, tracking, ad optimization, targeting, sponsorship system. Only preserve architectural extensibility.

## 84. Development Phases
- **Phase 1 — Foundation**: project setup, design system, data types, static data, navigation, PWA, responsive foundation.
- **Phase 2 — Core Experience**: home, companies, company page, business structure, business model, financial chart, history. Must prove the 3-second KPI.
- **Phase 3 — Exploration**: industries, related companies, search, favorites, recently viewed.
- **Phase 4 — Knowledge**: terms, inline terms, features.
- **Phase 5 — Editorial/Admin**: admin, company editor, reports, revision history, sources.
- **Phase 6 — Automation** (later): data retrieval, AI extraction, AI validation, AI generation, AI publication, automatic company creation, automatic updates.

## 85. Definition of Done
The MVP is NOT complete merely because all pages exist. Home: a user immediately understands the service. Company: understand the company in ~3 seconds. Business Structure: visually clear. Business Model: a beginner understands how the company earns revenue. History: a beginner understands major turning points. Industry: understand where the company sits in the industry. Related Companies: continue exploring naturally. Search: find a company quickly. Mobile: works comfortably on smartphones. PWA: installable. Sources: users can verify important information. Admin: incorrect information can be corrected after publication.

## 86. Critical QA Checklist
Home is not a dashboard · 3-second company understanding works · Business structure is visually dominant · Company-specific structures work · Business model is understandable · Revenue + net income share one chart · History uses important events only · Industry navigation works both directions · Related companies work · Search works · Favorites work · Recently viewed works · Terms work · Feature links work · Sources are visible · Reports work · Admin correction works · Revision history works · Mobile layout works · Tablet layout works · Desktop layout works · PWA installation works · Offline fallback works · Accessibility basics work · No unnecessary financial dashboard elements · No unnecessary information density · All filenames are kebab-case · All folder names are kebab-case · All route segments are kebab-case

## 87. Final Architecture
USER → Desktop / Mobile → Next.js → Companies / Industries / Features → Knowledge Layer → Business Structure / Terms / Relations → Business Model → Financials → History → Sources.

## 88. Data Evolution
初期: static local data + localStorage. 将来: public sources → data ingestion → normalization → AI validation → AI generation → company data repository → Next.js. 最終的にDBへ移行しても、`CompanyRepository`, `IndustryRepository`, `TermRepository`, `FeatureRepository` のインターフェースを維持することで、UI側の大規模な書き換えを避ける。

## 89. Most Important Product Test
最初の10人程度に、「この会社は何をしている会社だと思いますか？」とCompanyページを見せずに聞く。次にCompanyページを開いてもらい、約3秒後に閉じる。その後「この会社は何をしている会社？」と質問する。正しく説明できる割合を測定する。これを **3-second comprehension rate** として将来的なUX KPIにする。

## 90. Final Instruction to Claude Code
Do not optimize for the number of features. Optimize for understanding. Do not build a financial dashboard. Build a visual encyclopedia of Japanese companies. The most important component is the company-specific business structure. The most important UX metric is whether a user can understand what the company does within approximately three seconds. Keep the interface visually sophisticated but information-light. Use Apple-like interaction simplicity and editorial sophistication inspired by premium magazines such as VOGUE. Do not imitate a brokerage platform. Do not imitate a dense financial information terminal. Do not overuse cards. Do not overload the homepage. Do not use tiny typography. Do not expose excessive financial metrics. Build the system so that the initial 100 companies can later become 300 and eventually all companies listed on Japanese securities exchanges. Use kebab-case for every filename, folder name, route segment, storage key, and other external identifier. Use normal TypeScript/React naming conventions for classes, types, interfaces, functions, and components where language conventions require it. Build mobile-first and make the application installable as a PWA. Use localStorage for user-local state and static local data for initial company content. Keep the data layer abstract enough to migrate to a database later. Every important factual section must support source attribution. Users must not directly edit content. Users must be able to report incorrect information. AI may eventually generate and publish content automatically, but published information must always be editable through the admin editor and maintain revision history.
