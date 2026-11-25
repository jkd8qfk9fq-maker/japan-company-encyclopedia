# キャストリコ — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社キャストリコ |
| 証券コード | 6695 |
| docID（データを取り出した文書） | `S100YJNO` |
| 原本 docID | `S100YJNO` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJNO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社キャストリコ / 6695 / docID S100YJNO |
| edinet | completed | 1 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 5 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 5 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
castrico: 10 件の数値を有報XBRLと照合
有報: 株式会社キャストリコ 有価証券報告書－第32期(2025/11/01－2026/03/31) (docID S100YJNO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2026-03 の期は 5 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
castrico: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 当期はDX事業の事業整理に伴う棚卸資産評価損が計上され、当期純損失の主な要因となりましたが、損失の内訳に当たる事実のため本文には書かず、ここに判断を記録します。
- businessModel: ドラフト補正（親への報告事項）: 証拠パックのドラフトで上場先が空欄でした。表紙DEIに上場金融商品取引所名の要素自体がなく、同一有報の発行済株式の表に「東京証券取引所（TOKYO PRO Market）」と印字されているため、その印字どおりに補いました。
- businessModel: ドラフト補正（親への報告事項）: 証拠パックのドラフトで平均年間給与と平均勤続年数が空欄でした。同一有報の【従業員の状況】に平均年間給与5,385千円・平均勤続年数5.0年と印字されているため、その印字どおりに補いました。
- businessModel: プロダクツ事業の協業先であるコアマイクロシステムズ株式会社は、関連会社候補の「コア」（株式会社コア）とは別の会社であり、掲載対象の候補にないため関連会社としては結んでいません。
- businessStructure: 単一セグメント（エレクトロニクス事業）のため、事業部門（システム事業・エンジニアリング事業・プロダクツ事業・その他事業）を children とし、並び順は経営者による分析に印字された2026年3月期の販売実績（売上高）の大きい順としました。
- businessStructure: 上場先は東京証券取引所です。表紙のDEIに上場金融商品取引所名の要素がなく（TOKYO PRO Market上場のため）、発行済株式の表に「東京証券取引所（TOKYO PRO Market）」と印字されていることから、listings は market を持たない {"exchange": "tse"} とし、市場名は沿革と本文で扱いました。
- history: 沿革は有報の印字から主要な出来事を選んで年単位で記録しました（月は記録しません）。資本金の金額は本文に書かないため、設立時・増資時の資本金額は記載していません。2024年1月の株式分割は経営指標等の注記に基づく事項として businessModel の needsReview に記録しました。
- industry: 主業界は、提出者業種が「電気機器」であり、事業の中身も電子機器・部品の開発製造と設計サービスであるため electronics としました。第2業界として semiconductors を付けました。半導体検査装置向けの検出基板・搬送装置や、LSI・FPGAの設計開発が事業部門として開示されているためです。
- relatedCompanies: en: 「エンジニアリング」等の一般語の部分一致（ambiguous）のみで、エン株式会社についての記載はないため結びませんでした。
- relatedCompanies: quest: 経営理念の「リクエスト」の部分一致のみで、株式会社クエストについての記載はないため結びませんでした。
- relatedCompanies: seki: 一般語の部分一致（ambiguous）のみで、セキ株式会社についての記載はないため結びませんでした。
- relatedCompanies: career: 「キャリア開発」という一般語の一致のみで、株式会社キャリアについての記載はないため結びませんでした。
- relatedCompanies: core: 本文の「コアマイクロシステムズ株式会社」は株式会社コアとは別の会社（協業先）であり、株式会社コアについての記載はないため結びませんでした。
- relatedCompanies: innovation: 「イノベーションスキル」という一般語の一致のみで、株式会社イノベーションについての記載はないため結びませんでした。
- relatedCompanies: land: EMSの用語説明中の一般語の部分一致のみで、株式会社ランドについての記載はないため結びませんでした。
- relatedCompanies: lec: 一般語の部分一致のみで、レック株式会社についての記載はないため結びませんでした。
- relatedCompanies: base-4481: 「ベースに」という一般語の部分一致のみで、ベース株式会社についての記載はないため結びませんでした。
- relatedCompanies: ray: 「レイアウト」等の部分一致（ambiguous）のみで、株式会社レイについての記載はないため結びませんでした。
- relatedCompanies: vision: 「経営ビジョン」という一般語の一致のみで、株式会社ビジョンについての記載はないため結びませんでした。
- relatedCompanies: alpha / alpha-4760: 会計監査人であるアルファ監査法人の記載のみで、株式会社アルファについての記載はないため結びませんでした。
- relatedCompanies: corona: 新型コロナウイルス感染症の文脈のみで、株式会社コロナについての記載はないため結びませんでした。
- relatedCompanies: hirata: 買掛金の相手先別内訳に載るのみで、主要な仕入先としての事業上の記載がないため結びませんでした。
- relatedCompanies: inaba-denki-sangyo: 買掛金の相手先別内訳に載るのみで、主要な仕入先としての事業上の記載がないため結びませんでした。
- relatedCompanies: kohsoku: 一般語の部分一致（ambiguous）のみで、株式会社高速についての記載はないため結びませんでした。
- relatedCompanies: mec: 「メカトロニクス」の部分一致のみで、メック株式会社についての記載はないため結びませんでした。
- relatedCompanies: musashi: 売掛金の相手先であるムサシノ機器株式会社は株式会社ムサシとは別の会社であり、株式会社ムサシについての記載はないため結びませんでした。
- relatedCompanies: nissin: 候補の listing がコードリストに無く、新株予約権の文脈の部分一致のみのため結びませんでした。
- relatedCompanies: step: 環境マネジメント規格の「ステップ1」の文脈のみで、株式会社ステップについての記載はないため結びませんでした。
- relatedCompanies: zero: 「ゼロ円」という一般語の一致（ambiguous）のみで、株式会社ゼロについての記載はないため結びませんでした。
- terms: 用語の提案（助言のみ）：「メカトロニクス」（機械工学と電子工学を組み合わせた技術領域。同社のシステム事業の中核）、「LSI」（多数の素子を集積した大規模集積回路。同社のエンジニアリング事業の基軸技術）、「FPGA」（利用者がプログラムを書き換えできるデバイス）、「EMS」（電子機器の受託製造サービス。設計や資材調達まで担う場合が多い）、「ASIC」（特定用途向けに特化した集積回路）、「TOKYO PRO Market」（東京証券取引所のプロ投資家向け市場。同社の上場先）。

## 要確認（status に反映）

- businessModel: 決算期を10月31日から3月31日に変更しました。これに伴い、第32期（2026年3月期）は2025年11月1日から2026年3月31日までの5か月間の変則決算となっています。
- businessModel: 2023年12月15日開催の取締役会の決議に基づき、2024年1月11日付で普通株式1株につき10株の割合で株式分割を行いました。経営指標等のうち株式数に基づく指標は、第28期の期首に当該株式分割が行われたと仮定して算定されています。
- 財務: 変則決算。2026-03 の期は 5 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
