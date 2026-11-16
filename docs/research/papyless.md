# パピレス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社パピレス |
| 証券コード | 3641 |
| docID（データを取り出した文書） | `S100YJ7Y` |
| 原本 docID | `S100YJ7Y` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ7Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社パピレス / 3641 / docID S100YJ7Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
papyless: 10 件の数値を有報XBRLと照合
有報: 株式会社パピレス 有価証券報告書－第32期(2025/04/01－2026/03/31) (docID S100YJ7Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
papyless: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益（純損失）だけに限った。その他の利益の金額・増減率、仕入実績の金額、資産・負債の金額は書いていない。
- businessModel: financialNotes は空にした。主要な経営指標等の注記は、損失計上年度の希薄化後数値と株価収益率を記載しない旨のみで、会計基準の変更や変則決算などの基準変更はない。前期有報との修正再表示チェックも全系列で差異がなかった。
- businessModel: 経営上の目標（国内の電子書籍販売売上高シェア第１位など）は順位・シェアの目標であるため、本文にも perspectives にも書かなかった。
- businessModel: industryPosition は書かなかった。電子書籍の市場規模の推計値（外部の調査報告書によるもの）は経営成績の分析に印字されているが、当社自身のシェアや順位の数値は印字されていないためである。
- businessModel: 完全子会社の吸収合併（2026年4月1日実施）は決算日後の構造変更であるため needsReview に入れた。
- businessModel: Wikipedia の記事「パピレス」の冒頭は有報の事実の言い換えのみで補足がなかったため、出典として使わなかった。
- businessStructure: セグメントの並び順はセグメント注記の外部顧客への売上高の順とした。IP制作事業は2026年3月期に外部顧客への売上高の発生がないため最後に置き、その旨を本文に明記した。
- businessStructure: 設備と事業の対応は有報のセグメント欄どおりとした（提出会社の本社は電子書籍事業、JadeComiX株式会社の本社はIP制作事業、巴比楽視網路科技股份有限公司の本社は電子書籍事業）。帳簿価額は書いていない。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。仕入に当たる事実は、販売された電子書籍の利用価格と販売数に応じて出版社又は著者等へ著作権料を支払う仕組みであり、個別の仕入先名は【事業の内容】に印字されていないため、businessModel の revenueSources と warnings に記録するにとどめた。
- businessStructure: 完全子会社の吸収合併（2026年4月1日実施）は決算日後の構造変更であるため needsReview に入れ、2026年3月31日現在の構成で登録した。
- businessStructure: PAPYLESS HONG KONG CO.,LTD.は中国の電子書籍販売サイト向けの提供が「予定」と印字されているため、海外向け販売の子の説明では運営中とは書かなかった。
- history: 沿革の2017年５月・2018年４月・2019年７月の年月セルは事象文と分かれて印字される崩れた表だった。年月が３つ、事象文が３つで数が同じため、行順で Papyless Global,Inc.設立（2017年）、PAPYLESS HONG KONG CO.,LTD.設立（2018年）、アルド・エージェンシー・グローバル株式会社設立（2019年）に対応づけた。history には年だけを記録している。
- history: 1995年の設立時の資本金（20,000千円）は金額であるため書かなかった。
- history: すべての history 項目に significance を付けた（このツリーの必須要件）。
- history: Wikipedia の記事「パピレス」があったが、冒頭の記述は有報に印字された事実（富士通の社内起業制度による設立、2000年の現社名への変更）の言い換えのみで、有報に無い補足はなかったため、出典として使わなかった。
- industry: 主たる業界は、外部顧客への売上高のすべてを占める電子書籍事業の実体（電子書籍コンテンツの配信・販売プラットフォーム）に基づき media とした。閉じた分類に直接合う区分があり、暫定ではない。
- industry: IP制作事業は報告セグメントとして開示されているが、2026年3月期は外部顧客への売上高の発生がないため、2つ目の業界は付けなかった。
- relatedCompanies: sega-sammy-holdings: 資本業務提携と合弁会社JadeComiXの共同設立が印字され、大株主（10.37％、2026年3月31日現在）でもある。取引・提携の向きが印字されていないため business-partner とし、持株の事実も説明に含めた。
- relatedCompanies: land: 「ブランド」「レンタル」の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: scroll: 「縦スクロール」の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: base-4481: 「ユーザーベース」の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」は経営方針等の一般語としての使用のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: jeol: 「日本電子書店連合」（業界団体名）の部分一致で日本電子株式会社とは別法人であり、同社との関係の印字はないため結ばなかった。
- relatedCompanies: king: 「ランキング」の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: beaglee: 日本電子書店連合の発起人の一社と印字されているが、団体への共同参画の記載のみで、同社との取引・提携の印字はないため結ばなかった。
- relatedCompanies: fuji-8278: ambiguous の候補で、当社の旧社名「株式会社フジオンラインシステム」の部分一致であり、同社との関係の印字はないため結ばなかった。
- relatedCompanies: fujitsu: 創業者である天谷幹夫が社外ベンチャー制度を利用した古巣として沿革に印字されるのみで、現在の取引・提携の印字はないため、沿革の事実としてのみ記録し結ばなかった。
- relatedCompanies: garden: セガサミーホールディングス株式会社の住所（住友不動産大崎ガーデンタワー）の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: heiwa: ambiguous の候補で、オリジナル作品のタイトル文中の「国が平和に」の部分一致のみのため結ばなかった。
- relatedCompanies: hit: 「ヒットコンテンツ」の一般語としての部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: nissin: 現在のコードリストにない候補で、新株予約権の行使期間の印字中の日付の断片の一致のみのため結ばなかった。
- relatedCompanies: port: 「顧客サポート」の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: seki: ambiguous の候補で、常任代理人の名称中の部分一致のみのため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development: セガサミーホールディングス株式会社の住所の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: will: 「コンピューターウィルス」の部分一致のみで、同社との関係の印字はないため結ばなかった。
- relatedCompanies: 候補外のため結ばなかった相手: インフォコム株式会社は前期（2025年2月）に自己株式の取得に応じて主要株主ではなくなっており、当期の関係の印字はない。連結子会社6社は自社の子会社であるため結ばなかった。
- terms: 助言のみ。用語候補: Renta!（同社の電子書籍レンタルサイト）、タテコミ（縦スクロール型のフルカラーコミック）、アニコミ（マンガにモーションと音声を付けたタテ型アニメーション形式の動画コンテンツ）、ZETooN（JadeComiXのWebtoonレーベル）、著作権料（出版社や著者に対して支払われる、電子書籍の利用価格と販売数に応じた対価）

## 要確認（status に反映）

- businessModel: 連結子会社の株式会社ネオアルドについて、2026年４月１日付で当社が吸収合併を実施しています（2025年12月15日の取締役会で決議し、2026年１月５日に吸収合併契約を締結。【重要な後発事象】に印字）。本登録は2026年３月31日現在のグループ構成（ネオアルドは連結子会社として存続）に基づいており、合併後の取扱いは人の確認が必要です。
- businessStructure: 連結子会社の株式会社ネオアルドについて、2026年４月１日付で当社が吸収合併を実施しています（2025年12月15日の取締役会で決議し、2026年１月５日に吸収合併契約を締結。【重要な後発事象】に印字）。本登録は2026年３月31日現在のグループ構成（ネオアルドは連結子会社として存続）に基づいており、合併後の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
