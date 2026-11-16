# ヤプリ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ヤプリ |
| 証券コード | 4168 |
| docID（データを取り出した文書） | `S100XVB7` |
| 原本 docID | `S100XVB7` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVB7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ヤプリ / 4168 / docID S100XVB7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yappli: 2 件の数値を有報XBRLと照合
有報: 株式会社ヤプリ 有価証券報告書－第13期(2025/01/01－2025/12/31) (docID S100XVB7)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
yappli: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記2（従業員数は就業人員、臨時雇用者数は年間の平均人員を外数で記載）は表示事項のため、financialNotesには入れなかった。financialNotesには連結開始の注記1のみを入れた。
- businessModel: 前期有報（第12期、S100VIGX）との修正再表示チェックは、証拠パックでは当期から連結を作成したため連結指標の比較行が無く機械照合できなかった。有報の訂正フラグはすべてfalseで、訂正有報も無いことを確認した。
- businessModel: 2026年2月に提供を開始した「Yappli MiniApp」「Yappli MobileOrder」は期間後のプロダクトだが、有報の【事業の内容】に提供開始の事実が印字されているため記載した。構造の変更ではないためneedsReviewには入れなかった。
- businessModel: 重要な後発事象は譲渡制限付株式報酬制度の導入（2026年3月27日の株主総会で承認）のみで、資本政策に関する事項のため本文には記載しなかった。
- businessModel: 経営方針の客観的指標（契約アプリ数・月次解約率・アプリ当たりの平均月額利用料）は事業の指標としてのみ使い、金額としての平均月額利用料は本文に書かなかった。中期の数値目標は印字されていない。
- businessStructure: 収益認識注記の分解額（月額利用料4,942,916千円とその他1,113,209千円）の合計は6,056,125千円で、印字された売上高6,056,126千円と1千円異なる。印字の合計を正として本文に書き、内訳は切り捨て額で記載した。
- businessStructure: 本社（東京都港区）は【主要な設備の状況】でアプリ運営プラットフォーム事業の設備として印字されているため同事業に結びつけた。大阪支社・福岡支社は賃借物件としてのみ印字されている。国内子会社の設備は重要性が乏しいとして有報で記載が省略されている。設備の帳簿価額は記載していない。
- businessStructure: 株式会社ヤプリフードコネクトは2025年11月28日に株式会社チューズモンスターの株式の51.4％を取得して連結子会社化したもので、みなし取得日が2025年12月31日のため当期の連結業績には含まれていない。のれん等の金額は記載していない。
- businessStructure: 「Yappli MiniApp」「Yappli MobileOrder」は2026年2月に提供を開始した期間後のプロダクトで、有報の【事業の内容】に提供開始の事実が印字されているためプロダクトとして記載した。
- businessStructure: このツリーの旧スキーマに従い、suppliersキーは省略した。仕入先の個別名は【事業の内容】に印字されていない。
- history: 沿革のうち次は対象外として落とした: 本社移転（2014年六本木、2015年赤坂、2018年赤坂、2019年六本木グランドタワー）、大阪支社の開設（2018年）、福岡支社の開設（2019年）、SLUSH ASIAでの準優勝（2015年）、プライバシーマーク認証取得（2016年）、デロイト 日本テクノロジー Fast50での受賞（2018年）、Forbes JAPANの選出（2019年・2020年）、「Yappli」で制作されたアプリの累計ダウンロード数1億突破（2022年）・2億突破（2024年）。
- history: 設立時の資本金（5,000千円）は規則により記載していない。年月は有報の印字どおりだが、historyの形式に従い年のみを記録した。
- industry: 主たる業界は、単一セグメントのアプリ運営プラットフォーム事業がクラウド型ソフトウェアの提供であるためitとした。
- industry: human-resourcesは付けなかった。「UNITE by Yappli」は従業員向けアプリのソリューションで単一セグメントの一部であり、金額が独立して開示されていないためである。
- industry: mediaは付けなかった。アプリのプラットフォーム提供が中心で、メディア事業として独立開示された事業はないためである。
- industry: retailは付けなかった。小売・飲食などの企業は顧客であり、当社自身は小売事業を行っていないためである。
- relatedCompanies: fuller: 【関係会社の状況】に持分法適用関連会社として印字され、資本業務提携と相互のサービス利用が記載されているため結んだ。
- relatedCompanies: en: 「従業員エンゲージメント」等の一般語との一致（ambiguous）のため結ばなかった。
- relatedCompanies: nissin: 現在のコードリストになく、新株予約権の記載中の「日新」の一致のみで関係の記載がないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: base-4481: 「契約数ベース」の一般表現との一致のため結ばなかった。
- relatedCompanies: freee: 「フリーアドレス制」の一般表現との一致のため結ばなかった。
- relatedCompanies: port: 「レポート」の部分一致のため結ばなかった。
- relatedCompanies: the-lead: 「リード獲得」という営業用語の一般表現との一致のため結ばなかった。
- relatedCompanies: king: 「ランキング」の部分一致のため結ばなかった。
- relatedCompanies: land: 本店所在地の建物名「住友不動産六本木グランドタワー」の「グランド」の部分一致のため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development: 本店所在地（住友不動産六本木グランドタワー）としてのみ現れ、取引・提携の記載がないため結ばなかった。
- relatedCompanies: system-integrator: 競合環境の記述中の一般名詞「システムインテグレーター」としてのみ現れ、特定の会社との関係の記載がないため結ばなかった。
- relatedCompanies: core: 「コアソリューション」の一般表現との一致（ambiguous）のため結ばなかった。
- relatedCompanies: ficha: 「フィーチャーフォン」の部分一致のため結ばなかった。
- relatedCompanies: gmo-tech: 2019年に「GMOアップカプセル」事業を譲り受けた相手だが一回限りの過去の事業譲受であり、現在のコードリストにもないため結ばなかった。
- relatedCompanies: ray: 「リプレイス」の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: rent: 財務諸表中の「フリーレント賃料」という会計用語の部分一致のため結ばなかった。
- relatedCompanies: will: 「コンピューターウィルス」の部分一致のため結ばなかった。
- relatedCompanies: 株式会社ヤプリフードコネクトは当社の連結子会社であり関連企業リンクの対象ではない。【大株主の状況】に載るのは個人株主と証券会社・信託銀行等の金融機関のみで、事業会社の大株主で結べる相手はいない。外部顧客への売上高の10％以上を占める主要な顧客はない（【関連情報】）。
- terms: 助言: 「ノーコード」は有報の注記のとおりプログラミング不要を指します。「DXP（デジタルエクスペリエンスプラットフォーム）」はアプリ・ウェブ・LINEミニアプリ等のデジタル接点を包括的に支援するプラットフォームの構想で、有報の表記に沿って記述しました。「UNITE by Yappli」は従業員向け社内アプリのソリューション名、「Yappli WebX」「Yappli MiniApp」「Yappli MobileOrder」「Yappli CRM」はいずれも当社グループのプロダクト名です。「LINEミニアプリ」はLINE上で動作するアプリの仕組みを指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
