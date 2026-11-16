# Delta-Fly Pharma — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＤｅｌｔａーＦｌｙ　Ｐｈａｒｍａ株式会社 |
| 証券コード | 4598 |
| docID（データを取り出した文書） | `S100YJOM` |
| 原本 docID | `S100YJOM` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJOM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＤｅｌｔａーＦｌｙ　Ｐｈａｒｍａ株式会社 / 4598 / docID S100YJOM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
delta-fly-pharma: 2 件の数値を有報XBRLと照合
有報: ＤｅｌｔａーＦｌｙ　Ｐｈａｒｍａ株式会社 有価証券報告書－第16期(2025/04/01－2026/03/31) (docID S100YJOM)
前期有報との比較: 21 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 4 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
delta-fly-pharma: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「Delta－Fly　Pharma　株式会社」が EDINET の提出者名「ＤｅｌｔａーＦｌｙ　Ｐｈａｒｍａ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記1〜8は、連結財務諸表を作成していないこと、関連会社がないこと、配当を実施していないこと、潜在株式調整後1株当たり当期純利益・自己資本利益率・株価収益率を記載していないこと等の表示事項のため、financialNotesには入れず、ここに記録する。
- businessModel: 事業収益は直近5年間では2022年3月期の300百万円のみで、2023年3月期以降は計上されていない（主要な経営指標等の推移の印字どおり）。収益の要素（事業収益）は認識されており全年ダッシュではないため、canbas型のゼロ収益ブロックには該当しない。
- businessModel: 期後の第11回新株予約権の行使（2026年4月1日から6月23日まで）と、資本金及び資本準備金の額の減少並びに剰余金の処分（欠損てん補が目的。2026年5月15日の取締役会で2026年6月26日開催の定時株主総会への付議を決議し、効力発生は2026年8月3日の予定）は、いずれも資本政策の手続きのためwarningsのみとし、needsReviewには入れていない。
- businessModel: DFP-10917の米国での臨床第3相試験の中止は、安全性独立委員会（DSMB）から設定した優越性が検証されなかった旨の報告を受けたことによるもので、安全性による問題はない旨の見解も示されている。
- businessModel: 事業費用、研究開発費、営業損失、経常損失、総資産、純資産などの金額は本文に書いていない（売上と当期純利益だけを本文の金額とする規則による）。
- businessStructure: 単一セグメント（医薬品事業）のため、拠点（本社・徳島県徳島市、東京事務所・東京都中央区）は特定の開発品に結びつけていない。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。会社は研究所や製造施設を持たず、原薬・製剤の製造や各種試験は外部の研究開発受託会社・製造受託会社へ委託している旨を本文に記した。
- businessStructure: 子会社・関連会社はない（【関係会社の状況】は「該当事項はありません」）。
- businessStructure: Wikipediaの記事（Delta-Fly Pharma）の冒頭は本社の所在地など有報と重なる内容のみで、有報にない補足はなかったため使っていない。
- history: 省いた行: 2012年4月の東京事務所の開設、2016年5月の東京事務所の移転（いずれも事務所の開設・移転のため）。
- industry: 主たる業界はpharmaceuticalsとした。単一セグメントの医薬品事業（抗がん剤候補化合物の研究開発）が事業のすべてであるためである。
- industry: DEIの別記事業はCTEと印字されるが、事業の実態は抗がん剤の研究開発であり、pharmaceuticalsに分類した。
- relatedCompanies: nippon-shinyaku: 【重要な契約等】にDFP-10917の日本における独占的特許実施許諾が印字され、国内の臨床開発も同社が担っているためbusiness-partnerとして結んだ。
- relatedCompanies: nippon-chemiphar: 【重要な契約等】にDFP-17729とDFP-14323の2件の日本における独占的特許実施許諾が印字されているためbusiness-partnerとして結んだ。大株主（3.27％）でもあるが、資本関係はライセンス関係を優先して説明に併記した。
- relatedCompanies: sanyo-chemical-industries: 【事業の内容】にDFP-14927の共同開発契約が印字され、当事業年度末現在も米国での臨床試験が共同開発のもとで進められているためbusiness-partnerとして結んだ。大株主（1.14％）でもあるが、資本関係は共同開発関係を優先して説明に併記した。
- relatedCompanies: yakult-honsha: 沿革に2013年4月のオプション権付与契約が印字されるのみで、現在の取引・提携の記載が【事業の内容】や【重要な契約等】にないため結ばなかった。
- relatedCompanies: rakus: 「ベネトクラクス」の部分文字列の一致のみで、社名の記載ではないため結ばなかった。
- relatedCompanies: nissin: コードリストにない上、ambiguousであり、新株予約権の文面の部分一致のみのため結ばなかった。
- relatedCompanies: oro / en / innovation / lec / aeon / ne / ricoh: いずれも一般語・化学物質名・評価区分などの部分一致のみで、社名の記載ではないため結ばなかった。
- relatedCompanies: 【大株主の状況】のその余の株主は個人、証券会社、外国法人のカストディ口座であり、事業会社としての資本関係は印字されていないため結ばなかった。
- relatedCompanies: 一般社団法人 日本肝胆膵オンコロジーネットワーク（DFP-11207の医師主導治験の共同実施先）は候補一覧にないため結んでいない。
- terms: 助言のみ。用語としては「モジュール創薬」「契約一時金」「マイルストーン」「開発協力金」「ロイヤリティ」「核酸医薬」「RNA干渉」「アポトーシス」「腫瘍微小環境」「医師主導治験」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
