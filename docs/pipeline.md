# 登録パイプライン

企業1社を登録するまでの11工程と、各工程の担当。1社ずつ手作業で調べる方式を置き換えるもので、
**機械にできることは機械が1度だけやる**（§31: 同じ情報を二度調べない）のが設計の芯である。

| # | 工程 | 担当 | 成果物 |
|---|---|---|---|
| 1 | identity | `scripts/pipeline/run-mechanical.mjs` | EDINET の日次インデックスから提出者・証券コード・docID を確定 |
| 2 | edinet | 同上 | `evidence/<id>/` の証拠パックと `draft-entry.json`（5年×6指標） |
| 3 | businessStructure | エージェント | `pipeline/results/<id>-businessStructure.json` |
| 4 | history | エージェント | 同上 |
| 5 | businessModel | エージェント | 同上 |
| 6 | industry | エージェント | 同上 |
| 7 | relatedCompanies | エージェント | 同上 |
| 8 | terms | エージェント（助言のみ） | 同上 |
| 9 | sourceValidation | `scripts/pipeline/finalize.mjs` | 出典と docID の照合、数値の再照合 |
| 10 | qualityControl | 同上 | スキーマ＋整合性ルール |
| 11 | registration | 同上 `--register` | エントリー・index・改訂記録・リサーチログ |

3〜8 は2つのグループに分けて実行する（`AGENT_STAGE_GROUPS`）。
グループ1 = businessStructure, history。グループ2 = businessModel, industry, relatedCompanies, terms。
**エージェントは常に1つずつ動かす。** このプロジェクトでは並列実行がセッションのレート制限で
毎回止められており、エージェントを安くしても解決しなかった。

工程9〜11 は組み上げたエントリーを `pipeline/staging/` に置いて**そこで**検査する。
`src/data/companies/` に入るのは全ての検査を通ったあとだけで、登録中に失敗した場合は
書いたファイルを全て元に戻す。git 操作はしない（§29）。コミットは人が行う。

状態は `pipeline/state/<id>.json`。`node scripts/pipeline/company-state.mjs` で一覧、
`… <id>` で1社分と次のエージェント作業が出る。成果物から状態を復元する `syncAgentStages` が
あるので、エージェント側は状態ファイルを触らなくてよい。

---

## エージェントへの作業要領

この節は、工程3〜8 を担当するエージェントにそのまま渡すためのもの。
**この要領に書かれていることは、依頼文より優先する。**

### 証拠

証拠パックが `evidence/<company-id>/` にある（`RESEARCH_CACHE` 配下）。`brief.md` が要約で、
最初に読むべきもの。`sections.json` に有報の全文が節ごとに入っているので、`brief.md` で
足りないときはそこを検索する。`draft-entry.json` は identity と5年分の財務で、機械的に
取得・照合済み。

**同じ情報を二度調べない（§31）。** 必要なものはほぼ確実にパックの中にある。EDINET を
取り直さない。パックに無くてどうしても要る事実があるときだけ web を見て、`warnings` にそう書く。

### 成果物の形

`pipeline/results/<company-id>-<stage>.json` に、工程ごとに1ファイル。

```json
{
  "companyId": "...",
  "agent": "<stage>-agent",
  "status": "completed",
  "data": { "…この工程が担当するフィールドだけ…" },
  "sources": [{ "id": "yuho-2026", "title": "…", "publisher": "…", "url": "https://…", "publishedAt": "YYYY-MM-DD", "accessedAt": "YYYY-MM-DD" }],
  "warnings": ["判断の記録・省いたものとその理由"],
  "needsReview": ["人が見る必要があるものだけ"]
}
```

`needsReview` が空でないと企業全体が `needs-attention` になる。判断の記録は `warnings` に書く。

`sources` は `src/lib/content/schemas.ts` の `sourceSchema` と**完全に一致**させる。
`strictObject` なので、`id, title, publisher, url, publishedAt?, accessedAt` 以外の
キーがあると検証で落ちる。**`kind` というキーは存在しない。**

### 担当フィールド（これ以外を書くと組み立て時に捨てられる）

| 工程 | `data` に書けるキー |
|---|---|
| businessStructure | `businesses`, `name`, `shortNameEn`, `listings` |
| businessModel | `businessModel`, `description` |
| history | `history` |
| industry | `industries` |
| relatedCompanies | `relatedCompanies` |
| terms | なし（助言のみ。`requiredTermIds` と `proposedTerms` を書くと、捨てた旨の警告が出る。それが想定どおり） |

型は `src/types/company.ts`。既に登録済みの企業（`src/data/companies/suzuki.json` など）が
文体の見本。

### リンク記法

`[[kind:id|表示する言葉]]`。**ラベルは必須**で、`[[term:segment]]` は検証で落ちる。
`kind` は term / company / industry / feature。リンク先が存在しないと落ちるので、
**提案中の用語にはリンクしない。**

