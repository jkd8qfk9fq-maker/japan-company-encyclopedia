# 中道リース — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 中道リース株式会社 |
| 証券コード | 8594 |
| docID（データを取り出した文書） | `S100XSCO` |
| 原本 docID | `S100XSCO` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSCO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 中道リース株式会社 / 8594 / docID S100XSCO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nakamichi-leasing: 10 件の数値を有報XBRLと照合
有報: 中道リース株式会社 有価証券報告書－第54期(2025/01/01－2025/12/31) (docID S100XSCO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nakamichi-leasing: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記は千円単位の印字を百万円単位へ切り捨てて転記しました（切り上げはしていません）。MD&A本文は売上高を51,234百万円と丸めて印字しますが、主要な経営指標等の印字は51,233,507千円のため、本文では切り捨てた51,233百万円を用いました。
- businessModel: 当社は連結財務諸表を作成しておらず、数値はすべて提出会社単体のものです。子会社2社（メッドネクスト株式会社、エムシーネット株式会社）は持分法を適用していない非連結子会社です。
- businessModel: businessModel の suppliers は空としました。有報の事業の系統図は物件のサプライヤーを一般的に述べるのみで、具体的な調達先の社名の印字がないためです。
- businessModel: 中期経営計画2026-2028の2028年度目標（経常利益、ＲＯＡ（営業資産経常利益率）、自己資本比率）は利益・投資指標のため strategy 本文に転記せず、定性的な戦略の骨子のみを転記しました。
- businessModel: セグメントの売上高は、セグメント情報の営業実績表に印字された外部顧客に対する売上高（千円）を用いました。セグメント利益は転記していません。
- businessStructure: 報告セグメントは「リース・割賦・営業貸付」「不動産賃貸」の2つで、「その他」は報告セグメント以外の事業セグメントです。子会社2社の事業は有報上この「その他」（ヘルスケアサポート事業等）に含まれます。
- businessStructure: 上場市場は札幌証券取引所のみです（表紙・DEIの印字）。連結財務諸表は作成していません。
- history: 設立時の資本金額は、資本金額の印字が金額チェックに抵触するため沿革本文には転記しませんでした。
- history: 沿革は実質上の存続会社である中道リース株式会社についての記載です（1980年合併の注記どおり）。
- industry: 総合リース会社であり、同じリース事業を営む芙蓉総合リースの登録に倣い、主たる業界は finance としました。閉集合にリース専用の値はなく、taxonomyGaps には記録しません。
- relatedCompanies: sapporo-clinical-laboratory（札幌臨床検査センター、9776）: 特定投資株式の保有目的に「リース契約先として、安定的かつ良好な関係を維持するため」と個別化された役割が印字され、当社は同社の株式17,000株を保有していますが、EDINETコードリストにないため（check-policy が [not-in-ledger] を返しました）結びませんでした。事実はここに記録します。
- relatedCompanies: mizuho-financial-group、north-pacific-bank、hokuhoku-financial-group、daishi-hokuetsu-financial-group、the-towa-bank、sumitomo-mitsui-financial-group、procrea-holdings、the-fukushima-bank: 特定投資株式の保有目的はいずれも「取引金融機関として（主要な取引金融機関として）」という資金調達面の関係であり、事業上の取引の役割の印字がないため結びませんでした。north-pacific-bank（株式会社北洋銀行）は当社の発行済株式の5.69％を保有する大株主でもありますが、同様に金融機関としての関係のため結びませんでした。株式会社北海道銀行（大株主4.02％）も金融機関であり、候補に含まれていません。
- relatedCompanies: daiwa-securities-group、loginet-japan: 保有目的は「現在の取引状況を考慮し、安定的かつ良好な関係を維持するため」という一般的文言で、銘柄ごとに個別化された取引の役割の印字がないため結びませんでした。
- relatedCompanies: 株式会社ニラク（798,000株）、株式会社フジタコーポレーション（7,500株）: 保有目的に「リース契約先として」と個別化された役割が印字されていますが、related-candidates に含まれないため結びませんでした。事実はここに記録します。
- relatedCompanies: isuzu-motors、komatsu: 財務諸表の注記（買掛金・債権の相手先別内訳）に社名があるのみで、関係の種類の印字がないため結びませんでした。
- relatedCompanies: ntt: 有報が印字する相手先は「NTT・TCリース株式会社」であり、候補のNTT株式会社とは別の法人のため結びませんでした。
- relatedCompanies: port、space、corona、freee、suzuki-6785、seki、taya、base-4481、veltra: 社名の部分一致のみ（スペースシステム契約、新型コロナウイルス感染症、リスクフリー・レート、執行役員の氏名、住所の地名、営業利益ベース、ベルトラックス等）で、有報がその相手について取引・提携・資本関係を述べていないため結びませんでした。
- relatedCompanies: メッドネクスト株式会社、エムシーネット株式会社は当社の子会社のため、関連企業としては結びません（businessStructure に記録）。
- terms: 助言: 用語「スペースシステム契約」は、当社の不動産賃貸事業の契約形態の総称です（事業の内容に印字）。転賃貸方式（PART・１）、自社所有方式（PART・２）、借地権方式（PART・３）、土地転賃貸方式（PART・４）の4種類があります。
- terms: 助言: 用語「営業資産」は、リース債権・リース投資資産、割賦債権、賃貸資産などの営業に用いる資産の残高を指します（MD&Aの営業資産残高表に印字）。
- terms: 助言: 用語「スペースシステム事業部」は不動産賃貸を担う事業部の名称、「ヘルスケアサポート事業部」は医療施設の運営関連事業等を担う事業部の名称です（MD&Aに印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
