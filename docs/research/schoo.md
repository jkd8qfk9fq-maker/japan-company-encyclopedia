# Schoo — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｓｃｈｏｏ |
| 証券コード | 264A |
| docID（データを取り出した文書） | `S100XCX0` |
| 原本 docID | `S100XCX0` |
| 提出日（原本） | 2025-12-24 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XCX0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｓｃｈｏｏ / 264A / docID S100XCX0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
schoo: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｓｃｈｏｏ 有価証券報告書－第14期(2024/10/01－2025/09/30) (docID S100XCX0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
schoo: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Schoo」が EDINET の提出者名「株式会社Ｓｃｈｏｏ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載が本文にある旨の注意が証拠パックにあったが、修正再表示チェックでは前期有報と重複する全系列（売上高・当期純利益・経常利益・総資産・純資産・従業員数）が一致しており、主要な経営指標等への影響は確認できなかったため、financialNotesには書かず、ここに判断を記録した。
- businessModel: 主要な経営指標等の注記にある収益認識基準の適用（第11期期首から）は、2022年9月期のfinancialNoteとして記載した。同注記にある種類株式の取得・消却（2024年6月）と種類株式発行の定款定めの廃止（2024年7月）は前期の資本政策の事実であり、financialNotesには書かなかった。
- businessModel: MD&A・経営方針に示されたMRR・ARPA・Net Revenue Churn Rateなどの経営指標の目標値や推移のうち、利益に関わる数値目標は本文や戦略に書かなかった。戦略の分析では契約社数の推移のみを用いた。
- businessModel: 営業利益・経常利益などの金額や増減率は本文には書かなかった（売上高と当期純利益のみ）。
- businessModel: 2024年10月22日に東京証券取引所グロース市場へ上場した事実は沿革に記録した。上場に伴う資本金等の金額は書いていない。
- businessStructure: 当社は大人の学び事業の単一セグメントであり、セグメント情報の記載は省略されている。子事業は【事業の内容】の主要なサービスの概要（Schoo for Business／Schoo for Personal／Schoo Swing）に基づく。サービス別の売上高は開示されておらず、「Schoo for Business」が全社売上高の90％超を占めることのみが印字されているため、子事業に金額は書かなかった。
- businessStructure: 組織変革コンサルティングサービス「Enterprise Drive」は「Schoo for Business」を基盤とするサービスであるため、独立の子事業とせず「Schoo for Business」の説明に含めた。
- businessStructure: 移住転職コミュニティ「LoLLL」（2025年2月提供開始）と地域共創型人材育成サービス「Schoo Mesh」（2025年10月提供開始）は【沿革】にのみ現れ、【事業の内容】にサービスの説明や金額の開示がないため、子事業にはしなかった。経緯は沿革に記録した。
- businessStructure: suppliersキーはこのツリーのスキーマに無いため付けていない。仕入先の個別名は有報に印字されていない（売上原価明細書の経費内訳に外注費・通信費の項目があるのみ）。
- businessStructure: 【関係会社の状況】は「該当事項はありません」で、子会社・関連会社はない。DEIの別記事業はCTEと印字されている。
- history: 沿革のうち、スタジオの開設・移転（2013年3月、2015年5月、2025年5月）、本店・本社の移転（2015年3月、2020年2月）、iOS・Androidアプリのリリースとリニューアル（2014年1月、2015年4月、2015年9月）、大学との連携による授業配信（2014年6月、2015年3月）、地方自治体との連携開始（2015年10月）、法人向け学習動画制作サービスの提供開始（2018年2月）は、事業構造の転機ではないため沿革には入れず、ここに記録した。
- history: 「Schoo Mesh」の提供開始（2025年10月）は決算期後の出来事だが、【沿革】に印字されているため沿革に含め、その旨を説明に明記した。
- history: 沿革の年月は落とし、年のみで記載した。資本金額は記載していない。
- industry: 主たる業界はit（IT・ソフトウェア）を暫定とした。当社はSaaS型のオンライン学習サービスで収益を得ているが、事業の実体は社会人教育・研修サービスであり、閉じた分類（INDUSTRY_IDS）に教育・研修の区分が無いため、最も近いitを暫定とし、分類の不足として記録した。
- relatedCompanies: kddi（KDDI株式会社）は2019年9月に資本業務提携を締結した相手だが、その記載は【沿革】のみで、当期の【大株主の状況】に同社は含まれておらず、現在の取引・資本関係を述べる記載がないため結ばなかった。提携の事実は沿革に記録した。
- relatedCompanies: port（ポート株式会社）は「サポート」等の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: career（株式会社キャリア）は「キャリア」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）は「ベーススキル」等の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: nissin（株式会社日新）はコードリストにない候補でambiguousであり、関係の記載はないため結ばなかった。
- relatedCompanies: seki（セキ株式会社）は「セキュリティ」等の部分一致でambiguousな候補であり、関係の記載はないため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）は「新型コロナウイルス感染症」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: en（エン株式会社）は「Enterprise Drive（エンタープライズドライブ）」の部分一致でambiguousな候補であり、関係の記載はないため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）は「イノベーション」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: lec（レック株式会社）、imura-and-co（株式会社イムラ）、fukuoka-financial-group（株式会社ふくおかフィナンシャルグループ）、kao（花王株式会社）、king（株式会社キング）、land（株式会社ランド）、plus-alpha-consulting（株式会社プラスアルファ・コンサルティング）、ray（株式会社レイ）、rent（株式会社レントラックス）、sekisui-chemical（積水化学工業株式会社）、the-chugoku-electric-power（中国電力株式会社）、zero（株式会社ゼロ）はいずれも一般語・社名の部分一致のみで、関係の記載はないため結ばなかった。
- relatedCompanies: 【大株主の状況】の上位は個人、投資事業有限責任組合、信託銀行等であり、事業会社の主要株主として結べる相手はいない。【株式の保有状況】は「該当事項はありません」で、政策保有株式によるリンクもない。【関係会社の状況】も「該当事項はありません」。
- terms: 助言のみ。用語候補: リカレント教育（社会人が学校教育を終えた後も学び続ける教育の考え方で、当社が創業以来取り組む「大人の学び」の領域）、サブスクリプション型リカーリング・レベニューモデル（サービス利用期間に応じた利用料金を定期購入の形態で受領し、解約しない限り継続的に収益が獲得できるビジネスモデル。有報に定義の印字あり）、MRR（Monthly Recurring Revenueの略で、毎月経常的に得られるサービスの月額利用料の合計額。有報に定義の印字あり）、ARPA（Average Revenue Per Accountの略で、1顧客当たりの平均売上金額。有報に定義の印字あり）、Net Revenue Churn Rate（既存顧客のアップセル/ダウンセルを考慮した解約率。有報に算式の印字あり）、カスタマーサクセス（導入企業の課題解決と継続的な運用を支援する体制）、Schoo Swing（高等教育機関等向けの学習管理プラットフォームのサービス名）、受講生代表（生放送授業に参加し、講師と受講生の間で授業の進行を支える当社社員の呼称）

## 要確認（status に反映）

- businessModel: 2024年7月10日付で普通株式の株式分割（1株を30株）を実施しており、主要な経営指標等の推移はこの分割を前提に算定されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] Schoo（schoo）の主たる事業（大人の学び事業） → 提案: オンライン教育・研修サービス。同事業は法人向け研修・個人向け学習・高等教育機関向け学習管理をオンラインで提供する教育サービスであり、閉じた分類に教育・研修に当たる区分が無い。it は提供形態（SaaS）には近いが事業の実体とは異なるため、分類の不足として記録する。
