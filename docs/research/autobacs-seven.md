# オートバックスセブン — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オートバックスセブン |
| 証券コード | 9832 |
| docID（データを取り出した文書） | `S100YF3G` |
| 原本 docID | `S100YF3G` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF3G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オートバックスセブン / 9832 / docID S100YF3G（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
autobacs-seven: 10 件の数値を有報XBRLと照合
有報: 株式会社オートバックスセブン 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YF3G)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
autobacs-seven: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…店舗の運営費用などを差し引いた残りが利益になります。2026年3月期のは8,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に書いた財務数値は売上高と親会社株主に帰属する当期純利益だけとし、経常利益・営業利益・セグメント利益の金額と増減率は、文章の規則により書いていない。
- businessModel: 前期有報との重複年度は売上高・純利益など全項目で一致しており（修正再表示なし）、決算期の変更や会計基準の変更もないため、financialNotesは空とした。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」と印字されている。
- businessModel: 売上高の増加率は有報の印字どおり（前期比12.2％増）を使い、コンシューマ事業の伸びの理由は、有報が挙げる子会社の連結子会社化によるものとして書いた。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。オートバックス事業198,785百万円、コンシューマ事業52,625百万円、ホールセール事業23,933百万円、拡張事業4,710百万円の順で、4部門とも報告セグメントである。
- businessStructure: グループは当社、子会社50社および関連会社13社で構成される（事業の内容）。
- businessStructure: 関係会社の状況の注記によれば、連結子会社の株式会社ブルー・オーシャンは2026年4月に株式会社オートバックス関東販売に吸収合併された。決算期末（2026年3月31日）後のグループ内部の再編であり、有報自体に注記されている完了済みの事項のため、needsReviewにはせずここに記録する。
- businessStructure: セグメント利益の金額は、文章の規則により書いていない。
- history: 沿革の表は年月セルと事象文が分かれて印字される崩れた表だったが、年月36件と事象36件で数が一致したため、印字順に対応づけた。
- history: 2022年と2024年は、それぞれ2件の事象が別の月に印字されているため、同年の項目を2件ずつ収録した。
- industry: 主分類はretail。最大の報告セグメントであるオートバックス事業（外部顧客への売上高198,785百万円、全体の約7割）がカー用品の卸売・小売であり、グループ全体でも小売・卸売が事業の中心である。閉じた分類の中でretail（小売）が最も近い。
- industry: 自動車そのものの製造や部品製造は行っていない（カー用品の販売・サービスが中心）ため、automotiveは付けなかった。
- industry: 拡張事業にはクレジット関連事業や保険代理店が含まれるが、不動産デベロップメントやマイクロモビリティと一体の混成セグメントで、売上高も全体の2％弱にとどまるため、financeは付けなかった。
- relatedCompanies: buffalo / buffalo-6676: 関係会社の状況に、持分法適用関連会社の株式会社バッファロー（埼玉県川口市、議決権の所有割合21.2％、商品の販売と店舗用設備の賃貸借あり）が載っているが、正式名称が同じ候補が2件（3352と6676）あり、有報に証券コードの印字がないため同一性を確定できず、結ばなかった。
- relatedCompanies: soft99corporation: 前事業年度の保有銘柄として「当社取引先であり、店舗商品の…」との保有目的の記述があるが、当事業年度の株式の保有状況には載っておらず、当期の記載だけでは現在の関係を確定できないため結ばなかった。
- relatedCompanies: land: 「ライフスタイルブランド」などの一般語の一部との一致で、株式会社ランドについての取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: port: 「事業ポートフォリオ」などの語の一部との一致で、ポート株式会社についての記述がないため結ばなかった。
- relatedCompanies: en: ambiguousな候補で、「ユータムエンタープライズ」などの語の一部との一致のため結ばなかった。
- relatedCompanies: path: ambiguousな候補で、「パーパス」などの語の一部との一致のため結ばなかった。
- relatedCompanies: rent: 「タレント・マネジメント」などの語の一部との一致で、株式会社レントについての記述がないため結ばなかった。
- relatedCompanies: vision: 「長期ビジョン」などの語の一部との一致で、株式会社ビジョンについての記述がないため結ばなかった。
- relatedCompanies: innovation: 一般語「イノベーション」との一致で、株式会社イノベーションについての記述がないため結ばなかった。
- relatedCompanies: seki: ambiguousな候補で、一般語の一部との一致のため結ばなかった。
- relatedCompanies: career: 一般語「キャリア」との一致で、株式会社キャリアについての記述がないため結ばなかった。
- relatedCompanies: hiraga: 役員の氏名「平賀則孝」との一致で、株式会社平賀についての記述がないため結ばなかった。
- relatedCompanies: zero: ambiguousな候補で、「ゼロエミッション車」などの語の一部との一致のため結ばなかった。
- relatedCompanies: step: 一般語「分析ステップ」との一致で、株式会社ステップについての記述がないため結ばなかった。
- relatedCompanies: taya: ambiguousな候補で、地名「世田谷区」との一致のため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称の一部との一致であり、候補のlistingも「（コードリストにない）」のため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス」の語の一部との一致で、株式会社コロナについての記述がないため結ばなかった。
- relatedCompanies: kuze: ambiguousな候補で、地名「久世郡久御山町」との一致のため結ばなかった。
- relatedCompanies: no-1: 「全国No.1の展示台数」という一般的な表現との一致で、株式会社No．1についての記述がないため結ばなかった。
- relatedCompanies: tear: 「総合モビリティアフター業」の語の一部との一致で、株式会社ティアについての記述がないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の記載に基づくものだけを助言として挙げた。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
