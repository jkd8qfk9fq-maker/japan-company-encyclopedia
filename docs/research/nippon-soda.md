# 日本曹達 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本曹達株式会社 |
| 証券コード | 4041 |
| docID（データを取り出した文書） | `S100YJKO` |
| 原本 docID | `S100YJKO` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJKO.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E6%9B%B9%E9%81%94

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本曹達株式会社 / 4041 / docID S100YJKO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-soda: 10 件の数値を有報XBRLと照合
有報: 日本曹達株式会社 有価証券報告書－第157期(2025/04/01－2026/03/31) (docID S100YJKO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-soda: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 通称「日曹」はWikipediaの補足によります。
- businessModel: 2030年3月期の数値目標のうち、親会社株主に帰属する当期純利益200億円以上だけを記載し、比率の目標は投資の語に当たるため書きませんでした。
- businessStructure: 5つの事業は、2026年3月期の外部顧客への売上高の大きい順に並べました（アグリビジネス、トレーディング＆ロジスティクス、ケミカルマテリアル、エコソリューション、エンジニアリング）。
- businessStructure: 青化ソーダと水処理剤「日曹ハイクロン」は、2026年3月期をもって販売を終了した旨を有報に記載があるため、その旨を記載しました。
- history: 沿革は有報の【沿革】の記載から、会社や事業の節目になる出来事を選びました。研究所の開設や小規模な出資・譲渡など一部の出来事は省きました。
- industry: 主たる業界は化学（chemicals）としました。売上高が最も大きい報告セグメントはアグリビジネスですが、農薬も化学品であり、化学品の製造・販売が事業の中心のためです。
- relatedCompanies: 結ばなかった候補（en）：「エン」は「エンジニアリング」の語で、エン株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（vision）：「ビジョン」は「長期経営ビジョン」の語で、株式会社ビジョンとの関係ではありません。
- relatedCompanies: 結ばなかった候補（career）：「キャリア」は人材に関する記述の語で、株式会社キャリアとの関係ではありません。
- relatedCompanies: 結ばなかった候補（base-4481）：「ベース」は「営業利益ベース」の語で、株式会社ベースとの関係ではありません。
- relatedCompanies: 結ばなかった候補（innovation）：「イノベーション」は「リサーチ＆イノベーションセンター」の語で、イノベーション株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（port）：「ポート」は「ITパスポート」の語で、ポート株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（freee）：「フリー」は「フリーアドレス化」の語で、フリー株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（path）：「パス」は「ITパスポート」の語で、株式会社パスとの関係ではありません。
- relatedCompanies: 結ばなかった候補（ray）：「レイ」は製品名「ビストレイター」の語で、レイ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（space）：「スペース」は「オフィススペース」の語で、スペース株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（alpha-4760／alpha）：「アルファ」は除草剤「アルファード」の語で、アルファ社との関係ではありません。
- relatedCompanies: 結ばなかった候補（belc）：「ベルク」は殺菌剤「ベルクート」の語で、ベルク株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（daisui）：「大水」はリスク記述の語で、大水株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（ishin）：「イシン」は殺菌剤「アグリマイシン」の語で、イシン株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（nix）：「ニックス」は殺ダニ剤「フェニックス」の語で、ニックス株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（core）：「コア」は「コア技術」の語で、コア株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（seki）：「セキ」は「情報セキュリティ」の語で、セキ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（king）：「キング」はワーキンググループの記述の語で、キング株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（idea-consultants）：「いであ」は資金の源泉に関する記述の語で、いであ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（systems-engineering-consultants）：「セック」は「ミドルセックス郡」の語で、セック株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（tokyo-ohka-kogyo／nissan-chemical-corporatiom／tosoh／kumiai-chemical-industry／kureha／osaka-soda／hodogaya-chemical／nihon-nohyaku／soda-nikka／tohoku-chemical／hokko-chemical-industry／kaneko-seeds／mitani-sangyo／fushiki-kairiku-unso）：保有株式の表に載るだけで、保有目的は「製品の販売等の取引関係の強化」など全銘柄共通の定型句のため、取引関係の根拠として結びませんでした。
- relatedCompanies: 結ばなかった候補（mizuho-financial-group）：保有目的は融資取引等の取引関係の強化で、銀行との資金調達が理由のため結びませんでした。
- relatedCompanies: 結ばなかった候補（hachijuni-nagano-bank）：当事業年度に保有株式を売却しており、銀行との資金調達が理由のため結びませんでした。
- relatedCompanies: 結ばなかった候補（tokio-marine-holdings）：当事業年度に保有株式を売却しており、保険会社との取引が理由のため結びませんでした。
- relatedCompanies: 結ばなかった候補（shikoku-kasei-holdings／sumitomo-mitsui-trust-group）：2026年3月期に保有目的を純投資目的に変更しており、取引関係の根拠がありません。
- relatedCompanies: 結ばなかった候補（tanaka-chemical）：当事業年度に保有株式を売却しており、コードリストにないため結びませんでした。
- relatedCompanies: 連結子会社29社及び関連会社7社は上場していないため、関連企業として結びませんでした。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
