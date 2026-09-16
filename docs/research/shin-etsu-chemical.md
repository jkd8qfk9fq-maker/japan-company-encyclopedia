# 信越化学工業 — research log

Researched: 2026-09-15 – 2026-09-16. A first agent downloaded the documents and wrote a draft entry on 2026-09-15,
then was cut off by a rate limit before writing any log. On 2026-09-16 the draft was treated as unverified: every
document was re-identified and re-downloaded, every figure re-read, and every claim checked against a quoted
passage. This log records only what was verified on 2026-09-16. Changes made to the draft are listed at the end.

Page numbers for `yuho-2026` are the **printed** page numbers (the `- n -` footer); printed page = PDF page − 3
(PDF p.4 = 「- 1 -」, the five-year table). The cover (表紙) is PDF p.3 and has no printed number. `yuho-2025` has the
same layout (PDF p.4 = p.1). `tanshin-2026` and `tanshin-2027-q1` pages are PDF pages.

**Extraction.** Every PDF was extracted with `pdftotext -cfg <scratchpad xpdfrc> -enc UTF-8` (xpdf Japanese language
pack; protocol §1), in `-raw` and `-table` modes; `-layout` was not used. On 2026-09-16 all four PDFs were
re-extracted in both modes: 0 bytes of stderr each, byte-identical to the 2026-09-15 extracts. Labels were checked
legible before reading (yuho-2026 表紙「【会社名】 信越化学工業株式会社」「【英訳名】 Shin-Etsu Chemical Co., Ltd.」).

