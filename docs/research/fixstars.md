# フィックスターズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社フィックスターズ |
| 証券コード | 3687 |
| docID（データを取り出した文書） | `S100XAQJ` |
| 原本 docID | `S100XAQJ` |
| 提出日（原本） | 2025-12-16 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XAQJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社フィックスターズ / 3687 / docID S100XAQJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fixstars: 10 件の数値を有報XBRLと照合
有報: 株式会社フィックスターズ 有価証券報告書－第24期(2024/10/01－2025/09/30) (docID S100XAQJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fixstars: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と当期純利益だけにした。MD&Aに印字されたその他の損益の金額・増減率、研究開発費、キャッシュ・フローの金額、経営指標としての利益率等の数値は書いていない。
- businessModel: 主要な顧客であるキオクシアとネクスティエレクトロニクスについては金額と割合を書かず、名称だけを flow に記した。
- businessModel: 前期有報との修正再表示チェックは全系列（売上高・当期純利益・経常利益・総資産・純資産・従業員数）で差異なしだった。パックの「組替え」注意については、本文中の組替の語はその他の包括利益に関する組替調整額を指すもので、経営指標等の表示の基礎を変えるものではないと判断した。主要な経営指標等の注記のうち基礎の変更に当たるのは収益認識基準の適用（第21期の期首から）だけで、financialNotes に記録した。注記１（平均臨時雇用者数の記載省略）と注記２（潜在株式調整後１株当たり当期純利益の記載省略）は基礎の変更ではないため financialNotes には入れなかった。
- businessModel: 表紙に注記された本店所在地の移転予定（2025年12月21日より新所在地へ）は提出後の予定事項であり、完了とは書かなかった。
- businessModel: 株式会社Drone Autopilot Labの解散決議は当期中（2025年７月）だが清算結了は期末後の2025年11月のため、needsReview に入れた。株式会社Smart Opinionの議決権比率の低下（57.0%）は当期中の出来事で期末の構成に反映済みのため warnings のみとした。
- businessStructure: 【主要な設備の状況】の本社はセグメント欄が「Solution事業 SaaS事業」と連記されているため、どの事業にも結びつけなかった。帳簿価額は書いていない。
- businessStructure: Solution事業の注力分野（Semiconductor／Mobility／Industrial／Life Science／Finance）とSaaS事業の各サービスは金額が独立して開示されていないため、子区分には金額を書いていない。
- businessStructure: その他（CVC事業）はセグメント情報で外部顧客への売上高が「－」と印字されており金額が無いため、金額が無い旨を明記して最後に置いた。
- businessStructure: 株式会社Smart Opinionは2025年５月23日付の第三者割当増資により議決権比率が57.0%に低下したが、当期中の出来事であり期末現在の構成に反映されているため needsReview にはしなかった。株式会社Siderは2025年２月に清算結了し当期中に連結子会社でなくなったため、期末の構成には含めていない。
- businessStructure: suppliers はこのツリーの旧スキーマに無いため省略した。仕入先の個別名は【事業の内容】に印字されていない（ハードウェアの選定・提供は事業の説明に記した）。
- businessStructure: 表紙には本店所在地の移転予定（2025年12月21日より東京都港区芝浦一丁目１番１号へ）が注記されているが、登記上の本店は提出日現在で東京都港区芝浦三丁目１番１号であり、移転は提出後の予定のため事業の説明には書かなかった。
- history: 沿革の表は年月と事象が対応して印字されており、年だけを取り出して記録した（月は書いていない）。設立時の資本金等の金額は書いていない。
- history: 次の項目は軽微なため沿革から省いた: 2006年の「PS３® Information Site」の立ち上げ、2009年の書籍「OpenCL入門」の出版、2018年のNEDO採択（量子コンピュータ向けミドルウェアの研究開発プロジェクト）。
- history: Wikipediaの記事「フィックスターズ」は証券コード3687で同一性を確認できたが、冒頭の内容は有報の事実の再掲が中心で、上場年など有報と異なる記述も含むため、補足には使わなかった。
- industry: 主たる業界は it とした。Solution事業（売上の95%超）はソフトウェア開発・高速化サービスであり、SaaS事業もソフトウェアのサービス提供で、事業の実体はソフトウェア開発・提供のため直接当てはまる。半導体は顧客の分野（ファームウェア・デバイスドライバ開発の対象）であって自ら半導体や部材・装置を製造・販売する事業ではないため、semiconductors は付けなかった。閉じた分類で言い表せるため暫定分類にはしなかった。
- relatedCompanies: kohsoku（高速）: ambiguous で、「高速化」「高速処理」等の部分一致のみのため結ばなかった。
- relatedCompanies: en（エン）: ambiguous で、「エンジニア」等の部分一致のみのため結ばなかった。
- relatedCompanies: core（コア）: ambiguous で、「マルチコア」の部分一致のみのため結ばなかった。
- relatedCompanies: rhythm（リズム）: 「アルゴリズム」の部分一致のみのため結ばなかった。
- relatedCompanies: land（ランド）: 「ブランド」の部分一致のみのため結ばなかった。
- relatedCompanies: seki（セキ）: ambiguous で、「セキュリティ」等の部分一致のみのため結ばなかった。
- relatedCompanies: slogan（スローガン）: 「スローガン」の語の部分一致のみのため結ばなかった。
- relatedCompanies: freee（フリー）: 「フリーキャッシュ・フロー」の部分一致のみのため結ばなかった。
- relatedCompanies: vision（ビジョン）: 「ハイビジョン」「マシンビジョン」「中期経営ビジョン」等の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「営業利益ベース」の部分一致のみのため結ばなかった。
- relatedCompanies: corona（コロナ）: 「コロナ禍」の部分一致のみのため結ばなかった。
- relatedCompanies: path（パス）: ambiguous で、「データパス」「キャリアパス」の部分一致のみのため結ばなかった。
- relatedCompanies: ray（レイ）: ambiguous で、「プレイヤー」の部分一致のみのため結ばなかった。
- relatedCompanies: renesas-electronics（ルネサスエレクトロニクス）: 前期（2024年9月期）の【主要な顧客ごとの情報】に主要な顧客として印字されているが、当期（2025年9月期）の主要な顧客には印字されておらず、当期の取引・提携を述べる記述が無いため結ばなかった。
- relatedCompanies: software-service（ソフトウェア・サービス）: 売上原価明細書の科目の見出し「ソフトウェア・サービス」の一致のみで、同社についての記述は無いため結ばなかった。
- relatedCompanies: trust（トラスト）: 現在のコードリストに無く、「日本マスタートラスト信託銀行（信託口）」等の信託口の部分一致のみのため結ばなかった。
- relatedCompanies: zero（ゼロ）: ambiguous で、「カーボンネットゼロ」等の部分一致のみのため結ばなかった。
- relatedCompanies: alpha-4760（アルファ）／alpha（アルファ）: 一般語の部分一致のみで、両社についての記述は無いため結ばなかった。
- relatedCompanies: career（キャリア）: 「キャリアパス」の部分一致のみのため結ばなかった。
- relatedCompanies: fusic（Fusic）: 特定投資株式として前期に20,000株を保有していたが、当期は純投資目的以外の保有は無く、当期中に保有目的を純投資目的へ変更し売却を検討する方針と印字されている。保有目的も「関係の維持・強化」の定型句のため結ばなかった。
- relatedCompanies: 候補一覧に無い相手: キオクシア株式会社は当期の主要な顧客であり大株主（発行済株式の1.55％、2025年９月30日現在）でもあるが、候補一覧に無いため結ばなかった。株式会社ネクスティエレクトロニクスは当期の主要な顧客であり、連結子会社Fixstars Autonomous Technologiesの合弁相手でもあるが、候補一覧に無いため結ばなかった。D-Wave Systems Inc.は沿革に協業開始が印字されるが候補一覧に無い。連結子会社7社は自社の子会社であり関連企業としては結ばない。
- terms: 助言のみ。用語としては「マルチコア」「GPU」「FPGA」「量子コンピュータ」「アクセラレータ」「ミドルウェア」「HFT」「LLM」「SaaS」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 連結子会社の株式会社Drone Autopilot Labは、2025年７月31日付で解散を決議し、2025年11月に清算が結了しています（【関係会社の状況】の注記に印字）。本登録は2025年９月30日現在のグループ構成（同社は連結子会社として存続）に基づいて作成しており、清算結了後の取扱いは人の確認が必要です。
- businessStructure: 連結子会社の株式会社Drone Autopilot Labは、2025年７月31日付で解散を決議し、2025年11月に清算が結了しています（【関係会社の状況】の注記に印字）。本登録は2025年９月30日現在のグループ構成（同社は連結子会社として存続）に基づいて作成しており、清算結了後の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
