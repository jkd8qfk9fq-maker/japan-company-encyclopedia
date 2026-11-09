# 東京応化工業 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東京応化工業株式会社 |
| 証券コード | 4186 |
| docID（データを取り出した文書） | `S100XT0N` |
| 原本 docID | `S100XT0N` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT0N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東京応化工業株式会社 / 4186 / docID S100XT0N（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-ohka-kogyo: 10 件の数値を有報XBRLと照合
有報: 東京応化工業株式会社 有価証券報告書－第96期(2025/01/01－2025/12/31) (docID S100XT0N)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第95期(2024/01/01－2024/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
tokyo-ohka-kogyo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や人件費などの費用を差し引いた残りが利益になります。2025年12月期のは3…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意（前期の窓に訂正有価証券報告書－第95期がある）への判断: 当期有報の5年間の数値は前期有報との照合で全行一致し、修正再表示は確認されなかったため、needsReviewには入れず本記録に留めた。当期有報自体に訂正はない。
- businessModel: 指標の注記3（2024年1月1日付の1株につき3株の株式分割）は1株当たり指標のみに影響するため、financialNotesには入れず本記録に留めた。
- businessModel: 中期計画の定量目標のうち売上高のみを引用し、営業利益・EBITDA・ROEの目標は文章の規則により書いていない。
- businessModel: 重要な後発事象・重要な契約等として提出後の予定事項は確認されなかった（パックに後発の駐留文書はなく、otherFilingsInWindowは空）。
- businessStructure: 当社は材料事業の単一セグメントであり、セグメント情報の記載は省略されている。事業は【事業の内容】の主たる事業（エレクトロニクス機能材料・高純度化学薬品の製造販売）を親区分とし、子区分はMD&Aおよび収益認識注記に印字された部門別売上高の分解（エレクトロニクス機能材料124,700百万円、高純度化学薬品109,400百万円、その他2,928百万円）によった。3区分の合計は237,028百万円で、連結売上高237,029百万円と1百万円異なるが、有報の丸めであり、印字の数値をそのまま引用した。
- businessStructure: 設備は事業所ごとにエレクトロニクス機能材料および高純度化学薬品の双方の製造・開発設備と連記されているため、子区分には結びつけず、親区分（材料事業）全体の設備として扱った。
- businessStructure: 上場市場は表紙の印字どおり東京証券取引所プライム市場とした。
- history: 【沿革】の2014年11月以降の部分は、年月セル（2014年11月・2016年11月・2021年1月・2021年5月・2022年4月・2022年5月・2023年4月・2024年4月・2024年6月・2025年2月＝10件）と事象文（10件）の数が一致する崩れた表であり、行順に対応づけた。対応づけは、2022年4月のプライム市場移行（市場再編の時期と一致）、2025年2月のmicro resist technology GmbH完全子会社化（MD&Aに当期の出来事として記載）など他節の記載とも整合する。
- history: 採用しなかった行: 1981年宇都宮工場新設、1983年熊谷応化(株)設立・熊谷工場新設、1984年阿蘇工場新設、1987年御殿場工場新設、1989年TOK INTERNATIONAL INC.設立、1992年TOK INTERNATIONAL INC.とOHKA AMERICA, INC.の合併・社名変更、2000年本社社屋完成、2003年流通センター新設、2006年OHKA AMERICA, INC.の社名変更、2021年Europe Branch設立、2022年TOKCCAZ, LLC.設立。いずれも工場・事務所の新設や子会社の社名変更などの細目であり、主要な節目を優先した。
- history: 1940年の設立時の資本金は、文章の規則（資本金の金額を書かない）により記載していない。
- industry: 主たる業界は、単一セグメントの材料事業が化学材料の製造販売であり、東証の業種区分も化学であることからchemicalsとした。
- industry: semiconductorsは2つ目に付けた。主力製品のフォトレジストなどのエレクトロニクス機能材料は、半導体製造に使われる材料として事業を開示しているため（半導体向け部材を事業として開示する会社の扱い）。
- relatedCompanies: 結ばなかった候補と理由（候補ごとに1行）:
- relatedCompanies: en: 一致箇所は当社の連結子会社ティーオーケーエンジニアリングの社名の一部であり、エン株式会社とは無関係。
- relatedCompanies: vision: 一致箇所は長期ビジョン「tok Vision 2030」の語であり、株式会社ビジョンとは無関係。
- relatedCompanies: innovation: 一致箇所は「顧客が感動するイノベーションの提供」という一般的な文言であり、株式会社イノベーションとは無関係。
- relatedCompanies: path: 一致箇所は「パーパス」の語であり、パス株式会社とは無関係（ambiguous）。
- relatedCompanies: port: 一致箇所は「製品ポートフォリオ」の語であり、ポート株式会社とは無関係。
- relatedCompanies: no-1: 一致箇所は「先端レジストのグローバルシェアNo.1を目指す」という文言であり、株式会社No.1とは無関係。
- relatedCompanies: ray: 一致箇所は「ディスプレイ向け材料」の語の一部であり、株式会社レイとは無関係（ambiguous）。
- relatedCompanies: core: 一致箇所は「コアコンピタンス」の語であり、株式会社コアとは無関係（ambiguous）。
- relatedCompanies: cota: 一致箇所は「インコタームズ」の語の一部であり、コタ株式会社とは無関係（ambiguous）。
- relatedCompanies: cover: 一致箇所は「保険金でカバーできず」という文言であり、カバー株式会社とは無関係。
- relatedCompanies: land: 一致箇所は「ブランド」の語の一部であり、株式会社ランドとは無関係。
- relatedCompanies: seki: 一致箇所は「サイバーセキュリティリスク」の語の一部であり、セキ株式会社とは無関係（ambiguous）。
- relatedCompanies: tear: 一致箇所は資産運用会社名「ファースト・センティア・インベスターズ」の一部であり、株式会社ティアとは無関係。
- relatedCompanies: trust: 一致箇所は大株主欄の日本マスタートラスト信託銀行（信託口）の名称であり、株式会社トラストとは無関係。また同候補はコードリストにない。
- relatedCompanies: yamadai: 一致箇所は事務連絡者氏名（松山大介）等の人名・地名の断片であり、株式会社山大とは無関係。また同候補はコードリストにない（ambiguous）。
- relatedCompanies: applied-technology: 一致箇所は「その応用技術の開発」という一般的な文言であり、応用技術株式会社とは無関係。
- relatedCompanies: base-4481: 一致箇所は「戦略をベースとした」という文言であり、ベース株式会社とは無関係。
- relatedCompanies: corona: 一致箇所は「新型コロナウイルス」という文言であり、株式会社コロナとは無関係。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的は「資金の安定的な供給元であり、グローバルな金融取引の維持・拡大」で、資金調達・金融取引が理由のため結ばない（銀行・金融機関の扱い）。
- relatedCompanies: yokohama-financial-group: 保有目的は「資金の安定的な供給元であり、地元銀行として金融取引の維持・強化」で、資金調達・金融取引が理由のため結ばない。
- relatedCompanies: marusan-securities: 保有目的は「金融取引の維持・強化」のみで、金融取引が理由のため結ばない。
- relatedCompanies: toagosei: 特定投資株式に前期の保有はあるが、当事業年度末日において同社株式は保有しておらず、現在の取引関係の記載がないため結ばない。
- relatedCompanies: 大株主の状況（2025年12月31日現在）の上位は信託銀行・生命保険会社・銀行・財団・社員持株会であり、上場する事業会社の候補はいないため、major-shareholderのリンクは付けなかった。
- relatedCompanies: 主要な顧客であるTaiwan Semiconductor Manufacturing Company,Ltd.は候補リストにないため結んでいない（金額はbusinessModelに記載）。
- relatedCompanies: 連結子会社8社・関連会社3社のうち候補リストにあるのはAIメカテックのみで、その他は候補にない。
- terms: 登録候補（助言のみ）: フォトレジスト（半導体などの回路パターンを形成するために使われる感光性の材料。光を当てた部分の性質が変わることで、微細な模様を写し取る）、高純度化学薬品（不純物を極めて少なくした化学薬品。半導体などの製造工程で使われる）、微細加工技術（材料に微細な模様や構造を作り込む技術。同社のコアコンピタンスの一つ）、高純度化技術（材料の不純物を取り除き純度を高める技術。同社のコアコンピタンスの一つ）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
