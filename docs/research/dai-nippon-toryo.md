# 大日本塗料 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大日本塗料株式会社 |
| 証券コード | 4611 |
| docID（データを取り出した文書） | `S100YHL6` |
| 原本 docID | `S100YHL6` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHL6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大日本塗料株式会社 / 4611 / docID S100YHL6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dai-nippon-toryo: 10 件の数値を有報XBRLと照合
有報: 大日本塗料株式会社 有価証券報告書－第143期(2025/04/01－2026/03/31) (docID S100YHL6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
dai-nippon-toryo: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は2025年３月期の１件のみとした。負ののれん発生益の金額は損益項目のため、本文にも注記にも記載していない。
- businessModel: 当期純利益の減少要因として、経営成績の分析には前期に計上した負ののれん発生益の剥落と、中国製造子会社の持分譲渡契約の締結に伴う損失の計上が印刷されているが、本文の語彙規則に触れる表現を含むため、flow には当期純利益の金額と増減率のみを記載した。持分譲渡契約そのものは businessStructure の needsReview に記録した。
- businessModel: 2026中期経営計画とビジョン2029の目標のうち、売上高以外の指標（営業利益やNOPAT-ROEなど）は本文の語彙規則により記載していない。売上高の目標は印字どおり1,000億円と記載した。
- businessModel: 品質に関する不適切行為については、経営方針等の節に、JIS認証製品の検査結果の改ざん等が確認されたこと、JISマーク表示の一時停止が2025年11月14日付で解除されたこと、特別調査委員会の調査報告書を2025年５月12日付で公表したことが印刷されている。期中に停止が解除され、事業の構造の変更ではないため needsReview には上げず、信頼回復を最優先課題とする会社の方針を strategy に反映したうえで、本 warnings に事実関係を記録した。
- businessStructure: 有効文書は原本の有価証券報告書（docID S100YHL6、2026年６月23日提出）である。訂正有報はなく（amendments の status は none、originalDocID = S100YHL6）、前期有報（第142期 docID S100W3JW）との修正再表示チェックは売上高・純利益・経常利益・総資産・純資産・従業員数の全行で一致し、差異はなかった。
- businessStructure: 証拠パックが注意喚起する財務諸表の組替えの記載については、前期有報との照合で５年指標の全行が一致し、指標への影響は認められなかったため、financialNotes には上げず warnings にとどめた。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（国内塗料事業71,870百万円、照明機器事業10,424百万円、海外塗料事業8,590百万円、蛍光色材事業1,088百万円）とし、報告セグメントに含まれないその他事業は最後に置いた。４つの報告セグメントの外部顧客への売上高の単純合計は91,972百万円で、印字された小計91,974百万円とは２百万円異なる（有報の丸め）。合計は印字どおり93,759百万円を用い、セグメント利益は規則により記載していない。
- businessStructure: 当社グループは当社、子会社29社及び関連会社５社で構成される。連結従業員数は2,522人（2026年３月31日現在）。主要な生産拠点は小牧工場（愛知県小牧市）と那須工場（栃木県大田原市）である。
- businessStructure: ボンフロン株式会社は、2025年12月22日付でAGCコーテック株式会社の全株式を取得して連結子会社化し、同日付で同社がボンフロン株式会社に商号変更したものである。期中に完了し期末の構成に反映されているため、needsReview には上げず沿革と本 warnings に記録した。
- businessStructure: 神東塗料株式会社は前期（2025年３月）に株式の50.10％を取得して連結子会社化したもので、当期から業績を通期で取り込んでいる。
- history: 沿革は有価証券報告書の【沿革】の全行を転記した（38行）。1929年の発足行に印字された資本金の金額は、規則により本文に記載していない。
- history: 2013年６月の行の直後に年月セル（2013年７月・2015年１月）と事象文が続けて印字され表が崩れている箇所は、年月の数と事象の数が一致するため行順に対応づけた（2013年７月＝日塗不動産株式会社及びDNTビジネスサービス株式会社の吸収合併、2015年１月＝ジャパンパウダー塗料製造株式会社の設立）。
- history: 神東塗料株式会社の子会社化（2025年３月）とボンフロン株式会社の子会社化（2025年12月）は、沿革の印字どおり転記した。ボンフロン株式会社は取得と同日付でAGCコーテック株式会社から商号変更している。
- industry: 主たる業界は chemicals とした。国内塗料事業と海外塗料事業を合わせた塗料事業が連結売上高の８割台半ばを占め、蛍光色材事業も化学製品の範囲にあるためである。閉じた分類に塗料専業の値はないが、化学で言い表せるため taxonomyGaps には上げなかった。
- industry: 照明機器事業は報告セグメントとして外部顧客への売上高が独立して開示されている（104億24百万円、連結売上高の約１割）ため、electronics を副次分類として付けた。
- relatedCompanies: 神東塗料（shinto-paint）: 連結子会社（議決権の所有割合50.1％）であり、グループ会社のため結ばなかった。事業構造と沿革に記載した。
- relatedCompanies: AGC（agc）: 2025年12月に全株式を取得したAGCコーテック株式会社（現ボンフロン株式会社）の旧親会社である。株式の取得は一回限りの取引で、AGC自体との継続的な取引や提携の印字がないため結ばなかった。
- relatedCompanies: クボタ（kubota）: 特定投資株式の保有目的が全銘柄共通の定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 積水化学工業（sekisui-chemical）: 保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 積水ハウス（sekisui-house）: 保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: オーウエル（o-well）: 相互に株式を保有するが、保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 日本パーカライジング（nihon-parkerizing）: 相互に株式を保有するが、保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 菊水化学工業（kikusui-chemical-industries）: 相互に株式を保有するが、保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 三菱電機（mitsubishi-electric）: 保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 横河ブリッジホールディングス（yokogawa-bridge-holdings）: 保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 東日本旅客鉄道（east-japan-railway）: 保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 宮地エンジニアリンググループ（miyaji-engineering-group）: 保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 三協立山（sankyo-tateyama）: 保有目的が定型句のみで、個別の取引や提携の印字がないため結ばなかった。
- relatedCompanies: 三菱瓦斯化学（mitsubishi-gas-chemical）: 原材料の調達先とされるが、保有目的の定型句のみで、個別の取引内容の印字がないため結ばなかった。
- relatedCompanies: 三菱総合研究所（mitsubishi-research-institute）: 保有目的はコンサルティング業務の委託等に関する関係維持の記載のみで、提携等の印字がないため結ばなかった。
- relatedCompanies: 三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）: 保有目的が資金調達等の金融取引のため結ばなかった。
- relatedCompanies: 横浜フィナンシャルグループ（yokohama-financial-group）: 保有目的が資金調達等の金融取引のため結ばなかった。
- relatedCompanies: 三菱商事（mitsubishi-corporation）: 当事業年度に全株式を売却し、期末の保有がゼロのため結ばなかった。
- relatedCompanies: 三菱ロジスネクスト（mitsubishi-logisnext）: 当事業年度に全株式を売却し、期末の保有がゼロのため結ばなかった。コードリストにも掲載がない。
- relatedCompanies: ニチハ（nichiha）: 退職給付を目的とする信託設定によるみなし保有株式のみのため結ばなかった。
- relatedCompanies: ビジョン（vision）: 経営方針の文中のビジョン2029の語への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: ベース（base-4481）: 営業利益ベース等の語への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: キャリア（career）: キャリア形成支援等の語への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: ランド（land）: ブランドの語への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: レック（lec）: フレックスタイム制度等の語への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: ポート（port）: 事業ポートフォリオ等の語への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: 船場（semba）: 本店所在地の南船場の地名への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: サンデー（sunday）: 連結子会社のサンデーペイント株式会社への部分一致で、株式会社サンデーとは別法人である。コードリストにも掲載がないため結ばなかった。
- relatedCompanies: コア（core）: コアビジネス等の語への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: セキ（seki）: 一般語への部分一致で、関係の印字はないため結ばなかった。
- relatedCompanies: TOA（toa-6809）: 持分法適用関連会社のTOA-SHINTO (THAILAND) CO.,LTD.等の社名への部分一致で、TOA株式会社自体への言及ではないため結ばなかった。
- relatedCompanies: トラスト（trust）: 信託口の名称への一致で、関係の印字はないため結ばなかった。
- relatedCompanies: 日新（nissin）: 新株予約権等の文中の部分一致で同一性が曖昧であり、コードリストにも掲載がないため結ばなかった。
- relatedCompanies: オロ（oro）・パス（path）・レイ（ray）・レント（rent）: 一般語への部分一致で同一性が曖昧であり、関係の印字はないため結ばなかった。
- relatedCompanies: CHUGOKU MARINE PAINTS (HONG KONG), LIMITEDは迪恩特塗料（浙江）有限公司の持分譲渡契約の相手方だが、候補一覧になく上場会社でもないため結ばなかった。譲渡契約は businessStructure の needsReview に記録した。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessStructure: 連結子会社の迪恩特塗料（浙江）有限公司について、2026年２月26日付でCHUGOKU MARINE PAINTS (HONG KONG), LIMITEDとの間で持分譲渡契約を締結した。連結の範囲からの除外は2027年３月期の中間期を予定している。登録は2026年３月31日現在の構成と数値に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
