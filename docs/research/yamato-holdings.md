# ヤマトホールディングス — research log

Researched: 2026-09-27

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書－第161期（2025年4月1日－2026年3月31日）／docID `S100YAYL`／提出 2026-06-12 | https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAYL.pdf | 表紙・DEI、1 経営方針、2 沿革、3 事業の内容、従業員の状況、主要な経営指標等の推移、4 経営者による分析（MD&A、セグメント別概況、生産・受注・販売の実績、財政状態、キャッシュ・フロー）、1 設備投資等の概要、セグメント情報、関連情報、収益認識関係、重要な会計上の見積り |
| `official-history` | グループ史（会社公式） | https://www.yamato-hd.co.jp/company/history.html | 1919年創業、1973年ヤマトシステム開発設立、1976年1月「宅急便」発売、1988年7月クール宅急便、1982年10月商号変更、2005年11月持株会社移行 |

`official-history` was fetched for one reason only — to date the events in a misaligned 沿革 block (see below). It is a rank-4 official company page under the protocol. Everything else comes from the pack.

- `officialName`／`nameEn`：`cover-page.txt`「会社名、表紙」＝ヤマトホールディングス株式会社、「英訳名、表紙」＝YAMATO HOLDINGS CO., LTD.
- `listings`：「上場金融商品取引所名…」＝東京証券取引所プライム市場のみ。`tse` / 「プライム」。No foreign listing appears anywhere in the filing.
- `accountingStandard`：「会計基準、DEI」＝Japan GAAP。指標表の行立ては5年すべて同じ J-GAAP（営業収益／経常利益／親会社株主に帰属する当期純利益）なので5年すべて `jgaap`。

## Financials

出典はすべて `yuho-2026`「（１）連結経営指標等」（`indicators.txt`）。数値は summary.json のタグ値をそのままコピー（円）。

| fiscalYear | revenue（印字・百万円） | netIncome（印字・百万円） | Standard | Document · page |
|---|---:|---:|---|---|
| 2022年3月期（第157期） | 1,793,618 | 55,956 | jgaap | yuho-2026 主要な経営指標等の推移 |
| 2023年3月期（第158期） | 1,800,668 | 45,898 | jgaap | 同 |
| 2024年3月期（第159期） | 1,758,626 | 37,626 | jgaap | 同 |
| 2025年3月期（第160期） | 1,762,696 | 37,937 | jgaap | 同 |
| 2026年3月期（第161期） | 1,865,675 | 13,662 | jgaap | 同 |

Labels, as printed: revenueLabel `営業収益`, profitLabel `経常利益`, netIncomeLabel `親会社株主に帰属する当期純利益`, totalAssetsLabel `総資産額`, netAssetsLabel `純資産額`.

**No loss year in the table, so no 「又は…損失（△）」 wording appears in any of the six labels** — the printed labels really are the short forms, and the draft's labels were correct. Every value and label in `draft-entry.json` matched `indicators.txt`; nothing in it needed fixing. (This is the opposite case from ANA HD, where the loss year meant the printed profit label carried 「又は経常損失（△）」 and the draft had truncated it.)

`netIncome` candidate: a single tagged element, `jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults`. 包括利益 (47,276 / 46,114 / 42,003 / 50,607 / 15,474) is printed on the next row and was **not** used.

修正再表示チェック: `verify-financials.mjs` reported 「前期有報との比較: 24 行一致（修正再表示なし）」 — the comparison ran on 24 rows, so this is a real match. `brief.md` separately reports 8 rows matched with no restatement.

### `revenueBasis` / `netIncomeBasis`: NOT set — decision and reason

No perimeter change across the five years. The largest scope event is the 2024年12月 acquisition of 87.74% of ㈱ナカノ商会, which lifted コントラクト・ロジスティクス事業's external revenue 69.6% in 2026年3月期 — but it was consolidated prospectively and earlier years were not restated. There is no 非継続事業, no deconsolidation, and no retroactive presentation anywhere in the filing. The pack's restatement check agrees (24 rows matched). So both basis fields are omitted and the chart is not broken.

### Measurement-method change found — recorded, but it does not reach the six figures

