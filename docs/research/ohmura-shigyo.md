# 大村紙業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大村紙業株式会社 |
| 証券コード | 3953 |
| docID（データを取り出した文書） | `S100YK44` |
| 原本 docID | `S100YK44` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK44.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大村紙業株式会社 / 3953 / docID S100YK44（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ohmura-shigyo: 10 件の数値を有報XBRLと照合
有報: 大村紙業株式会社 有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YK44)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
ohmura-shigyo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営上の目標の指標（売上高経常利益率５％以上）は利益率の目標のため、本文にも perspectives にも書いていない。
- businessModel: 指標注記２（潜在株式が存在しないため希薄化後の１株当たり指標を記載していない旨）と注記３（第61期の配当には創立60周年記念配当を含む旨）は表示・配当の事項のため、financialNotes には入れず、ここに記録する。
- businessModel: サンオオムラ株式会社（その他の関係会社。損害保険の代理店。当社の議決権の30.53％を保有し、当社は同社を通して損害保険に加入している）は related-candidates.json に無いため、関連企業には結んでいない。
- businessModel: 品目別の売上高は千円額を百万円に切り捨てており、4品目の合計は印字の合計と2百万円異なる（切り捨てによる差異）。印字の合計をそのまま引用した。
- businessModel: 段ボール製品は受注生産だが期末の受注残高が少ないため販売実績を受注とみて差し支えない旨の印字のみで、受注高の金額は書いていない。
- businessModel: 段階利益の金額・増減理由、キャッシュ・フローの金額、設備の帳簿価額は書いていない。
- businessStructure: 単一セグメントのため、品目別の売上高はMD&Aの販売実績の印字（千円額を百万円に切り捨て）を使った。4品目の切り捨て後の合計は5,951百万円で、印字の売上高合計5,953百万円と2百万円異なる（切り捨てによる差異）。
- businessStructure: 設備の状況では事業所ごとにシート・ケース等の生産品目が印字されるが、事業は単一のため品目区分（children）で表現した。帳簿価額は書いていない。本社と包装設計デザイン研究所はどの品目にも結びつけていない。
- businessStructure: 段ボール原紙の製造は1984年に開始したが、製紙事業部の原紙部門は2001年に廃止されており、現在の事業には含めていない。
- businessStructure: 旧スキーマのため suppliers キーは書かず、原材料の仕入先の個別名は有報に印字されていない。
- history: 各事業部の新設・統合・改称のうち、1979年大阪事業部、1981年栃木事業部、1985年三重事業部、1986年茨城事業部と湘南事業部への改称、1990年仙台事業部、1992年京都事業部、1995年京都ケース事業部、1996年段ボールパレット事業部と茨城シート事業部、1997年会津事業部と京都事業部の統合、1998年茨城事業部の統合、2003年大阪事業部内のケース部門、2004年千葉事業部とレーベル群馬事業部、2006年包装設計デザイン研究所、2008年埼玉事業部への移設・改称は項目にしていない。
- history: 日本工業規格表示許可工場（1973年）やISO9002の審査登録（2000年）、ISO9001への移行更新（2003年・2009年）などの認証関係は項目にしていない。
- history: 各項目に資本金の金額は書いていない（1965年の設立時の資本金も含む）。
- history: Wikipedia は業界の一覧記事のみで当社の記事ではないため、補足には使っていない。
- industry: 主たる業界は、紙製品の製造に直接当たる区分が閉じた集合に無いため、紙・パルプに最も近い chemicals を暫定とした。段ボールシート・ケース等の紙器・梱包資材の製造販売が単一セグメントで売上高の全てを占める。
- industry: ＤＥＩの別記事業は cte である。
- relatedCompanies: サンオオムラ株式会社（その他の関係会社。損害保険の代理店。2026年3月31日現在の議決権の被所有割合30.53％。当社は同社を通して損害保険に加入している）は候補リストに無いため結べなかった。
- relatedCompanies: air-water（エア・ウォーター）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字がないため結ばなかった。
- relatedCompanies: asahi-rubber（朝日ラバー）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: bull-dog-sauce（ブルドックソース）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: daio-paper（大王製紙）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: france-bed-holdings（フランスベッドホールディングス）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: minebea-mitsumi（ミネベアミツミ）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: nhk-spring（日本発条）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: onward-holdings（オンワードホールディングス）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: t-and-d-holdings（Ｔ＆Ｄホールディングス）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: yokohama-financial-group（横浜フィナンシャルグループ）: 特定投資株式としてのみ印字され、保有目的は全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: japan-pulp-and-paper（日本紙パルプ商事）: 債権・債務の相手先内訳に金額とともに載るだけで、取引の内容の印字がないため結ばなかった。
- relatedCompanies: nitta（ニッタ）: 債権・債務の相手先内訳に載るだけで、取引の内容の印字がないため結ばなかった。
- relatedCompanies: daiwa（大和）: 印字されているのは大和商会で株式会社大和とは別法人であり、相手先内訳のみのため結ばなかった。
- relatedCompanies: seki（セキ）: 「情報セキュリティ」の部分文字列の一致のみのため結ばなかった。
- relatedCompanies: path（パス）: 「パスワード」の部分文字列の一致のみのため結ばなかった。
- relatedCompanies: ray（レイ）: 「ディスプレイ」の部分文字列の一致のみのため結ばなかった。
- relatedCompanies: suzuki-6785（鈴木）: 役員の氏名（鈴木孝明）の一致のみのため結ばなかった。
- terms: 助言のみ。用語候補: 段ボールシート、段ボールケース、段ボール原紙、紙器、小ロット・多品種生産、受注生産、包装設計

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 大村紙業（ohmura-shigyo）の段ボールシート・ケース事業 → 提案: paper-pulp（紙・パルプ）。紙器・梱包資材（段ボールシート、段ボールケース、ラベル）の製造販売が単一セグメントで売上高の全てを占めます。紙製品の製造に直接当たる区分が閉じた集合（INDUSTRY_IDS）に無いため、紙・パルプに最も近い chemicals を暫定としました。
