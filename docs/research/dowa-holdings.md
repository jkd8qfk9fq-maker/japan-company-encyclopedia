# DOWAホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＤＯＷＡホールディングス株式会社 |
| 証券コード | 5714 |
| docID（データを取り出した文書） | `S100YGIN` |
| 原本 docID | `S100YGIN` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGIN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | ＤＯＷＡホールディングス株式会社 / 5714 / docID S100YGIN |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dowa-holdings: 10 件の数値を有報XBRLと照合
有報: ＤＯＷＡホールディングス株式会社 有価証券報告書－第123期(2025/04/01－2026/03/31) (docID S100YGIN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
dowa-holdings: 本文の金額 19 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「DOWAホールディングス株式会社」が EDINET の提出者名「ＤＯＷＡホールディングス株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はセグメント注記・関連情報の百万円の表の印字値だけ。売上高745,410百万円・前期678,672百万円、純利益62,458百万円・前期27,128百万円。経常利益などの利益の金額・増減率・理由は書いていない。
- businessModel: 田中貴金属工業㈱は非上場の取引先で、掲載済みの企業ではないため relatedCompanies には結んでいない。
- businessModel: 純利益が前期から大きく増えた理由は、このパックの範囲では確認していないため書いていない。
- businessStructure: 並び順の根拠（セグメント注記の外部顧客への売上高、2026年3月期、百万円）：製錬352,169＞金属加工147,258＞環境・リサイクル111,105＞電子材料96,137＞熱処理33,997。『その他』4,742は報告セグメントに含まれないので最後。【事業の内容】の並び（環境・リサイクル、製錬、電子材料、金属加工、熱処理）には従っていない。
- businessStructure: 決算期は表紙DEIで確認：第123期、2026年3月31日終了、Japan GAAP、連結決算あり。上場は表紙の東京証券取引所プライム市場。
- businessStructure: セグメント利益・資産などは本文に書いていない。割合や増減率は有報に印字がないので計算して書かず、前期の印字額を併記した。
- businessStructure: 電子材料部門の外部顧客への売上高が前期158,382百万円から96,137百万円へ大きく変わった理由は、このパックの範囲では確認していないため、理由は書いていない。
- history: 沿革は有報の【沿革】に印字された事項のうち、事業の柱の始まり・持株会社化・上場・直近の再編を11件選んだ。表の崩れは無く、年月と事象は対応している。
- history: Wikipediaは使っていない（wikipedia.json が無い）。
- industry: 最大の報告セグメントは製錬（2026年3月期の外部顧客への売上高352,169百万円）。閉じた分類に非鉄金属・素材の区分が無いため、素材をつくる点で最も近い chemicals を暫定の primary にし、taxonomyGaps に書いた。
- industry: semiconductors は、電子材料部門（96,137百万円）が化合物半導体ウェハを事業として開示しているため2つ目に付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業の候補が機械抽出されていないため、関連企業は結んでいない。
- relatedCompanies: 田中貴金属工業㈱：主要な顧客として印字されているが、上場会社ではなく候補にも無いため結ばない。
- relatedCompanies: 関係会社の状況の子会社・持分法適用関連会社（DOWAエコシステム㈱など）は、いずれも上場会社ではないため結ばない（上場の根拠が無い）。
- terms: 助言：製錬、持株会社、リサイクル（都市鉱山）、化合物半導体、白金族金属、熱処理は、読者に説明が要る用語の候補。有報に定義は無く、登録時は別途一次資料で確認して書く。本文には用語リンクを使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] DOWAホールディングスの製錬部門（金・銀・銅・亜鉛などの非鉄金属の製錬）と金属加工部門 → 提案: 非鉄金属・素材（metals-materials）。最大の報告セグメントが非鉄金属の製錬で、金属加工も含めると売上の過半を占めるが、閉じた分類に金属・素材の区分が無い。