セグメント情報 carries a 「（測定方法の変更）」 note: 「当社は、報告セグメントごとの損益をより適切に評価するため、当社の連結子会社であるヤマト運輸株式会社の本社関連費の配賦方法を当連結会計年度より変更しています。当該変更を前連結会計年度に反映させた場合、セグメント利益（△は損失）は「エクスプレス事業」で2,303百万円増加し、「コントラクト・ロジスティクス事業」で374百万円、「グローバル事業」で1,928百万円減少します。なお、当該変更による「連結財務諸表計上額」への影響はありません。」

This is a measurement-method change, but it is a **segment-profit** reallocation with explicitly no effect on the consolidated statements, so none of the six stored figures moves and no `note` was set for it. It matters for one comparison the entry makes — エクスプレス事業's segment profit going from △12,899百万円 to +2,299百万円 — so it is stated in that business's context indirectly through the filing's own figures, and recorded here in full. A reviewer comparing the two years' segment profits should know that 2,303百万円 of the swing is the reallocation.

### `note` set on two years, and why

- **2025年3月期**: net income (37,937) exceeds 経常利益 (19,587), which looks wrong until you know why. The filing states the cause in the FY2026 comparison: 「前連結会計年度に本社ビル等の大型のセール・アンド・リースバックに伴う特別利益を計上した」. The note says exactly that, attributed to the company.
- **2026年3月期**: revenue and both profit rows rose while net income fell 64.0%. The note gives the company's own two reasons — the reaction to the prior year's sale-and-leaseback 特別利益, and the goodwill write-down in コントラクト・ロジスティクス事業 (14,906百万円 amortised, of which 13,434百万円 booked as 特別損失「のれん償却額」; the unamortised balance fell from 15,827百万円 to 920百万円).

## Segment ordering

Ordered by 2026年3月期 外部顧客への営業収益 (セグメント情報, 当連結会計年度), largest first, with その他 forced last.

| Segment | 外部顧客への営業収益 (百万円) | セグメント間含む計 | セグメント利益 | Document · page |
|---|---:|---:|---:|---|
| エクスプレス事業 | 1,557,978 | 1,599,552 | 2,299 | yuho-2026 セグメント情報 |
| コントラクト・ロジスティクス事業 | 164,602 | 186,795 | 6,217 | 同 |
| グローバル事業 | 97,552 | 101,558 | 8,150 | 同 |
| モビリティ事業 | 22,033 | 66,435 | 5,221 | 同 |
| **その他**（報告セグメントではない） | 23,507 | 66,369 | 6,629 | 同（注1） |

**The residual-bucket rule changed the order here.** その他 (23,507百万円) out-earns モビリティ事業 (22,033百万円) on external revenue, so revenue order alone would put it fourth. The filing states 「ヤマトグループは「エクスプレス事業」「コントラクト・ロジスティクス事業」「グローバル事業」および「モビリティ事業」の４つを報告セグメントとしています」 — その他 is therefore not a business the company runs as a segment but the bucket for IT, call-centre and financial-services functions that 「お客様のサプライチェーン全体に対する価値提供拡大に向けた取組みを支える」. It goes last, and its description says so explicitly so the ordering is not read as an error. (Note the filing does not use the exact phrase 報告セグメントに含まれない for this column, unlike ANA HD; the four-segment sentence is what establishes it.)

Worth flagging for a reader: the ordering by revenue and the ordering by profit are almost inverted. エクスプレス事業 is 83.5% of revenue and the **smallest** segment profit (2,299百万円); グローバル事業 is 5.2% of revenue and the **largest** (8,150百万円). The entry states both sets of figures rather than implying the revenue order is a profit order.

## Segments are 事業-shaped, not product-shaped — confirmed

The task flagged that the filing might report by 事業 rather than by product. It does: all four reportable segments are named 〜事業, and 関連情報「製品及びサービスごとの情報」 gives only a two-way split (宅配便 1,408,896百万円 / その他 456,778百万円) — far coarser than the segments. The entry therefore uses the segments as the top level and carries the 宅配便 split inside the エクスプレス事業 child, not as a competing structure.

Children come from the filing's own 「報告セグメントごとのサービスの種類」 table, which lists service types per segment. Those rows are the children used:

