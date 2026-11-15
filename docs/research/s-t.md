# エステー — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エステー株式会社 |
| 証券コード | 4951 |
| docID（データを取り出した文書） | `S100YD9M` |
| 原本 docID | `S100YD9M` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD9M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エステー株式会社 / 4951 / docID S100YD9M（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
s-t: 10 件の数値を有報XBRLと照合
有報: エステー株式会社 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YD9M)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
s-t: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はMD&A及びセグメント関連情報の百万円印字のとおり転記した（千円印字からの換算はしていないため、切り捨て換算は発生していない）。
- businessModel: 中期経営計画「SMILE 2027」の財務目標（営業利益・営業利益率・ROE等）は収益性・投資指標であるため、戦略の本文には記載せず本warningsに記録するにとどめた（2027年3月期目標：売上高520億円等も将来情報のため同様）。
- businessModel: businessModelのsuppliersは省いた。当社の調達について有報が使う一般名詞の印字がなく（MD&Aに「調達先見直し」の語があるのみ）、具体的な調達先は株式の保有状況の大日本印刷株式会社へのリンクで表した（eiwa・sugimoto-and-coの先例）。
- businessModel: 純利益の減少理由としてMD&Aが挙げる前期の負ののれん発生益の消滅は、特別損益に関わる理由に当たるため本文には記載していない。
- businessModel: 前期有報との修正再表示チェックは全項目で差異なし。決算期の変更・変則決算・会計方針の変更の印字はなく、financialNotesは空とした。
- businessModel: Wikipediaの記事「エステー」があったが、冒頭文は有報の記載と重なる日用雑貨メーカーの説明のみで、有報に無い補足は得られなかったため使用していない。
- businessStructure: 単一セグメント（生活日用品事業）のため、子区分は【事業の内容】のカテゴリーとMD&Aのカテゴリー別売上高に基づく7カテゴリーで構成した。並び順は外部顧客への売上高の大きい順。
- businessStructure: 金額はMD&Aのカテゴリー別売上高表の百万円印字のとおり転記した。カテゴリー合計48,490百万円と印字の連結売上高48,492百万円との2百万円の差は印字の丸めによるもので、そのまま記録した。
- businessStructure: 連結子会社8社（エステーＰＲＯ、エステーマイコール、Ｓ．Ｔ．（タイランド）、ファミリーグローブ（台湾）、エステーコリアコーポレーション、日本かおり研究所、コードミー、PetBit）と持分法適用関連会社1社（ＮＳファーファ・ジャパン）は当社グループの会社であり、関連企業リンクの対象ではないため構造の説明にとどめた。
- businessStructure: ファミリーグローブ（台湾）は議決権所有割合49.0％だが、実質的に支配しているため連結子会社とされている旨が関係会社の状況に注記されている。
- history: 沿革の主要な転機を選んで収録した。創業・設立時の資本金の金額は、禁止金額（資本金）に当たるため記載していない。
- history: 2025年7月のエステービジネスサポート株式会社の吸収合併は、重要な契約等にも決議・契約締結が印字された期中の完了事項であり、期末現在の構造に反映されているため、needsReviewではなく沿革と本warningsに記録した。
- industry: 主たる業界は、単一セグメントの生活日用品事業（消臭芳香剤・防虫剤・除湿剤などの化学日用品の製造販売）に基づき化学（chemicals）とした。閉じた集合に日用品専用の区分は無いが、化学が最も近い。
- relatedCompanies: 特定投資株式の保有目的の末尾は全銘柄共通の定型句だが、各銘柄の取引の役割（製品の販売・卸売、主要な調達先、EDIサービス、業務提携）が銘柄ごとに個別に印字されているため、その役割に基づいて結んだ（fujicco・imurayaの先例）。
- relatedCompanies: 株式会社PALTACは主要な顧客（2026年3月期の販売実績16,751百万円、34.5％）であり特定投資株式339,000株も保有するが、related-candidates.jsonに無く百科事典の候補に無いため結ばず、事実を本warningsとindustryPositionに記録した。
- relatedCompanies: 株式会社マツキヨココカラ＆カンパニー（特定投資株式39,576株、製品の販売先）もrelated-candidates.jsonに無いため結ばなかった。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループとみずほフィナンシャルグループは、保有目的が取引金融機関の持株会社としての関係維持であり資金調達に関わるため結ばなかった。大株主の株式会社三菱ＵＦＪ銀行（所有割合2.49％）も金融機関のため結ばなかった。
- relatedCompanies: 当期に保有目的を検討して全株を売却し期末保有が無くなったツルハホールディングス、フジ、ウエルシアホールディングス（旧グローウェル）、エイチ・ツー・オー リテイリング、サンデー、イズミは結ばなかった。ヤオコーは株式会社ブルーゾーンホールディングスへの株式移転により期末保有が無くなったため結ばなかった。
- relatedCompanies: 持分法適用関連会社のＮＳファーファ・ジャパン株式会社（議決権25.0％、資本業務提携）は未上場で百科事典の項目が無いため結ばず、関係会社の状況の事実をbusinessStructureのwarningsに記録した。
- relatedCompanies: 候補のうちland（土地の語）、innovation（イノベーションの語）、en（エンゲージメントの語、ambiguous）、port（サポートの語）、career（キャリア人財の語）、suzuki-6785（大株主の個人名、ambiguous）、trust（信託銀行の名称の一部、コードリストにない）、path（パーパスの語、ambiguous）、zett（商品名の一部）、base-4481（ベースの語）、core（コア技術の語、ambiguous）、no-1（市場シェアNo.1の語）、cover（カバーの語）、freee（香調名フリージアの一部）、itsumo（「いつも」の語）、step（ステップの語）、taya（地名・個人名の一部、ambiguous）、yaoko（期末保有なし）は、社名の単語一致のみで当社との取引・提携・資本関係の印字が無いため結ばなかった。
- terms: 助言: 用語「消臭力」は、当社のエアケア（消臭芳香剤）の主力ブランドで、事業の内容とMD&Aに印字されています。
- terms: 助言: 用語「ムシューダ」は、当社の衣類ケア（防虫剤）の主力ブランドで、事業の内容とMD&Aに印字されています。
- terms: 助言: 用語「ドライペット」は、当社の湿気ケア（除湿剤）のブランドで、事業の内容に印字されています。
- terms: 助言: 用語「ニャンとも清潔トイレ」は、当社のペットケア（猫用トイレ用品）のブランドで、2024年6月に事業を取得したことが沿革に印字されています。
- terms: 助言: 用語「SMILE 2027」は、2024年4月からスタートした3ヵ年の中期経営計画の名称で、MD&Aに印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
