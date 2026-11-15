# SBIインシュアランスグループ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＳＢＩインシュアランスグループ株式会社 |
| 証券コード | 7326 |
| docID（データを取り出した文書） | `S100YDWS` |
| 原本 docID | `S100YDWS` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDWS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＳＢＩインシュアランスグループ株式会社 / 7326 / docID S100YDWS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sbi-insurance-group: 10 件の数値を有報XBRLと照合
有報: ＳＢＩインシュアランスグループ株式会社 有価証券報告書－第10期(2025/04/01－2026/03/31) (docID S100YDWS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sbi-insurance-group: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「SBIインシュアランスグループ株式会社」が EDINET の提出者名「ＳＢＩインシュアランスグループ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは全行一致（差異なし）のため、financialNotes は空にしました。決算期変更・変則決算・会計基準変更の記載もありません。
- businessModel: 中期経営計画の数値目標のうち本文に書けるのは経常収益（売上に相当）の目標のみとし、経常利益・当期純利益の目標額は本文数値ルールのため perspectives にも書いていません。
- businessStructure: 事業の並びは2026年3月期のセグメント情報における外部顧客への経常収益の大きい順です（生命保険57,694百万円、損害保険46,692百万円、少額短期保険35,975百万円）。保険会社であるため、売上高に代えて経常収益で並べています。
- businessStructure: 各事業の内訳区分（商品・会社別の区分）は【事業の内容】の印字に基づきますが、金額は区分ごとに独立開示されていないため、各 children にその旨を明記しました。
- history: 沿革は【沿革】の印字どおり年月順に採りました。年は有報の印字（2016年12月設立など）から西暦年に変換しています。
- industry: 主たる業界は、経常収益の全額を保険事業（損害保険・生命保険・少額短期保険）が占めることから、閉じた分類で最も近い finance（金融）としました。保険専用の区分は閉じた分類に無いため、従来の金融機関の登録と同様に finance で表現しています。
- relatedCompanies: 日本証券金融（8511）：【大株主の状況】に1.43％の保有が載りますが、金融機関の投資保有であり、当社との取引・提携の印字が無いため結びませんでした。
- relatedCompanies: リズム（7769）：「リズム」は子会社名「ＳＢＩプリズム少額短期保険」の「プリズム」の部分一致で、リズム株式会社との関係の印字はありません。
- relatedCompanies: キャリア（6198）：「キャリア」は人材の経歴を指す一般語としての出現で、株式会社キャリアとの関係の印字はありません。
- relatedCompanies: イノベーション（3970）：「イノベーション」はFinTech等の説明文中の一般語で、株式会社イノベーションとの関係の印字はありません。
- relatedCompanies: 大和（8247）：ambiguous の候補で、出現は役員の個人名「大和田」などへの部分一致であり、株式会社大和との関係の印字はありません。
- relatedCompanies: ベース（4481）・ポート（7047）・セキ（7857）・エン（4849）・キング（8118）・ランド（8918）・ビジョン（9416）：いずれも一般語・部分一致の誤マッチで、各社との取引・提携・資本関係の印字はありません。
- relatedCompanies: 日新（9066）：ambiguous で候補リスト上も上場区分が確認できず、当社との関係の印字も無いため結びませんでした。
- relatedCompanies: 連結子会社９社（ＳＢＩ損害保険、ＳＢＩ生命保険、ＳＢＩ少短保険ホールディングスほか少額短期保険業者６社）はいずれも非上場で候補に含まれないため、relatedCompanies には結んでいません。
- terms: 用語候補： 少額短期保険（保険金額が少額で保険期間が短期の保険）、団体信用生命保険（住宅ローンの利用者を被保険者とする団体保険）、経常収益（保険会社における売上高に代わる収益の表示）、元受正味保険料（解約返戻金等を控除した元受保険料）、コンバインド・レシオ（損害保険会社の収益性を表す指標）、保有契約件数（保険会社が保有する契約の件数）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
