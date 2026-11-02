# マキタ — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社マキタ |
| 証券コード | 6586 |
| docID（データを取り出した文書） | `S100YH4M` |
| 原本 docID | `S100YH4M` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH4M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社マキタ / 6586 / docID S100YH4M（id は英語表記「Makita Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
makita: 10 件の数値を有報XBRLと照合
有報: 株式会社マキタ 有価証券報告書－第114期(2025/04/01－2026/03/31) (docID S100YH4M)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
makita: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: wikipedia.json は有報と同じ内容（総合電動工具メーカー）だけで補足になる事実が無かったため、使っていません。
- businessModel: 営業利益・税引前利益などは本文に書いていません。profit 段は当期純利益だけです。
- businessModel: 「強み」「業界No.1」は会社自身の説明の要約です（disclosed）。analysis は書いていません。
- businessModel: 事業系統図は画像で本文に含まれず、図からしか分からない取引の流れは書いていません。
- businessStructure: 有報は「単一事業分野」「事業の種類別セグメントに関連付けた説明は記載しない」と書くため、事業は1つにし、【関連情報】の製品区分3つを売上収益の大きい順（409,912 > 190,058 > 177,630）に children にしました。報告セグメントは地域別（日本・欧州・北米・アジア）で事業ではないため children にしていません。
- businessStructure: 外部顧客への売上収益の地域別（欧州393,338が最大）は報告セグメント注記の印字で、顧客所在地基準の地域情報（欧州390,110）とは基準が異なります。親の説明では報告セグメントの値だけを使いました。
- businessStructure: 事業系統図は画像で本文に含まれず、図からしか分からない関係は書いていません。
- businessStructure: listings: 表紙が東京証券取引所プライム市場と名古屋証券取引所プレミア市場を印字しているため市場区分まで記載しました。
- history: 沿革の表は年月・摘要が整った形で読め、崩れはありませんでした。多数の海外現地法人の設立は代表例だけを取り上げ、残りは省きました。
- history: significance の「現在も〜」は【関係会社の状況】【主要な設備の状況】で確認した現況に基づきます。
- industry: 電動工具・園芸用機器・エア工具の製造販売が単一の事業分野のため、機械(machinery)を主たる業界にしました。他の業界は付けていません。
- relatedCompanies: 豊田通商: 政策保有株式の保有目的に「海外販売における取引先及び調達先」とあるだけで、取引の内容・向きの説明が無く、取引関係の根拠として不足のため結びません。
- relatedCompanies: 村田製作所: 保有目的が「調達先としての関係の維持、強化」の定型句だけで、取引の具体的な記述が無いため結びません。
- relatedCompanies: シャープ: 保有目的が「調達先」の定型句だけのため結びません。
- relatedCompanies: スズキ: 保有目的が「販売先」の定型句だけのため結びません。
- relatedCompanies: アイダエンジニアリング・ダイヘン・旭化学工業・バンドー化学・ダイナパック・フタバ産業・黒田精工・マブチモーター・中日本鋳工・日本トムソン・ノリタケ・オークマ・新東工業・帝国通信工業・天龍製鋸: 保有株式の表の「調達先」の定型句だけで、取引の説明が無いため結びません。
- relatedCompanies: 東邦瓦斯・リンナイ・山洋電気・矢作建設工業・ジュンテンドー・コムシスホールディングス・御園座・住友不動産: 保有株式の表の「販売先」等の定型句だけのため結びません。丸山製作所・トーエネック・セイノーホールディングス: 販売先・調達先・物流面の取引先との定型句だけのため結びません。
- relatedCompanies: 三菱UFJフィナンシャル・グループ・三井住友フィナンシャルグループ・あいちフィナンシャルグループ・りそなホールディングス・三井住友トラストグループ・東海東京フィナンシャル・ホールディングス: 主要取引銀行・金融取引が理由のため結びません。
- relatedCompanies: 東京建物: 2005年に城山開発の経営権を譲渡した過去1回限りの取引のため結びません。兼松: 2006年の自動釘打機事業の譲受は過去1回限りで、相手は兼松日産農林で候補と同一か不明（ambiguous）のため結びません。
- relatedCompanies: ランド・キャリア・イオン・ステップ・マニー・ポート・ゼロ・ベース・セキ・トルク・コロナ・カバー・フリー・アイル・リード・レイ・No.1・リコー: 有報の一般語・通貨名・人名等の部分一致で、その会社についての記述ではないため結びません。
- terms: 用語の追加提案: 「IFRS」（売上収益・親会社の所有者に帰属する当期利益という表示の違いの説明に使える）。既存の用語があればそれを使えば足ります。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
