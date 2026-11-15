# セルソース — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | セルソース株式会社 |
| 証券コード | 4880 |
| docID（データを取り出した文書） | `S100XHWF` |
| 原本 docID | `S100XHWF` |
| 提出日（原本） | 2026-01-28 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHWF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | セルソース株式会社 / 4880 / docID S100XHWF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cellsource: 2 件の数値を有報XBRLと照合
有報: セルソース株式会社 有価証券報告書－第10期(2024/11/01－2025/10/31) (docID S100XHWF)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
cellsource: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 当期は連結財務諸表の作成初年度のため、前期との売上高の増減は印字されておらず、本文では増減を書いていません。証拠パックの修正再表示チェックは「突き合わせられる行がない」でしたが、これは前期が単体のみの開示だったためであり、指標の注記に第10期より連結財務諸表を作成している旨が印字されています（financialNotes に記録）。
- businessModel: 経営指標としてモニタリングされている営業利益率などの数値目標は、投資の語に当たるため本文・perspectives には書いていません。
- businessModel: 受注実績の金額は書いていません。
- businessModel: 主な販売先（医療法人社団活寿会、メトラス株式会社、医療法人社団THE CLINIC Institute）は related-candidates.json の候補にないため、relatedCompanies には結ばず、顧客の説明に社名のみを記載しました。
- businessModel: 株式会社シャロームとは化粧品及び医薬部外品の製造委託のOEM基本契約（2017年1月1日から2026年12月31日まで、以降1年毎自動更新）が印字されていますが、候補にないため relatedCompanies には結んでいません。
- businessStructure: 単一セグメントのため、【関連情報】の製品及びサービスごとの情報の区分を children とし、外部顧客への売上高の大きい順（加工受託サービス2,446百万円、医療機器販売756百万円、化粧品販売その他326百万円、医療機関支援サービス182百万円）に並べました。4区分の合計3,711百万円は連結売上高と一致します。
- businessStructure: 羽田グローバルCPCは設備の内容が「加工施設設備」のため加工受託サービスに結びつけました。本社（東京都渋谷区）はセグメント欄が「全社」のため特定の区分には結びつけていません。リハスル千駄木店（フィットネスジム）はセグメント欄が再生医療関連事業とだけ印字され、サービス区分との対応が印字されていないため特定の children には結びつけていません。
- businessStructure: 設備の帳簿価額は書いていません。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略しました。化粧品の製造委託先である株式会社シャローム（OEM基本契約、2017年1月1日から2026年12月31日まで、以降1年毎自動更新）については化粧品販売その他の説明と businessModel の warnings に記録しました。
- history: 沿革の年月は年だけを採用し、月と資本金の金額は書いていません。
- history: 2016年の美顔器の仕入販売、医療機器製造業登録・許可の取得、化粧品製造販売業認可、2018年の高度管理医療機器等販売業許可、2018年の本社移転、2019年の住商ファーマインターナショナル株式会社との脂肪由来幹細胞の分譲契約、2020年の産婦人科向け血液由来加工受託サービスの開始と大阪大学との慢性閉塞性肺疾患治療の共同研究契約、2021年の順天堂大学との共同研究契約、2022年のエクソソーム化粧品原料の開発、2023年の監査等委員会設置会社への移行は、主要な出来事に絞るため省きました。
- history: wikipedia.json は証券コード4880で同一性を確認しましたが、沿革の補足に必要な旧社名・ブランド名等の新しい事実はなかったため、出典には加えていません。
- industry: 主たる業界は単一セグメントである再生医療関連事業から選びました。医薬品の製造販売が主業ではないため pharmaceuticals は暫定とし、taxonomyGaps に提案を記録しました。医療機器販売・化粧品販売は単一セグメント内のサービス区分で、独立した報告セグメントではないため業界は付けていません。
- relatedCompanies: anicom-holdings: 【沿革】に2022年6月の業務提携開始の記載のみで、現在の取引・資本関係の具体的な記載がないため結びませんでした（出来事としては history に記録）。
- relatedCompanies: port: 「サポート」の部分文字列の一致のみで、ポート株式会社への言及ではないため結びませんでした。
- relatedCompanies: base-4481: 行動指針の文中の「ゼロベース」等の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: land: 化粧品ブランド「シグナリフト」の「リフト」ではなく「ランド」はブランド説明文中の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: freee: 「フリーズドライ」の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: en: 「エンリッチクリーム」の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: vision: 当社自身の「セルソースビジョン」の文中の一致のみのため結びませんでした。
- relatedCompanies: path: 「パーパス」の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: cover: 「カバーするには至りませんでした」の一般語の一致のみのため結びませんでした。
- relatedCompanies: ishin: リスクの文中の一般語の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: rohm: 化粧品の製造委託先である「シャローム」の部分文字列の一致のみで、ローム株式会社への言及ではないため結びませんでした。
- relatedCompanies: zero: 「膝の痛みに悩む人をゼロへ」の一般語の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: corona: 「新型コロナウイルス感染症」の一致のみのため結びませんでした。
- relatedCompanies: innovation: 「イノベーションの創出」の一般語の一致のみのため結びませんでした。
- relatedCompanies: ricoh: 「リコール対応」の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: rix: 「マトリックス評価」の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: seki: 「セキュリティ」の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: trust: 大株主の日本マスタートラスト信託銀行（信託口）の一致で、候補の株式会社トラストではなく、コードリストにもないため結びませんでした。
- terms: 助言のみ。本文で使った用語の候補: 再生医療等、特定細胞加工物、多血小板血漿（PRP）、PFC-FD、脂肪由来幹細胞、エクソソーム、CPC（細胞加工施設）、FatBankです。
- terms: wikipedia.json は証券コード4880で同一性を確認しましたが、補足に必要な事実は有報で足りたため出典には加えていません。

## 要確認（status に反映）

- businessModel: 【重要な契約等】に記載されたMedikan Co., Ltd.との指定医療機器商品の日本国内独占販売契約の契約期間は、2026年3月31日までと印字されています。提出日（2026年1月28日）時点で更新や継続の記載はなく、契約期間満了後の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] セルソースの主たる業界（再生医療関連事業） → 提案: 再生医療・細胞加工サービス。事業は医療機関から組織・細胞の加工・保管を受託する再生医療関連事業が単一セグメントであり、2025年10月期売上高3,711百万円のうち加工受託サービスが2,446百万円を占めます。閉じた分類に再生医療・細胞加工に当たる区分がなく、医療関連で最も近い pharmaceuticals（医薬品）を暫定としました。
