# プロネクサス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社プロネクサス |
| 証券コード | 7893 |
| docID（データを取り出した文書） | `S100YEYJ` |
| 原本 docID | `S100YEYJ` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEYJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社プロネクサス / 7893 / docID S100YEYJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
pronexus: 10 件の数値を有報XBRLと照合
有報: 株式会社プロネクサス 有価証券報告書－第82期(2025/04/01－2026/03/31) (docID S100YEYJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
pronexus: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 新中期経営計画2027の業績目標（2031年3月期の連結売上収益400億円のイメージ、配当性向50％以上など投資指標を含む目標）は、本文・戦略に書かず warnings にとどめた。
- businessModel: 金額の表記は千円印字を百万円に切り捨てる convention を採った（例: 上場会社ディスクロージャー関連14,071,568千円→14,071百万円）。MD&A本文は14,072百万円と丸めて印字しているが、セグメント注記の千円印字からの切り捨てで統一した。
- businessModel: 前期（2025年3月期）の純利益の大幅な変動要因（のれん減損や持分法投資の売却益）は、本文の数値が売上収益と当期純利益に限られるため、理由としては書かなかった。
- businessModel: brief の「非継続事業」注意は、会計方針の注記でIFRS第5号「売却目的で保有する非流動資産及び非継続事業」に言及しているだけであり、実際の非継続事業や売却目的資産の記載はないことを確認した。basis や needsReview には入れていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。提出後の予定事項はない。
- businessStructure: 単一セグメントのため、4つのサービス区分を【関連情報】の製品及びサービスに関する情報（売上収益）の区分どおり children にした。金額はセグメント注記の千円印字を百万円に切り捨てた値で、MD&A本文の丸めた印字（上場会社ディスクロージャー関連14,072百万円等）とは異なる。切り捨て後の4区分の合計は32,819百万円で、印字の合計32,821百万円と2百万円ずれる（切り捨てによる差異）。
- businessStructure: wikipedia.json の記述は有報の記載（旧社名・eol）の範囲を出ないため、補足には使わなかった。
- businessStructure: suppliers はこのツリーの旧スキーマにキーがないため省略した。個別の仕入先への依存の印字はない。
- history: 沿革の年月は月まで印字されているが、行には月を書かない規則のため年に丸めた。
- history: 落とした行（warningsとして列挙）: 各地の営業所設置・移転、本社移転、ISO・ISMS認証取得、執行役員制度導入、懸賞論文の募集、「プロネクサスの森」契約、中期経営計画の発表（2011・2018・2021・2024）、資本業務提携の個別行（2015年ビジネスブレイン太田昭和＝関連企業で記録、2022年FRAIM・2025年アクセスグループ・ホールディングス・2026年Booost＝関連企業の判断で記録）、子会社の設立・吸収合併の細目（セキュリティー・ロジスティックス、レインボー・ジャパン、a2media関連、Japan REIT分割等）。創業・設立の資本金額は書いていない。
- industry: 主たる業界は、連結売上収益32,821百万円のすべてを占めるディスクロージャー関連事業（単一セグメント）で決めた。同社の事業は、開示書類作成支援システムなどのシステムサービスと、コンサルティング・制作サービスを一体で提供する情報・実務支援サービスであり、閉じた分類に開示支援サービスの区分がないため、システムサービスを中核とする点で最も近い it（IT・ソフトウェア）を暫定とし、taxonomyGaps に記録した。印刷は制作工程の一部であり、独立した事業区分として開示されていないため、2つ目の業界は付けなかった。
- relatedCompanies: business-brain-showaota / access-group-holdings / bridge-consulting-group の3社は、特定投資株式の保有目的が他の銘柄と共通の文ではなく「業務資本提携に基づく、（事業分野）の取引の…」と提携そのものを根拠に個別化されており、沿革にも各社との業務資本提携・資本業務提携が印字されているため business-partner として結んだ。取引の向きは印字されていないため customer / supplier にはしていない。
- relatedCompanies: その他の特定投資株式は、保有目的が全銘柄共通の定型句「ディスクロージャー関連事業の取引の安定的、長期的な維持・強化のため保有しております」だけであり、個別の取引・提携の記載がないため結ばなかった: kibun-foods（紀文食品）、shochiku（松竹）、tanseisha（丹青社）、iwatsuka-confectionery（岩塚製菓）、aeon（イオン）、sodick（ソディック）、central-japan-railway（東海旅客鉄道）、ana-holdings（ANAホールディングス）、hazama-ando（安藤・間）、yamato-holdings（ヤマトホールディングス）、yamabiko（やまびこ）、sekisui-house（積水ハウス）、ikuyo（イクヨ）、kanaden（カナデン）、oiles（オイレス工業）、keio（京王電鉄）、hachi-ban（ハチバン）、marusan-securities（丸三証券）、sony-group（ソニーグループ）、cleanup（クリナップ）、create（一致はアドバンスクリエイト。定型句のみ）、canon（キヤノン、150株）、seven-and-i-holdings（セブン＆アイ・ホールディングス、300株）、asahi-group-holdings（アサヒグループホールディングス、300株）、sony-financial-group（ソニーフィナンシャルグループ。パーシャルスピンオフによる現物配当で取得）。候補にないNTT株式会社（10,200株）も同じ定型句のみのため結んでいない。
- relatedCompanies: mizuho-financial-group（三菱UFJフィナンシャル・グループ含む）: 特定投資株式の保有目的は定型句のみで、銀行・証券との関係は資金調達・取引の文脈のため結ばなかった。
- relatedCompanies: 大株主は個人株主、日本マスタートラスト信託銀行（信託口）等の信託口、社員持株会のみで、事業会社の大株主はいないため major-shareholder のリンクはない。trust（トラスト）はコードリストになく、一致は信託口の名称である。
- relatedCompanies: link-and-motivation（リンクアンドモチベーション）: 従業員エンゲージメント調査に同社の「モチベーションクラウド」を用いている旨の記載があるだけで、当社の事業に関する提携・取引関係の記載がないため結ばなかった。
- relatedCompanies: 候補にない資本業務提携先として、FRAIM株式会社（2022年3月、ドキュメントテック企業）とBooost株式会社（2026年3月、サステナビリティコンサルティング会社）があるが、related-candidates.json にないため結ばず、事実のみここに記録する。株式会社ミツエーリンクスは2013年に持分法適用関連会社化したが2024年4月に持分法適用範囲から除外されており、現在の関係の記載がないため結ばなかった。株式会社日立ハイテク（旧・日立ハイテクノロジーズ）とは2013年にデータベース事業の承継があったが一回限りの事業譲受であり、technologies 候補の一致も旧社名の一部であるため結ばなかった。
- relatedCompanies: 一般語・部分一致のため結ばなかった候補: base-4481（「連結ベース」等の語）、core（「コア業務」の語、ambiguous）、seki（「セキュリティ」の部分一致、ambiguous）、en（「エンゲージメント」等の部分一致、ambiguous）、career（「キャリア採用」の語）、innovation（子会社名「JBAプロセス・イノベーション・コンサルティング」の一部）、step（収益認識の「ステップ」の語）、vision（「ビジョン」の語）、port（「サポート」等の部分一致）、zero（「ゼロカーボンプリント」の語、ambiguous）、corona（「アフターコロナ」の語）、cover（「カバー」の語）、land（「ブランド」の語）、space（「スペース」の語）、vector（「ベクトル」の語）、jinushi（「地主」の一般語、ambiguous）。
- terms: 用語の助言のみの工程。固有の論点はない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] プロネクサスのディスクロージャー関連事業 → 提案: ディスクロージャー・IR実務支援サービス。上場会社等の法定開示・IR実務を、コンサルティング、開示書類作成支援システム、翻訳・Web・印刷などの制作サービスで一体支援する事業であり、IT・ソフトウェアにも印刷・出版にも収まらないため。
