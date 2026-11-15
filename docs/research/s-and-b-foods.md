# ヱスビー食品 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ヱスビー食品株式会社 |
| 証券コード | 2805 |
| docID（データを取り出した文書） | `S100YGTZ` |
| 原本 docID | `S100YGTZ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGTZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ヱスビー食品株式会社 / 2805 / docID S100YGTZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
s-and-b-foods: 10 件の数値を有報XBRLと照合
有報: ヱスビー食品株式会社 有価証券報告書－第113期(2025/04/01－2026/03/31) (docID S100YGTZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
s-and-b-foods: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な顧客の三菱食品株式会社は、候補データの listing がコードリスト外のため関連企業に結んでおらず、本文に事実のみを記載しました。国分グループ本社株式会社も候補データに含まれていないため同様です。
- businessModel: 証拠パックの注意（本文に財務諸表の組替えの記載がある）への対応: 修正再表示チェックは前期有報と全8行が一致し、財務諸表の表示方法の変更にあたる注記は確認できなかったため、financialNotes には報告セグメントの変更のみを記載しました。経営成績の分析における製品区分別売上高の組み替えは、分析上の区分の見直しによるものです。
- businessModel: 第4次中期経営計画の数値目標（2029年3月期の売上高など）と長期目標（2043年の売上高・海外売上高比率）は業績目標のため本文には書いていません。
- businessModel: 営業利益・経常利益などの金額とその増減の理由は本文ルールのため書いていません。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順（国内事業115,395百万円→海外事業13,626百万円）としました。
- businessStructure: 製品区分別（スパイス＆ハーブ／即席／香辛調味料／インスタント食品その他）の売上高は出荷価格ベースで、その合計が国内事業・海外事業の売上高と一致しない旨が印字されているため、children には使わず businessModel の製品として記載しました。
- businessStructure: 主要な設備（東松山工場・上田工場・宮城工場など）は国内事業と海外事業の両方のセグメントにまたがって印字されているため、特定の事業には結びつけていません。
- businessStructure: 当連結会計年度からの報告セグメントの変更（「食料品事業」の単一区分から国内事業・海外事業の2区分へ）については、businessModel の financialNotes に記載しました。
- history: 沿革は連続した文章で印字されており、年月と事象の対応は文中で確認できるため、行順の対応づけは行っていません。工場の新築・物流センターの設置などの細目は主要なものだけを採りました。
- history: 設立時・改組時の資本金額は本文ルールのため記載していません。
- history: Wikipedia（「エスビー食品」）は、コーポレート・メッセージ「そこに、スパイス＆ハーブ」など有報にも印字のある内容が中心で、有報にない補足として使える事実がなかったため使用していません。
- industry: 主たる業界は食品としました。国内事業・海外事業のいずれも香辛料やカレー製品などの食料品の製造・販売であり、売上の大半を占めます。食品以外に独立した事業の開示はないため、2つ目の業界は付けていません。
- relatedCompanies: mitsubishi-shokuhin（三菱食品）: 主要な顧客（2026年3月期の売上高38,101百万円、出荷価格ベース）ですが、候補データの listing がコードリストにないため、検証できない相手として結んでいません。事業上の位置づけは businessModel に記載しました。
- relatedCompanies: 国分グループ本社: 主要な顧客（2026年3月期の売上高27,793百万円、出荷価格ベース）ですが、候補データに含まれていないため結んでいません。事業上の位置づけは businessModel に記載しました。
- relatedCompanies: 金融機関・保険会社（mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group、mebuki-financial-group、yokohama-financial-group、tokyo-kiraboshi-financial-group）: 特定投資株式の保有目的が資金調達等における取引先という金融取引のみのため結んでいません。
- relatedCompanies: the-chiba-bank（千葉銀行）: 2024年3月期に保有目的が純投資目的に変更され、売却を進める方針が印字されているため結んでいません。
- relatedCompanies: secom（セコム）: 当社の大株主に載るのは子会社のセコム損害保険株式会社であり、セコム株式会社自体との取引・提携の印字はないため結んでいません。
- relatedCompanies: 特定投資株式の保有目的が「食料品事業における製品販売の重要な取引先」など同区分で全銘柄共通の定型句のみで、銘柄固有の取引の印字がない相手は結んでいません: kato-sangyo（加藤産業）、toyota-tsusho（豊田通商、原料仕入および製品販売の定型句）、nippn（ニップン、原料仕入の定型句）、nisshin-seifun-group（日清製粉グループ本社、原料仕入の定型句）、zensho-holdings（ゼンショーホールディングス）、seven-and-i-holdings（セブン＆アイ・ホールディングス）、valor-holdings（バローホールディングス）、united-super-markets-holdings（ユナイテッド・スーパーマーケット・ホールディングス）、retail-partners（リテールパートナーズ）、central-forest-group（セントラルフォレストグループ）、trial-holdings（トライアルホールディングス）、h2o-retailing（エイチ・ツー・オー リテイリング）、maruichi（マルイチ産商）、life（ライフコーポレーション）、mammy-mart-holding（マミーマートホールディングス）、axial-retailing（アクシアル リテイリング）、arcs（アークス）、toho（トーホー）、belc（ベルク）、heiwado（平和堂）、okuwa（オークワ）、oie-sangyo（尾家産業）、yamanaka（ヤマナカ）、aeon-hokkaido（イオン北海道）、aeon-kyushu（イオン九州）、eco-s（エコス）、albis（アルビス）、three-f（スリーエフ）、yuasa-funashoku（ユアサ・フナショク）。
- relatedCompanies: toda（戸田建設）: 特定投資株式の保有目的が施工建物の管理に関する取引先という定型句のみで、銘柄固有の取引の印字がないため結んでいません。
- relatedCompanies: yaoko（ヤオコー）、 itochu-shokuhin（伊藤忠食品）、olympic-group（Olympicグループ）: 候補データの listing がコードリストにないため結んでいません（ヤオコーは株式交換により当事業年度に保有株式もなくなっています）。
- relatedCompanies: tsuruha-holdings（ツルハホールディングス）、yamazawa（ヤマザワ）: 当事業年度に保有株式がなくなっており（売却済み）、現在の関係の印字がないため結んでいません。
- relatedCompanies: 一般語・部分一致の誤マッチのため結んでいません: vision（「ビジョン」の一般語）、career（「キャリア」の一般語）、en（「エンゲージメント」等の部分一致、ambiguous）、port（表紙の事務連絡者等の部分一致）、base-4481（「出荷価格ベース」の部分一致）、core（「コアコンピタンス」の部分一致、ambiguous）、king（「ウォーキングイベント」の部分一致）、innovation（「イノベーション」の一般語）、land（「ゴールデンカレー」の部分一致）、path（「パスタソース」の部分一致、ambiguous）、seki（情報セキュリティ等の部分一致、ambiguous）、zero（残存価額ゼロ等の一般語、ambiguous）、idea-consultants（社名の由来「S&BIRD」の部分一致）、denka（製品の説明文中の部分一致）。
- terms: 用語候補（助言のみ。用語の登録は行いません）: スパイス＆ハーブ（香辛料とハーブの総称で、同社の事業の中核を指す言葉）、即席カレー（カレールウなど、家庭で手軽に調理できるカレー製品の区分）、チューブ製品（チューブ容器入りの香辛調味料）、レトルトカレー（レトルトパウチに密封し加熱殺菌した、そのまま温めて食べられるカレー）。

## 要確認（status に反映）

- businessModel: 2025年4月1日を効力発生日として、普通株式1株につき2株の割合で株式分割を実施した。連結経営指標等の数値は、第109期の期首に当該株式分割が行われたと仮定して算定されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
