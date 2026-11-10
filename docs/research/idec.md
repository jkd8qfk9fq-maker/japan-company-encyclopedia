# ＩＤＥＣ — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＩＤＥＣ株式会社 |
| 証券コード | 6652 |
| docID（データを取り出した文書） | `S100YEDS` |
| 原本 docID | `S100YEDS` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEDS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＩＤＥＣ株式会社 / 6652 / docID S100YEDS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 28 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
idec: 10 件の数値を有報XBRLと照合
有報: ＩＤＥＣ株式会社 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YEDS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
idec: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「IDEC株式会社」が EDINET の提出者名「ＩＤＥＣ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: businessModel.suppliers は省きました。有報は調達について一般名詞の区分を書いておらず、サステナビリティの文脈の「サプライヤー」への言及だけのためです。
- businessModel: 前期（2025年3月期）にIDECシステムズ&コントロールズ株式会社を売却したため、製品及びサービスごとの情報の「その他」は2026年3月期から廃止されています。前期に完了し前期の構成に反映された事項のため、warnings にとどめました。
- businessModel: 証拠パックの「財務諸表の組替え」の注意は、抽出された注記本文からは該当箇所を特定できず、前期有報との修正再表示チェックは6系列×4行すべて一致したため、5年間の経営指標への影響はないと判断し、warnings にとどめました（financialNotes は空）。
- businessModel: 中期経営計画の目標指標（収益性の比率など）は比率のため本文に書かず、方針の要約だけを perspectives に書きました。
- businessModel: セグメントの売上高はセグメント注記の外部顧客への売上高を使いました。MD&Aのセグメント別売上高も同じ外部売上高の印字です。地域ごとの情報（顧客の所在地別）は報告セグメントとは配分が違うため、industryPosition でのみ使いました。
- businessModel: Wikipediaの記事「IDEC」はありましたが、冒頭の記述は有報の記載と重なる内容だけで、有報にない補足（旧社名・ブランド名など）は得られなかったため、出典に加えていません。
- businessStructure: 報告セグメントは製造・販売体制を基礎とした地域別（日本、米州、EMEA、アジア・パシフィック）のため、事業は地域別セグメントの外部顧客への売上高の大きい順に並べ、製品種類別の事業（HMI事業など）を各地域の子区分にしました。製品種類別の金額はグループ全体でしか開示されていないため、子区分には金額を書いていません。
- businessStructure: EMEAの子区分は、事業の内容の表でEMEAの会社が明示されているHMI事業だけにしました（APEM SASほか8社）。
- history: 沿革の表は年月セルと事象文が分かれて印字される崩れた表ですが、年月34件と事象34件で数が一致するため、行順に対応づけて読みました。
- history: 落とした行と理由: 福崎・滝野・尼崎の各事業所の操業開始、竜野物流センターの完成（拠点の新設で、事業内容の転機ではないため）、国内・海外の販売子会社や製造子会社の設立のうち個別のもの（台湾和泉電気、香港、シンガポール、蘇州、上海の各会社など。海外展開の流れは1975年と1983年の行で代表させました）、株式会社ウェルキャット・株式会社東京センサの株式取得とIDECセールスサポート株式会社の設立（小規模な取得・設立で、製品分野の転機ではないため）、IDECファクトリーソリューションズ株式会社の事業譲受（既存の子会社の事業取得のため）。
- history: 沿革に資本金の金額は印字されておらず、書いていません。
- industry: 報告セグメントは地域別のため業界は製品で判断しました。製品は制御用操作スイッチ、プログラマブルコントローラ、安全関連機器など制御機器に統一されており、東京証券取引所の業種も電気機器のため、主たる業界は electronics のみにしました。
- relatedCompanies: 結んだ関連企業はありません。有報が取引・提携・資本関係を述べる上場の相手がいなかったためです。
- relatedCompanies: 候補 en（エン株式会社）: 本文の一致は「サプライヤーエンゲージメント」などの一般語で、同社への言及ではありません。
- relatedCompanies: 候補 base-4481（ベース株式会社）: 一致は「グローバルベース」などの一般語です。
- relatedCompanies: 候補 rent（株式会社レント）: 一致は「コンカレント開発」などの一般語です。
- relatedCompanies: 候補 port（ポート株式会社）: 一致は「サポート」などの一般語の部分一致です。
- relatedCompanies: 候補 innovation（株式会社イノベーション）: 一致は「イノベーション」という一般語です。
- relatedCompanies: 候補 core（株式会社コア）: 一致は「コア・コンピタンス」という一般語で、あいまいな一致です。
- relatedCompanies: 候補 career（株式会社キャリア）: 一致は「キャリア」という一般語です。
- relatedCompanies: 候補 step（株式会社ステップ）: 一致は「ステップ」という一般語です。
- relatedCompanies: 候補 zero（株式会社ゼロ）: 一致は「残存価額をゼロ」という会計処理の記述で、あいまいな一致です。
- relatedCompanies: 候補 daiwa（株式会社大和）: 一致は大量保有報告書における大和アセットマネジメントへの言及で、資産運用会社の保有であり取引・提携の記載はありません。あいまいな一致です。
- relatedCompanies: 候補 itsumo（株式会社いつも）: 一致はビジョンの文中の「いつも」という一般語です。
- relatedCompanies: 候補 land（株式会社ランド）: 一致は「ブランド」という一般語の部分一致です。
- relatedCompanies: 候補 path（パス株式会社）: 一致は「パーパス」という一般語で、あいまいな一致です。
- relatedCompanies: 候補 seki（セキ株式会社）: 一致は「情報セキュリティ」などの一般語の部分一致で、あいまいな一致です。
- relatedCompanies: 候補 vision（株式会社ビジョン）: 一致は「ビジョン」という一般語です。
- relatedCompanies: 候補 cota（コタ株式会社）: 一致は「インコタームズ」という貿易用語の部分一致で、あいまいな一致です。
- relatedCompanies: 候補 hyojito（表示灯株式会社）: 一致は製品名「表示灯」で、同社への言及ではありません。
- relatedCompanies: 候補 nissin（株式会社日新）: コードリストにない相手で、一致は新株予約権の記載中の部分一致です。
- relatedCompanies: 候補 rix（リックス株式会社）: 一致は「マトリックス」という一般語の部分一致です。
- relatedCompanies: 候補 space（株式会社スペース）: 一致は「省スペース」という一般語です。
- relatedCompanies: 候補 the-lead（株式会社リード）: 一致は「リードタイム」という一般語です。
- relatedCompanies: 候補 ishin（イシン株式会社）: 一致は文章中の部分一致で、同社への言及ではありません。
- relatedCompanies: 候補 freee（フリー株式会社）: 一致は「フリート管理システム」という一般語です。
- relatedCompanies: 候補 idea-consultants（いであ株式会社）: 一致は経営方針の文章中の部分一致で、同社への言及ではありません。
- relatedCompanies: 候補 trust（株式会社トラスト）: 一致は日本マスタートラスト信託銀行（信託口）の信託口表記で、コードリストにない相手です。
- relatedCompanies: 当社グループの連結子会社26社と持分法適用関連会社1社（佐用・IDEC有限責任事業組合）は自社グループの会社のため、関連企業には結んでいません。
- relatedCompanies: 特定投資株式は非上場株式のみ（19銘柄）で、上場銘柄の保有は印字されていません。大株主も信託口や資産運用会社が中心で、事業会社の主要株主は印字されていません。
- terms: 助言: 用語『HMI』は Human Machine Interface（人と機械が触れ合う環境）の略で、有報の経営成績等の分析に定義が印字されています。本文では製品の具体名（制御用操作スイッチ、表示灯、プログラマブル表示器）を併記しました。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、米国カリフォルニア州サニーベールの旧本社社屋の土地・建物を、2026年5月11日に譲渡しました。譲渡先は、当社と資本関係・人的関係・取引関係のない第三者です。登録は2026年3月31日現在の構成に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
