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
| `businesses[].description` | `products` / `customers` / `revenueSources` |
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

有報が「報告セグメントに含まれない」と書いている区分は、売上高がいくらであっても最後に置く。
それ以外は外部顧客に対する売上高の大きい順。

### 終わったら

```
node scripts/pipeline/merge-fragments.mjs <company-id>
```
「この工程は『X』を書けません」という警告が出ないことを確認する。出たら直す。
`--write` は付けない（登録は `finalize.mjs` の仕事）。
