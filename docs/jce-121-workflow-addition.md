# JCE-121 — refresh-financials.yml への追加分（GitHub Web UI で追加する分）

`.github/workflows/` 配下のファイルは GitHub コネクタの push では作成・更新できない
（AGENTS.md の運用メモ）。そのため JCE-121 のうち workflow の変更が必要な部分は、
この文書の差分を **GitHub の Web UI で `.github/workflows/refresh-financials.yml` に
追加して** 初めて有効になる。追加されるまでは未実装であり、実装済みとは言わない。
スクリプト側（取得2本＋検証 `scripts/indicators/validate-indicator-update.py`）は
リポジトリに実装済みで、ローカル実走で確認してある（JCE-121 の決定記録を参照）。

前提の確認（追加しても既存の安全装置と矛盾しないこと）:

- scheduled workflow は refresh-financials.yml の1本のまま（tests/single-detector.test.ts
  の「スケジュールされた workflow は1つだけ」に触れない。新しい schedule は作らず、
  既存の日次実行の中でジョブが週次に自己ゲートする）。
- 新しいジョブは EDINET_API_KEY / EDINETDB_API_KEY を一切使わない（使うのは鍵不要の
  公開された一次情報と FRED の CSV のみ）。single-detector の「鍵の使用箇所」検査にも触れない。
- 登録パイプライン（autopilot 等）も呼ばない。
- 自動マージはしない。AUTO_MERGE_FINANCIALS の対象にもしない。PR は常に人がマージする。

## 追加1: workflow_dispatch の入力を1つ足す

`on.workflow_dispatch.inputs` に、既存の入力と並べて次を追加する。

```yaml
      refresh_indicators:
        description: "Refresh the economic-indicator snapshots now and open a pull request (JCE-121; the schedule runs this weekly, on Mondays JST)"
        required: false
        type: boolean
        default: false
```

## 追加2: indicators ジョブを足す

ファイル末尾（backfill ジョブの後）に次のジョブを追加する。

```yaml
  # JCE-121: weekly refresh of the economic-indicator snapshots (src/data/indicators). The fetchers are deterministic
  # (no AI, no keys): fetch-indicators.py reads the FRED series, fetch-indicators-primary.py reads the Japanese
  # publishers. validate-indicator-update.py is the gate — an anomaly ends the job with its reason in the summary and
  # no pull request. A clean diff becomes a pull request a person merges; this job never merges anything.
  indicators:
    if: github.event_name == 'schedule' || inputs.refresh_indicators
    runs-on: ubuntu-latest
    timeout-minutes: 90
    # What a pull request needs, and nothing else: push a branch, open a pull request.
    permissions:
      contents: write
      pull-requests: write
    env:
      GH_TOKEN: ${{ github.token }}
    steps:
      - uses: actions/checkout@v4

      # The schedule is daily (for EDINET); the indicators run weekly, on Mondays JST. A hand-started run with the
      # refresh_indicators input runs on any day.
      - name: Weekly gate (Mondays JST on the schedule)
        id: gate
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "run=true" >> "$GITHUB_OUTPUT"
          elif [ "$(TZ=Asia/Tokyo date +%u)" = "1" ]; then
            echo "run=true" >> "$GITHUB_OUTPUT"
          else
            echo "run=false" >> "$GITHUB_OUTPUT"
            echo "Not a Monday (JST): the indicator refresh is weekly." >> "$GITHUB_STEP_SUMMARY"
          fi

      - uses: actions/setup-python@v5
        if: steps.gate.outputs.run == 'true'
        with:
          python-version: "3.12"

      - uses: actions/setup-node@v4
        if: steps.gate.outputs.run == 'true'
        with:
          node-version: 24
          cache: npm

      - run: npm ci
        if: steps.gate.outputs.run == 'true'

      # The real-wage source is a legacy .xls; the fetcher converts it with soffice and refuses to guess without it.
      - name: Install LibreOffice (for the real-wage .xls)
        if: steps.gate.outputs.run == 'true'
        run: |
          sudo apt-get update
          sudo apt-get install -y --no-install-recommends libreoffice-calc

      # A fetcher that cannot verify what it downloaded stops with its reason in the log; nothing is proposed.
      - name: Fetch the snapshots from their publishers
        if: steps.gate.outputs.run == 'true'
        run: |
          mkdir -p out
          python3 scripts/indicators/fetch-indicators.py
          python3 scripts/indicators/fetch-indicators-primary.py

      - name: Validate the update against the committed snapshots
        id: validate
        if: steps.gate.outputs.run == 'true'
        run: |
          set +e
          python3 scripts/indicators/validate-indicator-update.py --summary out/indicators-summary.md --json out/indicators-report.json
          echo "exit=$?" >> "$GITHUB_OUTPUT"
          set -e
          cat out/indicators-summary.md >> "$GITHUB_STEP_SUMMARY"

      - name: Stop on an anomaly (no pull request)
        if: steps.gate.outputs.run == 'true' && steps.validate.outputs.exit != '0'
        run: |
          echo "::error::The indicator update failed validation; nothing is proposed (see the job summary for the reason)."
          exit 1

      - name: Verify the repository data
        if: steps.gate.outputs.run == 'true' && steps.validate.outputs.exit == '0'
        run: |
          changed=$(node -e 'console.log(require("./out/indicators-report.json").hasChanges)')
          if [ "$changed" = "true" ]; then
            npx vitest run tests/indicators-primary.test.ts tests/data-integrity.test.ts
          else
            # Only the updatedAt stamps moved: put them back and finish quietly.
            git checkout -- src/data/indicators
            echo "No observation changed; nothing to propose." >> "$GITHUB_STEP_SUMMARY"
          fi

      - name: Refuse changes outside the indicator snapshots
        if: steps.gate.outputs.run == 'true' && steps.validate.outputs.exit == '0'
        run: |
          changed=$(git status --porcelain | awk '{print $2}')
          outside=$(printf '%s\n' "$changed" | grep -v -E '^src/data/indicators/[a-z0-9-]+\.json$' | grep -v '^$' || true)
          if [ -n "$outside" ]; then
            echo "::error::changes outside the allowed data: $outside"
            exit 1
          fi

      - name: Open a pull request
        if: steps.gate.outputs.run == 'true' && steps.validate.outputs.exit == '0'
        run: |
          if [ -z "$(git status --porcelain src/data/indicators)" ]; then
            echo "Nothing verified to propose." >> "$GITHUB_STEP_SUMMARY"
            exit 0
          fi
          day=$(date -u +%Y-%m-%d)
          branch="auto/indicators-${day}-${{ github.run_id }}"
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git switch -c "$branch"
          git add src/data/indicators
          git commit -m "経済指標スナップショットの更新 (${day})" -m "Fetched from the publishers by fetch-indicators.py / fetch-indicators-primary.py and passed through validate-indicator-update.py and the indicator/data-integrity suites. Review the diff before merging."
          git push origin "HEAD:refs/heads/${branch}"
          gh pr create --base main --head "$branch" --title "経済指標の更新（${day}）" --body-file out/indicators-summary.md
```

## 追加後の確認

1. Actions タブで refresh-financials を手動実行し、`refresh_indicators` を有効にする。
   indicators ジョブが走り、異常がなければ PR が作られる（変更がなければ作られない）。
2. 翌月曜 07:00 JST の定期実行で、indicators ジョブがゲートを通って走ること。
3. 前提リポジトリ設定は refresh-financials と同じ（Settings → Actions → General →
   "Allow GitHub Actions to create and approve pull requests"）。新しい secret は不要。