- エクスプレス事業 → 個人および法人顧客向け宅配事業／貨物自動車運送事業／ロールボックスパレット貸切輸送事業
- コントラクト・ロジスティクス事業 → ３ＰＬ事業／不動産事業
- グローバル事業 → 法人顧客向け運送事業・物流センターの企画運営業（merged, as the filing's 物流支援収入 covers them together）／輸出入通関事業・航空運送代理店業（merged）
- モビリティ事業 → 自動車整備事業／ＥＶライフサイクルサービスとエネルギー事業（the filing's 燃料販売事業 row, described in the company's own words）
- その他 → no children (flat; the filing lists functions, not sub-businesses)

損害保険代理店業 is listed as a モビリティ事業 service type but the filing says nothing further about it, so it appears in that segment's `products` and not as a child.

## Claims

All from `yuho-2026` unless marked.

- Segment definitions and 主要な会社 → 3 事業の内容 (the セグメントの名称／事業内容／主要な会社 table) and セグメント情報 1.
- Segment revenue/profit/assets/設備投資 → セグメント情報 3; the 収入の種類別 breakdown (運送収入／物流支援収入／その他／内部売上消去 per segment) → MD&A（２）生産、受注及び販売の実績.
- 取扱数量 1,941百万個 / 451百万個 / 95百万冊 → MD&A グローバル事業の後の（参考）表.
- 宅配便 1,408,896百万円 / その他 456,778百万円 → 関連情報 1. 製品及びサービスごとの情報.
- 従業員数 174,696人（フルタイマー87,347／パートタイマー87,349）and the per-segment split → 従業員の状況 ①; 提出会社18人、ヤマト運輸㈱76,882人＋パートタイマー83,491人 → 同 ②③.
- 設備投資 69,446百万円（敷金を含む）、エクスプレス48,794、CL15,745、港南ビルほか19物件のセール・アンド・リースバック → 1 設備投資等の概要.
- のれん償却額14,906百万円（うち特別損失13,434百万円）、当期末残高920百万円、減損損失1,225百万円の内訳 → セグメント情報の のれん／減損 の注記.
- 契約資産・契約負債、対価の回収が30〜70日（個人顧客は引受時点） → 収益認識関係 2.、3.(1).
- 運送収入1,604,978／物流支援収入299,070／その他179,942／顧客との契約から生じる収益2,083,991／その他の収益18,955 → 収益認識関係 1.
- 2025年10月の届出運賃改定、11月の宅急便当日配送サービスと同一都道府県内運賃、「こねこ便420」、「置き配」、リレー方式、モーダルシフト → MD&A エクスプレス事業②および1 経営方針.
- 郡山市の統合型ビジネスソリューション拠点（2025年10月）、インドのロジスティクスセンター（2026年1月、ヤマトグループとして海外最大） → MD&A および 1 経営方針.
- ドライブレコーダー約4.6万台（2025年10月より順次） → MD&A ＜その他の取組み＞①.
- 中期経営計画「サステナビリティ・トランスフォーメーション2030 ～1st Stage～」、2027年3月期最終年度、基盤／成長／新規領域の位置づけ、ＧＨＧ目標（2050年実質ゼロ、2030年48％削減・2021年3月期比） → 1 経営方針.
- ヤマトクレジットファイナンス㈱の株式譲渡承認（2026年5月14日取締役会、2026年9月1日付）、RH㈱の2026年4月1日合併・商号変更、YAMATO ASIA PTE. LTD. の清算手続き中 → 3 事業の内容の注記.
- History events → 2 沿革, with 1919／1976 additionally from `official-history` (see below).

**Deliberately not written**: the filing sets capital-efficiency targets and a 株主還元 policy in 1 経営方針 and MD&A（５）（６）. Those are investment metrics (and several are on the banned list), so no target, ratio or payout figure from those paragraphs appears in the entry. The revenue/profit targets for 2027年3月期 were also left out — they are forward-looking guidance, not a description of what the company does.

## 沿革 date format — mixed, and how it was handled

`history.txt` prints dates **inline immediately before each event** for most of the table (e.g. 「1919年11月東京市京橋区において資本金10万円、車両数４台で創立。」「2024年12月コントラクト・ロジスティクス事業を手掛ける株式会社ナカノ商会の発行済株式数の87.74％を取得し連結子会社化。」). Those rows are sound on their own.

