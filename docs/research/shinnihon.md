# 新日本建設 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 新日本建設株式会社 |
| 証券コード | 1879 |
| docID（データを取り出した文書） | `S100YHI2` |
| 原本 docID | `S100YHI2` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHI2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 新日本建設株式会社 / 1879 / docID S100YHI2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shinnihon: 10 件の数値を有報XBRLと照合
有報: 新日本建設株式会社 有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YHI2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
shinnihon: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報との重複年度が全行一致し、決算期変更・変則決算・会計基準変更の印字もないため financialNotes は空としました。
- businessModel: Wikipedia「新日本建設」は証券コード1879で同一性を確認しましたが、内容は有報で確認できる範囲（千葉市美浜区の本社、自社一貫体制）にとどまるため、補足には使っていません。
- businessModel: 受注高・繰越高は本文ルール（財務数値は売上高と当期純利益だけ）のため記載していません。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高（2026年3月期：建設事業83,620百万円、開発事業等54,807百万円）の大きい順としました。
- businessStructure: 建設事業・開発事業等とも、区分ごとの金額の独立開示がないため、children には金額を書いていません。
- businessStructure: shortNameEn は表紙の英訳名 SHINNIHON CORPORATION から採りました。
- history: 1923年の創業と1949年の継承は【沿革】の前文の印字に基づきます。
- history: 1969年2月の行は「資本金1百万円の株式会社に改組」と印字されていますが、資本金の金額は本文ルールのため記載していません。
- history: 沿革の表は年月と事象が対応して印字されており、崩れた表ではないため行順どおりに記載しました。
- industry: 主たる業界は、最大セグメントの建設事業（2026年3月期の外部顧客への売上高83,620百万円）から construction としました。
- industry: 開発事業等（同54,807百万円）は不動産の開発・販売・賃貸・管理が本体のため real-estate を2つ目に付けました。
- relatedCompanies: オリエンタルランド（oriental-land）: 特定投資株式の保有目的に「工事の受注先であり、取引関係の維持・強化を目的として保有しております」と銘柄固有の取引内容が印字されているため customer として結びました。
- relatedCompanies: 千葉銀行（the-chiba-bank）・京葉銀行（the-keiyo-bank）・千葉興業銀行（the-chiba-kogyo-bank）・三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）: 特定投資株式の保有目的は「主要取引金融機関として資金の調達、決済および運用等の金融取引…」という金融機関共通の定型記載が理由の中心であり、銀行・金融機関は資金調達・金融取引が理由の場合は結ばない規則のため不採用としました（大株主の状況に載る銀行も、純投資・信託口を含む金融機関のため major-shareholder にはしていません）。
- relatedCompanies: トラスト（trust）: 日本マスタートラスト信託銀行（信託口）の部分一致で、コードリストになく純投資のため不採用としました。
- relatedCompanies: 東京瓦斯（tokyo-gas）: 有報の印字は子会社の東京ガス不動産が繰越工事の発注者として載るのみで、東京瓦斯自体との取引・提携の印字がないため不採用としました。
- relatedCompanies: 三菱HCキャピタル（mitsubishi-hc-capital）: 子会社の三菱HCキャピタルエステートプラスが繰越工事の発注者として載るのみで、同社自体との取引・提携の印字がないため不採用としました。
- relatedCompanies: ゴールドクレスト（goldcrest）: 当期完成工事の発注者として1件載るのみで、継続的な取引・提携の印字がないため不採用としました。
- relatedCompanies: 鈴木（suzuki-6785）: ambiguous で、取締役の個人名（鈴木達也）の部分一致のため不採用としました。
- relatedCompanies: ベース（base-4481）・リスキル（reskill）・セキ（seki）・ゼロ（zero）・ニックス（nix）・エステー（s-t）: 一般語・部分一致の誤マッチ（「ベースにした」「リスキル」「セキュリティー」「ZEH」「フェニックス・キャピタル」「エステートプラス」）のため不採用としました。
- relatedCompanies: 株式会社シンニホンコムは【関係会社の状況】で「その他の関係会社」（2026年3月31日現在、当社の議決権の33.7％を所有、設立者である取締役会長の財産保全会社）と印字されていますが、非上場で関連企業候補に含まれないため結んでいません。
- relatedCompanies: 連結子会社3社（新日本コミュニティー、新日本不動産、建研）はいずれも非上場で関連企業候補に含まれないため結んでいません。
- terms: 用語候補： 自社製販一貫体制（用地取得から企画・設計・施工・分譲・管理・アフターサービスまでをグループで行う同社独自の体制）、EXCELLENT CITY（同社の自社ブランドマンションのシリーズ名）、ZEH-M（ネット・ゼロ・エネルギー・ハウス基準の集合住宅）、特命受注（競争によらず指名で受ける受注）、アウトフレーム工法（建物の外側にフレームを設ける耐震補強工法。子会社の建研が手がける）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
