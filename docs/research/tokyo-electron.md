# 東京エレクトロン — research log

Researched: 2026-09-13 (documents downloaded and read) · 2027年3月期 1Q 決算短信 read, entry re-verified and finalized 2026-09-14

Page numbers are the **printed** page numbers (the `- n -` footer). For `yuho-2026` and `yuho-2025`
the printed page is PDF page index − 3 (PDF p.4 = 表紙 p.1). Presentation pages are slide numbers
(the `Investor Relations / April 30, 2026 n` footer), confirmed by single-page extraction.

Text was extracted with `pdftotext -enc UTF-8` (without `-enc UTF-8`, xpdf 4.06 dropped every Japanese
character from this 有報). Figures were read in `-raw` and `-table` modes. **`-layout` mode
misaligned p.2:** it printed the label 親会社株主に帰属する当期純利益 next to the 経常利益 continuation
and put the **包括利益** row (486,183 / 501,421 / 478,281 / 476,095 / 624,335) where a reader would take
it for net income. `-layout` was not relied on for any value.

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書 第63期（自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月22日. Confirmed latest: TEL's IR page「有価証券報告書等」(https://www.tel.co.jp/ir/library/fs/) lists「2026年3月期（第63期） 有価証券報告書（2025.04 - 2026.03）」under「最新の有価証券報告書・半期報告書」, with no 訂正 file for 第63期 | https://www.tel.co.jp/ir/library/fs/arfnn500000000ni-att/yuho63q4.pdf | 1, 2, 4, 5, 6, 7, 21, 23, 24, 25, 26, 30, 57, 73, 78, 81, 90, 123, 124, 126, 127, 129 |
| `tanshin-2026` | 2026年3月期 決算短信〔日本基準〕（連結）, 2026年4月30日 | https://www.tel.co.jp/ir/library/report/jngpc500000000l6-att/fy26q4tanshin-j.pdf | p.1 (summary page). The attachment pages (経営成績等の概況 onward) extract as mojibake (font without ToUnicode), so they were not used |
| `yuho-2025` | 有価証券報告書 第62期（自 2024年4月1日 至 2025年3月31日）, 提出日 2025年6月16日 | https://www.tel.co.jp/ir/library/fs/qmu38m00000000ll-att/yuho62q4.pdf | 1, 2 (five-year table), 5, 22, 27, 130 (segment definition) |
| `presentation-2026` | 2026年3月期 決算説明会資料 (2026年4月30日) | https://www.tel.co.jp/ir/library/report/jngpc500000000l6-att/fy26q4presentations-j.pdf | slides 8, 9, 26 (category names only; no amounts or percentages used) |
| `tanshin-2027-q1` | 2027年3月期 第1四半期決算短信. Read 2026-09-14 to check the segment structure after year end. The date on p.1 extracts as mojibake, so `publishedAt` is omitted; clean text on later pages is headed「東京エレクトロン㈱ (8035)　2027年3月期　第1四半期決算短信」 | https://www.tel.co.jp/ir/irta3a00000006g5-att/fy27q1tanshin-j.pdf | 経営成績の概況; セグメント情報等の注記 |
| `official-history` | 公式サイト「東京エレクトロンの歴史」(no page date) | https://www.tel.co.jp/about/milestones/index.html | TELの沿革 1960年代–2020年代; milestone panels 1963 / 1991 / 1994 / 2015 / 2022 |
| `official-products` | 公式サイト「製品・サービス（半導体製造プロセスから探す）」(no page date) | https://www.tel.co.jp/product/index.html | 成膜, リソグラフィ, エッチング, 洗浄, テスト sections |
| `official-service` | 公式サイト「サービス」(page title「サービス \| 東京エレクトロン株式会社」, breadcrumb「製品・サービス（サービス）」; no page date) | https://www.tel.co.jp/product/service/index.html | whole page |
| `official-about-semiconductor` | 公式サイト「半導体を知る」(no page date) | https://www.tel.co.jp/aboutsemiconductor/index.html | Question 01 |
| `glossary-silicon-wafer` | nanotec museum「半導体用語集」シリコン・ウェーハ (TEL-operated site, "PRESENTED BY TOKYO ELECTRON") | https://www.tel.co.jp/museum/words/words12.html#word05 | entry word05 |
| `glossary-photoresist` | nanotec museum「半導体用語集」フォトレジスト | https://www.tel.co.jp/museum/words/words15.html#word12 | entry word12 |

