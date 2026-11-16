# AppBank — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＡｐｐＢａｎｋ株式会社 |
| 証券コード | 6177 |
| docID（データを取り出した文書） | `S100XVHM` |
| 原本 docID | `S100XVHM` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVHM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＡｐｐＢａｎｋ株式会社 / 6177 / docID S100XVHM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
appbank: 8 件の数値を有報XBRLと照合
有報: ＡｐｐＢａｎｋ株式会社 有価証券報告書－第14期(2025/01/01－2025/12/31) (docID S100XVHM)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":282413000,"latestFiling":342110000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":291623000,"latestFiling":388695000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":471982000,"latestFiling":490140000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":-170235000,"latestFiling":-194698000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":-179556000,"latestFiling":-280170000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":-289528000,"latestFiling":-378207000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":407017000,"latestFiling":414586000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":342126000,"latestFiling":276741000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":161500000,"latestFiling":280870000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":358343000,"latestFiling":334877000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":279197000,"latestFiling":149585000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":77974000,"latestFiling":28772000}]
利益・総資産・純資産・従業員数: 16 件を照合
すべて一致しました。
appbank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「AppBank株式会社」が EDINET の提出者名「ＡｐｐＢａｎｋ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報(第13期、S100VI2R)との修正再表示チェックで2021年12月期から2023年12月期の売上高・利益・総資産・純資産に差異が出た理由: 前期有報の対象期である第13期は連結財務諸表を作成しておらず(今期有報の主要な経営指標等の注3に明記)、前期有報側の比較値は連結ベースの数値ではないため差異が生じた。登録する数値はすべて今期有報の連結値である。
- businessModel: 経営方針に印字された中長期財務目標(売上高の年間CAGRや利益率の目標数値)は、投資の語にあたるため本文・perspectives のいずれにも書かなかった。
- businessModel: 提出後の2026年2月26日の取締役会で、資本金及び資本準備金の額の減少並びに剰余金の処分を2026年3月30日開催の第14回定時株主総会に付議することを決議し、同総会で承認可決された(重要な後発事象)。資本政策の手続きであるため needsReview ではなくここに記録する。
- businessModel: 2025年10月に資本業務提携先の拡大を行い、株式会社PLANA及び株式会社2WINSとの協業でAIソリューション事業を開始したことは、当期中の出来事として経営成績等の分析に印字されている。新規事業の詳細な収益区分は開示されていないため、事業としては独立させていない。
- businessStructure: この木のスキーマには suppliers キーが無いため、仕入先の事実はここに記録する: 2025年12月期の主な仕入先は株式会社サンテレビジョン(476,424千円、総仕入高の48.1％)と東京メトロポリタンテレビジョン株式会社(378,526千円、同38.2％)で、いずれもメディア共創企画事業におけるTV広告枠の仕入れによるものである(【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の仕入実績)。両社とも related-candidates.json に無いため関連企業には結んでいない。
- businessStructure: 主要な販売先は株式会社プラナコーポレーション東京(420,182千円、総販売高の33.8％)と株式会社プラナコーポレーション大阪(506,200千円、同40.7％)で、いずれもメディア事業向けである(同・販売実績)。両社は資本業務提携先である株式会社PLANAのグループ会社とみられるが、related-candidates.json に無いため関連企業には結んでいない。
- businessStructure: 連結子会社は株式会社PWAN(福岡県福岡市、議決権100.0％、システム及びソフトウェアの企画開発・コールセンター運営等)とmusica lab株式会社(大阪府大阪市、議決権100.0％、スポーツチーム向けマーケティング業務・各種グッズの企画・製造及び販売等)の2社で、2025年9月1日に株式交換により完全子会社化した(【関係会社の状況】)。自社の子会社であるため関連企業には結んでいない。
- businessStructure: セグメント別の外部顧客への売上高は、メディア事業983,723千円、IP＆コマース事業249,517千円、その他9,000千円、合計1,242,240千円(セグメント注記)。本文では千円額を百万円に切り捨てて表記したため、各事業の百万円額の合計(1,241百万円)は連結売上高の百万円表記(1,242百万円)と1百万円ずれる。セグメント利益は書いていない。
- history: 沿革の表は年月と事象が同じテキストブロックに連記されている形式で、行順どおり対応づけた。年月は history の形に合わせて年のみとした(月キーは書かない)。
- history: 2012年2月の株式会社ゼペットの全株式取得(AppBank Games株式会社への社名変更)、2013年のAppBank Storeの開設・設立、2014年のスタジオむらい株式会社の設立、2015年のapprime株式会社の設立とAppBank Games株式会社の吸収合併、2016年のスタジオむらい株式会社の吸収合併、2018年の株式会社apprimeの吸収合併、2020年の株式会社AppBank Storeの全株式譲渡・テーマ株式会社の設立・3bitter株式会社の全株式取得、2023年のテーマ株式会社の吸収合併、2024年の3bitter株式会社の全株式譲渡は、現在の事業の形を説明するうえで中核的でないため沿革には載せなかった。資本金の額は書いていない。
- industry: 主たる業界は、外部顧客への売上高の約8割を占めるメディア事業(自社メディア「AppBank.net」の運営、動画配信、他社メディアとの共創企画と広告枠販売)から media とした。閉じた分類に直接合う区分があるため暫定にはしていない。IP＆コマース事業は、IPコラボレーションによる物販・イベント、スポーツ団体向けグッズ企画製造、コールセンター運営が混在し、閉じた分類の単一区分には対応しないため、副次的な業界は付けなかった。
- relatedCompanies: sanrio(サンリオ)は、経営成績等の分析に人気キャラクターとの年間を通じた連続コラボレーションの実施が具体的に印字されているため business-partner として結んだ。説明に金額は書いていない。
- relatedCompanies: gaiax(ガイアックス)は、沿革に創業者が在籍していた会社として、また「AppBank.net」の生まれた経緯として印字されているが、現在の取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: 株式会社PLANA(2025年12月31日現在の筆頭株主、議決権割合10.44％)とクオンタムリープ株式会社(同1.00％)は資本業務提携先だが、related-candidates.json に無いため結ばなかった。株式会社プラナコーポレーション東京・大阪(主要な販売先)も候補に無いため結ばなかった。
- relatedCompanies: musica株式会社は大株主(同7.81％)だが、連結子会社のmusica lab株式会社とは別の法人であり、候補にも無いため結ばなかった。モルガン・スタンレーMUFG証券、楽天証券、SBI証券、JPモルガン証券等の大株主は純投資の金融機関であるため結ばなかった。
- relatedCompanies: 株式会社サンテレビジョンと東京メトロポリタンテレビジョン株式会社は主な仕入先(TV広告枠の仕入れ)だが、候補に無いため結ばなかった。Google LLC、株式会社ドワンゴ、TIKTOK PTE LTD.は動画プラットフォームの運営者として事業の内容に印字されているが、候補に無いため結ばなかった。
- relatedCompanies: en(旧会社名エン・ジャパン)、go(GO)、nissin(日新)、seki(セキ)、land(ランド)、tein(テイン)、base-4481(ベース)、max(マックス)、port(ポート)、vision(ビジョン)、pia(ぴあ)は、本文中の語の部分一致などによる機械抽出で、当該会社についての取引・提携・資本関係の記載はないため結ばなかった。
- terms: 助言のみ。用語としては「IPコラボレーション」「メディア共創企画」「推し活」「AX」「レベニューシェア」などが候補だが、本工程ではデータを持たない。

## 要確認（status に反映）

- businessModel: 継続企業の前提に関する重要事象等: 前事業年度までに9期連続して営業損失を計上し、当連結会計年度も営業損失170,888千円を計上したため、継続企業の前提に重要な疑義を生じさせるような事象又は状況が存在すると記載されている。会社は事業収益の改善等の対応策を実施しており、継続企業の前提に関する重要な不確実性は認められないと認識している。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
