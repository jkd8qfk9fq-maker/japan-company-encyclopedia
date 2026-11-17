# イムラ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社イムラ |
| 証券コード | 3955 |
| docID（データを取り出した文書） | `S100Y0K4` |
| 原本 docID | `S100Y0K4` |
| 提出日（原本） | 2026-04-27 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0K4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社イムラ / 3955 / docID S100Y0K4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
imura-and-co: 10 件の数値を有報XBRLと照合
有報: 株式会社イムラ 有価証券報告書－第76期(2025/02/01－2026/01/31) (docID S100Y0K4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
imura-and-co: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はセグメント注記の百万円の印字をそのまま使った（千円額の切捨て換算はしていない）。売上高の前期比はMD&Aの印字（4.4％増）を用いた。
- businessModel: ブートストラップ時の「組替え・遡及適用」の注意は、経営指標等の注記2（2022年改正会計基準の遡及適用）を指すものと判断し、financialNotesに{2025年1月期}として記録した。前期有報との修正再表示チェックは全系列で差異ゼロであり、表示方法の変更に該当する注記は本文に見当たらなかった。
- businessModel: 中期経営計画の数値目標（2026年度目標の売上高225億円・2030年度目標の売上高250億円以上など、経常利益や自己資本利益率の目標を含む）は、本文・戦略に書かず、このwarningsに記録するにとどめた。
- businessModel: セグメント利益、MD&Aの利益面の金額、受注高・受注残高、生産高は本文に書いていない。
- businessModel: このツリーのスキーマにsuppliersキーが無いため、businessModelにsuppliersは書いていない。仕入先の事実は関連企業の工程に記録した。
- businessStructure: 連結子会社は4社（東杏印刷株式会社、株式会社イムラプリンティング、株式会社ロジテック、SONGLAM TRADING AND PACKAGING PRODUCTION JOINT STOCK COMPANY）。SONGLAMは特定子会社に該当し、議決権の55.0％を保有している。
- businessStructure: 株式会社メトロテックは2025年3月31日付で全株式を譲渡し、連結の範囲から除外された。期中に完了し、2026年1月31日現在の体制に反映されているため、needsReviewではなく沿革とwarningsに記録した。
- businessStructure: セグメントの並び順は、セグメント注記の外部顧客への売上高の大きい順とし、報告セグメントに含まれない「その他」は最後に置いた。セグメント利益は書いていない。
- history: 沿革から落とした行：東京連絡所・福岡出張所・札幌駐在所などの拠点開設と移転、奈良新庄・御所・相模原・都城・筑波・山口美和の各工場の設置と閉鎖、サイドシーム封筒・メモルダーの自社開発、米国TENSION INTERNATIONAL,INC.からの技術導入、株式会社タイパック・株式会社イムラメーリング・株式会社津田イムラの設立・吸収合併、ISO認証の取得、研修施設「潤創館」の開設、本社・本店の移転。いずれも拠点・認証・子会社の細かな変遷であり、会社の大きな流れを変えるものではないため省いた。
- history: 1950年の設立行について、沿革に印字された資本金の金額は本文に書いていない（沿革に資本金額を書かない規則による）。
- history: 沿革の表は年月と事象が順に印字されており、行順に対応づけて読んだ。
- industry: 主たる業界は、売上高の大半を占めるパッケージソリューション事業（封筒・包装資材の製造販売）から、最も近いmediaを暫定で選んだ。メーリング＆デジタルソリューション事業（発送代行・データプリント等）も閉じた分類に合う値が無いが、同一グループの一体事業として主たる業界に含めた。
- relatedCompanies: 関連付けを行わなかった候補と理由は次のとおり。
- relatedCompanies: mizuho-leasing（みずほリース株式会社）: 特定投資株式の保有目的が「取引拡大を目的とし、良好な取引関係の維持、強化を図るため」で、山善・MS&ADと同一の定型文であり、取引の役割が個別に印字されていないため関連付けしない。
- relatedCompanies: ms-and-ad-insurance-group-holdings（MS&ADインシュアランスグループホールディングス株式会社）: 保有目的がみずほリース・山善と同一の定型文で役割の印字がなく、保険会社でもあるため関連付けしない。
- relatedCompanies: yamazen（株式会社山善）: 保有目的がみずほリース・MS&ADと同一の定型文で役割の印字がないため関連付けしない（ambiguousの候補でもある）。
- relatedCompanies: arakawa-chemical-industries（荒川化学工業株式会社）: 保有目的が「長期的・安定的な関係の構築のため」で、アジアパイルホールディングスと同一の定型句のみであり、取引の役割が印字されていないため関連付けしない。
- relatedCompanies: asia-pile-holdings（アジアパイルホールディングス株式会社）: 保有目的が荒川化学工業と同一の定型句のみで役割の印字がないため関連付けしない。
- relatedCompanies: mitsubishi-ufj-financial-group（株式会社三菱UFJフィナンシャル・グループ）: 保有目的の中心が「主要取引金融機関であり、資金借入や事業展開の情報収集」で金融取引の関係であるため関連付けしない。
- relatedCompanies: the-nanto-bank（株式会社南都銀行）: 保有目的が「主要取引金融機関であり、資金借入や事業展開の情報収集」で金融取引の関係であるため関連付けしない。
- relatedCompanies: seki（セキ株式会社）: 「情報セキュリティマネジメントシステム」の部分一致（ambiguous）であり、セキ株式会社への言及ではないため関連付けしない。
- relatedCompanies: vision（株式会社ビジョン）: 長期ビジョン「IMURA VISION 2030」の語の一致であり、株式会社ビジョンへの言及ではないため関連付けしない。
- relatedCompanies: en（エン株式会社）: 沿革の「米国TENSION INTERNATIONAL,INC.」の部分一致（ambiguous）であり、エン株式会社への言及ではないため関連付けしない。
- relatedCompanies: innovation（株式会社イノベーション）: 経営理念の「変革とイノベーション（革新）」の語の一致であり、株式会社イノベーションへの言及ではないため関連付けしない。
- relatedCompanies: port（ポート株式会社）: 「サポート」の部分一致であり、ポート株式会社への言及ではないため関連付けしない。
- relatedCompanies: base-4481（ベース株式会社）: セグメント利益の「営業利益ベース」の語の一致であり、ベース株式会社への言及ではないため関連付けしない。
- relatedCompanies: fisco（株式会社フィスコ）: 「オフィスコンピュータ」等の部分一致であり、株式会社フィスコへの言及ではないため関連付けしない。
- relatedCompanies: japan-communications（株式会社日本通信）: MD&Aの「公益社団法人日本通信販売協会」の名称の一部であり、株式会社日本通信への言及ではないため関連付けしない。
- relatedCompanies: core（株式会社コア）: 「コア事業」の一般語としての一致（ambiguous）であり、株式会社コアへの言及ではないため関連付けしない。
- relatedCompanies: taya（株式会社田谷）: 沿革の地名「世田谷区」の部分一致（ambiguous）であり、株式会社田谷への言及ではないため関連付けしない。
- relatedCompanies: 特定投資株式のうち、銘柄ごとに仕入先・主要顧客の役割が個別に印字された銘柄のみを関連付けし、定型句のみの銘柄と金融機関は関連付けしなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] イムラの封筒・紙製品の製造販売事業 → 提案: 紙製品・包装資材（封筒・紙器・包装資材の製造販売）。売上高の大半を占めるパッケージソリューション事業（外部顧客への売上高15,099百万円）は、封筒を中心とする紙製品と包装資材の製造販売であり、閉じた分類に紙製品・紙加工品を表す区分が無い。印刷・紙製品に最も近いmediaを暫定とした。
