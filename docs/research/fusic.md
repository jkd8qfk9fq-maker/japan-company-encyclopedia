# Ｆｕｓｉｃ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｆｕｓｉｃ |
| 証券コード | 5256 |
| docID（データを取り出した文書） | `S100Z3D3` |
| 原本 docID | `S100Z3D3` |
| 提出日（原本） | 2026-09-24 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3D3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｆｕｓｉｃ / 5256 / docID S100Z3D3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fusic: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｆｕｓｉｃ 有価証券報告書－第23期(2025/07/01－2026/06/30) (docID S100Z3D3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
fusic: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Fusic」が EDINET の提出者名「株式会社Ｆｕｓｉｃ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。主要な経営指標等の推移の注記は、上場に伴う新株発行（第20期）、減資（第21期）、従業員数の定義、配当を実施していない旨などの表示・資本事項のみで、変則決算や会計基準の変更に当たる注記はない。
- businessModel: 当期純利益の減少理由は、有報では営業利益段階の投資費用の説明として述べられているため、利益段階の理由を書かない規則に従い本文には書かなかった。
- businessModel: サービス別の百万円切り捨ての合計は印字の売上高合計と１百万円ずれる（千円単位では一致）。印字の合計をそのまま引用した。
- businessModel: 株式会社天郷醸造所については、Ｂ種優先株式の議決権付与オプションを行使した場合に議決権比率が54.9％となりうる旨が重要な契約等に印字されているが、現時点では持分法非適用関連会社（議決権比率29.8％）であり、行使は未確定のため warnings にとどめた。
- businessStructure: 単一セグメント（DX事業）のため、サービス区分を children とした。サービス別売上高は【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）に基づく。
- businessStructure: サービス別の百万円切り捨ての合計（1,240＋979＋187＝2,406百万円）は印字の売上高合計2,407百万円と１百万円ずれる（千円単位では合計2,407,050千円で一致）。印字の合計をそのまま引用した。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。仕入側の相手先として買掛金にアマゾン ウェブ サービス ジャパン合同会社が印字されているが、候補一覧にないため関連企業には結んでいない。
- businessStructure: 主要な設備は単一セグメントのため事業への対応付けは行わず、従業員数の内訳のみ事業の説明に用いた。設備の帳簿価額は書いていない。
- history: 沿革のうち、資本金の増資額（2003年・2005年の行）は資本金額を書かない規則のため、設立の事実のみを記し金額は落とした。
- history: 落とした行: 2009年プライバシーマーク認証取得、2016年AWSパブリックセクターパートナー認定、2017年フクオカベンチャーマーケット大賞受賞・学認クラウド参加認定・SORACOMパートナー認定・GCPテクノロジーパートナー認定、2018年ISMS認証取得、2024年sigfyのISO/IEC 27017認証取得、2025年SORACOMのSELECTEDインテグレーションパートナー認定・えるぼし認定・新ブランドスローガン発表・株式会社まちのわホールディングスへの出資契約、2026年株式会社ドーガンへの出資契約（認定・受賞・認証類と小規模な出資契約は主要な転機に絞って省略）。
- history: 2026年８月のTellus Globalへの出資契約は決算日後の出来事だが、有報の【沿革】自体に印字されているため沿革として記録した。出資は少数出資であり当社の構成変更ではないため needsReview には入れていない。
- industry: 主たる業界は it（IT・ソフトウェア）とした。DX事業の単一セグメントで、クラウド・AI・IoTを活用したシステム開発と運用支援が事業の全体を占め、DEIの別記事業も cte のため、閉じた分類にそのまま当たる。暫定分類ではないため taxonomyGaps は空。
- relatedCompanies: en: 「エンジニア」等の一般語の部分一致のみで、会社としての記載はないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: port: 「サポート」「レポート」等の部分一致のみのため結ばなかった。
- relatedCompanies: core: 「コアタイム」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: lec: 「フレックス」等の部分一致のみのため結ばなかった。
- relatedCompanies: nissin: コードリストにない相手であり、出現も日付等の部分一致のみのため結ばなかった。
- relatedCompanies: como: 「コモディティ化」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: career: 「通信キャリア」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: king: 「ハッキング」等の部分一致のみのため結ばなかった。
- relatedCompanies: land: 一般語の部分一致のみのため結ばなかった。
- relatedCompanies: path: 一般語の部分一致のみのため結ばなかった。
- relatedCompanies: slogan: 「ブランドスローガン」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: space: 一般語の部分一致のみのため結ばなかった。
- relatedCompanies: cover: 一般語の部分一致のみのため結ばなかった。
- relatedCompanies: hub: 一般語の部分一致（ambiguous）のみのため結ばなかった。
- relatedCompanies: hyper: 一般語の部分一致のみのため結ばなかった。
- relatedCompanies: nix: 会社としての具体的な関係の記載がないため結ばなかった。
- relatedCompanies: san-a: 売掛金の相手先はサンエー運輸株式会社であり、株式会社サンエーとは別法人格のため結ばなかった。
- relatedCompanies: software-service: 会社としての具体的な関係の記載がないため結ばなかった。
- relatedCompanies: tear: 会社としての具体的な関係の記載がないため結ばなかった。
- relatedCompanies: zero: 一般語の部分一致（ambiguous）のみのため結ばなかった。
- relatedCompanies: fukuoka-financial-group: 役員の兼任先としての経歴欄の記載のみで、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: saibu-gas-holdings: 契約負債の相手先別内訳に名前があるのみで、個別の取引関係の説明がないため結ばなかった。
- relatedCompanies: institute-for-q-shu-pioneers-of-space: コードリストにない相手のため結ばなかった。なお、経営方針では宇宙領域でJAXAやQPS研究所等との協業を通じた実績の積み上げを進める旨が述べられている。
- relatedCompanies: 候補にないため結んでいない相手: 株式会社まちのわ（主要な顧客。前事業年度は総販売実績の18.8％、2026年６月期は12.5％を占める）、株式会社天郷醸造所（持分法非適用関連会社。2025年12月に株式を取得し議決権比率29.8％。当社の関連会社であるため関連企業としては結ばない）、AI教習所株式会社（2024年５月に出資と業務提携）、株式会社まちのわホールディングス（2025年３月に出資契約）、株式会社ドーガン（2026年３月に出資契約）、株式会社Tellus Global（2026年８月に出資契約）、マップボックス・ジャパン合同会社（2024年４月にパートナー契約）。
- terms: 助言のみ。用語としては「技術結合力」「フロー型ビジネス」「ストック型ビジネス」「AIトランスフォーメーション（AX）」「AI-Native」「MSP」「衛星リモセン法」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
