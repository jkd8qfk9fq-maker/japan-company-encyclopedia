# ネポン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ネポン株式会社 |
| 証券コード | 7985 |
| docID（データを取り出した文書） | `S100YN9E` |
| 原本 docID | `S100YN9E` |
| 提出日（原本） | 2026-06-30 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YN9E.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ネポン株式会社 / 7985 / docID S100YN9E（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nepon: 10 件の数値を有報XBRLと照合
有報: ネポン株式会社 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YN9E)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":-280180000,"latestFiling":-283546000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":76765000,"latestFiling":73399000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":6024099000,"latestFiling":6068175000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":2332965000,"latestFiling":2377042000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nepon: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年3月期の数値は誤謬の訂正を反映した数値である旨が経営指標等の注記に記載されており、financialNotesに2025年3月期の注記として記載しました。前期有報との照合では、2025年3月期の純利益・利益・総資産・純資産に差異がありましたが、本有報の印字値を採用しています。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」。継続企業の前提に関する記載はありません。株式分割の記載はありません。
- businessModel: 経営方針に記載された経営指標の目標（資本・資産効率や収益改善に関する記述）は投資指標に関する目標のため、本文・戦略には書かず存在のみ記録します。
- businessModel: MD&Aの損益項目の金額と理由、生産実績・受注高・受注残高の金額は書いていません。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（熱機器6,949百万円、衛生機器466百万円、その他1百万円）としました。切り捨て後の内訳合計は7,416百万円となり、印字の合計7,417百万円と1百万円差があります（千円単位の切り捨てによる差で、印字どおり記載）。
- businessStructure: 農用機器・汎用機器は【事業の内容】の区分であり、金額が独立して開示されていないため金額は書いていません。
- businessStructure: 連結子会社はNEPON(Thailand)Co.,Ltd.1社（議決権所有割合49.0%）です。拠点については、厚木工場の設備欄に熱機器事業・衛生機器事業・その他事業が連記されているため、特定の事業には結びつけていません。
- businessStructure: suppliers（仕入先）はこのツリーの旧スキーマに合わせて省略しました。個別の仕入先名は有報に記載されていません。
- history: 落とした行（理由）: 1951年 本格的に建設業界に進出（営業展開の記述）、1960年 横浜工場開設・1964年 大阪営業所開設・1968年 厚木工場開設（拠点の開設）、1965年 全国農業協同組合連合会との販売契約（単発の販売契約）、1966年 東京中小企業投資育成会社からの出資・本社移転（資本・移転事項）、1976年 資本金の金額（金額は書かない規則）、1979〜82年 販売子会社各社の設立、1981年 横浜工場の厚木工場への統合、1985年 ユークイック発売・1995年 ダイレクトヒータ発売・2013年 誰でもヒーポン発売（個別製品の発売）、2000年 ネポンパーテック設立、2003・04年 販売子会社の吸収合併、2007年 ネポンパーテック解散・設備工事事業からの撤退、2008年 第三者割当増資（資本事項）、2025年 本社を厚木市へ移転（移転事項）。
- history: 資本金の金額（1948年設立時・1976年・2008年の各記載）は規則により沿革に書いていません。
- industry: 主たる業界は、施設園芸用温風暖房機・ヒートポンプ・ボイラ等の熱機器事業（2026年3月期の外部顧客への売上高6,949百万円で全体の9割超）に基づき、機器メーカーとして machinery が直接当てはまるため暫定ではなく直接付けました。衛生機器事業（簡易水洗便器等）も機器の製造販売であり、独立した業界は付けていません。
- relatedCompanies: sato-sho-ji（佐藤商事、8065）: 主要な顧客ごとの情報に主要な販売先として個別に記載され、大株主の状況にも12.53％の保有が印字されているため顧客として結びました。その他の関係会社には2021年11月以降該当しないため、関係は customer としました。
- relatedCompanies: 三十三フィナンシャルグループ、三井住友フィナンシャルグループ、横浜フィナンシャルグループ: 特定投資株式の保有目的はいずれも「金融取引の円滑化」であり、資金調達を目的とする金融機関の保有のため結びませんでした。
- relatedCompanies: 三井住友銀行: 大株主に載りますが、金融機関の保有のため結びませんでした。
- relatedCompanies: 日興通信、東京ソフト: 大株主に載る事業会社ですが、当社との取引を示す記載がないため結びませんでした。
- relatedCompanies: NEPON(Thailand)Co.,Ltd.は当社の連結子会社であり、関連企業の対象外です。
- terms: 助言のみ。本文で使った用語の候補: ハウスカオンキ、ネポングリーンパッケージ、パールトイレ、Chabu-Dai、アグリネットアドバンス、ちょこっとリモコン、施設園芸、ハイブリッド暖房です。
- terms: 証拠パックに wikipedia.json はありませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
