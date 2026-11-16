# オプトエレクトロニクス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オプトエレクトロニクス |
| 証券コード | 6664 |
| docID（データを取り出した文書） | `S100XNIW` |
| 原本 docID | `S100XNIW` |
| 提出日（原本） | 2026-02-26 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XNIW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オプトエレクトロニクス / 6664 / docID S100XNIW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
optoelectronics: 10 件の数値を有報XBRLと照合
有報: 株式会社オプトエレクトロニクス 有価証券報告書－第50期(2024/12/01－2025/11/30) (docID S100XNIW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
optoelectronics: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記1・2（潜在株式調整後1株当たり当期純利益・自己資本利益率・株価収益率の非記載）は表示事項のため financialNotes には入れなかった。
- businessModel: 前期有報との修正再表示チェックは全系列で差異なし。組替え・遡及適用に関する記載は収益認識基準の第47期期首適用（注記3）であり、financialNote として記録した。
- businessModel: 主要な顧客ごとの情報は、売上高の10％以上を占める相手先が無いため記載がない。
- businessModel: Wikipedia（オプトエレクトロニクス）が見つかったが、冒頭は順位・シェアの主張（レーザーエンジン世界2位・国内シェア）のみで、数値・順位は使えないため補足には使わず、出典も追加しなかった。
- businessModel: 決算日後の第三者割当（日本エイサー・Esquarre Vision Limited、払込2026年1月7日完了）は資本関係の大きな変動を伴う後発事象のため needsReview に記録した。割当先はいずれも related-candidates.json に無く、決算日時点の株主でもないため関連企業には結んでいない。
- businessStructure: 報告セグメントは地域別（日本・米国・欧州・アジア他）の3区分で、並び順はセグメント注記の外部顧客への売上高の大きい順（日本3,192百万円、欧州・アジア他2,174百万円、米国1,405百万円）とした。
- businessStructure: 製品別区分（スキャナ製品・ターミナル製品・モジュールその他製品）はグループ全体の関連情報としてのみ開示され、地域セグメント別の内訳が無いため children にはせず、businessModel の products に記載した。
- businessStructure: 設備と事業の対応は有報のセグメント欄どおりとした（本社・蕨事業所・大阪営業所・北海道電子工業は日本、Opticon Sensors Europe B.V.本社は欧州・アジア他、Opticon,Inc.本社は米国）。
- businessStructure: 事業系統図以外に事業活動を休止している子会社が2社（Bluestone B.V.、Opticon Sensors Benelux B.V.）ある旨が事業の内容に注記されている。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。製造は連結子会社の北海道電子工業が担い、製造原価明細書では製品仕入高が当期総製造費用の過半を占める。沿革には五洋電子やタカハタ電子への外注生産の実績が印字されている。
- history: 沿革の各行は年月と事象が分かれて印字されており、行順で対応づけた。
- history: 落とした行: 本社移転（1985年蕨市）、大阪営業所の設置（1993年）と移管、芦別工場の新設（1986年）とISO9002取得（1998年）、製造・開発販売部門の子会社分離（1993年、1995年の吸収合併で解消）、オーストラリア子会社の設立・株式取得・売却（1991年・1996年・2001年）、物流センター開設（2001年）、川口事業所の開設・閉鎖（2003年・2007年）、外注生産の開始・終了・海外移管（1999年・2008年・2009年）、Opticon,Inc.株式の欧州子会社への売却（2012年）、2010年の大阪証券取引所JASDAQ市場への移行（市場再編の機械的な表示変更）。
- history: 2025年11月の行（日本エイサー株式会社及びEsquarre Vision Limitedへの第三者割当の決議）は資本取引であり、金額も伴うため沿革には入れなかった。払込完了は決算日後の2026年1月7日で、重要な後発事象として businessModel の needsReview に記録した。
- industry: 主たる事業はバーコードリーダ等の電子機器の開発・製造・販売であり、閉じた分類の electronics が直接当てはまるため暫定分類は不要とした。
- relatedCompanies: resona-holdings（りそなホールディングス）: 特定投資株式に主要取引金融機関として載っているが、資金調達のための金融取引が理由であるため結ばなかった。
- relatedCompanies: en・base-4481・ic・port・core・path・vision: いずれもエンジン、ベース、ICタグ、パスポート、コア技術、マシンビジョンといった普通名詞や部分一致の機械抽出で、有報がその会社との取引・提携・資本関係を述べていないため結ばなかった。
- relatedCompanies: 日本エイサー株式会社とEsquarre Vision Limitedは決算日後の第三者割当の割当先だが、related-candidates.json に無く、決算日（2025年11月30日）時点の株主でもないため結ばなかった（後発事象として businessModel の needsReview に記録）。
- relatedCompanies: 株式会社俵興産は2025年11月30日現在の大株主（9.93％）だが、候補に無く非上場のため結ばなかった。その他の大株主は個人と証券会社・信託口であり結ぶ対象がない。
- relatedCompanies: 連結子会社（北海道電子工業株式会社、Opticon Sensors Europe B.V.ほか）は自社の子会社のため結ばなかった。
- terms: 助言のみ。用語候補: 「バーコードリーダ」（バーコード等の情報を読み取る自動認識装置の総称）、「スキャンエンジン（モジュール）」（バーコード等を読み取るための心臓部となる部品で、各種機器に組み込まれる）、「2次元イメージャ方式」（画像としてコードを読み取る方式）、「自動認識」（バーコードやRFID等で情報を自動的に読み取る技術分野）。

## 要確認（status に反映）

- businessModel: 決算日（2025年11月30日）の後、日本エイサー株式会社及びEsquarre Vision Limitedへの第三者割当による新株式の発行及び自己株式の処分が2026年1月7日に払込手続きを完了しています（2025年11月28日の取締役会で決議）。割当先が指名した取締役候補者7名が定時株主総会で選任され、新たな経営体制の下で事業計画を見直す予定としています。本登録は2025年11月30日現在の株主構成・グループ構成に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