Consulted but not cited: 統合報告書 2025 (ir2025_all.pdf). Its text layer mostly failed to extract
(Adobe-Japan1 collection errors), and the correction notice (ir2025correction_web_j.pdf) only
concerns p.67. Nothing in the entry depends on it.

## Financials

Source table: `yuho-2026` p.2「1【主要な経営指標等の推移】(1) 連結経営指標等」, 回次 第59期–第63期, 決算年月
2022年3月–2026年3月. Row labels as printed: **売上高** and **親会社株主に帰属する当期純利益** (wrapped onto
two lines, 「親会社株主に帰属する当期／純利益」). Unit (百万円). Stored value = printed × 1,000,000.

| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (第59期) | 2,003,805 百万円 → 2,003,805,000,000 円 | 437,076 百万円 → 437,076,000,000 円 | J-GAAP | yuho-2026 p.2; identical in yuho-2025 p.2 | n/a |
| 2023年3月期 (第60期) | 2,209,025 百万円 → 2,209,025,000,000 円 | 471,584 百万円 → 471,584,000,000 円 | J-GAAP | yuho-2026 p.2; identical in yuho-2025 p.2 | n/a |
| 2024年3月期 (第61期) | 1,830,527 百万円 → 1,830,527,000,000 円 | 363,963 百万円 → 363,963,000,000 円 | J-GAAP | yuho-2026 p.2; identical in yuho-2025 p.2 | n/a |
| 2025年3月期 (第62期) | 2,431,568 百万円 → 2,431,568,000,000 円 | 544,133 百万円 → 544,133,000,000 円 | J-GAAP | yuho-2026 p.2; identical in yuho-2025 p.2; yuho-2026 p.81 連結損益計算書 前連結会計年度 544,133 | Matches tanshin-2026 prior-year row: 2,431,568 / 544,133 |
| 2026年3月期 (第63期) | 2,443,533 百万円 → 2,443,533,000,000 円 | 574,454 百万円 → 574,454,000,000 円 | J-GAAP | yuho-2026 p.2; p.81 連結損益計算書 当連結会計年度 574,454; p.123 外部顧客への売上高 2,443,533 | **Matches** tanshin-2026 p.1: 売上高 2,443,533 百万円, 親会社株主に帰属する当期純利益 574,454 百万円. No difference |

**Restatements:** none. yuho-2025 p.2 (提出日 2025年6月16日) prints the same 売上高 and 親会社株主に帰属する
当期純利益 for 2022年3月期–2025年3月期 as yuho-2026 p.2. tanshin-2026 p.1:「連結範囲の重要な変更：無」,
「会計基準等の改正に伴う会計方針の変更：無」「①以外の会計方針の変更：無」「修正再表示：無」. The only
presentation change in yuho-2026 (p.90, 表示方法の変更) moves 固定資産売却益 31百万円 into 特別利益「その他」 and
does not affect either figure.

**Accounting standard:** J-GAAP for all five years. yuho-2026 p.78「当社の連結財務諸表は、「連結財務諸表の用語、
様式及び作成方法に関する規則」(1976年大蔵省令第28号)に基づいて作成しております。」; p.25「我が国において一般に
公正妥当と認められる会計基準に基づき作成されております」; tanshin title「決算短信〔日本基準〕（連結）」. The p.2
table carries J-GAAP row labels (経常利益, 親会社株主に帰属する当期純利益, 包括利益) for all five columns, and no
standard change is noted.

**`revenueBasis`:** omitted. The five-year table is consolidated 売上高 throughout, both filings define one
segment, and no scope change is noted.

**`note` on 2026年3月期** → yuho-2026 p.24「当連結会計年度の特別利益1,207億2千6百万円は、主に政策保有株式を一部売却し
投資有価証券売却益1,154億9千4百万円を計上したことによるものです。」 The plain-language gloss of 政策保有株式 comes
from p.73「当社は政策保有株式を持たないことを基本方針としております。ただし、発行会社との関係性において、中長期的な
関係維持、安定的な調達、技術提携の維持のための取引先への出資など、当該株式を保有する高度の合理性があると判断する場合
に限り、当社は他社株式を保有します。」 The note deliberately gives **no amount** (invariant 4: revenue
and net income are the only amounts shown) and **no causal claim**: the 有報 does not say how much of the
+5.6% change in net income the gain explains. Context, log only: 営業利益 624,936 百万円 (−10.4%) (tanshin p.1).

