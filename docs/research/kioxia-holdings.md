# キオクシアホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | キオクシアホールディングス株式会社 |
| 証券コード | 285A |
| docID（データを取り出した文書） | `S100YJ18` |
| 原本 docID | `S100YJ18` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ18.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | キオクシアホールディングス株式会社 / 285A / docID S100YJ18（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 31 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kioxia-holdings: 10 件の数値を有報XBRLと照合
有報: キオクシアホールディングス株式会社 有価証券報告書－第8期(2025/04/01－2026/03/31) (docID S100YJ18)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"NumberOfEmployees|2022-03-31","previousFiling":14203,"latestFiling":14199}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kioxia-holdings: 本文の金額 0 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…率の向上とコスト低減を進めることで、利益を確保しています。…）
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…生産効率とコスト競争力による利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空にした。変則決算・決算期変更・会計基準の変更は無く、前期有報との修正再表示チェックでも売上収益・純利益等の金額は全て一致している（従業員数の2022年3月期分のみ14,203人から14,199人へ改められているが、財務数値の注記対象ではないため warnings に記録するに留めた）。
- businessModel: 証拠パックの機械警告: 本文に「非継続事業」の記載があるとされるが、パックに抽出された節（sections.txt 等）の範囲では該当する注記を確認できなかった。売上収益と当期純利益は連結経営指標等の印字どおりに引用しており、範囲についての主張は本文に書いていないため、financialNotes への basis 記載は見送り、この警告への対応としてここに記録する。
- businessModel: Sandiskグループとの製造合弁契約は2026年1月に四日市工場分が2029年12月31日から2034年12月31日へ5年間延長され、製造サービスの対価として2026年から2029年に合計11億6,500万米ドルを受領する予定である（【事業の内容】）。将来の受領予定であり金額表記の規則にも触れるため本文には書かず、ここに記録する。
- businessModel: 2026年3月期の売上収益は2兆3,376億円（前期は1兆7,065億円）、親会社の所有者に帰属する当期利益は5,545億円（前期は2,723億円）と MD&A に印字されているが、本文の説明は定性的な記述に留め、金額は機械が入れる財務データに委ねた。
- businessStructure: 報告セグメントは「メモリ事業」単一のため、セグメント情報の【関連情報】（製品及びサービスに関する情報）に開示されたアプリケーション別区分（SSD & ストレージ／スマートデバイス／その他）を children にした。並び順は2026年3月期のアプリケーション別売上収益の大きい順（SSD & ストレージ 1,362,638百万円、スマートデバイス 759,978百万円、その他 215,012百万円）。
- businessStructure: listings の market は、表紙が市場区分を印字していないため付けていない（表紙の上場金融商品取引所名は「株式会社東京証券取引所」のみ。プライム市場への上場は【沿革】2024年12月の記載）。
- businessStructure: 製造合弁会社3社（フラッシュパートナーズ、フラッシュアライアンス、フラッシュフォワード）は議決権の50.1％を保有する共同支配事業（ジョイント・オペレーション）で、資産・負債・収益・費用の50％を連結に計上している。関連会社等として【関係会社の状況】に載るが、いずれも掲載済み企業ではないため relatedCompanies には含めていない。
- history: 【沿革】は(1)旧東芝メモリ株式会社設立前（参考情報）(2)設立以後 (3)当社設立以後の3部構成。設立前の項目は東芝におけるメモリ事業の事項である旨を各項目の書き方（主語）で示した。
- history: 年月の対応は表の行順どおりで、崩れた表ではないため対応づけの記録は不要と判断した。採用しなかった細目の製品・拠点の出来事は多数あるが、会社の形を変えた出来事と技術の節目を優先した。
- industry: 報告セグメントはメモリ事業の単一セグメントで、全てが半導体（NAND型フラッシュメモリ及び関連製品）の製造・販売であるため、業界は semiconductors を主たる業界として1つだけ付けた。
- relatedCompanies: fixstars（フィックスターズ）: 特定投資株式として、製品開発に関連して取引を行っていることが銘柄ごとに印字されており、株式数も500,000株と実質的な保有であるため結んだ。取引の向きは印字されていないため business-partner とした。
- relatedCompanies: hulic（ヒューリック）: 四日市工場の土地のセール・アンド・リースバック契約（2024年2月締結、信託期間は2034年3月31日まで）の相手方として印字されているが、一回性の資産譲渡と借地の組合せであり資金調達に類する契約であって、継続的な事業上の取引・提携とは性格が異なるため結ばなかった。
- relatedCompanies: tsubakimoto-chain（椿本チエイン）: 2025年12月に同社及びEAGLYS株式会社と共同で物流工程向けの画像認識システムを開発した旨の記載はあるが、研究開発活動の紹介における一回性の共同開発事例にとどまり、継続的な取引・提携関係の記載ではないため結ばなかった。
- relatedCompanies: en（エン）: ambiguous。「キオクシアエンジニアリング」等の部分一致で、エン株式会社についての記述ではない。
- relatedCompanies: base-4481（ベース）: 「ビット生産量ベース」「連結ベース」等の一般語の部分一致で、ベース株式会社についての記述ではない。
- relatedCompanies: seki（セキ）: ambiguous。「情報セキュリティリスク」等の部分一致で、セキ株式会社についての記述ではない。
- relatedCompanies: kohsoku（高速）: ambiguous。「高速化」「高速アクセス」等の一般語の部分一致で、株式会社高速についての記述ではない。
- relatedCompanies: step（ステップ）: 収益認識の「5ステップアプローチ」の部分一致で、株式会社ステップについての記述ではない。
- relatedCompanies: port（ポート）: 「顧客サポート」等の部分一致で、ポート株式会社についての記述ではない。
- relatedCompanies: the-lead（リード）: 「業界をリードする」の部分一致で、株式会社リードについての記述ではない。
- relatedCompanies: career（キャリア）: 「キャリア採用」の一般語の部分一致で、株式会社キャリアについての記述ではない。
- relatedCompanies: nissin（日新）: listing がコードリストに無く、文脈も新株予約権の期間等の断片で、株式会社日新についての記述ではない。
- relatedCompanies: vector（ベクトル）: 自社ソフトウェアの説明中の「ベクトル探索」の一般語で、株式会社ベクトルについての記述ではない。
- relatedCompanies: vision（ビジョン）: 「フラッシュビジョン有限会社」（2002年設立、2013年清算の旧製造合弁会社）の部分一致で、株式会社ビジョンではない。
- relatedCompanies: kel（ケル）: ambiguous。関係会社の表の断片に現れるだけで、ケル株式会社についての記述ではない。
- relatedCompanies: zero（ゼロ）: ambiguous。「ネットゼロ」の一般語の部分一致で、株式会社ゼロについての記述ではない。
- relatedCompanies: corona（コロナ）: 「新型コロナウイルス感染症」の部分一致で、株式会社コロナについての記述ではない。
- relatedCompanies: suzuki-6785（鈴木）: ambiguous。役員等の人名「鈴木洋」ほかの部分一致で、株式会社鈴木についての記述ではない。
- relatedCompanies: core（コア）: ambiguous。「コアデバイス（基幹部品）」の一般語の部分一致で、株式会社コアについての記述ではない。
- relatedCompanies: land（ランド）: 「ブランド名称」の部分一致で、株式会社ランドについての記述ではない。
- relatedCompanies: ray（レイ）: ambiguous。「フラッシュメモリ専業プレイヤー」の部分一致で、株式会社レイについての記述ではない。
- relatedCompanies: arata（あらた）: 監査法人の旧名称「PwCあらた有限責任監査法人」の部分一致で、株式会社あらたではない。
- relatedCompanies: freee（フリー）: 「フリー・キャッシュ・フロー」の一般語の部分一致で、フリー株式会社についての記述ではない。
- relatedCompanies: innovation（イノベーション）: 「イノベーションを創出」の一般語の部分一致で、株式会社イノベーションについての記述ではない。
- relatedCompanies: trust（トラスト）: 「日本マスタートラスト信託銀行株式会社（信託口）」の部分一致であり、純投資の信託口であるため結ばない。listing もコードリストに無い。
- relatedCompanies: hyper（ハイパー）: 「ハイパースケーラー」の一般語の部分一致で、株式会社ハイパーについての記述ではない。
- relatedCompanies: ic（IC）: ambiguous。「コントローラ（ICチップ）」の一般語の部分一致で、株式会社ICについての記述ではない。
- relatedCompanies: king（キング）: 「ワーキンググループ」の部分一致で、株式会社キングについての記述ではない。
- relatedCompanies: path（パス）: ambiguous。文脈にパス株式会社についての記述は無い。
- relatedCompanies: tein（テイン）: 「エンターテインメント」の部分一致で、株式会社テインについての記述ではない。
- relatedCompanies: 候補外の主要な相手: 大株主の株式会社東芝（発行済株式の17.59％、2026年3月31日現在）、主要な顧客のAppleグループ、製造合弁の相手方であるSandiskグループは、いずれも related-candidates.json に含まれない（掲載対象の国内上場会社ではない）ため結んでいない。
- terms: 助言: 「NAND型フラッシュメモリ」は用語集に未登録です。この会社の事業そのものを指す中心用語で、有報には不揮発性半導体メモリとしての説明（電源を切っても記憶が消えないメモリ）があるため、登録候補になります。
- terms: 助言: 「BiCS FLASH™」も未登録です。メモリセルを積み上げる積層化技術による3次元フラッシュメモリの製品名で、第8世代まで世代を重ねて事業説明の中心にあります。登録する場合は商標名の扱いに注意が要ります。
- terms: 助言: 「SSD（Solid State Drive）」も未登録です。半導体メモリを記憶素子とするストレージ製品の総称として、事業区分名（SSD & ストレージ）にも使われています。
- terms: semiconductor（半導体）、wafer（ウエハー）、front-end-process / back-end-process、discontinued-operations（非継続事業）、ifrs（IFRS）は登録済みのため、新規登録は不要です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
