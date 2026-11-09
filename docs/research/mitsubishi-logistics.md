# 三菱倉庫 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三菱倉庫株式会社 |
| 証券コード | 9301 |
| docID（データを取り出した文書） | `S100YA7K` |
| 原本 docID | `S100YA7K` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YA7K.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三菱倉庫株式会社 / 9301 / docID S100YA7K（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 38 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsubishi-logistics: 10 件の数値を有報XBRLと照合
有報: 三菱倉庫株式会社 有価証券報告書－第223期(2025/04/01－2026/03/31) (docID S100YA7K)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsubishi-logistics: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や人件費などの費用を差し引いた残りが利益になります。2026年3月期のは54…）

## エージェントの判断記録（fragment warnings）

- businessModel: 営業収益の増減（2026年3月期273,446百万円、前期284,069百万円、前期比3.7％減）とその理由（物流事業は増加、不動産事業は不動産販売収入等の減少）はMD&Aの印字どおり。
- businessModel: セグメント利益の指標は当連結会計年度から営業利益から事業利益（営業利益に持分法投資損益と資産回転型ビジネス損益を加えたもの）に変更され、前連結会計年度分も変更後の算定方法で表示されている。セグメント利益の金額は文章の規則により書いていない。
- businessModel: パックの注意（財務諸表の組替え）について: 本文中の組替えは、包括利益計算書の組替調整額、繰延税金負債の内訳表示の変更に伴う前年度注記の組替え、MD&Aの主要業務別収益における「倉庫賃貸料」の物流事業内での表示の組替えであり、５年間の営業収益・純利益の系列には影響しない。前期有報との照合でも全行が一致していたため、系列についての注記（basis）は置かなかった。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」。訂正有報・決算期変更・変則決算もない。
- businessStructure: 事業の並び順は、報告セグメントの外部顧客への営業収益の大きい順（2026年3月期: 物流事業238,013百万円、不動産事業35,432百万円）。
- businessStructure: 子区分の金額は書いていない。セグメント注記の分解は料金の種類別（倉庫保管料・倉庫荷役料・陸上運送料・港湾荷役料・国際運送取扱料など）であり、事業区分ごとの外部顧客への営業収益ではない。MD&Aの「主要業務の営業収益」は内部取引を含む管理上の数値のため、金額としては使っていない（子区分の並びの参考にはした）。
- businessStructure: グループの構成は【事業の内容】の「当社、子会社55社及び関連会社28社」を使った。
- history: 【沿革】の全行から主要な出来事を選んだ。支店の開設・統合などの細目は省いた。
- history: 沿革の表は年月と事象が対応して印字されており、崩れた表ではないため、行順の対応づけは行っていない。
- industry: 主たる業界は、外部顧客への営業収益の大半を占める物流事業から transportation とした。不動産事業は報告セグメントとして開示があるため real-estate を２つ目に付けた。
- relatedCompanies: innovation（3970）: 一致は「MLCイノベーション１号投資事業有限責任組合」「MLCベンチャーズ」など自社グループ名称の一部であり、同社との取引・資本関係の記載はないため結ばなかった。
- relatedCompanies: en（4849）: ambiguous。本文中の一般語の一致のみで、同社への言及はないため結ばなかった。
- relatedCompanies: vision（9416）: 一致は「MLC2030ビジョン」の一部であり、同社への言及はないため結ばなかった。
- relatedCompanies: path（3840）: ambiguous。一致は「当社グループパーパス」などの一般語であり、同社への言及はないため結ばなかった。
- relatedCompanies: land（8918）: 一致は米国メリーランド州などの地名・英語表記の一部であり、同社への言及はないため結ばなかった。
- relatedCompanies: itsumo（7694）: 一致はビジョンの文言「社会のいつもを支え」の一部であり、同社への言及はないため結ばなかった。
- relatedCompanies: zero（9028）: ambiguous。一致は「三菱倉庫グループネットゼロ宣言」の一部であり、同社への言及はないため結ばなかった。
- relatedCompanies: port（7047）: 一致は「横浜・ポートサイド地区」の地名の一部であり、同社への言及はないため結ばなかった。
- relatedCompanies: trust（3347）: コードリストになく、一致は「ゼロトラストセキュリティモデル」の一般語であり、同社への言及はないため結ばなかった。
- relatedCompanies: ishin（143A）: 本文中の一般語の一致のみで、同社への言及はないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group（8306）: 大量保有報告書の注記に共同保有者として現れるのみで、株主名簿に基づく【大株主の状況】には載っていない。金融機関の保有であり、純投資にあたるため結ばなかった。
- relatedCompanies: seki（7857）: ambiguous。役員氏名などの一致のみで、同社への言及はないため結ばなかった。
- relatedCompanies: base-4481（4481）: 一致は「約定ベース」の一般語であり、同社への言及はないため結ばなかった。
- relatedCompanies: daiwa（8247）: ambiguous。一致は監査役の氏名（大和正尚氏）であり、同社への言及はないため結ばなかった。
- relatedCompanies: fujiya（2211）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみ。前事業年度に売却済みのため結ばなかった。
- relatedCompanies: hachijuni-nagano-bank（8359）: 銀行であり、保有株式の表に載るのみ。金融取引を理由とする関係は結ばないため結ばなかった。
- relatedCompanies: isetan-mitsukoshi-holdings（3099）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句（物流事業における取引関係の維持・強化）のみのため結ばなかった。
- relatedCompanies: japan-airlines（9201）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: k-r-s（9369）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: kanaden（8081）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: key-coffee（2594）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: mitsubishi-corporation（8058）: 保有株式の表に関係する記載のみで前事業年度に売却済みであり、定型句以外の取引・提携の記載はないため結ばなかった。
- relatedCompanies: mitsubishi-gas-chemical（4182）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: nippon-beet-sugar-manufacturing（2108）: 保有株式の表に載るのみで、前事業年度に売却済みのため結ばなかった。
- relatedCompanies: nippon-electric-glass（5214）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: nippon-shinyaku（4516）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: nippon-yusen-kabushiki-kaisha（9101）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: ono-pharmaceutical（4528）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: shin-etsu-chemical（4063）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: suzuki-6785（6785）: ambiguous。一致は支店長の氏名（鈴木理弘氏）であり、同社への言及はないため結ばなかった。
- relatedCompanies: terumo（4543）: 保有株式の表に載るのみで、前事業年度に売却済みのため結ばなかった。
- relatedCompanies: the-chiba-bank（8331）: 銀行であり、保有目的も金融取引であるため結ばなかった。
- relatedCompanies: the-hyakujushi-bank（8386）: 銀行であり、保有株式の表に載るのみ。金融取引を理由とする関係は結ばないため結ばなかった。
- relatedCompanies: toda（1860）: 保有株式の表に載るのみで、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: tokio-marine-holdings（8766）: 保険会社であり、保有株式の表に載るのみで前事業年度に売却済み。保険取引を理由とする関係は結ばないため結ばなかった。
- relatedCompanies: yamadai（7426）: コードリストになく、ambiguous。役員氏名などの一致のみで、同社への言及はないため結ばなかった。
- relatedCompanies: 【関係会社の状況】に載る連結子会社55社・持分法適用関連会社は、いずれも有価証券届出書・有価証券報告書を提出していない非上場の会社であり（同表の注記）、候補にも含まれていないため結んでいない。
- relatedCompanies: 【大株主の状況】に載る明治安田生命保険相互会社（7.49％）は相互会社で上場しておらず、株式会社竹中工務店（2.77％）も上場していないため、いずれも結んでいない。信託銀行・保管機関などの純投資の名義も結んでいない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 助言のみ。用語は有報の本文に根拠のあるものだけを選んだ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
