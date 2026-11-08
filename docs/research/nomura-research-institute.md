# 野村総合研究所 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社野村総合研究所 |
| 証券コード | 4307 |
| docID（データを取り出した文書） | `S100YBM8` |
| 原本 docID | `S100YBM8` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBM8.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E9%87%8E%E6%9D%91%E7%B7%8F%E5%90%88%E7%A0%94%E7%A9%B6%E6%89%80

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社野村総合研究所 / 4307 / docID S100YBM8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nomura-research-institute: 10 件の数値を有報XBRLと照合
有報: 株式会社野村総合研究所 有価証券報告書－第61期(2025/04/01－2026/03/31) (docID S100YBM8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nomura-research-institute: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…グとITソリューションの提供を通じて利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 当第1四半期連結会計期間に報告セグメントの区分が一部変更され、前期のセグメント数値は変更後の区分に組み替えて記載されている（MD&Aの「遡及修正」はこの組替えを指す）。連結の売上収益・純利益などの経営指標そのものに修正再表示はなく、financialNotes には書かなかった。
- businessModel: 2026年3月期の純利益の減少要因は、MD&Aの説明どおり豪州・北米事業ののれん等に係る減損損失の計上である。減損損失やセグメント利益の金額は文章の規則により書かなかった。
- businessModel: 後発事象の自己株式の取得（2026年4月24日決議、2026年6月1日に取得終了）は資本政策の手続きで、有報提出前に完了し開示されているため本文には書かなかった。
- businessModel: 通称「NRI」は Wikipedia の冒頭による補足で、出典に wikipedia を加えた。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上収益の大きい順とした（金融ITソリューション399,792百万円、産業ITソリューション271,241百万円、IT基盤サービス77,039百万円、コンサルティング63,556百万円）。
- businessStructure: 報告セグメントに含まれない「その他」（外部顧客への売上収益3,077百万円）は事業に含めなかった。
- businessStructure: 当第1四半期連結会計期間に報告セグメントの区分が一部変更され、前連結会計年度の数値は変更後の区分で記載されている。本文は現在の区分で書いた。
- businessStructure: 各事業の「主要な関係会社」は【事業の内容】の記載から主なものを挙げた。
- history: 【沿革】は（合併前）（合併以降）の2部構成で、年月のセルと事象文が対応する通常の表のため、行順どおりに読んだ。
- history: 海外事務所の開設やデータセンターの竣工など細目の出来事は多数あるため、会社の形を変えた出来事と事業の節目を優先して採用した。
- industry: 売上の大半がコンサルティングとITソリューションの報告セグメントで占められるため、主たる業界は it のみとした。
- relatedCompanies: 野村證券株式会社: 【事業の内容】で関連当事者として当社グループがシステム開発・製品販売及び運用サービスを提供していると書かれているが、related-candidates.json の候補にないため結ばなかった。
- relatedCompanies: セブン銀行・水戸証券・東洋証券・アイザワ証券グループ・いちよし証券・極東証券・岡三証券グループ・ふくおかフィナンシャルグループ・三菱鉛筆・オンワードホールディングス・ハイマックス: 特定投資株式の表に載るだけで、相手ごとの取引・提携の記述がないため結ばなかった。
- relatedCompanies: 東邦システムサイエンス: 特定投資株式の表に載るだけで取引の個別記述がなく、listing も「（コードリストにない）」のため結ばなかった。
- relatedCompanies: NTT: 本文の言及は子会社のNTTドコモビジネス株式会社に対するもので、同社自体への言及ではないため結ばなかった。
- relatedCompanies: 味の素: 【沿革】の言及は子会社だった味の素システムテクノ株式会社（現NRIシステムテクノ株式会社）に対するもので、同社自体との関係ではないため結ばなかった。
- relatedCompanies: 三菱ケミカルグループ: 役員の略歴での言及のみで、取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: ゼロ・ランド・ポート・コア・ステップ・セキュア・テクノロジーズ・リード・ビジョン・イノベーション・レイ・キャリア・コモ・フリー・アイル・ウィル・ベース・キューブ・キング・高速・パス・トラスト: 一般語やグループ会社名の一部への一致で、同社自体への言及ではないため結ばなかった。
- terms: 助言: 「コンソリューション」は用語集への登録候補です。ビジネスITを企画・構想する段階からコンサルティングとソリューションが並走し、顧客に継続的に価値を創出するビジネスモデルで、この会社の中核の考え方として有報に説明があります。
- terms: 助言: 「共同利用型システム」も登録候補です。証券業向けのTHE STARなど、複数の顧客が共同で利用するシステムを当社が開発・運用する形態で、1966年の「証券共同システム」以来の事業の柱です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
