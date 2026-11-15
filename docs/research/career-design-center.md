# キャリアデザインセンター — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社キャリアデザインセンター |
| 証券コード | 2410 |
| docID（データを取り出した文書） | `S100XBEJ` |
| 原本 docID | `S100XBEJ` |
| 提出日（原本） | 2025-12-18 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBEJ.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%AD%E3%83%A3%E3%83%AA%E3%82%A2%E3%83%87%E3%82%A6%E3%82%A4%E3%83%B3%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社キャリアデザインセンター / 2410 / docID S100XBEJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
career-design-center: 10 件の数値を有報XBRLと照合
有報: 株式会社キャリアデザインセンター 有価証券報告書－第34期(2024/10/01－2025/09/30) (docID S100XBEJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
career-design-center: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記方針：本文の金額は、千円で印字された数値を百万円単位に切り捨てて書いた（例：売上高18,646,255千円→18,646百万円、当期純利益1,100,768千円→1,100百万円）。切り上げはしていない。
- businessModel: 事業別売上高の切り捨て後の合計は18,643百万円で、印字の売上高合計18,646百万円とは3百万円異なる（千円印字の合計自体も18,646,253千円で印字の合計と2千円異なる）。合計は印字どおり引用し、この差は切り捨てによるものとして記録する。
- businessModel: 中期経営計画の計数目標（2026年9月期に売上高200億円、経常利益24億円）は、目標値であり経常利益は本文に書けない財務数値のため、本文と戦略には書かずこの warnings に記録した。戦略には定性的な内容のみを書いた。
- businessModel: MD&Aに印字された事業別の経常利益・経常損失の金額（メディア情報事業723,936千円など）は、本文に書けない財務数値のため本文に書かず、事業別の売上高だけを用いた。
- businessModel: 従業員数768人は就業人員数で臨時従業員を含まない。IT派遣事業に従事する無期雇用派遣従業員95人は外数として印字されており、768人には含まれていない。
- businessModel: 前期有報との修正再表示チェックでは重複年度の全系列が一致した。変則決算・決算期変更はない。収益認識基準の適用開始（第31期期首）だけを financialNotes に書いた。
- businessModel: suppliers はこの作業ツリーのスキーマに無いため書かなかった。個別の調達先の印字も有報にない。
- businessStructure: 単一セグメント（人材サービス事業）のため、報告セグメントの内訳ではなく事業の種類別の5事業を children とし、MD&Aの販売実績に印字された事業別売上高の大きい順（IT派遣・メディア情報・人材紹介・新卒メディア・新卒紹介）に並べた。セグメント注記は単一セグメントのため省略されている。
- businessStructure: 事業別売上高はMD&Aの販売実績表の千円印字を百万円に切り捨てて書いた（切り捨ての方針は businessModel の warnings にも記録）。切り捨て後の5事業の合計は18,643百万円で、印字の合計18,646百万円とは3百万円異なる。合計は印字どおり引用した。
- businessStructure: 当社は連結財務諸表を作成しておらず、関係会社の状況は「該当事項はありません」で子会社はない。事業系統図も単体である。
- businessStructure: businessModel の suppliers はこの作業ツリーのスキーマに無いため書かなかった。個別の調達先の印字も有報にない。
- businessStructure: 表紙に「東京証券取引所プライム市場」と印字があるため、listings に market を書いた。
- history: 沿革の後半は年月セルが20個まとめて印字され事象文と分かれている崩れた表で、年月20件と事象20件の数が一致したため行順で対応づけた（2010年10月=IT派遣の本格開始、2013年7月=東証一部指定、2022年4月=プライム市場変更などが対応を裏付ける）。採用したのはこのうち2010年・2013年（2件）・2014年・2021年・2022年・2023年の行で、残り（type就活フェア開催、介護・販売サービス等の専門サイト開始、『＠typeプロフェッショナル』開始、『エンジニアtype』『Woman type』等のWebマガジン創刊、インターンシップ・ラボ開催、『就活typeエージェント』本格運営、『営業 type』創刊、『type メンバーズパーク』開始、サイト名称の変更、『Direct type』のiOS版・Web版リリース）は warnings に列挙して落とした。
- history: 前半の2006年4月の2件目の事象（『女性のためのtype適職フェア』開催）は年月セルの印字がなく日付を裏付けられないため落とした。同じく落とした前半の行：1996年の臨時増刊号創刊、1997年の適職フェア開催、1998年の子会社設立、2000年の本店移転、2001年の『ワーキングウーマンtype』創刊、2004年の営業職向け適職フェア開催、2005年の『女の転職＠type』開始、2006年の『営業の転職＠type』開始。
- history: 1998年と2013年の子会社設立には資本金の印字があるが、沿革に資本金の金額を書かない規則のため金額は書いていない。
- history: 1993年の創業者に関する補足（リクルートで求人情報誌『とらばーゆ』の編集に携わった多田弘實が創業）は有報に印字がなく、Wikipediaの冒頭（証券コード2410で同一性を確認済み）からの補足として出典を併記した。数値はWikipediaから採っていない。
- industry: 人材サービス事業の単一セグメントで、転職メディア・人材紹介・新卒紹介・IT人材派遣のいずれも人材サービスであり、閉じたリストでは human-resources のみが該当するため、産業は human-resources のみとした。メディア事業は人材サービスの一部であり、金額が独立開示された別セグメントではないため media は付けなかった。
- relatedCompanies: 関係会社の状況は「該当事項はありません」で、親会社・子会社・関連会社はない。株式の保有状況も「該当事項はありません」で、政策保有株式の印字はない。
- relatedCompanies: career（株式会社キャリア）: 「キャリア志向」など一般語の一致で、社名の一致ではないため結ばなかった。
- relatedCompanies: en: 「エンジニア」の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: seki: 「セキュリティ」等の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: land: 「ブランド」の部分一致のため結ばなかった。
- relatedCompanies: corona: 「コロナ禍」の一致のため結ばなかった。
- relatedCompanies: sanno: 本社・赤坂オフィスの所在地表記「赤坂山王オフィス」の一致のため結ばなかった（ambiguous）。
- relatedCompanies: creek-and-river（株式会社クリーク・アンド・リバー社）: 主な負債の内容の買掛金の相手先別内訳に載るだけで、取引の内容を述べた印字がないため結ばなかった。
- relatedCompanies: cyberagent（株式会社サイバーエージェント）: 売掛金の相手先別内訳に載るだけで、取引の内容を述べた印字がないため結ばなかった。
- relatedCompanies: kakaku-com（株式会社カカクコム）: 売掛金の相手先別内訳に載るだけで、取引の内容を述べた印字がないため結ばなかった。
- relatedCompanies: transcosmos（トランス・コスモス株式会社）: 未払金の相手先別内訳に載るだけで、取引の内容を述べた印字がないため結ばなかった。
- relatedCompanies: freee: 「フリーレント家賃」の部分一致で、社名の一致ではないため結ばなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 大株主に載るのは「光通信ＫＫ投資事業有限責任組合」で、株式会社光通信とは別法人の投資組合であり純投資のため結ばなかった。
- relatedCompanies: king: 「ワーキングウーマン」の部分一致のため結ばなかった。
- relatedCompanies: members: 自社サービス名『typeメンバーズパーク』の部分一致のため結ばなかった。
- relatedCompanies: port: 「港都税事務所」等の部分一致のため結ばなかった。
- relatedCompanies: rent: 「フリーレント家賃」の部分一致のため結ばなかった。
- relatedCompanies: taya: 大株主の住所表記（東京都世田谷区）の一致のため結ばなかった（ambiguous）。
- relatedCompanies: vision: 自社の行事名『キャリアビジョンtype』の部分一致のため結ばなかった。
- relatedCompanies: 株式会社ダイヤモンド社: 大株主（2025年9月30日現在2.28％）だが、関連候補に無く、取引・提携の印字もないため結ばなかった。
- relatedCompanies: 株式会社日本カストディ銀行（信託口）、THE NOMURA TRUST AND BANKING CO., LTD.（信託）、キャリアデザインセンター社員持株会は、信託・持株会であり事業会社ではないため結ばなかった。
- terms: 助言: 用語「適職フェア」は、同社が開催する合同会社説明会の名称。エンジニア向け、営業職向け、女性向けなど対象別の開催がある。
- terms: 助言: 用語「type」は、同社の中核ブランド。転職サイト『type』『女の転職type』、新卒向け『type就活』、人材紹介『type転職エージェント』、派遣『typeIT派遣』など各事業の名称に使われている。
- terms: 助言: 用語「ミドル領域」は、同社の人材紹介事業のうち、専門職や管理職を対象とする領域。一般領域と分けて運営されている。
- terms: 助言: 用語「無期雇用型派遣」は、同社がエンジニアを無期雇用したうえで企業へ派遣する形態。有期雇用型派遣と分けてIT派遣事業の中で運営されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
