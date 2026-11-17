# ショクブン — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ショクブン |
| 証券コード | 9969 |
| docID（データを取り出した文書） | `S100YJTJ` |
| 原本 docID | `S100YJTJ` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJTJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ショクブン / 9969 / docID S100YJTJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shokubun: 10 件の数値を有報XBRLと照合
有報: 株式会社ショクブン 有価証券報告書－第50期(2025/04/01－2026/03/31) (docID S100YJTJ)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":6875566000,"latestFiling":6857589000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":7017045000,"latestFiling":7010261000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":6393185000,"latestFiling":6390739000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":6060731000,"latestFiling":6057213000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":252788000,"latestFiling":256791000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":190504000,"latestFiling":214768000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":50125000,"latestFiling":53284000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":2291000,"latestFiling":6089000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":5839845000,"latestFiling":5772807000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":5710021000,"latestFiling":5682244000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":5534829000,"latestFiling":5423052000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":5209600000,"latestFiling":5193059000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":2510463000,"latestFiling":2451547000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":2629613000,"latestFiling":2608349000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":2597558000,"latestFiling":2517266000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":2430607000,"latestFiling":2412937000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":422,"latestFiling":415},{"key":"NumberOfEmployees|2023-03-31","previousFiling":423,"latestFiling":416}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
shokubun: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との数値の差異について: 前期（第49期）まで連結財務諸表を作成していたため、前期有報の経営指標等は連結ベースであり、本有報の提出会社の経営指標等（単体）とは基礎が異なる。第50期の表は単体の5年表として全年度が有限値で印字されており、この単体系列をそのまま登録した。セグメント情報等の注記にも「前事業年度は連結財務諸表を作成しておりましたが、当事業年度は個別財務諸表のみを作成しております」と明記されている。基礎の違いは staging の basis に記録される事項として warnings のみに留め、financialNotes にはしなかった。
- businessModel: 財務諸表の注記（表示方法の変更）: 前事業年度において「営業外収益」の「その他」に含めていた「受取保険金」を当事業年度より独立掲記し、前事業年度の財務諸表の組替えを行った旨が記載されている。営業外収益の中での表示区分の変更であり、売上高や各利益の合計に影響しない表示上の事項のため、warnings のみに記録した。
- businessModel: 経営指標等の注記（第1項から第6項）は、臨時従業員の外書、潜在株式が存在しないことによる希薄化後の1株当たり情報の不記載、株主総利回りの比較指標の変更、株価収益率・配当性向の不記載、最高・最低株価の市場、期末配当の株主総会決議事項である旨で、いずれも表示・配当の事項のため financialNotes にはしなかった。第7項（第49期まで連結財務諸表を作成していたため持分法適用の場合の投資利益や連結キャッシュ・フロー項目を記載していない旨）は基礎・表示の事項として、上記の前期比較の記録とあわせて warnings のみに留めた。
- businessModel: MD&Aの利益項目（営業利益・経常利益・税引前当期純損失・法人税等）の金額や理由、キャッシュ・フローの金額は本文に書いていない。目標とする経営指標（売上高・収益基盤・財務基盤の強化）は定性的な記述のみで数値目標は開示されていない。
- businessModel: 配当（期末配当2円50銭は2026年6月25日開催予定の定時株主総会の決議事項）は資本政策のため warnings のみに記録する。
- businessModel: 商品別の販売実績は千円額を切り捨てて百万円単位で記載した（メニュー商品5,512百万円、特売商品495百万円）。切り捨て後の合計6,007百万円は印字の売上高6,008百万円と1百万円異なるため、売上高は印字の合計を用いた。
- businessModel: 株式会社神明ホールディングスとの資本業務提携基本契約（2017年5月10日締結、期間の定めなし）の業務提携内容（食材・食品の共同仕入、開発体制の構築、販売体制の拡充と発展）は事業の事実として perspectives に反映した。対価の金額は書いていない。
- businessStructure: 単一セグメント（食品事業）のため、【事業の内容】の位置付けに沿って「食品の小売及び開発」と「法人向け販売」を children とした。商品別の販売実績（メニュー商品5,512百万円、特売商品495百万円）は単一セグメントの商品区分であり、宅配を担う「食品の小売及び開発」に記載した。切り捨て後の合計6,007百万円は印字の売上高6,008百万円と1百万円異なる（千円額の切り捨てによる差異で、印字の合計を正とした）。
- businessStructure: 親会社の株式会社神明ホールディングスは非上場であり関連企業候補にも含まれていないため relatedCompanies には結ばず、資本関係の事実（議決権の50.54％保有、2026年3月31日現在）を本フラグメントの説明と warnings に記録した。
- businessStructure: 【重要な契約等】の株式会社ショクブンちたとのフランチャイズ契約は、同社が2025年9月30日をもって当該事業から撤退し同日に契約が終了している（注記3）。【事業の内容】はフランチャイズ加盟会社へのメニュー企画等の提供・経営指導を事業内容として記載しているため、その範囲で記載し、終了した個別契約は本文に書かなかった。
- businessStructure: 2025年10月1日付で連結子会社の株式会社食文化研究所を吸収合併したため、連結子会社はなくなり、当事業年度から個別財務諸表のみを作成している。期末時点の構造（子会社なし・非連結）で登録した。
- businessStructure: suppliers は旧スキーマのため省略した。仕入実績は商品別（メニュー商品2,565百万円、特売商品295百万円）のみが開示され、個別の仕入先名は本文に記載されていない。
- history: 沿革から落とした項目と理由: 1978年の本店所在地の名古屋市守山区への移転（本店移転）、1978年の定期特売商品『おせち料理』の発売と1981年の『業務用セット』の発売、1998年の『カルショクメニュー』の発売、2003年の冷凍弁当『健御膳』の発売（いずれも個別商品の発売）、1988年の子会社株式会社キーストンの設立と2000年の株式会社食文化研究所への合併（存続会社でない側の子会社の設立・消滅）、1990年の加工センター（現・フレッシュセンター）の移設（拠点の移設）、1988年の株式会社ヨシケイ京都の吸収合併と1990年の株式会社ヨシケイ南大阪の営業権譲受（1987年の合併・1988年の営業権譲受と同種の地域拡大で代表させた）、2022年の資本金の減資（資本金額そのものが項目の実質）、2022年の株式会社サンクックとの特約店契約の締結（個別の販売契約）。
- history: 2021年の第三者割当増資により株式会社神明ホールディングスが親会社となったことは、【重要な契約等】の注記（第三者割当増資により発行済株式数の50.10％に相当する株式を取得した旨）に基づく。
- history: 資本金額は沿革のいずれの項目にも書いていない。
- industry: 主分類は、【事業の内容】に「一般世帯への夕食材料等の宅配による小売を主要業務」と印字されていることに従い retail とした。閉じた分類に直接合うため、暫定分類や taxonomyGaps は記録していない。
- industry: 取扱商品は食品だが、事業の実態は一般世帯への小売（宅配販売）であるため、同一の単一セグメントに対して food は重ねて付けなかった。
- relatedCompanies: 親会社の株式会社神明ホールディングス（議決権の50.54％を保有、2026年3月31日現在。【関係会社の状況】の区分は親会社）は、非上場であることが財務諸表の注記（親会社情報）に明記されており、関連企業候補にも含まれていないため結ばなかった。資本業務提携の事実は businessModel の perspectives と businessStructure の説明に記録した。
- relatedCompanies: orix（オリックス）: 本文の印字はリース債務の内訳における「オリックス自動車」で、同社はオリックス株式会社とは別の法人であり、関係もリース取引（資金調達）にとどまるため結ばなかった。
- relatedCompanies: mitsubishi-hc-capital（三菱HCキャピタル）: リース債務の内訳に貸主として印字されているが、リース取引（資金調達）の関係にとどまるため結ばなかった。同表の三菱オートリース、ALSOK、アイ・ティ・イーも同様である。
- relatedCompanies: suzuki（スズキ）: 本文の印字は大株主の「愛知スズキ販売株式会社」で、スズキ株式会社とは別の法人であり、保有比率も0.59％と小さく取引の記載もないため結ばなかった。
- relatedCompanies: matsuya（松屋）: 本文の印字は大株主の「株式会社松屋栄食品本舗」で、株式会社松屋とは別の法人であるため結ばなかった。
- relatedCompanies: last-one-mile（ラストワンマイル）: 経営方針の「神明グループのラストワンマイルを担う企業として」という一般語句の一致であり、同名の会社との関係ではないため結ばなかった。
- relatedCompanies: base-4481、career、innovation、land、cave-interactive、en、seki は、いずれも一般語句・部分文字列の一致（時価ベース、キャリア構築、イノベーション、ヨシケイブランド、ヨシケイ、エンゲージメント、リスク等の文脈）であり、当該会社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: 候補に含まれていない大株主の事業会社（株式会社トーカン、テーブルマーク株式会社、丸進青果株式会社、株式会社マルツネ等）も、候補外のため結ばなかった。ショクブン取引先持株会は持株会であり結ぶ対象ではない。
- relatedCompanies: 株式会社ショクブンちたはフランチャイズ加盟会社だったが候補に含まれず、2025年9月30日に事業から撤退し契約も終了しているため結ばなかった。ヨシケイ開発株式会社は2003年にフランチャイズ契約を解消した旧フランチャイザーで、候補に含まれていないため結ばなかった。
- relatedCompanies: 【株式の保有状況】は、特定投資株式及びみなし保有株式が「該当事項はありません」と明記されており、保有株式は非上場株式のみであるため、株式保有を根拠とする関連企業はない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: メニュー商品・特売商品は商品区分の一般的な名称であるため用語として登録しなかった。「ウィークリーメニュー」は1978年当時の商品名で現在の商品名ではないため登録しなかった。ヨシケイは2003年に契約を解消した旧フランチャイズのブランドであり、当社の用語ではないため登録しなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
