# 浜松ホトニクス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 浜松ホトニクス株式会社 |
| 証券コード | 6965 |
| docID（データを取り出した文書） | `S100XDC2` |
| 原本 docID | `S100XAWU` |
| 提出日（原本） | 2025-12-18 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | S100XDC2／有効文書 S100XDC2（2026-11-07 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XDC2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 浜松ホトニクス株式会社 / 6965 / docID S100XAWU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hamamatsu-photonics: 10 件の数値を有報XBRLと照合
有報: 浜松ホトニクス株式会社 訂正有価証券報告書－第78期(2024/10/01－2025/09/30) (docID S100XDC2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第78期(2024/10/01－2025/09/30)、docID S100XDC2）を有効文書としてこのパックを作った。原本は docID S100XAWU。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはBusinessPolicyBusinessEnvironmentIssuesToAddressEtcTextBlock・IndependentAuditorsReportConsolidatedTextBlock・KeyAuditMattersConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hamamatsu-photonics: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 収益認識基準の適用開始（第75期期首）は、経営指標等の注記に印字された基準の切り替わりのため financialNotes に記録した（halows/san-a/takeuchi/nishio/kanamoto/mitsui-high-tec の先例）。前期有報との修正再表示チェックは全行一致。
- businessModel: パックの「財務諸表の組替え・遡及適用」警告について: 本文ファイルの範囲では5年系列に影響する組替え・表示変更は確認できず、確認できた基準変更は収益認識基準の適用開始のみ。判断をここに記録する。
- businessModel: 提出後の自己株式取得（2025年11月7日取締役会決議、取得期間2025年11月10日から2026年9月30日、市場買付）は有報の重要な後発事象に開示された通常の資本政策であり、グループ構成の変更ではないため needsReview ではなく warnings に記録する（chudenko/san-a/mirarth の先例）。金額は本文に書いていない。
- businessModel: 2022年11月公表の3年経営計画の目標（売上高・利益）は未達であったことが MD&A に印字されているが、利益目標の数値は本文に書かない規則のため perspectives にも書いていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（光半導体79,505→電子管71,906→画像計測機器32,703→レーザ22,255百万円）。「その他」は有報が報告セグメントに含まれないと明記する区分のため、金額にかかわらず最後に置いた。
- businessStructure: 光半導体事業の製造会社として【事業の内容】に印字されるフェアチャイルド・イメージング・インクは、当期に連結子会社となった会社であり、セグメント注記に負ののれん発生益の記載がある（金額は本文に書かない）。
- businessStructure: 有効文書は訂正有価証券報告書（docID S100XDC2）。分類は record-only で、財務数値・本文とも原本（S100XAWU）と同一のため、訂正を理由とする needsReview は付けない。
- history: 【沿革】は年月と事象がインラインで対になった表のため、年単位で採用した。
- history: 落とした行（いずれも【沿革】に印字）: 1961年東京事務所新設、1966年ニューヨーク駐在員事務所新設、1967年本社移転、1978年事業目的への医療機器等の追加、1979年大阪営業所新設、1981年天王製作所新設、1983年常光製作所新設・米国持株会社設立、1985年本社事務所新設・筑波研究所新設・フランス子会社設立、1988年英国子会社設立、1994年都田製作所新設、2008年産業開発研究所開設、2020年ベルギー持株会社設立、2021年東京営業所移転。営業所・工場・子会社設立などの細目であるため。
- history: 1953年の設立時の資本金（50万円）は、金額を本文に書かない規則のため沿革にも書いていない。
- industry: 主たる業界は electronics（電機）とした。東証の業種分類は電気機器であり、4つの報告セグメントはいずれも光関連の電機・電子製品の製造・販売である。
- industry: semiconductors（半導体）を2つ目に付けた。光半導体事業は外部顧客への売上高79,505百万円と最大の報告セグメントであり、シリコンフォトダイオードやイメージセンサなどの半導体素子そのものを製造・販売する事業として独立開示されているため（JAE/mitsui-high-tec の先例）。
- industry: machinery（機械）は付けなかった。画像計測機器・レーザ装置は装置製品だが、事業の中心は光デバイスであり、独立した機械事業の開示ではないため。
- relatedCompanies: enshu（エンシュウ）: 【株式の保有状況】の保有目的に当社レーザ事業部との業務提携による共同開発・販売の推進が印字されており、株式数も200,000株と実質的な保有のため business-partner として結んだ。取引の向きは印字されていない。
- relatedCompanies: sigmakoki（シグマ光機）: 保有目的に当社にない光学設計技術の保有と技術面の相乗効果が印字されており、株式数1,000,000株と実質的な保有のため technology として結んだ。
- relatedCompanies: resona-holdings（りそなホールディングス）: 505,400株を保有するが、保有目的は金融取引の維持・発展であり、銀行・金融機関は資金調達・金融取引が理由なら結ばない規則により結ばなかった。
- relatedCompanies: shizuoka-financial-group（しずおかフィナンシャルグループ）: 20,000株を保有するが、保有目的は地元金融機関としての金融取引の維持・発展であり、同様に結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）: 当事業年度に全株式を売却しており、期末時点の保有がないため結ばなかった。
- relatedCompanies: nikon（ニコン）: 当事業年度に全株式を売却しており、期末時点の保有がないため結ばなかった。
- relatedCompanies: shimadzu（島津製作所）: 当事業年度に全株式を売却しており、期末時点の保有がないため結ばなかった。
- relatedCompanies: land（ランド）: 一致箇所は連結子会社「磐田グランドホテル」の社名の一部であり、株式会社ランドとは無関係のため結ばなかった。
- relatedCompanies: vision（ビジョン）: 一致箇所は自社子会社の旧称「ハママツ・テレビジョン」の一部であり、株式会社ビジョンとは無関係のため結ばなかった。
- relatedCompanies: core（コア）: 一致箇所は「競争力のコア」という一般語であり、ambiguous のため結ばなかった。
- relatedCompanies: kohsoku（高速）: 一致箇所は「高速・高品位に切断」という一般語であり、ambiguous のため結ばなかった。
- relatedCompanies: base-4481（ベース）: 一致箇所は「営業利益ベース」という一般語のため結ばなかった。
- relatedCompanies: suzuki-6785（鈴木）: 一致箇所は役員氏名「鈴木貴幸」であり、株式会社鈴木とは無関係のため結ばなかった。
- relatedCompanies: trust（トラスト）: 大株主の日本マスタートラスト信託銀行（信託口）の名称の一部であり、コードリストにもないため結ばなかった。
- relatedCompanies: seki（セキ）: 一致箇所は「情報セキュリティ」の一部であり、ambiguous のため結ばなかった。
- relatedCompanies: cota（コタ）: 一致箇所は「インコタームズ」の一部であり、ambiguous のため結ばなかった。
- relatedCompanies: ishin（イシン）: 一致箇所は「ステルスダイシング」の一部であり、イシン株式会社とは無関係のため結ばなかった。
- relatedCompanies: itsumo（いつも）: 一致箇所は従業員調査の文中の「いつも感じる」という一般語のため結ばなかった。
- relatedCompanies: port（ポート）: 一致箇所は「販売サポート」の一部であり、ポート株式会社とは無関係のため結ばなかった。
- relatedCompanies: aeon（イオン）: 一致箇所は「リチウムイオン電池」の一部であり、イオン株式会社とは無関係のため結ばなかった。
- relatedCompanies: corona（コロナ）: 一致箇所は「新型コロナウイルス」の一部であり、株式会社コロナとは無関係のため結ばなかった。
- relatedCompanies: kel（ケル）: 一致箇所はドイツの地名「ケルン市」の一部であり、ambiguous のため結ばなかった。
- relatedCompanies: king（キング）: 一致箇所は「ワーキンググループ」の一部であり、株式会社キングとは無関係のため結ばなかった。
- relatedCompanies: step（ステップ）: 一致箇所はシナリオ分析の手順を指す一般語「ステップ」のため結ばなかった。
- relatedCompanies: rhythm（リズム）: 一致箇所は量子コンピュータの説明文中の一般語であり、リズム株式会社とは無関係のため結ばなかった。
- relatedCompanies: zero（ゼロ）: 一致箇所は常任代理人の口座名「オーエムゼロツー」の一部であり、ambiguous のため結ばなかった。
- relatedCompanies: 【関係会社の状況】の連結子会社32社・持分法適用関連会社4社はすべて未上場（有価証券報告書を提出している会社はない旨が印字）であり、候補には含まれない。浜松光電・長窯などの関連会社も未上場のため結べない。
- terms: 助言: 「光電子増倍管」は用語集に未登録です。微弱な光を電気信号に変換し増幅する電子管で、同社の中核製品であり、光センサメーカーの説明に頻出するため、登録候補になります。
- terms: 助言: 「ステルスダイシング」も未登録です。レーザでウエハ内部に改質層を形成して分割する加工技術を指し、レーザ事業の説明に使われるため、登録候補になります。
- terms: 助言: 「イメージセンサ」も未登録です。光を電気信号に変換する半導体素子の総称で、光半導体事業の主力製品のため、登録候補になります。
- terms: 助言: 「特定投資株式」も未登録です。政策保有株式の開示区分を指す用語で、関連企業の判断材料になるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
