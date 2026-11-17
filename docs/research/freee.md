# フリー — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | フリー株式会社 |
| 証券コード | 4478 |
| docID（データを取り出した文書） | `S100Z4LO` |
| 原本 docID | `S100Z4LO` |
| 提出日（原本） | 2026-09-28 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z4LO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | フリー株式会社 / 4478 / docID S100Z4LO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
freee: 10 件の数値を有報XBRLと照合
有報: フリー株式会社 有価証券報告書－第14期(2025/07/01－2026/06/30) (docID S100Z4LO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
freee: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（売上高42,441,680千円→42,441百万円、純利益1,077,905千円→1,077百万円）。四捨五入はしていない。
- businessModel: 単一セグメントで製品・サービスごとの売上高も開示されていないため、セグメント別の金額は本文に書いていない。
- businessModel: 第14期に導入した株式給付信託（J-ESOP）は、経営指標等の注記に算定上の取扱いとして印字されている従業員向けの株式給付の仕組みであり、指標の比較可能性を変えるものではないためfinancialNotesには入れず、ここに記録する。
- businessModel: 提出後の資本政策はwarningsのみに記録する：2026年8月13日の取締役会で、株式給付信託（J-ESOP）への追加拠出（追加信託日2026年8月27日、信託による株式取得は2026年9月1日までに414,200株で完了）と、自己株式の取得（2027年2月12日までの予定、2026年8月31日現在88,400株を取得済み）を決議している。いずれも資本政策であり、2026年6月30日現在の構造に基づく本登録の内容には影響しない。
- businessModel: MD&Aの調整後数値の内訳について、費用計上区分の見直しにより過年度分の金額が変更されている旨の注記があるが、調整後（非GAAP）数値の表示上の取扱いであり、5年間の経営指標には影響しないためfinancialNotesには入れていない。
- businessModel: 創業以来配当を実施しておらず、当面は財務体質の強化と内部留保の充実を図る方針が配当政策に印字されている。投資指標にあたる数値目標は本文・戦略に書いていない。
- businessStructure: 単一セグメント（プラットフォーム事業）のため、報告セグメント別の売上高は開示されていない。【関連情報】でも単一の製品・サービスの区分が外部顧客への売上高の90％を超えるため製品・サービスごとの情報は省略されており、子事業に金額は書いていない。
- businessStructure: 連結子会社は5社で、社名が開示されているのはフリー創業融資サポート株式会社（資金調達のサポート事業）と株式会社ロジクラ（クラウド物流プラットフォームサービス）の2社のみ。その他3社と持分法適用関連会社1社は社名の開示がないため、事業の担い手として社名は書いていない。
- businessStructure: このツリーのスキーマには suppliers キーがないため businessModel に suppliers は書いていない。なお有報にも特定の仕入先の記載はない。
- history: 沿革の設立行に印字された資本金の金額は、履歴に金額を書かない規則のため記載していない。
- history: 沿革には多数のプロダクトリリースが並ぶため、主力サービスの開始、商号変更、上場、主な子会社化に絞って採った。落とした行は個別の機能・プロダクトのリリース（freee会社設立、freee開業、freee申告、freeeカード、freee連結会計、freee振込、freee経営管理など）と小規模な子会社化・吸収合併（株式会社YUI、アポロ株式会社など）である。
- industry: プラットフォーム事業の単一セグメントで、クラウドERP・SaaSの提供が売上のすべてを占めるため、主たる業界は it のみとした。
- industry: クレジットカードやファクタリングなどの金融サービスは、独立したセグメント開示がなくプラットフォーム事業の一部であるため、finance は付けていない。
- relatedCompanies: rakus のみ結んだ：【大株主の状況】に載る事業会社であり、親会社・子会社・関連会社の区分には当たらないため major-shareholder とした。有報に同社との取引・提携の印字はない。
- relatedCompanies: en は結ばなかった：2023年12月にエン・ジャパン株式会社のフリーランス管理ツール「pasture」事業を会社分割により承継した相手だが、過去の一回限りの事業承継であり、現在の取引・提携・資本関係の印字がないため。
- relatedCompanies: 株式会社リクルートは【大株主の状況】に載る大株主（2026年6月30日現在2,277,267株、3.81％）だが、候補一覧に含まれないため結ばなかった。
- relatedCompanies: 大株主のうち、個人（佐々木大輔、横路隆）と、常任代理人経由の保管口座（MSIP CLIENT SECURITIES、MSCO CUSTOMER SECURITIES、GOLDMAN SACHS & CO.REG、INTERACTIVE BROKERS LLC、BNYM系）は、事業会社としての関係ではないため結ばなかった。
- relatedCompanies: 特定投資株式は GVA TECH株式会社（64,350株、保有目的は取引関係の維持・強化）の1銘柄のみで、同社は非上場で候補一覧に含まれないため結ばなかった。
- relatedCompanies: 2016年10月にAPI連携を行った株式会社みずほ銀行は上場会社の子会社であり候補一覧に含まれないため結ばなかった（連携の事実は沿革に記載）。
- relatedCompanies: そのほかの候補は、いずれも一般語・部分一致による抽出で、有報にその会社との関係の記載がないため結ばなかった：port（サポート等の部分一致）、career（キャリアの語）、seki（セキュリティ等の部分一致、ambiguous）、ray（レイアウト等の部分一致、ambiguous）、rent（タレント等の部分一致）、mtg（社内会議の略称MTG）、vision（ミッション・ビジョンの語）、base-4481（データベースの語）、innovation（イノベーションの語）、the-lead（リードタイムの語）、transaction（トランザクションデータの語）、space（社内スペースの語）、step（キャリアステップの語）、land（リブランドの部分一致）、core（スコアの部分一致、ambiguous）、corona（新型コロナウイルス感染症の語）、cover（カバーの語）、draft（契約書ドラフトの語、コードリスト外）、insight（インサイトの語）、path（セキュリティチェックをパスした旨の語、ambiguous）。
- terms: 助言のみ：『統合型経営プラットフォーム』『ARR（継続収益の年換算）』『ARPU（1有料課金ユーザー企業当たりの平均単価）』『スモールビジネス』『Done for You（業務をAIエージェントに任せる体験）』『株式給付信託（J-ESOP）』は、この会社の解説で読者がつまずきやすい語として用語候補に挙げる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
