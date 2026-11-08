# テイ・エス テック — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | テイ・エス　テック株式会社 |
| 証券コード | 7313 |
| docID（データを取り出した文書） | `S100YCXB` |
| 原本 docID | `S100YCXB` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCXB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | テイ・エス　テック株式会社 / 7313 / docID S100YCXB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ts-tech: 10 件の数値を有報XBRLと照合
有報: テイ・エス　テック株式会社 有価証券報告書－第80期(2025/04/01－2026/03/31) (docID S100YCXB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ts-tech: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…動、諸経費の抑制などに取り組むことで利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上収益と当期純利益のみとし、営業利益などの金額は書かなかった。
- businessModel: 修正再表示チェックは前期有報との重複年度が全項目一致し、決算期変更・変則決算もないため、financialNotes は空にした。経営指標等の5年間はすべてIFRSに基づく数値である。
- businessModel: 第16次中期経営計画の営業利益率の目標は、利益の数値・比率を本文に書かない規則により perspectives にも記載しなかった。
- businessStructure: 事業の並び順は、セグメント情報に印字された2026年3月期の外部顧客への売上収益の大きい順（米州260,815百万円、日本88,812百万円、中国53,541百万円、アジア・欧州39,146百万円）とした。4区分すべてが報告セグメントである。
- businessStructure: 2025年4月1日付で連結子会社のテイ・エス パーツ アンド サービス株式会社（存続会社）とサン化学工業株式会社（消滅会社）の吸収合併が行われているが、グループ内の再編のため事業の説明には含めなかった。
- history: 沿革は有報の記載どおり、実質上の存続会社（旧・東京シート株式会社）について記載した。有報によれば、当社（1948年8月19日設立、旧商号は株式会社藤家商店）は1971年12月1日に東京シート株式会社を吸収合併している。
- history: 沿革の表は年月と事象が続けて印字されており、崩れた表ではないため行順の対応づけは不要だった。1989年の資本金の増資の行は、規則により沿革に入れなかった。
- industry: 主たる業界は、売上収益の大半を占める四輪車用シート・内装品の事業から automotive とした。
- relatedCompanies: スズキ: 経営成績の分析に「マルチ・スズキ向け四輪車用シート等のメインサプライヤーであるKrishnaグループと合弁会社を設立」とあるが、スズキ株式会社自体との取引・提携の記載はなく、合弁の相手はKrishnaグループのため結ばなかった。
- relatedCompanies: いすゞ自動車: 特定投資株式の保有目的（当社製品の重要な販売先）に載るのみで、本文に個別の取引・契約の記載がないため結ばなかった。
- relatedCompanies: 川崎重工業: 特定投資株式の保有目的（当社製品の重要な販売先）に載るのみで、本文に個別の取引・契約の記載がないため結ばなかった。
- relatedCompanies: 三菱UFJフィナンシャル・グループ: 金融機関であり、保有目的は金融取引をはじめとする財務面の関係のため結ばなかった。
- relatedCompanies: 三井住友フィナンシャルグループ: 金融機関であり、保有目的は金融取引をはじめとする財務面の関係のため結ばなかった。
- relatedCompanies: T&Dホールディングス: 保険会社であり、みなし保有株式の記載のみのため結ばなかった。
- relatedCompanies: アルゴグラフィックス: 特定投資株式の保有目的（製品開発に係る業務の円滑な推進）のみに載り、個別の取引・契約の記載がないため結ばなかった。
- relatedCompanies: 倉敷紡績: 特定投資株式の保有目的（製品製造に係る業務の円滑な推進）のみに載り、個別の取引・契約の記載がないため結ばなかった。
- relatedCompanies: オイレス工業: 特定投資株式の保有目的のみに載り、個別の取引・契約の記載がないため結ばなかった。
- relatedCompanies: オーハシテクニカ: 特定投資株式の保有目的のみに載り、個別の取引・契約の記載がないため結ばなかった。
- relatedCompanies: パイオラックス: 特定投資株式の保有目的のみに載り、個別の取引・契約の記載がないため結ばなかった。
- relatedCompanies: ステップ: 収益認識の「5ステップアプローチ」という一般語への一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: キャリア: 「キャリア採用」という一般語への一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: エン: 「エンゲージメント」という一般語への一致（ambiguous）で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: ベース: 「営業利益ベース」という一般語への一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: ビジョン: 「2030年ビジョン」という一般語への一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: ゼロ: 環境目標の「ゼロ」という一般語への一致（ambiguous）で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: ランド: 子会社名「TS TECH Poland」や「LAGUNA TS LAND」への断片一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: コア: メキシコの地名「コアウイラ州」への断片一致（ambiguous）で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: セキ: 「セキュリティ」という一般語への断片一致（ambiguous）で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: 鈴木: 役員の氏名への一致（ambiguous）で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: コタ: 子会社名への断片一致（ambiguous）で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: パス: 子会社名への断片一致（ambiguous）で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: ポート: 「サポート」という一般語への断片一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: リコー: 「リコール」という一般語への断片一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: システムソフト: 「システムソフトウェア開発」という一般語への一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: トラスト: 大株主の「日本マスタートラスト信託銀行（信託口）」への断片一致で、listing も上場ではないため結ばなかった。
- relatedCompanies: ブラス: 子会社名「TS TRIM BRASIL」への断片一致で、相手企業への言及ではないため結ばなかった。
- relatedCompanies: レック: 「フレックスタイム制」という一般語への断片一致で、相手企業への言及ではないため結ばなかった。
- terms: 助言: 「キャビン」は用語集に未登録です。車室内空間全体を指す言葉で、この会社が2030年ビジョンや経営方針の中で、製品単体ではなく車室内全体で価値を提供する考え方を表す中心語として繰り返し使っているため、登録候補になります。
- terms: 助言: 「戦略OEM」は用語集に未登録です。受注の可能性が見込める自動車メーカーを指すこの会社の呼び方で、第16次中期経営計画の成長戦略に現れるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
