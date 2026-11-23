# JCE-106 — refresh-financials.yml への追加分（GitHub Web UI で追加する分）

`.github/workflows/` 配下のファイルは GitHub コネクタの push では作成・更新できない
（AGENTS.md の運用メモ）。そのため JCE-106 のうち workflow の変更が必要な部分は、
この文書の差分を **GitHub の Web UI で `.github/workflows/refresh-financials.yml` に
追加して** 初めて有効になる。追加されるまでは未実装であり、実装済みとは言わない。

前提の確認（追加しても既存の安全装置と矛盾しないこと）:

- `pipeline/state/` と `pipeline/staging/` は `.gitignore` 済みなので、apply-amendment が
  書く state と staging は `git status` に現れず、「Refuse changes outside the data this
  job may write」には触れない。バッチが書くのは `src/data/companies/*.json` と
  `src/data/revisions/*.json` で、どちらも許可正規表現の範囲内。
- scheduled workflow は refresh-financials.yml の1本だけという単一検知の原則
  （tests/single-detector.test.ts）にも触れない（新しい schedule は作らない）。

## 追加1: 訂正の自動適用を propose ジョブに同梱する

propose ジョブの「Audit new 訂正有価証券報告書 (report only)」ステップの**直後**に、
次のステップを追加する。

```yaml
      # JCE-106: apply the corrections the fixed rule can decide (apply-amendments-auto.mjs).
      # Anything it cannot decide stays held and is named in the report; the audit above stays
      # the record of what arrived. The report is committed with the run (see the PR step).
      - name: Apply corrections the rule can decide (JCE-106)
        id: amendapply
        run: |
          set +e
          node scripts/pipeline/apply-amendments-auto.mjs --apply --limit 20 --report out/amendment-auto-report.json --summary out/amendment-auto-summary.md
          echo "exit=$?" >> "$GITHUB_OUTPUT"
```

あわせて、PR 作成ステップ内のレポートコピーのループを1語だけ広げる
（自動適用の記録を pipeline/runs に残すため）:

```diff
-          for r in interim quarterly amendment; do
+          for r in interim quarterly amendment amendment-auto; do
```

さらに PR 作成ステップの末尾（amendment-summary を summary.md に足す行の隣）に、
自動適用の要約も PR 本文へ足す:

```yaml
          if [ -f out/amendment-auto-summary.md ]; then { echo; cat out/amendment-auto-summary.md; } >> out/summary.md; fi
```

そして「Report companies that failed」ステップに、自動適用の保留を失敗として
表面化させる条件を足す（既存の audit の条件と同じ形）:

```yaml
          if [ "${{ steps.amendapply.outputs.exit }}" != "0" ]; then
            echo "::error::Some corrections were held by the auto-apply rule (see out/amendment-auto-summary.md); they were left unchanged."
            exit 1
          fi
```

注意: detect ジョブには追加しない（detect は読み取り専用が原則）。

## 追加2: statement-details の定期実行

明細（financialStatements）は Step 3 まで手動トランシェのみで、定期実行がない。
propose ジョブの「Apply the verified updates」ステップの**直後**に次を追加すると、
新しい有報で更新された会社の明細が証拠キャッシュの範囲で追随する
（`--bulk` はキャッシュ専用モードで、新規の EDINET 取得はしない）。

```yaml
      # JCE-106: keep the statement details following the annual refresh, from the evidence
      # cache only (no new EDINET downloads in this lane).
      - name: Refresh statement details from the evidence cache
        run: |
          set +e
          node scripts/research/statement-details.mjs --bulk --report out/statement-details-report.json
          echo "statement-details exit=$?"
```

このステップが書く先も `src/data/companies/*.json` のみで、許可範囲の内側。
失敗した会社はレポートに残り、エントリーは変わらない（既存の不採用の原則どおり）。

## 追加後の確認

- tests/refresh-workflow.test.ts が workflow の形を固定しているため、追加したら
  同テストの期待も合わせて更新が必要になる場合がある（特に propose ジョブの
  ステップ構成を読む断言）。追加と同じコミットでテストを実態に合わせること。
- 初回は workflow_dispatch で `propose: true` を付けて手動実行し、PR 本文に
  自動適用の要約が載ることと、保留があればジョブが失敗として表面化することを見る。
