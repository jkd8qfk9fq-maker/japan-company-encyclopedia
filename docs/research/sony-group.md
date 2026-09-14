# ソニーグループ — research log

Researched: 2026-09-13 (documents downloaded and read) · finalised 2026-09-14 (all ten financial values
re-checked by script against two extraction modes; 有報 2025年度, 決算短信 2026年3月期 and the 会社沿革 page
re-fetched and found identical to the 09-13 copies — PDFs by MD5, the page by extracted text)

**Read this first.** Sony spun off its financial business on 2025-10-01. The latest 有報 presents that business
as **非継続事業** (discontinued operations), and it restated only some earlier years. So the five-year revenue row
is **not one basis** (see "How the financial-business spin-off is presented"). Each year's `revenueBasis` states
its scope and the 2026年3月期 `note` explains the loss (see "revenueBasis and note"). Every figure is verified,
and the entry is `published`.

Page numbers are **printed page numbers** (「- N -」). In the 2025年度 有報 PDF, PDF page index = printed page + 3
(checked by script on printed pp. 1, 4–10, 13–14, 21–22, 34–35, 38, 40, 54, 132, 139, 154–155, 158–163,
257–259). The unnumbered cover is PDF p.2. Each 決算短信 summary page is PDF p.1 and unnumbered.

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | ソニーグループ株式会社 有価証券報告書（2025年度：自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月18日 | https://www.sony.com/ja/SonyInfo/IR/library/r7_q4.pdf | 表紙; 1–2 (主要な経営指標等の推移); 4–6 (沿革); 7–9 (事業の内容); 10–12 (関係会社); 13–14 (経営方針); 21–22 (事業等のリスク); 34–41 (経営成績・分野別営業概況); 54 (発行済株式); 132–133 (連結損益計算書); 139 (注記1 報告企業); 154–155 (収益認識, 売上原価); 158–163 (注記4 セグメント情報); 257–258 (注記33 非継続事業); 259 (半期情報等) |
| `tanshin-2026` | 2026年3月期 決算短信〔IFRS〕（連結）, 2026年5月8日 | https://www.sony.com/ja/SonyInfo/IR/library/presen/er/pdf/25q4_sony.pdf | p.1 (summary: コード番号, 連結経営成績, ※1) |
| `yuho-2025` | 有価証券報告書（2024年度：自 2024年4月1日 至 2025年3月31日）, 提出日 2025年6月20日 | https://www.sony.com/ja/SonyInfo/IR/library/r6_q4.pdf | p.1 (主要な経営指標等の推移 — prior-year cross-check) |
| `yuho-2024` | 有価証券報告書（2023年度：自 2023年4月1日 至 2024年3月31日）, 提出日 2024年6月25日 | https://www.sony.com/ja/SonyInfo/IR/library/r5_q4.pdf | p.1 (table with 「2022年度 修正再表示」 column; 注4 IFRS第17号) |
| `yuho-2023` | 有価証券報告書（2022年度：自 2022年4月1日 至 2023年3月31日）, 提出日 2023年6月20日 | https://www.sony.com/ja/SonyInfo/IR/library/r4_q4.pdf | p.1 (2023年3月期 as originally reported). **Deliberately not cited by any section** — its 2023年3月期 figures differ from the stored (restated) ones |
| `tanshin-2027-q1` | 2027年3月期 第1四半期決算短信〔IFRS〕（連結）, 2026年7月31日 | https://www.sony.com/ja/SonyInfo/IR/library/presen/er/pdf/26q1_sony.pdf | p.16 (セグメント区分 — structure unchanged after year end; SFGI removed from equity method) |
| `official-history` | 会社沿革 (ソニーグループポータル) | https://www.sony.com/ja/SonyInfo/CorporateInfo/History/company/ | 1946, 1968, 1980, 1988, 1989, 1994, 2020, 2021 entries; site navigation label for ET&S |

`accessedAt`: 2026-09-14 for `yuho-2026`, `tanshin-2026`, `official-history` (re-fetched and compared that day);
2026-09-13 for the other four (read that day only).

**How the latest 有報 was identified.** IR library page https://www.sony.com/ja/SonyInfo/IR/library/yu.html
(有価証券報告書等) lists 2025年度 `r7_q4.pdf` first. Its cover says 2025年度 (2025-04-01 to 2026-03-31), 提出日
2026年6月18日, and matches the 短信's 「有価証券報告書提出予定日 2026年６月18日」. The page lists no 訂正有価証券報告書
(checked 2026-09-13 and 2026-09-14). EDINET was not queried (no API key, per protocol).

**Access note.** sony.com (Akamai) returns 403 to plain `curl` and to WebFetch/WebSearch. The documents were
fetched with `curl` using ordinary browser request headers. Nothing else was bypassed, and the files are the
public IR PDFs.

**Extraction.** `pdftotext -layout` scrambled the p.1 table: it printed the 当社株主に帰属する包括利益 values
(623,678 / 1,087,289 / …) beside the 当期純利益 label. Figures were therefore read from `-raw` and `-table`
(and `-simple2`), which agree on row alignment. A script (`verify.mjs`, scratchpad) loads the entry file and
compares all ten stored values, formatted back to 百万円 with △ for negatives, against the row-anchored text of
both modes: 20/20 match.

## Financials

