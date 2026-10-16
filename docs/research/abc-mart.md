# エービーシー・マート — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エービーシー・マート |
| 証券コード | 2670 |
| docID | `S100Y5F0` |
| 提出日 | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5F0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エービーシー・マート / 2670 / docID S100Y5F0（id は英語表記「ABC-MART,INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
abc-mart: 10 件の数値を有報XBRLと照合
有報: 株式会社エービーシー・マート 有価証券報告書－第41期(2025/03/01－2026/02/28) (docID S100Y5F0)
前期有報との比較: 20 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
abc-mart: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: description（一文、90文字以内・句点1つ）は「靴を中心に自社ブランドや他社ブランドの商品を企画・仕入れし、小売店「ABC-MART」などで国内外に販売する会社です。」とした（59文字）。LaCrosse Footwear,Inc.グループによる製造機能はbusinessModel内で別途説明し、一文には含めなかった。
- businessModel: flow.revenue / flow.profit の金額は、有報の本文（経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析）に印字されている「○○億○○百万円」表記をそのまま引用した。品目別の213,855百万円等は【販売実績】の品目別表（百万円単位の列）をそのまま引用した。
- businessModel: flow.customer の『外部顧客への売上高の10％を占める相手先はありません』は、【関連情報】３．主要な顧客ごとの情報の記載（『10％を占める相手先がいないため、記載はありません』）を要約した。
- businessModel: businessModel.flow 内で既存の用語集エントリー [[term:segment|セグメント]] と [[term:consolidated-subsidiary|連結子会社]] を使用した（いずれも src/data/terms/ に既存）。
- businessModel: LaCrosse Footwear,Inc.グループの製造機能は報告セグメント『海外』に含まれ、製造単独の金額は開示されていないため、flow.offering では定性的な記述にとどめた（businessStructure工程の警告と同趣旨）。
- businessModel: businessModel の担当外のフィールド（businesses, name, shortNameEn, listings, industries, history, relatedCompanies）は扱っていない。
- businessStructure: name は officialName「株式会社エービーシー・マート」から法人格を除いた「エービーシー・マート」とした（掲載済みエントリーの慣例どおり）。
- businessStructure: shortNameEn は、有報の英訳名「ABC-MART,INC.」（nameEn として機械工程が設定済み）とは別に、本文中で繰り返し使われている小売ブランド名「ABC-MART」をヒーロー用ワードマークとして採用した。
- businessStructure: 報告セグメントは「国内」「海外」の2つのみ（有価証券報告書の【セグメント情報】）。並び順は外部顧客への売上高（当期：国内272,073百万円 > 海外106,550百万円）に基づく。
- businessStructure: 【関連情報】の地域ごとの情報（国内／韓国／その他海外）は、国内が国内セグメントと一致し、韓国＋その他海外の合計が海外セグメントの金額と一致する（当期：64,838＋41,712＝106,550）。ただしこれは【セグメント情報】本体でセグメントの下に名指しされた区分（富士電機の「分野」等）ではなく別建ての注記のため、今回は children として追加しなかった。地域の粒度をさらに出したい場合はこの注記を使えるが、追加は保留し人の判断に委ねる。
- businessStructure: LaCrosse Footwear,Inc.（米国）は靴の企画・製造・販売を行っているが、報告セグメント上は「海外」セグメントに含まれ、製造機能単独の金額は開示されていない。そのため businesses の説明は定性的な記述にとどめた。
- businessStructure: 業政方針、政策保有株式、関連当事者情報などは businessStructure の担当外のため扱っていない（担当フィールド: businesses, name, shortNameEn, listings）。
- history: history.txt の【沿革】は年月のセルが各事象の直前に1つずつ印字される通常の形で、崩れた表（年月セルのまとまりが先行する形）には当たらない。年月と事象の対応づけに推測は入っていない。
- history: 有報は26件の年月・事象を印字しているが、節目として13件を採用し、残り13件（商標ライセンス契約の締結・終了のみの事項〔1987年, 1991年×2, 1994年, 1995年〕、単位株制度移行のための形式的合併〔2000年4月〕、既に完全子会社だった「株式会社エービーシー・マート」の吸収合併〔2002年3月〕、広告代理子会社「株式会社エービーシー・コム」の設立〔2002年6月〕、持株比率の引き上げのみの事項〔2010年10月, 2011年3月〕、小規模子会社「株式会社ダブルジェイスタンダード」の吸収合併〔2019年9月〕）は、現在の事業構造を説明する上での重要度が低いと判断し省いた。
- history: 沿革本文末尾の「（2026年２月末現在(連結ベース)　国内店舗数 1,107店舗、海外店舗数 398店舗)」は特定の年月に紐づく出来事ではない注記のため、history の1項目としては採用しなかった。
- industry: 有報【事業の内容】は、靴を中心とした商品の販売及び自社商品の企画開発を主たる事業とすると明記しており、国内・海外の2報告セグメントとも小売店「ABC-MART」等を通じた小売販売が中核。INDUSTRY_IDS に footwear/apparel の専用区分は無く、掲載済みエントリーの慣例（ファーストリテイリング・ニトリホールディングス・良品計画・セブン&アイ・ホールディングスなど）に揃え retail を primary とした。
- industry: 米国子会社LaCrosse Footwear,Inc.グループは靴の企画・製造・販売を行っているが、報告セグメント上は『海外』セグメントに含まれ製造機能単独の金額は開示されていない。また、自社ブランドの企画・製造機能を持つ点はファーストリテイリング（SPA業態）と同種の構造で、同社も industries は retail のみとしている慣例に合わせ、二次業界（製造業に相当するもの）は付けなかった。
- industry: 半導体・IT・金融など他の INDUSTRY_IDS との重複は有報本文に記載がなく、該当しない。
- relatedCompanies: relatedCompanies を書く直前（2026-10-01）に src/data/companies/index.ts を再読した。oshman・lacrosse・skechers・puma・timberland・em-planning・mitsubishi-ufj・sumitomo-mitsui・mizuho・tokio-marine などの候補名で確認したが、以下の理由からいずれも結べる相手は無かった。
- relatedCompanies: 【株式の保有状況】で当社は『当社は、提出日現在、政策保有株式を保有しておりません』と明記している。純投資目的の株式（非上場株式以外64銘柄、貸借対照表計上額4,560百万円）は保有しているが、銘柄名が個別開示されておらず、かつ純投資目的（株式の価値の変動又は配当による利益が目的で、取引関係の維持・強化が目的ではない）と有報自身が明記しているため、政策保有株式の規則（取引関係のための保有のみ結ぶ）の対象外。メガバンク・大手損保（三菱UFJ・三井住友・みずほ・東京海上等、いずれも src/data/companies/ に登録済み）との関係も有報に記載が無く、結べない。
- relatedCompanies: 【持分法の適用に関する事項】で『持分法適用会社　該当事項はありません』と明記されており、持分法適用関連会社は無い。
- relatedCompanies: 連結子会社（ABC-MART KOREA,INC.、ABC-MART TAIWAN,INC.、ABC-MART VIETNAM Co.,Ltd.、ABC-MART SONAK Philippines,Inc.、LaCrosse Footwear,Inc.、株式会社オッシュマンズ・ジャパン等、国内2社・海外8社を含め連結子会社16社）はいずれも非上場の子会社で、有価証券報告書の提出会社ではなく、src/data/companies/ に独立した企業として登録される対象ではない。これらは businessStructure 工程で既に businesses の説明に含まれている。
- relatedCompanies: 【関連当事者情報】に記載の取引相手は、主要株主である個人（三木正浩氏、議決権9.54％、建物等の賃借取引）とその近親者（三木美智子氏、同2.99％、同種の賃借取引）、及び両氏の近親者が議決権の過半数（49.90％）を所有する合同会社イーエム・プランニング（東京都渋谷区、不動産賃貸管理業、建物等の賃借取引）のみ。個人、及び src/data/companies/ に登録される対象ではない非上場の合同会社のため結べない。
- relatedCompanies: 経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析（品目別販売実績の説明）に『スケッチャーズ』『プーマ』『ティンバーランド』の名が商品戦略の文脈で挙がっているが、仕入条件や契約関係など具体的な取引関係は印字されておらず、【株式の保有状況】【関連当事者情報】【関係会社の状況】のいずれにも現れない。これらのブランドを展開する企業は src/data/companies/index.ts にも未登録（今回の再読で確認済み）であり、商品名の言及のみから仕入先関係（supplier）を創作することになるため見送った。該当する企業が別途登録された場合、取引の向きが印字されていないので business-partner として再検討する価値はある。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: terms 工程は助言のみでエントリーには書き込まない（担当フィールド無し）。requiredTermIds と proposedTerms はここに記録するだけで、アセンブラ（merge-fragments.mjs）が『助言工程なのでエントリーには書き込みません』という想定どおりの警告を出して無視する。
- terms: requiredTermIds: businessModel工程の flow 内で [[term:segment|セグメント]] と [[term:consolidated-subsidiary|連結子会社]] を使用した。どちらも src/data/terms/ に既存（segment.json, consolidated-subsidiary.json）であることを確認済み。
- terms: proposedTerms: 今回abc-martのために書いたテキスト（businessModel, businessStructure, history, industry, relatedCompanies）の中に、既存の用語集で説明されておらず新規に立てる価値のある専門用語は見当たらなかったため、提案なし。

## 要確認（status に反映）

- businessStructure: financials/employees について: indicators.txt の【主要な経営指標等の推移】には従業員数の行がはっきり印字されている（5,974／6,120／6,261／9,075／9,101名、各期末、平均臨時雇用者数は別掲）。しかし summary.json / draft-entry.json / 既存の figures-only エントリーでは employees が全年 null になっている。employees は businessStructure の担当フィールドではなく financials（機械工程）の担当のため自分では直せないが、機械抽出が実際には存在する従業員数タグを拾えていない可能性があるので、financials を再確認してほしい。
