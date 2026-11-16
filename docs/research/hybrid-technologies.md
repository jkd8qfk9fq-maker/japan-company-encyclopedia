# ハイブリッドテクノロジーズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ハイブリッドテクノロジーズ |
| 証券コード | 4260 |
| docID（データを取り出した文書） | `S100XBWA` |
| 原本 docID | `S100XBWA` |
| 提出日（原本） | 2025-12-19 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBWA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ハイブリッドテクノロジーズ / 4260 / docID S100XBWA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hybrid-technologies: 10 件の数値を有報XBRLと照合
有報: 株式会社ハイブリッドテクノロジーズ 有価証券報告書－第10期(2024/10/01－2025/09/30) (docID S100XBWA)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hybrid-technologies: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記は5件のみで、いずれも表示事項（IFRSにより連結財務諸表を作成していること、千円未満の四捨五入、第6期の希薄化後指標の非記載、上場前の株価収益率の非記載、従業員数の定義）であるため、financialNotesは付けなかった。株式分割・株式併合、決算期変更、変則決算の記載はない。
- businessModel: 前期有報（第9期、S100V0A3）との修正再表示照合は6系列すべてで差異ゼロだった。
- businessModel: セグメント注記のサービス別売上収益の千円単純合計（3,024,743千円）は印字の合計（3,024,742千円）と1千円異なる。IFRSの千円未満四捨五入によるもので、印字どおり記載した。
- businessModel: MD&Aの段階利益の金額と増減理由、キャッシュ・フローの金額、連結子会社の単独の損益情報は書いていない。
- businessModel: 経営方針の客観的な指標（ストックサービス件数・単価）は投資指標ではないが、金額目標ではないため本文には書かず、定性的な戦略のみを記載した。
- businessModel: 表紙の注記にある本店移転（2025年12月22日から東京都中野区へ移転予定）は提出後の予定であり、完了とは書いていない。
- businessStructure: 単一セグメントのため、サービス別の売上収益（セグメント注記の【関連情報】）をchildrenとした。ストックサービス2,551,502千円とフローサービス473,241千円の千円単純合計は3,024,743千円で、印字の合計3,024,742千円と1千円異なる（IFRSの端数処理は千円未満を四捨五入）。切り捨て後の百万円合計は一致する。印字どおり記載した。
- businessStructure: 連結子会社は2025年9月30日現在で6社（Hybrid Technologies Vietnam Co., Ltd.、Hybrid Techno Camp Co., Ltd.、株式会社ハイブリッドテックエージェント、Wur株式会社、ドコドア株式会社、株式会社ハイブリッドビジネスコンサルティング）。Hybrid Techno Camp Co., Ltd.は2021年6月末に事業活動を停止し、現地の法律に従い清算結了の手続き中であるが、期末現在は連結子会社として【関係会社の状況】に記載されているため、そのまま登録した。
- businessStructure: 2023年6月にベトナムに設立した合弁会社Circlace HT Co., Ltd.は【関係会社の状況】に記載がないため、連結子会社として数えていない。
- businessStructure: 主要な設備はすべて単一セグメント（ハイブリッド型サービス）の事務所設備であり、事業への結びつけはセグメント欄の印字どおり単一事業とした。設備の帳簿価額は書いていない。
- businessStructure: 表紙の注記では、本店は2025年12月22日から東京都中野区本町３－31－11へ移転する予定とされている。提出後の予定であり、登録は期末現在の所在地に基づく。
- history: 沿革の表は年月と事象文が対応づいて印字されており、行順どおりに採用した。月は書かず年だけとした。
- history: 省いたもの：本社の移転（2017年6月、2018年10月）、Japan Tech Co., Ltd.の連結子会社化（2018年）と清算完了（2020年）、ベトナム子会社のISO/IEC27001・ISO9001認証取得（2019年）、Hybrid Techno Camp Co., Ltd.の連結子会社化（2020年、清算手続き中）、合弁会社Circlace HT Co., Ltd.の設立（2023年）、プライバシーマーク認証の取得（2024年）、取締役会長と代表取締役社長の就任（2024年12月）。
- history: 2025年の2件（NGSC社の連結子会社化、株式会社エアトリの連結子会社化）は決算期末（2025年9月30日）後の出来事で、【沿革】に印字されているため沿革に含めた。登録上のグループ構成・関係は期末現在としており、needsReviewに記録した。
- industry: 主たる業界はitとした。単一セグメントのハイブリッド型サービスはソフトウェア開発を軸とするDX支援であり、売上収益の全額がこれに当たる。
- industry: human-resourcesは付けなかった。連結子会社の株式会社ハイブリッドテックエージェントがIT人材の派遣・SESを行うが、単一セグメントの中で金額が独立して開示されておらず、報告セグメント単位の開示がないためである。
- relatedCompanies: airtrip（株式会社エアトリ）: 【関係会社の状況】の区分（その他の関係会社）と、主要な顧客としての販売関係の両方が印字されているため結んだ。2025年10月に同社の連結子会社となったことは期間後の変更であり、needsReviewに記録した。
- relatedCompanies: circlace（サークレイス株式会社）: 2023年6月に合弁会社Circlace HT Co., Ltd.を設立した相手だが、【関係会社の状況】に記載がなく、現在の取引・資本関係の記述がないため結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous。「エンジニア」等の一般語の部分一致のみで、相手についての記述はないため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous。「セキュリティ」等の部分一致のみのため結ばなかった。
- relatedCompanies: step（株式会社ステップ）: 収益認識の「5ステップアプローチ」の語のみのため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: コードリストにない相手で、新株予約権の条文中の部分文字列のみのため結ばなかった。
- relatedCompanies: technologies（株式会社テクノロジーズ）: 自社名の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「連結ベース」の語のみのため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 自社のビジョン「New View With You」の語のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」の部分一致のみのため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 新型コロナウイルス感染症の文脈のみのため結ばなかった。
- relatedCompanies: ichigo（いちご株式会社）: 本社所在地のビル名「いちご新川ビル」のみのため結ばなかった。
- relatedCompanies: the-lead（株式会社リード）: 「リードしていく」という動詞の文脈のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: コンサルティング人材の「キャリア」という一般語のみのため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 「カバーする」という動詞の文脈のみのため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 株式会社エアトリの事業名「ライフイノベーション事業」の部分のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: ambiguous。減損の「回収可能価格をゼロ」の語のみのため結ばなかった。
- relatedCompanies: 候補に無い相手: Soltec Investments Pte. Ltd.は【関係会社の状況】の「その他の関係会社」（被所有34.5％、2025年9月30日現在）だが、シンガポールの非上場の投資会社で候補に無いため結ばなかった。Evolable Asia Co., Ltd.も「その他の関係会社」（被所有3.1％）だが、ベトナムの会社で候補に無いため結ばなかった。株式会社グロースリンクは合弁会社の共同設立相手だが候補に無いため結ばなかった。自社の連結子会社は結ばない。
- terms: 助言のみ。用語としては『ハイブリッド型サービス』『ストックサービス』『フローサービス』『ブリッジシステムエンジニア』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 2025年10月１日にNGS Consulting Joint Stock Companyの発行済株式の40％を取得し、取締役の指名権等に関する株主間契約に基づき、実質支配力基準により同社を連結子会社としています（後発事象）。登録は2025年９月30日現在のグループ構成（連結子会社６社）で行っており、期間後の子会社追加の反映には人の確認が必要です。
- businessModel: 2025年10月に、株式会社エアトリとSoltec Investments Pte. Ltd.との間で当社の議決権の行使に関する同意があったことで、当社は実質支配基準に基づき株式会社エアトリの連結子会社及び特定子会社となっています。登録は2025年９月30日現在の関係（株式会社エアトリはその他の関係会社）で行っており、期間後の親会社関係の反映には人の確認が必要です。
- businessStructure: 2025年10月１日にNGS Consulting Joint Stock Companyの発行済株式の40％を取得し、取締役の指名権等に関する株主間契約に基づき、実質支配力基準により同社を連結子会社としています（後発事象）。登録は2025年９月30日現在のグループ構成（連結子会社６社）で行っており、期間後の子会社追加の反映には人の確認が必要です。
- businessStructure: 2025年10月に、株式会社エアトリとSoltec Investments Pte. Ltd.との間で当社の議決権の行使に関する同意があったことで、当社は実質支配基準に基づき株式会社エアトリの連結子会社及び特定子会社となっています。登録は2025年９月30日現在の関係（株式会社エアトリはその他の関係会社）で行っており、期間後の親会社関係の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
