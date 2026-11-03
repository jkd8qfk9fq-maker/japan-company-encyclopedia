# 沖電気工業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 沖電気工業株式会社 |
| 証券コード | 6703 |
| docID（データを取り出した文書） | `S100YFGL` |
| 原本 docID | `S100YFGL` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFGL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 沖電気工業株式会社 / 6703 / docID S100YFGL（id は英語表記「Oki Electric Industry Company, Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
oki-electric-industry: 10 件の数値を有報XBRLと照合
有報: 沖電気工業株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YFGL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
oki-electric-industry: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 日立製作所とのATMを含む自動化機器事業の統合（効力発生日2026年10月1日または別途定める日）は提出後の予定のため、本文には書かず needsReview に記録した。
- businessModel: 営業利益・経常利益は規則により本文に書かない。
- businessStructure: 事業の並びは外部顧客への売上高の順（エンタープライズ150,573、パブリック139,711、コンポーネント68,155、EMS62,732百万円）。「その他」は報告セグメントに含まれない区分なので最後。
- businessStructure: 2026年度から3セグメント（パブリックソリューション／金融ソリューション／コンポーネント＆マニュファクチャリング）に再編する旨の注記があるが、当期は4セグメントのまま記載した。
- history: 沿革表の2006・2008・2010年の行は年月セルが連続して崩れていた。年3つ・月3つ・事象3つで数が同じなので行順に対応づけた（2006年6月 日沖商業設立、2008年10月 半導体事業譲渡、2010年6月 沖ウィンテック完全子会社化）。2021・2022年の行も同様（2021年4月 沖データ吸収合併、2022年4月 プライム移行）。
- history: 1881〜1927年の途中の組織変更（1907年合資会社沖商会など）、事業所の開設、海外拠点の設立は、重要度を考えて省いた。
- industry: 売上の大きいエンタープライズソリューション（ATMなど）とパブリックソリューションは電機・情報通信機器にあたるため electronics を主にした。半導体事業は2008年に譲渡済みで、半導体は付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性と上場の確認ができないため、誰も結ばなかった。
- relatedCompanies: 日立製作所: 自動化機器事業の統合契約は2026年3月26日に締結、効力発生日は2026年10月1日または別途定める日で、提出後の予定。完了は確認できないので結ばない。
- relatedCompanies: リコー・東芝テック: エトリア株式会社への事業統合の当事者だが、事業統合は沿革の出来事であり、関係の向き（取引・資本）が印字されていない。結ばない。
- relatedCompanies: キヤノン: プリンター等の特許クロスライセンス契約（技術提携）がある。契約の存続や現況を確認できる候補情報が無いので結ばない。
- relatedCompanies: サクサ・SOMPOホールディングス・みずほフィナンシャルグループ・東京建物・ヒューリック・安田倉庫・芙蓉総合リース・TPR: 政策保有株式の表に載る取引先で、取引の向きと範囲が株式表の保有目的の記載だけのため結ばない。
- relatedCompanies: みずほ銀行ほか金融機関: 資金調達・財務取引が理由のため結ばない。
- terms: 用語の助言: EMS（電子機器の設計・生産受託）、リカーリング型ビジネス（保守・運用など継続収入型）、ATM、PBX は読者に説明が要る語。

## 要確認（status に反映）

- businessModel: 日立製作所との自動化機器事業の統合契約（2026年3月26日締結、効力発生日は2026年10月1日または別途定める日）。提出後に実施済みかどうかを確認する必要がある。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
