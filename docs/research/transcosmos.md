# トランス・コスモス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | トランス・コスモス株式会社 |
| 証券コード | 9715 |
| docID（データを取り出した文書） | `S100YENI` |
| 原本 docID | `S100YENI` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YENI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | トランス・コスモス株式会社 / 9715 / docID S100YENI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
transcosmos: 10 件の数値を有報XBRLと照合
有報: トランス・コスモス株式会社 有価証券報告書－第41期(2025/04/01－2026/03/31) (docID S100YENI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
transcosmos: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…収益なビジネスモデルへの転換を進めて利益を確保しています。2026年3月期の…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…け、「ビジネスモデルを進化、総合力を利益に換える」と「顧客基盤・サービスポー…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとし、営業利益・経常利益・セグメント利益・受注高・生産高などの金額は書かなかった。売上高の増減率はMD&Aの印字（4.8％増）どおりとした。
- businessModel: financialNotesは空とした。前期有報との修正再表示チェックは全項目一致で、決算期の変更や会計基準の変更の事実もないためである。
- businessModel: 中期事業計画（2026年度～2028年度）と長期目標は方針の内容だけを書き、売上高・営業利益・時価総額などの数値目標は書かなかった。
- businessModel: 2026年6月開始予定と印字された物流DXソリューションの新機能（trans-logiManager SmartTracking）は、個別サービスの開始予定であり、本文には書かなかった。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順（単体サービス254,286百万円→海外関係会社99,601百万円→国内関係会社39,977百万円）とした。3つとも報告セグメントである。MD&Aに印字されたセグメント売上高（内部売上高を含む255,482百万円など）ではなく、セグメント注記の外部顧客への売上高を使った。セグメント利益の金額は書いていない。
- businessStructure: 上場市場は表紙の印字（東京証券取引所プライム市場）どおりとした。
- businessStructure: 3つの報告セグメントは提供主体（当社・国内関係会社・海外関係会社）による区分であり、【関連情報】の製品およびサービスごとの情報は単一の製品・サービスの区分が売上高の90％を超えるため省略されているので、childrenは付けなかった。
- history: 沿革のうち、全国各地のCXスクエア・BPOセンターの開設など拠点の新設は、件数が多く事業内容の理解に必須でないため省いた。資本金の金額は書いていない。
- history: 1988年4月の合併（形式上の存続会社は株式会社総合ソフトウエア研究所）は、額面金額変更のための形式的なものであり、実質上の存続会社は当社である旨が沿革の注記に印字されているため、独立した項目にはしなかった。
- industry: 主たる業界は、3つの報告セグメントすべてが情報サービス・アウトソーシング（CXサービス・BPOサービス）の提供であり、当社が「独立系総合情報サービス企業」と位置づけていることから it とした。
- industry: 2つ目の業界は付けなかった。単体サービス・国内関係会社・海外関係会社の区分は提供主体によるもので、いずれも同じサービスの事業であり、独立した金額開示のある別業界の事業はないためである。
- relatedCompanies: 【関係会社の状況】に載る連結子会社のうち上場しているのはＪストリームと応用技術のみで、大宇宙信息創造(中国)有限公司・transcosmos Korea Inc.・上海特思尓大宇宙商務咨詢有限公司などは未上場で候補にないため結ばなかった。持分法適用関連会社のEMNET INC.・UNQ HOLDINGS LIMITEDも未上場で候補にない。
- relatedCompanies: アスタリスクは【関係会社の状況】には個別に載らないが、連結財務諸表の注記（連結の範囲の変更）に、2026年3月期から重要性が増したため新たに連結の範囲に含めた連結子会社と明記され、正式名称も印字されているため subsidiary として結んだ。
- relatedCompanies: 東北電力・髙島屋は、合弁会社の設立が沿革に明記され、その合弁会社が現在も関連会社であるため business-partner として結んだ。Arentは、サービスプラットフォームの共同開発がMD&Aに明記されているため business-partner として結んだ。モビルスは、特定投資株式の保有目的が他銘柄と共通の定型句ではなく「当社CX事業の業務提携先」と個別に述べられているため business-partner として結んだ。
- relatedCompanies: 大株主の状況（2026年3月31日現在）に載るのは、公益財団法人トランスコスモス財団、個人の株主、信託銀行（信託口）などが中心で、候補にある事業会社はなかったため、major-shareholder では結ばなかった。
- relatedCompanies: en: 「データエントリー」などの断片一致で、株式会社エンについての取引・提携の記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: career: 「キャリア形成」などの一般語の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」などの断片一致で、セキ株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: suzuki-6785: 役員「鈴木則義」など個人名の一致で、株式会社鈴木についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: core: 「スコアリング」などの断片一致で、株式会社コアについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: port: 自社サービス名「trans-DX for Support」の「サポート」の一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「営業利益をベースに」などの一般語の一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: the-lead: 「リードする」などの一般語の一致で、株式会社リードについての記載はないため結ばなかった。
- relatedCompanies: zero: 「ゼロエミッション」などの一般語の一致で、株式会社ゼロについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: path: 「パーパス」の断片一致で、パス株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: innovation: 「イノベーション活動」などの一般語の一致で、株式会社イノベーションについての記載はないため結ばなかった。
- relatedCompanies: vision: 「ビジョン」という一般語の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: ai: 自社サービス名「trans-AI VoiceBot」などの一致で、株式会社エーアイについての記載はないため結ばなかった。
- relatedCompanies: freee: 「心のバリアフリー」の断片一致で、フリー株式会社についての記載はないため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の断片一致で、レック株式会社についての記載はないため結ばなかった。
- relatedCompanies: rent: 「エクセレントカンパニー賞」の断片一致で、株式会社レントについての記載はないため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称の部分一致で、株式会社トラストについての記載はなく、listing がコードリストにないため結ばなかった。
- relatedCompanies: basic: 2026年3月期に保有目的が純投資目的へ変更された銘柄として現れるが、取引・提携の個別の記載がないため結ばなかった。
- relatedCompanies: delivery-consulting: 2026年3月期に保有目的が変更され、重要な業務提携先から「取引先の1社」へ位置付けを変更したと明記されているため結ばなかった。
- relatedCompanies: gakujo: 「長崎大学情報データ科学部」との産学連携の文脈の断片一致で、株式会社学情についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: garden: 施設名「福岡大名ガーデンシティ」の一致で、株式会社ガーデンについての記載はないため結ばなかった。
- relatedCompanies: insight: 「インサイトを導出するソリューション」の一般語の一致で、株式会社インサイトについての記載はないため結ばなかった。
- relatedCompanies: jaccs: 特定投資株式の表に載るが、保有目的は「営業上の取引先としての取引関係の維持強化」という他銘柄と共通の定型句のみで、個別の取引・提携の記載がないため結ばなかった。金融機関でもある。
- relatedCompanies: japan-airlines: 特定投資株式の表に載るが、保有目的は他銘柄と共通の定型句のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: kddi: 1997年のＪストリーム設立時の合弁相手（国際電信電話株式会社、現 KDDI株式会社）として沿革に現れるが、現在の取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: king: 自社サービス名「trans-logiManager SmartTracking」の断片一致で、株式会社キングについての記載はないため結ばなかった。
- relatedCompanies: land: 連結子会社「グランドデザイン株式会社」の名称の断片一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: menicon: 特定投資株式の表に載るが、保有目的は他銘柄と共通の定型句のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: nissin: 新株予約権の決議年月日の文脈の断片一致で、株式会社日新についての記載はなく、listing がコードリストになく、ambiguous のため結ばなかった。
- relatedCompanies: omron: 持分法適用会社の異動に「オムロントランスコスモスプロセスイノベーション株式会社（新規設立）」の名称が現れるが、有報の本文にオムロン株式会社との合弁・提携であることの明記がなく、合弁会社の名称だけでは根拠が不足するため結ばなかった。
- relatedCompanies: yamadai: 「和歌山大学」の断片一致で、株式会社山大についての記載はなく、listing がコードリストになく、ambiguous のため結ばなかった。
- terms: 助言: 「BPO」は用語集に未登録です。業務プロセスの運用を外部の専門会社に委託することで、有報ではBPOサービス・BPOセンター・国内BPO事業など繰り返し使われており、当社の事業の中核の語であるため、登録候補になります。
- terms: 助言: 「コンタクトセンター」は用語集に未登録です。電話やチャットなどで企業の顧客対応を行う拠点のことで、CXサービスの中核として有報に繰り返し現れるため、登録候補になります。
- terms: 助言: 「CX」は用語集に未登録です。顧客体験・顧客対応に関わるサービス全般を指す語として、CXサービス・CXスクエア・CX事業のように有報で繰り返し使われているため、登録候補になります。
- terms: 助言: 「アウトソーシング」は用語集に未登録です。企業の業務の一部を外部の専門会社に委託することで、当社の報告セグメントの定義そのものに使われているため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
