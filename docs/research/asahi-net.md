# 朝日ネット — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社朝日ネット |
| 証券コード | 3834 |
| docID（データを取り出した文書） | `S100YEHW` |
| 原本 docID | `S100YEHW` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEHW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社朝日ネット / 3834 / docID S100YEHW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asahi-net: 10 件の数値を有報XBRLと照合
有報: 株式会社朝日ネット 有価証券報告書－第36期(2025/04/01－2026/03/31) (docID S100YEHW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
asahi-net: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは付けていない。主要な経営指標等の推移の注記は、潜在株式が存在しないこと、関連会社がないこと、株価の市場区分の注記、期末配当が定時株主総会の決議事項であることといった表示事項のみで、会計基準の変更・変則決算・決算期変更はない。
- businessModel: 前期有報との修正再表示チェックは全系列で差異なし（証拠パックの照合結果）。訂正報告書はない。
- businessModel: 経営方針・MD&Aに印字されたROEや1株当たり純利益などの投資指標の目標は、本文・perspectivesに書いていない。MD&Aの段階利益の金額・増減率、キャッシュ・フローの金額も書いていない。
- businessModel: 自己株式の取得は資本政策の手続きのため本文に書いていない。2026年4月の代表取締役社長執行役員の交代は【経営方針】に印字された提出後の体制変更で、グループ構成の変更ではないためwarningsにとどめた。
- businessModel: 重要な後発事象は「該当事項はありません」（連結・単体とも同文の注記）。【関係会社の状況】も「該当事項はありません」で、子会社・関連会社はない。
- businessStructure: セグメント情報はISP事業の単一セグメントで、セグメント注記は記載が省略されている。子事業の金額はMD&Aの販売実績（製品及びサービスごと）の印字を用いた。
- businessStructure: 子事業の内訳（ASAHIネット9,786百万円＋v6 コネクト2,415百万円＝12,201百万円、その他内訳も同様）は印字の合計（12,202百万円・1,315百万円）と1百万円ずれるが、有報の丸めであり印字の値をそのまま使った。
- businessStructure: 本社の設備のセグメント欄は「ISP事業及び全社（共通）」と連記されているため、特定の子事業には結びつけていない。帳簿価額は書いていない。
- businessStructure: このツリーの旧スキーマのため suppliers は付けていない。アクセス回線は提携電気通信事業者（NTT東日本・NTT西日本、KDDI、UQコミュニケーションズ、NTTドコモビジネス）との契約で調達している事実は【事業の内容】・【重要な契約等】に印字されている。
- businessStructure: ADSL接続サービスは回線提供元のサービス終了に伴い2026年1月31日をもって提供を終了している（MD&A）。
- history: 沿革の後半は年月セルと事象文が分かれて印字される崩れた表で、年月14件に対し事象文16件と数が一致しないため、行順の対応づけはしていない。他の節で日付を裏付けられる行だけを使った：v6 コネクト提供開始（【事業の内容】のサービス開始時期2018年9月）、AsahiNet 光電話（同2019年7月）、AsahiNet 光クロス（同2020年4月）、WiMAX +5G（同2023年5月）、プライム市場移行（経営指標等の注記に2022年4月4日よりプライム市場と印字）。
- history: 日付を裏付けられなかったため落とした行：会員数60万人達成、v6 コネクトのホームゲートウェイ上でのDS-Lite方式提供開始、会員向けDS-Lite方式提供開始、manaba全学導入校数100校達成、WiMAX +5Gの固定IPアドレスプラン開始、「フレッツ 光クロス Biz」提供開始、固定IPアドレスオプション（IPIP）提供開始、RBB TODAYの各アワード受賞。
- history: そのほか小項目（会員数の節目達成、本社の移転、海外子会社の設立・譲渡、個別の提携・サービス開始、AsaOne・アサブロの開始など）は省略した。1990年の設立時の資本金など資本の金額は書いていない。
- history: Wikipedia記事「朝日ネット」は見つかったが、冒頭は有報の事実（東証プライム上場のISP、ASAHIネットの展開）の言い換えのみで、補足に使わなかった。
- industry: 主たる業界は telecommunications とした。ISP事業の単一セグメントで、インターネット接続サービスの提供が事業の実体であり直接当てはまる。
- industry: 2つ目の業界は付けていない。教育支援サービス「manaba」はISP事業の単一セグメントの一部で、報告セグメントとして独立開示されていないため、業界を足していない。
- industry: DEIの別記事業は cte である。
- relatedCompanies: kddi：【重要な契約等】にFTTHサービスの提供に関する契約が印字されており、取引の向き（同社が回線サービスを提供）が分かるため supplier とした。
- relatedCompanies: ntt：有報が印字する契約相手はNTT東日本株式会社・NTT西日本株式会社・NTTドコモビジネス株式会社で、いずれもNTT株式会社とは別の法人格のため結ばなかった。
- relatedCompanies: softbank：イー・アクセス株式会社（現・ソフトバンク株式会社）とのADSL提携は2001年・2008年の沿革の出来事のみで、現在の取引・提携は印字されていないため結ばなかった。
- relatedCompanies: hikari-tsushin：大株主として印字されているのは光通信ＫＫ投資事業有限責任組合（投資事業有限責任組合）であり、株式会社光通信そのものではないため結ばなかった。
- relatedCompanies: fibergate：売掛金の相手先別内訳に名前があるだけで、取引関係・提携の印字がないため結ばなかった。
- relatedCompanies: kohsoku / como / port / seki / career / innovation / land / base-4481 / space：一般語・部分文字列の一致のみ（高速モバイル、ポートフォリオ等、スペースの提供、キャリア部門など）のため結ばなかった。
- relatedCompanies: tokai：有報が印字するのは株式会社TOKAIコミュニケーションズで、候補の株式会社トーカイとは別の法人のため結ばなかった。
- relatedCompanies: nissin / trust：現在のコードリストにない候補で、朝日新聞社の部分文字列・日本マスタートラスト信託銀行（信託口）の部分文字列のみのため結ばなかった。
- relatedCompanies: 候補にないため結べなかった相手：株式会社朝日新聞社（2013年に資本業務提携契約を締結し、2026年3月31日現在の大株主で8.56％を保有。創業時の出資者でもある）、NTT東日本株式会社・NTT西日本株式会社（相互接続協定・光コラボレーションモデルに関する契約）、UQコミュニケーションズ株式会社（卸通信サービスの契約）、NTTドコモビジネス株式会社（通信サービスに関する契約）はいずれも related-candidates.json にない。
- relatedCompanies: 特定投資株式は「該当事項はありません」。非上場株式のみを保有している。
- terms: 「ASAHIネット」「AsahiNet 光」「v6 コネクト」「manaba」は同社のサービス名称として有報で用いられており、そのまま用いた。
- terms: ISP・VNE・POI・LMS・バックボーン回線・アクセス回線は【事業の内容】の用語集に定義が印字されており、その定義に沿って用いた。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
