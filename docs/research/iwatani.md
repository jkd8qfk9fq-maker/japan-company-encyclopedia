# 岩谷産業 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 岩谷産業株式会社 |
| 証券コード | 8088 |
| docID（データを取り出した文書） | `S100YBEM` |
| 原本 docID | `S100YBEM` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBEM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 岩谷産業株式会社 / 8088 / docID S100YBEM（id は英語表記「IWATANI CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
iwatani: 10 件の数値を有報XBRLと照合
有報: 岩谷産業株式会社 有価証券報告書－第83期(2025/04/01－2026/03/31) (docID S100YBEM)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":40448000000,"latestFiling":40465000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":61487000000,"latestFiling":61481000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":872194000000,"latestFiling":873044000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":397191000000,"latestFiling":397209000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
iwatani: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…76億66百万円（前年度比72億円の増益）でした。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 地域別売上は日本が最大であることだけを書き、金額は書いていません（有報の印字は百万円表記で、書き換えを避けるため）。
- businessModel: 財務の本文は売上高と当期純利益だけにしました。営業利益・経常利益などは書いていません。
- businessModel: financialNotes は2025年3月期の暫定的な会計処理の確定による数値の差を記録しました。差は当期純利益で17百万円ですが、金額は書いていません。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高（セグメント情報）：総合エネルギー 3,677億32百万円、産業ガス・機械 2,887億30百万円、マテリアル 2,183億77百万円。「その他」は報告セグメントに含まれない区分と有報が書いているため最後に置きました。
- businessStructure: 金額は経営者による分析の印字（億円・百万円表記）を使い、売上高だけを書きました。セグメント利益は書いていません。
- businessStructure: listings は表紙の「東京証券取引所プライム市場」に基づきます。
- businessStructure: 子会社名・製品別の金額は、有報が区分ごとに金額を印字していないため children を作っていません。
- history: 沿革の全行から主な出来事を選びました。本店・本社の移転の一部、研究所の完成、ISO認証、供給センターの統廃合、転換社債の権利行使などは省きました。
- history: 設立時の資本金の金額は規則により書いていません。
- history: 1962年・1965年・1969年の上場は1行にまとめ、年は最初の1962年にしました。
- industry: 主たる業界は、外部顧客への売上高が最も大きい総合エネルギー事業（ＬＰガス等）でエネルギーにしました。
- industry: 産業ガス・機械事業が半導体製造装置・電子部品製造装置を取扱商品としてセグメント情報に挙げているため、半導体を2つ目に付けました。
- industry: マテリアル事業（樹脂・鉱物・金属素材）には、閉じた分類に素材・資源の区分がないため、業界を足していません。
- relatedCompanies: 川崎重工業：岩谷産業が出資する日本水素エネルギーが造船契約を結んだ相手で、有報は政策保有の欄で取引先・共同実証とも述べますが、取引の向き（仕入・販売）が印字されておらず、岩谷産業本体の契約でもないため結んでいません。
- relatedCompanies: 小松製作所・大林組：燃料電池ショベルの共同実証の記載はありますが、1回の実証実験の記載にとどまるため結んでいません。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ・みずほフィナンシャルグループ・三井住友フィナンシャルグループ・りそなホールディングス・T＆Dホールディングス：主要取引金融機関で、資金調達等が理由のため結んでいません。
- relatedCompanies: 東亞合成・ダイキン工業・リンナイ・ノーリツなど政策保有株式の表に載る企業：保有目的が取引先との関係維持の定型句で、取引の向きが印字されていないため結んでいません。
- relatedCompanies: 静岡ガス：関連会社の主要な会社の名称の一部に社名が含まれるだけで、同一性の根拠が足りないため結んでいません。
- relatedCompanies: エン・コモ・ゼロ・レイ・セキ・鈴木・地主・ケル・高速ほか一般語に一致した候補（ambiguous を含む）：社名の一致のみで有報が当該社に触れていないため結んでいません。
- terms: 助言：用語集に ＬＰガス、エアセパレートガス、ミネラルサンド、レアアース、持分法適用関連会社 があれば、今後リンク記法で結べます。この工程では新規の用語の追加は行いません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 岩谷産業のマテリアル事業（ＰＥＴ樹脂・レアアース・ミネラルサンド・ステンレス等） → 提案: 素材・資源（materials）。樹脂・鉱物・金属を仕入れて売る事業が報告セグメントにあるが、閉じた分類に素材や資源の区分が無い。
