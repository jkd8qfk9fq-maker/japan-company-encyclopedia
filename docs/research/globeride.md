# グローブライド — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | グローブライド株式会社 |
| 証券コード | 7990 |
| docID（データを取り出した文書） | `S100YGZ1` |
| 原本 docID | `S100YGZ1` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGZ1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | グローブライド株式会社 / 7990 / docID S100YGZ1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
globeride: 10 件の数値を有報XBRLと照合
有報: グローブライド株式会社 有価証券報告書－第71期(2025/04/01－2026/03/31) (docID S100YGZ1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
globeride: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの修正再表示チェックは前期有報と全8行一致し、表示方法の変更にあたる注記は確認できなかったため、組替えに関する financialNotes は書かず、判断経緯をここに記録しました。
- businessModel: 中期経営計画2030の数値目標（売上高・営業利益・ROE・PBR・配当など）は、本文には売上高と当期純利益の実績だけを書く規則と、投資の語を書かない規則のため、perspectives にも書いていません。
- businessModel: 2021年10月1日の株式分割は needsReview に記録しました。
- businessStructure: 事業の並びは報告セグメントの外部顧客への売上高の大きい順（日本→アジア・オセアニア→欧州→米州）としました。報告セグメントは生産・販売体制を基礎とした地域別セグメントの4つです。
- businessStructure: 製品区分別の売上高（釣用品113,382百万円・ラケットスポーツ用品等7,024百万円・ゴルフ用品6,131百万円・その他419百万円）は【関連情報】で連結全体についてのみ開示され、地域セグメントごとの内訳が印字されていないため、children には使わず businessModel の industryPosition に記録しました。
- businessStructure: グループは当社と子会社29社で構成されます（【事業の内容】）。福利厚生事業の株式会社デスコ、倉庫荷役業務の株式会社ロジスポなども日本セグメントに含まれます。
- history: 1958年の設立の項目にある資本金の金額は、本文に財務数値を書かない規則のため記載しませんでした。1966年の吸収合併の相手方の資本金の金額も同様に記載しませんでした。
- history: 2008年の3件は、沿革表で年月セルが連続して印字され事象文と分かれている崩れた表ですが、本成果物は年単位の記録のため、いずれも2008年の事象として行順に収録しました（月は特定していません）。
- history: 2018年・2019年の2件は、年月セル（2018年11月・2019年1月）と事象文（広州の販売会社設立・ロシアの販売会社設立）が分かれて印字された崩れた表のため、年月と事象の数が一致することから行順で対応づけました（2018年＝ダイワ・キャスティング(広州)トレーディングの設立、2019年＝ダイワ・ロシアの設立）。
- history: Wikipedia の記事冒頭は本社の所在地の確認にとどまり、有報にない補足として使える固有の事実がなかったため、使用しませんでした。
- history: 沿革表の主な事象を収録しました。清算・吸収合併済みの子会社の設立など、現在のグループ構成に残らない一部の事象は省きました。
- industry: 主たる業界は、閉じた分類にスポーツ用品の区分がないため、暫定で retail（小売）としました。理由と提案は taxonomyGaps に記録しました。
- industry: 事業は釣用品・ゴルフ用品・ラケットスポーツ用品などの製造・販売であり、電気機器・機械などの他の区分にも当たりません。報告セグメントは地域別のみのため、2つ目の業界は付けていません。
- relatedCompanies: 特定投資株式の相手は、保有目的が「事業活動の円滑化のため、資本コストを踏まえ、配当・取引額等に加え、経営戦略上の重要性や事業上の関係等を総合的に判断し保有しています」という全銘柄共通の定型句のみで、銘柄固有の取引の向きの印字がないため結んでいません: asahi-intecc（朝日インテック）、ferrotec（フェローテック）、kyodo-printing（共同印刷）、mitsubishi-pencil（三菱鉛筆）、moonbat（ムーンバット）、nac（ナック）、nihon-seimitsu（日本精密）、sumitomo-realty-and-development（住友不動産）、toda（戸田建設）、yamabiko（やまびこ）。
- relatedCompanies: 金融機関の特定投資株式・大株主（hokuhoku-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group、ms-and-ad-insurance-group-holdings、resona-holdings、the-hyakujushi-bank）: 株式の保有は資金調達・保険等の金融取引の文脈のみのため結んでいません。大株主の状況に載る三井住友銀行、みずほ銀行、住友生命保険、日本生命保険と、信託銀行・資産管理会社（日本マスタートラスト信託銀行、日本カストディ銀行）は、金融機関・純投資のため結んでいません。
- relatedCompanies: 一般語・部分一致の誤マッチのため結んでいません: land（タイランド等の部分一致）、en（エンタープライズの部分一致、ambiguous）、mani（ジャーマニーの部分一致）、slogan（スローガンという一般語）、vision（ビジョンという一般語）、corona（コロナ禍の文脈）、career（キャリア形成の一般語）、base-4481（営業利益ベースの部分一致）、tear（自治体の部分一致）、torq（製品名「銀影競技メガトルク」の部分一致）、hyper（製品技術名HYPERDRIVE DESIGNの部分一致）、ags（製品技術AGS（エアーガイドシステム）の部分一致）、zero（使用価値がゼロという一般語、ambiguous）、seki（セキュリティ等の部分一致、ambiguous）、suzuki-6785（代表者氏名の部分一致、ambiguous）、daiwa（中野区大和町・旧商号ダイワ精工等の部分一致で、株式会社大和との関係の印字なし、ambiguous）。
- relatedCompanies: trust（日本マスタートラスト信託銀行（信託口））: 候補データの listing がコードリストになく、大株主としての保有も信託口の純投資のため結んでいません。
- terms: 用語候補（助言のみ。用語の登録は行いません）: ピックルボール（パドルでプラスチックボールを打ち合うラケットスポーツで、当社グループがゴルフ／スポーツ事業で取り組みを加速させるとしている種目）、AGS（エアーガイドシステム。カーボンクロスでガイドを成型する当社の釣竿の技術）、ライフタイム・スポーツ（人生を豊かにするスポーツという当社グループの提案する考え方）。

## 要確認（status に反映）

- businessModel: 2021年10月1日を効力発生日として、普通株式1株につき2株の割合で株式分割を実施した。連結経営指標等の株式数に係る数値は、第67期の期首に当該株式分割が行われたと仮定して算定されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] グローブライドの主たる業界 → 提案: スポーツ用品。釣用品、ゴルフ用品、ラケットスポーツ用品などのスポーツ用品の製造・販売が事業の中心（2026年3月期の製品別売上高では釣用品が113,382百万円と大半）ですが、閉じた分類にスポーツ用品の区分がないため、用品の販売に最も近い retail を暫定としました。
