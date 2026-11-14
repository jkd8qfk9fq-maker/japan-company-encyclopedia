# パイロットコーポレーション — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社パイロットコーポレーション |
| 証券コード | 7846 |
| docID（データを取り出した文書） | `S100XU5I` |
| 原本 docID | `S100XU5I` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU5I.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社パイロットコーポレーション / 7846 / docID S100XU5I（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
pilot: 10 件の数値を有報XBRLと照合
有報: 株式会社パイロットコーポレーション 有価証券報告書－第24期(2025/01/01－2025/12/31) (docID S100XU5I)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
pilot: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意（本文に財務諸表の組替えの記載がある）については、修正再表示チェックが前期有報と全8行一致し、表示方法の変更にあたる注記は確認できなかったため、組替えに関する financialNotes は書かず、判断経緯をここに記録しました。
- businessModel: 重要な後発事象のうち、2026年2月20日の取締役会決議による自己株式の取得と自己株式の消却の決定は、定例的な資本政策のため warnings にのみ記録し、needsReview には入れていません。
- businessModel: 当期純利益の増減理由は、本文に書ける財務数値が売上高と当期純利益に限られる規則に従い、本文には増減率のみを記載しました。
- businessModel: 2025年12月期の連結範囲の変更（マレーシア・インドの子会社の新規連結）に伴うセグメント間の売上高の移り変わりは、businessStructure の warnings に記録しました。
- businessStructure: 事業の並び順は、2025年12月期の報告セグメントの外部顧客への売上高の大きい順（米州・日本・欧州・アジア）としました。
- businessStructure: 日本セグメントの children は、MD&Aに印字された日本セグメントにおける主要な事業の売上高（ステイショナリー用品事業29,896百万円・玩具事業40億9百万円・産業資材・その他事業35億50百万円）に基づきます。3事業の合計と日本セグメントの外部顧客への売上高37,456百万円との差は1百万円で、有報の丸めによるものです。
- businessStructure: 2025年12月期にPilot Pen (Malaysia) Sdn. Bhd.及びPILOT PEN & STATIONERY COMPANY (INDIA) PRIVATE LIMITED（2025年9月26日付でPPIN Private Limitedから商号変更）を新たに連結の範囲に含めたことに伴い、従来は日本セグメントに含まれていたマレーシア及びインド向けの売上がアジアセグメントに含まれるようになった旨がMD&Aに記載されています。本登録は2025年12月期の区分に基づきます。
- businessStructure: 貴金属アクセサリー（宝飾）は【事業の内容】で日本セグメントの事業内容に含まれますが、独立した金額の開示がないため、独立した事業としては立てていません。
- history: 沿革表は年月と事象が交互に並ぶ通常の表で、崩れた表ではないため、印字どおりに30件を収録しました。資本金額の印字は沿革表にありません。
- history: Wikipedia（「パイロットコーポレーション」の記事冒頭）は本社の所在地と事業の一般的な説明にとどまり、有報にない補足として使える固有の事実がなかったため使用していません。
- industry: 主たる業界は、閉じた分類にステイショナリー（文具）の区分がないため、暫定で retail（小売）としました。発行済みの同業のコクヨも retail で登録されており、それに合わせています。理由と提案は taxonomyGaps に記録しました。
- industry: 報告セグメントが所在地別のため、2つ目の業界は付けていません。玩具・宝飾・産業資材は日本セグメントの一部で、ステイショナリー用品事業が外部顧客への売上高の9割以上を占めます。
- relatedCompanies: 金融機関の特定投資株式（mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group、iyogin-holdings、the-hyakugo-bank、tomato-bank）は、保有目的が金融取引関係または当社子会社の金融取引関係の維持・強化のみのため結んでいません。大株主の状況に載る三菱UFJ銀行・みずほ信託銀行（退職給付信託）・三菱UFJ信託銀行・朝日生命保険・第一生命保険と、信託銀行・資産管理会社（日本マスタートラスト信託銀行、日本カストディ銀行）は、金融機関・純投資のため結んでいません。
- relatedCompanies: meito（旧・名糖産業）とcanon-marketing-japanは、特定投資株式に取引関係の維持・強化を目的とする保有の印字がありましたが、当事業年度において全株式を売却済みで現在の関係がないため結んでいません。
- relatedCompanies: sharpは、沿革の「シャープペンシル」という製品名の印字であり、シャープ株式会社との関係の印字がないため結んでいません。mitsubishi-research-instituteとnomura-research-instituteは、サステナビリティ等の参考資料の引用のみのため結んでいません。
- relatedCompanies: 一般語・部分一致の誤マッチのため結んでいません: path（パーパスという一般語、ambiguous）、career（キャリアイベント等の一般語）、vision（2030年ビジョンの一般語）、base-4481（連結ベースの部分一致）、en（エンゲージメント等の部分一致、ambiguous）、innovation（内閣府総合科学技術・イノベーション会議の名称）、seki（セキュリティの部分一致、ambiguous）、land（南アフリカの通貨ランド・地名の部分一致）、lec（フレックスタイム制の部分一致）、no-1（ビジョンの標語「グローバル筆記具市場No.1」の部分一致）、port（レポートの部分一致）、zero（ネット・ゼロという一般語、ambiguous）、taya（関係会社の状況の本文の部分一致で社名の印字なし、ambiguous）、trust（日本マスタートラスト信託銀行の部分一致で、候補の株式会社トラストとは別の法人であり、コードリストにもない）。
- terms: 用語候補（助言のみ。用語の登録は行いません）: フリクション（こすると摩擦熱でインキが透明になって消える筆記具のシリーズ名）、ゲルインキ（水性インキに増粘性を持たせたインキで、なめらかな書き味のボールペンに使われる）、OEM（他社ブランドの製品を製造して供給すること）。

## 要確認（status に反映）

- businessModel: 2026年2月13日に、普通株式1株につき3株の割合で株式分割を行うことを決定したことが重要な後発事象として開示されています。基準日は2026年6月30日、効力発生日は2026年7月1日の予定であり、本登録の株式数に係る記載は分割前の2025年12月期時点のものです。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] パイロットコーポレーションの主たる業界 → 提案: ステイショナリー（文具）。筆記具を中心とするステイショナリー用品の製造・販売が事業の中心で、2025年12月期のステイショナリー用品事業の外部顧客への売上高は118,820百万円と連結売上高の9割以上を占めますが、閉じた分類に文具の区分がないため、用品の販売に最も近い retail を暫定としました。
