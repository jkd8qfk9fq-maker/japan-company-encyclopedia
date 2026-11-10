# カノークス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カノークス |
| 証券コード | 8076 |
| docID（データを取り出した文書） | `S100YAX9` |
| 原本 docID | `S100YAX9` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAX9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カノークス / 8076 / docID S100YAX9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
canox: 10 件の数値を有報XBRLと照合
有報: 株式会社カノークス 有価証券報告書－第98期(2025/04/01－2026/03/31) (docID S100YAX9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
canox: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 変則決算・決算期の変更・会計基準の変更はありません。financialNotes は空です。
- businessStructure: 単一セグメントのため、【関連情報】の品種別売上高の順に children を並べました（鋼板、ステンレス等、鋼管、条鋼、その他）。
- businessStructure: 条鋼とその他の詳しい用途は有報に記載がなく、区分名のみで記載しました。
- history: 沿革は有報の【沿革】の主な出来事を選びました。子会社の設立・清算などの細目は一部省いています（1987年の加納物流センター設立、1989年の加納興産設立、1991年の行徳コイルセンター分離、2004年の加納鋼板工業清算、2012年の加納鋼板加工清算）。
- industry: 鉄鋼販売事業の単一セグメントで、主たる業界は商社（trading）としました。鉄鋼専門商社であることは businessModel で説明しています。
- relatedCompanies: 結ばなかった候補（thinca）：「シンカ」は「第二の創業NEXT～カノークスらしさのシンカ～」という中計テーマの語で、株式会社シンカとの関係ではありません。
- relatedCompanies: 結ばなかった候補（en）：「エン」は「エンゲージメント」の語で、エン株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（freee）：「フリー」は「カーボンフリー電力」の語で、フリー株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（tear）：「ティア」は「ボランティア休暇制度」の語で、株式会社ティアとの関係ではありません。
- relatedCompanies: 結ばなかった候補（vision）：「ビジョン」は「長期経営ビジョン」の語で、株式会社ビジョンとの関係ではありません。
- relatedCompanies: 結ばなかった候補（innovation）：「イノベーション」は一般的な語で、株式会社イノベーションとの関係ではありません。
- relatedCompanies: 結ばなかった候補（path）：「パス」は「パーパス」の語で、パス株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（s-pool）：エスプールプラスが運営する農園での障がい者雇用は社会貢献活動で、エスプールとの取引・提携の記載ではありません。
- relatedCompanies: 結ばなかった候補（seki）：「セキ」は「情報セキュリティ」の語で、セキ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（sojitz）：双日は沿革にのみ登場します（1983年の第三者割当増資、2003年のメタルワン発足）。現在の取引・資本関係の記載はありません。
- relatedCompanies: 結ばなかった候補（mitsubishi-corporation）：三菱商事は沿革にのみ登場します（2003年のメタルワン発足）。現在の取引・資本関係の記載はありません。
- relatedCompanies: 結ばなかった候補（aichi-financial-group）：資金調達先であり、金融機関の資金調達を理由に結びません。
- relatedCompanies: 結ばなかった候補（mitsubishi-ufj-financial-group）：資金調達先であり、金融機関の資金調達を理由に結びません。
- relatedCompanies: 結ばなかった候補（career）：「キャリア」は一般的な語で、株式会社キャリアとの関係ではありません。
- relatedCompanies: 結ばなかった候補（cover）：「カバー」は「東北エリア全域をカバーする」の語で、カバー株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（fuller）：「フラー」は「マフラー」の語で、フラー株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（pacific-industrial）：当事業年度中に株式を売却しており、現在の関係の記載はありません。
- relatedCompanies: 結ばなかった候補（sugita-ace）：当事業年度中に株式を売却しており、現在の関係の記載はありません。
- relatedCompanies: 株式会社メタルワンはその他の関係会社で当社の大株主であり、鋼材の仕入及び販売の取引がありますが、非上場のため結びません。
- relatedCompanies: 株式会社空見スチールサービスは持分法適用関連会社で鋼板剪断加工の委託先ですが、非上場のため結びません。
- relatedCompanies: 五十鈴東海株式会社はその他の関係会社の子会社で鋼材の仕入・販売の取引がありますが、非上場のため結びません。
- relatedCompanies: 連結子会社（カノークス建材関東、カノークス建材、カノークス鋼管北上）は非上場のため結びません。
- terms: 用語の助言はありません。

## 要確認（status に反映）

- businessModel: 株式会社小川真功商店の完全子会社化は、有報の提出日（2026年6月19日）時点で予定の段階です。2026年4月28日の取締役会で全株式の取得を決議し、2026年4月30日に株式譲渡契約を締結しましたが、企業結合日は2026年7月1日です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
