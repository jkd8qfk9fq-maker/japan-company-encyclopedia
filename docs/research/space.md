# スペース — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社スペース |
| 証券コード | 9622 |
| docID（データを取り出した文書） | `S100XT9C` |
| 原本 docID | `S100XT9C` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT9C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社スペース / 9622 / docID S100XT9C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
space: 10 件の数値を有報XBRLと照合
有報: 株式会社スペース 有価証券報告書－第54期(2025/01/01－2025/12/31) (docID S100XT9C)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":64182558000,"latestFiling":64189916000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":2554600000,"latestFiling":2545900000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":3546233000,"latestFiling":3533693000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":40953200000,"latestFiling":40969255000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":32679459000,"latestFiling":32705324000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第53期(2024/01/01－2024/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
space: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックで2024年12月期の5系列すべてに差異があったが、当期有報の主要な経営指標等の注記に「会計方針の変更に伴う遡及適用により遡及適用後の数値を記載」と理由が印字されているため、needsReviewではなくfinancialNotesに記録した。登録は当期有報の数値による。
- businessModel: 前期の窓にある訂正有価証券報告書－第53期は前期の有報に対するもので、当期有報（第54期）自体に訂正はない（訂正の有無 false、有効文書は当期有報そのもの）。
- businessModel: 中期経営計画「拡大成長」の定量目標（2028年12月期の売上高800億円と比率の目標）は将来の目標値・比率であるため、本文には数値を書かず方針の要約のみとした。
- businessModel: MD&Aに印字された段階利益の金額や増減率、損害賠償金の受取に関する記載は、本文に書く財務数値の対象（売上高と当期純利益）ではないため記載していない。
- businessModel: 市場分野別売上高の合計（71,510百万円）および制作品別売上高の合計（71,509百万円）と連結売上高（71,511百万円）との差は印字の丸めによるもので、各数値は印字のまま記載した。
- businessStructure: 単一セグメント（ディスプレイ事業）のため、事業の子区分は有報の制作品別の区分で構成した。市場分野別（複合商業施設・総合スーパー、食品スーパー・コンビニエンスストア、各種専門店、飲食店、サービス等）は顧客の分野であり事業の区分ではないため、子区分には使わずbusinessModelのindustryPositionに記録した。
- businessStructure: 制作品別売上高（MD&A印字・百万円単位）の合計は71,509百万円で、連結売上高71,511百万円との差2百万円は印字の丸めによるもの。各数値は印字のまま記載した。市場分野別売上高の合計（71,510百万円）にも同様に1百万円の丸め差がある。
- businessStructure: 連結子会社5社（SPACE JAPAN(HK) CO.,LTD.、株式会社エム・エス・シー、SPACE SHANGHAI CO.,LTD.、沖縄スペース株式会社、SPACE JAPAN(VN) CO.,LTD.）はいずれも同じディスプレイ事業に属するため、独立した事業区分にはしていない。
- history: 沿革の表に印字された資本金の金額（1972年の東海美装設立時の資本金）は、資本金の金額を書かない規則により記載していない。
- history: 事務所の開設（東京・静岡・大阪・金沢・札幌・横浜・福岡・松山・仙台・広島・沖縄）、建設業者登録・一級建築士事務所登録、自社工場のISO14001認証取得、上海子会社の許認可取得などの行は、事業の転機ではないため省いた。1973年のカトウ工芸設立、1981年の東京カトウ美装の分離独立、1985年の株式会社東京スペースへの商号変更と営業譲受、1998年の本社所在地の東京都中央区への変更も、経緯の記録にとどめ行としては省いた。
- industry: 商業施設の内装・建築工事と設計・施工が売上の中心であり、閉じた産業リストにディスプレイに当たる区分はない。掲載済みの乃村工藝社（nomura-9716）も construction を主産業としている先例に揃え、construction を主産業とした。企画・コンサルティングは同一事業の一部であり、金額が独立開示されていないため第2の産業は付けていない。
- relatedCompanies: 名古屋銀行（the-bank-of-nagoya）は特定投資株式85,200株を保有し大株主（所有割合1.63％）でもあるが、保有目的は金融機関としての安定的な資金調達の維持及び情報収集であり、資金調達の関係のため結ばなかった。三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）、あいちフィナンシャルグループ（aichi-financial-group）、大垣共立銀行（the-ogaki-kyoritsu-bank）も同じ資金調達・情報収集の目的のため結ばなかった。
- relatedCompanies: 乃村工藝社（nomura-9716）と丹青社（tanseisha）は特定投資株式を保有するが、保有目的はディスプレイ業界の動向に関する情報収集のみのため結ばなかった。
- relatedCompanies: イオンモール（aeon-mall）は、保有しているのがイオン株式会社の株式であり、イオンモール自体についての取引・提携の印字がないため結ばなかった。イオン株式会社自体はrelated-candidates.jsonに含まれていない。
- relatedCompanies: アンドエスティHD（and-st-hd）は、株式の保有状況に旧社名の「株式会社アダストリア」と印字され現商号での印字がなく、保有も20株にとどまるため結ばなかった。
- relatedCompanies: 当事業年度に全て売却し2025年12月31日時点で保有していない銘柄は結ばなかった：ホットランドホールディングス（hotland-holdings）、ライトオン（right-on）、スタジオアリス（studio-alice）、ハニーズホールディングス（honeys-holdings）、コナカ（konaka）、三井住友トラストグループ（sumitomo-mitsui-trust-group）、はるやまホールディングス（haruyama-holdings）。
- relatedCompanies: ジーフット（特定投資株式120,000株）とヴィレッジヴァンガードコーポレーション（同200株）は、各市場分野における重要な取引先として印字されているが、related-candidates.jsonに含まれないため結ばなかった。
- relatedCompanies: 連結子会社5社は自社グループの会社のため結ばなかった。日本マスタートラスト信託銀行（信託口）と日本カストディ銀行（信託口）は大株主に載るが信託口（カストディ）であり事業会社ではないため結ばなかった。スペース従業員持株会とスペース取引先持株会も事業会社ではないため結ばなかった。
- relatedCompanies: エン（en）、レイ（ray）、ゼロ（zero）、セキ（seki）、鈴木（suzuki-6785）はambiguousな部分一致であり、相手についての取引・提携の記載はないため結ばなかった。イノベーション（innovation）、キャリア（career）、ポート（port）、クリエイト（create）、いであ（idea-consultants）は一般語・部分一致であり、相手についての記載はないため結ばなかった（売却済みのアドバンスクリエイトはクリエイトとは別の会社である）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
