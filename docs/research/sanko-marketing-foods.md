# SANKO MARKETING FOODS — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＳＡＮＫＯ　ＭＡＲＫＥＴＩＮＧ　ＦＯＯＤＳ |
| 証券コード | 2762 |
| docID（データを取り出した文書） | `S100Z3DU` |
| 原本 docID | `S100Z3DU` |
| 提出日（原本） | 2026-09-24 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3DU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＳＡＮＫＯ　ＭＡＲＫＥＴＩＮＧ　ＦＯＯＤＳ / 2762 / docID S100Z3DU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanko-marketing-foods: 10 件の数値を有報XBRLと照合
有報: 株式会社ＳＡＮＫＯ　ＭＡＲＫＥＴＩＮＧ　ＦＯＯＤＳ 有価証券報告書－第50期(2025/07/01－2026/06/30) (docID S100Z3DU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sanko-marketing-foods: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社SANKO MARKETING FOODS」が EDINET の提出者名「株式会社ＳＡＮＫＯ　ＭＡＲＫＥＴＩＮＧ　ＦＯＯＤＳ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全系列で差異ゼロであった。訂正有報は無く（2026年11月12日まで確認）、当期の有報自体に訂正はない。
- businessModel: 重要な後発事象として、第3回無担保転換社債型新株予約権付社債の一部の権利行使（翌期首以降）が開示されている。資本政策に関する事象のため本文には書かず、ここに記録する。
- businessModel: 表紙には、2026年9月25日から本店を東京都新宿区高田馬場一丁目へ移転する予定である旨が印字されている。提出時点では予定のため、本文では現在の本店所在地を書き、移転は needsReview に記録した。
- businessModel: MD&Aに印字された売上高と当期純損失以外の金額（損失の内訳など）は本文には書かなかった。
- businessModel: 経営方針に印字された中期的な売上高に関する目標は、投資に関する指標の目標であるため本文と perspectives には書かなかった。
- businessModel: Wikipediaの記事は取得されなかった（wikipedia.json は found=false）ため、補足には使わなかった。
- businessStructure: 単一セグメントのため、セグメント別の金額は開示されておらず、業態別の販売実績（MD&A）を children の金額に用いた。
- businessStructure: 業態別の販売実績の合計は10,568百万円で、印字された売上高10,570百万円と2百万円異なる。印字どおりの数値をそのまま記載した。
- businessStructure: 連結子会社は綜合食品東海、綜合食品、綜合食品販売、ジーエスサンヘイ、SANKO OCEAN WORKSの5社（2026年6月30日現在）で、いずれも自社の子会社であり関連企業としては結ばない。
- businessStructure: 主要な設備の帳簿価額などの金額は書かなかった。
- history: 沿革は行数が多いため、設立・上場・商号変更・主力業態の開始・水産事業の始動・事業譲受など会社の形を変えた出来事を選んだ。
- history: 2025年12月の株式会社大治との業務提携基本合意と2025年9月の日清食品「完全メシ」とのコラボレーションは、沿革に印字された出来事として warnings に記録し、history には選ばなかった。
- industry: 主たる業界は food とした。飲食店の運営そのものを指す区分が閉じた集合に無いため、外食事業者の慣例に揃えた。水産物の卸売も同じ food の範囲で扱い、副業界は付けなかった。
- relatedCompanies: corona（コロナ）: 「コロナ禍」という語に一致するのみで、株式会社コロナとの取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: port（ポート）: 「ポートフォリオ」という語などに一致するのみで、ポート株式会社との関係の記載はないため結ばなかった。MD&Aの「うお一番」への運営サポートは株式会社Carry Onとの連携の記載であり、候補に無い Carry On は結べない。
- relatedCompanies: land（ランド）: 一般的な語に一致するのみで、株式会社ランドとの関係の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「時価ベース」という語に一致するのみで、ベース株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: en（エン、ambiguous）: 一般的な語に一致するのみで、エン株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: slogan（スローガン）: 「スローガン」という語そのものに一致するのみで、スローガン株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: path（パス、ambiguous）: 「パスタママ」という業態名の一部に一致するのみで、パス株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: seki（セキ、ambiguous）: 「セキュリティ」という語の一部に一致するのみで、セキ株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: arata（あらた）: 「あらためて」という語に一致するのみで、株式会社あらたとの関係の記載はないため結ばなかった。
- relatedCompanies: kohsoku（高速、ambiguous）: 「高速かつ即断」という表現に一致するのみで、株式会社高速との関係の記載はないため結ばなかった。
- relatedCompanies: ray（レイ、ambiguous）: 一般的な語の一部に一致するのみで、株式会社レイとの関係の記載はないため結ばなかった。
- relatedCompanies: rix（リックス）: 「マトリックス」という語の一部に一致するのみで、リックス株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: 大株主のアサヒビール株式会社（1.5％、2026年6月30日現在）は候補（related-candidates.json）に含まれておらず、候補の中からだけ選ぶ規則のため結ばなかった。その他の大株主は個人、信託・証券会社、投資ファンド等であり結ばなかった。
- relatedCompanies: 特定投資株式は保有しておらず（「該当事項はありません」）、政策保有株式を根拠とする候補も無い。
- relatedCompanies: 業務提携先の沼津我入道漁業協同組合、株式会社津田食品、株式会社Carry On、株式会社大治、株式会社Fリミテッドはいずれも候補に含まれない（上場会社ではない）ため結ばなかった。
- terms: 助言: 用語「水産6次産業化」は、同社グループが産地から入り、生産者とともに歩み、調達・加工・流通から飲食店舗での提供までをつなぐ事業の進め方を指す言葉です。事業の内容と経営方針に印字されています。
- terms: 助言: 用語「産地活性化プラットフォーマー」は、同社グループが水産の産地に入り、生産者とともに価値ある食文化を提案する立場を表す言葉です。MD&Aに印字されています。
- terms: 助言: 用語「アカマル屋鮮魚店」は、グループの水産の供給網を活かし、提携する定置網漁業者による漁獲を活用する大衆酒場の業態です。経営方針とMD&Aに印字されています。

## 要確認（status に反映）

- businessModel: 継続企業: 継続企業の前提に重要な疑義を生じさせるような事象または状況が存在すると開示されている。会社は、収益改善策と財務基盤の強化などの対応策を実施していることから、継続企業の前提に関する重要な不確実性は認められないと判断し、当面の事業活動の継続性に懸念はないとしている。2026年6月期の親会社株主に帰属する当期純損失は793百万円で、主要な経営指標等では5期連続の当期純損失となっている。
- businessModel: 本店移転: 表紙に、2026年9月25日から本店を東京都中央区新川一丁目10番14号から東京都新宿区高田馬場一丁目28番10号へ移転する予定である旨が印字されている。提出日（2026年9月24日）時点では予定事項である。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] SANKO MARKETING FOODSの主事業（飲食店の運営と水産物の流通） → 提案: 外食（飲食店の運営・フードサービス）。主事業は料理を店で提供する飲食店の運営であり、食品の製造・販売を指す food とは業態が異なるため
