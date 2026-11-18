# シルバーライフ — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社シルバーライフ |
| 証券コード | 9262 |
| docID（データを取り出した文書） | `S100Z8TU` |
| 原本 docID | `S100Z8TU` |
| 提出日（原本） | 2026-10-22 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z8TU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社シルバーライフ / 9262 / docID S100WWED（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
silver-life: 10 件の数値を有報XBRLと照合
有報: 株式会社シルバーライフ 有価証券報告書－第19期(2025/08/01－2026/07/31) (docID S100Z8TU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
silver-life: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意に「財務諸表の組替えの記載がある」とあるが、抽出済みの本文（sections.txt）では該当する注記の文面を確認できなかった。前期の有報と重なる年度は、売上高・当期純利益など6系列すべてで差異がなく、数値は印字どおりに採用した。
- businessModel: 目標とする経営指標（2028年7月期の売上高180億円など）は目標値のため、本文と perspectives には書いていない。
- businessModel: 分析のなかで示された財政状態の総資産は連結貸借対照表の値で、この登録の財務数値（提出会社の個別の値）とは異なる。本文には総資産を書いていない。
- businessModel: 調理済み食材には仕入先の工場で製造されたものも含まれるが、個別の仕入先の名前は印字されていない。旧スキーマのため suppliers は書かず、この事実は flow の offering に記した。
- businessStructure: 当社は食材製造販売事業の単一セグメントのため、販売区分（FC加盟店／高齢者施設等／直販・その他）を子事業として記載した。連結初年度のためセグメント情報等は作成されていない。
- businessStructure: 連結子会社の成田冷蔵株式会社（冷蔵倉庫業、議決権の所有割合100％）は自社の子会社であり、関連企業には結ばない。直販・その他の倉庫業の担い手として本文に記した。
- businessStructure: 主要な設備（群馬工場・栃木工場・加須倉庫など）の帳簿価額は金額のため本文に書いていない。
- history: 沿革の年月は年だけを採用し、月は書いていない。本店移転の繰り返しと認証取得（ISO9001、FSSC22000）は、事業の転機ではないため省いた。
- industry: 主たる事業は食材の製造販売であり食品とした。配食サービスのフランチャイズ本部でもあるが、売上の実体は食材の販売であるため、小売は付けていない。
- relatedCompanies: ポート（7047）: 「レポート」の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: 田谷（4679）: ambiguous で、設備の表などの部分一致。同社との取引・提携の記述がないため結ばなかった。
- relatedCompanies: エン（4849）: 「エンゲージメント」などの部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: ランド（8918）: 「ブランド」の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: ウィル（3241）: 「ウィルス」の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: ゼロ（9028）: フランチャイズ加盟プランの名称「ゼロプラン」の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: キャリア（6198）: 「キャリア形成」の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: コロナ（5909）: 「コロナウイルス」の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: 大和（8247）: 大和証券は株主に関する表に載るのみで、事業会社としての取引・提携の記述がないため結ばなかった。
- relatedCompanies: キング（8118）: 「ピッキング」の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: 日新（9066）: コードリストになく ambiguous。新株予約権の条件文中の部分一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: トラスト（3347）: 日本マスタートラスト信託銀行（信託口）は純投資の信託銀行であり、結ぶ対象ではないため結ばなかった。
- terms: 助言: 用語「フランチャイズ」は、本部が加盟店に看板や経営の仕組みを使わせ、経営指導を行う代わりにロイヤリティなどを受け取る仕組みで、この会社の事業の中心です。本文では加盟店への経営指導と食材の販売として説明しています。
- terms: 助言: 用語「OEM」は、他社ブランドの製品を受託して製造することです。この会社は直販・その他の区分でOEM受託の製造品を販売しています。

## 要確認（status に反映）

- businessModel: 連結初年度（第19期）のため連結の経営成績の推移がなく、この登録の財務数値は提出会社の個別の経営指標等によっている。連結の経営成績が開示される翌期以降は、連結の数値への切り替えが望ましい。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
