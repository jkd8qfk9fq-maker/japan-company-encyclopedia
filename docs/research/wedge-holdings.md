# ウェッジホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ウェッジホールディングス |
| 証券コード | 2388 |
| docID（データを取り出した文書） | `S100XDIK` |
| 原本 docID | `S100XDIK` |
| 提出日（原本） | 2025-12-26 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XDIK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ウェッジホールディングス / 2388 / docID S100XDIK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wedge-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ウェッジホールディングス 有価証券報告書－第24期(2024/10/01－2025/09/30) (docID S100XDIK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第23期(2023/10/01－2024/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
wedge-holdings: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はMD&Aの印字どおりの億円・百万円表記（売上高８億16百万円、親会社株主に帰属する当期純損失２億26百万円）で記載し、千円額からの換算や切り上げはしていません。
- businessModel: MD&Aの事業別の記載にあるコンテンツ事業の売上高７億64百万円は、セグメント情報及び販売実績の印字（コンテンツ事業816,182千円＝連結売上高と同額）と一致しないため本文には使わず、連結売上高の印字を用いました。
- businessModel: セグメント利益、営業損失、経常損失、持分法適用関連会社に関する投資損失等の金額は、本文の財務数値は売上高と当期純利益だけとする規則のため記載していません。
- businessModel: 前期（第23期）には訂正有価証券報告書がありますが、前期有報との修正再表示チェックは全系列で差異ゼロであり、５年間の経営指標に影響しないため warnings の記録にとどめています。
- businessModel: 2025年12月22日の取締役会で決議されたストックオプション（新株予約権）の付与は重要な後発事象として印字されていますが、資本政策に関する事項のため warnings の記録にとどめています。
- businessModel: リゾート事業を営む持分法適用関連会社の株式売却（2025年４月29日）と持分法適用範囲からの除外は、期中に完了し当期の構造に反映されているため needsReview には入れていません。
- businessStructure: グループ構成は2025年９月30日現在で、当社、連結子会社５社、持分法適用関連会社７社及び親会社１社です。
- businessStructure: 親会社は昭和ホールディングス株式会社（議決権の被所有割合53.24％、うち間接所有27.74％を含む、2025年９月30日現在）ですが、現在のEDINETコードリストでは同社は非上場（証券コードなし）と分類されているため、関連企業としては結んでいません（relatedCompanies の warnings に記録）。
- businessStructure: 【関係会社の状況】には、もう１社の親会社としてA.P.F.Group Co.,Ltd.（被所有割合は間接56.44％）が記載されていますが、同社が実質的な親会社である昭和ホールディングス株式会社の株式を保有しているかは確認中である旨が注記されています。
- businessStructure: Group Lease PCL.の子会社GL Finance PLC.は、2024年９月12日付でカンボジア国立銀行からファイナンスリーシングライセンスの取消しと会社清算の通知を受けて清算手続きに入っており、支配従属関係の喪失のため当連結会計年度の期首から持分法の適用範囲から除外されています。
- businessStructure: リゾート事業を営む持分法適用関連会社Engine Property Management Asia Co.,Ltd.及びP.P.Coral Resort Co.,Ltd.の株式は2025年４月29日に譲渡され、第３四半期連結会計期間の期首から持分法適用の範囲から除外されています（期中に完了した事象のため needsReview には入れていません）。
- businessStructure: Digital Finance事業は持分法適用関連会社の事業であり報告セグメントではないため、業界（finance）は付けていません。
- history: 沿革表の末尾は年月セルと事象文が分かれた崩れた表になっており、2012年４月・2013年６月・2014年７月の３つの年月に対し、事象文が「Group Lease Holdings PTE.LTD.を連結子会社とする」「GL Finance PLC.を連結子会社とする。」「Thanaban Co.,Ltd.を連結子会社とする。」の３件連記されています。年月と事象の数が同じため、行順に対応づけて記録しました。
- history: 2001年の設立行に印字された資本金の金額は、沿革に資本金を書かない規則のため記載していません。
- history: 2005年の株式会社エンジンの完全子会社化、2007年のブレインナビ・コンテンツファンド投資事業組合の解散、2010年の子会社吸収合併などの個別の出来事は、会社の転機となる行に絞るため割愛しました。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる事業は映像・音楽・アニメ・書籍・トレーディングカードゲーム等のコンテンツの企画・制作・編集であり、閉じた集合では entertainment がそのまま合います。暫定値ではないため taxonomyGaps はありません。
- industry: Digital Finance事業は持分法適用関連会社の事業で報告セグメントではなく、金額が独立して開示されていないため、業界（finance）は付けていません。
- relatedCompanies: showa-holdings（昭和ホールディングス株式会社）：【関係会社の状況】に親会社として記載され、議決権の被所有割合は53.24％（SIX SIS LTD.を通じた間接所有27.74％を含む、2025年９月30日現在）ですが、現在のEDINETコードリストでは同社は非上場（証券コードなし、E01088）と分類され、候補データでも listing が「（コードリストにない）」となっているため、上場が確認できず結びませんでした。親会社の事実は businessStructure に記録しています。
- relatedCompanies: j-trust（Jトラスト株式会社）：持分法適用関連会社Group Lease PCL.とその子会社に対する訴訟の相手方（子会社JTAが原告）の文脈でのみ登場し、当社との取引・提携・資本関係の記載がないため結びませんでした。
- relatedCompanies: en（エン株式会社）：2005年に完全子会社化した株式会社エンジン（旧連結子会社、2010年に吸収合併）の部分一致であり、エン株式会社とは別法人のため結びませんでした。
- relatedCompanies: tein（株式会社テイン）：株式会社ラディクスエースエンタテインメントの部分一致のため結びませんでした。
- relatedCompanies: career（株式会社キャリア）：人材のキャリアという一般名詞の一致のため結びませんでした。
- relatedCompanies: ray（株式会社レイ）：事業部名等の部分一致（ambiguous）のため結びませんでした。
- relatedCompanies: corona（株式会社コロナ）：「コロナ禍」の部分一致のため結びませんでした。
- relatedCompanies: vision（株式会社ビジョン）：事業戦略（ビジョン）という一般名詞の一致のため結びませんでした。
- relatedCompanies: axell（株式会社アクセル）：中期経営計画「アクセルプラン」の部分一致のため結びませんでした。
- relatedCompanies: nikon（株式会社ニコン）：「ユニコン事業部」の部分一致のため結びませんでした。
- relatedCompanies: seki（セキ株式会社）：「セキュリティ」の部分一致（ambiguous）のため結びませんでした。
- relatedCompanies: will（株式会社ウィル）：部分一致の単語レベルの一致のため結びませんでした。
- relatedCompanies: zero（株式会社ゼロ）：部分一致の単語レベルの一致（ambiguous）のため結びませんでした。
- relatedCompanies: 主要な顧客である株式会社コナミデジタルエンタテインメント、株式会社集英社、株式会社バンダイは候補一覧に含まれておらず（いずれも未上場または上場会社の子会社）、関連企業としては結んでいません。顧客の事実は businessStructure と businessModel に記録しています。
- terms: 提案する用語候補は次のとおりです（用語集への登録は提案のみで、ここでは登録していません）。
- terms: Digital Finance事業：当社グループの持分法適用関連会社が東南アジアで行う金融事業の総称。オートバイリースやマイクロファイナンスなどを、タイのGroup Lease PCL.を中心とする関連会社群が展開しています。
- terms: ライツ事業：映像・音楽・書籍などのコンテンツに関する権利（ライツ）を活用し、許諾などにより収益を得る事業。当社のコンテンツ事業の一部として営まれています。
- terms: ロイヤリティ収入：コンテンツの権利の使用許諾などにより得られる収入。当社の2025年９月期は、前年同期の過去最高水準から減少し、減収の主な要因となりました。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
