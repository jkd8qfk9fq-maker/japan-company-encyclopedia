# 大紀アルミニウム工業所 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社大紀アルミニウム工業所 |
| 証券コード | 5702 |
| docID（データを取り出した文書） | `S100YCJD` |
| 原本 docID | `S100YCJD` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCJD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社大紀アルミニウム工業所 / 5702 / docID S100YCJD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 31 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daiki-aluminium-industry: 10 件の数値を有報XBRLと照合
有報: 株式会社大紀アルミニウム工業所 有価証券報告書－第99期(2025/04/01－2026/03/31) (docID S100YCJD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
daiki-aluminium-industry: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2026年3月期のは3,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務数値は売上高と親会社株主に帰属する当期純利益だけを書き、営業利益・経常利益・セグメント利益の金額や増減率は規則により書いていない。純利益の変動理由も書いていない。
- businessModel: 修正再表示チェックは前期有報との重複年度が全項目一致で、会計基準の変更や決算期の変更もないため、financialNotes は空にした。
- businessModel: 中期経営計画の目標指標（経常利益の確保、ROE、PBR、配当性向など）は規則により perspectives に書かず、方針と柱だけを質的に書いた。
- businessModel: Wikipedia は企業一覧のページしか取得されておらず、会社固有の補足がないため使わなかった。
- businessStructure: 報告セグメントは「アルミニウム二次合金」のみ（単一セグメント）のため、同事業を先に置き、報告セグメントに含まれない「その他」（ダイカスト製品事業・アルミニウム溶解炉事業、外部顧客への売上高5,800百万円）を最後に置いた。
- businessStructure: 【関連情報】の製品及びサービスごとの情報はセグメント情報と同様として省略されているため、children は【事業の内容】の区分（製品・商品／ダイカスト製品・溶解炉）を使った。区分ごとの金額は開示されていないため、金額は書いていない。
- businessStructure: MD&Aには製品・商品の区分（アルミニウム二次合金地金／商品・原料他）の金額があるが、「その他」を含む連結全体の内訳でありセグメントの children に対応しないため使わなかった。
- history: 【沿革】は年月と事象が対で印字されているため、そのまま行順で対応づけた。創業時の金額は有報に印字がない。
- history: 工場の操業開始（八尾・結城・新城・亀山・白河・滋賀）や小規模な子会社の設立・社名変更などの細目は、主な転機に絞るため落とした（warnings に記録）。
- history: 1994年・2023年の社長交代は経営体制の出来事として落とした。
- industry: 主たる事業はアルミニウム二次合金（非鉄金属素材）の製造販売だが、閉じた分類に金属・素材の区分がないため、素材産業として最も近い chemicals を暫定の主たる業界とした（taxonomyGaps に記録）。
- industry: 「その他」（ダイカスト製品・溶解炉）は報告セグメントに含まれず金額も小さいため、追加の業界は付けなかった。
- relatedCompanies: 結んだ関連企業はない。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: en: 「エン」は子会社名「ダイキエンジニアリング」「ダイキ エンジニアリング タイ」の断片一致で、エン株式会社への言及ではない。
- relatedCompanies: land: 「ランド」は「タイランド」「インドネシア」等の国名の断片一致で、株式会社ランドへの言及ではない。
- relatedCompanies: zero: 「ゼロ」は中期経営計画の柱にある「埋立廃棄物ゼロ」「労働災害ゼロ」等の一般語で、株式会社ゼロへの言及ではない。
- relatedCompanies: ishin: 「イシン」は連結子会社「セイシン（タイランド）」「株式会社聖心製作所」の断片一致で、イシン株式会社への言及ではない。
- relatedCompanies: career: 「キャリア」は人材育成の記述にある「キャリアビジョン」の一般語で、株式会社キャリアへの言及ではない。
- relatedCompanies: seki: 「セキ」は「情報セキュリティ研修」等の断片一致で、セキ株式会社への言及ではない。
- relatedCompanies: base-4481: 「ベース」は「営業利益ベースの数値」の一般語で、ベース株式会社への言及ではない。
- relatedCompanies: vision: 「ビジョン」は「キャリアビジョン」の一般語で、株式会社ビジョンへの言及ではない。
- relatedCompanies: aska: 「アスカ」は持分法適用関連会社の所在地「バーレーン国アスカル市」の断片一致で、株式会社アスカへの言及ではない。
- relatedCompanies: s-t: 「エステー」は大株主「有限会社山本エステート」の断片一致で、エステー株式会社への言及ではない。
- relatedCompanies: trust: 「トラスト」は大株主の日本マスタートラスト信託銀行株式会社（信託口）の断片一致。信託銀行の信託口は純投資であり、候補の listing もコードリストにない。
- relatedCompanies: ahresty: 【株式の保有状況】の特定投資株式にのみ記載がある。保有目的は全銘柄共通の定型句「営業上の取引関係等の円滑化のため」で、相手固有の取引・提携の記載が有報の他の箇所にないため結ばない。
- relatedCompanies: alconix: 特定投資株式にのみ記載。保有目的は全銘柄共通の定型句「営業上の取引関係等の円滑化のため」で、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: sato-sho-ji: 特定投資株式にのみ記載。保有目的は全銘柄共通の定型句「営業上の取引関係等の円滑化のため」で、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: ryobi: 特定投資株式にのみ記載。保有目的は全銘柄共通の定型句「営業上の取引関係等の円滑化のため」で、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: okaya-and-co: 特定投資株式にのみ記載。保有目的は全銘柄共通の定型句「営業上の取引関係等の円滑化のため」で、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: nippon-crucible: 特定投資株式にのみ記載。保有目的は全銘柄共通の定型句「営業上の取引関係等の円滑化のため」で、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: tokyo-tekko: 特定投資株式にのみ記載。保有目的は全銘柄共通の定型句「営業上の取引関係等の円滑化のため」で、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: kyowa-electronic-instruments: 特定投資株式にのみ記載。保有目的は「当該会社株式を保有することにより取引関係の強化を図るため」という保有目的の定型表現で、具体的な取引・提携の記載が有報の他の箇所にないため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式にのみ記載で、保有目的は「金融取引にかかる取引先としての関係維持強化のため」。資金調達を理由とする金融機関は結ばない。【大株主の状況】に載るのは株式会社三菱UFJ銀行であり、候補の同グループ自体でもない。
- relatedCompanies: mizuho-financial-group: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。
- relatedCompanies: resona-holdings: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。【大株主の状況】に載るのは株式会社りそな銀行であり、候補の同ホールディングス自体でもない。
- relatedCompanies: aichi-financial-group: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。
- relatedCompanies: mebuki-financial-group: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。
- relatedCompanies: senshu-ikeda-holdings: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。
- relatedCompanies: the-kiyo-bank: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。
- relatedCompanies: san-ju-san-financial-group: 特定投資株式にのみ記載。保有目的は「金融取引にかかる取引先としての関係維持強化のため」で、資金調達を理由とする金融機関は結ばない。
- relatedCompanies: 候補外の記録: 特定投資株式には株式会社UACJ（保有目的は上記と同じ定型句）も載るが、related-candidates.json に含まれないため、候補からのみ選ぶ規則により結ばない。
- relatedCompanies: 候補外の記録: 【大株主の状況】の事業会社は有限会社山本エステート（未上場・候補にない）のみで、ほかに載るのは信託銀行・銀行・保険会社であり、major-shareholder として結べる候補はない。
- terms: 登録候補（助言のみ）: アルミニウム二次合金（アルミニウム屑を原料に溶解・精錬して作る再生合金地金。同社の主力製品）、水平リサイクル（使用済み製品から同じ用途の原料へ戻す循環）、アルミスクラップ（再生原料となるアルミニウム屑）、G&G（同社が掲げる経営コンセプト「Global & Green」）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 大紀アルミニウム工業所の主たる業界（アルミニウム二次合金の製造販売） → 提案: nonferrous-metals（非鉄金属）。閉じた分類に金属・素材の区分がなく、アルミニウム二次合金のような非鉄金属素材の製造販売を表せないため、素材産業として最も近い chemicals を暫定とした。
