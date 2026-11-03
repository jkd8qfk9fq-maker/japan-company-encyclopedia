# 日清オイリオグループ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日清オイリオグループ株式会社 |
| 証券コード | 2602 |
| docID（データを取り出した文書） | `S100YB17` |
| 原本 docID | `S100YB17` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YB17.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日清オイリオグループ株式会社 / 2602 / docID S100YB17（id は英語表記「The Nisshin OilliO Group,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-nisshin-oillio-group: 10 件の数値を有報XBRLと照合
有報: 日清オイリオグループ株式会社 有価証券報告書－第154期(2025/04/01－2026/03/31) (docID S100YB17)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-nisshin-oillio-group: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: customers は有報の用途説明（業務用・加工用・ホームユース、チョコレート用油脂、化粧品原料）から一般化した。取引先名・割合は有報の範囲で確認できないため書いていない。
- businessModel: 利益の流れの段は、方針により営業利益・経常利益・セグメント利益を書かず、当期純利益と有報の固定資産譲渡益の事実（金額なし）だけにした。
- businessModel: ROE・ROIC などの経営指標は方針により書いていない。
- businessStructure: 決算期は表紙DEIから2026年3月期（自2025年4月1日至2026年3月31日）。訂正なし（amendments status none）。上場は表紙の東京証券取引所プライム市場。
- businessStructure: 並び順はセグメント注記の外部顧客への売上高（百万円）：油脂・油糧および加工食品・素材389,586＞グローバル油脂・加工油脂138,848＞ファインケミカル15,509。『その他』10,307は報告セグメントに含まれない事業セグメントなので金額に関わらず最後。油脂・油糧311,544と加工食品・素材78,042は同一報告セグメントの内訳なので children にした。
- businessStructure: 2025年度から報告セグメントを『油脂・加工食品・ファインケミカル』から現区分に変更。前期の数字は有報が新区分に組み替えて印字している。
- businessStructure: セグメント利益は金額・増減・理由とも書いていない（方針）。顧客の10%以上の相手先の有無は確認していない。
- history: 沿革表は崩れておらず、年月と事象が対応している。約70行のうち主要な13件を選び、支店の開設・廃止、認証取得などは省いた。
- history: 2025年度の中期経営計画の開始時期は、経営方針の節（2025年度～2028年度）による。
- industry: primary は food。食用油・加工油脂・ミール・加工食品を扱う2つの報告セグメント（外部顧客への売上高 389,586百万円と138,848百万円）が売上の大半を占める。
- industry: chemicals を付けた根拠：ファインケミカル事業（化粧品・トイレタリー原料、化学品、植物性工業油）が報告セグメントとして独立開示されている（15,509百万円）。
- industry: 半導体は付けていない。有報に半導体向けの部材・装置の事業の開示がない。
- relatedCompanies: related-candidates.json が証拠パックに無かったため、同一性は有報の印字の社名と掲載済みエントリー（marubeni・pietro・wakou-shokuhin・j-oil-mills）の存在で判断した。上場区分は機械照合していない。
- relatedCompanies: 丸紅・ピエトロ・和弘食品は【関係会社の状況】の区分どおり。ピエトロと和弘食品は有報提出会社と印字されている。
- relatedCompanies: J-オイルミルズは【関係会社の状況】に載らず、有報では沿革の合弁設立の記述だけで結んだ。資本関係は日清オイリオ側にはなく、合弁会社を通じた提携なので business-partner とした。不要なら外してよい。
- relatedCompanies: 製油パートナーズジャパン㈱・幸商事㈱・中糧日清(大連)有限公司・統清股フン有限公司など、掲載済みか未確認の他の関連会社は、related-candidates が無く上場確認ができないため結ばなかった。
- terms: 助言のみ。説明に使うなら、ミール（油を搾った後の大豆・菜種のかす）、MCT（中鎖脂肪酸）、加工油脂（マーガリン・ショートニング・チョコレート用油脂）、持分法適用関連会社の用語があると読者に伝わりやすい。定義は有報にないため、登録時に別途確認が必要。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
