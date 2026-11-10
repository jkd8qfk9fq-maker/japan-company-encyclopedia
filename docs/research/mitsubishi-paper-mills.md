# 三菱製紙 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三菱製紙株式会社 |
| 証券コード | 3864 |
| docID（データを取り出した文書） | `S100YJLB` |
| 原本 docID | `S100YJLB` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJLB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三菱製紙株式会社 / 3864 / docID S100YJLB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsubishi-paper-mills: 10 件の数値を有報XBRLと照合
有報: 三菱製紙株式会社 有価証券報告書－第161期(2025/04/01－2026/03/31) (docID S100YJLB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mitsubishi-paper-mills: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 耐熱プレスボード製品に係る品質不適切事案については needsReview に記録し、本文には書いていない。
- businessModel: 2025年11月28日に公表した当社システムへの不正アクセス事案は、有報が業務への影響は生じていないと明記しているため、本文には書かず warnings に記録する。
- businessModel: 重要な後発事象である業績連動型株式報酬制度の改定（2026年5月29日取締役会決議、2026年6月26日の定時株主総会に付議）は通常の報酬制度の改定であり、本文には書かず warnings に記録する。
- businessModel: 中期経営計画の経営数値目標（2028年3月期の売上高・利益などの目標値）は将来の目標であり、本文には金額を書いていない。
- businessModel: 変則決算・決算期の変更・会計基準の変更はない。financialNotes には報告セグメントの区分変更の事実のみを記録した。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順（機能商品事業78,446百万円、紙素材事業78,086百万円、エンジニアリング事業921百万円）。「その他」は外部顧客への売上高が「－」と印字され独立した金額が無いため最後に置き、金額が無い旨を明記した。
- businessStructure: エンジニアリング事業は2026年3月期から報告セグメントに変更された（変更の事実は businessModel の financialNotes に記録）。
- history: 沿革は有報【沿革】の記載から主要な出来事を選んだ。合併時の資本金などの金額は、本文の財務数値の規則により入れていない。
- history: 2026年4月1日の子会社の商号変更は決算日後の出来事だが、有報の【沿革】自体に記載され、提出日（2026年6月25日）時点で完了しているため沿革に入れた。
- history: Wikipedia は有報の沿革で足りるため使っていない。
- industry: 主たる業界は、売上のほぼ半分ずつを占める機能商品事業・紙素材事業のいずれも紙・パルプ製品であることから、閉じた分類で最も近い化学（chemicals）を暫定とした。
- relatedCompanies: oji-holdings: 【関係会社の状況】の区分（その他の関係会社）どおり結んだ。
- relatedCompanies: nissha: 特定投資株式に「主に紙素材事業の製品販売に関わる取引関係を維持・強化するため」保有（140,530株）とあるが、related-candidates.json の候補一覧に無いため結ばなかった。
- relatedCompanies: the-nanto-bank: 保有目的が主に金融取引関係の維持・強化であり、銀行は金融取引が理由なら結ばないため対象外。
- relatedCompanies: the-kiyo-bank: 保有目的が主に金融取引関係の維持・強化であり、銀行は金融取引が理由なら結ばないため対象外。
- relatedCompanies: the-bank-of-iwate: 特定投資株式の表で株式数が「－」表示で保有目的の印字が確認できず、銀行でもあるため対象外。
- relatedCompanies: mitsubishi-corporation: みなし保有株式であり、退職給付信託契約により議決権行使指図権限を有するもので、取引関係ではないため対象外。
- relatedCompanies: fujifilm-holdings: 特定投資株式の表で株式数が「－」表示で保有目的の印字が確認できないため対象外。
- relatedCompanies: nippon-yusen-kabushiki-kaisha: 特定投資株式の表で株式数が「－」表示で保有目的の印字が確認できないため対象外。
- relatedCompanies: toin: 特定投資株式の表で株式数が「－」表示で保有目的の印字が確認できず、候補一覧でもコードリストにないため対象外。
- relatedCompanies: 連結子会社（三菱王子紙販売、三菱ハイテクペーパーヨーロッパなど）と持分法適用関連会社（エム・ピー・エム・王子エコエネルギーなど）: いずれも非上場で候補一覧に無いため結ばなかった。
- relatedCompanies: en / step / core / career / zero / innovation / base-4481 / port / cota / slogan / tear / trust / freee / land / lec / s-t / vision / corona / king / seki / will: いずれも一般語句の部分一致（エンジニアリング、5ステップアプローチ、コアテクノロジーセンター、キャリア採用、災害ゼロ、イノベーション拠点、営業利益ベース、ポートフォリオ、インコタームズ、スローガン、マテリアリティ、マスタートラスト信託銀行、フリーアドレス、ブランド、リアルエステート、環境ビジョン、新型コロナウイルス、マスキング、セキュリティ、ウイルス）で、企業との関係の記載が無いため対象外。
- relatedCompanies: nippon-paper-industries: 日本製紙連合会の労働災害度数率の文脈でのみ現れ、企業との関係の記載が無いため対象外。
- relatedCompanies: ricoh: シリコーンレス、バリコートの部分一致であり、企業名としての記載が無いため対象外。
- terms: 用語の助言はありません。

## 要確認（status に反映）

- businessModel: 耐熱プレスボード製品に係る品質不適切事案が判明した旨が有報（経営者による分析）に記載されています。再発防止に向けた品質管理・コンプライアンスの浸透に取り組んでいることは書かれていますが、事案の時期や金額などの詳細は印字されておらず、本文には含めていません。公開前に人の確認を要します。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 三菱製紙の主たる業界 → 提案: pulp-and-paper。閉じた分類に紙・パルプの区分が無いため、素材産業として最も近い化学を暫定で選んだ。事業は情報・特殊紙、機能性材料、印刷用紙、パルプなど紙・パルプ製品で構成される。
