# メディパルホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社メディパルホールディングス |
| 証券コード | 7459 |
| docID（データを取り出した文書） | `S100YI1C` |
| 原本 docID | `S100YI1C` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI1C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社メディパルホールディングス / 7459 / docID S100YI1C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
medipal-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社メディパルホールディングス 有価証券報告書－第117期(2025/04/01－2026/03/31) (docID S100YI1C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
medipal-holdings: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…付加価値の高い商材の拡充などによって利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes には、表示方法の変更に伴う前年度の組替えと、企業結合の暫定的な会計処理の確定による過年度数値の見直しの2件だけを記録した。どちらも売上高と親会社株主に帰属する当期純利益の金額そのものの訂正ではない。
- businessModel: Wikipedia の抜粋は有価証券報告書にある内容と重なる範囲にとどまり、補足できる事実がなかったため使わなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順にした（医療用医薬品等卸売事業 2,462,464百万円、化粧品・日用品、一般用医薬品卸売事業 1,237,563百万円、動物用医薬品・食品加工原材料卸売等関連事業 117,326百万円）。
- businessStructure: ＰＡＬＴＡＣの議決権の所有割合は2026年3月31日現在の52.4％を記載した。完全子会社化のための公開買付けは提出後に進んだ事項のため、完了とは書かず needsReview に記録した。
- history: 沿革は年月と事項が続け書きになった表のため、記載順に年月と事項を対応づけて読み取った。主な出来事を選んで記載し、子会社の完全子会社化などの細かな行は一部を省いた。
- industry: 主たる業界は、外部顧客への売上高が最も大きい医療用医薬品等卸売事業から pharmaceuticals（医薬品）とした。
- relatedCompanies: ＰＡＬＴＡＣ（paltac）: 連結子会社（議決権52.4％）で関係は明確だが、related-candidates の listing が「（コードリストにない）」のため、規則により結ばなかった。
- relatedCompanies: ベース（base-4481）: 「データベース」等の語への一致のみで、会社としての関係の記載がない。
- relatedCompanies: エン（en）: ambiguous で、本文の一般語への一致のみ。
- relatedCompanies: ポート（port）: 「ポートフォリオ」の語への一致のみ。
- relatedCompanies: ランド（land）: 「グランドデザイン」等の一般語への一致のみ。
- relatedCompanies: セキ（seki）: ambiguous で、一般語への一致のみ。
- relatedCompanies: キャリア（career）: 「キャリアプラン」等の一般語への一致のみ。
- relatedCompanies: コロナ（corona）: 「新型コロナウイルス感染症」への一致のみで、会社への言及ではない。
- relatedCompanies: キューブ（cube）: 連結子会社「株式会社プレサスキューブ」の名称への一致で、株式会社キューブではない。
- relatedCompanies: コア（core）: ambiguous で、「コア・コンピテンシー」等の一般語への一致のみ。
- relatedCompanies: カバー（cover）: 「カバーする」という一般語への一致のみ。
- relatedCompanies: レント（rent）: 「タレントマネジメント」等の一般語への一致のみ。
- relatedCompanies: トラスト（trust）: 信託銀行の名称の一部への一致で、信託口の純投資である。
- relatedCompanies: ケアサービス（care-service）: 「ヘルスケアサービス」の語への一致のみで、株式会社ケアサービスへの言及ではない。
- relatedCompanies: 住友ファーマ（sumitomo-pharma）: 2023年に子会社（現・ＭＰ五協フード＆ケミカル株式会社）を取得した際の相手方として沿革に現れるのみで、現在の関係の記載がないため、出来事として history にのみ書いた。
- relatedCompanies: スズケン・東邦ホールディングス・アルフレッサ ホールディングス・バイタルケーエスケー・ホールディングス: 同業の卸売会社だが、政策保有株式の表と定型の保有目的のみで、個別の取引・提携の記載がない。
- relatedCompanies: 武田薬品工業・第一三共・塩野義製薬・小野薬品工業・大塚ホールディングス・参天製薬・テルモ・ライオン・小林製薬以外の製薬・食品メーカー各社（ロート製薬、日本新薬、日本化薬、杏林製薬、科研製薬、キッセイ薬品工業、持田製薬、扶桑薬品工業、久光製薬、ホギメディカル、鳥居薬品、ゼリア新薬工業、サワイグループホールディングス、ツムラ、ニプロ、明治ホールディングス、アリアケジャパン、フマキラー、ファンペップ、メディカル・データ・ビジョン）: 政策保有株式の表と定型の保有目的のみで、個別の取引・提携の記載がない。
- relatedCompanies: 小売各社（クリエイトＳＤホールディングス、平和堂、イズミ、ジョイフル本田、クスリのアオキホールディングス、マツキヨココカラ＆カンパニー、トライアルホールディングス、アインホールディングス、メディカル一光グループ）: 政策保有株式の表と定型の保有目的のみで、個別の取引の記載がない。
- relatedCompanies: ほくやく・竹山ホールディングス、カンダホールディングス、大本組、神栄、令和アカウンティング・ホールディングス、フリー（freee）: 政策保有株式の表への記載等のみで、個別の取引・提携の記載がない。
- relatedCompanies: エムティーアイ（mti）は資本業務提携の基本合意があるため business-partner として結んだが、持分法適用関連会社として結んだのは有報の区分どおりクオールホールディングスとＪＣＲファーマの2社である。
- terms: 助言: 「ＡＬＣ」（Area Logistics Center）は用語集に未登録です。有価証券報告書の用語解説で「医療用医薬品や医療材料などを扱う高機能物流センター」と定義され、事業説明の中核の語として頻出するため、登録候補になります。
- terms: 助言: 「コンパニオンアニマル」（伴侶動物）も未登録です。有価証券報告書に用語解説があり、動物用医薬品事業の説明に使われています。
- terms: 連結子会社（consolidated-subsidiary）と持分法（equity-method）は登録済みのため、新規登録は不要です。

## 要確認（status に反映）

- businessStructure: ＰＡＬＴＡＣの完全子会社化: 当社は2026年5月11日開催の取締役会で、連結子会社である株式会社ＰＡＬＴＡＣ（議決権の所有割合52.4％、2026年3月31日現在）を完全子会社化するための公開買付けを決議した（有価証券報告書の重要な後発事象）。公開買付けは2026年7月7日に終了し、応募株券等の買付けが行われ、買付け後の株券等所有割合は92.64％となった（公開買付報告書 S100YPIT、2026年7月8日提出。当職が内容を確認し、autopilot の ack で確認済みとして記録した）。エントリーのＰＡＬＴＡＣの記載は2026年3月31日現在のものであり、完全子会社化の一連の取引の完了は次期の有価証券報告書で確認すること。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] メディパルホールディングスの化粧品・日用品、一般用医薬品卸売事業 → 提案: wholesale（卸売）。当社は卸売業のグループであり、第2位の報告セグメントである化粧品・日用品、一般用医薬品卸売事業（外部顧客への売上高1,237,563百万円、2026年3月期）に付けられる業界の値が閉じた分類にない。小売（retail）は自ら小売を行う事業ではないため付けなかった。
