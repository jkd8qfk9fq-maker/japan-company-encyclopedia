# PLANT — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＰＬＡＮＴ |
| 証券コード | 7646 |
| docID（データを取り出した文書） | `S100XAET` |
| 原本 docID | `S100XAET` |
| 提出日（原本） | 2025-12-17 |
| 決算期 | 2025-09-20 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XAET.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＰＬＡＮＴ / 7646 / docID S100XAET（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
plant: 10 件の数値を有報XBRLと照合
有報: 株式会社ＰＬＡＮＴ 有価証券報告書－第44期(2024/09/21－2025/09/20) (docID S100XAET)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
plant: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社PLANT」が EDINET の提出者名「株式会社ＰＬＡＮＴ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes には、経営指標等の注記5に基づき収益認識基準の適用を記載した。表示方法の変更のみの組替えの印字はなく、それ以外の注記は入れていない。
- businessModel: 中期経営計画の数値目標（営業利益率3％以上の達成、原則として当期純利益額の30％以上の株主還元）は、利益率等の数値目標であるため本文には記載せず、施策の内容のみを要約した。
- businessModel: 業務改革「R-9」の名称が示す人件費削減額（9億円）は計画の目標額であり、本文には記載していない。2024年10月に稼働した精肉のプロセスセンターは、R-9の取組の一環としてMD&Aに記載がある。
- businessModel: 当社は連結財務諸表を作成していないため、本文の数値はいずれも単体のものである。純利益の前期比268.0％増はMD&Aの印字どおりである。
- businessStructure: 当社は小売業という単一セグメントであり、セグメント情報の記載が省略されているため、事業はスーパーセンター1本とした。売上高の品目別構成は、セグメント関連情報の「製品及びサービスごとの情報」（フーズ65,228百万円／ノンフーズ32,122百万円／その他413百万円）に基づく。その他は不動産賃貸収入である。
- businessStructure: 品目別の内訳（青果・鮮魚・精肉等）は主要品目の記載のみで金額の開示がないため、子事業には金額を記載していない。MD&Aには品目別の仕入実績（フーズ50,497百万円／ノンフーズ24,790百万円）が開示されているが、仕入金額であり売上高ではないため本文には使用していない。
- businessStructure: 当社は連結財務諸表を作成しておらず、関係会社の状況は「該当事項はありません」で、子会社・関連会社は存在しない。本登録の数値はいずれも提出会社単体のものである。
- businessStructure: 発行済株式総数は第43期に8,090千株から7,729千株へ減少しているが、当期の有報にその事由の注記はなく、株式分割の記載もない。前期有報との修正再表示チェックは全行一致であった。
- businessStructure: 重要な後発事象は「該当事項はありません」であった。
- history: 沿革の表の全51行を転記し、表の前の文章にある1947年の開業、1974年・1981年の出店を加えて54項目とした。
- history: 1982年1月の設立行に印字された資本金額は、規則により沿革本文に記載していない。
- history: PLANT-1からPLANT-6の呼称は売場面積の規模による分類である旨の注記は、沿革の項目には含めず、事業の用語（terms）側でも扱っていない。
- industry: 当社は小売業の単一セグメントであり、東証業種も小売業のため、主分類は retail のみとした。フランチャイズや不動産賃貸収入は売上高に占める割合が小さく、副次分類は付けていない。
- relatedCompanies: the-fukui-bank（福井銀行）: 特定投資株式として16,700株を保有しているが、保有目的は保有方針の全社共通の文面（当社事業への効果が期待できる場合に保有する）であり、個別の取引・提携の事実の印字はない。有報に印字された具体的な関係は、2018年4月23日締結のシンジケートローン契約のアレンジャー及びエージェント（借入金額72億円、参加金融機関の中心）という資金調達の関係であるため、リンクしなかった。
- relatedCompanies: the-san-in-godo-bank（山陰合同銀行）、the-nanto-bank（南都銀行）、the-hyakugo-bank（百五銀行）: シンジケートローン契約の参加金融機関として印字されるのみで、資金調達以外の関係の印字がないためリンクしなかった。
- relatedCompanies: mitsubishi-shokuhin（三菱食品）: 買掛金の相手先として開示された仕入先であるが、候補リスト上でEDINETコードリストにない企業とされており、百科事典側で検証できないためリンクしなかった。仕入先としての役割は本warningsに記録する。
- relatedCompanies: transaction-media-networks（トランザクション・メディア・ネットワークス）、jaccs（ジャックス）: 売掛金の相手先として開示されているが、クレジットカード等の決済に伴う精算債権の相手先であり、商品の販売先ではないためリンクしなかった。
- relatedCompanies: joyfull（ジョイフル）: 沿革に現れる「ジョイフルストアーみった」は当社のかつての店舗ブランド名であり、上場企業の株式会社ジョイフルとは無関係のためリンクしなかった。
- relatedCompanies: takashima-and-co（高島）: 沿革の「PLANT高島店」は滋賀県高島市の店舗名（地名）への一致のためリンクしなかった。
- relatedCompanies: corona（コロナ）、career（キャリア）、seki（セキ）、en（エン）、zero（ゼロ）: 一般語・部分一致への該当であり、相手企業への言及ではないためリンクしなかった。
- relatedCompanies: 大株主の状況に記載された上位株主は、有限会社ワイ・ティ・エー（発行済株式の29.32％）のほか個人、従業員持株会、外国証券会社の名義であり、リンク対象となる上場事業会社はなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
