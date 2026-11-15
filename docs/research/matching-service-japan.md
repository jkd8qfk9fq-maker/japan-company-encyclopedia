# ＭＳ－Ｊａｐａｎ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＭＳ－Ｊａｐａｎ |
| 証券コード | 6539 |
| docID（データを取り出した文書） | `S100YEG1` |
| 原本 docID | `S100YEG1` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEG1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＭＳ－Ｊａｐａｎ / 6539 / docID S100YEG1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
matching-service-japan: 10 件の数値を有報XBRLと照合
有報: 株式会社ＭＳ－Ｊａｐａｎ 有価証券報告書－第36期(2025/04/01－2026/03/31) (docID S100YEG1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
matching-service-japan: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社MS－Japan」が EDINET の提出者名「株式会社ＭＳ－Ｊａｐａｎ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の表に注記は印字されておらず、会計基準の変更や変則決算もないため、financialNotes は空にしました。前期有報との修正再表示チェックでも全系列で差異はありませんでした。
- businessModel: 売上高構成の各金額は販売実績の千円印字を百万円未満切り捨てで記載しました。切り捨て後の合計は印字の合計と一致しない箇所がありますが、印字の合計をそのまま使っています。
- businessModel: 経営方針に印字された各種利益率や調整後当期純利益などの経営指標の目標・実績は、投資指標にあたるため本文や perspectives には書いていません。
- businessModel: 「Manegy Clip」のフィード広告の利用企業数が2026年４月時点で20社を超えた旨は提出後の時点の記述ですが、予定事項ではないため needsReview には入れず、本文にも書いていません。
- businessStructure: 当社グループは人材事業の単一セグメントであり、セグメント別の外部売上高は開示されていません。事業の並びは【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の販売実績に印字された売上高構成（人材紹介売上高4,294,835千円、海外人材売上高3,002,752千円、メディア売上高248,024千円、DRM売上高101,716千円）の大きい順とし、各事業の金額はその印字を百万円未満切り捨てで記載しました。切り捨てた4事業の合計は7,645百万円で、印字された売上高合計7,647百万円と2百万円異なりますが、印字の合計をそのまま使っています。
- businessStructure: このツリーの旧スキーマのため、suppliers キーは省略しました。有報に個別の仕入先名の印字はありません。
- businessStructure: 主要な設備の状況に印字された帳簿価額は書いていません。設備は単一セグメントのためセグメント情報と関連付けた記載が省略されており、拠点（東京本社・大阪支社・名古屋支社とFourQuarters Recruitment Pty.Ltd.の豪州拠点）を特定の事業には結びつけていません。
- businessStructure: 連結子会社のＭＳ・ＨＡＹＡＴＥ１号投資事業有限責任組合は投資事業であり、売上高構成に独立した金額の印字がないため、独立した事業としては登録していません。
- history: 沿革表の末尾2行は年月セル（2024年２月・2026年３月）と事象文（FourQuarters Recruitment Pty.Ltd.の株式取得・連結子会社化／「Manegy Clip」のリリース）が分かれて印字される崩れた表でした。年月と事象の数が同じ（各2件）ため行順に対応づけました。
- history: 1990年４月の設立行に印字された資本金の金額は書いていません。
- history: 落とした行： 1990年11月（大阪府羽曳野市への本社移転）、1999年５月（東京都千代田区への拠点設置）、2005年６月（大阪市淀川区への本社移転）、2006年３月（名古屋支社開設）、2011年12月（日本技術の海外ライセンス向けマッチングサービス開始）、2014年10月（横浜支社開設）、2015年１月（東京都千代田区への本社移転）、2022年11月（「Manegy（マネジー）」のフルリニューアル）です。本社移転・支社開設は事業構造の出来事ではなく、リニューアルはサービス開始の行で代表させました。
- industry: 主たる業界は「human-resources」を直接付けました。当社グループは人材事業の単一セグメントで、人材紹介・人材派遣が売上の大半を占めるため、閉じた分類に直接当てはまります。
- industry: メディア事業は管理部門・士業向けの情報提供と登録者獲得のための事業で、売上高構成でも248百万円と小さいため、「media」は付けていません。
- relatedCompanies: mental-health-technologies: 特定投資株式に掲載されていますが、保有目的の文面は同じ表のＧＶＡ　ＴＥＣＨ株式会社と同一の定型文であり、その相手個別の取引・提携の事実が印字されていないため結びませんでした。
- relatedCompanies: daiwa: 有報で印字されるのは大株主としての大和証券であり、候補の株式会社大和とは別の法人です。また証券会社の保有は取引関係の根拠にならないため結びませんでした。
- relatedCompanies: trust: 候補は現在のコードリストに掲載がなく、印字される日本マスタートラスト信託銀行（信託口）は信託銀行の信託口で候補の株式会社トラストとは別のため結びませんでした。
- relatedCompanies: base-4481 / lec / career / core / port / the-lead / vision / zero / seki / corona / imura-and-co / en / hub / land / rikei / stream: いずれも一般語・部分文字列の一致のみで、有報にその相手との取引・提携・資本関係の記述がないため結びませんでした。
- relatedCompanies: 連結子会社のFourQuarters Recruitment Pty.Ltd.とＭＳ・ＨＡＹＡＴＥ１号投資事業有限責任組合は、当社の子会社であるため関連企業には含めていません（関係会社の状況どおり）。
- terms: 用語の助言のみです。対象となりうる用語は「ダイレクトリクルーティング」「成功報酬型」「士業」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
