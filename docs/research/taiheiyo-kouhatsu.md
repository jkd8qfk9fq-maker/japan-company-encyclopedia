# 太平洋興発 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 太平洋興発株式会社 |
| 証券コード | 8835 |
| docID（データを取り出した文書） | `S100YL7T` |
| 原本 docID | `S100YL7T` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL7T.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 太平洋興発株式会社 / 8835 / docID S100YL7T（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
taiheiyo-kouhatsu: 10 件の数値を有報XBRLと照合
有報: 太平洋興発株式会社 有価証券報告書－第151期(2025/04/01－2026/03/31) (docID S100YL7T)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
taiheiyo-kouhatsu: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はセグメント注記と経営指標の百万円の印字どおりに書いた。MD&Aが億の単位で印字する金額（428億2百万円など）は使わず、百万円の印字で統一した。
- businessModel: 調達先は、商事事業の輸入炭の仕入先について印字があるため、その一般名詞だけをsuppliersに書いた。その他の事業の調達先は、調達への具体的な印字がないため書かなかった。
- businessModel: 表示方法の変更だけの組替えは財務諸表の金額の修正ではないため、financialNotesには書かず、本warningsへの記録にとどめた。会計基準の適用についてはfinancialNotesに事実だけを書いた。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」と印字されている。
- businessStructure: 事業の並び順は2026年3月期の外部顧客への売上高の大きい順とした（商事28,419百万円、サービス5,684百万円、不動産3,180百万円、建設工事3,063百万円、肥料2,455百万円。合計42,802百万円で連結売上高と一致）。
- businessStructure: 表紙に東京証券取引所スタンダード市場と印字されているため、listingsにmarketを付けた。
- businessStructure: 太平洋炭礦株式会社は議決権の過半数を所有しながら子会社に含めていない旨と、その理由（2002年1月の閉山で実質的に清算状態にあり、債権者との債務処理合意に基づき厳正に管理され、有効な支配従属関係が存在しないと判断）が注記に印字されている。同社は連結子会社13社には含まれておらず、事業構成にも含めなかった。
- history: 沿革の1920年の設立時の資本金の金額は、資本金の金額を沿革に書かない規則に従い省略した。
- history: 支店・営業所の開設や閉鎖、短命だった子会社の設立・売却・清算など、事業の転換を説明するうえで中心でない出来事は省いた。
- history: Wikipediaの抜粋は不動産事業の説明が中心で、有報と重なる内容のため補足には使わなかった。
- industry: 主たる業界は、外部顧客への売上高の大半（28,419百万円）を占める商事セグメントからtradingとした。副たる業界として、不動産セグメントに対応するreal-estateと、建設工事セグメントに対応するconstructionを付けた。
- industry: サービスセグメント（有料老人ホーム、給食、清掃、タクシーなど）と肥料セグメント（炭カル肥料など）に合う閉じた分類の値がないため、副たる業界は付けなかった。主たる業界には合う値があるためtaxonomyGapsには書かない。
- relatedCompanies: ベース（base-4481）: 「連結ベース」という語への一致で、会社ではないため結ばなかった。
- relatedCompanies: キャリア（career）: 「キャリアアップ」という語への一致で、会社との関係の記載がないため結ばなかった。
- relatedCompanies: ポート（port）: 「サポート」という語への部分一致で、会社との関係の記載がないため結ばなかった。
- relatedCompanies: 電算（densan）: ambiguousな一致で、沿革の「電算写植事業」への一致であり、株式会社電算との関係の記載がないため結ばなかった。
- relatedCompanies: ほくほくフィナンシャルグループ（hokuhoku-financial-group）: 主要取引金融機関として財務面の取引があり資金調達等の取引円滑化のため保有すると印字されるだけで、規則により金融機関の資金調達を理由とする相手は結ばなかった。
- relatedCompanies: 三井不動産（mitsui-fudosan）: 一部同じ事業領域であり動向を把握するため保有すると印字されるだけで、個別の取引の記述がないため結ばなかった。また縮減を検討していると印字されている。
- relatedCompanies: 新日本電工（nippon-denko）: 過去に商事セグメントの輸入炭の販売先だったと過去形で印字され、将来の取引再開の可能性を理由に保有を継続するとされているため、現在の取引の根拠が足りず結ばなかった。
- relatedCompanies: 日本冶金工業（nippon-yakin-kogyo）: 新日本電工と同様、過去の販売先と過去形で印字され、将来の再開可能性が理由のため結ばなかった。保有株数も162株とわずかである。
- relatedCompanies: 北洋銀行（north-pacific-bank）: 主要取引金融機関として財務面の取引があり資金調達等の取引円滑化のため保有すると印字されるだけで、規則により結ばなかった。なお候補は銀行本体であり、その持株会社ではない。
- relatedCompanies: 主要な顧客として印字される釧路コールマイン株式会社と王子グリーンリソース株式会社は、related-candidates.jsonに掲載がないため結んでいない。輸入炭の仕入先であるNew Hope Corporation LTD.も掲載がないため結んでいない。
- terms: 助言: 「バイオマス燃料」は商事事業でペレットやPKS（パーム椰子殻）とともに繰り返し使われ、脱炭素の文脈でも中心的な語のため、登録候補になります。
- terms: 助言: 「炭カル肥料」は肥料事業の製品名として印字されますが、一般性が低く固有の製品区分にとどまるため、登録候補とするほどの汎用性はないと判断しました。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
