# 能美防災 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 能美防災株式会社 |
| 証券コード | 6744 |
| docID（データを取り出した文書） | `S100YHTN` |
| 原本 docID | `S100YHTN` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHTN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 能美防災株式会社 / 6744 / docID S100YHTN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nohmi-bosai: 10 件の数値を有報XBRLと照合
有報: 能美防災株式会社 有価証券報告書－第82期(2025/04/01－2026/03/31) (docID S100YHTN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nohmi-bosai: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは全行一致し、決算期変更・変則決算・会計基準の変更はないため financialNotes は空にしました。
- businessModel: 中長期ビジョンの数値目標のうち本文に書けるのは売上高だけのため、営業利益率やROEの目標は記載していません。
- businessModel: 重要な後発事象の開示はなく、提出後の書類も確認されなかったため、needsReview は空です。
- businessStructure: 報告セグメントは火災報知設備・消火設備・保守点検等の3つで、外部顧客への売上高の大きい順に並べました。「その他」は有報が報告セグメントに含まれないと明記する区分のため、売上高にかかわらず最後尾に置きました。
- businessStructure: 各事業の内訳（children）はセグメント概要に例示される製品から取り、金額の独立した開示がない旨を明記しました。
- history: 沿革は有報の【沿革】の印字どおりに年月と事象を対応づけました。1995年の中国合弁会社の社名は印字の表記が判読しにくいため、社名を引用せず事実だけを書きました。
- history: 2026年の明星電気の子会社化は【沿革】ではなく【重要な契約等】と企業結合の注記に基づく出来事です（2025年8月6日にIHIと株式譲渡契約を締結、2026年2月2日に株式取得、議決権比率100％）。
- history: 北興通信株式会社の株式取得（2025年7月1日、子会社化）は従業員数の注記にのみ現れるため、沿革には入れていません。
- industry: 業界は報告セグメントの構成から、取付工事と保守点検が大きな柱である construction を主たる業界としました。機器の製造も行いますが、工事・保守を含む建設が最も近いと判断しました。
- relatedCompanies: IHI： 明星電気の全株式の譲渡相手で、2025年8月6日に株式譲渡契約を締結した相手ですが、1回限りの株式譲渡であり、継続的な取引・提携の印字がないため結びませんでした。
- relatedCompanies: ダイダン・住友不動産・東海旅客鉄道・富士電機・帝国ホテル・日本空港ビルデング・鹿島建設・京阪神ビルディング・京浜急行電鉄・京成電鉄・丸山製作所・松屋・ミライト・ワン・三菱地所・新コスモス電機・日本電設工業・西日本鉄道・大林組・西武ホールディングス・清水建設・大成建設・東京會舘・TOPPANホールディングスなど特定投資株式の各社： 保有目的が「当社防災事業における製品・サービスの販売先との関係の維持・強化」という全銘柄共通の定型句のみで、その相手についての取引・提携の具体的な印字がないため結びませんでした。
- relatedCompanies: 三菱UFJフィナンシャル・グループ・三井住友フィナンシャルグループ・第一ライフグループ・T&Dホールディングス・七十七銀行・東邦銀行： 金融・保険取引が理由の保有のため結びませんでした。
- relatedCompanies: 中電工・歌舞伎座・相鉄ホールディングス・タカラスタンダード： 当事業年度に売却済みのため結びませんでした。
- relatedCompanies: 住友電設： コードリストにない相手のため結びませんでした（保有目的も定型句のみ）。
- relatedCompanies: キャリア・エン・コア・ビジョン・キング・ゼロ・イシン・ポート・セキ・ベース・スペース・トラスト： 一般語・部分一致の誤マッチのため結びませんでした。
- terms: 用語候補： 防排煙設備（火災時に煙の広がりを抑える設備）、環境監視システム、駐車場車路管制システム——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 主たる業界（防災設備の製造・施工・保守） → 提案: fire-protection（防災設備）。火災報知設備・消火設備の製造販売、取付工事、保守点検が事業の中心で、連結売上高のほぼ全てを防災関連が占めますが、閉じた分類に防災設備の区分がありません。取付工事・保守が大きな柱のため、最も近い construction を暫定の主たる業界としました。
