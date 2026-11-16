# 文溪堂 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社文溪堂 |
| 証券コード | 9471 |
| docID（データを取り出した文書） | `S100YCYT` |
| 原本 docID | `S100YCYT` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCYT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社文溪堂 / 9471 / docID S100YCYT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bunkeido: 10 件の数値を有報XBRLと照合
有報: 株式会社文溪堂 有価証券報告書－第73期(2025/04/01－2026/03/31) (docID S100YCYT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
bunkeido: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営方針に記載された数値目標（グループ全体の売上高135億円、売上高経常利益率8％）は利益指標を含む投資指標の目標であるため、本文にも戦略にも書かず、存在のみをここに記録しました。
- businessModel: 経営指標の注記は、潜在株式が存在しないため希薄化後の1株当たり指標を記載していないことと、従業員数の臨時雇用者の外書きの2件で、いずれも表示事項のため financialNotes には入れませんでした。
- businessModel: セグメント利益や営業利益・経常利益などの利益指標の金額・増減理由は本文に書いていません。
- businessModel: 配当政策（単体の当期純利益の40％相当額を目処とする方針）は資本政策のため、本文にも戦略にも書いていません。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」でした。
- businessStructure: 連結子会社は株式会社学宝社（出版）と株式会社ロビン企画（教具）の2社で、いずれも当社の子会社であるため関連企業には含めていません。
- businessStructure: 非連結子会社は有限会社ブンケイ商事（休眠会社）と、2026年1月に買収した株式会社オフィスタンデムの2社です。
- businessStructure: 出版物の製作は外部の印刷会社へ委託しており（経営成績等の分析の記載）、個別の委託先名は事業の内容には印字されていないため、供給者は事業構造には書いていません。
- history: 沿革表のうち、営業所・支店の設置・移転、物流センターや編集センターの設置、本社の移転、株式会社ぶんけい出版・株式会社青樹社の設立・買収・清算、有限会社ブンケイ商事の買収・休眠化、株式会社ロビン企画の設立・移転などの項目は、主要な事業の転機ではないため沿革には含めず、この記録に列挙しました。
- history: 1953年の設立時の資本金額は、沿革に金額を書かない規則により記載していません。
- history: 1900年の創業と1933年の「夏休みの友」の発行は、沿革の前文に記載された事実です。
- industry: 主たる業界は、売上高の69.1％を占める出版（教育図書等の出版物の製造販売）に最も近い media としました。出版はメディア産業の一部であり、直接適合として扱いました。
- industry: 教具（裁縫セット・家庭科布教材等の製造販売）は出版と一体の教育向け事業であり、独立した業界は付けませんでした。
- relatedCompanies: the-ogaki-kyoritsu-bank: 特定投資株式の保有目的は「財務・経理に係る業務の円滑な推進」のためであり、資金調達関係に当たるため結びませんでした。大株主（4.92％）でもありますが、金融機関の保有として結びませんでした。
- relatedCompanies: juroku-financial-group / sumitomo-mitsui-financial-group: 保有目的は大垣共立銀行と同じ財務・経理業務に関するもので、金融機関のため結びませんでした。
- relatedCompanies: mitsubishi-ufj-financial-group / mizuho-financial-group / nomura-holdings / oji-holdings / nippon-paper-industries: いずれも2024年3月期に保有目的を純投資目的へ変更済みの銘柄で、現在の運営上の取引関係の記載がないため結びませんでした。
- relatedCompanies: step / zero / base-4481 / port / vision: いずれも一般語・部分一致（「5ステップアプローチ」「排出量ゼロ」「営業利益ベース」「事業ポートフォリオ」「ビジョン」）であり、各社との関係の記載はないため結びませんでした。
- relatedCompanies: 株式会社学宝社・株式会社ロビン企画は当社の連結子会社、有限会社ブンケイ商事・株式会社オフィスタンデムは非連結子会社であり、当社自身の子会社は関連企業に含めていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
