# ホテル、ニューグランド — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ホテル、ニューグランド |
| 証券コード | 9720 |
| docID（データを取り出した文書） | `S100XMSL` |
| 原本 docID | `S100XMSL` |
| 提出日（原本） | 2026-02-25 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMSL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ホテル、ニューグランド / 9720 / docID S100XMSL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hotel-newgrand: 10 件の数値を有報XBRLと照合
有報: 株式会社ホテル、ニューグランド 有価証券報告書－第148期(2024/12/01－2025/11/30) (docID S100XMSL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
hotel-newgrand: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aの利益項目（金額・増減率・理由）とセグメント利益は規則により本文に書いていない。当期純利益が前期比で減少した理由にも触れていない。
- businessModel: 経営指標等の注記のうち、収益認識基準の適用（注8）は financialNotes に記録した。その他の注記（潜在株式・配当性向・株価収益率の非表示、連結財務諸表を作成していないこと、関連会社がないこと等）は表示事項のため warnings にとどめた。連結を作成していない事実は flow の company 段にも記載した。
- businessModel: 事業用土地の再評価（2000年11月30日実施）は5年の表の対象期間外の事実のため financialNotes には入れなかった。
- businessModel: 経営方針に掲げる目標指標や配当に関する数値は、投資の語・金額の規則により本文・戦略に書いていない。
- businessModel: 重要な後発事象は「該当事項はありません」であり、期後の構造イベントはない。設備計画の「グランドメゾン山下公園 THE HOUSE」（2026年11月完了予定）は期前からの設備の新設計画であり、期後の構造イベントではないため needsReview には入れなかった。
- businessModel: 「時価総額」の語は本文に使用していない。
- businessStructure: 事業の並び順は、セグメント情報における外部顧客への売上高の大きい順（ホテル事業6,481百万円、不動産賃貸事業48百万円）とした。
- businessStructure: ホテル事業の子区分は、収益認識関係の分解情報に印字された宿泊・宴会・レストラン・その他の金額を用いた。MD&Aの主な部門別売上高（宿泊2,058百万円、レストラン1,455百万円、宴会2,314百万円）と一致し、残りがその他652百万円である。
- businessStructure: 関連会社はなく（【関係会社の状況】は該当事項なし）、全ての事業を当社のみで行っているため、子会社による運営の記載はない。
- businessStructure: 主要な設備の賃借関係（横浜市やSMFLみらいパートナーズ株式会社からの土地・建物の賃借）は設備の情報として warnings にとどめ、事業の説明には含めなかった。
- history: 沿革の全行から、設立・営業開始・接収と再開・上場の節目・新館タワー完成・賃貸ビル完成・百貨店内出店・直営ショップ出店を選んだ。改装工事の完了など施設改修の個別行は、節目となるものを除き省略した。
- history: 1936年から1947年の富士ニューグランドホテルの委託経営と国際観光興業株式会社の吸収合併（1981年）は、現在の事業構成への影響が沿革上大きくないため省略した。
- history: Wikipediaの補足（クラシックホテル、ホテルグループ加盟等）は沿革の裏付けには使わなかった。
- industry: 主たる業界は、売上高の大半（外部顧客への売上高6,481百万円）を占めるホテル事業に最も近い entertainment（暫定）とした。閉じた分類にホテル・宿泊の区分が無いため taxonomyGaps に記録した（宿泊事業の先例であるグリーンランドリゾート、アゴーラホスピタリティーグループ等に倣った）。
- industry: 不動産賃貸事業（48百万円）は real-estate が直接適合するため副次に付けた。
- relatedCompanies: takashimaya（株式会社髙島屋）: 【事業の内容】に、髙島屋横浜店の店内でレストランを営むことが個別に印字されているため business-partner として結んだ。出店先としての関係であり、資本関係の記載はない。
- relatedCompanies: 原地所株式会社: 【大株主の状況】で16.22％（2025年11月30日現在）を保有する最大の株主であり、関連当事者として事務所及び駐車場の賃貸取引と役員の兼任が印字されているが、非上場で候補（related-candidates.json）に含まれないため結ばなかった。
- relatedCompanies: そごう横浜店の運営会社である株式会社そごう・西武: 【事業の内容】に出店先として現れ、【大株主の状況】にも3.22％の保有で載るが、候補に含まれないため結ばなかった。親会社等を代替として結ぶこともしない。
- relatedCompanies: shimizu（清水建設株式会社）・east-japan-railway（東日本旅客鉄道株式会社）・secom（セコム株式会社）: いずれも【大株主の状況】に載る事業会社（順に3.98％、3.71％、2.71％、2025年11月30日現在）だが、取引・提携・関係会社の区分等の関係性の記載がないため結ばなかった。
- relatedCompanies: yokohama-financial-group（株式会社横浜フィナンシャルグループ）: 特定投資株式として保有するが、保有目的は「取引関係の円滑化を目的として保有しております」という定型的な記載のみで、個別の取引内容が印字されていないため結ばなかった。
- relatedCompanies: takasago-thermal-engineering（高砂熱学工業株式会社）: 未払金の相手先として現れるのみで、継続的な取引・提携の内容の記載がないため結ばなかった。
- relatedCompanies: land・en・career・rhythm・port・ray・sanno・seki・space・trust: いずれも一般語・部分一致（ニューグランド、エンゲージメント、キャリア、リズム、ポート、キャラクター名、施設の貸与先名、セキュリティ、イートインスペース、信託銀行名等）であり、各社との関係の記載はない。
- relatedCompanies: 【関係会社の状況】は該当事項なしであり、親会社・子会社・関連会社はない。
- terms: 助言: 用語「クラシックホテル」は、歴史的な建物や伝統的な様式を保ちながら営業を続けるホテルを指します。当社のホテルニューグランドは1927年に営業を開始し、本館を残しながらタワー館とあわせて運営されています。
- terms: 助言: 用語「外販」は、ホテル館内での提供にとどまらず、店舗などで商品を外部の顧客に販売する事業を指します。当社ではセカンドブランド「S.Weil by HOTEL NEW GRAND（エスワイル）」の直営ショップが該当します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 株式会社ホテル、ニューグランドのホテル事業 → 提案: ホテル・宿泊。ホテル事業（2025年11月期の外部顧客への売上高6,481百万円）は、ホテルニューグランドでの宿泊・婚礼宴会・料飲施設の運営が中心であり、閉じた分類（INDUSTRY_IDS）にホテル・宿泊に当たる区分が無いため、レジャー施設運営として最も近い entertainment を暫定とした。