**Three blocks emit year cells separately from events**, and one of them contains the single most important event in the company's history:

1. 「1966年４月1973年１月1976年１月」＋「一般港湾運送事業の営業を開始。／コンピュータ部門を分離し、ヤマトシステム開発株式会社を設立。／小口貨物の宅配システム「宅急便」のサービスを開始。」— 3 years, 3 events.
2. 「1988年７月1996年12月」＋「…「クール宅急便」のサービスを開始。／宅急便の年末年始営業を開始。365日営業となる。」— 2 years, 2 events.
3. 「1997年３月1997年11月2002年１月2003年４月」＋six or more events — 4 years, more events than years. **Positional matching demonstrably breaks here**, which is why it cannot be trusted in blocks 1 and 2 either.

Because block 3 proves positional reading is unreliable, block 1 was not read positionally. I searched the whole pack for a second source inside the filing — `grep` for `1976`, for 創業/創立, and for any 「◯◯年◯月…宅急便」 pattern across `sections.json` and every `.txt` — and **there is none**: the 沿革 is the only place the filing dates 宅急便.

So an official company page was fetched: **https://www.yamato-hd.co.jp/company/history.html （グループ史）**, cited as `official-history`. It gives 宅急便 = **1976年1月**（「関東地区において｢宅急便｣発売」）, ヤマトシステム開発株式会社設立 = **1973年1月**, クール宅急便 = **1988年7月**（「全国発売（四国、沖縄を除く）」）, 創業 = **1919年11月**, 商号変更 = **1982年10月**, 持株会社移行 = **2005年11月**. That confirms the positional reading of blocks 1 and 2, independently.

The two history entries whose year depends on a separated year cell (1919 and 1976) therefore carry **both** source ids, and the entry notes the official page's slightly different wording (関東地区での発売 / 四国・沖縄を除く全国発売) rather than smoothing it into the 有報's phrasing. No event from block 3 is used as a history year; 1997年11月の全国ネットワーク完成 and 1996年12月の365日営業 appear only inside the 1976 entry's description and the business-model flow, where they are supporting detail with the same dates the official page confirms for the block-2 items — the block-3 items (1997年3月／11月, 2002年1月, 2003年4月) are stated only where the filing's own wording is repeated verbatim and are not used as the `year` of any history entry.

一般港湾運送事業 (block 1, 1966年4月 by position) was left out of the entry entirely — the official page dates a 1950年3月 通運事業 opening instead of a 1966 harbour-operations entry, so the two sources do not clearly line up and there was no need for the claim.

## Gaps and judgement calls

1. **`draft-entry.json` was correct as delivered.** All six series, all five years, all labels, `code`, `officialName`, `nameEn` matched `indicators.txt`. No bug found for this company.
2. **The 沿革 needed an outside source** — see above. This is the one company of the four where the pack alone could not date a load-bearing history event.
3. **従業員数 falls 210,197 → 177,430 between 2023年3月期 and 2024年3月期 (−32,767 人, −15.6%) and the filing does not explain it.** Nothing in `indicators.txt`'s notes, 従業員の状況, or MD&A accounts for the drop. The 2026年3月期 breakdown shows the count includes パートタイマー (87,349 of 174,696), so a change in how part-timers are counted or a disposal is plausible — **but the filing does not say so, and nothing was written about it.** The figures are the filing's tagged values and verify clean; the *reason* is the gap. Recorded here so a future cycle with the 2024年3月期 filing in hand can close it. The entry makes no claim about it, so `status` stays `published`.
4. **Segment-profit reallocation** (measurement-method change) recorded above; no `note` set because it does not touch the consolidated figures.
5. **`industries`: `transportation` only.** 不動産事業, ＩＴシステム開発 and 金融サービス業 all appear in the filing, but none is a reportable segment — unlike ANA HD, where 商社事業 is — so no secondary industry was added.
6. **その他 placed last despite out-earning モビリティ事業** — reasoning and the exact sentence that establishes it are above.
7. **Nothing is null.** All six series present for all five years.
8. `name` は「ヤマトホールディングス」、`shortNameEn` は「YAMATO」（英訳名 YAMATO HOLDINGS CO., LTD. から法人格・HOLDINGS を落としたもの）。
