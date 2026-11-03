# フタバ産業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | フタバ産業株式会社 |
| 証券コード | 7241 |
| docID（データを取り出した文書） | `S100YCHA` |
| 原本 docID | `S100YCHA` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCHA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | フタバ産業株式会社 / 7241 / docID S100YCHA（id は英語表記「Futaba Industrial Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
futaba-industrial: 10 件の数値を有報XBRLと照合
有報: フタバ産業株式会社 有価証券報告書－第112期(2025/04/01－2026/03/31) (docID S100YCHA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
futaba-industrial: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 最上位の description にある「マフラー」は、沿革の「自動車マフラー専門工場として幸田工場を新設(1993年)」に基づく。事業の内容の節には製品名がない。
- businessModel: 業績の理由（支給品単価・材料建値・為替）は、営業利益などに触れるため書かなかった。
- businessModel: 表示方法の変更（地域別売上高の「中国」を「その他」に含めた）は財務ではなく開示の組替えなので、financialNotes には入れていない。前期有報との一致は確認済み（修正再表示なし）。
- businessModel: 戦略・強み(perspectives)は、売上高と純利益以外の指標を除くと書ける事実が乏しいため省いた。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の順（日本308,505・北米177,761・欧州68,058・中国62,630・アジア60,963、百万円）。金額は本文に書かない。
- businessStructure: 外販設備の受注は日本と中国にあるが、拠点との対応は有報の図が読めないため、日本の事業にだけ外販設備を載せた（セグメントの記載どおり）。
- history: 沿革のうち主な出来事12件を選んだ。子会社の設立・清算の多くは省いた。
- industry: 5つの報告セグメントはすべて自動車等車両部品の生産・販売が中心なので、自動車だけにした。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業との同一性を機械で確かめられなかったため、関連企業は空にした。
- relatedCompanies: トヨタ自動車: 候補ファイルが無く結んでいない。有報には「その他の関係会社」で、被所有31.4%（直接）、販売先であり部品の仕入先でもあると印字がある。候補が用意されれば other-affiliated-company で結べる。
- relatedCompanies: 豊田合成: 保有株式の表に取引先との記載はあるが、取引の向きと内容が確認できず結んでいない。
- relatedCompanies: ㈱クレファクト・協祥機械工業㈱: 持分法適用関連会社だが、候補ファイルが無く掲載済みの上場企業か確認できないため結んでいない。
- terms: 用語の候補: 「支給品」（自動車メーカーが部品メーカーに渡す部品。有報は売上高の増減理由と「対支給品を除く売上高」の指標で使う）、「材料建値」（材料価格の基準値。売上高の増減理由に出てくる）、「外販設備」（治具溶接機など、自社外に販売する設備）。語の定義は有報に無いため、用語集の側で確認してから足すこと。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
