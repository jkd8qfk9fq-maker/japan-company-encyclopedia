# ラウンドワン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ラウンドワン |
| 証券コード | 4680 |
| docID（データを取り出した文書） | `S100YJKU` |
| 原本 docID | `S100YJKU` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJKU.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%A6%E3%83%B3%E3%83%89%E3%83%AF%E3%83%B3

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ラウンドワン / 4680 / docID S100YJKU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
round-one: 10 件の数値を有報XBRLと照合
有報: 株式会社ラウンドワン 有価証券報告書－第46期(2025/04/01－2026/03/31) (docID S100YJKU)
前期有報との比較: 36 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
round-one: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益と当期利益は第45期よりIFRS会計基準の表のものを使った。日本基準の表は2025年3月期までしかないため、2026年3月期の数値はIFRS表のものを使った。
- businessModel: 表示方法の変更（その他の金融資産の独立掲記）は連結財政状態計算書の組替えのみで、売上収益と当期利益の範囲に変更はないため、financialNotes には追加していない。
- businessModel: 2022年10月1日付の1株につき3株の株式分割は1株当たり数値のみのため注記していない。
- businessModel: 店舗数は経営方針の節の印字（日本99店舗、米国59店舗、中国3店舗）を使った。
- businessStructure: 売上収益と当期利益は第45期よりIFRS会計基準の表のものを使った。日本基準の表は2025年3月期までしかないため、2026年3月期の数値はIFRS表のものを使った。
- businessStructure: 販売実績の内訳の合計とセグメント合計には2百万円の差があるが、有報の丸めによるもので、印字の金額をそのまま記載した。
- businessStructure: その他の children の金額は独立して開示されていないため記載していない。
- businessStructure: 表示方法の変更（その他の金融資産の独立掲記）は連結財政状態計算書の組替えのみで、売上収益と当期利益の範囲に変更はないため、financialNotes には追加していない。
- businessStructure: 中国での「朗玩（ラウワン）」という名前は Wikipedia の補足を使った。
- history: 1990年の石津店のオープン、1995年の本社移転、2001年の有限会社ウィズとの合併、2020年のロシア第1号店のオープン、2025年のラウンドワンデリシャスの事業譲渡などは、15件の枠に入らなかったため落とした。
- history: 1997年は関東第1号店のオープンと大阪証券取引所への上場の2件の出来事があるため、1行にまとめた。
- history: 2019年は朗玩（中国）文化娯楽有限公司への出資と本社の移転の2件の出来事があるため、1行にまとめた。
- industry: 屋内型複合レジャー施設の運営が主たる事業のため、エンターテインメントを主たる業界としました。中国の施設運営と米国の飲食事業は報告セグメントに含まれないため、業界は付けていません。
- relatedCompanies: GENDA：2019年にKiddleton, Inc.の合弁契約を共同で締結したが、2023年9月に所有株式をGENDAに譲渡し、合弁契約を解消したため、現在の関係はないとして結ばない。
- relatedCompanies: amuse：「アミューズメント」の語の断片一致のみで、株式会社アミューズとの取引・提携の印字がないため結ばない。
- relatedCompanies: en：「エンターテインメント」などの語の断片一致のみで、エン株式会社との取引・提携の印字がないため結ばない。
- relatedCompanies: tein・base-4481・land・step・king・zero・core・corona・cover・freee・nissin・ray：語の断片一致のみで、取引・提携の印字がないため結ばない。
- relatedCompanies: aeon-mall：イオンモールは中国第1号店の出店先の施設名で、イオンモール株式会社との取引・提携の印字がないため結ばない。
- relatedCompanies: trust：日本マスタートラスト信託銀行は信託口の大株主で、取引関係の印字がないため結ばない。
- relatedCompanies: 大株主の状況の杉野公彦は個人、SMBC信託銀行・日本カストディ銀行などは信託口・海外の保管機関のため結ばない。三井住友トラスト・アセットマネジメントの大量保有報告は会社が実質所有を確認できていないため大株主の状況に含まれておらず、結ばない。
- relatedCompanies: 連結子会社9社はすべて非上場のため結ばない。
- relatedCompanies: 株式の保有状況は「記載すべき事項はありません」のため、政策保有株式による関連企業はない。
- relatedCompanies: エスケイジャパンを持分法適用関連会社と特定した根拠は、沿革の2021年11月の行の「（現・持分法適用関連会社）」の印字と、関係会社の状況の関連会社1社の印字である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
