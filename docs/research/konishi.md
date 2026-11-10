# コニシ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | コニシ株式会社 |
| 証券コード | 4956 |
| docID（データを取り出した文書） | `S100YC07` |
| 原本 docID | `S100YC07` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC07.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%8B%E3%82%B7

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | コニシ株式会社 / 4956 / docID S100YC07（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
konishi: 10 件の数値を有報XBRLと照合
有報: コニシ株式会社 有価証券報告書－第101期(2025/04/01－2026/03/31) (docID S100YC07)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":135876000000,"latestFiling":135690000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
konishi: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで前期（2025年3月期）の売上高に差異（前期有報135,876百万円 → 当期有報135,690百万円）がありました。有報の連結経営指標等の注記とセグメント情報の注記で、不動産賃貸に係る損益の表示方法の変更を遡って適用したためであることを特定し、financialNotes に記録しました。
- businessModel: 中期経営計画の数値目標のうち利益に関する目標は本文ルールのため記載せず、売上高の目標のみを記載しました。
- businessModel: 2026年3月期に実施した栃木工場の水性接着剤製造所の新設などの設備投資は、戦略の文脈でのみ触れ、金額は中期経営計画の計画額（3年累計で約150億円）だけを記載しました。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高（ボンド743億15百万円、化成品391億94百万円、工事事業230億59百万円）の大きい順としました。children ごとの金額は開示されていないため、各 children にその旨を明記しました。
- businessStructure: 2026年3月期の期首より報告セグメントが変更され、『その他』（不動産賃貸）は売上高から外れて3区分となりました。本登録は変更後の3区分に基づきます（詳細は businessModel の financialNotes と needsReview に記録）。
- businessStructure: 化成品の children は【事業の内容】の取扱品目を、工業薬品・合成樹脂などと電子部品材料・薄膜材料などに分けて記載しました。
- history: 1925年の設立の significance にある創業時の事業（ワイン製造と製薬）は、有報に印字がないため Wikipedia の補足に基づきます。数値は使っていません。
- history: 沿革のうち工場の閉鎖・研究所の取得認証（ISO）などの細目は、主要な事業展開に関わるものに絞って省きました。
- industry: 主たる業界は、最大の報告セグメントであるボンド（接着剤・シーリング材の製造販売、外部顧客への売上高743億15百万円）から化学としました。
- industry: 化成品は化学品を専門に扱う商社事業として有報に説明されており、外部顧客への売上高391億94百万円が独立して開示されているため、2つ目に商社を付けました。
- industry: 工事事業（外部顧客への売上高230億59百万円）は土木建設工事業ですが、業界は上位2事業に絞りました。
- relatedCompanies: キャリア： 「キャリア採用」などの一般語の一致で、株式会社キャリアとの関係の印字がないため結びません。
- relatedCompanies: ベース： 「日本ケミカルデータベース」などの部分一致で、ベース株式会社との関係の印字がないため結びません。
- relatedCompanies: エン： 子会社名「ボンドエンジニアリング」などの部分一致（ambiguous）で、エン株式会社との関係の印字がないため結びません。
- relatedCompanies: フリー： 「エリアフリーアドレス」などの部分一致で、フリー株式会社との関係の印字がないため結びません。
- relatedCompanies: レック： 「スーパーフレックス」などの部分一致で、レック株式会社との関係の印字がないため結びません。
- relatedCompanies: コタ： 「インコタームズ」の部分一致（ambiguous）で、コタ株式会社との関係の印字がないため結びません。
- relatedCompanies: コア： 「コア事業」の一般語の一致（ambiguous）で、株式会社コアとの関係の印字がないため結びません。
- relatedCompanies: ランド： 「ブランド」の部分一致で、株式会社ランドとの関係の印字がないため結びません。
- relatedCompanies: レント： 「タレントマネジメント」などの部分一致で、株式会社レントとの関係の印字がないため結びません。
- relatedCompanies: セキ： 株主の常任代理人などの表記の部分一致（ambiguous）で、セキ株式会社との関係の印字がないため結びません。
- relatedCompanies: トラスト： 日本マスタートラスト信託銀行（信託口）の部分一致で、純投資の信託口でありコードリスト外でもあるため結びません。
- relatedCompanies: ミクニ： 沿革に現れるミクニペイント株式会社（1973年に株式を取得し、2014年に株式譲渡により連結対象から除外）は別会社であり、株式会社ミクニとの関係の印字がないため結びません。
- relatedCompanies: 三菱ケミカルグループ： 他の会社の株主構成に関する記載に現れるもので、当社との取引や資本関係の印字がないため結びません。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ： みなし保有株式に載る金融取引や事業情報収集等の主要関係先で、銀行との金融取引の文脈のため結びません。
- relatedCompanies: 連結子会社20社と持分法適用関連会社KF Instruments India Pvt.Ltd.は、いずれも上場会社ではなく候補リストにないため結んでいません。
- terms: 用語候補： ボンド（同社の主力である合成接着剤の製品名であり、事業名にも使われる語）、シーリング材（建築物などの目地や隙間を充填する材料）、弾性接着剤（硬化後も弾性を持ち、自動車や電子部品などに使われる接着剤）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2026年3月期の期首より、不動産賃貸に係る収入と原価の表示区分が変更され、報告セグメントは「ボンド」「化成品」「工事事業」の3区分となりました（従来は不動産賃貸を含む「その他」を加えた4区分）。本登録の事業構成は変更後の3区分に基づきます。前期のセグメント情報と売上高も組替え済みです。
- businessModel: 2024年1月1日付で普通株式1株につき2株の割合の株式分割を実施済みです。有報の連結経営指標等の株式数に係る数値は、この分割が2022年3月期の期首に行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
