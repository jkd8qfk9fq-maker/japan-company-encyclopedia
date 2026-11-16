# ステムセル研究所 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ステムセル研究所 |
| 証券コード | 7096 |
| docID（データを取り出した文書） | `S100YI32` |
| 原本 docID | `S100YI32` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI32.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ステムセル研究所 / 7096 / docID S100YI32（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
stemcell-institute: 2 件の数値を有報XBRLと照合
有報: 株式会社ステムセル研究所 有価証券報告書－第27期(2025/04/01－2026/03/31) (docID S100YI32)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
stemcell-institute: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の構成（技術料2,226百万円・保管料526百万円・その他58百万円）はMD&Aの販売実績の印字（2,226,568千円・526,077千円・58,698千円）を千円未満切り捨てで百万円表記にしたもの。3区分の合計は売上高と1百万円異なる（印字の千円額の合計も2,811,343千円で売上高2,811,344千円と1千円差がある。有報の印字どおり）。
- businessModel: MD&Aの利益に関する金額・理由は規則により書いていない。目標とする経営指標（年間保管（売上）検体数、自己資本比率の向上）や中期経営計画の数値目標（年間保管検体数20,000検体、想定市場シェア等）は、数値目標のため本文・perspectives に書いていない。
- businessModel: 前期有報（第26期）は単体決算であり、連結経営指標等の前期数値は印字されていないため、前期との比較は書いていない。訂正有報はなく、修正再表示の印字もないことを確認した。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されている。
- businessModel: シンガポールの細胞処理センターおよび細胞保管センターの完成（2026年6月）は決算日後の出来事のため、needsReview に入れた。
- businessStructure: suppliers はこのツリーの旧スキーマに無いため省略した。採取協力病院へ採取技術料を支払っている旨は【事業の内容】に印字されている。
- businessStructure: 単一セグメント（細胞バンク事業）のため、子区分は【事業の内容】のサービス区分で構成し、金額は独立開示がないため書いていない。売上高の構成（技術料2,226,568千円・保管料526,077千円・その他58,698千円）はMD&Aの販売実績の印字で、合計は2,811,344千円と1千円差がある（印字どおり）。
- businessStructure: 連結子会社は2社（STEMCELL INNOVATIONS PTE. LTD.（議決権50.0％、特定子会社）、株式会社ミルケア（議決権100.0％））。
- businessStructure: セグメント利益は規則により書いていない。
- history: 沿革の全行から主要な転機を選んだ。地域オフィスの開設（大阪・福岡・名古屋）、大学との個別の共同研究契約の締結、細胞保管センターの個別の新設・移設などは省略した。
- history: 2026年6月のシンガポールの細胞処理センターおよび細胞保管センターの完成は決算日（2026年3月31日）後の出来事ですが、沿革に印字されているため記載し、needsReview にも入れた。
- history: 資本金の金額は規則により沿革に書いていない。
- industry: 単一セグメント（細胞バンク事業）のため業界は1つだけ付けた。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ）: 同社の永久社債を投資有価証券として保有しているのみで、取引・提携の印字がないため結ばない。
- relatedCompanies: base-4481（ベース株式会社）: 「連結ベース」等の一般語の一致で、同社との関係の印字がないため結ばない。
- relatedCompanies: en（エン株式会社）: ambiguous で、「自家臍帯由来細胞」等の部分一致のみのため結ばない。
- relatedCompanies: career（株式会社キャリア）: 「キャリア研修」等の一般語の一致で、同社との関係の印字がないため結ばない。
- relatedCompanies: space（株式会社スペース）: 「リフレッシュスペース」等の部分一致で、同社との関係の印字がないため結ばない。
- relatedCompanies: king（株式会社キング）: 「ティッシュエンジニアリング」等の部分一致で、同社との関係の印字がないため結ばない。
- relatedCompanies: ray（株式会社レイ）: ambiguous で部分一致のみのため結ばない。
- relatedCompanies: daiwa（株式会社大和）: ambiguous で、大株主の住所等の一致のみのため結ばない。
- relatedCompanies: idea-consultants（いであ株式会社）: 「経費」等の文中の部分一致で、同社との関係の印字がないため結ばない。
- relatedCompanies: lec（レック株式会社）: 取引の相手は同社の子会社であるストレックス株式会社（緩慢凍結機器の購入・メンテナンス）であり、レック株式会社本人との関係の印字がないため結ばない。別法人を代替しない。
- relatedCompanies: port（ポート株式会社）: 「レポート」等の部分一致で、同社との関係の印字がないため結ばない。
- relatedCompanies: seki（セキ株式会社）: ambiguous で、「リスク管理体制」等の部分一致のみのため結ばない。
- relatedCompanies: slogan（スローガン株式会社）: 「コーポレートスローガン」の一般語の一致で、同社との関係の印字がないため結ばない。
- relatedCompanies: suzuki-6785（株式会社鈴木）: ambiguous で、役員の氏名等の一致のみのため結ばない。
- relatedCompanies: taya（株式会社田谷）: ambiguous で、大株主の住所（東京都世田谷区）等の一致のみのため結ばない。
- relatedCompanies: 連結子会社の株式会社ミルケアとSTEMCELL INNOVATIONS PTE. LTD.は非上場で related-candidates.json に無いため結ばない（自社の子会社でもある）。
- relatedCompanies: 主要な顧客ごとの情報は、売上高の10％以上を占める相手先がないため有報に記載がなく、結べる顧客はない。
- terms: 助言のみ。用語候補: 「さい帯血」（へその緒や胎盤に含まれる赤ちゃんの血液。造血幹細胞等を含む）、「さい帯」（お母さんと赤ちゃんをつなぐへその緒）、「間葉系細胞」（複数の細胞系譜へ分化可能な性質を持つ細胞）、「造血幹細胞」（血液の源となる細胞）、「細胞処理センター（CPC）」（採取された細胞の分離・処理を行う施設）、「培養上清」（細胞を培養した際に得られる分泌物を含む液体）、「AABB」（輸血・細胞治療分野の国際認証基準）。

## 要確認（status に反映）

- businessModel: 子会社STEMCELL INNOVATIONS PTE. LTD.のシンガポールにおける細胞処理センター（CPC）及び細胞保管センター（CCC）が、決算日後の2026年6月に完成しました（沿革に記載）。シンガポール保健省（MOH）の事業許可を得て2027年3月期半ばの稼働開始を予定しており、登録は2026年3月31日現在の体制に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 株式会社ステムセル研究所の主たる業界（細胞バンク事業） → 提案: 細胞バンク（再生医療関連サービス）。主たる事業は、さい帯血・さい帯等の周産期組織由来細胞の保管と再生医療・細胞治療分野での利用支援であり、医薬品の製造販売ではありません。閉じた分類に細胞バンクや再生医療関連サービスを表す値がないため、最も近い pharmaceuticals を暫定としました。
