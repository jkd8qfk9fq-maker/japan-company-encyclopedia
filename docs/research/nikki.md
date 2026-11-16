# ニッキ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニッキ |
| 証券コード | 6042 |
| docID（データを取り出した文書） | `S100YKJL` |
| 原本 docID | `S100YKJL` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKJL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニッキ / 6042 / docID S100YKJL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nikki: 10 件の数値を有報XBRLと照合
有報: 株式会社ニッキ 有価証券報告書－第135期(2025/04/01－2026/03/31) (docID S100YKJL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nikki: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と親会社株主に帰属する当期純利益だけとし、MD&Aの営業利益・経常利益の金額や増減率は書かなかった。売上高の増加理由はMD&Aの印字（米国市場向け汎用製品の販売が堅調）によった。
- businessModel: 経営指標等の注記は、△が支出を示す旨と、潜在株式が存在しないため潜在株式調整後１株当たり当期純利益金額を記載していない旨の２件のみで、いずれも表示事項のため financialNotes には入れなかった。会計方針の変更・決算期変更・株式分割の注記は有報にない。
- businessModel: 大島機工株式会社の子会社化（2025年9月）に伴う企業結合の暫定的な会計処理は当連結会計年度内に確定しており、半期情報の注記にその旨があるが、５年表の数値は前期有報との照合で全系列一致（修正再表示なし）であり、financialNotes・needsReview には入れなかった。
- businessModel: 中期経営計画の目標指標（売上高営業利益率・売上高経常利益率・自己資本比率・自己資本利益率）は投資・利益率の指標のため、perspectives を含む本文に書かなかった。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。期後の自己株式取得等の決議の印字もないため、needsReview は空とした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。セグメント別の金額は千円額を百万円に切り捨てており、5事業の合計は連結売上高9,269百万円と一致する。
- businessStructure: 主要な設備のうち本社・厚木工場は5セグメントが連記されているため、特定の事業に対応付けなかった。賃貸用不動産（東京都江東区・新宿区・杉並区）はセグメント欄が不動産賃貸事業のみのため同事業の設備とし、帳簿価額は書いていない。国内・在外子会社の設備はセグメント欄が単一のもの（田島精密工業＝汎用機器、ニッキ・テクノ＝自動車機器、神奈川精工・大島機工＝産業機器、NIKKI AMERICA＝汎用機器、NIKKI (THAILAND)＝ガス機器）だけを各事業の拠点とみなし、複数区分が連記された瀋陽日新気化器・NIKKI INDIAは特定事業に対応付けなかった。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。仕入先として印字があるのは特定投資株式のMotonic Corporation（部品等の仕入先）であり、その事実は関連企業の warnings に記録した。
- businessStructure: 連結子会社9社（瀋陽日新気化器、NIKKI AMERICA、田島精密工業、ニッキ・テクノ、ニッキ ソルテック サービス、NIKKI INDIA、NIKKI (THAILAND)、神奈川精工、大島機工）は自社の子会社のため businesses の説明内での役割のみを書き、関連企業には含めていない。
- history: 沿革の末尾は崩れた表で、2011年８月・2013年８月・2016年５月の3つの年月セルと3つの事象文（インド子会社設立・タイ子会社設立・インド工場拡張）が分かれて印字されている。数が一致するため行順に対応づけ、インド工場拡張（2016年）は規模の小さい設備拡張のため項目としては落とした。
- history: 落とした行: 名古屋・広島出張所の開設（1960年）、第２工場完成（1960年）、本社工場完成（1961年）、厚木の工場敷地入手（1963年）、四連二段作動気化器の開発（1964年）、本社工場の技術本館完成（1978年）、株式会社日気サービスの株式取得（1978年、2009年にソルテックへ吸収合併済み）、品川工場の厚木工場への集約（1988年）、品川本社ビル完成（1990年）、NIKKI KOREA CO.,LTD.の設立（2005年、非連結子会社）、NIKKI AMERICA FUEL SYSTEMS,LLCの設立（2005年、2022年に吸収合併済み）、インド工場の拡張（2016年）。
- history: Wikipedia は found: false のため使っていない。
- industry: 主たる業界は automotive（自動車）とした。売上高の大半はガス機器・汎用機器・自動車機器の各事業が占め、いずれも自動車・二輪車・農業/産業用エンジン向けの燃料供給・制御部品の事業であり、閉じた分類の automotive が直接当てはまるため、taxonomyGaps には書かなかった。
- industry: 副次として、産業機器事業（空圧制御機器部品・建設機械部品、売上高669百万円）に machinery を、不動産賃貸事業（売上高757百万円）に real-estate を付けた。いずれも報告セグメントとして金額が独立に開示されている。
- relatedCompanies: nissan・isuzu-motors: 特定投資株式の保有目的が「当社の製品等の販売先であり、取引関係の維持・強化のため」と銘柄ごとに販売先である旨を印字しているため customer として結んだ。保有目的の後段は共通の定型句だが、前段の役割の印字は銘柄ごとに異なる（仕入先・取引銀行・販売先）。
- relatedCompanies: sony-group: かつて当社の賃貸用不動産の賃貸先であり特定投資株式として保有していたが、賃貸借契約の終了に伴い2025年3月期に保有目的を純投資目的へ変更しており、現在の取引関係の印字がないため結ばない。なお、同社の2024年10月１日付の株式分割（１株→５株）は保有先の分割であり、当社の分割ではない。
- relatedCompanies: mitsubishi-ufj-financial-group・resona-holdings・yokohama-financial-group: 特定投資株式の保有目的が「当社の取引銀行」であり、金融取引が理由のため結ばない。
- relatedCompanies: nissin: listing が「コードリストにない」上、本文の一致は連結子会社である瀋陽日新気化器有限公司への言及であり、株式会社日新への言及ではない。結ばない。
- relatedCompanies: en: 「エンジン」の部分一致のみで、エン株式会社への言及はない。結ばない。
- relatedCompanies: base-4481: 「営業利益ベース」の文脈の部分一致のみ。結ばない。
- relatedCompanies: axell: 製品名「アクセルワイヤユニット」の部分一致のみで、株式会社アクセルへの言及はない。結ばない。
- relatedCompanies: applied-technology: 人材戦略の「応用技術への展開」という一般語の一致のみ。結ばない。
- relatedCompanies: ichigo: 大株主欄のいちごトラスト・ピーティーイー・リミテッド（信託・ファンド）の部分一致であり、いちご株式会社への言及はない。結ばない。
- relatedCompanies: trust: listing が「コードリストにない」上、いちごトラストの名称の部分一致のみ。結ばない。
- relatedCompanies: 候補に無いため結ばなかった相手: Motonic Corporation（特定投資株式に「当社の部品等の仕入先」と印字）、Briggs ＆ Stratton Corporation・Rehlko（汎用機器事業の主要な顧客）、グローバルコンポーネントテクノロジー株式会社・上海太子美雅貿易有限公司（ガス機器事業の主要な顧客）、谷電機工業株式会社・株式会社富士精機製作所（大株主の事業会社）はいずれも有報に取引・資本関係の印字があるが、related-candidates.json に無いため結ばない。
- relatedCompanies: 連結子会社９社と非連結子会社NIKKI KOREA CO.,LTD.は自社の子会社のため関連企業には含めない。
- terms: 助言のみ。用語の追加提案：気化器（キャブレター。燃料と空気を混合してエンジンに供給する装置で、同社の祖業製品）、ベーパーライザ（液化ガスを気化させる装置）、レギュレータ（ガスの圧力を調整する装置）、スロットルボディ（エンジンへの吸入空気量を調整する部品）、ECU（電子制御装置。エンジン等を電子制御する装置）、インジェクター（燃料を噴射する装置）。本文中の事業説明に基づく。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