**Verification performed 2026-09-14** (`verify.mjs` in the scratchpad): parsed the 売上高, 親会社株主に帰属する当期
純利益 and 包括利益 rows from yuho-2026 p.2 and yuho-2025 p.2, in both `-raw` and `-table` extracts, plus the
2026 and 2025 rows of tanshin-2026 p.1 in both modes. Compared each with the values in
`src/data/companies/tokyo-electron.ts`: printed × 1,000,000 === stored for all 28 comparisons, 0
failures. The script also asserts that no stored net income equals the 包括利益 figure for the same year.

Not used: 当期純利益 (incl. non-controlling interests). It is identical, 544,133 / 574,454 (p.81), with
no non-controlling interest line. It is still not the label used.

## Segment ordering

There is **one** reportable segment, so there is nothing to order at the top level.

| Segment | Segment revenue (as printed) | Document · page |
|---|---|---|
| 半導体製造装置 (single segment) | = consolidated 売上高 2,443,533 百万円 | yuho-2026 p.5「当社グループは「半導体製造装置」の単一セグメントであるため、セグメント別の記載を省略しております」; p.126「【セグメント情報】当社グループは、「半導体製造装置」の単一セグメントであるため、記載を省略しております。」 and「製品及びサービスごとの情報 報告セグメントと同一区分のため、記載を省略しております。」 |

Structure is current: yuho-2025 p.5, p.22, p.27 and p.130 use the same wording (「当社グループは「半導体製造装置」の
単一セグメントであるため…」), and tanshin-2027-q1 says「(セグメント情報等の注記) 当社グループは、「半導体製造装置」の
単一セグメントであるため、記載を省略しております。」 No reorganisation was announced in yuho-2026: 重要な後発事象
(p.129) lists only 1 自己株式の消却, 2 自己株式の取得枠設定 and 3 株式分割及び株式分割に伴う定款の一部変更.

Children of 半導体製造装置, ordered by the company's own revenue split, yuho-2026 p.123 (収益認識関係「製品及びサービス」,
単位：百万円):

| Child | 2026年3月期 (as printed) | 2025年3月期 (as printed) | Document · page |
|---|---|---|---|
| 新規装置 | 1,817,250 | 1,893,080 | yuho-2026 p.123 |
| フィールドソリューション他 | 626,282 | 538,488 | yuho-2026 p.123 |

1,817,250 + 626,282 = 2,443,532, against 外部顧客への売上高 2,443,533: a 1 百万円 difference from per-line
百万円 truncation.

Children of 新規装置 are **not** ordered by size. They follow the company's listing order, which is the same
in yuho-2026 p.26 (「コータ／デベロッパ、エッチング装置、成膜装置、洗浄装置、先端パッケージ向けプロセス装置、
ウェーハプローバ等」) and presentation-2026 slide 26 legend (「コータ/デベロッパ　エッチング装置　成膜装置　
洗浄装置　ウェーハプローバ　その他」). Slide 26 has per-product percentages (a stacked bar), but the
extracted text does not tie each percentage to its series, so no ranking was derived.

## Claims

### Identity

- `code` 8035 → tanshin-2026 p.1「コード番号 8035」.
- `officialName` 東京エレクトロン株式会社 → yuho-2026 p.1【会社名】.
- `nameEn` Tokyo Electron Limited → yuho-2026 p.1【英訳名】.
- `shortNameEn` TOKYO ELECTRON → 英訳名 minus the legal suffix "Limited", uppercased.
- `listings` tse プライム → yuho-2026 p.30 発行済株式「上場金融商品取引所名…東京証券取引所 プライム市場」. tanshin-2026 p.1「上場取引所 東」. No other exchange appears.
- `description` → p.5「半導体製造装置の開発・製造・販売・保守サービスを主な事業の内容」; 半導体メーカー: p.24「当社グループの顧客である半導体メーカー」; 世界の: p.21 海外売上高の比率 90.2%, p.126 地域ごとの情報 (日本・北米・欧州・韓国・台湾・中国・その他); 改造: p.123 注1「装置改造の提供」.
- `industries` semiconductors (primary) → p.5 (single segment 半導体製造装置).

### Businesses

