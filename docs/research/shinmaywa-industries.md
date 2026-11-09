# 新明和工業 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 新明和工業株式会社 |
| 証券コード | 7224 |
| docID（データを取り出した文書） | `S100YFNV` |
| 原本 docID | `S100YFNV` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFNV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 新明和工業株式会社 / 7224 / docID S100YFNV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 41 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shinmaywa-industries: 10 件の数値を有報XBRLと照合
有報: 新明和工業株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YFNV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
shinmaywa-industries: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や人件費などの費用を差し引いた残りが利益になります。2026年3月期のは11…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に書いた財務数値は売上高（285,024百万円、前期比7.0％増）と親会社株主に帰属する当期純利益（11,507百万円）だけで、いずれも有報の印字どおり。経常利益・セグメント利益・受注高・総資産などの金額は文章の規則により書いていない。
- businessModel: 中期経営計画の数値目標（売上高・営業利益・ROE・ROIC）は、文章の規則で書けない指標を含むため perspectives にも転記していない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。訂正有報なし、修正再表示なし（前期有報との重複年度は全項目一致）。
- businessStructure: 事業の並び順は、セグメント注記の2026年3月期「外部顧客への売上高」の大きい順（特装車117,583百万円、パーキングシステム50,745百万円、航空機41,558百万円、流体29,986百万円、産機・環境システム27,323百万円）。「その他」は有報が報告セグメントに含まれないと明記する区分のため、金額にかかわらず最後に置いた。
- businessStructure: グループ構成は【事業の内容】の印字どおり子会社45社（国内25社、海外20社）、関連会社６社（国内４社、海外２社）。
- businessStructure: セグメント利益などの金額は文章の規則により書いていない。売上高の金額はセグメント注記の印字（百万円単位）どおり。
- history: 沿革表は年月と事象が対応して印字されており、月は書かず年だけを採った。1949年は新明和興業の設立とダンプトラック第１号の完成を１件にまとめた。
- history: 1947年の明和興業への商号変更は川西航空機の出来事、1949年の新明和興業設立が現在の会社の設立として沿革に印字されている順序どおりに記載した。
- history: 資本金の金額（1949年設立時の7,000万円など）は文章の規則により書いていない。
- industry: 主分類はmachinery。最大の報告セグメントである特装車（外部顧客への売上高117,583百万円、連結の約４割）をはじめ、産機・環境システム、流体、パーキングシステム、航空機のいずれも機械・装置の製造事業であり、業種一覧ではmachinery（機械）が最も近い。
- industry: 特装車はトラック車台への架装が中心で自動車そのものの製造ではないため、automotiveは付けていない。航空機部品・飛行艇に合う区分は一覧にないが、航空機セグメント単独でも分類はmachineryの範囲にあるため、暫定値の変更や分類の不足にはしていない。
- industry: 「その他」（建設・不動産・ソフトウェア）は報告セグメントではなく複合区分のため、業界を足していない。
- relatedCompanies: 結ばなかった候補 king: 「キング」は「パーキング」の部分一致で、株式会社キング（8118）への言及ではない。
- relatedCompanies: 結ばなかった候補 core: ambiguous。一般語などの部分一致で、株式会社コア（2359）への言及ではない。
- relatedCompanies: 結ばなかった候補 en: ambiguous。一般語の部分一致で、エン株式会社（4849）への言及ではない。
- relatedCompanies: 結ばなかった候補 port: 「ポートフォリオ」の部分一致で、ポート株式会社（7047）への言及ではない。
- relatedCompanies: 結ばなかった候補 vision: 「長期ビジョン」「SG-Vision」の一致で、株式会社ビジョン（9416）への言及ではない。
- relatedCompanies: 結ばなかった候補 base-4481: 「営業利益ベース」などの一般語の一致で、ベース株式会社（4481）への言及ではない。
- relatedCompanies: 結ばなかった候補 fuji-8278: ambiguous。子会社「イワフジ工業」の部分一致で、株式会社フジ（8278）への言及ではない。
- relatedCompanies: 結ばなかった候補 ray: ambiguous。一般語の部分一致で、株式会社レイ（4317）への言及ではない。
- relatedCompanies: 結ばなかった候補 career: 「キャリア開発」という一般語の一致で、株式会社キャリア（6198）への言及ではない。
- relatedCompanies: 結ばなかった候補 cota: ambiguous。「インコタームズ」の部分一致で、コタ株式会社（4923）への言及ではない。
- relatedCompanies: 結ばなかった候補 suzuki-6785: ambiguous。社外取締役の個人名「鈴木」の一致で、株式会社鈴木（6785）への言及ではない。
- relatedCompanies: 結ばなかった候補 the-lead: 「リード」は一般語の一致で、株式会社リード（6982）への言及ではない。
- relatedCompanies: 結ばなかった候補 fulltech: 有報のフルテック株式会社は当社の連結子会社（浜松市中央区、資本金10百万円、議決権100.0％）であり、上場しているフルテック株式会社（6546）とは別会社と判断し、結ばない。
- relatedCompanies: 結ばなかった候補 innovation: 自社の組織名「イノベーション戦略本部」の一致で、株式会社イノベーション（3970）への言及ではない。
- relatedCompanies: 結ばなかった候補 land: 「ブランド」の部分一致で、株式会社ランド（8918）への言及ではない。
- relatedCompanies: 結ばなかった候補 trust: 日本マスタートラスト信託銀行（信託口）は信託銀行の信託口（純投資の保管）で、取引・提携の記載がない。候補自体もコードリストにない。
- relatedCompanies: 結ばなかった候補 ana-holdings: 特定投資株式として保有するが、保有目的は「主にパーキングシステムセグメントにおける継続的な営業取引の維持・強化」という全銘柄に共通する定型的な記載のみで、個別の取引・提携の記載がないため結ばない。
- relatedCompanies: 結ばなかった候補 hi-lex: 特定投資株式の保有目的（主に特装車セグメントにおける購買取引の維持・強化）が定型的な記載のみで、個別の取引・提携の記載がないため結ばない。
- relatedCompanies: 結ばなかった候補 hino-motors-7205: 候補がコードリストになく結べない。なお特定投資株式の保有目的も定型的な記載のみ。
- relatedCompanies: 結ばなかった候補 hitachi: 1960年に系列下に入り2004年に独立した過去の資本関係のみで、現在の取引・提携の記載がないため結ばない。沿革の出来事として記載した。
- relatedCompanies: 結ばなかった候補 inaba-denki-sangyo: 特定投資株式の保有目的（購買取引の維持・強化）が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 infroneer-holdings: 特定投資株式の保有目的（パーキングシステムセグメントの営業取引の維持・強化）が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 isuzu-motors: 特定投資株式の保有目的（主に特装車セグメントにおける継続的な営業取引の維持・強化）が定型的な記載のみで、個別の取引・提携の記載がないため結ばない。
- relatedCompanies: 結ばなかった候補 kanamoto: 特定投資株式の保有目的が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 kawanishi-warehouse: 特定投資株式の保有目的（購買取引の維持・強化）が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 kohsoku: ambiguous。「高速通信ハーネス」という一般語の一致で、株式会社高速（7504）への言及ではない。
- relatedCompanies: 結ばなかった候補 kyokuto-kaihatsu-kogyo: 特定投資株式の保有目的（主に特装車セグメントにおける営業取引の維持・強化）が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 maruwn: 候補がコードリストになく結べない。なお特定投資株式の保有目的も定型的な記載のみ。
- relatedCompanies: 結ばなかった候補 mazda: 特定投資株式の保有目的が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 meidensha: 特定投資株式の保有目的（複数のセグメントにおける企業間連携の強化）が定型的な記載のみで、個別の取引・提携の記載がないため結ばない。
- relatedCompanies: 結ばなかった候補 orix: 特定投資株式の保有目的が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 ricoh: 事業等のリスクにおける「リコール」の部分一致で、株式会社リコー（7752）への言及ではない。
- relatedCompanies: 結ばなかった候補 seki: ambiguous。一般語の部分一致で、セキ株式会社（7857）への言及ではない。
- relatedCompanies: 結ばなかった候補 sompo-holdings: 特定投資株式の保有目的に「保険取引の円滑化」を含むため規則により結ばない。営業取引の記載も定型的なもののみ。
- relatedCompanies: 結ばなかった候補 subaru: 2013年の塵芥車事業の譲り受けは過去の一度きりの取引で、現在の関係の記載がないため結ばない。沿革の出来事として記載した。
- relatedCompanies: 結ばなかった候補 tokyo-tatemono: 特定投資株式の保有目的（パーキングシステムセグメントの営業取引の維持・強化）が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 tokyu-fudosan-holdings: 特定投資株式の保有目的が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 tomita: 特定投資株式の保有目的（購買取引の維持・強化）が定型的な記載のみのため結ばない。
- relatedCompanies: 結ばなかった候補 topre: 特定投資株式の保有目的（主に特装車セグメントにおける営業取引の維持・強化）が定型的な記載のみのため結ばない。
- relatedCompanies: 大株主の三信株式会社（所有割合10.20％、2026年３月31日現在）は事業会社だが、候補リスト（related-candidates.json）にないため、候補の中からだけ選ぶ規則により結べない。
- relatedCompanies: 有報の連結子会社・持分法適用関連会社（重慶耐徳新明和工業有限公司など）はすべて未上場で、候補リストにもないため、関連企業には含めていない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は【事業の内容】と【沿革】に印字された製品名から選んだ助言のみ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
