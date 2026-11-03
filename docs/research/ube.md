# UBE — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＵＢＥ株式会社 |
| 証券コード | 4208 |
| docID（データを取り出した文書） | `S100YD42` |
| 原本 docID | `S100YD42` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD42.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＵＢＥ株式会社 / 4208 / docID S100YD42（id は英語表記「UBE Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ube: 10 件の数値を有報XBRLと照合
有報: ＵＢＥ株式会社 有価証券報告書－第120期(2025/04/01－2026/03/31) (docID S100YD42)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":22372000000,"latestFiling":22369000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":865669000000,"latestFiling":866180000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":412013000000,"latestFiling":412292000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ube: 本文の金額 16 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「UBE株式会社」が EDINET の提出者名「ＵＢＥ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから2026年3月期。金額は百万円の表の印字を百万円で書いた。営業利益・経常利益・セグメント利益は本文に書いていない。
- businessModel: 地域別売上高は有報が顧客の所在地を基礎に分類するもの。合計は462,343。
- businessModel: customers の用途は MD&A に出る需要の説明（自動車向け、食品包装フィルム、スマートフォン、半導体製造装置、バイオメタン）から採った。個別の取引先名は有報にない。
- businessModel: revenue の説明の『製鋼事業の経営権を前連結会計年度に他社へ譲渡』『ナイロンポリマー・カプロラクタム等の低迷』は MD&A の記載。profit の前期の特別損失の記載も MD&A による。
- businessModel: 前期有報との比較で2025年3月期の純利益に差はない（-4,816百万円）。ブリーフの注意にある財務諸表の組替えは、地域別売上高で北米を区分掲記した表示方法の変更で、金額の範囲は変わらない。
- businessStructure: 決算期は表紙のDEIから2026年3月期（第120期、2025年4月1日〜2026年3月31日）。上場は表紙の東京証券取引所プライム市場。
- businessStructure: 並び順は2026年3月期セグメント注記の外部顧客への売上高の大きい順：樹脂・化成品228,419＞機械68,087＞機能品50,930＞その他48,137＞高機能ウレタン46,130＞医薬20,640。『その他』は報告セグメントなので売上順に置いた。セメント関連事業は報告セグメントではなく『調整額』に含まれ、金額が独立して印字されていないので最後に置き、金額が無い旨を書いた。
- businessStructure: 当期から報告セグメントを4区分から6区分（高機能ウレタン・医薬を新設）に変更。前期の数値は変更後の区分に組み替えた有報の印字を使った。
- businessStructure: セグメント利益・営業利益は本文に書いていない。
- businessStructure: customers は有報が個別の販売先を印字せず、10％以上の特定顧客もないので書いていない。
- businessStructure: ポリエチレン製品（宇部フィルム）、舶用機械（福島製作所）、グループ製品の海外販売（その他）は【事業の内容】の子会社の説明から採った。
- history: 沿革の表は年月と事象が対応して印字されており、崩れていないので、日付は印字どおりに使った。
- history: 選んだのは現在の事業・主要子会社・上場・商号に結びつく17件。研究所の開設、工場の新設（堺工場、発電所など）、子会社の合併だけの行（2013年・2016年・2020年）は事実として有報にあるが載せていない。2026年4月の生産技術研究所の開設も載せていない。
- history: 1897年の沖ノ山炭鉱は1942年に合併した4社の1つとして有報が列挙する。『源流の1つ』という表現は有報の沿革の並び（4社が合併して設立）から読める範囲にとどめた。
- history: significance の連結売上高の10％超の注記は【関係会社の状況】の注記による。
- industry: 主たる業界は、外部顧客への売上高が最も大きい樹脂・化成品（228,419百万円）と、機能品・高機能ウレタンを合わせた化学系の事業で chemicals とした。機械（68,087百万円）と医薬（20,640百万円）は報告セグメントとして売上高が開示されているので、machinery と pharmaceuticals を付けた。
- industry: 半導体向けの部材は、半導体製造装置向けの需要がMD&Aに出るだけで、事業として独立して開示されていないので semiconductors は付けていない。
- relatedCompanies: 証拠パックに related-candidates.json がない。掲載済みの上場企業として本文の社名と照合できる候補がないので、結ばなかった。
- relatedCompanies: ＵＢＥ三菱セメント㈱（持分法適用関連会社、所有割合50％）：同一性を確認できる上場の掲載済み企業の候補がない。
- relatedCompanies: 宇部マクセル㈱（連結子会社、66.01％）、宇部エクシモ㈱、ＵＢＥマシナリー㈱、UBE Chemicals (Asia) Public Company Limited ほかの連結子会社：上場企業として掲載済みの候補で確認できないので結ばなかった。
- relatedCompanies: ドイツのLANXESS社：ウレタンシステムズ事業の取得という過去の1回限りの取引で、候補にもないので結ばなかった。
- terms: 用語の追加候補（助言のみ）：カプロラクタム（ナイロンの原料）、ポリイミド、分離膜、セパレータ（リチウムイオン電池材料）、コンポジット、エラストマー（合成ゴム）、ウレタンシステムズ、ダイカストマシン、持分法適用関連会社。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
