# 共立メンテナンス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社共立メンテナンス |
| 証券コード | 9616 |
| docID（データを取り出した文書） | `S100YIIM` |
| 原本 docID | `S100YIIM` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIIM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社共立メンテナンス / 9616 / docID S100YIIM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyoritsu-maintenance: 10 件の数値を有報XBRLと照合
有報: 株式会社共立メンテナンス 有価証券報告書－第47期(2025/04/01－2026/03/31) (docID S100YIIM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kyoritsu-maintenance: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、人件費などの費用を差し引いた残りが利益になります。2026年3月期のは18…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務数値は売上高と親会社株主に帰属する当期純利益だけを書いた。経常利益・営業利益・セグメント利益の金額や増減率は書いていない。
- businessModel: 組替えの判断: 有報の「表示方法の変更」は、連結キャッシュ・フロー計算書で「未収入金の増減額」を「その他」に含める表示の再分類のみで、売上高・純利益・総資産・純資産の系列に影響はない。前期有報との修正再表示チェックも全行一致だったため、financialNotesは置かなかった。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。決算期の変更や変則決算もない。
- businessModel: 中期経営計画の定量目標のうち、ＥＰＳ・ＲＯＥ・配当性向は投資の語に当たるため perspectives には含めていない。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（ホテル148,957／寮57,543／デベロップメント38,669／総合ビルマネジメント9,039／フーズ2,126百万円）。「その他事業」は有報が報告セグメントに含まれない区分と明記するため、外部売上高（18,912百万円）がフーズ事業などより大きくても最後に置いた。
- businessStructure: 子事業（children）には金額を書いていない。関連情報には製品・サービス別の外部売上高も印字されるが、MD&Aの商品別売上高（内部売上高を含む管理ベース）と数値が異なるため、金額の根拠はセグメント注記の外部顧客への売上高に統一し、子事業は名称と内容だけにした。
- businessStructure: フーズ事業と総合ビルマネジメント事業は、グループのホテルレストランの受託運営やグループ施設のメンテナンスなどグループ内取引が大きく、外部顧客への売上高は小さく印字されている（セグメント注記）。
- businessStructure: グループ構成は【事業の内容】の印字どおり当社・子会社17社・関連会社3社とした。
- history: 沿革表は年月と事象が対応して印字されており、崩れた表ではない。主要な節目を選んで収録し、本社移転・支店設置・子会社の設立などの細目は省いた。
- history: 2024年の資本業務提携は、沿革（コスモスイニシア株式の一部取得）と【重要な契約等】（2024年1月11日の3社間資本業務提携契約）の両方に印字があるため1件にまとめた。
- industry: 主分類は暫定でentertainment。最大の報告セグメントはホテル事業（外部顧客への売上高148,957百万円、全体の約5割）で、寮事業と合わせると約4分の3を占めるが、閉じた業界分類に宿泊・寮運営の区分がないため、taxonomyGapsにlodging（宿泊・寮運営）を提案した。
- industry: real-estateはデベロップメント事業（建設・企画・設計、分譲マンション、不動産流動化が独立した報告セグメントとして開示）に対して付けた。
- industry: foodはフーズ事業（外食・受託給食・ホテルレストランの受託運営）が報告セグメントとして独立開示されているため付けた。
- relatedCompanies: cosmos-initia: 【関係会社の状況】に持分法適用関連会社として印字（議決権25.04％、デベロップメント事業）。関係はaffiliateとした。
- relatedCompanies: daiwa-house-industry: 【重要な契約等】に2024年1月11日締結の3社間資本業務提携契約が印字され、現在の有報でも重要な契約として載る継続的な提携のためbusiness-partnerとした。
- relatedCompanies: trust（3347）: 社名の一致のみ。当社の連結子会社は株式会社共立トラスト（未上場）で、株式会社トラストとは別の会社。
- relatedCompanies: career（6198）: 「キャリア」は人的資本の記述中の一般語（自律的キャリア支援）で、同社への言及ではない。
- relatedCompanies: seki（7857）: ambiguous。「セキ」は情報セキュリティ等の語の一部で、同社への言及ではない。
- relatedCompanies: s-t（4951）: 連結子会社「株式会社共立エステート」の名称の一部が一致したもの。エステー株式会社への言及ではない。
- relatedCompanies: hachijuni-nagano-bank（8359）: 特定投資株式として保有していたが当期に全株式を売却している。保有目的も資金調達の定型句で、資金調達が理由の金融機関は結ばない。
- relatedCompanies: taya（4679）: ambiguous。施設所在地「世田谷」など地名の一致で、同社への言及ではない。
- relatedCompanies: cover（5253）: 「カバーし」という一般動詞の一致で、同社への言及ではない。
- relatedCompanies: port（7047）: 「サポート」等の一般語の一致で、同社への言及ではない。
- relatedCompanies: zero（9028）: ambiguous。「ネットゼロ」の語の一致で、同社への言及ではない。
- relatedCompanies: base-4481: 「営業利益ベース」等の一般語の一致で、同社への言及ではない。
- relatedCompanies: core（2359）: ambiguous。「コア能力」という一般語の一致で、同社への言及ではない。
- relatedCompanies: corona（5909）: 「コロナからの回復」の語句で感染症を指し、同社への言及ではない。
- relatedCompanies: en（4849）: ambiguous。沿革の旧社名「株式会社サン・エンタープライズ」（現・連結子会社）の一部が一致したもの。
- relatedCompanies: garden（274A）: 施設名「ドミールガーデン田無」の一部が一致したもの。
- relatedCompanies: fujimak（5965）・fukuda（1899）・id-holdings（4709）・matsui-construction（1810）・ohmoto-gumi（1793）・okasan-securities-group（8609）・sakura-kcs（4761）: 特定投資株式の保有が載るだけで、保有目的は「取引関係等の維持・強化」の定型句。相手ごとの取引の記述がないため結ばない。
- relatedCompanies: fujitec（6406）: listingがコードリストになく、特定投資株式の保有のみのため結ばない。
- relatedCompanies: jinushi（3252）: ambiguous。「地主様」という一般名詞の一致。
- relatedCompanies: mitsubishi-ufj-financial-group（8306）・mizuho-financial-group（8411）・sumitomo-mitsui-financial-group（8316）: 特定投資株式の保有で、保有目的は「機動的で安定的な資金調達」。資金調達が理由の金融機関は結ばない。
- relatedCompanies: rix（7525）: 「スキル・マトリックス」等の語の一部が一致したもの。
- relatedCompanies: suzuki-6785: ambiguous。役員個人の姓「鈴木」の一致。
- relatedCompanies: vision（9416）: 「長期ビジョン」という一般語の一致で、同社への言及ではない。
- terms: 登録候補（助言のみ）: ドーミーイン（ビジネスホテルのブランド名で、有報の事業の内容・沿革に印字）、御宿 野乃（ドーミーインの上位ブランドで、MD&Aの新規開業施設名に印字）、ラビスタ（リゾートホテルのブランド名で、有報に印字）、ドミール（ワンルームマンションタイプの寮の名称で、有報に印字）、受託寮（企業・学校が保有する寮の管理運営受託で、有報に印字）、ＰＫＰ事業（地方自治体向け業務受託事業の略称で、有報に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 共立メンテナンスのホテル事業・寮事業 → 提案: lodging（宿泊・寮運営）。最大の報告セグメントはホテル運営で、寮運営と合わせて外部顧客への売上高の約4分の3を占めるが、閉じた業界分類に宿泊・寮運営の区分がないため、最も近いentertainmentを暫定の主分類とした。
