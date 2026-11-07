# 近鉄グループホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 近鉄グループホールディングス株式会社 |
| 証券コード | 9041 |
| docID（データを取り出した文書） | `S100YCLR` |
| 原本 docID | `S100YCLR` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCLR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 近鉄グループホールディングス株式会社 / 9041 / docID S100YCLR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 34 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kintetsu-group-holdings: 10 件の数値を有報XBRLと照合
有報: 近鉄グループホールディングス株式会社 有価証券報告書－第115期(2025/04/01－2026/03/31) (docID S100YCLR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kintetsu-group-holdings: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…各事業の収益から費用を差し引いて利益を確保しています。2026年3月期の…）
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes には、近鉄エクスプレスの連結範囲への追加（2023年3月期）と、2022年改正会計基準の適用に伴う指標の遡及適用（2025年3月期）の2件だけを記録した。【財務諸表】の注記にある組替えは、税効果会計の注記で「未払社会保険料」を独立掲記した表示方法の変更に伴うもので、主要な経営指標の金額に影響するものではないため、basis としては記録しなかった。
- businessModel: 営業収益と純利益の金額は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の印字どおり（1兆7,503億7百万円、537億71百万円）を引用した。営業利益・経常利益の金額や増減率は本文に書いていない。
- businessModel: Wikipedia の抜粋は有価証券報告書の内容と重なる範囲にとどまり、補足できる事実がなかったため使わなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への営業収益（2026年3月期）の大きい順にした（国際物流753,129百万円、ホテル・レジャー367,158百万円、流通223,451百万円、運輸223,270百万円、不動産147,200百万円、その他35,428百万円）。報告セグメントの「その他」も報告セグメントのため売上順の最後に置いた。
- businessStructure: 当社グループは当社、子会社237社及び関連会社15社で構成される（【事業の内容】の記載）。
- history: 沿革の末尾（2016年6月以降）は年月セルと事象文が分かれて続け書きになった表で、年月セル7件と事象文7件が同数だったため、記載順に対応づけた（2016年 青の交響曲、2019年 近鉄博多ビル、2020年 ひのとり、2021年4月 ウェスティン都ホテル京都リニューアル、2021年10月 国内8ホテルの資産譲渡と運営受託、2022年4月 あをによし、2022年7月 近鉄エクスプレスの連結子会社化）。このうち採用したのは2022年の近鉄エクスプレス連結子会社化のみで、の注記（第112期に公開買付けで取得し連結の範囲に含めた）とも一致する。
- history: 1941年は３月と10月の2つの年月セルに2件の事象文が対応する崩れた表記で、記載順に対応づけたが、採用した出来事には含めていない。
- history: 沿革の全行ではなく、会社の成り立ちと体制の変化が分かる主な出来事を選んで記載した。
- industry: 主たる業界は transportation（運輸）とした。グループの中核が鉄軌道事業であることに加え、外部顧客への営業収益（2026年3月期）が最も大きい国際物流事業（753,129百万円）も、航空・海上貨物輸送とロジスティクスを内容とするため運輸に含めた。
- industry: 不動産（147,200百万円）と流通（223,451百万円）は報告セグメントとして金額が独立して開示されているため、それぞれ real-estate と retail を付けた。運輸は流通（223,451百万円）とほぼ同規模（223,270百万円）だが、主たる業界1つに含めた。
- relatedCompanies: 奈良交通株式会社、ＫＮＴ－ＣＴホールディングス株式会社、株式会社近鉄エクスプレスなどのグループ会社は、related-candidates.json に含まれていないため、規則により結ばなかった。
- relatedCompanies: エン（en）: ambiguous で、本文の一般語への一致のみ。
- relatedCompanies: いつも（itsumo）: 経営理念『「いつも」を支え、「いつも以上」を創ります。』の文への一致のみで、会社への言及ではない。
- relatedCompanies: キャリア（career）: 「キャリア採用」等の一般語への一致のみ。
- relatedCompanies: セキ（seki）: ambiguous で、一般語への一致のみ。
- relatedCompanies: 高速（kohsoku）: 奈良生駒高速鉄道株式会社など別会社の名称の一部への一致のみ。
- relatedCompanies: ビジョン（vision）: 「長期ビジョン2035」等の一般語への一致のみ。
- relatedCompanies: コア（core）: ambiguous で、一般語への一致のみ。
- relatedCompanies: 大和（daiwa）: 北交大和タクシー株式会社など別会社の名称の一部への一致のみ。
- relatedCompanies: リズム（rhythm）: 一般語への一致のみ。
- relatedCompanies: ランド（land）: 「グランドビル」等の一般語への一致のみ。
- relatedCompanies: ポート（port）: 「ポートフォリオ」の語への一致のみ。
- relatedCompanies: ベース（base-4481）: 「連結ベース」等の一般語への一致のみ。
- relatedCompanies: レック（lec）: 施設の記載への一致で、レック株式会社への言及ではない。
- relatedCompanies: ケアサービス（care-service）: 子会社だったクラブツーリズム・ライフケアサービスの名称への一致で、株式会社ケアサービスではない。
- relatedCompanies: コロナ（corona）: 感染症に関する記述への一致のみで、会社への言及ではない。
- relatedCompanies: クリエイト（create）: 子会社である近鉄レジャークリエイト株式会社の名称への一致で、クリエイト株式会社ではない。
- relatedCompanies: プラネット（planet）: 子会社である株式会社近畿日本ツーリストブループラネットの名称への一致で、株式会社プラネットではない。
- relatedCompanies: レント（rent）: 一般語への一致のみ。
- relatedCompanies: スペース（space）: 一般語への一致のみ。
- relatedCompanies: トラスト（trust）: listing が「（コードリストにない）」で、信託の語への一致のみ。
- relatedCompanies: レイ（ray）: ambiguous で、一般語への一致のみ。
- relatedCompanies: ユナイテッド（united）: 子会社である株式会社ユナイテッドツアーズの名称への一致で、ユナイテッド株式会社ではない。
- relatedCompanies: ゼロ（zero）: ambiguous で、一般語への一致のみ。
- relatedCompanies: アドベンチャー（adventure）: 一般語への一致のみ。
- relatedCompanies: フリー（freee）: 一般語への一致のみ。
- relatedCompanies: インサイト（insight）: 一般語への一致のみ。
- relatedCompanies: 三菱電機（mitsubishi-electric）: 個別財務諸表の未払建設費の相手先明細に現れるのみで、取引・提携の関係を述べた記載がないため結ばなかった。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ（mitsubishi-ufj-financial-group）: 金融機関であり、三菱ＵＦＪニコス株式会社などグループ会社の名称への一致のみ。資金調達や決済の文脈にとどまるため結ばなかった。
- relatedCompanies: リックス（rix）: 一般語への一致のみ。
- relatedCompanies: 大成建設（taisei）: 個別財務諸表の未払建設費の共同企業体の構成員として現れるのみで、関係を述べた記載がないため結ばなかった。
- relatedCompanies: 日本信号（the-nippon-signal）: 個別財務諸表の未払建設費の相手先明細に現れるのみで、関係を述べた記載がないため結ばなかった。
- relatedCompanies: 東名（toumei）: ambiguous で、東名高速道路など地名・道路名への一致のみ。
- relatedCompanies: 西日本旅客鉄道（west-japan-railway）: 個別財務諸表の未収運賃の相手先明細に現れるのみで、取引・提携の関係を述べた記載がないため結ばなかった。
- terms: 助言: 「フォワーディング」は用語集に未登録の候補です。有価証券報告書では「航空貨物輸送事業（フォワーディング事業）」「海上貨物輸送事業（フォワーディング事業）」と事業名に使われ、外部顧客への営業収益が最大の国際物流事業の中核の語です。国際輸送の手配を担う事業を指します。
- terms: 助言: 「ロジスティクス」も未登録の候補です。国際物流事業の区分名として使われ、物流の企画・運営を指します。
- terms: 連結子会社と持分法は登録済みのため、新規登録は不要です。

## 要確認（status に反映）

- businessStructure: 監査等委員会設置会社への移行（提出後の予定事項）: 有価証券報告書の【経営方針、経営環境及び対処すべき課題等】に、第115期定時株主総会の承認を得た上で監査等委員会設置会社へ移行する予定である旨が記載されています。提出日（2026年6月17日）時点では予定であり、株主総会の結果は証拠パックでは確認できないため、エントリーでは移行を完了したとは書いていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 近鉄グループホールディングスのホテル・レジャー事業 → 提案: tourism-hospitality（観光・宿泊・旅行）。ホテル・レジャー事業は、旅行業（外部顧客への営業収益では旅行業がセグメント内の中心）とホテル業が主体で、映画・水族館・テーマパークなどのレジャー施設は一部にとどまります。観光・宿泊・旅行業を表す業界の値が閉じた分類にないため、レジャー施設を含む最も近い値として entertainment を暫定で付けました。
