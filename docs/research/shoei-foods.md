# 正栄食品工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 正栄食品工業株式会社 |
| 証券コード | 8079 |
| docID（データを取り出した文書） | `S100XHU7` |
| 原本 docID | `S100XHU7` |
| 提出日（原本） | 2026-01-28 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHU7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 正栄食品工業株式会社 / 8079 / docID S100XHU7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shoei-foods: 10 件の数値を有報XBRLと照合
有報: 正栄食品工業株式会社 有価証券報告書－第78期(2024/11/01－2025/10/31) (docID S100XHU7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shoei-foods: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報と全8行一致した。financialNotes の法人税、住民税及び事業税等に関する会計基準の適用は、【連結経営指標等】の注3に基づく。第75期の期首からの「収益認識に関する会計基準」等の適用（同注2）は、適用済みの定型的な事項として、ここに記録するにとどめた。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」であり、提出後の予定事項はない。
- businessModel: 当期純利益の減少要因として有報が挙げる、米国関係会社での労働訴訟に基づく損害賠償金の計上と、基幹システム刷新のための顧問料の費用計上については、本文に書ける金額の範囲外の項目のため、本文には増減率のみを記載した。
- businessModel: 品目別の金額は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の印字（億円・百万円表記）のとおり記載し、セグメントの金額は【セグメント情報】の外部顧客への売上高（千円単位の印字）を億円・百万円表記に直して記載した。
- businessStructure: 当社グループは、当社と子会社12社（連結子会社9社および非連結子会社3社）で構成されている（【事業の内容】）。
- businessStructure: 報告セグメントは生産・販売体制を基礎とした地域別の「日本」「米国」「中国」の3つで、【セグメント情報】の外部顧客への売上高の大きい順（日本、中国、米国）に並べた。各セグメントの外部顧客への売上高は、セグメント情報の千円単位の印字（日本108,381,300千円、中国9,969,446千円、米国6,547,088千円）を億円・百万円表記に直して記載した。
- businessStructure: 【関連情報】の製品およびサービスごとの情報は「単一の製品・サービスの区分の外部顧客への売上高が連結売上高の90％を超えるため記載を省略」とされており、地域情報も報告セグメントと同一のため省略されている。品目別の売上高は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の販売実績に基づき businessModel に記載した。
- businessStructure: 拠点・設備と事業の対応は有報のセグメント欄どおりとし、複数区分が連記された行はどの事業にも結びつけていない。
- history: 【沿革】の表は年月と事象が同じ行に印字されており、崩れた表ではないため、行順の対応づけは行っていない。全45件を収録した。
- history: 沿革に資本金額の印字はないため、金額は記載していない。
- history: Wikipedia の冒頭は、総合食品商社という位置づけと本社の所在地のみで、いずれも有報で確認できる内容のため、補足には使用しなかった。
- industry: 主たる業界は、製菓原材料等の加工食品やナッツ・ドライフルーツの生産・販売という事業内容と、全セグメントに共通する食品の取扱いから food とした。商社としての仕入・販売と、メーカーとしての加工・製造の両面があるが、いずれも食品分野のため2つ目の業界は付けていない。
- relatedCompanies: bull-dog-sauce・doutor-nichires-holdings・ezaki-glico・fujicco・fujiya・kotobuki-spirits・marudai-food・maruichi・meiji-holdings・morinaga-and-co・nakamuraya・nichiryo-baking・nittobest・oie-sangyo・royal-holdings・satoh-and-co・taiyo-kagaku・toho・yakult-honsha: 特定投資株式として保有するが、保有目的が「企業価値向上のため、安定的取引関係の維持強化を目的に継続保有しております」という全銘柄共通の定型句のみで、その相手について取引の向きや提携を述べる個別の印字がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group・mizuho-financial-group・ms-and-ad-insurance-group-holdings・north-pacific-bank・the-ehime-bank: 特定投資株式の保有目的が金融機関との円滑な取引関係の維持強化であり、資金調達・保険取引の文脈のため結ばなかった。【大株主の状況】に載る株式会社みずほ銀行・株式会社三菱UFJ銀行・第一生命保険株式会社も金融機関のため結ばなかった。
- relatedCompanies: innovation・seki・core・en・nof・base-4481・land・port・seed: 一般語や地名、製品名の部分一致で、当該会社について取引・提携・資本関係を述べる記載がないため結ばなかった（seki・core・en・nof は ambiguous の候補でもある）。
- relatedCompanies: olympic-group・trust: EDINETのコードリストにないため結ばなかった（trust は日本マスタートラスト信託銀行株式会社（信託口）の一致で、信託の純投資でもある）。
- relatedCompanies: 株式会社明治: 【大株主の状況】に2025年10月31日現在2.5％を保有する大株主として載る事業会社だが、非上場で related-candidates.json に載っていないため結ばなかった（候補の meiji-holdings は親会社で別法人）。
- relatedCompanies: 正栄プラザ株式会社（9.7％）・本多興産株式会社（5.0％）・正栄食品取引先持株会（4.4％）: 【大株主の状況】に載るが、非上場の関係会社・持株会で related-candidates.json に載っていないため結ばなかった。
- relatedCompanies: 株式会社ADEKA: 特定投資株式に載るが related-candidates.json に載っておらず、保有目的も全銘柄共通の定型句のみのため結ばなかった。
- terms: 助言: 用語「乾果実（ドライフルーツ）」は、この会社の主力の取扱品目を示す語として用語集への追加候補と考える。クルミやプルーン、アーモンドなどの農園経営から仕入・加工・販売までを手がけており、乾果実・缶詰類は品目別で最大の売上区分である。
- terms: 助言: 用語「製菓原材料」は、製菓・製パン業界向けに供給するマロンペーストやチョコレート加工品などの中間素材を示す語として用語集への追加候補と考える。この会社の商社機能とメーカー機能の接点にある品目である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
