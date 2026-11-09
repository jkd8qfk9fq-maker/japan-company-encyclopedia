# マミーマートホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社マミーマートホールディングス |
| 証券コード | 9823 |
| docID（データを取り出した文書） | `S100XBFS` |
| 原本 docID | `S100XBFS` |
| 提出日（原本） | 2025-12-18 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBFS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社マミーマートホールディングス / 9823 / docID S100XBFS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mammy-mart-holding: 10 件の数値を有報XBRLと照合
有報: 株式会社マミーマートホールディングス 有価証券報告書－第60期(2024/10/01－2025/09/30) (docID S100XBFS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mammy-mart-holding: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社マミーマートホールディングス（旧会社名　株式会社マミーマート）」が EDINET の提出者名「株式会社マミーマートホールディングス」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年改正会計基準（法人税、住民税及び事業税等に関する会計基準）を当連結会計年度の期首から適用し、連結会社間の子会社株式売却損益の取扱い見直しは遡及適用されているが、前連結会計年度の連結財務諸表への影響はないと有報に記載されており、修正再表示チェックも重複年度の全行で一致し、売上高・当期純利益の範囲に変更はないため financialNotes には書いていない。
- businessModel: 2025年10月1日付の普通株式1株につき5株の株式分割は1株当たり数値のみのため financialNotes には書いていない。
- businessModel: 中期経営計画の2026年9月期の新規出店9店舗・業態転換を伴う改装2店舗の計画は将来の計画のため本文には書いていない。
- businessModel: Wikipedia の記事は確認したが、CGCグループへの加盟以外に有報にない補足として使う事実がなく、加盟の事実も有報で裏付けられないため使っていない。
- businessStructure: セグメント情報の「営業収益」には営業収入を含めており、連結の売上高191,390百万円とは範囲が異なります。事業の金額はセグメント情報の印字どおり「外部顧客への営業収益」を使いました。
- businessStructure: 製品別の売上高の内訳は、単一の製品・サービスの区分が連結損益計算書の営業収益の90％を超えるため有報で省略されており、children に金額は書いていません。
- history: 1950年の株式会社八百清魚店の設立は、1981年の吸収合併における形式上の存続会社の沿革のため、実質上の存続会社である旧岩崎商事の設立（1965年）から始めました。
- history: 2012年の生鮮加工センターの川越市への移転、2014年の川越物流センターへの移転、2022年の第二工場の新設と三郷物流センターの新設は設備レベルの行のため落としました。
- history: 設立時資本金は規則により記載していません。
- industry: その他の事業（温浴事業・葬祭事業）は売上高の1％未満の規模のため、業界は付けていません。
- relatedCompanies: the-musashino-bank — 特定投資株式の保有目的が「資金借入その他の金融取引において、円滑な取引関係の維持・強化のため」だけで、銀行ルールのため結ばない。
- relatedCompanies: the-towa-bank — 特定投資株式の保有目的が資金借入その他の金融取引のみで、銀行ルールのため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group — 特定投資株式の保有目的が資金借入その他の金融取引のみで、銀行ルールのため結ばない。
- relatedCompanies: resona-holdings — 特定投資株式の保有目的が資金借入その他の金融取引のみで、銀行ルールのため結ばない。
- relatedCompanies: en・port・base-4481・step・no-1・trust・career・core・cover・garden・king・land・sekichu — いずれも語の断片一致のみで、取引・提携の印字がないため結ばない。
- relatedCompanies: 大株主のライブ・コア（32.47％）、マミーマート共栄会、国分グループ本社、株式会社彩、従業員持株会などは非上場・非事業会社のため候補にならず結ばない。連結子会社の彩裕フーズ株式会社とマミーサービス株式会社も非上場のため結ばない。
- terms: 助言: 「生鮮市場ＴＯＰ！」は用語集の登録候補になります。同社の生鮮食品特化型の店舗業態です。
- terms: 助言: 「マミープラス」は用語集の登録候補になります。同社の小型の店舗業態です。
- terms: 助言: 「ディスティネーションアイテム」は用語集の登録候補になります。顧客の来店目的となる商品のことです。
- terms: 助言: 「ＬＳＰ」は用語集の登録候補になります。ローコストオペレーションのための人員配置の仕組み（Labor Scheduling Program）です。

## 要確認（status に反映）

- businessStructure: 表紙の注記によると、2025年12月19日開催予定の第60期定時株主総会で定款一部変更が承認可決されれば、英訳名が「Mami-mart Holdings Corporation」に変更される予定です。有報の提出日（2025年12月18日）時点では未承認のため、英訳名の確定には株主総会の結果の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
