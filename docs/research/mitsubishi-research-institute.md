# 三菱総合研究所 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社三菱総合研究所 |
| 証券コード | 3636 |
| docID（データを取り出した文書） | `S100X9BV` |
| 原本 docID | `S100X9BV` |
| 提出日（原本） | 2025-12-10 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X9BV.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E4%B8%89%E8%8F%8F%E7%B7%8F%E5%90%88%E7%A0%94%E7%A9%B6%E6%89%80

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社三菱総合研究所 / 3636 / docID S100X9BV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsubishi-research-institute: 10 件の数値を有報XBRLと照合
有報: 株式会社三菱総合研究所 有価証券報告書－第56期(2024/10/01－2025/09/30) (docID S100X9BV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsubishi-research-institute: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な顧客である三菱UFJニコス株式会社は、売上高の12.7％を占める相手先ですが、related-candidates.json にないため関連企業には結ばず、industryPosition.analysis に役割を記録した。
- businessModel: 中期経営計画2026の数値目標（売上高、経常利益、ROEの目標水準）は投資指標のため本文には記載していない。
- businessModel: 「法人税、住民税及び事業税等に関する会計基準」等の適用に関する注記は financialNotes に記録した。前期有報との修正再表示チェックは全8行一致し、遡及適用による前期の財務諸表への影響はない旨の注記を確認した。
- businessStructure: 報告セグメントは外部顧客への売上高の大きい順（ITサービス74,367百万円、シンクタンク・コンサルティングサービス47,090百万円）に並べた。ITサービスの子区分は【セグメント情報等】に製品別内訳の開示がないため、【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の販売実績の区分（システム開発44,989百万円、アウトソーシングサービス29,377百万円）を用いた。子区分の合計74,366百万円とセグメントの外部売上高74,367百万円との1百万円の差、及び2セグメントの合計121,457百万円と連結売上高121,458百万円との1百万円の差は、有報の百万円単位への丸めによるもので、印字の合計をそのまま記載した。
- businessStructure: 当社グループは当社、連結子会社9社及び関連会社5社（持分法適用会社3社、持分法非適用会社2社）の計15社で構成される（【事業の内容】）。
- businessStructure: 本社（東京都千代田区）はシンクタンク・コンサルティングサービス、三菱総研DCS株式会社の本社及び千葉情報センターはITサービスに属する（【主要な設備の状況】）。拠点と事業の対応は有報のセグメント欄どおりとした。
- history: 沿革の後半の表（2018年以降）は年月と事象文が分かれて印字されており、年月9件に対し事象の段落は7件だった。段落内の2つの出来事（アイネスの業務・資本提携と持分法適用関連会社化、ハノイ拠点開設とドバイ拠点開設）を分けて行順で対応づけ、東京証券取引所の市場区分の見直し（2022年4月）と「2023年度において分社化」とするMPXの記述（【経営方針、経営環境及び対処すべき課題等】）で裏付けて対応づけた（計8件）。2022年7月の年月は事象文と対応づけできなかったため使用していない。
- history: 1970年5月の設立の行にある資本金5億円は、財務金額のため沿革の本文には記載しなかった。
- history: wikipedia.json の冒頭は本社所在地とシンクタンク・システム開発会社という位置づけのみで、いずれも有報で確認できる内容のため、沿革の補足には使用しなかった。
- industry: 主たる業界は、2025年9月期の外部顧客への売上高でITサービスが74,367百万円と全体の約6割を占めることから it とした。シンクタンク・コンサルティングサービスは調査研究・コンサルティングの事業で、閉じた分類に合う値がないため、taxonomyGaps に記録した。
- industry: 半導体そのものを事業として独立開示しておらず金額もないため、2つ目の業界として semiconductors は付けていない。
- relatedCompanies: 株式会社キャリア：「キャリア」は連結子会社の旧称「エム・アール・アイ・キャリアスタッフ」の一部に一致するのみで、株式会社キャリアとの取引・提携の印字はないため結ばない。
- relatedCompanies: エン株式会社：「エン」は一般語・部分一致（ambiguous）のため結ばない。
- relatedCompanies: セキ株式会社：「セキ」は一般語・部分一致（ambiguous）のため結ばない。
- relatedCompanies: ポート株式会社：「ポート」は「ポートフォリオ」など一般語の部分一致のため結ばない。
- relatedCompanies: ベース株式会社：「ベース」は一般語の部分一致のため結ばない。
- relatedCompanies: 株式会社コア：「コア」は一般語・部分一致（ambiguous）のため結ばない。
- relatedCompanies: 株式会社イノベーション：「イノベーション」は一般語のため結ばない。
- relatedCompanies: イシン株式会社：「イシン」は一般語・部分一致のため結ばない。
- relatedCompanies: 株式会社ゼロ：「ゼロ」は「ゼロエミッション」など一般語の部分一致（ambiguous）のため結ばない。
- relatedCompanies: パス株式会社：「パス」は「キャリアパス」など一般語の部分一致（ambiguous）のため結ばない。
- relatedCompanies: 株式会社トラスト：「トラスト」は日本マスタートラスト信託銀行の信託口の名称の一部に一致するのみで、株式会社トラストとの取引・提携の印字はなく、コードリストにもないため結ばない。
- relatedCompanies: 株式会社ビジョン：「ビジョン」は一般語のため結ばない。
- relatedCompanies: 株式会社レント：「レント」は「リカレント」など一般語の部分一致のため結ばない。
- relatedCompanies: 株式会社コロナ：「コロナ」は新型コロナウイルスなど一般語の部分一致のため結ばない。
- relatedCompanies: 富士ソフト株式会社：コードリストになく、ダイヤモンド富士ソフトは2010年に会社分割で当社の連結子会社となった過去の会社で、現在の取引・提携の印字がないため結ばない。
- relatedCompanies: 株式会社ランド：「ランド」は一般語の部分一致のため結ばない。
- relatedCompanies: 株式会社南陽：「南陽」は山形県南陽市の地名に一致するのみ（ambiguous）のため結ばない。
- relatedCompanies: Institution for a Global Society株式会社は、特定投資株式の保有目的に人材分野の取引・協業関係の記載があるが、related-candidates.json にない（非上場）ため結ばない。
- relatedCompanies: PCIホールディングス株式会社は、特定投資株式を全株式売却済みで、過去の保有のみのため結ばない。
- relatedCompanies: 三菱UFJニコス株式会社は、2025年9月期の売上高の12.7％を占める主要な顧客だが、related-candidates.json にないため結ばず、businessModel フラグメントの industryPosition.analysis に役割を記録した。
- relatedCompanies: 三菱ケミカル株式会社とAGC株式会社は、大株主の状況に載る事業会社だが、related-candidates.json にないため結ばない。
- relatedCompanies: 株式会社三菱UFJ銀行は、大株主の状況に載る金融機関で、資金調達・純投資の文脈のため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社（信託口）と株式会社日本カストディ銀行（信託口）は、信託銀行の純投資のため結ばない。
- relatedCompanies: 三菱総合研究所グループ従業員持株会は、従業員持株会のため結ばない。
- terms: 助言: 用語「シンクタンク」は、政策や社会課題に関する調査研究・提言を行う研究機関を示す語として用語集への追加候補と考える。この会社の主力事業のひとつで、官公庁や民間企業向けの調査研究・コンサルティングを担っている。
- terms: 助言: 用語「BPO」は、ビジネス・プロセス・アウトソーシングの略で、人事、経理、給与計算などの業務プロセスの一部を外部専門企業に委託することを示す語として用語集への追加候補と考える。この会社のITサービスにおける給与人事サービス「PROSRV」などの情報処理サービスに関わる語である。
- terms: 助言: 用語「PROSRV」は、三菱総研DCS株式会社が提供する給与人事サービスを示す語として用語集への追加候補と考える。この会社のITサービスにおけるアウトソーシングサービスの主力サービスである。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] シンクタンク・コンサルティングサービス事業 → 提案: consulting。調査研究・コンサルティングを主とする事業に合う閉じた分類の値がなく、売上高の約6割を占めるITサービスによる it を主たる業界としたため
