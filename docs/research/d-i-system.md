# ディ・アイ・システム — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ディ・アイ・システム |
| 証券コード | 4421 |
| docID（データを取り出した文書） | `S100XCIO` |
| 原本 docID | `S100XCIO` |
| 提出日（原本） | 2025-12-23 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XCIO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ディ・アイ・システム / 4421 / docID S100XCIO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
d-i-system: 10 件の数値を有報XBRLと照合
有報: 株式会社ディ・アイ・システム 有価証券報告書－第29期(2024/10/01－2025/09/30) (docID S100XCIO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
d-i-system: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記１（従業員数は就業人員であり、臨時雇用者数は年間の平均人員を外数で記載）は表示方法の事項のため warnings のみとし、financialNotes には入れなかった。注記は２件のみで、株式分割・株式併合、決算期変更、変則期間の記載はない。
- businessModel: 前期有報との修正再表示チェックは全系列で差異ゼロであり、訂正有報もないため、組替え・遡及適用に関する注記は記録していない。
- businessModel: 中長期ビジョン「Vision2028」の目標数値（2028年9月期の売上高・段階利益）や、経営指標としての営業利益率の目標値は、利益・投資指標の目標値のため本文・perspectives には書いていない。
- businessModel: 経営成績の分析にある段階利益の金額と理由、キャッシュ・フローの金額、受注高・受注残高の金額、設備の帳簿価額は書いていない。
- businessModel: 重要な後発事象に該当する事項は証拠パックの本文になく、提出後の追加書類も確認されていないため、needsReview には入れていない。
- businessModel: このツリーの旧スキーマに従い suppliers は省略した。協力会社のエンジニア活用の事実は businessStructure の warnings に記録した。
- businessStructure: 主要な設備は、本社・東京事業所・大阪事業所・名古屋事業所・福岡事業所ともセグメント欄が全社共通の扱いで特定の事業に結びついていないため、事業への紐付けは行わなかった。設備の帳簿価額は書いていない。
- businessStructure: このツリーの旧スキーマに従い suppliers は省略した。システムインテグレーション事業では案件対応のため協力会社のエンジニア（ビジネスパートナー）を活用している旨が経営成績の分析に印字されているが、個別の仕入先名は印字されていない。
- businessStructure: 主要な顧客ごとの情報は、売上高の10％以上を占める相手先がないため有報で省略されている。一方、事業等のリスクには総売上高に対するNTTドコモビジネス（旧NTTコミュニケーションズ）グループへの依存に触れた記述があり、同グループは顧客として意識されているが、法人としてはNTT株式会社とは別の会社であるため関連企業には結んでいない。
- businessStructure: 連結子会社はアスリーブレインズ株式会社、株式会社ステップコム、ウイーズ・システムズ株式会社の3社（いずれも議決権100％）で、自社の子会社であるため関連企業には結んでいない。
- history: 【沿革】の表は、年月セル38件と事象文42件が分離して印字されており件数が一致しないため、行順の対応づけは行わなかった。年月と事象が一体で印字されている冒頭の4行（1997年設立、1999年株式会社への変更、2000年一般労働者派遣事業許可、2002年本社の平河町移転）のみを登録し、残りは他の節で日付の裏付けが取れないため落とした。
- history: 落とした主な事象: 大阪支店の新設、教育サービス業務の開始、情報セキュリティマネジメントシステム（ISMS）やISO/IEC 27001、プライバシーマーク、ISO 9001の認証取得、アスリーブレインズ株式会社・株式会社ステップコム・ウイーズ・システムズ株式会社の株式取得、名古屋支店の新設、東京証券取引所JASDAQ（スタンダード）市場への上場、市場再編によるスタンダード市場への移行、セキュリティソリューション業務の開始、横浜・静岡・福岡のサテライトオフィス新設、本社の東京都千代田区丸の内への移転など。
- history: 資本金の増資は各年月に複数回印字されているが、沿革に資本金額は書かない規則のため登録していない。
- industry: 主たる業界は it とした。システムインテグレーション事業が外部売上高の約9割を占め、教育サービス・セキュリティソリューション事業もIT研修とセキュリティ製品という情報サービスであるため。
- industry: human-resources は付けなかった。教育サービスはITエンジニア育成のためのIT研修であり、人材サービスとして独立開示された事業ではないため。2000年に取得した一般労働者派遣事業許可も、現在のサービス提供形態の一部にとどまる。
- industry: telecommunications は付けなかった。通信事業者は顧客であり、同社は通信事業そのものを行っていないため。
- industry: DEIの別記事業は CTE である。
- relatedCompanies: broadband-security（株式会社ブロードバンドセキュリティ）: 標的型メール訓練サービスを協業して提供している旨が個別に印字されているため business-partner として結んだ。
- relatedCompanies: ntt（NTT株式会社）: 印字されている相手はNTTドコモビジネス（旧NTTコミュニケーションズ）グループであり、NTT株式会社とは別の法人のため結ばなかった。代替として親会社も結んでいない。
- relatedCompanies: sumitomo-electric-industries（住友電気工業株式会社）: 「楽々WorkflowⅡ」「楽々Framework3」が同社の登録商標である旨の注記のみで、同社との取引・提携の印字がないため結ばなかった。
- relatedCompanies: step（株式会社ステップ）: 自社の連結子会社である株式会社ステップコムの名称の部分一致のため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エンドユーザ」等の一般語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: ray（株式会社レイ）: 「アスリーブレインズ」等の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: base-4481（ベース株式会社）: 「データベース」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: como（株式会社コモ）: 一般語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: taya（株式会社田谷）: 大株主の住所（東京都世田谷区）の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーションが期待される」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「DXレポート」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 中長期ビジョン「Vision2028」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: freee（freee株式会社）: 「フリーレント家賃」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: rent（株式会社レント）: 「フリーレント家賃」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 「コロナ禍」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: コードリストになく、新株予約権の文脈の部分一致のみのため結ばなかった。
- relatedCompanies: will（株式会社ウィル）: 「コンピュータウィルス」の文言の部分一致のみのため結ばなかった。
- relatedCompanies: 大株主の株式会社NAM（35.34％、2025年9月30日現在）は候補に含まれておらず、取引・提携の印字もないため結んでいない。その他の大株主は個人と社員持株会である。
- relatedCompanies: 株式の保有状況は「該当事項はありません」と印字されており、政策保有株式によるリンクはない。
- relatedCompanies: 連結子会社3社（アスリーブレインズ株式会社、株式会社ステップコム、ウイーズ・システムズ株式会社）は自社の子会社のため結んでいない。
- terms: 用語の助言: 「WEEDS Trace」は連結子会社のウイーズ・システムズ株式会社が企画・開発した、特権IDの管理と重要情報の保護のためのセキュリティソフトウェア製品群の同社における呼称です。「ためログ」は同社が開発したログ管理ソリューション「Syslog Watcherアプライアンス」の愛称です。「スクラッチ」はソフトウェアパッケージ製品を利用せず最初から全てを設計開発することを指す同社の定義です。「ビジネスパートナー」は外注先企業に在籍しているエンジニアを指す同社の用語です。これらはいずれもこの会社の文脈でのみ用いるのが適切です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
