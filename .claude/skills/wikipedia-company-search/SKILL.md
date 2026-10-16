---
name: wikipedia-company-search
description: 企業名から日本語版Wikipediaの記事を検索し、タイトル・抜粋・URLに整理して返す。調査の手がかり探し専用で、結果は出典にできず、既存データにも登録しない。「Wikipediaで〇〇を調べて」「企業名の表記ゆれ・関連記事を探したい」ときに使う。
---

# Wikipedia 企業検索（読み取り専用の補助）

**Wikipedia は出典にできない**（CLAUDE.md 不変条件 3。`wikipedia.org` を `sources` に入れると
`npm test` が失敗する）。このスキルの結果は「どこを一次資料で確かめるべきか」の手がかりであり、
`src/data/` へ書き込まない。書き込みが必要な事実は、有価証券報告書・決算短信・統合報告書・
企業の公式ページで裏取りしてから、`docs/pipeline.md` / `docs/research-protocol.md` の手順で登録する。

## 手順

1. ユーザーが指定した企業名を受け取る。複数ある場合は1回のコマンドにまとめる（内部で1秒間隔の逐次処理）。
2. 記事名が分かっている場合は、まず完全一致で取得する。
   ```
   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/research/wikipedia.mjs article --title "トヨタ自動車" --intro
   ```
   存在しなければ `null` が返る（エラーではない）。
3. `null` の場合、または記事名が不明な場合は検索する。
   ```
   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/research/wikipedia.mjs search "トヨタ自動車" --limit 5
   ```
   関連度順なので、企業の記事より「自動車」のような汎用記事が上位に来ることがある。
   タイトルが企業名と一致する候補を選び、必要なら手順2で本文を取り直す。
4. 本文が必要なときだけ `article` を使う。`--intro` を付けると導入部のみ（通常はこれで足りる）。
   `--page-id <ID>` でも取得できる。
5. 結果を次の形で整理して返す。
   - 記事タイトル / 抜粋（1〜2文） / URL / 最終更新日時 / 取得日時
   - 先頭に「**Wikipedia 由来（出典不可）**」と明記する。
   - 一次情報（公式資料）で確認すべき点を、分かる範囲で列挙する。
     一次資料で確かめていない内容を事実として断定しない。

## してはいけないこと

- 結果を `src/data/`・`docs/research/`・Revision に登録・転記しない（要約をそのままデータの文にしない）。
- Wikipedia の記述を数値・沿革・事業内容の根拠として引用しない。
- 株価・PER・PBR 等の投資指標を拾って返さない（CLAUDE.md 不変条件 4）。

## 失敗時

CLI は失敗時に `[network|timeout|http|api|format|input] 説明` を stderr に出して終了コード 1 を返す。
ネットワークエラーやタイムアウトは、そのまま報告する（結果を推測で補わない）。
連絡先を User-Agent に含めたい場合は環境変数 `WIKIPEDIA_CONTACT` を設定する。

実装: `src/lib/wikipedia/client.ts`、CLI: `scripts/research/wikipedia.mjs`、テスト: `tests/wikipedia-client.test.ts`。
