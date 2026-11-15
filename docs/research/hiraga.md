# 平賀 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社平賀 |
| 証券コード | 7863 |
| docID（データを取り出した文書） | `S100YLE6` |
| 原本 docID | `S100YLE6` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLE6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社平賀 / 7863 / docID S100YLE6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hiraga: 10 件の数値を有報XBRLと照合
有報: 株式会社平賀 有価証券報告書－第71期(2025/04/01－2026/03/31) (docID S100YLE6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
hiraga: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営上の目標（売上高、1株当たり当期純利益、自己資本利益率の実績と目標）は投資指標を含むため本文・戦略には書かず、存在のみを記録します。中期経営計画SPX2027の数値目標は有報の記載どおり公表取り下げの事実だけを strategy.disclosed に書きました。
- businessModel: 指標表の注記（潜在株式がないこと、関連会社がないこと、臨時雇用者数と従業員数の定義、株価の市場区分）は表示・定義の事項であるため financialNotes には入れていません。
- businessModel: 受注実績と生産実績の金額は書いていません。主要原材料である用紙の価格推移も本文には書いていません。
- businessStructure: 単一セグメント（販売促進関連事業）のため、事業は1つとし、【事業の内容】が挙げる4つのサービス領域を金額のない children として分けました。サービス領域ごとの金額は開示されていません。
- businessStructure: 設備投資の計画（デジタルサービスの拡充、社内システムの更新、工場機器の導入、設備の修繕）は通常の設備計画であり、構造の変更ではないため warnings にとどめました。
- businessStructure: 保育園の賃貸（2022年開始）や第二ビルの賃貸設備は、報告セグメントに含まれない付随的なもので金額が独立して開示されていないため、事業としては立てていません。
- history: 沿革のうち、本社・支店の移転や開設・閉鎖（1969年高崎支店、1976年・1991年・2018年の本社移転、1987年仙台支店開設、2007年大阪支店開設、2023年仙台支店閉鎖）、埼玉第二工場の開設・閉鎖（1997年・2000年）、監査等委員会設置会社への移行（2024年）は落とし、事業と市場の節目を中心に残しました。
- history: 1956年の設立時の資本金は金額であるため本文に書いていません。
- industry: 主たる業界は、販促支援サービスと総合印刷が事業の中心であり、閉じた分類に印刷・販促サービスの区分がないため、広告・情報発信に最も近い media を暫定で当てました（DNP・TOPPAN等の印刷会社の慣例に沿う扱いです）。単一セグメントのため副次分類は付けていません。
- relatedCompanies: スノーボールキャピタル（その他の関係会社・筆頭株主）: 【関係会社の状況】に、その他の関係会社として、議決権の被所有割合38.82％、当社の筆頭株主であり社外取締役1名の派遣を受けていることが記載されていますが、有価証券の運用及び売買を行う非上場の会社で候補（related-candidates）に無いため結べませんでした。
- relatedCompanies: dainichiseika-color-and-chemicals-mfg（大日精化工業、4116）: 大株主の状況に2.78％の保有が載り、買掛金・電子記録債務の相手先別内訳にも金額のみで現れますが、同社についての保有目的や取引関係の文章の記載がないため結びませんでした。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ、8316）: 特定投資株式の保有目的が、主要取引金融機関である三井住友銀行との資金調達等の円滑化であり、金融機関との資金調達関係のため結びませんでした。
- relatedCompanies: screen-holdings（7735）、yellow-hat（イエローハット、9882）、k-s-holdings（ケーズホールディングス、8282）: 主な資産の内容の投資有価証券の明細に金額のみで現れ、保有目的や取引関係の記載がないため結びませんでした。
- relatedCompanies: sundrug（サンドラッグ、9989）、yamato（ヤマト、1967）: 売掛金・未払金の相手先別内訳に金額のみで現れる相手で、関係性の文章の記載がないため結びませんでした。
- relatedCompanies: aeon-delight（イオンディライト、9787）: 電子記録債権の相手先別内訳に金額のみで現れ、コードリストにない相手のため結びませんでした。
- relatedCompanies: DICグラフィックス株式会社: 大株主の状況に3.48％の保有が載りますが、候補に無い会社（DICの子会社）のため結びませんでした。
- relatedCompanies: en（4849）、base-4481（4481）、career（6198）、port（7047）、vision（9416）、seki（7857）、max（6454）: 一般語・部分一致のみで、各社についての記載はありません。
- terms: 助言のみ。本文で使った用語の候補: SPX、SPX2027、Vision2030、販促管理システム、折込広告 です。
- terms: wikipedia.json はありませんでした（found: false）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 平賀の主たる業界（販売促進サービス・総合印刷） → 提案: 印刷・販売促進サービス。主事業は、小売流通業向けの販売促進プロモーション、販促管理システムの企画・管理、WEB及びSNSのデジタル・マーケティング、総合印刷であり、2026年3月期の売上高は9,967百万円（単一セグメント）です。閉じた分類の19種に印刷・販促サービスを表す区分がなく、広告・情報発信に最も近い media を暫定としました。
