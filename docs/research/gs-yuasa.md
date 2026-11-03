# ジーエス・ユアサ コーポレーション — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　ジーエス・ユアサ　コーポレーション |
| 証券コード | 6674 |
| docID（データを取り出した文書） | `S100YH71` |
| 原本 docID | `S100YH71` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH71.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　ジーエス・ユアサ　コーポレーション / 6674 / docID S100YH71（id は英語表記「GS Yuasa Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gs-yuasa: 10 件の数値を有報XBRLと照合
有報: 株式会社　ジーエス・ユアサ　コーポレーション 有価証券報告書－第22期(2025/04/01－2026/03/31) (docID S100YH71)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
gs-yuasa: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社 ジーエス・ユアサ コーポレーション」が EDINET の提出者名「株式会社　ジーエス・ユアサ　コーポレーション」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益・研究開発費などは本文に書いていない（規則）。
- businessModel: 地域別売上は【関連情報】の顧客所在地基準の金額で、報告セグメントの金額とは別物。
- businessModel: 受注の説明は『大型蓄電池及び大型電源装置等の一部を除き、主として見込生産』という有報の文言による。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高（自動車電池海外264,511／産業電池電源124,093／自動車電池国内108,006／車載用リチウムイオン電池89,928百万円）に従い、報告セグメントに含まれない「その他」（22,454百万円）を最後に置いた。
- businessStructure: business.txt の事業系統図は図として読めないため、各社と区分の対応は表の文字列に印字されたものだけを使った。複数区分が連記された行は特定の事業に結びつけていない。
- businessStructure: 顧客名は有報に開示がない（10％以上の販売先なし）ため、customers は一般的な区分名にとどめた。
- businessStructure: Inci GS Yuasa Aku Sanayi ve Ticaret Anonim Sirketi は2026年6月17日付で持分を譲渡し連結除外となった旨が有報にある。事業の説明には入れていない。
- history: 沿革の表は年月と事象が文に連なって印字されており、年月ごとの事象を読み取って採った。資本金や社債の発行、小さな連結範囲の変更は多くを省いた。
- history: 2009年の増資、2010年・2013年の出資比率の変更、2012年のリチウムエナジー ジャパン第一工場棟、2024年のリチウムエナジー ジャパンの事業譲受・清算などは省いた。
- industry: 電池・電源装置の製造が事業の中心だが、閉じた分類に「電池」がないため最も近い electronics（電機）を主たる業界にした。自動車電池と車載用リチウムイオン電池が売上の大半を占める報告セグメントなので automotive を2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックに存在せず、掲載済みの上場企業と同一性を確かめられる相手がないため、関連企業は結ばなかった。
- relatedCompanies: 本田技研工業㈱は合弁（㈱ブルーエナジー、㈱Honda・GS Yuasa EV Battery R&D）の相手として有報に出てくるが、候補リストにないため同一性の根拠が得られず結ばなかった。
- relatedCompanies: 子会社・関連会社はいずれも有報提出会社でなく掲載対象外。
- terms: 用語の追加提案（助言のみ）：鉛蓄電池、リチウムイオン電池、BEV（電気自動車）、持分法適用関連会社、報告セグメント。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ジーエス・ユアサ コーポレーションの主たる業界 → 提案: 電池・蓄電。鉛蓄電池・リチウムイオン電池・電源装置の製造が事業の中心で、既存の区分では電機が最も近いが正確ではない。