- 半導体製造装置 description → p.5 (開発・製造・販売・保守サービス; 単一セグメント); 「工場で使う」→ p.124「装置を顧客の工場で設置し」.
- 半導体製造装置 customers 半導体メーカー → p.24; Samsung Electronics Co., Ltd. / Taiwan Semiconductor Manufacturing Company Ltd. → p.23「主な相手先別の販売実績」 and p.127「3 主要な顧客ごとの情報」 (names as printed).
- 新規装置 description (販売・設置・調整) → p.123 注1「新規装置には、新規装置の販売及び装置の設置に関連する役務の提供作業」; p.124「装置の引渡と、装置を顧客の工場で設置し、顧客の仕様に合わせて装置の性能を十分に発揮するための調整作業を提供」.
- 新規装置 description (用途別の区分) → presentation-2026 slide 8「SPE新規装置 アプリケーション別売上構成比」, series「DRAM」「不揮発性メモリ」「非メモリ（ロジック、ファウンドリ、その他）」, footnote「SPE（Semiconductor Production Equipment）：半導体製造装置」「グラフは新規装置の売上高における構成比を示しています」. The entry says 決算説明会資料 shows these categories. It does not attach them to the 有報 amount; see Gaps 3.
- 新規装置 customers 半導体メーカー → p.24.
- コータ/デベロッパ → official-products リソグラフィ「フォトレジストを均一に塗布し、露光機を用いてフォトマスクの回路パターンを転写します。その後、選択的にフォトレジストを現像液で溶かし、除去することで回路パターンを形成します。」「フォトレジスト塗布・露光・現像の工程をインライン（一連の装置）でおこなわれることが多く」; product type「300mmウェーハ対応塗布現像装置」. ウェーハ gloss → glossary-silicon-wafer「円板にしたもの。このウェーハに複数の半導体回路を書き込み、切断して半導体チップを製造する。」 フォトレジスト gloss → glossary-photoresist「感光性樹脂の一種で、これに回路パターンを露光・現像し、パターンを転写する。」 Product line named in yuho-2026 p.26 and presentation slide 26.
- エッチング装置 → official-products「成膜後、リソグラフィでできた微細な回路パターンに沿って、膜を削る基幹工程がエッチングです。」 The entry writes リソグラフィ as 塗布・露光・現像 per the same page's「フォトレジスト塗布・露光・現像の工程」. Named in p.26 / slide 26.
- 成膜装置 → official-products「ウェーハの表面に素子や配線の材料となる絶縁膜や金属膜などの薄膜を形成します。1~10ナノメートルのスケールで限りなく薄い膜を…」; 絶縁 = 電気を通さない → official-about-semiconductor「電気を通さない不導体（絶縁体）」. Named in p.26 / slide 26.
- 洗浄装置 → official-products「各プロセス工程の間で必ず必要とされる基幹工程の一つが洗浄です。回路上の異物などを取り除くことで欠陥が生じるのを防ぎます。」 Named in p.26 / slide 26.
- ウェーハプローバ → official-products テスト「テスト（検査）」「ウェーハ上の各チップの良品保証の役割を担います」; listed products under テスト are「Prexa™ Wafer Prober」「最新の300mm対応全自動ウェーハプローバ」. Named in p.26 / slide 26.
- フィールドソリューション description → p.123 注1「フィールドソリューション他には納入済み装置に対する保守用部品、サービス及び装置改造の提供、並びに中古装置の販売等」; p.124「フィールドソリューションサービスを提供」; 改造 gloss → official-service「当社既存装置を新機能によってアップグレードする改造サービスです」.
- フィールドソリューション products → official-service headings「エンジニアリングサービス」「スペアパーツ・リペア」「改造」「中古装置」.
- フィールドソリューション customers 半導体メーカー → p.24「当社グループの顧客である半導体メーカーの工場稼働率が上昇しているため、過去に販売した装置に対する改造や保守用部品・サービス等の売上も堅調に増加」.

### Business model