**Freshness.** On 2026-09-16 all four PDFs were downloaded again from the URLs below (HTTP 200) and their SHA-256
matched the 2026-09-15 files (yuho-2026 `bb8fd77d1fd7…`, yuho-2025 `4c537d2c7908…`, tanshin-2026 `854bc903afb0…`,
tanshin-2027-q1 `6b1a1dc98545…`). All 28 official web pages consulted were fetched again with a browser User-Agent
(HTTP 200) and their text below the breadcrumb was identical to the 2026-09-15 copies. Hence `accessedAt` 2026-09-16.

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書 2026年３月期（第149期）（自 2025年４月１日 至 2026年３月31日）, 提出日 2026年６月19日, 関東財務局長. Confirmed latest filed: the IR page「有価証券報告書・半期報告書」(https://www.shinetsu.co.jp/jp/ir/ir-data/ir-securities/) lists under「2025年度 第149期 （2026年3月期）」 the 有価証券報告書 first, then 確認書, 内部統制報告書, and the 第149期 半期報告書. The page's 訂正報告書 links belong to 第145期 and earlier only. The 第150期 半期報告書 (period ending 2026-09-30) cannot exist yet | https://www.shinetsu.co.jp/wp-content/uploads/2025/11/yuho_149.pdf | 表紙, 1, 3, 4, 9, 20, 21, 24, 25, 26, 28, 83, 94, 121, 123, 124, 125, 146 (監査報告書) |
| `yuho-2025` | 有価証券報告書 2025年３月期（第148期）, 提出日 2025年６月20日 | https://www.shinetsu.co.jp/wp-content/uploads/2024/11/yuho_148.pdf | 表紙, 1 |
| `tanshin-2026` | 2026年３月期 決算短信〔日本基準〕（連結）, 2026年４月28日 (「百万円未満切捨て」) | https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260428_con_J.pdf | 1, 2 |
| `tanshin-2027-q1` | 2027年３月期 第１四半期決算短信〔日本基準〕（連結）, 2026年７月24日. Read to confirm the segment structure after year end | https://www.shinetsu.co.jp/wp-content/uploads/2026/07/20260724_con_J.pdf | 1, 16 |
| `official-history` | 公式サイト「沿革｜企業情報」(no page date) | https://www.shinetsu.co.jp/jp/company/history/ | lead; timeline rows 1926, 1927, 1940, 1953, 1960, 1973, 1974, 1998, 2003, 2024, 2025 |
| `official-products` | 公式サイト「事業・製品」, heading「4つの事業」 | https://www.shinetsu.co.jp/jp/products/ | the four segment leads |
| `official-functional-materials` | 「機能材料事業｜事業・製品」 | https://www.shinetsu.co.jp/jp/products/%E6%A9%9F%E8%83%BD%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/ | lead; 取り扱い製品 list (シリコーン事業本部) |
| `official-individual-about` | 「01.信越化学ってどんな会社？｜個人投資家の皆様へ」 | https://www.shinetsu.co.jp/jp/ir/individual/about/ | キーワード1–3 |
| `official-individual-history` | 「02.「製品」で見る信越化学の歩み｜個人投資家の皆様へ」 | https://www.shinetsu.co.jp/jp/ir/individual/history/ | lead; row 1953 シリコーン |
| `official-semiconductor-products` | 「07.半導体と信越製品｜個人投資家の皆様へ」. The substance is one image (`material.png`, 1680×2418) titled「半導体製造工程に関わる信越化学グループの製品」, read visually | https://www.shinetsu.co.jp/jp/ir/individual/special-class2/ | lead text; the image |
| `official-silicon-wafer` | 「シリコンウエハー｜電子材料事業」 | https://www.shinetsu.co.jp/jp/products/%E9%9B%BB%E5%AD%90%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/silicon-wafer/ | lead, 用途 |
| `official-neodymium-magnet` | 「ネオジム磁石｜電子材料事業」 | https://www.shinetsu.co.jp/jp/products/%E9%9B%BB%E5%AD%90%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/neodymium-magnet/ | lead, 用途 |
| `official-photoresist` | 「フォトレジスト｜電子材料事業」 | https://www.shinetsu.co.jp/jp/products/%E9%9B%BB%E5%AD%90%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/photoresist/ | lead |
| `official-photomask-blanks` | 「マスクブランクス｜電子材料事業」 | https://www.shinetsu.co.jp/jp/products/%E9%9B%BB%E5%AD%90%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/photomask-blanks/ | lead |
| `official-quartz-preform` | 「光ファイバー用合成石英プリフォーム｜電子材料事業」 | https://www.shinetsu.co.jp/jp/products/%E9%9B%BB%E5%AD%90%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/synthetic-quartz-glass-substrate/ | lead, 用途 |
| `official-quartz-substrate` | 「合成石英ガラス基板｜電子材料事業」 | https://www.shinetsu.co.jp/jp/products/%E9%9B%BB%E5%AD%90%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/synthetic-quartz-glass-substrate-2/ | 用途 |
| `official-pvc` | 「塩化ビニル樹脂｜生活環境基盤材料事業」 | https://www.shinetsu.co.jp/jp/products/%E7%94%9F%E6%B4%BB%E7%92%B0%E5%A2%83%E5%9F%BA%E7%9B%A4%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/polyvinyl-chloride-pvc/ | lead |
| `official-caustic-soda` | 「か性ソーダ｜生活環境基盤材料事業」 | https://www.shinetsu.co.jp/jp/products/%E7%94%9F%E6%B4%BB%E7%92%B0%E5%A2%83%E5%9F%BA%E7%9B%A4%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/caustic-soda/ | lead, 用途 |
| `official-metolose` | 「メトローズ®(工業用）｜機能材料事業」 | https://www.shinetsu.co.jp/jp/products/%E6%A9%9F%E8%83%BD%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/metolose-for-industrial/ | lead, 用途 |
| `official-silicon-metal` | 「金属ケイ素｜機能材料事業」 | https://www.shinetsu.co.jp/jp/products/%E6%A9%9F%E8%83%BD%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/silicon-metal/ | lead, 用途 |
| `official-wafer-cases` | 「ウエハーケース｜加工・商事・技術サービス事業」 | https://www.shinetsu.co.jp/jp/products/processing-trading-specialized-services-business/wafer-cases/ | lead, 用途 |

Consulted but not cited in the entry (all official, fetched 2026-09-16): segment pages 電子材料事業 / 生活環境基盤材料事業 /
加工・商事・技術サービス事業 (`/jp/products/<segment>/`), 会社概要 (`/jp/company/profile/`), 半導体封止材
(`…/epoxy-encapsulant-material/`), シリコン単結晶引き上げ用石英るつぼ (`…/quartz-glass-crucible-for-silicon-single-crystal-pulling-applications/`),
ペリクル, メタノール, メチルクロライド, ポバール, and 信越エンジニアリング's ウェハー真空重ね合わせ装置, X線バンプボイド検査装置,
マクロ検査装置, レーザデボンド装置 pages — see Semiconductor industry placement and Gaps. The 決算短信 index page
(https://www.shinetsu.co.jp/jp/ir/ir-data/ir-results/) was used only to confirm the two 短信 URLs. No 統合報告書 was
downloaded (rate-limit budget); nothing depends on one.

## Financials

Source table: `yuho-2026` p.1「１【主要な経営指標等の推移】(1）連結経営指標等」, 回次 第145期–第149期, 決算年月
2022年3月–2026年3月. Row labels as printed: **売上高 （百万円）** and **親会社株主に帰属する当期純利益 （百万円）** (wrapped
onto two lines:「親会社株主に帰属する当期純」/「利益」). Stored value = printed × 1,000,000.

| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (第145期) | 2,074,428 百万円 → 2,074,428,000,000 円 | 500,117 百万円 → 500,117,000,000 円 | J-GAAP | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2023年3月期 (第146期) | 2,808,824 百万円 → 2,808,824,000,000 円 | 708,238 百万円 → 708,238,000,000 円 | J-GAAP | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2024年3月期 (第147期) | 2,414,937 百万円 → 2,414,937,000,000 円 | 520,140 百万円 → 520,140,000,000 円 | J-GAAP | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2025年3月期 (第148期) | 2,561,249 百万円 → 2,561,249,000,000 円 | 534,021 百万円 → 534,021,000,000 円 | J-GAAP | yuho-2026 p.1; identical in yuho-2025 p.1 | Matches tanshin-2026 p.1 prior-year row: 2,561,249 / 534,021 |
| 2026年3月期 (第149期) | 2,573,969 百万円 → 2,573,969,000,000 円 | 474,459 百万円 → 474,459,000,000 円 | J-GAAP | yuho-2026 p.1; p.21 MD&A「２兆5,739億６千９百万円」「4,744億５千９百万円」 | **Matches** tanshin-2026 p.1: 売上高 2,573,969 百万円, 親会社株主に帰属する当期純利益 474,459 百万円. No difference |

**Restatements:** none for either figure. yuho-2025 p.1 (提出日 2025年６月20日; 第144期–第148期) prints the same 売上高 and
親会社株主に帰属する当期純利益 for 2022年3月期–2025年3月期 as yuho-2026 p.1. tanshin-2026 p.2 注記事項:「(1）期中における連結範囲の
重要な変更 ：無」「① 会計基準等の改正に伴う会計方針の変更 ： 無」「② ①以外の会計方針の変更 ： 無」「③ 会計上の見積りの変更 ： 無」
「④ 修正再表示 ： 無」. yuho-2026 p.1 注 concerns only the 2023年4月1日 stock split and per-share rows.

**Accounting standard:** J-GAAP for all five years. yuho-2026 p.83「当社の連結財務諸表は、「連結財務諸表の用語、様式及び作成方法に
関する規則」（1976年大蔵省令第28号）に基づいて作成しています。」; the five-year table uses J-GAAP row labels (経常利益,
親会社株主に帰属する当期純利益, 自己資本比率) in every column of both filings; tanshin title「決算短信〔日本基準〕（連結）」. No
IFRS or US GAAP wording appears in the table or its note.

**`revenueBasis`:** omitted. Consolidated 売上高 throughout; 連結範囲の重要な変更 無.

**`note`:** none. The only special item seen is yuho-2026 p.94 事業再構築費用「機能材料事業セグメントの金属珪素について、その事業の一部を
対象に10,365百万円を計上しました」 (log only). The company does not present it as changing how the year should be read.

Not used: 包括利益 (668,238 / 1,000,984 / 746,804 / 844,146 / 531,832) sits directly below net income; 経常利益 directly
above it. The verification script asserts no stored net income equals the 包括利益 figure.

**Verification performed 2026-09-16** (`verify.mjs` in the scratchpad): parsed the 売上高, 親会社株主に帰属する当期純利益 and
包括利益 rows from yuho-2026 p.1 and yuho-2025 p.1 in both `-raw` and `-table` extracts (label regex joins the wrapped
label), and the 2026年３月期 / 2025年３月期 rows of tanshin-2026 p.1 in both modes; asserted printed × 1,000,000 === stored,
stored ≠ 包括利益, six trailing zeros, and label/standard strings. **80 checks, 0 failures.** Digit counts: revenue 13
digits, net income 12 digits, consistent with 兆円-scale revenue and 千億円-scale net income in 百万円 × 10^6.

## Segment ordering

Four reportable segments, yuho-2026 p.4 (事業の内容, which states「次表の区分は、「第５ 経理の状況 １．(1）連結財務諸表 注記事項」に
掲げるセグメントの区分と同一です」) and p.123 (セグメント情報). No change of reportable segments in the year: neither
yuho-2026 nor tanshin-2026 contains「報告セグメントの変更」. tanshin-2027-q1 p.16 reports the same four segments
(電子材料事業 / 生活環境基盤材料事業 / 機能材料事業 / 加工・商事・技術サービス事業), so the structure is current.

| Segment | 2026年3月期 売上高 計 (as printed, 百万円) | of which 外部顧客への売上高 | 2025年3月期 計 (log only) | Document · page |
|---|---|---|---|---|
| 電子材料事業 | 1,021,779 | 1,015,765 | 939,193 | yuho-2026 p.124 |
| 生活環境基盤材料事業 | 985,618 | 981,370 | 1,046,356 | yuho-2026 p.124 |
| 機能材料事業 | 452,599 | 440,847 | 462,696 | yuho-2026 p.124 |
| 加工・商事・技術サービス事業 | 310,264 | 135,985 | 283,298 | yuho-2026 p.124 |
| 計 / 調整額 / 連結 | 2,770,262 / (196,293) / 2,573,969 | 2,573,969 | 2,731,545 | yuho-2026 p.124 |

The order is the same on both bases (計 and 外部顧客への売上高). The MD&A (p.21) quotes the external figures
(電子材料「１兆157億６千５百万円」, 生活環境基盤材料「9,813億７千万円」, 機能材料「4,408億４千７百万円」, 加工・商事・技術サービス
「1,359億８千５百万円」). Summing the printed segment values gives 2,770,260 (計) and 2,573,967 (external), 2 below the
printed totals; tanshin-2026 p.1 states「百万円未満切捨て」, which explains it. **Note:** in 2025年3月期 生活環境基盤材料事業 was the
larger segment (1,046,356 vs 939,193); the order changed in 2026年3月期, so the entry says「2026年3月期は…もっとも大きい」.
tanshin-2027-q1 p.16 (1Q, 計): 280,922 / 228,978 / 121,966 / 76,048 — same order (log only).

Segment profit (log only; p.123「報告セグメントの利益は、営業利益であり」), 2026年3月期: 電子材料 344,537 / 生活環境基盤材料 164,890 /
機能材料 100,955 / 加工・商事・技術サービス 27,338 (p.124). The entry states only the ranking (電子材料 largest).

**Children.** No segment's revenue is split by product in the 有報: p.125「製品及びサービスごとの情報 セグメント情報に同様の情報を開示して
いるため、記載を省略しています」; the p.121 収益の分解 splits only by 国内で生産 / 海外で生産. The children are therefore **not
ranked** and carry no amounts. They are the products the company itself names as each segment's main business in the
p.4 lead:「半導体シリコン、希土類磁石、フォトレジスト、マスクブランクス、合成石英製品等の製造・販売を主体とする「電子材料事業」、塩化ビニル
樹脂、か性ソーダ等の製造・販売を主体とする「生活環境基盤材料事業」、シリコーン、セルロース誘導体、金属珪素等の製造・販売を主体とする
「機能材料事業」、信越ポリマーグループの事業およびエンジニアリングをはじめとする各種役務提供を行う「加工・商事・技術サービス事業」」, in that
listed order. 加工・商事・技術サービス事業 has no children: the p.4 lead names no products for it, and the official page lists
products by group company (信越ポリマー / 信越エンジニアリング / 信濃電気製錬 / 信越フィルム) rather than product businesses.
`products` on each segment are the p.4 table「主要製品及び商品名」 as printed.

## Claims

### Identity

- `code` 4063 → tanshin-2026 p.1「コード番号 4063」; tanshin-2027-q1 p.1 the same.
- `officialName` → yuho-2026 表紙「【会社名】 信越化学工業株式会社」. `nameEn` → 表紙「【英訳名】 Shin-Etsu Chemical Co., Ltd.」 (identical in yuho-2025).
- `shortNameEn` SHIN-ETSU CHEMICAL → 英訳名 minus「Co., Ltd.」, uppercased. Not shortened to「SHIN-ETSU」: the group includes listed 信越ポリマー (p.4「信越ポリマー㈱（東証プライム上場）」) and 信越半導体, so「SHIN-ETSU」 alone would not identify this company.
- `listings` → yuho-2026 p.28 株式の総数等「上場金融商品取引所名」:「㈱東京証券取引所 プライム市場」「㈱名古屋証券取引所 プレミア市場」; tanshin-2026 p.1「上場取引所 東 名」.
- `description` (66 characters, one sentence) → 化学メーカー: official-individual-about「信越化学は、４つの事業分野を中心に、産業や生活の基礎になる素材、製品を作っている化学メーカーです。」; 半導体の材料になるシリコンウエハー: official-silicon-wafer「シリコンウエハーは半導体の「基板」となる素材であり」; 水道管などに使われる塩化ビニル樹脂: official-pvc「用途の一例としては上下水道のパイプ、窓枠、床材、ラップフィルム、バッグ、雑貨などです」; シリコーン: p.4; 世界に販売: p.20「２０２６年３月期の当社グループ連結売上高の海外売上高比率は７９％」, p.9「世界中の顧客に安定的に製品供給を行っています」.

### Businesses

- 電子材料事業 description → official-products「半導体の製造に欠かせない各種材料をはじめ、環境対応や情報通信などの最先端で課題解決に不可欠な材料を提供しています。」; p.4「製造・販売を主体とする」; 「2026年3月期は…もっとも大きい」→ p.124 (table above).
- 半導体シリコン → official-silicon-wafer「金属ケイ素から、９９．９９９９９９９９９％という高純度のケイ素の塊、多結晶シリコンが作られます。」「信越化学では、この多結晶シリコンを原料に、結晶成長技術を駆使して一定の原子配列を持った直径約３０センチ、長さ約１ｍという大きなシリコンの結晶（単結晶）を作ることができます。この単結晶の塊（インゴット）を、薄くスライスして作られるのがシリコンウエハーです。」「スマートフォン、パソコン、デジタル家電、自動車等、私たちの身の回りに数多く使われています」; デバイスメーカーに運ばれ → official-semiconductor-products image, process column after「シリコンウエハーの完成。」:「ウエハーをデバイスメーカーに搬送」 [image, read visually]; also official-wafer-cases「ウエハーメーカーからデバイスメーカーへのウエハー輸送用シッピングボックス」. 「半導体デバイスをつくる会社」 is a plain-word gloss of デバイスメーカー, placed in the chain the image draws (シリコンウエハー → … → 半導体デバイス). The shortName「シリコンウエハー」 → p.21 MD&A「シリコンウエハー、フォトレジスト、マスクブランクス等の半導体材料」 and p.24「半導体シリコンに関する研究は…シリコンウエハーの生産技術の向上」.
- 希土類磁石 → official-neodymium-magnet「高特性レア・アースマグネットの中でも最高峰に位置するのが、ネオジウム（Nd）、鉄（Fe）、ボロン（B）を主成分とする「信越ネオジウム（Nd）磁石Nシリーズ」です。」「希土類磁石の代表製品として」; 用途「HV、EV、FCV用駆動モータ＆発電機」「家電用モータ（エアコンコンプレッサー、洗濯機、掃除機等）」「デジタルカメラ・スマートフォンカメラ用アクチュエーター」. レア・アース = 希土類 → p.24「レア・アース、一般用希土類磁石は磁性材料研究所で研究を実施しています」. 「最高峰」 not used. HV/EV glossed as ハイブリッドカーや電気自動車; FCV and 発電機 omitted for brevity.
- フォトレジスト → official-photoresist「半導体などの回路パターンを、シリコンウエハー上に描画する工程で用いる、感光性の樹脂です。シリコンウエハーの表面に塗布したレジストに、回路パターンを描いたフォトマスクを通した光を照射し反応させることにより、回路パターンを形成させます。」
- マスクブランクス → official-photomask-blanks「合成石英の基板上に遮光性の薄膜を形成したフォトマスクの材料で、半導体製造工程において、シリコンウエハー上に描画する回路の原版として用いられます。」
- 合成石英製品 → official-quartz-preform「高純度の合成石英をベースにしたガラス状のロッド」, 用途「光通信用」; official-quartz-substrate 用途「半導体用/FPD用フォトマスク基板」; p.24「合成石英製品のうち、光ファイバー用プリフォームは精密機能材料研究所、半導体用マスク基板や液晶用大型マスク基板は合成技術研究所が担当しています」.
- 生活環境基盤材料事業 description → official-products「上下水道などの生活基盤に欠かせない素材や生活用品、食品などに幅広く使われる材料を世界中に送り出しています。」 (the entry reads it as 素材 + 材料 used in 生活用品・食品).
- 塩化ビニル樹脂 → official-pvc「塩化ビニル樹脂は原料の6割が天然由来の塩で」「また耐久性が高く」 (uses as above); 「塩ビ」→ official-individual-about「塩ビの主な用途」; シンテックINC. / シンエツPVC B.V. → p.4 主要な会社 and p.26 在外子会社 設備:「シンテックINC.」「ルイジアナ工場ほか(米国)」「塩化ビニル樹脂及び同原料製造設備」, 「シンエツPVC B.V.」「ロッテルダム工場ほか(オランダ)」.
- か性ソーダ → official-caustic-soda「か性ソーダは塩の電気分解によって得られる代表的なアルカリ製品です。」「強アルカリ性」「あらゆる産業に欠かせない基礎化学品として使用されています。」; 用途「上下水道や工業排水の中和剤」「パルプ製造時の木質チップの蒸解」「石鹸ベースの洗剤の製造」.
- 機能材料事業 description → official-products「食品、化粧品、医薬品など身近な分野から建築、農業など多様な分野のニーズに、高度な機能で応える材料を生み出しています。」
- シリコーン → official-functional-materials 取り扱い製品「シリコーンオイル」「シリコーンレジン」「シリコーンゴムコンパウンド」 (and RTVシリコーンゴム rows); official-individual-about「シリコーンの主な用途」: スマートフォン、パソコン / 日焼け止め / シーリング / エアバッグ, 化粧品原料.
- セルロース誘導体 → p.3 沿革「セルロース誘導体（メトローズ等）の製造開始」 (so メトローズ is one of the products); official-metolose「メトローズ ® は、水に溶けないセルロースを化学的に処理し、水溶性の高分子としたものです。」, 用途「セメントモルタル」; official-individual-about「セルロースの主な用途」「医薬品（錠剤のコーティング剤）」「食品用（米粉パン、大豆肉など）」. The entry does not claim that every セルロース誘導体 is water-soluble.
- 金属珪素 → official-silicon-wafer「そこにたくさん含まれているケイ素を取り出して、作られるのが金属ケイ素。」; official-silicon-metal「金属ケイ素は、シリコーン、半導体シリコン、合成石英などの主原料になります。」, 用途「半導体用多結晶シリコン(ポリシリコン)」. name uses the 有報 spelling 金属珪素; shortName the official page's 金属ケイ素.
- 加工・商事・技術サービス事業 → official-products「グループ会社とともに、樹脂加工製品の製造、各種機器や工場のエンジニアリングなど、幅広い事業を展開しています。」; p.4 (lead above; products「樹脂加工製品、技術・プラント輸出、商品の輸出入、エンジニアリング」; 主要な会社「信越ポリマー㈱」); p.3「信越ポリマー株式会社（合成樹脂の加工 現連結子会社）」; ウエハーケース → official-wafer-cases「ウエハーメーカーとデバイスメーカーとの間の輸送に使われるシッピングボックスとデバイスメーカーの工程内で使用される工程内容器です。」, page breadcrumb places it in 加工・商事・技術サービス事業; p.21「半導体ウエハー関連容器は需要が堅調でした」.
- `[[term:…]]`: semiconductor, wafer, subsidiary — existing terms; the wafer term's label is overridden with the company's spelling「シリコンウエハー」.

### Business model

- description → p.21 (半導体材料 list), official-individual-about (産業や生活の基礎になる素材), p.4 (products, 役務提供), p.121 (国内で生産 / 海外で生産 revenue on every segment).
- customers「エレクトロニクス業界」→ p.20 ⑥「当社グループの主要販売先の一つであるエレクトロニクス業界は、技術的な進歩が急速で」. 「デバイスメーカー（シリコンウエハーの届け先）」→ image「ウエハーをデバイスメーカーに搬送」 and official-wafer-cases (above). See Gaps 3.
- revenueSources → p.121「各製品の製造販売を主な事業としており、顧客との販売契約に基づいて製品を引き渡す履行義務を負っています。」; 商品の輸出入 and エンジニアリング → p.4 products and「エンジニアリングをはじめとする各種役務提供」.
- flow company → p.4「当社グループは、当社、子会社１３４社及び関連会社１１社（２０２６年３月３１日現在）により構成され」「当社及び関係会社が製造・販売等を分担し、相互に協力して、事業活動を展開しています。」; overseas production → p.26 在外子会社 設備 locations (米国), (オランダ), (マレーシア), (ドイツ), (英国), (タイ), (ベトナム), （台湾）; p.25 国内 plants (直江津工場, 伊勢崎工場 …). The entry names five countries and says「など」.
- flow offering → p.4, p.21.
- flow customer → p.20 (エレクトロニクス業界; 海外売上高比率 79%); image (デバイスメーカー); p.125 主要な顧客ごとの情報「外部顧客への売上高のうち、連結損益計算書の売上高の10％以上を占める相手先がないため、記載していません。」 (both years). Derived cross-check, log only: 1 − 日本 549,936 / 2,573,969 (p.125 地域ごとの情報) = 78.6%, consistent with the printed 79%.
- flow revenue「2兆5,739億6,900万円」→ p.21「２兆5,739億６千９百万円」 rewritten in digits (format change only); 「0.5%増えました」→ p.21「前期に比べ0.5％（127億２千万円）増加し」; ranking → p.124.
- flow profit「4,744億5,900万円」「11.2%減りました」→ p.21「親会社株主に帰属する当期純利益は、前期に比べ11.2％（595億６千２百万円）減少し、4,744億５千９百万円となりました。」; 市況 → p.21「一部の製品で市況下落の影響を受けたことにより、営業利益は、前期に比べ14.4％（1,069億１百万円）減少し」 — the entry attaches the market effect to 営業利益 exactly as the sentence does; 営業利益 ranking → p.124 (セグメント利益 = 営業利益, p.123).

### History

- 1926 description → yuho-2026 p.3「1926年９月 信濃電気株式会社と日本窒素肥料株式会社との共同出資により、信越窒素肥料株式会社として発足」「1927年11月 新潟県中頸城郡（現上越市）に直江津工場を建設、石灰窒素の製造開始」; official-history「長野県の豊かな水力が生み出す電力。」「新潟県・親不知の大地から採れる石灰石。」「化学肥料・石灰窒素を生産する「信越窒素肥料株式会社」が大正１５年（１９２６年）９月に発足。」
- 1926 significance → official-history「私たち信越化学工業株式会社の歴史はそこからスタートしました。」; p.3「1940年３月 社名を信越化学工業株式会社に変更」; official-individual-about (化学メーカー, 4つの事業分野).
- 1953 description → p.3「1953年10月 磯部工場において珪素樹脂（シリコーン）の製造開始」; official-history row 1953「シリコーンの工業生産開始」; official-individual-history row 1953「日本で初めてシリコーンを事業化。」 (attributed to the company; the same row's「国内のトップシェア」 not used).
- 1953 significance → p.4 (シリコーン in 機能材料事業 lead); official-individual-about シリコーンの主な用途.
- 1960 description → p.3「1960年７月 磯部工場において半導体シリコンの製造開始」「1967年３月 信越半導体株式会社（半導体シリコンの製造 現連結子会社）を設立」; official-history row 1960「高純度シリコンの製造開始」.
- 1960 significance → p.4 lead; p.124 (largest segment 2026年3月期); p.24「半導体シリコンに関する研究は信越半導体（株）の２つの研究所で実施され、シリコンウエハーの生産技術の向上」; p.3「現連結子会社」.
- 1973 description → p.3「1973年７月 シンテックINC.（塩化ビニルの製造 現連結子会社）を米国に設立」; official-history rows 1973「「シンテック社」を設立（米）」, 1974「シンテック フリーポート工場が操業開始」.
- 1973 significance → p.4 (シンテックINC. among 生活環境基盤材料事業 主要な会社); p.26 (ルイジアナ工場ほか, 塩化ビニル樹脂及び同原料製造設備); official-individual-about「1974年に操業を開始した米国子会社のシンテックが生産能力を創業時の36倍にまで拡大。」 The same passage's「世界最大の塩ビメーカーに成長しています」 was not used (superlative).
- 1992 description → p.3「1992年４月 直江津工場においてフォトレジスト製品の製造開始」; official-history row 1998「フォトレジストの事業化」. See Gaps 5.
- 1992 significance → p.4 lead; p.21「伸びの強い市場にシリコンウエハー、フォトレジスト、マスクブランクス等の半導体材料の売上を伸ばしました。」
- 2003 description → p.3「2003年12月 シンエツインターナショナルヨーロッパB.V.(オランダ 現連結子会社)がドイツのセルロース事業会社クラリアント タイローズGmbH & Co. KG（現SE タイローズ GmbH & Co. KG 現連結子会社）を買収」; official-history row 2003「ドイツのセルロース事業を買収し、「SE タイローズ社」設立（独）」.
- 2003 significance → p.4 (SEタイローズ GmbH & Co. KG among 機能材料事業 主要な会社); p.26「SE タイローズ GmbH & Co.KG」「本社工場」「(ドイツ)」「セルロース誘導体製造設備」; p.24「セルロース誘導体に関する研究は合成技術研究所及びドイツのＳＥタイローズ社で行っています。」; official-history row 2025「医薬セルロース事業へ日本とドイツで積極投資を発表」. Two facts side by side; the entry does not say the 2025 investment is in SE タイローズ.
- 2026 description → p.3「2026年１月 群馬県伊勢崎市に伊勢崎工場を新設」; p.25 主要な設備「伊勢崎工場（群馬県伊勢崎市）」「電子材料 半導体露光材料製造設備」.
- 2026 significance → official-history row 2024「群馬県伊勢崎市に半導体露光材料で第四の生産拠点となる工場の建設を発表」; p.9「飛躍的に成長する半導体産業に必要不可欠な素材と技術を提供し」. The entry does not state that the 2024 plan and the 2026 plant are the same plant (no document says so), only both facts.

**Passage check performed 2026-09-16** (`claims.mjs` in the scratchpad): every outermost「…」 in this log (split at …,
NFKC- and whitespace-normalised) was searched for in the extracted text of yuho-2026, yuho-2025, both 短信, every saved
official page, the IR listing page and `semiconductors.json`. Result on the final log: **241 quotes, 215 found, 26 not found**. Every quote
not found is expected and none is a source quote: they are (a) text read from the image in `official-semiconductor-products`
(its title, its column heading, the step caption and the shipping caption), which a script cannot read; (b) the absence
search string for segment changes; (c) the entry's own wording or the draft's wording quoted for comparison (the
rewritten 売上高 / 純利益 figures, the percentages written as「増えました / 減りました」, and the items under "Changes from the
draft"). Page attributions were then checked with `findp.mjs` (for each quote, the nearest preceding page citation on
the same line must be a yuho-2026 page containing it): **72 quotes checked, 4 flagged**, all flags being false positives of that
heuristic (the page-mapping note for p.1, the generic word など, a PDF-page number next to its printed page, and a
Gaps sentence citing p.125 before quoting p.20).

## Semiconductor industry placement

Categories in `src/data/industries/semiconductors.json`: stages 設計 / 前工程（回路づくり） / 後工程（組み立て・検査） /
電子機器への組み込み; inputs 製造装置 / 部素材・原料. The 部素材・原料 description reads「回路をつくる土台になるシリコンウェーハや、
パッケージに使う基板・リードフレーム・樹脂などの部素材と、ヘリウムや希ガスなどの原料です。」

**Recommendation: `materials`（部素材・原料）.** `industries` includes `semiconductors` (secondary).

Supporting passages from Shin-Etsu's own documents:

1. `official-silicon-wafer`: 「シリコンウエハーは半導体の「基板」となる素材であり」 — the category's first named item,「回路をつくる土台になるシリコンウェーハ」.
2. `yuho-2026` p.21 (MD&A, 電子材料事業): 「伸びの強い市場にシリコンウエハー、フォトレジスト、マスクブランクス等の半導体材料の売上を伸ばしました。」 — the company calls these products 半導体材料.
3. `yuho-2026` p.4 and p.123: 電子材料事業 products「半導体シリコン」「半導体用封止材」「フォトレジスト」「マスクブランクス」; p.25 伊勢崎工場「半導体露光材料製造設備」; p.9「飛躍的に成長する半導体産業に必要不可欠な素材と技術を提供し」.
4. Official page「半導体封止材」 (`…/epoxy-encapsulant-material/`, not cited in the entry): 「各種電子部品のトランスファー成型による樹脂封止用のエポキシ材料です。」 — matches「パッケージに使う…樹脂」 in the category description.
5. `official-semiconductor-products` image「半導体製造工程に関わる信越化学グループの製品」 [image, read visually]: column「当社グループが供給する製品」 lists 金属ケイ素, 石英るつぼ, 炭化ケイ素研磨微粉, シリコンウエハー, ウエハーケース, 半導体製造プロセス用石英ガラス, レア・アース（酸化イットリウム）, 合成石英フォトマスク基板, フォトレジスト（感光材料）, フォトマスクブランクス（回路描画用パターン原版）, ペリクル（フォトマスク用防じんカバー）, 封止材, シール材（液状封止材）, 放熱シリコーンゴム加工品, with arrows into the process steps 原料 → 単結晶シリコン → 切断・研磨 → シリコンウエハー → CVD、酸化 → パターン形成 → 樹脂封止 → 半導体デバイス. The page's text lead:「半導体デバイスの製造に欠かせないのがShin-Etsuの製品。」

Why not a stage: every passage describes materials Shin-Etsu **supplies to** device makers (「ウエハーをデバイスメーカーに搬送」). None says Shin-Etsu designs, fabricates, assembles or builds semiconductors into devices for sale. p.24 mentions 化合物半導体「赤色ＬＥＤ用エピタキシャルウエハー及びチップの製品化」 — an LED chip product inside 電子材料事業, not described as a semiconductor device business, and no revenue split exists; not used for placement.

Why not 製造装置 as well: the group does sell semiconductor-related equipment — 信越エンジニアリング (加工・商事・技術サービス事業) pages:「レーザデボンド装置」「半導体パッケージング工程、超薄型半導体の製造工程において、テンポラリボンディング層をレーザによりストレスなく剥離する工程に用いられる」, 「X線バンプボイド検査装置」「ウェハー上のバンプを自動で検査、判定を行うX線自動検査装置です。」; official-history row 2024「後工程半導体パッケージ基板製造装置と新工法の開発」. These sit in the smallest segment (external revenue 135,985 百万円, p.124), whose company-stated content is 信越ポリマーグループ's business and engineering services (p.4); no document sizes the equipment sales. I recommend **not** adding Shin-Etsu to 製造装置; the lead may judge otherwise on these passages.

**Primary industry: `chemicals`.** Figures (yuho-2026 p.124, 2026年3月期, 外部顧客への売上高): 電子材料事業 1,015,765 of 2,573,969 = 39.5% (derived); the other three segments (塩化ビニル樹脂・か性ソーダ, シリコーン・セルロース誘導体, 樹脂加工) 1,558,202 = 60.5% (derived). On the 計 basis 電子材料 is 1,021,779 of 2,770,262 = 36.9% (derived). 電子材料事業 is itself not all semiconductor material — it includes 希土類磁石 and 合成石英製品 such as 光ファイバー用プリフォーム (p.4, p.24) — and no document splits it further, so semiconductor-related revenue is **at most** about 40% and cannot be stated more exactly. The company describes itself as a 化学メーカー (official-individual-about, quoted above), and the auditor's report bound in yuho-2026 (独立監査人の監査報告書, printed p.146 = PDF p.149,「監査上の主要な検討事項」) describes it as「各製品の製造販売を主な事業としている化学メーカーである」 (auditor's wording, log only). So `chemicals` primary, `semiconductors` secondary because the largest single segment is built around 半導体材料 (passages 1–5).

## Gaps and judgement calls

No value is `null`. No unverified claim remains. Status: `published`.

1. **Children are product groups, unranked.** The 有報 prints no product revenue split for any segment (p.125). Children follow the p.4 lead order and carry no amounts. 電子材料事業 lists 半導体用封止材 and LED用パッケージ材料 in its products but not as children, because the p.4 lead does not name them among what the segment「主体とする」.
2. **Segment order changed year on year.** 生活環境基盤材料事業 was larger in 2025年3月期; the entry's「もっとも大きい」 is stated for 2026年3月期 only.
3. **Customers.** The 有報 names no individual customer (p.125: none over 10%). Group-level「エレクトロニクス業界」 (p.20) is on the business model only, not attached to 電子材料事業, because p.20 does not tie it to a segment. 「デバイスメーカー」 rests on the image and the ウエハーケース page, which describe where wafers are shipped rather than calling device makers customers; labelled「シリコンウエハーの届け先」 accordingly.
4. **Evaluative language not used:**「世界最大の塩ビメーカー」「トップシェア」「世界ナンバー１」 (official-individual-about), 「世界トップの地位」「世界トップメーカ」「国内のトップシェア」 (official-individual-history), 「最高峰」 (neodymium page), 「世界トップレベルの品質」 (p.24), 「リーディング・カンパニー」 (official-history symbol mark text), p.9「他の追随できない素材技術」.
5. **Product years differ across the company's own documents.** Photoresist: 1992 製造開始 (有報 沿革), 1998 事業化 (official-history), 1997 (official-individual-history). The entry uses the 有報 year and names the official-history year; the 1997 row is recorded here only. Similar differences exist for events **not** used: 塩化ビニル (有報 1957「アセチレン法による塩化ビニル、か性ソーダの製造開始」; official-history 1956「塩化ビニル樹脂の製造開始」; individual-history 1957), 希土類磁石 (有報 1973 製造開始; official-history 1972 開発; individual-history 1976), マスクブランクス (有報 2005 製造開始; individual-history 2009). These differences partly reflect different events (開発 / 製造開始 / 事業化); they were one reason 1957 塩化ビニル was not chosen as an event — 1973 シンテック represents the 塩化ビニル business instead.
6. **History selection (7 events).** Left out, all documented: 1938 磯部工場, 1940 社名変更 (folded into 1926), 1949 東証上場, 1960 信越ポリマー設立 (origin of the 加工・商事 segment's core company; considered, left out to stay within 8 and because the segment is the smallest), 1962 セルロース誘導体製造開始, 1970 鹿島工場, 1973 希土類磁石, 1979 合成石英フォトマスク基板, 1983 光ファイバー用プリフォーム, 1999 シンエツPVC (オランダ), 2001 タイのシリコーン会社, 2005 マスクブランクス, 2020 シンテック エチレン製造, 2022–2023 売上高初の2兆円台 / 経常利益初の１兆円台 (records, not turning points), 2024 三益半導体工業 完全子会社化. **2026 伊勢崎** is the weakest as a turning point; it is kept because it is the latest capacity step in the largest segment's 半導体材料 business and is documented in both the 有報 and the official history (2024 announcement).
7. **「半導体露光材料」 not explained.** Neither document says what the 伊勢崎 plant makes beyond「半導体露光材料」, so the entry does not equate it with フォトレジスト.
8. **Derived figures.** Only in this log: segment shares (39.5% / 60.5% / 36.9%), the 78.6% overseas cross-check, and the 2-million rounding gap. In the entry, 2兆5,739億6,900万円 and 4,744億5,900万円 are the company's own p.21 figures rewritten in digits; 0.5%, 11.2% and 79% are printed. No other numbers are derived.
9. **Image source.** The 07.半導体と信越製品 page's content is a single image; its text was read visually (legible at the rendered size) and cannot be checked by script. Only「ウエハーをデバイスメーカーに搬送」 and the product list were used.
10. **EDINET not checked.** No API key. "Latest filed" and "no 訂正報告書 for 第149期" rest on the company's IR page.
11. **Revision file date.** The revision keeps the file name and `changedAt` 2026-09-15 (when research began, per the lead's instruction); its summary states completion on 2026-09-16. `updatedAt` and every `accessedAt` are 2026-09-16.

### Changes from the 2026-09-15 draft

- **Removed** `customers: ["エレクトロニクス業界"]` from 電子材料事業 (p.20 is group-level, not segment-level); kept on the business model.
- **Fixed** セルロース誘導体: the draft attributed メトローズ's water-solubility to all セルロース誘導体; now stated for メトローズ only.
- **Fixed** 希土類磁石: 「代表製品のネオジム磁石」 now attributed to the company, with the page's components (ネオジム・鉄・ボロン).
- **Fixed** か性ソーダ wording (「石けんを使った洗剤」→「石けんをもとにした洗剤」, as the page's「石鹸ベースの洗剤」).
- **Fixed** 合成石英製品:「光ファイバーのもとになるプリフォーム」→「光ファイバー用のガラスの棒（プリフォーム）」 (the page's「ガラス状のロッド」).
- **Fixed** profit step: the draft tied「市況下落」 to net income; p.21 ties it to 営業利益. Added the printed 0.5% revenue change.
- **Changed** company step: the vague「米国やアジア、欧州など」 now names countries from p.26.
- **Added** 1953「日本で初めてシリコーンを事業化」 (attributed) and source `official-individual-history`; 1973 フリーポート工場 1974 from official-history; 1973 and 2003 significance now cite the p.26 facilities; PVC child names シンエツPVC B.V.
- **Added** `tanshin-2027-q1` as a source (segment structure confirmation) and to each segment's sourceIds.
- **Changed** 加工・商事・技術サービス事業 ウエハーケース sentence to the page's own description of what the case carries.
- **Updated** all `accessedAt` and `updatedAt` to 2026-09-16 after re-fetching; source titles aligned to page titles; URLs use the percent-encoding that was fetched.
- **Kept unchanged** (verified): identity fields, listings, all five financial records, segment order, industries (chemicals primary, semiconductors secondary), all seven history years and titles.
