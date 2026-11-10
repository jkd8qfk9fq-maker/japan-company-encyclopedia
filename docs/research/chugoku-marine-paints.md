# 中国塗料 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 中国塗料株式会社 |
| 証券コード | 4617 |
| docID（データを取り出した文書） | `S100YGSJ` |
| 原本 docID | `S100YGSJ` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGSJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 中国塗料株式会社 / 4617 / docID S100YGSJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chugoku-marine-paints: 10 件の数値を有報XBRLと照合
有報: 中国塗料株式会社 有価証券報告書－第129期(2025/04/01－2026/03/31) (docID S100YGSJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
chugoku-marine-paints: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは全行一致し、決算期変更・変則決算・会計基準の変更もないため financialNotes は空にしました。
- businessModel: 中期経営計画の数値目標のうち本文に書けるのは売上高だけのため、営業利益・当期純利益・ROEの目標は記載していません。
- businessModel: 株式会社シーエムピー企画は2026年3月31日付で解散し、現在清算手続き中である旨が関係会社の状況の注記に記載されています。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です（日本、欧州・米国、中国、東南アジア、韓国）。
- businessStructure: 各事業の内訳（children）には金額の独立した開示がないため、金額は書いていません。
- businessStructure: 報告セグメントは地域別です。製品分野別の外部顧客への売上高（船舶用塗料122,386百万円、工業用塗料15,057百万円、コンテナ用塗料1,659百万円、その他260百万円）はグループ全体の数値として関連情報に記載されています。
- industry: 主たる業界は塗料の製造・販売が事業の全体を占めるため、閉じた分類の chemicals としました。報告セグメントは地域別で、製品分野別では船舶用塗料が売上高の約88％を占めます。
- relatedCompanies: SP SAMHWA Co.,Ltd.：2025年11月28日に資本業務提携を締結し、1988年に韓国に連結子会社CHUGOKU SAMHWA PAINTS,Ltd.を共同で設立した事業連携の相手ですが、韓国の会社でEDINETのコードリストにないため結びませんでした。
- relatedCompanies: HAIPHONG PAINT JOINT STOCK COMPANY：ベトナムでの事業連携における協力関係強化を目的に業務提携契約を締結している旨が印字されていますが、ベトナムの会社でEDINETのコードリストにないため結びませんでした。
- relatedCompanies: ウッドワン：特定投資株式の保有目的は「事業上の取引関係強化を目的としております。」という定型句のみで、相手固有の取引内容の印字がないため結びませんでした。
- relatedCompanies: ひろぎんホールディングス・三菱ＵＦＪフィナンシャル・グループ・みずほフィナンシャルグループ：特定投資株式の表に載る金融機関で、保有目的は財務活動の円滑化と金融・経済及び企業情報収集です。銀行との関係は資金調達・金融取引が理由のため結びませんでした。
- relatedCompanies: 三菱商事ケミカル：関連当事者情報の債務保証に名前がありますが、三菱商事株式会社そのものではなくその子会社で、候補の「三菱商事」は社名の部分一致のため結びませんでした。
- relatedCompanies: 今治造船・正栄汽船：大株主の状況に載る大株主（それぞれ4.69％、3.67％）ですが、関連候補のリストに含まれず、取引・提携の印字もないため結びませんでした。
- relatedCompanies: 住友重機械工業・乾汽船：当事業年度に保有意義が希薄と判断して全株式を売却済みのため結びませんでした。
- relatedCompanies: 連結子会社24社はいずれも非上場で候補に含まれていないため、relatedCompanies には結んでいません。
- relatedCompanies: エン・ビジョン・セキ・キャリア・ベース・イノベーション・TOA・ゼロ・コア・ポート・ランド・フジ・ホープ・パス・ステップ・トラスト・コロナ・カバー・ジェノバ・リコー：いずれも一般語・部分一致の誤マッチ（エンジニアリング、経営ビジョン、セキュリティ、キャリア形成、連結ベース、イノベーション、TOA-CHUGOKU、環境事故ゼロ、フジツボ、キャリアパス、ステップ、信託銀行、新型コロナウイルス、ヘッドライトカバー、ジェノバ、リコール）で、各社との取引・提携・資本関係の印字はありません。
- terms: 用語候補： 船底防汚塗料（船舶の船底への海洋生物の付着を防ぐ塗料）、重防食塗料（鉄鋼構造物などを腐食から守る厚膜の塗料）、低VOC塗料（揮発性有機化合物の排出を抑えた塗料）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

- businessModel: 2026年7月1日を効力発生日として、当社を吸収合併存続会社、文正商事株式会社を吸収合併消滅会社とする吸収合併を行う予定である旨が、関係会社の状況の注記に記載されています。提出時点では未実施のため予定として扱います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
