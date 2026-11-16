# ディジタルメディアプロフェッショナル — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ディジタルメディアプロフェッショナル |
| 証券コード | 3652 |
| docID（データを取り出した文書） | `S100YGPD` |
| 原本 docID | `S100YGPD` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGPD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ディジタルメディアプロフェッショナル / 3652 / docID S100YGPD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
digital-media-professionals: 10 件の数値を有報XBRLと照合
有報: 株式会社ディジタルメディアプロフェッショナル 有価証券報告書－第24期(2025/04/01－2026/03/31) (docID S100YGPD)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":-122631000,"latestFiling":-126038000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":28814000,"latestFiling":25291000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":330477000,"latestFiling":327920000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":271729000,"latestFiling":267848000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":3472189000,"latestFiling":3472984000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":3842109000,"latestFiling":3834751000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":3919796000,"latestFiling":3911733000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":4092428000,"latestFiling":4078930000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":3095483000,"latestFiling":3092208000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":3124151000,"latestFiling":3113626000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":3457844000,"latestFiling":3445066000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":3611482000,"latestFiling":3594858000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":67,"latestFiling":42},{"key":"NumberOfEmployees|2023-03-31","previousFiling":64,"latestFiling":44},{"key":"NumberOfEmployees|2024-03-31","previousFiling":63,"latestFiling":43},{"key":"NumberOfEmployees|2025-03-31","previousFiling":56,"latestFiling":44}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
digital-media-professionals: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックについて: 売上高は重複する4年度すべて一致した。一方、利益（経常損益）・総資産・純資産・従業員数は前期有報の値と異なり、当期純利益は突き合わせられる行がなかった（自動照合の対象外）。差異は、前期まで連結ベースで開示されていた経営指標等が、当期有報では提出会社単体の数値に置き換わったことによるもので、有報には連結子会社の譲渡と非連結決算への移行が印字されている。本文・数値はすべて当期有報の印字によった。
- businessModel: financialNotes には、決算の基礎の変更として2026年3月期の非連結化（連結子会社DMPベトナムの持分譲渡）を1件だけ入れた。主要な経営指標等の注記1〜3（潜在株式・自己資本利益率・株価収益率の非表示）と注記5（最高株価・最低株価の市場名）は基礎の変更ではないため入れていない。注記4（第23期まで連結財務諸表を作成していたためキャッシュ・フロー項目を記載していないこと）は、上記の financialNote と同じ事由のため重ねて入れていない。
- businessModel: 本文には売上高と当期純利益だけを書き、段階利益の金額・増減率や理由、総資産・純資産の金額、キャッシュ・フローの金額、設備の帳簿価額、受注高・受注残高の金額は書いていない。販管費に計上された「Di1」の開発費は研究開発費の金額のため書いていない。
- businessModel: perspectives の industryPosition は、市場の規模や当社のシェアの印字が無いため省いた。経営方針に印字された数値目標は無い。
- businessModel: Wikipedia は記事が見つからなかった（wikipedia.json: found false）ため、補足には使っていない。
- businessModel: 2026年3月期は前期比の増減率を本文に書いていない。当期より非連結での開示となり、有報のMD&Aも前事業年度との比較分析を行っていないためである。
- businessStructure: 当社は単一セグメント（セグメント情報の注記に「IPコア等の開発・製造・販売並びにこれらの付随業務の単一セグメント」と印字）のため事業は1つとし、子区分は【関連情報】の製品及びサービスごとの情報に印字された3区分（製品事業・IPコアライセンス事業・プロフェッショナルサービス事業）によった。並び順は外部顧客への売上高の大きい順である。
- businessStructure: 子区分の売上高は百万円への切り捨てで、製品事業2,218百万円、IPコアライセンス事業139百万円、プロフェッショナルサービス事業74百万円の合計が2,431百万円となり、印字の売上高2,432百万円と1百万円の差がある。千円単位の合計（2,432,778千円）は印字の合計と一致しており、切り捨てによる差として記録する。
- businessStructure: 設備表にはセグメント欄が無く（単一セグメント）、事業所を特定の子区分には結びつけず、主な拠点を事業の説明に記した。帳簿価額は書いていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマに無いため省略した。製品事業は半導体メーカーへの製造委託による旨を製品事業の説明に記した。
- businessStructure: 関係会社は無い（【関係会社の状況】は「該当事項はありません」）。連結子会社だったDigital Media Professionals Vietnam Company Limitedは2026年2月に持分を譲渡し、期末時点で連結子会社は存在しない（経緯は businessModel の financialNotes と warnings に記録）。
- businessStructure: 分野別の売上高（ロボティクス・セーフティ分野281百万円、アミューズメント分野1,951百万円、その他分野199百万円）はMD&Aの分野別業績の概要による参考区分であり、セグメント注記の製品及びサービスごとの情報とは異なる切り口のため、子区分には使っていない。
- history: 沿革の表は年月セルと事象文が対応して印字されており、崩れた表ではない。年月は使わず、年だけを登録した。
- history: 2019年のISO9001:2015認証の取得は、事業の転機ではないため沿革には入れず、ここに記録する。
- history: 設立時の資本金の金額は、沿革に金額を書かない規則のため省いた。
- history: 連結子会社DMPベトナムに関する沿革の印字は無い。同社の事業終了と持分譲渡は businessModel の financialNotes と warnings に記録した。
- industry: 主たる業界は semiconductors とした。単一セグメントの売上高2,432百万円のうち、半導体IPコアのライセンスと自社IPを組み込んだLSI製品の販売が中心であり、会社自身も半導体業界に属すると印字しているため、閉じた分類の semiconductors が直接当てはまる。
- industry: プロフェッショナルサービス事業も半導体・AI技術に基づく受託開発であり、独立した業界を足す実態ではないため、副分類は付けなかった。
- relatedCompanies: core（コア）: ambiguousな候補で、「IPコア」「コア技術」など一般語の部分一致のみであり、株式会社コアとの関係の記載はないため結ばなかった。
- relatedCompanies: en（エン）: ambiguousな候補で、「エンジン」などの部分一致のみであり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: vision（ビジョン）: 「ビジョンシステム」という製品分野の一般語の一致のみで、株式会社ビジョンとの関係の記載はないため結ばなかった。
- relatedCompanies: amuse（アミューズ）: 「アミューズメント機器」という一般語の一致のみで、株式会社アミューズとの関係の記載はないため結ばなかった。
- relatedCompanies: path（パス）: ambiguousな候補で、「パーパス」の部分一致のみであり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: port（ポート）: 「サポート」「リカーリング収益のポートフォリオ」などの部分一致のみで、ポート株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: rhythm（リズム）: 「アルゴリズム」の部分一致のみで、リズム株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「〜をベースに」という一般語の部分一致のみで、同社との関係の記載はないため結ばなかった。
- relatedCompanies: seki（セキ）: ambiguousな候補で、「セキュリティ」の部分一致のみであり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: career（キャリア）: 「自律的キャリアの形成」という一般語の一致のみで、株式会社キャリアとの関係の記載はないため結ばなかった。
- relatedCompanies: lec（レック）: 「フレックスタイム」の部分一致のみで、レック株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 施設名「東京ロボティクス・イノベーションセンター」の部分一致のみで、株式会社イノベーションとの関係の記載はないため結ばなかった。
- relatedCompanies: the-lead（リード）: 「リード獲得」という一般語の一致のみで、株式会社リードとの関係の記載はないため結ばなかった。
- relatedCompanies: king（キング）: 「ピッキングロボット」の部分一致のみで、株式会社キングとの関係の記載はないため結ばなかった。
- relatedCompanies: kohsoku（高速）: ambiguousな候補で、「次世代高速通信規格」の部分一致のみであり、株式会社高速との関係の記載はないため結ばなかった。
- relatedCompanies: will（ウィル）: 「コンピューター・ウィルス」の部分一致のみで、株式会社ウィルとの関係の記載はないため結ばなかった。
- relatedCompanies: tomen-devices（トーメンデバイス）: 買掛金の相手先別内訳に載るだけで、取引関係を述べる記載はないため結ばなかった。
- relatedCompanies: ryoyo-ryosan-holdings（リョーサン菱洋ホールディングス）: 買掛金の相手先である株式会社リョーサンが2026年4月1日付で合併により同社へ商号変更した旨の注記の一致のみで、取引関係を述べる記載はないため結ばなかった。
- relatedCompanies: 候補に無いため結ばなかった相手: 株式会社バンダイナムコセブンズ（画像処理半導体「RS1」を共同開発し、買掛金の最大の相手先として印字）、米国Cambrian Inc.（2021年に資本業務提携を結び、同社のビジョンシステムを仕入・販売）、インドのSparsh CCTV社とideaForge社（「Di1」を活用した製品開発の戦略的パートナーシップ）はいずれも掲載済み企業の候補に無いため、関連企業には結ばなかった。
- relatedCompanies: 特定投資株式は「該当事項はありません」で、政策保有株式による候補はない。大株主のうち楽天証券・SBI証券・上田八木短資は金融機関・証券会社で、純投資とみて結ばなかった。
- terms: 助言: 用語「IPコア」は、LSIを構成する部分的な回路情報のうち単一機能でまとめられたものを指し、【事業の内容】の注記に定義が印字されています。
- terms: 助言: 用語「ランニングロイヤリティ」は、顧客が当社のIPコアを組み込んだ製品を販売する際、製品の出荷数量に応じて当社が収受する対価で、【事業の内容】に説明が印字されています。
- terms: 助言: 用語「ZIA」は、当社の人工知能に関わる技術・製品の商標で、画像認識エンジンやエッジ向けAIプロセッサーIPに使われています。
- terms: 助言: 用語「Di1」は、当社が開発した次世代エッジAI半導体（SoC）の製品名で、【研究開発活動】に開発状況が印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
