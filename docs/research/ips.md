# アイ・ピー・エス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アイ・ピー・エス |
| 証券コード | 4390 |
| docID（データを取り出した文書） | `S100YBB2` |
| 原本 docID | `S100YBB2` |
| 提出日（原本） | 2026-06-12 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBB2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アイ・ピー・エス / 4390 / docID S100YBB2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ips: 10 件の数値を有報XBRLと照合
有報: 株式会社アイ・ピー・エス 有価証券報告書－第35期(2025/04/01－2026/03/31) (docID S100YBB2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第34期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ips: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円印字をそのまま引用した。セグメント注記の外部顧客への売上高の単純合計（16,998百万円）と印字の合計・連結売上高（16,999百万円）には、百万円単位の丸めによる１百万円の差があるが、いずれも印字どおりとした。
- businessModel: 前期の窓に第34期（2025年３月期）の訂正有価証券報告書（2025年７月８日提出）があるが、当期有報における前期有報との修正再表示チェックでは、重複する全項目（売上高・純利益・利益・総資産・純資産・従業員数）に差異がなく、５年間の経営指標への影響は確認できないため、financialNotesには書かず、ここに記録する。
- businessModel: パック作成時の注意に「本文に財務諸表の組替えの記載がある」とされたが、本文ファイル内に組替えに関する注記は見当たらず（包括利益計算書の「組替調整額」は語句の一致のみ）、表示方法の変更や会計方針の変更の注記も確認できないため、financialNotesには書かず、ここに記録する。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。株式分割・株式併合の実施の印字もなく、新株予約権の条件中の調整条項に語句が見られるのみである。
- businessModel: 当作業ツリーのスキーマに仕入先（suppliers）の項目がないため、businessModelには仕入先を記載していない。回線使用権の取得等の仕入の事実は重要な契約等に印字されている。
- businessModel: 設備の新設等の計画には、国際海底ケーブル「Candle」の共同建設に係る投資予定額等が印字されているが、投資予定額は本文の数値に含めず、ここに記録する。
- businessModel: 経営方針に数値の経営目標の印字はないため、戦略は定性的な方針のみを要約した。
- businessStructure: 報告セグメントは３つ（国際通信事業・国内通信事業・メディカル＆ヘルスケア事業）で、事業の並びはセグメント注記の外部顧客への売上高の大きい順とした。
- businessStructure: 連結子会社は８社（KEYSQUARE, INC.、Shinagawa Lasik & Aesthetics Center Corporation、InfiniVAN, Inc.、CorporateONE, Inc.、ISMO Pte. Ltd.、Carrier Domain, Inc.、Shinagawa Healthcare Solutions Corporation、株式会社アイ・ピー・エス・プロ）と印字されている。持分法適用関連会社はISMO Inc.とBBIX Philippines, Inc.の２社である。
- businessStructure: 地域ごとの情報では、2026年３月期の売上高は日本2,375百万円、フィリピン14,593百万円、その他30百万円と印字されている（顧客の所在地を基礎とした分類）。セグメント別・地域別の内訳の単純合計と印字の連結売上高16,999百万円との間には、百万円単位の丸めによる１百万円の差がある。
- history: 沿革のうち、1992年の国際デジタル通信株式会社（現ソフトバンク株式会社）の代理店就任、1996年のタガログ語新聞の創刊、1998年の旧特別第２種電気通信事業者登録、2002年の株式会社テレグローブ・ジャパンの株式取得、2003年の相互接続開始、2004年の電気通信役務利用放送事業者登録、2005年の有料衛星放送開始と介護員養成講座の開講、2006年の派遣・職業紹介許可の取得、2011年のKEYSQUARE, INC.への社名変更、2012年のインターネット放送開始、2013年の秒課金サービス開始とコールセンターシステム「AmeyoJ」の発売開始、2016年のInfiniVANのフランチャイズ法の可決、2017年・2018年のCPCNの仮認可取得、2019年の５Ｇ用周波数の割当、2021年のISMO Pte. Ltd.への社名変更、2022年のCarrier Domain, Inc.の子会社化とShinagawa Healthcare Solutions Corporationの設立、2023年の健診センター運営開始、2024年のBBIX Philippines, Inc.の拠点開設は、行を絞るため採用しなかった。
- industry: 主たる業界は、最大の報告セグメントである国際通信事業（外部顧客への売上高12,943百万円、連結売上高の約76％）と国内通信事業がいずれも電気通信事業であることに基づき、telecommunications とした。メディカル＆ヘルスケア事業（外部顧客への売上高1,650百万円）に当たる医療の独立区分は閉じた分類になく、規模も小さいため、副分類は付けなかった。
- relatedCompanies: ntt（NTT株式会社）は結ばなかった。重要な契約等の相手方はNTT東日本株式会社・NTT西日本株式会社・株式会社NTTドコモ・NTTドコモビジネス株式会社（いずれも非上場の子会社）であり、上場持株会社のNTT株式会社とは別の法人のためである。沿革の2003年の相互接続開始の記載も「NTTグループ各社等」の集約表記である。
- relatedCompanies: hikari-tsushin（株式会社光通信）は結ばなかった。大株主の状況に載るのは光通信KK投資事業有限責任組合（発行済株式（自己株式を除く。）の総数に対する割合1.66％、2026年３月31日現在）で、株式会社光通信とは別の法人のためである。
- relatedCompanies: softbank（ソフトバンク株式会社）は、1992年の国際デジタル通信株式会社の代理店関係（沿革のみ）ではなく、当期も有効な音声通信回線の相互接続契約とCandleの共同建設契約を根拠に結んだ。
- relatedCompanies: 楽天モバイル株式会社とアルテリア・ネットワークス株式会社も重要な契約等の相手方として印字されているが、候補リストにないため結ばなかった。Candleの共同建設契約の他の相手方（Edge Network Services Limited、TM Technology Services Sdn. Bhd.、Globe Telecom, Inc.）も候補リストにない。シンジケートローン契約のアレンジャーである株式会社みずほ銀行は資金調達の相手方で、候補リストにもない。
- relatedCompanies: career、kohsoku、seki、care-service、como、trust、base-4481、corona、freee、land、nissin、taya、cover、en、i-ll、innovation は、「キャリアズキャリア」「高速化」「情報セキュリティ」「ヘルスケアサービス」「NTTドコモ」「株式会社グローバルトラストネットワークス」「データベース」「新型コロナウイルス感染症」「トールフリー」「ブランド」「新株予約権」「東京都世田谷区等々力」「カバーする」「エンタープライズ部門」「アイルランド」「イノベーション」等の一般語句・地名・住所への部分一致であり、該当企業への言及ではないため結ばなかった。
- terms: 用語の助言は行いませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
