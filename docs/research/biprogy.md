# BIPROGY — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＢＩＰＲＯＧＹ株式会社 |
| 証券コード | 8056 |
| docID（データを取り出した文書） | `S100YFCP` |
| 原本 docID | `S100YFCP` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFCP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＢＩＰＲＯＧＹ株式会社 / 8056 / docID S100YFCP（id は英語表記「BIPROGY Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
biprogy: 10 件の数値を有報XBRLと照合
有報: ＢＩＰＲＯＧＹ株式会社 有価証券報告書－第82期(2025/04/01－2026/03/31) (docID S100YFCP)
前期有報との比較: 29 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
すべて一致しました。
biprogy: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「BIPROGY株式会社」が EDINET の提出者名「ＢＩＰＲＯＧＹ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益と当期利益は indicators 相当の brief.md の値（XBRL）。有報の掲げる行は売上収益と親会社の所有者に帰属する当期利益（IFRS）。
- businessModel: 戦略と強み（perspectives）は書かなかった。
- businessStructure: 事業の並びは2026年3月期のセグメント売上収益の大きい順（システムサービス > アウトソーシング > ハードウェア > サポートサービス > ソフトウェア）。報告セグメントに含まれない「その他」は最後。
- businessStructure: 金額は説明文に書いていない（百万円の印字を書き換えないため）。
- history: 沿革表の2012年8月22日以降は、年月のセルが先に並び、事象文が後にまとまる崩れた表だった（日付21件、事象21件）。行順で対応づけたが、2025年の事象は日付が他の節（関係会社の状況の注記）と食い違う疑いがあるため落とした。
- history: 落とした行: キャナルペイメントサービス設立、キャナルベンチャーズ設立、Canal Ventures Collaboration Fund 1号組成、Axxis Consulting (S)子会社化、CVCF2組成、グリーンデジタル&イノベーション設立、V-Drive Technologies設立、AFON IT子会社化、Nexus System Resources子会社化、iByte Solutions子会社化、Translink Fund組成、Mattrz子会社化（関係会社の状況の注記では2025年8月29日で、表の順の日付と合わない）、BCF1組成、Spacid設立、BIPROGY Energy Storage設立。地域開発会社7社の吸収合併も日付の裏付けが無いため落とした。
- history: 採用した2012年8月22日・2022年4月1日・2022年4月4日・2026年1月6日の行は、行順の対応づけに加え、2026年1月6日は関係会社の状況の注記8、2022年の2件は商号と市場区分の事実で裏付けた。
- history: 2014年3月1日のユニアデックスによるネットマークスの吸収合併は、2007年の項目の説明に含めた。
- industry: 報告セグメントはすべてITソリューションサービスの製品・サービス別なので、IT・ソフトウェアのみとした。
- relatedCompanies: 大日本印刷株式会社: 有報はその他の関係会社（被所有21.45％、2026年3月31日現在）、業務提携（2012年8月9日）、システムサービスの受託・機器とソフトウェアの販売を述べるが、証拠パックに related-candidates.json が無く、掲載済み企業としての同一性を確かめられないため結ばなかった。
- relatedCompanies: 三井物産株式会社: 沿革に過去の株式譲渡があるだけで、現在の関係が印字されていないため結ばなかった。
- relatedCompanies: ユニアデックス㈱ ほかの連結子会社・持分法適用関連会社は、related-candidates.json が無く掲載済みか確認できないため結ばなかった。
- terms: 用語の候補（助言のみ）: SEサービス、請負開発、アウトソーシング、使用許諾（ライセンス）、IFRS、調整後営業利益率の定義は本文に書かないが、SEサービスとアウトソーシングは読者に説明があると分かりやすい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
