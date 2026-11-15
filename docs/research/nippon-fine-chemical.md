# 日本精化 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本精化株式会社 |
| 証券コード | 4362 |
| docID（データを取り出した文書） | `S100YCCG` |
| 原本 docID | `S100YCCG` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCCG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本精化株式会社 / 4362 / docID S100YCCG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-fine-chemical: 10 件の数値を有報XBRLと照合
有報: 日本精化株式会社 有価証券報告書－第158期(2025/04/01－2026/03/31) (docID S100YCCG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-fine-chemical: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、千円単位で印字された数値を百万円未満切り捨てで記載した（切り捨ての方針をここに記録する）。地域別売上高の切り捨て後の合計は33,795百万円となり、印字の連結売上高33,796百万円と1百万円異なる。金額はいずれも印字どおりに記載した。
- businessModel: 経営成績等の分析には、機能性製品セグメントのトレーディング分野で、商事子会社のうち1社が当社グループより離脱したため売上高が減少したと記載されている。期末（2026年3月31日）時点の連結子会社は5社であり、この離脱は当期中に完了して期末の構造に反映されているため、needsReview には入れていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されており、needsReview の対象はない。
- businessModel: 主要な経営指標等の注記は、潜在株式が存在しないため潜在株式調整後の数値を記載していない旨のみであり、会計基準の適用や表示方法の変更に関する注記はないため、financialNotes は空とした。前期有報との修正再表示チェックも全系列で差異なしであった。
- businessModel: 中期経営計画の定量目標（売上高、ROIC、ROE、DOE、配当など）は利益指標・投資指標を含むため、perspectives の strategy には記載せず、定性的な基本方針のみを記載した。
- businessModel: 経営成績等の分析に記載された営業利益・経常利益の金額は、本文の財務数値が売上高と当期純利益のみであるため記載していない。
- businessModel: businessModel に suppliers のキーは、この作業ツリーのスキーマに無いため書かなかった。調達の事実は事業の内容（当社並びに株式会社アルボースが使用する原材料の一部は日精バイリス株式会社を通じて調達）に記載したとおりであり、グループ内調達である。
- businessModel: 特定投資株式のダイトーケミックス株式会社の株式数の増加（201,200株から603,600株）は、同社の株式分割によるものであり、当社の株式分割ではないため、needsReview には入れていない。当社自身の株式分割・株式併合は主要な経営指標等の注記に記載がない。
- businessStructure: 連結子会社5社（日精バイリス株式会社、株式会社アルボース、日精プラステック株式会社、四川日普精化有限公司、日隆精化國際股份有限公司）は当社グループの会社であり、relatedCompanies のリンクにはしていない。株式会社アルボースは連結売上高に占める割合が10％を超える特定子会社相当の開示があるが、その損益情報等の金額は本文には記載していない。
- businessStructure: 経営成績等の分析によれば、機能性製品のトレーディング分野で商事子会社のうち1社が当期中に当社グループより離脱している。期末時点の連結子会社は5社であり、期末の構造で記載した。
- history: 沿革に記載された設立時・子会社設立時の資本金の金額は、本文に含めないため各行に記載していない。
- industry: 主力は化粧品・医薬品向け原料を含む化学品の製造であり、閉じた分類では chemicals が最も近いため主たる業界とした。
- industry: 環境衛生製品も業務用洗剤・除菌剤等の化学品であり、同じ chemicals に含まれる。
- industry: 医薬品用リン脂質や医薬品中間体を扱うが、医薬品そのものの製造販売は行っていないため、pharmaceuticals は付けなかった。
- relatedCompanies: 特定投資株式の保有目的は、セグメント名を除けば各銘柄でほぼ同一の文面であるが、各銘柄ごとに取引を行うセグメント（機能性製品又は環境衛生製品）が個別に印字され、取引先であることが明示されているため、取引の方向は印字されていないことから business-partner としてリンクした。
- relatedCompanies: 株式会社マツモト交商は、主要な顧客ごとの情報で2026年3月期に5,285百万円（連結売上高の15.6％）の売上高が開示された最大の顧客であり、当社株式の1.74％を保有する大株主でもあるが、非上場であり関連候補に含まれていない（候補の matsumoto は株式会社マツモトという別の法人である）ため、リンクしなかった。事実はここに記録する。
- relatedCompanies: 株式会社三井住友フィナンシャルグループ及び株式会社三菱ＵＦＪフィナンシャル・グループは、保有目的が取引金融機関であること（資金調達の関係）のためリンクしなかった。
- relatedCompanies: フジ日本株式会社、アステラス製薬株式会社、久光製薬株式会社は、当事業年度に政策保有株式の保有方針に基づき全株式が売却され、保有がゼロになったためリンクしなかった。
- relatedCompanies: 太陽鉱工株式会社は当社株式の17.68％を保有する筆頭株主であるが、非上場であり、取引関係の印字もないためリンクしなかった。
- relatedCompanies: ギリアド・サイエンシズ社は、経営成績等の分析で医薬品用リン脂質の販売先として堅調に推移した旨が記載されるが、非上場の外国会社であり関連候補に含まれていないためリンクしなかった。
- relatedCompanies: そのほかの候補（en、innovation、base-4481、ray、career、port、seki、lec、path、zero、core、daiwa、ishin、land、vision、suzuki-6785、trust）は、通常の語句や部分一致による抽出であり、有報に取引・提携・資本関係の記載がないためリンクしなかった。
- relatedCompanies: ダイトーケミックス株式会社の保有株式数の増加は同社の株式分割によるものであり、当社の株式分割ではない。
- terms: 助言のみの工程のため data は空とした。用語の候補としては、リン脂質、ウールグリース誘導体、リポソームなどが本文に現れる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
