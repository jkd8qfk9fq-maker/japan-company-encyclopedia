# ＳＴＧ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＳＴＧ |
| 証券コード | 5858 |
| docID（データを取り出した文書） | `S100YL7C` |
| 原本 docID | `S100YL7C` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL7C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＳＴＧ / 5858 / docID S100YL7C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
stg: 10 件の数値を有報XBRLと照合
有報: 株式会社ＳＴＧ 有価証券報告書－第44期(2025/04/01－2026/03/31) (docID S100YL7C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
stg: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社STG」が EDINET の提出者名「株式会社ＳＴＧ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された営業利益・経常利益の金額と増減率は本文に書いていません（本文の財務数値は売上高と親会社株主に帰属する当期純利益だけです）。売上高の増減率（前期比6.1％増）と素材別の売上比率は印字どおりです。
- businessModel: 主要な経営指標等の推移の注記2（第40期及び第41期の潜在株式調整後１株当たり当期純利益はTOKYO PRO Marketでの平均株価を期中平均株価とみなして算定）は表示方法の注記として扱い、financialNotes には着地させていません。
- businessModel: 前期有報との修正再表示照合は全6系列で差異なし、訂正有報もありません。組替えの記載はありません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」で、提出後の予定事項はありません。2026年6月26日開催予定の定時株主総会での剰余金の配当の決議予定は、配当政策の範囲の事項として warnings にとどめました。
- businessModel: 2025年6月に株式会社日本政策投資銀行を引受先としてＡ種優先株式を発行していますが、資金調達の事項であり、候補一覧にもないため関連企業には結んでいません。本文の金額にも触れていません。
- businessModel: 中期経営計画の数値目標（計画終了時の連結売上高・連結営業利益、長期目標）は投資・経営指標の目標であるため、perspectives には金額を書いていません。受注高は書いていません。
- businessModel: Wikipedia は記事が見つからなかったため使用していません。
- businessStructure: 当社グループは金属部品鋳造及び加工事業の単一セグメントのため、事業は1つだけです。製品・サービスごとの情報は単一製品の外部顧客への売上高が90％を超えるため有報で省略されており、子区分は【事業の内容】に印字された素材別の売上比率（2026年3月期: アルミニウムダイカスト54％、マグネシウムダイカスト41％）で分けました。子区分ごとの金額は開示されていないため書いていません。
- businessStructure: 設備は、大阪本社・工場と静岡工場、本町オフィス（提出会社）、在外子会社の各工場で、単一セグメントのため事業への結びつけはしていません。帳簿価額は書いていません。
- businessStructure: このツリーの旧スキーマに従い suppliers は省略しています。金型製造や塗装などの工程の一部は外注していますが、個別の外注先名は印字されていません。
- businessStructure: 連結子会社は5社（三輝特殊技研(香港)有限公司、深圳市参輝精密五金有限公司、SANKI EASTERN (THAILAND) COMPANY LIMITED、STX PRECISION (JB) SDN. BHD.、E-CAST INDUSTRIES SDN. BHD.）で、いずれも当社グループの会社であるため関連企業には結んでいません。
- history: 沿革から落とした行: 1998年の湿式集塵機の開発、2000年・2003年・2014年のISO-9001認証取得、2004年のブラスト加工装置の開発、2004年・2010年の工場移転、2007年の株式会社サンケンの吸収合併、2011年の深圳市参輝精密五金有限公司の設立（2006年の中国進出の項目に含意）、2012年のタイ工場操業開始、2017年の「バレルック」ブラスト装置の実用新案登録です。いずれも事業の転機ではないため落としました。
- history: 1982年の設立行に印字された資本金の金額は、沿革に資本金を書かない規則により落としました。年月は有報の印字どおり年だけを記録しています（月は書いていません）。
- industry: 主たる業界は単一セグメントである金属部品鋳造及び加工事業で決め、製造業として最も近い machinery を暫定にしました。このツリーのゲートに合わせ、業界行は industryId キーで記録しています。DEIの別記事業はCTEです。
- relatedCompanies: AXIS COMMUNICATIONS AB、CBC株式会社、甲信工業株式会社は主要な顧客として印字されていますが、候補一覧（related-candidates.json）にないため結んでいません。
- relatedCompanies: the-kiyo-bank（株式会社紀陽銀行）: 特定投資株式として保有していますが、保有目的が「資金調達等の財務活動の安定化・円滑化及び金融情勢・規制情報収集のための関係強化」で金融取引が理由のため結んでいません。
- relatedCompanies: brass（株式会社ブラス）: 「ショットブラスト」の部分一致で、相手について述べた箇所はありません。
- relatedCompanies: career（株式会社キャリア）: 人事制度の文脈の「キャリア」という一般語の一致です。
- relatedCompanies: step（株式会社ステップ）: 収益認識の「5ステップアプローチ」という一般語の一致です。
- relatedCompanies: en（エン株式会社）: 「VE（バリューエンジニアリング）」の部分一致で、ambiguous の候補です。
- relatedCompanies: nissin（株式会社日新）: コードリストにない候補で、新株予約権の文脈の部分一致です（ambiguous）。
- relatedCompanies: suzuki-6785（株式会社鈴木）: 社外取締役の個人名「鈴木昭彦」との一致で、ambiguous の候補です。
- relatedCompanies: base-4481（ベース株式会社）: 「技術力をベースに」という一般語の部分一致です。
- relatedCompanies: vision（株式会社ビジョン）: 中期経営計画の「ビジョン」という語の一致です。
- relatedCompanies: zero（株式会社ゼロ）: 会計方針の「残存価額をゼロとする」という語の一致で、ambiguous の候補です。
- relatedCompanies: 大株主のうち候補に結べる事業会社はありません（創業者一族等の個人が中心）。【関係会社の状況】に載るのは連結子会社5社のみで、いずれも当社グループの会社のため結んでいません。
- terms: 用語の助言のみです。対象となりうる用語は「ダイカスト」「マグネシウム合金」「ショットブラスト」「化成処理」「ＶＥ（バリューエンジニアリング）」などですが、有報の本文と注記の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2025年４月１日付で普通株式１株につき２株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] stgの主たる業界（金属部品鋳造及び加工事業） → 提案: 金属部品鋳造・加工（ダイカスト）。単一セグメントの金属部品鋳造及び加工事業は、マグネシウム合金・アルミニウム合金のダイカスト部品の製造・加工ですが、閉じた分類に金属鋳造やダイカストを表す区分がなく、製造業として最も近い machinery を暫定としました。
