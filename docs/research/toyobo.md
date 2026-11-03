# 東洋紡 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東洋紡株式会社 |
| 証券コード | 3101 |
| docID（データを取り出した文書） | `S100YGRC` |
| 原本 docID | `S100YGRC` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGRC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東洋紡株式会社 / 3101 / docID S100YGRC（id は英語表記「TOYOBO CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toyobo: 10 件の数値を有報XBRLと照合
有報: 東洋紡株式会社 有価証券報告書－第168期(2025/04/01－2026/03/31) (docID S100YGRC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toyobo: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…30年度）を策定し、財務体質の改善と利益成長を両立させ、事業ポートフォリオ改…）

## エージェントの判断記録（fragment warnings）

- businessModel: 顧客の業種は有報に取引先の一覧がないため、製品の用途（MD&Aの記載）から書いた。最後の顧客欄は10％以上の販売先がない旨の印字による。
- businessModel: strategy.disclosed の2030年度目標（売上高5,000億円・当期純利益190億円）は、MD&Aの表「2030年度目標（2030中計）」の印字。
- businessModel: 営業利益などの利益は、方針により書いていない。
- businessStructure: 決算期は表紙DEIの2026年3月31日（第168期、12か月、Japan GAAP、連結あり、訂正なし）。上場は表紙の東京証券取引所プライム市場。
- businessStructure: 並び順は、セグメント注記の外部顧客への売上高（2026年3月期、百万円）の大きい順：フィルム175,169＞環境・機能材110,126＞機能繊維・商事89,612＞ライフサイエンス34,494＞不動産4,495。「その他」7,666は報告セグメントに含まれないので最後に置いた。
- businessStructure: 売上高は、MD&Aに「○○億円」で印字された値を使った（不動産は億円の表示が「不動産、その他」の合算122億円しかないため、百万円の表を使った）。営業利益などの利益は書いていない。
- businessStructure: 環境・機能材の説明にある「東洋紡エムシー㈱による運営開始」は【沿革】の2023年4月の記載による。持分は有報の関係会社の状況で議決権51.0％（直接）と印字されているが、本文には書いていない。
- businessStructure: ライフサイエンスの製品名のうち「医薬品の製造受託」と「診断薬用試薬」はMD&Aの記載から採った。
- businessStructure: 単一の子区分（children）は、有報が区分ごとの売上高を印字していないため作っていない。
- history: 【沿革】の「2012年10月／2018年４月／2019年10月」の3つの年月が続けて印字され、事象文（社名変更／ゼノマックスジャパン設立／帝人フィルムソリューション株式取得）と分かれている。年月と事象が3対3なので行順で対応づけた（2012＝社名変更、2018＝ゼノマックスジャパン設立、2019＝帝人FS取得）。2012年の社名変更は同じ沿革の1914年の記載（2012年10月に社名変更）でも裏付けられる。2018年の事象は載せていない。
- history: 2019年の項目に、2021年4月の吸収合併を続けて書いた。
- industry: 最大の報告セグメントはフィルム（外部顧客への売上高175,169百万円）、次が環境・機能材（110,126百万円）で、いずれも高分子の素材・化学品の製造販売なので chemicals を主とした。半導体向けの事業は開示されていない（離型フィルムはセラミックコンデンサ向け）ため semiconductors は付けない。医薬品などのライフサイエンスは売上の1割未満のため付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業の候補を機械で確認できないため、結ばなかった。
- relatedCompanies: 三菱商事㈱：東洋紡エムシー㈱への出資（2023年4月、第三者割当増資）が【沿革】に印字されているが、掲載済み・上場の同一性を related-candidates.json で確認できず、親会社等の区分でも関係会社の状況に載っていない。結ばない。
- relatedCompanies: 連結子会社（東洋紡エムシー㈱、東洋紡せんい㈱など）は非上場の子会社で、掲載済みの上場企業ではないため結ばない。
- terms: 助言のみ。解説が役立つ語の候補：エンジニアリングプラスチック、離型フィルム、偏光子保護フィルム、中空糸膜、スーパー繊維、エアバッグ用基布、診断薬用酵素。既存の用語集にあるかは確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 東洋紡の主たる業界 → 提案: 素材（繊維・フィルム）。フィルム・繊維・機能樹脂を持つ素材メーカーで、化学の区分が最も近いが、繊維・フィルムを含む素材区分があれば正確に言える。
