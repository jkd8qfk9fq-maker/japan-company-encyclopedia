#!/usr/bin/env python3
"""Validate a freshly fetched indicator snapshot set against the committed one.

Companion to fetch-indicators.py (FRED series) and fetch-indicators-primary.py
(Japanese primary sources). Both fetchers are deterministic and already refuse
layouts they cannot verify; this script is the second gate, run after them and
before anything is proposed: it compares the working-tree snapshots in
src/data/indicators/ against a git base (default HEAD) and decides whether the
diff is the kind a publisher's release produces — or the kind that must stop
the run with a reason instead of becoming a pull request (JCE-121).

Anomalies (exit 1, no pull request):
  - a series file is missing, or a new one appears;
  - a series' definition changed (id, name, source, unit, frequency);
  - dates are not strictly increasing, values are not numeric, or the series
    has a gap at its own frequency that the committed series does not have
    (a publisher can skip a period — BLS published no 2025-10 CPI — and a
    hole already in the committed series is the publisher's own; a NEW hole
    is a fetch that lost a row, or a skip a person must confirm);
  - the newest date moved backwards;
  - an observation inside the fetchers' ten-year window disappeared (only
    observations older than the window the fetchers themselves use may drop:
    the primary fetcher keeps calendar years back to TODAY.year - 10, the
    FRED fetcher requests the last 365*10+2 days);
  - a value more than 37 months older than the series' previous newest date
    changed (publishers revise recent periods; a deep-history rewrite is a
    rebase or a broken fetch, and a rebase changes the series definition,
    which a person must decide — JCE-107 never splices base periods);
  - more than 10% of the overlapping values changed at once.

Everything else is reported for the pull request body: new observations and
the publisher's own revisions to recent periods, old value -> new value.
`updatedAt` is ignored: the fetchers stamp it on every run, so a run whose
only diff is the stamp is reported as no change.

Usage:
  python3 scripts/indicators/validate-indicator-update.py \
      [--base HEAD] [--summary out/indicators-summary.md] \
      [--json out/indicators-report.json]

Exit codes: 0 = the diff is fit to propose (possibly empty), 1 = anomaly,
2 = the comparison itself could not be made.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "src" / "data" / "indicators"

# Which fetcher owns each series. The window rule below mirrors each
# fetcher's own history window; changing a series' owner changes what may
# legitimately drop out of the snapshot, so the two lists stay next to the
# fetchers they describe (fetch-indicators.py / fetch-indicators-primary.py).
PRIMARY_IDS = [
    "japan-cpi",
    "japan-cgpi",
    "boj-tankan-di",
    "japan-current-account",
    "japan-industrial-production",
    "japan-job-offers-ratio",
    "japan-real-wages",
    "japan-exports",
]
FRED_IDS = [
    "japan-real-gdp",
    "japan-unemployment-rate",
    "us-real-gdp",
    "us-cpi",
    "us-nonfarm-payroll",
    "us-federal-funds-rate",
    "usd-jpy",
]

DEEP_CHANGE_MONTHS = 37
MASS_CHANGE_RATIO = 0.10


def today_jst() -> date:
    return datetime.now(ZoneInfo("Asia/Tokyo")).date()


def window_cutoff(indicator_id: str, today: date) -> str:
    """Observations dated before this may legitimately drop out of the snapshot."""
    if indicator_id in PRIMARY_IDS:
        return f"{today.year - 10:04d}-01-01"
    return (today - timedelta(days=365 * 10 + 2)).isoformat()


def month_index(day: str) -> int:
    year, month, _ = day.split("-")
    return int(year) * 12 + int(month)


def step_months(frequency: str) -> int:
    return 3 if frequency == "quarterly" else 1


def load_base(base: str, indicator_id: str) -> dict | None:
    result = subprocess.run(
        ["git", "show", f"{base}:src/data/indicators/{indicator_id}.json"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return None
    return json.loads(result.stdout)


def observations_by_date(payload: dict) -> tuple[list[str], dict[str, float]]:
    dates: list[str] = []
    values: dict[str, float] = {}
    for obs in payload.get("observations", []):
        dates.append(obs["date"])
        values[obs["date"]] = obs["value"]
    return dates, values


def validate_series(
    indicator_id: str, old: dict, new: dict, today: date
) -> tuple[list[str], dict]:
    """Return (anomalies, report) for one series."""
    anomalies: list[str] = []
    report: dict = {"added": [], "revised": [], "droppedWindow": 0, "notes": []}

    for field in ("id", "name", "source", "unit", "frequency"):
        if old.get(field) != new.get(field):
            anomalies.append(
                f"definition changed: {field} {old.get(field)!r} -> {new.get(field)!r}"
            )
    if anomalies:
        return anomalies, report

    frequency = new["frequency"]
    old_dates, old_values = observations_by_date(old)
    new_dates, new_values = observations_by_date(new)

    if any(not isinstance(v, (int, float)) for v in new_values.values()):
        anomalies.append("non-numeric value present")
    if new_dates != sorted(new_dates) or len(set(new_dates)) != len(new_dates):
        anomalies.append("dates are not strictly increasing")
        return anomalies, report
    step = step_months(frequency)

    def gap_starts(dates: list[str]) -> set[str]:
        return {
            prev
            for prev, nxt in zip(dates, dates[1:])
            if month_index(nxt) - month_index(prev) != step
        }

    for start in sorted(gap_starts(new_dates) - gap_starts(old_dates)):
        anomalies.append(f"new gap in the series after {start}")
    if not new_dates or not old_dates:
        anomalies.append("empty series")
        return anomalies, report
    if new_dates[-1] < old_dates[-1]:
        anomalies.append(
            f"newest date moved backwards: {old_dates[-1]} -> {new_dates[-1]}"
        )

    cutoff = window_cutoff(indicator_id, today)
    for day in old_dates:
        if day not in new_values:
            if day < cutoff:
                report["droppedWindow"] += 1
            else:
                anomalies.append(f"observation {day} disappeared inside the window")

    old_last = old_dates[-1]
    for day in new_dates:
        if day not in old_values:
            report["added"].append((day, new_values[day]))
            if day < old_last:
                report["notes"].append(f"interior addition at {day}")

    overlap = [day for day in new_dates if day in old_values]
    changed = [day for day in overlap if new_values[day] != old_values[day]]
    for day in changed:
        age = month_index(old_last) - month_index(day)
        if age > DEEP_CHANGE_MONTHS:
            anomalies.append(
                f"value {age} months before the previous newest date changed: "
                f"{day} {old_values[day]} -> {new_values[day]}"
            )
        report["revised"].append((day, old_values[day], new_values[day]))
    if overlap and len(changed) / len(overlap) > MASS_CHANGE_RATIO:
        anomalies.append(
            f"{len(changed)} of {len(overlap)} overlapping values changed "
            f"(over the {int(MASS_CHANGE_RATIO * 100)}% sanity cap)"
        )
    return anomalies, report


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="HEAD")
    parser.add_argument("--summary")
    parser.add_argument("--json")
    args = parser.parse_args()

    today = today_jst()
    all_ids = PRIMARY_IDS + FRED_IDS

    expected_files = {f"{indicator_id}.json" for indicator_id in all_ids}
    present_files = {p.name for p in DATA_DIR.glob("*.json")}
    problems: list[str] = []
    if present_files != expected_files:
        problems.append(
            f"indicator file set changed: missing {sorted(expected_files - present_files)}, "
            f"new {sorted(present_files - expected_files)}"
        )

    series_reports: dict[str, dict] = {}
    anomalies_by_series: dict[str, list[str]] = {}
    for indicator_id in all_ids:
        old = load_base(args.base, indicator_id)
        path = DATA_DIR / f"{indicator_id}.json"
        if old is None:
            problems.append(f"{indicator_id}: not present at {args.base}")
            continue
        if not path.exists():
            problems.append(f"{indicator_id}: file missing in the working tree")
            continue
        new = json.loads(path.read_text(encoding="utf-8"))
        anomalies, report = validate_series(indicator_id, old, new, today)
        series_reports[indicator_id] = report
        if anomalies:
            anomalies_by_series[indicator_id] = anomalies

    anomalies = problems + [
        f"{indicator_id}: {message}"
        for indicator_id, messages in anomalies_by_series.items()
        for message in messages
    ]
    changed_series = {
        indicator_id: report
        for indicator_id, report in series_reports.items()
        if report["added"] or report["revised"]
    }

    lines: list[str] = ["## 経済指標スナップショットの更新", ""]
    if anomalies:
        lines.append("検証で異常が見つかったため、更新は提案されません。")
        lines.append("")
        for message in anomalies:
            lines.append(f"- ⚠️ {message}")
        lines.append("")
    elif not changed_series:
        lines.append("観測値の変更はありませんでした（updatedAt のみ更新）。")
        lines.append("")
    else:
        lines.append(
            "一次情報（日本の公表機関および FRED 収録の原資料）から取得し、"
            "検証スクリプト（validate-indicator-update.py）を通した更新です。"
            "新しい観測と、公表機関自身による直近期間の改定のみを含みます。"
        )
        lines.append("")
        for indicator_id in all_ids:
            report = changed_series.get(indicator_id)
            if report is None:
                continue
            lines.append(f"### {indicator_id}")
            if report["added"]:
                added = report["added"]
                lines.append(
                    f"- 新しい観測: {len(added)}件（最新 {added[-1][0]} = {added[-1][1]}）"
                )
            if report["revised"]:
                revised = report["revised"]
                lines.append(f"- 公表機関による改定: {len(revised)}件")
                for day, before, after in revised[:20]:
                    lines.append(f"  - {day}: {before} → {after}")
                if len(revised) > 20:
                    lines.append(f"  - ほか {len(revised) - 20}件")
            if report["droppedWindow"]:
                lines.append(
                    f"- 取得範囲（10年）から外れた観測: {report['droppedWindow']}件"
                )
            for note in report["notes"]:
                lines.append(f"- 注記: {note}")
            lines.append("")

    summary = "\n".join(lines)
    print(summary)
    if args.summary:
        out = Path(args.summary)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(summary, encoding="utf-8")
    if args.json:
        out = Path(args.json)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(
            json.dumps(
                {
                    "anomalies": anomalies,
                    "hasChanges": bool(changed_series) and not anomalies,
                    "changedSeries": sorted(changed_series),
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
    if problems and not series_reports:
        return 2
    return 1 if anomalies else 0


if __name__ == "__main__":
    sys.exit(main())
