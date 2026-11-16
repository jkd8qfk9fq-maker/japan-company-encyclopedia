# トラース・オン・プロダクト — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社トラース・オン・プロダクト |
| 証券コード | 6696 |
| docID（データを取り出した文書） | `S100Y0AL` |
| 原本 docID | `S100Y0AL` |
| 提出日（原本） | 2026-04-22 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0AL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社トラース・オン・プロダクト / 6696 / docID S100Y0AL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
traas-on-product: 2 件の数値を有報XBRLと照合
有報: 株式会社トラース・オン・プロダクト 有価証券報告書－第32期(2025/02/01－2026/01/31) (docID S100Y0AL)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
traas-on-product: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記2〜4（臨時従業員数の定義、潜在株式調整後1株当たり当期純利益・株価収益率の非記載）は表示事項のため financialNotes には入れなかった。注記1（第32期より連結財務諸表を作成）のみ financialNote とした。
- businessModel: 前期有報との自動突合は、第32期より連結財務諸表を作成しており前期の連結数値が存在しないため、突き合わせられる行がなかった。組替え・修正再表示に関する注意喚起は証拠パックに無く、主要な経営指標等にも組替えの記載はない。
- businessModel: セグメント利益（売上総利益ベース）・営業損失・経常損失の金額、受注高・受注残高の金額、資本金・借入金の金額は本文に書かなかった（売上高と当期純損失のみ）。
- businessModel: 売上高の前期比較は、連結初年度のため有報にも記載がない（MD&Aに比較・分析の記載なしと明記）。
- businessModel: Wikipediaは企業一覧ページ（電気機器）しか見つからず、会社固有の補足が無いため使わなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（受注型Product事業219,019千円、TRaaS事業143,162千円、テクニカルサービス事業123,761千円、合計485,942千円で連結売上高と一致）。
- businessStructure: 本社（横浜市西区）はセグメント名称が「全事業」と連記されているため、特定の事業には結びつけなかった。設備の帳簿価額は書いていない。
- businessStructure: 連結子会社は株式会社アクスト東日本（コードレス呼び出しチャイムの卸売事業、議決権100%）の1社で、【関係会社の状況】どおり。自社の子会社は関連企業には含めない。
- businessStructure: 製造は主に中国の電子機器の受託メーカー（EMS）への委託で、特定の供給先名は印字されていないため suppliers は書かず（旧スキーマでもある）、事実は businessModel の warnings に記録した。
- history: 沿革表は年月と事象が対応して印字されており、行順の対応づけは不要だった。月は書かず年だけにした。
- history: 落とした行（理由）: 本社の移転4件（2003年・2012年・2020年・2022年。拠点の移転で事業の転換ではない）、2016年の監査等委員会設置会社への移行とISO9001取得（組織・認証）、2017年の台湾支店・シンガポール子会社の設立と2021年の同子会社の株式譲渡・台湾支店閉鎖（海外拠点の開閉）、2018年のルームコントローラーの提供開始・2019年のオンラインチェックイン端末の提供開始・2019年のクラウド型コンテンツ配信システムNGHの提供開始・2020年の美容サロン向けサイネージサービスの提供開始（個別製品の提供開始）、2022年の東京証券取引所グロース市場への移行（市場区分の機械的な再表示）、2023年・2024年の特許取得・登録（知的財産の取得）。
- history: 資本金額は沿革に書かなかった（1995年・1997年の増資額は印字されているが金額は書かない規則）。
- industry: 主たる事業はIoT機器の設計・開発・製造であり、閉じた分類の electronics が直接当てはまるため主分類とした。テクニカルサービス事業は基幹業務システム等のソフトウェア受託開発とエンジニア派遣で報告セグメントとして売上高が開示されているため、it を2つ目に付けた。暫定分類は不要。
- relatedCompanies: en（エン）: 一致は「エンジニア派遣」等の一般語のみで、エン株式会社についての取引・提携・資本関係の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: port（ポート）: 一致は「サポート」等の一般語のみのため結ばなかった。
- relatedCompanies: base-4481（ベース）: 一致は「データベース」等の一般語のみのため結ばなかった。
- relatedCompanies: seki（セキ）: 一致は「セキュリティ」等の一般語のみのため結ばなかった（ambiguousでもある）。
- relatedCompanies: career（キャリア）: 一致は「携帯キャリア」等の一般語のみのため結ばなかった。
- relatedCompanies: nissin（日新）: listing がコードリストにない相手であり、一致も新株予約権の記載中の一般語のみのため結ばなかった。
- relatedCompanies: ray（レイ）: 一致は「ディスプレイ」等の一般語のみのため結ばなかった（ambiguousでもある）。
- relatedCompanies: cover（カバー）: 一致は「カバーできる」という一般語のみのため結ばなかった。
- relatedCompanies: ichiyoshi-securities（いちよし証券）: 大株主のWORLD F PTE. LTD.の常任代理人としてのみ記載され、取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: koyou-rentia（コーユーレンティア）: 沿革に2021年1月の業務提携が1件記載されるのみで、当期の継続的な取引関係を示す記載がなく、過去1回限りの提携として結ばなかった。
- relatedCompanies: land（ランド）: 一致は「ブランド化」の一般語のみのため結ばなかった。
- relatedCompanies: marubeni（丸紅）: 【重要な契約等】の販売代理店契約の相手方は丸紅株式会社の子会社である丸紅情報システムズ株式会社であり、丸紅株式会社とは別の法人のため結ばなかった（親会社への置換はしない）。
- relatedCompanies: ricoh（リコー）: 一致は「リコール」という一般語のみのため結ばなかった。
- relatedCompanies: the-lead（リード）: 一致は「リードタイム」の一般語のみのため結ばなかった。
- relatedCompanies: vision（ビジョン）: 一致は「テレビジョン」の一般語のみのため結ばなかった。
- relatedCompanies: 候補にない相手（警告のみ）: クロスバリュー株式会社・株式会社dinos・株式会社ジーエーピーは主要な顧客として印字されているが related-candidates.json に無いため結ばなかった。加賀FEI株式会社はAIrux8の販売代理店契約の相手方だが、加賀電子株式会社とは別の法人のため結ばず、加賀電子への置換もしなかった。株式会社NSCホールディングスは2019年の合弁相手方で大株主（2026年1月31日現在1.45％）だが候補に無いため結ばなかった。HDMI Licensing LLC.とVia Licensing Corporationはライセンス契約の相手方で候補に無いため結ばなかった。
- terms: 助言のみ。用語候補: 「IoT」（モノに通信機能を持たせインターネットに接続させる仕組み）、「STB（セットトップボックス）」（放送信号を受信しテレビで視聴可能な信号に変換する端末）、「VAR（付加価値再販パートナー）」（製品に付加価値を付加し再販する事業者）、「SaaS」（ソフトウェアをサービスとして月額課金等で提供する形態）、「ファブレス」（自社で工場を持たず製造を外部に委託する形態）、「デジタルサイネージ」（電子看板による情報表示・配信）、「EMS」（電子機器の受託製造サービス）。いずれも有報の注記・事業の内容に定義または説明がある。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