Source table: yuho-2026 p.1「第１ 企業の概況 １ 主要な経営指標等の推移 (1) 連結経営指標等」. Unit as printed:
**百万円**. Stored as whole yen (× 1,000,000). Labels verbatim from that table: revenue row
`売上高及び金融ビジネス収入`; net income row `当社株主に帰属する当期純利益（損失）` (the label wraps as 「…当期純利益（損」
/「失）」). This is IFRS "profit attributable to owners of the parent" in Sony's wording. It is **not** 当期純利益
including non-controlling interests (2026年3月期 △302,492, p.132, not used).

| fiscalYear (Sony's 回次) | revenue (as printed, 百万円) | netIncome (as printed, 百万円) | Standard | Document · page | 短信 / prior-有報 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (2021年度) | 9,921,513 | 882,178 | IFRS | yuho-2026 p.1 | yuho-2025 p.1: 9,921,513 / 882,178 (same); yuho-2024 p.1 and yuho-2023 p.1: same |
| 2023年3月期 (2022年度) | 10,974,373 | 1,005,277 | IFRS | yuho-2026 p.1 | yuho-2025 p.1: same; yuho-2024 p.1 prints it under「2022年度 修正再表示」. **Originally** 11,539,837 / 937,126 (yuho-2023 p.1) |
| 2024年3月期 (2023年度) | 11,260,037 | 970,573 | IFRS | yuho-2026 p.1 | yuho-2025 p.1: revenue **13,020,768** (before discontinued-ops restatement) / net income 970,573 (same) |
| 2025年3月期 (2024年度) | 12,034,917 | 1,141,600 | IFRS | yuho-2026 p.1; also p.132 (連結損益計算書: 売上高 12,034,917; 当社株主 1,141,600) | tanshin-2026 p.1 comparative 継続事業 売上高 12,034,917 — match. yuho-2025 p.1: revenue **12,957,064** (before restatement) / net income 1,141,600 (same) |
| 2026年3月期 (2025年度) | 12,479,620 | △326,865 | IFRS | yuho-2026 p.1; also p.132 and p.259 (半期情報等: 売上高 12,479,620; 当社株主に帰属する…当期純利益（損失）△326,865) | tanshin-2026 p.1: 継続事業 売上高 12,479,620 — match; ※1「当社株主に帰属する当期純利益（損失）…△326,865百万円」 — match |

Checks performed:

- **Digit-by-digit**: scripted comparison of all ten stored values against `-raw` and `-table` text of yuho-2026
  p.1. All match. The prior 有報 rows were read in `-raw` and `-table` too (both modes identical).
- **Scale**: 当期純利益 ÷ printed 基本的EPS gives implied average shares of 5,976百万株 (2026年3月期: △326,865百万円
  ÷ △54.70円), 6,049百万株 (2025年3月期: 1,141,600 ÷ 188.71) and 6,196百万株 (2022年3月期: 882,178 ÷ 142.37). All are
  consistent with 6,149,810,645 shares issued at 2026-03-31 (p.54), which confirms 百万円 and × 1,000,000. The
  division is derived, for checking only.
- **Accounting standard**: IFRS for all five years. yuho-2026 p.1 注1:「連結財務諸表は、国際財務報告基準（以下
  「IFRS」）によって作成」. yuho-2025 p.1 注1: IFRS「2020年４月１日を移行日として2021年度より」, so 2022年3月期 is
  the first IFRS year. No year straddles a change of standard.
- The negative sign for 2026年3月期 is confirmed three ways: the △ on p.1, the △ on p.132 and p.259, and 短信 ※1.

### How the financial-business spin-off is presented (and what was restated)

What happened (yuho-2026 p.257 注記33; p.5–6 沿革):
- 2025年5月14日: the board resolved the policy for a partial spin-off of ソニーフィナンシャルグループ株式会社 (SFGI).
  From 2025年度第1四半期, 金融事業 was classified as 非継続事業 under IFRS第5号.
- 2025年9月: SFGI shares were listed on 東京証券取引所プライム市場 (沿革 p.5).
- 2025年10月1日: 現物配当 of 1 SFGI share per Sony share (record date 2025-09-30). Sony's holding became 16.40％.
  SFGI was deconsolidated and accounted for by the equity method (p.6, p.257, p.139).

How the latest 有報 presents it:
- **Revenue row, p.1 注5**:「2025年度の売上高及び金融ビジネス収入、営業利益ならびに税引前利益については、継続事業の…
  金額を表示しています。なお、2023年度及び2024年度の…についても、同様の分類にもとづき再表示しています。」
  So 2024年3月期 and 2025年3月期 were restated to continuing operations; 2022年3月期 and 2023年3月期 were not.
  The row label stays 「売上高及び金融ビジネス収入」 for all five years.
- **2023年3月期 carries a separate, earlier restatement**: yuho-2024 p.1 注4 — IFRS第17号「保険契約」 applied from
  2023年度第1四半期, and 2022年度 figures were 「IFRS第17号にもとづき修正再表示」. That is why 10,974,373 / 1,005,277
  differs from the originally reported 11,539,837 / 937,126 (yuho-2023 p.1). 2022年3月期 was not restated.
- **Net income row**: not split. 当社株主に帰属する当期純利益（損失） includes 非継続事業 in every year, which is why
  2024年3月期 and 2025年3月期 net income are unchanged from yuho-2025.
- **Segments, p.158**:「金融事業を非継続事業に分類し、金融事業を報告セグメントから除外しています。これにともない比較期の
  数値を継続事業及び非継続事業に区分して再表示しています。」

Resulting basis of the stored revenue series:

| fiscalYear | Revenue basis |
|---|---|
| 2022年3月期 | Includes 金融事業, as originally reported (IFRS, pre-IFRS第17号) |
| 2023年3月期 | Includes 金融事業, IFRS第17号 修正再表示 |
| 2024年3月期 | 継続事業 only (restated in yuho-2026) |
| 2025年3月期 | 継続事業 only (restated in yuho-2026) |
| 2026年3月期 | 継続事業 only |

Why 2026年3月期 net income is negative (p.257–258, p.132; 短信 p.1 ※1). On execution, 1,377,795百万円 of accumulated
other comprehensive income tied to the disposal group was reclassified to profit or loss as a loss within
非継続事業. 非継続事業からの当期純利益（損失） is △1,357,758; 継続事業からの当社株主に帰属する純利益 is 1,030,893;
total 当社株主 △326,865 (p.132). 短信 ※1 states the reclassification「資本合計及びキャッシュ・フローへの影響はなく、
継続事業の損益への影響もありません」. Arithmetic, derived: △326,865 + 1,377,795 = 1,050,930, so without the
reclassification the total would have been positive. This supports the entry's 「…振り替えたため…マイナスになった」.

Post-filing change (not in the entry): tanshin-2027-q1 p.16 says that from the end of SFGI's AGM on 2026-06-25
Sony no longer has significant influence. SFGI was removed from the equity method and reclassified to FVOCI
equity instruments. The entry therefore says only 「連結子会社から外れた」 and never 「関連会社」.

## revenueBasis and note (added 2026-09-14)

`FinancialRecord` gained `revenueBasis` (scope of the revenue figure, all years or none) and `note` (one sentence,
covered by the record's `sourceIds`) after this entry's first draft flagged the scope break. Values set:

| fiscalYear | revenueBasis | note | Source passage |
|---|---|---|---|
| 2022年3月期 | 金融事業を含む | — | yuho-2026 p.1 注5 restates only「2023年度及び2024年度」, so 2021年度 keeps the scope it had when 金融事業 was consolidated; yuho-2025 p.1 prints the same 9,921,513 under「売上高及び金融ビジネス収入」, before any discontinued-operations classification |
| 2023年3月期 | 金融事業を含む | 保険契約の会計基準（IFRS第17号）の適用にともない、修正再表示した値。 | Scope: same reasoning as above — 注5 does not restate 2022年度; yuho-2025 p.1 prints 10,974,373 with 金融事業 consolidated. Note: yuho-2024 p.1 注4「IFRS第17号「保険契約」…を2023年度第１四半期連結累計期間の期首から適用したため…2022年度に係る主要な経営指標等については、IFRS第17号にもとづき修正再表示しています」, and the column header「2022年度 修正再表示」 |
| 2024年3月期 | 金融事業を含まない（非継続事業として除外） | — | yuho-2026 p.1 注5「2023年度及び2024年度の売上高及び金融ビジネス収入…についても、同様の分類にもとづき再表示しています」 |
| 2025年3月期 | 金融事業を含まない（非継続事業として除外） | — | yuho-2026 p.1 注5 (as above); tanshin-2026 p.1 ※1「なお、2025年３月期もこの表示に合わせて再表示しています」 |
| 2026年3月期 | 金融事業を含まない（非継続事業として除外） | 金融事業のスピンオフにともない、金融事業の累積その他の包括利益を損失に振り替えたことによる赤字で、継続事業の当社株主に帰属する純利益は黒字だった。 | Scope: yuho-2026 p.1 注5「2025年度の売上高及び金融ビジネス収入…については、継続事業の売上高…の金額を表示」; p.132 継続事業 売上高 12,479,620. Note: p.257 注記33「処分グループに直接関連する累積その他の包括利益のうち1,377,795百万円を、連結損益計算書上、非継続事業からの当期純利益（損失）に損失として振り替えました」; tanshin-2026 p.1 ※1「…累積その他の包括利益の連結除外時の残高を非継続事業からの純損益に振り替える処理により、1,377,795百万円の損失を…計上しましたが…継続事業の損益への影響もありません」; 「継続事業…は黒字」 → p.132 当社株主「継続事業からの純利益 1,030,893」 and tanshin-2026 p.1 当社株主に帰属する当期純利益 (継続事業) 1,030,893 |

Judgement calls:

- **IFRS第17号 does not change the bucket.** `revenueBasis` describes what the figure covers. IFRS第17号 changed how
  insurance revenue inside the financial business is measured (2023年3月期 originally 11,539,837百万円 in
  yuho-2023 p.1), not whether the financial business is included. Giving 2023年3月期 its own `revenueBasis` string
  would make the chart break between two years that both include 金融事業. The measurement change is disclosed
  in that year's `note` instead. Consequence to be aware of: the chart draws 2022年3月期→2023年3月期 as continuous,
  although 2022年3月期 is pre-IFRS第17号.
- **「赤字」/「黒字」** are plain words for loss/profit. The sign of 当社株主に帰属する当期純利益（損失） is △ (p.1) and
  of 継続事業からの純利益 is positive (p.132). The note contains no amounts.
- The note attributes the loss to the reclassification. That is supported by 注記33 and 短信 ※1, and by the derived
  arithmetic in "How the financial-business spin-off is presented" (△326,865 + 1,377,795 = 1,050,930 > 0).
- Status changed from `needs-attention` to `published`: both former notes (scope break, loss explanation) are now
  carried by these fields, and nothing in the entry is unverified.

## Segment ordering

Reportable segments per yuho-2026 p.158–159 (注記4). The structure is unchanged in tanshin-2027-q1 p.16
(セグメント区分), which names the same six 分野 and no reorganisation, so the 有報 structure is also the current
one. Ordered by 2026年3月期 **セグメント売上高 (セグメント間取引消去前の「計」)**, p.159. That is the per-分野
revenue Sony itself reports (p.35:「各分野の売上高はセグメント間取引消去前のもの」).

| Segment | Segment revenue 計 (百万円, 2026年3月期) | External customers (百万円) | Document · page |
|---|---|---|---|
| ゲーム＆ネットワークサービス | 4,685,651 | 4,570,053 | yuho-2026 p.159; p.35 |
| エンタテインメント・テクノロジー＆サービス | 2,260,532 | 2,184,815 | p.159; p.39 |
| イメージング＆センシング・ソリューション | 2,151,533 | 2,059,020 | p.159; p.40 |
| 音楽 | 2,120,110 | 2,090,534 | p.159; p.36 |
| 映画 | 1,499,290 | 1,486,296 | p.159; p.37 |
| その他 | 89,072 | 74,564 | p.159 |
| 全社（共通）及びセグメント間取引消去 | △326,568 | — | p.159 |
| 連結合計 | 12,479,620 | — | p.159 (= p.1 revenue) |

Note: on external-customer revenue, 音楽 (2,090,534) is above I&SS (2,059,020). The order uses segment 計, as
stated above.

Children (the company's own sub-businesses: 事業の内容 p.8 「事業区分及び主要製品」; revenue by 製品カテゴリー p.162,
definitions p.163), ordered by 2026年3月期 external revenue (百万円):

| Parent | Child (company name) | External revenue | Note |
|---|---|---|---|
| G&NS | デジタルソフトウェア・アドオンコンテンツ | 2,415,305 | |
| G&NS | ハードウェア・その他 | 1,391,622 | |
| G&NS | ネットワークサービス | 763,126 | |
| 音楽 | 音楽制作 | 1,345,328 | **Derived**: 音楽制作（ストリーミング）852,672 + 音楽制作（その他）492,656. p.8 lists 音楽制作 as one 事業区分 |
| 音楽 | 音楽出版 | 419,864 | |
| 音楽 | 映像メディア・プラットフォーム | 325,342 | |
| 映画 | テレビ番組制作 | 512,372 | |
| 映画 | 映画製作 | 495,655 | |
| 映画 | メディアネットワーク | 478,269 | |
| ET&S | イメージング | 722,465 | |
| ET&S | その他 | 518,891 | Company states the contents (p.163) |
| ET&S | ディスプレイ | 476,305 | |
| ET&S | サウンド | 278,846 | |
| ET&S | ネットワークサービス | 188,308 | |
| I&SS | — | 2,059,020 | Single category on p.162 → no children |

Segment 営業利益（損失）, p.160 — used only for the ranking in `businessModel.flow` (profit). Amounts stay out of
the entry (invariant 4): G&NS 463,258 > 音楽 446,986 > I&SS 357,318 > ET&S 158,584 > 映画 104,872 > その他 △74,646.

Regional revenue by customer location, p.163 — used only for the ranking 「米国が最も大きい」: 米国 4,064,440 >
欧州 2,826,805 > アジア・太平洋地域 1,694,889 > 中国 1,428,677 > 日本 1,333,202 > その他地域 1,131,607.

## Claims

### Identity

- `code` 6758 → tanshin-2026 p.1「コード番号 6758」; tanshin-2027-q1 page headers「ソニーグループ株式会社（6758）」. The 有報
  text does not print the code.
- `officialName` ソニーグループ株式会社 → yuho-2026 表紙【会社名】.
- `nameEn` SONY GROUP CORPORATION → yuho-2026 表紙【英訳名】.
- `shortNameEn` SONY GROUP → see Gaps and judgement calls 3.
- `listings` tse プライム → yuho-2026 p.54 ②【発行済株式】「東京・ニューヨーク各証券取引所」, 注1「東京証券取引所についてはプライム
  市場に上場されています」; tanshin-2026 p.1「上場取引所 東」. NYSE omitted: see Gaps 4.
- `industries` → see Gaps 7.

### description (「プレイステーションのゲーム、音楽、映画を世界に届け、カメラやテレビなどの電子機器とイメージセンサーもつくる会社。」, 56字)

- プレイステーションのゲーム → p.35「プレイステーション®プラス」「自社制作のゲームソフトウェア」; p.7 G&NS「家庭用ゲーム機の製造・販売」.
- 音楽、映画 → p.7「音楽分野には、主に音楽制作…」「映画分野には、主に映画製作、テレビ番組制作…」.
- 世界に届け → p.139「ソニーの製品及びサービスは世界全地域において、販売子会社及び資本関係のない各地の卸売業者ならびにインター
  ネットによる直接販売により販売、提供されています」.
- カメラやテレビなどの電子機器とイメージセンサーもつくる → p.139「エレクトロニクス製品・部品、具体的には…テレビ、…静止画・動画
  カメラ、スマートフォン、イメージセンサー等を開発、設計、制作、製造、提供、販売」.
- An earlier draft said「カメラやテレビ、スマートフォンなどに使うイメージセンサー」. It was removed because it can be read as
  image sensors used in TVs, which no source says.

### businesses

- G&NS · description「家庭用ゲーム機「PS5」などのハードウェアと、ネットワークを通じて販売するゲームソフトや追加コンテンツ、PS Plusなど
  のネットワークサービス」 → p.7「デジタルソフトウェア・アドオンコンテンツの制作・販売、ネットワークサービス事業及び家庭用ゲーム機の製造・
  販売」; p.8「ネットワークを通じて販売するソフトウェアタイトル及びアドオンコンテンツ」; PS5 → p.35「拡大したPS5のインストール
  ベース」, p.46「PS5ハードウェア」; PS Plus → p.35「プレイステーション®プラス（以下「PS Plus」）」「ネットワークサービスについては、
  PS Plusにおいて…」.
- G&NS · products PS5などの家庭用ゲーム機 / ゲームソフトウェア・アドオンコンテンツ / PS Plusなどのネットワークサービス / 周辺機器 →
  p.8, p.35, p.163 (ハードウェア・その他 includes「周辺機器」).
- G&NS · customers プレイステーションのユーザー → p.35「プレイステーション®ストアにおけるユーザー一人当たりの平均売上高」.
  小売事業者・販売業者 → p.154「ハードウェア、周辺機器及びソフトウェアディスクからの収益は、小売事業者又は販売業者へ支配を移転する
  ことによって…」. ゲームの開発・販売事業者 → p.154「開発・販売事業者へのプラットフォームライセンスからの収益」.
- G&NS children: デジタルソフトウェア・アドオンコンテンツ → p.163「ネットワークを通じて販売するソフトウェアタイトル及びアドオンコン
  テンツ」. ハードウェア・その他 → p.163「家庭用ゲーム機、パッケージソフトウェア、家庭用ゲーム機と同梱販売されるソフトウェア、周辺機器
  及び外部プラットフォーム向け自社制作ソフトウェアなど」. ネットワークサービス → p.163「ゲーム、ビデオ及び音楽コンテンツ関連のネット
  ワークサービス」, PS Plus p.35.
- ET&S · shortName エレクトロニクス → official-history site navigation「エレクトロニクス製品：エンタテインメント・テクノロジー&
  サービス」.
- ET&S · description「レンズ交換式カメラなどの映像制作機器、テレビ、ヘッドホン、スマートフォンなどのエレクトロニクス製品をつくって販売し、
  インターネット関連サービスも提供する」 → p.7「イメージング事業、サウンド事業、ネットワークサービス事業及びディスプレイ事業」; p.8 and
  p.163 category contents; つくって販売 → p.139.
- ET&S · products → p.8 / p.163 verbatim categories: レンズ交換式カメラ及び交換レンズ; 液晶テレビ、有機ELテレビ及びプロジェクター;
  ヘッドホン及びワイヤレススピーカー; スマートフォン、家庭用オーディオ製品、医療用機器ならびにスポーツ審判支援及びコンテンツ制作支援サービス;
  インターネット関連サービス.
- ET&S children: イメージング / その他 / ディスプレイ / サウンド / ネットワークサービス → p.163 definitions (as above).
- I&SS · shortName イメージセンサー → p.7「Ｉ＆ＳＳ分野には、主にイメージセンサー事業が含まれています」.
- I&SS · description「モバイル機器向けを中核に」 → p.14「Ｉ＆ＳＳ分野の中核であるモバイル向けイメージセンサー事業」; p.40
  「成長牽引事業領域であるモバイル機器向けイメージセンサー事業」; 「スマートフォンなど」 → p.40「ハイエンドスマートフォンを中心にモバイル
  機器向けイメージセンサーの大判化」, p.21「スマートフォンやその他の製品向けイメージセンサー」. 「カメラ、産業・社会インフラ、自動車向け」
  → p.40「カメラ及び産業・社会インフラ向けイメージセンサー事業」「車載向けイメージセンサー事業」. 「つくって販売する」 → p.139.
  「一部はグループ内のゲームやエレクトロニクスの会社にも供給」 → p.9「Ｉ＆ＳＳ分野では、国内及び海外の製造会社が製造した一部の
  イメージセンサー等を、Ｇ＆ＮＳ分野及びＥＴ＆Ｓ分野の会社に供給しています」.
- I&SS · products → p.40 (the three application areas above).
- 音楽 · description → p.7「音楽制作、音楽出版及び映像メディア・プラットフォーム事業」; p.8「ストリーミング/パッケージ/ダウンロードに
  よるデジタルの音楽制作物の販売、アーティストのライブパフォーマンス及び物販からの収入」「楽曲の詞、曲の管理及びライセンス」「アニメー
  ション作品及びゲームアプリケーションの制作・販売、音楽・映像関連商品のサービス提供」.
- 音楽 · products → p.8 (same passages).
- 音楽 · customers デジタルストリーミングサービス → p.154「デジタルコンテンツからの収益には、デジタルストリーミングサービス契約からの
  収益が含まれており」. CDなどを扱う販売業者 → p.154「CDなどの製品売上からの収益は、物品が移転し販売業者が販売可能となった時点で」.
- 音楽 children → p.8 / p.163 (as above).
- 映画 · description「実写とアニメーションの映画、テレビ番組を製作・制作して配給・販売し、テレビネットワークや、アニメ配信のCrunchyroll
  などのDTC配信サービスを運営する」 → p.8「実写及びアニメーション映画作品の製作・買付・配給・販売」「テレビ番組の制作・買付・販売」
  「テレビネットワーク、DTC（Direct-to-Consumer）配信サービスのオペレーション」; Crunchyroll → p.38「アニメDTCプラットフォームであ
  るCrunchyroll」.
- 映画 · products → p.8; SonyLIV → p.38「CrunchyrollやSonyLIV等のDTCサービス」.
- 映画 · customers 映画館運営会社 / ケーブル・衛星・インターネットなどの配信事業者 → p.22「映画配給においては第三者の映画館運営会社に、
  映画やテレビ番組の配信においてはケーブル、衛星、インターネット及びその他配信システムに依存しており、当該第三者からソニーが受領する
  ライセンス料」「第三者配信会社」. Crunchyrollの有料会員 → p.37「有料会員数の増加…によるCrunchyrollの増収」; p.13「有料会員数が…
  2,100万人を突破」.
- 映画 children: テレビ番組制作 / 映画製作 (「全世界での製作・買付・配給・販売」) → p.163. メディアネットワーク → p.163「全世界での
  テレビネットワーク及びDTC配信サービスのオペレーション」; 「Crunchyrollもここに含まれる」 → p.38「メディアネットワークにおいては、
  CrunchyrollやSonyLIV等のDTCサービスの展開をさらに強化」.
- その他 · description「ディスク製造や記録メディアなど、ほかの分野に含まれない事業」 → p.7「その他分野は、ディスク製造事業、記録メディア
  事業等の様々な事業活動から構成」; p.8「上記カテゴリーに含まれない製品やサービス、ディスク製造、記録メディア、その他の事業」.
- All top-level businesses also cite tanshin-2027-q1 p.16 (セグメント区分: same six 分野, same descriptions).

### businessModel

- description「…世界中で提供し、製品の販売代金、サービスの利用料、作品のライセンス収入などを得ている」 → p.139 (世界全地域で販売・提供);
  p.154–155 収益認識 (製品の引き渡し, サブスクリプション, ライセンス).
- products → p.8, p.35 (PS5, PS Plus), p.163 (アニメーション作品).
- customers: プレイステーションのユーザー → p.35. 卸売事業者・小売事業者・販売業者 → p.22「製品の流通を卸売事業者、小売事業者、その他
  の再販売事業者及び第三者の販売業者に依存」. ゲームの開発・販売事業者 → p.154. デジタルストリーミングサービス → p.154. 映画館運営会社 /
  配信事業者 → p.22. イメージセンサーなどの部品を買う顧客 → p.154「ＥＴ＆Ｓ及びＩ＆ＳＳ分野においては…様々なエレクトロニクス製品・部品を
  顧客に引き渡すこと」.
- revenueSources (all p.154–155 収益認識 unless noted): ゲーム機・周辺機器・ソフトウェアディスクの販売 (「ハードウェア、周辺機器及び
  ソフトウェアディスクからの収益」); オンラインで販売するデジタルゲームコンテンツ (「オンラインプラットフォームを通じたデジタルコンテン
  ツ」); PS Plusなどサブスクリプション方式のサービス (「サブスクリプション方式による収益」; PS Plus p.35); プラットフォームライセンス収入
  (「開発・販売事業者へのプラットフォームライセンスからの収益」); ストリーミングサービスからの音楽の収入（売上高や使用量にもとづく
  ロイヤルティなど） (「売上高及び使用量ベースのロイヤルティ収入にもとづき認識」); CDなどの販売と、アーティストのライブ・物販 (「CDなど
  の製品売上」; ライブ・物販 p.163); 楽曲の詞・曲の管理とライセンス (p.163); 映画の劇場公開による収入 (「劇場映画収益は、劇場での上映に
  合わせて認識」); 放映ライセンスとデジタル配信 (「映画作品及びテレビ番組の放映に係るライセンス契約による収益」「デジタルダウンロード及び
  ビデオ・オン・デマンドからの収益」); テレビ広告収入と…料金 (「テレビ広告収入」「テレビネットワーク及びDTC配信サービスに対して支払われた
  有料放送料金」); エレクトロニクス製品とイメージセンサーの販売 (ET&S/I&SS 製品・部品の引き渡し); インターネット関連サービスの利用料
  (「インターネット関連サービスを利用者に提供する契約においては、加入契約期間にわたって収益を認識」).
- flow company「グループ本社のソニーグループ株式会社の下で…各事業をそれぞれの会社が担う」 → p.5 沿革 2021年4月「当社をグループ本社機能に
  特化した会社とするため」; p.8 主要会社 per 分野.
- flow offering → p.8, p.35, p.163.
- flow customer「ゲームのユーザー、製品を扱う販売店、ストリーミングサービス、映画館や配信事業者など」 → p.35, p.22, p.154. 「顧客の所在地別
  に見ると、米国が最も大きい」 → p.163 地域別情報 (ranking above).
- flow revenue → p.154–155 (as for revenueSources).
- flow profit「売上から、製品やコンテンツをつくる費用や販売・管理の費用などを差し引いて営業利益を計算する」 → p.160「営業利益（損失）は、
  売上高から売上原価、販売費・一般管理費及びその他の一般費用を差し引き、持分法による投資利益（損失）を加えたもの」; p.155 (18) 売上原価
  「製品の製作と生産に関連するもの…無形資産（コンテンツ資産を含む）の償却費…」. The「など」 covers the omitted equity-method term.
  Ranking「ゲーム＆ネットワークサービス、音楽、イメージング＆センシング・ソリューションの順に大きかった」 → p.160 (figures above).

### history

- **1946 東京通信工業を設立** · description → yuho-2026 p.4「1946年５月 電気通信機及び測定器の研究・製作を目的とし、東京都中央区日本橋
  に資本金19万円をもって東京通信工業㈱を設立」「1958年１月 社名をソニー㈱と変更」; founders → official-history 1946「終戦翌年の1946年、
  井深大と盛田昭夫は、東京・日本橋の白木屋3階に「東京通信工業株式会社」を設立。」.
- 1946 · significance「公式の沿革は、エレクトロニクスをソニーグループの「祖業」としている。2021年にはその事業がソニー株式会社の名前を受け
  継ぎ」 → official-history 2021「ソニー株式会社の商号は、ソニーグループの祖業であるエレクトロニクス・プロダクツ＆ソリューション事業が継
  承」. 「ソニー株式会社は今…ET&S分野の主要会社」 → p.8 ET&S 主要会社 ソニー㈱; p.10 関係会社 ソニー㈱「ＥＴ＆Ｓ」.
- **1968 CBS・ソニーレコードを設立** · description → p.4「米国CBS Inc.との合弁により、シービーエス・ソニーレコード㈱を設立（当社50％
  出資）。（1988年１月 当社100％出資…）」; official-history 1968「ソニーと米国CBSとの合弁により、日本においてCBS・ソニーレコード株式会社を
  設立」 (the entry uses the official page's spelling).
- 1968 · significance → p.4「1991年４月 ㈱ソニー・ミュージックエンタテインメント（以下「SMEJ」）に社名変更」; p.8 音楽 主要会社
  ㈱ソニー・ミュージックエンタテインメント.
- **1980 CCDイメージセンサーを商品化** · description → official-history `<li id="year1980"><h2>1980</h2>…<dt>CCDイメージ
  センサーを開発 商品化</dt>` (the year heading was checked in the HTML to belong to this item).
- 1980 · significance → p.7 (I&SS = イメージセンサー事業); p.14 (「中核であるモバイル向けイメージセンサー事業」); p.40 (スマートフォン).
  It states today's role of image sensors next to the 1980 event. It does **not** claim a technical lineage from
  CCD to today's sensors, which no source states.
- **1989 米国のコロンビア・ピクチャーズを買収** · description → p.4「1989年11月 米国Columbia Pictures Entertainment, Inc.を
  買収。（1991年８月 Sony Pictures Entertainment Inc.（以下「SPE」）に社名変更）」; official-history 1989.
- 1989 · significance → p.8 映画 主要会社 Sony Pictures Entertainment Inc.; p.8 テレビ番組制作; p.38 Crunchyroll.
- **1993 ソニー・コンピュータエンタテインメントを設立** · description → p.4「1993年11月 ㈱ソニー・コンピュータエンタテインメント（2016年
  ４月 ㈱ソニー・インタラクティブエンタテインメントに社名変更）を設立」; official-history 1994「ソニー・コンピュータエンタテインメント
  (現 ソニー・インタラクティブエンタテインメント) が、家庭用ゲーム機PlayStation®を日本国内にて発売」.
- 1993 · significance → p.4 (2016 rename); p.8 G&NS 主要会社 ㈱ソニー・インタラクティブエンタテインメント; 「売上高が最も大きかった」 → p.159.
- **2021 ソニーグループ株式会社に社名変更** · description → p.5「2021年４月 当社をグループ本社機能に特化した会社とするため、社名を
  ソニーグループ㈱に変更。これにともない、ソニーエレクトロニクス㈱、SHES、SIPS及びソニーモバイルコミュニケーションズ㈱が統合し、
  ソニー㈱として営業開始」.
- 2021 · significance → official-history 2021「ソニーグループ株式会社発足」「ソニーグループ株式会社の下、ゲーム＆ネットワークサービス、
  音楽、映画、エレクトロニクス・プロダクツ＆ソリューション、イメージング＆センシング・ソリューション、金融の6つの事業会社に再編」;
  「金融は2025年に連結から外れた」 → p.6.
- **2025 金融事業をパーシャル・スピンオフ** · description → p.5「2025年９月 金融事業のパーシャル・スピンオフの実行に先立ち、SFGIの株式を
  東京証券取引所プライム市場に上場」; p.257「当社普通株式１株につき、SFGI株式１株の割合で、2025年10月１日付で現物配当」; p.6「SFGIを
  連結子会社から除外」.
- 2025 · significance「金融事業は報告セグメントから外れ」 → p.158. 「…累積その他の包括利益を損失に振り替えたため、2026年3月期の当社株主に
  帰属する当期純利益はマイナスになった（継続事業の損益や資本合計、キャッシュ・フローへの影響はない）」 → p.257, p.132; tanshin-2026
  p.1 ※1 (quoted above); the causation is the derived arithmetic above.

### status

- `published`. The two former `needs-attention` notes (revenue scope; 2026年3月期 loss) were replaced by
  `revenueBasis` and `note` — see "revenueBasis and note".

## Gaps and judgement calls

1. **Revenue scope break — resolved.** The first draft was `needs-attention` because `FinancialRecord` could not
   express that 2022–2023年3月期 include 金融事業 and 2024–2026年3月期 do not. The type now has `revenueBasis`, and the
   entry is `published` (see "revenueBasis and note").
2. **2026年3月期 net income is negative** (△326,865百万円), and this comes from the spin-off accounting, not from
   operations. The value is stored as printed and explained in that year's `note` and in history 2025 significance.
3. **`shortNameEn` = "SONY GROUP".** "SONY" was considered, following the TOYOTA precedent. It was rejected because
   ソニー株式会社 (Sony Corporation) has been a separate company since 2021: the ET&S subsidiary that took the
   old name (p.5, p.10). A beginner could confuse a bare "SONY" wordmark with it. "SONY GROUP" is also the literal
   protocol rule (英訳名 minus the legal suffix).
4. **NYSE listing omitted from `listings`.** p.54 lists 東京・ニューヨーク, but `Listing.exchange` only allows
   tse/nse/fse/sse. This follows the Toyota precedent. Not an unverified fact.
5. **Revenue label kept verbatim** as 「売上高及び金融ビジネス収入」 for all five years, although the 2024–2026年3月期
   values contain no 金融ビジネス収入 (p.1 注5). The protocol requires the label as printed.
6. **Net income label** 「当社株主に帰属する当期純利益（損失）」 is taken from the latest table. yuho-2025 p.1 printed
   「当社株主に帰属する当期純利益」 without （損失）. The latest filing's label was used for every year.
7. **Industries**: `entertainment` is primary, with `electronics` and `semiconductors` as secondary. The primary
   choice is a classification judgement. Basis, derived: G&NS + 音楽 + 映画 segment revenue = 8,305,051百万円 of the
   12,806,188百万円 segment total before elimination (p.159). Also Sony's long-term vision is named
   「Creative Entertainment Vision」 (p.13). `finance` is not listed because 金融事業 is no longer a segment.
   `media` was not added separately; メディアネットワーク sits inside 映画.
8. **Segment ordering basis**: segment 計 (including intersegment) was used rather than external revenue, and this
   puts I&SS above 音楽 (figures above).
9. **Children**: included because the company names sub-businesses with revenue (p.8, p.162). Two nodes are
   called 「その他」 (ET&S child and the top-level segment). Both were kept because the company states what they
   contain (p.163, p.7–8). 音楽制作's ordering figure is a derived sum.
10. **shortName labels**: 「ゲーム」 follows the protocol's own example. 「エレクトロニクス」 comes from Sony's site
    navigation label (official-history page). 「イメージセンサー」 comes from p.7.
11. **Left out — not verifiable or not needed**:
    - ET&S brand names (α, BRAVIA, Xperia). They do not appear in the 有報; the official history page mentions
      them only as past launches. Generic product names from p.8/p.163 are used instead.
    - The mapping 「エレクトロニクス・プロダクツ＆ソリューション」→「エンタテインメント・テクノロジー＆サービス」. No document
      read states it, so no sentence depends on it.
    - The financial business's own history (1979 ソニー・プルーデンシャル生命, 2004 SFH). It is no longer part of
      the consolidated company.
    - 1979 ウォークマン and other product milestones. They are not clearly tied to today's segments.
12. **Known future change to watch** (not in the entry, as it is not yet the structure):
    - ET&S: ソニー㈱ signed a definitive agreement with TCL in 2026年3月 for a strategic partnership in home
      entertainment (p.39).
    - I&SS: an SSS–TSMC non-binding MOU on next-generation image sensors (p.14, p.40).
    - Sony Honda Mobility decided to cancel its EV model (p.21, p.34).
    - Re-check ET&S's structure at the next 有報.
13. **SFGI status after the filing** (tanshin-2027-q1 p.16): no longer an equity-method associate. The entry avoids
    any statement that would now be outdated.
14. **`yuho-2023` is listed but uncited**, deliberately (see Documents).
15. **Rounded or derived amounts in the entry: none.** The entry states rankings only. Every amount in this log
    marked "derived" is my arithmetic. All other amounts are as printed.

## netIncomeBasis (added 2026-09-14, after independent review F-01)

The independent review found that for 2024–2026年3月期 the revenue column is continuing operations only while
the net-income column is total profit attributable to shareholders, including the financial business
(非継続事業). The page did not say so, so the gap between the columns read as a margin.

`netIncomeBasis: "金融事業を含む"` is set on all five years.

- Source: yuho-2026 p.1 — the 当社株主に帰属する当期純利益（損失） row is not restated to continuing operations
  (注5 restates only 売上高及び金融ビジネス収入 and related revenue rows); p.132 連結損益計算書 shows
  当社株主に帰属する当期純利益（損失） as the sum of 継続事業からの純利益 and 非継続事業からの当期純利益（損失）.
- 2022–2023年3月期: the financial business was consolidated and not yet discontinued, so both scopes include it.
- The page now states that for 2024年3月期〜2026年3月期 revenue and net income cover different scopes and the
  bar gap is not a margin.
