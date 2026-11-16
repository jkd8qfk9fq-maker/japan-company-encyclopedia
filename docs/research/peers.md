# ピアズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ピアズ |
| 証券コード | 7066 |
| docID（データを取り出した文書） | `S100XD95` |
| 原本 docID | `S100XD95` |
| 提出日（原本） | 2025-12-25 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XD95.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ピアズ / 7066 / docID S100XD95（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
peers: 10 件の数値を有報XBRLと照合
有報: 株式会社ピアズ 有価証券報告書－第24期(2024/10/01－2025/09/30) (docID S100XD95)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
peers: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記2の株式分割は needsReview に記録しました。注記3（第21期は当期純損失のため潜在株式調整後の数値を記載していない）は表示事項のため、ここに記録しました。
- businessModel: 経営指標として売上高とEBITDAを位置づける旨が有報に印字されていますが、投資・経営指標の目標値は本文や戦略に書いていません。売上高と純利益以外の利益項目の金額や増減理由は本文に書いていません。
- businessModel: 不採算事業であったリモートワークボックス事業の売却と事業売却益の計上は、純利益の増減理由に関わるため本文には書かず、ここに記録しました。
- businessStructure: 単一セグメント（コンサルティング事業）のため、子区分は事業の内容に印字された3つのサービス種別（セールスプロモーション／オンライン接客／セールス／AIボーディング）に基づきました。サービス別の売上高は有報に独立して開示されていないため、各子区分に金額は書いていません。
- businessStructure: ベルフェイスシステム株式会社は2025年8月12日に全株式を取得して完全子会社化した期中の出来事で、2025年9月30日現在の連結子会社3社に含まれているため、needsReviewには入れず、ここに記録しました。
- history: 沿革に印字された資本金の金額は、規則により歴史の記述に含めていません。
- history: 沿革のうち、ISO27001の認証取得や日本経営品質賞の受賞、既に全株式を売却・吸収合併した子会社の設立・取得などは、現在の事業構成を説明するうえで中心ではないため省きました。
- industry: 主たる業界はコンサルティング事業ですが、閉じた分類にコンサルティングを表す区分が無いため human-resources を暫定で主たる業界とし、taxonomyGapsに提案ラベル「コンサルティング（経営コンサルティング・専門サービス）」を記録しました。
- industry: オンライン接客システムやAI研修システム「mimik」、電話面談システム「bellFace」などのシステム提供を行っているため、2つ目にitを付けました。
- relatedCompanies: 株式会社NTTドコモは2025年9月期の主要な顧客（売上高3,884,441千円、63.6％）で、運営受託や共同でのコンテンツ提供も印字されていますが、関連候補にありません。候補のntt（9432、NTT株式会社）は親会社であり別法人で、付け替えはしないため結んでいません。
- relatedCompanies: 株式会社３－ＳＨＩＮＥ（2025年9月30日現在45.44％の大株主）は関連候補にないため結んでいません。楽天証券株式会社は大株主ですが証券会社のため結んでいません。
- relatedCompanies: como（2224）、path（3840）、career（6198）、itsumo（7694）、frontier（4250）、land（8918）、port（7047）、corona（5909）、en（4849）、taya（4679）、seki（7857）は一般語や部分一致であり、当社との関係は印字されていないため結んでいません。will（3241）とmax（6454）は、沿革に現れる株式会社ウィル・株式会社マックスプロデュース（いずれも既に吸収合併・売却済みの別法人）と社名が一部一致するだけであり、候補の上場会社とは同一性が確認できないため結んでいません。
- relatedCompanies: nissin（9066）はコードリストにない候補であり、当社との関係も印字されていないため結んでいません。
- relatedCompanies: 特定投資株式は「該当事項はありません」でした。連結子会社3社（2Links株式会社、株式会社Qualiagram、ベルフェイスシステム株式会社）は自社の子会社のため結んでいません。ベルフェイス株式会社（bellFace事業の譲渡元）は関連候補にありません。
- terms: 助言のみ。用語の候補としては「セールスプロモーション」「オンライン接客」「AIボーディング」「mimik」「bellFace」「SES（システムエンジニアリングサービス）」などが挙げられますが、本工程ではデータを持ちません。

## 要確認（status に反映）

- businessModel: 2021年10月14日付で普通株式1株を2株に分割し、2023年7月21日付で普通株式1株を2株に分割しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ピアズの主たる業界 → 提案: コンサルティング（経営コンサルティング・専門サービス）。コンサルティング事業が売上高の全てを占め、販売支援のコンサルティングや人材育成支援が中心ですが、閉じた分類にコンサルティングを表す値がないため、人材育成・販売支援に最も近い human-resources を暫定としました。