リンクとして描画されるのは RichText を通すフィールドだけで、それ以外に書くと読者に
`[[term:segment|セグメント]]` がそのまま見える（整合性ルールが拒否する）：

| 書ける | 書けない |
|---|---|
| `description`（一文の説明） | `relatedCompanies[].description`（カード全体がリンクの内側） |
| `businesses[].description`（`children[]` も同じ） | `products` / `customers` / `revenueSources` |
| `businessModel.description` | `businessModel.flow[].title` |
| `businessModel.flow[].description` | `financials[].note` |
| `history[].description` / `.significance` | `name` などの識別情報 |

### 守ること

1. **捏造しない。** 有報に書かれていないことは書かない。書けないときは省いて `warnings` に理由を書く。
   宣言された欠落は、もっともらしい作り話より常に良い。
2. **投資サービスではない。** 株価・PER・PBR・ROE・ROA・EPS・配当利回り・目標株価・買い推奨・
   売り推奨・自己資本利益率・時価総額・配当性向・1株当たり は使わない。
3. **やさしい日本語**（です・ます）。その会社を全く知らない読者に向けて書く。
4. 金額は有報の印字どおりの単位で、年度を添えて書く。
5. `src/data/` に書き込まない。git を触らない。自分の成果物ファイル以外を作らない・変えない。

### 事業の並び順

有報が「報告セグメントに含まれない」（「レポーティングセグメントに含まれない」等の言い回しも同じ）と
書いている区分は、売上高がいくらであっても最後に置く。それ以外は外部顧客に対する売上高の大きい順。

**決めるのは有報の位置づけで、名前ではない。** 「その他」という名前だから最後、ではない。
有報が報告セグメントの1つとして扱っている「その他」は、他の報告セグメントと同じ資格なので
売上高の順に置く。有報自身が「報告セグメントに含まれない」と書いているものだけが最後に行く。
掲載済みエントリーでも「その他」系51ノードのうち7つは売上高順のまま末尾にない。それは誤りではない。

**単一セグメントの会社**（「電子部品事業の単一セグメント」など）では報告セグメントが1つしかない。
そのときは【関連情報】の「製品及びサービスごとの情報」の製品区分を `children` に使ってよく、
親の `businesses` はその単一セグメント1ノードになる。製品区分の「その他」は上の原則どおり、
ただの製品区分なので売上高の順に置く（名前を理由に最後にはしない）。

### 沿革の日付が崩れている表

有報の沿革は本来「年月／沿革」の2列で、平坦化したテキストでも各事象の直前に年月が印字される。
ただし一部の会社では、**年月のセルがまとまって先に印字され、そのあとに事象文が連続する**崩れ方をする。
そのときは次で切り分ける。

- **年月の数と事象文の数が違う → 壊れている。** 位置で対応づけてはいけない。
  他の箇所（事業の内容・注記・経営者による分析・別の沿革行の括弧書き）で日付が裏付けられる行だけを使う。
  京セラの2013年10月〜2026年4月のブロックは年月22件に対し事象24件で、位置で対応づけると
  「Kyocera Industrial Tools, Inc. の株式譲渡」が2026年4月になるが、同じ有報の注記13と
  経営者による分析はどちらも2026年1月と印字している。
- **数が一致している → 使える。** 平坦化は各グループ内の行順を保つので、i番目の年月はi番目の事象のもの。
  これは表の構造そのもので、推測ではない。`warnings` に「対応づけを復元した」と書く。
  数が一致していても、行順以外の裏付け（「2回目」のような本文中の順序表記、以降の行が使っている社名、
  表紙の記載など）があるブロックのほうが確度は高い。行順だけが根拠のときは、`warnings` にそう書く。

裏付けの取れない行は、年を推測して書くのではなく落とす。落としたものは `warnings` に列挙する。

### 表を読むときの注意

**内数の列が行の中に挟まる。** 【関連情報】の地域ごとの情報は、ヘッダーが
「日本／北米／欧州／アジア／オセアニア／その他／合　計」と並んでいても、数値の並びには
北米の直後に「内、米国」の**内数**が入っていることがある（ヘッダーの2行目に印字されるため、
平坦化したテキストでは末尾に見える）。素直に足すと合計に合わない。内数列かどうかは、
その値が直前の地域の値以下に収まるかで判定できる。三菱自動車の当期・前期とも、3番目の数値が
北米の内数の米国だった。

**合計と数百万円ずれるのは有報自身の丸め。** 各セルが百万円に丸められ、合計は丸める前の値の
和を丸めたものなので、6セルの横計は合計と ±数百万円ずれる。抽出の誤りではないので、
「合わないから使わない」ではなく、印字されている合計をそのまま引用する。

迷ったら、照合できる数値だけを引用して `warnings` に書く。
### 終わったら

```
node scripts/pipeline/merge-fragments.mjs <company-id>
```
「この工程は『X』を書けません」という警告が出ないことを確認する。出たら直す。
`--write` は付けない（登録は `finalize.mjs` の仕事）。
