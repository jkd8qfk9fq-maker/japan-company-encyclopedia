#!/usr/bin/env python3
"""Regenerate the economic-indicator snapshots (JCE-078, spec §4) from FRED.

Monthly procedure: run this script, review the diff (values change only by new
observations and the publisher's own revisions), and commit. The site never
fetches at runtime; these JSON files are the snapshot.

Rules kept here, not in prose:
- Source is FRED (fred.stlouisfed.org), the public aggregator the spec allows;
  each series' publisher is named in the JSON's source.name and the URL is the
  FRED series page, where the publisher and units can be re-checked.
- Values are FRED's published values, untransformed. Where a daily series is
  held monthly (DFF, DEXJPUS), the conversion is FRED's own monthly average
  (fq=Monthly&fam=avg) and the unit says 月平均.
- Missing observations ("." in the CSV) are dropped, never filled.
- History is the last 10 years, the data book's span.
"""

import csv
import io
import json
import sys
from datetime import date, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

OUT_DIR = Path(__file__).resolve().parents[2] / "src" / "data" / "indicators"
FRED = "https://fred.stlouisfed.org/graph/fredgraph.csv"
UA = {"User-Agent": "Mozilla/5.0 (compatible; jce-indicator-snapshot/1.0)"}

# id, FRED series, name, source name, unit, frequency, extra query
SERIES = [
    (
        "japan-real-gdp",
        "JPNRGDPEXP",
        "実質GDP（日本）",
        "内閣府 国民経済計算（FRED収録）",
        "10億円（2015年連鎖価格・季節調整済）",
        "quarterly",
        "",
    ),
    # japan-cpi (CPALTT01JPN657N) is NOT in the set: on 2026-11-21 FRED answered
    # 404/timeout for the series on re-check, so its values could not be verified.
    # Add it back only after a fetch verifies end to end.
    (
        "japan-unemployment-rate",
        "LRUNTTTTJPM156S",
        "完全失業率（日本）",
        "OECD（原資料: 総務省統計局、FRED収録）",
        "％（季節調整済）",
        "monthly",
        "",
    ),
    (
        "us-real-gdp",
        "GDPC1",
        "実質GDP（米国）",
        "米国経済分析局 BEA（FRED収録）",
        "10億ドル（2017年連鎖価格・季節調整済年率）",
        "quarterly",
        "",
    ),
    (
        "us-cpi",
        "CPIAUCSL",
        "消費者物価指数（米国）",
        "米国労働統計局 BLS（FRED収録）",
        "指数（1982–1984年=100・季節調整済）",
        "monthly",
        "",
    ),
    (
        "us-nonfarm-payroll",
        "PAYEMS",
        "非農業部門雇用者数（米国）",
        "米国労働統計局 BLS（FRED収録）",
        "千人（季節調整済）",
        "monthly",
        "",
    ),
    (
        "us-federal-funds-rate",
        "DFF",
        "FFレート（米国・実効）",
        "米国連邦準備制度理事会（FRED収録）",
        "％（月平均）",
        "monthly",
        "&fq=Monthly&fam=avg",
    ),
    (
        "usd-jpy",
        "DEXJPUS",
        "ドル円相場",
        "米国連邦準備制度理事会 H.10（FRED収録）",
        "円（1ドルあたり・月平均）",
        "monthly",
        "&fq=Monthly&fam=avg",
    ),
]


def fetch(series_id: str, extra: str, since: str) -> list[dict]:
    url = f"{FRED}?id={series_id}&cosd={since}{extra}"
    text = None
    last_error: Exception | None = None
    # curl rather than urllib: FRED's CSV generation can take well over a minute for a
    # ten-year daily-derived series, and curl rides out the stall that urllib's read
    # timeout does not (observed 2026-11-21, when this script was first run).
    import subprocess
    import time

    for attempt in range(3):
        try:
            result = subprocess.run(
                ["curl", "-s", "--fail", "--max-time", "180", "-H", f"User-Agent: {UA['User-Agent']}", url],
                capture_output=True,
                text=True,
                timeout=200,
            )
            if result.returncode != 0:
                raise RuntimeError(f"curl exited {result.returncode}: {result.stderr.strip()[:200]}")
            text = result.stdout
            break
        except Exception as error:  # FRED occasionally stalls or bot-checks; retry before giving up.
            last_error = error
            time.sleep(5 * (attempt + 1))
    if text is None:
        raise SystemExit(f"{series_id}: fetch failed after retries: {last_error}")
    if "<html" in text[:200].lower():
        raise SystemExit(f"{series_id}: FRED returned an HTML challenge instead of CSV — retry later")
    rows = list(csv.reader(io.StringIO(text)))
    observations = []
    for row in rows[1:]:
        if len(row) != 2 or row[1].strip() in ("", "."):
            continue
        observations.append({"date": row[0].strip(), "value": float(row[1])})
    observations.sort(key=lambda o: o["date"])
    if len(observations) < 24:
        raise SystemExit(f"{series_id}: only {len(observations)} observations — refusing to write")
    return observations


def main() -> None:
    from datetime import datetime

    today = datetime.now(ZoneInfo("Asia/Tokyo")).date()
    since = (today - timedelta(days=365 * 10 + 2)).isoformat()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for indicator_id, series_id, name, source_name, unit, frequency, extra in SERIES:
        observations = fetch(series_id, extra, since)
        payload = {
            "id": indicator_id,
            "name": name,
            "source": {"name": source_name, "url": f"https://fred.stlouisfed.org/series/{series_id}"},
            "unit": unit,
            "frequency": frequency,
            "observations": observations,
            "updatedAt": today.isoformat(),
        }
        path = OUT_DIR / f"{indicator_id}.json"
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{indicator_id}: {len(observations)} observations, latest {observations[-1]['date']} = {observations[-1]['value']}")


if __name__ == "__main__":
    sys.exit(main())
