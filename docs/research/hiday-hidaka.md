# ハイデイ日高 — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ハイデイ日高 |
| 証券コード | 7611 |
| docID（データを取り出した文書） | `S100YQ0A` |
| 原本 docID | `S100Y64B` |
| 提出日（原本） | 2026-05-26 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100Y8EO, S100YQ0A／有効文書 S100YQ0A（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YQ0A.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ハイデイ日高 / 7611 / docID S100Y64B（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hiday-hidaka: 10 件の数値を有報XBRLと照合
有報: 株式会社ハイデイ日高 訂正有価証券報告書－第48期(2025/03/01－2026/02/28) (docID S100YQ0A)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第48期(2025/03/01－2026/02/28)、docID S100YQ0A）を有効文書としてこのパックを作った。原本は docID S100Y64B。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはBasicPolicyRegardingControlOfCompanyTextBlock・InformationAboutOfficersTextBlock・OverviewOfCorporateGovernanceTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
hiday-hidaka: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YQ0A、2026年7月13日提出）である。原本（S100Y64B）との差異は、会社の支配に関する基本方針、役員の状況、コーポレートガバナンスの状況といった、エントリーが引用しない節の記載のみで、財務の数値と本文は同一（record-only）と判定されており、主要な経営指標等の5年数値も前期有報と全て一致しているため、確認事項にはせず警告に記録した。出典は訂正有報の値にそろえた。
- businessModel: 財務諸表の組替えの記載がある旨の注意が証拠パックにあったが、主要な経営指標等の注記で確認できるのは収益認識基準の適用のみで、5年数値に修正再表示はないため、financialNotesには収益認識基準の適用（第45期・2023年2月期の期首から）のみを記録した。
- businessModel: 重要な後発事象は、財務諸表・個別とも「該当事項はありません」と印字されている。経営上の重要な契約等にも特記の記載はない。
- businessModel: 2026年4月に株式会社オーシャンシステムとのFCにより新潟県へ初出店したことが経営成績の分析に印字されているが、期末後の出来事であり、本登録は2026年2月28日現在の直営472店舗の構造による。FC店舗は直営店舗数に含まれていない。
- businessModel: 当期に自己株式の取得が行われ、2026年4月には配当政策の変更が取締役会で決議されている。いずれも資本政策のため警告に記録し、金額や還元方針の指標は転記していない。
- businessModel: 中期経営計画の数値目標や、設備の新設等の計画（第49期の出店計画など）は、将来に関する事項のため本文に転記していない。
- businessModel: Wikipediaの記事「ハイデイ日高」の冒頭は有報の記載と重なる内容のみで、有報にない補足がないため、出典に加えていない。
- businessStructure: 当社は連結財務諸表を作成しておらず、関係会社もない単独の会社である。事業は飲食店チェーン関連事業の単一セグメントのため事業は1つとし、子区分は業態別の販売実績（日高屋・焼鳥日高・その他業態等）から作った。
- businessStructure: 業態別の金額は販売実績の表に千円単位でしか印字されていないため、子区分の説明には金額を書かず、期末店舗数と印字の前年同期比を用いた。千円額の換算はしていない。
- businessStructure: 472店舗は直営店舗数で、FC店舗は含まない（事業の内容の印字どおり）。
- history: 沿革は月まで印字されているが、エントリーの形式に合わせて年単位で記録した。設立時の資本金など、資本金の金額は転記していない。個別の店舗の開店・閉店は主要な節目に絞って選んだ。
- industry: 主たる事業は中華系レストランチェーンの直営運営を中心とする外食であり、閉じた分類に外食に当たる区分がないため、掲載済みの外食会社の先例（すかいらーくホールディングス、ゼンショーホールディングス、FOOD & LIFE COMPANIES、カッパ・クリエイト等）に揃えてfood（食品）を暫定の主分類としました。該当する区分が無いため、taxonomyGapsに記録しています。
- relatedCompanies: 麒麟麦酒株式会社は2026年2月28日現在3.06％を保有する大株主だが、関連企業の候補リストになく、未上場の事業会社であるため結ばなかった。
- relatedCompanies: 株式会社武蔵野銀行（the-musashino-bank）は2026年2月28日現在1.79％を保有する大株主だが、銀行本体であり、金融取引のための保有と解されるため結ばなかった。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）は特定投資株式として保有されているが、保有目的が全銘柄共通の定型句（取引関係等の強化）のみで具体的な提携の記述がなく、保有株式数も17,674株にとどまるため結ばなかった。なお、大株主欄の保有者は株式会社みずほ銀行（銀行本体）で、同社とは別の法人である。
- relatedCompanies: 片倉工業（katakura-industries）は特定投資株式として保有されているが、保有目的が全銘柄共通の定型句（取引関係等の強化）のみのため結ばなかった。
- relatedCompanies: 東日本旅客鉄道（east-japan-railway）は敷金及び保証金の相手先一覧に現れるのみ（記載は子会社のJR東日本都市開発を含む）で、取引・提携の記述がないため結ばなかった。
- relatedCompanies: 小田急電鉄（odakyu-electric-railway）は敷金及び保証金の相手先一覧に現れるのみで、取引・提携の記述がないため結ばなかった。
- relatedCompanies: 楽天グループ（rakuten-group）はキャッシュレス決済・ポイント関連の金額一覧に現れるのみで、提携の記述がないため結ばなかった。
- relatedCompanies: トラスト（trust）は信託口の名称の一部で、候補リストにもコードリストにもないため結ばなかった。
- relatedCompanies: ランド（land）は「ブランドマーク」等の一般語の部分一致のため結ばなかった。
- relatedCompanies: ベース（base-4481）は「ベースアップ」の部分一致のため結ばなかった。
- relatedCompanies: キャリア（career）は「キャリアプラン」等の一般語の部分一致のため結ばなかった。
- relatedCompanies: ビジョン（vision）は「経営ビジョン」の部分一致のため結ばなかった。
- relatedCompanies: いであ（idea-consultants）は一般語の部分一致のため結ばなかった。
- relatedCompanies: イシン（ishin）は気候変動対応の文脈の部分一致のため結ばなかった。
- relatedCompanies: ステップ（step）は一般語「ステップ」の部分一致のため結ばなかった。
- relatedCompanies: ウィル（will）は「コンピュータウィルス」の部分一致のため結ばなかった。
- relatedCompanies: コモ（como）は曖昧な部分一致のため結ばなかった。
- relatedCompanies: コロナ（corona）は「コロナ禍」の部分一致のため結ばなかった。
- relatedCompanies: クルーズ（crooz）は店舗名「日高屋ファッションクルーズひたちなか店」の部分一致のため結ばなかった。
- relatedCompanies: エン（en）は曖昧な部分一致のため結ばなかった。
- relatedCompanies: ポート（port）は「サポート」の部分一致のため結ばなかった。
- relatedCompanies: レイ（ray）は曖昧な部分一致のため結ばなかった。
- relatedCompanies: 理経（rikei）は曖昧な部分一致のため結ばなかった。
- relatedCompanies: セキ（seki）は「情報セキュリティ」の文脈の部分一致で曖昧なため結ばなかった。
- relatedCompanies: 鈴木（suzuki-6785）は役員の氏名（鈴木昌也）との一致で曖昧なため結ばなかった。
- terms: 助言: 用語「フレンド社員」は、パート・アルバイト社員の同社における呼称で、経営戦略の節に位置づけが印字されている。
- terms: 助言: 用語「店長自主管理経営」は、各店舗の店長が自主性を持って店舗運営を行う同社の店舗運営の考え方で、人財育成の施策の中で印字されている。
- terms: 助言: 用語「ハイデイユニバーシティ」は、同社の社内教育育成制度の名称で、SMDP研修などの研修体系を指す。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ハイデイ日高（hiday-hidaka）の主たる業界 → 提案: 外食（飲食店の運営・フードサービス）。事業の内容は「日高屋」を中核とする中華系レストラン472店舗の直営運営が中心で、2026年2月期の売上高622億52百万円の大部分が飲食店の運営によるものです。事業の中身は料理を店で提供する外食で、閉じた分類に外食に当たる区分がありません。food（食品）は食品・飲料メーカーを指す例が多く、掲載済みの外食会社（すかいらーくホールディングス、ゼンショーホールディングス、FOOD & LIFE COMPANIES等）も同じ理由でfoodを暫定としているため、それに揃えました。
