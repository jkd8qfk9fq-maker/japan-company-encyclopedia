# スローガン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スローガン株式会社 |
| 証券コード | 9253 |
| docID（データを取り出した文書） | `S100Y4UP` |
| 原本 docID | `S100Y4UP` |
| 提出日（原本） | 2026-05-19 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y4UP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スローガン株式会社 / 9253 / docID S100Y4UP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
slogan: 10 件の数値を有報XBRLと照合
有報: スローガン株式会社 有価証券報告書－第21期(2025/03/01－2026/02/28) (docID S100Y4UP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
slogan: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…後の2026年4月には、内発的動機と利益を循環させる独自の経営パラダイム「循…）

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記1（2021年11月のマザーズ上場に伴う新規公開価格による希薄化計算）と注記2（従業員数の定義）は表示上の注記であり、financialNotesには入れず警告として記録した。
- businessModel: MD&Aに記載の2027年2月期の計画値（売上高等）や経営上の目標指標は将来の目標・計画であり、本文には書かず警告として記録した。
- businessModel: キャリアサービス分野の内訳（学生向け1,280百万円、社会人向け122百万円）の切捨て合計は1,402百万円で、分野計の印字1,403百万円と1百万円異なる。千円単位では一致しており、印字どおりに記載した。
- businessModel: 自己株式の取得（当連結会計年度に自己株式79,245千円を取得）は資本政策の事項であり、警告のみとした。
- businessStructure: 報告セグメントは「新産業領域における人材創出事業」の単一セグメントであり、セグメント注記に分野別の金額はない。分野別の金額はMD&Aの販売実績（事業部門別）の印字を用いた。
- businessStructure: キャリアサービス分野の内訳は、学生向け1,280百万円と社会人向け122百万円の切捨て表示の合計が1,402百万円となり、分野計の印字1,403百万円と1百万円異なる（千円単位では内訳合計1,403,215千円と一致）。印字どおりに記載し、警告として記録する。
- businessStructure: 動画×経験学習プラットフォーム「メタノビ」は決算日後の2026年3月にサービスを終了したため、事業の子区分には含めず、needsReviewと沿革に記録した。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。個別の仕入先・業務委託先は有報に記載がない。
- history: 本社移転（2008年・2012年）、京都支社の開設・移転・統合（2012年・2021年・2024年）、大阪支社の開設・統合（2016年・2020年）は拠点の異動であり、沿革には含めなかった。
- history: 2016年のスローガンアドバイザリー株式会社の設立と「Goodfind Career」の運営移管は、2021年の吸収合併の項目に統合して記録した。
- history: 2026年3月の「メタノビ」終了と2026年4月の「Goodfind Career」終了は決算日（2026年2月28日）後の出来事であり、有報の沿革に印字されているため沿革に含め、needsReviewにも記録した。
- history: 資本金の金額は沿革に書かなかった。
- industry: 主たる業界は、単一セグメントである新産業領域における人材創出事業で決めた。同事業の中心は「Goodfind」をはじめとする人材紹介・キャリア支援サービスであり、human-resources（人材サービス）に直接当てはまるため、暫定分類やtaxonomyGapsは付けなかった。副業界は付けなかった。メディア・SaaS分野（FastGrow、TeamUp）は同セグメント内の一分野であり、プラットフォーム全体が新産業領域への人材の移動を支える一体の事業として開示されているためである。
- relatedCompanies: career（キャリア）: 「キャリアサービス」等の一般語であり、相手についての記載はないため結ばなかった。
- relatedCompanies: port（ポート）: 「サポート」の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 「イノベーション人材」の一般語であり、相手についての記載はないため結ばなかった。
- relatedCompanies: vision（ビジョン）: 一般語であり、相手についての記載はないため結ばなかった。
- relatedCompanies: land（ランド）: 「ブランド」の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「データベース」の一般語であり、相手についての記載はないため結ばなかった。
- relatedCompanies: corona（コロナ）: 「新型コロナウイルス感染症」の語であり、相手についての記載はないため結ばなかった。
- relatedCompanies: insight（インサイト）: 「インサイト（洞察）」の一般語であり、相手についての記載はないため結ばなかった。
- relatedCompanies: king（キング）: 「ロジカルシンキング」の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: path（パス）: 「パーパス」の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: seki（セキ）: ambiguous な部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: nissin（ニッシン）: コードリストにない名称であり、相手についての記載もないため結ばなかった。
- relatedCompanies: 伊藤豊氏（所有割合23.05％）、織田一彰氏（同11.96％）、仁平理斗氏（同3.02％）は個人の大株主であり、関連会社候補ではないため結ばなかった。
- relatedCompanies: Reapra Ventures Pte. Ltd.（所有割合21.48％）はシンガポールの未上場の投資会社であり、related-candidates に含まれないため結ばなかった。
- relatedCompanies: KMFG株式会社（所有割合4.06％）は大株主の状況に載るが、related-candidates に含まれず、有報に同社との取引・提携の記載もないため結ばなかった。
- relatedCompanies: チームアップ株式会社（連結子会社）、ＵＴ創業者の会有限責任事業組合・ＵＴ創業者の会投資事業有限責任組合（持分法適用関連会社）は当社グループ自身の会社・組合であり、結ばなかった。
- terms: 用語の助言: 「新産業領域」は、スタートアップ・ベンチャー企業や大企業の新規事業など、新しい産業を生み出す領域を指す同社の表現です。「インキュベーションパートナー」は、「Goodfind」等で学生や若手社会人に伴走するキャリアコンサルタントを指す同社の呼称です。「循環経営」は、内発的動機が生み出す利益を人の可能性への再投資につなげる同社独自の経営パラダイムを指します。

## 要確認（status に反映）

- businessStructure: 動画×経験学習プラットフォーム「メタノビ」は、決算日後の2026年3月にサービス提供を終了しています（財務規律に基づくポートフォリオ最適化のため）。本登録は2026年2月28日現在の構造で登録しています。
- businessStructure: 社会人向けキャリアサービス「Goodfind Career」は、決算日後の2026年4月にサービス提供を終了しています（財務規律に基づくポートフォリオ最適化のため）。本登録は2026年2月28日現在の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
