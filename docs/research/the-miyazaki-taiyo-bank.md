# 宮崎太陽銀行 — research log

Registered: 2026-11-19（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　宮崎太陽銀行 |
| 証券コード | 8560 |
| docID（データを取り出した文書） | `S100YG72` |
| 原本 docID | `S100YG72` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG72.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E5%AE%AE%E5%B4%8E%E5%A4%AA%E9%99%BD%E9%8A%80%E8%A1%8C

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社　宮崎太陽銀行 / 8560 / docID S100YG72 |
| edinet | completed | 1 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-miyazaki-taiyo-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社　宮崎太陽銀行 有価証券報告書－第125期(2025/04/01－2026/03/31) (docID S100YG72)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-miyazaki-taiyo-bank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「株式会社宮崎太陽銀行」が EDINET の提出者名「株式会社　宮崎太陽銀行」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 第1回B種優先株式（議決権なし、600,000株）が残存している。2022年3月に第三者割当方式で発行され、引受先は宮崎銀行（100千株）、九州総合信用（15千株）、福岡中央銀行・南日本銀行・豊和銀行（各10千株）など地域の金融機関・法人・個人で、整理回収機構などの公的機関は含まれず、金融機能強化法や経営強化計画の印字もない。取締役の指名権・事前同意権のようなガバナンス条項の印字もなく、重要な契約等は「該当事項はありません」と印字されているため、資本政策の事項としてwarningsに記録し、needsReviewには入れなかった（南日本銀行の前例と同型）。
- businessModel: A種優先株式は2022年11月に完済されており、残存していない。
- businessModel: 中期経営計画の数値目標は目標値のため、本文・perspectivesに書かなかった。
- businessModel: 前期有報との重複年度は全て一致しており、修正再表示はない。変則決算・決算期変更・会計基準の変更もないためfinancialNotesは空とした。
- businessModel: suppliers（調達先）はこのツリーの旧スキーマに合わせて省いた。有報に自社の調達先にあたる印字もない。
- businessModel: Wikipediaは第二地方銀行という位置づけの補足にだけ使い、数値は使っていない。
- businessStructure: セグメント注記の外部顧客に対する経常収益は、銀行業15,749百万円・リース・保証等事業2,273百万円・その他22百万円で、単純合計は18,044百万円となり、連結経常収益18,046百万円と2百万円差がある（報告セグメント計の印字も18,023百万円で単純合計18,022百万円と1百万円差）。有報の丸めの範囲と判断し、印字どおり記載した。
- businessStructure: 上場先は表紙DEIの「福岡証券取引所」で、市場区分の印字がないため listings に market は付けていない。
- businessStructure: Wikipediaは第二地方銀行という位置づけの補足にだけ使い、数値は使っていない。
- history: 沿革に印字された資本金の金額（1990年の上場時、2001年の第三者割当増資時）は、規則により金額を省き事象のみを記載した。
- history: A種優先株式の発行額・第1回B種優先株式の発行額も資本に関する金額のため、沿革には金額を書かず事象のみを記載した。
- history: 2017年10月の単元株式数の引下げ及び株式併合は、株式の取扱いに関する事項として沿革に印字されているが、現在の経営指標の表は併合後の基準で印字されており、項目としては立てなかった。
- industry: 主たる業界は、経常収益の大半を占める銀行業から finance とした。リース・保証等事業とベンチャーキャピタル業務も金融サービスであり、独立した業界は足していない。
- relatedCompanies: the-minami-nippon-bank: 【大株主の状況】に2.30％（130千株）で載り、特定投資株式の保有目的にも「基幹システムの共同利用行として、また災害時における相互協力及び販路開拓支援業務を含めた協力関係の維持・強化」と印字されているが、related-candidates.jsonに含まれていないため結ばなかった。
- relatedCompanies: the-howa-bank: 【大株主の状況】に2.24％（127千株）で載り、特定投資株式の保有目的も南日本銀行と同一の印字（基幹システムの共同利用行・災害時における相互協力）だが、related-candidates.jsonに含まれていないため結ばなかった。
- relatedCompanies: 株式会社福岡中央銀行・株式会社福岡銀行・株式会社西日本シティ銀行・株式会社大成住宅・九州総合信用株式会社: 【大株主の状況】に載るが、related-candidates.jsonに含まれていないため結ばなかった（ふくおかフィナンシャルグループと西日本フィナンシャルホールディングスは各行の親会社で、株主である銀行自身とは別法人のため結ばなかった）。
- relatedCompanies: nomura-holdings: 特定投資株式の保有目的に「当行との投資信託販売や有価証券運用など協力関係の維持・強化」と印字されているが、具体的な提携・契約の印字がないため結ばなかった。
- relatedCompanies: japan-asia-investment: 特定投資株式の保有目的は「連結子会社との取引関係の維持・強化」で、当行自身との取引・提携の具体的な内容の印字がないため結ばなかった。
- relatedCompanies: fukuoka-financial-group / kyushu-financial-group / the-bank-of-toyama: 特定投資株式の保有目的が「営業基盤が異なる同業種として、経営戦略上の協力関係の維持・強化」という同業他行と同一の定型文のみで、具体的な取引・提携の印字がないため結ばなかった。
- relatedCompanies: jimoto-holdings / the-towa-bank / 株式会社高知銀行: 特定投資株式の保有目的が「異なる営業地域において、地域経済活性化に注力する同業種として、経営戦略上の協力関係の維持・強化」という同一の定型文のみのため結ばなかった（高知銀行は候補にも含まれていない）。
- relatedCompanies: the-chikuho-bank: 保有目的の変更後、当事業年度末までに売却済みのため結ばなかった。
- relatedCompanies: mizuho-financial-group / nishi-nippon-financial-holdings / tokio-marine-holdings / daiwa-securities-group: 保有目的を純投資目的に変更済み（政策保有の解除）で、現在の政策保有ではないため結ばなかった。
- relatedCompanies: path / base-4481 / port / seki / en / king / rent / freee / will / nissin / sunday: 社名や語の部分一致のみで、当行との関係の印字がないため結ばなかった。
- relatedCompanies: 連結子会社の株式会社宮崎太陽リースと株式会社宮崎太陽キャピタルは自社の子会社のため、リンク対象にせず businessStructure に記載した。
- terms: 用語の助言: 「第二地方銀行」は地方銀行のうち一般社団法人第二地方銀行協会の会員である銀行を指す区分、「経常収益」は銀行の売上高にあたる収益の科目、「無尽会社」は無尽講を営む会社で相互銀行の前身にあたる組織、「特定投資株式」は純投資目的以外で保有する上場株式、「みなし保有株式」は退職給付信託等に拠出し議決権行使の指図権限を留保する株式、「勘定系システム」は預金・貸出・為替などの銀行の中核業務を処理するシステムを指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
