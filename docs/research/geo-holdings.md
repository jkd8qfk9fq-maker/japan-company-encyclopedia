# ゲオホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ゲオホールディングス |
| 証券コード | 2681 |
| docID（データを取り出した文書） | `S100YJMA` |
| 原本 docID | `S100YJMA` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJMA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ゲオホールディングス / 2681 / docID S100YJMA（id は英語表記「GEO HOLDINGS CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
geo-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ゲオホールディングス 有価証券報告書－第38期(2025/04/01－2026/03/31) (docID S100YJMA)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"NumberOfEmployees|2025-03-31","previousFiling":6512,"latestFiling":6681}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
geo-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 店舗数は MD&A の店舗数表から。2nd STREET 海外は米国55・台湾50・マレーシア30・タイ9・シンガポール2・香港2の合計148店（合計から算出）。
- businessModel: 商材別の売上高は【販売実績】の印字値。単一セグメントのため事業別の売上高は無い。
- businessModel: 営業利益・経常利益・負ののれん発生益・減損損失の金額は規則により書いていない。
- businessStructure: 報告セグメントは「小売サービス事業」の単一で、事業別の売上高は開示されていない。businesses は【事業の内容】のグループ構成（セカンドストリート・ゲオ・ラグジュアリー・その他）を有報の並び順で置き、金額は書いていない。
- businessStructure: ラグジュアリー事業の説明は、【事業の内容】の事業会社名と MD&A の店舗数表（OKURA TOKYO）に基づく。商材の細目は印字がなく products は総称にとどめた。
- businessStructure: Wikipedia は証拠パックに無く使っていない。
- history: 【沿革】の表は年月セルが連続して崩れている箇所がある（2011年11月/2013年4月、2018年1月/6月、2020年8月/9月、2022年4月〜2026年1月）。年月7個（2022年4月・2023年12月・2025年4月・2025年4月・2025年5月・2025年11月・2026年1月）と事象7個が同数のため行順で対応づけた（プライム移行、タイ、シンガポール、1,000店舗、香港、セカイズ、合併の順）。セカイズ取得の2025年11月はMD&Aの『2025年11月28日付』で裏付けられる。他の行の月は崩れた表からの行順対応で、MD&Aでは裏付けていない。2011年11月/2013年4月も同様に2つの日付と2つの事象を対応づけ、2013年4月のものを使った。
- history: 省いた行: 1988年法人化、1992年テープ堂提携、1996年合併、1999年ブロックバスター取得、2000年ナスダックジャパン上場、2002〜2004年の民事再生支援による子会社化、2008年ぽすれん、2010年エイシス・ウェアハウス・11社吸収合併、2013年移転・ファミリーブック、2014年グラモラックス、2017年ワールドモバイル・チェルシー、2020年8月の合併、2023年12月タイ初出店、2026年1月の子会社合併（重要度の判断）。
- industry: 単一セグメント「小売サービス事業」で、リユース店舗・ゲーム販売・レンタルの店舗運営が中心のため小売とした。
- relatedCompanies: related-candidates.json が証拠パックに無く、候補が無いため結ばなかった。
- relatedCompanies: 【関係会社の状況】の連結子会社（ゲオ・ゲオストア・セカンドストリート・OKURA・viviON・エイシス・ワールドモバイル・海外子会社）はいずれも非上場で掲載済み企業でもないため結ばない。親会社・その他の関係会社の印字は無い。
- terms: 助言のみ。businessModel で [[term:consolidated-subsidiary|連結子会社]] を使用（既存の用語集にある前提）。新規に提案する用語は無い。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ゲオホールディングスの主たる事業（リユース・買取販売） → 提案: リユース（中古品販売）。中古品の買取販売が事業の中心で、小売で近似している。
