# ブライトパス・バイオ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ブライトパス・バイオ株式会社 |
| 証券コード | 4594 |
| docID（データを取り出した文書） | `S100YJ3C` |
| 原本 docID | `S100YJ3C` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ3C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ブライトパス・バイオ株式会社 / 4594 / docID S100YJ3C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
brightpath-biotherapeutics: 10 件の数値を有報XBRLと照合
有報: ブライトパス・バイオ株式会社 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YJ3C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
brightpath-biotherapeutics: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空にしました。主要な経営指標等の注記（潜在株式調整後の利益を記載しない理由、当期純損失のため自己資本利益率・株価収益率を記載しない旨、株主総利回りの比較指標の変更、市場の移行に伴う最高・最低株価の注記）はいずれも表示事項であり、会計基準の変更や変則決算はありません。
- businessModel: 証拠パックの警告にあった財務諸表の組替えについては、前期有報との指標照合が全6系列で差異ゼロであり、売上高と当期純利益に影響する再表示は確認されなかったため、表示上の取扱いとして warnings のみとし、financialNotes には入れませんでした。
- businessModel: 新株予約権の発行と行使による株式の発行は資本政策の手続であり、本文には書かず warnings のみとしました（金額は書いていません）。
- businessModel: MD&Aに印字された研究開発費、販売費及び一般管理費、現金及び預金、総資産などの金額は、本文の財務数値は売上高と当期純利益だけとする規則のため書いていません。
- businessModel: 【株式の保有状況】は該当事項がなく、政策保有株式はありません。【重要な後発事象】も該当事項はありません。
- businessStructure: 単一セグメント（医薬品開発事業）のため、セグメント情報の記載は省略されています。children は【事業の内容】と【経営方針、経営環境及び対処すべき課題等】が示す2つのモダリティ（細胞医薬・抗体医薬）から作りました。区分ごとの金額は独立して開示されていないため、金額は書いていません。
- businessStructure: 主要な顧客ごとの情報では、当事業年度は株式会社日本バイオセラピー研究所（売上高84千円）が、当事業年度の売上高の全てを占めています。前事業年度は株式会社A-SEEDS（1,004千円）と株式会社日本バイオセラピー研究所（128千円）でした。いずれも関連企業の候補にないため、customers は顧客の種類だけにしています。
- businessStructure: 当事業年度の売上高84千円は、販売実績の注記によると特許実施許諾による一時金収入によるものです。
- businessStructure: 設備は本店（神奈川県川崎市川崎区、研究設備等）と本社事業所（東京都千代田区）で、いずれも単一セグメントの拠点のため、特定の事業区分には結びつけていません。帳簿価額は書いていません。
- businessStructure: 【関係会社の状況】は該当事項がなく、子会社・関連会社はありません。
- history: 沿革の表は年月と事象文が対応して印字されており、年だけを取り出して登録しました。月は書いていません。
- history: 2003年の設立時の資本金は、資本金の金額を書かない規則のため記載していません。
- history: 登録しなかった小事件: 2008年の久留米市内での本社移転、2009年の東京支社設置、2014年の東京支社移転、2015年のITK-1第Ⅲ相中間解析、2017年のGRN-1201米国第Ⅱ相臨床試験開始、2018年のITK-1第Ⅲ相試験の開鍵、2022年のGRN-1201米国第Ⅱ相臨床試験の早期中止の発表です（GRN-1201は現在のパイプラインではなく、中止は warnings にのみ記録しました）。
- industry: 医薬品開発事業の単一セグメントで、がん免疫治療薬の研究開発が事業の全てであるため pharmaceuticals を primary にしました。他の業界は付けていません。
- relatedCompanies: en: 「T細胞エンゲージャー」などの一般語・用語の部分文字列の一致だけで、エン株式会社についての記載はないため結びませんでした。
- relatedCompanies: path: ambiguous で、自社名「ブライトパス」の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: innovation: 「ライフイノベーションセンター」という施設名の一致だけで、株式会社イノベーションについての記載はないため結びませんでした。
- relatedCompanies: core: ambiguous で、「コアスキル」という一般語の一致だけのため結びませんでした。
- relatedCompanies: frontier: 「フロンティア」という一般語の一致だけで、株式会社フロンティアについての記載はないため結びませんでした。
- relatedCompanies: port: 「ポートフォリオ」という一般語の一致だけで、ポート株式会社についての記載はないため結びませんでした。
- relatedCompanies: japan-securities-finance: 【大株主の状況】に載る証券金融会社ですが、取引や提携の記載はなく純投資とみられるため結びませんでした。
- relatedCompanies: king: 特許の表中の「バンキング」という語の部分文字列の一致だけで、株式会社キングについての記載はないため結びませんでした。
- relatedCompanies: matsui-securities: 【大株主の状況】に載る証券会社ですが、取引や提携の記載はなく純投資とみられるため結びませんでした。
- relatedCompanies: the-lead: 「リード抗体」という一般語の一致だけで、株式会社リードについての記載はないため結びませんでした。
- relatedCompanies: 久留米大学は【重要な契約等】の包括的業務契約と特許譲受け契約の相手方ですが、関連企業の候補にないため結びませんでした。
- relatedCompanies: 国立研究開発法人理化学研究所はiPS細胞由来NKT細胞の独占実施権の権利者で【事業の内容】【重要な契約等】に記載がありますが、関連企業の候補にないため結びませんでした。
- relatedCompanies: 富士フイルム株式会社は2011年にITK-1の独占的ライセンス契約を締結した相手ですが、関連企業の候補にないため結びませんでした（ITK-1の開発は2019年に中止されています）。
- relatedCompanies: 株式会社日本バイオセラピー研究所と株式会社A-SEEDSは【関連情報】の主要な顧客ですが、関連企業の候補にないため結びませんでした。
- relatedCompanies: Cellistic社はBP2202の製造工程の移管先として【事業の内容】に記載がありますが、関連企業の候補にないため結びませんでした。
- relatedCompanies: 大株主は証券会社・証券金融会社・保管機関・個人が並び、事業会社の大株主は印字されていません。【株式の保有状況】は該当事項がありません。
- terms: 助言のみ。本文で使った用語の候補: iPS-NKT細胞療法、CAR-T細胞療法、免疫チェックポイント、ライセンスアウト、マイルストン、ロイヤリティ、アンメット・メディカル・ニーズ、二重特異性抗体、T細胞エンゲージャー、オーファンドラッグ（希少疾病用医薬品）です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
