# 昭和鉄工 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 昭和鉄工株式会社 |
| 証券コード | 5953 |
| docID（データを取り出した文書） | `S100YE8F` |
| 原本 docID | `S100YE8F` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE8F.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 昭和鉄工株式会社 / 5953 / docID S100YE8F（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
showa-manufacturing: 10 件の数値を有報XBRLと照合
有報: 昭和鉄工株式会社 有価証券報告書－第104期(2025/04/01－2026/03/31) (docID S100YE8F)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
showa-manufacturing: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes: 連結経営指標等の注記は、潜在株式が存在しないこと、第100期は当期純損失のため株価収益率を記載していないこと、従業員数は就業人員であることの表示事項のみで、会計基準の変更や表示方法の変更などの事実は無いため、financialNotes は空にしました。
- businessModel: 新中期経営計画の連結数値目標（売上高・営業指標の目標値）は経営指標の目標であるため、本文や戦略には書いていません。
- businessModel: セグメント利益、受注高・受注残高、その他の中間的な利益指標の金額は書いていません（売上高と親会社株主に帰属する当期純利益のみ）。
- businessModel: suppliers はこのツリーの旧スキーマのため省略しました。個別に印字された仕入先はありません。
- businessModel: 主要な顧客である東テク株式会社への売上高の金額は、関連企業の説明を含め本文には書いていません。
- businessStructure: セグメント別売上高の単純合計は15,070百万円で、連結売上高15,071百万円と1百万円の差があります。また機器装置事業の内訳（6,993百万円と1,152百万円）の合計は8,145百万円で、同事業の売上高8,146百万円と1百万円の差があります。いずれも有報の百万円単位の印字どおりに記載しました。
- businessStructure: セグメント利益は書いていません。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略しました。
- businessStructure: 昭和トータルサービス株式会社は【関係会社の状況】で主要な事業の内容が機器装置事業とされているため、機器装置事業の説明に含めました。
- history: 沿革のうち、本社・工場の移転や閉鎖（1937年・1983年・1993年・2017年）、子会社の設立・吸収合併（1959年アサヒ不動産、1960年東京製作所、1988年東京製作所吸収合併、1999年北海道昭和鉄工、2009年北海道昭和鉄工吸収合併、2019年昭和ネオス吸収合併）、海外合弁会社の設立と持分譲渡（1995年大連氷山空調設備、2021年全持分譲渡）、持分法適用関連会社化と株式売却（2013年Korea Pionics、2024年全株式売却）、ISO9001認証取得（2003年）などは、会社の転機となる出来事に絞るため省きました。
- history: 2026年４月のサービスエンジニアリング事業部の発足は決算期末後の出来事ですが、有報の【沿革】に印字されており、重要な後発事象の注記は「該当事項はありません」でした。従来から報告セグメントである同事業の組織上の発足であり、2026年３月期の登録構造に変更はないため、沿革に含め、needsReview には入れませんでした。
- history: 資本金の金額は沿革に書いていません。
- industry: 主たる業界は、売上高15,071百万円の過半を占める機器装置事業（空調機器・熱源機器・環境機器・熱処理炉の製造販売）から machinery としました。素形材加工事業（鋳造製品・景観製品の製造販売）も machinery の領域に含めています。
- industry: サービスエンジニアリング事業（空調設備・給排水衛生設備の請負工事とメンテナンス、売上高4,525百万円）は construction に直接合うため2つ目に付けました。
- relatedCompanies: totech: 主要な顧客ごとの情報とMD&Aの相手先別販売実績に主要な顧客として印字されているため customer で結びました。リンクの根拠は顧客としての取引関係であり、特定投資株式の保有はその裏付けとして記述しました。
- relatedCompanies: azbil / seiko-electric / seibu-electric-and-machinery / fuji-p-s / nippon-tungsten / nanyo: 特定投資株式として保有していますが、保有目的はセグメント名を差し替えた定型文（「○○事業セグメントにおける安定的な取引関係の維持・強化を目的として保有しております」）のみで、主要な顧客や契約など個別の取引関係を述べる記載が無いため結びませんでした。nanyo は ambiguous でもあります。
- relatedCompanies: fukuoka-financial-group / mizuho-financial-group / nishi-nippon-financial-holdings / sumitomo-mitsui-trust-group / yamaguchi-financial-group / sumitomo-mitsui-financial-group / kyushu-leasing-service / the-bank-of-saga: 特定投資株式の保有目的が「金融取引等における安定的な取引関係の維持・強化を目的として保有しております」という金融機関共通の定型文のみのため結びませんでした。
- relatedCompanies: nishi-nippon-railroad: 特定投資株式の保有目的は地元企業との一般取引を通じた地域経済への貢献と地域情報の収集であり、個別の取引関係を述べる記載が無いため結びませんでした。
- relatedCompanies: en / zero / core: ambiguous で、一般語の部分一致のみのため結びませんでした。
- relatedCompanies: vision: 「ミッション・ビジョン・バリュー」の一般語への一致のため結びませんでした。
- relatedCompanies: base-4481: 「営業利益ベース」等の一般語への一致のため結びませんでした。
- relatedCompanies: career / king / rent / saibu-gas-holdings: 一般語・部分一致のみのため結びませんでした。saibu-gas-holdings は保有銘柄の西部電機とは別の法人です。
- relatedCompanies: 候補外のため結ばなかった相手: 日本乾溜工業株式会社（特定投資株式、素形材加工事業セグメントにおける取引関係の維持・強化が保有目的）、株式会社三菱UFJフィナンシャルグループ（特定投資株式、金融取引の定型文）、第一生命ホールディングス株式会社（特定投資株式、金融取引の定型文。株式数の増加は同社の株式分割によるもので、当社の分割ではありません）。
- terms: 助言のみ。本文で使った用語の候補: ファンコイルユニット、エアハンドリングユニット、業務用エコキュート、サーモデバイス、SK高欄、ダクタイル鋳鉄、ライフサイクル型事業、省エネリファインです。
- terms: wikipedia.json は当社の記事が証券コードで確認できましたが、抜粋は本社所在地と上場市場の基本情報のみで有報と重なるため、補足には使いませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
