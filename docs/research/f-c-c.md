# エフ・シー・シー — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エフ・シー・シー |
| 証券コード | 7296 |
| docID（データを取り出した文書） | `S100YFKQ` |
| 原本 docID | `S100YFKQ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFKQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エフ・シー・シー / 7296 / docID S100YFKQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
f-c-c: 10 件の数値を有報XBRLと照合
有報: 株式会社エフ・シー・シー 有価証券報告書－第96期(2025/04/01－2026/03/31) (docID S100YFKQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
f-c-c: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…費、販売の費用などを差し引いた残りが利益になります。2026年3月期のは18…）

## エージェントの判断記録（fragment warnings）

- businessModel: 会計基準はIFRSで5年間一貫している。前期有報との修正再表示チェックは全項目一致し、決算期変更・変則決算はないため financialNotes は空にした。
- businessModel: 後発事象として、2026年5月13日の取締役会で自己株式の取得（自己株式の公開買付け）と消却が決議されている。定例の資本政策であり、2026年3月31日現在のエントリー内容に影響しないため warnings のみとした。
- businessModel: 地域別情報の区分変更（従来「その他」に含めていたメキシコを米国と合わせて「北米」に変更。前期の数値も変更後の区分に組み替え済み）は表示区分の変更であり、数値の修正再表示ではないため本文では触れていない。
- businessModel: セグメント利益・税引前当期利益などの金額と増減率は、文章の規則により一切記載していない。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上収益（2026年3月期）が大きい順（四輪事業135,975百万円、二輪事業124,691百万円、非モビリティ事業169百万円）。セグメント注記の列順（二輪・四輪・非モビリティ）やMD&Aの順ではない。
- businessStructure: 各事業の子区分（製品別・地域別）の金額は独立して開示されていないため、children は設けず金額も書いていない。
- history: 沿革表の末尾は年月セルが「2022年11月」「2023年６月」と2つ続けて印字され事象文と分かれている崩れた表だが、年月が2つ・事象が2つで数が一致するため、行順に対応づけた（2022年11月＝FCC SEOJINの清算結了、2023年６月＝FCC（VIETNAM）の株式100％取得）。
- history: 創業時の資本金などの金額は、文章の規則により記載していない。
- industry: 主たる業界は automotive: 四輪事業と二輪事業で売上収益のほぼ全額を占め、いずれも自動車（二輪車を含む）のクラッチ部品事業。非モビリティ事業は外部収益169百万円と僅少で、新規分野の開発段階であり、金額が独立開示される規模の第二の事業ではないため、2つ目の業界は付けなかった。分類の不足はないため taxonomyGaps は空。
- relatedCompanies: honda: 関係区分は【関係会社の状況】の「その他の関係会社」に従った（大株主の状況でも22.47％で筆頭）。販売と購入の両方の取引は説明に記載した。
- relatedCompanies: noritake: 保有目的に非モビリティ事業での取引関係が銘柄固有に書かれているため business-partner とした。取引の向きは印字されていない。
- relatedCompanies: Ford及び同グループ、ゼネラルモーターズは主要な顧客だが、関連企業候補（掲載済み企業）に含まれていないため結べない。
- relatedCompanies: core: 「コア技術」などの一般語の一致で、株式会社コアへの言及はない（ambiguous）。結ばない。
- relatedCompanies: en: 「エンゲージメント」などの一般語の一致で、エン株式会社への言及はない（ambiguous）。結ばない。
- relatedCompanies: career: 「キャリア形成支援」などの一般語の一致で、株式会社キャリアへの言及はない。結ばない。
- relatedCompanies: step: 収益認識の「5ステップアプローチ」の語の一致で、株式会社ステップへの言及はない。結ばない。
- relatedCompanies: port: 「事業ポートフォリオ」の語の一致で、ポート株式会社への言及はない。結ばない。
- relatedCompanies: ishin: 「インターナルカーボンプライシング」の断片の一致で、イシン株式会社への言及はない。結ばない。
- relatedCompanies: innovation: 「オープンイノベーション促進税制積立金」の名称の一致で、株式会社イノベーションへの言及はない。結ばない。
- relatedCompanies: path: 「キャリアパス」の語の一致で、パス株式会社への言及はない（ambiguous）。結ばない。
- relatedCompanies: base-4481: 「約定ベース」の語の一致で、ベース株式会社への言及はない。結ばない。
- relatedCompanies: jinushi: 重要な子会社の状況の表の断片の一致で、地主株式会社への言及はない（ambiguous）。結ばない。
- relatedCompanies: mizuho-financial-group: 主要取引金融機関であり、資金の運用・調達などの金融取引が理由のため結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group: 主要取引金融機関であり、資金の運用・調達などの金融取引が理由のため結ばない。
- relatedCompanies: nissin: コードリストにない相手で、一致は断片的なものにとどまる。結ばない。
- relatedCompanies: trust: コードリストにない相手で、一致は大株主の日本マスタートラスト信託銀行（信託口）の信託保有である。結ばない。
- relatedCompanies: vision: 自社の長期ビジョン「VISION2035」の名称の一致で、株式会社ビジョンへの言及はない。結ばない。
- relatedCompanies: zero: 「カーボンニュートラル（実質排出量ゼロ）」の語の一致で、株式会社ゼロへの言及はない（ambiguous）。結ばない。
- relatedCompanies: raito-kogyo: 沿革に書かれた自社の前身「不二ライト工業所」の一致で、ライト工業株式会社ではない。結ばない。
- relatedCompanies: ricoh: リスク記述の「リコール」の語の一致で、株式会社リコーへの言及はない。結ばない。
- relatedCompanies: suzuki-6785: 役員名「鈴木一人」の人名の一致で、株式会社鈴木への言及はない（ambiguous）。結ばない。販売先のスズキ株式会社は別候補（suzuki）で結んだ。
- terms: 登録候補（助言のみ）: クラッチ（エンジンやモーターの回転をタイヤ側へ伝えたり切り離したりする部品。エフ・シー・シーの主力製品）、摩擦材（クラッチの中で摩擦によって力を伝える材料。湿式と乾式がある）、CASE（コネクテッド、自動運転、シェアリング、電動化の頭文字。次世代の自動車の方向性をまとめた呼び方）、ペーパー触媒（紙のような多孔質ファイバーのシートに触媒の働きを持たせたもの。エンジンの排ガス浄化に使う）、ATV（バギーとも呼ばれる、四輪の不整地走行車）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
