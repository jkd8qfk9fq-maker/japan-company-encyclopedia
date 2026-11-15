# メニコン — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社メニコン |
| 証券コード | 7780 |
| docID（データを取り出した文書） | `S100YIHS` |
| 原本 docID | `S100YIHS` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIHS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社メニコン / 7780 / docID S100YIHS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
menicon: 10 件の数値を有報XBRLと照合
有報: 株式会社メニコン 有価証券報告書－第69期(2025/04/01－2026/03/31) (docID S100YIHS)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":5621000000,"latestFiling":5597000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":9607000000,"latestFiling":9567000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":187282000000,"latestFiling":187590000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":86154000000,"latestFiling":86129000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
menicon: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes には、Oculusグループの企業結合に係る暫定的な会計処理の確定を記録した。修正再表示チェックで前期有報との差異があった2025年3月期の純利益は、この確定による見直し後の数値であることを有報の注記（【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】及び企業結合関係の注記）で確認した。
- businessModel: 本文にある財務諸表の組替えの記載については、証拠テキストの中で表示方法の変更にあたる具体的な注記は確認できず、上記の暫定的な会計処理の確定に伴う比較情報の見直しを指すものと判断した。
- businessModel: 中期経営計画「Vision2030」の数値目標（2028年3月期の連結売上高などのマイルストーン）は、本文の規則により perspectives には書いていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」で、提出後の予定事項も確認できなかった。
- businessStructure: 当社グループは、当社と連結子会社36社（他に非連結子会社3社）、持分法適用会社1社で構成されている（【事業の内容】）。
- businessStructure: ビジョンケア事業の children は、単一セグメントのため【セグメント情報】の【関連情報】にある製品及びサービスごとの区分（メルスプラン／コンタクトレンズ及びケア用品の製造販売）によった。2区分の合計108,205百万円は報告セグメントの外部顧客への売上高116,523百万円と一致しない（【関連情報】の「その他」17,398百万円にビジョンケア事業の一部が含まれるため）ので、その旨をここに記録する。
- businessStructure: ビジョンケア事業と「その他」の外部顧客への売上高の合計は125,604百万円で、連結売上高125,605百万円とは1百万円の差があるが、いずれも印字どおりに記載した。
- businessStructure: 板橋貿易株式会社と目立康（大連）医療科技有限公司は、【事業の内容】と【関係会社の状況】でビジョンケア事業と「その他」の両方にまたがって記載されているため、特定の事業だけに結びつけていない。
- businessStructure: 「その他」の区分は、セグメント注記ではヘルスケア・ライフケア事業を含む区分と注記されている。
- history: 沿革表は年月と事象が対で印字されており、崩れた表ではないため行順の対応づけは行っていない。
- history: 沿革表の全事象から主要な24件を選んで収録し、個別の製品発売などの細目は一部省略した。
- history: Wikipediaの記事冒頭は「国内最大手」という順位の表現が中心で、数値や順位は使えず、有報にない補足として使える固有の事実もなかったため、Wikipediaは使用しなかった。
- industry: 「その他」（2026年3月期の外部顧客への売上高9,081百万円）は、ヘルスケア・ライフケアや動物医療、食品関連など複合的で割合も小さいため、業界を足していない。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」は「ビジョンケア事業」の部分一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: nikon（株式会社ニコン）: 「ニコン」は「メニコン」の部分一致で、同社への言及はないため結ばなかった。
- relatedCompanies: alpha（株式会社アルファ、証券コード3434）・alpha-4760（株式会社アルファ、証券コード4760）: 沿革と【関係会社の状況】に載る「株式会社アルファコーポレーション」は当社の連結子会社であり、上場の株式会社アルファとは別会社のため結ばなかった。
- relatedCompanies: ricoh（株式会社リコー）: 「リコー」は「シリコーンハイドロゲル」の部分一致で、同社への言及はないため結ばなかった。
- relatedCompanies: ai（株式会社エーアイ）: 「エーアイ」は連結子会社「株式会社エーアイピー」の部分一致で、同社とは別会社のため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: コードリストになく、「日新」は新株予約権の行使期間などの一般的な記載の部分一致のため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: コードリストになく、「トラスト」は信託の一般語の部分一致のため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous の候補で、「セキ」は持続可能性に関する記載などの部分一致で、同社への言及はないため結ばなかった。
- relatedCompanies: core（株式会社コア）・en（エン株式会社）・daisui（株式会社大水）: ambiguous の候補で、いずれも一般語の部分一致のため結ばなかった。
- relatedCompanies: port（ポート株式会社）・land（株式会社ランド）・slogan（スローガン株式会社）・base-4481（ベース株式会社）・career（株式会社キャリア）・innovation（株式会社イノベーション）・lec（レック株式会社）・the-lead（株式会社リード）: いずれも一般語の部分一致で、同社について取引・提携・資本関係を述べる記載はないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group・mizuho-financial-group・resona-holdings・shizuoka-financial-group: 金融機関で、出現は資金調達や借入の文脈のみのため結ばなかった。
- relatedCompanies: 株式会社トヨトミ: 【大株主の状況】に2026年3月31日現在で5.30％を保有する大株主として載るが、非上場で related-candidates.json にも載っておらず、有報に取引関係を述べる記載も確認できないため結ばなかった。
- relatedCompanies: 【関係会社の状況】に載るのは連結子会社と持分法適用関連会社のみで、親会社やその他の関係会社にあたる上場企業はない。
- terms: 助言: 用語「オルソケラトロジー」（就寝時に特殊なコンタクトレンズを装用して角膜の形状を矯正し、日中は裸眼で過ごせるようにする視力矯正の方法で、近視進行抑制の分野でも使われる）は、この会社の事業を理解する要点として用語集への追加候補と考える。
- terms: 助言: 用語「メルスプラン」（コンタクトレンズの定額制会員システム。入会金と月額料金で、紛失・破損・度数変更時の保証などのサービスを受けられる仕組み）は、この会社独自の提供方法を表す語として用語集への追加候補と考える。

## 要確認（status に反映）

- businessModel: 2021年10月1日を効力発生日として、普通株式1株につき2株の割合で株式分割を実施しました。連結経営指標等の株式数に係る数値は、第65期（2022年3月期）の期首に当該分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] メニコンの主たる業界 → 提案: medical-devices。売上の大半を占めるビジョンケア事業の主力製品はコンタクトレンズであり、医療機器にあたる。閉じた分類に医療機器の区分がないため、最も近い医薬品（pharmaceuticals）を暫定とした。
