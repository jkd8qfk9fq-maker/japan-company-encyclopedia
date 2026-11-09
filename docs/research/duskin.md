# ダスキン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ダスキン |
| 証券コード | 4665 |
| docID（データを取り出した文書） | `S100YEAI` |
| 原本 docID | `S100YEAI` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEAI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ダスキン / 4665 / docID S100YEAI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
duskin: 10 件の数値を有報XBRLと照合
有報: 株式会社ダスキン 有価証券報告書－第64期(2025/04/01－2026/03/31) (docID S100YEAI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第61期(2022/04/01－2023/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第62期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第63期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
duskin: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空です。表示方法の変更（営業外費用の「支払補償費」の独立掲記に伴う前連結会計年度の組替え）は、売上高・純利益の範囲を変えるものではないため注記しません。
- businessModel: 前期の窓にある第61期～第63期の訂正有価証券報告書について、修正再表示チェックは重複年度の全行で一致しており、当期の5年間の数値に修正再表示はありません。
- businessModel: 指標の注記にある第62期の暫定的な会計処理の確定は第63期の事象で、当期の数値には影響しません。
- businessModel: 中期経営方針2028の数値目標は、将来の目標値であるため本文には書きませんでした。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項なし」です。
- businessStructure: セグメントの内訳について、訪販グループの「クリーンサービス事業」「ケアサービス事業」「その他」の3行の合計（110,641百万円）と報告セグメントの売上高（110,643百万円）には2百万円の差がありますが、有報の印字どおりに記載しています。
- businessStructure: 「その他」の区分の内訳の金額は有報に印字されていないため、金額を書いていません。
- history: 沿革の表は年月と事象が1行ずつ対応しており、崩れた表の対応づけは不要でした。
- history: 工場の開設や子会社の設立など、事業の理解に直接つながらない行は省きました。
- industry: フードグループは報告セグメントとして独立に開示されているため、2つ目の業界として food を付けました。
- industry: 主たる業界は訪販グループで決めましたが、清掃・衛生サービスを表す区分が閉じた分類にないため taxonomyGaps に記載しました。
- relatedCompanies: 結ばなかった候補: care-service — 「ケアサービス」は事業名の断片一致で、株式会社ケアサービスとの取引・提携の印字がありません。
- relatedCompanies: 結ばなかった候補: career — 「キャリア」は人材関連の文言の断片一致で、株式会社キャリアとの取引の印字がありません。
- relatedCompanies: 結ばなかった候補: rent — 「レントオール事業」の断片一致で、株式会社レントとの取引の印字がありません。
- relatedCompanies: 結ばなかった候補: base-4481 — 「全社ベース」の断片一致です。
- relatedCompanies: 結ばなかった候補: port — 「ポートフォリオ」の断片一致です。
- relatedCompanies: 結ばなかった候補: en — 「エンゲージメント」の断片一致です（ambiguous）。
- relatedCompanies: 結ばなかった候補: path — 「パーパス」の断片一致です（ambiguous）。
- relatedCompanies: 結ばなかった候補: vision — 「ビジョン」の断片一致です。
- relatedCompanies: 結ばなかった候補: fisco — 断片一致で、株式会社フィスコとの取引の印字がありません。
- relatedCompanies: 結ばなかった候補: nix — 「ターミニックス」の断片一致です。
- relatedCompanies: 結ばなかった候補: king — 「ダスキングループ」の断片一致です。
- relatedCompanies: 結ばなかった候補: land — 断片一致で、株式会社ランドとの取引の印字がありません。
- relatedCompanies: 結ばなかった候補: seki — 「情報セキュリティ」の断片一致です（ambiguous）。
- relatedCompanies: 結ばなかった候補: fuji-8278 — 「(株)フジ」はミスタードーナツの重要な加盟店として印字されますが、正式名称の印字がなく、フジオフード（株）との区別がつかないため結びませんでした。
- relatedCompanies: 結ばなかった候補: sumitomo-mitsui-financial-group — 金融取引関係のみのため、銀行・金融機関のルールにより結びませんでした。
- relatedCompanies: 結ばなかった候補: sumitomo-mitsui-trust-group — 金融取引関係のみのため、銀行・金融機関のルールにより結びませんでした。
- relatedCompanies: 結ばなかった候補: lion — 「ポン・デ・ライオン」のキャラクター名の断片一致です。
- relatedCompanies: 結ばなかった候補: nissin — 断片一致です（ambiguous）。
- relatedCompanies: 結ばなかった候補: ray — 断片一致です（ambiguous）。
- relatedCompanies: 結ばなかった候補: rion — 大阪・関西万博の文脈の断片一致です。
- relatedCompanies: 結ばなかった候補: slogan — 「新スローガン」の断片一致です。
- relatedCompanies: 結ばなかった候補: suzuki-6785 — 創業者・鈴木清一の姓の断片一致です（ambiguous）。
- relatedCompanies: 結ばなかった候補: space — 「クリーンスペース」の断片一致です。
- relatedCompanies: 結ばなかった候補: step — 「ステップアップ」の断片一致です。
- relatedCompanies: 結ばなかった候補: will — 「プライムウィル」の断片一致です。
- relatedCompanies: 結ばなかった候補: itsumo — ミスタードーナツのスローガン「いつも」の断片一致です。
- relatedCompanies: 結ばなかった候補: united — 「ユナイテッドレントオール事業」の断片一致です。
- relatedCompanies: 結ばなかった候補: aeon-mall — 掲載企業のコードリストになく、当期は株式交換により保有株式がなくなったため結びませんでした。
- relatedCompanies: 結ばなかった候補: aeon-delight — 掲載企業のコードリストになく、当期に全株式を売却したため結びませんでした。
- relatedCompanies: 結ばなかった候補: クラシアン — 業務提携基本契約の印字はありますが、掲載企業リストにない（非上場）ため結びませんでした。
- relatedCompanies: 結ばなかった候補: ナッシュ — 資本業務提携契約の印字はありますが、掲載企業リストにない（非上場）ため結びませんでした。
- relatedCompanies: 結ばなかった候補: 統一超商股份有限公司 — 台湾の合弁相手ですが、掲載企業リストにないため結びませんでした。
- relatedCompanies: 結ばなかった候補: 日本マスタートラスト信託銀行・日本カストディ銀行 — 信託口の大株主のため結びませんでした。
- relatedCompanies: 結ばなかった候補: ダスキン働きさん持株会・学校法人雑創の森学園・ダスキンFC加盟店持株会 — 大株主ですが事業会社でない、または非上場のため結びませんでした。
- relatedCompanies: 結ばなかった候補: 三井住友銀行 — 大株主ですが金融機関のため結びませんでした。
- terms: 助言: 「ダストコントロール」は用語集の登録候補になります。水を使わずにほこりを吸着する清掃用品のことで、同社の訪販グループの主力商品です。
- terms: 助言: 「全国チェーン店お客様売上」は用語集の登録候補になります。直営店・子会社と加盟店の推定売上を合計した同社独自の指標で、2026年3月期は466,795百万円でした。
- terms: 助言: 「ケース付きモップクリーナー」は用語集の登録候補になります。モップクリーナーとモップケースが1つになった同社の新商品で、2025年2月から発売しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ダスキンの主たる業界 → 提案: サービス業。東証の業種分類ではサービス業に属し、閉じた分類にサービス業の区分がありません。売上高の約57％を占める訪販グループは清掃用品のレンタルと役務提供が中心のため、小売は暫定とします。