- description / revenueSources → p.123 注1, p.124 (履行義務).
- products → official-products process sections; p.26 product lines; p.123 注1.
- customers → p.24, p.23 / p.127.
- flow company → p.5「当社は、連結子会社東京エレクトロン テクノロジーソリューションズ㈱、東京エレクトロン九州㈱、東京エレクトロン宮城 ㈱他が製造した製品を仕入れて販売しております」「保守サービス等については、連結子会社東京エレクトロンＦＥ㈱、Tokyo Electron America, Inc.、Tokyo Electron Korea Ltd.、Tokyo Electron Europe Ltd.他が行っております」. 「海外の子会社」 summarises the three foreign names.
- flow offering → official-products process list (成膜・リソグラフィ・エッチング・洗浄・テスト); p.123 注1.
- flow customer「海外売上高の比率は90.2%」→ p.21「連結売上高に占める海外売上高の比率につきましては90.2%」. 「15.1%」「12.9%」→ p.23 当連結会計年度: Samsung Electronics Co., Ltd. 368,079 百万円 15.1%; Taiwan Semiconductor Manufacturing Company Ltd. 315,813 百万円 12.9%; 注「販売高には、当該顧客と同一の企業集団に属する顧客に対する販売高を含めております」. Prior year, log only: 286,800 (11.8%) / 280,618 (11.5%).
- flow revenue → **derived** amounts (百万円 → 億円, truncated below 1億円): 2,443,533 → 2兆4,435億円 (p.21 prints「2兆4,435億3千3百万円」); 新規装置 1,817,250 → 1兆8,172億円; フィールドソリューション他 626,282 → 6,262億円 (exact 6,262.82億円, so truncation, not rounding; consistent with TEL's own「単位未満を切り捨て」 practice in presentation-2026 slide 2). All from p.123.
- flow profit「5,744億円」→ **derived** from 574,454 百万円 (p.2; p.24 prints「5,744億5千4百万円」). 「利益を次の成長投資につなげ、中長期的な利益の拡大をめざす」→ p.7「その利益を次なる成長投資につなげることで、中長期的な利益の拡大と継続的な企業価値の向上を目指していきます」.

### History

- 1963 description → yuho-2026 p.4「1963年11月 ㈱東京放送の関係会社として東京都港区に㈱東京エレクトロン研究所を設立(資本金5百万円)。VTR、カーラジオ等の輸出及び電子機器関係の輸入業務を開始」; official-history 1963「拡散炉、リークディテクタ、IC製造機器の納入・販売を開始」.
- 1963 significance → official-history milestone「1963 技術専門商社としてスタート」; yuho-2026 p.7「当社グループは、技術専門商社からスタートし、開発製造機能をもつメーカーへの移行、グローバルな販売・サポート体制の構築など」. On 「出発点」: p.4 explains that the 1978 formal merger into 東京エレクトロン㈱ (旧 桜洋行㈱) was only a change of par value, and that the 沿革 before 1978 describes the merged company, i.e. the 1963 company.
- 1968 description → official-history 1964「米国サームコ社から拡散炉の輸入販売代理権を獲得し、販売を開始」; 1968「米国サームコ社との合弁会社テル・サームコ（株）をTBS会館内に設立」「テル・サームコ（株）で拡散炉の国内生産を開始」.
- 1968 significance (lineage to 東京エレクトロン テクノロジーソリューションズ) → yuho-2026 p.4 沿革 chain: 1993年4月「東京エレクトロン相模㈱(1968年2月設立、旧 テル・サームコ㈱)と東京エレクトロン東北㈱(1986年7月設立…)を合併(新会社名 東京エレクトロン東北㈱)」 → 2004年4月「東京エレクトロンＡＴ㈱と東京エレクトロン東北㈱を合併(新会社名 東京エレクトロンＡＴ㈱)」 → 2011年4月「東京エレクトロンＡＴ㈱の商号を東京エレクトロン山梨㈱に変更」 → 2017年7月「東京エレクトロン山梨㈱と東京エレクトロン東北㈱(2006年4月設立)を合併(現 東京エレクトロン テクノロジーソリューションズ㈱)」. The 東北 of 2004 is the 1993 company; the 2017 東北 is a different company, explicitly「2006年4月設立」. 「装置の製造・開発を担う」→ p.6 関係会社 東京エレクトロン テクノロジーソリューションズ㈱「半導体製造装置の製造・開発」. The rename テル・サームコ → テル相模 is from official-history 1988「テル・サームコ（株）を100%子会社化し、テル相模（株）に社名変更」; the 有報 shows 東京エレクトロン相模 as 旧 テル・サームコ.
- 1986 description → official-history 1986「半導体製造装置の輸出を開始」「山梨県韮崎市穂坂工業団地内に総合研究所が完成」; milestone panel「1986年より海外への輸出を開始し」.
- 1986 significance → same entry, and yuho-2026 p.21 (90.2%). Stated as two facts side by side, with no causal link.
- 1994 description → yuho-2026 p.4「1994年 4月 欧州(英国)現地法人Tokyo Electron Europe Ltd.設立」; official-history 1994「Tokyo Electron Europe Ltd.を設立」 and milestone panel title「1994 グローバリゼーション元年」.
- 1994 significance → official-history panel「1980年から開始した海外進出が1990年代に本格化し、成長し始めた世界市場で直接販売・サポートする体制の構築を進め、世界各国に現地法人を設立しました」; yuho-2026 p.6 Tokyo Electron Europe Ltd.「半導体製造装置等の販売・保守サービス」, p.5 (保守サービス等 by Tokyo Electron Europe Ltd.).
- 1999 description → official-history 1999「東京証券取引所第一部における業種変更「商業」から「電気機器」へ」.
- 1999 significance → the same entry plus official-history「技術専門商社としてスタート」 and yuho-2026 p.7「開発製造機能をもつメーカーへの移行」. Written as sourced facts side by side; the entry does not claim the exchange changed the classification *because of* the transition.
- 2015 description → official-history 2013「米国Applied Materials, Inc.との経営統合契約を締結」; 2015「米国Applied Materials, Inc.との経営統合契約を解消」「新生TELとして再出発（Vision、中期経営計画の策定、コーポレートロゴ刷新）」; panel「2015年、グローバル水準の収益力を目指した中期経営計画と財務モデルを策定し、新たな一歩を踏み出しました」.
- 2015 significance → same panel; yuho-2026 p.7「中期経営計画として…2027年3月期を目標年度に取り組んでおります」. The plan's targets are deliberately not quoted because they include ROE and 営業利益率 (invariant 4). No claim that the current plan is the 2015 plan: official-history 2022 says the plan announced in 2019 was superseded.
- 2022 description → official-history 2022「新ビジョン「半導体の技術革新に貢献する夢と活力のある会社」とコーポレートメッセージ「Technology Enabling Life」を発表」「東京証券取引所プライム市場に指定替え」; yuho-2026 p.4「2022年 4月 東京証券取引所の市場区分の見直しにより、市場第一部からプライム市場に移行」.
- 2022 significance → yuho-2026 p.7「当社グループのビジョンは「半導体の技術革新に貢献する夢と活力のある会社」です。」

**Passage check performed 2026-09-14** (`claims.mjs` in the scratchpad): 83 quoted passages that the
entry relies on (whitespace-normalised) were searched for in the extracted text of the documents
above. 83 found, 0 missing.

## Gaps and judgement calls

No value is `null`. No unverified claim remains. Status: `published`.

1. **Single segment, so the diagram is shallow at the top.** This is correct for TEL, not a gap. No FPD or other segment is added: both yuho-2026 and yuho-2025 define one segment, and the 2027年3月期 1Q 短信 still does. The 63期 有報 mentions FPD only in officer career histories (p.57 役員の状況, 「当社FPD BUGM」「当社FPD事業本部長」). I did not look for when or whether an FPD business ended, because no document I read states it, and the entry says nothing about it.
2. **Children built from the company's own splits, not from one table.** Level 2 (新規装置 / フィールドソリューション) is the 有報 revenue disaggregation (p.123), which the company uses for exactly this purpose. Level 3 (five product lines) is the product breakdown the company uses in its results materials (slide 26), and the same lines are named in 有報 p.26. The entry puts no amounts on level 3.
3. **Presentation amounts are not the 有報 amounts, and were not used.** Presentation slide 26 shows SPE新規装置 FY2026 = 17,754億円 and slide 9 shows フィールドソリューション売上 = 6,260億円. That sums to 24,014億円, against 売上高 24,435億円. The 有報 p.123 shows 新規装置 18,172億円 (derived) and フィールドソリューション他 6,262億円 (derived). The ~418億円 gap on 新規装置 is not explained in any document I read. So the entry (a) uses only 有報 amounts, (b) describes the DRAM / 不揮発性メモリ / 非メモリ categories as the presentation's classification of 半導体製造装置の新規装置, and (c) does not equate that base with the 有報 新規装置 total. A reviewer who finds the reconciliation (possibly in the 統合報告書 data section, whose text did not extract) could add it.
4. **Customer types.** TEL's documents classify new-equipment sales by *application* (DRAM, 不揮発性メモリ, 非メモリ（ロジック、ファウンドリ、その他）), not by customer type. Putting these labels in `customers` would have turned an application split into a customer list, so they appear in the 新規装置 description, attributed to the 決算説明会資料. `customers` holds 半導体メーカー (p.24) and the two companies the 有報 names.
5. **Named customers.** Samsung Electronics Co., Ltd. and Taiwan Semiconductor Manufacturing Company Ltd. are named in yuho-2026 p.23 and p.127 (major-customer disclosure, both years), and the entry uses the names exactly as printed. Their sales include companies in the same group (注). No other customer is named.
6. **ボンディング/デボンディング (wafer bonding) left out.** official-products lists it as a process with products (Synapse™). yuho-2026 p.26 lists「先端パッケージ向けプロセス装置」. The presentation product breakdown has no bonding series (「その他」 is undefined). I could not confirm that these three refer to the same thing, so the category is not added as a child or product. Likewise 「その他」 from slide 26 is not included, since the company does not say what it contains.
7. **Plain-language explanations stop where TEL's do.** Each product-line description paraphrases the TEL product page plus two TEL glossary entries (ウェーハ, フォトレジスト) and the 「半導体を知る」 page (絶縁体). Share and ranking claims on the product page (e.g. 「90％のシェア」「ドライエッチングシェアは世界2位」) were not used: they are evaluative, undated and not in the 有報.
8. **Naming.** `name` フィールドソリューション follows official-service and the presentation. The 有報 table row is フィールドソリューション他 (p.123) and the 履行義務 text says フィールドソリューションサービス (p.124); the revenue step, which quotes the 有報 amount, uses the 有報 row name. `shortName` サービス is the product site's navigation label for this area. コータ/デベロッパ uses the half-width slash of the presentation and official-history; the 有報 prints コータ／デベロッパ. 東京エレクトロンＦＥ is normalized to 東京エレクトロンFE.
9. **Group company count not stated.** p.5 says「当社及び27社の関係会社」, with no date. p.6 lists 10 named consolidated subsidiaries + 「その他15社」 + 1 equity-method affiliate (26). I could not reconcile 27 with 26 from the documents, so the business-model step gives no count.
10. **History selection (7 events).** Left out, all supportable: 1972 TEL America 設立, 1978 商号変更, 1980 東証二部上場, 1984 一部, 1989 売上高世界ランキング1位 (superlative), 1990 東京エレクトロンFE設立 and ディスプレイ製造装置市場へ本格参入 (no link to today in any source), 2014 太陽光パネル製造装置事業から撤退 and 東京エレクトロン デバイス の持分法適用関連会社化 (no source gives a link to today's structure), 2017 東京エレクトロン テクノロジーソリューションズ設立 (covered by the 1968 lineage). 1986, 1999 and 2015 significance lines state sourced facts side by side and make no causal claim that the documents do not make.
11. **`industries`: semiconductors only.** `electronics` was considered, on the strength of p.21「当社グループが参画しておりますエレクトロニクス産業」, and not added. TEL makes production equipment, not electronic products. Add it if industry pages are meant to be broad.
12. **Stock split, log only.** yuho-2026 p.30 注 and p.129 (重要な後発事象 3): on 2026年5月29日 the board resolved a 1株につき5株 split, 基準日 2026年9月30日, effective 2026年10月1日. It does not affect 売上高 or net income, and per-share figures are not used.
13. **Extraction limits.** No PDF page rendering was available (pdftoppm not installed), so no page image was checked visually. Every value was confirmed in `-raw` and `-table` modes across three documents. tanshin-2026 attachment pages, the 2027年3月期 1Q 短信 p.1 header and most of 統合報告書 2025 extract as mojibake; only their clean parts were used.
14. **EDINET not checked.** The project has no EDINET API key. "No 訂正報告書 for 第63期" rests on TEL's IR library listing only.
15. **Dates.** `accessedAt` 2026-09-13 for every document downloaded and read that day; 2026-09-14 for `tanshin-2027-q1`, first read that day. Re-verification on 2026-09-14 used the same downloaded copies. `updatedAt` and the revision date are 2026-09-14. Web pages carry no publication date, so they have no `publishedAt`.
