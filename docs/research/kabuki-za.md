# 歌舞伎座 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社歌舞伎座 |
| 証券コード | 9661 |
| docID（データを取り出した文書） | `S100Y65X` |
| 原本 docID | `S100Y65X` |
| 提出日（原本） | 2026-05-26 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y65X.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%AD%8C%E8%88%9E%E4%BC%8E%E5%BA%A7

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社歌舞伎座 / 9661 / docID S100Y65X（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kabuki-za: 10 件の数値を有報XBRLと照合
有報: 株式会社歌舞伎座 有価証券報告書－第102期(2025/03/01－2026/02/28) (docID S100Y65X)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kabuki-za: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 経営方針に掲げる長期的な経営課題（自己資本比率の向上と安定配当の維持・継続）は財務比率と配当に関する指標のため、本文とperspectivesには数値・指標名を書かず、対処すべき課題の定性的な内容のみを strategy.disclosed に要約した。
- businessModel: MD&Aの利益項目（営業利益・経常利益・セグメント利益）の金額と増減理由は規則により記載していない。売上高の増減（2026年2月期は前期比16.9％増）とその内訳のみを本文に使った。
- businessModel: 連結子会社である歌舞伎座サービス株式会社の単体の損益情報（売上高1,647,701千円等）は子会社単体の数値のため本文に記載していない。
- businessModel: 配当（１株につき５円の予定）は資本政策のため本文に記載していない。
- businessModel: 前期有報との照合（修正再表示チェック）は全系列で差異ゼロであり、訂正有価証券報告書も提出されていない（2026-11-12まで確認）。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（不動産賃貸事業2,026,197千円、売店事業815,083千円、食堂・飲食事業791,376千円）とした。MD&Aの営業実績表の順（不動産賃貸・食堂・飲食・売店）とは異なる。
- businessStructure: セグメント利益は規則により記載していない。
- businessStructure: 主要な顧客である松竹株式会社への売上高（2026年2月期1,747,833千円）はセグメント横断のため、個別の事業には金額を結びつけていない。
- businessStructure: suppliersキーは旧スキーマのため省略した。劇場の敷地の一部を松竹株式会社などから賃借している事実は不動産賃貸事業の説明に記載した。
- history: 沿革から落とした項目: 1956年映画製作事業の開始、1958年株式会社戎橋劇場の設立とテレビ映画部の新設、1960年松竹豊橋会館株式会社の設立、1961年株式会社文楽座の吸収合併、1963年歌舞伎座サービス株式会社の吸収合併と歌舞伎座事業株式会社への社名変更（現在の子会社の系譜は1954年と2011年の項目で要約した）、1963年文楽座の朝日座への改称、1973年表新館竣工、1976年歌舞伎座ビル竣工、1984年朝日座の閉鎖・譲渡、1984年〜1999年の大船セントラル駐車場に関する土地取得・賃貸・土地交換、1985年テレビ映画製作の見合わせ、1990年東新館ビル竣工、2000年豊橋営業所の閉鎖と土地譲渡、2002年歌舞伎座の建物の登録有形文化財登録（2010年登録抹消）、2005年株式会社戎橋劇場の歌舞伎座サービス株式会社への社名変更。いずれも現在の事業構造を説明するうえで中心ではないため省き、判断をここに記録した。
- history: 設立時の資本金（１億５千万円）は規則により記載していない。
- industry: 主たる業界は real-estate とした。不動産賃貸事業が2026年2月期の外部顧客への売上高の55.8％（2,026百万円）を占める最大の報告セグメントであるため。
- industry: 売店事業（815百万円）は歌舞伎関連商品や土産物の販売であり retail が直接適合するため副業界とした。
- industry: 食堂・飲食事業（791百万円）は飲食店舗の運営であり、閉じた分類に飲食店運営の区分が無いため food を暫定とし、taxonomyGaps に記録した。
- industry: entertainment は付けなかった。歌舞伎の興行そのものは劇場の賃借人である松竹株式会社が行っており、当社グループは劇場の所有・賃貸と附帯する食・物販を担うためである。
- relatedCompanies: shochiku: 候補は ambiguous 表示だが、関係会社の状況に正式名称「松竹株式会社」が「その他の関係会社」として印字され、劇場の賃貸借と主要な顧客としての取引も印字されているため同一性と関係性の両方が確認でき、結んだ。区分は関係会社の状況の分類どおり other-affiliated-company とした。
- relatedCompanies: kitazawa-sangyo: 特定投資株式の保有目的が「食堂・飲食事業における関係先として関係維持・強化のため」と事業を指定して個別化されているため結んだ。取引の向きは印字されていないため supplier ではなく business-partner とした判断を記録する。
- relatedCompanies: daiwa-securities-group / mitsubishi-ufj-financial-group / mizuho-financial-group / sumitomo-mitsui-financial-group: 特定投資株式の保有目的が「金融取引や事業情報取集等の主要関係先として関係維持・強化のため」という全銘柄共通の定型句であり、金融機関でもあるため結ばなかった。
- relatedCompanies: fuji-media-holdings: 大株主の状況に1.23％の保有が載るが、当社との個別の取引・提携の記載がないため結ばなかった。株式会社ＴＢＳテレビ、日本テレビ放送網株式会社、株式会社三越伊勢丹も同様に大株主として載るのみで、候補にもないため結んでいない。
- relatedCompanies: trust: 退職給付信託の信託口であり、コードリストにもないため結ばなかった。
- relatedCompanies: base-4481: 「時価ベースの自己資本比率」の部分一致であり、ベース株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: corona: コロナ禍の文脈の部分一致であり、株式会社コロナとの関係の記載はないため結ばなかった。
- relatedCompanies: suzuki-6785: 社外取締役の個人名（鈴木太一郎）の部分一致であり、株式会社鈴木との関係の記載はないため結ばなかった。
- relatedCompanies: 連結子会社の歌舞伎座サービス株式会社は規則により関連企業には結ばず、事業構造に記載した。
- terms: 用語の助言: 「歌舞伎座」とは、東京都中央区銀座四丁目（東銀座）にある歌舞伎専用の劇場の名称であり、同時にその劇場の土地と建物を所有する当社の社名でもあります。「木挽町広場」とは、劇場の地下にある広場で、売店や飲食店舗が集まり、催しも開かれる空間を指します。「その他の関係会社」とは、親会社・子会社・関連会社のいずれにも当たらないものの、議決権の保有などを通じて関係の深い会社を指す区分です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 歌舞伎座の食堂・飲食事業 → 提案: 飲食サービス。食堂・飲食事業（2026年2月期の外部顧客への売上高791百万円）は、劇場内及び地下広場において食堂・飲食店舗を運営する事業であり、閉じた分類（INDUSTRY_IDS）に飲食店の運営に当たる区分が無いため、食に関わる区分として最も近い food を暫定とした。
