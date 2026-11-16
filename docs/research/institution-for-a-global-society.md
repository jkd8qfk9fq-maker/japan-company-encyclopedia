# Institution for a Global Society — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | Ｉｎｓｔｉｔｕｔｉｏｎ　ｆｏｒ　ａ　Ｇｌｏｂａｌ　Ｓｏｃｉｅｔｙ株式会社 |
| 証券コード | 4265 |
| docID（データを取り出した文書） | `S100YIQZ` |
| 原本 docID | `S100YIQZ` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIQZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | Ｉｎｓｔｉｔｕｔｉｏｎ　ｆｏｒ　ａ　Ｇｌｏｂａｌ　Ｓｏｃｉｅｔｙ株式会社 / 4265 / docID S100YIQZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
institution-for-a-global-society: 6 件の数値を有報XBRLと照合
有報: Ｉｎｓｔｉｔｕｔｉｏｎ　ｆｏｒ　ａ　Ｇｌｏｂａｌ　Ｓｏｃｉｅｔｙ株式会社 有価証券報告書－第16期(2025/04/01－2026/03/31) (docID S100YIQZ)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
institution-for-a-global-society: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「Institution for a Global Society株式会社」が EDINET の提出者名「Ｉｎｓｔｉｔｕｔｉｏｎ　ｆｏｒ　ａ　Ｇｌｏｂａｌ　Ｓｏｃｉｅｔｙ株式会社」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…年3月期に構造改革を完了し、以降は「利益ある成長」のフェーズへ移行するとして…）

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記1（第14期からの連結開始）はfinancialNoteとして2024年3月期に付けた。注記2〜5（潜在株式はあるが損失のため希薄化後指標を非記載、損失のため自己資本利益率・株価収益率を非記載、従業員数の定義）は表示事項のためwarningsのみとした。株式分割・株式併合、決算期変更、変則決算の記載はない。
- businessModel: 前期有報との修正再表示照合は、重複する全系列で差異ゼロだった（訂正なし）。
- businessModel: セグメント外部売上高の切り捨て後の合計（281＋328＋48＝657百万円）は売上高659百万円と2百万円異なる。千円印字（281,900千円、328,877千円、48,366千円、合計659,144千円）は一致しており、百万円への切り捨て差異である。印字どおり記載した。
- businessModel: 中期経営計画の数値目標（2029年3月期の売上収益・利益率の目標）は投資・利益指標であるため、本文とperspectivesには金額・比率を書かず、定性的な戦略のみを記載した。
- businessModel: MD&Aの段階利益（セグメント利益を含む）の金額と増減理由、キャッシュ・フローの金額は書いていない。プラットフォーム/Web3事業のONGAESHIプロジェクト撤退と売掛金への貸倒引当金の計上はMD&Aの損失理由であり、本文には書いていない。
- businessModel: 【事業の内容】では第3の事業を「グローバルプラットフォーム事業（旧　プラットフォーム/Web3事業）」と表記しているが、セグメント注記の報告セグメント名は「プラットフォーム/Web3事業」であり、登録はセグメント注記の名称で行った。名称変更は期間後の決議であり、needsReviewに記録した。
- businessStructure: セグメントは報告セグメント3区分（教育事業・HR事業・プラットフォーム/Web3事業）で登録し、外部売上高の大きい順に並べた。切り捨て後の合計657百万円は売上高659百万円と2百万円異なる（千円印字は一致）。印字どおり記載した。
- businessStructure: 連結子会社は2026年3月31日現在でONGAESHI匿名組合1件（特定子会社、プラットフォーム/Web3事業、匿名組合出資75％）である。自社の子会社は関連企業として結ばない。
- businessStructure: ONGAESHI Corporation（英国ヴァージン諸島、暗号資産関連事業）は2026年3月に清算手続きを開始し、【関係会社の状況】から除外されている。期間中の出来事であり、期末現在のグループ構成には含めていない。
- businessStructure: 主要な設備は本社（東京都渋谷区）のみで、設備表のセグメント欄には3事業すべてが連記されているため、特定の事業には結びつけなかった。設備の帳簿価額は書いていない（賃借オフィスのため帳簿価額の記載なし）。
- businessStructure: suppliersキーは本ツリーの旧スキーマどおり省略した。【事業の内容】に個別の仕入先名の記載はない。
- history: 沿革は年月と事象文が対応づいて印字されており、行順どおりに採用した。月は書かず年だけとし、設立時の資本金額は書いていない。
- history: 省いたもの：株式会社igsZの設立（2014年）、株式会社Z会によるigsZ株式70％の取得（2015年）と当社のigsZ全株式の売却（2018年）、ベトナム子会社Institution for a Global Society Asia Company Limitedの設立（2016年）と清算結了（2020年）、適性検査ツール「GROW360」の提供開始（2017年）、本社の移転（2018年・2020年）、動画コンテンツ「GROW Academy」の提供開始（2020年）、企業向けDX推進支援サービス「DxGROW」の提供開始（2021年）、「人的資本理論の実証化研究会」の発足（2022年）、「ONGAESHIプロジェクト」への参画（2023年）、ONGAESHI Corporationの設立（2023年）と清算開始（2026年）、「Ai GROW Lite」の専売連携開始（2024年）、幼児向け気質測定ツール「First GROW」（2025年）と企業向け評価ツール「GROW360+」（2025年）の提供開始。
- history: Wikipediaは見つからなかったため使用していない。
- industry: 主たる業界はhuman-resources（暫定）とした。中核事業はAIによる人材評価と人的資本コンサルティングであり、人材紹介・派遣ではないため taxonomyGaps に記録した。
- industry: itを2つ目に付けた。自社開発の評価システム群と予測市場プラットフォーム「Signals」の提供が事業の基盤であり、プラットフォーム/Web3事業（外部売上高48百万円）もソフトウェア基盤の事業であるためである。
- industry: educationに当たる区分は閉じた集合に無い。教育事業は最大のセグメント（外部売上高328百万円）だが、企業向けHR事業と同一の評価技術・データを基盤とするため、主たる業界の暫定分類とgapの理由に含めて記録した。
- relatedCompanies: uchida-yoko（株式会社内田洋行）: 【事業の内容】に「Ai GROW Lite」の共同開発と同社の学習eポータルとの専売連携が印字されているため結んだ。
- relatedCompanies: yamaha（ヤマハ株式会社）: 【事業の内容】に同社との連携によるコロンビア市場での「Ai GROW」展開が印字されているため結んだ。
- relatedCompanies: en（エン株式会社）: ambiguous。「エンパワーメント」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: core（株式会社コア）: ambiguous。「コア技術」「能力スコア」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア履歴」等の一般語のみのため結ばなかった。
- relatedCompanies: path（パス株式会社）: ambiguous。「パーパス」の部分一致のみのため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 自社の「ビジョン」の語のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「コンピテンシー・ベース」の語のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: ambiguous。「ゼロ知識証明」の語のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」の部分一致のみのため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: コードリストにない相手で、新株予約権の条文中の部分文字列のみのため結ばなかった。
- relatedCompanies: rhythm（リズム株式会社）: 「アルゴリズム」の部分一致のみのため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: DEI（多様性・公平性・包摂）の推進に関する一般的な文脈のみのため結ばなかった。
- relatedCompanies: king（株式会社キング）: 「マーケティング」「シンキング」等の部分一致のみのため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguous。「プレイヤー」の部分一致のみのため結ばなかった。
- relatedCompanies: rent（株式会社レント）: 「タレント」の部分一致のみのため結ばなかった。
- relatedCompanies: secure（株式会社セキュア）: 「セキュアデータ基盤」という技術領域の語のみのため結ばなかった。
- relatedCompanies: taya（株式会社田谷）: ambiguous。「世田谷区」の地名の部分一致のみのため結ばなかった。
- relatedCompanies: with-us（株式会社ウィザス）: 【大株主の状況】に大株主として印字されているが、コードリストにない相手のため結ばなかった。
- relatedCompanies: 候補に無い相手: 三井住友信託銀行株式会社は2024年1月に業務提携を締結し人的資本ソリューションを共同提供しているが候補に無いため結ばなかった（提携自体は沿革に記録した）。株式会社JTBは教育効果システム「J's GROW」の共同開発相手だが候補に無いため結ばなかった。プルータス・グループは2025年11月に資本業務提携契約を締結したが候補に無いため結ばなかった。株式会社Z会は子会社igsZの株式を保有していた時期があるが2018年に当社が全株式を売却済みで候補にも無いため結ばなかった。【株式の保有状況】は特定投資株式・みなし保有株式とも「該当事項はありません」。自社の連結子会社ONGAESHI匿名組合は結ばない。
- terms: 助言のみ。用語としては『GROW360』『Ai GROW』『IAT（潜在連合テスト）』『気質』『コンピテンシー』『予測市場』『人的資本』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 翌連結会計年度より、報告セグメント「プラットフォーム/Web3事業」の名称を「グローバルプラットフォーム事業」へ変更し、グループ内のグローバル展開を一元的に集約・牽引する事業区分として再定義することを、2026年６月16日開催の取締役会で決議しています（重要な後発事象）。登録は2026年３月31日現在のセグメント区分（ＨＲ事業・教育事業・プラットフォーム/Web3事業）で行っており、期間後のセグメント変更の反映には人の確認が必要です。
- businessStructure: 翌連結会計年度より、報告セグメント「プラットフォーム/Web3事業」の名称を「グローバルプラットフォーム事業」へ変更し、グループ内のグローバル展開を一元的に集約・牽引する事業区分として再定義することを、2026年６月16日開催の取締役会で決議しています（重要な後発事象）。登録は2026年３月31日現在のセグメント区分（ＨＲ事業・教育事業・プラットフォーム/Web3事業）で行っており、期間後のセグメント変更の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] Institution for a Global Societyの評価事業（HR事業・教育事業） → 提案: 人的資本・教育評価プラットフォーム。有価証券報告書は報告セグメントをHR事業・教育事業・プラットフォーム/Web3事業とし、中核はAIで評価バイアスを補正する人材評価システム「GROW360」「Ai GROW」による能力の可視化である。人材紹介・派遣ではなく評価と教育のデータプラットフォームであり、教育にも人材サービスにも合う区分が閉じた集合に無いため、企業向け評価事業として最も近いhuman-resourcesを暫定とした。
