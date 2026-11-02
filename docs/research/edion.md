# エディオン — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エディオン |
| 証券コード | 2730 |
| docID（データを取り出した文書） | `S100YDWB` |
| 原本 docID | `S100YDWB` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDWB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エディオン / 2730 / docID S100YDWB（id は英語表記「EDION Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
edion: 10 件の数値を有報XBRLと照合
有報: 株式会社エディオン 有価証券報告書－第25期(2025/04/01－2026/03/31) (docID S100YDWB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
edion: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから2026年3月期。金額はMD&Aの印字（億円表記、または百万円表記の商品分類別売上）のままです。
- businessModel: revenueSources の3区分は、MD&Aの商品分類別連結売上高の小計（家電388,940・情報家電229,528・その他175,278百万円）です。報告セグメントの金額ではありません。
- businessModel: 利益のステップは当期純利益だけを書きました。営業利益・経常利益はMD&Aに印字がありますが、本文の規則により書いていません。前期の当期純利益14,118百万円はbriefの5年表の値（円の印字14,118,000,000）です。
- businessModel: 従業員数9,148人は連結の従業員数（5年表、2026年3月31日現在）です。
- businessModel: 説明文のリンクは連結子会社の用語1か所だけです。
- businessStructure: 決算期は表紙のDEI（当事業年度終了日 2026-03-31）から「2026年3月期」としました。
- businessStructure: 事業セグメントは「家庭電化商品等の販売」と「その他の事業」ですが、その他の割合が僅少のため有報がセグメント情報の記載を省略しており、外部顧客への売上高は区分ごとに開示されていません。並びは事業の内容の記載順に従い、金額が無い旨を両方の説明に書きました。製品・サービスごとの情報も、単一区分が90％を超えるとして省略されています。
- businessStructure: children は【事業の内容】の販売チャネル4つ（直営店・携帯電話専門店・通信販売・フランチャイズ店）です。金額は独立して開示されていないため書いていません。
- businessStructure: 店舗数は【事業の内容】（直営422＋非家電1、携帯電話専門店30、FC727）とMD&A（FC含め1,180店舗）の印字です。両者の合計関係は有報が説明していないため、足し合わせた数字は書いていません。
- businessStructure: 関係会社の状況の注5：2026年4月1日付で株式会社PTNが当社に吸収合併されています（【事業の内容】は連結子会社12社にPTNを含めて書いています）。history に書きました。
- history: 沿革は年月が事象文と対応した表で、崩れはありませんでした。2007年6月（サンキュー40％取得）、2018年3月・2019年9月（ｅ-ロジ）、2018年6月（福徳）、2023年10月（ｅ-ロジの合併）は、関連する年の項目に統合して書きました。
- history: 2026年の項目の経営統合は、事業年度末後の後発事象と有報の別の節（重要な契約等）の記載に基づきます。株式移転の効力発生日などの予定は完了と書かず、予定と明記しました。needsReview に記載しました。
- industry: 家庭用電化製品等の販売を主な事業とする家電量販店のため retail のみです。その他の事業（住宅リフォーム、運送、リユース、プログラミング教室など）は割合が僅少でセグメント情報が省略されており、金額が開示されていないため、業界を足していません。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みで上場の相手を機械で確かめられないため、1社も結んでいません。
- relatedCompanies: ヤマダホールディングス：経営統合の基本合意書を2026年6月5日に締結した協議の相手。統合は未確定で、関係の種類に経営統合に当たる値がなく、資本関係・取引関係の印字もないため結びません。history の出来事として書きました。
- relatedCompanies: 株式会社サンフレッチェ広島などの連結子会社：上場していない相手のため結びません。
- relatedCompanies: クレジットカード会社（オリエントコーポレーションなど）：【重要な契約等】の加盟店契約の相手ですが、候補ファイルが無く同一性を確認できず、向きも印字されていないため結びません。
- terms: terms は助言のみの工程です。既存の用語 consolidated-subsidiary を businessModel.description に1か所使いました。
- terms: 用語の候補（リンクしていません）：フランチャイズ（フランチャイズ店727店舗への商品供給）、プライベートブランド（e angle）、共同株式移転（ヤマダホールディングスとの統合の基本方針）、吸収合併。

## 要確認（status に反映）

- history: ヤマダホールディングスとの経営統合は2026年6月5日に基本合意書を締結した段階で、最終契約・株式移転計画は未締結です（2027年5月〜6月に最終契約の予定、2027年10月1日に株式移転の効力発生の予定）。提出後に進展している可能性があるため、history の2026年の項目は人が確認してください。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
